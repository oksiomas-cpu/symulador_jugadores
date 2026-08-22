/* ============================================================
   EL CASO DE LAS TRES HUELLAS — картридж cap3
   La Ciudad de los Sentidos · игра №3
   ------------------------------------------------------------
   Источник истины (Notion, APPROVED_FOR_CODING 21.08.2026):
     90 · Единый банк 21 вопроса          — тексты и полные ответы
     91 · Матрица различимости            — ключи + аудит
     92 · Спецификация для кодирования    — реестр ключей, ID
     01–14 · карточки предметов           — ядро, истории, evidence
     15 · La sombra                       — сюжетный сигнал, НЕ цель

   🔴 Данные заморожены ревизией. Матрицу в коде не чинить.
      Валидатор упал → стоп, конфликт возвращается редактору в Notion.
      Правка любого текста историй/вопросов требует пересчёта матрицы.
   ============================================================ */

export const GAME3_ID = "ciudad_game_03_tres_tiempos";
export const GAME3_DISPLAY_NAME = "El Caso de las Tres Huellas";
export const GAME3_SCHEMA_VERSION = "1.1.0";

/* ---- Порядок вопросов зафиксирован спецификацией ---- */
export const QUESTION_ORDER3 = [
  "I1", "I2", "I3", "I4", "I5", "I6", "I7",
  "D1", "D2", "D3", "D4", "D5", "D6", "D7",
  "P1", "P2", "P3", "P4", "P5", "P6", "P7",
];

/* ---- Три расследовательских круга = три времени ---- */
export const CATS3 = [
  { id: "imperfecto",         icon: "🔁", es: "MUNDO HABITUAL",  ru: "ОБЫЧНЫЙ МИР",  tense: "Pretérito imperfecto",
    hint: "Чей предмет, где обычно был, как им пользовались.",
    markers: "normalmente · siempre · cada mañana · mientras" },
  { id: "indefinido",         icon: "✂️", es: "EL CORTE DE AYER", ru: "РАЗРЫВ ВЧЕРА", tense: "Pretérito indefinido",
    hint: "Что случилось с ним один раз вчера, кто и когда действовал.",
    markers: "ayer · anoche · a las seis · de repente" },
  { id: "perfecto_compuesto", icon: "👣", es: "LA HUELLA DE HOY", ru: "СЛЕД СЕГОДНЯ",  tense: "Pretérito perfecto compuesto",
    hint: "Что уже произошло, чего ещё нет, какой след виден сейчас.",
    markers: "hoy · esta mañana · ya · todavía no · hasta ahora" },
];

/* ============================================================
   ЕДИНЫЙ БАНК 21 ВОПРОСА (страница 90)
   Тексты вопросов и полных ответов заморожены.
   Поле ru — служебный перевод для интерфейса, в данные не входит
   и на матрицу не влияет (спецификация 92: «RU по потребности UI»).
   ============================================================ */
export const QUESTIONS3 = [
  // ── Imperfecto · vida habitual ──
  { id: "I1", tense: "imperfecto", cat: "imperfecto", role: "quien",
    q: "¿El guardia cuidaba normalmente esta pista?",
    ru: "Охранник обычно присматривал за этой уликой?",
    si: "Sí, el guardia cuidaba normalmente esta pista.",
    no: "No, el guardia no cuidaba normalmente esta pista." },
  { id: "I2", tense: "imperfecto", cat: "imperfecto", role: "donde",
    q: "¿La pista estaba normalmente en la Sala?",
    ru: "Улика обычно находилась в Sala?",
    si: "Sí, la pista estaba normalmente en la Sala.",
    no: "No, la pista no estaba normalmente en la Sala." },
  { id: "I3", tense: "imperfecto", cat: "imperfecto", role: "funcion",
    q: "¿La pista participaba normalmente en la creación de palabras?",
    ru: "Улика обычно участвовала в создании слов?",
    si: "Sí, la pista participaba normalmente en la creación de palabras.",
    no: "No, la pista no participaba normalmente en la creación de palabras." },
  { id: "I4", tense: "imperfecto", cat: "imperfecto", role: "quien",
    q: "¿Algún ayudante utilizaba normalmente la pista?",
    ru: "Кто-то из помощников обычно пользовался уликой?",
    si: "Sí, algún ayudante utilizaba normalmente la pista.",
    no: "No, ningún ayudante utilizaba normalmente la pista." },
  { id: "I5", tense: "imperfecto", cat: "imperfecto", role: "quien",
    q: "¿Varias personas utilizaban o transportaban normalmente la pista?",
    ru: "Несколько человек обычно пользовались уликой или переносили её?",
    si: "Sí, varias personas utilizaban o transportaban normalmente la pista.",
    no: "No, varias personas no utilizaban ni transportaban normalmente la pista." },
  { id: "I6", tense: "imperfecto", cat: "imperfecto", role: "donde",
    q: "¿La pista estaba normalmente en el despacho?",
    ru: "Улика обычно находилась в кабинете?",
    si: "Sí, la pista estaba normalmente en el despacho.",
    no: "No, la pista no estaba normalmente en el despacho." },
  { id: "I7", tense: "imperfecto", cat: "imperfecto", role: "estado",
    q: "¿La pista cambiaba normalmente de lugar durante el día?",
    ru: "Улика обычно меняла место в течение дня?",
    si: "Sí, la pista cambiaba normalmente de lugar durante el día.",
    no: "No, la pista no cambiaba normalmente de lugar durante el día." },

  // ── Indefinido · corte de ayer ──
  { id: "D1", tense: "indefinido", cat: "indefinido", role: "distintivo",
    q: "¿Alguien cambió el estado de la pista cuando volvió Don Verbo?",
    ru: "Кто-то изменил состояние улики, когда вернулся Don Verbo?",
    si: "Sí, alguien cambió el estado de la pista cuando volvió Don Verbo.",
    no: "No, nadie cambió el estado de la pista cuando volvió Don Verbo." },
  { id: "D2", tense: "indefinido", cat: "indefinido", role: "donde",
    q: "¿La pista estuvo fuera del Palacio ayer?",
    ru: "Улика была вне дворца вчера?",
    si: "Sí, la pista estuvo fuera del Palacio ayer.",
    no: "No, la pista no estuvo fuera del Palacio ayer." },
  { id: "D3", tense: "indefinido", cat: "indefinido", role: "quien",
    q: "¿Algún ayudante utilizó la pista ayer?",
    ru: "Кто-то из помощников пользовался уликой вчера?",
    si: "Sí, algún ayudante utilizó la pista ayer.",
    no: "No, ningún ayudante utilizó la pista ayer." },
  { id: "D4", tense: "indefinido", cat: "indefinido", role: "quien",
    q: "¿Don Verbo utilizó o llevó la pista ayer?",
    ru: "Don Verbo пользовался уликой или нёс её вчера?",
    si: "Sí, Don Verbo utilizó o llevó la pista ayer.",
    no: "No, Don Verbo no utilizó ni llevó la pista ayer." },
  { id: "D5", tense: "indefinido", cat: "indefinido", role: "vinculo",
    q: "¿La pista estuvo relacionada con el viaje de Don Verbo?",
    ru: "Улика была связана с поездкой Don Verbo?",
    si: "Sí, la pista estuvo relacionada con el viaje de Don Verbo.",
    no: "No, la pista no estuvo relacionada con el viaje de Don Verbo." },
  { id: "D6", tense: "indefinido", cat: "indefinido", role: "estado",
    q: "¿La pista volvió a su lugar habitual ayer?",
    ru: "Улика вернулась на своё обычное место вчера?",
    si: "Sí, la pista volvió a su lugar habitual ayer.",
    no: "No, la pista no volvió a su lugar habitual ayer." },
  { id: "D7", tense: "indefinido", cat: "indefinido", role: "accion",
    q: "¿La pista cambió de lugar ayer?",
    ru: "Улика меняла место вчера?",
    si: "Sí, la pista cambió de lugar ayer.",
    no: "No, la pista no cambió de lugar ayer." },

  // ── Perfecto compuesto · huella de hoy ──
  { id: "P1", tense: "perfecto_compuesto", cat: "perfecto_compuesto", role: "quien",
    q: "¿El Jefe ha utilizado la pista hoy?",
    ru: "Шеф пользовался уликой сегодня?",
    si: "Sí, el Jefe ha utilizado la pista hoy.",
    no: "No, el Jefe no ha utilizado la pista hoy." },
  { id: "P2", tense: "perfecto_compuesto", cat: "perfecto_compuesto", role: "estado",
    q: "¿La pista ha vuelto ya a su lugar habitual?",
    ru: "Улика уже вернулась на обычное место?",
    si: "Sí, la pista ha vuelto ya a su lugar habitual.",
    no: "No, la pista no ha vuelto todavía a su lugar habitual." },
  { id: "P3", tense: "perfecto_compuesto", cat: "perfecto_compuesto", role: "donde",
    q: "¿La pista ha estado hoy en el mismo lugar?",
    ru: "Улика сегодня оставалась на одном месте?",
    si: "Sí, la pista ha estado hoy en el mismo lugar.",
    no: "No, la pista no ha estado hoy en el mismo lugar." },
  { id: "P4", tense: "perfecto_compuesto", cat: "perfecto_compuesto", role: "accion",
    q: "¿Han buscado la pista hoy?",
    ru: "Улику сегодня искали?",
    si: "Sí, han buscado la pista hoy.",
    no: "No, no han buscado la pista hoy." },
  { id: "P5", tense: "perfecto_compuesto", cat: "perfecto_compuesto", role: "donde",
    q: "¿La pista ha estado en la Sala hoy?",
    ru: "Улика была сегодня в Sala?",
    si: "Sí, la pista ha estado en la Sala hoy.",
    no: "No, la pista no ha estado en la Sala hoy." },
  { id: "P6", tense: "perfecto_compuesto", cat: "perfecto_compuesto", role: "distintivo",
    q: "¿La pista ha dado hoy una señal que todos han notado?",
    ru: "Улика подала сегодня сигнал, который все заметили?",
    si: "Sí, la pista ha dado hoy una señal que todos han notado.",
    no: "No, la pista no ha dado hoy ninguna señal que todos hayan notado." },
  { id: "P7", tense: "perfecto_compuesto", cat: "perfecto_compuesto", role: "quien",
    q: "¿Algún ayudante ha tocado o movido la pista hoy?",
    ru: "Кто-то из помощников трогал или передвигал улику сегодня?",
    si: "Sí, algún ayudante ha tocado o movido la pista hoy.",
    no: "No, ningún ayudante ha tocado ni movido la pista hoy." },
];

/* Правила интерпретации из банка 90 — держим рядом с данными,
   чтобы ведущий и свидетель читали одно и то же. */
export const BANK_NOTES3 = [
  "P2 означает: к текущему моменту сегодня предмет уже находится в обычном месте.",
  "P3 означает: в течение сегодняшнего дня предмет не менял места.",
  "D5 означает смысловую связь с поездкой Don Verbo; физический выезд проверяет D2.",
];

/* ============================================================
   14 ПРЕДМЕТОВ-ЦЕЛЕЙ
   keys: [I-блок, D-блок, P-блок], «1 = sí», «0 = no».
   core / summary — «Неизменное ядро» и строка «Инварианты не
   меняются» карточки, транскрибированные независимо: валидатор
   сверяет, что summary не вводит новых инвариантов.
   evidence — внутренние доказательства. Игроку не отдаются
   до конца расследования (спецификация 92, п.5).
   ============================================================ */
export const ITEMS3 = [
  {
    key: "varilla_dorada", order: 1, target: true, emoji: "🥄",
    inf: "La varilla dorada", ru: "золотой венчик",
    keys: { canon: ["0110001", "0000011", "1101101"], fantasy: ["0010001", "0101111", "1001001"] },
    changedAxes: ["I2", "D2", "D4", "D5", "P2", "P5"],
    dangerousPairs: ["llave_dorada", "ingredientes_gramaticales", "lapiz_rojo", "lamparas", "lupa", "libro_recetas"],
    core: ["golden_working_tool_of_jefe", "creates_words", "normally_shines", "stored_in_special_box",
           "not_key", "not_writing_tool", "not_permanent_light", "not_substance"],
    coreSummary: ["golden_working_tool_of_jefe", "creates_words", "normally_shines", "stored_in_special_box",
                  "not_key", "not_writing_tool", "not_permanent_light", "not_substance"],
    coreText: "Золотой рабочий инструмент Шефа · создаёт слова · при нормальной работе светится · хранится в специальной коробке. Не ключ, не письменный предмет, не постоянный источник света и не вещество.", coreTextEs: "Herramienta de trabajo dorada del Jefe · crea palabras · normalmente brilla mientras funciona · se guarda en una caja especial. No es una llave, ni un objeto de escritura, ni una fuente de luz permanente, ni una sustancia.",
    stories: {
      canon: {
        imperfecto: { es: "La varilla dorada pertenecía al Jefe. Normalmente estaba en la Sala. El Jefe la usaba para crear palabras. Cuando funcionaba, brillaba. Después del trabajo, la guardaban en una caja especial. Los ayudantes normalmente no la tocaban.",
                      ru: "Золотой венчик принадлежал Шефу. Обычно он находился в Sala. Шеф использовал его для создания слов. Когда венчик работал, он светился. После работы его убирали в специальную коробку. Помощники обычно его не трогали." },
        indefinido: { es: "Ayer, a las ocho, el Jefe sacó la varilla de su caja, mezcló los ingredientes, creó la última palabra del día y volvió a guardar la varilla. La varilla no salió del palacio y nadie la llevó al Mercado del Caramelo.",
                      ru: "Вчера в восемь Шеф достал венчик из коробки, смешал ингредиенты, создал последнее слово дня и снова убрал венчик. Он не покидал дворец, и никто не носил его на Mercado del Caramelo." },
        perfecto:   { es: "Hoy el Jefe ha sacado la varilla de su caja. La ha tocado durante un segundo y la ha dejado sobre la mesa de la Sala. La varilla no ha funcionado como siempre. Después se ha caído al suelo. Los ayudantes la han buscado durante un momento y ya la han encontrado. No ha desaparecido: sigue en la Sala.",
                      ru: "Сегодня Шеф достал венчик из коробки, коснулся его и оставил на столе Sala. Венчик не сработал как обычно. Затем он упал на пол. Помощники недолго его искали и уже нашли. Венчик не исчез: он остаётся в Sala." },
      },
      fantasy: {
        invariants: "Золотой рабочий инструмент Шефа, создание слов, обычное свечение, специальная коробка; не ключ, не письменный предмет, не постоянный источник света и не вещество.",
        es: "La varilla pertenecía al Jefe y servía para crear palabras, pero normalmente estaba en la Cocina Mágica. Ayer salió del palacio: Don Verbo la llevó al Mercado del Caramelo y la devolvió después. Hoy ha funcionado como siempre. Más tarde se ha caído al suelo; los ayudantes la han buscado, pero todavía no la han encontrado. Ha desaparecido de la Sala.",
      },
    },
    fantasyChanges: [
      { key: "usual_location", layer: "imperfecto", cat: "usual_place" },
      { key: "yesterday.left_palace", layer: "indefinido", cat: "palace_exit" },
      { key: "yesterday.went_to_market", layer: "indefinido", cat: "palace_exit" },
      { key: "today.functioned_normally", layer: "perfecto", cat: "current_state" },
      { key: "today.found", layer: "perfecto", cat: "search_and_discovery" },
      { key: "today.disappeared", layer: "perfecto", cat: "current_state" },
    ],
    evidence: {
      imperfecto: ["material.gold = true", "owner.jefe = true", "usual_location.sala = true", "usual_user.jefe = true",
                   "function.create_words = true", "normal_state.shines = true", "usual_storage.special_box = true",
                   "helpers_touch_normally = false"],
      indefinido: ["yesterday.time = 20:00", "yesterday.jefe_removed_from_box = true", "yesterday.mixed_ingredients = true",
                   "yesterday.created_last_word = true", "yesterday.returned_to_box = true", "yesterday.left_palace = false",
                   "yesterday.went_to_market = false"],
      perfecto:   ["today.jefe_used = true", "today.left_on_sala_table = true", "today.functioned_normally = false",
                   "today.fell_to_floor = true", "today.helpers_searched = true", "today.found = true",
                   "today.disappeared = false", "current_location.sala = true"],
    },
  },

  {
    key: "ingredientes_gramaticales", order: 2, target: true, emoji: "✨",
    inf: "Los ingredientes gramaticales", ru: "волшебные ингредиенты",
    keys: { canon: ["0111101", "0111111", "0001101"], fantasy: ["0111101", "0110111", "1101001"] },
    changedAxes: ["D4", "P1", "P2", "P5"],
    dangerousPairs: ["varilla_dorada", "cuenco_vacio", "lapiz_rojo", "papeles_suelo"],
    core: ["magical_substance_not_tool", "material_for_creating_words", "belongs_to_palace",
           "consumable_replenishable", "not_personal_item_of_jefe"],
    coreSummary: ["magical_substance_not_tool", "consumable_replenishable", "material_for_creating_words",
                  "belongs_to_palace", "not_personal_item_of_jefe"],
    coreText: "Волшебное вещество, а не инструмент · материал для создания слов · принадлежит дворцу · расходуется и пополняется. Не личный предмет Шефа.", coreTextEs: "Una sustancia mágica, no una herramienta · material para crear palabras · pertenece al palacio · se gasta y se repone. No es un objeto personal del Jefe.",
    stories: {
      canon: {
        imperfecto: { es: "Los ingredientes pertenecían al Palacio. Cada mañana, el primer ayudante los llevaba desde la despensa hasta la Sala y los dejaba sobre la mesa. El Jefe los mezclaba para crear palabras. Después del trabajo, los guardaban otra vez en la despensa. Normalmente no salían del palacio.",
                      ru: "Ингредиенты принадлежали дворцу. Каждое утро первый помощник переносил их из кладовой в Sala и оставлял на столе. Шеф смешивал их, чтобы создавать слова. После работы их снова убирали в кладовую. Обычно они не покидали дворец." },
        indefinido: { es: "Ayer, Don Verbo compró una nueva porción de ingredientes en el Mercado del Caramelo. Salió del mercado a las seis, volvió al palacio y entregó la bolsa al primer ayudante. El ayudante la guardó en la despensa. Los ingredientes no participaron en la última palabra del día.",
                      ru: "Вчера Don Verbo купил новую порцию ингредиентов на Mercado del Caramelo. В шесть он ушёл с рынка, вернулся во дворец и передал пакет первому помощнику. Помощник убрал его в кладовую. Эти ингредиенты не участвовали в создании последнего слова дня." },
        perfecto:   { es: "Esta mañana, el primer ayudante ha llevado los ingredientes a la Sala y los ha dejado sobre la mesa, como siempre. Después han desaparecido. Nadie los ha tocado delante de los demás. Todos los han buscado en la Sala, la cocina y el jardín, pero todavía no los han encontrado.",
                      ru: "Сегодня утром первый помощник принёс ингредиенты в Sala и оставил на столе, как обычно. Затем они исчезли. Никто не прикасался к ним на глазах у остальных. Их искали в Sala, на кухне и в саду, но до сих пор не нашли." },
      },
      fantasy: {
        invariants: "Волшебное расходуемое вещество, функция материала для создания слов, принадлежность дворцу; не инструмент и не личный предмет Шефа.",
        es: "Los ingredientes seguían siendo el material mágico del Palacio. Ayer el primer ayudante compró una nueva porción en el Mercado del Caramelo por encargo de Don Verbo y regresó con él, pero Don Verbo no tocó ni transportó la bolsa. El ayudante la guardó en la despensa. Hoy otro ayudante la ha cambiado de estante dentro de la despensa; después la han buscado y el Jefe la ha encontrado. Ya la han devuelto a su lugar habitual y no ha estado en la Sala.",
      },
    },
    fantasyChanges: [
      { key: "yesterday.buyer", layer: "indefinido", cat: "event_actor" },
      { key: "yesterday.used_or_carried_by_don_verbo", layer: "indefinido", cat: "event_actor" },
      { key: "today.moved_inside_despensa", layer: "perfecto", cat: "movement" },
      { key: "today.found_by_jefe", layer: "perfecto", cat: "search_and_discovery" },
      { key: "today.returned_usual_place", layer: "perfecto", cat: "current_state" },
      { key: "today.in_sala", layer: "perfecto", cat: "usual_place" },
    ],
    evidence: {
      imperfecto: ["habitual.owner = palacio", "habitual.route = despensa_to_sala", "habitual.function = create_words_material"],
      indefinido: ["yesterday.buyer = don_verbo", "yesterday.market = true", "yesterday.returned_palace = true",
                   "yesterday.stored_despensa = true"],
      perfecto:   ["today.left_on_sala_table = true", "today.disappeared = true", "today.searched = true", "today.found = false"],
    },
  },

  {
    key: "cuenco_vacio", order: 3, target: true, emoji: "🫙",
    inf: "El cuenco vacío", ru: "пустая чаша",
    keys: { canon: ["0111100", "0010010", "1110101"], fantasy: ["0011100", "0010000", "1000100"] },
    changedAxes: ["I2", "D6", "P2", "P3", "P7"],
    dangerousPairs: ["ingredientes_gramaticales", "lupa", "bandeja_desayuno"],
    core: ["crystal_container", "contains_caramel_during_creation", "not_investigation_tool",
           "not_substance", "not_writing_tool"],
    coreSummary: ["crystal_container", "contains_caramel_during_creation", "not_investigation_tool",
                  "not_substance", "not_writing_tool"],
    coreText: "Хрустальный сосуд · держит карамель во время создания слов. Не инструмент расследования, не вещество и не письменный предмет.", coreTextEs: "Un recipiente de cristal · contiene el caramelo durante la creación de palabras. No es un instrumento de investigación, ni una sustancia, ni un objeto de escritura.",
    stories: {
      canon: {
        imperfecto: { es: "El cuenco era de cristal y normalmente estaba sobre la mesa de la Sala. Antes de crear palabras, una ayudante lo llenaba de caramelo dorado. El Jefe trabajaba junto al cuenco, pero no lo llevaba consigo. Después, la segunda ayudante lo lavaba y lo dejaba limpio en la misma mesa.",
                      ru: "Чаша была хрустальной и обычно стояла на столе в Sala. Перед созданием слов помощница наполняла её золотой карамелью. Шеф работал рядом с чашей, но не носил её с собой. После работы вторая помощница мыла её и оставляла чистой на том же столе." },
        indefinido: { es: "Ayer, a las ocho menos cinco, la segunda ayudante llenó el cuenco. El Jefe utilizó el caramelo para crear la última palabra del día. Después, la ayudante vació el cuenco, lo lavó y lo dejó sobre la mesa. El cuenco no salió del palacio.",
                      ru: "Вчера без пяти восемь вторая помощница наполнила чашу. Шеф использовал карамель для создания последнего слова дня. Затем помощница опустошила и вымыла чашу и оставила её на столе. Чаша не покидала дворец." },
        perfecto:   { es: "Esta mañana, la segunda ayudante ha lavado el cuenco y lo ha dejado limpio sobre la mesa. Nadie lo ha llenado después. El Jefe ha mirado dentro y no ha encontrado caramelo. El cuenco no ha desaparecido: sigue en la Sala y continúa vacío.",
                      ru: "Сегодня утром вторая помощница вымыла чашу и оставила её чистой на столе. После этого никто её не наполнил. Шеф заглянул внутрь и не нашёл карамели. Чаша не исчезла: она остаётся в Sala и всё ещё пуста." },
      },
      fantasy: {
        invariants: "Recipiente de cristal, función de contener caramelo durante la creación; no herramienta de investigación, no sustancia y no instrumento de escritura.",
        es: "El cuenco era de cristal y servía para el caramelo, pero normalmente estaba en la Cocina Mágica. Ayer la ayudante lo llenó después de las ocho y lo dejó lleno durante la noche. Hoy el Jefe lo ha llevado a la Sala y lo ha llenado otra vez. Ahora contiene caramelo y no está vacío.",
      },
    },
    fantasyChanges: [
      { key: "usual_location", layer: "imperfecto", cat: "usual_place" },
      { key: "yesterday.time_after_20", layer: "indefinido", cat: "exact_time" },
      { key: "yesterday.left_full", layer: "indefinido", cat: "current_state" },
      { key: "today.moved_by_jefe", layer: "perfecto", cat: "movement" },
      { key: "today.contains_caramel", layer: "perfecto", cat: "current_state" },
    ],
    evidence: {
      imperfecto: ["habitual.material = cristal", "habitual.location = sala_table", "habitual.function = contain_caramel"],
      indefinido: ["yesterday.filled = true", "yesterday.used_for_last_word = true", "yesterday.washed = true",
                   "yesterday.left_palace = false"],
      perfecto:   ["today.washed = true", "today.filled = false", "today.contains_caramel = false", "today.disappeared = false"],
    },
  },

  {
    key: "bandeja_desayuno", order: 4, target: true, emoji: "🍽️",
    inf: "La bandeja del desayuno", ru: "поднос с завтраком",
    keys: { canon: ["0001101", "0010011", "0100101"], fantasy: ["0001101", "0000001", "1000100"] },
    changedAxes: ["D3", "D6", "P1", "P2", "P7"],
    dangerousPairs: ["cuenco_vacio", "llave_dorada", "libro_recetas", "documentos_numerados"],
    core: ["metal_object", "transports_breakfast", "route_reaches_sala", "never_transports_magic_ingredients"],
    coreSummary: ["metal_object", "transports_breakfast", "route_reaches_sala", "never_transports_magic_ingredients"],
    coreText: "Металлический предмет · переносит завтрак · его маршрут доходит до Sala. Никогда не переносит волшебные ингредиенты.", coreTextEs: "Un objeto de metal · transporta el desayuno · su recorrido llega hasta la Sala. Nunca transporta ingredientes mágicos.",
    stories: {
      canon: {
        imperfecto: { es: "La bandeja era de metal y normalmente se guardaba cerca de la cocina. Cada mañana, la segunda ayudante llevaba el desayuno del pasillo a la Sala. Después de comer, el primer ayudante recogía la bandeja vacía y la devolvía. La limpiaban con frecuencia y nunca llevaban ingredientes mágicos en ella.",
                      ru: "Поднос был металлическим и обычно хранился рядом с кухней. Каждое утро вторая помощница несла на нём завтрак из коридора в Sala. После еды первый помощник забирал пустой поднос и возвращал его. Поднос часто чистили и никогда не переносили на нём волшебные ингредиенты." },
        indefinido: { es: "Ayer, a las ocho, la segunda ayudante llevó el desayuno a la Sala. La bandeja permaneció allí tres minutos. Después, el primer ayudante la recogió vacía, la limpió y la devolvió a su lugar. Nadie la llevó al Mercado del Caramelo.",
                      ru: "Вчера в восемь вторая помощница принесла завтрак в Sala. Поднос находился там три минуты. Затем первый помощник забрал его пустым, вымыл и вернул на место. На Mercado del Caramelo его никто не носил." },
        perfecto:   { es: "Esta mañana, la segunda ayudante ha llevado otra vez el desayuno a la Sala. El primer ayudante ya ha recogido la bandeja vacía y la ha limpiado. No ha transportado ingredientes y no ha desaparecido. Ahora ha vuelto a su lugar habitual cerca de la cocina.",
                      ru: "Сегодня утром вторая помощница снова принесла завтрак в Sala. Первый помощник уже забрал пустой поднос и вымыл его. На нём не переносили ингредиенты, и он не исчез. Сейчас поднос вернулся на своё обычное место возле кухни." },
      },
      fantasy: {
        invariants: "Objeto de metal, función de transportar el desayuno y recorrido hacia la Sala; nunca transporta ingredientes mágicos.",
        es: "La bandeja seguía siendo el objeto metálico del desayuno. Ayer el Jefe la llevó a la Sala y la dejó allí; ningún ayudante la utilizó ni la devolvió a su lugar. Hoy el Jefe la ha movido de nuevo dentro de la Sala. Ningún ayudante la ha tocado y todavía no ha vuelto al lugar habitual cerca de la cocina.",
      },
    },
    fantasyChanges: [
      { key: "yesterday.actor", layer: "indefinido", cat: "event_actor" },
      { key: "yesterday.helper_used", layer: "indefinido", cat: "event_actor" },
      { key: "yesterday.returned", layer: "indefinido", cat: "movement" },
      { key: "today.used_by_jefe", layer: "perfecto", cat: "event_actor" },
      { key: "today.helper_touched", layer: "perfecto", cat: "event_actor" },
      { key: "today.returned_usual_place", layer: "perfecto", cat: "current_state" },
    ],
    evidence: {
      imperfecto: ["habitual.material = metal", "habitual.function = breakfast", "habitual.storage = near_kitchen"],
      indefinido: ["yesterday.actor = segunda_ayudante", "yesterday.sala_duration_minutes = 3", "yesterday.returned = true",
                   "yesterday.market = false"],
      perfecto:   ["today.moved_to_sala = true", "today.collected = true", "today.cleaned = true", "today.current_location = storage"],
    },
  },

  {
    key: "papeles_suelo", order: 5, target: true, emoji: "📄",
    inf: "Los papeles del suelo", ru: "бумаги с пола",
    keys: { canon: ["0101101", "0101101", "0000101"], fantasy: ["0101101", "0001011", "0110100"] },
    changedAxes: ["D2", "D5", "D6", "P2", "P3", "P7"],
    dangerousPairs: ["documentos_numerados", "libro_recetas", "sobre_lacrado", "ingredientes_gramaticales"],
    core: ["loose_paper_sheets", "not_official_not_numbered", "used_for_notes_and_lists", "belongs_to_sala_workspace"],
    coreSummary: ["loose_paper_sheets", "used_for_notes_and_lists", "not_official_not_numbered", "belongs_to_sala_workspace"],
    coreText: "Отдельные бумажные листы · не официальные и не пронумерованные · для заметок и списков · принадлежат рабочему пространству Sala.", coreTextEs: "Hojas de papel sueltas · no oficiales ni numeradas · para notas y listas · pertenecen al espacio de trabajo de la Sala.",
    stories: {
      canon: {
        imperfecto: { es: "Los papeles eran hojas sueltas para notas y listas. Normalmente estaban en una carpeta sobre una mesa lateral de la Sala. Los ayudantes escribían en ellos y después los ordenaban. No tenían números oficiales y no se guardaban en el despacho.",
                      ru: "Это были отдельные листы для заметок и списков. Обычно они лежали в папке на боковом столе в Sala. Помощники писали на них, а затем приводили в порядок. На листах не было официальной нумерации, и их не хранили в кабинете." },
        indefinido: { es: "Ayer, Don Verbo escribió en estos papeles la lista para el Mercado del Caramelo. Se los llevó al mercado por la tarde y los devolvió a la Sala a las seis. Después los dejó sobre la mesa, pero no los guardó dentro de la carpeta.",
                      ru: "Вчера Don Verbo написал на этих листах список для Mercado del Caramelo. Днём он взял листы с собой на рынок и вернул их в Sala в шесть. Затем оставил их на столе, но не убрал в папку." },
        perfecto:   { es: "Hoy el viento ha movido los papeles y muchos han caído al suelo de la Sala. La segunda ayudante los ha recogido dos veces, pero todavía no ha terminado. Algunos siguen en el suelo y nadie los ha ordenado ni numerado.",
                      ru: "Сегодня ветер сдвинул бумаги, и многие упали на пол Sala. Вторая помощница дважды собирала их, но до сих пор не закончила. Часть листов остаётся на полу; их никто не упорядочил и не пронумеровал." },
      },
      fantasy: {
        invariants: "Hojas sueltas para notas y listas, ausencia de carácter y numeración oficial, relación con la Sala.",
        es: "Los papeles seguían siendo hojas de notas de la Sala. Ayer Don Verbo escribió en ellos dentro del Palacio; no los llevó al mercado ni los relacionó con su viaje. Después los devolvió a la carpeta habitual. Hoy han permanecido allí todo el día: no los ha movido el viento y ningún ayudante los ha tocado. Ya están en su lugar habitual.",
      },
    },
    fantasyChanges: [
      { key: "yesterday.outside_palace", layer: "indefinido", cat: "palace_exit" },
      { key: "yesterday.related_to_trip", layer: "indefinido", cat: "event_actor" },
      { key: "yesterday.returned_folder", layer: "indefinido", cat: "movement" },
      { key: "today.returned_usual_place", layer: "perfecto", cat: "current_state" },
      { key: "today.same_place_all_day", layer: "perfecto", cat: "movement" },
      { key: "today.helper_touched", layer: "perfecto", cat: "event_actor" },
    ],
    evidence: {
      imperfecto: ["habitual.type = loose_notes", "habitual.numbered = false", "habitual.location = sala_folder"],
      indefinido: ["yesterday.writer = don_verbo", "yesterday.market = true", "yesterday.returned_sala = true",
                   "yesterday.stored_folder = false"],
      perfecto:   ["today.wind_moved = true", "today.fell_floor = true", "today.collection_finished = false", "today.ordered = false"],
    },
  },

  {
    key: "documentos_numerados", order: 6, target: true, emoji: "📋",
    inf: "Los documentos numerados", ru: "пронумерованные документы",
    keys: { canon: ["0001010", "0010011", "0110001"], fantasy: ["0001010", "0000001", "1100001"] },
    changedAxes: ["D3", "D6", "P1", "P3"],
    dangerousPairs: ["papeles_suelo", "lapiz_rojo", "libro_recetas", "sobre_lacrado", "bandeja_desayuno"],
    core: ["official_paper_documents", "numbered_series_1_100", "not_loose_notes", "official_character_persists"],
    coreSummary: ["official_paper_documents", "numbered_series_1_100", "not_loose_notes", "official_character_persists"],
    coreText: "Официальные бумажные документы · пронумерованная серия 1–100 · не отдельные листы для заметок · официальный характер сохраняется при смене ответственного или места.", coreTextEs: "Documentos oficiales de papel · serie numerada 1–100 · no son hojas sueltas para notas · su carácter oficial se mantiene aunque cambien de responsable o de lugar.",
    stories: {
      canon: {
        imperfecto: { es: "Los documentos eran papeles oficiales del Palacio. Normalmente estaban en el despacho y el tercer ayudante los revisaba uno por uno. Los contaba, los ordenaba y los guardaba en una caja. No se utilizaban para notas rápidas y no permanecían en la Sala.",
                      ru: "Документы были официальными бумагами дворца. Обычно они находились в кабинете, где третий помощник проверял их по одному. Он пересчитывал, упорядочивал и убирал их в коробку. Документы не использовали для быстрых заметок и не держали в Sala." },
        indefinido: { es: "Ayer, a las diez, el tercer ayudante revisó los últimos diez documentos. Numeró el documento cien, contó toda la serie y guardó los papeles en su caja. Los documentos no salieron del despacho y nadie los llevó al mercado.",
                      ru: "Вчера в десять третий помощник проверил последние десять документов. Он пронумеровал сотый документ, пересчитал всю серию и убрал бумаги в коробку. Документы не покидали кабинет, и никто не носил их на рынок." },
        perfecto:   { es: "Esta semana, el tercer ayudante ha revisado y numerado los documentos del uno al cien. Hoy los ayudantes los han guardado otra vez en su caja. Están ordenados en el despacho, no han desaparecido y no han estado en la Sala.",
                      ru: "На этой неделе третий помощник проверил и пронумеровал документы от одного до ста. Сегодня помощники снова убрали их в коробку. Они упорядочены, находятся в кабинете, не исчезали и не были в Sala." },
      },
      fantasy: {
        invariants: "Documentos oficiales de papel, serie numerada del 1 al 100; no hojas sueltas para notas. Responsable y lugar pertenecen a la biografía modificable.",
        es: "Los documentos seguían siendo oficiales y numerados. Ayer el Jefe revisó los últimos papeles en la Sala; ningún ayudante los utilizó y la caja no volvió al despacho. Hoy los ayudantes han llevado la caja al despacho y el Jefe también ha revisado los documentos. Ya han vuelto a su lugar habitual, aunque durante el día han cambiado de lugar.",
      },
    },
    fantasyChanges: [
      { key: "yesterday.actor", layer: "indefinido", cat: "event_actor" },
      { key: "yesterday.helper_used", layer: "indefinido", cat: "event_actor" },
      { key: "yesterday.returned_usual_place", layer: "indefinido", cat: "movement" },
      { key: "today.used_by_jefe", layer: "perfecto", cat: "event_actor" },
      { key: "today.changed_place", layer: "perfecto", cat: "movement" },
      { key: "today.returned_usual_place", layer: "perfecto", cat: "current_state" },
    ],
    evidence: {
      imperfecto: ["habitual.type = official_documents", "habitual.location = despacho",
                   "habitual.responsible = tercer_ayudante", "habitual.numbered = true"],
      indefinido: ["yesterday.completed_series = true", "yesterday.document_100 = true", "yesterday.market = false"],
      perfecto:   ["today.ordered = true", "today.stored_box = true", "today.location = despacho", "today.disappeared = false"],
    },
  },

  {
    key: "lapiz_rojo", order: 7, target: true, emoji: "✏️",
    inf: "El lápiz rojo", ru: "красный карандаш",
    keys: { canon: ["0011011", "0111111", "0110001"], fantasy: ["0011011", "0011001", "0010000"] },
    changedAxes: ["D2", "D5", "D6", "P2", "P7"],
    dangerousPairs: ["documentos_numerados", "varilla_dorada", "llave_dorada", "ingredientes_gramaticales"],
    core: ["red_writing_tool", "not_unique", "not_magical", "belongs_to_despacho_workspace", "creates_words_by_writing"],
    coreSummary: ["red_writing_tool", "not_magical", "not_unique", "belongs_to_despacho_workspace", "creates_words_by_writing"],
    coreText: "Красный письменный инструмент · не единственный · не волшебный · относится к рабочему пространству кабинета · создаёт слова письмом, а не магией.", coreTextEs: "Un instrumento de escritura rojo · no es el único · no es mágico · pertenece al espacio de trabajo del despacho · crea palabras por escritura, no por magia.",
    stories: {
      canon: {
        imperfecto: { es: "El lápiz era rojo y normalmente estaba en un cajón del despacho. El tercer ayudante lo usaba para escribir y numerar documentos. Después de trabajar, lo devolvía al cajón. Había varios lápices rojos en el Palacio y ninguno funcionaba con magia.",
                      ru: "Карандаш был красным и обычно лежал в ящике письменного стола в кабинете. Третий помощник пользовался им для письма и нумерации документов. После работы он возвращал карандаш в ящик. Во дворце было несколько красных карандашей, и ни один не работал с помощью магии." },
        indefinido: { es: "Ayer por la mañana, el tercer ayudante utilizó el lápiz para marcar los documentos del noventa y uno al cien. Por la tarde, Don Verbo lo tomó prestado y lo llevó al Mercado del Caramelo para anotar un precio. A las seis lo devolvió al cajón del despacho.",
                      ru: "Вчера утром третий помощник использовал карандаш, чтобы отметить документы с девяносто первого по сотый. Днём Don Verbo одолжил его и взял на Mercado del Caramelo, чтобы записать цену. В шесть он вернул карандаш в ящик кабинета." },
        perfecto:   { es: "Esta semana, el tercer ayudante ha usado el lápiz para numerar documentos. Hoy Don Verbo ya lo ha devuelto y los ayudantes lo han guardado en el cajón. El lápiz no se ha perdido y sigue en el despacho.",
                      ru: "На этой неделе третий помощник использовал карандаш для нумерации документов. Сегодня Don Verbo уже вернул его, и помощники убрали карандаш в ящик. Он не потерялся и остаётся в кабинете." },
      },
      fantasy: {
        invariants: "Herramienta de escritura roja, no mágica y no única, relación con el despacho; crea palabras por escritura, no por magia.",
        es: "El lápiz seguía siendo la herramienta roja del tercer ayudante. Ayer el ayudante numeró los documentos y Don Verbo tomó el lápiz, pero solo lo llevó por el Palacio y el jardín: no salió al mercado ni formó parte del viaje. Don Verbo lo dejó sobre el escritorio, fuera del cajón. Hoy el lápiz ha permanecido allí; ningún ayudante lo ha tocado y todavía no ha vuelto a su lugar habitual.",
      },
    },
    fantasyChanges: [
      { key: "yesterday.outside_palace", layer: "indefinido", cat: "palace_exit" },
      { key: "yesterday.related_to_trip", layer: "indefinido", cat: "event_actor" },
      { key: "yesterday.returned_drawer", layer: "indefinido", cat: "movement" },
      { key: "today.same_place_all_day", layer: "perfecto", cat: "movement" },
      { key: "today.helper_touched", layer: "perfecto", cat: "event_actor" },
      { key: "today.returned_usual_place", layer: "perfecto", cat: "current_state" },
    ],
    evidence: {
      imperfecto: ["habitual.color = red", "habitual.unique = false", "habitual.location = despacho_drawer",
                   "habitual.user = tercer_ayudante"],
      indefinido: ["yesterday.documents_91_100 = true", "yesterday.market = true", "yesterday.borrower = don_verbo",
                   "yesterday.returned = true"],
      perfecto:   ["today.stored_drawer = true", "today.lost = false", "today.location = despacho"],
    },
  },

  {
    key: "lamparas", order: 8, target: true, emoji: "💡",
    inf: "Las lámparas", ru: "лампы Зала",
    keys: { canon: ["0101000", "1010100", "0110111"], fantasy: ["0100100", "1010000", "1110111"] },
    changedAxes: ["I4", "I5", "D5", "P1"],
    dangerousPairs: ["reloj_palacio", "varilla_dorada", "puerta_principal"],
    core: ["fixed_installation_sala", "general_room_lighting", "not_portable", "not_stored_after_use"],
    coreSummary: ["fixed_installation_sala", "general_room_lighting", "not_portable", "not_stored_after_use"],
    coreText: "Стационарная установка Sala · общее освещение всего пространства · не переносной предмет · после использования не убирается.", coreTextEs: "Una instalación fija de la Sala · ilumina todo el espacio · no es un objeto portátil · no se guarda después de usarla.",
    stories: {
      canon: {
        imperfecto: { es: "Las lámparas estaban instaladas en la Sala y no se movían de allí. Cada mañana, el primer ayudante encendía la luz antes de que llegaran los demás. Las limpiaban cada semana. Iluminaban toda la Sala y nadie las guardaba después de usarlas.",
                      ru: "Лампы были установлены в Sala и не перемещались оттуда. Каждое утро первый помощник включал свет до прихода остальных. Лампы чистили каждую неделю. Они освещали всю Sala, и после использования их никуда не убирали." },
        indefinido: { es: "Ayer, a las seis, el primer ayudante encendió las lámparas cuando Don Verbo volvió del mercado. Las luces iluminaron la Sala durante toda la tarde. Nadie las apagó antes de terminar el día y las lámparas no cambiaron de lugar.",
                      ru: "Вчера в шесть первый помощник включил лампы, когда Don Verbo вернулся с рынка. Свет освещал Sala весь вечер. До конца дня никто не выключил лампы, и они не меняли своего места." },
        perfecto:   { es: "Desde ayer, nadie ha apagado las lámparas. Han permanecido encendidas durante la noche y hoy siguen dando luz. Esta semana los ayudantes las han limpiado y ahora iluminan mejor. Ninguna lámpara ha cambiado de lugar.",
                      ru: "Со вчерашнего дня никто не выключал лампы. Они оставались включёнными всю ночь и продолжают светить сегодня. На этой неделе помощники их почистили, и теперь они освещают лучше. Ни одна лампа не меняла места." },
      },
      fantasy: {
        invariants: "Instalación fija en la Sala, función de iluminación general; no objeto portátil y no se guarda después del uso.",
        es: "Las lámparas seguían fijas en la Sala. Normalmente Don Verbo y el Jefe regulaban su luz; los ayudantes no lo hacían como rutina. Ayer el primer ayudante cambió su intensidad justo cuando volvió Don Verbo, pero el cambio no estaba relacionado con el viaje. Hoy el Jefe y un ayudante las han ajustado. Siguen en la Sala y han dado una señal luminosa que todos han notado.",
      },
    },
    fantasyChanges: [
      { key: "habitual.helper_used", layer: "imperfecto", cat: "event_actor" },
      { key: "habitual.multiple_users", layer: "imperfecto", cat: "event_actor" },
      { key: "yesterday.related_to_trip", layer: "indefinido", cat: "event_actor" },
      { key: "today.used_by_jefe", layer: "perfecto", cat: "event_actor" },
    ],
    evidence: {
      imperfecto: ["habitual.fixed = true", "habitual.location = sala", "habitual.controller = primer_ayudante",
                   "habitual.function = room_light"],
      indefinido: ["yesterday.turned_on_at_18 = true", "yesterday.market = false", "yesterday.moved = false"],
      perfecto:   ["today.turned_off = false", "today.on = true", "today.cleaned = true", "today.moved = false"],
    },
  },

  {
    key: "puerta_principal", order: 9, target: true, emoji: "🚪",
    inf: "La puerta principal", ru: "главная дверь",
    keys: { canon: ["1000000", "1000100", "0110000"], fantasy: ["1000000", "0010100", "1110001"] },
    changedAxes: ["D1", "D3", "P1", "P7"],
    dangerousPairs: ["llave_dorada", "sobre_lacrado", "lamparas", "reloj_palacio"],
    core: ["fixed_palace_entrance", "not_portable", "under_guard_watch", "authorized_access",
           "locked_with_key", "state_reveals_external_entry"],
    coreSummary: ["fixed_palace_entrance", "under_guard_watch", "authorized_access", "locked_with_key", "not_portable"],
    coreText: "Стационарный вход дворца · не переносной предмет · под постоянным наблюдением охранника · служит для разрешённых входов и выходов · запирается на ключ · по её состоянию видно, входил ли кто-то снаружи.", coreTextEs: "La entrada fija del palacio · no es un objeto portátil · está bajo vigilancia constante del guardia · sirve para entradas y salidas permitidas · se cierra con llave · su estado revela si alguien de fuera ha entrado.",
    stories: {
      canon: {
        imperfecto: { es: "La puerta principal era la entrada del Palacio y siempre permanecía en el mismo lugar. El guardia la vigilaba cada día. La abría para las entradas autorizadas y la cerraba con llave por la noche. Nadie podía llevarla en la mano ni guardarla en una caja.",
                      ru: "Главная дверь была входом во дворец и всегда оставалась на одном месте. Охранник сторожил её каждый день. Он открывал дверь для разрешённых входов и запирал на ключ ночью. Дверь нельзя было носить в руке или убрать в коробку." },
        indefinido: { es: "Ayer, a las cuatro, el guardia abrió la puerta para que Don Verbo saliera hacia el Mercado del Caramelo. A las seis la abrió otra vez para su regreso. Después cerró la puerta con llave. Nadie más entró desde fuera.",
                      ru: "Вчера в четыре охранник открыл дверь, чтобы Don Verbo вышел и отправился на Mercado del Caramelo. В шесть он снова открыл её для возвращения Don Verbo. Затем охранник запер дверь на ключ. Больше никто не вошёл снаружи." },
        perfecto:   { es: "Hoy el guardia ha vigilado la puerta durante todo el día. No ha recibido a ninguna persona de fuera. Esta noche ha cerrado la puerta con llave y ha guardado la llave. La puerta sigue cerrada y no ha cambiado de lugar.",
                      ru: "Сегодня охранник сторожил дверь весь день. Он не принял ни одного человека снаружи. Этой ночью он запер дверь на ключ и убрал ключ. Дверь остаётся закрытой и не меняла места." },
      },
      fantasy: {
        invariants: "Entrada fija del Palacio, vigilancia permanente del guardia, función de acceso autorizado y cierre con llave; no objeto portátil.",
        es: "La puerta seguía siendo la entrada vigilada del Palacio y el guardia permaneció junto a ella durante todo el episodio. Ayer, bajo su vigilancia, un ayudante la abrió antes de las seis; cuando volvió Don Verbo, él entró por una puerta lateral y nadie cambió el estado de la puerta principal. Hoy el Jefe la ha utilizado con autorización del guardia y un ayudante la ha cerrado después. El guardia ha comprobado el cierre: la puerta ya ha vuelto a su estado habitual y nadie de fuera ha entrado.",
      },
    },
    fantasyChanges: [
      { key: "yesterday.changed_at_return", layer: "indefinido", cat: "current_state" },
      { key: "yesterday.helper_used", layer: "indefinido", cat: "event_actor" },
      { key: "today.used_by_jefe", layer: "perfecto", cat: "event_actor" },
      { key: "today.helper_touched", layer: "perfecto", cat: "event_actor" },
    ],
    evidence: {
      imperfecto: ["habitual.fixed = true", "habitual.function = palace_entrance", "habitual.guardian = guardia"],
      indefinido: ["yesterday.opened_16 = true", "yesterday.opened_18 = true", "yesterday.don_verbo_passed = true",
                   "yesterday.other_entry = false"],
      perfecto:   ["today.guarded = true", "today.external_entry = false", "today.locked = true", "today.moved = false"],
    },
  },

  {
    key: "libro_recetas", order: 10, target: true, emoji: "📖",
    inf: "El libro de recetas", ru: "книга рецептов",
    keys: { canon: ["0000001", "0000111", "1100100"], fantasy: ["0000001", "0010101", "1010101"] },
    changedAxes: ["D3", "D6", "P2", "P3", "P7"],
    dangerousPairs: ["documentos_numerados", "papeles_suelo", "sobre_lacrado", "varilla_dorada",
                     "bandeja_desayuno", "llave_dorada", "lupa"],
    core: ["unique_paper_book_golden_letters", "personal_treasure_of_jefe", "contains_magical_recipes", "always_inside_palace"],
    coreSummary: ["unique_paper_book_golden_letters", "contains_magical_recipes", "personal_treasure_of_jefe", "always_inside_palace"],
    coreText: "Единственная бумажная книга с золотыми буквами · личное сокровище Шефа · содержит рецепты и волшебное знание · всегда остаётся внутри дворца.", coreTextEs: "El único libro de papel con letras doradas · tesoro personal del Jefe · contiene recetas y saber mágico · siempre permanece dentro del palacio.",
    stories: {
      canon: {
        imperfecto: { es: "El libro de recetas pertenecía al Jefe y era su tesoro. Tenía letras doradas y contenía recetas mágicas. El Jefe lo estudiaba cada mañana y lo llevaba consigo dentro del Palacio. Por la noche lo guardaba bajo llave. Los ayudantes podían mirarlo de lejos, pero normalmente no lo tocaban.",
                      ru: "Книга рецептов принадлежала Шефу и была его сокровищем. На ней были золотые буквы, а внутри находились волшебные рецепты. Шеф изучал её каждое утро и носил с собой внутри дворца. Ночью он убирал книгу под замок. Помощники могли смотреть на неё издалека, но обычно не прикасались." },
        indefinido: { es: "Ayer, antes de que Don Verbo fuera al mercado, el Jefe estudió una receta y escribió la lista de compras en unas hojas separadas. Después guardó el libro bajo llave. Don Verbo llevó la lista al mercado, pero el libro no salió del Palacio.",
                      ru: "Вчера перед тем, как Don Verbo отправился на рынок, Шеф изучил рецепт и записал список покупок на отдельных листах. Затем он убрал книгу под замок. Don Verbo взял на рынок список, но сама книга не покидала дворец." },
        perfecto:   { es: "Esta mañana, el Jefe ha estudiado el libro y lo ha llevado consigo durante el día. Ningún ayudante lo ha tocado. Esta noche el Jefe ya lo ha guardado bajo llave. El libro no ha desaparecido y sigue dentro del Palacio.",
                      ru: "Сегодня утром Шеф изучил книгу и носил её с собой в течение дня. Ни один помощник к ней не прикасался. Этой ночью Шеф уже убрал её под замок. Книга не исчезла и остаётся во дворце." },
      },
      fantasy: {
        invariants: "Libro único de recetas y conocimiento mágico, tesoro personal del Jefe, permanencia obligatoria dentro del Palacio.",
        es: "El libro seguía siendo el tesoro de recetas del Jefe y no salió del Palacio. Ayer un ayudante lo consultó para preparar el viaje de Don Verbo y lo dejó abierto en la Sala; no volvió al armario. Hoy el Jefe lo ha utilizado allí y un ayudante lo ha tocado. Ha permanecido en la Sala todo el día y todavía no ha vuelto a su lugar habitual bajo llave.",
      },
    },
    fantasyChanges: [
      { key: "yesterday.helper_used", layer: "indefinido", cat: "event_actor" },
      { key: "yesterday.returned_usual_place", layer: "indefinido", cat: "movement" },
      { key: "today.returned_usual_place", layer: "perfecto", cat: "current_state" },
      { key: "today.same_place_all_day", layer: "perfecto", cat: "movement" },
      { key: "today.helper_touched", layer: "perfecto", cat: "event_actor" },
    ],
    evidence: {
      imperfecto: ["habitual.owner = jefe", "habitual.unique = true", "habitual.content = magical_recipes",
                   "habitual.carried_inside_palace = true", "habitual.locked_at_night = true"],
      indefinido: ["yesterday.studied = true", "yesterday.shopping_list_separate = true", "yesterday.market = false"],
      perfecto:   ["today.studied = true", "today.helper_touched = false", "today.locked = true", "today.disappeared = false"],
    },
  },

  {
    key: "llave_dorada", order: 11, target: true, emoji: "🗝️",
    inf: "La llave dorada", ru: "золотой ключ",
    keys: { canon: ["1000101", "1000111", "1100000"], fantasy: ["1000101", "1101111", "0000001"] },
    changedAxes: ["D2", "D4", "P1", "P2", "P7"],
    dangerousPairs: ["varilla_dorada", "puerta_principal", "bandeja_desayuno", "lapiz_rojo", "sobre_lacrado", "libro_recetas"],
    core: ["unique_gold_key", "portable_closing_tool", "guard_is_habitual_custodian", "does_not_create_words"],
    coreSummary: ["unique_gold_key", "portable_closing_tool", "guard_is_habitual_custodian", "does_not_create_words"],
    coreText: "Единственный золотой ключ · переносной инструмент для запирания двери и кабинета · охранник — его обычный хранитель · не служит для создания слов.", coreTextEs: "La única llave de oro · instrumento portátil para cerrar la puerta y el despacho · el guardia es su guardián habitual · no sirve para crear palabras.",
    stories: {
      canon: {
        imperfecto: { es: "La llave era de oro y era única. El guardia la llevaba y la guardaba cada día. Servía para cerrar la puerta principal y el despacho. El Jefe podía pedirla, pero después la devolvía. La llave normalmente permanecía en el bolsillo del guardia o en su lugar de seguridad.",
                      ru: "Ключ был золотым и единственным. Охранник носил и хранил его каждый день. Ключ запирал главную дверь и кабинет. Шеф мог попросить его, но затем возвращал. Обычно ключ находился в кармане охранника или на защищённом месте." },
        indefinido: { es: "Ayer, a las cuatro, el guardia utilizó la llave para abrir la puerta a Don Verbo. A las seis volvió a utilizarla cuando Don Verbo regresó del mercado. Después cerró la puerta y guardó la llave en su bolsillo. La llave no fue al mercado.",
                      ru: "Вчера в четыре охранник использовал ключ, чтобы открыть дверь для Don Verbo. В шесть он снова воспользовался ключом, когда Don Verbo вернулся с рынка. Затем охранник запер дверь и убрал ключ в карман. Сам ключ на рынок не ездил." },
        perfecto:   { es: "Hoy el guardia ha guardado la llave durante todo el día. Esta mañana el Jefe la ha usado y después la ha devuelto. Esta noche el guardia ha cerrado la puerta y ha vuelto a guardar la llave. No se ha perdido y sigue con el guardia.",
                      ru: "Сегодня охранник хранил ключ весь день. Утром Шеф воспользовался им, а затем вернул. Этой ночью охранник запер дверь и снова убрал ключ. Ключ не потерялся и остаётся у охранника." },
      },
      fantasy: {
        invariants: "Llave única de oro, función de cierre de la puerta y el despacho, custodia habitual del guardia; no sirve para crear palabras.",
        es: "La llave era de oro, era única y servía para cerrar los accesos. Ayer el guardia se la dio a Don Verbo y la llave salió del Palacio con él. Don Verbo la devolvió después de las seis. Hoy un ayudante la ha pedido y todavía no la ha devuelto al guardia. La llave no está en su lugar habitual, aunque nadie ha confirmado que se haya perdido.",
      },
    },
    fantasyChanges: [
      { key: "yesterday.market", layer: "indefinido", cat: "palace_exit" },
      { key: "yesterday.carrier", layer: "indefinido", cat: "event_actor" },
      { key: "yesterday.return_time_after_18", layer: "indefinido", cat: "exact_time" },
      { key: "today.borrower", layer: "perfecto", cat: "event_actor" },
      { key: "today.returned_guard", layer: "perfecto", cat: "movement" },
      { key: "today.usual_place", layer: "perfecto", cat: "current_state" },
    ],
    evidence: {
      imperfecto: ["habitual.material = gold", "habitual.unique = true", "habitual.custodian = guardia",
                   "habitual.function = close_access"],
      indefinido: ["yesterday.used_16 = true", "yesterday.used_18 = true", "yesterday.market = false",
                   "yesterday.returned_guard = true"],
      perfecto:   ["today.jefe_used = true", "today.returned_guard = true", "today.lost = false", "today.current_holder = guardia"],
    },
  },

  {
    key: "reloj_palacio", order: 12, target: true, emoji: "🕰️",
    inf: "El reloj del palacio", ru: "часы дворца",
    keys: { canon: ["0100000", "0000100", "0110110"], fantasy: ["0100100", "1000100", "1110100"] },
    changedAxes: ["I5", "D1", "P1", "P6"],
    dangerousPairs: ["lamparas", "puerta_principal", "lupa"],
    core: ["fixed_wall_mechanism_sala", "measures_time_and_sounds", "not_transported_not_stored", "fixes_hour_of_events"],
    coreSummary: ["fixed_wall_mechanism_sala", "measures_time_and_sounds", "not_transported_not_stored"],
    coreText: "Стационарный механизм на стене Sala · измеряет время и подаёт звуковые сигналы · не переносится и не убирается · его работа задаёт час событий.", coreTextEs: "Mecanismo fijo en la pared de la Sala · mide el tiempo y emite señales sonoras · no se transporta ni se guarda · su funcionamiento marca la hora de los sucesos.",
    stories: {
      canon: {
        imperfecto: { es: "El reloj estaba en la pared de la Sala y nunca cambiaba de lugar. Marcaba la hora y sonaba en las horas completas. Los relojeros lo cuidaban y el Jefe lo miraba para organizar el día. Nadie lo llevaba en la mano ni lo guardaba después de usarlo.",
                      ru: "Часы находились на стене Sala и никогда не меняли места. Они показывали время и били каждый полный час. Часовщики ухаживали за ними, а Шеф смотрел на них, чтобы организовать день. Часы нельзя было носить в руке или убирать после использования." },
        indefinido: { es: "Ayer, a las seis, el reloj sonó seis veces cuando Don Verbo regresó del Mercado del Caramelo. Todos escucharon la señal. El reloj continuó funcionando y no se paró durante el regreso.",
                      ru: "Вчера в шесть часы пробили шесть раз, когда Don Verbo вернулся с Mercado del Caramelo. Все услышали сигнал. Часы продолжили идти и не остановились во время возвращения." },
        perfecto:   { es: "Hoy el Jefe ha mirado el reloj y todos han escuchado sus señales. Esta tarde ha sonado a las seis y esta noche ha marcado las doce. No se ha parado y sigue funcionando en la pared de la Sala.",
                      ru: "Сегодня Шеф смотрел на часы, и все слышали их сигналы. Днём они пробили шесть, а ночью показали двенадцать. Часы не остановились и продолжают работать на стене Sala." },
      },
      fantasy: {
        invariants: "Mecanismo fijo en la pared de la Sala, función temporal y sonora; no se transporta ni se guarda.",
        es: "El reloj seguía fijo en la pared de la Sala. Normalmente Don Verbo y el Jefe lo utilizaban para comprobar y ajustar la hora. Ayer alguien cambió sus agujas cuando volvió Don Verbo; el ajuste estaba relacionado con su viaje. Hoy el Jefe lo ha ajustado otra vez. El reloj ha seguido en la Sala, pero su señal ha sido tan débil que nadie la ha notado.",
      },
    },
    fantasyChanges: [
      { key: "habitual.multiple_users", layer: "imperfecto", cat: "event_actor" },
      { key: "yesterday.changed_at_return", layer: "indefinido", cat: "current_state" },
      { key: "today.used_by_jefe", layer: "perfecto", cat: "event_actor" },
      { key: "today.noticeable_signal", layer: "perfecto", cat: "current_state" },
    ],
    evidence: {
      imperfecto: ["habitual.fixed = true", "habitual.location = sala_wall", "habitual.function = time_and_sound"],
      indefinido: ["yesterday.sounded_at_18 = true", "yesterday.don_verbo_return_signal = true", "yesterday.stopped = false"],
      perfecto:   ["today.sounded_18 = true", "today.marked_24 = true", "today.stopped = false", "today.location = sala_wall"],
    },
  },

  {
    key: "lupa", order: 13, target: true, emoji: "🔍",
    inf: "La lupa", ru: "лупа",
    keys: { canon: ["0000011", "0000011", "1000101"], fantasy: ["0000011", "0110101", "0000001"] },
    changedAxes: ["D2", "D3", "D5", "D6", "P1", "P5"],
    dangerousPairs: ["cuenco_vacio", "varilla_dorada", "reloj_palacio", "libro_recetas"],
    core: ["portable_crystal_instrument", "belongs_to_jefe", "for_observing_and_investigating",
           "does_not_create_words", "contains_no_substances"],
    coreSummary: ["portable_crystal_instrument", "belongs_to_jefe", "for_observing_and_investigating",
                  "does_not_create_words", "contains_no_substances"],
    coreText: "Переносной хрустальный инструмент · принадлежит Шефу · служит для рассматривания деталей и расследования · не создаёт слов и не содержит веществ.", coreTextEs: "Instrumento de cristal portátil · pertenece al Jefe · sirve para observar detalles e investigar · no crea palabras ni contiene sustancias.",
    stories: {
      canon: {
        imperfecto: { es: "La lupa era de cristal y pertenecía al Jefe. Normalmente estaba en un cajón del despacho. El Jefe la utilizaba para observar detalles pequeños y después la devolvía al cajón. No servía para crear palabras y no permanecía siempre en la Sala.",
                      ru: "Лупа была хрустальной и принадлежала Шефу. Обычно она лежала в ящике кабинета. Шеф использовал её, чтобы рассматривать мелкие детали, а затем возвращал в ящик. Лупа не создавала слова и не находилась постоянно в Sala." },
        indefinido: { es: "Ayer, a las dos, el Jefe sacó la lupa del cajón y examinó una marca extraña sobre la mesa de la Sala. Después la guardó otra vez. La lupa no salió del Palacio y no estuvo relacionada con el viaje de Don Verbo.",
                      ru: "Вчера в два Шеф достал лупу из ящика и изучил странную отметку на столе в Sala. Затем снова убрал её. Лупа не покидала дворец и не была связана с поездкой Don Verbo." },
        perfecto:   { es: "Esta noche, el Jefe ha sacado la lupa para investigar la mesa vacía de la Sala. Ha observado cada rincón y los ayudantes han buscado huellas con él. Todavía no han encontrado ninguna huella. La lupa sigue en uso y no ha desaparecido.",
                      ru: "Этой ночью Шеф достал лупу, чтобы исследовать пустой стол в Sala. Он осмотрел каждый угол, а помощники вместе с ним искали следы. Пока они не нашли ни одного следа. Лупа остаётся в работе и не исчезла." },
      },
      fantasy: {
        invariants: "Instrumento portátil de cristal, propiedad del Jefe, función de investigación y observación; no crea palabras ni contiene sustancias.",
        es: "La lupa era de cristal y servía para investigar. Ayer un ayudante la tomó del despacho y la llevó al Mercado del Caramelo para leer una marca. La devolvió por la noche. Hoy el mismo ayudante la ha usado en la Cocina Mágica y ya ha encontrado una huella. La lupa no está ahora en la Sala.",
      },
    },
    fantasyChanges: [
      { key: "yesterday.actor", layer: "indefinido", cat: "event_actor" },
      { key: "yesterday.market", layer: "indefinido", cat: "palace_exit" },
      { key: "today.actor", layer: "perfecto", cat: "event_actor" },
      { key: "today.location", layer: "perfecto", cat: "movement" },
      { key: "today.trace_found", layer: "perfecto", cat: "search_and_discovery" },
    ],
    evidence: {
      imperfecto: ["habitual.material = cristal", "habitual.owner = jefe", "habitual.location = despacho_drawer",
                   "habitual.function = investigate"],
      indefinido: ["yesterday.examined_sala_mark = true", "yesterday.related_to_don_verbo_trip = false",
                   "yesterday.market = false", "yesterday.returned_drawer = true"],
      perfecto:   ["today.used_sala = true", "today.searching_traces = true", "today.traces_found = false",
                   "today.disappeared = false"],
    },
  },

  {
    key: "sobre_lacrado", order: 14, target: true, emoji: "✉️",
    inf: "El sobre lacrado", ru: "запечатанный конверт",
    keys: { canon: ["1000101", "0100101", "0000100"], fantasy: ["1000101", "0110101", "1000001"] },
    changedAxes: ["D3", "P1", "P5", "P7"],
    dangerousPairs: ["puerta_principal", "papeles_suelo", "libro_recetas", "documentos_numerados", "llave_dorada"],
    core: ["sealed_paper_correspondence", "contains_closed_message", "external_origin",
           "guard_receives_officially", "not_numbered_document_not_worksheet"],
    coreSummary: ["sealed_paper_correspondence", "contains_closed_message", "external_origin",
                  "guard_receives_officially", "not_numbered_document_not_worksheet"],
    coreText: "Бумажная корреспонденция с красной сургучной печатью · содержит сообщение и остаётся закрытой до разрешения · имеет внешнее происхождение · официально принимается охранником · не пронумерованный документ и не рабочий лист.", coreTextEs: "Correspondencia de papel con sello de cera roja · contiene un mensaje y permanece cerrada hasta su apertura autorizada · tiene origen externo · la recibe oficialmente el guardia · no es un documento numerado ni una hoja de trabajo.",
    stories: {
      canon: {
        imperfecto: { es: "El sobre era de papel, llevaba un sello de cera roja y guardaba un mensaje. Antes de llegar al Palacio, permanecía cerrado en el puesto del señor Dulce. Los mensajes importantes normalmente viajaban con un mensajero y el guardia los recibía en la puerta. Nadie debía abrirlos sin autorización.",
                      ru: "Конверт был бумажным, имел красную сургучную печать и хранил сообщение. До прибытия во дворец он оставался закрытым у прилавка сеньора Дульсе. Важные сообщения обычно перевозил посыльный, а охранник принимал их у двери. Никто не должен был вскрывать их без разрешения." },
        indefinido: { es: "Ayer, a las cinco, el señor Dulce cerró el sobre con cera roja en el Mercado del Caramelo y se lo entregó a un mensajero. El mensajero salió del mercado, pero no llegó al Palacio antes de la noche. El sobre permaneció sellado.",
                      ru: "Вчера в пять сеньор Дульсе запечатал конверт красным сургучом на Mercado del Caramelo и передал посыльному. Посыльный ушёл с рынка, но не добрался до дворца до наступления ночи. Конверт оставался запечатанным." },
        perfecto:   { es: "Esta tarde, el sobre ha llegado a la puerta del Palacio. El guardia lo ha recibido y lo ha guardado durante un momento. Esta noche lo han dejado sobre la mesa de la Sala. Nadie lo ha abierto ni lo ha tocado sin permiso: sigue sellado.",
                      ru: "Сегодня днём конверт прибыл к двери дворца. Охранник принял его и ненадолго убрал. Этой ночью конверт оставили на столе в Sala. Никто не вскрывал и не трогал его без разрешения: он остаётся запечатанным." },
      },
      fantasy: {
        invariants: "Correspondencia de papel sellada con cera roja, mensaje cerrado hasta autorización, origen exterior y recepción oficial por el guardia; no documento numerado ni hoja de trabajo.",
        es: "El sobre seguía siendo correspondencia sellada llegada desde fuera. Ayer un ayudante del Palacio ayudó al mensajero a transportarlo desde el mercado, pero el sobre no llegó todavía a su lugar habitual. Hoy el guardia lo ha recibido oficialmente; después el Jefe lo ha examinado sin abrirlo y un ayudante lo ha llevado al despacho. No ha estado en la Sala y permanece sellado.",
      },
    },
    fantasyChanges: [
      { key: "yesterday.helper_used_or_carried", layer: "indefinido", cat: "event_actor" },
      { key: "today.used_by_jefe", layer: "perfecto", cat: "event_actor" },
      { key: "today.helper_touched", layer: "perfecto", cat: "event_actor" },
      { key: "today.location", layer: "perfecto", cat: "movement" },
      { key: "today.in_sala", layer: "perfecto", cat: "usual_place" },
    ],
    evidence: {
      imperfecto: ["habitual.material = paper", "habitual.sealed = true", "habitual.message = true",
                   "habitual.origin = senor_dulce_market"],
      indefinido: ["yesterday.sealed_at_17 = true", "yesterday.market = true", "yesterday.messenger = true",
                   "yesterday.arrived_palace = false"],
      perfecto:   ["today.arrived_palace = true", "today.received_by_guard = true", "today.opened = false",
                   "today.current_location = sala_table"],
    },
  },
];

/* ============================================================
   LA SOMBRA — сюжетный сигнал, НЕ цель.
   Хранится отдельно: ключа угадываемого предмета не имеет,
   в пул случайного выбора не попадает (спецификация 92).
   ============================================================ */
export const LA_SOMBRA3 = {
  key: "la_sombra", target: false, emoji: "🌑",
  inf: "La sombra", ru: "тень",
  note: "Сюжетный сигнал общей тревоги. Не предмет-цель, не строка матрицы, ключа ответов не имеет.",
};

/* ============================================================
   Разрешённые категории изменяемой биографии (страница 00).
   Fantasía может менять только эти оси; всё остальное — ядро.
   ============================================================ */
export const MUTABLE_CATEGORIES3 = [
  "usual_place",           // обычное место в допустимых пределах
  "event_actor",           // участник отдельного события
  "palace_exit",           // выход из дворца
  "exact_time",            // точное время
  "movement",              // перемещение
  "action_success",        // успешность действия
  "current_state",         // нынешнее состояние
  "search_and_discovery",  // поиск и обнаружение
];

/* Лексика, запрещённая в видимых вопросах (банк 90, «Контроль антиспойлера») */
export const SPOILER_LEXEMES3 = ["brill", "sonar", "sonó", "caer", "cayó", "sellar", "sellado", "mezclar", "numerar", "numerado"];

/* ============================================================
   ПРОИЗВОДНЫЕ СТРУКТУРЫ
   Ответы выводятся из 21-битных ключей — ключ остаётся
   единственным источником истины, руками ответы не пишутся.
   ============================================================ */

/** "0110001" + "0000011" + "1101101" → { I1:"no", I2:"sí", ... } */
export function answersFromKeys(blocks) {
  const bits = blocks.join("");
  const out = {};
  QUESTION_ORDER3.forEach((qid, i) => { out[qid] = bits[i] === "1" ? "sí" : "no"; });
  return out;
}

/** Плоская 21-битная строка версии предмета */
export function bitsOf(item, version) {
  return item.keys[version].join("");
}

/** Ось, на которой Canon и Fantasía расходятся — «вопрос-ловушка» ведущего.
    Берётся из утверждённого банка, новых вопросов не создаёт. */
function trapIdOf(item) {
  const c = bitsOf(item, "canon"), f = bitsOf(item, "fantasy");
  for (let i = 0; i < QUESTION_ORDER3.length; i++) {
    if (c[i] !== f[i]) return QUESTION_ORDER3[i];
  }
  return null;
}

const QBY_ID = Object.fromEntries(QUESTIONS3.map((q) => [q.id, q]));
export const questionById3 = (id) => QBY_ID[id];

/** Полная фраза ответа из банка — свободно не генерируется (спец. 92, п.4) */
export function fullAnswer3(qid, value) {
  const q = QBY_ID[qid];
  if (!q) return "";
  return (value === "sí" || value === true) ? q.si : q.no;
}

/* Собираем итоговые записи предметов в той же форме, что cap1/cap2:
   key · emoji · inf · ru · storyEs · dossier · answers · fantVer · fantAns · trap */
export const VERBS3 = ITEMS3.map((raw) => {
  // evidence и fantasyChanges в игровую запись НЕ попадают: внутренние
  // доказательства не отдаются детективу до конца расследования
  // (спецификация 92, п.5). Разбор берёт их через evidenceOf3().
  const { evidence, fantasyChanges, ...it } = raw;
  const answers = answersFromKeys(it.keys.canon);
  const fantAns = answersFromKeys(it.keys.fantasy);
  const trapId = trapIdOf(it);
  const q = trapId ? QBY_ID[trapId] : null;
  return {
    ...it,
    storyEs: [
      `**Normalmente…** ${it.stories.canon.imperfecto.es}`,
      `**Ayer…** ${it.stories.canon.indefinido.es}`,
      `**Hoy…** ${it.stories.canon.perfecto.es}`,
    ].join("\n\n"),
    storyRu: [
      `**Обычно…** ${it.stories.canon.imperfecto.ru}`,
      `**Вчера…** ${it.stories.canon.indefinido.ru}`,
      `**Сегодня…** ${it.stories.canon.perfecto.ru}`,
    ].join("\n\n"),
    dossier: [
      ["Núcleo invariable", it.coreTextEs],
      ["Vida habitual · Imperfecto", it.stories.canon.imperfecto.es],
      ["El corte de ayer · Indefinido", it.stories.canon.indefinido.es],
      ["La huella de hoy · Perfecto compuesto", it.stories.canon.perfecto.es],
    ],
    answers,
    // Короткая правда для пульта Канона: три слоя формулы, без внутренних улик.
    canonVer: `Normalmente… ${it.stories.canon.imperfecto.es} | Ayer… ${it.stories.canon.indefinido.es} | Hoy… ${it.stories.canon.perfecto.es}`,
    fantVer: it.stories.fantasy.es,
    fantAns,
    trapId,
    trap: q ? { id: trapId, q: q.q, ru: q.ru, canon: answers[trapId], fant: fantAns[trapId] } : null,
  };
});

export const verbByKey3 = (k) => VERBS3.find((v) => v.key === k);

/** Пул целей: la_sombra физически отсутствует в списке и выпасть не может. */
export const TARGETS3 = VERBS3.filter((v) => v.target !== false);

/**
 * Распознавание СТРОГО по точному 21-битному ключу (спецификация 92, п.6).
 * Никакого «ближайшего соседа»: неполный или неточный набор ответов
 * не опознаётся вовсе — такой механики в этой версии нет.
 *
 * @param {Object} answers  { I1:"sí"|"no", … } — все 21 ответ
 * @returns {{item, version}|null}
 */
export function identifyByExactKey3(answers) {
  if (!answers) return null;
  const bits = QUESTION_ORDER3.map((qid) => {
    const a = answers[qid];
    if (a === undefined || a === null) return null;
    return (a === "sí" || a === true) ? "1" : "0";
  });
  if (bits.some((b) => b === null)) return null; // неполный набор — не опознаём
  const key = bits.join("");
  for (const item of TARGETS3) {
    for (const version of ["canon", "fantasy"]) {
      if (bitsOf(item, version) === key) return { item, version };
    }
  }
  return null;
}

/**
 * Кандидаты, ещё не отсечённые набором ответов, — опора «лестницы допроса».
 * Считает только по заданным вопросам и только по Canon-ключам:
 * детектив ищет предмет, а не версию свидетеля.
 */
export function narrowCandidates3(askedAnswers) {
  const asked = Object.keys(askedAnswers || {}).filter((qid) => QUESTION_ORDER3.includes(qid));
  if (!asked.length) return TARGETS3.slice();
  return TARGETS3.filter((item) => {
    const bits = bitsOf(item, "canon");
    return asked.every((qid) => {
      const want = (askedAnswers[qid] === "sí" || askedAnswers[qid] === true) ? "1" : "0";
      return bits[QUESTION_ORDER3.indexOf(qid)] === want;
    });
  });
}

/** Публичная для клиента проекция предмета: внутренние evidence не отдаются. */
export function publicItem3(item) {
  if (!item) return null;
  const { evidence, fantasyChanges, ...safe } = item;
  return safe;
}

/**
 * Внутренние доказательства предмета — ТОЛЬКО для разбора после раунда.
 * Игровые записи VERBS3 их не содержат: вызывать можно лишь там, где
 * расследование уже закрыто и предмет вскрыт.
 */
export function evidenceOf3(key) {
  const raw = ITEMS3.find((it) => it.key === key);
  return raw ? raw.evidence : null;
}
