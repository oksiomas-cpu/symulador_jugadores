// ============================================================
// ТАП-ПЕРЕВОД ГЛАГОЛОВ — 16 капсул Дона Вербо.
// ТЗ (сессия автоматизации методологии, 30.08.2026). Тот же принцип, что и
// у TapActionText в Игре №4 (SimuladorJugador.jsx, тап-перевод в 15 уликах
// Canon/Fantasía): тап работает по конечному списку известных глагольных
// конструкций, а не по любому слову текста — расширяемые словари вместо
// одной длинной таблицы готовых фраз.
//
// Логика вынесена в отдельный модуль без JSX, чтобы:
// 1) её можно было проверить напрямую (scripts/validate-action-capsules.mjs)
//    без рендера React;
// 2) не трогать работающий код SimuladorJugador.jsx — словарь действий
//    капсул (7 глаголов) продублирован здесь в тех же значениях, что и в
//    ACTION_VERBS_RU/ACTION_CLITICS_RU/DAR_SE_RU (Игра №4). При добавлении
//    нового действия в капсулы сверить оба места вручную.
//
// Область применения: тексты сцен и историй-диалогов внутри 16 капсул
// (Cápsula 1 · scene.es и Cápsula 2 · context/before/after). Сама сцена
// капсул 2 намеренно не переводится целиком («No traduzcas: sigue la
// escena») — тап даёт точечную подсказку по запросу игрока, не готовый
// перевод фразы, и не меняет эту механику.
// ============================================================

// Действия капсул (те же 7, что и в Игре №4 / actionCapsulesData.js).
export const CAPSULE_ACTION_VERBS_RU = {
  abrir: "открыть",
  llevar: "нести / унести",
  buscar: "искать",
  recoger: "поднять / забрать",
  guardar: "сохранить, убрать",
  usar: "использовать",
  dar: "отдать",
};
export const CAPSULE_ACTION_CLITICS_RU = { la: "её", lo: "его", las: "их", los: "их" };
// dar + se + местоимение (dársela/dárselo) — готовая составная фраза целиком.
export const CAPSULE_DAR_SE_RU = { la: "отдать её", lo: "отдать его", las: "отдать их", los: "отдать их" };

// Устойчивые сочетания глагол+существительное, где значение целиком уходит
// от однословного перевода того же глагола (добыто кровью 30.08 вечером:
// «dar cuerda al reloj» — «завести часы» — по одному слову «dar» превращался
// в «отдать», хотя здесь это не про «отдать», а про «завести/заводить»).
// Проверяется ДО однословного словаря действий, тем же двухтокенным проходом,
// что и CAPSULE_OPERATOR_PREP_RU — узел не разрывается на два тапа.
export const CAPSULE_ACTION_IDIOM_RU = {
  "dar cuerda": "завести (часы)",
};

// Однословные операторы капсул — QUERER/PODER/INTENTAR не требуют предлога
// перед действием, поэтому форма сама по себе уже целый узел. Presente и
// Pretérito Imperfecto — в историях капсул оба времени встречаются (пара
// «antes / ahora» строит контраст именно на них).
export const CAPSULE_OPERATOR_RU = {
  quiero: "хочу", quieres: "хочешь", quiere: "хочет",
  queremos: "хотим", queréis: "хотите", quieren: "хотят",
  quería: "хотел / хотела", querías: "хотел / хотела",
  queríamos: "хотели", queríais: "хотели", querían: "хотели",

  puedo: "могу", puedes: "можешь", puede: "может",
  podemos: "можем", podéis: "можете", pueden: "могут",
  podía: "мог / могла", podías: "мог / могла",
  podíamos: "могли", podíais: "могли", podían: "могли",

  intento: "пытаюсь", intentas: "пытаешься", intenta: "пытается",
  intentamos: "пытаемся", intentáis: "пытаетесь", intentan: "пытаются",
  intentaba: "пытался / пыталась", intentabas: "пытался / пыталась",
  intentábamos: "пытались", intentabais: "пытались", intentaban: "пытались",
};

// Операторы с обязательным предлогом — форма + предлог образуют ОДИН узел
// («мне нужно» ≠ «мне» + «нужно»); действие после оператора переводится
// отдельным, вторым тапом через CAPSULE_ACTION_VERBS_RU (см. capsulePhrase
// пример в ТЗ: tengo que abrir → «мне нужно» + «открыть», раздельно).
// Ключ — "форма предлог" из текста в нижнем регистре. Новый глагол с
// обязательным предлогом (hablar con, pensar en, depender de и т.п.)
// добавляется одной строкой сюда же, без правки компонента-рендера.
export const CAPSULE_OPERATOR_PREP_RU = {
  "tengo que": "мне нужно", "tienes que": "тебе нужно", "tiene que": "ему/ей нужно",
  "tenemos que": "нам нужно", "tenéis que": "вам нужно", "tienen que": "им нужно",
  "tenía que": "нужно было", "tenías que": "нужно было",
  "teníamos que": "нужно было", "teníais que": "нужно было", "tenían que": "нужно было",

  "voy a": "собираюсь", "vas a": "собираешься", "va a": "собирается",
  "vamos a": "собираемся", "vais a": "собираетесь", "van a": "собираются",
  "iba a": "собирался / собиралась", "ibas a": "собирался / собиралась",
  "íbamos a": "собирались", "ibais a": "собирались", "iban a": "собирались",

  "empiezo a": "начинаю", "empiezas a": "начинаешь", "empieza a": "начинает",
  "empezamos a": "начинаем", "empezáis a": "начинаете", "empiezan a": "начинают",
  "empezaba a": "начинал / начинала", "empezabas a": "начинал / начинала",
  "empezábamos a": "начинали", "empezabais a": "начинали", "empezaban a": "начинали",

  "dejo de": "перестаю", "dejas de": "перестаёшь", "deja de": "перестаёт",
  "dejamos de": "перестаём", "dejáis de": "перестаёте", "dejan de": "перестают",
  "dejaba de": "переставал / переставала", "dejabas de": "переставал / переставала",
  "dejábamos de": "переставали", "dejabais de": "переставали", "dejaban de": "переставали",

  "vuelvo a": "снова", "vuelves a": "снова", "vuelve a": "снова",
  "volvemos a": "снова", "volvéis a": "снова", "vuelven a": "снова",
  "volvía a": "снова", "volvías a": "снова",
  "volvíamos a": "снова", "volvíais a": "снова", "volvían a": "снова",

  // Расширение на будущее — другие глаголы с обязательным предлогом,
  // которых пока нет в текстах капсул (пример из ТЗ):
  // "hablo con": "говорю с", "pienso en": "думаю о", "dependo de": "завишу от",
};

export function capsuleCleanToken(raw) {
  return raw.trim().replace(/^[¿¡«»"'“„(]+/, "").replace(/[.,;:!?»"'”“)]+$/, "");
}

// Действие капсулы + возможное слитное местоимение (abrirla, recogerlos,
// dársela…) — тот же разбор, что и actionVerbTranslation в Игре №4.
export function capsuleActionTranslation(rawToken) {
  const clean = capsuleCleanToken(rawToken);
  if (!clean) return null;
  const lower = clean.toLowerCase();
  const darSe = lower.match(/^d[aá]rse(la|lo|las|los)$/);
  if (darSe) return CAPSULE_DAR_SE_RU[darSe[1]];
  if (lower === "dar") return CAPSULE_ACTION_VERBS_RU.dar;
  for (const verb of Object.keys(CAPSULE_ACTION_VERBS_RU)) {
    if (verb === "dar") continue;
    if (lower === verb) return CAPSULE_ACTION_VERBS_RU[verb];
    const m = lower.match(new RegExp("^" + verb + "(la|lo|las|los)$"));
    if (m) return `${CAPSULE_ACTION_VERBS_RU[verb]} ${CAPSULE_ACTION_CLITICS_RU[m[1]]}`;
  }
  return null;
}

// Перевод одного слова: сначала однословный оператор, затем действие.
// Двухсловные конструкции (CAPSULE_OPERATOR_PREP_RU) разбираются отдельно
// в capsuleTapSegments — там решение принимается по ДВУМ токенам сразу.
export function capsuleVerbTranslation(rawToken) {
  const clean = capsuleCleanToken(rawToken).toLowerCase();
  if (!clean) return null;
  if (CAPSULE_OPERATOR_RU[clean]) return CAPSULE_OPERATOR_RU[clean];
  return capsuleActionTranslation(rawToken);
}

// Разбирает текст истории на сегменты для тап-рендера:
// { text, tap } — если tap не null, кусок текста тапается и по клику
// показывает перевод; иначе рендерится как есть. Двухсловная конструкция
// (tengo que, ir a, empezar a, dejar de, volver a, …) возвращается ОДНИМ
// сегментом — сложенным текстом обоих токенов, — чтобы узел не распадался
// на отдельные слова. join(segments.map(s => s.text)) всегда равен text
// (символы не теряются и не переставляются).
export function capsuleTapSegments(text) {
  if (!text) return [];
  const raw = text.match(/\S+\s*/g) || [text];
  const segments = [];
  let i = 0;
  while (i < raw.length) {
    const word1 = capsuleCleanToken(raw[i]).toLowerCase();
    const word2 = i + 1 < raw.length ? capsuleCleanToken(raw[i + 1]).toLowerCase() : "";
    const key2 = word2 ? `${word1} ${word2}` : "";
    const phraseTr = word2 ? (CAPSULE_ACTION_IDIOM_RU[key2] ?? CAPSULE_OPERATOR_PREP_RU[key2]) : undefined;
    if (phraseTr) {
      segments.push({ text: raw[i] + raw[i + 1], tap: phraseTr });
      i += 2;
      continue;
    }
    const singleTr = capsuleVerbTranslation(raw[i]);
    if (singleTr) {
      segments.push({ text: raw[i], tap: singleTr });
      i += 1;
      continue;
    }
    segments.push({ text: raw[i], tap: null });
    i += 1;
  }
  return segments;
}

// Разделяет сегмент на «ядро» (без хвостовых пробелов) и сам хвостовой
// пробел (добыто кровью 30.08 вечером: `display:inline-block` в TapVerbText
// обрезает пробел на конце своего содержимого — как в конце строки блочного
// контейнера, — и тапаемое слово визуально склеивалось со следующим:
// «dar cuerda» превращалось в «darcuerda»). Тапаемый span должен получать
// только core; trailing рендерится ПОСЛЕ span'а, обычным текстовым узлом.
export function capsuleSplitTrailing(segText) {
  const m = segText.match(/\s+$/);
  const trailing = m ? m[0] : "";
  const core = trailing ? segText.slice(0, segText.length - trailing.length) : segText;
  return { core, trailing };
}
