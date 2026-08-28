/* ============================================================
   EL LIBRO MÁGICO DE DON VERBO — картридж cap4
   La Ciudad de los Sentidos · игра №4
   ------------------------------------------------------------
   Утверждённый объём 28.08.2026:
     3 оператора: querer · poder · tener que
     7 действий: abrir · llevar · buscar · recoger · guardar · usar · dar
     21 вопрос Q1–Q7 · P1–P7 · T1–T7
     15 предметов с уникальными Canon/Fantasía

   Источник истины: Notion «Матрица 15 предметов · Canon/Fantasía
   · 21 вопрос», ревизия Cloud завершена 27.08.2026.
   Матрицу в коде не чинить: изменение ключа требует возврата к источнику.
   ============================================================ */

export const GAME4_ID = "ciudad_game_04_libro_magico";
export const GAME4_DISPLAY_NAME = "El Libro Mágico de Don Verbo";
export const GAME4_SCHEMA_VERSION = "1.0.0";

export const ACTIONS4 = [
  { n: 1, id: "abrir", ru: "открыть" },
  { n: 2, id: "llevar", ru: "отнести / перенести" },
  { n: 3, id: "buscar", ru: "искать" },
  { n: 4, id: "recoger", ru: "поднять / собрать" },
  { n: 5, id: "guardar", ru: "убрать / сохранить" },
  { n: 6, id: "usar", ru: "использовать" },
  { n: 7, id: "dar", ru: "передать" },
];

export const QUESTION_ORDER4 = [
  "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7",
  "P1", "P2", "P3", "P4", "P5", "P6", "P7",
  "T1", "T2", "T3", "T4", "T5", "T6", "T7",
];

const OPERATORS4 = [
  { prefix: "Q", cat: "querer", es: "QUIERE", ru: "ХОЧЕТ", form: "quiere", noForm: "no quiere", ruYes: "хочет", ruNo: "не хочет" },
  { prefix: "P", cat: "poder", es: "PUEDE", ru: "МОЖЕТ", form: "puede", noForm: "no puede", ruYes: "может", ruNo: "не может" },
  { prefix: "T", cat: "tener_que", es: "TIENE QUE", ru: "НУЖНО", form: "tiene que", noForm: "no tiene que", ruYes: "должен", ruNo: "не должен" },
];

export const CATS4 = [
  { id: "querer", icon: "❤️", es: "¿QUÉ QUIERE HACER?", ru: "ЧЕГО ХОЧЕТ" },
  { id: "poder", icon: "🔑", es: "¿QUÉ PUEDE HACER?", ru: "ЧТО МОЖЕТ" },
  { id: "tener_que", icon: "⚖️", es: "¿QUÉ TIENE QUE HACER?", ru: "ЧТО НУЖНО" },
];

export const QUESTIONS4 = OPERATORS4.flatMap((operator) => ACTIONS4.map((action) => {
  const id = `${operator.prefix}${action.n}`;
  const object = action.id === "dar" ? "la pista a otra persona" : "la pista";
  const ruObject = action.id === "dar" ? "улику другому человеку" : "улику";
  return {
    id,
    cat: operator.cat,
    operator: operator.cat,
    action: action.id,
    q: `¿El intruso ${operator.form} ${action.id} ${object}?`,
    ru: `Нарушитель ${operator.ruYes} ${action.ru} ${ruObject}?`,
    si: `Sí, el intruso ${operator.form} ${action.id} ${object}.`,
    no: `No, el intruso ${operator.noForm} ${action.id} ${object}.`,
    siRu: `Да, нарушитель ${operator.ruYes} ${action.ru} ${ruObject}.`,
    noRu: `Нет, нарушитель ${operator.ruNo} ${action.ru} ${ruObject}.`,
  };
}));

const QBY_ID4 = Object.fromEntries(QUESTIONS4.map((q) => [q.id, q]));
export const questionById4 = (id) => QBY_ID4[id];

function answers4(yesIds) {
  const yes = new Set(yesIds);
  return Object.fromEntries(QUESTION_ORDER4.map((id) => [id, yes.has(id) ? "sí" : "no"]));
}

function firstTrap4(canon, fantasy) {
  const id = QUESTION_ORDER4.find((qid) => canon[qid] !== fantasy[qid]);
  const q = QBY_ID4[id];
  return id && q ? { id, q: q.q, ru: q.ru, canon: canon[id], fant: fantasy[id] } : null;
}

const RAW_ITEMS4 = [
  {
    key: "varilla_dorada", emoji: "🪄", inf: "La varilla dorada", ru: "золотой венчик",
    canon: "El intruso sabe que la varilla está escondida en la Sala. Quiere buscarla, llevarla, guardarla y usarla. Puede recogerla y dársela a otra persona, pero tiene que buscarla, llevarla al taller, guardarla y usarla para activar las palabras.",
    logicRu: "Венчик скрыт; его нужно найти, перенести, сохранить и использовать. Его можно поднять и передать, но открывать нечего.",
    canonYes: ["Q2","Q3","Q5","Q6","P2","P3","P4","P5","P6","P7","T2","T3","T5","T6"],
    fantasy: "Fantasía ha visto una caja dorada junto a la varilla y cree que la pista es un estuche que el intruso quiere, puede y tiene que abrir. Por eso piensa que puede trasladarla y guardarla, pero no usarla como varilla.",
    distortion: "Предмет принят за открывающийся золотой футляр.",
    fantasyYes: ["Q1","Q2","Q3","Q5","Q6","P1","P2","P3","P4","P5","P7","T1","T2","T3","T5"],
  },
  {
    key: "ingredientes_gramaticales", emoji: "✨", inf: "Los ingredientes gramaticales", ru: "грамматические ингредиенты",
    canon: "El intruso quiere llevar, buscar, recoger, guardar y usar los ingredientes. Puede hacer todo eso y también dárselos a otra persona. Tiene que encontrarlos, recogerlos, llevarlos a la Cocina, guardarlos y usarlos antes de que nazcan las palabras.",
    logicRu: "Ингредиенты пропали; их необходимо искать, собрать, перенести, сохранить и использовать.",
    canonYes: ["Q2","Q3","Q4","Q5","Q6","P2","P3","P4","P5","P6","P7","T2","T3","T4","T5","T6"],
    fantasy: "Fantasía cree que los ingredientes ya están localizados y preparados para una entrega. Según su versión, el intruso no quiere ni puede ni tiene que buscarlos: quiere y tiene que dárselos a otra persona.",
    distortion: "Пропавшие ингредиенты приняты за уже найденную посылку.",
    fantasyYes: ["Q2","Q4","Q5","Q6","Q7","P2","P4","P5","P6","P7","T2","T4","T5","T6","T7"],
  },
  {
    key: "cuenco_vacio", emoji: "🥣", inf: "El cuenco vacío", ru: "пустая чаша",
    canon: "El intruso quiere llevar el cuenco, guardarlo y usarlo. Puede recogerlo, trasladarlo, guardarlo, usarlo y dárselo a otra persona. No tiene que abrirlo: solo tiene que usarlo para preparar la mezcla.",
    logicRu: "Чашу можно поднять, перенести, сохранить, использовать и передать; открывать её невозможно.",
    canonYes: ["Q2","Q5","Q6","P2","P4","P5","P6","P7","T6"],
    fantasy: "Fantasía ha visto una tapa de cristal y cree que el cuenco es una caja cerrada. Piensa que el intruso quiere, puede y tiene que abrirla, pero que no puede ni tiene que usarla para la mezcla.",
    distortion: "Открытая чаша принята за закрытый хрустальный контейнер.",
    fantasyYes: ["Q1","Q2","Q5","Q6","P1","P2","P4","P5","P7","T1"],
  },
  {
    key: "bandeja", emoji: "🍽️", inf: "La bandeja", ru: "поднос",
    canon: "El intruso quiere llevar, recoger, usar y dar la bandeja. Puede recogerla, guardarla, usarla y entregársela a otra persona. Tiene que llevarla a la Sala, usarla y dársela al ayudante encargado.",
    logicRu: "Поднос — переносимый служебный предмет: его несут, используют и передают.",
    canonYes: ["Q2","Q4","Q6","Q7","P2","P4","P5","P6","P7","T2","T6","T7"],
    fantasy: "Fantasía cree que la bandeja es una mesa fija. Por eso afirma que el intruso no quiere, no puede y no tiene que llevarla; en cambio quiere y tiene que guardarla en la Sala.",
    distortion: "Поднос принят за неподвижный стол.",
    fantasyYes: ["Q4","Q5","Q6","Q7","P4","P5","P6","P7","T5","T6","T7"],
  },
  {
    key: "papeles_suelo", emoji: "📄", inf: "Los papeles del suelo", ru: "бумаги с пола",
    canon: "El intruso quiere buscar, recoger y guardar los papeles. Puede buscarlos, llevarlos, recogerlos, guardarlos, usarlos y dárselos a otra persona. Tiene que recogerlos del suelo y guardarlos.",
    logicRu: "Разбросанные бумаги ищут, собирают с пола и убирают; их не открывают.",
    canonYes: ["Q3","Q4","Q5","P2","P3","P4","P5","P6","P7","T4","T5"],
    fantasy: "Fantasía cree que los papeles forman un expediente cerrado. Dice que el intruso quiere, puede y tiene que abrirlo, pero que no quiere ni puede recoger hojas del suelo.",
    distortion: "Россыпь бумаг принята за закрытое досье.",
    fantasyYes: ["Q1","Q3","Q5","P1","P2","P3","P5","P6","P7","T1","T5"],
  },
  {
    key: "documentos_numerados", emoji: "📋", inf: "Los documentos numerados", ru: "пронумерованные документы",
    canon: "El intruso quiere abrir, buscar, guardar y usar los documentos. Puede abrirlos, llevarlos, buscarlos, recogerlos, guardarlos y entregarlos, pero todavía no puede usarlos porque siguen sellados. Tiene que abrirlos y guardarlos; usarlos será posible solo cuando reciba permiso.",
    logicRu: "Документы нужно открыть и сохранить; использовать их пока нельзя, доступ к содержимому закрыт.",
    canonYes: ["Q1","Q3","Q5","Q6","P1","P2","P3","P4","P5","P7","T1","T5"],
    fantasy: "Fantasía cree que no son documentos cerrados, sino hojas sueltas. Por eso niega que haya que abrirlos y afirma que el intruso quiere y tiene que recogerlos.",
    distortion: "Закрытая пачка документов принята за отдельные листы.",
    fantasyYes: ["Q3","Q4","Q5","Q6","P2","P3","P4","P5","P7","T4","T5","T6"],
  },
  {
    key: "lapiz_rojo", emoji: "✏️", inf: "El lápiz rojo", ru: "красный карандаш",
    canon: "El intruso quiere llevar, buscar, guardar y usar el lápiz. Puede recogerlo, llevarlo, buscarlo, guardarlo, usarlo y dárselo a otra persona. Solo tiene que usarlo para marcar los documentos.",
    logicRu: "Карандаш ищут, переносят, сохраняют и используют; открывать его нельзя.",
    canonYes: ["Q2","Q3","Q5","Q6","P2","P3","P4","P5","P6","P7","T6"],
    fantasy: "Fantasía ha visto una pieza roja dentro de una cerradura y cree que el lápiz es una llave. Afirma que el intruso quiere, puede y tiene que abrir la pista, pero que no quiere ni tiene que usarla para escribir.",
    distortion: "Карандаш принят за ключ.",
    fantasyYes: ["Q1","Q2","Q3","Q5","P1","P2","P3","P4","P5","P6","P7","T1"],
  },
  {
    key: "lamparas", emoji: "💡", inf: "Las lámparas", ru: "лампы",
    canon: "El intruso quiere buscar y usar las lámparas. Puede localizarlas y usarlas para iluminar la Sala; tiene que usarlas durante la investigación. Están fijadas y no puede llevarlas, recogerlas ni entregarlas.",
    logicRu: "Лампы закреплены в Зале: их можно найти и использовать, но нельзя переносить.",
    canonYes: ["Q3","Q6","P3","P6","T6"],
    fantasy: "Fantasía cree que son linternas portátiles. Según su versión, el intruso quiere, puede y tiene que llevarlas, y además quiere y puede dárselas a otra persona.",
    distortion: "Настенные лампы приняты за переносные фонари.",
    fantasyYes: ["Q2","Q3","Q6","Q7","P2","P3","P6","P7","T2","T6"],
  },
  {
    key: "puerta_principal", emoji: "🚪", inf: "La puerta principal", ru: "главная дверь",
    canon: "El intruso quiere, puede y tiene que abrir la puerta. También quiere y puede buscarla y usarla como entrada. No puede llevarla, recogerla, guardarla ni dársela a nadie.",
    logicRu: "Дверь открывают и используют как вход; она неподвижна.",
    canonYes: ["Q1","Q3","Q6","P1","P3","P6","T1","T6"],
    fantasy: "Fantasía ha visto un panel desmontado y cree que la puerta es una pantalla portátil. Por eso añade que el intruso quiere, puede y tiene que llevarla, y que quiere y puede entregarla.",
    distortion: "Дверь принята за переносную декоративную панель.",
    fantasyYes: ["Q1","Q2","Q3","Q6","Q7","P1","P2","P3","P6","P7","T1","T2","T6"],
  },
  {
    key: "libro_recetas", emoji: "📖", inf: "El libro de recetas", ru: "книга рецептов",
    canon: "El intruso quiere abrir, llevar, buscar, guardar, usar y dar el libro. Puede hacer las siete acciones. Tiene que abrirlo, guardarlo y usarlo para encontrar la receta.",
    logicRu: "Книга — переносимый рабочий предмет: её открывают, ищут, хранят, используют и передают.",
    canonYes: ["Q1","Q2","Q3","Q5","Q6","Q7","P1","P2","P3","P4","P5","P6","P7","T1","T5","T6"],
    fantasy: "Fantasía cree que es una copia sellada de exposición. Dice que el intruso no quiere, no puede ni tiene que abrirla, y que tampoco quiere ni puede entregarla.",
    distortion: "Рабочая книга принята за запечатанный музейный экземпляр.",
    fantasyYes: ["Q2","Q3","Q5","Q6","P2","P3","P4","P5","P6","T5","T6"],
  },
  {
    key: "llave_dorada", emoji: "🗝️", inf: "La llave dorada", ru: "золотой ключ",
    canon: "El intruso quiere llevar, buscar, recoger, guardar y usar la llave. Puede hacer esas acciones y también dársela a otra persona. Tiene que buscarla, guardarla y usarla para acceder a la puerta.",
    logicRu: "Ключ нужно найти, сохранить и использовать; его можно поднять, перенести и передать.",
    canonYes: ["Q2","Q3","Q4","Q5","Q6","P2","P3","P4","P5","P6","P7","T3","T5","T6"],
    fantasy: "Fantasía cree que la llave ya está en el bolsillo del guardia y funciona como una ficha de entrega. Dice que no hay que recogerla y que el intruso quiere y tiene que dársela a otra persona, no usarla.",
    distortion: "Ключ принят за жетон передачи.",
    fantasyYes: ["Q2","Q3","Q5","Q7","P2","P3","P5","P6","P7","T3","T5","T7"],
  },
  {
    key: "reloj_palacio", emoji: "🕰️", inf: "El reloj del palacio", ru: "часы дворца",
    canon: "El intruso quiere buscar, guardar y usar el reloj. Puede abrir su caja, llevarlo si lo desmonta, buscarlo, guardarlo, usarlo y entregarlo. Tiene que guardarlo y usarlo para comprobar la hora.",
    logicRu: "Дворцовые часы можно обслужить и использовать; для переноса их нужно снять.",
    canonYes: ["Q3","Q5","Q6","P1","P2","P3","P5","P6","P7","T5","T6"],
    fantasy: "Fantasía cree que es un reloj de bolsillo roto. Por eso afirma que el intruso quiere y tiene que llevarlo, pero que no quiere, no puede ni tiene que usarlo.",
    distortion: "Настенные часы приняты за сломанные карманные.",
    fantasyYes: ["Q2","Q3","Q5","P1","P2","P3","P5","P7","T2","T5"],
  },
  {
    key: "lupa", emoji: "🔍", inf: "La lupa", ru: "лупа",
    canon: "El intruso quiere llevar, buscar, recoger, guardar y usar la lupa. Puede hacer esas acciones y también entregarla. Tiene que llevarla al lugar del caso, buscarla si desaparece y usarla para ver las huellas.",
    logicRu: "Лупа — переносимый инструмент расследования; её ищут, несут и используют.",
    canonYes: ["Q2","Q3","Q4","Q5","Q6","P2","P3","P4","P5","P6","P7","T2","T3","T6"],
    fantasy: "Fantasía cree que la lupa es una lente fija de una ventana. Dice que el intruso no quiere, no puede ni tiene que llevarla y que no quiere ni tiene que usarla.",
    distortion: "Ручная лупа принята за неподвижную оконную линзу.",
    fantasyYes: ["Q3","Q4","Q5","P3","P4","P5","P6","P7","T3"],
  },
  {
    key: "sobre_lacrado", emoji: "✉️", inf: "El sobre lacrado", ru: "запечатанный конверт",
    canon: "El intruso quiere abrir, llevar, buscar, guardar y dar el sobre. Puede realizar las siete acciones. Tiene que abrirlo, guardarlo y entregárselo a la persona indicada.",
    logicRu: "Запечатанный конверт открывают, сохраняют и передают адресату.",
    canonYes: ["Q1","Q2","Q3","Q5","Q7","P1","P2","P3","P4","P5","P6","P7","T1","T5","T7"],
    fantasy: "Fantasía cree que el sobre ya está abierto y contiene un mapa de trabajo. Niega que haya que abrirlo, pero afirma que el intruso quiere y tiene que usarlo.",
    distortion: "Запечатанный конверт принят за уже открытую рабочую карту.",
    fantasyYes: ["Q2","Q3","Q5","Q6","Q7","P2","P3","P4","P5","P6","P7","T5","T6","T7"],
  },
  {
    key: "sombra_sala", emoji: "👤", inf: "La sombra junto a la Sala", ru: "тень возле Зала",
    canon: "La sombra no es un objeto físico. El intruso solo quiere, puede y tiene que buscarla como rastro. No puede abrirla, llevarla, recogerla, guardarla, usarla ni dársela a nadie.",
    logicRu: "Тень — след, а не предмет: её можно только искать.",
    canonYes: ["Q3","P3","T3"],
    fantasy: "Fantasía cree que la sombra es una capa oscura abandonada. Según su versión, el intruso quiere, puede y tiene que llevarla, y además quiere y puede recogerla.",
    distortion: "Тень принята за физический плащ.",
    fantasyYes: ["Q2","Q3","Q4","P2","P3","P4","T2","T3"],
  },
];

export const ITEMS4 = RAW_ITEMS4.map((raw, index) => {
  const answers = answers4(raw.canonYes);
  const fantAns = answers4(raw.fantasyYes);
  return {
    key: raw.key,
    order: index + 1,
    target: true,
    emoji: raw.emoji,
    inf: raw.inf,
    ru: raw.ru,
    storyEs: raw.canon,
    storyRu: raw.logicRu,
    canonVer: raw.canon,
    dossier: [
      ["Canon", raw.canon],
      ["Логика", raw.logicRu],
      ["Fantasía искажает", raw.distortion],
    ],
    answers,
    fantVer: raw.fantasy,
    fantAns,
    distortion: raw.distortion,
    trap: firstTrap4(answers, fantAns),
  };
});

export const TARGETS4 = ITEMS4;
export const verbByKey4 = (key) => TARGETS4.find((item) => item.key === key);

export function fullAnswer4(qid, value) {
  const q = QBY_ID4[qid];
  if (!q) return "";
  return value === "sí" || value === true ? q.si : q.no;
}

export function fullAnswerRu4(qid, value) {
  const q = QBY_ID4[qid];
  if (!q) return "";
  return value === "sí" || value === true ? q.siRu : q.noRu;
}

export const BANK_NOTES4 = [
  "В капсуле спрягается только первый глагол; действие всегда остаётся в infinitivo.",
  "Sí/No не является конечной речевой формой: свидетель отвечает полной фразой банка.",
  "Один и тот же ID вопроса используется в приложении, подготовке Don Verbo и живой игре.",
];

export function answerKey4(item, version = "canon") {
  const source = version === "fantasy" ? item?.fantAns : item?.answers;
  return QUESTION_ORDER4.map((id) => source?.[id] === "sí" ? "1" : "0").join("");
}
