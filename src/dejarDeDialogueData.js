// Капсула 14 · DEJAR DE, вторая позиция оператора. Та же механика, что у
// PODER_DIALOGUES (poderDialogueData.js): без русского перевода, смысл
// восстанавливается по сцене и диалогу. Банк действий — те же 7, что в
// actionCapsulesData.js (CAPSULE_ACTIONS).

export const DEJAR_DE_DIALOGUES = [
  {
    id: "abrir",
    number: 1,
    title: "ABRIR",
    context: "Lucía lleva media hora abriendo cajones de la biblioteca.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿dejas de abrir cajones?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Sí,", "dejo de", "abrir", "cajones."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Por qué te detienes?" },
      { speaker: "Lucía", text: "Porque ya he abierto todos los que hay." },
    ],
  },
  {
    id: "llevar",
    number: 2,
    title: "LLEVAR",
    context: "Tomás llevaba libros de un lado a otro sin descanso.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿dejas de llevar libros?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["No,", "no dejo de", "llevar", "libros."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Por qué sigues?" },
      { speaker: "Tomás", text: "Porque todavía quedan muchos en el suelo." },
    ],
  },
  {
    id: "buscar",
    number: 3,
    title: "BUSCAR",
    context: "Lucía llevaba toda la tarde buscando la llave dorada.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿dejas de buscar la llave?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Sí,", "dejo de", "buscar", "la llave dorada."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿La has encontrado?" },
      { speaker: "Lucía", text: "No, pero dejo de buscarla: está oscureciendo." },
    ],
  },
  {
    id: "recoger",
    number: 4,
    title: "RECOGER",
    context: "Tomás recogía libros caídos uno por uno.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿dejas de recoger libros ya?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Dejo de", "recoger", "libros", "por hoy."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "TIEMPO"],
    after: [],
  },
  {
    id: "guardar",
    number: 5,
    title: "GUARDAR",
    context: "Lucía guardaba los papeles de la investigación uno tras otro.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿dejas de guardar los papeles?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Sí,", "dejo de", "guardar", "los papeles."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Por qué?" },
      { speaker: "Lucía", text: "Porque Don Verbo quiere volver a revisarlos mañana." },
    ],
  },
  {
    id: "usar",
    number: 6,
    title: "USAR",
    context: "Tomás usaba la escalera para llegar a los estantes altos.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿dejas de usar la escalera?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Sí,", "dejo de", "usar", "la escalera."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Ya no la necesitas?" },
      { speaker: "Tomás", text: "No, ya he revisado los estantes altos." },
    ],
  },
  {
    id: "dar",
    number: 7,
    title: "DAR",
    context: "Lucía entregaba libros a Don Verbo uno tras otro.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿dejas de dar libros a Don Verbo?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Dejo de", "dar", "libros", "a Don Verbo."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "DESTINATARIO"],
    after: [
      { speaker: "Detective", text: "¿Por qué paras?" },
      { speaker: "Lucía", text: "Porque él ya tiene suficientes para revisar hoy." },
    ],
  },
  {
    id: "dejar-de-empezar-a",
    number: 8,
    title: "DEJAR DE Y EMPEZAR A",
    context: "Empezar y dejar de hacer algo son movimientos contrarios.",
    before: [
      { speaker: "Tomás", text: "Yo empiezo a recoger libros ahora mismo." },
      { speaker: "Lucía", text: "Yo, en cambio, dejo de buscar la llave." },
      { speaker: "Detective", text: "Entonces, ¿quién empieza y quién termina?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Tomás", "empieza,", "y Lucía", "deja de buscar."],
    layers: ["SUJETO 1", "OPERADOR 1", "SUJETO 2", "OPERADOR 2"],
    after: [],
  },
  {
    id: "antes-ahora",
    number: 9,
    title: "ANTES Y AHORA",
    context: "Cada tarde, antes de cerrar la biblioteca, Lucía dejaba de hacer algo distinto.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿qué dejabas de hacer cada tarde esta semana?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Cada tarde", "dejaba de", "abrir", "cajones."],
    layers: ["FRECUENCIA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Y ahora qué dejas de hacer?" },
      { speaker: "Lucía", text: "Ahora dejo de buscar la llave dorada." },
    ],
  },
  {
    id: "reconstruccion",
    number: 10,
    title: "RECONSTRUIR",
    context: "Don Verbo pide el informe final de la Sala de las Pausas.",
    before: [
      { speaker: "Don Verbo", text: "Detectives, ¿qué dejaba de hacer Tomás?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Tomás", "dejaba de", "llevar libros", "y usar la escalera."],
    layers: ["SUJETO", "OPERADOR", "PRIMERA ACCIÓN", "SEGUNDA ACCIÓN"],
    after: [
      { speaker: "Don Verbo", text: "¿Y Lucía?" },
      { speaker: "Detective", text: "Lucía dejaba de abrir cajones, buscar la llave y dar libros a Don Verbo." },
    ],
  },
];

export const DEJAR_DE_REVIEW = [
  { id: "r-abrir", sourceId: "abrir", question: "¿Por qué deja Lucía de abrir cajones?", options: ["Porque ya ha abierto todos los que hay", "Porque está cansada", "Porque Don Verbo lo pidió"], answer: "Porque ya ha abierto todos los que hay" },
  { id: "r-llevar", sourceId: "llevar", question: "¿Por qué no deja Tomás de llevar libros?", options: ["Porque todavía quedan muchos en el suelo", "Porque le gusta", "Porque Lucía se lo pidió"], answer: "Porque todavía quedan muchos en el suelo" },
  { id: "r-buscar", sourceId: "buscar", question: "¿Por qué deja Lucía de buscar la llave dorada?", options: ["Porque está oscureciendo", "Porque la ha encontrado", "Porque no le interesa"], answer: "Porque está oscureciendo" },
  { id: "r-recoger", sourceId: "recoger", question: "¿Cuándo deja Tomás de recoger libros?", options: ["Por hoy", "Para siempre", "Nunca"], answer: "Por hoy" },
  { id: "r-guardar", sourceId: "guardar", question: "¿Por qué deja Lucía de guardar los papeles?", options: ["Porque Don Verbo quiere volver a revisarlos mañana", "Porque están mojados", "Porque Tomás se lo pidió"], answer: "Porque Don Verbo quiere volver a revisarlos mañana" },
  { id: "r-usar", sourceId: "usar", question: "¿Por qué deja Tomás de usar la escalera?", options: ["Porque ya ha revisado los estantes altos", "Porque está rota", "Porque Lucía la necesita"], answer: "Porque ya ha revisado los estantes altos" },
  { id: "r-dar", sourceId: "dar", question: "¿Por qué deja Lucía de dar libros a Don Verbo?", options: ["Porque él ya tiene suficientes para hoy", "Porque no quedan libros", "Porque Don Verbo se ha ido"], answer: "Porque él ya tiene suficientes para hoy" },
  { id: "r-dejar-de-empezar-a", sourceId: "dejar-de-empezar-a", question: "Según la Sala, ¿quién empieza y quién deja de buscar?", options: ["Tomás empieza, Lucía deja de buscar", "Lucía empieza, Tomás deja de buscar", "Los dos dejan de buscar"], answer: "Tomás empieza, Lucía deja de buscar" },
  { id: "r-antes", sourceId: "antes-ahora", question: "¿Qué dejaba Lucía de hacer cada tarde, según la Sala?", options: ["Abrir cajones", "Buscar la llave", "Dar libros"], answer: "Abrir cajones" },
  { id: "r-reconstruccion", sourceId: "reconstruccion", question: "¿Qué dejaba de hacer Lucía, según el informe final?", options: ["Abrir cajones, buscar la llave y dar libros", "Solo recoger libros", "Usar la escalera solamente"], answer: "Abrir cajones, buscar la llave y dar libros" },
];

export const DEJAR_DE_INTRO = {
  title: "La Sala de las Pausas",
  paragraphs: [
    "Detectives, aquí llega vuestra siguiente cápsula.",
    "Ya sabéis algo importante: dejar de hacer algo es tan significativo como empezarlo.",
    "Tomás y Lucía hablan de unos cajones de biblioteca, unos libros caídos y una escalera.",
    "No todo lo que se detiene está perdido: algunas pausas vuelven mañana.",
  ],
  mission: "Descubrid quién deja de hacer qué, y por qué.",
};
