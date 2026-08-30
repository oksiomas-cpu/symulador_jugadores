// Капсула 12 · EMPEZAR A, вторая позиция оператора. Та же механика, что у
// PODER_DIALOGUES (poderDialogueData.js): без русского перевода, смысл
// восстанавливается по сцене и диалогу. Банк действий — те же 7, что в
// actionCapsulesData.js (CAPSULE_ACTIONS).

export const EMPEZAR_A_DIALOGUES = [
  {
    id: "abrir",
    number: 1,
    title: "ABRIR",
    context: "El baúl de las pistas tiene tres cerraduras.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿empiezas a abrir el baúl?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Sí,", "empiezo a", "abrir", "el baúl."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Lo terminas hoy?" },
      { speaker: "Tomás", text: "No, solo empiezo con la primera cerradura." },
    ],
  },
  {
    id: "llevar",
    number: 2,
    title: "LLEVAR",
    context: "Las pistas deben pasar de la mesa larga al baúl.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿empiezas a llevar tú las pistas?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["No,", "no empiezo a", "llevar", "las pistas."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Quién empieza?" },
      { speaker: "Lucía", text: "Tomás empieza a llevarlas, yo las voy contando." },
    ],
  },
  {
    id: "buscar",
    number: 3,
    title: "BUSCAR",
    context: "Falta la primera pista de la mesa larga.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿empiezas a buscarla?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Sí,", "empiezo a", "buscar", "la primera pista."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Por dónde empiezas?" },
      { speaker: "Lucía", text: "Empiezo a buscar bajo la mesa larga." },
    ],
  },
  {
    id: "recoger",
    number: 4,
    title: "RECOGER",
    context: "Tomás abre la primera cerradura del baúl.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿empiezas a recoger las pistas ya?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Empiezo a", "recoger", "las pistas", "una por una."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "MODO"],
    after: [],
  },
  {
    id: "guardar",
    number: 5,
    title: "GUARDAR",
    context: "La primera pista está lista para entrar en el baúl.",
    before: [
      { speaker: "Detective", text: "¿Dónde empiezas a guardarla?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Empiezo a", "guardar", "la pista", "en el baúl."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "LUGAR"],
    after: [
      { speaker: "Detective", text: "¿Por qué ahí primero?" },
      { speaker: "Tomás", text: "Porque es la pista más antigua." },
    ],
  },
  {
    id: "usar",
    number: 6,
    title: "USAR",
    context: "Don Verbo necesita revisar la primera pista guardada.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿empiezas a usar el registro del baúl?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Sí,", "empiezo a", "usar", "el registro."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Para qué empiezas a usarlo?" },
      { speaker: "Lucía", text: "Para anotar cada pista que entra en el baúl." },
    ],
  },
  {
    id: "dar",
    number: 7,
    title: "DAR",
    context: "La primera pista anotada está lista para Don Verbo.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿empiezas a dar las pistas a Don Verbo?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Empiezo a", "dar", "las pistas", "a Don Verbo."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "DESTINATARIO"],
    after: [],
  },
  {
    id: "empezar-a-intentar",
    number: 8,
    title: "EMPEZAR A E INTENTAR",
    context: "Empezar algo y solo intentarlo no son lo mismo.",
    before: [
      { speaker: "Lucía", text: "Intento abrir el baúl, pero la cerradura no cede." },
      { speaker: "Tomás", text: "Yo ya empiezo a abrirlo: la primera cerradura ha cedido." },
      { speaker: "Detective", text: "Entonces, ¿quién ha dado el primer paso de verdad?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Tomás", "empieza a", "abrir", "el baúl."],
    layers: ["SUJETO", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [],
  },
  {
    id: "antes-ahora",
    number: 9,
    title: "ANTES Y AHORA",
    context: "La Sala repasa los comienzos de esta semana.",
    before: [
      { speaker: "Detective", text: "Tomás, ayer, ¿qué empezabas a hacer?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Ayer", "empezaba a", "recoger", "las pistas."],
    layers: ["TIEMPO", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Y ahora qué empiezas a hacer?" },
      { speaker: "Tomás", text: "Ahora empiezo a dar las pistas a Don Verbo." },
    ],
  },
  {
    id: "reconstruccion",
    number: 10,
    title: "RECONSTRUIR",
    context: "Don Verbo pide el informe final de la Sala de los Comienzos.",
    before: [
      { speaker: "Don Verbo", text: "Detectives, ¿qué empezaba a hacer Lucía?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Lucía", "empezaba a", "buscar la pista", "y usar el registro."],
    layers: ["SUJETO", "OPERADOR", "PRIMERA ACCIÓN", "SEGUNDA ACCIÓN"],
    after: [
      { speaker: "Don Verbo", text: "¿Y Tomás?" },
      { speaker: "Detective", text: "Tomás empezaba a abrir el baúl, recoger las pistas, guardarlas y darlas a Don Verbo." },
    ],
  },
];

export const EMPEZAR_A_REVIEW = [
  { id: "r-abrir", sourceId: "abrir", question: "¿Quién empieza a abrir el baúl de las pistas?", options: ["Tomás", "Lucía", "Don Verbo"], answer: "Tomás" },
  { id: "r-llevar", sourceId: "llevar", question: "¿Quién empieza a llevar las pistas al baúl?", options: ["Tomás", "Lucía", "Don Verbo"], answer: "Tomás" },
  { id: "r-buscar", sourceId: "buscar", question: "¿Por dónde empieza Lucía a buscar la primera pista?", options: ["Bajo la mesa larga", "En el despacho", "En la biblioteca"], answer: "Bajo la mesa larga" },
  { id: "r-recoger", sourceId: "recoger", question: "¿Cómo empieza Tomás a recoger las pistas?", options: ["Una por una", "Todas juntas", "Con ayuda de Lucía"], answer: "Una por una" },
  { id: "r-guardar", sourceId: "guardar", question: "¿Por qué empieza Tomás a guardar esa pista primero?", options: ["Porque es la más antigua", "Porque es la más grande", "Porque Don Verbo lo pidió"], answer: "Porque es la más antigua" },
  { id: "r-usar", sourceId: "usar", question: "¿Para qué empieza Lucía a usar el registro?", options: ["Para anotar cada pista que entra en el baúl", "Para abrir el baúl", "Para buscar pistas"], answer: "Para anotar cada pista que entra en el baúl" },
  { id: "r-dar", sourceId: "dar", question: "¿A quién empieza Tomás a dar las pistas?", options: ["A Don Verbo", "A Lucía", "Al guardián"], answer: "A Don Verbo" },
  { id: "r-empezar-a-intentar", sourceId: "empezar-a-intentar", question: "Según la Sala, ¿quién ha dado el primer paso de verdad?", options: ["Tomás", "Lucía", "Los dos"], answer: "Tomás" },
  { id: "r-antes", sourceId: "antes-ahora", question: "¿Qué empezaba Tomás a hacer ayer?", options: ["Recoger las pistas", "Abrir el baúl", "Dar las pistas"], answer: "Recoger las pistas" },
  { id: "r-reconstruccion", sourceId: "reconstruccion", question: "¿Qué empezaba a hacer Tomás, según el informe final?", options: ["Abrir el baúl, recoger, guardar y dar las pistas", "Solo buscar la primera pista", "Usar el registro solamente"], answer: "Abrir el baúl, recoger, guardar y dar las pistas" },
];

export const EMPEZAR_A_INTRO = {
  title: "La Sala de los Comienzos",
  paragraphs: [
    "Detectives, aquí llega vuestra siguiente cápsula.",
    "Ya sabéis algo importante: empezar a hacer algo no significa terminarlo.",
    "Tomás y Lucía hablan de un baúl con tres cerraduras, una mesa larga y un registro de pistas.",
    "Cada pista nueva es un comienzo, no un final.",
  ],
  mission: "Descubrid quién empieza a hacer qué, y por dónde.",
};
