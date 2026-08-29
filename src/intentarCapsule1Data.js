// Капсула 9 · INTENTAR. Та же механика, что у QuererOne/PoderOne/TenerQueOne/
// IrAOne — меняются только данные: сцена, глагол и объект. Архитектура
// ActionCapsules.jsx не переписывается.

export const INTENTAR_PRESENT = [
  { person: "yo", form: "intento" },
  { person: "tú", form: "intentas" },
  { person: "él / ella / usted", form: "intenta" },
  { person: "nosotros / nosotras", form: "intentamos" },
  { person: "vosotros / vosotras", form: "intentáis" },
  { person: "ellos / ellas / ustedes", form: "intentan" },
];

export const INTENTAR_CAPSULE_1 = {
  id: "intentar-1",
  number: 9,
  operator: "INTENTAR",
  title: "La puerta del despacho",
  linkTitle: "INTENTAR + DAR EL LIBRO A DON VERBO",
  scene: {
    es: "Lucía llama a la puerta del despacho de Don Verbo con el libro de recetas en la mano. Nadie responde todavía.",
    ru: "Лусия стучит в дверь кабинета Дона Вербо, держа книгу рецептов в руках. Пока никто не отвечает.",
  },
  law: "Спрягается INTENTAR. Действие DAR остаётся в infinitivo. EL LIBRO и A DON VERBO остаются в сцене.",
};

export const INTENTAR_CAPSULE_1_STEPS = [
  {
    id: "meaning",
    kind: "choice",
    stage: "Смысл",
    prompt: "¿Quién intenta dar el libro a Don Verbo?",
    ru: "Кто пытается передать книгу Дону Вербо?",
    options: ["Lucía", "Tomás", "el guardián"],
    answer: "Lucía",
  },
  {
    id: "dialogue",
    kind: "choice",
    stage: "Диалог",
    prompt: "Don Verbo: Lucía, ¿me has dado el libro?",
    ru: "Выбери полный ответ Лусии — она ещё не передала книгу, но пытается.",
    options: [
      "No, todavía no. Intento dar el libro a Don Verbo.",
      "No, todavía no. Intento doy el libro a Don Verbo.",
      "No, todavía no. Intento el libro dar a Don Verbo.",
    ],
    answer: "No, todavía no. Intento dar el libro a Don Verbo.",
    grammarErrorOptions: ["No, todavía no. Intento doy el libro a Don Verbo."],
  },
  {
    id: "speaker",
    kind: "choice",
    stage: "Свод Дона Вербо",
    prompt: "Don Verbo anota lo que ha visto.",
    ru: "Дон Вербо записывает итог — выбери верную запись.",
    options: [
      "Lucía intenta dar el libro a Don Verbo, pero todavía no se lo da.",
      "Lucía intenta da el libro a Don Verbo.",
      "Lucía el libro intenta dar a Don Verbo.",
    ],
    answer: "Lucía intenta dar el libro a Don Verbo, pero todavía no se lo da.",
  },
  {
    id: "yo",
    kind: "form",
    stage: "Форма · yo",
    prompt: "Yo ___ dar el libro a Don Verbo.",
    answer: "intento",
  },
  {
    id: "affirmative",
    kind: "form",
    stage: "Утверждение · nosotros",
    prompt: "Nosotros ___ dar el libro a Don Verbo.",
    answer: "intentamos",
  },
  {
    id: "negative",
    kind: "form",
    stage: "Отрицание · él",
    prompt: "Tomás no ___ dar el libro; solo mira.",
    answer: "intenta",
  },
  {
    id: "question",
    kind: "form",
    stage: "Вопрос · vosotros",
    prompt: "¿Vosotros ___ dar el libro a Don Verbo?",
    answer: "intentáis",
  },
  {
    id: "full-answer",
    kind: "choice",
    stage: "Полный ответ",
    prompt: "¿Vosotros intentáis dar el libro a Don Verbo?",
    ru: "Ответь полной репликой от лица группы.",
    options: [
      "Sí, intentamos dar el libro a Don Verbo.",
      "Sí, intentan dar el libro a Don Verbo.",
      "Sí, intentamos damos el libro a Don Verbo.",
    ],
    answer: "Sí, intentamos dar el libro a Don Verbo.",
  },
  {
    id: "own-line",
    kind: "own",
    stage: "Твоя реплика",
    prompt: "Скажи от своего лица, пытаешься ли ты передать книгу Дону Вербо.",
    answer: "intento dar el libro a Don Verbo",
  },
];
