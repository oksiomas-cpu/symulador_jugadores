import {
  ACTIONS4, QUESTION_ORDER4, QUESTIONS4, CATS4, TARGETS4,
  answerKey4, fullAnswer4, intrusoKey4, GAME4_CASE_STORY,
} from "../src/game4Data.js";
import { readFileSync } from "node:fs";

let failed = 0;
function check(label, ok, detail = "") {
  if (ok) console.log(`  ✅ ${label}`);
  else {
    failed += 1;
    console.error(`  ❌ ${label}${detail ? ` · ${detail}` : ""}`);
  }
}
function distance(a, b) {
  let n = 0;
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) n += 1;
  return n;
}
function minPairDistance(keys) {
  let min = Infinity;
  for (let i = 0; i < keys.length; i += 1) {
    for (let j = i + 1; j < keys.length; j += 1) min = Math.min(min, distance(keys[i], keys[j]));
  }
  return min;
}

console.log("\n📕 Игра №4 · проверка картриджа cap4\n");
check("ровно 7 действий", ACTIONS4.length === 7);
check("ровно 3 категории операторов", CATS4.length === 3);
check("ровно 21 вопрос", QUESTIONS4.length === 21 && QUESTION_ORDER4.length === 21);
check("ID вопросов уникальны и совпадают с порядком",
  new Set(QUESTIONS4.map((q) => q.id)).size === 21 &&
  QUESTIONS4.every((q, i) => q.id === QUESTION_ORDER4[i]));
check("ровно 15 предметов-целей", TARGETS4.length === 15 && TARGETS4.every((x) => x.target));
check("ID предметов уникальны", new Set(TARGETS4.map((x) => x.key)).size === 15);
check("каждый предмет имеет все 21 ответа",
  TARGETS4.every((item) => QUESTION_ORDER4.every((id) => ["sí", "no"].includes(item.answers[id]) && ["sí", "no"].includes(item.fantAns[id]))));

const canonKeys = TARGETS4.map((item) => answerKey4(item, "canon"));
const fantasyKeys = TARGETS4.map((item) => answerKey4(item, "fantasy"));
check("15 Canon уникальны", new Set(canonKeys).size === 15);
check("15 Fantasía уникальны", new Set(fantasyKeys).size === 15);
check("ни одна Fantasía не совпадает с Canon", fantasyKeys.every((key) => !canonKeys.includes(key)));
check("минимум Canon↔Canon = 3 (v2, было 2)", minPairDistance(canonKeys) === 3, String(minPairDistance(canonKeys)));
check("минимум Fantasía↔Fantasía = 3", minPairDistance(fantasyKeys) === 3, String(minPairDistance(fantasyKeys)));
const cross = fantasyKeys.flatMap((f) => canonKeys.map((c) => distance(f, c)));
check("минимум Fantasía↔Canon = 2", Math.min(...cross) === 2, String(Math.min(...cross)));

const ownDiffs = TARGETS4.map((item, i) => distance(canonKeys[i], fantasyKeys[i]));
check("каждая Fantasía отличается от своего Canon на 5–6 ответов",
  ownDiffs.every((n) => n === 5 || n === 6), ownDiffs.join(","));
const tKeys = TARGETS4.map((item) => intrusoKey4(item).tener_que.join(","));
check("tener que уникален у всех 15 предметов (шаг плана)", new Set(tKeys).size === 15, tKeys.join(" | "));
check("у каждого предмета есть ситуация ES/RU и три «почему»",
  TARGETS4.every((item) => item.situationEs && item.situationRu &&
    ["querer", "poder", "tener_que"].every((cat) => item.why && item.why[cat])));
check("у каждого предмета есть история преступника ES/RU (10.10)",
  TARGETS4.every((item) => Array.isArray(item.historiaEs) && item.historiaEs.length >= 5 &&
    Array.isArray(item.historiaRu) && item.historiaRu.length === item.historiaEs.length));
check("история дела v2 на месте", GAME4_CASE_STORY.es.length > 10 && GAME4_CASE_STORY.es.length === GAME4_CASE_STORY.ru.length);

const yesCounts = QUESTION_ORDER4.map((id) => TARGETS4.filter((item) => item.answers[id] === "sí").length);
check("баланс SÍ по вопросам = 2–13", Math.min(...yesCounts) >= 2 && Math.max(...yesCounts) <= 13,
  `${Math.min(...yesCounts)}–${Math.max(...yesCounts)}`);
check("полные ответы есть для Sí и No",
  QUESTION_ORDER4.every((id) => fullAnswer4(id, "sí").startsWith("Sí,") && fullAnswer4(id, "no").startsWith("No,")));
check("в вопросах второй глагол остаётся в infinitivo",
  QUESTIONS4.every((q) => ACTIONS4.some((a) => q.q.includes(` ${a.id} `))));

const shell = readFileSync(new URL("../src/SimuladorJugador.jsx", import.meta.url), "utf8");
check("cap4 подключён к PACKS и обеим витринам",
  shell.includes('id: "cap4"') &&
  shell.includes("PACKS.cap4") &&
  shell.includes("[PACKS.cap1, PACKS.cap2, PACKS.cap3, PACKS.cap4]"));
check("club открывает cap4, пробные доступы не открывают",
  shell.includes("cap4: true") && (shell.match(/cap4: false/g) || []).length >= 3);
check("история-маяк MAYA4 + дело v2 подключены", shell.includes("const MAYA4") && shell.includes("isCapFour ? MAYA4_FULL"));
check("тренировка «Думай как преступник» подключена в cap4",
  shell.includes('import IntrusoTrainer from "./IntrusoTrainer.jsx"') && shell.includes("<IntrusoTrainer"));

if (failed) {
  console.error(`\n🔴 Провалов: ${failed}\n`);
  process.exit(1);
}
console.log("\n🟢 Картридж cap4 целостен и готов к сборке.\n");
