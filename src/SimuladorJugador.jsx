import { useState, useEffect, useRef } from "react";
// v2.9 — история допроса над вопросом (новые ответы сверху)
// v2.33 — Этап 3 Шаг 2: мост playerId↔tgId — Live Game берёт tgId/имя из Telegram (getTg) и передаёт в join

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
    storyEs: "Cada mañana, antes de que el Palacio de Caramelo despierte, el Gran Jefe Alcalde **desayuna** solo en su terraza favorita. Hoy **desayuna** con una taza de café negro y una torre de tostadas con caramelo dorado. Mientras **desayuna**, mira la ciudad que lentamente abre los ojos. Desayuna en diez minutos exactos, y después siempre llega una idea nueva.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Dónde?", "En su terraza favorita"], ["¿Cuándo?", "Cada mañana, 10 minutos"], ["¿Con quién?", "Solo"], ["¿Qué?", "Café negro y tostadas con caramelo"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"no", n14:"sí", n15:"sí", n16:"sí", n21:"sí", n22:"no", n23:"no", n24:"no", n25:"no", n26:"no", n27:"no", n28:"no", n29:"sí", n31:"sí", n32:"no", n33:"sí", n34:"sí", n35:"sí" },
    mask: "preparar",
    fantVer: "El Jefe desayuna dentro del palacio, por la tarde, junto con los ayudantes, en el salón principal. Sopa y pan. Solo los viernes.",
    fantAns: { n11:"sí", m1:"no", n12:"sí", n13:"sí", n14:"no", n15:"no", n16:"no", n21:"sí", n22:"sí", n23:"sí", n24:"sí", n25:"no", n26:"sí", n27:"no", n28:"sí", n29:"sí", n31:"no", n32:"no", n33:"no", n34:"sí", n35:"no" },
    trap: { q: "¿Está solo durante esto?", ru: "Он один во время этого?", canon: "sí", fant: "no" },
  },
  {
    key: "caminar", emoji: "🚶", inf: "caminar", ru: "идти / гулять",
    storyEs: "Después del desayuno, el Gran Jefe Alcalde **camina** por los pasillos del Palacio de Caramelo. Él **camina** despacio, con las manos detrás de la espalda. El Jefe **camina** cada mañana exactamente veinte minutos. Mientras **camina**, encuentra una idea nueva.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Dónde?", "Por los pasillos del palacio"], ["¿Cuándo?", "Cada mañana, 20 minutos"], ["¿Con quién?", "Solo"], ["¿Cómo?", "Despacio, manos en la espalda"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"no", n24:"no", n25:"sí", n26:"no", n27:"no", n28:"no", n29:"sí", n31:"no", n32:"no", n33:"no", n34:"no", n35:"sí" },
    mask: "trabajar",
    fantVer: "El Jefe camina fuera del palacio, por la tarde, junto con los ayudantes — por el jardín, hablando mientras andan, 5 minutos.",
    fantAns: { n11:"sí", m1:"no", n12:"sí", n13:"no", n14:"sí", n15:"no", n16:"no", n21:"no", n22:"no", n23:"no", n24:"sí", n25:"sí", n26:"no", n27:"no", n28:"sí", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"no" },
    trap: { q: "¿Camina en silencio?", ru: "Идёт в тишине?", canon: "sí", fant: "no" },
  },
  {
    key: "cantar", emoji: "🎵", inf: "cantar", ru: "петь",
    storyEs: "Cada mañana, a las siete en punto, los tres ayudantes del Jefe se reúnen en la Cocina Mágica. Ellos siempre **cantan** juntos una canción de trabajo. Mientras **cantan**, el caramelo en las ollas comienza a brillar más fuerte. El Jefe escucha desde su despacho y sonríe. La canción dura solo cinco minutos.",
    dossier: [["¿Quién?", "Los tres ayudantes"], ["¿Dónde?", "En la Cocina Mágica"], ["¿Cuándo?", "Cada mañana, a las 7, 5 minutos"], ["¿Con quién?", "Los tres juntos"], ["¿Qué?", "La melodía del caramelo dorado"]],
    answers: { n11:"no", m1:"no", n12:"sí", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"no", n24:"sí", n25:"no", n26:"no", n27:"no", n28:"sí", n29:"no", n31:"sí", n32:"sí", n33:"no", n34:"no", n35:"no" },
    mask: "hablar",
  },
  {
    key: "mirar", emoji: "👁", inf: "mirar", ru: "смотреть",
    storyEs: "Desde la terraza del Palacio, el Gran Jefe Alcalde **mira** la ciudad cada mañana. Él **mira** con calma, sin prisa. Hoy **mira** las nubes, **mira** los ayudantes que caminan por el mercado, **mira** el río de caramelo. Cuando **mira** así, en silencio, entiende todo lo que necesita. Mira durante diez minutos exactos.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Dónde?", "Desde la terraza"], ["¿Cuándo?", "Cada mañana, 10 minutos"], ["¿Con quién?", "Solo, en silencio"], ["¿Qué?", "Las nubes, el río de caramelo"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"no", n14:"sí", n15:"sí", n16:"sí", n21:"no", n22:"sí", n23:"no", n24:"no", n25:"no", n26:"no", n27:"no", n28:"no", n29:"no", n31:"sí", n32:"no", n33:"sí", n34:"no", n35:"sí" },
    mask: "escuchar",
    fantVer: "El Jefe se mira en el espejo dentro del palacio, por la tarde, junto con los ayudantes — en la sala de los espejos. Lo comentan. Solo los sábados.",
    fantAns: { n11:"sí", m1:"no", n12:"sí", n13:"sí", n14:"no", n15:"no", n16:"no", n21:"no", n22:"sí", n23:"no", n24:"sí", n25:"no", n26:"no", n27:"no", n28:"sí", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"no" },
    trap: { q: "¿Está solo durante esto?", ru: "Он один во время этого?", canon: "sí", fant: "no" },
  },
  {
    key: "buscar", emoji: "🔍", inf: "buscar", ru: "искать",
    storyEs: "Cada mañana, después de mirar la ciudad, el Jefe **busca** ideas nuevas para el menú. Él **busca** en su libro de recetas. Hoy **busca** un ingrediente especial — algo que nunca ha usado. **Busca** en los armarios dorados, **busca** en las cajas secretas del sótano. Busca durante diez minutos, y al final lo encuentra.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué?", "Un ingrediente especial nuevo"], ["¿Dónde?", "Armarios, cajas del sótano"], ["¿Cuándo?", "Cada mañana, 10 minutos"], ["¿Con quién?", "Solo"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"sí", n22:"sí", n23:"no", n24:"no", n25:"no", n26:"no", n27:"no", n28:"no", n29:"sí", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"sí" },
    mask: "comprar",
    fantVer: "El Jefe busca fuera del palacio, de noche, junto con un ayudante — en el jardín, con un farol en la mano. Susurran.",
    fantAns: { n11:"sí", m1:"no", n12:"sí", n13:"no", n14:"sí", n15:"no", n16:"no", n21:"sí", n22:"sí", n23:"no", n24:"sí", n25:"sí", n26:"sí", n27:"no", n28:"sí", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"no" },
    trap: { q: "¿Busca dentro del palacio?", ru: "Ищет внутри дворца?", canon: "sí", fant: "no" },
  },
  {
    key: "escuchar", emoji: "🎧", inf: "escuchar", ru: "слушать",
    storyEs: "Cada mañana, después de buscar ideas, el Jefe **escucha** los sonidos del Palacio. Se sienta en su sillón, cierra los ojos y **escucha** en silencio absoluto. Hoy **escucha** el caramelo que burbujea, el viento, los pasos de los ayudantes. **Escucha** durante diez minutos exactos.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Dónde?", "En su sillón favorito"], ["¿Cuándo?", "Cada mañana, 10 minutos"], ["¿Con quién?", "Solo, en silencio absoluto"], ["¿Qué?", "El caramelo, el viento, los pasos"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"sí", n24:"no", n25:"no", n26:"no", n27:"no", n28:"no", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"sí" },
    mask: "mirar",
    fantVer: "El Jefe escucha música en vivo fuera del palacio, por la tarde, junto con los ayudantes — en el jardín, 30 minutos.",
    fantAns: { n11:"sí", m1:"no", n12:"sí", n13:"no", n14:"sí", n15:"no", n16:"no", n21:"no", n22:"no", n23:"sí", n24:"no", n25:"no", n26:"no", n27:"no", n28:"sí", n29:"no", n31:"no", n32:"no", n33:"no", n34:"no", n35:"no" },
    trap: { q: "¿Está solo?", ru: "Он один?", canon: "sí", fant: "no" },
  },
  {
    key: "hablar", emoji: "🗣", inf: "hablar", ru: "говорить",
    storyEs: "El Gran Jefe Alcalde **habla** mucho. **Habla** con sus ayudantes cada mañana en la gran sala. **Habla** claro y despacio. Hoy **habla** sobre el menú especial del día. **Habla** durante quince minutos sin parar. Sus ayudantes escuchan y toman notas.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Dónde?", "En la gran sala"], ["¿Cuándo?", "Cada mañana, 15 minutos"], ["¿Con quién?", "Con sus ayudantes"], ["¿De qué?", "Del menú especial del día"]],
    answers: { n11:"sí", m1:"no", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"no", n24:"sí", n25:"no", n26:"no", n27:"no", n28:"sí", n29:"no", n31:"no", n32:"no", n33:"no", n34:"no", n35:"no" },
    mask: "cantar",
    fantVer: "El Jefe habla por teléfono — solo, por la tarde, en su despacho, en voz baja, 2 minutos.",
    fantAns: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"no", n16:"no", n21:"sí", n22:"no", n23:"sí", n24:"sí", n25:"no", n26:"sí", n27:"no", n28:"sí", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"no" },
    trap: { q: "¿Hay alguien escuchando?", ru: "Есть ли слушатели рядом?", canon: "sí", fant: "no" },
  },
  {
    key: "preparar", emoji: "👨‍🍳", inf: "preparar", ru: "готовить",
    storyEs: "Después de hablar con sus ayudantes, el Jefe **prepara** el plato especial del día. Hoy **prepara** una tarta de caramelo con pétalos de azúcar dorado. **Prepara** todo con cuidado, con su cucharón de oro y su varilla de cristal. **Prepara** este plato durante una hora exacta.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué?", "Una tarta de caramelo"], ["¿Dónde?", "En la cocina, mesa de mármol"], ["¿Con quién?", "Solo"], ["¿Con qué?", "Cucharón de oro, varilla de cristal"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"sí", n22:"sí", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"no", n29:"no", n31:"no", n32:"sí", n33:"no", n34:"no", n35:"sí" },
    mask: "desayunar",
    fantVer: "El Jefe prepara fuera del palacio, por la tarde, junto con los ayudantes — en el jardín. Canta mientras lo hace. 30 minutos.",
    fantAns: { n11:"sí", m1:"no", n12:"sí", n13:"no", n14:"sí", n15:"no", n16:"no", n21:"sí", n22:"sí", n23:"no", n24:"sí", n25:"no", n26:"sí", n27:"no", n28:"sí", n29:"no", n31:"no", n32:"no", n33:"no", n34:"no", n35:"no" },
    trap: { q: "¿Está solo?", ru: "Он один?", canon: "sí", fant: "no" },
  },
  {
    key: "comprar", emoji: "🛒", inf: "comprar", ru: "покупать",
    storyEs: "Una vez a la semana, el Jefe va por la mañana al mercado de caramelo a **comprar** ingredientes frescos. **Compra** siempre lo mismo: caramelo líquido, azúcar dorado y especias mágicas. Hoy **compra** algo nuevo — polvo de caramelo plateado. **Compra** con una lista en la mano, rápido y sin dudar.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Dónde?", "En el mercado de caramelo"], ["¿Cuándo?", "Una vez a la semana, por la mañana"], ["¿Con quién?", "Solo"], ["¿Qué?", "Caramelo, azúcar, especias"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"no", n14:"sí", n15:"sí", n16:"no", n21:"sí", n22:"sí", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"sí", n28:"no", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"no" },
    mask: "buscar",
    fantVer: "El Jefe consigue los productos de un ayudante dentro del palacio, en la despensa — sin dinero, un intercambio interno, cada día.",
    fantAns: { n11:"sí", m1:"no", n12:"sí", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"sí", n22:"no", n23:"no", n24:"no", n25:"no", n26:"no", n27:"no", n28:"no", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"sí" },
    trap: { q: "¿Va al mercado?", ru: "Идёт на рынок?", canon: "sí", fant: "no" },
  },
  {
    key: "trabajar", emoji: "⚙️", inf: "trabajar", ru: "работать",
    storyEs: "En el Palacio de Caramelo, todos **trabajan** juntos. El Jefe **trabaja** desde las siete de la mañana hasta las tres de la tarde. Hoy todos **trabajan** en el gran banquete del viernes. El Jefe **trabaja** en la cocina; los ayudantes **trabajan** en la sala de decoración.",
    dossier: [["¿Quién?", "El Jefe y los ayudantes"], ["¿Dónde?", "Cocina y sala de decoración"], ["¿Cuándo?", "De las 7 a las 3"], ["¿Con quién?", "Todos juntos"], ["¿En qué?", "El banquete del viernes"]],
    answers: { n11:"sí", m1:"no", n12:"sí", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"sí", n22:"no", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"sí", n29:"no", n31:"no", n32:"sí", n33:"no", n34:"no", n35:"no" },
    mask: "caminar",
    fantVer: "Solo el Jefe — sin ayudantes — trabaja fuera del palacio, en el jardín, por la tarde, una hora, en completo silencio.",
    fantAns: { n11:"sí", m1:"sí", n12:"no", n13:"no", n14:"sí", n15:"no", n16:"no", n21:"sí", n22:"sí", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"no", n29:"no", n31:"no", n32:"no", n33:"no", n34:"no", n35:"sí" },
    trap: { q: "¿Trabajan varias personas?", ru: "Работают несколько человек?", canon: "sí", fant: "no" },
  },
  {
    key: "tomar", emoji: "✋", inf: "tomar", ru: "брать / поднимать",
    storyEs: "Cada día, cuando todo está listo en la Cocina Mágica, el Gran Jefe Alcalde **toma** su varilla dorada con las dos manos, despacio, como un ritual. Nadie empieza a trabajar hasta que el Jefe **toma** la varilla. Hoy, como siempre, la **toma** y la levanta hacia la luz dorada.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué?", "Toma la varilla dorada"], ["¿Dónde?", "Mesa central de la Cocina"], ["¿Cuándo?", "Cada día, cuando todo está listo"], ["¿Cómo?", "Con las dos manos, un ritual"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"no", n16:"sí", n21:"sí", n22:"sí", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"no", n29:"no", n31:"sí", n32:"sí", n33:"no", n34:"no", n35:"sí" },
    mask: "llevar",
    canonVer: "Шеф берёт двумя руками золотой венчик на Волшебной Кухне. Каждый день когда всё готово. Торжественный ритуал, тишина, меньше минуты.",
    fantVer: "Un ayudante toma, no la varilla dorada, sino un viejo cucharón de madera. En el sótano del palacio, por la tarde, en secreto, solo, 2 minutos.",
    fantAns: { n11:"no", m1:"sí", n12:"sí", n13:"sí", n14:"no", n15:"no", n16:"no", n21:"sí", n22:"sí", n23:"sí", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"sí", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"sí" },
    trap: { q: "¿Mueve los pies durante esto?", ru: "Двигает ногами?", canon: "no", fant: "sí" },
  },
  {
    key: "llamar", emoji: "📣", inf: "llamar", ru: "звать",
    storyEs: "Al pie de la gran escalera dorada, el Gran Jefe Alcalde **llama** a su equipo con voz fuerte y clara: «¡Es hora de trabajar!» Su voz resuena por todos los corredores. **Llama** una vez, dos veces, siempre con energía. En menos de dos minutos los ayudantes llegan corriendo.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué?", "Llama a su equipo"], ["¿Dónde?", "Al pie de la escalera, corredor"], ["¿Cuándo?", "Cada mañana, tras caminar"], ["¿Cómo?", "En voz muy alta, 1-2 veces"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"no", n24:"sí", n25:"no", n26:"no", n27:"no", n28:"sí", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"no" },
    mask: "hablar",
    canonVer: "Шеф зовёт команду громким голосом у подножия золотой лестницы. Каждое утро после прогулки. Эхо по коридорам. Меньше 2 минут.",
    fantVer: "Un ayudante llama al Jefe — no el Jefe a los ayudantes. En la cocina, por la tarde, en voz baja, un solo ayudante, 1 vez.",
    fantAns: { n11:"no", m1:"sí", n12:"sí", n13:"sí", n14:"no", n15:"no", n16:"no", n21:"no", n22:"no", n23:"sí", n24:"sí", n25:"no", n26:"no", n27:"no", n28:"sí", n29:"no", n31:"sí", n32:"sí", n33:"no", n34:"no", n35:"no" },
    trap: { q: "¿Llama el Jefe?", ru: "Зовёт сам Шеф?", canon: "sí", fant: "no" },
  },
  {
    key: "preguntar", emoji: "❓", inf: "preguntar", ru: "спрашивать",
    storyEs: "Después de escuchar al Jefe, los tres ayudantes **preguntan** con voz clara y respetuosa: «¿Qué necesitamos hoy?» El Jefe responde con paciencia. Cada ayudante **pregunta** algo. Cuando ellos **preguntan**, el trabajo sale perfecto. Las preguntas duran cinco minutos.",
    dossier: [["¿Quién?", "Los tres ayudantes"], ["¿A quién?", "Al Jefe — él responde"], ["¿Dónde?", "En el gran salón"], ["¿Cuándo?", "Tras la charla del Jefe, mañana"], ["¿Cuánto?", "Exactamente 5 minutos"]],
    answers: { n11:"no", m1:"no", n12:"sí", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"sí", n24:"sí", n25:"no", n26:"no", n27:"no", n28:"sí", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"no" },
    mask: "hablar",
    canonVer: "Спрашивают помощники (не Шеф — он отвечает). В большом зале, утром после речи Шефа. Голоса, 5 минут.",
    fantVer: "El Jefe — no los ayudantes — pregunta a un ayudante. Por la tarde, en la cocina, una sola pregunta, en susurros, 1 minuto.",
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
    fantVer: "Los tres ayudantes estudian juntos una receta nueva. En la cocina, por la tarde, 10 minutos, leyendo en voz alta.",
    fantAns: { n11:"no", m1:"no", n12:"sí", n13:"sí", n14:"no", n15:"no", n16:"no", n21:"sí", n22:"sí", n23:"sí", n24:"sí", n25:"no", n26:"sí", n27:"no", n28:"sí", n29:"sí", n31:"sí", n32:"sí", n33:"no", n34:"no", n35:"no" },
    trap: { q: "¿Estudia solo?", ru: "Изучает один?", canon: "sí", fant: "no" },
  },
  {
    key: "llevar", emoji: "🎩", inf: "llevar", ru: "носить (на себе)",
    storyEs: "El Gran Jefe Alcalde siempre **lleva** su gorro de chef blanco y alto. Sin el gorro, el día no empieza. También **lleva** su barba oscura con orgullo — es la firma del Jefe. Lo **lleva** todo el día, en cada salón y corredor. El gorro nunca descansa.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué?", "Gorro blanco + barba"], ["¿Dónde?", "En todos lados, todo el palacio"], ["¿Cuándo?", "Todo el día, cada día"], ["¿Significa?", "Gorro + barba = el Jefe está aquí"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"sí", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"no", n29:"no", n31:"no", n32:"sí", n33:"sí", n34:"no", n35:"no" },
    mask: "tomar",
    canonVer: "Шеф носит на себе высокий белый колпак и тёмную бороду. Везде во дворце, весь день, каждый день. Не берёт в руки — носит как часть образа.",
    fantVer: "Los ayudantes llevan gorros pequeños de color marrón (caramelo) — no blancos. Solo los viernes, no cada día, sin barba.",
    fantAns: { n11:"no", m1:"no", n12:"sí", n13:"sí", n14:"no", n15:"no", n16:"no", n21:"no", n22:"no", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"no", n29:"no", n31:"no", n32:"sí", n33:"no", n34:"no", n35:"no" },
    trap: { q: "¿Es de color blanco?", ru: "Он белого цвета?", canon: "sí", fant: "no" },
  },
];

const verbByKey = (k) => VERBS.find((v) => v.key === k);

/* ============================================================
   CAPÍTULO 2 — Pretérito Perfecto (картридж cap2-perfecto)
   Источники: История-маяк+глаголы + Шпаргалки Свидетелей Гл.2 (Notion).
   Игра 1 (Cap.1, Presente) — выше, НЕ изменена.
   ============================================================ */

const QUESTIONS2 = [
  { id: "q11", lvl: 1, cat: "quien", q: "¿El Jefe lo ha hecho?", ru: "Это сделал Шеф?" },
  { id: "q12", lvl: 1, cat: "quien", q: "¿Lo ha hecho un ayudante?", ru: "Это сделал помощник?" },
  { id: "q13", lvl: 1, cat: "quien", q: "¿Lo han hecho varias personas?", ru: "Это сделали несколько человек?" },
  { id: "q21", lvl: 1, cat: "donde", q: "¿Ha pasado dentro del palacio?", ru: "Произошло внутри дворца?" },
  { id: "q22", lvl: 1, cat: "donde", q: "¿Ha pasado fuera?", ru: "Произошло снаружи?" },
  { id: "q23", lvl: 3, cat: "donde", q: "¿Ha pasado en la Sala?", ru: "Произошло в Зале?" },
  { id: "q24", lvl: 3, cat: "donde", q: "¿Ha pasado en la cocina?", ru: "Произошло на кухне?" },
  { id: "q31", lvl: 1, cat: "cuando", q: "¿Lo ha hecho esta mañana?", ru: "Сделал сегодня утром?" },
  { id: "q32", lvl: 1, cat: "cuando", q: "¿Lo ha hecho esta noche?", ru: "Сделал этой ночью?" },
  { id: "q33", lvl: 3, cat: "cuando", q: "¿Lo ha hecho antes, esta semana?", ru: "Сделал раньше, на этой неделе?" },
  { id: "q34", lvl: 1, cat: "cuando", q: "¿Lo hace siempre, cada día?", ru: "Делает всегда, каждый день?" },
  { id: "q35", lvl: 3, cat: "cuando", q: "¿Ha durado solo un momento?", ru: "Длилось лишь мгновение?" },
  { id: "q41", lvl: 2, cat: "como", q: "¿Ha usado las manos?", ru: "Использовал руки?" },
  { id: "q42", lvl: 2, cat: "como", q: "¿Ha usado las piernas?", ru: "Использовал ноги?" },
  { id: "q43", lvl: 2, cat: "como", q: "¿Ha usado la voz?", ru: "Использовал голос?" },
  { id: "q44", lvl: 2, cat: "como", q: "¿Ha necesitado los oídos?", ru: "Нужны были уши?" },
  { id: "q45", lvl: 2, cat: "como", q: "¿Ha necesitado los ojos?", ru: "Нужны были глаза?" },
  { id: "q46", lvl: 2, cat: "como", q: "¿Ha usado un objeto en las manos?", ru: "Держал предмет в руках?" },
  { id: "q51", lvl: 2, cat: "detalles", q: "¿Ha producido un sonido?", ru: "Это произвело звук?" },
  { id: "q52", lvl: 2, cat: "detalles", q: "¿Ha habido silencio?", ru: "Была тишина?" },
  { id: "q53", lvl: 3, cat: "detalles", q: "¿Todavía no lo ha terminado?", ru: "Ещё не закончил?" },
  { id: "q54", lvl: 3, cat: "detalles", q: "¿Lo ha hecho muchas veces?", ru: "Делал много раз?" },
];

const CATS2 = [
  { id: "quien",    icon: "👤", es: "¿QUIÉN?",        ru: "КТО" },
  { id: "donde",    icon: "📍", es: "¿DÓNDE?",        ru: "ГДЕ" },
  { id: "cuando",   icon: "🕐", es: "¿CUÁNDO?",       ru: "КОГДА" },
  { id: "como",     icon: "✋", es: "¿CÓMO/CON QUÉ?", ru: "КАК / ЧЕМ" },
  { id: "detalles", icon: "🔎", es: "DETALLES",       ru: "ДЕТАЛИ" },
];

// ── helpers для построения наборов ответов Главы 2 (21 вопрос) ──
const Q2_IDS = ["q11","q12","q13","q21","q22","q23","q24","q31","q32","q33","q34","q35","q41","q42","q43","q44","q45","q46","q51","q52","q53","q54"];
const A2 = (yes) => Object.fromEntries(Q2_IDS.map((id) => [id, yes.includes(id) ? "sí" : "no"]));
const A2f = (yes, flips) => { const o = A2(yes); for (const k in flips) o[k] = flips[k]; return o; };

const VERBS2 = [
  {
    key: "encender", emoji: "💡", inf: "encender", ru: "зажигать",
    storyEs: "El primer ayudante **ha encendido** las luces esta mañana, como siempre. Es cosa de un segundo. **Ya ha encendido** todas las lámparas cuando los demás llegan. Nunca ha entrado en la Sala a oscuras.",
    dossier: [["¿Quién?","El primer ayudante"],["¿Qué?","Enciende las luces de la Sala"],["¿Dónde?","Dentro, en la Sala"],["¿Cuándo?","Esta mañana · cada día"],["¿Cómo?","Un segundo · con las manos"]],
    answers: A2(["q12","q21","q23","q31","q34","q35","q41","q52","q54"]),
    fantVer: "Es el Jefe quien ha encendido algo — no un ayudante, no por la mañana sino esta noche, con un objeto en las manos, una sola vez.",
    fantAns: A2f(["q12","q21","q23","q31","q34","q35","q41","q52","q54"], { q11:"sí", q12:"no", q31:"no", q32:"sí", q35:"no", q46:"sí", q54:"no" }),
    trap: { q: "¿Lo ha hecho el Jefe?", ru: "Это сделал Шеф?", canon: "no", fant: "sí" },
  },
  {
    key: "recoger", emoji: "🧹", inf: "recoger", ru: "подбирать",
    storyEs: "La segunda ayudante **ha recogido** los papeles del suelo dos veces hoy. Cada vez le lleva unos cinco minutos. **Nunca ha tocado** los ingredientes — solo recoge lo que se cae. Todavía no ha terminado del todo.",
    dossier: [["¿Quién?","La segunda ayudante"],["¿Qué?","Recoge papeles del suelo"],["¿Dónde?","Dentro, en la Sala"],["¿Cuándo?","Hoy, dos veces"],["¿Clave?","Los ingredientes nunca · 5 min"]],
    answers: A2(["q12","q21","q23","q41","q45","q52","q53","q54"]),
    fantVer: "Lo han hecho varias personas, no en la Sala sino en la cocina, con un objeto, y ya lo han terminado.",
    fantAns: A2f(["q12","q21","q23","q41","q45","q52","q53","q54"], { q13:"sí", q23:"no", q24:"sí", q46:"sí", q53:"no" }),
    trap: { q: "¿Ha recogido los ingredientes?", ru: "Он подобрал ингредиенты?", canon: "no", fant: "sí" },
  },
  {
    key: "llevar", emoji: "🍽️", inf: "llevar", ru: "носить / приносить",
    storyEs: "La segunda ayudante **ha llevado** el desayuno del Jefe esta mañana, como cada día. Del pasillo a la Sala son tres minutos con la bandeja en las manos. **Nunca ha llevado** los ingredientes — eso no es su tarea.",
    dossier: [["¿Quién?","La segunda ayudante"],["¿Qué?","Lleva el desayuno (bandeja)"],["¿Dónde?","Pasillo → Sala"],["¿Cuándo?","Esta mañana · cada día"],["¿Cómo?","3 min · manos · bandeja"]],
    answers: A2(["q12","q21","q23","q31","q34","q41","q42","q46","q52","q54"]),
    fantVer: "No esta mañana sino esta noche, y no cada día — fue algo de una sola vez.",
    fantAns: A2f(["q12","q21","q23","q31","q34","q41","q42","q46","q52","q54"], { q31:"no", q32:"sí", q34:"no", q54:"no" }),
    trap: { q: "¿Lo ha llevado cada día?", ru: "Он носил это каждый день?", canon: "sí", fant: "no" },
  },
  {
    key: "entrar", emoji: "🚪", inf: "entrar", ru: "входить",
    storyEs: "La segunda ayudante **ha entrado** en la Sala dos veces hoy: por la mañana y por la tarde. Cada entrada dura solo un momento. **Esta semana ha entrado muchas veces**, siempre con algo en las manos.",
    dossier: [["¿Quién?","La segunda ayudante"],["¿Qué?","Entra en la Sala"],["¿Dónde?","Puerta de la Sala"],["¿Cuándo?","Hoy · muchas veces esta semana"],["¿Cómo?","Un momento · piernas"]],
    answers: A2(["q12","q21","q23","q31","q33","q35","q42","q46","q52","q54"]),
    fantVer: "No por la mañana sino esta noche, no esta semana, no fue un momento — y todavía no ha terminado.",
    fantAns: A2f(["q12","q21","q23","q31","q33","q35","q42","q46","q52","q54"], { q31:"no", q32:"sí", q33:"no", q35:"no", q53:"sí", q54:"no" }),
    trap: { q: "¿Ha entrado muchas veces esta semana?", ru: "Входил много раз на этой неделе?", canon: "sí", fant: "no" },
  },
  {
    key: "revisar", emoji: "📑", inf: "revisar", ru: "проверять",
    storyEs: "El tercer ayudante **ha revisado** todos los documentos esta semana. Le ha costado varios días — son muchos papeles. Hoy todavía no ha vuelto a la Sala: ha estado con los documentos.",
    dossier: [["¿Quién?","El tercer ayudante"],["¿Qué?","Lee y comprueba documentos"],["¿Dónde?","En el despacho"],["¿Cuándo?","Esta semana · varios días"],["¿Clave?","Solo lee · NO numera · ojos"]],
    answers: A2(["q12","q21","q33","q45","q52","q53"]),
    fantVer: "Fue esta noche, no durante la semana, duró un momento, usó un objeto, y ya lo ha terminado.",
    fantAns: A2f(["q12","q21","q33","q45","q52","q53"], { q32:"sí", q33:"no", q35:"sí", q46:"sí", q53:"no" }),
    trap: { q: "¿Ha usado un lápiz?", ru: "Он пользовался карандашом?", canon: "no", fant: "sí" },
  },
  {
    key: "ordenar", emoji: "🗂️", inf: "ordenar", ru: "упорядочивать",
    storyEs: "Esta semana el tercer ayudante **ha ordenado** los documentos uno por uno y los **ha numerado** del uno al cien con un lápiz rojo. Le ha llevado toda la tarde del lunes. Nunca ha dejado un papel fuera de su sitio.",
    dossier: [["¿Quién?","El tercer ayudante"],["¿Qué?","Ordena y numera documentos"],["¿Dónde?","En el despacho"],["¿Cuándo?","Esta semana · una tarde"],["¿Clave?","Lápiz rojo · numera 1→100"]],
    answers: A2(["q12","q21","q33","q41","q45","q46","q52"]),
    fantVer: "Lo han hecho varias personas, esta noche, en voz alta y con ruido — no en silencio.",
    fantAns: A2f(["q12","q21","q33","q41","q45","q46","q52"], { q13:"sí", q32:"sí", q33:"no", q43:"sí", q51:"sí", q52:"no" }),
    trap: { q: "¿Ha usado un lápiz rojo?", ru: "Он пользовался красным карандашом?", canon: "sí", fant: "no" },
  },
  {
    key: "trabajar", emoji: "⚙️", inf: "trabajar", ru: "работать",
    storyEs: "El tercer ayudante **ha trabajado** en la cocina toda la tarde de hoy. Son muchas horas de pie entre cazos y caramelo. **Hoy no ha vuelto** a la Sala ni una vez — el trabajo no se lo ha permitido.",
    dossier: [["¿Quién?","El tercer ayudante"],["¿Qué?","Trabaja entre cazos y caramelo"],["¿Dónde?","En la cocina"],["¿Cuándo?","Toda la tarde de hoy"],["¿Clave?","Manos+ojos+piernas · hay sonido"]],
    answers: A2(["q12","q21","q24","q41","q42","q45","q46","q51"]),
    fantVer: "Fue en la Sala, no en la cocina, duró un momento, en silencio total, y lo hace muchas veces.",
    fantAns: A2f(["q12","q21","q24","q41","q42","q45","q46","q51"], { q23:"sí", q24:"no", q35:"sí", q51:"no", q52:"sí", q54:"sí" }),
    trap: { q: "¿Ha vuelto a la Sala hoy?", ru: "Он возвращался в Зал сегодня?", canon: "no", fant: "sí" },
  },
  {
    key: "volver", emoji: "🔙", inf: "volver", ru: "возвращаться",
    storyEs: "El tercer ayudante **vuelve** a la Sala cada tarde a las seis, y el camino le lleva dos minutos desde la cocina. Pero **hoy todavía no ha vuelto**: nunca ha pasado un día así. Usa las piernas, no las manos.",
    dossier: [["¿Quién?","El tercer ayudante"],["¿Qué?","Vuelve a la Sala (hábito)"],["¿Dónde?","Cocina → Sala"],["¿Cuándo?","Cada tarde a las seis"],["¿Clave?","Hoy todavía no · piernas · 2 min"]],
    answers: A2(["q12","q21","q23","q24","q34","q35","q42","q52","q53","q54"]),
    fantVer: "No viene de la cocina, fue esta mañana, no es cada día, no fue un momento, y ya lo ha terminado.",
    fantAns: A2f(["q12","q21","q23","q24","q34","q35","q42","q52","q53","q54"], { q24:"no", q31:"sí", q34:"no", q35:"no", q53:"no" }),
    trap: { q: "¿Ha vuelto ya hoy?", ru: "Он уже вернулся сегодня?", canon: "no", fant: "sí" },
  },
  {
    key: "caminar", emoji: "🚶", inf: "caminar", ru: "ходить",
    storyEs: "El Jefe **ha caminado** despacio alrededor de la mesa vacía esta noche. Lo hace siempre que piensa: unos diez minutos dando vueltas. **Esta noche ya ha caminado** mucho, y todavía no tiene la respuesta.",
    dossier: [["¿Quién?","El Jefe"],["¿Qué?","Camina pensando, en círculos"],["¿Dónde?","Dentro · alrededor de la mesa"],["¿Cuándo?","Esta noche · siempre que piensa"],["¿Clave?","Piernas · silencio · 10 min"]],
    answers: A2(["q11","q21","q23","q32","q34","q42","q52"]),
    fantVer: "No el Jefe sino un ayudante, fuera del palacio, no en la Sala, hablando y con ruido — sin silencio.",
    fantAns: A2f(["q11","q21","q23","q32","q34","q42","q52"], { q11:"no", q12:"sí", q22:"sí", q23:"no", q43:"sí", q51:"sí", q52:"no" }),
    trap: { q: "¿Ha hablado mientras lo hacía?", ru: "Он говорил во время этого?", canon: "no", fant: "sí" },
  },
  {
    key: "preguntar", emoji: "❓", inf: "preguntar", ru: "спрашивать",
    storyEs: "Esta noche el Jefe **ha preguntado** dos cosas: quién ha entrado en la Sala y quién ha tocado los ingredientes. Cada pregunta dura un instante. Siempre pregunta en voz baja, y espera la respuesta.",
    dossier: [["¿Quién?","El Jefe"],["¿Qué?","Pregunta al equipo"],["¿Dónde?","Dentro, en la Sala"],["¿Cuándo?","Esta noche · siempre en voz baja"],["¿Clave?","Voz + oídos · espera respuesta"]],
    answers: A2(["q11","q21","q23","q32","q34","q43","q44","q51"]),
    fantVer: "No el Jefe sino un ayudante, duró un momento, no necesitó los oídos y usó un objeto.",
    fantAns: A2f(["q11","q21","q23","q32","q34","q43","q44","q51"], { q11:"no", q12:"sí", q35:"sí", q44:"no", q46:"sí" }),
    trap: { q: "¿Ha esperado una respuesta?", ru: "Он ждал ответа?", canon: "sí", fant: "no" },
  },
  {
    key: "recibir", emoji: "🛎️", inf: "recibir", ru: "принимать",
    storyEs: "El guardia **ha recibido** a las visitas en la puerta principal toda la tarde, como cada día. Hoy **no ha recibido** a nadie de fuera: nadie ha llegado. Vigila la puerta con los ojos, y cada saludo dura un minuto.",
    dossier: [["¿Quién?","El guardia (no ayudante, no Jefe)"],["¿Qué?","Recibe visitas en la puerta"],["¿Dónde?","Puerta principal (dentro)"],["¿Cuándo?","Toda la tarde · cada día"],["¿Clave?","Hoy no ha recibido a nadie · ojos"]],
    answers: A2(["q21","q34","q45","q52","q54"]),
    fantVer: "Fue el Jefe, en la Sala, esta noche, no cada día, usando las manos y sin mirar.",
    fantAns: A2f(["q21","q34","q45","q52","q54"], { q11:"sí", q23:"sí", q32:"sí", q34:"no", q41:"sí", q45:"no" }),
    trap: { q: "¿Ha recibido a alguien hoy?", ru: "Он принял кого-то сегодня?", canon: "no", fant: "sí" },
  },
  {
    key: "recordar", emoji: "💭", inf: "recordar", ru: "вспоминать",
    storyEs: "El ayudante más joven **acaba de recordar** algo importante. Le ha costado toda la noche — la memoria ha vuelto de golpe. Hasta ahora no había dicho nada, porque no estaba seguro.",
    dossier: [["¿Quién?","El ayudante más joven"],["¿Qué?","Recuerda algo importante"],["¿Dónde?","Dentro, en la Sala"],["¿Cuándo?","Acaba de · esta noche"],["¿Clave?","Mente · silencio · no lo dijo antes"]],
    answers: A2(["q12","q21","q23","q32","q52"]),
    fantVer: "Lo han recordado varias personas, fue esta mañana, en voz alta y con ruido — sin silencio.",
    fantAns: A2f(["q12","q21","q23","q32","q52"], { q13:"sí", q31:"sí", q32:"no", q43:"sí", q51:"sí", q52:"no" }),
    trap: { q: "¿Lo ha dicho en voz alta?", ru: "Он сказал это вслух?", canon: "no", fant: "sí" },
  },
  {
    key: "tocar", emoji: "✋", inf: "tocar", ru: "трогать / касаться",
    storyEs: "Esta noche el Jefe **ha tocado** su varilla dorada un momento: la ha cogido para crear, pero la ha dejado enseguida. La toca siempre antes de empezar, es cosa de un segundo. **Nunca ha tocado** los ingredientes con las manos.",
    dossier: [["¿Quién?","El Jefe"],["¿Qué?","Toca la varilla dorada"],["¿Dónde?","Dentro, en la Sala (mesa)"],["¿Cuándo?","Esta noche · siempre antes de empezar"],["¿Clave?","Manos · varilla, NO ingredientes"]],
    answers: A2(["q11","q21","q23","q32","q34","q35","q41","q46","q52"]),
    fantVer: "No el Jefe sino un ayudante, no en la Sala sino en la cocina, no fue un momento, y miró con los ojos.",
    fantAns: A2f(["q11","q21","q23","q32","q34","q35","q41","q46","q52"], { q11:"no", q12:"sí", q23:"no", q24:"sí", q35:"no", q45:"sí" }),
    trap: { q: "¿Ha tocado los ingredientes?", ru: "Он трогал ингредиенты?", canon: "no", fant: "sí" },
  },
  {
    key: "buscar", emoji: "🔦", inf: "buscar", ru: "искать",
    storyEs: "Todos **han buscado** los ingredientes esta noche: en la Sala, en la cocina, en el jardín. Llevan más de una hora buscando. **Todavía no han encontrado** nada. Nunca habían buscado así, con tanto miedo.",
    dossier: [["¿Quién?","Todos juntos"],["¿Qué?","Buscan los ingredientes"],["¿Dónde?","Sala + cocina + jardín (dentro y fuera)"],["¿Cuándo?","Esta noche · más de una hora"],["¿Clave?","Todavía no han encontrado nada"]],
    answers: A2(["q13","q21","q22","q23","q24","q32","q41","q42","q45","q53"]),
    fantVer: "Lo ha buscado el Jefe solo, solo dentro (no en el jardín, no en la cocina), un momento, y ya lo ha encontrado.",
    fantAns: A2f(["q13","q21","q22","q23","q24","q32","q41","q42","q45","q53"], { q11:"sí", q13:"no", q22:"no", q24:"no", q35:"sí", q53:"no" }),
    trap: { q: "¿Ya lo ha encontrado?", ru: "Он уже это нашёл?", canon: "no", fant: "sí" },
  },
  {
    key: "llamar", emoji: "📣", inf: "llamar", ru: "звать",
    storyEs: "Esta noche el Jefe **ha llamado** a su equipo, como hace siempre en los momentos difíciles. Una sola palabra, un segundo, y esta vez todos han acudido enseguida. **Hoy los ha llamado** sin sonreír — algo va mal.",
    dossier: [["¿Quién?","El Jefe"],["¿Qué?","Llama al equipo con una palabra"],["¿Dónde?","Dentro, en la Sala"],["¿Cuándo?","Esta noche · siempre en momentos difíciles"],["¿Clave?","Voz · NO espera respuesta · oídos no"]],
    answers: A2(["q11","q21","q23","q32","q34","q35","q43","q51"]),
    fantVer: "No el Jefe sino un ayudante, fue por la mañana, usando un objeto, y lo ha hecho muchas veces.",
    fantAns: A2f(["q11","q21","q23","q32","q34","q35","q43","q51"], { q11:"no", q12:"sí", q31:"sí", q32:"no", q46:"sí", q54:"sí" }),
    trap: { q: "¿Ha esperado una respuesta?", ru: "Он ждал ответа?", canon: "no", fant: "sí" },
  },
];

const verbByKey2 = (k) => VERBS2.find((v) => v.key === k);

/* ============================================================
   РЕЕСТР ИГР (картриджи). Каждый pack самодостаточен:
   свои глаголы, банк вопросов, категории и резолвер «лжи».
   - cap1: ложь = ответы глагола-маски (verbByKey(mask).answers)
   - cap2: ложь = собственный fantAns глагола
   ============================================================ */
const PACKS = {
  cap1: {
    id: "cap1", num: 1, titulo: "El día en el Palacio de Caramelo",
    grammar: "Presente", emoji: "☀️",
    desc: "Один день Шефа во дворце. 15 глаголов в настоящем времени.",
    VERBS, QUESTIONS, CATS, verbByKey,
    fantAnsOf: (v) => verbByKey(v.mask).answers,
  },
  cap2: {
    id: "cap2", num: 2, titulo: "El Gran Misterio del Palacio de Caramelo",
    grammar: "Pretérito Perfecto", emoji: "🌙",
    desc: "Ночное расследование: пропали ингредиенты. 15 глаголов в Perfecto.",
    VERBS: VERBS2, QUESTIONS: QUESTIONS2, CATS: CATS2, verbByKey: verbByKey2,
    fantAnsOf: (v) => v.fantAns,
  },
};
const DEFAULT_PACK = PACKS.cap1;

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
  function fullReset() {
    if (!window.confirm("Полный сброс: выйдешь из текущей игры и роли, начнёшь с чистого экрана. Очки копилки сохранятся. Продолжить?")) return;
    try { localStorage.removeItem("ciudad_live_v1"); } catch (e) {}
    window.location.replace(window.location.pathname); // чистая перезагрузка без ?query
  }
  return (
    <div style={{ textAlign: "center", marginBottom: 18 }}>
      <button onClick={fullReset} title="Полный сброс сессии" style={{ position: "fixed", top: 8, right: 8, zIndex: 9999, background: "rgba(255,255,255,0.94)", border: `1.5px solid ${C.gold}`, color: C.goldDeep, fontSize: 12, fontWeight: 700, borderRadius: 10, padding: "6px 10px", cursor: "pointer", fontFamily: SERIF, boxShadow: "0 2px 8px rgba(61,43,31,0.14)" }}>🧹 Сброс</button>
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
      <div style={{ fontSize: 12, color: C.goldDeep, marginTop: 14 }}>La Ciudad de los Sentidos 🍬 · v2.33</div>
    </div>
  );
}

// ---- Копилка очков: сохраняется между визитами ----
const SCORE_KEY = "ciudad_score_v1";
function loadScore() {
  try {
    const s = JSON.parse(localStorage.getItem(SCORE_KEY) || "{}");
    return { detective: s.detective || 0, canon: s.canon || 0, fantasia: s.fantasia || 0, diario: s.diario || 0 };
  } catch { return { detective: 0, canon: 0, fantasia: 0, diario: 0 }; }
}
function saveScore(s) { try { localStorage.setItem(SCORE_KEY, JSON.stringify(s)); } catch { /* приватный режим */ } }

// ---- Облачный счёт (Mini App ↔ бот Don Verbo) ----
// Если тренажёр открыт из Telegram, у нас есть tgId человека —
// очки уезжают в общую копилку score:{tgId} (Redis), та же, куда пишет Don Verbo.
// localStorage остаётся мгновенным кэшем; вне Telegram всё работает как раньше.
const CLOUD_SYNC_KEY = "ciudad_cloud_v1"; // флаг: копилка уже переехала в облако
function getTg() {
  try {
    const u = window.Telegram?.WebApp?.initDataUnsafe?.user;
    return u && u.id ? { id: u.id, name: [u.first_name, u.last_name].filter(Boolean).join(" ") } : null;
  } catch { return null; }
}
async function cloudCall(payload) {
  const resp = await fetch("/api/score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const d = await resp.json();
  if (!resp.ok || !d.ok) throw new Error(d.error || "score api error");
  return d.score;
}

// ---- Бейдж копилки ----
function ScoreBadge({ session }) {
  const warmup = session.warmup || 0;
  const total = session.detective + session.canon + session.fantasia + (session.diario || 0) + warmup;
  if (total === 0) return null;
  return (
    <div style={{
      background: C.goldSoft, border: `1px solid ${C.gold}`, borderRadius: 10,
      padding: "9px 14px", marginBottom: 14,
      display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
    }}>
      <span style={{ fontWeight: 700, color: C.goldDeep, fontSize: 13, flexShrink: 0 }}>🏆 Мои очки</span>
      <span style={{ fontSize: 12, color: C.inkSoft }}>
        🕵️ {session.detective} · 🟢 {session.canon} · 🔴 {session.fantasia} · 📔 {session.diario || 0}{warmup > 0 ? ` · 🎩 ${warmup}` : ""}
      </span>
      <span style={{ fontWeight: 700, color: C.raspberry, fontSize: 18, minWidth: 28, textAlign: "right", flexShrink: 0 }}>{total}</span>
    </div>
  );
}

// ---- Всплывающее окно снизу (bottom sheet) ----
function Sheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(61,43,31,0.45)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <style>{"@keyframes ciuSlideUp { from { transform: translateY(40px); opacity: .4; } to { transform: none; opacity: 1; } }"}</style>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.card, borderRadius: "18px 18px 0 0", width: "100%", maxWidth: 560, maxHeight: "78vh", overflowY: "auto", padding: "14px 18px 28px", boxShadow: "0 -8px 30px rgba(61,43,31,.25)", animation: "ciuSlideUp .22s ease both", fontFamily: SERIF, boxSizing: "border-box" }}>
        <div style={{ width: 44, height: 5, borderRadius: 3, background: C.line, margin: "0 auto 12px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8 }}>
          <strong style={{ fontSize: 16.5, color: C.ink }}>{title}</strong>
          <button onClick={onClose} style={{ background: C.creamDeep, border: "none", borderRadius: 99, width: 30, height: 30, color: C.inkSoft, fontSize: 15, cursor: "pointer", lineHeight: 1, flexShrink: 0 }}>✕</button>
        </div>
        {children}
      </div>
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
  return "Finge que el Jefe hace «" + m.inf + "». Responde con seguridad, como si el verbo fuera ese — esa es tu leyenda.";
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
function LiveDetective({ onBack, onLeave, roundN, turn, live }) {
  const [open, setOpen] = useState("quien");
  const [ruledOut, setRuledOut] = useState(new Set()); // отметённые глаголы — личный блокнот, на сервер не идёт
  function toggleRuled(k) {
    setRuledOut((prev) => { const s = new Set(prev); s.has(k) ? s.delete(k) : s.add(k); return s; });
  }
  const [asked, setAsked] = useState({});   // { qid: { A: null|"sí"|"no", B: null|"sí"|"no" } }
  const [custom, setCustom] = useState([]);  // [{text, A, B}]
  const [draft, setDraft] = useState("");
  const [storyView, setStoryView] = useState(null); // key глагола или null
  const [askBusy, setAskBusy] = useState(false);
  const [askErr, setAskErr] = useState("");
  const [ownResult, setOwnResult] = useState(null); // {approved} — итог моего своего вопроса
  const prevOwn = useRef(null);
  // ведущая решила судьбу МОЕГО своего вопроса → показать итог
  useEffect(() => {
    const cur = live ? live.pendingOwn : null;
    const was = prevOwn.current;
    if (was && !cur && live && was.by === live.myId) {
      const verdict = [...live.asked].reverse().find(a => a.own && a.by === live.myId && a.ts >= was.ts);
      if (verdict) {
        setOwnResult({ approved: !!verdict.approved });
        setTimeout(() => setOwnResult(null), 7000);
      }
    }
    prevOwn.current = cur;
  }, [live && live.pendingOwn, live && live.asked.length]);
  async function doAsk(qid, text, target) {
    if (!live || askBusy) return;
    setAskBusy(true); setAskErr("");
    const err = await live.onAsk(qid, text, target);
    if (err) setAskErr(err);
    setAskBusy(false);
  }
  // Игрок-голосом: спросил вслух → одной кнопкой двигает ход. Вопрос считается как обычный
  // (идёт в счётчик/круги), без текста и адреса — что именно спросил, фиксировать не нужно.
  const voiceMode = !!(live && live.mode === "voice");
  async function doAskVoice() {
    if (!live || askBusy) return;
    setAskBusy(true); setAskErr("");
    const err = await live.onAsk(null, "🎙 вопрос голосом", null);
    if (err) setAskErr(err);
    setAskBusy(false);
  }
  async function doOwn() {
    if (!live || askBusy) return;
    setAskBusy(true); setAskErr(""); setOwnResult(null);
    const err = await live.onOwn();
    if (err) setAskErr(err);
    setAskBusy(false);
  }
  // --- Шаг 5: рука и тайный голос ---
  const myElim = !!(live && (live.eliminated || []).includes(live.myId));
  const myHand = !!(live && (live.hands || []).some(h => h.by === live.myId));
  const myVoted = !!(live && (live.votedIds || []).includes(live.myId));
  const guess = live ? live.guess : null;
  const revealed = live ? live.revealed : null;
  const gamePaused = !!(guess || revealed || myElim); // вопросы на паузе
  async function doHand() {
    if (!live || askBusy) return;
    setAskBusy(true); setAskErr("");
    const err = await live.onHand(myHand); // повторное нажатие опускает руку
    if (err) setAskErr(err);
    setAskBusy(false);
  }
  async function doVote(w) {
    if (!live || askBusy) return;
    setAskBusy(true); setAskErr("");
    const err = await live.onVote(w);
    if (err) setAskErr(err);
    setAskBusy(false);
  }

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
  const ansByQ = {};
  if (live && live.answers) {
    for (const k in live.answers) { const ci = k.lastIndexOf(":"); const id = k.slice(0, ci); const w = k.slice(ci + 1); (ansByQ[id] = ansByQ[id] || {})[w] = live.answers[k]; }
  }
  const baseAnswered = live ? Object.values(ansByQ).filter(x => x.A || x.B).length : Object.values(asked).filter(x => x.A || x.B).length;
  const baseConflict = live ? Object.values(ansByQ).filter(x => x.A && x.B && x.A !== x.B).length : Object.values(asked).filter(x => x.A && x.B && x.A !== x.B).length;
  const answeredCount = baseAnswered + custom.filter(c => c.A || c.B).length;
  const conflictCount = baseConflict + custom.filter(c => c.A && c.B && c.A !== c.B).length;

  function AnsRow({ es, ru, st, onSet, qid }) {
    const liveAns = !!(live && qid);
    const ansMap = (live && live.answers) || {};
    const stEff = liveAns ? { A: ansMap[qid + ":A"] || null, B: ansMap[qid + ":B"] || null } : st;
    const conflict = stEff.A && stEff.B && stEff.A !== stEff.B;
    const canAsk = !!(live && qid && turn && turn.mine && !askBusy && !live.pendingOwn && !gamePaused);
    function handleSet(w, val) { if (liveAns) { live.onSetAns(qid, w, val); } else { onSet(w, val); } }
    const wn = (live && live.witNames) || {};
    return (
      <div style={{ background: conflict ? "rgba(178,42,75,0.07)" : C.cream, border: `1.5px solid ${conflict ? C.raspberry : C.line}`, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>{es}</div>
        {ru && <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 4 }}>{ru}</div>}
        {/* Каждый свидетель — своя ячейка целиком: имя → 📨 задать ЕМУ → его SÍ/NO.
            Так A и B нельзя перепутать: всё про свидетеля лежит внутри его коробки.
            Цвет шапки тот же, что у →A/→B в «Истории допроса» (золото = A, крем = B). */}
        {["A", "B"].map(w => {
          const tint = w === "A" ? C.goldSoft : C.creamDeep;
          const was = live && qid ? live.asked.some(a => a.qid === qid && a.to === w) : false;
          return (
            <div key={w} style={{ border: `1.5px solid ${C.line}`, borderRadius: 10, overflow: "hidden", marginTop: 8, background: "#fff" }}>
              <div style={{ background: tint, padding: "6px 11px", fontSize: 13.5, fontWeight: 800, color: C.ink }}>
                👤 Testigo {w}{wn[w] ? " · " + wn[w] : ""}
              </div>
              <div style={{ padding: "9px 11px" }}>
                {live && qid && (
                  <button disabled={!canAsk} onClick={() => doAsk(qid, es, w)} style={{ width: "100%", marginBottom: 9, background: was ? C.creamDeep : canAsk ? C.gold : "#EFE7D6", color: was ? C.inkSoft : canAsk ? "#fff" : "#B5A88F", border: `1.5px solid ${was ? C.line : canAsk ? C.goldDeep : C.line}`, borderRadius: 8, padding: "9px 4px", fontSize: 13, fontWeight: 700, cursor: canAsk ? "pointer" : "default", fontFamily: SERIF }}>
                    {was ? "✓ вопрос задан этому свидетелю" : "📨 задать этот вопрос"}
                  </button>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: C.inkSoft, flexShrink: 0 }}>Su respuesta:</span>
                  {[["sí", "SÍ", C.emerald], ["no", "NO", C.raspberry]].map(([val, lab, col]) => {
                    const on = stEff[w] === val;
                    return (
                      <button key={val} onClick={() => handleSet(w, val)} style={{ flex: 1, background: on ? col : "#fff", color: on ? "#fff" : col, border: `1.5px solid ${col}`, borderRadius: 8, padding: "9px 0", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: SERIF }}>
                        {on ? "✓ " : ""}{lab}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
        {conflict && <div style={{ marginTop: 8, fontSize: 12.5, fontWeight: 700, color: C.raspberry }}>⚡ Расхождение — здесь один из них лжёт</div>}
      </div>
    );
  }

  return (
    <div style={wrap}>
      <Header subtitle={"🕵️ Пульт детектива · Живая игра" + (roundN ? " · Раунд " + roundN : "")} />
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {live && revealed && (() => {
          const rv = verbByKey(revealed.verbKey);
          return (
            <div style={{ background: C.card, border: `2px solid ${C.gold}`, borderRadius: 14, padding: "14px 16px", marginBottom: 12, boxShadow: "0 2px 12px rgba(61,43,31,0.12)" }}>
              <div style={{ textAlign: "center", fontWeight: 800, fontSize: 17, color: C.raspberry, marginBottom: 6 }}>🔔 Раунд завершён — глагол вскрыт!</div>
              <div style={{ textAlign: "center", fontSize: 24, fontWeight: 800, color: C.ink }}>{rv ? `${rv.emoji} ${rv.inf}` : revealed.verbKey}{rv ? <span style={{ fontSize: 14, color: C.inkSoft, fontWeight: 600 }}> · {rv.ru}</span> : null}</div>
              <div style={{ textAlign: "center", fontSize: 14.5, fontWeight: 700, marginTop: 8, color: revealed.ok ? C.emeraldDeep : C.inkSoft }}>
                {revealed.ok ? `🎉 ${revealed.byName} угадал(а): +${revealed.detPts} (круг ${revealed.circle})` : "Никто не угадал глагол"}
              </div>
              <div style={{ textAlign: "center", fontSize: 13.5, marginTop: 6, color: C.ink }}>
                🟢 Правду говорил(а): <b>{revealed.canonName}</b> · 🔴 Выдумывал(а): <b>{revealed.fantasyName}</b>
              </div>
              <div style={{ textAlign: "center", fontSize: 12.5, color: C.inkSoft, marginTop: 6 }}>Жди следующий раунд — пульт сам откроет твою новую роль.</div>
            </div>
          );
        })()}
        {live && !revealed && myElim && (
          <div style={{ background: C.creamDeep, border: `2px solid ${C.line}`, borderRadius: 12, padding: "12px 16px", marginBottom: 12, textAlign: "center", fontWeight: 700, fontSize: 14.5, color: C.inkSoft }}>
            ❌ Глагол был неверный — ты выбыл до конца этого круга. Следи за игрой: в следующем круге ты снова в деле.
          </div>
        )}
        {live && !revealed && !myElim && live.lastElim && Date.now() - live.lastElim.ts < 12000 && (
          <div style={{ background: C.creamDeep, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "10px 14px", marginBottom: 12, textAlign: "center", fontWeight: 700, fontSize: 14, color: C.inkSoft }}>
            ❌ {live.lastElim.byName} назвал(а) неверный глагол и выбыл(а) из круга
          </div>
        )}
        {live && !revealed && guess && guess.stage === "voting" && (
          <div style={{ background: C.card, border: `2px solid ${C.raspberry}`, borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
            <div style={{ textAlign: "center", fontWeight: 800, fontSize: 16, color: C.raspberry }}>🗳 Тайное голосование</div>
            <div style={{ textAlign: "center", fontSize: 13.5, color: C.inkSoft, margin: "4px 0 10px", lineHeight: 1.45 }}>
              {guess.byName ? `${guess.byName} готов назвать глагол. ` : "Раунд завершается. "}Кому из свидетелей ты веришь? Твой выбор никто не видит.
            </div>
            {!myVoted ? (
              <div style={{ display: "flex", gap: 8 }}>
                {["A", "B"].map(w => (
                  <button key={w} disabled={askBusy} onClick={() => doVote(w)} style={{ flex: 1, background: C.gold, color: "#fff", border: `1.5px solid ${C.goldDeep}`, borderRadius: 10, padding: "12px 4px", fontSize: 14.5, fontWeight: 800, cursor: "pointer", fontFamily: SERIF }}>
                    🤝 Верю {w} · {live.witNames[w]}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", fontWeight: 700, color: C.emeraldDeep, fontSize: 14.5 }}>
                ✓ Голос принят · ждём остальных ({(live.votedIds || []).length}/{live.votersNeeded})
              </div>
            )}
          </div>
        )}
        {live && !revealed && guess && guess.stage === "naming" && (
          guess.by === live.myId ? (
            <div style={{ background: C.raspberry, color: "#fff", border: `2px solid ${C.raspberryDeep}`, borderRadius: 12, padding: "13px 16px", marginBottom: 12, textAlign: "center", fontWeight: 800, fontSize: 16 }}>
              🎤 Назови глагол голосом в Zoom! Ведущая решит: верный или нет.
            </div>
          ) : (
            <div style={{ background: C.creamDeep, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "11px 14px", marginBottom: 12, textAlign: "center", fontWeight: 700, fontSize: 14.5, color: C.inkSoft }}>
              🔍 {guess.byName} называет глагол — слушаем…
            </div>
          )
        )}
        {live && !revealed && !myElim && !(guess && (guess.stage === "voting" || guess.by === live.myId)) && (
          <div style={{ marginBottom: 12 }}>
            <button disabled={askBusy} onClick={doHand} style={{ width: "100%", border: myHand ? `2px solid ${C.emerald}` : "none", borderRadius: 12, padding: "12px", fontSize: 15.5, fontWeight: 800, fontFamily: SERIF, background: myHand ? C.card : C.emerald, color: myHand ? C.emeraldDeep : "#fff", cursor: "pointer", boxSizing: "border-box" }}>
              {myHand ? "🖐 Рука поднята — ведущая видит · нажми, чтобы убрать" : "🖐 Готов назвать глагол (поднять руку)"}
            </button>
            <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 5, lineHeight: 1.45, textAlign: "center" }}>
              Первым называет тот, кто задал вопрос. Молчит — ведущая даёт слово первой руке.
            </div>
          </div>
        )}
        {turn && !gamePaused && (
          <div style={{
            background: turn.mine ? C.gold : C.card, border: `2px solid ${turn.mine ? C.goldDeep : C.line}`,
            borderRadius: 12, padding: "12px 16px", marginBottom: 12, textAlign: "center",
            fontWeight: 800, fontSize: 17, color: turn.mine ? "#fff" : C.inkSoft,
          }}>
            {turn.mine ? "🎤 Спрашивай!" : "⏳ Жди своей очереди"}
          </div>
        )}
        {voiceMode && turn && turn.mine && !gamePaused && !(live && live.pendingOwn) && (
          <div style={{ marginBottom: 12 }}>
            <button disabled={askBusy} onClick={doAskVoice} style={{ width: "100%", border: "none", borderRadius: 14, padding: "18px 16px", fontSize: 18, fontWeight: 800, fontFamily: SERIF, background: askBusy ? "#D8CBB4" : C.goldDeep, color: "#fff", cursor: askBusy ? "default" : "pointer", boxShadow: `0 3px 12px ${C.gold}66` }}>
              ✅ Я задал вопрос вслух → передать ход
            </button>
            <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 6, lineHeight: 1.45, textAlign: "center" }}>
              Спроси своими словами в Zoom, потом жми эту кнопку — ход уйдёт следующему. Хочешь засчитать вопрос как «свой» (+2) — жми «🎙 Задать свой вопрос» ниже.
            </div>
          </div>
        )}
        {live && live.myScore && (
          <div style={{ background: C.card, border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: "8px 14px", marginBottom: 12, textAlign: "center", fontSize: 14.5, fontWeight: 700, color: C.goldDeep }}>
            ⭐ Твои очки — раунд: {live.myScore.r} · игра: {live.myScore.g}
          </div>
        )}
        {live && live.pendingOwn && live.pendingOwn.by === live.myId && (
          <div style={{ background: C.raspberry, color: "#fff", border: `2px solid ${C.raspberryDeep}`, borderRadius: 12, padding: "12px 16px", marginBottom: 12, textAlign: "center", fontWeight: 800, fontSize: 16 }}>
            🎙 Говори! Задай свой вопрос голосом в Zoom — ведущая оценит (✅ = +2)
          </div>
        )}
        {live && live.pendingOwn && live.pendingOwn.by !== live.myId && (
          <div style={{ background: C.creamDeep, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "10px 14px", marginBottom: 12, textAlign: "center", fontWeight: 700, fontSize: 14, color: C.inkSoft }}>
            ✍️ {live.pendingOwn.byName} задаёт свой вопрос — ведущая оценивает…
          </div>
        )}
        {ownResult && (
          <div style={{ background: ownResult.approved ? C.emerald : C.creamDeep, color: ownResult.approved ? "#fff" : C.inkSoft, border: `2px solid ${ownResult.approved ? C.emeraldDeep : C.line}`, borderRadius: 12, padding: "11px 15px", marginBottom: 12, textAlign: "center", fontWeight: 800, fontSize: 15.5 }}>
            {ownResult.approved ? "✅ Вопрос принят: +2 очка!" : "❌ Вопрос не засчитан (0, без штрафа)"}
          </div>
        )}
        {askErr && (
          <div style={{ background: "rgba(178,42,75,0.10)", border: `1.5px solid ${C.raspberry}`, borderRadius: 10, padding: "9px 12px", marginBottom: 12, fontSize: 13.5, fontWeight: 700, color: C.raspberry, textAlign: "center" }}>
            ⚠️ {askErr}
          </div>
        )}
        {/* ===== ИСТОРИЯ ДОПРОСА — общая лента вопросов всех детективов (новые сверху). v2.21 — defensive, не трогает логику кнопок ===== */}
        {live && (() => {
          const hist = Array.isArray(live.asked) ? live.asked : [];
          const wn = live.witNames || {};
          const wAns = live.answers || {};
          return (
            <Block stripe={C.emerald}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h2 style={h2}>📋 История допроса</h2>
                <span style={{ fontSize: 13, color: C.inkSoft }}>{hist.length} preguntas · новые сверху</span>
              </div>
              {hist.length === 0 ? (
                <p style={pHint}>Пока ни одного вопроса. Как детективы начнут спрашивать — лента появится здесь.</p>
              ) : (
                <div style={{ maxHeight: 240, overflowY: "auto" }}>
                  {hist.map((a, i) => ({ a, n: i + 1 })).reverse().map(({ a, n }) => (
                    <div key={n} style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap", padding: "7px 0", borderBottom: `1px dashed ${C.line}`, fontSize: 13.5 }}>
                      <span style={{ color: C.goldDeep, fontWeight: 800, flexShrink: 0 }}>#{n}</span>
                      <span style={{ flexShrink: 0, fontWeight: 700 }}>🕵️ {a.byName || "—"}{a.own ? " (свой)" : ""}</span>
                      {a.to && <span style={{ flexShrink: 0, background: a.to === "A" ? C.goldSoft : C.creamDeep, borderRadius: 6, padding: "1px 8px", fontWeight: 700, color: C.inkSoft }}>→ {a.to} · {wn[a.to] || ""}</span>}
                      {a.text && <span style={{ color: C.ink, minWidth: 0 }}>{a.text}</span>}
                      {(() => { const av = (a.qid && a.to) ? wAns[a.qid + ":" + a.to] : null; return av ? <span style={{ flexShrink: 0, marginLeft: 4, background: av === "sí" ? C.emerald : C.raspberry, color: "#fff", borderRadius: 6, padding: "1px 9px", fontWeight: 800, fontSize: 12.5 }}>{av === "sí" ? "SÍ" : "NO"}</span> : null; })()}
                    </div>
                  ))}
                </div>
              )}
            </Block>
          );
        })()}
        {!voiceMode ? (
        <Block stripe={C.goldDeep}>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 14.5, color: C.ink, lineHeight: 1.5 }}>
              Глагол скрыт. Задавай вопрос обоим свидетелям и отмечай, кто что ответил — <b>SÍ</b> или <b>NO</b>. Где ответы A и B расходятся — там спрятана ложь.
              {live && <span> В свой ход нажми <b>📨</b> под вопросом — ведущая и свидетель увидят его сами.</span>}
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 14, fontSize: 13, fontWeight: 700 }}>
              <span style={{ color: C.goldDeep }}>Отвечено: {answeredCount}</span>
              {conflictCount > 0 && <span style={{ color: C.raspberry }}>⚡ Расхождений: {conflictCount}</span>}
            </div>
          </div>
        </Block>
        ) : (
        <Block stripe={C.goldDeep}>
          <div style={{ padding: "14px 16px", fontSize: 14.5, color: C.ink, lineHeight: 1.55 }}>
            🎙 <b>Ты играешь сам.</b> Глагол скрыт — спрашивай свидетелей <b>своими словами в Zoom</b>, ответы держи в голове. Список вопросов и кнопки SÍ/NO тебе не нужны. В свой ход жми <b>«✅ Я задал вопрос»</b> сверху, чтобы передать ход.
          </div>
        </Block>
        )}

        {!voiceMode && CATS.map(cat => {
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
                  {qs.map(q => <AnsRow key={q.id} qid={q.id} es={q.q} ru={q.ru} st={asked[q.id] || { A: null, B: null }} onSet={(w, val) => setAns(q.id, w, val)} />)}
                </div>
              )}
            </div>
          );
        })}

        <div style={{ background: C.card, borderRadius: 14, border: `1px dashed ${C.gold}`, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.raspberry, marginBottom: 8 }}>✍️ Свой вопрос</div>
          {live && (
            <div style={{ marginBottom: 12 }}>
              <button
                disabled={!(turn && turn.mine) || !!live.pendingOwn || askBusy || gamePaused}
                onClick={doOwn}
                style={{
                  width: "100%", border: "none", borderRadius: 12, padding: "13px",
                  fontSize: 16, fontWeight: 800, fontFamily: SERIF,
                  background: (turn && turn.mine && !live.pendingOwn && !askBusy && !gamePaused) ? C.raspberry : "#EFE7D6",
                  color: (turn && turn.mine && !live.pendingOwn && !askBusy && !gamePaused) ? "#fff" : "#B5A88F",
                  cursor: (turn && turn.mine && !live.pendingOwn && !askBusy && !gamePaused) ? "pointer" : "default",
                }}>
                🎙 Задать свой вопрос (✅ ведущей = +2)
              </button>
              <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 6, lineHeight: 1.45 }}>
                Жми в свой ход → задай вопрос <b>голосом в Zoom</b> → ведущая решит ✅/❌.{!voiceMode && <span> Поле ниже — твой личный блокнот, на сервер не идёт.</span>}
              </div>
            </div>
          )}
          {!voiceMode && (<>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Напиши свой вопрос…" style={{ flex: 1, border: `1.5px solid ${C.line}`, borderRadius: 8, padding: "9px 12px", fontSize: 14.5, fontFamily: SERIF, color: C.ink, outline: "none" }} />
            <button onClick={addCustom} style={{ background: C.gold, color: "#fff", border: "none", borderRadius: 8, padding: "0 16px", fontSize: 20, fontWeight: 700, cursor: "pointer" }}>＋</button>
          </div>
          {custom.map((c, i) => <AnsRow key={i} es={c.text} ru="" st={c} onSet={(w, val) => setCustomAns(i, w, val)} />)}
          </>)}
        </div>

        <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.line}`, boxShadow: "0 2px 10px rgba(61,43,31,0.07)", marginBottom: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.line}`, cursor: "pointer", background: C.goldSoft, display: "flex", justifyContent: "space-between", alignItems: "center" }}
               onClick={() => setStoryView(storyView === "__open__" ? null : "__open__")}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.goldDeep }}>🔍 Проверь гипотезу{ruledOut.size > 0 && <span style={{ color: C.emeraldDeep }}> · осталось {VERBS.length - ruledOut.size} из {VERBS.length}</span>}</div>
              <div style={{ fontSize: 12, color: C.inkSoft }}>Тап — история глагола · ✕ — отмести (твой личный блокнот)</div>
            </div>
            <span style={{ fontSize: 18, color: C.gold, transform: (storyView !== null) ? "rotate(90deg)" : "none", transition: "transform .15s" }}>›</span>
          </div>
          {storyView !== null && (
            <div style={{ padding: "12px 14px" }}>
              {storyView && storyView !== "__open__" ? (() => {
                const sv = verbByKey(storyView);
                return (
                  <div>
                    <button onClick={() => setStoryView("__open__")} style={{ background: "none", border: "none", color: C.goldDeep, fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginBottom: 10, padding: 0, fontFamily: SERIF }}>← Все глаголы</button>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 32 }}>{sv.emoji}</span>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: C.goldDeep }}>{sv.inf}</div>
                        <div style={{ fontSize: 13, color: C.inkSoft }}>{sv.ru}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.6, marginBottom: 12 }}>
                      <Highlighted text={sv.storyEs} />
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {sv.dossier.map((d, i) => (
                        <div key={i} style={{ background: C.cream, border: `1px solid ${C.line}`, borderRadius: 8, padding: "4px 10px", fontSize: 12.5 }}>
                          <span style={{ color: C.inkSoft }}>{d[0]} </span>
                          <span style={{ color: C.ink, fontWeight: 600 }}>{d[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })() : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {VERBS.map(vv => {
                    const out = ruledOut.has(vv.key);
                    return (
                      <div key={vv.key} style={{ position: "relative", opacity: out ? 0.35 : 1 }}>
                        <button onClick={() => setStoryView(vv.key)} style={{ width: "100%", background: C.cream, border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 6px", cursor: "pointer", fontFamily: SERIF, textAlign: "center", textDecoration: out ? "line-through" : "none" }}>
                          <div style={{ fontSize: 22 }}>{vv.emoji}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginTop: 3 }}>{vv.inf}</div>
                          <div style={{ fontSize: 10.5, color: C.inkSoft }}>{vv.ru}</div>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); toggleRuled(vv.key); }}
                          title={out ? "Вернуть глагол" : "Отмести глагол"}
                          style={{ position: "absolute", top: 3, right: 3, width: 22, height: 22, borderRadius: "50%", border: `1px solid ${out ? C.emerald : C.line}`, background: out ? C.emerald : C.card, color: out ? "#fff" : C.inkSoft, fontSize: 11, fontWeight: 800, cursor: "pointer", lineHeight: 1, padding: 0 }}>
                          {out ? "↺" : "✕"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {onLeave && <div style={{ textAlign: "center", marginBottom: 12 }}><button onClick={onLeave} style={{ background: "transparent", border: `1.5px solid ${C.raspberry}`, color: C.raspberry, borderRadius: 10, padding: "9px 18px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: SERIF }}>🚪 Покинуть игру</button></div>}
        <Footer onHome={onBack} />
      </div>
    </div>
  );
}

// ===== ПУЛЬТ СВИДЕТЕЛЯ (Канон / Фантазия) =====
function LiveWitness({ mode, onBack, onLeave, initialVerbKey, roundN, liveAsked, myLetter, liveExtra }) {
  const [vk, setVk] = useState(initialVerbKey && verbByKey(initialVerbKey) ? initialVerbKey : null);
  const [storyOpen, setStoryOpen] = useState(false);      // Канон: мини-история
  const [lieOpen, setLieOpen] = useState(false);          // Фантазия: 🔴 Tu versión (независимая)
  const [truthOpen, setTruthOpen] = useState(false);      // Фантазия: 🟢 La verdad (независимая)
  const isCanon = mode === "canon";
  const accent = isCanon ? C.emerald : C.raspberry;
  const v = vk ? verbByKey(vk) : null;
  function pickVerb(k) { setVk(k); setStoryOpen(false); setLieOpen(false); setTruthOpen(false); }

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
              <button key={vv.key} onClick={() => pickVerb(vv.key)} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: "14px 8px", cursor: "pointer", fontFamily: SERIF, textAlign: "center", boxShadow: "0 2px 8px rgba(61,43,31,0.06)" }}>
                <div style={{ fontSize: 26 }}>{vv.emoji}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginTop: 4 }}>{vv.inf}</div>
                <div style={{ fontSize: 11.5, color: C.inkSoft }}>{vv.ru}</div>
              </button>
            ))}
          </div>
          {onLeave && <div style={{ textAlign: "center", marginTop: 16 }}><button onClick={onLeave} style={{ background: "transparent", border: `1.5px solid ${C.raspberry}`, color: C.raspberry, borderRadius: 10, padding: "9px 18px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: SERIF }}>🚪 Покинуть игру</button></div>}
          <div style={{ marginTop: 16 }}><Footer onHome={onBack} /></div>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <Header subtitle={(isCanon ? "🟢 Свидетель Канон · Живая игра" : "🔴 Свидетель Фантазия · Живая игра") + (myLetter ? " · Ты — Свидетель " + myLetter : "")} />
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {liveExtra && liveExtra.revealed && (() => {
          const rev = liveExtra.revealed;
          const rv = verbByKey(rev.verbKey);
          return (
            <div style={{ background: C.card, border: `2px solid ${C.gold}`, borderRadius: 14, padding: "14px 16px", marginBottom: 12, boxShadow: "0 2px 12px rgba(61,43,31,0.12)" }}>
              <div style={{ textAlign: "center", fontWeight: 800, fontSize: 17, color: C.raspberry, marginBottom: 6 }}>🔔 Раунд завершён — глагол вскрыт!</div>
              <div style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: C.ink }}>{rv ? `${rv.emoji} ${rv.inf}` : rev.verbKey}</div>
              <div style={{ textAlign: "center", fontSize: 14, fontWeight: 700, marginTop: 6, color: rev.ok ? C.emeraldDeep : C.inkSoft }}>
                {rev.ok ? `🎉 ${rev.byName} угадал(а) глагол` : "Никто не угадал"}
              </div>
              <div style={{ textAlign: "center", fontSize: 13.5, marginTop: 4 }}>
                🟢 Правду говорил(а): <b>{rev.canonName}</b> · 🔴 Выдумывал(а): <b>{rev.fantasyName}</b>
              </div>
            </div>
          );
        })()}
        {liveExtra && !liveExtra.revealed && liveExtra.guess && (
          <div style={{ background: liveExtra.guess.stage === "naming" ? C.raspberry : C.card, color: liveExtra.guess.stage === "naming" ? "#fff" : C.ink, border: `2px solid ${C.raspberry}`, borderRadius: 12, padding: "12px 15px", marginBottom: 12, textAlign: "center", fontWeight: 800, fontSize: 15 }}>
            {liveExtra.guess.stage === "voting"
              ? "🗳 Детективы тайно голосуют, кому из вас верят…"
              : `🔍 ${liveExtra.guess.byName} называет глагол!`}
          </div>
        )}

        {/* ===== ПЛАШКА ОЧКОВ — всегда видна свидетелю ===== */}
        {liveExtra && liveExtra.myScore && (
          <div style={{ background: C.card, border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: "8px 14px", marginBottom: 12, textAlign: "center", fontSize: 14.5, fontWeight: 700, color: C.goldDeep }}>
            ⭐ Твои очки — раунд: {liveExtra.myScore.r} · игра: {liveExtra.myScore.g}
          </div>
        )}

        {/* ===== ШАПКА ГЛАГОЛА ===== */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, padding: "0 4px" }}>
          <span style={{ fontSize: 34 }}>{v.emoji}</span>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: accent }}>{v.inf}</div>
            <div style={{ fontSize: 13.5, color: C.inkSoft }}>{v.ru}</div>
          </div>
        </div>

        {isCanon ? (
          <>
            {/* ===== КАНОН: зелёная рамка с досье (правда) ===== */}
            <div style={{ background: C.card, border: `2.5px solid ${C.emerald}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14, boxShadow: "0 2px 14px rgba(45,122,90,0.10)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.emeraldDeep, letterSpacing: ".5px", marginBottom: 8 }}>📋 CANON — qué hace el Jefe (правда)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {v.dossier.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "baseline", background: "rgba(45,122,90,0.06)", border: `1px solid ${C.emerald}`, borderRadius: 9, padding: "8px 12px" }}>
                    <span style={{ flexShrink: 0, fontSize: 13, fontWeight: 700, color: C.emeraldDeep, minWidth: 78 }}>{d[0]}</span>
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, lineHeight: 1.35 }}>{d[1]}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, background: "rgba(45,122,90,0.12)", border: `1px solid ${C.emerald}`, borderRadius: 10, padding: "10px 13px", fontSize: 14, color: C.ink, lineHeight: 1.45 }}>
                <b style={{ color: C.emeraldDeep }}>Ты говоришь ПРАВДУ.</b> Отвечай строго по канону. Где детектив угадывает канон — <b style={{ color: C.emeraldDeep }}>SÍ</b>, где нет — <b style={{ color: C.raspberryDeep }}>NO</b>.
              </div>
            </div>

            {/* Правдивая мини-история — выпадающая */}
            <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.line}`, boxShadow: "0 2px 10px rgba(61,43,31,0.07)", marginBottom: 14, overflow: "hidden" }}>
              <div onClick={() => setStoryOpen(o => !o)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", cursor: "pointer", background: storyOpen ? C.goldSoft : "#fff" }}>
                <span style={{ fontSize: 14.5, fontWeight: 800, color: C.emeraldDeep }}>📖 Mini-historia <span style={{ fontWeight: 400, fontSize: 12.5, color: C.inkSoft }}>(правда — почитать перед раундом)</span></span>
                <span style={{ fontSize: 18, color: C.gold, transform: storyOpen ? "rotate(90deg)" : "none", transition: "transform .15s" }}>›</span>
              </div>
              {storyOpen && (
                <div style={{ padding: "12px 16px", fontSize: 14.5, color: C.ink, lineHeight: 1.6 }}>
                  <Highlighted text={v.storyEs} />
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* ===== ФАНТАЗИЯ: канон-табличка ВСЕГДА перед глазами (как у Канона) — по ней сверяешься ===== */}
            <div style={{ background: C.card, border: `2.5px solid ${C.emerald}`, borderRadius: 16, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 14px rgba(45,122,90,0.10)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.emeraldDeep, letterSpacing: ".5px", marginBottom: 8 }}>📋 CANON — qué hace el Jefe <span style={{ fontWeight: 600, color: C.inkSoft }}>(правда — от этого уводишь)</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {v.dossier.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "baseline", background: "rgba(45,122,90,0.06)", border: `1px solid ${C.emerald}`, borderRadius: 9, padding: "8px 12px" }}>
                    <span style={{ flexShrink: 0, fontSize: 13, fontWeight: 700, color: C.emeraldDeep, minWidth: 78 }}>{d[0]}</span>
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, lineHeight: 1.35 }}>{d[1]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== Подсказка: ты врёшь ===== */}
            <div style={{ background: "rgba(178,42,75,0.10)", border: `2px solid ${C.raspberry}`, borderRadius: 14, padding: "13px 16px", marginBottom: 12 }}>
              <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.5 }}>
                <b style={{ color: C.raspberryDeep }}>Ты ВРЁШЬ.</b> Сверху — <b style={{ color: C.emeraldDeep }}>🟢 канон</b> (правда, держи перед глазами). Ниже — <b style={{ color: C.raspberryDeep }}>🔴 Tu versión</b> (готовая выдумка) и <b style={{ color: C.emeraldDeep }}>🟢 La verdad</b> (полная история). Отвечай НЕ по канону, уводи детектива в сторону — убедительно и не путаясь. Раскрывашки независимы: можно держать открытыми обе.
              </div>
            </div>

            {/* 🔴 Tu versión — независимая раскрывашка, текст на испанском */}
            <div style={{ background: C.card, borderRadius: 14, border: `1.5px solid ${C.raspberry}`, boxShadow: "0 2px 10px rgba(178,42,75,0.08)", marginBottom: 12, overflow: "hidden" }}>
              <div onClick={() => setLieOpen(o => !o)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", cursor: "pointer", background: lieOpen ? "rgba(178,42,75,0.08)" : "#fff" }}>
                <span style={{ fontSize: 14.5, fontWeight: 800, color: C.raspberryDeep }}>🔴 Tu versión <span style={{ fontWeight: 400, fontSize: 12.5, color: C.inkSoft }}>(твоя выдумка — её и говоришь)</span></span>
                <span style={{ fontSize: 18, color: C.raspberry, transform: lieOpen ? "rotate(90deg)" : "none", transition: "transform .15s" }}>›</span>
              </div>
              {lieOpen && (
                <div style={{ padding: "12px 16px", fontSize: 14.5, color: C.ink, lineHeight: 1.6 }}>
                  {liveFantVer(v)}
                </div>
              )}
            </div>

            {/* 🟢 La verdad — независимая раскрывашка */}
            <div style={{ background: C.card, borderRadius: 14, border: `1.5px solid ${C.emerald}`, boxShadow: "0 2px 10px rgba(45,122,90,0.08)", marginBottom: 14, overflow: "hidden" }}>
              <div onClick={() => setTruthOpen(o => !o)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", cursor: "pointer", background: truthOpen ? "rgba(45,122,90,0.08)" : "#fff" }}>
                <span style={{ fontSize: 14.5, fontWeight: 800, color: C.emeraldDeep }}>🟢 La verdad <span style={{ fontWeight: 400, fontSize: 12.5, color: C.inkSoft }}>(полная история — от чего уводишь)</span></span>
                <span style={{ fontSize: 18, color: C.emerald, transform: truthOpen ? "rotate(90deg)" : "none", transition: "transform .15s" }}>›</span>
              </div>
              {truthOpen && (
                <div style={{ padding: "12px 16px", fontSize: 14.5, color: C.ink, lineHeight: 1.6 }}>
                  <Highlighted text={v.storyEs} />
                </div>
              )}
            </div>
          </>
        )}

        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <button onClick={() => setVk(null)} style={{ background: "none", border: `1.5px solid ${accent}`, color: accent, fontSize: 14, fontWeight: 700, borderRadius: 10, padding: "9px 18px", cursor: "pointer", fontFamily: SERIF }}>← Другой глагол</button>
        </div>
        {onLeave && <div style={{ textAlign: "center", marginBottom: 12 }}><button onClick={onLeave} style={{ background: "transparent", border: `1.5px solid ${C.raspberry}`, color: C.raspberry, borderRadius: 10, padding: "9px 18px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: SERIF }}>🚪 Покинуть игру</button></div>}
        <Footer onHome={onBack} />
      </div>
    </div>
  );
}

// ===== ОБЁРТКА LIVE: выбор роли =====
function loadConn() { try { return JSON.parse(localStorage.getItem("ciudad_live_v1")) || null; } catch (e) { return null; } }
function saveConn(c) { try { c ? localStorage.setItem("ciudad_live_v1", JSON.stringify(c)) : localStorage.removeItem("ciudad_live_v1"); } catch (e) {} }

function LiveGame({ onHome }) {
  const [r, setR] = useState(null);
  // Telegram-пользователь (если открыто из Mini App) — для моста playerId ↔ tgId (Этап 3)
  const tg = getTg();
  // --- Подключение к комнате ведущего ---
  const [conn, setConn] = useState(loadConn);       // {code, playerId, name}
  const [game, setGame] = useState(null);            // живое состояние из базы
  const [ansOverlay, setAnsOverlay] = useState({});  // оптимистичный слой ответов {key:{v,t}} — переживает опрос (фикс гонки)
  const [codeIn, setCodeIn] = useState("");
  const [nameIn, setNameIn] = useState(() => (loadConn() || {}).name || (tg && tg.name) || "");
  const [joinBusy, setJoinBusy] = useState(false);
  const [joinErr, setJoinErr] = useState("");
  const [modeIn, setModeIn] = useState(() => (loadConn() || {}).mode || "pad"); // "pad" = с вопросником, "voice" = сам/без вопросов
  const [skipConn, setSkipConn] = useState(false);   // старый режим без комнаты

  async function joinRoom() {
    const code = codeIn.trim(); const name = nameIn.trim();
    if (!code || !name) { setJoinErr("Введи код игры и своё имя"); return; }
    setJoinBusy(true); setJoinErr("");
    try {
      const body = { action: "join", code, name, mode: modeIn };
      if (tg && tg.id) body.tgId = tg.id; // мост к копилке score:{tgId} (Этап 3)
      const resp = await fetch("/api/game", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await resp.json();
      if (d.ok) { const c = { code, playerId: d.playerId, name, mode: modeIn }; setConn(c); saveConn(c); setGame(d.game); }
      else setJoinErr(d.error || "Не получилось войти");
    } catch (e) { setJoinErr("Сеть недоступна, попробуй ещё раз"); }
    setJoinBusy(false);
  }
  function leaveRoom() { setConn(null); setGame(null); saveConn(null); lastRound.current = 0; }

  // --- Автооткрытие роли: ведущий стартовал раунд → пульт сам открывает твою роль ---
  const lastRound = useRef(0);
  const [liveVerb, setLiveVerb] = useState(null); // глагол раунда (только для свидетелей)
  function myRoleIn(rd) {
    if (!rd || !rd.roles || !conn) return null;
    if (rd.roles.canon === conn.playerId) return "canon";
    if (rd.roles.fantasy === conn.playerId) return "fantasia";
    if ((rd.roles.detectives || []).includes(conn.playerId)) return "detective";
    return null;
  }
  // чей сейчас ход (для плашки на пульте детектива)
  function turnInfo() {
    if (!conn || !game || !game.round || !game.round.roles) return null;
    const dets = game.round.roles.detectives || [];
    if (!dets.length || !dets.includes(conn.playerId)) return null;
    const activeId = dets[(game.round.turnIdx || 0) % dets.length];
    const ap = (game.players || []).find((x) => x.id === activeId);
    return { mine: activeId === conn.playerId, name: ap ? ap.name : "—" };
  }
  function nameOf(pid) { const p = ((game && game.players) || []).find((x) => x.id === pid); return p ? p.name : "?"; }
  async function sendAsk(qid, text, target) {
    try {
      const resp = await fetch("/api/game", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "ask", code: conn.code, playerId: conn.playerId, qid, text, target }) });
      const d = await resp.json();
      if (d.ok) { setGame(d.game); return null; }
      return d.error || "Не получилось отправить вопрос";
    } catch (e) { return "Сеть недоступна — попробуй ещё раз"; }
  }
  // детектив фиксирует ответ свидетеля (Sí/No) → общая история допроса, видят все
  async function sendAnswer(qid, target, value) {
    const key = qid + ":" + target;
    const sv = (game && game.round && game.round.answers) || {};
    const ov = ansOverlay[key];
    const cur = ov !== undefined ? (ov.v || null) : (sv[key] || null);
    const next = cur === value ? null : value; // тоггл считает клиент
    setAnsOverlay(prev => ({ ...prev, [key]: { v: next || "", t: Date.now() } })); // мгновенно показать, удержать поверх опроса
    try {
      const resp = await fetch("/api/game", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "answer", code: conn.code, playerId: conn.playerId, qid, target, value: next }) });
      const d = await resp.json();
      if (d.ok) { setGame(d.game); return null; }
      return d.error || "Не получилось записать ответ";
    } catch (e) { return "Сеть недоступна — попробуй ещё раз"; }
  }
  // детектив заявляет СВОЙ вопрос: задаёт голосом в Zoom, ведущая оценивает ✅/❌
  async function sendOwn() {
    try {
      const resp = await fetch("/api/game", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "own", code: conn.code, playerId: conn.playerId }) });
      const d = await resp.json();
      if (d.ok) { setGame(d.game); return null; }
      return d.error || "Не получилось заявить свой вопрос";
    } catch (e) { return "Сеть недоступна — попробуй ещё раз"; }
  }
  // Шаг 5: рука «готов назвать глагол» и тайный голос «Верю A/B»
  async function sendHand(down) {
    try {
      const resp = await fetch("/api/game", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "hand", code: conn.code, playerId: conn.playerId, down: !!down }) });
      const d = await resp.json();
      if (d.ok) { setGame(d.game); return null; }
      return d.error || "Не получилось поднять руку";
    } catch (e) { return "Сеть недоступна — попробуй ещё раз"; }
  }
  async function sendVote(choice) {
    try {
      const resp = await fetch("/api/game", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "vote", code: conn.code, playerId: conn.playerId, choice }) });
      const d = await resp.json();
      if (d.ok) { setGame(d.game); return null; }
      return d.error || "Не получилось проголосовать";
    } catch (e) { return "Сеть недоступна — попробуй ещё раз"; }
  }
  // Игрок выходит из партии НАВСЕГДА. Очки замораживаются и остаются видны.
  // Сервер ставит флаг left; следующий опрос/ответ подхватит — экран сам сменится на «Ты вышел».
  async function leaveGame() {
    if (!conn) return;
    if (!window.confirm("Точно выйти? Вернуться в эту партию не получится.")) return;
    try {
      const resp = await fetch("/api/game", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "leave", code: conn.code, playerId: conn.playerId }) });
      const d = await resp.json();
      if (d.ok && d.game) setGame(d.game);
    } catch (e) { /* следующий опрос подхватит флаг left */ }
  }
  const rdLive = game && game.round;
  const mergedAns = { ...((rdLive && rdLive.answers) || {}) };
  for (const k in ansOverlay) { const v = ansOverlay[k].v; if (v) mergedAns[k] = v; else delete mergedAns[k]; }
  const liveDet = conn && rdLive && rdLive.witAName && rdLive.witBName ? {
    witNames: { A: rdLive.witAName, B: rdLive.witBName },
    asked: rdLive.asked || [],
    answers: mergedAns,
    onAsk: sendAsk,
    onSetAns: sendAnswer,
    onOwn: sendOwn,
    pendingOwn: rdLive.pendingOwn || null,
    myId: conn.playerId,
    myScore: (game.scores || {})[conn.playerId] || null,
    // Шаг 5
    hands: rdLive.hands || [],
    guess: rdLive.guess || null,
    votedIds: rdLive.votedIds || [],
    votersNeeded: ((rdLive.roles && rdLive.roles.detectives) || []).length,
    eliminated: rdLive.eliminated || [],
    revealed: rdLive.revealed || null,
    lastElim: rdLive.lastElim || null,
    onHand: sendHand,
    onVote: sendVote,
    mode: (() => {
      const me = (game.players || []).find((p) => p.id === conn.playerId);
      return (me && me.mode) || (conn && conn.mode) || "pad";
    })(),
  } : null;
  // Шаг 5: что видит свидетель (голосование / называние / вскрытие)
  const liveWitExtra = conn && rdLive ? {
    guess: rdLive.guess || null,
    revealed: rdLive.revealed || null,
    myScore: (game.scores || {})[conn.playerId] || null,
  } : null;
  const myLetter = conn && rdLive ? (rdLive.witA === conn.playerId ? "A" : rdLive.witB === conn.playerId ? "B" : null) : null;
  const liveAskedForMe = myLetter && rdLive ? new Set((rdLive.asked || []).filter((a) => a.to === myLetter && a.qid).map((a) => a.qid)) : null;
  useEffect(() => {
    if (!conn || !game || !game.round) return;
    const rd = game.round;
    if (rd.n === lastRound.current) return;
    const my = myRoleIn(rd);
    if (!my) return; // ведущий не нашёл это имя в комнате — открой роль вручную
    lastRound.current = rd.n;
    setLiveVerb(my === "detective" ? null : rd.verbKey);
    setR(my);
  }, [conn && conn.playerId, game && game.round && game.round.n]);

  // опрос состояния игры раз в 2 сек
  useEffect(() => {
    if (!conn) return;
    let dead = false;
    const tick = async () => {
      try {
        const resp = await fetch(`/api/game?code=${conn.code}`);
        const d = await resp.json();
        if (!dead && d.ok) setGame(d.game);
        if (!dead && !d.ok && /не найдена/.test(d.error || "")) leaveRoom();
      } catch (e) { /* временный сбой — переживём */ }
    };
    tick();
    const t = setInterval(tick, 2000);
    return () => { dead = true; clearInterval(t); };
  }, [conn && conn.code]);

  // самоочистка оптимистичного слоя ответов: снимаем ключ ТОЛЬКО когда сервер
  // подтвердил то же значение (выставил или снял). До подтверждения оптимистичный
  // ответ держится — бейдж SÍ/NO не мигает и не пропадает после опроса.
  useEffect(() => {
    const sv = (game && game.round && game.round.answers) || {};
    setAnsOverlay(prev => {
      let ch = false; const next = { ...prev }; const now = Date.now();
      for (const k in prev) {
        const want = prev[k].v || null; const have = sv[k] || null; const age = now - prev[k].t;
        if (want === have) { delete next[k]; ch = true; }          // сервер догнал — отдаём ответ серверу
        else if (age > 15000) { delete next[k]; ch = true; }       // страховка от зависшего ключа при сетевом сбое
      }
      return ch ? next : prev;
    });
  }, [game]);

  const roundKey = game && game.round ? game.round.n : "manual";

  // Игрок вышел навсегда (сам или ведущая-страховка) — показываем замороженные очки, дальше не играет.
  const meInRoom = conn && game ? (game.players || []).find((p) => p.id === conn.playerId) : null;
  if (meInRoom && meInRoom.left) {
    const frozen = (game.scores && game.scores[conn.playerId]) ? game.scores[conn.playerId].g : 0;
    return (
      <div style={wrap}>
        <Header subtitle="🚪 Ты вышел из игры" />
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ background: C.card, border: `2px solid ${C.gold}`, borderRadius: 16, padding: "26px 20px", textAlign: "center", boxShadow: "0 2px 14px rgba(61,43,31,0.12)" }}>
            <div style={{ fontSize: 40 }}>🚪</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: C.ink, marginTop: 8 }}>Ты вышел из игры</div>
            <div style={{ fontSize: 14.5, color: C.inkSoft, marginTop: 8, lineHeight: 1.5 }}>Спасибо за партию! Дальше ты не участвуешь, но твои очки сохранены.</div>
            <div style={{ marginTop: 18, background: C.cream, border: `1px solid ${C.line}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, color: C.inkSoft, textTransform: "uppercase", letterSpacing: 0.5 }}>Твои очки сохранены</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: C.goldDeep, marginTop: 4 }}>{frozen}</div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}><Footer onHome={onHome} /></div>
        </div>
      </div>
    );
  }

  if (r === "detective") return <LiveDetective key={roundKey} onBack={() => setR(null)} onLeave={leaveGame} roundN={game && game.round ? game.round.n : null} turn={turnInfo()} live={liveDet} />;
  if (r === "canon") return <LiveWitness key={"c" + roundKey} mode="canon" initialVerbKey={liveVerb} onBack={() => setR(null)} onLeave={leaveGame} roundN={game && game.round ? game.round.n : null} liveAsked={liveAskedForMe} myLetter={myLetter} liveExtra={liveWitExtra} />;
  if (r === "fantasia") return <LiveWitness key={"f" + roundKey} mode="fantasia" initialVerbKey={liveVerb} onBack={() => setR(null)} onLeave={leaveGame} roundN={game && game.round ? game.round.n : null} liveAsked={liveAskedForMe} myLetter={myLetter} liveExtra={liveWitExtra} />;

  // --- Экран входа в комнату ---
  if (!conn && !skipConn) {
    return (
      <div style={wrap}>
        <Header subtitle="🎮 Живая игра · вход" />
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.line}`, boxShadow: "0 2px 10px rgba(61,43,31,0.08)", padding: "18px 18px 16px" }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.raspberry, marginBottom: 6 }}>Код игры</div>
            <div style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.5, marginBottom: 12 }}>Ведущий назовёт 4 цифры в Zoom — введи их и своё имя.</div>
            <input value={codeIn} onChange={(e) => setCodeIn(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="0000" inputMode="numeric"
              style={{ width: "100%", boxSizing: "border-box", fontSize: 30, fontWeight: 800, letterSpacing: 10, textAlign: "center", padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${C.gold}`, fontFamily: SERIF, color: C.ink, marginBottom: 10 }} />
            <input value={nameIn} onChange={(e) => setNameIn(e.target.value)} placeholder="Твоё имя"
              style={{ width: "100%", boxSizing: "border-box", fontSize: 17, padding: "11px 12px", borderRadius: 12, border: `1.5px solid ${C.line}`, fontFamily: SERIF, color: C.ink, marginBottom: 12 }} />
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, marginBottom: 7 }}>Как тебе удобнее играть?</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[
                { k: "pad", t: "🎴 С вопросником", d: "Готовые вопросы и кнопки SÍ/NO на пульте" },
                { k: "voice", t: "🎙 Сам, голосом", d: "Спрашиваешь своими словами, без списка вопросов" },
              ].map((m) => {
                const on = modeIn === m.k;
                return (
                  <button key={m.k} onClick={() => setModeIn(m.k)} style={{ flex: 1, textAlign: "left", cursor: "pointer", fontFamily: SERIF, background: on ? "#FBF3E0" : C.card, border: `1.5px solid ${on ? C.gold : C.line}`, borderRadius: 12, padding: "10px 11px", color: C.ink, boxShadow: on ? `0 0 0 2px ${C.gold}55` : "none" }}>
                    <div style={{ fontSize: 14.5, fontWeight: 800 }}>{m.t}</div>
                    <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 3, lineHeight: 1.35 }}>{m.d}</div>
                  </button>
                );
              })}
            </div>
            <button onClick={joinRoom} disabled={joinBusy} style={{ width: "100%", background: joinBusy ? "#D8CBB4" : C.raspberry, color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontSize: 17, fontWeight: 700, fontFamily: SERIF, cursor: joinBusy ? "default" : "pointer" }}>
              {joinBusy ? "Вхожу..." : "Войти в игру"}
            </button>
            {joinErr && <div style={{ color: C.raspberry, fontSize: 13.5, fontWeight: 600, marginTop: 8, textAlign: "center" }}>{joinErr}</div>}
          </div>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button onClick={() => setSkipConn(true)} style={{ background: "none", border: "none", color: C.inkSoft, fontSize: 12.5, cursor: "pointer", fontFamily: SERIF, textDecoration: "underline" }}>
              Открыть пульт без кода
            </button>
          </div>
          <Footer onHome={onHome} />
        </div>
      </div>
    );
  }

  const roles = [
    { id: "detective", emoji: "🕵️", t: "Детектив", d: "Глагол скрыт. Вопросы по категориям + отметки кому задал.", c: C.goldDeep },
    { id: "canon", emoji: "🟢", t: "Свидетель Канон", d: "Знаешь правду. История, досье и ответы Sí/No по всем вопросам.", c: C.emerald },
    { id: "fantasia", emoji: "🔴", t: "Свидетель Фантазия", d: "Твоя легенда. Ответы Sí/No по версии — держись её до конца.", c: C.raspberry },
  ];
  return (
    <div style={wrap}>
      <Header subtitle="🎮 Живая игра · выбор роли" />
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {conn && (
          <div style={{ background: C.card, border: `1.5px solid ${C.emerald}`, borderRadius: 12, padding: "11px 14px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
              <span style={{ fontWeight: 800, color: C.emeraldDeep, fontSize: 15 }}>✅ Ты в игре {conn.code} как {conn.name}</span>
              <button onClick={leaveRoom} style={{ background: "none", border: "none", color: C.inkSoft, fontSize: 12.5, cursor: "pointer", fontFamily: SERIF, textDecoration: "underline" }}>выйти</button>
            </div>
            {(() => {
              const me = game && (game.players || []).find((p) => p.id === conn.playerId);
              const mm = (me && me.mode) || conn.mode || "pad";
              return (
                <div style={{ display: "inline-block", marginTop: 6, fontSize: 12.5, fontWeight: 700, color: mm === "voice" ? C.goldDeep : C.inkSoft, background: mm === "voice" ? "#FBF3E0" : "transparent", border: mm === "voice" ? `1px solid ${C.gold}` : "none", borderRadius: 8, padding: mm === "voice" ? "3px 9px" : 0 }}>
                  {mm === "voice" ? "🎙 Играешь сам, без вопросника" : "🎴 С вопросником"}
                </div>
              );
            })()}
            {game && (
              <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 5 }}>
                В комнате ({(game.players || []).length}/5): {(game.players || []).map((p) => p.name).join(", ") || "—"}
              </div>
            )}
            {game && game.round && myRoleIn(game.round) && (
              <div style={{ fontSize: 13.5, fontWeight: 700, color: C.raspberry, marginTop: 6 }}>
                🎬 Раунд {game.round.n}: твоя роль — {myRoleIn(game.round) === "detective" ? "🕵️ Детектив" : myRoleIn(game.round) === "canon" ? "🟢 Свидетель Канон" : "🔴 Свидетель Фантазия"}
              </div>
            )}
          </div>
        )}
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
  const [session, setSession] = useState(loadScore);
  // Облачный счёт: warmup — очки разминки Don Verbo, total — общий (тренажёр + разминка)
  const [cloud, setCloud] = useState(null);
  const tg = useRef(getTg());

  useEffect(() => {
    const t = tg.current;
    if (!t) return;
    (async () => {
      try {
        let synced = false;
        try { synced = !!localStorage.getItem(CLOUD_SYNC_KEY); } catch { /* приватный режим */ }
        let sc;
        if (!synced) {
          // одноразовый переезд накопленной копилки в облако (HSETNX — без задвоения)
          const s = loadScore();
          sc = await cloudCall({ action: "sync", tgId: t.id, name: t.name, detective: s.detective, canon: s.canon, fantasia: s.fantasia, diario: s.diario });
          try { localStorage.setItem(CLOUD_SYNC_KEY, "1"); } catch { /* приватный режим */ }
        } else {
          sc = await cloudCall({ action: "get", tgId: t.id });
        }
        setCloud(sc);
        // облако — источник правды для общего счёта: подтягиваем локальную копилку,
        // если в облаке больше (другое устройство / чистый localStorage)
        setSession(prev => {
          const n = { ...prev };
          let changed = false;
          for (const k of ["detective", "canon", "fantasia", "diario"]) {
            if ((sc[k] || 0) > (n[k] || 0)) { n[k] = sc[k]; changed = true; }
          }
          if (changed) saveScore(n);
          return changed ? n : prev;
        });
      } catch { /* офлайн или база недоступна — тренажёр работает локально */ }
    })();
  }, []);

  function addScore(roleKey, pts) {
    if (pts > 0) {
      setSession(s => { const n = { ...s, [roleKey]: (s[roleKey] || 0) + pts }; saveScore(n); return n; });
      const t = tg.current;
      if (t) cloudCall({ action: "add", tgId: t.id, src: roleKey, pts, name: t.name }).then(setCloud).catch(() => {});
    }
  }
  const [showTour, setShowTour] = useState(() => !tourSeen());
  // Deep-link из бота Don Verbo: ?verbo=preguntar открывает тренажёр спряжения сразу на этом глаголе
  const [deepVerb, setDeepVerb] = useState(() => {
    try {
      const v = new URLSearchParams(window.location.search).get("verbo");
      return v && VERBS15.includes(v) ? v : null;
    } catch { return null; }
  });

  // Выбранная игра (картридж). null → показываем меню выбора главы.
  const [pack, setPack] = useState(null);
  const goDiario = () => { setRole("diario"); setEntered(true); };
  // session + очки разминки Don Verbo из облака — для бейджа копилки
  const sess = cloud && cloud.warmup > 0 ? { ...session, warmup: cloud.warmup } : session;

  if (deepVerb) return <ConjTrainer startVerb={deepVerb} onScore={p => addScore("diario", p)} onBack={() => setDeepVerb(null)} />;
  if (showTour) return <Tour onDone={() => setShowTour(false)} />;
  if (!entered) return <LevelPicker
    onPick={(p) => { setPack(p); setEntered(true); }}
    onLive={() => { setRole("live"); setEntered(true); }}
    onTour={() => setShowTour(true)}
  />;
  if (role === "live") return <LiveGame onHome={() => { setRole(null); setEntered(false); }} />;
  if (role === "diario") return <DiarioMode onHome={() => setRole(null)} onScore={p => addScore("diario", p)} session={sess} />;
  if (!role) return <RolePicker pack={pack} onPick={setRole} session={sess} onBack={() => { setPack(null); setEntered(false); }} onDiario={goDiario} />;
  if (role === "detective") return <DetectiveMode pack={pack} onHome={() => setRole(null)} onScore={p => addScore("detective", p)} session={sess} onDiario={goDiario} />;
  return <WitnessMode pack={pack} role={role} onHome={() => setRole(null)} onScore={p => addScore(role, p)} session={sess} onDiario={goDiario} />;
}

// ============================================================
// ВЫБОР УРОВНЯ — первый экран после тура
// ============================================================
function LevelPicker({ onPick, onLive, onTour }) {
  return (
    <div style={wrap}><div style={maxw}>
      <Header subtitle="Bienvenido · добро пожаловать" />

      <p style={{ ...pHint, textAlign: "center", marginBottom: 22 }}>
        Выбери уровень, который тренируешь, или подключайся к живой игре:
      </p>

      {/* Уровень 1 — золотой */}
      <div onClick={() => onPick(PACKS.cap1)} style={{
        background: C.gold, borderRadius: 20, padding: "28px 24px",
        marginBottom: 16, cursor: "pointer", textAlign: "center",
        boxShadow: "0 6px 22px rgba(201,162,75,0.30)",
      }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{PACKS.cap1.emoji}</div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginBottom: 4 }}>Nivel 1 · {PACKS.cap1.grammar}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: SERIF, lineHeight: 1.2, marginBottom: 8 }}>{PACKS.cap1.titulo}</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", lineHeight: 1.55 }}>{PACKS.cap1.desc}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: 600, marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 10 }}>{PACKS.cap1.VERBS.length} глаголов · Detective · Canon · Fantasía</div>
      </div>

      {/* Уровень 2 — изумрудный */}
      <div onClick={() => onPick(PACKS.cap2)} style={{
        background: C.emerald, borderRadius: 20, padding: "28px 24px",
        marginBottom: 16, cursor: "pointer", textAlign: "center",
        boxShadow: "0 6px 22px rgba(22,121,91,0.28)",
      }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{PACKS.cap2.emoji}</div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginBottom: 4 }}>Nivel 2 · {PACKS.cap2.grammar}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: SERIF, lineHeight: 1.2, marginBottom: 8 }}>{PACKS.cap2.titulo}</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", lineHeight: 1.55 }}>{PACKS.cap2.desc}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: 600, marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 10 }}>{PACKS.cap2.VERBS.length} глаголов · Detective · Canon · Fantasía</div>
      </div>

      {/* Живая игра — малиновая, отдельно */}
      <div style={{ borderTop: `1px dashed ${C.line}`, margin: "8px 0 16px" }} />
      <div onClick={onLive} style={{
        background: C.raspberry, borderRadius: 20, padding: "22px 24px",
        cursor: "pointer", textAlign: "center",
        boxShadow: "0 4px 16px rgba(168,27,62,0.22)",
      }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>🎮</div>
        <div style={{ fontSize: 19, fontWeight: 800, color: "#fff", fontFamily: SERIF }}>Пульт живой игры</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.80)", marginTop: 6 }}>Только во время Zoom-игры</div>
      </div>

      <div style={{ textAlign: "center", marginTop: 18 }}>
        <button onClick={onTour} style={{ background: "none", border: "none", color: C.goldDeep, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: SERIF, textDecoration: "underline" }}>
          ❓ Правила игры — посмотреть снова
        </button>
      </div>

      <Footer />
    </div></div>
  );
}

// ============================================================
// ВЫБОР ИГРЫ (картриджа) — Глава 1 / Глава 2
// ============================================================
function ChapterPicker({ onPick, session, onBack, onDiario }) {
  const list = [PACKS.cap1, PACKS.cap2];
  return (
    <div style={wrap}><div style={maxw}>
      <Header subtitle="Elige el caso · выбери дело" />
      <ScoreBadge session={session} />
      <p style={{ ...pHint, textAlign: "center", marginBottom: 18 }}>Две игры La Cata a Ciegas. Выбери, какую сегодня тренируешь:</p>
      {list.map((p) => (
        <div key={p.id} onClick={() => onPick(p)} style={{ background: C.card, borderRadius: 14, border: `1.5px solid ${p.id === "cap2" ? C.raspberry : C.gold}`, boxShadow: "0 2px 10px rgba(61,43,31,0.08)", marginBottom: 14, cursor: "pointer", display: "flex", overflow: "hidden" }}>
          <div style={{ width: 7, background: p.id === "cap2" ? C.raspberry : C.gold, flexShrink: 0 }} />
          <div style={{ padding: "16px 18px", flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".7px", color: C.goldDeep, textTransform: "uppercase" }}>{p.emoji} Capítulo {p.num} · {p.grammar}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: p.id === "cap2" ? C.raspberry : C.goldDeep, marginTop: 3, lineHeight: 1.25 }}>{p.titulo}</div>
            <div style={{ fontSize: 13.5, color: C.inkSoft, marginTop: 5, lineHeight: 1.5 }}>{p.desc}</div>
            <div style={{ fontSize: 12, color: C.emeraldDeep, fontWeight: 600, marginTop: 6 }}>{p.VERBS.length} глаголов · Detective · Canon · Fantasía</div>
          </div>
          <div style={{ fontSize: 22, color: C.gold, alignSelf: "center", paddingRight: 12 }}>›</div>
        </div>
      ))}
      {onBack && <div style={{ textAlign: "center", marginTop: 6 }}><button onClick={onBack} style={{ background: "none", border: "none", color: C.inkSoft, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: SERIF }}>← Назад</button></div>}
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <button onClick={onDiario} style={{ background: "none", border: "none", color: C.emeraldDeep, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: SERIF, textDecoration: "underline" }}>
          📔 Тренируешь только грамматику? Mi Diario →
        </button>
      </div>
      <Footer />
    </div></div>
  );
}

// ============================================================
// ВЫБОР РОЛИ
// ============================================================
function RolePicker({ pack = DEFAULT_PACK, onPick, session, onBack, onDiario }) {
  const [storyKey, setStoryKey] = useState(null);
  const story = storyKey ? pack.verbByKey(storyKey) : null;
  const cards = [
    { id: "detective", emoji: "🕵️", t: "Detective", d: "Два свидетеля: один говорит правду, другой лжёт. Задавай вопросы, сравнивай ответы и угадай глагол.", c: C.goldDeep },
    { id: "canon", emoji: "🟢", t: "Testigo Canon", d: "Ты знаешь правду. Отвечай строго по истории, не ошибись.", c: C.emerald },
    { id: "fantasia", emoji: "🔴", t: "Testigo Fantasía", d: "Ты врёшь красиво. Запутай детектива и уведи его от правды.", c: C.raspberry },
  ];
  return (
    <div style={wrap}><div style={maxw}>
      <Header subtitle={`Cap. ${pack.num} · ${pack.grammar} · elige tu rol`} />
      {onBack && <div style={{ textAlign: "center", marginBottom: 12 }}><button onClick={onBack} style={{ background: "none", border: `1.5px solid ${C.gold}`, color: C.goldDeep, fontSize: 13.5, fontWeight: 600, borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontFamily: SERIF }}>← Выбрать другую игру</button></div>}
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

      {/* БИБЛИОТЕКА ГЛАГОЛОВ — глаголы выбранной главы */}
      <div style={{ background: C.card, borderRadius: 14, border: `1.5px solid ${C.gold}`, boxShadow: "0 2px 10px rgba(61,43,31,0.08)", padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: C.goldDeep }}>📖 Глаголы игры — истории</div>
        <p style={{ ...pHint, marginTop: 4 }}>Тап по глаголу — его история поверх экрана. Все {pack.VERBS.length} глаголов главы.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {pack.VERBS.map((v) => (
            <button key={v.key} onClick={() => setStoryKey(v.key)} style={{ border: `1.5px solid ${C.line}`, background: C.card, color: C.ink, borderRadius: 12, padding: "8px 13px", fontSize: 14, fontFamily: SERIF, cursor: "pointer", fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>
              <div>{v.emoji} {v.inf}</div>
              <div style={{ fontSize: 11, opacity: 0.75, fontWeight: 400 }}>{v.ru}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 6 }}>
        <button onClick={onDiario} style={{ background: "none", border: "none", color: C.emeraldDeep, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: SERIF, textDecoration: "underline" }}>
          📔 Не играешь, а тренируешь грамматику? Mi Diario →
        </button>
      </div>
      <Footer />

      {/* ИСТОРИЯ ГЛАГОЛА — всплывает поверх экрана (как у детектива) */}
      <Sheet open={!!story} onClose={() => setStoryKey(null)} title={story ? `${story.emoji} ${story.inf} — ${story.ru}` : ""}>
        {story && <p style={{ fontSize: 15, lineHeight: 1.75, margin: 0 }}><Highlighted text={story.storyEs} /></p>}
      </Sheet>
    </div></div>
  );
}

// ============================================================
// ДЕТЕКТИВ — подсчёт баллов по числу вопросов
// ============================================================
function DetectiveMode({ pack = DEFAULT_PACK, onHome, onScore, session, onDiario }) {
  function freshGame() {
    const verb = pack.VERBS[rnd(pack.VERBS.length)];
    const canonIsA = Math.random() < 0.5;
    return { verb, canonIsA, deck: shuffle(pack.QUESTIONS), idx: 0, log: [], result: null };
  }
  const [g, setG] = useState(freshGame);
  const [guessing, setGuessing] = useState(false);
  const [storyKey, setStoryKey] = useState(null);
  const [askedInCurrent, setAskedInCurrent] = useState(new Set());
  const [ruledOut, setRuledOut] = useState(new Set()); // отметённые детективом глаголы (гашение вручную)
  function toggleRuled(k) {
    setRuledOut((prev) => { const s = new Set(prev); s.has(k) ? s.delete(k) : s.add(k); return s; });
  }

  const current = g.deck[g.idx % g.deck.length];
  const canonAns = g.verb.answers[current.id];
  const fantasyAns = pack.fantAnsOf(g.verb)[current.id];
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
  function reset() { setG(freshGame()); setGuessing(false); setStoryKey(null); setAskedInCurrent(new Set()); setRuledOut(new Set()); }

  const story = storyKey ? pack.verbByKey(storyKey) : null;

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
            {!g.result.ok && <> Ты поверил не тому свидетелю. Назвал: <strong>{pack.verbByKey(g.result.picked).inf}</strong> — {pack.verbByKey(g.result.picked).ru}.</>}
          </p>
          {g.result.ok && (
            <div style={{ marginTop: 10, background: C.goldSoft, border: `1px solid ${C.gold}`, borderRadius: 10, padding: "10px 14px", display: "inline-block" }}>
              <span style={{ fontSize: 13, color: C.goldDeep }}>Угадал за {g.result.qCount} вопросов · </span>
              <span style={{ fontSize: 22, fontWeight: 700, color: C.raspberry }}>+{g.result.pts}</span>
              <span style={{ fontSize: 13, color: C.goldDeep }}> {g.result.pts === 5 ? "🔥 Молниеносно!" : g.result.pts === 3 ? "👍 Хорошо!" : "✓ Угадал"}</span>
            </div>
          )}
          <p style={pHint}>Свидетель {g.canonIsA ? "A" : "B"} говорил правду (Канон). Свидетель {g.canonIsA ? "B" : "A"} лгал (Фантазия).</p>
          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <Btn bg={C.gold} onClick={reset}>🔄 Новый раунд</Btn>
            <Btn bg={C.emeraldDeep} onClick={onDiario}>📔 Закрепи глаголы в Mi Diario →</Btn>
          </div>
          {!g.result.ok && <p style={{ ...pHint, marginTop: 8 }}>Совет: впиши глаголы дня в Mi Diario — после этого их легче различать на допросе.</p>}
        </Block>
      )}

      {!g.result && (
        <>
          {/* ИСТОРИЯ ДОПРОСА */}
          <Block stripe={C.emerald}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={h2}>📋 История допроса</h2>
              <span style={{ fontSize: 13, color: C.inkSoft }}>{g.log.length} preguntas · новые сверху</span>
            </div>
            <div style={{ marginTop: 8, maxHeight: 200, overflowY: "auto" }}>
              {g.log.length === 0 && <p style={pHint}>Ещё ни одного вопроса. Задавай — один свидетель лжёт. Сравнивай ответы A и B.</p>}
              {(() => {
                const groups = [];
                g.log.forEach(e => {
                  const last = groups[groups.length - 1];
                  if (last && last.q === e.q && !last.entries.find(x => x.w === e.w)) {
                    last.entries.push(e);
                  } else {
                    groups.push({ q: e.q, entries: [e], num: groups.length + 1 });
                  }
                });
                return groups.slice().reverse().map((grp, i) => (
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

          {/* ВОПРОС — главное действие, сразу под историей допроса */}
          <Block stripe={C.goldDeep}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={tag}>{lvlName[current.lvl]}</div>
              <button onClick={nextQ} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "4px 12px", color: C.goldDeep, fontSize: 12.5, cursor: "pointer", fontFamily: SERIF, fontWeight: 600 }}>↻ Пропустить</button>
            </div>
            <div style={{ fontSize: 19, fontWeight: 600, color: C.ink, lineHeight: 1.4, background: C.cream, border: `1px solid ${C.line}`, borderRadius: 12, padding: "16px", margin: "8px 0 6px" }}>{current.q}</div>
            <div style={{ ...pHint, marginBottom: 8 }}>{current.ru}</div>
            {/* Счёт и правила баллов — сразу на виду */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.cream, borderRadius: 8, border: `1px dashed ${C.line}`, padding: "6px 11px", marginBottom: 12 }}>
              <span style={{ fontSize: 12.5, color: C.goldDeep, fontWeight: 700 }}>Задано: {g.log.length}</span>
              <span style={{ fontSize: 12, color: C.inkSoft }}>до 9 → <strong style={{ color: C.raspberry }}>+5</strong> · до 18 → <strong>+3</strong> · позже → <strong>+1</strong></span>
            </div>
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

          {/* ПРОВЕРЬ ГИПОТЕЗУ */}
          <Block stripe={C.raspberry}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 6 }}>
              <h2 style={h2}>Проверь гипотезу</h2>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: ruledOut.size ? C.emeraldDeep : C.inkSoft }}>
                Осталось {pack.VERBS.length - ruledOut.size} из {pack.VERBS.length}
              </span>
            </div>
            <p style={pHint}>Тап по глаголу — его история поверх экрана. Тап по ✕ — отмести глагол (погасить). Погашенные тускнеют, держать их в голове не нужно.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              {pack.VERBS.map((v) => {
                const out = ruledOut.has(v.key);
                return (
                  <div key={v.key} style={{ position: "relative", opacity: out ? 0.35 : 1 }}>
                    <button onClick={() => setStoryKey(v.key)} style={{ border: `1.5px solid ${C.line}`, background: C.card, color: C.ink, borderRadius: 12, padding: "8px 26px 8px 13px", fontSize: 14, fontFamily: SERIF, cursor: "pointer", fontWeight: 600, textAlign: "center", lineHeight: 1.3, textDecoration: out ? "line-through" : "none" }}>
                      <div>{v.emoji} {v.inf}</div>
                      <div style={{ fontSize: 11, opacity: 0.75, fontWeight: 400 }}>{v.ru}</div>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toggleRuled(v.key); }}
                      title={out ? "Вернуть глагол" : "Отмести глагол"}
                      style={{ position: "absolute", top: 3, right: 3, width: 22, height: 22, borderRadius: "50%", border: `1px solid ${out ? C.emerald : C.line}`, background: out ? C.emerald : C.cream, color: out ? "#fff" : C.inkSoft, fontSize: 11, fontWeight: 800, cursor: "pointer", lineHeight: 1, padding: 0 }}>
                      {out ? "↺" : "✕"}
                    </button>
                  </div>
                );
              })}
            </div>
            <Btn bg={C.raspberry} onClick={() => setGuessing(true)} style={{ marginTop: 14, width: "100%", fontSize: 16, padding: "13px" }}>🔍 Я готов · угадываю</Btn>
          </Block>
        </>
      )}

      <Footer onHome={onHome} />

      {/* ИСТОРИЯ ГЛАГОЛА — всплывает поверх экрана */}
      <Sheet open={!!story} onClose={() => setStoryKey(null)} title={story ? `${story.emoji} ${story.inf} — ${story.ru}` : ""}>
        {story && <p style={{ fontSize: 15, lineHeight: 1.75, margin: 0 }}><Highlighted text={story.storyEs} /></p>}
      </Sheet>

      {/* УГАДЫВАНИЕ — всплывает поверх экрана */}
      <Sheet open={guessing && !g.result} onClose={() => setGuessing(false)} title="Твоя версия — какой это глагол?">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {pack.VERBS.map((v) => {
            const out = ruledOut.has(v.key);
            return (
              <button key={v.key} onClick={() => guess(v.key)} style={{ border: `1.5px solid ${C.line}`, background: C.card, color: C.ink, borderRadius: 12, padding: "8px 14px", fontSize: 14.5, fontFamily: SERIF, cursor: "pointer", fontWeight: 600, textAlign: "center", lineHeight: 1.3, opacity: out ? 0.35 : 1, textDecoration: out ? "line-through" : "none" }}>
                <div>{v.emoji} {v.inf}</div>
                <div style={{ fontSize: 11, color: C.inkSoft, fontWeight: 400 }}>{v.ru}</div>
              </button>
            );
          })}
        </div>
      </Sheet>
    </div></div>
  );
}

// ============================================================
// СВИДЕТЕЛЬ — раунд 18 вопросов, система баллов
// ============================================================
function WitnessMode({ pack = DEFAULT_PACK, role, onHome, onScore, session, onDiario }) {
  const isCanon = role === "canon";
  const accent = isCanon ? C.emerald : C.raspberry;
  const accentDeep = isCanon ? C.emeraldDeep : C.raspberryDeep;

  const [verb, setVerb] = useState(() => pack.VERBS[rnd(pack.VERBS.length)]);
  const [deck, setDeck] = useState(() => shuffle(pack.QUESTIONS));
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
  const fantAns = liveFantAns(verb)[current.id]; // жёсткий ответ по легенде
  const isInZone = roundQ >= 9; // вопросы 10-18 (0-based: 9..17)

  function answer(my) {
    const correctAns = isCanon ? canonAns : fantAns;
    const ok = my === correctAns;
    const newErrors = isInZone && !ok ? roundErrors + 1 : roundErrors;
    const newRoundQ = roundQ + 1;

    setFeedback({ ok, my, correctAns, canonAns });
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
    if (newIdx % deck.length === 0) { setDeck(shuffle(pack.QUESTIONS)); setIdx(0); }
    else setIdx(newIdx);
    const newRoundQ = roundQ + 1;
    setRoundQ(newRoundQ);
    // Показать баннер при переходе к зоне оценки
    if (newRoundQ === 9) setShowZoneBanner(true);
    else setShowZoneBanner(false);
  }

  function startNextRound() {
    // Новый глагол + сброс раунда
    setVerb(pack.VERBS[rnd(pack.VERBS.length)]);
    setDeck(shuffle(pack.QUESTIONS));
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
          <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
            <Btn bg={C.emerald} onClick={startNextRound}>Следующий глагол →</Btn>
            <Btn bg={C.emeraldDeep} onClick={onDiario}>📔 Спряжение в Mi Diario →</Btn>
          </div>
          {roundErrors > 0 && <p style={{ ...pHint, marginTop: 8 }}>Были ошибки? Потренируй спряжение этого глагола в Mi Diario.</p>}
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

        {/* Легенда Фантазии — всегда видна, главный ориентир игрока */}
        {!isCanon && (
          <div style={{ marginTop: 12, background: "rgba(168,27,62,0.10)", border: `1.5px solid ${C.raspberry}`, borderRadius: 10, padding: "11px 13px" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.raspberry, letterSpacing: ".5px", marginBottom: 5 }}>🔴 ТВОЯ ЛЕГЕНДА — держись её до конца</div>
            <div style={{ fontSize: 14.5, color: C.ink, lineHeight: 1.45 }}>{liveFantVer(verb)}</div>
            <div style={{ marginTop: 8, fontSize: 12, color: C.inkSoft }}>Отвечай строго по этой версии. Каждое отклонение = ошибка.</div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <button onClick={() => setShowStory(true)} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "6px 14px", color: accentDeep, fontSize: 13, cursor: "pointer", fontFamily: SERIF, fontWeight: 600 }}>📖 Ver historia</button>
          <button onClick={() => setShowSheet(true)} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "6px 14px", color: accentDeep, fontSize: 13, cursor: "pointer", fontFamily: SERIF, fontWeight: 600 }}>{isCanon ? "📋 Шпаргалка Канона" : "📋 Ответы по легенде"}</button>
        </div>
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
                  : (feedback.ok ? "✓ Верно по легенде — держишь версию!" : "✗ Ошибка — твоя легенда говорит иначе.")}
              </div>
              {!feedback.ok && isInZone && (
                <div style={{ marginTop: 6, fontSize: 12.5, color: C.raspberry, fontWeight: 600 }}>
                  ⚠ Ошибка в зоне оценки — учитывается!
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, fontSize: 14, color: C.inkSoft }}>
                <span>Tú: <SiNo v={feedback.my} /></span>
                <span>· {isCanon ? "Канон" : "Легенда"}: <SiNo v={feedback.correctAns} /></span>
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

      {/* ИСТОРИЯ — поверх экрана */}
      <Sheet open={showStory} onClose={() => setShowStory(false)} title={`📖 ${verb.emoji} ${verb.inf} — historia`}>
        <p style={{ fontSize: 15, lineHeight: 1.75, margin: 0 }}><Highlighted text={verb.storyEs} /></p>
      </Sheet>

      {/* ШПАРГАЛКА — поверх экрана */}
      <Sheet open={showSheet} onClose={() => setShowSheet(false)} title={isCanon ? "🟢 Шпаргалка Канона" : "🔴 Ответы по легенде"}>
        {isCanon ? (
          <>
            <div style={{ background: C.emerald, color: "#fff", borderRadius: 8, padding: "5px 12px", display: "inline-block", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>🟢 CANON — solo esto es verdad</div>
            {verb.dossier.map(([q, a], i) => (
              <div key={i} style={{ display: "flex", padding: "5px 0", borderBottom: i < verb.dossier.length - 1 ? `1px dashed ${C.line}` : "none" }}>
                <div style={{ width: 110, flexShrink: 0, color: C.emeraldDeep, fontWeight: 600, fontSize: 13.5 }}>{q}</div>
                <div style={{ fontSize: 13.5 }}>{a}</div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div style={{ background: C.raspberry, color: "#fff", borderRadius: 8, padding: "5px 12px", display: "inline-block", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>🔴 ОТВЕТЫ ПО ТВОЕЙ ЛЕГЕНДЕ</div>
            {pack.QUESTIONS.map((q) => {
              const fa = liveFantAns(verb)[q.id];
              return (
                <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", borderBottom: `1px dashed ${C.line}` }}>
                  <div style={{ flex: 1, fontSize: 13, color: C.ink }}>{q.q}</div>
                  <BigSiNo v={fa} />
                </div>
              );
            })}
            <p style={{ ...pHint, marginTop: 8, color: C.raspberryDeep }}>Это ответы твоей версии. Тренируй их — не пытайся угадать "противоположность правды".</p>
          </>
        )}
      </Sheet>
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
function ConjTrainer({ startVerb, errorVerbs = [], onBack, onScore }) {
  const [verb, setVerb] = useState(startVerb || errorVerbs[0] || VERBS15[0]);
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(false);
  const [awardedVerbs, setAwardedVerbs] = useState(() => new Set());
  const correct = conjugate(verb);
  const allOk = PRON.every((p) => normES(vals[p.key]) === correct[p.key]);

  function pick(k) { setVerb(k); setVals({}); setChecked(false); }
  function comprobar() {
    setChecked(true);
    // +1 в копилку за идеально заполненную таблицу (один раз на глагол за визит)
    if (allOk && !awardedVerbs.has(verb)) {
      setAwardedVerbs(s => new Set([...s, verb]));
      if (onScore) onScore(1);
    }
  }

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
        {!checked && <Btn bg={C.gold} onClick={comprobar} style={{ marginTop: 14, width: "100%" }}>Comprobar</Btn>}
        {checked && !allOk && <Btn bg={C.raspberry} onClick={() => setChecked(false)} style={{ marginTop: 14, width: "100%" }}>Intentar de nuevo</Btn>}
        {checked && allOk && <div style={{ marginTop: 14, textAlign: "center", color: C.emeraldDeep, fontWeight: 700 }}>¡Perfecto! 🎉 Ya conoces este verbo. <span style={{ color: C.raspberry }}>+1 📔 в копилку</span></div>}
      </Block>

      <Btn bg={C.emerald} onClick={onBack} style={{ width: "100%" }}>← Volver al diario</Btn>
      <Footer />
    </div></div>
  );
}

// ---- Основной режим: Mi Diario ----
function DiarioMode({ onHome, onScore, session }) {
  const N = DIARIO.blanks.length;
  const [vals, setVals] = useState({});
  const [res, setRes] = useState({});          // i -> {st, verb?}
  const [everFailed, setEverFailed] = useState({});
  const [checked, setChecked] = useState(false);
  const [trainer, setTrainer] = useState(null);
  const [awardedPts, setAwardedPts] = useState(null); // очки за этот дневник (начисляются один раз)

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
    // Начисление очков в копилку — один раз за заполненный дневник
    const allNowOk = DIARIO.blanks.every((_, i) => r[i] && r[i].st === "ok");
    if (allNowOk && awardedPts === null) {
      const corrected = DIARIO.blanks.filter((_, i) => ef[i]).length;
      const pts = corrected === 0 ? 5 : corrected <= 2 ? 3 : 1;
      setAwardedPts(pts);
      if (onScore) onScore(pts);
    }
  }

  if (trainer) {
    return <ConjTrainer startVerb={trainer.startVerb} errorVerbs={errorVerbs} onScore={onScore} onBack={() => { setTrainer(null); setChecked(false); }} />;
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
          {awardedPts !== null && (
            <div style={{ marginTop: 10, background: C.goldSoft, border: `1px solid ${C.gold}`, borderRadius: 10, padding: "8px 16px", display: "inline-block" }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: C.raspberry }}>+{awardedPts}</span>
              <span style={{ fontSize: 13, color: C.goldDeep }}> 📔 в копилку!</span>
            </div>
          )}
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
      <ScoreBadge session={session} />

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

// ============================================================
// ТУР-ЗНАКОМСТВО — показывается при первом входе
// ============================================================
const TOUR_IMG = "https://i.ibb.co/LXwycrSh/Detective-game-app-characters-202606011428.jpg";

function tourSeen() {
  try { return localStorage.getItem("ciudad_tour_v1") === "1"; } catch { return false; }
}
function markTourSeen() {
  try { localStorage.setItem("ciudad_tour_v1", "1"); } catch { /* приватный режим — просто покажем тур снова */ }
}

const tourH = { fontSize: 21, fontWeight: 800, color: C.ink, fontFamily: SERIF, textAlign: "center", marginBottom: 4 };
const tourSub = { fontSize: 13, color: C.goldDeep, fontWeight: 600, textAlign: "center", letterSpacing: ".5px", marginBottom: 12 };
const tourP = { fontSize: 14.5, color: C.inkSoft, lineHeight: 1.65, textAlign: "center", margin: "0 0 6px" };
const tourEmoji = { fontSize: 46, textAlign: "center", marginBottom: 8, filter: "drop-shadow(0 4px 8px rgba(61,43,31,.18))" };

function TourRow({ icon, color, title, when, text }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.cream, border: `1px solid ${C.line}`, borderLeft: `5px solid ${color}`, borderRadius: 12, padding: "11px 13px", marginBottom: 9 }}>
      <div style={{ fontSize: 24, lineHeight: 1 }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color }}>{title}</div>
        {when && <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".7px", color: C.goldDeep, textTransform: "uppercase", margin: "1px 0 2px" }}>{when}</div>}
        <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.45 }}>{text}</div>
      </div>
    </div>
  );
}

function Tour({ onDone }) {
  const [i, setI] = useState(0);
  const LAST = 3;
  function finish() { markTourSeen(); onDone(); }

  const slides = [
    /* 0 — что это */
    <div key="s0">
      <img src={TOUR_IMG} alt="La Cata a Ciegas" style={{ width: "100%", borderRadius: 14, border: `1px solid ${C.line}`, boxShadow: "0 8px 26px rgba(61,43,31,.20)", marginBottom: 16, display: "block" }} />
      <div style={tourH}>🕵️ La Cata a Ciegas</div>
      <div style={tourSub}>ЛИНГВИСТИЧЕСКИЙ ДЕТЕКТИВ НА ИСПАНСКОМ</div>
      <p style={tourP}>В каждом раунде загадан один глагол. Один свидетель говорит правду, другой — красиво выдумывает. Детектив задаёт вопросы «да / нет» и вычисляет истину.</p>
    </div>,
    /* 1 — как проходит игра */
    <div key="s1">
      <div style={tourEmoji}>🎮</div>
      <div style={tourH}>Как проходит игра</div>
      <div style={tourSub}>ВЖИВУЮ · В ZOOM · ВСЕЙ КОМПАНИЕЙ</div>
      <p style={{ ...tourP, marginBottom: 14 }}>Встречаемся в Zoom и играем по ролям:</p>
      <TourRow icon="🕵️" color={C.goldDeep} title="Detective" text="Задаёт вопросы «да / нет», сравнивает ответы свидетелей и угадывает глагол." />
      <TourRow icon="🟢" color={C.emerald} title="Testigo Canon" text="Знает правду и отвечает строго по истории." />
      <TourRow icon="🔴" color={C.raspberry} title="Testigo Fantasía" text="Красиво врёт и уводит детектива от правды." />
    </div>,
    /* 2 — что внутри тренажёра и когда чем пользоваться */
    <div key="s2">
      <div style={tourEmoji}>🧭</div>
      <div style={tourH}>Что внутри тренажёра</div>
      <div style={tourSub}>И КОГДА ЧЕМ ПОЛЬЗОВАТЬСЯ</div>
      <TourRow icon="📖" color={C.gold} title="История и 15 глаголов" when="Начни отсюда" text="Все глаголы игры спрятаны в истории Карамельного дворца — прочитай её первой." />
      <TourRow icon="🕵️" color={C.goldDeep} title="Тренировка ролей" when="Между играми" text="Прокачай Детектива и обоих Свидетелей, зарабатывай очки." />
      <TourRow icon="📔" color={C.emeraldDeep} title="Mi Diario" when="Между играми" text="Дневник дня в Ciudad: впиши глаголы в правильной форме — тренировка спряжения." />
      <TourRow icon="🎮" color={C.raspberry} title="Пульт живой игры" when="Только во время Zoom-игры" text="Твой экран на самой игре. До игры сюда заходить не нужно." />
    </div>,
    /* 3 — старт */
    <div key="s3">
      <div style={tourEmoji}>✨</div>
      <div style={tourH}>¿Listo? · Готов начать?</div>
      <p style={{ ...tourP, marginTop: 10 }}>Начни с истории Карамельного дворца — в ней спрятаны все 15 глаголов игры. Потом выбирай роль и тренируйся.</p>
      <p style={{ ...tourP, fontWeight: 700, color: C.raspberry }}>Увидимся на игре 🍬</p>
    </div>,
  ];

  return (
    <div style={wrap}><div style={{ ...maxw, maxWidth: 480 }}>
      <style>{"@keyframes ciuFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }"}</style>
      <Header subtitle="Знакомство с тренажёром" />
      <div key={i} style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.line}`, boxShadow: "0 6px 22px rgba(61,43,31,.12)", padding: "22px 20px", animation: "ciuFadeUp .45s ease both" }}>
        {slides[i]}
      </div>
      {/* точки прогресса */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "16px 0" }}>
        {slides.map((_, d) => (
          <div key={d} onClick={() => setI(d)} style={{ width: d === i ? 26 : 9, height: 9, borderRadius: 5, background: d === i ? C.gold : C.line, border: `1px solid ${d === i ? C.goldDeep : C.line}`, cursor: "pointer", transition: "all .25s" }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={finish} style={{ flex: 1, background: "none", border: `1.5px solid ${C.line}`, color: C.inkSoft, borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: SERIF }}>Пропустить</button>
        <Btn bg={i === LAST ? C.raspberry : C.gold} onClick={() => (i === LAST ? finish() : setI(i + 1))} style={{ flex: 2, fontSize: 16, padding: "13px" }}>
          {i === LAST ? "Empezar · начать →" : "Дальше →"}
        </Btn>
      </div>
      <div style={{ fontSize: 12, color: C.goldDeep, marginTop: 18, textAlign: "center" }}>La Ciudad de los Sentidos 🍬 · v2.33</div>
    </div></div>
  );
}

// ============================================================
// ГЛАВНАЯ СТРАНИЦА (Bienvenida)
// ============================================================
function NavCard({ icon, color, title, when, text, onClick }) {
  return (
    <div onClick={onClick} style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.line}`, boxShadow: "0 2px 10px rgba(61,43,31,0.08)", marginBottom: 12, cursor: "pointer", display: "flex", overflow: "hidden" }}>
      <div style={{ width: 7, background: color, flexShrink: 0 }} />
      <div style={{ padding: "14px 16px", display: "flex", gap: 13, alignItems: "center", flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 28, lineHeight: 1 }}>{icon}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 16.5, fontWeight: 700, color }}>{title}</div>
          {when && <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".7px", color: C.goldDeep, textTransform: "uppercase", margin: "1px 0 2px" }}>{when}</div>}
          <div style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.45 }}>{text}</div>
        </div>
        <div style={{ fontSize: 20, color: C.gold }}>›</div>
      </div>
    </div>
  );
}

function Welcome({ onEnter, onDiario, onLive, onTour }) {
  const [ru, setRu] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [glosOpen, setGlosOpen] = useState(false);
  const [storyKey, setStoryKey] = useState(null);
  const story = storyKey ? verbByKey(storyKey) : null;
  return (
    <div style={wrap}><div style={maxw}>
      <Header subtitle="Bienvenido · добро пожаловать" />

      {/* Краткое напоминание сути + ссылка на тур */}
      <Block stripe={C.raspberry}>
        <div style={{ fontWeight: 700, color: C.ink, fontSize: 16, marginBottom: 6 }}>🕵️ La Cata a Ciegas — лингвистический детектив</div>
        <div style={{ ...pHint, fontSize: 13.5 }}>
          Один свидетель говорит правду (<strong style={{ color: C.emerald }}>Canon</strong>), другой красиво выдумывает (<strong style={{ color: C.raspberry }}>Fantasía</strong>). Детектив вопросами «да / нет» угадывает загаданный глагол. Здесь ты готовишься к живой игре в Zoom.
        </div>
        <button onClick={onTour} style={{ background: "none", border: "none", color: C.goldDeep, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0, marginTop: 8, fontFamily: SERIF, textDecoration: "underline" }}>❓ Как это работает — посмотреть знакомство</button>
      </Block>

      {/* История-маяк — раскрывашка */}
      <Block stripe={C.gold}>
        <div onClick={() => setStoryOpen(v => !v)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
          <div>
            <div style={{ fontWeight: 700, color: C.ink, fontSize: 16 }}>🗼 El día en el Palacio de Caramelo</div>
            <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>Прочитай историю — все 15 глаголов игры спрятаны в ней</div>
          </div>
          <span style={{ fontSize: 20, color: C.gold, transform: storyOpen ? "rotate(90deg)" : "none", transition: "transform .15s", flexShrink: 0, marginLeft: 8 }}>›</span>
        </div>
        {storyOpen && (
          <div style={{ marginTop: 12 }}>
            <div style={{ textAlign: "right", marginBottom: 8 }}>
              <button onClick={() => setRu(v => !v)} style={{ background: ru ? C.gold : C.goldSoft, border: `1.5px solid ${C.gold}`, color: ru ? "#fff" : C.goldDeep, borderRadius: 18, padding: "5px 13px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: SERIF }}>
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
          </div>
        )}
      </Block>

      {/* Глоссарий — раскрывашка */}
      <Block stripe={C.emerald}>
        <div onClick={() => setGlosOpen(v => !v)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
          <div style={{ fontWeight: 700, color: C.ink, fontSize: 15.5 }}>📖 Los 15 verbos · тап — история глагола</div>
          <span style={{ fontSize: 20, color: C.gold, transform: glosOpen ? "rotate(90deg)" : "none", transition: "transform .15s", flexShrink: 0, marginLeft: 8 }}>›</span>
        </div>
        {glosOpen && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 12 }}>
            {VERBS.map((v) => (
              <button key={v.key} onClick={() => setStoryKey(v.key)} style={{ background: C.creamDeep, border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5, cursor: "pointer", fontFamily: SERIF, textAlign: "left" }}>
                <strong style={{ color: C.raspberry }}>{v.emoji} {v.inf}</strong> <span style={{ color: C.inkSoft }}>— {v.ru}</span>
              </button>
            ))}
          </div>
        )}
      </Block>

      {/* Навигация */}
      <NavCard icon="🕵️" color={C.goldDeep} title="Тренировка ролей" when="Между играми"
        text="Detective · Canon · Fantasía. Прокачай роль и заработай очки перед игрой." onClick={onEnter} />
      <NavCard icon="📔" color={C.emeraldDeep} title="Mi Diario" when="Между играми"
        text="Впиши глаголы дня в правильной форме — тренировка спряжения." onClick={onDiario} />

      {/* Пульт — визуально отделён */}
      <div style={{ borderTop: `1px dashed ${C.line}`, margin: "16px 0 12px" }} />
      <NavCard icon="🎮" color={C.raspberry} title="Пульт живой игры" when="Только во время Zoom-игры"
        text="Твой экран на самой игре. До игры сюда заходить не нужно." onClick={onLive} />

      <div style={{ fontSize: 12, color: C.goldDeep, marginTop: 18, textAlign: "center" }}>La Ciudad de los Sentidos 🍬 · v2.33</div>

      {/* ИСТОРИЯ ГЛАГОЛА — всплывает поверх экрана (как у детектива) */}
      <Sheet open={!!story} onClose={() => setStoryKey(null)} title={story ? `${story.emoji} ${story.inf} — ${story.ru}` : ""}>
        {story && <p style={{ fontSize: 15, lineHeight: 1.75, margin: 0 }}><Highlighted text={story.storyEs} /></p>}
      </Sheet>
    </div></div>
  );
}

