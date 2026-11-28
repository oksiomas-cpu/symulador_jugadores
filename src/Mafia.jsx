// ============================================================
// «Мафия» — пульт ведущего (?mafia=host) и пульт игрока (?mafia).
// Сервер: api/mafia.js · логика: api/_mafiaEngine.js · тексты: src/mafiaTexts.js
// Опрос состояния раз в 2 секунды; после перезагрузки страницы пульт
// возвращается в партию (код и ключ лежат на устройстве).
// ============================================================
import React, { useEffect, useRef, useState } from "react";
import { VISITKA, SPEECHES, GHOST_PHRASES, QUESTION_TOPICS, ROLE_HINTS } from "./mafiaTexts.js";

const C = {
  cream: "#FAF3E6", creamDeep: "#F3E8D2", card: "#FFFFFF",
  ink: "#3D2B1F", inkSoft: "#6B5544",
  gold: "#C9A24B", goldDeep: "#A67C2E", goldSoft: "#EBD9A8",
  raspberry: "#A81B3E", raspberryDeep: "#7E1430",
  emerald: "#16795B", emeraldDeep: "#0F5E47", line: "#E6D6B8", ghost: "#8C8C99",
};
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const ROLE = {
  mafia: { name: "Мафия", icon: "🔫", color: C.raspberry },
  doctor: { name: "Доктор", icon: "🩺", color: C.emerald },
  detective: { name: "Детектив", icon: "🔍", color: C.goldDeep },
  civil: { name: "Мирный", icon: "🏠", color: C.inkSoft },
};
const NEEDS = { 3: 1, 5: 2, 7: 4 };

async function api(payload) {
  try {
    const r = await fetch("/api/mafia", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    return await r.json();
  } catch (e) { return { ok: false, error: "Нет связи — пробуем ещё раз", offline: true }; }
}
const load = (k) => { try { return JSON.parse(localStorage.getItem(k)) || null; } catch (e) { return null; } };
const save = (k, v) => { try { v ? localStorage.setItem(k, JSON.stringify(v)) : localStorage.removeItem(k); } catch (e) { /* приватный режим */ } };

// ---------- общие кусочки ----------
const Page = ({ children }) => (
  <div style={{ minHeight: "100vh", background: C.cream, color: C.ink, fontFamily: SERIF, padding: "18px 14px 60px" }}>
    <div style={{ maxWidth: 560, margin: "0 auto" }}>{children}</div>
  </div>
);
const Card = ({ children, style }) => (
  <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 16, marginBottom: 14, boxShadow: "0 2px 10px rgba(61,43,31,0.06)", ...style }}>{children}</div>
);
const H = ({ children }) => <div style={{ fontSize: 13, letterSpacing: 1, textTransform: "uppercase", color: C.goldDeep, fontWeight: 700, marginBottom: 8 }}>{children}</div>;
function Btn({ children, onClick, disabled, kind = "main", style }) {
  const bg = kind === "main" ? C.raspberry : kind === "ok" ? C.emerald : kind === "soft" ? C.goldSoft : "#fff";
  const color = kind === "soft" || kind === "line" ? C.ink : "#fff";
  return <button onClick={onClick} disabled={disabled} style={{ background: disabled ? "#D8CBB4" : bg, color: disabled ? "#fff" : color, border: kind === "line" ? `1.5px solid ${C.line}` : "none", borderRadius: 12, padding: "13px 16px", fontSize: 16, fontWeight: 700, fontFamily: SERIF, cursor: disabled ? "default" : "pointer", width: "100%", marginTop: 8, ...style }}>{children}</button>;
}
const Empty = () => <div style={{ color: C.inkSoft, fontStyle: "italic" }}>Текст появится позже.</div>;
const List = ({ items }) => items && items.length
  ? <div>{items.map((t, i) => <div key={i} style={{ padding: "8px 0", borderBottom: i < items.length - 1 ? `1px dashed ${C.line}` : "none" }}>{t}</div>)}</div>
  : <Empty />;

// Карточки игроков
function Cards({ players, allowed, picked, onPick, dim = [] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
      {players.map((p) => {
        const ok = allowed.includes(p.id);
        const on = picked === p.id;
        const off = !ok || dim.includes(p.id);
        return (
          <button key={p.id} disabled={!ok} onClick={() => onPick(p.id)} style={{
            padding: "16px 10px", borderRadius: 12, fontFamily: SERIF, fontSize: 16, fontWeight: 700,
            border: on ? `2.5px solid ${C.raspberry}` : `1.5px solid ${C.line}`,
            background: on ? "#FBE9EE" : p.ghost ? "#EEEEF2" : "#fff",
            color: p.ghost ? C.ghost : C.ink, opacity: off && !on ? 0.4 : 1, cursor: ok ? "pointer" : "default",
          }}>{p.ghost ? "👻 " : ""}{p.name}</button>
        );
      })}
    </div>
  );
}

function Queue({ order, idx, players, meId }) {
  const nm = (id) => (players.find((p) => p.id === id) || {}).name || "?";
  const gh = (id) => (players.find((p) => p.id === id) || {}).ghost;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {order.map((id, i) => (
        <span key={id} style={{
          padding: "5px 10px", borderRadius: 20, fontSize: 14,
          background: i === idx ? C.raspberry : i < idx ? C.creamDeep : "#fff",
          color: i === idx ? "#fff" : i < idx ? C.inkSoft : C.ink,
          border: `1px solid ${i === idx ? C.raspberry : C.line}`, fontWeight: id === meId ? 700 : 400,
        }}>{i + 1}. {gh(id) ? "👻 " : ""}{nm(id)}{id === meId ? " (ты)" : ""}</span>
      ))}
    </div>
  );
}

const findQ = (qid) => { for (const t of QUESTION_TOPICS) for (const q of t.questions || []) if (q.id === qid) return { t, q }; return null; };
const nameIn = (players, id) => (players.find((p) => p.id === id) || {}).name || "?";

function HistoryList({ history, players, roles }) {
  const nm = (id) => id ? nameIn(players, id) : "—";
  return (
    <div>
      {history.map((h) => (
        <div key={h.n} style={{ padding: "10px 0", borderBottom: `1px dashed ${C.line}`, fontSize: 15 }}>
          <b>Действие {h.n}</b> (после круга {h.circle || "?"})<br />
          🩺 защита: {nm(h.protect)} · 🔫 выстрел: {nm(h.shot)} · 🔍 подозрение: {nm(h.susp)}<br />
          🗳 город: {h.cityChoice ? nm(h.cityChoice) : (Object.keys(h.votes || {}).length ? "большинства нет" : "голосования не было")}
          {h.revote ? ` (переголосование: ${h.revote.candidates.map(nm).join(" / ")})` : ""}
          {h.eliminated && h.eliminated.length ? <><br />👻 выбыл: {h.eliminated.map((id) => `${nm(id)} — ${ROLE[roles[id]].name}`).join(", ")}</> : null}
        </div>
      ))}
    </div>
  );
}

function ResultPublic({ result, players }) {
  if (!result) return null;
  return (
    <Card>
      <H>Итог действия {result.n}</H>
      <div style={{ fontSize: 17, lineHeight: 1.5 }}>
        {!result.voteHeld ? "🗳 В первом действии голосования нет."
          : result.cityChoice ? <>🗳 Город выбрал: <b>{nameIn(players, result.cityChoice)}</b></>
          : result.tie ? "🗳 После переголосования снова поровну — метки нет."
          : "🗳 Большинства нет — метки нет."}
        <br />
        {result.eliminated.length
          ? result.eliminated.map((e) => <div key={e.id}>👻 Выбывает <b>{e.name}</b> — {ROLE[e.role].icon} {ROLE[e.role].name}</div>)
          : "Никто не выбыл."}
      </div>
    </Card>
  );
}

// ============================================================
// ПУЛЬТ ИГРОКА
// ============================================================
export function MafiaPlayer() {
  const tg = typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user;
  const [conn, setConn] = useState(() => load("mafia_player_v1"));
  const [view, setView] = useState(null);
  const [code, setCode] = useState(() => { try { return new URLSearchParams(window.location.search).get("code") || ""; } catch (e) { return ""; } });
  const [name, setName] = useState(() => (load("mafia_player_v1") || {}).name || (tg && tg.first_name) || "");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [vote, setVote] = useState(null);
  const [target, setTarget] = useState(null);
  const [showRole, setShowRole] = useState(false);
  const [topic, setTopic] = useState(null);
  const [askTo, setAskTo] = useState(null);
  const stamp = useRef("");

  async function join() {
    if (!code.trim() || !name.trim()) { setErr("Введи код игры и своё имя"); return; }
    setBusy(true); setErr("");
    const d = await api({ action: "join", code: code.trim(), name: name.trim() });
    setBusy(false);
    if (!d.ok) { setErr(d.error); return; }
    const c = { code: code.trim(), playerId: d.playerId, key: d.key, name: name.trim() };
    save("mafia_player_v1", c); setConn(c);
  }
  function leave() { save("mafia_player_v1", null); setConn(null); setView(null); }
  const send = async (payload) => {
    const d = await api({ ...payload, code: conn.code, playerId: conn.playerId, key: conn.key });
    if (d.view) setView(d.view);
    if (!d.ok && !d.offline) setErr(d.error || ""); else setErr("");
    return d;
  };

  useEffect(() => {
    if (!conn) return;
    let dead = false;
    const tick = async () => {
      const d = await api({ action: "state", code: conn.code, playerId: conn.playerId, key: conn.key });
      if (dead) return;
      if (d.ok) setView(d.view);
      else if (d.gone || /не найдена/.test(d.error || "")) leave();
    };
    tick();
    const t = setInterval(tick, 2000);
    return () => { dead = true; clearInterval(t); };
  }, [conn && conn.code, conn && conn.playerId]);

  // новый этап → сброс выбора
  useEffect(() => {
    if (!view) return;
    const s = `${view.stage}:${view.actionNo}:${view.circle}:${view.speakerIdx}`;
    if (s !== stamp.current) {
      stamp.current = s;
      setVote(view.myAct ? view.myAct.vote : null); setTarget(view.myAct ? view.myAct.target : null);
      setAskTo(null); setTopic(null);
    }
  }, [view && view.stage, view && view.actionNo, view && view.circle, view && view.speakerIdx]);

  if (!conn) {
    return (
      <Page>
        <h1 style={{ fontSize: 30, margin: "10px 0 16px" }}>🎭 Мафия</h1>
        <Card>
          <H>Вход в партию</H>
          <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" placeholder="Код игры" style={inp} />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Твоё имя" style={inp} />
          {err && <div style={{ color: C.raspberry, marginTop: 8 }}>{err}</div>}
          <Btn onClick={join} disabled={busy}>Войти</Btn>
        </Card>
      </Page>
    );
  }
  if (!view) return <Page><Card>Подключаемся к партии {conn.code}…</Card></Page>;

  const me = view.me || {};
  const players = view.players || [];
  const role = me.role;
  const speakerId = view.order ? view.order[view.speakerIdx] : null;
  const myTurn = view.stage === "circle" && speakerId === me.id;

  const header = (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div><div style={{ fontSize: 24, fontWeight: 700 }}>🎭 Мафия</div><div style={{ fontSize: 13, color: C.inkSoft }}>партия {view.code} · {me.name}</div></div>
      {role && view.stage !== "end" && (
        <button onClick={() => setShowRole(!showRole)} style={{ border: `1px solid ${C.line}`, background: "#fff", borderRadius: 20, padding: "6px 12px", fontFamily: SERIF, fontSize: 14 }}>
          {showRole ? `${ROLE[role].icon} ${ROLE[role].name}` : "👁 моя роль"}
        </button>
      )}
    </div>
  );
  const counters = role && view.stage !== "end" && (
    <div style={{ display: "flex", gap: 8, marginBottom: 12, fontSize: 15 }}>
      <span style={pill}>💥 выстрелы: <b>{me.B}</b></span>
      <span style={pill}>🔍 подозрения: <b>{me.P}</b></span>
      {me.ghost && <span style={{ ...pill, background: "#EEEEF2" }}>👻 фантом</span>}
    </div>
  );
  const errBox = err ? <div style={{ color: C.raspberry, margin: "8px 0" }}>{err}</div> : null;

  // ---- лобби
  if (view.stage === "lobby") return (
    <Page>{header}
      <Card><H>Ты в комнате</H>Вошли: {players.map((p) => p.name).join(", ")} ({players.length})<br /><span style={{ color: C.inkSoft }}>Ждём ведущего.</span></Card>
      <Btn kind="line" onClick={leave}>Выйти</Btn>
    </Page>
  );

  // ---- конец
  if (view.stage === "end") return (
    <Page>{header}
      <Card style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40 }}>{view.end.winner === "mafia" ? "🔫" : "🏙"}</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{view.end.winner === "mafia" ? "Победила мафия" : "Победил город"}</div>
        <div style={{ color: C.inkSoft }}>{view.end.reason}</div>
      </Card>
      <ResultPublic result={view.result} players={players} />
      <Card><H>Роли</H>{players.map((p) => <div key={p.id}>{ROLE[view.roles[p.id]].icon} <b>{p.name}</b> — {ROLE[view.roles[p.id]].name} · 💥{view.B[p.id]} 🔍{view.P[p.id]}</div>)}</Card>
      <Card><H>История меток</H><HistoryList history={view.history} players={players} roles={view.roles} /></Card>
      <Btn kind="line" onClick={leave}>Выйти</Btn>
    </Page>
  );

  // ---- Ранжир: своя роль
  if (view.stage === "roles") return (
    <Page>{header}
      <Card style={{ textAlign: "center" }}>
        <H>Ранжир · твоя роль</H>
        <div style={{ fontSize: 56 }}>{ROLE[role].icon}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: ROLE[role].color }}>{ROLE[role].name}</div>
        <div style={{ marginTop: 10, color: C.inkSoft }}>{ROLE_HINTS[role]}</div>
        <div style={{ marginTop: 10, fontSize: 14, color: C.inkSoft }}>Роль видишь только ты. Мафия побеждает, если выбьет {NEEDS[view.size]} из {view.size}.</div>
      </Card>
    </Page>
  );

  // ---- круг выступлений
  if (view.stage === "circle") {
    const speech = view.circle === 1 ? VISITKA : me.ghost ? GHOST_PHRASES : ((SPEECHES[role] || {})[view.circle >= 3 ? 3 : 2] || []);
    const title = view.circle === 1 ? "Твоя визитка" : me.ghost ? "Фразы фантома (только о себе)" : view.circle === 2 ? "«Я не мафия, потому что…»" : "Твоё выступление";
    const canAsk = myTurn && view.circle >= 2 && !me.ghost && (view.askTargets || []).length > 0;
    const topicObj = QUESTION_TOPICS.find((t) => t.id === topic);
    return (
      <Page>{header}{counters}
        {view.result && view.circle >= 3 && <ResultPublic result={view.result} players={players} />}
        <Card>
          <H>Круг {view.circle}{view.circle === 1 ? " · визитка" : view.circle === 2 ? " · «я не мафия»" : " · вопросы"}</H>
          <Queue order={view.order} idx={view.speakerIdx} players={players} meId={me.id} />
          <div style={{ marginTop: 12, fontSize: 18, fontWeight: 700, color: myTurn ? C.raspberry : C.ink }}>
            {view.speakerIdx >= view.order.length ? "Круг закончен — ждём ведущего." : myTurn ? "🎤 Твоя очередь!" : `Сейчас говорит: ${nameIn(players, speakerId)}`}
          </div>
        </Card>
        {(view.askedMe || []).map((a) => {
          const f = findQ(a.qid);
          return (
            <Card key={a.from} style={{ borderColor: C.gold }}>
              <H>Тебя спрашивает {nameIn(players, a.from)}</H>
              {f ? <>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{f.q.es}</div>
                {f.q.ru && <div style={{ color: C.inkSoft }}>{f.q.ru}</div>}
                <div style={{ marginTop: 10 }}><b>✅ Правда:</b><List items={f.q.truth} /></div>
                <div style={{ marginTop: 10 }}><b>🎭 Ложь:</b><List items={f.q.lie} /></div>
              </> : <div>Вопрос — устно. Отвечай правду или ложь.</div>}
            </Card>
          );
        })}
        <Card><H>{title}</H><List items={speech} /></Card>
        {myTurn && view.circle >= 2 && !me.ghost && (
          <Card style={{ borderColor: C.raspberry }}>
            <H>Задай вопрос</H>
            {view.myAsk ? <div>✓ Ты спросил(а): <b>{nameIn(players, view.myAsk.to)}</b>{findQ(view.myAsk.qid) ? ` — ${findQ(view.myAsk.qid).q.es}` : ""}</div> : canAsk ? <>
              <div style={{ marginBottom: 8, color: C.inkSoft }}>Кого спросить (погашены те, кто уже отвечал в этом круге):</div>
              <Cards players={players.filter((p) => p.id !== me.id && !p.ghost)} allowed={view.askTargets} picked={askTo} onPick={setAskTo} />
              {QUESTION_TOPICS.length > 0 && <>
                <div style={{ margin: "12px 0 6px", color: C.inkSoft }}>Тема:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {QUESTION_TOPICS.map((t) => <button key={t.id} onClick={() => setTopic(t.id)} style={{ ...chip, background: topic === t.id ? C.goldSoft : "#fff" }}>{t.title}</button>)}
                </div>
                {topicObj && <div style={{ marginTop: 8 }}>
                  {(topicObj.questions || []).map((q) => <Btn key={q.id} kind="line" disabled={!askTo} onClick={() => send({ action: "ask", to: askTo, qid: q.id })} style={{ textAlign: "left", fontWeight: 400 }}>{q.es}{q.ru ? <span style={{ color: C.inkSoft }}> · {q.ru}</span> : null}</Btn>)}
                </div>}
              </>}
              {QUESTION_TOPICS.length === 0 && <Btn disabled={!askTo} onClick={() => send({ action: "ask", to: askTo, qid: "" })}>Спрашиваю (вопрос устно)</Btn>}
            </> : <div>Спросить некого.</div>}
            {errBox}
          </Card>
        )}
      </Page>
    );
  }

  // ---- действие
  if (view.stage === "action") {
    if (me.ghost) return (
      <Page>{header}{counters}
        <Card style={{ textAlign: "center" }}>
          <H>Действие {view.actionNo}</H>
          <div style={{ fontSize: 48 }}>👻</div>
          <Btn kind={view.ghostPressed ? "ok" : "main"} onClick={() => send({ action: "ghost" })}>{view.ghostPressed ? "✓ Я фантом" : "Я фантом"}</Btn>
        </Card>
      </Page>
    );
    const sent = view.myAct;
    const others = players.filter((p) => !p.ghost);
    const ready = (!view.voteOpen || vote) && target;
    return (
      <Page>{header}{counters}
        <Card>
          <H>Действие {view.actionNo} · опусти глаза в пульт</H>
          {view.voteOpen ? <>
            <div style={{ fontWeight: 700, margin: "4px 0 8px" }}>Шаг 1 · голос: кого подозревает город?</div>
            <Cards players={others} allowed={view.voteTargets || []} picked={vote} onPick={setVote} />
          </> : <div style={{ color: C.inkSoft }}>В первом действии голосования нет.</div>}
          <div style={{ fontWeight: 700, margin: "16px 0 8px" }}>Шаг {view.voteOpen ? 2 : 1} · тайный ход</div>
          <Cards players={others} allowed={view.secretTargets || []} picked={target} onPick={setTarget} />
          {showRole && <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 8 }}>{ROLE_HINTS[role]}</div>}
          {errBox}
          <Btn kind={sent && sent.target === target && sent.vote === (view.voteOpen ? vote : null) ? "ok" : "main"} disabled={!ready} onClick={() => send({ action: "act", vote, target })}>
            {sent && sent.target === target && sent.vote === (view.voteOpen ? vote : null) ? "✓ Принято — ждём остальных" : "Готово"}
          </Btn>
        </Card>
      </Page>
    );
  }

  // ---- переголосование
  if (view.stage === "revote") {
    if (me.ghost) return <Page>{header}{counters}<Card>Город переголосовывает между: {view.revote.candidates.map((id) => nameIn(players, id)).join(" / ")}.</Card></Page>;
    return (
      <Page>{header}{counters}
        <Card>
          <H>Переголосование</H>
          <div style={{ marginBottom: 10 }}>Поровну голосов у: <b>{view.revote.candidates.map((id) => nameIn(players, id)).join(", ")}</b>. Каждый скажет одну фразу в свою защиту, потом голосуем только между ними.</div>
          <Cards players={players.filter((p) => view.revote.candidates.includes(p.id))} allowed={view.revote.candidates.filter((id) => id !== me.id)} picked={view.myRevote || vote} onPick={(id) => { setVote(id); send({ action: "revote", target: id }); }} />
          {view.myRevote && <div style={{ marginTop: 8, color: C.emerald }}>✓ Голос принят</div>}
          {errBox}
        </Card>
      </Page>
    );
  }

  // ---- итог
  if (view.stage === "result") return (
    <Page>{header}{counters}
      {me.shotLast && <Card style={{ borderColor: C.raspberry, background: "#FBE9EE" }}><b>💥 В тебя выстрелили.</b> Можешь просить помощи — или молчать.</Card>}
      {me.suspectedLast && <Card style={{ borderColor: C.gold, background: "#FFF6E0" }}><b>🔍 Тебя подозревают.</b></Card>}
      {me.ghost && <Card style={{ background: "#EEEEF2" }}><b>👻 Ты фантом.</b> Ты говоришь дальше, но только о себе и без указаний на мафию.</Card>}
      <ResultPublic result={view.result} players={players} />
      <Card style={{ color: C.inkSoft }}>Ждём ведущего: следующий круг.</Card>
    </Page>
  );

  return <Page>{header}<Card>Ждём ведущего…</Card></Page>;
}

// ============================================================
// ПУЛЬТ ВЕДУЩЕГО
// ============================================================
export function MafiaHost() {
  const [conn, setConn] = useState(() => load("mafia_host_v1"));
  const [h, setH] = useState(null);
  const [players, setPlayers] = useState([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true); setErr("");
    const d = await api({ action: "create" });
    setBusy(false);
    if (!d.ok) { setErr(d.error); return; }
    const c = { code: d.host.code, hostKey: d.hostKey };
    save("mafia_host_v1", c); setConn(c); setH(d.host); setPlayers([]);
  }
  function exit() { save("mafia_host_v1", null); setConn(null); setH(null); }
  async function cmdH(action, extra = {}) {
    setBusy(true);
    const d = await api({ action, code: conn.code, hostKey: conn.hostKey, ...extra });
    setBusy(false);
    if (d.host) { setH(d.host); setPlayers(d.players || []); }
    setErr(d.ok ? "" : (d.error || ""));
  }

  useEffect(() => {
    if (!conn) return;
    let dead = false;
    const tick = async () => {
      const d = await api({ action: "state", code: conn.code, hostKey: conn.hostKey });
      if (dead) return;
      if (d.host) { setH(d.host); setPlayers(d.players || []); }
      else if (/не найдена/.test(d.error || "")) exit();
    };
    tick();
    const t = setInterval(tick, 2000);
    return () => { dead = true; clearInterval(t); };
  }, [conn && conn.code]);

  if (!conn) return (
    <Page>
      <h1 style={{ fontSize: 30, margin: "10px 0 16px" }}>🎭 Мафия · ведущий</h1>
      <Card><div style={{ marginBottom: 8 }}>Составы: 3, 5 или 7 игроков.</div><Btn onClick={create} disabled={busy}>Создать партию</Btn>{err && <div style={{ color: C.raspberry }}>{err}</div>}</Card>
    </Page>
  );
  if (!h) return <Page><Card>Загружаем партию {conn.code}…</Card></Page>;

  const pl = h.stage === "lobby" ? players : h.players;
  const nm = (id) => nameIn(pl, id);
  const roleTag = (id) => h.roles[id] ? `${ROLE[h.roles[id]].icon} ${ROLE[h.roles[id]].name}` : "";
  const ghost = (id) => (h.ghosts || []).includes(id);
  const link = `${window.location.origin}/?mafia&code=${h.code}`;
  const errBox = err ? <div style={{ color: C.raspberry, margin: "8px 0" }}>{err}</div> : null;

  const top = (
    <Card style={{ textAlign: "center" }}>
      <div style={{ fontSize: 14, color: C.inkSoft }}>🎭 Мафия · код партии</div>
      <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: 6 }}>{h.code}</div>
      <div style={{ fontSize: 14, color: C.inkSoft }}>
        {h.stage === "lobby" ? "Лобби" : h.stage === "circle" ? `Круг ${h.circle}` : h.stage === "roles" ? "Ранжир" : h.stage === "action" ? `Действие ${h.actionNo}` : h.stage === "revote" ? "Переголосование" : h.stage === "result" ? `Итог действия ${h.actionNo}` : "Конец"}
        {h.size ? ` · ${h.size} игроков · мафии нужно выбить ${h.mafiaNeeds}` : ""}
      </div>
    </Card>
  );
  const table = h.size > 0 && Object.keys(h.roles).length > 0 && (
    <Card>
      <H>Все роли и метки (видишь только ты)</H>
      {h.players.map((p) => (
        <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: ghost(p.id) ? C.ghost : C.ink }}>
          <span>{ghost(p.id) ? "👻 " : ""}<b>{p.name}</b> · {roleTag(p.id)}</span>
          <span>💥{h.B[p.id]} 🔍{h.P[p.id]}</span>
        </div>
      ))}
    </Card>
  );

  let body = null;
  if (h.stage === "lobby") {
    const n = pl.length;
    body = <>
      <Card>
        <H>Игроки вошли: {n}</H>
        <div style={{ fontSize: 14, color: C.inkSoft, marginBottom: 8 }}>Ссылка для игроков: <b>{link}</b></div>
        {pl.map((p) => <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}><span>{p.name}</span><button onClick={() => cmdH("kick", { playerId: p.id })} style={chip}>✕ убрать</button></div>)}
        {errBox}
        <Btn onClick={() => cmdH("start")} disabled={busy || ![3, 5, 7].includes(n)}>{[3, 5, 7].includes(n) ? "Начать · круг 1 (визитки)" : "Нужно 3, 5 или 7 игроков"}</Btn>
      </Card>
    </>;
  } else if (h.stage === "circle") {
    const sp = h.order[h.speakerIdx];
    body = <>
      <Card>
        <H>Круг {h.circle} · очередь</H>
        <Queue order={h.order} idx={h.speakerIdx} players={h.players.map((p) => ({ ...p, ghost: ghost(p.id) }))} />
        <div style={{ marginTop: 10, fontSize: 18, fontWeight: 700 }}>{h.circleDone ? "Все выступили." : `Говорит: ${nm(sp)}${h.roles[sp] ? ` (${roleTag(sp)})` : ""}`}</div>
        {Object.keys(h.asks).length > 0 && <div style={{ marginTop: 10 }}>{Object.keys(h.asks).map((a) => {
          const f = findQ(h.asks[a].qid);
          return <div key={a} style={{ fontSize: 15 }}>❓ {nm(a)} → {nm(h.asks[a].to)}{f ? `: ${f.q.es}` : " (устно)"}</div>;
        })}</div>}
        {errBox}
        {!h.circleDone && <Btn onClick={() => cmdH("next")} disabled={busy}>Следующий ▶</Btn>}
        {h.circleDone && h.circle === 1 && <Btn onClick={() => cmdH("deal")} disabled={busy}>🎲 Ранжир — раздать роли</Btn>}
        {h.circleDone && h.circle >= 2 && <Btn onClick={() => cmdH("act_start")} disabled={busy}>Действие {h.actionNo + 1} ▶</Btn>}
      </Card>
    </>;
  } else if (h.stage === "roles") {
    body = <Card><H>Роли разосланы на пульты</H><div>Каждый видит только свою роль.</div><Btn onClick={() => cmdH("circle")} disabled={busy}>Круг 2 · «я не мафия» ▶</Btn></Card>;
  } else if (h.stage === "action" || h.stage === "revote") {
    const live = h.alive;
    const done = live.length - h.pending.length;
    body = <Card>
      <H>{h.stage === "action" ? `Действие ${h.actionNo}` : "Переголосование"} · нажали {done} из {live.length}</H>
      {h.stage === "revote" && <div style={{ marginBottom: 8 }}>Лидеры поровну: <b>{h.revote.candidates.map(nm).join(", ")}</b> — каждый говорит одну фразу в защиту.</div>}
      {live.map((id) => {
        const a = h.acts[id];
        return <div key={id} style={{ padding: "4px 0", fontSize: 15 }}>
          {h.pending.includes(id) ? "⏳" : "✅"} <b>{nm(id)}</b> {roleTag(id)}
          {a && <span style={{ color: C.inkSoft }}> · {a.vote ? `голос: ${nm(a.vote)} · ` : ""}{h.roles[id] === "civil" ? "готово" : `ход: ${nm(a.target)}`}</span>}
          {h.stage === "revote" && h.revotes[id] && <span style={{ color: C.inkSoft }}> · переголос: {nm(h.revotes[id])}</span>}
        </div>;
      })}
      {(h.ghosts || []).length > 0 && h.stage === "action" && <div style={{ marginTop: 6, color: C.ghost, fontSize: 14 }}>Фантомы: {h.ghosts.map((id) => `${nm(id)}${h.ghostPressed[id] ? " ✓" : ""}`).join(", ")}</div>}
      {errBox}
      <Btn kind="ok" onClick={() => cmdH(h.stage === "action" ? "close" : "close_revote")} disabled={busy || h.pending.length > 0}>Подсчитать итог</Btn>
      <Btn kind="line" onClick={() => cmdH(h.stage === "action" ? "close" : "close_revote", { force: true })} disabled={busy}>Закрыть принудительно (обрыв связи)</Btn>
    </Card>;
  } else if (h.stage === "result" || h.stage === "end") {
    const last = h.history[h.history.length - 1];
    body = <>
      {h.stage === "end" && <Card style={{ textAlign: "center" }}><div style={{ fontSize: 26, fontWeight: 700 }}>{h.end.winner === "mafia" ? "🔫 Победила мафия" : "🏙 Победил город"}</div><div style={{ color: C.inkSoft }}>{h.end.reason}</div></Card>}
      <Card>
        <H>Объяви всем</H>
        <div style={{ fontSize: 17, lineHeight: 1.6 }}>
          {!h.result.voteHeld ? "Голосования не было." : h.result.cityChoice ? <>Город выбрал: <b>{nm(h.result.cityChoice)}</b></> : "Большинства нет — метки нет."}
          {h.result.eliminated.map((e) => <div key={e.id}>👻 Выбывает <b>{e.name}</b> — {ROLE[e.role].name}</div>)}
          {!h.result.eliminated.length && <div>Никто не выбыл.</div>}
        </div>
      </Card>
      {last && <Card><H>Что произошло (только для тебя)</H><HistoryList history={[last]} players={h.players} roles={h.roles} /></Card>}
      {h.stage === "result" && <Btn onClick={() => cmdH("circle")} disabled={busy}>Круг {h.circle + 1} ▶</Btn>}
      {h.stage === "end" && <Card><H>Вся история</H><HistoryList history={h.history} players={h.players} roles={h.roles} /></Card>}
      {h.stage === "end" && <Btn onClick={() => { exit(); }}>Новая партия</Btn>}
    </>;
  }

  return (
    <Page>
      {top}
      {body}
      {h.stage !== "lobby" && table}
      <Btn kind="line" onClick={() => { if (window.confirm("Выйти из партии на этом устройстве?")) exit(); }} style={{ marginTop: 24 }}>Выйти из партии</Btn>
    </Page>
  );
}

const inp = { width: "100%", boxSizing: "border-box", padding: "12px 14px", fontSize: 17, borderRadius: 10, border: `1.5px solid ${C.line}`, fontFamily: SERIF, marginBottom: 10, background: "#fff" };
const pill = { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 20, padding: "5px 10px" };
const chip = { border: `1px solid ${C.line}`, borderRadius: 16, padding: "5px 10px", background: "#fff", fontFamily: SERIF, fontSize: 14, cursor: "pointer" };
