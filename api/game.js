// ============================================================
// API живой игры La Cata a Ciegas
// Общий файл для пульта /host и симулятора /player.
// База: ciudad-game (Upstash Redis через Vercel Storage).
// Этап 1: комната + вход игроков + состояние (лобби).
// Этап 2, шаг 3: адресные вопросы детективов (action=ask).
// ============================================================

const TTL = String(60 * 60 * 12); // игра живёт в базе 12 часов

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

async function getGame(code) {
  const v = await cmd(["GET", `game:${code}`]);
  return v ? JSON.parse(v) : null;
}
function setGame(g) {
  return cmd(["SET", `game:${g.code}`, JSON.stringify(g), "EX", TTL]);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const { url, token } = env();
    if (!url || !token) {
      return res.status(200).json({ ok: false, error: "База не подключена к проекту" });
    }

    const q = req.query || {};
    let body = {};
    if (req.method === "POST") {
      body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    }
    const action = body.action || q.action || "state";

    // --- Ведущий создаёт комнату ---
    if (action === "create") {
      let code = "";
      for (let i = 0; i < 10; i++) {
        code = String(Math.floor(1000 + Math.random() * 9000));
        if (!(await getGame(code))) break;
      }
      const g = {
        code,
        phase: "lobby", // lobby | game (этап 2) | final (этап 2)
        createdAt: new Date().toISOString(),
        players: [], // [{id, name}]
        v: 1, // счётчик версий состояния
      };
      await setGame(g);
      return res.status(200).json({ ok: true, game: g });
    }

    // --- Все остальные действия требуют код ---
    const code = String(body.code || q.code || "").trim();
    if (!code) return res.status(200).json({ ok: false, error: "Нет кода игры" });
    const g = await getGame(code);
    if (!g) return res.status(200).json({ ok: false, error: "Игра с таким кодом не найдена" });

    // --- Текущее состояние (опрос раз в 2 сек) ---
    if (action === "state") {
      return res.status(200).json({ ok: true, game: g });
    }

    // --- Игрок входит в комнату ---
    if (action === "join") {
      const name = String(body.name || "").trim().slice(0, 24);
      if (!name) return res.status(200).json({ ok: false, error: "Введи имя" });
      // То же имя = повторный вход (например, обновил страницу)
      let p = g.players.find((x) => x.name.toLowerCase() === name.toLowerCase());
      if (!p) {
        if (g.players.length >= 5) {
          return res.status(200).json({ ok: false, error: "Комната заполнена (5 игроков)" });
        }
        p = { id: Math.random().toString(36).slice(2, 8), name };
        g.players.push(p);
        g.v++;
        await setGame(g);
      }
      return res.status(200).json({ ok: true, playerId: p.id, game: g });
    }

    // --- Ведущий стартует раунд: роли и глагол уезжают на пульты игроков ---
    if (action === "start_round") {
      const n = Number(body.round || 0);
      const verbKey = String(body.verbKey || "");
      const roles = body.roles || {};
      if (!n || !verbKey) return res.status(200).json({ ok: false, error: "Нет номера раунда или глагола" });
      g.phase = "round";
      g.round = {
        n, // номер раунда 1..5
        verbKey, // глагол раунда (его шпаргалку откроют свидетели)
        roles: {
          canon: roles.canon || null, // playerId Свидетеля Канона
          fantasy: roles.fantasy || null, // playerId Свидетеля Фантазии
          detectives: Array.isArray(roles.detectives) ? roles.detectives : [],
        },
        startedAt: new Date().toISOString(),
      };
      g.round.turnIdx = 0; // чей ход: индекс в массиве detectives
      // Кто из свидетелей «A», кто «B» — случайно, чтобы буква не выдавала роль
      const wits = [g.round.roles.canon, g.round.roles.fantasy].filter(Boolean);
      if (Math.random() < 0.5) wits.reverse();
      g.round.witA = wits[0] || null;
      g.round.witB = wits[1] || null;
      g.round.asked = []; // лента вопросов раунда: {by, byName, to, qid, text, ts}
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: g });
    }

    // --- Ведущий передаёт ход следующему детективу ---
    if (action === "set_turn") {
      if (!g.round) return res.status(200).json({ ok: false, error: "Раунд ещё не начался" });
      g.round.turnIdx = Number(body.turnIdx || 0);
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: g });
    }

    // --- Детектив задаёт адресный вопрос (или ведущая фиксирует вопрос голосом) ---
    if (action === "ask") {
      if (!g.round) return res.status(200).json({ ok: false, error: "Раунд ещё не начался" });
      g.round.asked = g.round.asked || [];
      if (g.round.asked.length >= 27) {
        return res.status(200).json({ ok: false, error: "Лимит 27 вопросов исчерпан" });
      }
      const dets = g.round.roles.detectives || [];
      const manual = !!body.manual; // ведущая фиксирует вопрос, заданный голосом
      const pid = manual ? null : String(body.playerId || "");
      let byName = "ведущая";
      if (!manual) {
        if (!dets.includes(pid)) {
          return res.status(200).json({ ok: false, error: "Ты не детектив этого раунда" });
        }
        const activeId = dets[(g.round.turnIdx || 0) % dets.length];
        if (pid !== activeId) {
          return res.status(200).json({ ok: false, error: "Сейчас не твой ход" });
        }
        const p = g.players.find((x) => x.id === pid);
        byName = p ? p.name : "детектив";
      }
      const target = body.target === "A" || body.target === "B" ? body.target : null;
      g.round.asked.push({
        by: pid,
        byName,
        to: target, // "A" | "B" | null (вопрос голосом без адреса)
        qid: body.qid ? String(body.qid) : null, // id вопроса из списка или null (свой/голосом)
        text: String(body.text || "").slice(0, 200),
        ts: Date.now(),
      });
      if (dets.length) g.round.turnIdx = ((g.round.turnIdx || 0) + 1) % dets.length;
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: g });
    }

    // --- Ведущий убирает игрока из лобби (опечатка в имени и т.п.) ---
    if (action === "kick") {
      const pid = String(body.playerId || "");
      g.players = g.players.filter((x) => x.id !== pid);
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: g });
    }

    return res.status(200).json({ ok: false, error: "Неизвестное действие: " + action });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e) });
  }
}
