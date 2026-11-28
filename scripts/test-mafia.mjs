/* ============================================================
   АВТОПРОВЕРКА · «Мафия» (раздел 9 ТЗ)
   1) Сценарии: доктор защитил цель мафии; выстрел + подозрение + голос
      на одном мирном; убит детектив; убит доктор; голосование без
      большинства; ничья → переголосование; мафия поймана; победа мафии
      по числу выбывших; одновременная поимка и выбывание (3 vs 5/7).
   2) 3000 случайных партий на каждый состав 3/5/7 до конца:
      ни одна не кончается раньше 3-го круга; экран игрока не
      показывает чужую роль, источник метки и защиту.
   Запуск: npm run test:mafia (входит в сборку).
   ============================================================ */

import * as M from "../api/_mafiaEngine.js";

const fails = [];
const bad = (m) => { fails.push(m); };
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: получили ${JSON.stringify(a)}, ждали ${JSON.stringify(b)}`); };

// детерминированный генератор для повторяемости
function rngFrom(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

function setup(n, seed = 1) {
  const g = M.newGame("1234", "hk");
  const players = Array.from({ length: n }, (_, i) => ({ id: `p${i}`, name: `Игрок${i}` }));
  const rng = rngFrom(seed);
  M.startGame(g, players, rng);
  while (!M.circleDone(g)) M.nextSpeaker(g);
  M.deal(g, rng);
  M.nextCircle(g, rng); // круг 2
  while (!M.circleDone(g)) M.nextSpeaker(g);
  return { g, rng };
}
const who = (g, role) => Object.keys(g.roles).find((p) => g.roles[p] === role);
const civils = (g) => Object.keys(g.roles).filter((p) => g.roles[p] === "civil");

// одно действие: acts = {pid: {vote, target}}; остальные живые жмут «готово» на первую допустимую цель
function act(g, acts, rng, revote) {
  const r = M.startAction(g); if (!r.ok) throw new Error(r.error);
  const inputs = {};
  for (const pid of M.alive(g)) {
    let a = acts[pid] || {};
    const vt = M.voteTargets(g, pid), st = M.secretTargets(g, pid);
    const val = { vote: M.voteOpen(g) ? (a.vote || vt[0]) : null, target: a.target || st[0] };
    const c = M.checkAct(g, pid, val);
    if (!c.ok) throw new Error(`${pid}: ${c.error} ${JSON.stringify(val)}`);
    inputs[`act:${g.actionNo}:${pid}`] = c.value;
  }
  const res = M.closeAction(g, inputs);
  if (!res.ok) throw new Error(res.error);
  if (g.stage === "revote") {
    for (const pid of M.alive(g)) {
      const pick = (revote && revote[pid]) || g.revote.candidates.find((c) => c !== pid);
      const c = M.checkRevote(g, pid, pick);
      if (!c.ok) throw new Error(`revote ${pid}: ${c.error}`);
      inputs[`rv:${g.actionNo}:${pid}`] = c.value;
    }
    M.closeRevote(g, inputs);
  }
  if (g.stage === "result") { M.nextCircle(g, rng); while (!M.circleDone(g)) M.nextSpeaker(g); }
  return inputs;
}

console.log("\n🎭 Мафия · автопроверка\n");

/* ---- 1. Сценарии ---- */
{ // доктор защитил цель мафии
  const { g, rng } = setup(5, 3);
  const maf = who(g, "mafia"), doc = who(g, "doctor"), c = civils(g)[0];
  act(g, { [maf]: { target: c }, [doc]: { target: c } }, rng);
  eq([g.B[c], g.P[c]], [0, 0], "защита снимает выстрел");
}
{ // выстрел + подозрение + голос на одном мирном → выбит
  const { g, rng } = setup(5, 4);
  const maf = who(g, "mafia"), det = who(g, "detective"), doc = who(g, "doctor"), [c, c2] = civils(g);
  act(g, { [doc]: { target: c2 } }, rng); // действие 1, без голосования
  const votes = {}; M.alive(g).forEach((p) => { votes[p] = { vote: p === c ? c2 : c }; });
  votes[maf].target = c; votes[det].target = c; votes[doc].target = maf;
  act(g, votes, rng);
  if (!g.ghosts.includes(c)) bad("мирный с B1+P2 должен выбыть");
  const last = g.history[g.history.length - 1];
  eq(last.eliminated, [c], "объявлен выбывший");
}
{ // убит детектив → дальше подозрений детектива нет
  const { g, rng } = setup(5, 5);
  const maf = who(g, "mafia"), det = who(g, "detective"), doc = who(g, "doctor"), c = civils(g)[0];
  act(g, { [maf]: { target: det }, [doc]: { target: c } }, rng);
  const v = {}; M.alive(g).forEach((p) => { v[p] = { vote: p === det ? c : det }; }); v[maf].target = det; v[doc].target = maf; v[det].target = c;
  act(g, v, rng);
  const v2 = {}; M.alive(g).forEach((p) => { v2[p] = { vote: p === det ? c : det }; }); v2[maf].target = det; v2[doc].target = maf;
  if (!g.ghosts.includes(det)) act(g, v2, rng);
  if (!g.ghosts.includes(det)) bad("детектив должен быть выбит");
  if (g.stage !== "end") {
    const before = JSON.stringify(g.P);
    const v3 = {}; M.alive(g).forEach((p) => { v3[p] = { vote: M.voteTargets(g, p)[0] }; });
    // голоса разбросаны так, что большинства нет → подозрения не должны меняться (детектив мёртв)
    const live = M.alive(g);
    live.forEach((p, i) => { v3[p] = { vote: live[(i + 1) % live.length] }; });
    act(g, v3, rng);
    eq(JSON.stringify(g.P), before, "после смерти детектива и без большинства P не растёт");
  }
}
{ // убит доктор → защиты нет
  const { g, rng } = setup(5, 6);
  const maf = who(g, "mafia"), doc = who(g, "doctor"), det = who(g, "detective");
  g.B[doc] = 1; g.P[doc] = 1;
  act(g, { [maf]: { target: doc }, [doc]: { target: det } }, rng);
  if (!g.ghosts.includes(doc)) bad("доктор с B2+P1 выбыт");
  if (g.stage !== "end") {
    const t = M.alive(g).find((p) => p !== maf);
    const v = {}; M.alive(g).forEach((p) => { v[p] = { vote: M.voteTargets(g, p).find((x) => x !== t) || M.voteTargets(g, p)[0] }; });
    v[maf].target = t;
    const b = g.B[t];
    act(g, v, rng);
    if (g.B[t] !== b + 1) bad("после смерти доктора выстрел проходит");
  }
}
{ // голосование без большинства (все по одному голосу) → метки нет
  const { g, rng } = setup(5, 7);
  act(g, {}, rng);
  const live = M.alive(g); const v = {};
  live.forEach((p, i) => { v[p] = { vote: live[(i + 1) % live.length] }; });
  const doc = who(g, "doctor"), maf = who(g, "mafia"), det = who(g, "detective");
  v[maf].target = det; v[doc].target = det; v[det].target = maf;
  const p0 = { ...g.P };
  act(g, v, rng);
  const last = g.history[g.history.length - 1];
  if (last.cityChoice !== null) bad("при 1-1-1-1-1 метки города нет");
  if (g.P[maf] !== p0[maf] + 1) bad("подозрение детектива засчитано");
}
{ // ничья 2-2 → переголосование
  const { g, rng } = setup(5, 8);
  act(g, {}, rng);
  const [a, b, c, d, e] = g.order.slice().sort();
  const live = [a, b, c, d, e];
  const v = { [a]: { vote: b }, [b]: { vote: a }, [c]: { vote: a }, [d]: { vote: b }, [e]: { vote: a } };
  // e решает: делаем 2-2 через e → c
  v[e] = { vote: c };
  const maf = who(g, "mafia");
  live.forEach((p) => { v[p].target = M.secretTargets(g, p).find((x) => x !== a && x !== b) || M.secretTargets(g, p)[0]; });
  M.startAction(g);
  const inputs = {};
  live.forEach((p) => { const r = M.checkAct(g, p, v[p]); if (!r.ok) throw new Error(r.error); inputs[`act:${g.actionNo}:${p}`] = r.value; });
  M.closeAction(g, inputs);
  if (g.stage !== "revote") bad("2-2 должно дать переголосование");
  else {
    eq(g.revote.candidates.slice().sort(), [a, b].sort(), "кандидаты — лидеры");
    if (M.checkRevote(g, a, a).ok) bad("за себя переголосовать нельзя");
    if (M.checkRevote(g, c, c).ok) bad("голос не за кандидата не принимается");
    // снова поровну: a→b, b→a, c→a, d→b, e — не голосует (force)
    inputs[`rv:${g.actionNo}:${a}`] = b; inputs[`rv:${g.actionNo}:${b}`] = a;
    inputs[`rv:${g.actionNo}:${c}`] = a; inputs[`rv:${g.actionNo}:${d}`] = b;
    if (M.closeRevote(g, inputs).ok) bad("без принудительного закрытия ждём всех");
    M.closeRevote(g, inputs, true);
    if (g.history.at(-1).cityChoice !== null) bad("снова поровну — метки нет");
    if (maf && g.stage === "revote") bad("после переголосования этап закрыт");
  }
}
{ // мафия поймана
  const { g, rng } = setup(7, 9);
  const maf = who(g, "mafia"), det = who(g, "detective");
  act(g, { [det]: { target: maf } }, rng);
  for (let i = 0; i < 3 && g.stage !== "end"; i++) {
    const v = {}; M.alive(g).forEach((p) => { v[p] = { vote: p === maf ? M.voteTargets(g, p)[0] : maf }; });
    v[det].target = maf;
    act(g, v, rng);
  }
  eq(g.end && g.end.winner, "city", "поимка мафии → победа города");
}
for (const n of [3, 5, 7]) { // победа мафии по числу выбывших
  const { g, rng } = setup(n, 10 + n);
  const maf = who(g, "mafia");
  let guard = 0;
  while (g.stage !== "end" && guard++ < 40) {
    const live = M.alive(g).filter((p) => p !== maf);
    const t = live[0];
    const v = {}; M.alive(g).forEach((p) => { v[p] = { vote: p === t ? M.voteTargets(g, p).find((x) => x !== maf) || M.voteTargets(g, p)[0] : t, target: M.secretTargets(g, p).find((x) => x !== t) || M.secretTargets(g, p)[0] }; });
    if (M.alive(g).includes(maf)) v[maf].target = t;
    const det = who(g, "detective"); if (M.alive(g).includes(det) && det !== t) v[det].target = t;
    act(g, v, rng);
  }
  eq(g.end && g.end.winner, "mafia", `${n} игроков: мафия выбивает ${M.MAFIA_NEEDS[n]}`);
  eq(g.ghosts.length, M.MAFIA_NEEDS[n], `${n} игроков: число выбывших`);
}
for (const n of [3, 5]) { // одновременно: поймана и нужное число выбывших
  const { g, rng } = setup(n, 20 + n);
  const maf = who(g, "mafia"), det = who(g, "detective"), doc = who(g, "doctor");
  const victim = n === 3 ? doc : civils(g)[0];
  if (n === 5) { const other = civils(g)[1]; g.ghosts.push(other); g.B[other] = 1; g.P[other] = 2; }
  g.P[maf] = 2; g.B[victim] = 0; g.P[victim] = 2;
  act(g, {}, rng); // действие 1 (без голоса) — меток не даём: все цели безопасны
  // восстановим нужное состояние после действия 1
  g.P[maf] = 2; g.B[victim] = 0; g.P[victim] = 2;
  Object.keys(g.B).forEach((p) => { if (p !== victim && !g.ghosts.includes(p)) { g.B[p] = 0; if (p !== maf) g.P[p] = 0; } });
  g.lastProtect = null;
  const v = {}; M.alive(g).forEach((p) => { v[p] = { vote: p === maf ? M.voteTargets(g, p).find((x) => x !== victim) : maf }; });
  v[maf].target = victim; v[det].target = maf === det ? victim : maf;
  if (M.alive(g).includes(doc) && doc !== victim) v[doc].target = M.secretTargets(g, doc).find((x) => x !== victim && x !== maf);
  if (doc === victim) v[doc].target = M.secretTargets(g, doc).find((x) => x !== maf);
  act(g, v, rng);
  eq(g.end && g.end.winner, n === 3 ? "mafia" : "city", `${n} игроков: одновременная поимка и выбывание`);
}
console.log(`  ✅ сценарии раздела 9 (${fails.length ? "есть ошибки" : "все прошли"})`);

/* ---- 2. Случайные партии ---- */
const stats = {};
for (const n of [3, 5, 7]) {
  stats[n] = { games: 0, mafia: 0, city: 0, maxCircle: 0, sumCircle: 0 };
  for (let s = 0; s < 3000; s++) {
    const rng = rngFrom(1000 * n + s);
    const g = M.newGame("9999", "hk");
    const players = Array.from({ length: n }, (_, i) => ({ id: `q${i}`, name: `Q${i}` }));
    M.startGame(g, players, rng);
    // круг 1: до Ранжира ролей нет ни у кого
    players.forEach((p) => { if (M.playerView(g, p.id, {}).me.role) bad("роль видна до Ранжира"); });
    while (!M.circleDone(g)) M.nextSpeaker(g);
    M.deal(g, rng);
    M.nextCircle(g, rng);
    let guard = 0;
    while (g.stage !== "end" && guard++ < 200) {
      if (g.stage === "circle") {
        // в круге ≥2 говорящий задаёт вопрос
        const inputs = {};
        while (!M.circleDone(g)) {
          const sp = g.order[g.speakerIdx];
          const t = M.askTargets(g, sp, inputs);
          if (t.length) inputs[`ask:${g.circle}:${sp}`] = { to: t[Math.floor(rng() * t.length)], qid: "x" };
          M.nextSpeaker(g);
        }
        M.startAction(g);
      }
      const inputs = {};
      for (const pid of M.alive(g)) {
        const vt = M.voteTargets(g, pid), st = M.secretTargets(g, pid);
        const val = { vote: M.voteOpen(g) ? vt[Math.floor(rng() * vt.length)] : null, target: st[Math.floor(rng() * st.length)] };
        if (rng() < 0.03) continue; // обрыв связи — ведущий закроет принудительно
        const c = M.checkAct(g, pid, val); if (!c.ok) { bad(`случайный ход отклонён: ${c.error}`); continue; }
        inputs[`act:${g.actionNo}:${pid}`] = c.value;
      }
      // экраны игроков во время действия
      for (const p of g.players) checkPrivacy(g, p.id, inputs);
      M.closeAction(g, inputs, true);
      if (g.stage === "revote") {
        for (const pid of M.alive(g)) {
          const opts = g.revote.candidates.filter((c) => c !== pid);
          inputs[`rv:${g.actionNo}:${pid}`] = opts[Math.floor(rng() * opts.length)];
        }
        M.closeRevote(g, inputs);
      }
      for (const p of g.players) checkPrivacy(g, p.id, inputs);
      if (g.stage === "end") break;
      M.nextCircle(g, rng);
    }
    if (g.stage !== "end") { stats[n].unfinished = (stats[n].unfinished || 0) + 1; continue; }
    if (g.circle < 3) bad(`${n} игроков: партия закончилась в круге ${g.circle}`);
    // при победе мафии выбито ровно нужное или больше; при победе города P(мафия) ≥ 3
    const maf = Object.keys(g.roles).find((p) => g.roles[p] === "mafia");
    if (g.end.winner === "city" && g.P[maf] < 3) bad("победа города без поимки");
    if (g.end.winner === "mafia" && g.ghosts.length < M.MAFIA_NEEDS[n]) bad("победа мафии без нужного числа выбывших");
    if (g.ghosts.includes(maf)) bad("мафия не выбывает");
    g.ghosts.forEach((p) => { if (!(g.B[p] >= 1 && g.B[p] + g.P[p] >= 3)) bad("выбыл без условия B≥1 и B+P≥3"); });
    stats[n].games++; stats[n][g.end.winner]++;
    stats[n].maxCircle = Math.max(stats[n].maxCircle, g.circle); stats[n].sumCircle += g.circle;
  }
}

function checkPrivacy(g, pid, inputs) {
  if (g.stage === "end") return;
  const v = M.playerView(g, pid, inputs);
  const s = JSON.stringify(v);
  const myRole = g.roles[pid];
  // чужих ролей нет нигде
  if (v.roles || v.history || v.B || v.P) bad("в экране игрока есть общие роли/история/счётчики");
  for (const other of Object.keys(g.roles)) {
    if (other === pid) continue;
    if (s.includes(`"${other}":"${g.roles[other]}"`)) bad("видна чужая роль");
  }
  if (/protect|shot"|susp"|lastProtect|acts|_acts|_votes|hostKey/.test(s)) bad(`экран игрока выдаёт источник/защиту: ${pid}`);
  if (v.me && v.me.role && v.me.role !== myRole) bad("не та роль");
}

for (const n of [3, 5, 7]) {
  const st = stats[n];
  console.log(`  ✅ ${n} игроков: ${st.games} партий до конца · мафия ${st.mafia} / город ${st.city} · в среднем кругов ${(st.sumCircle / Math.max(1, st.games)).toFixed(1)}, максимум ${st.maxCircle}${st.unfinished ? ` · не закончились за 200 действий: ${st.unfinished}` : ""}`);
}

if (fails.length) {
  console.log(`\n❌ Ошибок: ${fails.length}`);
  [...new Set(fails)].slice(0, 30).forEach((f) => console.log("   • " + f));
  process.exit(1);
}
console.log("\n🎭 Мафия: все проверки пройдены\n");
