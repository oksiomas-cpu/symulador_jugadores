import { useState } from "react";

/* ============================================================
   LA CATA A CIEGAS — Симулятор игрока  /player  (v2.1)
   La Ciudad de los Sentidos · лингвистический детектив
   ИЗМЕНЕНИЯ v2.1: система баллов + сессионный счёт
   — Детектив: +5/+3/+1 по числу вопросов до угадывания
   — Свидетель: раунд 18 вопросов (1-9 разогрев, 10-18 оценка)
     0 ошибок→+5, 1-2→+3, 3-4→+1, 5+→0
   — Сессионный счёт по трём ролям, живёт пока не вышел
   ============================================================ */

const C = {
  cream: "#FAF3E6", creamDeep: "#F3E8D2", card: "#FFFFFF",
  ink: "#3D2B1F", inkSoft: "#6B5544",
  gold: "#C9A24B", goldDeep: "#A67C2E", goldSoft: "#EBD9A8",
  raspberry: "#A81B3E", raspberryDeep: "#7E1430",
  emerald: "#16795B", emeraldDeep: "#0F5E47", line: "#E6D6B8",
};
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

const QUESTIONS = [
  { id: "n11", lvl: 1, cat: "quien", q: "¿El Jefe hace esto?", ru: "Шеф делает это?" },
  { id: "m1",  lvl: 1, cat: "quien", q: "¿El Jefe hace esto solo?", ru: "Шеф делает это один?" },
  { id: "n12", lvl: 1, cat: "quien", q: "¿Los ayudantes también hacen esto?", ru: "Помощники тоже делают это?" },
  { id: "n13", lvl: 1, cat: "donde", q: "¿Esto pasa dentro del palacio?", ru: "Это происходит внутри дворца?" },
  { id: "n14", lvl: 1, cat: "donde", q: "¿Esto pasa fuera del palacio?", ru: "Это происходит вне дворца?" },
  { id: "n32", lvl: 3, cat: "donde", q: "¿Esto ocurre en la cocina?", ru: "Происходит на кухне?" },
  { id: "n33", lvl: 3, cat: "donde", q: "¿Esto ocurre en la terraza?", ru: "Происходит на террасе?" },
  { id: "n15", lvl: 1, cat: "cuando", q: "¿Esto pasa por la mañana?", ru: "Это происходит утром?" },
  { id: "n16", lvl: 1, cat: "cuando", q: "¿Esto ocurre todos los días?", ru: "Это происходит каждый день?" },
  { id: "n31", lvl: 3, cat: "cuando", q: "¿Esto dura menos de quince minutos?", ru: "Длится меньше 15 минут?" },
  { id: "n21", lvl: 2, cat: "como", q: "¿Se necesitan las manos para esto?", ru: "Нужны руки?" },
  { id: "n22", lvl: 2, cat: "como", q: "¿Se necesitan los ojos para esto?", ru: "Нужны глаза?" },
  { id: "n23", lvl: 2, cat: "como", q: "¿Se necesitan los oídos para esto?", ru: "Нужны уши?" },
  { id: "n24", lvl: 2, cat: "como", q: "¿Se necesita la voz para esto?", ru: "Нужен голос?" },
  { id: "n25", lvl: 2, cat: "como", q: "¿Se necesitan las piernas para esto?", ru: "Нужны ноги?" },
  { id: "n26", lvl: 2, cat: "como", q: "¿Se necesita un objeto o instrumento para esto?", ru: "Нужен предмет/инструмент?" },
  { id: "n27", lvl: 2, cat: "como", q: "¿Se necesita dinero para esto?", ru: "Нужны деньги?" },
  { id: "n28", lvl: 2, cat: "detalles", q: "¿Esto produce un sonido?", ru: "Это производит звук?" },
  { id: "n29", lvl: 2, cat: "detalles", q: "¿Después de esto llega una idea nueva?", ru: "После этого приходит новая идея?" },
  { id: "n34", lvl: 3, cat: "detalles", q: "¿El Jefe come o bebe algo durante esto?", ru: "Шеф ест или пьёт во время этого?" },
  { id: "n35", lvl: 3, cat: "detalles", q: "¿Hay silencio durante esto?", ru: "Во время этого тишина?" },
];

const CATS = [
  { id: "quien",    icon: "👤", es: "¿QUIÉN?",    ru: "КТО" },
  { id: "donde",    icon: "📍", es: "¿DÓNDE?",    ru: "ГДЕ" },
  { id: "cuando",   icon: "🕐", es: "¿CUÁNDO?",   ru: "КОГДА" },
  { id: "como",     icon: "✋", es: "¿CÓMO/CON QUÉ?", ru: "КАК / ЧЕМ" },
  { id: "detalles", icon: "🔎", es: "DETALLES",   ru: "ДЕТАЛИ" },
];

const VERBS = [
  {
    key: "desayunar", emoji: "☕", inf: "desayunar", ru: "завтракать",
    storyEs: "Cada mañana, antes de que el Palacio de Caramelo despierte, el Gran Jefe Alcalde **desayuna** solo en su terraza favorita. Hoy **desayuna** con una taza de café negro y una torre de tostadas con caramelo dorado. Mientras **desayuna**, mira la ciudad que lentamente abre los ojos.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Dónde?", "En su terraza favorita"], ["¿Cuándo?", "Cada mañana"], ["¿Con quién?", "Solo"], ["¿Qué?", "Café negro y tostadas con caramelo"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"no", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"no", n24:"no", n25:"no", n26:"no", n27:"no", n28:"no", n29:"sí", n31:"sí", n32:"no", n33:"sí", n34:"sí", n35:"sí" },
    mask: "preparar",
  },
  {
    key: "caminar", emoji: "🚶", inf: "caminar", ru: "идти / гулять",
    storyEs: "Después del desayuno, el Gran Jefe Alcalde **camina** por los pasillos del Palacio de Caramelo. Él **camina** despacio, con las manos detrás de la espalda. El Jefe **camina** cada mañana exactamente veinte minutos. Mientras **camina**, encuentra una idea nueva.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Dónde?", "Por los pasillos del palacio"], ["¿Cuándo?", "Cada mañana, 20 minutos"], ["¿Con quién?", "Solo"], ["¿Cómo?", "Despacio, manos en la espalda"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"no", n24:"no", n25:"sí", n26:"no", n27:"no", n28:"no", n29:"sí", n31:"no", n32:"no", n33:"no", n34:"no", n35:"sí" },
    mask: "trabajar",
  },
  {
    key: "cantar", emoji: "🎵", inf: "cantar", ru: "петь",
    storyEs: "Cada mañana, a las siete en punto, los tres ayudantes del Jefe se reúnen en la Cocina Mágica. Ellos siempre **cantan** juntos una canción de trabajo. Mientras **cantan**, el caramelo en las ollas comienza a brillar más fuerte. El Jefe escucha desde su despacho y sonríe.",
    dossier: [["¿Quién?", "Los tres ayudantes"], ["¿Dónde?", "En la Cocina Mágica"], ["¿Cuándo?", "Cada mañana, a las 7"], ["¿Con quién?", "Los tres juntos"], ["¿Qué?", "La melodía del caramelo dorado"]],
    answers: { n11:"no", m1:"no", n12:"sí", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"no", n24:"sí", n25:"no", n26:"no", n27:"no", n28:"sí", n29:"no", n31:"sí", n32:"sí", n33:"no", n34:"no", n35:"no" },
    mask: "hablar",
  },
  {
    key: "mirar", emoji: "👁", inf: "mirar", ru: "смотреть",
    storyEs: "Desde la terraza del Palacio, el Gran Jefe Alcalde **mira** la ciudad cada mañana. Él **mira** con calma, sin prisa. Hoy **mira** las nubes, **mira** los ayudantes que caminan por el mercado, **mira** el río de caramelo. Cuando **mira** así, en silencio, entiende todo lo que necesita.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Dónde?", "Desde la terraza"], ["¿Cuándo?", "Cada mañana"], ["¿Con quién?", "Solo, en silencio"], ["¿Qué?", "Las nubes, el río de caramelo"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"no", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"sí", n23:"no", n24:"no", n25:"no", n26:"no", n27:"no", n28:"no", n29:"no", n31:"sí", n32:"no", n33:"sí", n34:"no", n35:"sí" },
    mask: "escuchar",
  },
  {
    key: "buscar", emoji: "🔍", inf: "buscar", ru: "искать",
    storyEs: "Cada mañana, después de mirar la ciudad, el Jefe **busca** ideas nuevas para el menú. Él **busca** en su libro de recetas. Hoy **busca** un ingrediente especial — algo que nunca ha usado. **Busca** en los armarios dorados, **busca** en las cajas secretas del sótano. Al final lo encuentra.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué?", "Un ingrediente especial nuevo"], ["¿Dónde?", "Armarios, cajas del sótano"], ["¿Cuándo?", "Cada mañana"], ["¿Con quién?", "Solo"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"sí", n22:"no", n23:"no", n24:"no", n25:"no", n26:"no", n27:"no", n28:"no", n29:"sí", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"sí" },
    mask: "comprar",
  },
  {
    key: "escuchar", emoji: "🎧", inf: "escuchar", ru: "слушать",
    storyEs: "Cada mañana, después de buscar ideas, el Jefe **escucha** los sonidos del Palacio. Se sienta en su sillón, cierra los ojos y **escucha** en silencio absoluto. Hoy **escucha** el caramelo que burbujea, el viento, los pasos de los ayudantes. **Escucha** durante diez minutos exactos.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Dónde?", "En su sillón favorito"], ["¿Cuándo?", "Cada mañana, 10 minutos"], ["¿Con quién?", "Solo, en silencio absoluto"], ["¿Qué?", "El caramelo, el viento, los pasos"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"sí", n24:"no", n25:"no", n26:"no", n27:"no", n28:"no", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"sí" },
    mask: "mirar",
  },
  {
    key: "hablar", emoji: "🗣", inf: "hablar", ru: "говорить",
    storyEs: "El Gran Jefe Alcalde **habla** mucho. **Habla** con sus ayudantes cada mañana en la gran sala. **Habla** claro y despacio. Hoy **habla** sobre el menú especial del día. **Habla** durante quince minutos sin parar. Sus ayudantes escuchan y toman notas.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Dónde?", "En la gran sala"], ["¿Cuándo?", "Cada mañana, 15 minutos"], ["¿Con quién?", "Con sus ayudantes"], ["¿De qué?", "Del menú especial del día"]],
    answers: { n11:"sí", m1:"no", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"no", n24:"sí", n25:"no", n26:"no", n27:"no", n28:"sí", n29:"no", n31:"no", n32:"no", n33:"no", n34:"no", n35:"no" },
    mask: "cantar",
  },
  {
    key: "preparar", emoji: "👨‍🍳", inf: "preparar", ru: "готовить",
    storyEs: "Después de hablar con sus ayudantes, el Jefe **prepara** el plato especial del día. Hoy **prepara** una tarta de caramelo con pétalos de azúcar dorado. **Prepara** todo con cuidado, con su cucharón de oro y su varilla de cristal. **Prepara** este plato durante una hora exacta.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué?", "Una tarta de caramelo"], ["¿Dónde?", "En la cocina, mesa de mármol"], ["¿Con quién?", "Solo"], ["¿Con qué?", "Cucharón de oro, varilla de cristal"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"sí", n22:"no", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"no", n29:"no", n31:"no", n32:"sí", n33:"no", n34:"no", n35:"sí" },
    mask: "desayunar",
  },
  {
    key: "comprar", emoji: "🛒", inf: "comprar", ru: "покупать",
    storyEs: "Una vez a la semana, el Jefe va al mercado de caramelo a **comprar** ingredientes frescos. **Compra** siempre lo mismo: caramelo líquido, azúcar dorado y especias mágicas. Hoy **compra** algo nuevo — polvo de caramelo plateado. **Compra** con una lista en la mano, rápido y sin dudar.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Dónde?", "En el mercado de caramelo"], ["¿Cuándo?", "Una vez a la semana"], ["¿Con quién?", "Solo"], ["¿Qué?", "Caramelo, azúcar, especias"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"no", n14:"sí", n15:"sí", n16:"no", n21:"sí", n22:"no", n23:"no", n24:"no", n25:"no", n26:"no", n27:"sí", n28:"no", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"no" },
    mask: "buscar",
  },
  {
    key: "trabajar", emoji: "⚙️", inf: "trabajar", ru: "работать",
    storyEs: "En el Palacio de Caramelo, todos **trabajan** juntos. El Jefe **trabaja** desde las siete de la mañana hasta las tres de la tarde. Hoy todos **trabajan** en el gran banquete del viernes. El Jefe **trabaja** en la cocina; los ayudantes **trabajan** en la sala de decoración.",
    dossier: [["¿Quién?", "El Jefe y los ayudantes"], ["¿Dónde?", "Cocina y sala de decoración"], ["¿Cuándo?", "De las 7 a las 3"], ["¿Con quién?", "Todos juntos"], ["¿En qué?", "El banquete del viernes"]],
    answers: { n11:"sí", m1:"no", n12:"sí", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"sí", n22:"no", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"no", n29:"no", n31:"no", n32:"sí", n33:"no", n34:"no", n35:"no" },
    mask: "caminar",
  },
  {
    key: "tomar", emoji: "✋", inf: "tomar", ru: "брать / поднимать",
    storyEs: "Cada día, cuando todo está listo en la Cocina Mágica, el Gran Jefe Alcalde **toma** su varilla dorada con las dos manos, despacio, como un ritual. Nadie empieza a trabajar hasta que el Jefe **toma** la varilla. Hoy, como siempre, la **toma** y la levanta hacia la luz dorada.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué?", "Toma la varilla dorada"], ["¿Dónde?", "Mesa central de la Cocina"], ["¿Cuándo?", "Cada día, cuando todo está listo"], ["¿Cómo?", "Con las dos manos, un ritual"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"no", n16:"sí", n21:"sí", n22:"sí", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"no", n29:"no", n31:"sí", n32:"sí", n33:"no", n34:"no", n35:"sí" },
    mask: "llevar",
    canonVer: "Шеф берёт двумя руками золотой венчик на Волшебной Кухне. Каждый день когда всё готово. Торжественный ритуал, тишина, меньше минуты.",
    fantVer: "Один помощник берёт не золотой венчик, а старый деревянный ковш. В подвале дворца, вечером, тайно, один, 2 минуты.",
    fantAns: { n11:"no", m1:"sí", n12:"sí", n13:"sí", n14:"no", n15:"no", n16:"no", n21:"sí", n22:"sí", n23:"sí", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"sí", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"sí" },
    trap: { q: "¿Mueve los pies durante esto?", ru: "Двигает ногами?", canon: "no", fant: "sí" },
  },
  {
    key: "llamar", emoji: "📣", inf: "llamar", ru: "звать",
    storyEs: "Al pie de la gran escalera dorada, el Gran Jefe Alcalde **llama** a su equipo con voz fuerte y clara: «¡Es hora de trabajar!» Su voz resuena por todos los corredores. **Llama** una vez, dos veces, siempre con energía. En menos de dos minutos los ayudantes llegan corriendo.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué?", "Llama a su equipo"], ["¿Dónde?", "Al pie de la escalera, corredor"], ["¿Cuándo?", "Cada mañana, tras caminar"], ["¿Cómo?", "En voz muy alta, 1-2 veces"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"sí", n24:"sí", n25:"no", n26:"no", n27:"no", n28:"sí", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"no" },
    mask: "hablar",
    canonVer: "Шеф зовёт команду громким голосом у подножия золотой лестницы. Каждое утро после прогулки. Эхо по коридорам. Меньше 2 минут.",
    fantVer: "Помощник зовёт Шефа — не Шеф помощников. На кухне, вечером, тихим голосом, один помощник, 1 раз.",
    fantAns: { n11:"no", m1:"sí", n12:"sí", n13:"sí", n14:"no", n15:"no", n16:"no", n21:"no", n22:"no", n23:"sí", n24:"sí", n25:"no", n26:"no", n27:"no", n28:"sí", n29:"no", n31:"sí", n32:"sí", n33:"no", n34:"no", n35:"no" },
    trap: { q: "¿Habla con los ayudantes durante esto?", ru: "Разговаривает во время этого?", canon: "no", fant: "no" },
  },
  {
    key: "preguntar", emoji: "❓", inf: "preguntar", ru: "спрашивать",
    storyEs: "Después de escuchar al Jefe, los tres ayudantes **preguntan** con voz clara y respetuosa: «¿Qué necesitamos hoy?» El Jefe responde con paciencia. Cada ayudante **pregunta** algo. Cuando ellos **preguntan**, el trabajo sale perfecto. Las preguntas duran cinco minutos.",
    dossier: [["¿Quién?", "Los tres ayudantes"], ["¿A quién?", "Al Jefe — él responde"], ["¿Dónde?", "En el gran salón"], ["¿Cuándo?", "Tras la charla del Jefe, mañana"], ["¿Cuánto?", "Exactamente 5 minutos"]],
    answers: { n11:"no", m1:"no", n12:"sí", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"sí", n23:"sí", n24:"sí", n25:"no", n26:"no", n27:"no", n28:"sí", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"no" },
    mask: "hablar",
    canonVer: "Спрашивают помощники (не Шеф — он отвечает). В большом зале, утром после речи Шефа. Голоса, 5 минут.",
    fantVer: "Шеф — не помощники — спрашивает одного помощника. Вечером, на кухне, один вопрос, шёпотом, 1 минута.",
    fantAns: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"no", n16:"no", n21:"no", n22:"sí", n23:"sí", n24:"sí", n25:"no", n26:"no", n27:"no", n28:"sí", n29:"sí", n31:"sí", n32:"sí", n33:"no", n34:"no", n35:"no" },
    trap: { q: "¿El Jefe también pregunta?", ru: "Шеф тоже спрашивает?", canon: "no", fant: "sí" },
  },
  {
    key: "estudiar", emoji: "📚", inf: "estudiar", ru: "изучать",
    storyEs: "Antes de salir de su despacho, el Gran Jefe Alcalde **estudia** una sola página de su libro antiguo de recetas. Hoy **estudia** la receta del caramelo de medianoche. **Estudia** cada palabra despacio, sin mover los ojos del libro, durante treinta minutos exactos. En silencio total.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde, solo"], ["¿Qué?", "Una página del libro de recetas"], ["¿Dónde?", "En su despacho, en el sillón"], ["¿Cuándo?", "Cada mañana, antes de salir"], ["¿Cuánto?", "Exactamente 30 minutos"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"sí", n22:"sí", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"no", n29:"sí", n31:"no", n32:"no", n33:"no", n34:"no", n35:"sí" },
    mask: "buscar",
    canonVer: "Шеф изучает ОДНУ страницу древней книги рецептов. В кабинете, в кресле, перед выходом. 30 минут, глаза не движутся, полная тишина.",
    fantVer: "Три помощника изучают новый рецепт вместе. На кухне, вечером, 10 минут, читают вслух.",
    fantAns: { n11:"no", m1:"no", n12:"sí", n13:"sí", n14:"no", n15:"no", n16:"no", n21:"sí", n22:"sí", n23:"sí", n24:"sí", n25:"no", n26:"sí", n27:"no", n28:"sí", n29:"sí", n31:"sí", n32:"sí", n33:"no", n34:"no", n35:"no" },
    trap: { q: "¿Pasa muchas páginas buscando?", ru: "Листает много страниц в поиске?", canon: "no", fant: "no" },
  },
  {
    key: "llevar", emoji: "🎩", inf: "llevar", ru: "носить (на себе)",
    storyEs: "El Gran Jefe Alcalde siempre **lleva** su gorro de chef blanco y alto. Sin el gorro, el día no empieza. También **lleva** su barba oscura con orgullo — es la firma del Jefe. Lo **lleva** todo el día, en cada salón y corredor. El gorro nunca descansa.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué?", "Gorro blanco + barba"], ["¿Dónde?", "En todos lados, todo el palacio"], ["¿Cuándo?", "Todo el día, cada día"], ["¿Significa?", "Gorro + barba = el Jefe está aquí"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"sí", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"no", n29:"no", n31:"no", n32:"sí", n33:"sí", n34:"no", n35:"no" },
    mask: "tomar",
    canonVer: "Шеф носит на себе высокий белый колпак и тёмную бороду. Везде во дворце, весь день, каждый день. Не берёт в руки — носит как часть образа.",
    fantVer: "Помощники носят маленькие коричневые (карамельные) колпаки — не белые. Только по пятницам, не каждый день, без бороды.",
    fantAns: { n11:"no", m1:"no", n12:"sí", n13:"sí", n14:"no", n15:"no", n16:"no", n21:"no", n22:"no", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"no", n29:"no", n31:"no", n32:"sí", n33:"no", n34:"no", n35:"no" },
    trap: { q: "¿Lo toma en las manos?", ru: "Берёт это в руки?", canon: "no", fant: "no" },
  },
];

const verbByKey = (k) => VERBS.find((v) => v.key === k);
function rnd(n) { return Math.floor(Math.random() * n); }
function shuffle(a) { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = rnd(i + 1); [x[i], x[j]] = [x[j], x[i]]; } return x; }

// ---- UI ----
function Block({ stripe, children, style }) {
  return (
    <div style={{ background: C.card, borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 10px rgba(61,43,31,0.08)", border: `1px solid ${C.line}`, display: "flex", marginBottom: 16, ...style }}>
      <div style={{ width: 7, background: stripe, flexShrink: 0 }} />
      <div style={{ padding: "16px 18px", flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}
function Btn({ children, onClick, bg = C.gold, color = "#fff", disabled, style }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background: disabled ? "#D8CBB4" : bg, color, border: "none", borderRadius: 10, padding: "11px 16px", fontSize: 15, fontWeight: 600, cursor: disabled ? "default" : "pointer", fontFamily: SERIF, ...style }}>{children}</button>
  );
}
const h2 = { fontSize: 17, fontWeight: 700, margin: "0 0 4px", color: C.ink };
const pHint = { fontSize: 13, color: C.inkSoft, margin: "4px 0 0", lineHeight: 1.5 };
const tag = { fontSize: 11.5, letterSpacing: ".5px", color: C.goldDeep, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 };
const lvlName = { 1: "Nivel 1 · Categoría", 2: "Nivel 2 · Acotar", 3: "Nivel 3 · Precisión" };

function Highlighted({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return <span>{parts.map((p, i) => p.startsWith("**") && p.endsWith("**")
    ? <strong key={i} style={{ color: C.raspberry, fontWeight: 700 }}>{p.slice(2, -2)}</strong>
    : <span key={i}>{p}</span>)}</span>;
}
function SiNo({ v }) {
  const yes = v === "sí";
  return <span style={{ background: yes ? C.emerald : C.raspberry, color: "#fff", borderRadius: 7, padding: "2px 12px", fontWeight: 700, fontSize: 14, letterSpacing: ".5px" }}>{yes ? "SÍ" : "NO"}</span>;
}
function Header({ subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 18 }}>
      <div style={{ fontSize: 12, letterSpacing: "2px", color: C.goldDeep, fontWeight: 600 }}>LA CIUDAD DE LOS SENTIDOS</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink, fontFamily: SERIF }}>La Cata a Ciegas · Entrenamiento</div>
      {subtitle && <div style={{ fontSize: 13.5, color: C.inkSoft, marginTop: 3 }}>{subtitle}</div>}
    </div>
  );
}
function Footer({ onHome }) {
  return (
    <div style={{ textAlign: "center", marginTop: 24 }}>
      {onHome && <button onClick={onHome} style={{ background: C.goldSoft, border: `1.5px solid ${C.gold}`, color: C.goldDeep, fontSize: 16, fontWeight: 700, borderRadius: 12, padding: "13px 28px", cursor: "pointer", fontFamily: SERIF, boxShadow: "0 2px 8px rgba(61,43,31,0.10)" }}>← Сменить роль</button>}
      <div style={{ fontSize: 12, color: C.goldDeep, marginTop: 14 }}>La Ciudad de los Sentidos 🍬</div>
    </div>
  );
}

// ---- Бейдж сессионного счёта ----
function ScoreBadge({ session }) {
  const total = session.detective + session.canon + session.fantasia;
  if (total === 0) return null;
  return (
    <div style={{
      background: C.goldSoft, border: `1px solid ${C.gold}`, borderRadius: 10,
      padding: "9px 14px", marginBottom: 14,
      display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
    }}>
      <span style={{ fontWeight: 700, color: C.goldDeep, fontSize: 13 }}>🏆 Сессия</span>
      <span style={{ fontSize: 12, color: C.inkSoft }}>
        🕵️ {session.detective} · 🟢 {session.canon} · 🔴 {session.fantasia}
      </span>
      <span style={{ fontWeight: 700, color: C.raspberry, fontSize: 18, minWidth: 28, textAlign: "right" }}>{total}</span>
    </div>
  );
}

// ---- Прогресс раунда (18 вопросов: 9 разогрев + 9 оценка) ----
function RoundProgress({ roundQ, roundErrors }) {
  const warmup = Math.min(roundQ, 9);
  const zone = Math.max(0, roundQ - 9);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>
        <span>Разогрев (1–9)</span>
        <span style={{ color: roundQ >= 9 ? C.goldDeep : C.inkSoft, fontWeight: roundQ >= 9 ? 700 : 400 }}>
          {roundQ >= 9 ? "⚡ Оценка (10–18)" : `${roundQ}/9`}
        </span>
        <span style={{ color: C.raspberry }}>{roundQ >= 9 ? `Ошибок: ${roundErrors}` : ""}</span>
      </div>
      <div style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < warmup ? C.goldSoft : C.line, border: `1px solid ${i < warmup ? C.gold : C.line}` }} />
        ))}
        <div style={{ width: 6 }} />
        {Array.from({ length: 9 }).map((_, i) => {
          const filled = i < zone;
          const bg = filled ? (roundErrors > 0 && i >= (zone - roundErrors < 0 ? 0 : zone - roundErrors) ? C.raspberry : C.emerald) : C.line;
          return <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: bg, border: `1px solid ${filled ? bg : C.line}` }} />;
        })}
      </div>
    </div>
  );
}

const wrap = { minHeight: "100vh", background: `radial-gradient(120% 80% at 50% 0%, ${C.cream} 0%, ${C.creamDeep} 100%)`, fontFamily: SERIF, color: C.ink, padding: "18px 14px 60px", boxSizing: "border-box" };
const maxw = { maxWidth: 560, margin: "0 auto" };

// ============================================================
// ГЛАВНЫЙ КОМПОНЕНТ — хранит сессионный счёт
// ============================================================
// ============ РЕЖИМ «ЖИВАЯ ИГРА» (LIVE) ============
// Пульты для реальной игры в Zoom: детектив + свидетели (Канон / Фантазия)

function liveFantVer(v) {
  if (v.fantVer) return v.fantVer;
  const m = verbByKey(v.mask);
  return "Притворись, что Шеф делает «" + m.inf + "» (" + m.ru + "). Отвечай уверенно, как будто глагол именно такой — это твоя легенда.";
}
function liveFantAns(v) {
  return v.fantAns || verbByKey(v.mask).answers;
}
function liveCanonVer(v) {
  return v.canonVer || ("Правда: " + v.dossier.map(d => d[1]).slice(0,3).join(" · "));
}

// ----- Большой бейдж SÍ / NO -----
function BigSiNo({ v }) {
  const yes = v === "sí";
  return <span style={{ background: yes ? C.emerald : C.raspberry, color: "#fff", borderRadius: 9, padding: "6px 16px", fontWeight: 800, fontSize: 17, letterSpacing: ".5px", minWidth: 56, textAlign: "center", display: "inline-block" }}>{yes ? "SÍ" : "NO"}</span>;
}

// ===== ПУЛЬТ ДЕТЕКТИВА =====
function LiveDetective({ onBack }) {
  const [open, setOpen] = useState("quien");
  const [asked, setAsked] = useState({});   // { qid: { A: null|"sí"|"no", B: null|"sí"|"no" } }
  const [custom, setCustom] = useState([]);  // [{text, A, B}]
  const [draft, setDraft] = useState("");

  function setAns(qid, w, val) {
    setAsked(prev => {
      const cur = prev[qid] || { A: null, B: null };
      const next = cur[w] === val ? null : val; // повторный клик снимает
      return { ...prev, [qid]: { ...cur, [w]: next } };
    });
  }
  function setCustomAns(i, w, val) {
    setCustom(prev => prev.map((c, j) => j === i ? { ...c, [w]: (c[w] === val ? null : val) } : c));
  }
  function addCustom() {
    if (!draft.trim()) return;
    setCustom(prev => [...prev, { text: draft.trim(), A: null, B: null }]);
    setDraft("");
  }
  const answeredCount = Object.values(asked).filter(x => x.A || x.B).length
    + custom.filter(c => c.A || c.B).length;
  const conflictCount = Object.values(asked).filter(x => x.A && x.B && x.A !== x.B).length
    + custom.filter(c => c.A && c.B && c.A !== c.B).length;

  function AnsRow({ es, ru, st, onSet }) {
    const conflict = st.A && st.B && st.A !== st.B;
    return (
      <div style={{ background: conflict ? "rgba(178,42,75,0.07)" : C.cream, border: `1.5px solid ${conflict ? C.raspberry : C.line}`, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>{es}</div>
        {ru && <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 8 }}>{ru}</div>}
        {["A", "B"].map(w => (
          <div key={w} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <span style={{ width: 78, fontSize: 13, fontWeight: 700, color: C.inkSoft }}>Testigo {w}:</span>
            {[["sí", "SÍ", C.emerald], ["no", "NO", C.raspberry]].map(([val, lab, col]) => {
              const on = st[w] === val;
              return (
                <button key={val} onClick={() => onSet(w, val)} style={{ flex: 1, background: on ? col : "#fff", color: on ? "#fff" : col, border: `1.5px solid ${col}`, borderRadius: 8, padding: "6px 0", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: SERIF }}>
                  {on ? "✓ " : ""}{lab}
                </button>
              );
            })}
          </div>
        ))}
        {conflict && <div style={{ marginTop: 8, fontSize: 12.5, fontWeight: 700, color: C.raspberry }}>⚡ Расхождение — здесь один из них лжёт</div>}
      </div>
    );
  }

  return (
    <div style={wrap}>
      <Header subtitle="🕵️ Пульт детектива · Живая игра" />
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Block stripe={C.goldDeep}>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 14.5, color: C.ink, lineHeight: 1.5 }}>
              Глагол скрыт. Задавай вопрос обоим свидетелям и отмечай, кто что ответил — <b>SÍ</b> или <b>NO</b>. Где ответы A и B расходятся — там спрятана ложь.
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 14, fontSize: 13, fontWeight: 700 }}>
              <span style={{ color: C.goldDeep }}>Отвечено: {answeredCount}</span>
              {conflictCount > 0 && <span style={{ color: C.raspberry }}>⚡ Расхождений: {conflictCount}</span>}
            </div>
          </div>
        </Block>

        {CATS.map(cat => {
          const qs = QUESTIONS.filter(q => q.cat === cat.id);
          const catConflicts = qs.reduce((s, q) => { const a = asked[q.id] || {}; return s + (a.A && a.B && a.A !== a.B ? 1 : 0); }, 0);
          const isOpen = open === cat.id;
          return (
            <div key={cat.id} style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.line}`, boxShadow: "0 2px 10px rgba(61,43,31,0.07)", marginBottom: 12, overflow: "hidden" }}>
              <div onClick={() => setOpen(isOpen ? null : cat.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", cursor: "pointer", background: isOpen ? C.goldSoft : "#fff" }}>
                <span style={{ fontSize: 22 }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.goldDeep }}>{cat.es}</div>
                  <div style={{ fontSize: 12, color: C.inkSoft }}>{cat.ru}</div>
                </div>
                {catConflicts > 0 && <span style={{ background: C.raspberry, color: "#fff", borderRadius: 99, padding: "2px 10px", fontSize: 12.5, fontWeight: 700 }}>⚡{catConflicts}</span>}
                <span style={{ fontSize: 18, color: C.gold, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .15s" }}>›</span>
              </div>
              {isOpen && (
                <div style={{ padding: "8px 14px 14px" }}>
                  {qs.map(q => <AnsRow key={q.id} es={q.q} ru={q.ru} st={asked[q.id] || { A: null, B: null }} onSet={(w, val) => setAns(q.id, w, val)} />)}
                </div>
              )}
            </div>
          );
        })}

        <div style={{ background: C.card, borderRadius: 14, border: `1px dashed ${C.gold}`, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.raspberry, marginBottom: 8 }}>✍️ Свой вопрос</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Напиши свой вопрос…" style={{ flex: 1, border: `1.5px solid ${C.line}`, borderRadius: 8, padding: "9px 12px", fontSize: 14.5, fontFamily: SERIF, color: C.ink, outline: "none" }} />
            <button onClick={addCustom} style={{ background: C.gold, color: "#fff", border: "none", borderRadius: 8, padding: "0 16px", fontSize: 20, fontWeight: 700, cursor: "pointer" }}>＋</button>
          </div>
          {custom.map((c, i) => <AnsRow key={i} es={c.text} ru="" st={c} onSet={(w, val) => setCustomAns(i, w, val)} />)}
        </div>

        <Footer onHome={onBack} />
      </div>
    </div>
  );
}

// ===== ПУЛЬТ СВИДЕТЕЛЯ (Канон / Фантазия) =====
function LiveWitness({ mode, onBack }) {
  const [vk, setVk] = useState(null);
  const isCanon = mode === "canon";
  const accent = isCanon ? C.emerald : C.raspberry;
  const v = vk ? verbByKey(vk) : null;

  if (!v) {
    return (
      <div style={wrap}>
        <Header subtitle={isCanon ? "🟢 Свидетель Канон · Живая игра" : "🔴 Свидетель Фантазия · Живая игра"} />
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <Block stripe={accent}>
            <div style={{ padding: "14px 16px", fontSize: 14.5, color: C.ink, lineHeight: 1.5 }}>
              Тебе прислали глагол в личку. <b>Выбери его</b> — откроется твоя шпаргалка{isCanon ? " по правде" : " с твоей легендой"}.
            </div>
          </Block>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {VERBS.map(vv => (
              <button key={vv.key} onClick={() => setVk(vv.key)} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: "14px 8px", cursor: "pointer", fontFamily: SERIF, textAlign: "center", boxShadow: "0 2px 8px rgba(61,43,31,0.06)" }}>
                <div style={{ fontSize: 26 }}>{vv.emoji}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginTop: 4 }}>{vv.inf}</div>
                <div style={{ fontSize: 11.5, color: C.inkSoft }}>{vv.ru}</div>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 16 }}><Footer onHome={onBack} /></div>
        </div>
      </div>
    );
  }

  const ans = isCanon ? v.answers : liveFantAns(v);
  const ver = isCanon ? liveCanonVer(v) : liveFantVer(v);
  return (
    <div style={wrap}>
      <Header subtitle={isCanon ? "🟢 Свидетель Канон · Живая игра" : "🔴 Свидетель Фантазия · Живая игра"} />
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Block stripe={accent}>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 30 }}>{v.emoji}</span>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: accent }}>{v.inf}</div>
                <div style={{ fontSize: 13, color: C.inkSoft }}>{v.ru}</div>
              </div>
            </div>
            <div style={{ marginTop: 12, background: isCanon ? "rgba(45,122,90,0.10)" : "rgba(178,42,75,0.10)", border: `1px solid ${accent}`, borderRadius: 10, padding: "11px 13px" }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: accent, letterSpacing: ".5px", marginBottom: 4 }}>{isCanon ? "🟢 ТВОЯ ПРАВДА — отвечай строго по ней" : "🔴 ТВОЯ ЛЕГЕНДА — держись её до конца"}</div>
              <div style={{ fontSize: 14.5, color: C.ink, lineHeight: 1.45 }}>{ver}</div>
            </div>
          </div>
        </Block>

        {isCanon && (
          <Block stripe={C.gold}>
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C.goldDeep, marginBottom: 6 }}>📖 История (правда)</div>
              <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.5 }}><Highlighted text={v.storyEs} /></div>
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {v.dossier.map((d, i) => (
                  <div key={i} style={{ background: C.cream, border: `1px solid ${C.line}`, borderRadius: 8, padding: "4px 10px", fontSize: 12.5 }}>
                    <span style={{ color: C.inkSoft }}>{d[0]} </span><span style={{ color: C.ink, fontWeight: 600 }}>{d[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </Block>
        )}

        {CATS.map(cat => (
          <Block key={cat.id} stripe={accent}>
            <div style={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{cat.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: accent }}>{cat.es}</span>
                <span style={{ fontSize: 12, color: C.inkSoft }}>· {cat.ru}</span>
              </div>
              {QUESTIONS.filter(q => q.cat === cat.id).map(q => (
                <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.line}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14.5, color: C.ink, fontWeight: 600, lineHeight: 1.3 }}>{q.q}</div>
                    <div style={{ fontSize: 11.5, color: C.inkSoft }}>{q.ru}</div>
                  </div>
                  <BigSiNo v={ans[q.id]} />
                </div>
              ))}
            </div>
          </Block>
        ))}

        {v.trap && (
          <Block stripe={C.raspberry}>
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: C.raspberry, marginBottom: 8 }}>⚡ Вопрос-ловушка (детектив может подловить)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, color: C.ink, fontWeight: 600 }}>{v.trap.q}</div>
                  <div style={{ fontSize: 11.5, color: C.inkSoft }}>{v.trap.ru}</div>
                </div>
                <BigSiNo v={isCanon ? v.trap.canon : v.trap.fant} />
              </div>
            </div>
          </Block>
        )}

        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <button onClick={() => setVk(null)} style={{ background: "none", border: `1.5px solid ${accent}`, color: accent, fontSize: 14, fontWeight: 700, borderRadius: 10, padding: "9px 18px", cursor: "pointer", fontFamily: SERIF }}>← Другой глагол</button>
        </div>
        <Footer onHome={onBack} />
      </div>
    </div>
  );
}

// ===== ОБЁРТКА LIVE: выбор роли =====
function LiveGame({ onHome }) {
  const [r, setR] = useState(null);
  if (r === "detective") return <LiveDetective onBack={() => setR(null)} />;
  if (r === "canon") return <LiveWitness mode="canon" onBack={() => setR(null)} />;
  if (r === "fantasia") return <LiveWitness mode="fantasia" onBack={() => setR(null)} />;

  const roles = [
    { id: "detective", emoji: "🕵️", t: "Детектив", d: "Глагол скрыт. Вопросы по категориям + отметки кому задал.", c: C.goldDeep },
    { id: "canon", emoji: "🟢", t: "Свидетель Канон", d: "Знаешь правду. История, досье и ответы Sí/No по всем вопросам.", c: C.emerald },
    { id: "fantasia", emoji: "🔴", t: "Свидетель Фантазия", d: "Твоя легенда. Ответы Sí/No по версии — держись её до конца.", c: C.raspberry },
  ];
  return (
    <div style={wrap}>
      <Header subtitle="🎮 Живая игра · выбор роли" />
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ textAlign: "center", fontSize: 14.5, color: C.inkSoft, marginBottom: 14, lineHeight: 1.5 }}>
          Открой свою роль — тебе её назвал ведущий. Пульт держит всё перед глазами, ничего не нужно искать.
        </div>
        {roles.map(c => (
          <div key={c.id} onClick={() => setR(c.id)} style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.line}`, boxShadow: "0 2px 10px rgba(61,43,31,0.08)", marginBottom: 14, cursor: "pointer", display: "flex", overflow: "hidden" }}>
            <div style={{ width: 7, background: c.c, flexShrink: 0 }} />
            <div style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 19, fontWeight: 800, color: c.c }}>{c.emoji} {c.t}</div>
              <div style={{ fontSize: 13.5, color: C.inkSoft, marginTop: 4, lineHeight: 1.45 }}>{c.d}</div>
            </div>
          </div>
        ))}
        <Footer onHome={onHome} />
      </div>
    </div>
  );
}

export default function SimuladorJugador() {
  const [entered, setEntered] = useState(false);
  const [role, setRole] = useState(null);
  const [session, setSession] = useState({ detective: 0, canon: 0, fantasia: 0 });

  function addScore(roleKey, pts) {
    if (pts > 0) setSession(s => ({ ...s, [roleKey]: s[roleKey] + pts }));
  }

  if (!entered) return <Welcome onEnter={() => setEntered(true)} onDiario={() => { setRole("diario"); setEntered(true); }} onLive={() => { setRole("live"); setEntered(true); }} />;
  if (role === "live") return <LiveGame onHome={() => { setRole(null); setEntered(false); }} />;
  if (!role) return <RolePicker onPick={setRole} session={session} onBack={() => setEntered(false)} />;
  if (role === "detective") return <DetectiveMode onHome={() => setRole(null)} onScore={p => addScore("detective", p)} session={session} />;
  if (role === "diario") return <DiarioMode onHome={() => setRole(null)} />;
  return <WitnessMode role={role} onHome={() => setRole(null)} onScore={p => addScore(role, p)} session={session} />;
}

// ============================================================
// ВЫБОР РОЛИ
// ============================================================
function RolePicker({ onPick, session, onBack }) {
  const cards = [
    { id: "detective", emoji: "🕵️", t: "Detective", d: "Два свидетеля: один говорит правду, другой лжёт. Задавай вопросы, сравнивай ответы и угадай глагол.", c: C.goldDeep },
    { id: "canon", emoji: "🟢", t: "Testigo Canon", d: "Ты знаешь правду. Отвечай строго по истории, не ошибись.", c: C.emerald },
    { id: "fantasia", emoji: "🔴", t: "Testigo Fantasía", d: "Ты врёшь красиво. Запутай детектива и уведи его от правды.", c: C.raspberry },
    { id: "diario", emoji: "📔", t: "Mi Diario", d: "Твой день в Ciudad. Читай дневник и впиши каждый глагол в правильном лице. Тренировка спряжения.", c: C.emeraldDeep },
  ];
  return (
    <div style={wrap}><div style={maxw}>
      <Header subtitle="Elige tu rol para entrenar" />
      {onBack && <div style={{ textAlign: "center", marginBottom: 12 }}><button onClick={onBack} style={{ background: "none", border: `1.5px solid ${C.gold}`, color: C.goldDeep, fontSize: 13.5, fontWeight: 600, borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontFamily: SERIF }}>📖 Вернуться к истории</button></div>}
      <ScoreBadge session={session} />
      <p style={{ ...pHint, textAlign: "center", marginBottom: 18 }}>Прокачай свою роль перед игрой. Выбери, кем тренируешься сегодня:</p>
      {cards.map((c) => (
        <div key={c.id} onClick={() => onPick(c.id)} style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.line}`, boxShadow: "0 2px 10px rgba(61,43,31,0.08)", marginBottom: 14, cursor: "pointer", display: "flex", overflow: "hidden" }}>
          <div style={{ width: 7, background: c.c, flexShrink: 0 }} />
          <div style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: c.c }}>{c.emoji} {c.t}</div>
            <div style={{ fontSize: 14, color: C.inkSoft, marginTop: 4, lineHeight: 1.5 }}>{c.d}</div>
          </div>
        </div>
      ))}
      <Footer />
    </div></div>
  );
}

// ============================================================
// ДЕТЕКТИВ — подсчёт баллов по числу вопросов
// ============================================================
function DetectiveMode({ onHome, onScore, session }) {
  function freshGame() {
    const verb = VERBS[rnd(VERBS.length)];
    const canonIsA = Math.random() < 0.5;
    return { verb, canonIsA, deck: shuffle(QUESTIONS), idx: 0, log: [], result: null };
  }
  const [g, setG] = useState(freshGame);
  const [guessing, setGuessing] = useState(false);
  const [storyKey, setStoryKey] = useState(null);
  const [askedInCurrent, setAskedInCurrent] = useState(new Set());

  const current = g.deck[g.idx % g.deck.length];
  const canonAns = g.verb.answers[current.id];
  const fantasyAns = verbByKey(g.verb.mask).answers[current.id];
  const ansA = g.canonIsA ? canonAns : fantasyAns;
  const ansB = g.canonIsA ? fantasyAns : canonAns;

  function ask(witness) {
    if (askedInCurrent.has(witness)) return;
    const a = witness === "A" ? ansA : ansB;
    setG(s => ({ ...s, log: [...s.log, { q: current.q, w: witness, a }] }));
    setAskedInCurrent(s => new Set([...s, witness]));
  }
  function nextQ() {
    setG(s => ({ ...s, idx: (s.idx + 1) % s.deck.length }));
    setAskedInCurrent(new Set());
  }

  function guess(k) {
    const ok = k === g.verb.key;
    const qCount = g.log.length;
    let pts = 0;
    if (ok) pts = qCount <= 9 ? 5 : qCount <= 18 ? 3 : 1;
    if (ok) onScore(pts);
    setG((s) => ({ ...s, result: { ok, picked: k, pts, qCount } }));
    setGuessing(false);
  }
  function reset() { setG(freshGame()); setGuessing(false); setStoryKey(null); setAskedInCurrent(new Set()); }

  const story = storyKey ? verbByKey(storyKey) : null;

  return (
    <div style={wrap}><div style={maxw}>
      <Header subtitle="🕵️ Детектив · один свидетель лжёт" />
      <ScoreBadge session={session} />

      {g.result && (
        <Block stripe={g.result.ok ? C.emerald : C.raspberry}>
          <h2 style={{ ...h2, color: g.result.ok ? C.emeraldDeep : C.raspberryDeep }}>
            {g.result.ok ? "🎉 Верно!" : "❌ Почти..."}
          </h2>
          <p style={{ fontSize: 15, margin: "6px 0" }}>
            Глагол был: <strong style={{ color: C.raspberry }}>{g.verb.emoji} {g.verb.inf}</strong> — {g.verb.ru}.
            {!g.result.ok && <> Ты поверил не тому свидетелю. Назвал: <strong>{verbByKey(g.result.picked).inf}</strong> — {verbByKey(g.result.picked).ru}.</>}
          </p>
          {g.result.ok && (
            <div style={{ marginTop: 10, background: C.goldSoft, border: `1px solid ${C.gold}`, borderRadius: 10, padding: "10px 14px", display: "inline-block" }}>
              <span style={{ fontSize: 13, color: C.goldDeep }}>Угадал за {g.result.qCount} вопросов · </span>
              <span style={{ fontSize: 22, fontWeight: 700, color: C.raspberry }}>+{g.result.pts}</span>
              <span style={{ fontSize: 13, color: C.goldDeep }}> {g.result.pts === 5 ? "🔥 Молниеносно!" : g.result.pts === 3 ? "👍 Хорошо!" : "✓ Угадал"}</span>
            </div>
          )}
          <p style={pHint}>Свидетель {g.canonIsA ? "A" : "B"} говорил правду (Канон). Свидетель {g.canonIsA ? "B" : "A"} лгал (Фантазия).</p>
          <Btn bg={C.gold} onClick={reset} style={{ marginTop: 10 }}>🔄 Новый раунд</Btn>
        </Block>
      )}

      <Block stripe={C.emerald}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={h2}>📋 История допроса</h2>
          <span style={{ fontSize: 13, color: C.inkSoft }}>{g.log.length} preguntas</span>
        </div>
        <div style={{ marginTop: 8, maxHeight: 200, overflowY: "auto" }}>
          {g.log.length === 0 && <p style={pHint}>Ещё ни одного вопроса. Задавай — один свидетель лжёт. Сравнивай ответы A и B.</p>}
          {(() => {
            // Группируем по тексту вопроса — чтобы A и B на один вопрос шли рядом
            const groups = [];
            g.log.forEach(e => {
              const last = groups[groups.length - 1];
              if (last && last.q === e.q && !last.entries.find(x => x.w === e.w)) {
                last.entries.push(e);
              } else {
                groups.push({ q: e.q, entries: [e], num: groups.length + 1 });
              }
            });
            return groups.map((grp, i) => (
              <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < groups.length - 1 ? `1px dashed ${C.line}` : "none" }}>
                <div style={{ fontSize: 13.5, color: C.ink, marginBottom: 5 }}>
                  <span style={{ color: C.goldDeep, fontWeight: 700 }}>#{grp.num}</span> {grp.q}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {grp.entries.map((e, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 6, background: C.cream, borderRadius: 8, padding: "4px 10px", border: `1px solid ${C.line}` }}>
                      <span style={{ fontSize: 13, color: "#fff", background: e.w === "A" ? C.goldDeep : C.inkSoft, borderRadius: 6, padding: "1px 8px", fontWeight: 600 }}>
                        {e.w}
                      </span>
                      <SiNo v={e.a} />
                    </div>
                  ))}
                  {grp.entries.length === 2 && grp.entries[0].a !== grp.entries[1].a && (
                    <span style={{ fontSize: 12, color: C.raspberry, fontWeight: 700, alignSelf: "center" }}>⚡ Расходятся!</span>
                  )}
                </div>
              </div>
            ));
          })()}
        </div>
      </Block>

      {!g.result && (
        <>
          <Block stripe={C.goldDeep}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={tag}>{lvlName[current.lvl]}</div>
              <button onClick={nextQ} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "4px 12px", color: C.goldDeep, fontSize: 12.5, cursor: "pointer", fontFamily: SERIF, fontWeight: 600 }}>↻ Пропустить</button>
            </div>
            <div style={{ fontSize: 19, fontWeight: 600, color: C.ink, lineHeight: 1.4, background: C.cream, border: `1px solid ${C.line}`, borderRadius: 12, padding: "16px", margin: "8px 0 6px" }}>{current.q}</div>
            <div style={{ ...pHint, marginBottom: 12 }}>{current.ru}</div>
            <div style={{ fontSize: 13.5, color: C.inkSoft, marginBottom: 8 }}>Кому задать вопрос?</div>
            <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
              <Btn
                bg={askedInCurrent.has("A") ? "#B0A48C" : C.goldDeep}
                onClick={() => ask("A")}
                disabled={askedInCurrent.has("A")}
                style={{ flex: 1 }}
              >
                {askedInCurrent.has("A") ? "✓ A ответил" : "Спросить у A"}
              </Btn>
              <Btn
                bg={askedInCurrent.has("B") ? "#B0A48C" : C.inkSoft}
                onClick={() => ask("B")}
                disabled={askedInCurrent.has("B")}
                style={{ flex: 1 }}
              >
                {askedInCurrent.has("B") ? "✓ B ответил" : "Спросить у B"}
              </Btn>
            </div>
            {askedInCurrent.size > 0 && (
              <Btn bg={C.emerald} onClick={nextQ} style={{ width: "100%", marginTop: 2 }}>
                {askedInCurrent.size === 2 ? "Следующий вопрос →" : "Следующий вопрос (без второго) →"}
              </Btn>
            )}
          </Block>

          <Block stripe={C.raspberry}>
            <h2 style={h2}>Проверь гипотезу</h2>
            <p style={pHint}>Нажми на глагол — прочитай его историю и сравни с ответами свидетелей.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              {VERBS.map((v) => (
                <button key={v.key} onClick={() => setStoryKey(v.key)} style={{ border: `1.5px solid ${storyKey === v.key ? C.raspberry : C.line}`, background: storyKey === v.key ? C.raspberry : C.card, color: storyKey === v.key ? "#fff" : C.ink, borderRadius: 12, padding: "8px 13px", fontSize: 14, fontFamily: SERIF, cursor: "pointer", fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>
                  <div>{v.emoji} {v.inf}</div>
                  <div style={{ fontSize: 11, opacity: 0.75, fontWeight: 400 }}>{v.ru}</div>
                </button>
              ))}
            </div>
            {story && (
              <div style={{ marginTop: 14, background: C.cream, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <strong style={{ fontSize: 15, color: C.raspberry }}>{story.emoji} Historia</strong>
                  <button onClick={() => setStoryKey(null)} style={{ background: "none", border: "none", color: C.inkSoft, fontSize: 18, cursor: "pointer", lineHeight: 1 }}>×</button>
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, margin: 0 }}><Highlighted text={story.storyEs} /></p>
              </div>
            )}

            {/* Подсказка по баллам */}
            <div style={{ marginTop: 12, padding: "8px 12px", background: C.cream, borderRadius: 8, border: `1px dashed ${C.line}` }}>
              <span style={{ fontSize: 12.5, color: C.inkSoft }}>
                Угадаешь за ≤9 вопросов → <strong style={{ color: C.raspberry }}>+5</strong> · за ≤18 → <strong>+3</strong> · позже → <strong>+1</strong>
              </span>
              <span style={{ fontSize: 12.5, color: C.goldDeep, marginLeft: 8 }}>сейчас: {g.log.length} вопр.</span>
            </div>

            <Btn bg={C.raspberry} onClick={() => setGuessing(true)} style={{ marginTop: 14 }}>🔍 Я готов · угадываю</Btn>

            {guessing && (
              <div style={{ marginTop: 14, background: C.card, border: `1.5px solid ${C.raspberry}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 10 }}>Твоя версия — какой это глагол?</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {VERBS.map((v) => (
                    <button key={v.key} onClick={() => guess(v.key)} style={{ border: `1.5px solid ${C.line}`, background: C.card, color: C.ink, borderRadius: 12, padding: "8px 14px", fontSize: 14.5, fontFamily: SERIF, cursor: "pointer", fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>
                      <div>{v.emoji} {v.inf}</div>
                      <div style={{ fontSize: 11, color: C.inkSoft, fontWeight: 400 }}>{v.ru}</div>
                    </button>
                  ))}
                  <button onClick={() => setGuessing(false)} style={{ border: "none", background: "#B0A48C", color: "#fff", borderRadius: 999, padding: "8px 14px", fontSize: 14, fontFamily: SERIF, cursor: "pointer" }}>Отмена</button>
                </div>
              </div>
            )}
          </Block>
        </>
      )}

      <Footer onHome={onHome} />
    </div></div>
  );
}

// ============================================================
// СВИДЕТЕЛЬ — раунд 18 вопросов, система баллов
// ============================================================
function WitnessMode({ role, onHome, onScore, session }) {
  const isCanon = role === "canon";
  const accent = isCanon ? C.emerald : C.raspberry;
  const accentDeep = isCanon ? C.emeraldDeep : C.raspberryDeep;

  const [verb, setVerb] = useState(() => VERBS[rnd(VERBS.length)]);
  const [deck, setDeck] = useState(() => shuffle(QUESTIONS));
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ good: 0, total: 0 });
  const [showStory, setShowStory] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  // Система раундов
  const [roundQ, setRoundQ] = useState(0);       // 0..17 (18 вопросов = 1 раунд)
  const [roundErrors, setRoundErrors] = useState(0); // ошибки в зоне (вопросы 10-18)
  const [roundDone, setRoundDone] = useState(false);
  const [roundPts, setRoundPts] = useState(0);
  const [showZoneBanner, setShowZoneBanner] = useState(false);

  const current = deck[idx % deck.length];
  const canonAns = verb.answers[current.id];
  const isInZone = roundQ >= 9; // вопросы 10-18 (0-based: 9..17)

  function answer(my) {
    const ok = isCanon ? my === canonAns : my !== canonAns;
    const newErrors = isInZone && !ok ? roundErrors + 1 : roundErrors;
    const newRoundQ = roundQ + 1;

    setFeedback({ ok, my, canonAns });
    setScore(s => ({ good: s.good + (ok ? 1 : 0), total: s.total + 1 }));

    if (isInZone) setRoundErrors(newErrors);

    if (newRoundQ >= 18) {
      // Раунд завершён — считаем итог
      const pts = newErrors === 0 ? 5 : newErrors <= 2 ? 3 : newErrors <= 4 ? 1 : 0;
      setRoundPts(pts);
      setRoundDone(true);
      onScore(pts);
    }
  }

  function next() {
    if (roundDone) return;
    setFeedback(null);
    const newIdx = idx + 1;
    if (newIdx % deck.length === 0) { setDeck(shuffle(QUESTIONS)); setIdx(0); }
    else setIdx(newIdx);
    const newRoundQ = roundQ + 1;
    setRoundQ(newRoundQ);
    // Показать баннер при переходе к зоне оценки
    if (newRoundQ === 9) setShowZoneBanner(true);
    else setShowZoneBanner(false);
  }

  function startNextRound() {
    // Новый глагол + сброс раунда
    setVerb(VERBS[rnd(VERBS.length)]);
    setDeck(shuffle(QUESTIONS));
    setIdx(0);
    setFeedback(null);
    setShowStory(false);
    setShowSheet(false);
    setRoundQ(0);
    setRoundErrors(0);
    setRoundDone(false);
    setRoundPts(0);
    setShowZoneBanner(false);
  }

  function newVerb() { startNextRound(); }

  return (
    <div style={wrap}><div style={maxw}>
      <Header subtitle={isCanon ? "🟢 Modo Testigo Canon · di la verdad" : "🔴 Modo Testigo Fantasía · miente con arte"} />
      <ScoreBadge session={session} />

      {/* ИТОГ РАУНДА */}
      {roundDone && (
        <Block stripe={roundPts >= 5 ? C.emerald : roundPts >= 3 ? C.gold : roundPts >= 1 ? C.goldDeep : C.raspberry}>
          <h2 style={{ ...h2, color: roundPts >= 3 ? C.emeraldDeep : roundPts >= 1 ? C.goldDeep : C.raspberryDeep }}>
            {roundPts >= 5 ? "🏆 Безупречно!" : roundPts >= 3 ? "👍 Хорошо!" : roundPts >= 1 ? "✓ Зачтено" : "❌ Попробуй ещё раз"}
          </h2>
          <p style={{ fontSize: 14, margin: "6px 0 10px", color: C.inkSoft }}>
            Ошибок в зоне оценки (вопросы 10–18): <strong style={{ color: C.ink }}>{roundErrors}</strong> из 9
          </p>
          <div style={{ background: roundPts > 0 ? C.goldSoft : C.creamDeep, border: `1px solid ${roundPts > 0 ? C.gold : C.line}`, borderRadius: 10, padding: "10px 14px", display: "inline-block", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: C.goldDeep }}>Глагол {verb.inf} · </span>
            <span style={{ fontSize: 28, fontWeight: 700, color: C.raspberry }}>+{roundPts}</span>
            <span style={{ fontSize: 13, color: C.goldDeep }}> {roundPts === 5 ? "идеально!" : roundPts === 3 ? "хорошая работа" : roundPts === 1 ? "можно лучше" : "без баллов"}</span>
          </div>
          <br />
          <Btn bg={C.emerald} onClick={startNextRound} style={{ marginTop: 4 }}>
            Следующий глагол →
          </Btn>
        </Block>
      )}

      {/* ГЛАГОЛ + ИСТОРИЯ */}
      <Block stripe={accent}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={tag}>Tu verbo</div>
            <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.1, color: C.ink }}>{verb.emoji} {verb.inf}</div>
            <div style={{ color: C.inkSoft, fontSize: 15, fontStyle: "italic" }}>{verb.ru}</div>
          </div>
          {!roundDone && <Btn bg={C.gold} onClick={newVerb} style={{ padding: "8px 12px", fontSize: 13 }}>🔄 Otro</Btn>}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <button onClick={() => setShowStory(s => !s)} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "6px 14px", color: accentDeep, fontSize: 13, cursor: "pointer", fontFamily: SERIF, fontWeight: 600 }}>{showStory ? "▲ Ocultar historia" : "▼ Ver historia"}</button>
          <button onClick={() => setShowSheet(s => !s)} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "6px 14px", color: accentDeep, fontSize: 13, cursor: "pointer", fontFamily: SERIF, fontWeight: 600 }}>{showSheet ? "▲ Ocultar chuleta" : "▼ Ver chuleta (la verdad)"}</button>
        </div>
        {showStory && (
          <div style={{ marginTop: 10, background: C.cream, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14 }}>
            <strong style={{ fontSize: 14, color: accentDeep }}>📖 Historia</strong>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, margin: "8px 0 0" }}><Highlighted text={verb.storyEs} /></p>
          </div>
        )}
        {showSheet && (
          <div style={{ marginTop: 10 }}>
            <div style={{ background: C.raspberry, color: "#fff", borderRadius: 8, padding: "5px 12px", display: "inline-block", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>● CANON — solo esto es verdad</div>
            {verb.dossier.map(([q, a], i) => (
              <div key={i} style={{ display: "flex", padding: "5px 0", borderBottom: i < verb.dossier.length - 1 ? `1px dashed ${C.line}` : "none" }}>
                <div style={{ width: 110, flexShrink: 0, color: C.raspberry, fontWeight: 600, fontSize: 13.5 }}>{q}</div>
                <div style={{ fontSize: 13.5 }}>{a}</div>
              </div>
            ))}
            {!isCanon && <p style={{ ...pHint, marginTop: 8, color: C.raspberryDeep }}>Это правда. Твоя задача — увести детектива в сторону, отвечая иначе на «опознавательные» вопросы.</p>}
          </div>
        )}
      </Block>

      {/* ПРОГРЕСС РАУНДА */}
      {!roundDone && (
        <Block stripe={isInZone ? C.gold : C.line.replace("#E6D6B8", "#C9A24B")}>
          <RoundProgress roundQ={roundQ} roundErrors={roundErrors} />
          {showZoneBanner && (
            <div style={{ background: C.goldSoft, border: `1px solid ${C.gold}`, borderRadius: 8, padding: "9px 12px", marginBottom: 10, fontWeight: 600, fontSize: 13.5, color: C.goldDeep }}>
              ⚡ Зона оценки! Теперь каждая ошибка влияет на баллы — отвечай внимательно.
            </div>
          )}
          <div style={{ fontSize: 12.5, color: C.inkSoft }}>
            {isInZone
              ? `Оцениваемых вопросов: ${roundQ - 9}/9 · ошибок: ${roundErrors}`
              : `Разогрев: ${roundQ}/9 — просто привыкай к глаголу`}
          </div>
        </Block>
      )}

      {/* ВОПРОС */}
      {!roundDone && (
        <Block stripe={C.goldDeep}>
          <h2 style={h2}>El detective pregunta:</h2>
          <div style={tag}>{lvlName[current.lvl]}</div>
          <div style={{ fontSize: 19, fontWeight: 600, color: C.ink, lineHeight: 1.4, background: C.cream, border: `1px solid ${C.line}`, borderRadius: 12, padding: "16px", margin: "8px 0 4px" }}>{current.q}</div>
          <div style={{ ...pHint, marginBottom: 14 }}>{current.ru}</div>
          {!feedback ? (
            <div style={{ display: "flex", gap: 12 }}>
              <Btn bg={C.emerald} onClick={() => answer("sí")} style={{ flex: 1, fontSize: 17, padding: "13px" }}>SÍ</Btn>
              <Btn bg={C.raspberry} onClick={() => answer("no")} style={{ flex: 1, fontSize: 17, padding: "13px" }}>NO</Btn>
            </div>
          ) : (
            <div>
              <div style={{ background: feedback.ok ? C.emerald : C.raspberry, color: "#fff", borderRadius: 10, padding: "12px 14px", fontWeight: 600, fontSize: 15 }}>
                {isCanon
                  ? (feedback.ok ? "✓ ¡Correcto! Respondiste según el canon." : "✗ Cuidado: el canon dice otra cosa.")
                  : (feedback.ok ? "✓ ¡Bien mentido! Alejas al detective de la verdad." : "✗ Dijiste la verdad — el detective se acerca.")}
              </div>
              {!feedback.ok && isInZone && (
                <div style={{ marginTop: 6, fontSize: 12.5, color: C.raspberry, fontWeight: 600 }}>
                  ⚠ Ошибка в зоне оценки — учитывается!
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, fontSize: 14, color: C.inkSoft }}>
                <span>Tú: <SiNo v={feedback.my} /></span>
                <span>· El canon: <SiNo v={feedback.canonAns} /></span>
              </div>
              <Btn bg={C.gold} onClick={next} style={{ marginTop: 14 }}>Siguiente pregunta →</Btn>
            </div>
          )}
        </Block>
      )}

      {/* СЧЁТ СЕССИИ */}
      <Block stripe={C.emerald}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600 }}>{isCanon ? "Respuestas correctas" : "Mentiras logradas"}</span>
          <span style={{ fontWeight: 700, fontSize: 20, color: accentDeep }}>{score.good} / {score.total}</span>
        </div>
        <div style={{ ...pHint, marginTop: 6 }}>
          Шкала баллов: 0 ошибок = <strong>+5</strong> · 1–2 = <strong>+3</strong> · 3–4 = <strong>+1</strong> · 5+ = <strong>0</strong>
        </div>
      </Block>

      <Footer onHome={onHome} />
    </div></div>
  );
}

// ============================================================
// MI DIARIO — текст-дневник с пропусками + тренажёр спряжения
// Умная проверка: принимаем ЛЮБОЙ подходящий по смыслу глагол
// в ПРАВИЛЬНОМ лице. Отличаем ошибку спряжения от ошибки смысла.
// 15 игровых глаголов -AR, все регулярные.
// ============================================================
const VERBS15 = ["desayunar", "tomar", "caminar", "mirar", "buscar", "escuchar", "cantar", "llamar", "hablar", "preparar", "preguntar", "comprar", "trabajar", "estudiar", "llevar"];

const PRON = [
  { key: "yo",       label: "yo",                       end: "o" },
  { key: "tú",       label: "tú",                       end: "as" },
  { key: "él",       label: "él / ella / usted",        end: "a" },
  { key: "nosotros", label: "nosotros / nosotras",      end: "amos" },
  { key: "vosotros", label: "vosotros / vosotras",      end: "áis" },
  { key: "ellos",    label: "ellos / ellas / ustedes",  end: "an" },
];
function conjugate(inf) {
  const stem = inf.slice(0, -2);            // -AR регулярные
  const m = {};
  PRON.forEach((p) => { m[p.key] = stem + p.end; });
  return m;
}
function normES(s) { return (s || "").trim().toLowerCase().replace(/\s+/g, " "); }

const DIARIO = {
  title: "Mi Diario · Una mañana en la Ciudad de los Sentidos",
  segments: [
    { t: "Por la mañana, yo " }, { blank: 0 },
    { t: " en la cocina con mucho gusto. Mi mamá " }, { blank: 1 },
    { t: " despacio y prepara la mesa. Si tú vienes a visitarnos, tú " }, { blank: 2 },
    { t: " la ciudad por la ventana. Después, nosotros " }, { blank: 3 },
    { t: " ingredientes frescos en el mercado de caramelo.\n\nMi papá " }, { blank: 4 },
    { t: " sobre el plan del día, y yo " }, { blank: 5 },
    { t: " un café dorado. Tú " }, { blank: 6 },
    { t: " ideas nuevas para hoy, mientras nosotros " }, { blank: 7 },
    { t: " juntos en la cocina, como una familia feliz.\n\nDe repente, los amigos llegan muy alegres. Ellos " }, { blank: 8 },
    { t: " una canción de trabajo. Vosotros " }, { blank: 9 },
    { t: " con atención y luego vosotros " }, { blank: 10 },
    { t: " también. Al final, todos ellos " }, { blank: 11 },
    { t: " y ríen todo el tiempo." },
  ],
  // person — требуемое лицо; accept — подходящие по смыслу глаголы (любой принимается)
  blanks: [
    { person: "yo",       accept: ["desayunar", "preparar", "trabajar", "cantar"] },
    { person: "él",       accept: ["caminar", "trabajar", "cantar", "hablar"] },
    { person: "tú",       accept: ["mirar", "escuchar"] },
    { person: "nosotros", accept: ["comprar", "buscar", "tomar", "llevar"] },
    { person: "él",       accept: ["hablar", "preguntar"] },
    { person: "yo",       accept: ["tomar", "preparar", "comprar"] },
    { person: "tú",       accept: ["buscar", "preparar", "estudiar"] },
    { person: "nosotros", accept: ["trabajar", "cantar", "desayunar", "preparar"] },
    { person: "ellos",    accept: ["cantar", "escuchar"] },
    { person: "vosotros", accept: ["escuchar", "mirar", "estudiar", "trabajar", "buscar"] },
    { person: "vosotros", accept: ["cantar", "escuchar", "trabajar"] },
    { person: "ellos",    accept: ["hablar", "cantar", "trabajar"] },
  ],
};

// Анализ одного ввода → статус
// ok    — подходящий глагол в правильном лице
// conj  — подходящий глагол, НО не то лицо → на тренажёр (verb)
// sense — реальный глагол из 15, но не подходит сюда по смыслу
// bad   — не распознано
// empty — пусто
function analyzeBlank(input, b) {
  const v = normES(input);
  if (!v) return { st: "empty" };
  const okForms = b.accept.map((k) => conjugate(k)[b.person]);
  if (okForms.includes(v)) return { st: "ok" };
  // верный глагол, неверное лицо?
  for (const k of b.accept) {
    const f = conjugate(k);
    if (Object.values(f).includes(v)) return { st: "conj", verb: k };
  }
  // глагол из 15, не подходящий по смыслу?
  for (const k of VERBS15) {
    const f = conjugate(k);
    if (Object.values(f).includes(v)) return { st: "sense", verb: k };
  }
  return { st: "bad" };
}

// ---- Подсказка: спряжение -AR (сворачивается) ----
function ConjHint() {
  const [open, setOpen] = useState(true);
  const ex = conjugate("hablar");
  return (
    <Block stripe={C.gold}>
      <div onClick={() => setOpen((o) => !o)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
        <span style={{ fontWeight: 700, color: C.ink, fontSize: 15.5 }}>📊 Presente · verbos -AR</span>
        <span style={{ color: C.goldDeep, fontSize: 13 }}>{open ? "ocultar ▲" : "mostrar ▼"}</span>
      </div>
      {open && (
        <div style={{ marginTop: 10 }}>
          <div style={{ ...pHint, marginBottom: 9 }}>Ejemplo: <strong>hablar</strong> (говорить). Tiempo presente · окончания -o, -as, -a, -amos, -áis, -an.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[[0,3],[1,4],[2,5]].flatMap(([a,b]) => [
              <div key={PRON[a].key} style={{ background: C.creamDeep, borderRadius: 8, padding: "8px 10px", fontSize: 14 }}>
                <span style={{ color: C.inkSoft }}>{PRON[a].label.split(" / ")[0]}</span>{" "}
                <strong style={{ color: C.raspberry }}>{ex[PRON[a].key]}</strong>
              </div>,
              <div key={PRON[b].key} style={{ background: C.creamDeep, borderRadius: 8, padding: "8px 10px", fontSize: 14 }}>
                <span style={{ color: C.inkSoft }}>{PRON[b].label.split(" / ")[0]}</span>{" "}
                <strong style={{ color: C.raspberry }}>{ex[PRON[b].key]}</strong>
              </div>
            ])}
          </div>
        </div>
      )}
    </Block>
  );
}

// ---- Тренажёр спряжения конкретного глагола ----
function ConjTrainer({ startVerb, errorVerbs = [], onBack }) {
  const [verb, setVerb] = useState(startVerb || errorVerbs[0] || VERBS15[0]);
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const correct = conjugate(verb);
  const allOk = PRON.every((p) => normES(vals[p.key]) === correct[p.key]);

  function pick(k) { setVerb(k); setVals({}); setChecked(false); }

  return (
    <div style={wrap}><div style={maxw}>
      <Header subtitle="📊 Entrenador de conjugación" />
      <div style={{ ...pHint, textAlign: "center", marginBottom: 12 }}>Заполни все 6 форм глагола. Так ты увидишь, как он спрягается, и вернёшься к тексту.</div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14, justifyContent: "center" }}>
        {VERBS15.map((k) => {
          const isErr = errorVerbs.includes(k);
          const active = k === verb;
          return (
            <button key={k} onClick={() => pick(k)} style={{
              border: `1.5px solid ${active ? C.raspberry : isErr ? C.raspberry : C.line}`,
              background: active ? C.raspberry : isErr ? "#FBEAEE" : C.card,
              color: active ? "#fff" : isErr ? C.raspberryDeep : C.inkSoft,
              borderRadius: 20, padding: "6px 13px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: SERIF,
            }}>{isErr && !active ? "⚠ " : ""}{k}</button>
          );
        })}
      </div>

      <Block stripe={C.raspberry}>
        <div style={{ fontWeight: 700, fontSize: 19, color: C.ink }}>{verb} <span style={{ color: C.inkSoft, fontWeight: 400, fontSize: 14 }}>· presente</span></div>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {PRON.map((p) => {
            const ok = checked && normES(vals[p.key]) === correct[p.key];
            const bad = checked && normES(vals[p.key]) !== correct[p.key];
            return (
              <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 150, fontSize: 13, color: C.inkSoft, flexShrink: 0 }}>{p.label}</span>
                <input value={vals[p.key] || ""} onChange={(e) => setVals((v) => ({ ...v, [p.key]: e.target.value }))}
                  placeholder="…" style={{
                    flex: 1, minWidth: 0, padding: "9px 11px", borderRadius: 8, fontSize: 15, fontFamily: SERIF,
                    border: `2px solid ${ok ? C.emerald : bad ? C.raspberry : C.line}`,
                    background: ok ? "#EAF5F0" : bad ? "#FBEAEE" : "#fff", color: C.ink, outline: "none",
                  }} />
                {checked && bad && <span style={{ color: C.emeraldDeep, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{correct[p.key]}</span>}
              </div>
            );
          })}
        </div>
        {!checked && <Btn bg={C.gold} onClick={() => setChecked(true)} style={{ marginTop: 14, width: "100%" }}>Comprobar</Btn>}
        {checked && !allOk && <Btn bg={C.raspberry} onClick={() => setChecked(false)} style={{ marginTop: 14, width: "100%" }}>Intentar de nuevo</Btn>}
        {checked && allOk && <div style={{ marginTop: 14, textAlign: "center", color: C.emeraldDeep, fontWeight: 700 }}>¡Perfecto! 🎉 Ya conoces este verbo.</div>}
      </Block>

      <Btn bg={C.emerald} onClick={onBack} style={{ width: "100%" }}>← Volver al diario</Btn>
      <Footer />
    </div></div>
  );
}

// ---- Основной режим: Mi Diario ----
function DiarioMode({ onHome }) {
  const N = DIARIO.blanks.length;
  const [vals, setVals] = useState({});
  const [res, setRes] = useState({});          // i -> {st, verb?}
  const [everFailed, setEverFailed] = useState({});
  const [checked, setChecked] = useState(false);
  const [trainer, setTrainer] = useState(null);

  const allOk = checked && DIARIO.blanks.every((_, i) => res[i] && res[i].st === "ok");
  const filledAll = DIARIO.blanks.every((_, i) => normES(vals[i]) !== "");
  // на тренажёр идут только ошибки спряжения (conj)
  const errorVerbs = [...new Set(Object.values(res).filter((r) => r.st === "conj").map((r) => r.verb))];
  const hasConj = Object.values(res).some((r) => r.st === "conj");
  const hasSense = Object.values(res).some((r) => r.st === "sense");
  const hasBad = Object.values(res).some((r) => r.st === "bad");

  function check() {
    const r = {}; const ef = { ...everFailed };
    DIARIO.blanks.forEach((b, i) => {
      const a = analyzeBlank(vals[i], b);
      r[i] = a;
      if (a.st !== "ok") ef[i] = true;
    });
    setRes(r); setEverFailed(ef); setChecked(true);
  }

  if (trainer) {
    return <ConjTrainer startVerb={trainer.startVerb} errorVerbs={errorVerbs} onBack={() => { setTrainer(null); setChecked(false); }} />;
  }

  let scoreBlock = null;
  if (allOk) {
    const corrected = DIARIO.blanks.filter((_, i) => everFailed[i]).length;
    const first = N - corrected;
    const score10 = Math.round(((first + 0.5 * corrected) / N) * 10);
    scoreBlock = (
      <Block stripe={C.emerald}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.emeraldDeep }}>¡Diario completo! 🎉</div>
          <div style={{ fontSize: 44, fontWeight: 800, color: C.raspberry, margin: "6px 0", fontFamily: SERIF }}>{score10}<span style={{ fontSize: 22, color: C.inkSoft }}>/10</span></div>
          <div style={{ ...pHint }}>С первого раза: <strong>{first}</strong> из {N} · Исправлено: <strong>{corrected}</strong></div>
        </div>
      </Block>
    );
  }

  // цвета по статусу
  function blankStyle(st) {
    if (st === "ok") return { bd: C.emerald, bg: "#EAF5F0", col: C.emeraldDeep };
    if (st === "conj") return { bd: C.raspberry, bg: "#FBEAEE", col: C.raspberryDeep };       // спряжение → красный
    if (st === "sense") return { bd: "#D98A2B", bg: "#FCF1E0", col: "#A85F12" };              // смысл → оранжевый
    if (st === "bad") return { bd: "#3B7CB8", bg: "#E8F1F9", col: "#2C5F8A" };
    return { bd: C.gold, bg: "#fff", col: C.ink };
  }

  return (
    <div style={wrap}><div style={maxw}>
      <Header subtitle="📔 Mi Diario · escribe los verbos" />

      <ConjHint />

      <Block stripe={C.emerald}>
        <div style={{ fontWeight: 700, color: C.ink, fontSize: 15.5, marginBottom: 4 }}>📔 {DIARIO.title}</div>
        <div style={pHint}>Это твой день в Ciudad. Впиши каждый глагол в правильном лице. Текст в настоящем времени (<strong>presente</strong>). Подходящих глаголов может быть несколько — выбирай любой по смыслу, главное — верное лицо. Подсказка со спряжением — сверху.</div>
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.line}` }}>
          <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 5, fontWeight: 600 }}>Verbos disponibles · выбирай из этих 15:</div>
          <div style={{ fontSize: 13, color: C.raspberry, lineHeight: 1.7, fontWeight: 600 }}>{VERBS15.join(" · ")}</div>
        </div>
      </Block>

      <Block stripe={C.gold}>
        <div style={{ fontSize: 17, lineHeight: 2.1, color: C.ink }}>
          {DIARIO.segments.map((seg, idx) => {
            if (seg.t !== undefined) {
              return seg.t.split("\n\n").map((para, pi, arr) => (
                <span key={idx + "_" + pi}>{para}{pi < arr.length - 1 ? <span style={{ display: "block", height: 10 }} /> : null}</span>
              ));
            }
            const i = seg.blank;
            const st = res[i] ? res[i].st : undefined;
            const locked = st === "ok";
            const s = blankStyle(st);
            return (
              <input key={"b" + i} value={vals[i] || ""} disabled={locked}
                onChange={(e) => setVals((v) => ({ ...v, [i]: e.target.value }))}
                placeholder="…"
                style={{
                  width: 120, margin: "0 2px", padding: "3px 8px", fontSize: 16, fontFamily: SERIF, textAlign: "center",
                  borderRadius: 7, outline: "none", verticalAlign: "middle",
                  border: `2px solid ${s.bd}`, background: s.bg, color: s.col, fontWeight: st && st !== "empty" ? 700 : 400,
                }} />
            );
          })}
        </div>
      </Block>

      {/* статус ошибок — без показа правильного ответа */}
      {checked && !allOk && (
        <Block stripe={C.raspberry}>
          {hasConj && <div style={{ marginBottom: hasSense || hasBad ? 8 : 0 }}>
            <div style={{ fontWeight: 700, color: C.raspberryDeep }}>🔴 Ошибка спряжения</div>
            <div style={{ ...pHint, marginTop: 2 }}>Глагол подходит, но лицо неверное. Иди в тренажёр внизу, отработай — и вернись исправить.</div>
          </div>}
          {hasSense && <div style={{ marginBottom: hasBad ? 8 : 0 }}>
            <div style={{ fontWeight: 700, color: "#A85F12" }}>🟠 Не по смыслу</div>
            <div style={{ ...pHint, marginTop: 2 }}>Глагол спрягается верно, но в это место не подходит. Перечитай фразу и выбери другой.</div>
          </div>}
          {hasBad && <div>
            <div style={{ fontWeight: 700, color: "#2C5F8A" }}>🔵 Незнакомое слово</div>
            <div style={{ ...pHint, marginTop: 2 }}>Это не один из 15 глаголов или есть опечатка. Посмотри список глаголов сверху и проверь написание.</div>
          </div>}
        </Block>
      )}

      {!allOk && (
        <Btn bg={filledAll ? C.gold : "#D8CBB4"} disabled={!filledAll} onClick={check} style={{ width: "100%", marginBottom: 12 }}>
          {filledAll ? "Comprobar el diario" : "Rellena todos los huecos…"}
        </Btn>
      )}

      {scoreBlock}

      <Btn bg={C.raspberry} onClick={() => setTrainer({ startVerb: errorVerbs[0] || null })} style={{ width: "100%", marginBottom: 14 }}>
        📊 Entrenador de conjugación{errorVerbs.length ? ` · ${errorVerbs.length} con errores` : ""}
      </Btn>

      <Footer onHome={onHome} />
    </div></div>
  );
}

// ============================================================
// BIENVENIDA — вход в приложение: правила + История-маяк (15 -AR глаголов)
// ============================================================
const MAYA = {
  // 15 глаголов выделены **...** — подсвечиваются через <Highlighted/>
  es: [
    "Cuando en la Ciudad de los Sentidos llega la mañana, en el Palacio de Caramelo se enciende la luz dorada. El Gran Jefe Alcalde abre los ojos y comienza su día mágico.",
    "Primero, él debe **desayunar**. Se sienta en su silla favorita y **toma** una taza de café solo fuerte con caramelo espeso y dorado. Luego se levanta y comienza a **caminar** por los pasillos brillantes del palacio.",
    "El Jefe se detiene en la terraza para **mirar** atentamente la ciudad que despierta. Necesita **buscar** ideas frescas para el menú de hoy. De repente, **escucha** voces alegres — sus ayudantes ya **cantan** una canción de trabajo en la cocina.",
    "El Jefe decide **llamar** a su fiel equipo. Él está acostumbrado a **hablar** mucho y dar órdenes claras. «¡Buenos días, amigos! Hoy vamos a **preparar** algo especial», dice con una sonrisa.",
    "Los ayudantes **preguntan**: «¿Qué necesitamos hoy, Jefe?» Él responde: «Primero, debemos **comprar** ingredientes frescos en el mercado de caramelo. Luego vamos a **trabajar** juntos».",
    "Pero antes de salir, el Jefe **estudia** su libro antiguo de recetas mágicas. Él **lleva** el libro consigo siempre — es su tesoro más valioso. Ahora es momento de crear nuevas palabras dulces y brillantes.",
  ],
  ru: [
    "Когда в Городе Чувств наступает утро, в Карамельном Дворце зажигается золотой свет. Великий Шеф-Мэр открывает глаза и начинает свой волшебный день.",
    "Сначала он должен позавтракать. Он садится на свой любимый стул и берёт чашку крепкого чёрного кофе с густой золотистой карамелью. Затем встаёт и начинает идти по сверкающим коридорам дворца.",
    "Шеф останавливается на террасе, чтобы внимательно смотреть на просыпающийся город. Ему нужно искать свежие идеи для меню. Вдруг он слышит весёлые голоса — помощники уже поют рабочую песню на кухне.",
    "Шеф решает позвать свою верную команду. Он привык много говорить и раздавать чёткие приказы. «Доброе утро, друзья! Сегодня мы будем готовить что-то особенное», — говорит он с улыбкой.",
    "Помощники спрашивают: «Что нам нужно сегодня, Шеф?» Он отвечает: «Сначала мы должны купить свежие ингредиенты на карамельном рынке. Потом будем работать вместе».",
    "Но перед выходом Шеф изучает свою древнюю книгу волшебных рецептов. Он всегда носит эту книгу с собой — это его самое ценное сокровище. Теперь пора создавать новые сладкие и сверкающие слова.",
  ],
  // 15 игровых глаголов: инфинитив + перевод
  glos: [
    ["desayunar", "завтракать"], ["tomar", "брать / пить"], ["caminar", "идти / гулять"],
    ["mirar", "смотреть"], ["buscar", "искать"], ["escuchar", "слушать"],
    ["cantar", "петь"], ["llamar", "звать / звонить"], ["hablar", "говорить"],
    ["preparar", "готовить"], ["preguntar", "спрашивать"], ["comprar", "покупать"],
    ["trabajar", "работать"], ["estudiar", "изучать"], ["llevar", "носить с собой"],
  ],
};

function Welcome({ onEnter, onDiario, onLive }) {
  const [ru, setRu] = useState(false);
  return (
    <div style={wrap}><div style={maxw}>
      <Header subtitle="Bienvenido · добро пожаловать" />

      {/* Правила игры — по-русски */}
      <Block stripe={C.raspberry}>
        <div style={{ fontWeight: 700, color: C.ink, fontSize: 16, marginBottom: 6 }}>🕵️ La Cata a Ciegas — лингвистический детектив</div>
        <div style={{ ...pHint, fontSize: 13.5 }}>
          В каждом раунде загадан один глагол. Два свидетеля знают правду: один говорит честно (<strong style={{ color: C.emerald }}>Canon</strong>), другой красиво выдумывает (<strong style={{ color: C.raspberry }}>Fantasía</strong>). Детективы задают вопросы «да / нет» и по ответам угадывают глагол. Все глаголы спрятаны в этой истории — прочитай её и познакомься с героями игры.
        </div>
      </Block>

      {/* История-маяк */}
      <Block stripe={C.gold}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontWeight: 700, color: C.ink, fontSize: 16 }}>🗼 El día en el Palacio de Caramelo</span>
          <button onClick={() => setRu((v) => !v)} style={{ background: ru ? C.gold : C.goldSoft, border: `1.5px solid ${C.gold}`, color: ru ? "#fff" : C.goldDeep, borderRadius: 18, padding: "5px 13px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: SERIF }}>
            {ru ? "ES ✓" : "RU перевод"}
          </button>
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.85, color: C.ink }}>
          {MAYA.es.map((p, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div><Highlighted text={p} /></div>
              {ru && <div style={{ fontSize: 13.5, color: C.inkSoft, fontStyle: "italic", marginTop: 4, lineHeight: 1.6 }}>{MAYA.ru[i]}</div>}
            </div>
          ))}
        </div>
      </Block>

      {/* Глоссарий 15 глаголов */}
      <Block stripe={C.emerald}>
        <div style={{ fontWeight: 700, color: C.ink, fontSize: 15.5, marginBottom: 8 }}>📖 Los 15 verbos · todos terminan en -AR</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {MAYA.glos.map(([v, r]) => (
            <div key={v} style={{ background: C.creamDeep, borderRadius: 8, padding: "7px 10px", fontSize: 13.5 }}>
              <strong style={{ color: C.raspberry }}>{v}</strong> <span style={{ color: C.inkSoft }}>— {r}</span>
            </div>
          ))}
        </div>
      </Block>

      {/* Переходы */}
      <Btn bg={C.gold} onClick={onEnter} style={{ width: "100%", fontSize: 16, padding: "14px", marginBottom: 10 }}>Empezar · выбрать роль →</Btn>
      <Btn bg={C.emeraldDeep} onClick={onDiario} style={{ width: "100%", fontSize: 16, padding: "14px", marginBottom: 10 }}>📔 Mi Diario · тренировать спряжение</Btn>
      <Btn bg={C.raspberry} onClick={onLive} style={{ width: "100%", fontSize: 16, padding: "14px" }}>🎮 Живая игра · пульт для Zoom-сессии</Btn>

      <div style={{ fontSize: 12, color: C.goldDeep, marginTop: 18, textAlign: "center" }}>La Ciudad de los Sentidos 🍬</div>
    </div></div>
  );
}

