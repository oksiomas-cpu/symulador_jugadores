// Капсула 11 · EMPEZAR A. Та же механика, что у предыдущих капсул —
// меняются только данные: сцена, глагол и объект. Архитектура
// ActionCapsules.jsx не переписывается.

export const EMPEZAR_A_PRESENT = [
  { person: "yo", form: "empiezo" },
  { person: "tú", form: "empiezas" },
  { person: "él / ella / usted", form: "empieza" },
  { person: "nosotros / nosotras", form: "empezamos" },
  { person: "vosotros / vosotras", form: "empezáis" },
  { person: "ellos / ellas / ustedes", form: "empiezan" },
];

export const EMPEZAR_A_CAPSULE_1 = {
  id: "empezar-a-1",
  number: 11,
  operator: "EMPEZAR A",
  title: "El baúl de las pistas",
  linkTitle: "EMPEZAR A + GUARDAR LAS PISTAS",
  scene: {
    es: "Sobre la mesa larga hay varias pistas de la Sala del Libro. Tomás coge la primera y la guarda en el baúl.",
    ru: "На длинном столе лежат несколько улик из комнаты Книги. Томас берёт первую и убирает её в сундук.",
  },
  law: "Спрягается EMPEZAR (+ a). Действие GUARDAR остаётся в infinitivo. Объект LAS PISTAS остаётся в сцене.",
};

export const EMPEZAR_A_CAPSULE_1_STEPS = [
  {
    id: "meaning",
    kind: "choice",
    stage: "Смысл",
    prompt: "¿Quién empieza a guardar las pistas?",
    ru: "Кто начинает убирать улики?",
    options: ["Tomás", "Lucía", "Don Verbo"],
    answer: "Tomás",
  },
  {
    id: "dialogue",
    kind: "choice",
    stage: "Диалог",
    prompt: "Don Verbo: Tomás, ¿ya has guardado todas las pistas?",
    ru: "Выбери полный ответ Томаса — он только начал, ещё не закончил.",
    options: [
      "No, todavía no. Empiezo a guardar las pistas.",
      "No, todavía no. Empiezo a guardo las pistas.",
      "No, todavía no. Empiezo guardar las pistas.",
    ],
    answer: "No, todavía no. Empiezo a guardar las pistas.",
    grammarErrorOptions: ["No, todavía no. Empiezo a guardo las pistas."],
  },
  {
    id: "speaker",
    kind: "choice",
    stage: "Свод Дона Вербо",
    prompt: "Don Verbo anota lo que ha visto.",
    ru: "Дон Вербо записывает итог — выбери верную запись.",
    options: [
      "Tomás empieza a guardar las pistas, pero todavía no las ha guardado todas.",
      "Tomás empieza guardar las pistas, pero todavía no las ha guardado todas.",
      "Tomás a empieza guardar las pistas.",
    ],
    answer: "Tomás empieza a guardar las pistas, pero todavía no las ha guardado todas.",
  },
  {
    id: "yo",
    kind: "form",
    stage: "Форма · yo",
    prompt: "Yo ___ a guardar las pistas.",
    answer: "empiezo",
  },
  {
    id: "affirmative",
    kind: "form",
    stage: "Утверждение · nosotros",
    prompt: "Nosotros ___ a guardar las pistas.",
    answer: "empezamos",
  },
  {
    id: "negative",
    kind: "form",
    stage: "Отрицание · ella",
    prompt: "Lucía no ___ a guardar las pistas todavía; solo mira.",
    answer: "empieza",
  },
  {
    id: "question",
    kind: "form",
    stage: "Вопрос · vosotros",
    prompt: "¿Vosotros ___ a guardar las pistas?",
    answer: "empezáis",
  },
  {
    id: "full-answer",
    kind: "choice",
    stage: "Полный ответ",
    prompt: "¿Vosotros empezáis a guardar las pistas?",
    ru: "Ответь полной репликой от лица группы.",
    options: [
      "Sí, empezamos a guardar las pistas.",
      "Sí, empiezan a guardar las pistas.",
      "Sí, empezamos guardar las pistas.",
    ],
    answer: "Sí, empezamos a guardar las pistas.",
  },
  {
    id: "own-line",
    kind: "own",
    stage: "Твоя реплика",
    prompt: "Скажи от своего лица, начинаешь ли ты убирать улики.",
    answer: "empiezo a guardar las pistas",
  },
];
