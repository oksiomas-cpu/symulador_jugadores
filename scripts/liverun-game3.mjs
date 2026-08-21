/* ============================================================
   ЖИВОЙ ПРОГОН · El Caso de las Tres Huellas (cap3)
   DoD ТЗ: «каждый из 14 предметов проходится и как Canon,
   и как Fantasía без ошибок движка; internal evidence не
   протекает в UI раньше времени; la_sombra не выпадает как цель».

   Прогон безголовый: играет 28 партий (14 × 2 версии), задаёт
   все 21 вопрос, проверяет ответы, полные фразы, распознавание
   по точному ключу и герметичность внутренних доказательств.

   Запуск: npm run liverun:game3
   ============================================================ */

import {
  QUESTIONS3, QUESTION_ORDER3, TARGETS3, VERBS3, LA_SOMBRA3, ITEMS3,
  verbByKey3, fullAnswer3, bitsOf, identifyByExactKey3, narrowCandidates3, publicItem3, evidenceOf3,
} from "../src/game3Data.js";

let fails = [];
const bad = (m) => fails.push(m);

console.log("\n🎬 Живой прогон · 14 предметов × 2 версии\n");

/* ---- 1. Пул целей ---- */
if (TARGETS3.length !== 14) bad(`пул целей = ${TARGETS3.length}, ожидалось 14`);
if (TARGETS3.some((v) => v.key === "la_sombra")) bad("la_sombra попала в пул целей");
if (LA_SOMBRA3.target !== false) bad("la_sombra помечена как цель");

// 20 000 случайных выборов цели — la_sombra не должна выпасть ни разу
for (let i = 0; i < 20000; i++) {
  const pick = TARGETS3[Math.floor(Math.random() * TARGETS3.length)];
  if (!pick || pick.key === "la_sombra" || pick.target === false) {
    bad(`случайный выбор вернул недопустимую цель: ${pick && pick.key}`);
    break;
  }
}
console.log("  ✅ пул целей: 14, la_sombra не выпадает (20 000 бросков)");

/* ---- 2. Партии ---- */
let games = 0, questionsAsked = 0;

for (const item of TARGETS3) {
  for (const version of ["canon", "fantasy"]) {
    games++;
    const canonIsA = games % 2 === 0;
    const collected = {};

    for (const qid of QUESTION_ORDER3) {
      const q = QUESTIONS3.find((x) => x.id === qid);
      if (!q) { bad(`${item.key}/${version}: вопрос ${qid} отсутствует в банке`); continue; }

      // Свидетель отвечает по ключу СВОЕЙ версии
      const table = version === "canon" ? item.answers : item.fantAns;
      const a = table[qid];
      if (a !== "sí" && a !== "no") { bad(`${item.key}/${version}/${qid}: ответ «${a}» не sí/no`); continue; }

      // Ответ обязан совпасть с битом ключа
      const expect = bitsOf(item, version)[QUESTION_ORDER3.indexOf(qid)] === "1" ? "sí" : "no";
      if (a !== expect) bad(`${item.key}/${version}/${qid}: ответ ${a}, ключ говорит ${expect}`);

      // Полная фраза берётся из банка, а не генерируется
      const phrase = fullAnswer3(qid, a);
      if (!phrase || phrase.length < 10) bad(`${item.key}/${version}/${qid}: пустая полная фраза`);
      if (a === "sí" && phrase !== q.si) bad(`${item.key}/${version}/${qid}: фраза Sí не из банка`);
      if (a === "no" && phrase !== q.no) bad(`${item.key}/${version}/${qid}: фраза No не из банка`);

      // Второй свидетель отвечает по противоположной версии — движок не должен падать
      const other = version === "canon" ? item.fantAns : item.answers;
      const ansA = canonIsA ? item.answers[qid] : item.fantAns[qid];
      const ansB = canonIsA ? item.fantAns[qid] : item.answers[qid];
      if (!ansA || !ansB || other[qid] === undefined) bad(`${item.key}/${qid}: пара свидетелей неполна`);

      collected[qid] = a;
      questionsAsked++;
    }

    // Распознавание по точному полному ключу
    const id = identifyByExactKey3(collected);
    if (!id) bad(`${item.key}/${version}: точный ключ не опознан`);
    else if (id.item.key !== item.key || id.version !== version) {
      bad(`${item.key}/${version}: опознано как ${id.item.key}/${id.version}`);
    }

    // Внутренние доказательства не уходят игроку: игровая запись чиста
    if ("evidence" in item) bad(`${item.key}: evidence лежит прямо в игровой записи`);
    if ("fantasyChanges" in item) bad(`${item.key}: fantasyChanges лежит прямо в игровой записи`);
    const pub = publicItem3(item);
    const json = JSON.stringify(pub);
    const ev = evidenceOf3(item.key);
    if (!ev) bad(`${item.key}: разбор не может получить внутренние доказательства`);
    for (const layer of Object.values(ev || {})) {
      for (const fact of layer) {
        const token = fact.split(" = ")[0];
        if (json.includes(token) && token.includes(".")) {
          bad(`${item.key}: внутренний факт «${token}» виден в клиентской проекции`);
        }
      }
    }
  }
}
console.log(`  ✅ партий сыграно: ${games} (14 × 2) · вопросов задано: ${questionsAsked}`);

/* ---- 3. Неполный набор не опознаётся (запрет «ближайшего соседа») ---- */
{
  const item = TARGETS3[0];
  const partial = { ...item.answers };
  delete partial.P7;
  if (identifyByExactKey3(partial) !== null) bad("неполный набор ответов был опознан — сработал «ближайший сосед»");

  const oneOff = { ...item.answers };
  oneOff.P7 = oneOff.P7 === "sí" ? "no" : "sí";
  const res = identifyByExactKey3(oneOff);
  if (res && res.item.key === item.key && res.version === "canon") {
    bad("ключ с одной ошибкой опознан как исходный предмет — сработал «ближайший сосед»");
  }
  console.log("  ✅ неточный ключ не опознаётся: «ближайшего соседа» нет");
}

/* ---- 4. Лестница допроса реально сужает круг ---- */
{
  const worst = [];
  for (const item of TARGETS3) {
    const seq = ["I2", "D2", "P5", "I3", "D6", "P2", "I6", "D3", "P7"];
    const acc = {};
    let last = TARGETS3.length;
    for (const qid of seq) {
      acc[qid] = item.answers[qid];
      const n = narrowCandidates3(acc).length;
      if (n > last) bad(`${item.key}: круг расширился после ${qid} (${last} → ${n})`);
      last = n;
    }
    const finalists = narrowCandidates3(acc);
    if (!finalists.some((f) => f.key === item.key)) bad(`${item.key}: выпал из собственного круга кандидатов`);
    worst.push(finalists.length);
  }
  console.log(`  ✅ 9 вопросов сужают круг до ${Math.min(...worst)}–${Math.max(...worst)} кандидатов из 14`);
}

/* ---- 5. Целостность записей предметов ---- */
{
  for (const v of VERBS3) {
    if (!v.inf || !v.ru || !v.emoji) bad(`${v.key}: не хватает подписи для UI`);
    if (!v.storyEs || !v.storyEs.includes("Normalmente") || !v.storyEs.includes("Ayer") || !v.storyEs.includes("Hoy")) {
      bad(`${v.key}: в шпаргалке Канона нет всех трёх временных слоёв`);
    }
    if (!v.fantVer || v.fantVer.length < 40) bad(`${v.key}: версия Фантазии пуста`);
    if (!v.dossier || v.dossier.length < 4) bad(`${v.key}: досье неполное`);
    if (!verbByKey3(v.key)) bad(`${v.key}: не находится по ключу`);
  }
  console.log("  ✅ у всех 14 предметов есть шпаргалка Канона (3 слоя), версия Фантазии и досье");
}

/* ---- Итог ---- */
console.log(`\n${fails.length === 0 ? "🟢" : "🔴"} Живой прогон: ${fails.length ? fails.length + " ошибок" : "без ошибок движка"}\n`);
if (fails.length) {
  for (const f of fails) console.error("  · " + f);
  console.error("");
  process.exit(1);
}
