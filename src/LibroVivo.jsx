import { useState, useRef, useEffect } from "react";

// ============================================================
// LIBRO VIVO — живая книга «Королевство Карамели»
// Пилот: Capítulo 1, fragmento 1. 10 листов, перелистывание ←/→.
// Каждый лист автономен: текст → аудио под ним, ответы скрыты до нажатия.
// Аудио лежат в public/audio (играют нативным <audio>).
// ============================================================

const C = {
  cream: "#FAF3E6", creamDeep: "#F3E8D2", card: "#FFFFFF",
  ink: "#3D2B1F", inkSoft: "#6B5544",
  gold: "#C9A24B", goldDeep: "#A67C2E", goldSoft: "#EBD9A8",
  raspberry: "#A81B3E", raspberryDeep: "#7E1430",
  emerald: "#16795B", emeraldDeep: "#0F5E47", line: "#E6D6B8",
};
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const wrap = { minHeight: "100vh", background: `radial-gradient(120% 80% at 50% 0%, ${C.cream} 0%, ${C.creamDeep} 100%)`, fontFamily: SERIF, color: C.ink, padding: "18px 14px 90px", boxSizing: "border-box" };
const maxw = { maxWidth: 560, margin: "0 auto" };

// ---------- контент ----------

const HOJA_ES = [
  "Nota de El Gran Jefe Alcalde. Hoja primera.",
  "Para ti, que lees esto.",
  "Tengo tres reinos. Tengo cinco ayudantes. Todos piensan que el mundo empieza hoy.",
  "No les digo la verdad. Tú tampoco, ¿vale?",
  "Son felices así.",
  "En mi primer reino, todo pasa ahora. Ese tiempo se llama Presente. Es como respirar: entra, sale, entra, sale.",
  "Mira bien. Sobre todo, mira al más pequeño. — E.G.J.A.",
];

const HISTORIA_ES = [
  "El palacio del Reino del Caramelo se despierta cada mañana igual. Primero llega la luz. El sol toca el tejado y entra por las grietas de los muros. Los muros son de caramelo de verdad: duro, dorado, con líneas finas como venas. Cuando el sol entra en esas líneas, los muros brillan. Parecen ríos de oro.",
  "Pero la mañana no empieza con el sol. La mañana empieza con Tomás.",
  "Tomás es el primer ayudante del Jefe. Se levanta antes que el sol. Se lava la cara con agua fría. Se pone el chaleco con botones dorados. Un botón siempre está flojo. Tomás siempre dice: «Hoy lo arreglo». Pero no lo arregla nunca.",
  "Coge su farol y camina por el pasillo.",
  "—Enciendo la luz —dice Tomás. Y la luz se enciende. Así, al momento.",
  "En el Reino del Caramelo, las palabras funcionan así: lo que dices, pasa ya. Nadie promete la luz para mañana. Y nadie habla de la luz de ayer. De hecho, en este reino no existe la palabra «ayer». No existe, porque nadie la necesita.",
  "Tomás enciende dieciocho faroles en el pasillo del este. Enciende doce en la escalera. Enciende veinticuatro en la Sala Grande. Cada farol despierta un poco más al palacio. El muro, cuando lo tocas, está tibio.",
  "—El palacio respira —dice Tomás cada mañana—. Todo va bien.",
];

// Вопросы Шефа (текстовая подсказка к аудио — дополнение, не основа)
const PREGUNTAS = [
  { q: "¿Cómo se despierta el palacio cada mañana?", a: "El palacio se despierta cada mañana igual." },
  { q: "¿Qué llega primero al palacio?", a: "Primero llega la luz." },
  { q: "¿Qué hace el sol con el tejado?", a: "El sol toca el tejado y entra por las grietas." },
  { q: "¿De qué son los muros del palacio?", a: "Los muros son de caramelo duro y dorado." },
  { q: "¿Qué hacen los muros cuando el sol entra en las líneas?", a: "Los muros brillan. Parecen ríos de oro." },
  { q: "¿Con quién empieza la mañana en el palacio?", a: "La mañana empieza con Tomás, no con el sol." },
  { q: "¿Quién es Tomás?", a: "Tomás es el primer ayudante del Jefe." },
  { q: "¿Cuándo se levanta Tomás?", a: "Se levanta antes que el sol." },
  { q: "¿Con qué se lava la cara Tomás?", a: "Se lava la cara con agua fría." },
  { q: "¿Qué se pone Tomás? ¿Cómo está un botón?", a: "Se pone el chaleco con botones dorados. Un botón siempre está flojo." },
  { q: "¿Qué dice Tomás del botón? ¿Lo arregla?", a: "Dice: «Hoy lo arreglo». Pero no lo arregla nunca." },
  { q: "¿Qué coge Tomás y por dónde camina?", a: "Coge su farol y camina por el pasillo." },
  { q: "¿Qué dice Tomás? ¿Y qué pasa con la luz?", a: "Dice: «Enciendo la luz». Y la luz se enciende al momento." },
  { q: "¿Cómo funcionan las palabras en el Reino del Caramelo?", a: "Lo que dices, pasa ya." },
  { q: "¿Alguien habla de la luz de mañana o de ayer?", a: "No. Nadie promete la luz para mañana y nadie habla de la luz de ayer." },
  { q: "¿Qué palabra no existe en este reino? ¿Por qué?", a: "No existe la palabra «ayer», porque nadie la necesita." },
  { q: "¿Cuántos faroles enciende Tomás en la Sala Grande?", a: "Enciende veinticuatro faroles en la Sala Grande." },
  { q: "¿Cómo está el muro cuando lo tocas?", a: "El muro está tibio." },
  { q: "¿Qué dice Tomás cada mañana sobre el palacio?", a: "Dice: «El palacio respira. Todo va bien»." },
  { q: "🔗 ¿Y tú? ¿Qué haces tú primero cada mañana, antes de todo?", a: "(por ejemplo) Yo enciendo la luz y preparo un café." },
];

// Palabras robadas: parts — текст между пропусками; blanks — {inf, opts, ok}
const ROBADAS = [
  { parts: ["El palacio ", " cada mañana igual."], blanks: [{ inf: "despertarse", opts: ["se despierta", "se despiertan", "me despierto"], ok: "se despierta" }] },
  { parts: ["El sol ", " el tejado y ", " por las grietas."], blanks: [
    { inf: "tocar", opts: ["toca", "tocas", "tocan"], ok: "toca" },
    { inf: "entrar", opts: ["entran", "entra", "entro"], ok: "entra" }] },
  { parts: ["Los muros ", " como ríos de oro."], blanks: [{ inf: "brillar", opts: ["brilla", "brillamos", "brillan"], ok: "brillan" }] },
  { parts: ["Tomás ", " antes que el sol."], blanks: [{ inf: "levantarse", opts: ["se levanta", "me levanto", "se levantan"], ok: "se levanta" }] },
  { parts: ["Tomás ", " su farol y ", " por el pasillo."], blanks: [
    { inf: "coger", opts: ["cojo", "coge", "cogen"], ok: "coge" },
    { inf: "caminar", opts: ["camina", "caminas", "caminamos"], ok: "camina" }] },
  { parts: ["—", " la luz —dice Tomás."], blanks: [{ inf: "encender, yo", opts: ["Enciende", "Encendemos", "Enciendo"], ok: "Enciendo" }] },
  { parts: ["En este reino no ", " la palabra «ayer»."], blanks: [{ inf: "existir", opts: ["existe", "existen", "existo"], ok: "existe" }] },
  { parts: ["El muro, cuando lo tocas, ", " tibio."], blanks: [{ inf: "estar", opts: ["estás", "está", "están"], ok: "está" }] },
  { parts: ["El palacio ", ". Todo ", " bien."], blanks: [
    { inf: "respirar", opts: ["respira", "respiro", "respiran"], ok: "respira" },
    { inf: "ir", opts: ["voy", "van", "va"], ok: "va" }] },
];

const HABLA = [
  { from: "Tomás dice: «Enciendo la luz».", to: "¿Cómo lo dice Nico? (nosotros)", ok: "Nosotros encendemos la luz." },
  { from: "Tomás dice: «Me lavo la cara con agua fría».", to: "¿Cómo lo dicen todos los ayudantes? (ellos)", ok: "Ellos se lavan la cara con agua fría." },
  { from: "Tomás dice: «Cojo mi farol y camino por el pasillo».", to: "¿Cómo lo dice Nico? (nosotros)", ok: "Nosotros cogemos nuestro farol y caminamos por el pasillo." },
];

const PRUEBAS = [
  { pista: "la casa grande del Jefe, con muros de caramelo", ru: "большой дом Шефа, со стенами из карамели", ok: "el palacio" },
  { pista: "la lámpara que Tomás enciende cada mañana", ru: "лампа-фонарь, которую Томас зажигает каждое утро", ok: "el farol" },
  { pista: "la pared del palacio; es de caramelo y está tibia", ru: "стена дворца; она из карамели и тёплая", ok: "el muro" },
  { pista: "la línea fina en el muro; por ahí entra el sol", ru: "тонкая трещинка в стене; через неё входит солнце", ok: "la grieta" },
  { pista: "el material dulce y dorado de los muros", ru: "сладкий золотой материал стен", ok: "el caramelo" },
  { pista: "la parte de arriba del palacio; el sol lo toca primero", ru: "крыша, верх дворца; солнце касается её первой", ok: "el tejado" },
  { pista: "la persona que trabaja para el Jefe", ru: "помощник, человек, который работает на Шефа", ok: "el ayudante" },
  { pista: "la ropa sin mangas que lleva Tomás", ru: "жилет, одежда без рукавов, которую носит Томас", ok: "el chaleco" },
  { pista: "la pieza pequeña del chaleco; una está floja", ru: "пуговица, маленькая деталь жилета; одна болтается", ok: "el botón" },
  { pista: "el camino largo dentro del palacio", ru: "коридор, длинный проход внутри дворца", ok: "el pasillo" },
  { pista: "los escalones para subir; ahí hay doce faroles", ru: "лестница, ступеньки; там двенадцать фонарей", ok: "la escalera" },
  { pista: "ni frío ni caliente; así está el muro", ru: "тёплый, ни холодный ни горячий; таким бывает стена", ok: "tibio" },
  { pista: "el día antes de hoy; esta palabra no existe en el reino", ru: "«вчера», день перед сегодня; этого слова нет в королевстве", ok: "«ayer»" },
  { pista: "tomar aire, como una persona viva; el palacio lo hace", ru: "дышать, вдыхать воздух, как живой; дворец это делает", ok: "respirar" },
];

const DOSSIER = [
  { v: "despertarse", nota: "e→ie", pres: "me despierto · te despiertas · se despierta · nos despertamos · os despertáis · se despiertan", perf: "me he despertado, te has despertado…" },
  { v: "encender", nota: "e→ie", pres: "enciendo · enciendes · enciende · encendemos · encendéis · encienden", perf: "he encendido, has encendido…" },
  { v: "coger", nota: "g→j en «yo»", pres: "cojo · coges · coge · cogemos · cogéis · cogen", perf: "he cogido, has cogido…" },
  { v: "estar", nota: "irregular", pres: "estoy · estás · está · estamos · estáis · están", perf: "he estado, has estado…" },
  { v: "ir", nota: "irregular", pres: "voy · vas · va · vamos · vais · van", perf: "he ido, has ido…" },
];

const DONDE = [
  { cita: "«Enciendo la luz»", q: "¿Quién lo dice? ¿Y qué pasa después?", a: "Lo dice Tomás. Toca el farol y la luz se enciende al momento." },
  { cita: "«Hoy lo arreglo»", q: "¿Quién lo dice? ¿Lo hace?", a: "Lo dice Tomás, del botón flojo. Pero no lo arregla nunca." },
  { cita: "«El palacio respira. Todo va bien»", q: "¿Quién lo dice y cuándo?", a: "Lo dice Tomás, cada mañana, cuando el muro está tibio." },
  { cita: "En este reino no existe una palabra…", q: "¿Cuál? ¿Por qué?", a: "La palabra «ayer». No existe porque nadie la necesita." },
];

const LEY = [
  "В Королевстве Карамели нет слова ayer. Это не правило из учебника — это закон самого мира. Когда Томас касается фонаря и говорит enciendo la luz, свет вспыхивает не потом и не «вчера», а сейчас, в ту же секунду: слово и дело — одно.",
  "Это время называется Presente. Оно живёт только в «сейчас», и потому во дворце всё повторяется одинаково каждое утро: Tomás enciende, el sol toca, los muros brillan. Даже стены здесь дышат в настоящем — el palacio respira, todo va bien, — и дышат прямо под твоей рукой.",
  "Пуговица Томаса болтается годами: он говорит hoy lo arreglo, но hoy тут длится вечно, а «завтра» ещё не родилось.",
  "Запомни этот закон. Где-то в этом дворце уже есть тонкая трещина, через которую в мир хочет войти другое время. Но об этом — на следующем листе. — Э.Г.Х.А.",
];

// ---------- мелкие детали ----------

// Иллюстрация-заглушка: карамельная текстура в золотой рамке (позже сюда встанет картинка)
function Ilustracion({ label = "Ilustración" }) {
  return (
    <div style={{ border: `2px solid ${C.gold}`, borderRadius: 14, padding: 5, marginBottom: 14, boxShadow: "0 2px 10px rgba(201,162,75,0.20)" }}>
      <div style={{
        height: 110, borderRadius: 10, position: "relative", overflow: "hidden",
        background: `repeating-linear-gradient(112deg, #E8B84B 0 26px, #D9A63C 26px 30px, #F0C86A 30px 58px, #C9932F 58px 61px)`,
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 120% at 30% 0%, rgba(255,255,255,0.38), rgba(255,255,255,0) 55%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ background: "rgba(255,255,255,0.85)", borderRadius: 999, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: C.goldDeep, letterSpacing: ".4px" }}>🖼 {label}</span>
        </div>
      </div>
    </div>
  );
}

function Audio({ src, label }) {
  return (
    <div style={{ marginTop: 14 }}>
      {label && <div style={{ fontSize: 12.5, fontWeight: 700, color: C.goldDeep, marginBottom: 6, letterSpacing: ".3px" }}>🎧 {label}</div>}
      <audio controls preload="none" src={src} style={{ width: "100%" }} />
    </div>
  );
}

// Кнопка «показать ответ» — ответы всегда скрыты до нажатия
function Reveal({ children, label = "Показать ответ" }) {
  const [open, setOpen] = useState(false);
  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ background: C.goldSoft, border: `1.5px solid ${C.gold}`, color: C.goldDeep, borderRadius: 10, padding: "7px 14px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: SERIF }}>
      ✅ {label}
    </button>
  );
  return <div style={{ background: "#F0F8F4", border: `1.5px solid ${C.emerald}`, borderRadius: 10, padding: "9px 13px", fontSize: 14.5, color: C.emeraldDeep, lineHeight: 1.55 }}>{children}</div>;
}

function Titulo({ emoji, es, ru }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 14 }}>
      <div style={{ fontSize: 30, marginBottom: 4 }}>{emoji}</div>
      <div style={{ fontSize: 21, fontWeight: 800, fontFamily: SERIF, color: C.ink, lineHeight: 1.2 }}>{es}</div>
      {ru && <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 4 }}>{ru}</div>}
    </div>
  );
}

function Instruccion({ children }) {
  return (
    <div style={{ background: "#FBF3E0", border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: "11px 14px", fontSize: 14, lineHeight: 1.6, color: C.ink, marginBottom: 14 }}>
      {children}
    </div>
  );
}

const cardS = { background: C.card, borderRadius: 16, border: `1.5px solid ${C.line}`, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", padding: "18px 16px" };

// ---------- листы ----------

function HojaJefe() {
  return (
    <div style={cardS}>
      <Titulo emoji="📜" es="Hoja del Jefe" ru="Записка Шефа — первый лист книги" />
      <Ilustracion label="El despacho del Jefe" />
      <Instruccion><b>Слушай записку Шефа</b> и следи глазами по тексту. Это его первый лист — он обращается лично к тебе.</Instruccion>
      <div style={{ fontStyle: "italic", fontSize: 15.5, lineHeight: 1.8 }}>
        {HOJA_ES.map((p, i) => <p key={i} style={{ margin: "0 0 8px" }}>{p}</p>)}
      </div>
      <Audio src="/audio/cap1-hoja_es.mp3" label="Nota del Jefe (español)" />
    </div>
  );
}

function Historia() {
  return (
    <div style={cardS}>
      <Titulo emoji="📖" es="La historia · fragmento 1" ru="История — читай и слушай художественную озвучку" />
      <Ilustracion label="La mañana del palacio" />
      <Instruccion><b>Сначала слушай</b> — художественная озвучка носителя. <b>Потом читай</b> и слушай ещё раз, следя по тексту.</Instruccion>
      <div style={{ fontSize: 15.5, lineHeight: 1.85 }}>
        {HISTORIA_ES.map((p, i) => <p key={i} style={{ margin: "0 0 10px" }}>{p}</p>)}
      </div>
      <Audio src="/audio/cap1-historia_es.mp3" label="Historia (español)" />
    </div>
  );
}

function JefePregunta() {
  const [textOpen, setTextOpen] = useState(false);
  return (
    <div style={cardS}>
      <Titulo emoji="🕵️" es="El Jefe pregunta" ru="Главное задание — на слух" />
      <Instruccion>
        <b>Слушай и отвечай на вопросы Шефа.</b> Всё уже в аудио:<br />
        1️⃣ Шеф читает фразу истории и задаёт вопрос.<br />
        2️⃣ Пауза — <b>отвечай ВСЛУХ, громко</b>. Не шёпотом, не про себя!<br />
        3️⃣ Слушай правильный ответ и повторяй его вслух.<br />
        Это тренировка аудирования и говорения одновременно. Текст ниже — только подсказка, если совсем не расслышал.
      </Instruccion>
      <Audio src="/audio/cap1-preguntas_y_respuestas.mp3" label="El Jefe pregunta — escucha y contesta" />
      <div style={{ marginTop: 16 }}>
        <button onClick={() => setTextOpen(o => !o)} style={{ background: "none", border: "none", color: C.goldDeep, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: SERIF, textDecoration: "underline", padding: 0 }}>
          {textOpen ? "▲ Скрыть текст вопросов" : "▼ Текст вопросов (подсказка, открывай только если не расслышал)"}
        </button>
        {textOpen && (
          <div style={{ marginTop: 12 }}>
            {PREGUNTAS.map((p, i) => (
              <div key={i} style={{ borderTop: i ? `1px dashed ${C.line}` : "none", padding: "10px 0" }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 7 }}>🕵️ {p.q}</div>
                <Reveal>{p.a}</Reveal>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Robadas() {
  // picks[itemIdx][blankIdx] = выбранный вариант
  const [picks, setPicks] = useState({});
  const pick = (i, b, opt) => setPicks(p => ({ ...p, [i + ":" + b]: opt }));
  return (
    <div style={cardS}>
      <Titulo emoji="⏳" es="Palabras robadas" ru="Время украло глаголы — верни их" />
      <Instruccion><b>Время украло глагол из каждой фразы.</b> Нажми на правильную форму — и <b>скажи всю фразу вслух</b>.</Instruccion>
      {ROBADAS.map((item, i) => (
        <div key={i} style={{ borderTop: i ? `1px dashed ${C.line}` : "none", padding: "12px 0" }}>
          <div style={{ fontSize: 15, lineHeight: 1.7 }}>
            {item.parts.map((part, pi) => (
              <span key={pi}>
                {part}
                {pi < item.blanks.length && (() => {
                  const chosen = picks[i + ":" + pi];
                  const ok = chosen === item.blanks[pi].ok;
                  return (
                    <span style={{
                      display: "inline-block", minWidth: 78, textAlign: "center", borderRadius: 8, padding: "1px 8px", fontWeight: 700,
                      background: chosen ? (ok ? "#E4F3EC" : "#F9E3E8") : C.goldSoft,
                      border: `1.5px solid ${chosen ? (ok ? C.emerald : C.raspberry) : C.gold}`,
                      color: chosen ? (ok ? C.emeraldDeep : C.raspberryDeep) : C.goldDeep,
                    }}>
                      {chosen || `(${item.blanks[pi].inf})`}
                    </span>
                  );
                })()}
              </span>
            ))}
          </div>
          {item.blanks.map((b, bi) => {
            const chosen = picks[i + ":" + bi];
            if (chosen === b.ok) return null; // угадано — кнопки убираем
            return (
              <div key={bi} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                <span style={{ fontSize: 12.5, color: C.inkSoft, alignSelf: "center" }}>{item.blanks.length > 1 ? `${bi + 1}) ${b.inf}:` : ""}</span>
                {b.opts.map(o => (
                  <button key={o} onClick={() => pick(i, bi, o)} style={{
                    background: chosen === o ? "#F9E3E8" : C.card, border: `1.5px solid ${chosen === o ? C.raspberry : C.line}`,
                    color: C.ink, borderRadius: 10, padding: "6px 13px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: SERIF,
                  }}>{o}</button>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function HablaPorOtro() {
  return (
    <div style={cardS}>
      <Titulo emoji="🎭" es="Habla por otro" ru="Скажи от лица другого персонажа" />
      <Instruccion>
        Карта королевства: <b>Tomás = yo</b> · <b>Nico = nosotros</b> · <b>todos los ayudantes = ellos</b>.<br />
        Прочитай фразу Томаса, <b>скажи её вслух от нового лица</b> — потом проверь.
      </Instruccion>
      {HABLA.map((h, i) => (
        <div key={i} style={{ borderTop: i ? `1px dashed ${C.line}` : "none", padding: "12px 0" }}>
          <div style={{ fontSize: 15, lineHeight: 1.65, marginBottom: 4 }}>{h.from}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.raspberryDeep, marginBottom: 8 }}>🎭 {h.to}</div>
          <Reveal>{h.ok}</Reveal>
        </div>
      ))}
    </div>
  );
}

function Pruebas() {
  return (
    <div style={cardS}>
      <Titulo emoji="🔎" es="Pruebas" ru="Загадки-улики: отгадай слово" />
      <Instruccion><b>Шеф описывает улику по-испански — отгадай слово.</b> Скажи его вслух, потом проверь. Это не словарь, это допрос твоей памяти.</Instruccion>
      {PRUEBAS.map((p, i) => (
        <div key={i} style={{ borderTop: i ? `1px dashed ${C.line}` : "none", padding: "11px 0" }}>
          <div style={{ fontSize: 15, lineHeight: 1.6, fontStyle: "italic" }}>«{p.pista}»</div>
          <div style={{ fontSize: 12.5, color: C.inkSoft, margin: "3px 0 8px" }}>{p.ru}</div>
          <Reveal label="Показать слово">{p.ok}</Reveal>
        </div>
      ))}
    </div>
  );
}

function Dossier() {
  return (
    <div style={cardS}>
      <Titulo emoji="📁" es="Dossier de verbos" ru="Досье глаголов листа — solo español" />
      <Instruccion><b>Прочитай каждое спряжение вслух</b> — сверху вниз, как считалку. Особые приметы глаголов выделены.</Instruccion>
      {DOSSIER.map((d, i) => (
        <div key={d.v} style={{ borderTop: i ? `1px dashed ${C.line}` : "none", padding: "12px 0" }}>
          <div style={{ fontSize: 16.5, fontWeight: 800, color: C.goldDeep }}>
            {d.v} <span style={{ fontSize: 12.5, fontWeight: 700, color: C.raspberryDeep, background: "#F9E3E8", borderRadius: 8, padding: "2px 8px", marginLeft: 6 }}>{d.nota}</span>
          </div>
          <div style={{ fontSize: 14.5, lineHeight: 1.6, marginTop: 6 }}><b>Presente:</b> {d.pres}</div>
          <div style={{ fontSize: 13.5, color: C.inkSoft, marginTop: 3 }}><b>Perfecto:</b> {d.perf}</div>
        </div>
      ))}
    </div>
  );
}

function DondeHaPasado() {
  return (
    <div style={cardS}>
      <Titulo emoji="🗂" es="¿Dónde ha pasado?" ru="Узнай сцену по цитате" />
      <Instruccion><b>Узнай сцену.</b> Прочитай цитату, <b>ответь вслух</b> на вопрос — потом проверь.</Instruccion>
      {DONDE.map((d, i) => (
        <div key={i} style={{ borderTop: i ? `1px dashed ${C.line}` : "none", padding: "12px 0" }}>
          <div style={{ fontSize: 15.5, fontWeight: 700, fontStyle: "italic", marginBottom: 4 }}>{d.cita}</div>
          <div style={{ fontSize: 14, color: C.raspberryDeep, fontWeight: 700, marginBottom: 8 }}>🕵️ {d.q}</div>
          <Reveal>{d.a}</Reveal>
        </div>
      ))}
    </div>
  );
}

function LeyDelReino() {
  return (
    <div style={cardS}>
      <Titulo emoji="⚖️" es="La ley del reino" ru="Физика мира — последний лист фрагмента" />
      <Ilustracion label="La grieta en el muro" />
      <div style={{ fontSize: 15, lineHeight: 1.85 }}>
        {LEY.map((p, i) => <p key={i} style={{ margin: "0 0 10px" }}>{p}</p>)}
      </div>
    </div>
  );
}

function CapituloRuso() {
  return (
    <div style={cardS}>
      <Titulo emoji="📖" es="Глава на русском" ru="Художественное чтение — только слушать" />
      <Ilustracion label="El Reino del Caramelo" />
      <Instruccion>
        Русская версия — <b>самостоятельное литературное произведение</b>, не перевод. Здесь нет упражнений: <b>просто слушай</b>, как аудиокнигу. Сначала вступление Шефа, потом глава.
      </Instruccion>
      <Audio src="/audio/cap1-hoja_ru.mp3" label="Записка Шефа (русский)" />
      <Audio src="/audio/cap1-historia_ru.mp3" label="Глава 1 — художественное чтение (русский)" />
    </div>
  );
}

// ---------- каркас с перелистыванием ----------

const HOJAS = [
  { id: "hoja", label: "📜", node: <HojaJefe /> },
  { id: "historia", label: "📖", node: <Historia /> },
  { id: "pregunta", label: "🕵️", node: <JefePregunta /> },
  { id: "robadas", label: "⏳", node: <Robadas /> },
  { id: "habla", label: "🎭", node: <HablaPorOtro /> },
  { id: "pruebas", label: "🔎", node: <Pruebas /> },
  { id: "dossier", label: "📁", node: <Dossier /> },
  { id: "donde", label: "🗂", node: <DondeHaPasado /> },
  { id: "ley", label: "⚖️", node: <LeyDelReino /> },
  { id: "ruso", label: "🇷🇺", node: <CapituloRuso /> },
];

export default function LibroVivo({ onBack }) {
  const [n, setN] = useState(0);
  const touch = useRef(null);
  const total = HOJAS.length;

  // при смене листа — вверх страницы (аудио умирает вместе с листом)
  useEffect(() => { window.scrollTo(0, 0); }, [n]);

  const go = (d) => setN(x => Math.max(0, Math.min(total - 1, x + d)));

  return (
    <div style={wrap}
      onTouchStart={e => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touch.current == null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}>
      <div style={maxw}>
        {/* шапка */}
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.2px", color: C.goldDeep, textTransform: "uppercase" }}>El Reino del Caramelo</div>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: SERIF, color: C.raspberry }}>📖 Libro Vivo</div>
          <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 2 }}>Capítulo 1 · fragmento 1 · hoja {n + 1} de {total}</div>
        </div>

        {/* лист */}
        <div key={HOJAS[n].id}>{HOJAS[n].node}</div>

        {/* точки прогресса */}
        <div style={{ display: "flex", justifyContent: "center", gap: 7, margin: "18px 0 10px" }}>
          {HOJAS.map((h, i) => (
            <button key={h.id} onClick={() => setN(i)} title={h.label} style={{
              width: i === n ? 22 : 9, height: 9, borderRadius: 999, border: "none", cursor: "pointer", padding: 0,
              background: i === n ? C.raspberry : (i < n ? C.gold : C.line), transition: "all .18s ease",
            }} />
          ))}
        </div>

        {/* навигация */}
        <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
          <button onClick={() => (n === 0 ? onBack && onBack() : go(-1))} style={{ flex: 1, background: C.card, border: `1.5px solid ${C.gold}`, color: C.goldDeep, borderRadius: 12, padding: "13px 10px", fontSize: 15.5, fontWeight: 700, cursor: "pointer", fontFamily: SERIF }}>
            ← {n === 0 ? "Выход" : "Назад"}
          </button>
          {n < total - 1 ? (
            <button onClick={() => go(1)} style={{ flex: 1.4, background: C.raspberry, border: "none", color: "#fff", borderRadius: 12, padding: "13px 10px", fontSize: 15.5, fontWeight: 700, cursor: "pointer", fontFamily: SERIF, boxShadow: "0 3px 12px rgba(168,27,62,0.25)" }}>
              Siguiente hoja →
            </button>
          ) : (
            <button onClick={() => onBack && onBack()} style={{ flex: 1.4, background: C.emerald, border: "none", color: "#fff", borderRadius: 12, padding: "13px 10px", fontSize: 15.5, fontWeight: 700, cursor: "pointer", fontFamily: SERIF, boxShadow: "0 3px 12px rgba(22,121,91,0.25)" }}>
              ✓ Fin del fragmento — на главную
            </button>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 22, fontSize: 12, color: C.inkSoft }}>La Ciudad de los Sentidos 🍬</div>
      </div>
    </div>
  );
}
