// ============================================================
// LIBRO VIVO — личный словарь игрока (общий модуль).
// Тот же приём, что у прогресса капсул (api/capsules.js): localStorage —
// мгновенный кэш на устройстве, Redis (api/dictionary.js, ключ
// dictionary:{tgId}) — источник правды между устройствами. Запись —
// {chapterId, verbId, addedAt}, одна на конструкцию главы.
// Переводы взяты дословно из глоссария пилота Capítulo 1 (Notion,
// «Испанский пилот Главы 1») — здесь ничего заново не переводится.
// ============================================================

export const CAP1_ID = "cap1";
export const CAP1_TITLE = "Capítulo 1 · El Reino del Caramelo";

export const CAP1_DICT = {
  "se-despierta": "просыпается",
  "llega": "приходит",
  "toca": "трогает / касается",
  "entrar-por": "входить через",
  "ser-de": "быть сделанным из",
  "entrar-en": "входить в",
  "brillar": "сияют / сияет",
  "parecer": "кажутся",
  "empezar-con": "начинаться с",
  "ser": "есть / является",
  "se-levanta": "встаёт",
  "se-lava": "умывается",
  "se-pone": "надевает (на себя)",
  "estar": "находится / есть",
  "decir": "говорит / говорю / говоришь",
  "arreglar": "чиню / чинит",
  "coger": "берёт",
  "caminar-por": "идти по",
  "encender": "зажигаю / зажигает",
  "se-enciende": "зажигается",
  "funcionar": "работают / работает",
  "pasar": "происходит / случается",
  "prometer": "обещает",
  "hablar-de": "говорить о / говорится о",
  "existir": "существует",
  "necesitar": "нуждается",
  "despertar-a-alguien": "будит",
  "tocar-tu": "трогаешь",
  "respirar": "дышит",
  "ir-bien": "идти хорошо",
  "preparar": "готовит / готовлю",
  "se-mueven": "двигаются (сами)",
  "mirar": "смотреть / глядеть",
  "oler": "пахнет",
  "contestar": "отвечают",
  "se-queja": "жалуется",
  "ordenar": "раскладывает",
  "abrir": "открывает",
  "entrar": "входит",
  "tener": "имеет",
  "perfecto-compuesto": "перфект: «вошёл», «услышал» — Pretérito Perfecto Compuesto",
  "hacer": "задаёт (вопрос) / делает (как всегда)",
  "llamarse": "зваться / называться",
  "tener-que": "быть должным (что-то сделать)",
  "seguir-adj": "оставаться (каким-то) — «всё ещё пустая»",
  "mirar-por": "смотреть в (окно)",
  "creer": "думает / считает",
  "hay": "есть / имеется (безличная форма)",
  "entender": "понимает",
  "callar": "молчит",
  "pensar": "думает",
  "pasarle-a-alguien": "случаться с кем-то",
  "estar-encendida": "состояние: «включена / горит»",
  "vivir": "живёт",
  "saber": "знает",
};

// Каноническая испанская форма конструкции (левая колонка глоссария) —
// для отображения в «Моём словаре», где важна не форма из конкретного
// предложения, а сама конструкция.
export const CAP1_LABEL = {
  "se-despierta": "se despierta",
  "llega": "llega",
  "toca": "toca",
  "entrar-por": "entrar por",
  "ser-de": "ser de (son de caramelo)",
  "entrar-en": "entrar en",
  "brillar": "brillan / brilla",
  "parecer": "parecen",
  "empezar-con": "empezar con",
  "ser": "es",
  "se-levanta": "se levanta",
  "se-lava": "se lava",
  "se-pone": "se pone",
  "estar": "está",
  "decir": "dice / digo / dices",
  "arreglar": "arreglo / arregla",
  "coger": "coge",
  "caminar-por": "caminar por",
  "encender": "enciendo / enciende",
  "se-enciende": "se enciende",
  "funcionar": "funcionan / funciona",
  "pasar": "pasa",
  "prometer": "promete",
  "hablar-de": "hablar de / hablarse de",
  "existir": "existe",
  "necesitar": "necesita",
  "despertar-a-alguien": "despierta (a alguien)",
  "tocar-tu": "tocas",
  "respirar": "respira",
  "ir-bien": "ir bien (va bien)",
  "preparar": "prepara / preparo",
  "se-mueven": "se mueven",
  "mirar": "mirar",
  "oler": "huele",
  "contestar": "contestan",
  "se-queja": "se queja",
  "ordenar": "ordena",
  "abrir": "abre",
  "entrar": "entra",
  "tener": "tiene",
  "perfecto-compuesto": "haber + participio (ha entrado, ha oído)",
  "hacer": "hace (una pregunta / lo de siempre)",
  "llamarse": "llamarse (se llama)",
  "tener-que": "tener que + infinitivo",
  "seguir-adj": "seguir + adjetivo (sigue vacía)",
  "mirar-por": "mirar por",
  "creer": "cree",
  "hay": "hay",
  "entender": "entiende",
  "callar": "calla",
  "pensar": "piensa",
  "pasarle-a-alguien": "pasarle algo a alguien (pasa a mí)",
  "estar-encendida": "estar + participio (está encendida)",
  "vivir": "vive",
  "saber": "sabe",
};

export function labelFor(chapterId, verbId) {
  if (chapterId === CAP1_ID) return CAP1_LABEL[verbId] || verbId;
  return verbId;
}

export function translationFor(chapterId, verbId) {
  if (chapterId === CAP1_ID) return CAP1_DICT[verbId] || null;
  return null;
}

export function chapterTitle(chapterId) {
  if (chapterId === CAP1_ID) return CAP1_TITLE;
  return chapterId;
}

const STORAGE_KEY = "ciudad:libro-vivo-dictionary:v1";

// items: [{chapterId, verbId, addedAt}]
export function readDictionaryLocal() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && Array.isArray(saved.items)) return saved.items;
  } catch (_) { /* localStorage может быть недоступен внутри webview. */ }
  return [];
}

export function writeDictionaryLocal(items) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items })); } catch (_) { /* UI остаётся рабочим без storage. */ }
}

// Облачный вызов — та же идемпотентная модель, что у capsulesCloudCall:
// сервер всегда возвращает полный список записей tgId, синк безопасно
// повторять на каждом открытии листа.
export async function dictionaryCloudCall(payload) {
  const resp = await fetch("/api/dictionary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const d = await resp.json();
  if (!resp.ok || !d.ok) throw new Error(d.error || "dictionary api error");
  return d.items;
}
