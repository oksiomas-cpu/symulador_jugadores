// Капсула 7 · IR A. Та же механика, что у QuererOne/PoderOne/TenerQueOne —
// меняются только данные: сцена, глагол и объект. Архитектура
// ActionCapsules.jsx не переписывается.

export const IR_A_PRESENT = [
  { person: "yo", form: "voy" },
  { person: "tú", form: "vas" },
  { person: "él / ella / usted", form: "va" },
  { person: "nosotros / nosotras", form: "vamos" },
  { person: "vosotros / vosotras", form: "vais" },
  { person: "ellos / ellas / ustedes", form: "van" },
];

export const IR_A_CAPSULE_1 = {
  id: "ir-a-1",
  number: 7,
  operator: "IR A",
  title: "El libro de recetas",
  linkTitle: "IR A + LLEVAR EL LIBRO DE RECETAS",
  scene: {
    es: "El libro de recetas está en el banco junto a la salida. Tomás lo coge, pero todavía no ha salido de la sala.",
    ru: "Книга рецептов лежит на скамье у выхода. Томас берёт её, но ещё не вышел из комнаты.",
  },
  law: "Спрягается IR (+ a). Действие LLEVAR остаётся в infinitivo. Объект EL LIBRO DE RECETAS остаётся в сцене.",
};

export const IR_A_CAPSULE_1_STEPS = [
  {
    id: "meaning",
    kind: "choice",
    stage: "Смысл",
    prompt: "¿Quién va a llevar el libro de recetas?",
    ru: "Кто собирается отнести книгу рецептов?",
    options: ["Tomás", "Lucía", "Don Verbo"],
    answer: "Tomás",
  },
  {
    id: "dialogue",
    kind: "choice",
    stage: "Диалог",
    prompt: "Don Verbo: Tomás, ¿ya has llevado el libro de recetas?",
    ru: "Выбери полный ответ Томаса — он ещё не отнёс книгу, но уже собирается.",
    options: [
      "No, todavía no. Voy a llevar el libro de recetas.",
      "No, todavía no. Voy a llevo el libro de recetas.",
      "No, todavía no. Voy llevar el libro de recetas.",
    ],
    answer: "No, todavía no. Voy a llevar el libro de recetas.",
    grammarErrorOptions: ["No, todavía no. Voy a llevo el libro de recetas."],
  },
  {
    id: "speaker",
    kind: "choice",
    stage: "Свод Дона Вербо",
    prompt: "Don Verbo anota lo que ha visto.",
    ru: "Дон Вербо записывает итог — выбери верную запись.",
    options: [
      "Tomás va a llevar el libro de recetas al despacho, pero todavía no lo ha llevado.",
      "Tomás va llevar el libro de recetas al despacho, pero todavía no lo ha llevado.",
      "Tomás a va llevar el libro de recetas al despacho.",
    ],
    answer: "Tomás va a llevar el libro de recetas al despacho, pero todavía no lo ha llevado.",
  },
  {
    id: "yo",
    kind: "form",
    stage: "Форма · yo",
    prompt: "Yo ___ a llevar el libro de recetas.",
    answer: "voy",
  },
  {
    id: "affirmative",
    kind: "form",
    stage: "Утверждение · nosotros",
    prompt: "Nosotros ___ a llevar el libro de recetas.",
    answer: "vamos",
  },
  {
    id: "negative",
    kind: "form",
    stage: "Отрицание · ella",
    prompt: "Lucía no ___ a llevar el libro; se queda en la biblioteca.",
    answer: "va",
  },
  {
    id: "question",
    kind: "form",
    stage: "Вопрос · vosotros",
    prompt: "¿Vosotros ___ a llevar el libro de recetas?",
    answer: "vais",
  },
  {
    id: "full-answer",
    kind: "choice",
    stage: "Полный ответ",
    prompt: "¿Vosotros vais a llevar el libro de recetas?",
    ru: "Ответь полной репликой от лица группы.",
    options: [
      "Sí, vamos a llevar el libro de recetas.",
      "Sí, van a llevar el libro de recetas.",
      "Sí, vamos llevar el libro de recetas.",
    ],
    answer: "Sí, vamos a llevar el libro de recetas.",
  },
  {
    id: "own-line",
    kind: "own",
    stage: "Твоя реплика",
    prompt: "Скажи от своего лица, собираешься ли ты отнести книгу рецептов.",
    answer: "voy a llevar el libro de recetas",
  },
];
