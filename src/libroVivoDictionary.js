// ============================================================
// LIBRO VIVO — личный словарь игрока (общий модуль).
// Тот же приём, что у прогресса капсул (api/capsules.js): localStorage —
// мгновенный кэш на устройстве, Redis (api/dictionary.js, ключ
// dictionary:{tgId}) — источник правды между устройствами. Запись —
// {chapterId, verbId, addedAt}, одна на конструкцию главы.
// Переводы приведены к инфинитиву (решение Оксаны 18.09.2026, живой
// прогон пилота): текст показывает спряжённую форму («entra»), а перевод
// в попапе — словарную, инфинитив («входить в»). Смешение спряжённого и
// инфинитива в одном глоссарии путало начинающих. Значение — из глоссария
// пилота Capítulo 1 (Notion, «Испанский пилот Главы 1»), только форма
// нормализована в инфинитив.
// ============================================================

export const CAP1_ID = "cap1";
export const CAP1_TITLE = "Capítulo 1 · El Reino del Caramelo";

export const CAP1_DICT = {
  "se-despierta": "просыпаться",
  "llega": "приходить",
  "toca": "трогать / касаться",
  "entrar-por": "входить через",
  "ser-de": "быть сделанным из",
  "entrar-en": "входить в",
  "brillar": "сиять",
  "parecer": "казаться",
  "empezar-con": "начинаться с",
  "ser": "быть / являться",
  "se-levanta": "вставать",
  "se-lava": "умываться",
  "se-pone": "надевать (на себя)",
  "estar": "находиться / быть",
  "decir": "говорить",
  "arreglar": "чинить",
  "coger": "брать",
  "caminar-por": "идти по",
  "encender": "зажигать",
  "se-enciende": "зажигаться",
  "funcionar": "работать",
  "pasar": "происходить / случаться",
  "prometer": "обещать",
  "hablar-de": "говорить о / говориться о",
  "existir": "существовать",
  "necesitar": "нуждаться",
  "despertar-a-alguien": "будить (кого-то)",
  "tocar-tu": "трогать",
  "respirar": "дышать",
  "ir-bien": "идти хорошо",
  "preparar": "готовить",
  "se-mueven": "двигаться (самим по себе)",
  "mirar": "смотреть / глядеть",
  "oler": "пахнуть",
  "contestar": "отвечать",
  "se-queja": "жаловаться",
  "ordenar": "раскладывать",
  "abrir": "открывать",
  "entrar": "входить",
  "tener": "иметь",
  "perfecto-compuesto": "перфект: «вошёл», «услышал» — Pretérito Perfecto Compuesto",
  "hacer": "задавать (вопрос) / делать (как всегда)",
  "llamarse": "зваться / называться",
  "tener-que": "быть должным (что-то сделать)",
  "seguir-adj": "оставаться (каким-то)",
  "mirar-por": "смотреть в (окно)",
  "creer": "думать / считать",
  "hay": "быть / иметься (безличная форма)",
  "entender": "понимать",
  "callar": "молчать",
  "pensar": "думать",
  "pasarle-a-alguien": "случаться с кем-то",
  "estar-encendida": "быть включённым / гореть",
  "vivir": "жить",
  "saber": "знать",
};

// Каноническая испанская форма конструкции — словарная (инфинитив), не
// форма из конкретного предложения. Показывается в «Моём словаре» рядом
// с инфинитивным переводом (см. CAP1_DICT выше), чтобы не путать
// спряжённую форму в тексте со словарной статьёй.
export const CAP1_LABEL = {
  "se-despierta": "despertarse",
  "llega": "llegar",
  "toca": "tocar",
  "entrar-por": "entrar por",
  "ser-de": "ser de (son de caramelo)",
  "entrar-en": "entrar en",
  "brillar": "brillar",
  "parecer": "parecer",
  "empezar-con": "empezar con",
  "ser": "ser",
  "se-levanta": "levantarse",
  "se-lava": "lavarse",
  "se-pone": "ponerse",
  "estar": "estar",
  "decir": "decir",
  "arreglar": "arreglar",
  "coger": "coger",
  "caminar-por": "caminar por",
  "encender": "encender",
  "se-enciende": "encenderse",
  "funcionar": "funcionar",
  "pasar": "pasar",
  "prometer": "prometer",
  "hablar-de": "hablar de / hablarse de",
  "existir": "existir",
  "necesitar": "necesitar",
  "despertar-a-alguien": "despertar (a alguien)",
  "tocar-tu": "tocar",
  "respirar": "respirar",
  "ir-bien": "ir bien",
  "preparar": "preparar",
  "se-mueven": "moverse",
  "mirar": "mirar",
  "oler": "oler",
  "contestar": "contestar",
  "se-queja": "quejarse",
  "ordenar": "ordenar",
  "abrir": "abrir",
  "entrar": "entrar",
  "tener": "tener",
  "perfecto-compuesto": "haber + participio (ha entrado, ha oído)",
  "hacer": "hacer",
  "llamarse": "llamarse",
  "tener-que": "tener que + infinitivo",
  "seguir-adj": "seguir + adjetivo",
  "mirar-por": "mirar por",
  "creer": "creer",
  "hay": "hay",
  "entender": "entender",
  "callar": "callar",
  "pensar": "pensar",
  "pasarle-a-alguien": "pasarle algo a alguien",
  "estar-encendida": "estar + participio (estar encendida)",
  "vivir": "vivir",
  "saber": "saber",
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
