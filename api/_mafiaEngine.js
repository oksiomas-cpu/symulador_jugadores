// ============================================================
// Движок игры «Мафия» (клуб Ciudad) — чистая логика без базы.
// ТЗ: Notion «Игра «Мафия» · ТЗ для автоматизации» (решения Оксаны 28.11.2026).
// Используется сервером api/mafia.js и автопроверкой scripts/test-mafia.mjs.
// Файл с подчёркиванием — Vercel не делает из него отдельный адрес.
//
// Этапы: lobby → circle(1, визитка) → roles (Ранжир) → circle(2) → action
//        → [revote] → result → circle(3+) → action → … → end
// Счётчики: B — выстрелы, P — подозрения.
// Выбит: B ≥ 1 и B + P ≥ 3. Мафия поймана: P(мафия) ≥ 3.
// Мафия побеждает: выбито 1 (3 игрока) / 2 (5) / 4 (7). Предела кругов нет.
// ============================================================

export const SIZES = [3, 5, 7];
export const MAFIA_NEEDS = { 3: 1, 5: 2, 7: 4 };
export const ROLE_NAMES = { mafia: "Мафия", doctor: "Доктор", detective: "Детектив", civil: "Мирный" };

function shuffle(arr, rng) {
  const x = [...arr];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

export function newGame(code, hostKey) {
  return {
    code, hostKey, created: Date.now(),
    stage: "lobby",
    players: [],          // [{id, name}] — фиксируется при старте круга 1
    size: 0,
    roles: {},            // pid → mafia | doctor | detective | civil
    B: {}, P: {},
    ghosts: [],           // pid в порядке выбывания
    circle: 0, order: [], speakerIdx: 0,
    actionNo: 0, lastProtect: null,
    revote: null,         // {candidates:[pid], votes:{pid:target}} — первые голоса
    result: null,         // публичный итог последнего действия
    history: [],          // полная история (раскрывается в конце)
    end: null,            // {winner:"mafia"|"city", reason}
  };
}

const err = (m) => ({ ok: false, error: m });
const isGhost = (g, pid) => g.ghosts.includes(pid);
export const alive = (g) => g.players.filter((p) => !isGhost(g, p.id)).map((p) => p.id);
const nameOf = (g, pid) => { const p = g.players.find((x) => x.id === pid); return p ? p.name : "?"; };
const roleHolder = (g, role) => Object.keys(g.roles).find((pid) => g.roles[pid] === role) || null;

// ---------- ведущий: переходы этапов ----------

export function startGame(g, players, rng = Math.random) {
  if (g.stage !== "lobby") return err("Партия уже идёт");
  if (!SIZES.includes(players.length)) return err(`Нужно 3, 5 или 7 игроков, сейчас ${players.length}`);
  g.players = players.map((p) => ({ id: p.id, name: p.name }));
  g.size = players.length;
  return startCircle(g, rng, true);
}

function startCircle(g, rng, first) {
  g.circle = first ? 1 : g.circle + 1;
  g.order = shuffle(g.players.map((p) => p.id), rng); // все, фантомы тоже говорят
  g.speakerIdx = 0;
  g.stage = "circle";
  return { ok: true };
}

export function nextSpeaker(g) {
  if (g.stage !== "circle") return err("Сейчас не круг выступлений");
  if (g.speakerIdx < g.order.length) g.speakerIdx += 1;
  return { ok: true };
}

export function circleDone(g) { return g.stage === "circle" && g.speakerIdx >= g.order.length; }

// Ранжир: тайная раздача ролей после круга 1
export function deal(g, rng = Math.random) {
  if (g.stage !== "circle" || g.circle !== 1) return err("Ранжир — после круга 1");
  const ids = shuffle(g.players.map((p) => p.id), rng);
  g.roles = {};
  ids.forEach((pid, i) => { g.roles[pid] = i === 0 ? "mafia" : i === 1 ? "doctor" : i === 2 ? "detective" : "civil"; });
  g.players.forEach((p) => { g.B[p.id] = 0; g.P[p.id] = 0; });
  g.stage = "roles";
  return { ok: true };
}

export function nextCircle(g, rng = Math.random) {
  if (g.stage !== "roles" && g.stage !== "result") return err("Новый круг — после Ранжира или итога");
  return startCircle(g, rng, false);
}

export function startAction(g) {
  if (g.stage !== "circle" || g.circle < 2) return err("Действие — после круга 2 и дальше");
  g.actionNo += 1;
  g.revote = null;
  g.stage = "action";
  return { ok: true };
}

// ---------- игроки: что можно нажать ----------

export function voteOpen(g) { return g.actionNo >= 2; } // в первом действии голосования нет

export function secretTargets(g, pid) {
  const role = g.roles[pid];
  const live = alive(g);
  if (role === "mafia" || role === "detective") return live.filter((x) => x !== pid);
  if (role === "doctor") {
    let t = g.actionNo >= 2 ? live : live.filter((x) => x !== pid);
    if (g.size >= 5 && g.lastProtect) t = t.filter((x) => x !== g.lastProtect);
    return t;
  }
  return live; // мирный: тот же экран, любая карточка = «готово»
}

export function voteTargets(g, pid) { return alive(g).filter((x) => x !== pid); }

// payload: {vote?, target}
export function checkAct(g, pid, payload) {
  if (g.stage !== "action") return err("Сейчас не этап действия");
  if (!g.roles[pid]) return err("Ты не в этой партии");
  if (isGhost(g, pid)) return err("Фантом нажимает только «Я фантом»");
  const vote = payload.vote || null, target = payload.target || null;
  if (voteOpen(g)) {
    if (!vote) return err("Сначала голос");
    if (!voteTargets(g, pid).includes(vote)) return err("За этого игрока голосовать нельзя");
  }
  if (!target || !secretTargets(g, pid).includes(target)) return err("Эту карточку выбрать нельзя");
  return { ok: true, value: { vote: voteOpen(g) ? vote : null, target } };
}

export function checkRevote(g, pid, target) {
  if (g.stage !== "revote") return err("Сейчас нет переголосования");
  if (!g.roles[pid] || isGhost(g, pid)) return err("Фантом не голосует");
  if (target === pid) return err("За себя голосовать нельзя");
  if (!g.revote.candidates.includes(target)) return err("Голосуем только между лидерами");
  return { ok: true, value: target };
}

// Кто ещё должен нажать (для «нажали N из M» у ведущего)
export function pending(g, inputs) {
  if (g.stage === "action") {
    const pref = `act:${g.actionNo}:`;
    return alive(g).filter((pid) => !inputs[pref + pid]);
  }
  if (g.stage === "revote") {
    const pref = `rv:${g.actionNo}:`;
    return alive(g).filter((pid) => !inputs[pref + pid] && !onlySelf(g, pid));
  }
  return [];
}
// лидер, у которого единственный другой кандидат — он сам: такого не бывает (кандидатов ≥ 2),
// но голосующий-кандидат выбирает из остальных; если выбирать не из кого — не ждём
function onlySelf(g, pid) { return g.revote.candidates.filter((c) => c !== pid).length === 0; }

// ---------- подсчёт ----------

function tally(votes, among) {
  const cnt = {};
  Object.values(votes).forEach((t) => { if (t && (!among || among.includes(t))) cnt[t] = (cnt[t] || 0) + 1; });
  const max = Math.max(0, ...Object.values(cnt));
  const leaders = Object.keys(cnt).filter((k) => cnt[k] === max);
  return { cnt, max, leaders };
}

// Ведущий закрывает этап действия. force — закрыть, не дожидаясь всех.
export function closeAction(g, inputs, force = false) {
  if (g.stage !== "action") return err("Сейчас не этап действия");
  if (!force && pending(g, inputs).length) return err("Нажали ещё не все");
  const acts = {};
  alive(g).forEach((pid) => { const a = inputs[`act:${g.actionNo}:${pid}`]; if (a) acts[pid] = a; });
  const votes = {};
  if (voteOpen(g)) Object.keys(acts).forEach((pid) => { if (acts[pid].vote) votes[pid] = acts[pid].vote; });
  const t = tally(votes);
  g._acts = acts; g._votes = votes; // хранятся до итога (на время переголосования)
  if (voteOpen(g) && t.max >= 2 && t.leaders.length > 1) {
    g.revote = { candidates: t.leaders, first: t.cnt };
    g.stage = "revote";
    return { ok: true, revote: true };
  }
  return resolve(g, t.max >= 2 && t.leaders.length === 1 ? t.leaders[0] : null, null);
}

export function closeRevote(g, inputs, force = false) {
  if (g.stage !== "revote") return err("Сейчас нет переголосования");
  if (!force && pending(g, inputs).length) return err("Переголосовали ещё не все");
  const rv = {};
  alive(g).forEach((pid) => { const v = inputs[`rv:${g.actionNo}:${pid}`]; if (v) rv[pid] = v; });
  const t = tally(rv, g.revote.candidates);
  return resolve(g, t.max >= 2 && t.leaders.length === 1 ? t.leaders[0] : null, rv);
}

// Строгий порядок раздела 5 ТЗ
function resolve(g, cityChoice, revoteVotes) {
  const acts = g._acts || {}, votes = g._votes || {};
  delete g._acts; delete g._votes;
  const live = alive(g);
  const mafia = roleHolder(g, "mafia"), doctor = roleHolder(g, "doctor"), detective = roleHolder(g, "detective");
  const protect = doctor && live.includes(doctor) && acts[doctor] ? acts[doctor].target : null;
  const shot = mafia && live.includes(mafia) && acts[mafia] ? acts[mafia].target : null;
  const susp = detective && live.includes(detective) && acts[detective] ? acts[detective].target : null;
  const dB = {}, dP = {};
  // 1. защита — защищённый не получает ни B, ни P
  // 2. выстрел
  if (shot && shot !== protect) dB[shot] = (dB[shot] || 0) + 1;
  // 3. подозрение детектива
  if (susp && susp !== protect) dP[susp] = (dP[susp] || 0) + 1;
  // 4. голос города
  if (cityChoice && cityChoice !== protect) dP[cityChoice] = (dP[cityChoice] || 0) + 1;
  Object.keys(dB).forEach((pid) => { g.B[pid] += dB[pid]; });
  Object.keys(dP).forEach((pid) => { g.P[pid] += dP[pid]; });
  if (protect) g.lastProtect = protect; else g.lastProtect = null;
  // 5. выбывание
  const eliminated = live.filter((pid) => g.roles[pid] !== "mafia" && g.B[pid] >= 1 && g.B[pid] + g.P[pid] >= 3);
  eliminated.forEach((pid) => g.ghosts.push(pid));
  // 6–8. победа
  const mafiaWins = g.ghosts.length >= MAFIA_NEEDS[g.size];
  const caught = g.P[mafia] >= 3;
  let end = null;
  if (g.size === 3) {
    if (mafiaWins) end = { winner: "mafia", reason: `Мафия выбила ${g.ghosts.length} из 3` };
    else if (caught) end = { winner: "city", reason: "Мафия поймана: три подозрения" };
  } else {
    if (caught) end = { winner: "city", reason: "Мафия поймана: три подозрения" };
    else if (mafiaWins) end = { winner: "mafia", reason: `Мафия выбила ${g.ghosts.length} из ${g.size}` };
  }
  g.history.push({
    n: g.actionNo, circle: g.circle,
    protect, shot, susp, votes, revote: g.revote ? { candidates: g.revote.candidates, votes: revoteVotes || {} } : null,
    cityChoice, dB, dP, eliminated,
    after: { B: { ...g.B }, P: { ...g.P } },
  });
  g.result = {
    n: g.actionNo,
    voteHeld: voteOpen(g),
    tie: g.revote ? g.revote.candidates : null,
    cityChoice,
    eliminated: eliminated.map((pid) => ({ id: pid, name: nameOf(g, pid), role: g.roles[pid] })),
  };
  g.revote = null;
  g.stage = end ? "end" : "result";
  g.end = end;
  return { ok: true };
}

// ---------- кто что видит (раздел 6 ТЗ) ----------

function publicPlayers(g) {
  return g.players.map((p) => ({ id: p.id, name: p.name, ghost: isGhost(g, p.id) }));
}

function askFor(g, inputs) {
  const out = {};
  const pref = `ask:${g.circle}:`;
  Object.keys(inputs).forEach((k) => { if (k.startsWith(pref)) out[k.slice(pref.length)] = inputs[k]; });
  return out; // asker → {to, qid}
}

export function playerView(g, pid, inputs) {
  const me = g.players.find((p) => p.id === pid);
  const base = {
    code: g.code, stage: g.stage, circle: g.circle, actionNo: g.actionNo, size: g.size,
    players: publicPlayers(g), order: g.order, speakerIdx: g.speakerIdx,
    voteOpen: voteOpen(g),
  };
  if (g.stage === "end") {
    return { ...base, me: me && { id: pid, name: me.name, role: g.roles[pid], ghost: isGhost(g, pid) },
      end: g.end, roles: g.roles, B: g.B, P: g.P, history: g.history.map((h) => histPublic(g, h)), result: g.result };
  }
  const view = { ...base, result: g.result };
  if (me) {
    const last = g.history[g.history.length - 1];
    view.me = {
      id: pid, name: me.name,
      role: g.roles[pid] || null,
      ghost: isGhost(g, pid),
      B: g.B[pid] || 0, P: g.P[pid] || 0,
      // только факт, без источника; защита не показывается
      shotLast: !!(last && last.dB[pid] && g.stage === "result"),
      suspectedLast: !!(last && last.dP[pid] && g.stage === "result"),
    };
    if (g.stage === "action" && g.roles[pid] && !isGhost(g, pid)) {
      view.voteTargets = voteOpen(g) ? voteTargets(g, pid) : [];
      view.secretTargets = secretTargets(g, pid);
      view.myAct = inputs[`act:${g.actionNo}:${pid}`] || null;
    }
    if (g.stage === "action" && isGhost(g, pid)) view.ghostPressed = !!inputs[`gh:${g.actionNo}:${pid}`];
    if (g.stage === "revote") {
      view.revote = { candidates: g.revote.candidates };
      view.myRevote = inputs[`rv:${g.actionNo}:${pid}`] || null;
    }
    if (g.stage === "circle") {
      const asks = askFor(g, inputs);
      view.myAsk = asks[pid] || null;
      view.askedMe = Object.keys(asks).filter((a) => asks[a].to === pid).map((a) => ({ from: a, qid: asks[a].qid }));
      view.answered = Object.values(asks).map((a) => a.to);
      view.askTargets = askTargets(g, pid, inputs);
    }
  }
  return view;
}

function histPublic(g, h) {
  return { n: h.n, protect: h.protect, shot: h.shot, susp: h.susp, votes: h.votes, revote: h.revote,
    cityChoice: h.cityChoice, eliminated: h.eliminated, after: h.after };
}

export function hostView(g, inputs) {
  const acts = {}, rv = {}, gh = {};
  Object.keys(inputs).forEach((k) => {
    const [kind, n, pid] = k.split(":");
    if (Number(n) !== g.actionNo) return;
    if (kind === "act") acts[pid] = inputs[k];
    if (kind === "rv") rv[pid] = inputs[k];
    if (kind === "gh") gh[pid] = true;
  });
  const { hostKey, ...rest } = g;
  return {
    ...rest,
    alive: alive(g),
    pending: pending(g, inputs),
    acts, revotes: rv, ghostPressed: gh,
    asks: g.stage === "circle" ? askFor(g, inputs) : {},
    circleDone: circleDone(g),
    mafiaNeeds: MAFIA_NEEDS[g.size] || null,
  };
}

// Вопрос в круге: говорящий выбирает, кого спросить. Ответившие погашены,
// пока есть непогашенные. Фантом вопросов не задаёт и вопросов не получает.
export function askTargets(g, pid, inputs) {
  if (g.stage !== "circle" || g.circle < 2) return [];
  if (g.order[g.speakerIdx] !== pid || isGhost(g, pid)) return [];
  const asks = askFor(g, inputs);
  const answered = Object.values(asks).map((a) => a.to);
  const others = alive(g).filter((x) => x !== pid);
  const fresh = others.filter((x) => !answered.includes(x));
  return fresh.length ? fresh : others;
}
