// Капсула 13 · DEJAR DE. Та же механика, что у предыдущих капсул —
// меняются только данные: сцена, глагол и объект. Архитектура
// ActionCapsules.jsx не переписывается.

export const DEJAR_DE_PRESENT = [
  { person: "yo", form: "dejo" },
  { person: "tú", form: "dejas" },
  { person: "él / ella / usted", form: "deja" },
  { person: "nosotros / nosotras", form: "dejamos" },
  { person: "vosotros / vosotras", form: "dejáis" },
  { person: "ellos / ellas / ustedes", form: "dejan" },
];

export const DEJAR_DE_CAPSULE_1 = {
  id: "dejar-de-1",
  number: 13,
  operator: "DEJAR DE",
  title: "Los cajones de la biblioteca",
  linkTitle: "DEJAR DE + BUSCAR LA LLAVE DORADA",
  scene: {
    es: "Lucía ha abierto varios cajones de la biblioteca buscando la llave dorada. Ahora se queda quieta, sin abrir ninguno más.",
    ru: "Лусия открыла несколько ящиков библиотеки в поисках золотого ключа. Теперь она замерла, не открывая больше ни одного.",
  },
  law: "Спрягается DEJAR (+ de). Действие BUSCAR остаётся в infinitivo. Объект LA LLAVE DORADA остаётся в сцене.",
};

export const DEJAR_DE_CAPSULE_1_STEPS = [
  {
    id: "meaning",
    kind: "choice",
    stage: "Смысл",
    prompt: "¿Quién deja de buscar la llave dorada?",
    ru: "Кто перестаёт искать золотой ключ?",
    options: ["Lucía", "Tomás", "Don Verbo"],
    answer: "Lucía",
  },
  {
    id: "dialogue",
    kind: "choice",
    stage: "Диалог",
    prompt: "Don Verbo: Lucía, ¿sigues buscando la llave dorada?",
    ru: "Выбери полный ответ Лусии — она прекращает поиск.",
    options: [
      "No, dejo de buscar la llave dorada.",
      "No, dejo de busco la llave dorada.",
      "No, dejo buscar la llave dorada.",
    ],
    answer: "No, dejo de buscar la llave dorada.",
    grammarErrorOptions: ["No, dejo de busco la llave dorada."],
  },
  {
    id: "speaker",
    kind: "choice",
    stage: "Свод Дона Вербо",
    prompt: "Don Verbo anota lo que ha visto.",
    ru: "Дон Вербо записывает итог — выбери верную запись.",
    options: [
      "Lucía deja de buscar la llave dorada.",
      "Lucía deja buscar la llave dorada.",
      "Lucía de deja buscar la llave dorada.",
    ],
    answer: "Lucía deja de buscar la llave dorada.",
  },
  {
    id: "yo",
    kind: "form",
    stage: "Форма · yo",
    prompt: "Yo ___ de buscar la llave dorada.",
    answer: "dejo",
  },
  {
    id: "affirmative",
    kind: "form",
    stage: "Утверждение · nosotros",
    prompt: "Nosotros ___ de buscar la llave dorada.",
    answer: "dejamos",
  },
  {
    id: "negative",
    kind: "form",
    stage: "Отрицание · él",
    prompt: "Tomás no ___ de buscar la llave dorada; sigue mirando debajo de los libros.",
    answer: "deja",
  },
  {
    id: "question",
    kind: "form",
    stage: "Вопрос · vosotros",
    prompt: "¿Vosotros ___ de buscar la llave dorada?",
    answer: "dejáis",
  },
  {
    id: "full-answer",
    kind: "choice",
    stage: "Полный ответ",
    prompt: "¿Vosotros dejáis de buscar la llave dorada?",
    ru: "Ответь полной репликой от лица группы.",
    options: [
      "Sí, dejamos de buscar la llave dorada.",
      "Sí, dejan de buscar la llave dorada.",
      "Sí, dejamos buscar la llave dorada.",
    ],
    answer: "Sí, dejamos de buscar la llave dorada.",
  },
  {
    id: "own-line",
    kind: "own",
    stage: "Твоя реплика",
    prompt: "Скажи от своего лица, перестаёшь ли ты искать золотой ключ.",
    answer: "dejo de buscar la llave dorada",
  },
];
