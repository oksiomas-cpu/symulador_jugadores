// Капсула 10 · INTENTAR, вторая позиция оператора. Та же механика, что у
// PODER_DIALOGUES (poderDialogueData.js): без русского перевода, смысл
// восстанавливается по сцене и диалогу. Банк действий — те же 7, что в
// actionCapsulesData.js (CAPSULE_ACTIONS).

export const INTENTAR_DIALOGUES = [
  {
    id: "abrir",
    number: 1,
    title: "ABRIR",
    context: "La puerta del despacho está atascada desde ayer.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿intentas abrir la puerta?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Sí,", "intento", "abrir", "la puerta."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Lo consigues?" },
      { speaker: "Tomás", text: "Todavía no, pero sigo intentándolo." },
    ],
  },
  {
    id: "llevar",
    number: 2,
    title: "LLEVAR",
    context: "La caja de pistas pesa más de lo esperado.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿intentas llevar tú la caja?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["No,", "no intento", "llevar", "la caja."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Por qué no?" },
      { speaker: "Lucía", text: "Porque sé que no puedo con ella sola." },
    ],
  },
  {
    id: "buscar",
    number: 3,
    title: "BUSCAR",
    context: "El libro de recetas no aparece en su sitio.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿intentas buscar el libro otra vez?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Sí,", "intento", "buscar", "el libro."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Dónde intentas buscarlo esta vez?" },
      { speaker: "Tomás", text: "Intento buscarlo detrás de la puerta del despacho." },
    ],
  },
  {
    id: "recoger",
    number: 4,
    title: "RECOGER",
    context: "Unos papeles se han deslizado bajo la puerta.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿intentas recoger los papeles?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Intento", "recoger", "los papeles", "sin abrir la puerta."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "MODO"],
    after: [
      { speaker: "Detective", text: "¿Por qué sin abrirla?" },
      { speaker: "Lucía", text: "Porque no quiero molestar a Don Verbo." },
    ],
  },
  {
    id: "guardar",
    number: 5,
    title: "GUARDAR",
    context: "Lucía consigue recoger algunos papeles.",
    before: [
      { speaker: "Detective", text: "¿Dónde intentas guardarlos?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Intento", "guardar", "los papeles", "en la carpeta."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "LUGAR"],
    after: [],
  },
  {
    id: "usar",
    number: 6,
    title: "USAR",
    context: "Tomás encuentra una llave vieja junto a la puerta.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿intentas usar esa llave?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Sí,", "intento", "usar", "la llave vieja."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Funciona?" },
      { speaker: "Tomás", text: "Todavía no lo sé, sigo intentándolo." },
    ],
  },
  {
    id: "dar",
    number: 7,
    title: "DAR",
    context: "Lucía por fin consigue abrir la puerta un poco.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿intentas dar el libro a Don Verbo ahora?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Intento", "dar", "el libro", "a Don Verbo."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "DESTINATARIO"],
    after: [
      { speaker: "Detective", text: "¿Lo consigues esta vez?" },
      { speaker: "Lucía", text: "Sí, por fin la puerta se abre y se lo doy." },
    ],
  },
  {
    id: "intentar-ir-a",
    number: 8,
    title: "INTENTAR E IR A",
    context: "Un plan y un esfuerzo no son la misma cosa.",
    before: [
      { speaker: "Tomás", text: "Voy a abrir la puerta: ya lo he decidido." },
      { speaker: "Lucía", text: "Yo solo intento abrirla, no sé si lo conseguiré." },
      { speaker: "Detective", text: "Entonces, ¿quién tiene un plan y quién solo lo intenta?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Tomás", "va a", "abrir la puerta;", "Lucía solo lo intenta."],
    layers: ["SUJETO", "OPERADOR", "ACCIÓN", "CONTRASTE"],
    after: [],
  },
  {
    id: "antes-ahora",
    number: 9,
    title: "ANTES Y AHORA",
    context: "La Sala repasa los intentos de ayer.",
    before: [
      { speaker: "Detective", text: "Lucía, ayer, ¿qué intentabas hacer?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Ayer", "intentaba", "abrir", "la puerta."],
    layers: ["TIEMPO", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Y ahora qué intentas hacer?" },
      { speaker: "Lucía", text: "Ahora intento dar el libro a Don Verbo." },
    ],
  },
  {
    id: "reconstruccion",
    number: 10,
    title: "RECONSTRUIR",
    context: "Don Verbo pide el informe final de la Sala de los Intentos.",
    before: [
      { speaker: "Don Verbo", text: "Detectives, ¿qué intentaba hacer Tomás?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Tomás", "intentaba", "abrir la puerta", "y buscar el libro."],
    layers: ["SUJETO", "OPERADOR", "PRIMERA ACCIÓN", "SEGUNDA ACCIÓN"],
    after: [
      { speaker: "Don Verbo", text: "¿Y Lucía?" },
      { speaker: "Detective", text: "Lucía intentaba recoger los papeles y dar el libro a Don Verbo." },
    ],
  },
];

export const INTENTAR_REVIEW = [
  { id: "r-abrir", sourceId: "abrir", question: "¿Quién intenta abrir la puerta del despacho?", options: ["Tomás", "Lucía", "Don Verbo"], answer: "Tomás" },
  { id: "r-llevar", sourceId: "llevar", question: "¿Por qué no intenta Lucía llevar la caja sola?", options: ["Porque sabe que no puede con ella sola", "Porque no es su tarea", "Porque está rota"], answer: "Porque sabe que no puede con ella sola" },
  { id: "r-buscar", sourceId: "buscar", question: "¿Dónde intenta Tomás buscar el libro esta vez?", options: ["Detrás de la puerta del despacho", "En la biblioteca", "En la cocina"], answer: "Detrás de la puerta del despacho" },
  { id: "r-recoger", sourceId: "recoger", question: "¿Cómo intenta Lucía recoger los papeles?", options: ["Sin abrir la puerta", "Rompiendo la puerta", "Pidiendo ayuda a Tomás"], answer: "Sin abrir la puerta" },
  { id: "r-guardar", sourceId: "guardar", question: "¿Dónde intenta Lucía guardar los papeles?", options: ["En la carpeta", "En el baúl", "En la caja fuerte"], answer: "En la carpeta" },
  { id: "r-usar", sourceId: "usar", question: "¿Qué intenta usar Tomás junto a la puerta?", options: ["Una llave vieja", "El libro de recetas", "La varilla dorada"], answer: "Una llave vieja" },
  { id: "r-dar", sourceId: "dar", question: "¿Consigue Lucía dar el libro a Don Verbo?", options: ["Sí, la puerta se abre y se lo da", "No, la puerta sigue cerrada", "No lo intenta"], answer: "Sí, la puerta se abre y se lo da" },
  { id: "r-intentar-ir-a", sourceId: "intentar-ir-a", question: "Según la Sala, ¿quién tiene un plan y quién solo lo intenta?", options: ["Tomás va, Lucía intenta", "Lucía va, Tomás intenta", "Los dos intentan"], answer: "Tomás va, Lucía intenta" },
  { id: "r-antes", sourceId: "antes-ahora", question: "¿Qué intentaba Lucía hacer ayer?", options: ["Abrir la puerta", "Buscar el libro", "Dar el libro"], answer: "Abrir la puerta" },
  { id: "r-reconstruccion", sourceId: "reconstruccion", question: "¿Qué intentaba hacer Lucía, según el informe final?", options: ["Recoger los papeles y dar el libro a Don Verbo", "Abrir la puerta y buscar el libro", "Usar la llave vieja solamente"], answer: "Recoger los papeles y dar el libro a Don Verbo" },
];

export const INTENTAR_INTRO = {
  title: "La Sala de los Intentos",
  paragraphs: [
    "Detectives, aquí llega vuestra siguiente cápsula.",
    "Ya sabéis algo importante: intentar hacer algo no garantiza conseguirlo.",
    "Tomás y Lucía hablan de una puerta atascada, una caja pesada, un libro perdido y una llave vieja.",
    "A veces el esfuerzo basta. A veces no.",
  ],
  mission: "Descubrid quién intenta hacer qué, y si lo consigue.",
};
