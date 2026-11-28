// ============================================================
// API игры «Мафия» — отдельный файл, существующие игры (api/game.js) не трогает.
// База та же (Upstash Redis через Vercel Storage), ключи свои:
//   mafia:{code}       — состояние партии (JSON). Пишет ТОЛЬКО ведущий.
//   mafia:{code}:pl    — хеш игроков в лобби: id → {id, name, key}
//   mafia:{code}:in    — хеш нажатий игроков (атомарно по полю, без потерь
//                        при одновременных нажатиях):
//                        act:{n}:{pid} · rv:{n}:{pid} · gh:{n}:{pid} · ask:{круг}:{pid}
// Ведущий — по hostKey, игрок — по своему личному key (публичный id ключом не является).
// Логика — api/_mafiaEngine.js.
// ============================================================

import * as M from "./_mafiaEngine.js";

const TTL = 60 * 60 * 12; // 12 часов

function env() {
  return {
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
  };
}

async function cmd(arr) {
  const { url, token } = env();
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(arr),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error);
  return d.result;
}

function flatToObj(flat) {
  const out = {};
  if (Array.isArray(flat)) { for (let i = 0; i < flat.length; i += 2) out[flat[i]] = flat[i + 1]; }
  else if (flat && typeof flat === "object") Object.assign(out, flat);
  return out;
}

const K = (code) => `mafia:${code}`;
async function getGame(code) { const v = await cmd(["GET", K(code)]); return v ? JSON.parse(v) : null; }
async function setGame(g) { await cmd(["SET", K(g.code), JSON.stringify(g), "EX", String(TTL)]); }
async function getPlayers(code) {
  const o = flatToObj(await cmd(["HGETALL", `${K(code)}:pl`]));
  return Object.values(o).map((v) => JSON.parse(v)).sort((a, b) => a.t - b.t);
}
async function getInputs(code) {
  const o = flatToObj(await cmd(["HGETALL", `${K(code)}:in`]));
  Object.keys(o).forEach((k) => { try { o[k] = JSON.parse(o[k]); } catch (e) { /* строка */ } });
  return o;
}
async function putInput(code, field, value) {
  await cmd(["HSET", `${K(code)}:in`, field, JSON.stringify(value)]);
  await cmd(["EXPIRE", `${K(code)}:in`, String(TTL)]);
}
const rid = (n) => Array.from({ length: n }, () => "abcdefghjkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 31)]).join("");

export default async function handler(req, res) {
  try {
    const { url, token } = env();
    if (!url || !token) return res.status(200).json({ ok: false, error: "База не подключена к проекту" });
    const q = req.query || {};
    const body = (req.body && typeof req.body === "object") ? req.body : {};
    const action = body.action || q.action || "state";
    const code = String(body.code || q.code || "").trim();

    // ---------- создать партию (ведущий) ----------
    if (action === "create") {
      let c = "", tries = 0;
      do { c = String(Math.floor(1000 + Math.random() * 9000)); tries++; }
      while (tries < 20 && (await cmd(["EXISTS", K(c)])));
      const g = M.newGame(c, rid(12));
      await setGame(g);
      return res.status(200).json({ ok: true, hostKey: g.hostKey, host: M.hostView(g, {}), players: [] });
    }

    if (!code) return res.status(200).json({ ok: false, error: "Нет кода игры" });
    const g = await getGame(code);
    if (!g) return res.status(200).json({ ok: false, error: "Игра с таким кодом не найдена" });

    // ---------- вход игрока ----------
    if (action === "join") {
      const name = String(body.name || "").trim().slice(0, 24);
      if (!name) return res.status(200).json({ ok: false, error: "Введи имя" });
      if (g.stage !== "lobby") return res.status(200).json({ ok: false, error: "Партия уже началась" });
      const list = await getPlayers(code);
      if (list.some((p) => p.name.toLowerCase() === name.toLowerCase())) return res.status(200).json({ ok: false, error: "Такое имя уже есть — добавь букву" });
      if (list.length >= 7) return res.status(200).json({ ok: false, error: "Комната заполнена (7 игроков)" });
      const p = { id: rid(6), name, key: rid(10), t: Date.now() };
      await cmd(["HSET", `${K(code)}:pl`, p.id, JSON.stringify(p)]);
      await cmd(["EXPIRE", `${K(code)}:pl`, String(TTL)]);
      return res.status(200).json({ ok: true, playerId: p.id, key: p.key });
    }

    // ---------- ведущий ----------
    if (body.hostKey || q.hostKey) {
      if (String(body.hostKey || q.hostKey) !== g.hostKey) return res.status(200).json({ ok: false, error: "Нет доступа ведущего" });
      const inputs = await getInputs(code);
      let r = { ok: true };
      if (action === "kick") {
        if (g.stage !== "lobby") r = { ok: false, error: "Убрать игрока можно только в лобби" };
        else await cmd(["HDEL", `${K(code)}:pl`, String(body.playerId || "")]);
      } else if (action === "start") r = M.startGame(g, await getPlayers(code));
      else if (action === "next") r = M.nextSpeaker(g);
      else if (action === "deal") r = M.deal(g);
      else if (action === "circle") r = M.nextCircle(g);
      else if (action === "act_start") r = M.startAction(g);
      else if (action === "close") r = M.closeAction(g, inputs, !!body.force);
      else if (action === "close_revote") r = M.closeRevote(g, inputs, !!body.force);
      else if (action !== "state") r = { ok: false, error: "Неизвестное действие" };
      if (r.ok && action !== "state" && action !== "kick") await setGame(g);
      const players = g.stage === "lobby" ? (await getPlayers(code)).map(({ id, name }) => ({ id, name })) : g.players;
      return res.status(200).json({ ok: r.ok, error: r.error, host: M.hostView(g, inputs), players });
    }

    // ---------- игрок ----------
    const pid = String(body.playerId || q.playerId || "");
    const key = String(body.key || q.key || "");
    const list = await getPlayers(code);
    const me = list.find((p) => p.id === pid);
    if (!me || me.key !== key) return res.status(200).json({ ok: false, error: "Тебя нет в этой партии", gone: true });

    let r = { ok: true };
    if (action === "act") {
      r = M.checkAct(g, pid, { vote: body.vote, target: body.target });
      if (r.ok) await putInput(code, `act:${g.actionNo}:${pid}`, r.value);
    } else if (action === "revote") {
      r = M.checkRevote(g, pid, String(body.target || ""));
      if (r.ok) await putInput(code, `rv:${g.actionNo}:${pid}`, r.value);
    } else if (action === "ghost") {
      if (g.stage !== "action" || !g.ghosts.includes(pid)) r = { ok: false, error: "Сейчас не нужно" };
      else await putInput(code, `gh:${g.actionNo}:${pid}`, 1);
    } else if (action === "ask") {
      const inputs0 = await getInputs(code);
      const to = String(body.to || "");
      if (!M.askTargets(g, pid, inputs0).includes(to)) r = { ok: false, error: "Этого игрока сейчас спросить нельзя" };
      else await putInput(code, `ask:${g.circle}:${pid}`, { to, qid: String(body.qid || "").slice(0, 40) });
    } else if (action !== "state") r = { ok: false, error: "Неизвестное действие" };

    const inputs = await getInputs(code);
    let view;
    if (g.stage === "lobby") {
      view = { code: g.code, stage: "lobby", players: list.map(({ id, name }) => ({ id, name })), me: { id: pid, name: me.name } };
    } else view = M.playerView(g, pid, inputs);
    return res.status(200).json({ ok: r.ok, error: r.error, view });
  } catch (e) {
    return res.status(200).json({ ok: false, error: "Сбой сервера: " + e.message });
  }
}
