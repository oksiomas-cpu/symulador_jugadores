// Капсула 2 · QUERER. Контент полностью отделён от интерфейса.
// Внутри маршрута нет русского перевода: смысл восстанавливается по сцене и диалогу.

export const QUERER_DIALOGUES = [
  {
    id: "buscar",
    number: 1,
    title: "BUSCAR",
    context: "La llave dorada no está en su sitio.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿qué quieres buscar?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Quiero", "buscar", "la llave dorada."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Dónde quieres buscar la llave?" },
      { speaker: "Tomás", text: "Quiero buscarla en la habitación del Libro." },
    ],
  },
  {
    id: "llevar",
    number: 2,
    title: "LLEVAR",
    context: "Lucía encuentra la llave junto a la habitación del Libro.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿qué quieres hacer con la llave?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Quiero", "llevar", "la llave", "a la puerta principal."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "DIRECCIÓN"],
    after: [
      { speaker: "Detective", text: "¿Adónde quieres llevarla?" },
      { speaker: "Lucía", text: "A la puerta principal." },
    ],
  },
  {
    id: "abrir-negacion",
    number: 3,
    title: "ABRIR",
    context: "Tomás y Lucía están delante de la puerta principal.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿quieres abrir la puerta?" },
      { speaker: "Tomás", text: "Sí, quiero abrir la puerta." },
      { speaker: "Detective", text: "Lucía, ¿tú también quieres abrirla?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["No,", "yo no quiero", "abrir", "la puerta."],
    layers: ["NEGACIÓN", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [],
  },
  {
    id: "querer-poder",
    number: 4,
    title: "QUERER Y PODER",
    context: "La intención y la posibilidad no pertenecen a la misma persona.",
    before: [
      { speaker: "Tomás", text: "Quiero abrir la puerta, pero no puedo." },
      { speaker: "Lucía", text: "Yo puedo abrir la puerta, pero no quiero." },
      { speaker: "Detective", text: "Entonces, ¿quién quiere abrir la puerta?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Tomás", "quiere", "abrir", "la puerta."],
    layers: ["SUJETO", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [],
  },
  {
    id: "recoger",
    number: 5,
    title: "RECOGER",
    context: "Detrás de la puerta hay un libro de recetas en el suelo.",
    before: [
      { speaker: "Detective", text: "Lucía, ¿quieres recoger el libro?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Sí,", "quiero", "recoger", "el libro de recetas."],
    layers: ["RESPUESTA", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Por qué quieres recogerlo?" },
      { speaker: "Lucía", text: "Porque quiero dar el libro a Don Verbo." },
    ],
  },
  {
    id: "guardar",
    number: 6,
    title: "GUARDAR",
    context: "Tomás no quiere entregar el libro todavía.",
    before: [
      { speaker: "Tomás", text: "Espera. Yo quiero guardar el libro." },
      { speaker: "Lucía", text: "¿Dónde quieres guardar el libro?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Quiero", "guardar", "el libro", "en la caja."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "LUGAR"],
    after: [
      { speaker: "Lucía", text: "¿Por qué?" },
      { speaker: "Tomás", text: "Porque el libro puede ser una pista." },
    ],
  },
  {
    id: "usar",
    number: 7,
    title: "USAR",
    context: "El libro puede contener información sobre la desaparición.",
    before: [
      { speaker: "Detective", text: "Tomás, ¿quieres guardar el libro o usarlo?" },
      { speaker: "Tomás", text: "Primero quiero usar el libro." },
      { speaker: "Detective", text: "¿Para qué quieres usarlo?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Quiero", "usar", "el libro", "para encontrar una pista."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "FINALIDAD"],
    after: [],
  },
  {
    id: "dar",
    number: 8,
    title: "DAR",
    context: "Lucía quiere que Don Verbo examine el libro.",
    before: [
      { speaker: "Lucía", text: "Después quiero dar el libro a Don Verbo." },
      { speaker: "Detective", text: "¿A quién quieres dar el libro?" },
    ],
    answerSpeaker: "Lucía",
    answerTokens: ["Quiero", "dar", "el libro", "a Don Verbo."],
    layers: ["OPERADOR", "ACCIÓN", "OBJETO", "DESTINATARIO"],
    after: [
      { speaker: "Detective", text: "¿Tomás también quiere darlo?" },
      { speaker: "Lucía", text: "No. Tomás quiere guardar el libro." },
    ],
  },
  {
    id: "antes-ahora",
    number: 9,
    title: "ANTES Y AHORA",
    context: "La Sala muestra dos momentos de la misma intención.",
    before: [
      { speaker: "Detective", text: "Tomás, antes, ¿qué querías hacer?" },
    ],
    answerSpeaker: "Tomás",
    answerTokens: ["Antes", "quería", "buscar", "la llave."],
    layers: ["TIEMPO", "OPERADOR", "ACCIÓN", "OBJETO"],
    after: [
      { speaker: "Detective", text: "¿Y ahora qué quieres hacer?" },
      { speaker: "Tomás", text: "Ahora quiero abrir la puerta." },
    ],
  },
  {
    id: "reconstruccion",
    number: 10,
    title: "RECONSTRUIR",
    context: "Don Verbo pide el informe final de la Sala de las Intenciones.",
    before: [
      { speaker: "Don Verbo", text: "Detectives, ¿qué quería hacer Tomás?" },
    ],
    answerSpeaker: "Detective",
    answerTokens: ["Tomás", "quería", "buscar la llave", "y abrir la puerta."],
    layers: ["SUJETO", "OPERADOR", "PRIMERA ACCIÓN", "SEGUNDA ACCIÓN"],
    after: [
      { speaker: "Don Verbo", text: "¿Qué quería hacer Lucía?" },
      { speaker: "Detective", text: "Lucía quería llevar la llave, recoger el libro y dar el libro a Don Verbo." },
    ],
  },
];

export const QUERER_REVIEW = [
  {
    id: "r-buscar-quien",
    sourceId: "buscar",
    question: "¿Quién quiere buscar la llave dorada?",
    options: ["Tomás", "Lucía", "Don Verbo"],
    answer: "Tomás",
  },
  {
    id: "r-buscar-donde",
    sourceId: "buscar",
    question: "¿Dónde quiere buscar Tomás la llave?",
    options: ["En la habitación del Libro", "En la caja", "En la puerta principal"],
    answer: "En la habitación del Libro",
  },
  {
    id: "r-llevar",
    sourceId: "llevar",
    question: "¿Adónde quiere llevar Lucía la llave?",
    options: ["A la puerta principal", "A la Cocina", "A la caja"],
    answer: "A la puerta principal",
  },
  {
    id: "r-abrir",
    sourceId: "abrir-negacion",
    question: "¿Quién no quiere abrir la puerta?",
    options: ["Lucía", "Tomás", "El detective"],
    answer: "Lucía",
  },
  {
    id: "r-poder",
    sourceId: "querer-poder",
    question: "¿Quién quiere abrir la puerta, pero no puede?",
    options: ["Tomás", "Lucía", "Don Verbo"],
    answer: "Tomás",
  },
  {
    id: "r-recoger",
    sourceId: "recoger",
    question: "¿Por qué quiere Lucía recoger el libro?",
    options: ["Porque quiere darlo a Don Verbo", "Porque quiere abrirlo", "Porque quiere esconder la llave"],
    answer: "Porque quiere darlo a Don Verbo",
  },
  {
    id: "r-guardar",
    sourceId: "guardar",
    question: "¿Dónde quiere guardar Tomás el libro?",
    options: ["En la caja", "En la Cocina", "En el suelo"],
    answer: "En la caja",
  },
  {
    id: "r-usar",
    sourceId: "usar",
    question: "¿Para qué quiere Tomás usar el libro?",
    options: ["Para encontrar una pista", "Para abrir la puerta", "Para llevar la llave"],
    answer: "Para encontrar una pista",
  },
  {
    id: "r-dar",
    sourceId: "dar",
    question: "¿A quién quiere Lucía dar el libro?",
    options: ["A Don Verbo", "A Tomás", "Al detective"],
    answer: "A Don Verbo",
  },
  {
    id: "r-tiempo",
    sourceId: "antes-ahora",
    question: "¿Qué quería hacer Tomás antes?",
    options: ["Buscar la llave", "Guardar el libro", "Dar el libro"],
    answer: "Buscar la llave",
  },
];

export const QUERER_INTRO = {
  title: "La Sala de las Intenciones",
  paragraphs: [
    "Detectives, he recibido vuestra primera cápsula.",
    "Ya sabéis una cosa importante: querer hacer algo no significa hacerlo.",
    "Tomás y Lucía hablan de tres objetos: la llave dorada, la puerta principal y el libro de recetas.",
    "Los dos recuerdan lo que querían hacer, pero sus historias no coinciden.",
  ],
  mission: "Descubrid quién quiere hacer qué, con qué objeto, adónde y para quién.",
};
