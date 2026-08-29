// Капсула 15 · VOLVER A. Та же механика, что у предыдущих капсул —
// меняются только данные: сцена, глагол и дополнение места. Архитектура
// ActionCapsules.jsx не переписывается.

export const VOLVER_A_PRESENT = [
  { person: "yo", form: "vuelvo" },
  { person: "tú", form: "vuelves" },
  { person: "él / ella / usted", form: "vuelve" },
  { person: "nosotros / nosotras", form: "volvemos" },
  { person: "vosotros / vosotras", form: "volvéis" },
  { person: "ellos / ellas / ustedes", form: "vuelven" },
];

export const VOLVER_A_CAPSULE_1 = {
  id: "volver-a-1",
  number: 15,
  operator: "VOLVER A",
  title: "La puerta, otra vez",
  linkTitle: "VOLVER A + ENTRAR EN LA SALA",
  scene: {
    es: "Tomás entró en la Sala por la mañana. Una hora después, está otra vez delante de la misma puerta.",
    ru: "Томас входил в Зал утром. Через час он снова стоит перед той же дверью.",
  },
  law: "Спрягается VOLVER (+ a). Действие ENTRAR остаётся в infinitivo. Дополнение EN LA SALA остаётся в сцене.",
};

export const VOLVER_A_CAPSULE_1_STEPS = [
  {
    id: "meaning",
    kind: "choice",
    stage: "Смысл",
    prompt: "¿Quién vuelve a entrar en la Sala?",
    ru: "Кто снова входит в Зал?",
    options: ["Tomás", "Lucía", "Don Verbo"],
    answer: "Tomás",
  },
  {
    id: "dialogue",
    kind: "choice",
    stage: "Диалог",
    prompt: "Don Verbo: Tomás, ¿es la primera vez que entras hoy?",
    ru: "Выбери полный ответ Томаса — это уже не первый раз.",
    options: [
      "No, vuelvo a entrar en la Sala.",
      "No, vuelvo a entro en la Sala.",
      "No, vuelvo entrar en la Sala.",
    ],
    answer: "No, vuelvo a entrar en la Sala.",
    grammarErrorOptions: ["No, vuelvo a entro en la Sala."],
  },
  {
    id: "speaker",
    kind: "choice",
    stage: "Свод Дона Вербо",
    prompt: "Don Verbo anota lo que ha visto.",
    ru: "Дон Вербо записывает итог — выбери верную запись.",
    options: [
      "Tomás vuelve a entrar en la Sala.",
      "Tomás vuelve entrar en la Sala.",
      "Tomás a vuelve entrar en la Sala.",
    ],
    answer: "Tomás vuelve a entrar en la Sala.",
  },
  {
    id: "yo",
    kind: "form",
    stage: "Форма · yo",
    prompt: "Yo ___ a entrar en la Sala.",
    answer: "vuelvo",
  },
  {
    id: "affirmative",
    kind: "form",
    stage: "Утверждение · nosotros",
    prompt: "Nosotros ___ a entrar en la Sala.",
    answer: "volvemos",
  },
  {
    id: "negative",
    kind: "form",
    stage: "Отрицание · ella",
    prompt: "Lucía no ___ a entrar en la Sala; es su primera vez hoy.",
    answer: "vuelve",
  },
  {
    id: "question",
    kind: "form",
    stage: "Вопрос · vosotros",
    prompt: "¿Vosotros ___ a entrar en la Sala?",
    answer: "volvéis",
  },
  {
    id: "full-answer",
    kind: "choice",
    stage: "Полный ответ",
    prompt: "¿Vosotros volvéis a entrar en la Sala?",
    ru: "Ответь полной репликой от лица группы.",
    options: [
      "Sí, volvemos a entrar en la Sala.",
      "Sí, vuelven a entrar en la Sala.",
      "Sí, volvemos entrar en la Sala.",
    ],
    answer: "Sí, volvemos a entrar en la Sala.",
  },
  {
    id: "own-line",
    kind: "own",
    stage: "Твоя реплика",
    prompt: "Скажи от своего лица, входишь ли ты снова в Зал.",
    answer: "vuelvo a entrar en la Sala",
  },
];
