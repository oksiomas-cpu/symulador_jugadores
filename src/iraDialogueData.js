// Капсула 8 · IR A, вторая позиция оператора. Та же механика, что у
// PODER_DIALOGUES (poderDialogueData.js): без русского перевода, смысл
// восстанавливается по сцене и диалогу. Банк действий — те же 7, что в
// actionCapsulesData.js (CAPSULE_ACTIONS).

export const IR_A_DIALOGUES = [
  {
    id: "abrir",
    number: 1,
    title: "ABRIR",
    context: "La puerta de la Cocina Mágica está cerrada esta tarde.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿vas a abrir la puerta de la Cocina?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Sí,", "voy a", "abrir", "la puerta."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Cuándo vas a abrirla?" },
      { speaker: "Lucía", text: "Voy a abrirla después de la reunión." },
    ],
  },
  {
    id: "llevar",
    number: 2,
    title: "LLEVAR",
    context: "El libro de recetas sigue en el banco junto a la salida.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿vas a llevar tú el libro?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["No,", "no voy a", "llevar", "el libro."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Quién va a llevarlo?" },
      { speaker: "Tomás", text: "Lucía va a llevarlo al despacho." },
    ],
  },
  {
    id: "buscar",
    number: 3,
    title: "BUSCAR",
    context: "Falta un ingrediente que no aparece en la cocina.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿vas a buscar el ingrediente que falta?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Sí,", "voy a", "buscar", "el ingrediente."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Dónde vas a buscarlo?" },
      { speaker: "Lucía", text: "Voy a buscarlo en la despensa." },
    ],
  },
  {
    id: "recoger",
    number: 4,
    title: "RECOGER",
    context: "Unos papeles del libro se han caído al suelo.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿vas a recoger los papeles?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Voy a", "recoger", "los papeles", "antes de salir."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "TIEMPO"],
    after: [
      { speaker: "Detective", text: "¿Por qué antes de salir?" },
      { speaker: "Tomás", text: "Porque el libro no puede quedar incompleto." },
    ],
  },
  {
    id: "guardar",
    number: 5,
    title: "GUARDAR",
    context: "El libro de recetas ya está completo.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿dónde vas a guardarlo?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Voy a", "guardar", "el libro", "en el despacho."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "LUGAR"],
    after: [
      { speaker: "Detective", text: "¿Por qué en el despacho?" },
      { speaker: "Lucía", text: "Porque allí lo va a revisar Don Verbo." },
    ],
  },
  {
    id: "usar",
    number: 6,
    title: "USAR",
    context: "Don Verbo quiere probar una receta nueva mañana.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿vas a usar el libro mañana?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Sí,", "voy a", "usar", "el libro."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Para qué vas a usarlo?" },
      { speaker: "Tomás", text: "Para preparar la receta que pidió Don Verbo." },
    ],
  },
  {
    id: "dar",
    number: 7,
    title: "DAR",
    context: "El libro ya está listo para salir del despacho.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿vas a dar el libro a Don Verbo?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Voy a", "dar", "el libro", "a Don Verbo."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "DESTINATARIO"],
    after: [],
  },
  {
    id: "ir-a-tener-que",
    number: 8,
    title: "IR A Y TENER QUE",
    context: "Un plan y una obligación no son la misma cosa.",
    before: [
      { speaker: "Tomás", text: "Tengo que recoger los papeles hoy." },
      { speaker: "Lucía", text: "Yo voy a recogerlos mañana, si tengo tiempo." },
      { speaker: "Detective", text: "Entonces, ¿quién tiene que recogerlos hoy?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Tomás", "tiene que", "recogerlos", "hoy."],
    layers: ["SUJETO", "OPERADOR", "ACCIÓN", "TIEMPO"],
    after: [],
  },
  {
    id: "antes-ahora",
    number: 9,
    title: "ANTES Y AHORA",
    context: "La Sala repasa los planes de ayer y de hoy.",
    before: [
      { speaker: "Detective", text: "Lucía, ayer, ¿qué ibas a hacer?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Ayer", "iba a", "buscar", "el ingrediente."],
    layers: ["TIEMPO", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Y ahora qué vas a hacer?" },
      { speaker: "Lucía", text: "Ahora voy a guardar el libro." },
    ],
  },
  {
    id: "reconstruccion",
    number: 10,
    title: "RECONSTRUIR",
    context: "Don Verbo pide el informe final de la Sala de los Planes.",
    before: [
      { speaker: "Don Verbo", text: "Detectives, ¿qué iba a hacer Lucía?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Lucía", "iba a", "buscar el ingrediente", "y guardar el libro."],
    layers: ["SUJETO", "OPERADOR", "PRIMERA ACCIÓN", "SEGUNDA ACCIÓN"],
    after: [
      { speaker: "Don Verbo", text: "¿Y Tomás?" },
      { speaker: "Detective", text: "Tomás iba a recoger los papeles y usar el libro para la receta." },
    ],
  },
];

export const IR_A_REVIEW = [
  { id: "r-abrir", sourceId: "abrir", question: "¿Quién va a abrir la puerta de la Cocina?", options: ["Lucía", "Tomás", "Don Verbo"], answer: "Lucía" },
  { id: "r-llevar", sourceId: "llevar", question: "¿Quién va a llevar el libro de recetas?", options: ["Lucía", "Tomás", "Don Verbo"], answer: "Lucía" },
  { id: "r-buscar", sourceId: "buscar", question: "¿Dónde va Lucía a buscar el ingrediente?", options: ["En la despensa", "En la cocina", "En el despacho"], answer: "En la despensa" },
  { id: "r-recoger", sourceId: "recoger", question: "¿Cuándo va Tomás a recoger los papeles?", options: ["Antes de salir", "Después de comer", "Mañana"], answer: "Antes de salir" },
  { id: "r-guardar", sourceId: "guardar", question: "¿Dónde va Lucía a guardar el libro?", options: ["En el despacho", "En la caja fuerte", "En la biblioteca"], answer: "En el despacho" },
  { id: "r-usar", sourceId: "usar", question: "¿Para qué va Tomás a usar el libro mañana?", options: ["Para preparar la receta que pidió Don Verbo", "Para abrir la puerta", "Para buscar un ingrediente"], answer: "Para preparar la receta que pidió Don Verbo" },
  { id: "r-dar", sourceId: "dar", question: "¿A quién va Lucía a dar el libro?", options: ["A Don Verbo", "A Tomás", "Al guardián"], answer: "A Don Verbo" },
  { id: "r-ir-a-tener-que", sourceId: "ir-a-tener-que", question: "¿Quién tiene que recoger los papeles hoy, según la Sala?", options: ["Tomás", "Lucía", "Don Verbo"], answer: "Tomás" },
  { id: "r-antes", sourceId: "antes-ahora", question: "¿Qué iba Lucía a hacer ayer?", options: ["Buscar el ingrediente", "Guardar el libro", "Dar el libro"], answer: "Buscar el ingrediente" },
  { id: "r-reconstruccion", sourceId: "reconstruccion", question: "¿Qué iba a hacer Tomás, según el informe final?", options: ["Recoger los papeles y usar el libro", "Abrir la puerta y buscar el ingrediente", "Guardar el libro y darlo a Don Verbo"], answer: "Recoger los papeles y usar el libro" },
];

export const IR_A_INTRO = {
  title: "La Sala de los Planes",
  paragraphs: [
    "Detectives, aquí llega vuestra siguiente cápsula.",
    "Ya sabéis algo importante: ir a hacer algo es un plan cercano, no todavía una obligación.",
    "Tomás y Lucía hablan de una puerta, un libro de recetas, un ingrediente que falta y un despacho.",
    "Nada ha pasado aún, pero todo está a punto de pasar.",
  ],
  mission: "Descubrid quién va a hacer qué, y cuándo.",
};
