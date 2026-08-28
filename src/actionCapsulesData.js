// Капсулы действия A1 · первый этаж 3 оператора × 7 действий.
// Контент отделён от интерфейса; те же действия и ID использует Игра №4.

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
  {
    id: "usar",
    infinitive: "usar",
    meaning: "использовать",
    taskRu: "использовать золотой венчик",
    object: "la varilla dorada",
    objectRu: "золотой венчик",
    scene: "La varilla dorada activa las palabras.",
  },
  {
    id: "dar",
    infinitive: "dar",
    meaning: "передать",
    taskRu: "передать поднос ответственному помощнику",
    object: "la bandeja al ayudante encargado",
    objectRu: "поднос ответственному помощнику",
    scene: "El ayudante encargado espera la bandeja en la Sala.",
  },
];

export const CAPSULE_STORIES = [
  {
    id: "door",
    actionId: "abrir",
    operatorId: "tener_que",
    story: "La puerta principal está cerrada. Es la única entrada a la Sala y la investigación empieza dentro.",
    storyRu: "Главная дверь закрыта. Это единственный вход в Зал, а расследование начинается внутри.",
    prompt: "Какой ход продвигает расследование?",
  },
  {
    id: "tray",
    actionId: "llevar",
    operatorId: "poder",
    story: "La bandeja es ligera. El ayudante tiene las manos libres y el camino a la Sala está abierto.",
    storyRu: "Поднос лёгкий. Руки помощника свободны, а путь в Зал открыт.",
    prompt: "Что помощник может сказать о своём действии?",
  },
  {
    id: "wand",
    actionId: "buscar",
    operatorId: "querer",
    story: "La varilla dorada ha desaparecido. El detective decide empezar por la Cocina.",
    storyRu: "Золотой венчик исчез. Детектив решает начать поиски с Кухни.",
    prompt: "Как он формулирует своё намерение?",
  },
  {
    id: "papers",
    actionId: "recoger",
    operatorId: "tener_que",
    story: "Los papeles están por todo el suelo. Si se quedan allí, una parte de la pista puede perderse.",
    storyRu: "Бумаги разбросаны по полу. Если оставить их там, часть улики может потеряться.",
    prompt: "Какое действие стало необходимым?",
  },
  {
    id: "key",
    actionId: "guardar",
    operatorId: "querer",
    story: "La llave dorada ya está encontrada. La detective elige un lugar seguro para ella.",
    storyRu: "Золотой ключ уже найден. Детектив выбирает для него безопасное место.",
    prompt: "Как она формулирует своё решение?",
  },
  {
    id: "wand-use",
    actionId: "usar",
    operatorId: "tener_que",
    story: "La varilla dorada está preparada. Sin ella, las palabras no se activan.",
    storyRu: "Золотой венчик готов. Без него слова не активируются.",
    prompt: "Какое действие необходимо для запуска слов?",
  },
  {
    id: "tray-give",
    actionId: "dar",
    operatorId: "tener_que",
    story: "La bandeja ha llegado a la Sala. El ayudante encargado espera recibirla.",
    storyRu: "Поднос доставлен в Зал. Ответственный помощник ждёт, когда ему его передадут.",
    prompt: "Какое действие теперь необходимо?",
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
