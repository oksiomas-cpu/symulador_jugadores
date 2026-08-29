// Капсула 5 · TENER QUE. Та же механика, что у QuererOne/PoderOne — меняются
// только данные: сцена, глагол и объект. Архитектура ActionCapsules.jsx
// не переписывается.

export const TENER_QUE_PRESENT = [
  { person: "yo", form: "tengo" },
  { person: "tú", form: "tienes" },
  { person: "él / ella / usted", form: "tiene" },
  { person: "nosotros / nosotras", form: "tenemos" },
  { person: "vosotros / vosotras", form: "tenéis" },
  { person: "ellos / ellas / ustedes", form: "tienen" },
  ];

export const TENER_QUE_CAPSULE_1 = {
  id: "tener-que-1",
  number: 5,
  operator: "TENER QUE",
  title: "El reloj detenido",
  linkTitle: "TENER QUE + USAR EL RELOJ",
  scene: {
    es: "Cada tarde a las seis, el guardián debe dar cuerda al reloj del palacio. Esta mañana el reloj se ha parado.",
    ru: "Каждый вечер в шесть часов хранитель должен заводить дворцовые часы. Сегодня утром часы остановились.",
  },
  law: "Спрягается TENER (+ que). Действие USAR остаётся в infinitivo. Объект EL RELOJ остаётся в сцене.",
};

export const TENER_QUE_CAPSULE_1_STEPS = [
  {
    id: "meaning",
    kind: "choice",
    stage: "Смысл",
    prompt: "¿Quién tiene que usar el reloj?",
    ru: "Кто должен завести часы?",
    options: ["el guardián", "Don Verbo", "Lucía"],
    answer: "el guardián",
  },
  {
    id: "dialogue",
    kind: "choice",
    stage: "Диалог",
    prompt: "Don Verbo: ¿Quieres usar el reloj?",
    ru: "Выбери полный ответ хранителя — он не хочет, но признаёт необходимость.",
    options: [
      "No quiero, pero tengo que usar el reloj.",
      "No quiero, pero tengo que uso el reloj.",
      "No quiero, pero tengo usar que el reloj.",
      ],
    answer: "No quiero, pero tengo que usar el reloj.",
    grammarErrorOptions: ["No quiero, pero tengo que uso el reloj."],
  },
  {
    id: "speaker",
    kind: "choice",
    stage: "Свод Дона Вербо",
    prompt: "Don Verbo anota lo que ha visto.",
    ru: "Дон Вербо записывает итог — выбери верную запись.",
    options: [
      "El guardián no quiere usar el reloj, pero tiene que usar el reloj.",
      "El guardián no quiere usar el reloj, pero tiene que usa el reloj.",
      "El guardián tiene que no quiere usar el reloj.",
      ],
    answer: "El guardián no quiere usar el reloj, pero tiene que usar el reloj.",
    grammarErrorOptions: ["El guardián no quiere usar el reloj, pero tiene que usa el reloj."],
  },
  {
    id: "yo",
    kind: "form",
    stage: "Форма · yo",
    prompt: "Yo ___ que usar el reloj.",
    answer: "tengo",
  },
  {
    id: "affirmative",
    kind: "form",
    stage: "Утверждение · nosotros",
    prompt: "Nosotros ___ que usar el reloj.",
    answer: "tenemos",
  },
  {
    id: "negative",
    kind: "form",
    stage: "Отрицание · Don Verbo",
    prompt: "Don Verbo no ___ que usar el reloj — no es su tarea.",
    answer: "tiene",
  },
  {
    id: "question",
    kind: "form",
    stage: "Вопрос · vosotros",
    prompt: "¿Vosotros ___ que usar el reloj?",
    answer: "tenéis",
  },
  {
    id: "full-answer",
    kind: "choice",
    stage: "Полный ответ",
    prompt: "¿Vosotros tenéis que usar el reloj?",
    ru: "Ответь полной репликой от лица группы.",
    options: [
      "Sí, tenemos que usar el reloj.",
      "Sí, tienen que usar el reloj.",
      "Sí, tenemos usar el reloj.",
      ],
    answer: "Sí, tenemos que usar el reloj.",
  },
  {
    id: "own-line",
    kind: "own",
    stage: "Твоя реплика",
    prompt: "Скажи от своего лица, должен ли ты завести часы.",
    answer: "tengo que usar el reloj",
  },
  ];
