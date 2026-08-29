// Капсула 3 · PODER. Эталонная связка: PODER + RECOGER LOS PAPELES.
// Повторяет механику Капсулы 1 (QUERER, quererCapsule1Data.js) — меняются
// только данные: сцена, глагол и объект. Архитектура ActionCapsules.jsx
// не переписывается.

export const PODER_PRESENT = [
  { person: "yo", form: "puedo" },
  { person: "tú", form: "puedes" },
  { person: "él / ella / usted", form: "puede" },
  { person: "nosotros / nosotras", form: "podemos" },
  { person: "vosotros / vosotras", form: "podéis" },
  { person: "ellos / ellas / ustedes", form: "pueden" },
];

export const PODER_CAPSULE_1 = {
  id: "poder-1",
  number: 3,
  operator: "PODER",
  title: "Los papeles del suelo",
  linkTitle: "PODER + RECOGER LOS PAPELES",
  scene: {
    es: "Los papeles están esparcidos por el suelo delante de la Sala del Libro. Tomás tiene la mano vendada. Lucía puede ayudar, pero no quiere.",
    ru: "Бумаги рассыпаны по полу перед комнатой Книги. У Томаса перевязана рука. Люсия может помочь, но не хочет.",
  },
  law: "Спрягается PODER. Действие RECOGER остаётся в infinitivo. Объект LOS PAPELES остаётся в сцене.",
};

export const PODER_CAPSULE_1_STEPS = [
  {
    id: "meaning",
    kind: "choice",
    stage: "Смысл",
    prompt: "¿Quién no puede recoger los papeles?",
    ru: "Кто не может собрать бумаги?",
    options: ["Tomás", "Lucía", "Don Verbo"],
    answer: "Tomás",
  },
  {
    id: "dialogue",
    kind: "choice",
    stage: "Диалог",
    prompt: "Don Verbo: Tomás, ¿puedes recoger los papeles?",
    ru: "Выбери полный ответ Томаса.",
    options: [
      "No, no puedo recoger los papeles.",
      "No, no puedo recojo los papeles.",
      "Recojo no puedo los papeles.",
    ],
    answer: "No, no puedo recoger los papeles.",
    grammarErrorOptions: ["No, no puedo recojo los papeles."],
  },
  {
    id: "speaker",
    kind: "choice",
    stage: "Смена персонажа",
    prompt: "Ahora habla Don Verbo sobre Lucía: ella sí puede, pero no quiere.",
    ru: "Теперь говорит Дон Вербо про Люсию: она может, но не хочет.",
    options: [
      "Lucía puede recoger los papeles.",
      "Lucía puede recoge los papeles.",
      "Puede Lucía los papeles recoger.",
    ],
    answer: "Lucía puede recoger los papeles.",
    grammarErrorOptions: ["Lucía puede recoge los papeles."],
  },
  {
    id: "yo",
    kind: "form",
    stage: "Форма · yo",
    prompt: "Yo ___ recoger los papeles.",
    answer: "puedo",
  },
  {
    id: "affirmative",
    kind: "form",
    stage: "Утверждение · nosotros",
    prompt: "Nosotros ___ recoger los papeles.",
    answer: "podemos",
  },
  {
    id: "negative",
    kind: "form",
    stage: "Отрицание · él",
    prompt: "Él no ___ recoger los papeles.",
    answer: "puede",
  },
  {
    id: "question",
    kind: "form",
    stage: "Вопрос · vosotros",
    prompt: "¿Vosotros ___ recoger los papeles?",
    answer: "podéis",
  },
  {
    id: "full-answer",
    kind: "choice",
    stage: "Полный ответ",
    prompt: "¿Vosotros podéis recoger los papeles?",
    ru: "Ответь полной репликой от лица группы.",
    options: [
      "Sí, podemos recoger los papeles.",
      "Sí, pueden recoger.",
      "Sí, podemos los papeles.",
    ],
    answer: "Sí, podemos recoger los papeles.",
  },
  {
    id: "own-line",
    kind: "own",
    stage: "Твоя реплика",
    prompt: "Скажи от своего лица, можешь ли ты собрать бумаги.",
    answer: "puedo recoger los papeles",
  },
];
