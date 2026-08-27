// Капсулы действия A1 · первый вертикальный срез.
// Контент отделён от интерфейса: после живой проверки можно подключить usar / dar,
// не меняя механику тренажёра.

export const CAPSULE_OPERATORS = [
  {
    id: "querer",
    infinitive: "querer",
    yo: "Yo quiero",
    el: "Él quiere",
    ella: "Ella quiere",
    elRu: "он хочет",
    ellaRu: "она хочет",
    meaning: "хотеть",
    taskRu: "я хочу",
    label: "Я ХОЧУ",
    color: "#A81B3E",
  },
  {
    id: "poder",
    infinitive: "poder",
    yo: "Yo puedo",
    el: "Él puede",
    ella: "Ella puede",
    elRu: "он может",
    ellaRu: "она может",
    meaning: "мочь",
    taskRu: "я могу",
    label: "Я МОГУ",
    color: "#16795B",
  },
  {
    id: "tener_que",
    infinitive: "tener que",
    yo: "Yo tengo que",
    el: "Él tiene que",
    ella: "Ella tiene que",
    elRu: "ему нужно",
    ellaRu: "ей нужно",
    meaning: "быть должным",
    taskRu: "мне нужно",
    label: "МНЕ НУЖНО",
    color: "#A67C2E",
  },
];

export const CAPSULE_ACTIONS = [
  {
    id: "abrir",
    infinitive: "abrir",
    meaning: "открыть",
    taskRu: "открыть дверь",
    object: "la puerta",
    objectRu: "дверь",
    scene: "La puerta principal está cerrada.",
  },
  {
    id: "llevar",
    infinitive: "llevar",
    meaning: "отнести",
    taskRu: "отнести поднос в Зал",
    object: "la bandeja a la Sala",
    objectRu: "поднос в Зал",
    scene: "La bandeja tiene que llegar a la Sala.",
  },
  {
    id: "buscar",
    infinitive: "buscar",
    meaning: "искать",
    taskRu: "искать золотую палочку",
    object: "la varilla dorada",
    objectRu: "золотую палочку",
    scene: "La varilla dorada ha desaparecido.",
  },
  {
    id: "recoger",
    infinitive: "recoger",
    meaning: "собрать",
    taskRu: "собрать бумаги с пола",
    object: "los papeles del suelo",
    objectRu: "бумаги с пола",
    scene: "Hay papeles por todo el suelo.",
  },
  {
    id: "guardar",
    infinitive: "guardar",
    meaning: "убрать на хранение",
    taskRu: "убрать золотой ключ",
    object: "la llave dorada",
    objectRu: "золотой ключ",
    scene: "La llave dorada no puede quedarse aquí.",
  },
];

export const CAPSULE_STORIES = [
  {
    id: "door",
    actionId: "abrir",
    operatorId: "tener_que",
    story: "La puerta principal está cerrada. Es la única entrada a la Sala y la investigación empieza dentro.",
    prompt: "Какой ход продвигает расследование?",
  },
  {
    id: "tray",
    actionId: "llevar",
    operatorId: "poder",
    story: "La bandeja es ligera. El ayudante tiene las manos libres y el camino a la Sala está abierto.",
    prompt: "Что помощник может сказать о своём действии?",
  },
  {
    id: "wand",
    actionId: "buscar",
    operatorId: "querer",
    story: "La varilla dorada ha desaparecido. El detective decide empezar por la Cocina.",
    prompt: "Как он формулирует своё намерение?",
  },
  {
    id: "papers",
    actionId: "recoger",
    operatorId: "tener_que",
    story: "Los papeles están por todo el suelo. Si se quedan allí, una parte de la pista puede perderse.",
    prompt: "Какое действие стало необходимым?",
  },
  {
    id: "key",
    actionId: "guardar",
    operatorId: "querer",
    story: "La llave dorada ya está encontrada. La detective elige un lugar seguro para ella.",
    prompt: "Как она формулирует своё решение?",
  },
];

export function capsulePhrase(operatorId, actionId, person = "yo") {
  const operator = CAPSULE_OPERATORS.find((item) => item.id === operatorId);
  const action = CAPSULE_ACTIONS.find((item) => item.id === actionId);
  if (!operator || !action) return "";
  const operatorForm = person === "el" ? operator.el : person === "ella" ? operator.ella : operator.yo;
  return `${operatorForm} ${action.infinitive} ${action.object}`;
}

export function capsuleByIds(operatorId, actionId) {
  return {
    operator: CAPSULE_OPERATORS.find((item) => item.id === operatorId),
    action: CAPSULE_ACTIONS.find((item) => item.id === actionId),
  };
}
