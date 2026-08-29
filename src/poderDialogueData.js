// Капсула 4 · PODER, вторая позиция оператора. Контент полностью отделён
// от интерфейса. Та же механика, что у Капсулы 2 (QUERER, quererDialogueData.js):
// внутри маршрута нет русского перевода, смысл восстанавливается по сцене и диалогу.
// Банк действий — те же 7, что в actionCapsulesData.js (CAPSULE_ACTIONS).

export const PODER_DIALOGUES = [
  {
    id: "abrir",
    number: 1,
    title: "ABRIR",
    context: "La puerta del taller está atascada.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿puedes abrir la puerta?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Puedo", "abrir", "la puerta."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Por qué puedes abrirla tú y no Tomás?" },
      { speaker: "Lucía", text: "Porque yo tengo las dos manos libres." },
    ],
  },
  {
    id: "llevar",
    number: 2,
    title: "LLEVAR",
    context: "Hay que llevar una caja pesada a la Sala.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿puedes llevar la caja?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["No,", "no puedo", "llevar", "la caja."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Por qué no puedes?" },
      { speaker: "Tomás", text: "Porque tengo la mano vendada." },
    ],
  },
  {
    id: "buscar-poder",
    number: 3,
    title: "BUSCAR",
    context: "La llave dorada sigue perdida.",
    before: [
      { speaker: "Tomás", text: "Quiero buscar la llave, pero no puedo." },
      { speaker: "Lucía", text: "Yo puedo buscarla, pero no quiero." },
      { speaker: "Detective", text: "Entonces, ¿quién puede buscar la llave?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Lucía", "puede", "buscar", "la llave."],
    layers: ["SUJETO", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [],
  },
  {
    id: "recoger",
    number: 4,
    title: "RECOGER",
    context: "Los papeles siguen esparcidos por el suelo.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿puedes recoger los papeles?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Sí,", "puedo", "recoger", "los papeles."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Y Tomás?" },
      { speaker: "Lucía", text: "Tomás no puede recogerlos: tiene la mano vendada." },
    ],
  },
  {
    id: "guardar",
    number: 5,
    title: "GUARDAR",
    context: "Entre los papeles aparece una llave pequeña.",
    before: [
      { speaker: "Lucía", text: "Tengo la llave pequeña, pero no puedo dejarla en cualquier sitio." },
      { speaker: "Detective", text: "¿Dónde puedes guardarla?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Puedo", "guardar", "la llave", "en la caja fuerte."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "LUGAR"],
    after: [
      { speaker: "Detective", text: "¿Por qué ahí?" },
      { speaker: "Lucía", text: "Porque solo yo puedo abrir esa caja." },
    ],
  },
  {
    id: "usar",
    number: 6,
    title: "USAR",
    context: "La llave pequeña puede abrir algo más.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿puedes usar esta llave con la mano vendada?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["No,", "no puedo", "usar", "la llave."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Quién puede usarla entonces?" },
      { speaker: "Tomás", text: "Solo Lucía puede usarla." },
    ],
  },
  {
    id: "dar",
    number: 7,
    title: "DAR",
    context: "Alguien debe entregar la llave a Don Verbo.",
    before: [
      { speaker: "Lucía", text: "Tengo la llave pequeña." },
      { speaker: "Detective", text: "¿A quién puedes dársela?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Puedo", "dar", "la llave", "a Don Verbo."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "DESTINATARIO"],
    after: [],
  },
  {
    id: "poder-querer",
    number: 8,
    title: "PODER Y QUERER",
    context: "La posibilidad y la intención no son la misma cosa.",
    before: [
      { speaker: "Detective", text: "Lucía puede recoger los papeles." },
      { speaker: "Detective", text: "Pero a veces no quiere." },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Poder", "no es", "querer."],
    layers: ["OPERADOR-POSIBILIDAD", "NEGACIÓN", "OPERADOR-INTENCIÓN"],
    after: [],
  },
  {
    id: "antes-ahora",
    number: 9,
    title: "ANTES Y AHORA",
    context: "El taller repasa lo que pasaba antes del accidente.",
    before: [
      { speaker: "Detective", text: "Tomás, antes del accidente, ¿qué podías hacer?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Antes", "podía", "llevar", "cajas pesadas."],
    layers: ["TIEMPO", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Y ahora qué puedes hacer?" },
      { speaker: "Tomás", text: "Ahora solo puedo recoger papeles con una mano." },
    ],
  },
  {
    id: "reconstruccion",
    number: 10,
    title: "RECONSTRUIR",
    context: "Don Verbo pide el informe final del taller.",
    before: [
      { speaker: "Don Verbo", text: "Detectives, ¿qué podía hacer Tomás?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Tomás", "no podía", "llevar la caja", "ni recoger los papeles."],
    layers: ["SUJETO", "OPERADOR", "PRIMERA ACCIÓN", "SEGUNDA ACCIÓN"],
    after: [
      { speaker: "Don Verbo", text: "¿Qué podía hacer Lucía?" },
      { speaker: "Detective", text: "Lucía podía abrir la puerta, buscar la llave, guardarla, usarla y darla a Don Verbo." },
    ],
  },
];

export const PODER_REVIEW = [
  {
    id: "r-abrir",
    sourceId: "abrir",
    question: "¿Quién puede abrir la puerta del taller?",
    options: ["Lucía", "Tomás", "Don Verbo"],
    answer: "Lucía",
  },
  {
    id: "r-llevar",
    sourceId: "llevar",
    question: "¿Por qué no puede Tomás llevar la caja?",
    options: ["Porque tiene la mano vendada", "Porque no quiere", "Porque la caja está cerrada"],
    answer: "Porque tiene la mano vendada",
  },
  {
    id: "r-buscar",
    sourceId: "buscar-poder",
    question: "¿Quién puede buscar la llave dorada, aunque no quiera?",
    options: ["Lucía", "Tomás", "El detective"],
    answer: "Lucía",
  },
  {
    id: "r-recoger",
    sourceId: "recoger",
    question: "¿Quién puede recoger los papeles del suelo?",
    options: ["Lucía", "Tomás", "Ninguno de los dos"],
    answer: "Lucía",
  },
  {
    id: "r-guardar",
    sourceId: "guardar",
    question: "¿Dónde puede guardar Lucía la llave pequeña?",
    options: ["En la caja fuerte", "En el suelo", "En la puerta"],
    answer: "En la caja fuerte",
  },
  {
    id: "r-usar",
    sourceId: "usar",
    question: "¿Por qué no puede Tomás usar la llave pequeña?",
    options: ["Porque tiene la mano vendada", "Porque no la encuentra", "Porque no es su llave"],
    answer: "Porque tiene la mano vendada",
  },
  {
    id: "r-dar",
    sourceId: "dar",
    question: "¿A quién puede dar Lucía la llave?",
    options: ["A Don Verbo", "A Tomás", "Al detective"],
    answer: "A Don Verbo",
  },
  {
    id: "r-poder-querer",
    sourceId: "poder-querer",
    question: "Según el taller, ¿qué no significa lo mismo que poder?",
    options: ["Querer", "Recoger", "Guardar"],
    answer: "Querer",
  },
  {
    id: "r-antes",
    sourceId: "antes-ahora",
    question: "¿Qué podía hacer Tomás antes del accidente?",
    options: ["Llevar cajas pesadas", "Abrir la puerta", "Buscar la llave"],
    answer: "Llevar cajas pesadas",
  },
  {
    id: "r-reconstruccion",
    sourceId: "reconstruccion",
    question: "¿Qué NO podía hacer Tomás al final?",
    options: ["Llevar la caja ni recoger los papeles", "Hablar con Don Verbo", "Escuchar a Lucía"],
    answer: "Llevar la caja ni recoger los papeles",
  },
];

export const PODER_INTRO = {
  title: "La Sala de las Posibilidades",
  paragraphs: [
    "Detectives, aquí llega vuestra siguiente cápsula.",
    "Ya sabéis algo importante: poder hacer algo no significa quererlo, y quererlo no significa poder.",
    "Tomás y Lucía hablan de una puerta, una caja, una llave y unos papeles.",
    "Uno de los dos tiene una mano vendada. El otro tiene las manos libres, pero eso no siempre basta.",
  ],
  mission: "Descubrid quién puede hacer qué, con qué objeto, dónde y para quién.",
};
