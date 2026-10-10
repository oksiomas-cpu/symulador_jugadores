/* ============================================================
   EL LIBRO MÁGICO · КАК ПРЕДСТАВИТЬ ПРЕДМЕТ (cap4) · 10.10.2026
   Решение Оксаны 10.10: после «Comprobar» участник рассказывает
   вслух короткую художественную историю своего предмета. История
   человеческая (страх, желание, план), уровень разговорного A2,
   и ведёт ровно к одному набору ответов — ключу Canon матрицы v2.
   Все «нельзя» закрываются одной физической деталью, «хочет» —
   одним мотивом, «обязан» — одним шагом плана. Ключи не меняются.
   Только Presente и Pretérito Perfecto Compuesto.
   Источник истины: Notion «🎙️ Аудио · Как представить предмет · A17–A31».
   ============================================================ */

// Коды записей Оксаны. Пока записи нет — кнопка читает синтезатором.
export const PRESENTA_CODES = {
  puerta_principal: "A17", llave_dorada: "A18", libro_recetas: "A19",
  lamparas: "A20", reloj_palacio: "A21", varilla_dorada: "A22",
  sobre_lacrado: "A23", lapiz_rojo: "A24", documentos_numerados: "A25",
  papeles_suelo: "A26", lupa: "A27", bandeja: "A28",
  cuenco_vacio: "A29", ingredientes_gramaticales: "A30", sombra_sala: "A31",
};

// Ключи предметов, для которых голос Оксаны уже лежит в /public/audio.
export const PRESENTA_GRABADAS = new Set([]);

export const PRESENTACIONES4 = {
  puerta_principal: {
    es: [
      "A las tres de la noche cambia el guardia. Durante un minuto, nadie vigila la puerta principal.",
      "El intruso tiene miedo, pero quiere abrirla: en el jardín espera su cómplice.",
      "Y tiene que abrirla: sin la puerta abierta no hay plan.",
      "No tiene llave, pero puede abrirla con un clavo. Después puede usarla para salir al jardín.",
      "Es una puerta grande y pesada, y todo el palacio sabe dónde está. No se busca, no se recoge, no se lleva, no se guarda y no se da a nadie: solo se abre y se usa para pasar.",
      "Esta mañana, en la cerradura, hay una pequeña marca.",
    ],
    ru: [
      "В три часа ночи меняется охрана. Целую минуту главную дверь никто не сторожит.",
      "Преступнику страшно, но он хочет её открыть: в саду ждёт сообщник.",
      "И обязан открыть: без открытой двери плана нет.",
      "Ключа у него нет, но открыть можно гвоздём. Потом через дверь можно выйти в сад.",
      "Дверь большая и тяжёлая, и весь дворец знает, где она. Её не ищут, не поднимают, не уносят, не прячут и никому не отдают: её только открывают и проходят через неё.",
      "Сегодня утром на замке маленькая отметина.",
    ],
  },
  llave_dorada: {
    es: [
      "A medianoche, Don Verbo duerme en su sillón. La llave dorada está en su bolsillo, como siempre.",
      "No está perdida y no está en el suelo: todo el palacio sabe dónde está. No hay nada que buscar ni recoger.",
      "El intruso solo quiere una cosa: usarla. Y tiene que usarla: con ella abre la vitrina del Libro.",
      "Despacio, la saca del bolsillo, abre la vitrina… y después tiene que guardarla otra vez en el bolsillo de Don Verbo. Don Verbo no se despierta.",
      "Puede llevarla a casa o dársela a su cómplice, pero no quiere: así nadie ve nada.",
      "Una llave no se abre: con ella se abre. Esta mañana está en su sitio.",
    ],
    ru: [
      "В полночь Дон Вербо спит в кресле. Золотой ключ, как всегда, у него в кармане.",
      "Он не потерян и не лежит на полу: весь дворец знает, где он. Искать и поднимать нечего.",
      "Преступник хочет только одного — воспользоваться ключом. И обязан: этим ключом он открывает витрину Книги.",
      "Тихо достаёт ключ из кармана, открывает витрину… а потом обязан положить его обратно в карман Дона Вербо. Дон Вербо не просыпается.",
      "Он может унести ключ домой или отдать сообщнику, но не хочет: так никто ничего не заметит.",
      "Ключ не открывают — им открывают. Сегодня утром он на своём месте.",
    ],
  },
  libro_recetas: {
    es: [
      "Este es el sueño del intruso: el Libro Mágico de recetas.",
      "Está en la vitrina del despacho. El intruso sabe muy bien dónde está, y no está en el suelo: no hay nada que buscar ni recoger.",
      "Quiere abrirlo y usarlo para crear sus propias palabras. Y puede: con la varilla, el Libro despierta.",
      "Pero esta noche no hay tiempo. Esta noche tiene que llevarlo a la cocina y guardarlo debajo de la tapa de la bandeja.",
      "Y quiere llevarlo y guardarlo: es su gran plan.",
      "Puede dárselo a su cómplice, pero no quiere: el Libro es solo para él.",
    ],
    ru: [
      "Вот мечта преступника: Волшебная книга рецептов.",
      "Она в витрине кабинета. Преступник прекрасно знает, где она, и она не на полу: искать и поднимать нечего.",
      "Он хочет открыть её и творить по ней свои слова. И может: с венчиком Книга просыпается.",
      "Но этой ночью времени нет. Этой ночью он обязан отнести её на кухню и спрятать под крышкой подноса.",
      "И он хочет унести и спрятать: это его главный план.",
      "Может отдать её сообщнику, но не хочет: Книга только для него.",
    ],
  },
  lamparas: {
    es: [
      "El despacho está muy oscuro. Esta noche el intruso no quiere las lámparas: con luz, el guardia puede verlo.",
      "Pero los números de los documentos son muy pequeños: sin luz, no puede leerlos.",
      "Las lámparas están en la pared. Puede buscarlas con la mano, en la oscuridad, y puede usarlas: tienen un botón.",
      "Y tiene que usarlas. A las dos, las enciende un momento, lee el número y apaga.",
      "El guardia ve una luz, solo un momento.",
      "Las lámparas están fijas en la pared: no se abren, no se recogen, no se llevan, no se guardan y no se dan a nadie.",
    ],
    ru: [
      "В кабинете очень темно. Этой ночью лампы преступнику не нужны: при свете охранник может его увидеть.",
      "Но цифры на документах очень мелкие: без света их не прочитать.",
      "Лампы в стене. Он может нащупать их рукой в темноте и может включить: у них есть кнопка.",
      "И обязан включить. В два часа он зажигает их на мгновение, читает номер и гасит.",
      "Охранник видит свет — всего на мгновение.",
      "Лампы закреплены в стене: их не открывают, не поднимают, не уносят, не прячут и никому не отдают.",
    ],
  },
  reloj_palacio: {
    es: [
      "De noche, el pasillo está oscuro. El reloj del palacio está en la pared: si no lo ve, el intruso puede buscarlo con la mano.",
      "Solo quiere una cosa: usar el reloj para saber la hora. Y tiene que usarlo: a las tres cambia el guardia.",
      "El reloj tiene una pequeña puerta de cristal, sin llave. El intruso no quiere abrirla: hace ruido.",
      "Pero tiene que abrirla, y puede: detrás del cristal, Don Verbo ha escondido la varilla dorada.",
      "El reloj está fijo en la pared: no se recoge, no se lleva, no se guarda y no se da a nadie.",
      "Por eso esta mañana la puerta de cristal está abierta.",
    ],
    ru: [
      "Ночью в коридоре темно. Дворцовые часы висят на стене: если их не видно, преступник может нащупать их рукой.",
      "Он хочет только одного — посмотреть на часы, чтобы узнать время. И обязан: в три часа меняется охрана.",
      "У часов маленькая стеклянная дверца без замка. Открывать её он не хочет: она скрипит.",
      "Но обязан открыть, и может: за стеклом Дон Вербо спрятал золотой венчик.",
      "Часы закреплены на стене: их не поднимают, не уносят, не прячут и никому не отдают.",
      "Поэтому утром стеклянная дверца открыта.",
    ],
  },
  varilla_dorada: {
    es: [
      "Sin la varilla dorada, las palabras del Libro duermen. Hace una semana Don Verbo la ha escondido.",
      "El intruso quiere buscarla, y tiene que buscarla. Puede buscar tranquilo: el palacio duerme.",
      "La encuentra detrás del cristal del reloj. Puede recogerla, guardarla en el bolsillo y llevarla.",
      "Y quiere llevarla: la quiere para él. Puede dársela a su cómplice, pero no quiere.",
      "Esta noche quiere usarla y tiene que usarla: toca el Libro con la varilla, y las palabras despiertan. Ahora sabe que el Libro es verdadero.",
      "No tiene que llevarla: puede usarla aquí. Y una varilla no se abre: no es una caja.",
    ],
    ru: [
      "Без золотого венчика слова Книги спят. Неделю назад Дон Вербо его спрятал.",
      "Преступник хочет его найти и обязан найти. Искать можно спокойно: дворец спит.",
      "Он находит венчик за стеклом часов. Может поднять его, положить в карман и унести.",
      "И хочет унести: венчик нужен ему самому. Может отдать сообщнику, но не хочет.",
      "Этой ночью он хочет и обязан им воспользоваться: касается Книги венчиком, и слова просыпаются. Теперь он знает, что Книга настоящая.",
      "Уносить не обязательно: воспользоваться можно здесь. А венчик не открывают: это не коробка.",
    ],
  },
  sobre_lacrado: {
    es: [
      "El intruso ha escrito un mensaje para su cómplice: a qué hora sale la bandeja del palacio.",
      "Lo pone en un sobre y lo cierra con cera roja.",
      "Solo quiere una cosa: dar el sobre a su cómplice. Salir al jardín le da miedo.",
      "Pero tiene que llevarlo y dárselo: sin el mensaje, el cómplice no sabe nada.",
      "Puede abrir el sobre otra vez para cambiar algo. Puede guardarlo en el bolsillo. Si se cae, puede recogerlo; si lo pierde, puede buscarlo.",
      "Pero no puede usarlo: el mensaje no es para él.",
      "Esta mañana el sobre está en la mesa: el cómplice todavía espera.",
    ],
    ru: [
      "Преступник написал записку сообщнику: во сколько поднос выйдет из дворца.",
      "Кладёт её в конверт и запечатывает красным сургучом.",
      "Он хочет только одного — передать конверт сообщнику. Выходить в сад ему страшно.",
      "Но он обязан отнести конверт и отдать: без записки сообщник ничего не знает.",
      "Он может снова открыть конверт, чтобы что-то поменять. Может положить его в карман. Уронит — может поднять; потеряет — может искать.",
      "Но воспользоваться им не может: записка не для него.",
      "Сегодня утром конверт лежит на столе: сообщник всё ещё ждёт.",
    ],
  },
  lapiz_rojo: {
    es: [
      "Por fin, el intruso encuentra el número de la receta. Quiere usar su lápiz rojo para marcarlo… y el lápiz se cae debajo del armario.",
      "¡Qué nervios! Tiene que buscarlo en la oscuridad. Puede buscarlo con la mano.",
      "Quiere recogerlo, y tiene que recogerlo: sin el lápiz no hay marca.",
      "Lo recoge, y tiene que usarlo: hace una pequeña marca roja en el documento con el número.",
      "Puede guardarlo en el bolsillo, llevarlo o dárselo a alguien. Pero el lápiz se cae otra vez debajo del armario, y esta vez el intruso lo deja allí.",
      "Un lápiz no se abre: es un lápiz.",
    ],
    ru: [
      "Наконец преступник находит номер рецепта. Он хочет отметить его своим красным карандашом… и карандаш падает под шкаф.",
      "Ну и нервы! Ему нужно найти его в темноте. Искать можно рукой.",
      "Он хочет его поднять и обязан поднять: без карандаша метки не будет.",
      "Поднимает и обязан им воспользоваться: ставит маленькую красную метку на документе с номером.",
      "Он может положить карандаш в карман, унести или отдать кому-то. Но карандаш снова падает под шкаф, и на этот раз преступник оставляет его там.",
      "Карандаш не открывают: это карандаш.",
    ],
  },
  documentos_numerados: {
    es: [
      "El número de la receta más importante está en un documento. Los documentos están en una caja cerrada, en el despacho.",
      "El intruso quiere ese número: quiere usarlo, y puede usarlo para la receta más poderosa.",
      "Primero tiene que abrir la caja. Quiere abrirla, y puede abrirla sin ruido.",
      "Después tiene que buscar el número, documento por documento. Quiere buscarlo rápido, y puede: tiene tiempo hasta las tres.",
      "Puede llevar los documentos, guardarlos o dárselos a su cómplice, pero no quiere: Don Verbo los cuenta cada mañana.",
      "Están en la caja, no en el suelo: no hay nada que recoger.",
    ],
    ru: [
      "Номер самого важного рецепта — на одном из документов. Документы лежат в закрытой коробке, в кабинете.",
      "Преступник хочет этот номер: хочет им воспользоваться и может — для самого сильного рецепта.",
      "Сначала ему нужно открыть коробку. Он хочет открыть и может открыть бесшумно.",
      "Потом ему нужно найти номер, документ за документом. Он хочет найти быстро и может: время есть до трёх.",
      "Он может унести документы, спрятать или отдать сообщнику, но не хочет: Дон Вербо пересчитывает их каждое утро.",
      "Они в коробке, а не на полу: поднимать нечего.",
    ],
  },
  papeles_suelo: {
    es: [
      "El intruso abre la caja de documentos, y unos papeles se caen al suelo. ¡Peligro!",
      "Los papeles en el suelo son una huella: Don Verbo puede verlos.",
      "Por eso quiere recogerlos y guardarlos otra vez en la caja. Y tiene que recogerlos y guardarlos.",
      "Está oscuro: puede buscarlos con las manos, papel por papel.",
      "Puede llevarlos, usarlos o dárselos a su cómplice, pero no quiere: son papeles sin importancia.",
      "Recoge muchos, pero no todos: a las tres cambia el guardia. Son hojas sueltas: no hay nada que abrir.",
    ],
    ru: [
      "Преступник открывает коробку с документами, и несколько бумаг падает на пол. Опасно!",
      "Бумаги на полу — это след: Дон Вербо может их увидеть.",
      "Поэтому он хочет собрать их и снова убрать в коробку. И обязан собрать и убрать.",
      "Темно: искать их можно руками, листок за листком.",
      "Он может унести их, использовать или отдать сообщнику, но не хочет: это неважные бумаги.",
      "Собирает много, но не все: в три часа меняется охрана. Это отдельные листы: открывать нечего.",
    ],
  },
  lupa: {
    es: [
      "El intruso tiene los ojos cansados. Los números de los documentos son muy, muy pequeños: sin ayuda, no puede leerlos.",
      "Pero la lupa de Don Verbo está en la mesa del salón, delante de él: no hay nada que buscar.",
      "Quiere recogerla y usarla, y puede: nadie la vigila.",
      "Tiene que llevarla al despacho y usarla: con la lupa lee el número.",
      "Después la deja otra vez en la mesa. Puede guardarla en el bolsillo o dársela a su cómplice, pero no quiere: Don Verbo la usa cada mañana.",
      "Una lupa no se abre: es una lupa.",
    ],
    ru: [
      "У преступника усталые глаза. Цифры на документах очень-очень мелкие: без помощи их не прочитать.",
      "Но лупа Дона Вербо лежит на столе в гостиной, прямо перед ним: искать нечего.",
      "Он хочет взять её и воспользоваться, и может: её никто не сторожит.",
      "Он обязан отнести её в кабинет и воспользоваться: через лупу он читает номер.",
      "Потом кладёт обратно на стол. Может положить в карман или отдать сообщнику, но не хочет: Дон Вербо пользуется ею каждое утро.",
      "Лупу не открывают: это лупа.",
    ],
  },
  bandeja: {
    es: [
      "En la cocina hay una bandeja grande con tapa, a la vista: no hay nada que buscar.",
      "El intruso tiene una idea. Tiene que usar la bandeja: pone el Libro debajo de la tapa.",
      "Quiere llevarla él mismo fuera del palacio, y puede, pero no tiene que: es peligroso.",
      "Quiere dársela a alguien. Puede dársela a cualquier ayudante, pero tiene que dársela al ayudante de la mañana.",
      "Es solo una bandeja: puede recogerla o guardarla en el armario. La tapa solo está encima: la bandeja no se abre.",
      "Por la mañana, el ayudante la saca del palacio y dice: «Hoy pesa mucho». No sabe nada.",
    ],
    ru: [
      "На кухне большой поднос с крышкой, на виду: искать нечего.",
      "У преступника есть идея. Он обязан воспользоваться подносом: кладёт Книгу под крышку.",
      "Он хочет сам вынести поднос из дворца, и может, но не обязан: это опасно.",
      "Он хочет кому-то его отдать. Может отдать любому помощнику, но обязан — утреннему.",
      "Это просто поднос: его можно поднять или убрать в шкаф. Крышка просто лежит сверху: поднос не открывают.",
      "Утром помощник выносит его из дворца и говорит: «Сегодня он очень тяжёлый». Он ничего не знает.",
    ],
  },
  cuenco_vacio: {
    es: [
      "En la cocina, en su sitio, está el cuenco de cristal. Es precioso, y el intruso lo mira mucho tiempo.",
      "Quiere guardarlo para él y usarlo para sus palabras mágicas. Y puede: el cuenco está limpio y listo.",
      "Puede recogerlo, llevarlo a casa o dárselo a su cómplice.",
      "Pero no tiene que hacer nada con él: el cuenco no es parte del plan. Y el plan es lo primero.",
      "Está a la vista y ya está abierto: no hay nada que buscar ni abrir.",
      "Por eso esta mañana el cuenco está en su sitio, limpio y vacío.",
    ],
    ru: [
      "На кухне, на своём месте, стоит хрустальная чаша. Она прекрасна, и преступник долго на неё смотрит.",
      "Он хочет забрать её себе и творить в ней свои волшебные слова. И может: чаша чистая и готова.",
      "Он может поднять её, унести домой или отдать сообщнику.",
      "Но по плану с ней ничего делать не нужно: чаша не часть плана. А план — главное.",
      "Она на виду и уже открыта: искать и открывать нечего.",
      "Поэтому утром чаша на своём месте, чистая и пустая.",
    ],
  },
  ingredientes_gramaticales: {
    es: [
      "Sin los ingredientes gramaticales, las recetas del Libro no funcionan. Don Verbo los ha escondido en la cocina.",
      "El intruso tiene que buscarlos. Puede buscar tranquilo: de noche, la cocina está vacía.",
      "Los encuentra en un bote de azúcar. Puede recogerlos y llevarlos en el bolsillo.",
      "Quiere llevarlos al jardín y dárselos a su cómplice, y puede: el cómplice espera allí. Pero esta noche no tiene que dárselos.",
      "Tiene que guardarlos en un lugar seguro, y puede: debajo de la escalera. Sin ellos, el Libro no sirve a nadie.",
      "Puede usarlos para una receta, pero esta noche no. No son una caja: no se abren.",
    ],
    ru: [
      "Без грамматических ингредиентов рецепты Книги не работают. Дон Вербо спрятал их на кухне.",
      "Преступнику нужно их найти. Искать можно спокойно: ночью на кухне никого нет.",
      "Он находит их в банке из-под сахара. Может собрать их и унести в кармане.",
      "Он хочет отнести их в сад и отдать сообщнику, и может: сообщник ждёт там. Но этой ночью отдавать не обязательно.",
      "Обязательно — спрятать их в надёжном месте, и он может: под лестницей. Без них Книга никому не нужна.",
      "Он может использовать их для рецепта, но не этой ночью. Это не коробка: их не открывают.",
    ],
  },
  sombra_sala: {
    es: [
      "El ayudante más joven ha visto una sombra en el jardín, junto a la Sala.",
      "No es una cosa: es el cómplice del intruso, que espera en la oscuridad.",
      "El intruso quiere buscarlo: tiene un mensaje para él.",
      "Puede buscarlo en el jardín: de noche nadie lo ve. Y tiene que buscarlo: sin el cómplice, el plan no termina.",
      "Una sombra no se abre, no se lleva, no se recoge, no se guarda, no se usa y no se da: solo se busca.",
    ],
    ru: [
      "Самый младший помощник видел в саду, возле Зала, тень.",
      "Это не вещь: это сообщник преступника, который ждёт в темноте.",
      "Преступник хочет его найти: у него есть записка для сообщника.",
      "Искать можно в саду: ночью его никто не видит. И обязан найти: без сообщника план не закончится.",
      "Тень не открывают, не уносят, не поднимают, не прячут, ею не пользуются и её не отдают: её можно только искать.",
    ],
  },
};
