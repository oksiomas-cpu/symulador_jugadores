/* ============================================================
   EL LIBRO MÁGICO DE DON VERBO — картридж cap4
   La Ciudad de los Sentidos · игра №4
   ------------------------------------------------------------
   v2 · 09.10.2026 — сюжет «план похищения» (La noche del Libro Mágico):
     у каждого предмета роль в похищении Книги; poder = ситуация предмета,
     tener que = шаг плана, querer = желание нарушителя.
     Источник истины: Notion «Матрица v2 · El Libro Mágico · план похищения»
     (3f44c9eb6e00816a818ef64fffc89abc). Старая матрица 27.08 — архив.
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
export const GAME4_SCHEMA_VERSION = "2.0.0";

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
    situationEs: "Sin la varilla dorada, las palabras del Libro no despiertan. Hace una semana Don Verbo la ha escondido en un lugar secreto.",
    situationRu: "Без золотого венчика слова Книги не просыпаются. Неделю назад Дон Вербо спрятал его в тайном месте.",
    canon: "El intruso quiere buscar la varilla, llevarla y usarla. Puede buscarla, llevarla, recogerla, guardarla, usarla y dársela a otra persona. No puede abrirla: no es una caja. Tiene que buscarla y usarla: sin la varilla, el Libro no despierta.",
    logicRu: "Венчик спрятан; без него Книга не оживает.",
    why: { querer: "Хочет найти, унести и использовать.", poder: "Маленький предмет: можно всё, кроме «открыть» — это не коробка.", tener_que: "Найти (он спрятан) и использовать — без венчика Книга не оживает." },
    canonYes: ["Q2", "Q3", "Q6", "P2", "P3", "P4", "P5", "P6", "P7", "T3", "T6"],
    fantasy: "Fantasía ha visto una caja dorada junto a la varilla y cree que es un estuche. Dice que el intruso quiere, puede y tiene que abrirlo, pero que no puede usarlo.",
    distortion: "Венчик принят за золотой футляр, который открывают.",
    fantasyYes: ["Q1", "Q2", "Q3", "P1", "P2", "P3", "P4", "P5", "P7", "T1", "T3"],
  },
  {
    key: "ingredientes_gramaticales", emoji: "✨", inf: "Los ingredientes gramaticales", ru: "грамматические ингредиенты",
    situationEs: "Sin ingredientes gramaticales, las recetas del Libro no funcionan. Don Verbo los ha escondido en la cocina, pero ya no están en su escondite.",
    situationRu: "Без грамматических ингредиентов рецепты Книги не работают. Дон Вербо спрятал их на кухне, но в тайнике их больше нет.",
    canon: "El intruso quiere llevar los ingredientes y dárselos a su cómplice. Puede llevarlos, buscarlos, recogerlos, guardarlos, usarlos y dárselos a otra persona. No puede abrirlos. Tiene que buscarlos y guardarlos en un lugar seguro: sin ellos, el Libro no sirve.",
    logicRu: "Ингредиенты спрятаны; их находят и укрывают — без них Книга бесполезна.",
    why: { querer: "Хочет унести и отдать сообщнику.", poder: "Всё, кроме «открыть».", tener_que: "Найти (они спрятаны) и укрыть — без них Книга бесполезна." },
    canonYes: ["Q2", "Q7", "P2", "P3", "P4", "P5", "P6", "P7", "T3", "T5"],
    fantasy: "Fantasía cree que los ingredientes ya están preparados para una entrega. Dice que el intruso no tiene que buscarlos: quiere y tiene que llevarlos y dárselos a otra persona.",
    distortion: "Спрятанные ингредиенты приняты за готовую посылку.",
    fantasyYes: ["Q2", "Q7", "P2", "P4", "P5", "P6", "P7", "T2", "T7"],
  },
  {
    key: "cuenco_vacio", emoji: "🥣", inf: "El cuenco vacío", ru: "пустая чаша",
    situationEs: "El cuenco de cristal está en su sitio, en la cocina. Está limpio y vacío.",
    situationRu: "Хрустальная чаша на своём месте, на кухне. Чистая и пустая.",
    canon: "El intruso quiere el cuenco: quiere guardarlo y usarlo para sus palabras. Puede llevarlo, recogerlo, guardarlo, usarlo y dárselo a otra persona. No puede abrirlo ni buscarlo: está abierto y a la vista. Pero no tiene que hacer nada con él: no es parte del plan.",
    logicRu: "Чашу он хочет себе, но по плану она не нужна.",
    why: { querer: "Хочет себе: спрятать и использовать.", poder: "Чаша на виду и открыта — искать и открывать нечего.", tener_que: "По плану чаша не нужна вообще — ни одного «надо»." },
    canonYes: ["Q5", "Q6", "P2", "P4", "P5", "P6", "P7"],
    fantasy: "Fantasía ha visto una tapa de cristal y cree que el cuenco es una caja cerrada. Dice que el intruso quiere, puede y tiene que abrirla, pero que no puede usarla.",
    distortion: "Открытая чаша принята за закрытую хрустальную коробку.",
    fantasyYes: ["Q1", "Q5", "P1", "P2", "P4", "P5", "P7", "T1"],
  },
  {
    key: "bandeja", emoji: "🍽️", inf: "La bandeja", ru: "поднос",
    situationEs: "En la cocina hay una bandeja grande con tapa. Esta mañana un ayudante la ha sacado del palacio. Ha dicho: «Hoy pesa mucho».",
    situationRu: "На кухне большой поднос с крышкой. Сегодня утром помощник вынес его из дворца. Сказал: «Сегодня он очень тяжёлый».",
    canon: "El intruso quiere llevar la bandeja y dársela a alguien. Puede llevarla, recogerla, guardarla, usarla y dársela a otra persona. No puede buscarla: está a la vista en la cocina. Y no puede abrirla: no es una caja, la tapa solo está encima. Tiene que usarla —el Libro va debajo de la tapa— y dársela al ayudante. El ayudante la saca del palacio y no sabe nada.",
    logicRu: "Под крышкой подноса Книгу выносят из дворца руками ничего не знающего помощника.",
    why: { querer: "Хочет унести и передать.", poder: "Поднос на виду на кухне — искать не нужно; открыть — нельзя.", tener_que: "Спрятать Книгу под крышкой и отдать поднос помощнику — тот вынесет его, ничего не зная." },
    canonYes: ["Q2", "Q7", "P2", "P4", "P5", "P6", "P7", "T6", "T7"],
    fantasy: "Fantasía cree que es la bandeja personal de Don Verbo. Dice que el intruso no quiere dársela a nadie: solo quiere guardarla, y tiene que usarla y guardarla en su sitio.",
    distortion: "Поднос принят за личный поднос Дона Вербо, который возвращают на место.",
    fantasyYes: ["Q5", "P2", "P4", "P5", "P6", "P7", "T5", "T6"],
  },
  {
    key: "papeles_suelo", emoji: "📄", inf: "Los papeles del suelo", ru: "бумаги с пола",
    situationEs: "En el suelo del despacho hay papeles. Alguien ha recogido muchos, pero no todos.",
    situationRu: "На полу в кабинете бумаги. Кто-то собрал много, но не все.",
    canon: "Al abrir la caja, unos papeles se han caído al suelo. El intruso quiere recogerlos y guardarlos. Puede llevarlos, buscarlos, recogerlos, guardarlos, usarlos y dárselos a otra persona. No puede abrirlos: son hojas sueltas. Tiene que recogerlos y guardarlos: los papeles en el suelo son una huella.",
    logicRu: "Бумаги на полу — след; их собирают и убирают.",
    why: { querer: "Хочет собрать и убрать.", poder: "Отдельные листы: всё, кроме «открыть».", tener_que: "Собрать и убрать — бумаги на полу выдают его." },
    canonYes: ["Q4", "Q5", "P2", "P3", "P4", "P5", "P6", "P7", "T4", "T5"],
    fantasy: "Fantasía cree que los papeles son un expediente cerrado. Dice que el intruso quiere, puede y tiene que abrirlo, pero que no tiene que recoger nada del suelo.",
    distortion: "Россыпь бумаг принята за закрытое досье.",
    fantasyYes: ["Q1", "Q5", "P1", "P2", "P3", "P5", "P6", "P7", "T1", "T5"],
  },
  {
    key: "documentos_numerados", emoji: "📋", inf: "Los documentos numerados", ru: "пронумерованные документы",
    situationEs: "Los documentos numerados están en una caja cerrada. Uno tiene el número de la receta más importante del Libro.",
    situationRu: "Пронумерованные документы лежат в закрытой коробке. На одном — номер самого важного рецепта Книги.",
    canon: "El intruso quiere abrir los documentos, buscar el número y usarlo. Puede abrirlos, llevarlos, buscarlos, guardarlos, usarlos y dárselos a otra persona. No puede recogerlos: no están en el suelo. Tiene que abrirlos y buscar el número de la receta.",
    logicRu: "Коробку открывают и ищут в ней номер рецепта.",
    why: { querer: "Хочет открыть, найти номер и воспользоваться им.", poder: "Документы в коробке, не на полу — поднимать нечего.", tener_que: "Открыть коробку и найти нужный номер." },
    canonYes: ["Q1", "Q3", "Q6", "P1", "P2", "P3", "P5", "P6", "P7", "T1", "T3"],
    fantasy: "Fantasía cree que no son documentos en una caja, sino hojas sueltas en el suelo. Dice que el intruso no tiene que abrirlos: quiere y tiene que recogerlos.",
    distortion: "Документы в коробке приняты за листы на полу.",
    fantasyYes: ["Q3", "Q4", "Q6", "P2", "P3", "P4", "P5", "P6", "P7", "T3", "T4"],
  },
  {
    key: "lapiz_rojo", emoji: "✏️", inf: "El lápiz rojo", ru: "красный карандаш",
    situationEs: "Debajo del armario del despacho hay un lápiz rojo. En uno de los documentos hay una pequeña marca roja.",
    situationRu: "Под шкафом в кабинете лежит красный карандаш. На одном из документов — маленькая красная метка.",
    canon: "Esta noche el lápiz rojo se ha caído debajo del armario. El intruso quiere recogerlo y usarlo. Puede llevarlo, buscarlo, recogerlo, guardarlo, usarlo y dárselo a otra persona. No puede abrirlo. Tiene que buscarlo, recogerlo y usarlo para marcar la página de la receta.",
    logicRu: "Карандаш упал; его находят, поднимают и метят им страницу рецепта.",
    why: { querer: "Хочет поднять и поставить метку.", poder: "Обычный карандаш: всё, кроме «открыть».", tener_que: "Найти под шкафом, поднять и пометить страницу рецепта." },
    canonYes: ["Q4", "Q6", "P2", "P3", "P4", "P5", "P6", "P7", "T3", "T4", "T6"],
    fantasy: "Fantasía ha visto una pieza roja en una cerradura y cree que el lápiz es una llave. Dice que el intruso quiere, puede y tiene que abrir algo con él, pero que no puede usarlo para escribir.",
    distortion: "Карандаш принят за ключ.",
    fantasyYes: ["Q1", "Q4", "P1", "P2", "P3", "P4", "P5", "P7", "T1", "T3", "T4"],
  },
  {
    key: "lamparas", emoji: "💡", inf: "Las lámparas", ru: "лампы",
    situationEs: "Las lámparas del despacho están en la pared. Son grandes y no se mueven. A las dos, el guardia ha visto una luz, solo un momento.",
    situationRu: "Лампы в кабинете — в стене. Они большие, их не сдвинуть. В два часа охранник видел свет, всего на мгновение.",
    canon: "El intruso no quiere usar las lámparas: con luz, el guardia puede verlo. Pero puede buscarlas en la oscuridad y usarlas. Y tiene que usarlas un momento: sin luz no puede leer el número de la receta. No puede llevarlas, recogerlas, guardarlas ni dárselas a nadie: están en la pared.",
    logicRu: "Света он не хочет, но на минуту включить лампы приходится.",
    why: { querer: "Света он не хочет: его увидят.", poder: "Лампы в стене: найти в темноте и включить — да; унести — нет.", tener_que: "На минуту включить всё же придётся: без света номер рецепта не прочитать." },
    canonYes: ["P3", "P6", "T6"],
    fantasy: "Fantasía cree que son linternas pequeñas. Dice que el intruso quiere, puede y tiene que llevarlas, y que quiere y puede dárselas a otra persona.",
    distortion: "Настенные лампы приняты за маленькие фонарики.",
    fantasyYes: ["Q2", "Q7", "P2", "P3", "P6", "P7", "T2", "T6"],
  },
  {
    key: "puerta_principal", emoji: "🚪", inf: "La puerta principal", ru: "главная дверь",
    situationEs: "La puerta principal está cerrada. Es grande y pesada. El guardia la vigila toda la noche.",
    situationRu: "Главная дверь закрыта. Она большая и тяжёлая. Охранник сторожит её всю ночь.",
    canon: "El intruso quiere abrir la puerta principal. Puede abrirla y usarla para entrar. Tiene que abrirla: sin la puerta abierta no hay plan. No puede llevarla, buscarla, recogerla, guardarla ni dársela a nadie: es una puerta.",
    logicRu: "Дверь закреплена: её открывают и проходят через неё. Без открытой двери плана нет.",
    why: { querer: "Он хочет одного — открыть дверь.", poder: "Дверь закреплена: открыть её и пройти — да; унести, поднять, спрятать, передать — нет.", tener_que: "Без открытой двери плана нет: открыть — обязательно." },
    canonYes: ["Q1", "P1", "P6", "T1"],
    fantasy: "Fantasía ha visto un panel de madera en el pasillo y cree que es la puerta. Dice que el intruso quiere, puede y tiene que llevarla, y que quiere y puede dársela a otra persona.",
    distortion: "Дверь принята за переносную деревянную панель.",
    fantasyYes: ["Q1", "Q2", "Q7", "P1", "P2", "P6", "P7", "T1", "T2"],
  },
  {
    key: "libro_recetas", emoji: "📖", inf: "El libro de recetas", ru: "книга рецептов",
    situationEs: "El Libro Mágico de recetas vive en la vitrina del despacho. Es grande y antiguo. Esta mañana la vitrina está vacía.",
    situationRu: "Волшебная книга рецептов живёт в витрине кабинета. Она большая и старинная. Сегодня утром витрина пуста.",
    canon: "El intruso quiere abrir el Libro, llevarlo, guardarlo y usarlo para crear sus palabras. Puede abrirlo, llevarlo, guardarlo, usarlo y dárselo a otra persona. No puede buscarlo ni recogerlo: sabe dónde está y no está en el suelo. Esta noche solo tiene que llevarlo y guardarlo en un lugar seguro. Usarlo, después.",
    logicRu: "Цель похищения. Этой ночью Книгу только выносят и прячут; читать её — потом.",
    why: { querer: "Хочет многого: открыть, унести, спрятать и творить по ней слова.", poder: "Книга в витрине: искать и поднимать с пола не нужно.", tener_que: "Этой ночью — только вынести и спрятать. Открывать и творить — потом." },
    canonYes: ["Q1", "Q2", "Q5", "Q6", "P1", "P2", "P5", "P6", "P7", "T2", "T5"],
    fantasy: "Fantasía cree que es una copia sellada de exposición, fija en su mesa. Dice que el intruso no quiere, no puede ni tiene que abrirla ni llevarla; solo quiere guardarla y usarla como modelo.",
    distortion: "Рабочая Книга принята за запечатанную выставочную копию.",
    fantasyYes: ["Q5", "Q6", "P5", "P6", "P7", "T5"],
  },
  {
    key: "llave_dorada", emoji: "🗝️", inf: "La llave dorada", ru: "золотой ключ",
    situationEs: "La llave dorada abre la vitrina del Libro. Está en el bolsillo de Don Verbo, como siempre. Todo el palacio sabe dónde está.",
    situationRu: "Золотой ключ открывает витрину Книги. Он, как всегда, в кармане Дона Вербо. Весь дворец знает, где он.",
    canon: "El intruso quiere usar la llave. Puede llevarla, guardarla, usarla y dársela a otra persona. No puede buscarla ni recogerla: no está perdida y no está en el suelo. Tiene que usarla para abrir la vitrina y después guardarla otra vez en el bolsillo de Don Verbo. Así nadie ve nada.",
    logicRu: "Ключ не потерян: его используют для витрины и незаметно возвращают в карман.",
    why: { querer: "Ему нужна только его сила — использовать ключ.", poder: "Ключ не потерян и не на полу: искать и поднимать нечего. Нести, убрать, использовать, передать — можно.", tener_que: "Открыть ключом витрину и вернуть ключ в карман, чтобы никто не заметил." },
    canonYes: ["Q6", "P2", "P5", "P6", "P7", "T5", "T6"],
    fantasy: "Fantasía cree que la llave es una ficha del guardia para una entrega. Dice que el intruso no quiere ni tiene que usarla: solo quiere y tiene que dársela a otra persona.",
    distortion: "Ключ принят за жетон охранника для передачи.",
    fantasyYes: ["Q7", "P2", "P5", "P6", "P7", "T7"],
  },
  {
    key: "reloj_palacio", emoji: "🕰️", inf: "El reloj del palacio", ru: "часы дворца",
    situationEs: "El reloj del palacio está en la pared del pasillo. Tiene una pequeña puerta de cristal. Esta mañana la puerta está abierta.",
    situationRu: "Дворцовые часы висят на стене в коридоре. У них маленькая стеклянная дверца. Сегодня утром она открыта.",
    canon: "El intruso quiere usar el reloj para saber la hora. Puede buscarlo, abrir su puerta de cristal y usarlo. Tiene que abrirlo: detrás del cristal Don Verbo ha escondido la varilla. Y tiene que usarlo: a las tres cambia el guardia. No puede llevarlo, recogerlo, guardarlo ni dárselo a nadie.",
    logicRu: "За стеклом часов спрятан венчик; по часам он ловит смену охраны.",
    why: { querer: "Хочет только узнать время.", poder: "Часы на стене: найти, открыть дверцу, посмотреть время — да; снять и унести — нет.", tener_que: "Открыть — за стеклом спрятан венчик; посмотреть время — в три меняется охрана." },
    canonYes: ["Q6", "P1", "P3", "P6", "T1", "T6"],
    fantasy: "Fantasía cree que es un reloj de bolsillo. Dice que el intruso no quiere usarlo: solo quiere y tiene que llevárselo.",
    distortion: "Настенные часы приняты за карманные.",
    fantasyYes: ["Q2", "P1", "P2", "P3", "P6", "T2"],
  },
  {
    key: "lupa", emoji: "🔍", inf: "La lupa", ru: "лупа",
    situationEs: "La lupa de Don Verbo está sobre la mesa, a la vista de todos. Las letras del Libro son muy, muy pequeñas.",
    situationRu: "Лупа Дона Вербо лежит на столе, у всех на виду. Буквы в Книге очень-очень мелкие.",
    canon: "El intruso quiere recoger la lupa y usarla. Puede llevarla, recogerla, guardarla, usarla y dársela a otra persona. No puede buscarla: está a la vista. Tiene que llevarla al despacho y usarla: sin lupa no puede leer las letras pequeñas del Libro.",
    logicRu: "Лупа на виду; её несут в кабинет, чтобы прочитать мелкие буквы.",
    why: { querer: "Хочет взять и использовать.", poder: "Лупа на виду — искать нечего; открыть нельзя.", tener_que: "Отнести в кабинет и прочитать через неё мелкие буквы." },
    canonYes: ["Q4", "Q6", "P2", "P4", "P5", "P6", "P7", "T2", "T6"],
    fantasy: "Fantasía cree que la lupa es un juguete roto de los niños. Dice que el intruso no puede usarla: solo quiere recogerla, y quiere y tiene que dársela a un niño.",
    distortion: "Лупа принята за сломанную детскую игрушку.",
    fantasyYes: ["Q4", "Q7", "P2", "P4", "P5", "P7", "T7"],
  },
  {
    key: "sobre_lacrado", emoji: "✉️", inf: "El sobre lacrado", ru: "запечатанный конверт",
    situationEs: "En la mesa hay un sobre lacrado con cera roja. No tiene nombre. No es para Don Verbo.",
    situationRu: "На столе запечатанный конверт с красным сургучом. На нём нет имени. Он не для Дона Вербо.",
    canon: "El intruso solo quiere dar el sobre a otra persona. Puede abrirlo, llevarlo, buscarlo, recogerlo, guardarlo y darlo, pero no puede usarlo: el mensaje no es para él. Tiene que llevarlo y dárselo a su cómplice.",
    logicRu: "Записка для сообщника: её не используют, а относят и передают.",
    why: { querer: "Хочет одного — передать.", poder: "Можно всё, кроме «использовать»: послание не для него.", tener_que: "Отнести и передать сообщнику." },
    canonYes: ["Q7", "P1", "P2", "P3", "P4", "P5", "P7", "T2", "T7"],
    fantasy: "Fantasía cree que el sobre ya está abierto y que dentro hay un mapa del palacio. Dice que el intruso no tiene que abrirlo ni darlo: quiere usarlo y tiene que llevarlo y usarlo.",
    distortion: "Запечатанный конверт принят за уже открытую карту дворца.",
    fantasyYes: ["Q6", "P2", "P3", "P4", "P5", "P6", "P7", "T2", "T6"],
  },
  {
    key: "sombra_sala", emoji: "👤", inf: "La sombra junto a la Sala", ru: "тень возле Зала",
    situationEs: "El ayudante más joven ha visto una sombra en el jardín, junto a la Sala. Una sombra que espera.",
    situationRu: "Самый младший помощник видел в саду, возле Зала, тень. Тень, которая ждёт.",
    canon: "La sombra no es un objeto: es el cómplice, que espera en la oscuridad. El intruso quiere, puede y tiene que buscarla. No puede abrirla, llevarla, recogerla, guardarla, usarla ni dársela a nadie.",
    logicRu: "Тень — сообщник в темноте; её можно только искать.",
    why: { querer: "Ищет своего сообщника — и только.", poder: "Тень — не предмет: её можно только искать.", tener_que: "Найти сообщника в темноте — обязательно." },
    canonYes: ["Q3", "P3", "T3"],
    fantasy: "Fantasía cree que la sombra es una capa oscura en el jardín. Dice que el intruso quiere, puede y tiene que llevarla, y que quiere y puede recogerla.",
    distortion: "Тень принята за тёмный плащ.",
    fantasyYes: ["Q2", "Q3", "Q4", "P2", "P3", "P4", "T2", "T3"],
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
    situationEs: raw.situationEs,
    situationRu: raw.situationRu,
    why: raw.why,
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

// История дела для игры и тренировки «Думай как преступник» (v2, 09.10.2026).
// Только Presente и Pretérito Perfecto Compuesto. Аудио — запись Оксаны (когда будет готова).
export const GAME4_CASE_STORY = {
  title: "La noche del Libro Mágico",
  es: [
    "Esta mañana Don Verbo ha abierto la vitrina de su despacho. El Libro Mágico no está.",
    "—Alguien ha entrado esta noche —dice—. Alguien ha tenido un plan. Y para su plan ha necesitado cosas del palacio.",
    "Los detectives miran todo con atención.",
    "La puerta principal está cerrada. El guardia dice: «Nadie ha pasado». Pero en la cerradura hay una marca nueva.",
    "La llave dorada de la vitrina está en el bolsillo de Don Verbo, como siempre. Todo el palacio sabe dónde está.",
    "Las lámparas del despacho están en la pared y no se mueven. A las dos, el guardia ha visto una luz. Solo un momento.",
    "El reloj del palacio está en la pared del pasillo. Tiene una pequeña puerta de cristal. Esta mañana la puerta está abierta.",
    "La varilla dorada no está en la cocina. Hace una semana Don Verbo la ha escondido en un lugar secreto. Sin la varilla, las palabras del Libro no despiertan.",
    "En la mesa hay un sobre lacrado con cera roja. No tiene nombre. No es para Don Verbo.",
    "Los documentos numerados están en una caja cerrada. Uno tiene el número de la receta más importante del Libro.",
    "Debajo del armario hay un lápiz rojo. Y en uno de los documentos hay una pequeña marca roja.",
    "En el suelo hay papeles. Alguien ha recogido muchos, pero no todos.",
    "La lupa de Don Verbo está sobre la mesa, a la vista de todos. Las letras del Libro son muy, muy pequeñas.",
    "En la cocina hay una bandeja grande con tapa. Esta mañana un ayudante la ha sacado del palacio. Ha dicho: «Hoy pesa mucho».",
    "El cuenco de cristal está en su sitio. Está limpio y vacío.",
    "Los ingredientes gramaticales tampoco están. Don Verbo los ha escondido en la cocina, pero ya no están en su escondite.",
    "Y el ayudante más joven ha visto una sombra en el jardín, junto a la Sala. Una sombra que espera.",
    "Don Verbo mira a los detectives.",
    "—Con cada cosa, el intruso ha querido algo, ha podido algo y ha tenido que hacer algo. Pensad como él. ¿Qué quiere? ¿Qué puede? ¿Qué tiene que hacer? Así encontramos el Libro."
],
  ru: [
    "Сегодня утром Дон Вербо открыл витрину в своём кабинете. Волшебной книги нет.",
    "— Этой ночью кто-то вошёл, — говорит он. — У кого-то был план. И для этого плана ему понадобились вещи из дворца.",
    "Детективы внимательно осматривают всё вокруг.",
    "Главная дверь закрыта. Охранник говорит: «Никто не проходил». Но на замке — свежая отметина.",
    "Золотой ключ от витрины, как всегда, в кармане Дона Вербо. Весь дворец знает, где он.",
    "Лампы в кабинете — в стене, их не сдвинуть. В два часа охранник видел свет. Всего на мгновение.",
    "Дворцовые часы висят на стене в коридоре. У них маленькая стеклянная дверца. Сегодня утром дверца открыта.",
    "Золотого венчика на кухне нет. Неделю назад Дон Вербо спрятал его в тайном месте. Без венчика слова Книги не просыпаются.",
    "На столе лежит запечатанный конверт с красным сургучом. На нём нет имени. Он не для Дона Вербо.",
    "Пронумерованные документы лежат в закрытой коробке. На одном из них — номер самого важного рецепта Книги.",
    "Под шкафом лежит красный карандаш. А на одном из документов — маленькая красная метка.",
    "На полу бумаги. Кто-то собрал много, но не все.",
    "Лупа Дона Вербо лежит на столе, у всех на виду. Буквы в Книге очень-очень мелкие.",
    "На кухне — большой поднос с крышкой. Сегодня утром помощник вынес его из дворца. Сказал: «Сегодня он очень тяжёлый».",
    "Хрустальная чаша на своём месте. Чистая и пустая.",
    "Грамматических ингредиентов тоже нет. Дон Вербо спрятал их на кухне, но в тайнике их больше нет.",
    "А самый младший помощник видел в саду, возле Зала, тень. Тень, которая ждёт.",
    "Дон Вербо смотрит на детективов.",
    "— С каждой вещью нарушитель чего-то хотел, что-то мог и что-то должен был сделать. Думайте как он. Чего он хочет? Что он может? Что ему нужно сделать? Так мы найдём Книгу."
],
};

// Тренировка «Думай как преступник»: ключ предмета по операторам,
// множества действий, отмеченных SÍ в каноне (без нового источника истины).
export function intrusoKey4(item) {
  const by = { querer: "Q", poder: "P", tener_que: "T" };
  return Object.fromEntries(Object.entries(by).map(([cat, prefix]) => [
    cat,
    ACTIONS4.filter((a) => item?.answers?.[`${prefix}${a.n}`] === "sí").map((a) => a.id),
  ]));
}
