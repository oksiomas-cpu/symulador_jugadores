// Капсула 6 · TENER QUE, вторая позиция оператора. Та же механика, что у
// PODER_DIALOGUES (poderDialogueData.js): без русского перевода, смысл
// восстанавливается по сцене и диалогу. Банк действий — те же 7, что в
// actionCapsulesData.js (CAPSULE_ACTIONS).

export const TENER_QUE_DIALOGUES = [
  {
    id: "abrir",
    number: 1,
    title: "ABRIR",
    context: "El archivo del palacio lleva un candado desde ayer.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿tienes que abrir el archivo?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Sí,", "tengo que", "abrir", "el archivo."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Por qué tienes que abrirlo tú?" },
      { speaker: "Tomás", text: "Porque solo yo guardo la llave del archivo." },
    ],
  },
  {
    id: "llevar",
    number: 2,
    title: "LLEVAR",
    context: "Una caja de pistas debe llegar al despacho antes del mediodía.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿tienes que llevar tú la caja?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["No,", "no tengo que", "llevar", "la caja."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Quién tiene que llevarla entonces?" },
      { speaker: "Lucía", text: "Tomás tiene que llevarla: es su turno esta semana." },
    ],
  },
  {
    id: "buscar",
    number: 3,
    title: "BUSCAR",
    context: "La llave dorada sigue perdida y el reloj no se detiene.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿tienes que buscar la llave antes de las seis?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Sí,", "tengo que", "buscar", "la llave dorada."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Dónde tienes que buscarla?" },
      { speaker: "Lucía", text: "Tengo que buscarla en la biblioteca." },
    ],
  },
  {
    id: "recoger",
    number: 4,
    title: "RECOGER",
    context: "Los papeles del archivo han caído al suelo.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿tienes que recoger los papeles?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Sí,", "tengo que", "recoger", "los papeles."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Por qué es obligatorio?" },
      { speaker: "Tomás", text: "Porque una pista puede estar entre ellos." },
    ],
  },
  {
    id: "guardar",
    number: 5,
    title: "GUARDAR",
    context: "Ya han encontrado la llave dorada.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿dónde tienes que guardarla?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Tengo que", "guardar", "la llave", "en la caja fuerte."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "LUGAR"],
    after: [
      { speaker: "Detective", text: "¿Por qué ahí?" },
      { speaker: "Lucía", text: "Porque es el único lugar seguro del palacio." },
    ],
  },
  {
    id: "usar",
    number: 6,
    title: "USAR",
    context: "El reloj del palacio sigue detenido desde esta mañana.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿tienes que usar la llave del reloj?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Sí,", "tengo que", "usar", "la llave del reloj."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Para qué?" },
      { speaker: "Tomás", text: "Para ponerlo en marcha antes de que den las seis." },
    ],
  },
  {
    id: "dar",
    number: 7,
    title: "DAR",
    context: "El informe de la Sala debe llegar a Don Verbo antes del cierre.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿tienes que dar el informe a Don Verbo?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Tengo que", "dar", "el informe", "a Don Verbo."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "DESTINATARIO"],
    after: [
      { speaker: "Detective", text: "¿Antes de qué hora?" },
      { speaker: "Lucía", text: "Antes de que el reloj dé las seis." },
    ],
  },
  {
    id: "tener-que-poder",
    number: 8,
    title: "TENER QUE Y PODER",
    context: "La obligación y la posibilidad no siempre coinciden.",
    before: [
      { speaker: "Lucía", text: "Puedo buscar la llave, pero no tengo que hacerlo yo sola." },
      { speaker: "Tomás", text: "Yo tengo que buscarla, aunque no siempre puedo." },
      { speaker: "Detective", text: "Entonces, ¿quién tiene que buscar la llave?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Tomás", "tiene que", "buscar", "la llave."],
    layers: ["SUJETO", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [],
  },
  {
    id: "antes-ahora",
    number: 9,
    title: "ANTES Y AHORA",
    context: "La Sala repasa las obligaciones de otros días.",
    before: [
      { speaker: "Detective", text: "Tomás, ayer, ¿qué tenías que hacer?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Ayer", "tenía que", "abrir", "el archivo."],
    layers: ["TIEMPO", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Y hoy qué tienes que hacer?" },
      { speaker: "Tomás", text: "Hoy tengo que usar la llave del reloj." },
    ],
  },
  {
    id: "reconstruccion",
    number: 10,
    title: "RECONSTRUIR",
    context: "Don Verbo pide el informe final de la Sala de las Obligaciones.",
    before: [
      { speaker: "Don Verbo", text: "Detectives, ¿qué tenía que hacer Tomás?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Tomás", "tenía que", "abrir el archivo", "y recoger los papeles."],
    layers: ["SUJETO", "OPERADOR", "PRIMERA ACCIÓN", "SEGUNDA ACCIÓN"],
    after: [
      { speaker: "Don Verbo", text: "¿Qué tenía que hacer Lucía?" },
      { speaker: "Detective", text: "Lucía tenía que buscar la llave, guardarla en la caja fuerte y dar el informe a Don Verbo." },
    ],
  },
];

export const TENER_QUE_REVIEW = [
  { id: "r-abrir", sourceId: "abrir", question: "¿Quién tiene que abrir el archivo?", options: ["Tomás", "Lucía", "Don Verbo"], answer: "Tomás" },
  { id: "r-llevar", sourceId: "llevar", question: "¿Por qué no tiene Lucía que llevar la caja?", options: ["Porque no es su turno esta semana", "Porque no puede cargarla", "Porque ya la llevó"], answer: "Porque no es su turno esta semana" },
  { id: "r-buscar", sourceId: "buscar", question: "¿Dónde tiene Lucía que buscar la llave dorada?", options: ["En la biblioteca", "En la cocina", "En el despacho"], answer: "En la biblioteca" },
  { id: "r-recoger", sourceId: "recoger", question: "¿Por qué tiene Tomás que recoger los papeles?", options: ["Porque una pista puede estar entre ellos", "Porque están mojados", "Porque Don Verbo lo pidió"], answer: "Porque una pista puede estar entre ellos" },
  { id: "r-guardar", sourceId: "guardar", question: "¿Dónde tiene Lucía que guardar la llave?", options: ["En la caja fuerte", "En el despacho", "En la biblioteca"], answer: "En la caja fuerte" },
  { id: "r-usar", sourceId: "usar", question: "¿Para qué tiene Tomás que usar la llave del reloj?", options: ["Para ponerlo en marcha", "Para abrir el archivo", "Para guardar los papeles"], answer: "Para ponerlo en marcha" },
  { id: "r-dar", sourceId: "dar", question: "¿A quién tiene Lucía que dar el informe?", options: ["A Don Verbo", "A Tomás", "Al guardián"], answer: "A Don Verbo" },
  { id: "r-tener-que-poder", sourceId: "tener-que-poder", question: "Según la Sala, ¿quién tiene que buscar la llave, aunque no siempre puede?", options: ["Tomás", "Lucía", "Don Verbo"], answer: "Tomás" },
  { id: "r-antes", sourceId: "antes-ahora", question: "¿Qué tenía que hacer Tomás ayer?", options: ["Abrir el archivo", "Usar la llave del reloj", "Dar el informe"], answer: "Abrir el archivo" },
  { id: "r-reconstruccion", sourceId: "reconstruccion", question: "¿Qué tenía que hacer Lucía, según el informe final?", options: ["Buscar la llave, guardarla y dar el informe", "Abrir el archivo y recoger papeles", "Usar la llave del reloj solamente"], answer: "Buscar la llave, guardarla y dar el informe" },
];

export const TENER_QUE_INTRO = {
  title: "La Sala de las Obligaciones",
  paragraphs: [
    "Detectives, aquí llega la siguiente cápsula.",
    "Ya sabéis algo importante: tener que hacer algo no es lo mismo que poder hacerlo, ni que quererlo.",
    "Tomás y Lucía hablan de un archivo cerrado, unos papeles, una llave dorada y un reloj que sigue detenido.",
    "El tiempo aprieta: hay tareas que no se pueden dejar para mañana.",
  ],
  mission: "Descubrid quién tiene que hacer qué, y por qué es obligatorio.",
};
