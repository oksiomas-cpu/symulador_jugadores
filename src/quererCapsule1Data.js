// Капсула 1 · QUERER. Эталонная связка: QUERER + ABRIR LA PUERTA.
// Контент хранится отдельно от интерфейса, чтобы следующие капсулы
// добавлялись данными, а не копированием движка.

export const QUERER_PRESENT = [
  { person: "yo", form: "quiero" },
  { person: "tú", form: "quieres" },
  { person: "él / ella / usted", form: "quiere" },
  { person: "nosotros / nosotras", form: "queremos" },
  { person: "vosotros / vosotras", form: "queréis" },
  { person: "ellos / ellas / ustedes", form: "quieren" },
];

export const QUERER_CAPSULE_1 = {
  id: "querer-1",
  number: 1,
  operator: "QUERER",
  title: "La puerta de las decisiones",
  linkTitle: "QUERER + ABRIR LA PUERTA",
  scene: {
    es: "La puerta principal está cerrada. Tomás quiere entrar en la Sala. Lucía escucha al otro lado.",
    ru: "Главная дверь закрыта. Томас хочет войти в Зал. Люсия слушает с другой стороны.",
  },
  law: "Спрягается QUERER. Действие ABRIR остаётся в infinitivo. Объект LA PUERTA остаётся в сцене.",
};

export const CAPSULE_LINE = [
  { id: "querer-1", operator: "QUERER", title: "La puerta de las decisiones", ready: true },
  { id: "querer-2", operator: "QUERER", title: "La Sala de las Intenciones", ready: true },
  { id: "poder-1", operator: "PODER", title: "Los papeles del suelo", ready: true },
  { id: "poder-2", operator: "PODER", title: "La Sala de las Posibilidades", ready: true },
    { id: "tener-que-1", operator: "TENER QUE", title: "El reloj detenido", ready: true },
  { id: "tener-que-2", operator: "TENER QUE", title: "Cápsula 2", ready: false },
  { id: "ir-a-1", operator: "IR A", title: "Cápsula 1", ready: false },
  { id: "ir-a-2", operator: "IR A", title: "Cápsula 2", ready: false },
  { id: "intentar-1", operator: "INTENTAR", title: "Cápsula 1", ready: false },
  { id: "intentar-2", operator: "INTENTAR", title: "Cápsula 2", ready: false },
  { id: "empezar-a-1", operator: "EMPEZAR A", title: "Cápsula 1", ready: false },
  { id: "empezar-a-2", operator: "EMPEZAR A", title: "Cápsula 2", ready: false },
  { id: "dejar-de-1", operator: "DEJAR DE", title: "Cápsula 1", ready: false },
  { id: "dejar-de-2", operator: "DEJAR DE", title: "Cápsula 2", ready: false },
  { id: "volver-a-1", operator: "VOLVER A", title: "Cápsula 1", ready: false },
  { id: "volver-a-2", operator: "VOLVER A", title: "Cápsula 2", ready: false },
];

export const QUERER_CAPSULE_1_STEPS = [
  {
    id: "meaning",
    kind: "choice",
    stage: "Смысл",
    prompt: "¿Quién quiere abrir la puerta?",
    ru: "Кто хочет открыть дверь?",
    options: ["Tomás", "Lucía", "Don Verbo"],
    answer: "Tomás",
  },
  {
    id: "dialogue",
    kind: "choice",
    stage: "Диалог",
    prompt: "Lucía: Tomás, ¿qué quieres hacer?",
    ru: "Выбери полный ответ Томаса.",
    options: ["Quiero abrir la puerta.", "Quiero abro.", "Abro querer la puerta."],
    answer: "Quiero abrir la puerta.",
    grammarErrorOptions: ["Quiero abro."],
  },
  {
    id: "speaker",
    kind: "choice",
    stage: "Смена персонажа",
    prompt: "Ahora habla Lucía: ella no tiene esa intención.",
    ru: "Теперь говорит Люсия: она не хочет открывать дверь.",
    options: ["No quiero abrir la puerta.", "No quiere abrir la puerta.", "No quiere abre la puerta."],
    answer: "No quiere abrir la puerta.",
    grammarErrorOptions: ["No quiere abre la puerta."],
  },
  {
    id: "yo",
    kind: "form",
    stage: "Форма · yo",
    prompt: "Yo ___ abrir la puerta.",
    answer: "quiero",
  },
  {
    id: "affirmative",
    kind: "form",
    stage: "Утверждение · nosotros",
    prompt: "Nosotros ___ abrir la puerta.",
    answer: "queremos",
  },
  {
    id: "negative",
    kind: "form",
    stage: "Отрицание · ella",
    prompt: "Ella no ___ abrir la puerta.",
    answer: "quiere",
  },
  {
    id: "question",
    kind: "form",
    stage: "Вопрос · vosotros",
    prompt: "¿Vosotros ___ abrir la puerta?",
    answer: "queréis",
  },
  {
    id: "full-answer",
    kind: "choice",
    stage: "Полный ответ",
    prompt: "¿Vosotros queréis abrir la puerta?",
    ru: "Ответь полной репликой от лица группы.",
    options: ["Sí, queremos abrir la puerta.", "Sí, quieren abrir.", "Sí, queremos la puerta."],
    answer: "Sí, queremos abrir la puerta.",
  },
  {
    id: "own-line",
    kind: "own",
    stage: "Твоя реплика",
    prompt: "Скажи от своего лица, что ты хочешь открыть дверь.",
    answer: "quiero abrir la puerta",
  },
];
