// ============================================================
// API живой игры La Cata a Ciegas
// Общий файл для пульта /host и симулятора /player.
// База: ciudad-game (Upstash Redis через Vercel Storage).
// Этап 1: комната + вход игроков + состояние (лобби).
// Этап 2, шаг 3: адресные вопросы детективов (action=ask).
// Этап 2, шаг 4: свой вопрос (action=own / approve) + персональные очки g.scores.
// Этап 2, шаг 5: «Готов назвать глагол» — рука (hand), слово от ведущей
// (give_floor), тайное голосование Верю A/B (vote), вердикт ведущей
// (verdict), принудительное завершение раунда (end_round).
// Право первой попытки — у детектива, задавшего вопрос (голосом, без кнопки);
// кнопка «рука» — заявка остальных, слово даёт ведущая.
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

// Тайное голосование: до вскрытия наружу уходит только КТО проголосовал, не ЗА КОГО
function pub(g) {
  if (!g || !g.round || !g.round.votes || g.round.revealed) return g;
  const round = { ...g.round, votedIds: Object.keys(g.round.votes), votes: undefined };
  return { ...g, round };
}

function aliveDets(g) {
  const dets = (g.round && g.round.roles && g.round.roles.detectives) || [];
  const elim = (g.round && g.round.eliminated) || [];
  return dets.filter((d) => !elim.includes(d));
}

// Очередь пропускает выбывших детективов
function fixTurn(g) {
  const dets = (g.round.roles && g.round.roles.detectives) || [];
  if (!dets.length) return;
  const elim = g.round.eliminated || [];
  let i = (g.round.turnIdx || 0) % dets.length;
  for (let k = 0; k < dets.length; k++) {
    if (!elim.includes(dets[i])) break;
    i = (i + 1) % dets.length;
  }
  g.round.turnIdx = i;
}
function advanceTurn(g) {
  const dets = (g.round.roles && g.round.roles.detectives) || [];
  if (!dets.length) return;
  g.round.turnIdx = ((g.round.turnIdx || 0) + 1) % dets.length;
  fixTurn(g);
}

function addPts(g, pid, pts) {
  if (!pid || !pts) return;
  g.scores = g.scores || {};
  g.scores[pid] = g.scores[pid] || { r: 0, g: 0 };
  g.scores[pid].r += pts;
  g.scores[pid].g += pts;
}

// Вскрытие раунда: глагол + кто врал + авто-очки (утверждённая система 11 июня)
function doReveal(g, guessedBy, guessedByName) {
  const rd = g.round;
  const qn = (rd.asked || []).length;
  const circle = qn < 9 ? 1 : qn < 18 ? 2 : 3;
  const detPts = circle === 1 ? 5 : circle === 2 ? 3 : 1;
  const canonName = rd.canonName || "";
  const fantasyName = rd.fantasyName || "";
  const canonLetter = rd.witAName === canonName ? "A" : "B";
  const fantLetter = canonLetter === "A" ? "B" : "A";
  const votes = rd.votes || {};
  const nameOf = (pid) => {
    const p = (g.players || []).find((x) => x.id === pid);
    return p ? p.name : "?";
  };
  const breakdown = []; // [{name, pts, why}] — для таблицы ведущей и плашек
  // 1) Угадавший детектив: +5/+3/+1 по кругу
  if (guessedBy) {
    addPts(g, guessedBy, detPts);
    breakdown.push({ name: guessedByName, pts: detPts, why: `угадал глагол (круг ${circle})` });
  }
  // 2) Каждый детектив с голосом за правдивого: +1
  const votesByName = {};
  let votesCanon = 0, votesFant = 0;
  Object.keys(votes).forEach((pid) => {
    const ch = votes[pid];
    votesByName[nameOf(pid)] = ch;
    if (ch === canonLetter) {
      votesCanon++;
      addPts(g, pid, 1);
      breakdown.push({ name: nameOf(pid), pts: 1, why: "поверил правдивому" });
    } else votesFant++;
  });
  // 3) Свидетели: +2 за каждый голос «верю», джекпот +3 за все 3 голоса
  const totalVoters = Object.keys(votes).length;
  const witPts = (label, who, pid, nVotes) => {
    let pts = nVotes * 2;
    let why = `голоса доверия: ${nVotes} × 2`;
    if (totalVoters >= 3 && nVotes === totalVoters) { pts += 3; why += " + джекпот 3"; }
    if (pts) { addPts(g, pid, pts); breakdown.push({ name: who, pts, why }); }
  };
  witPts("canon", canonName, rd.roles.canon, votesCanon);
  witPts("fantasy", fantasyName, rd.roles.fantasy, votesFant);
  // 4) Бонус «был интереснее»: больше адресных вопросов; ничья — никому
  const askedA = (rd.asked || []).filter((a) => a.to === "A").length;
  const askedB = (rd.asked || []).filter((a) => a.to === "B").length;
  if (askedA !== askedB) {
    const L = askedA > askedB ? "A" : "B";
    const who = L === "A" ? rd.witAName : rd.witBName;
    const pid = L === canonLetter ? rd.roles.canon : rd.roles.fantasy;
    addPts(g, pid, 2);
    breakdown.push({ name: who, pts: 2, why: `был интереснее (${Math.max(askedA, askedB)} вопросов)` });
  }
  rd.revealed = {
    ok: !!guessedBy,
    byName: guessedByName || null,
    detPts: guessedBy ? detPts : 0,
    circle,
    verbKey: rd.verbKey,
    canonName, fantasyName, canonLetter,
    votesByName, votesCanon, votesFant,
    breakdown,
    ts: Date.now(),
  };
  rd.guess = null;
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
      return res.status(200).json({ ok: true, game: pub(g) });
    }

    // --- Все остальные действия требуют код ---
    const code = String(body.code || q.code || "").trim();
    if (!code) return res.status(200).json({ ok: false, error: "Нет кода игры" });
    const g = await getGame(code);
    if (!g) return res.status(200).json({ ok: false, error: "Игра с таким кодом не найдена" });

    // --- Текущее состояние (опрос раз в 2 сек) ---
    if (action === "state") {
      return res.status(200).json({ ok: true, game: pub(g) });
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
      return res.status(200).json({ ok: true, playerId: p.id, game: pub(g) });
    }

    // --- Ведущий стартует раунд: роли и глагол уезжают на пульты игроков ---
    if (action === "start_round") {
      const n = Number(body.round || 0);
      const verbKey = String(body.verbKey || "");
      const roles = body.roles || {};
      if (!n || !verbKey) return res.status(200).json({ ok: false, error: "Нет номера раунда или глагола" });
      // Повторная отправка того же раунда («↻ Отправить ещё раз», игрок вошёл посреди игры):
      // обновляем только роли, лента вопросов и очередь остаются как были
      if (g.round && g.round.n === n && g.round.verbKey === verbKey) {
        g.round.roles = {
          canon: roles.canon || null,
          fantasy: roles.fantasy || null,
          detectives: Array.isArray(roles.detectives) ? roles.detectives : [],
        };
        const cn = String(roles.canonName || "");
        if (g.round.witAName === cn) { g.round.witA = roles.canon || null; g.round.witB = roles.fantasy || null; }
        else { g.round.witA = roles.fantasy || null; g.round.witB = roles.canon || null; }
        g.v++;
        await setGame(g);
        return res.status(200).json({ ok: true, game: pub(g) });
      }
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
      g.round.pendingOwn = null; // свой вопрос на оценке у ведущей: {by, byName, ts}
      // --- Шаг 5: угадывание глагола ---
      g.round.canonName = String(roles.canonName || "").slice(0, 24);
      g.round.fantasyName = String(roles.fantasyName || "").slice(0, 24);
      g.round.hands = []; // поднятые руки «готов назвать глагол»: [{by, byName, ts}]
      g.round.eliminated = []; // выбывшие детективы (неверный глагол)
      g.round.guess = null; // активная попытка: {by, byName, stage: "voting"|"naming", ts}
      g.round.votes = {}; // тайные голоса: {pid: "A"|"B"} — наружу не уходят до вскрытия
      g.round.votesDone = false; // голосование раунда уже состоялось (один раз за раунд)
      g.round.revealed = null; // вскрытие: глагол + кто врал + очки
      g.round.lastElim = null; // последний выбывший: {byName, ts} — для плашек
      // Персональные очки игроков: r — за раунд, g — за игру. Новый раунд обнуляет r.
      g.scores = g.scores || {};
      (g.players || []).forEach((p) => {
        g.scores[p.id] = g.scores[p.id] || { r: 0, g: 0 };
        g.scores[p.id].r = 0;
      });
      // Кто из свидетелей «A», кто «B» — случайно, чтобы буква не выдавала роль.
      // Имена приходят с пульта ведущей — работают и для игроков без пульта.
      const wits = [
        { id: g.round.roles.canon || null, name: String(roles.canonName || "Свидетель 1").slice(0, 24) },
        { id: g.round.roles.fantasy || null, name: String(roles.fantasyName || "Свидетель 2").slice(0, 24) },
      ];
      if (Math.random() < 0.5) wits.reverse();
      g.round.witA = wits[0].id;
      g.round.witAName = wits[0].name;
      g.round.witB = wits[1].id;
      g.round.witBName = wits[1].name;
      g.round.asked = []; // лента вопросов раунда: {by, byName, to, qid, text, ts}
      g.round.answers = {}; // общие ответы свидетелей: ключ "qid:A"/"qid:B" -> "sí"|"no" (пишет детектив, видят все)
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: pub(g) });
    }

    // --- Ведущий передаёт ход следующему детективу ---
    if (action === "set_turn") {
      if (!g.round) return res.status(200).json({ ok: false, error: "Раунд ещё не начался" });
      g.round.turnIdx = Number(body.turnIdx || 0);
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: pub(g) });
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
      if (g.round.revealed) {
        return res.status(200).json({ ok: false, error: "Раунд уже завершён — глагол вскрыт" });
      }
      if (!manual) {
        if (g.round.guess) {
          return res.status(200).json({ ok: false, error: "Идёт угадывание глагола — вопросы на паузе" });
        }
        if (g.round.pendingOwn) {
          return res.status(200).json({ ok: false, error: "Сначала ведущая оценит свой вопрос" });
        }
        if (!dets.includes(pid)) {
          return res.status(200).json({ ok: false, error: "Ты не детектив этого раунда" });
        }
        if ((g.round.eliminated || []).includes(pid)) {
          return res.status(200).json({ ok: false, error: "Ты выбыл из раунда — дождись следующего" });
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
      advanceTurn(g);
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: pub(g) });
    }

    // --- Детектив фиксирует ответ свидетеля (Sí/No) → общая история допроса, видят все ---
    if (action === "answer") {
      if (!g.round) return res.status(200).json({ ok: false, error: "Раунд ещё не начался" });
      if (g.round.revealed) return res.status(200).json({ ok: false, error: "Раунд уже завершён" });
      const dets = (g.round.roles && g.round.roles.detectives) || [];
      const pid = String(body.playerId || "");
      const manual = !!body.manual; // ведущая может зафиксировать ответ вручную
      if (!manual && !dets.includes(pid)) {
        return res.status(200).json({ ok: false, error: "Ответ свидетеля фиксирует детектив" });
      }
      const qid = body.qid ? String(body.qid) : null;
      const w = body.target === "A" || body.target === "B" ? body.target : null;
      const val = body.value === "sí" || body.value === "no" ? body.value : null;
      if (!qid || !w) return res.status(200).json({ ok: false, error: "Нужен вопрос и свидетель A/B" });
      g.round.answers = g.round.answers || {};
      const key = qid + ":" + w;
      if (!val || g.round.answers[key] === val) {
        delete g.round.answers[key]; // повторный тап того же значения — снять отметку
      } else {
        g.round.answers[key] = val;
      }
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: pub(g) });
    }

    // --- Детектив заявляет СВОЙ вопрос (задаёт голосом, ведущая оценит ✅/❌) ---
    if (action === "own") {
      if (!g.round) return res.status(200).json({ ok: false, error: "Раунд ещё не начался" });
      g.round.asked = g.round.asked || [];
      if (g.round.asked.length >= 27) {
        return res.status(200).json({ ok: false, error: "Лимит 27 вопросов исчерпан" });
      }
      if (g.round.pendingOwn) {
        return res.status(200).json({ ok: false, error: "Ведущая ещё оценивает предыдущий свой вопрос" });
      }
      if (g.round.revealed) {
        return res.status(200).json({ ok: false, error: "Раунд уже завершён — глагол вскрыт" });
      }
      if (g.round.guess) {
        return res.status(200).json({ ok: false, error: "Идёт угадывание глагола — вопросы на паузе" });
      }
      const dets = g.round.roles.detectives || [];
      const pid = String(body.playerId || "");
      if (!dets.includes(pid)) {
        return res.status(200).json({ ok: false, error: "Ты не детектив этого раунда" });
      }
      if ((g.round.eliminated || []).includes(pid)) {
        return res.status(200).json({ ok: false, error: "Ты выбыл из раунда — дождись следующего" });
      }
      const activeId = dets[(g.round.turnIdx || 0) % dets.length];
      if (pid !== activeId) {
        return res.status(200).json({ ok: false, error: "Сейчас не твой ход" });
      }
      const p = g.players.find((x) => x.id === pid);
      g.round.pendingOwn = { by: pid, byName: p ? p.name : "детектив", ts: Date.now() };
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: pub(g) });
    }

    // --- Ведущая оценивает свой вопрос: ✅ = +2 детективу, ❌ = 0 без штрафа; ход переходит ---
    if (action === "approve") {
      if (!g.round || !g.round.pendingOwn) {
        return res.status(200).json({ ok: false, error: "Нет своего вопроса на оценке" });
      }
      const po = g.round.pendingOwn;
      const approved = !!body.approved;
      if (approved && po.by) {
        g.scores = g.scores || {};
        g.scores[po.by] = g.scores[po.by] || { r: 0, g: 0 };
        g.scores[po.by].r += 2;
        g.scores[po.by].g += 2;
      }
      g.round.asked = g.round.asked || [];
      g.round.asked.push({
        by: po.by,
        byName: po.byName,
        to: null,
        qid: null,
        own: true,
        approved,
        text: approved ? "✍️ свой вопрос · ✅ принят (+2)" : "✍️ свой вопрос · ❌ не засчитан",
        ts: Date.now(),
      });
      g.round.pendingOwn = null;
      advanceTurn(g);
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: pub(g) });
    }

    // --- Шаг 5.1: детектив поднимает/опускает руку «готов назвать глагол» ---
    if (action === "hand") {
      if (!g.round) return res.status(200).json({ ok: false, error: "Раунд ещё не начался" });
      if (g.round.revealed) return res.status(200).json({ ok: false, error: "Раунд уже завершён" });
      const pid = String(body.playerId || "");
      const dets = g.round.roles.detectives || [];
      if (!dets.includes(pid)) return res.status(200).json({ ok: false, error: "Ты не детектив этого раунда" });
      if ((g.round.eliminated || []).includes(pid)) return res.status(200).json({ ok: false, error: "Ты выбыл из раунда" });
      g.round.hands = g.round.hands || [];
      if (body.down) {
        g.round.hands = g.round.hands.filter((h) => h.by !== pid);
      } else if (!g.round.hands.some((h) => h.by === pid)) {
        const p = g.players.find((x) => x.id === pid);
        g.round.hands.push({ by: pid, byName: p ? p.name : "детектив", ts: Date.now() });
      }
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: pub(g) });
    }

    // --- Шаг 5.2: ведущая даёт слово детективу (из рук или напрямую) ---
    if (action === "give_floor") {
      if (!g.round) return res.status(200).json({ ok: false, error: "Раунд ещё не начался" });
      if (g.round.revealed) return res.status(200).json({ ok: false, error: "Раунд уже завершён" });
      if (g.round.guess) return res.status(200).json({ ok: false, error: "Попытка уже идёт — сначала вердикт" });
      if (g.round.pendingOwn) return res.status(200).json({ ok: false, error: "Сначала оцени свой вопрос (✅/❌)" });
      const pid = String(body.playerId || "");
      const dets = g.round.roles.detectives || [];
      if (!dets.includes(pid)) return res.status(200).json({ ok: false, error: "Это не детектив раунда" });
      if ((g.round.eliminated || []).includes(pid)) return res.status(200).json({ ok: false, error: "Этот детектив выбыл" });
      const p = g.players.find((x) => x.id === pid);
      g.round.hands = (g.round.hands || []).filter((h) => h.by !== pid);
      g.round.guess = {
        by: pid,
        byName: p ? p.name : "детектив",
        // голосование — один раз за раунд: если уже было, сразу к называнию
        stage: g.round.votesDone ? "naming" : "voting",
        ts: Date.now(),
      };
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: pub(g) });
    }

    // --- Шаг 5.3: тайный голос детектива «Верю A / Верю B» ---
    if (action === "vote") {
      if (!g.round || !g.round.guess || g.round.guess.stage !== "voting") {
        return res.status(200).json({ ok: false, error: "Сейчас нет голосования" });
      }
      const pid = String(body.playerId || "");
      const choice = body.choice === "A" || body.choice === "B" ? body.choice : null;
      const dets = g.round.roles.detectives || [];
      if (!dets.includes(pid)) return res.status(200).json({ ok: false, error: "Голосуют только детективы" });
      if (!choice) return res.status(200).json({ ok: false, error: "Выбери A или B" });
      g.round.votes = g.round.votes || {};
      if (g.round.votes[pid]) return res.status(200).json({ ok: false, error: "Твой голос уже принят" });
      g.round.votes[pid] = choice;
      // Все детективы проголосовали → голосование закрыто
      if (Object.keys(g.round.votes).length >= dets.length) {
        g.round.votesDone = true;
        if (g.round.guess.endRound) {
          // принудительное завершение: вскрытие без называния глагола
          doReveal(g, null, null);
        } else {
          g.round.guess.stage = "naming";
        }
      }
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: pub(g) });
    }

    // --- Страховка: ведущая закрывает голосование, если чей-то пульт завис ---
    if (action === "force_votes") {
      if (!g.round || !g.round.guess || g.round.guess.stage !== "voting") {
        return res.status(200).json({ ok: false, error: "Сейчас нет голосования" });
      }
      g.round.votesDone = true;
      if (g.round.guess.endRound) doReveal(g, null, null);
      else g.round.guess.stage = "naming";
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: pub(g) });
    }

    // --- Шаг 5.4: вердикт ведущей — глагол назван верно/неверно ---
    if (action === "verdict") {
      if (!g.round || !g.round.guess || g.round.guess.stage !== "naming") {
        return res.status(200).json({ ok: false, error: "Сейчас никто не называет глагол" });
      }
      const gu = g.round.guess;
      if (body.correct) {
        doReveal(g, gu.by, gu.byName);
      } else {
        // неверный глагол → выбывание до конца раунда, ложь НЕ раскрывается
        g.round.eliminated = g.round.eliminated || [];
        if (gu.by && !g.round.eliminated.includes(gu.by)) g.round.eliminated.push(gu.by);
        g.round.hands = (g.round.hands || []).filter((h) => h.by !== gu.by);
        g.round.lastElim = { byName: gu.byName, ts: Date.now() };
        g.round.guess = null;
        if (!aliveDets(g).length) {
          // все детективы выбыли → раунд завершается, очки свидетелям
          doReveal(g, null, null);
        } else {
          fixTurn(g);
        }
      }
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: pub(g) });
    }

    // --- Шаг 5.5: ведущая завершает раунд (27 вопросов / никто не угадал) ---
    if (action === "end_round") {
      if (!g.round) return res.status(200).json({ ok: false, error: "Раунд ещё не начался" });
      if (g.round.revealed) return res.status(200).json({ ok: false, error: "Раунд уже завершён" });
      if (g.round.guess && g.round.guess.stage === "naming") {
        return res.status(200).json({ ok: false, error: "Сначала вердикт по названному глаголу (✅/❌)" });
      }
      if (g.round.votesDone) {
        doReveal(g, null, null);
      } else if (g.round.guess && g.round.guess.stage === "voting") {
        // голосование уже идёт — просто помечаем: после последнего голоса будет вскрытие
        g.round.guess.endRound = true;
        g.round.guess.by = g.round.guess.by || null;
      } else {
        // голосования ещё не было — запускаем финальное, после него вскрытие
        g.round.guess = { by: null, byName: null, stage: "voting", endRound: true, ts: Date.now() };
      }
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: pub(g) });
    }

    // --- Ведущий убирает игрока из лобби (опечатка в имени и т.п.) ---
    if (action === "kick") {
      const pid = String(body.playerId || "");
      g.players = g.players.filter((x) => x.id !== pid);
      g.v++;
      await setGame(g);
      return res.status(200).json({ ok: true, game: pub(g) });
    }

    return res.status(200).json({ ok: false, error: "Неизвестное действие: " + action });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e) });
  }
}
