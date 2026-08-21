/* ============================================================
   ВАЛИДАТОРЫ ДАННЫХ · El Caso de las Tres Huellas (cap3)
   Спецификация 92 · «Автоматические валидаторы» → тесты сборки.

   🔴 Данные уже проверены ревизией Клавы и независимым пересчётом.
      Эти валидаторы ПОДТВЕРЖДАЮТ данные, а не ищут новых нарушений.
      Валидатор упал → СТОП. Конфликт возвращается редактору данных
      в Notion. Матрицу в коде не чинить (прямой запрет спец. 92).

   Запуск: npm run validate:game3  ·  общий файл для ciudad-host и symulador_jugadores
   ============================================================ */

import {
  QUESTIONS3, QUESTION_ORDER3, ITEMS3, VERBS3, TARGETS3, LA_SOMBRA3,
  MUTABLE_CATEGORIES3, SPOILER_LEXEMES3, bitsOf, answersFromKeys, questionById3,
} from "../src/game3Data.js";

let failures = [];
let checks = 0;

function assert(name, cond, detail = "") {
  checks++;
  if (cond) {
    console.log(`  ✅ ${name}`);
  } else {
    failures.push(`${name}${detail ? " — " + detail : ""}`);
    console.log(`  ❌ ${name}${detail ? "\n       " + detail : ""}`);
  }
}

const TENSE_OF = Object.fromEntries(QUESTIONS3.map((q) => [q.id, q.tense]));
const canonBits = Object.fromEntries(ITEMS3.map((it) => [it.key, bitsOf(it, "canon")]));
const fantasyBits = Object.fromEntries(ITEMS3.map((it) => [it.key, bitsOf(it, "fantasy")]));

function hamming(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}
function changedTenseLayers(a, b) {
  const layers = new Set();
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) layers.add(TENSE_OF[QUESTION_ORDER3[i]]);
  }
  return layers.size;
}
function sameSet(a, b) {
  const A = new Set(a), B = new Set(b);
  if (A.size !== B.size) return false;
  for (const x of A) if (!B.has(x)) return false;
  return true;
}

console.log("\n🧮 El Caso de las Tres Huellas · валидаторы данных\n");

/* ---- 1. item_count == 14 ---- */
assert("item_count == 14", ITEMS3.length === 14, `фактически ${ITEMS3.length}`);

/* ---- 2. question_count == 21 ---- */
assert("question_count == 21", QUESTIONS3.length === 21, `фактически ${QUESTIONS3.length}`);
assert("порядок вопросов совпадает с QUESTION_ORDER3",
  QUESTIONS3.map((q) => q.id).join(",") === QUESTION_ORDER3.join(","));

/* ---- 3. every_vector_length == 21 ---- */
{
  const bad = [];
  for (const it of ITEMS3) {
    for (const v of ["canon", "fantasy"]) {
      const bits = bitsOf(it, v);
      if (bits.length !== 21 || !/^[01]{21}$/.test(bits)) bad.push(`${it.key}/${v}=${bits}`);
      if (it.keys[v].length !== 3 || it.keys[v].some((b) => b.length !== 7)) bad.push(`${it.key}/${v} блоки не 7+7+7`);
    }
  }
  assert("every_vector_length == 21", bad.length === 0, bad.join("; "));
}

/* ---- 4. canon_vectors_are_unique ---- */
{
  const seen = new Map(), dup = [];
  for (const it of ITEMS3) {
    const b = canonBits[it.key];
    if (seen.has(b)) dup.push(`${seen.get(b)} ↔ ${it.key} (${b})`);
    seen.set(b, it.key);
  }
  assert("canon_vectors_are_unique", dup.length === 0, dup.join("; "));
}

/* ---- 5. min_pairwise_hamming(canon) >= 4 ---- */
{
  let min = Infinity, worst = [];
  for (let i = 0; i < ITEMS3.length; i++) {
    for (let j = i + 1; j < ITEMS3.length; j++) {
      const d = hamming(canonBits[ITEMS3[i].key], canonBits[ITEMS3[j].key]);
      if (d < min) { min = d; worst = [`${ITEMS3[i].key} ↔ ${ITEMS3[j].key} = ${d}`]; }
      else if (d === min) worst.push(`${ITEMS3[i].key} ↔ ${ITEMS3[j].key} = ${d}`);
    }
  }
  assert(`min_pairwise_hamming(canon) >= 4 (фактически ${min})`, min >= 4, worst.join("; "));
}

/* ---- 6. min_changed_tense_layers(canon_pairs) >= 2 ---- */
{
  const bad = [];
  for (let i = 0; i < ITEMS3.length; i++) {
    for (let j = i + 1; j < ITEMS3.length; j++) {
      const n = changedTenseLayers(canonBits[ITEMS3[i].key], canonBits[ITEMS3[j].key]);
      if (n < 2) bad.push(`${ITEMS3[i].key} ↔ ${ITEMS3[j].key} = ${n} слой`);
    }
  }
  assert("min_changed_tense_layers(canon_pairs) >= 2", bad.length === 0, bad.join("; "));
}

/* ---- 7. no_fantasy_vector_in_canon_vectors ---- */
{
  const canonSet = new Set(Object.values(canonBits));
  const bad = ITEMS3.filter((it) => canonSet.has(fantasyBits[it.key]))
    .map((it) => `${it.key} Fantasía совпала с чьим-то Canon`);
  assert("no_fantasy_vector_in_canon_vectors", bad.length === 0, bad.join("; "));
}

/* ---- 8. immutable_core_is_declared_once_per_item ---- */
{
  const bad = [];
  for (const it of ITEMS3) {
    if (!Array.isArray(it.core) || it.core.length === 0) bad.push(`${it.key}: ядро не объявлено`);
    else if (new Set(it.core).size !== it.core.length) bad.push(`${it.key}: инвариант объявлен дважды`);
  }
  assert("immutable_core_is_declared_once_per_item", bad.length === 0, bad.join("; "));
}

/* ---- 9. immutable_summary_equals_core ----
   Правило 00: строка «Инварианты не меняются» — точный СОКРАЩЁННЫЙ
   повтор ядра, а не второй независимый список. Проверяем, что сводка
   не вводит инвариантов, которых нет в ядре, и не пуста.            */
{
  const bad = [];
  for (const it of ITEMS3) {
    if (!it.coreSummary || it.coreSummary.length === 0) { bad.push(`${it.key}: сводка пуста`); continue; }
    const core = new Set(it.core);
    const invented = it.coreSummary.filter((t) => !core.has(t));
    if (invented.length) bad.push(`${it.key}: сводка вводит новые инварианты — ${invented.join(", ")}`);
  }
  assert("immutable_summary_equals_core", bad.length === 0, bad.join("; "));
}

/* ---- 10. fantasy_preserves_declared_immutable_core ----
   Fantasía меняет только оси изменяемой биографии (страница 00).   */
{
  const allowed = new Set(MUTABLE_CATEGORIES3);
  const bad = [];
  for (const it of ITEMS3) {
    if (!it.fantasyChanges || !it.fantasyChanges.length) { bad.push(`${it.key}: изменения Fantasía не объявлены`); continue; }
    for (const ch of it.fantasyChanges) {
      if (!allowed.has(ch.cat)) bad.push(`${it.key}: «${ch.key}» меняет неразрешённую ось «${ch.cat}»`);
    }
  }
  assert("fantasy_preserves_declared_immutable_core", bad.length === 0, bad.join("; "));
}

/* ---- 11. dangerous_pairs_are_symmetric ---- */
{
  const byKey = Object.fromEntries(ITEMS3.map((it) => [it.key, it]));
  const bad = [];
  for (const it of ITEMS3) {
    for (const other of it.dangerousPairs) {
      if (!byKey[other]) { bad.push(`${it.key} → неизвестный предмет «${other}»`); continue; }
      if (!byKey[other].dangerousPairs.includes(it.key)) bad.push(`${it.key} → ${other}, но обратной ссылки нет`);
    }
  }
  assert("dangerous_pairs_are_symmetric", bad.length === 0, bad.join("; "));
}

/* ---- 12. two_disjoint_recognition_routes_exist(route_size=3, min_tense_layers=2) ----
   Маршрут = 3 question_id, ≥2 времени, уникальная трёхбитная подпись
   среди 14 Canon. Два маршрута независимы, если не делят ни одного ID. */
{
  const idx = Object.fromEntries(QUESTION_ORDER3.map((q, i) => [q, i]));
  const routes = [];
  for (let a = 0; a < 21; a++)
    for (let b = a + 1; b < 21; b++)
      for (let c = b + 1; c < 21; c++) {
        const ids = [QUESTION_ORDER3[a], QUESTION_ORDER3[b], QUESTION_ORDER3[c]];
        if (new Set(ids.map((i) => TENSE_OF[i])).size < 2) continue;
        routes.push(ids);
      }

  const bad = [];
  for (const it of ITEMS3) {
    const sigOf = (ids, key) => ids.map((i) => canonBits[key][idx[i]]).join("");
    const unique = routes.filter((ids) => {
      const mine = sigOf(ids, it.key);
      return ITEMS3.every((o) => o.key === it.key || sigOf(ids, o.key) !== mine);
    });
    // ищем две непересекающиеся тройки среди уникальных
    let found = false;
    outer:
    for (let i = 0; i < unique.length && !found; i++) {
      const s = new Set(unique[i]);
      for (let j = i + 1; j < unique.length; j++) {
        if (unique[j].every((id) => !s.has(id))) { found = true; break outer; }
      }
    }
    if (!found) bad.push(`${it.key}: уникальных маршрутов ${unique.length}, двух независимых нет`);
  }
  assert("two_disjoint_recognition_routes_exist(3, ≥2 времени)", bad.length === 0, bad.join("; "));
}

/* ---- 13. story_fact_to_bit_audit ----
   Машинно проверяемая часть: объявленные «изменённые оси» карточки
   обязаны в точности совпасть с позициями, где Canon и Fantasía
   расходятся. Ловит любую ошибку переноса ключа из Notion.
   Смысловое соответствие бита тексту истории проверено ревизией.  */
{
  const bad = [];
  for (const it of ITEMS3) {
    const c = canonBits[it.key], f = fantasyBits[it.key];
    const actual = [];
    for (let i = 0; i < 21; i++) if (c[i] !== f[i]) actual.push(QUESTION_ORDER3[i]);
    if (!sameSet(actual, it.changedAxes)) {
      bad.push(`${it.key}: заявлено [${it.changedAxes.join(",")}], по ключам [${actual.join(",")}]`);
    }
  }
  assert("story_fact_to_bit_audit (изменённые оси ↔ ключи)", bad.length === 0, bad.join("; "));
}

/* ---- 14. visible_question_has_no_unique_lexical_spoiler ----
   Банк 90: у каждого вопроса есть несколько Canon-«sí» и «no»,
   ни один вопрос сам по себе не определяет предмет,
   и в формулировках нет запрещённой лексики.                       */
{
  const bad = [];
  for (let i = 0; i < 21; i++) {
    const qid = QUESTION_ORDER3[i];
    let yes = 0, no = 0;
    for (const it of ITEMS3) (canonBits[it.key][i] === "1" ? yes++ : no++);
    if (yes < 2 || no < 2) bad.push(`${qid}: sí=${yes}, no=${no} — вопрос почти определяет предмет`);
  }
  for (const q of QUESTIONS3) {
    const low = q.q.toLowerCase();
    for (const lex of SPOILER_LEXEMES3) {
      if (low.includes(lex)) bad.push(`${q.id}: запрещённая лексика «${lex}» в видимом вопросе`);
    }
    for (const it of ITEMS3) {
      const noun = it.inf.replace(/^(La|El|Los|Las)\s+/i, "").toLowerCase();
      if (low.includes(noun)) bad.push(`${q.id}: называет предмет «${noun}»`);
    }
  }
  assert("visible_question_has_no_unique_lexical_spoiler", bad.length === 0, bad.join("; "));
}

/* ---- Дополнительные проверки движка (DoD, не из списка 92) ---- */

/* la_sombra физически исключена из пула целей */
{
  const inItems = ITEMS3.some((it) => it.key === "la_sombra");
  const inTargets = TARGETS3.some((v) => v.key === "la_sombra");
  assert("la_sombra не входит в пул целей",
    !inItems && !inTargets && LA_SOMBRA3.target === false && TARGETS3.length === 14,
    `ITEMS3=${inItems}, TARGETS3=${inTargets}, targets=${TARGETS3.length}`);
}

/* Ответы выводятся из ключей, а не написаны руками */
{
  const bad = [];
  for (const v of VERBS3) {
    const fromKeys = answersFromKeys(v.keys.canon);
    for (const qid of QUESTION_ORDER3) if (v.answers[qid] !== fromKeys[qid]) bad.push(`${v.key}/${qid}`);
    const fFromKeys = answersFromKeys(v.keys.fantasy);
    for (const qid of QUESTION_ORDER3) if (v.fantAns[qid] !== fFromKeys[qid]) bad.push(`${v.key}/${qid} (fant)`);
    if (Object.keys(v.answers).length !== 21) bad.push(`${v.key}: ответов не 21`);
  }
  assert("ответы обеих версий выведены из 21-битных ключей", bad.length === 0, bad.join("; "));
}

/* Полные фразы ответов есть у всех 21 вопроса (спец. 92, п.4) */
{
  const bad = QUESTIONS3.filter((q) => !q.si || !q.no || !q.q).map((q) => q.id);
  assert("у каждого вопроса есть полные фразы Sí и No", bad.length === 0, bad.join(", "));
}

/* Fantasía каждого предмета отличается от собственного Canon на 4–6 ответов (аудит 91) */
{
  const bad = [];
  for (const it of ITEMS3) {
    const d = hamming(canonBits[it.key], fantasyBits[it.key]);
    if (d < 4 || d > 6) bad.push(`${it.key} = ${d}`);
  }
  assert("дистанция Canon → собственная Fantasía в диапазоне 4–6", bad.length === 0, bad.join("; "));
}

/* Минимальная дистанция Fantasía → любой Canon >= 4 (аудит 91) */
{
  let min = Infinity, worst = [];
  for (const it of ITEMS3) {
    for (const other of ITEMS3) {
      const d = hamming(fantasyBits[it.key], canonBits[other.key]);
      if (d < min) { min = d; worst = [`${it.key}/fant ↔ ${other.key}/canon = ${d}`]; }
    }
  }
  assert(`min(Fantasía → любой Canon) >= 4 (фактически ${min})`, min >= 4, worst.join("; "));
}

/* Вопрос-ловушка каждого предмета взят из утверждённого банка */
{
  const bad = VERBS3.filter((v) => !v.trapId || !questionById3(v.trapId)).map((v) => v.key);
  assert("вопрос-ловушка каждого предмета есть в банке 21", bad.length === 0, bad.join(", "));
}

/* ---- Итог ---- */
console.log(`\n${failures.length === 0 ? "🟢" : "🔴"} Проверок: ${checks} · провалов: ${failures.length}\n`);
if (failures.length) {
  console.error("СТОП. Конфликт данных возвращается редактору в Notion — в коде матрица не чинится.\n");
  for (const f of failures) console.error("  · " + f);
  console.error("");
  process.exit(1);
}
console.log("Данные подтверждены. Можно кодировать движок.\n");
