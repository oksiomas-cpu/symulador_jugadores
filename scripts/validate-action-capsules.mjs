import {
  CAPSULE_ACTIONS,
  CAPSULE_OPERATORS,
  CAPSULE_STORIES,
  capsulePhrase,
} from "../src/actionCapsulesData.js";
import { QUERER_DIALOGUES, QUERER_INTRO, QUERER_REVIEW } from "../src/quererDialogueData.js";
import { PODER_DIALOGUES, PODER_INTRO, PODER_REVIEW } from "../src/poderDialogueData.js";
import { CAPSULE_LINE, QUERER_CAPSULE_1, QUERER_CAPSULE_1_STEPS, QUERER_PRESENT } from "../src/quererCapsule1Data.js";
import { PODER_CAPSULE_1, PODER_CAPSULE_1_STEPS, PODER_PRESENT } from "../src/poderCapsule1Data.js";
import { TENER_QUE_CAPSULE_1, TENER_QUE_CAPSULE_1_STEPS, TENER_QUE_PRESENT } from "../src/tenerQueCapsule1Data.js";
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

check("Капсула 2 содержит ровно 10 диалогов", QUERER_DIALOGUES.length === 10);
check("ID диалогов Капсулы 2 уникальны", new Set(QUERER_DIALOGUES.map(x => x.id)).size === QUERER_DIALOGUES.length);
check("каждый диалог собирает законченную реплику", QUERER_DIALOGUES.every(x => x.answerTokens?.length >= 3 && x.answerTokens.length === x.layers?.length));
check("опрос Капсулы 2 содержит 10 смысловых вопросов", QUERER_REVIEW.length === 10);
check("каждый вопрос связан с существующим диалогом", QUERER_REVIEW.every(x => QUERER_DIALOGUES.some(d => d.id === x.sourceId)));
check("в каждом вопросе один точный ответ", QUERER_REVIEW.every(x => x.options?.length === 3 && x.options.filter(option => option === x.answer).length === 1));
const capsule2Text = JSON.stringify({ intro: QUERER_INTRO, dialogues: QUERER_DIALOGUES, review: QUERER_REVIEW });
check("в Капсуле 2 нет русского перевода", !/[А-Яа-яЁё]/.test(capsule2Text));

// Регресс 29.08 (найден Оксаной живьём): реплика ДО вопроса не должна дословно
// совпадать с готовым ответом — иначе игрок собирает уже показанную фразу, а
// не отвечает на заданный вопрос (баг диалогов DAR и GUARDAR в poder-2).
function beforeDoesNotLeakAnswer(dialogues) {
  return dialogues.every(d => {
    const answer = d.answerTokens.join(" ").trim();
    return d.before.every(line => line.text.trim() !== answer);
  });
}
check("в репликах до ответа QUERER-2 готовый ответ не показан заранее", beforeDoesNotLeakAnswer(QUERER_DIALOGUES));

check("линейка содержит 16 капсул", CAPSULE_LINE.length === 16);
check("в линейке ровно по две капсулы на оператор", new Set(CAPSULE_LINE.map(x => x.operator)).size === 8 && [...new Set(CAPSULE_LINE.map(x => x.operator))].every(op => CAPSULE_LINE.filter(x => x.operator === op).length === 2));
check("Капсула 1 — QUERER + ABRIR LA PUERTA", QUERER_CAPSULE_1.id === "querer-1" && QUERER_CAPSULE_1.linkTitle === "QUERER + ABRIR LA PUERTA");
check("Капсула 1 проходит смысл, диалог, смену персонажа и собственную реплику", ["meaning", "dialogue", "speaker", "own-line"].every(id => QUERER_CAPSULE_1_STEPS.some(x => x.id === id)));
check("объект LA PUERTA не пропущен в репликах Капсулы 1", QUERER_CAPSULE_1_STEPS.filter(x => x.answer && x.id !== "meaning").every(x => /la puerta/i.test(x.answer) || x.kind === "form"));
check("Presente QUERER содержит шесть лиц", QUERER_PRESENT.map(x => x.form).join("|") === "quiero|quieres|quiere|queremos|queréis|quieren");

check("poder-1 помечена ready в линейке", CAPSULE_LINE.find(x => x.id === "poder-1")?.ready === true);
check("Капсула poder-1 — PODER + RECOGER LOS PAPELES", PODER_CAPSULE_1.id === "poder-1" && PODER_CAPSULE_1.linkTitle === "PODER + RECOGER LOS PAPELES");
check("Капсула poder-1 проходит смысл, диалог, смену персонажа и собственную реплику", ["meaning", "dialogue", "speaker", "own-line"].every(id => PODER_CAPSULE_1_STEPS.some(x => x.id === id)));
check("объект LOS PAPELES не пропущен в репликах poder-1", PODER_CAPSULE_1_STEPS.filter(x => x.answer && x.id !== "meaning").every(x => /los papeles/i.test(x.answer) || x.kind === "form"));
check("Presente PODER содержит шесть лиц", PODER_PRESENT.map(x => x.form).join("|") === "puedo|puedes|puede|podemos|podéis|pueden");

check("tener-que-1 помечена ready в линейке", CAPSULE_LINE.find(x => x.id === "tener-que-1")?.ready === true);
check("Капсула tener-que-1 — TENER QUE + USAR EL RELOJ", TENER_QUE_CAPSULE_1.id === "tener-que-1" && TENER_QUE_CAPSULE_1.linkTitle === "TENER QUE + USAR EL RELOJ");
check("Капсула tener-que-1 проходит смысл, диалог, смену персонажа и собственную реплику", ["meaning", "dialogue", "speaker", "own-line"].every(id => TENER_QUE_CAPSULE_1_STEPS.some(x => x.id === id)));
check("объект EL RELOJ не пропущен в репликах tener-que-1", TENER_QUE_CAPSULE_1_STEPS.filter(x => x.answer && x.id !== "meaning").every(x => /el reloj/i.test(x.answer) || x.kind === "form"));
check("Presente TENER QUE содержит шесть лиц", TENER_QUE_PRESENT.map(x => x.form).join("|") === "tengo|tienes|tiene|tenemos|tenéis|tienen");

check("poder-2 помечена ready в линейке", CAPSULE_LINE.find(x => x.id === "poder-2")?.ready === true);
check("Капсула poder-2 содержит ровно 10 диалогов", PODER_DIALOGUES.length === 10);
check("ID диалогов poder-2 уникальны", new Set(PODER_DIALOGUES.map(x => x.id)).size === PODER_DIALOGUES.length);
check("каждый диалог poder-2 собирает законченную реплику", PODER_DIALOGUES.every(x => x.answerTokens?.length >= 3 && x.answerTokens.length === x.layers?.length));
check("опрос poder-2 содержит 10 смысловых вопросов", PODER_REVIEW.length === 10);
check("каждый вопрос poder-2 связан с существующим диалогом", PODER_REVIEW.every(x => PODER_DIALOGUES.some(d => d.id === x.sourceId)));
check("в каждом вопросе poder-2 один точный ответ", PODER_REVIEW.every(x => x.options?.length === 3 && x.options.filter(option => option === x.answer).length === 1));
const capsule4Text = JSON.stringify({ intro: PODER_INTRO, dialogues: PODER_DIALOGUES, review: PODER_REVIEW });
check("в poder-2 нет русского перевода", !/[А-Яа-яЁё]/.test(capsule4Text));
check("в репликах до ответа poder-2 готовый ответ не показан заранее (баг DAR/GUARDAR)", beforeDoesNotLeakAnswer(PODER_DIALOGUES));

const gramatica = readFileSync(new URL("../src/Gramatica.jsx", import.meta.url), "utf8");
const shell = readFileSync(new URL("../src/SimuladorJugador.jsx", import.meta.url), "utf8");
const trainer = readFileSync(new URL("../src/ActionCapsules.jsx", import.meta.url), "utf8");
check("сюжетные капсулы удалены из каталога Gramática", !gramatica.includes('id: "capsulas-a1"') && !gramatica.includes("<ActionCapsules"));
check("Gramática содержит точный Presente QUERER", gramatica.includes('presente: { forms: ["quiero", "quieres", "quiere", "queremos", "queréis", "quieren"]'));
check("Gramática содержит точный Presente PODER", gramatica.includes('presente: { forms: ["puedo", "puedes", "puede", "podemos", "podéis", "pueden"]'));
check("прямой маршрут ?tema= проходит через оболочку приложения", shell.includes("if (deepTema)") && shell.includes("<Gramatica startTema={deepTema}"));
check("обычная ссылка ?capsula= открывает App-капсулу", shell.includes('get("capsula")') && shell.includes("<ActionCapsules"));
check("в Главе 4 две отдельные кнопки", shell.includes("Капсулы Дона Вербо →") && shell.includes("Тренировать роли →"));
check("сетки операторов безопасны для узкого экрана", trainer.includes('repeat(3, minmax(0, 1fr))') && trainer.includes('overflowWrap: "anywhere"'));
check("старое общее поле third не осталось в интерфейсе", !trainer.includes("operator.third"));
check("Капсула 2 подключена отдельным режимом", trainer.includes('mode === "intentions"') && trainer.includes("<Intentions"));
check("Капсула poder-1 подключена отдельным режимом", trainer.includes('mode === "poder-1"') && trainer.includes("<PoderOne"));
check("Капсула poder-2 подключена отдельным режимом", trainer.includes('mode === "poder-2"') && trainer.includes("<PoderIntentions"));
check("Капсула tener-que-1 подключена отдельным режимом", trainer.includes('mode === "tener-que-1"') && trainer.includes("<TenerQueOne"));
check("App хранит собственный прогресс линейки", trainer.includes('ciudad:operator-capsules:v1'));
check("App не обещает передать ошибки Don Verbo", !trainer.includes("Don Verbo volverá a preguntar"));
check("ошибка формы ведёт в точный Presente QUERER и PODER", shell.includes('"querer-1": "op-querer-presente"') && shell.includes('"poder-1": "op-poder-presente"'));
check("возврат из Gramática ведёт обратно в капсулу, а не на линейку", shell.includes("setDeepCapsule(capsuleGrammar.capsuleId)"));
check("«следующая капсула» считается из completed, а не из отдельного currentId (регресс 29.08)", trainer.includes("CAPSULE_LINE.findIndex(item => !progress.completed.includes(item.id))"));
check("просмотр уже пройденной капсулы не откатывает currentId назад", trainer.includes("previous.completed.includes(capsuleId) ? previous.currentId : capsuleId"));
check("внутри шага капсулы есть кнопка «Предыдущий шаг»", (trainer.match(/← Предыдущий шаг/g) || []).length === 3);

if (failed) {
  console.error(`\n🔴 Провалов: ${failed}\n`);
  process.exit(1);
}
console.log("\n🟢 Первый этаж целостен и готов к сборке.\n");
