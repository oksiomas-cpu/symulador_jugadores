// Капсула 16 · VOLVER A, вторая позиция оператора. Та же механика, что у
// PODER_DIALOGUES (poderDialogueData.js): без русского перевода, смысл
// восстанавливается по сцене и диалогу. Банк действий — те же 7, что в
// actionCapsulesData.js (CAPSULE_ACTIONS).

export const VOLVER_A_DIALOGUES = [
  {
    id: "abrir",
    number: 1,
    title: "ABRIR",
    context: "Tomás ya abrió esta puerta esta mañana.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿vuelves a abrir la puerta?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Sí,", "vuelvo a", "abrir", "la puerta."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Cuántas veces hoy?" },
      { speaker: "Tomás", text: "Vuelvo a abrirla por tercera vez." },
    ],
  },
  {
    id: "llevar",
    number: 2,
    title: "LLEVAR",
    context: "Lucía ya llevó el libro al despacho hace una hora.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿vuelves a llevar el libro?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["No,", "no vuelvo a", "llevar", "el libro."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Por qué no?" },
      { speaker: "Lucía", text: "Porque ya está donde tiene que estar." },
    ],
  },
  {
    id: "buscar",
    number: 3,
    title: "BUSCAR",
    context: "La llave dorada ha desaparecido otra vez.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿vuelves a buscar la llave?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Sí,", "vuelvo a", "buscar", "la llave dorada."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Otra vez en la biblioteca?" },
      { speaker: "Tomás", text: "Sí, vuelvo a buscarla en los mismos cajones." },
    ],
  },
  {
    id: "recoger",
    number: 4,
    title: "RECOGER",
    context: "Los papeles se han caído por segunda vez.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿vuelves a recoger los papeles?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Vuelvo a", "recoger", "los papeles."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO"],
    after: [],
  },
  {
    id: "guardar",
    number: 5,
    title: "GUARDAR",
    context: "La llave dorada ha aparecido de nuevo.",
    before: [
      { speaker: "Detective", text: "¿Dónde vuelves a guardarla?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Vuelvo a", "guardar", "la llave", "en la caja fuerte."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "LUGAR"],
    after: [
      { speaker: "Detective", text: "¿El mismo lugar de siempre?" },
      { speaker: "Tomás", text: "Sí, siempre vuelvo a guardarla ahí." },
    ],
  },
  {
    id: "usar",
    number: 6,
    title: "USAR",
    context: "Don Verbo pide revisar el reloj otra vez.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿vuelves a usar la llave del reloj?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Sí,", "vuelvo a", "usar", "la llave del reloj."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [],
  },
  {
    id: "dar",
    number: 7,
    title: "DAR",
    context: "El informe vuelve a estar listo, corregido por segunda vez.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿vuelves a dar el informe a Don Verbo?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Vuelvo a", "dar", "el informe", "a Don Verbo."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "DESTINATARIO"],
    after: [
      { speaker: "Detective", text: "¿Por qué otra vez?" },
      { speaker: "Tomás", text: "Porque la primera versión tenía un error." },
    ],
  },
  {
    id: "volver-a-dejar-de",
    number: 8,
    title: "VOLVER A Y DEJAR DE",
    context: "Volver a hacer algo y dejar de hacerlo son movimientos contrarios.",
    before: [
      { speaker: "Lucía", text: "Yo dejo de buscar la llave por hoy." },
      { speaker: "Tomás", text: "Yo, en cambio, vuelvo a buscarla una vez más." },
      { speaker: "Detective", text: "Entonces, ¿quién repite la acción?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Tomás", "vuelve a", "buscar", "la llave."],
    layers: ["SUJETO", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [],
  },
  {
    id: "antes-ahora",
    number: 9,
    title: "ANTES Y AHORA",
    context: "Cada mañana, al entrar en la Sala, Lucía volvía a hacer algo que ya había hecho el día anterior.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿qué volvías a hacer cada mañana?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Cada mañana", "volvía a", "recoger", "los papeles."],
    layers: ["FRECUENCIA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Y ahora qué vuelves a hacer?" },
      { speaker: "Lucía", text: "Ahora vuelvo a usar la llave del reloj." },
    ],
  },
  {
    id: "reconstruccion",
    number: 10,
    title: "RECONSTRUIR",
    context: "Don Verbo pide el informe final de la Sala de las Repeticiones.",
    before: [
      { speaker: "Don Verbo", text: "Detectives, ¿qué volvía a hacer Tomás?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Tomás", "volvía a", "abrir la puerta", "y buscar la llave."],
    layers: ["SUJETO", "OPERADOR", "PRIMERA ACCIÓN", "SEGUNDA ACCIÓN"],
    after: [
      { speaker: "Don Verbo", text: "¿Y Lucía?" },
      { speaker: "Detective", text: "Lucía volvía a recoger los papeles, usar la llave del reloj y dar el informe otra vez." },
    ],
  },
];

export const VOLVER_A_REVIEW = [
  { id: "r-abrir", sourceId: "abrir", question: "¿Cuántas veces vuelve Tomás a abrir la puerta hoy?", options: ["Por tercera vez", "Por primera vez", "Por segunda vez"], answer: "Por tercera vez" },
  { id: "r-llevar", sourceId: "llevar", question: "¿Por qué no vuelve Lucía a llevar el libro?", options: ["Porque ya está donde tiene que estar", "Porque pesa demasiado", "Porque no es su tarea"], answer: "Porque ya está donde tiene que estar" },
  { id: "r-buscar", sourceId: "buscar", question: "¿Dónde vuelve Tomás a buscar la llave dorada?", options: ["En los mismos cajones", "En un lugar nuevo", "En la cocina"], answer: "En los mismos cajones" },
  { id: "r-recoger", sourceId: "recoger", question: "¿Cuántas veces se han caído los papeles?", options: ["Por segunda vez", "Por primera vez", "Muchas veces"], answer: "Por segunda vez" },
  { id: "r-guardar", sourceId: "guardar", question: "¿Dónde vuelve Tomás a guardar la llave?", options: ["En la caja fuerte", "En el despacho", "En la biblioteca"], answer: "En la caja fuerte" },
  { id: "r-usar", sourceId: "usar", question: "¿Qué vuelve Lucía a usar para el reloj?", options: ["La llave del reloj", "El libro de recetas", "La varilla dorada"], answer: "La llave del reloj" },
  { id: "r-dar", sourceId: "dar", question: "¿Por qué vuelve Tomás a dar el informe a Don Verbo?", options: ["Porque la primera versión tenía un error", "Porque Don Verbo lo perdió", "Porque quiere otra copia"], answer: "Porque la primera versión tenía un error" },
  { id: "r-volver-a-dejar-de", sourceId: "volver-a-dejar-de", question: "Según la Sala, ¿quién repite la acción de buscar la llave?", options: ["Tomás", "Lucía", "Don Verbo"], answer: "Tomás" },
  { id: "r-antes", sourceId: "antes-ahora", question: "¿Qué volvía Lucía a hacer cada mañana, según la Sala?", options: ["Recoger los papeles", "Buscar la llave", "Dar el informe"], answer: "Recoger los papeles" },
  { id: "r-reconstruccion", sourceId: "reconstruccion", question: "¿Qué volvía a hacer Lucía, según el informe final?", options: ["Recoger los papeles, usar la llave del reloj y dar el informe", "Solo abrir la puerta", "Guardar la llave solamente"], answer: "Recoger los papeles, usar la llave del reloj y dar el informe" },
];

export const VOLVER_A_INTRO = {
  title: "La Sala de las Repeticiones",
  paragraphs: [
    "Detectives, aquí llega vuestra última cápsula de esta línea.",
    "Ya sabéis algo importante: volver a hacer algo significa hacer de nuevo algo que ya se hizo antes.",
    "Tomás y Lucía hablan de una puerta, una llave dorada, un reloj y un informe con un error.",
    "En la Sala de las Repeticiones nada empieza de cero: todo tiene una vez anterior.",
  ],
  mission: "Descubrid quién vuelve a hacer qué, y cuántas veces.",
};
