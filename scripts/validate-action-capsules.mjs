import {
  CAPSULE_ACTIONS,
  CAPSULE_OPERATORS,
  CAPSULE_STORIES,
  capsulePhrase,
} from "../src/actionCapsulesData.js";

let failed = 0;
function check(label, ok, detail = "") {
  if (ok) console.log(`  ✅ ${label}`);
  else { failed += 1; console.error(`  ❌ ${label}${detail ? ` · ${detail}` : ""}`); }
}

console.log("\n🧩 Капсулы действия A1 · проверка первого среза\n");
check("ровно 5 базовых действий", CAPSULE_ACTIONS.length === 5);
check("ровно 3 оператора", CAPSULE_OPERATORS.length === 3);
check("15 комбинаций оператор × действие", CAPSULE_ACTIONS.length * CAPSULE_OPERATORS.length === 15);
check("ID действий уникальны", new Set(CAPSULE_ACTIONS.map(x => x.id)).size === CAPSULE_ACTIONS.length);
check("ID операторов уникальны", new Set(CAPSULE_OPERATORS.map(x => x.id)).size === CAPSULE_OPERATORS.length);
check("все действия заданы инфинитивом", CAPSULE_ACTIONS.every(x => /(?:ar|er|ir)$/.test(x.infinitive)));
check("recoger используется только как infinitivo", CAPSULE_ACTIONS.find(x => x.id === "recoger")?.infinitive === "recoger");
check("каждая история ссылается на существующую комбинацию", CAPSULE_STORIES.every(x => CAPSULE_ACTIONS.some(a => a.id === x.actionId) && CAPSULE_OPERATORS.some(o => o.id === x.operatorId)));
check("каждое действие представлено в режиме История", new Set(CAPSULE_STORIES.map(x => x.actionId)).size === CAPSULE_ACTIONS.length);

const phrases = CAPSULE_OPERATORS.flatMap(op => CAPSULE_ACTIONS.map(action => capsulePhrase(op.id, action.id)));
check("все 15 фраз уникальны", new Set(phrases).size === 15);
check("после оператора действие не спрягается", phrases.every((phrase) => CAPSULE_ACTIONS.some(action => phrase.includes(` ${action.infinitive} `))));
check("в каждой фразе ровно один оператор", phrases.every((phrase) => CAPSULE_OPERATORS.filter(op => phrase.startsWith(`${op.yo} `)).length === 1));

if (failed) {
  console.error(`\n🔴 Провалов: ${failed}\n`);
  process.exit(1);
}
console.log("\n🟢 Первый срез целостен и готов к сборке.\n");

