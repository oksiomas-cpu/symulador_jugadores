import { useState } from "react";

/* ============================================================
   LA CATA A CIEGAS — Симулятор игрока  /player  (v2)
   La Ciudad de los Sentidos · лингвистический детектив
   3 режима: Детектив · Свидетель Канона · Свидетель Фантасии
   — Детектив: ДВА свидетеля (один Канон/правда, один Фантасия/ложь),
     выбираешь кому задать вопрос. Кнопки 10 глаголов → история на
     испанском для сверки. Глагол скрыт.
   — Свидетели: тренировка ответов (правда / убедительная ложь).
   Вопросы — официальная «Шпаргалка Детектива» (воронка L1→L2→L3)
   + «Шеф делает это один?». Ответы сверены с Историей-маяк и досье.
   ============================================================ */

const C = {
  cream: "#FAF3E6", creamDeep: "#F3E8D2", card: "#FFFFFF",
  ink: "#3D2B1F", inkSoft: "#6B5544",
  gold: "#C9A24B", goldDeep: "#A67C2E", goldSoft: "#EBD9A8",
  raspberry: "#A81B3E", raspberryDeep: "#7E1430",
  emerald: "#16795B", emeraldDeep: "#0F5E47", line: "#E6D6B8",
};
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

// ---- Банк вопросов (официальная Шпаргалка Детектива, по уровням-воронке) ----
const QUESTIONS = [
  // Уровень 1 — категория
  { id: "n11", lvl: 1, q: "¿El Jefe hace esto?", ru: "Шеф делает это?" },
  { id: "m1",  lvl: 1, q: "¿El Jefe hace esto solo?", ru: "Шеф делает это один?" },
  { id: "n12", lvl: 1, q: "¿Los ayudantes también hacen esto?", ru: "Помощники тоже делают это?" },
  { id: "n13", lvl: 1, q: "¿Esto pasa dentro del palacio?", ru: "Это происходит внутри дворца?" },
  { id: "n14", lvl: 1, q: "¿Esto pasa fuera del palacio?", ru: "Это происходит вне дворца?" },
  { id: "n15", lvl: 1, q: "¿Esto pasa por la mañana?", ru: "Это происходит утром?" },
  { id: "n16", lvl: 1, q: "¿Esto ocurre todos los días?", ru: "Это происходит каждый день?" },
  // Уровень 2 — сужение
  { id: "n21", lvl: 2, q: "¿Se necesitan las manos para esto?", ru: "Нужны руки?" },
  { id: "n22", lvl: 2, q: "¿Se necesitan los ojos para esto?", ru: "Нужны глаза?" },
  { id: "n23", lvl: 2, q: "¿Se necesitan los oídos para esto?", ru: "Нужны уши?" },
  { id: "n24", lvl: 2, q: "¿Se necesita la voz para esto?", ru: "Нужен голос?" },
  { id: "n25", lvl: 2, q: "¿Se necesitan las piernas para esto?", ru: "Нужны ноги?" },
  { id: "n26", lvl: 2, q: "¿Se necesita un objeto o instrumento para esto?", ru: "Нужен предмет/инструмент?" },
  { id: "n27", lvl: 2, q: "¿Se necesita dinero para esto?", ru: "Нужны деньги?" },
  { id: "n28", lvl: 2, q: "¿Esto produce un sonido?", ru: "Это производит звук?" },
  { id: "n29", lvl: 2, q: "¿Después de esto llega una idea nueva?", ru: "После этого приходит новая идея?" },
  // Уровень 3 — точное попадание
  { id: "n31", lvl: 3, q: "¿Esto dura menos de quince minutos?", ru: "Длится меньше 15 минут?" },
  { id: "n32", lvl: 3, q: "¿Esto ocurre en la cocina?", ru: "Происходит на кухне?" },
  { id: "n33", lvl: 3, q: "¿Esto ocurre en la terraza?", ru: "Происходит на террасе?" },
  { id: "n34", lvl: 3, q: "¿El Jefe come o bebe algo durante esto?", ru: "Шеф ест или пьёт во время этого?" },
  { id: "n35", lvl: 3, q: "¿Hay silencio durante esto?", ru: "Во время этого тишина?" },
];

// ---- 10 глаголов: история (исп.) + досье (правда) + ответы Канона + маска Фантасии ----
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
      {onHome && <button onClick={onHome} style={{ background: "none", border: "none", color: C.inkSoft, fontSize: 13, textDecoration: "underline", cursor: "pointer", fontFamily: SERIF }}>← Cambiar de rol</button>}
      <div style={{ fontSize: 12, color: C.goldDeep, marginTop: 8 }}>La Ciudad de los Sentidos 🍬</div>
    </div>
  );
}
const wrap = { minHeight: "100vh", background: `radial-gradient(120% 80% at 50% 0%, ${C.cream} 0%, ${C.creamDeep} 100%)`, fontFamily: SERIF, color: C.ink, padding: "18px 14px 60px", boxSizing: "border-box" };
const maxw = { maxWidth: 560, margin: "0 auto" };

// ============================================================
export default function SimuladorJugador() {
  const [role, setRole] = useState(null);
  if (!role) return <RolePicker onPick={setRole} />;
  if (role === "detective") return <DetectiveMode onHome={() => setRole(null)} />;
  return <WitnessMode role={role} onHome={() => setRole(null)} />;
}

function RolePicker({ onPick }) {
  const cards = [
    { id: "detective", emoji: "🕵️", t: "Detective", d: "Dos testigos: uno dice la verdad, el otro miente. Pregunta, compara y adivina el verbo.", c: C.goldDeep },
    { id: "canon", emoji: "🟢", t: "Testigo Canon", d: "Conoces la verdad. Responde según la historia, sin equivocarte.", c: C.emerald },
    { id: "fantasia", emoji: "🔴", t: "Testigo Fantasía", d: "Mientes con elegancia. Confunde al detective y aléjalo de la verdad.", c: C.raspberry },
  ];
  return (
    <div style={wrap}><div style={maxw}>
      <Header subtitle="Elige tu rol para entrenar" />
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
//  ДЕТЕКТИВ — два свидетеля, выбор кому задать, кнопки глаголов с историей
// ============================================================
function DetectiveMode({ onHome }) {
  // загаданный глагол + случайное распределение ролей по свидетелям A/B
  function freshGame() {
    const verb = VERBS[rnd(VERBS.length)];
    const canonIsA = Math.random() < 0.5; // кто из A/B — Канон (правда)
    return { verb, canonIsA, deck: shuffle(QUESTIONS), idx: 0, log: [], result: null };
  }
  const [g, setG] = useState(freshGame);
  const [guessing, setGuessing] = useState(false);
  const [storyKey, setStoryKey] = useState(null); // открытая история глагола

  const current = g.deck[g.idx % g.deck.length];
  const canonAns = g.verb.answers[current.id];
  const fantasyAns = verbByKey(g.verb.mask).answers[current.id];
  const ansA = g.canonIsA ? canonAns : fantasyAns;
  const ansB = g.canonIsA ? fantasyAns : canonAns;

  function ask(witness) {
    const a = witness === "A" ? ansA : ansB;
    setG((s) => ({ ...s, log: [...s.log, { q: current.q, w: witness, a }], idx: (s.idx + 1) % s.deck.length }));
  }
  function nextQ() { setG((s) => ({ ...s, idx: (s.idx + 1) % s.deck.length })); }
  function guess(k) { setG((s) => ({ ...s, result: { ok: k === s.verb.key, picked: k } })); setGuessing(false); }
  function reset() { setG(freshGame()); setGuessing(false); setStoryKey(null); }

  const story = storyKey ? verbByKey(storyKey) : null;

  return (
    <div style={wrap}><div style={maxw}>
      <Header subtitle="🕵️ Modo Detective · un testigo miente" />

      {/* РЕЗУЛЬТАТ */}
      {g.result && (
        <Block stripe={g.result.ok ? C.emerald : C.raspberry}>
          <h2 style={{ ...h2, color: g.result.ok ? C.emeraldDeep : C.raspberryDeep }}>{g.result.ok ? "🎉 ¡Correcto!" : "❌ Casi..."}</h2>
          <p style={{ fontSize: 15, margin: "6px 0" }}>
            El verbo era <strong style={{ color: C.raspberry }}>{g.verb.emoji} {g.verb.inf}</strong> — {g.verb.ru}.
            {!g.result.ok && <> Seguiste al testigo equivocado: dijiste <strong>{verbByKey(g.result.picked).inf}</strong>.</>}
          </p>
          <p style={pHint}>El testigo {g.canonIsA ? "A" : "B"} decía la verdad (Canon). El testigo {g.canonIsA ? "B" : "A"} mentía (Fantasía).</p>
          <Btn bg={C.gold} onClick={reset} style={{ marginTop: 10 }}>🔄 Otra ronda</Btn>
        </Block>
      )}

      {/* ДИАЛОГ — СВЕРХУ */}
      <Block stripe={C.emerald}>
        <h2 style={h2}>📋 Historia del interrogatorio</h2>
        <div style={{ marginTop: 8, maxHeight: 200, overflowY: "auto" }}>
          {g.log.length === 0 && <p style={pHint}>Aún no preguntas nada. Recuerda: un testigo miente. Compara sus respuestas.</p>}
          {g.log.map((e, i) => (
            <div key={i} style={{ marginBottom: 9, paddingBottom: 9, borderBottom: i < g.log.length - 1 ? `1px dashed ${C.line}` : "none" }}>
              <div style={{ fontSize: 13.5, color: C.ink, marginBottom: 4 }}><span style={{ color: C.goldDeep, fontWeight: 700 }}>#{i + 1}</span> {e.q}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: "#fff", background: e.w === "A" ? C.goldDeep : C.inkSoft, borderRadius: 6, padding: "1px 9px", fontWeight: 600 }}>Testigo {e.w}</span>
                <SiNo v={e.a} />
              </div>
            </div>
          ))}
        </div>
      </Block>

      {!g.result && (
        <>
          {/* ВОПРОС + ВЫБОР СВИДЕТЕЛЯ */}
          <Block stripe={C.goldDeep}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={tag}>{lvlName[current.lvl]}</div>
              <button onClick={nextQ} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "4px 12px", color: C.goldDeep, fontSize: 12.5, cursor: "pointer", fontFamily: SERIF, fontWeight: 600 }}>↻ Otra pregunta</button>
            </div>
            <div style={{ fontSize: 19, fontWeight: 600, color: C.ink, lineHeight: 1.4, background: C.cream, border: `1px solid ${C.line}`, borderRadius: 12, padding: "16px", margin: "8px 0 6px" }}>{current.q}</div>
            <div style={{ ...pHint, marginBottom: 12 }}>{current.ru}</div>
            <div style={{ fontSize: 13.5, color: C.inkSoft, marginBottom: 6 }}>¿A quién se lo preguntas?</div>
            <div style={{ display: "flex", gap: 12 }}>
              <Btn bg={C.goldDeep} onClick={() => ask("A")} style={{ flex: 1 }}>Preguntar a A</Btn>
              <Btn bg={C.inkSoft} onClick={() => ask("B")} style={{ flex: 1 }}>Preguntar a B</Btn>
            </div>
          </Block>

          {/* КНОПКИ ГЛАГОЛОВ — сверка с историей */}
          <Block stripe={C.raspberry}>
            <h2 style={h2}>Verificar una hipótesis</h2>
            <p style={pHint}>Pulsa un verbo para leer su historia (en español) y comparar con las respuestas.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              {VERBS.map((v) => (
                <button key={v.key} onClick={() => setStoryKey(v.key)} style={{ border: `1.5px solid ${storyKey === v.key ? C.raspberry : C.line}`, background: storyKey === v.key ? C.raspberry : C.card, color: storyKey === v.key ? "#fff" : C.ink, borderRadius: 999, padding: "8px 13px", fontSize: 14, fontFamily: SERIF, cursor: "pointer", fontWeight: 600 }}>{v.emoji} {v.inf}</button>
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
            <Btn bg={C.raspberry} onClick={() => setGuessing(true)} style={{ marginTop: 14 }}>🔍 Estoy listo · adivinar</Btn>

            {guessing && (
              <div style={{ marginTop: 14, background: C.card, border: `1.5px solid ${C.raspberry}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 10 }}>Acusación final — ¿qué verbo es?</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {VERBS.map((v) => (
                    <button key={v.key} onClick={() => guess(v.key)} style={{ border: `1.5px solid ${C.line}`, background: C.card, color: C.ink, borderRadius: 999, padding: "8px 14px", fontSize: 14.5, fontFamily: SERIF, cursor: "pointer", fontWeight: 600 }}>{v.emoji} {v.inf}</button>
                  ))}
                  <button onClick={() => setGuessing(false)} style={{ border: "none", background: "#B0A48C", color: "#fff", borderRadius: 999, padding: "8px 14px", fontSize: 14, fontFamily: SERIF, cursor: "pointer" }}>Cancelar</button>
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
//  СВИДЕТЕЛЬ (Канон / Фантасия)
// ============================================================
function WitnessMode({ role, onHome }) {
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

  const current = deck[idx % deck.length];
  const canonAns = verb.answers[current.id];

  function answer(my) {
    const ok = isCanon ? my === canonAns : my !== canonAns;
    setFeedback({ ok, my, canonAns });
    setScore((s) => ({ good: s.good + (ok ? 1 : 0), total: s.total + 1 }));
  }
  function next() {
    setFeedback(null);
    if ((idx + 1) % deck.length === 0) { setDeck(shuffle(QUESTIONS)); setIdx(0); }
    else setIdx((i) => i + 1);
  }
  function newVerb() { setVerb(VERBS[rnd(VERBS.length)]); setDeck(shuffle(QUESTIONS)); setIdx(0); setFeedback(null); setShowStory(false); setShowSheet(false); }

  return (
    <div style={wrap}><div style={maxw}>
      <Header subtitle={isCanon ? "🟢 Modo Testigo Canon · di la verdad" : "🔴 Modo Testigo Fantasía · miente con arte"} />

      <Block stripe={accent}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={tag}>Tu verbo</div>
            <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.1, color: C.ink }}>{verb.emoji} {verb.inf}</div>
            <div style={{ color: C.inkSoft, fontSize: 15, fontStyle: "italic" }}>{verb.ru}</div>
          </div>
          <Btn bg={C.gold} onClick={newVerb} style={{ padding: "8px 12px", fontSize: 13 }}>🔄 Otro</Btn>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <button onClick={() => setShowStory((s) => !s)} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "6px 14px", color: accentDeep, fontSize: 13, cursor: "pointer", fontFamily: SERIF, fontWeight: 600 }}>{showStory ? "▲ Ocultar historia" : "▼ Ver historia"}</button>
          <button onClick={() => setShowSheet((s) => !s)} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "6px 14px", color: accentDeep, fontSize: 13, cursor: "pointer", fontFamily: SERIF, fontWeight: 600 }}>{showSheet ? "▲ Ocultar chuleta" : "▼ Ver chuleta (la verdad)"}</button>
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
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, fontSize: 14, color: C.inkSoft }}>
              <span>Tú: <SiNo v={feedback.my} /></span>
              <span>· El canon: <SiNo v={feedback.canonAns} /></span>
            </div>
            <Btn bg={C.gold} onClick={next} style={{ marginTop: 14 }}>Siguiente pregunta →</Btn>
          </div>
        )}
      </Block>

      <Block stripe={C.emerald}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600 }}>{isCanon ? "Respuestas correctas" : "Mentiras logradas"}</span>
          <span style={{ fontWeight: 700, fontSize: 20, color: accentDeep }}>{score.good} / {score.total}</span>
        </div>
      </Block>

      <Footer onHome={onHome} />
    </div></div>
  );
}
