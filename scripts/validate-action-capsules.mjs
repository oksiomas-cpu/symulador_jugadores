import {
  CAPSULE_ACTIONS,
  CAPSULE_OPERATORS,
  CAPSULE_STORIES,
  capsulePhrase,
} from "../src/actionCapsulesData.js";
import { readFileSync } from "node:fs";

let failed = 0;
function check(label, ok, detail = "") {
  if (ok) console.log(`  ✅ ${label}`);
  else { failed += 1; console.error(`  ❌ ${label}${detail ? ` · ${detail}` : ""}`); }
}

console.log("\n🧩 Капсулы действия A1 · проверка первого этажа\n");
check("ровно 7 базовых действий", CAPSULE_ACTIONS.length === 7);
check("ровно 3 оператора", CAPSULE_OPERATORS.length === 3);
check("21 комбинация оператор × действие", CAPSULE_ACTIONS.length * CAPSULE_OPERATORS.length === 21);
check("ID действий уникальны", new Set(CAPSULE_ACTIONS.map(x => x.id)).size === CAPSULE_ACTIONS.length);
check("ID операторов уникальны", new Set(CAPSULE_OPERATORS.map(x => x.id)).size === CAPSULE_OPERATORS.length);
check("все действия заданы инфинитивом", CAPSULE_ACTIONS.every(x => /(?:ar|er|ir)$/.test(x.infinitive)));
check("recoger используется только как infinitivo", CAPSULE_ACTIONS.find(x => x.id === "recoger")?.infinitive === "recoger");
check("каждая история ссылается на существующую комбинацию", CAPSULE_STORIES.every(x => CAPSULE_ACTIONS.some(a => a.id === x.actionId) && CAPSULE_OPERATORS.some(o => o.id === x.operatorId)));
check("каждое действие представлено в режиме История", new Set(CAPSULE_STORIES.map(x => x.actionId)).size === CAPSULE_ACTIONS.length);
check("каждая испанская история имеет русский перевод", CAPSULE_STORIES.every(x => x.story && x.storyRu));

const phrases = CAPSULE_OPERATORS.flatMap(op => CAPSULE_ACTIONS.map(action => capsulePhrase(op.id, action.id)));
check("все 21 фраза уникальна", new Set(phrases).size === 21);
check("после оператора действие не спрягается", phrases.every((phrase) => CAPSULE_ACTIONS.some(action => phrase.includes(` ${action.infinitive} `))));
check("в каждой фразе ровно один оператор", phrases.every((phrase) => CAPSULE_OPERATORS.filter(op => phrase.startsWith(`${op.yo} `)).length === 1));
check("формы yo содержат явный субъект", CAPSULE_OPERATORS.every(op => op.yo.startsWith("Yo ")));
check("формы третьего лица содержат Él и Ella", CAPSULE_OPERATORS.every(op => op.el.startsWith("Él ") && op.ella.startsWith("Ella ")));
check("русские подсказки третьего лица естественны", CAPSULE_OPERATORS.every(op => op.elRu && op.ellaRu));
check("русские задания используют естественные операторы", CAPSULE_OPERATORS.map(op => op.taskRu).join("|") === "я хочу|я могу|мне нужно");
check("у каждого действия есть цельное русское задание", CAPSULE_ACTIONS.every(action => action.taskRu && !action.taskRu.includes("  ")));

const gramatica = readFileSync(new URL("../src/Gramatica.jsx", import.meta.url), "utf8");
const shell = readFileSync(new URL("../src/SimuladorJugador.jsx", import.meta.url), "utf8");
const trainer = readFileSync(new URL("../src/ActionCapsules.jsx", import.meta.url), "utf8");
check("тренажёр встроен в каталог Gramática", gramatica.includes('id: "capsulas-a1"') && gramatica.includes('<ActionCapsules'));
check("прямой маршрут ?tema= проходит через оболочку приложения", shell.includes("if (deepTema)") && shell.includes("<Gramatica startTema={deepTema}"));
check("сетки операторов безопасны для узкого экрана", trainer.includes('repeat(3, minmax(0, 1fr))') && trainer.includes('overflowWrap: "anywhere"'));
check("старое общее поле third не осталось в интерфейсе", !trainer.includes("operator.third"));

if (failed) {
  console.error(`\n🔴 Провалов: ${failed}\n`);
  process.exit(1);
}
console.log("\n🟢 Первый этаж целостен и готов к сборке.\n");
