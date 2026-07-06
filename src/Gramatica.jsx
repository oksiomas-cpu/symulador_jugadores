import { useState } from "react";

// ============================================================
// GRAMÁTICA — грамматический справочник Ciudad.
// Архитектура (согласована 6 июля 2026):
//   Корень = части речи (пока только EL VERBO, место под остальные заложено).
//   EL VERBO = три ветки:
//     I.  Устройство глагола (фундамент, вне времён)
//     II. Времена (растёт бесконечно; неправильности — слои ВНУТРИ времени)
//     III. Особые типы глаголов (сквозные явления: возвратные и т.д.)
//   Уровень (A1/A2/B1) — метка на теме, НЕ принцип организации.
//   Правило по-русски → таблица → сноски-паттерны → примеры из вселенной → тренажёр.
//   Примеры ТОЛЬКО из канона: книга «Королевство Карамели» + глаголы игр.
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

// ---------- мелкие компоненты ----------
function LevelTag({ lvl }) {
  return (
    <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".6px", color: "#fff", background: C.emerald, borderRadius: 999, padding: "3px 9px", verticalAlign: "middle" }}>{lvl}</span>
  );
}
function SoonTag() {
  return (
    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".6px", color: C.inkSoft, background: C.creamDeep, border: `1px solid ${C.line}`, borderRadius: 999, padding: "3px 9px", verticalAlign: "middle" }}>скоро</span>
  );
}
function BackBtn({ onClick, label = "← Назад" }) {
  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <button onClick={onClick} style={{ background: "none", border: "none", color: C.inkSoft, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: SERIF }}>{label}</button>
    </div>
  );
}
function GHeader({ kicker, title, sub }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: C.goldDeep, textTransform: "uppercase", marginBottom: 6 }}>{kicker}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: C.raspberry, fontFamily: SERIF, lineHeight: 1.15 }}>{title}</div>
      {sub && <div style={{ fontSize: 13.5, color: C.inkSoft, marginTop: 8, lineHeight: 1.55 }}>{sub}</div>}
    </div>
  );
}

// ---------- таблица спряжения ----------
const PERSONS = ["yo", "tú", "él / ella / usted", "nosotros/-as", "vosotros/-as", "ellos / ellas / ustedes"];
function ConjTable({ cols }) {
  // cols: [{ inf, ru, forms: [6], hl: [indices to highlight endings? simple bold ending] }]
  return (
    <div style={{ margin: "14px 0" }}>
      <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", background: C.card, borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 10px rgba(61,43,31,0.08)" }}>
        <thead>
          <tr>
            <th style={thS}></th>
            {cols.map(c => (
              <th key={c.inf} style={thS}>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.raspberry }}>{c.inf.slice(0, -2)}<span style={{ color: C.goldDeep }}>{c.inf.slice(-2)}</span></div>
                <div style={{ fontSize: 11, fontWeight: 400, color: C.inkSoft }}>{c.ru}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERSONS.map((p, i) => (
            <tr key={p} style={{ background: i % 2 ? C.cream : C.card }}>
              <td style={{ ...tdS, fontStyle: "italic", color: C.inkSoft, fontSize: 12.5, whiteSpace: "nowrap" }}>{p}</td>
              {cols.map(c => {
                const f = c.forms[i]; const cut = f.length - c.endLen[i];
                return (
                  <td key={c.inf + i} style={{ ...tdS, fontSize: 15 }}>
                    {f.slice(0, cut)}<b style={{ color: C.goldDeep }}>{f.slice(cut)}</b>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {typeof window !== "undefined" && window.innerWidth < 480 && (
        <div style={{ textAlign: "center", fontSize: 12, color: C.inkSoft, marginTop: 6 }}>
          ↻ Тесно? Переверни телефон горизонтально — таблица встанет целиком
        </div>
      )}
    </div>
  );
}
const thS = { padding: "10px 8px", borderBottom: `2px solid ${C.gold}`, textAlign: "left", fontFamily: SERIF };
const tdS = { padding: "8px 8px", borderBottom: `1px solid ${C.line}`, fontFamily: SERIF };

// ---------- карточка правила ----------
function RuleCard({ children }) {
  return (
    <div style={{ background: C.card, borderRadius: 14, padding: "18px 18px", border: `1.5px solid ${C.line}`, boxShadow: "0 2px 10px rgba(61,43,31,0.06)", marginBottom: 14, fontSize: 15, lineHeight: 1.65 }}>
      {children}
    </div>
  );
}
function Nota({ children }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", margin: "8px 0", fontSize: 13.5, color: C.inkSoft, lineHeight: 1.55 }}>
      <span style={{ color: C.gold, fontWeight: 800 }}>✦</span><span>{children}</span>
    </div>
  );
}
function Ejemplo({ es, ru }) {
  return (
    <div style={{ borderLeft: `3px solid ${C.gold}`, padding: "6px 12px", margin: "10px 0", background: C.cream, borderRadius: "0 10px 10px 0" }}>
      <div style={{ fontSize: 15, color: C.ink }} dangerouslySetInnerHTML={{ __html: es }} />
      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>{ru}</div>
    </div>
  );
}

// ============================================================
// ТЕМА I.1 — Инфинитив и три спряжения
// ============================================================
function TemaInfinitivo({ onBack, onTrain }) {
  return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker="El verbo · I. Устройство глагола" title="Инфинитив и три спряжения" />
      <div style={{ textAlign: "center", marginBottom: 14 }}><LevelTag lvl="A1" /></div>

      <RuleCard>
        <b>Инфинитив</b> — это «имя» глагола, его словарная форма: <i>cantar</i> — петь, <i>comer</i> — есть, <i>vivir</i> — жить. Так глагол записан в словаре — и в Списке Бруно у дворцовых ворот.
        <div style={{ marginTop: 10 }}>
          Все испанские глаголы делятся на <b>три группы (спряжения)</b> — по последним двум буквам инфинитива:
        </div>
        <div style={{ display: "flex", gap: 10, margin: "14px 0 6px", textAlign: "center" }}>
          {[["-AR", "1-я группа", "cantar · preparar · caminar"], ["-ER", "2-я группа", "comer · beber · aprender"], ["-IR", "3-я группа", "vivir · abrir · subir"]].map(([e, g, ex]) => (
            <div key={e} style={{ flex: 1, background: C.cream, border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: "10px 6px" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.raspberry }}>{e}</div>
              <div style={{ fontSize: 11, color: C.inkSoft, margin: "2px 0 6px" }}>{g}</div>
              <div style={{ fontSize: 11.5, color: C.goldDeep, lineHeight: 1.5 }}>{ex}</div>
            </div>
          ))}
        </div>
      </RuleCard>

      <RuleCard>
        <b>Зачем это знать?</b> Группа решает, какие окончания глагол получит в каждом времени. Узнал последние две буквы инфинитива — знаешь, по какому правилу он живёт.
        <Nota>Убери у инфинитива <b>-ar / -er / -ir</b> — останется <b>корень</b> (la raíz): cant-, com-, viv-. Корень несёт смысл, окончание — грамматику.</Nota>
        <Ejemplo es="prepar<b>ar</b> → prepar- + окончание" ru="Люсия каждое утро: prepara el desayuno — готовит завтрак" />
      </RuleCard>

      <RuleCard>
        <b>Вот как это работает в Presente</b> — у каждой группы свой набор окончаний, по одному на каждое лицо:
      </RuleCard>

      <ConjTable cols={[
        { inf: "cantar", ru: "петь", forms: ["canto", "cantas", "canta", "cantamos", "cantáis", "cantan"], endLen: [1, 2, 1, 4, 4, 2] },
        { inf: "comer", ru: "есть", forms: ["como", "comes", "come", "comemos", "coméis", "comen"], endLen: [1, 2, 1, 4, 4, 2] },
        { inf: "vivir", ru: "жить", forms: ["vivo", "vives", "vive", "vivimos", "vivís", "viven"], endLen: [1, 2, 1, 4, 2, 2] },
      ]} />

      <RuleCard>
        <Nota>Золотым выделены окончания — это и есть «почерк» группы. Подробный разбор Presente со всеми наблюдениями — в ветке <b>II. Времена</b>.</Nota>
      </RuleCard>

      <TrainBtn onClick={onTrain} />
      <BackBtn onClick={onBack} />
    </div></div>
  );
}

// ============================================================
// ТЕМА I.2 — Шесть лиц: корень + окончание
// ============================================================
function TemaPersonas({ onBack, onTrain }) {
  return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker="El verbo · I. Устройство глагола" title="Шесть лиц: корень + окончание" />
      <div style={{ textAlign: "center", marginBottom: 14 }}><LevelTag lvl="A1" /></div>

      <RuleCard>
        В каждом времени у глагола <b>шесть форм</b> — по одной на каждое грамматическое лицо:
        <table style={{ borderCollapse: "collapse", width: "100%", margin: "12px 0 4px", fontSize: 14 }}>
          <tbody>
            {[
              ["yo", "я", "Томас о себе: «Enciendo la luz»"],
              ["tú", "ты", "так говорят с Люсией"],
              ["él / ella / usted", "он / она / Вы", "Матео, Люсия — или вежливое Вы"],
              ["nosotros / nosotras", "мы", "Нико о помощниках вместе"],
              ["vosotros / vosotras", "вы (все)", "так Шеф обращается к читателям"],
              ["ellos / ellas / ustedes", "они / Вы (мн.)", "Бруно о тех, кто в Списке"],
            ].map(([es, ru, who], i) => (
              <tr key={es} style={{ background: i % 2 ? C.cream : "transparent" }}>
                <td style={{ padding: "6px 8px", fontWeight: 700, color: C.raspberry, whiteSpace: "nowrap" }}>{es}</td>
                <td style={{ padding: "6px 8px", color: C.ink, whiteSpace: "nowrap" }}>{ru}</td>
                <td style={{ padding: "6px 8px", color: C.inkSoft, fontSize: 12 }}>{who}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </RuleCard>

      <RuleCard>
        <b>Формула любой формы:</b>
        <div style={{ textAlign: "center", fontSize: 18, margin: "10px 0", color: C.ink }}>
          <span style={{ color: C.raspberry, fontWeight: 800 }}>корень</span> + <span style={{ color: C.goldDeep, fontWeight: 800 }}>окончание лица</span>
        </div>
        Окончание работает как подпись: по нему видно, <i>кто</i> действует, — поэтому испанцы часто опускают местоимение.
        <Ejemplo es="<b>Preparo</b> el desayuno." ru="= «(я) готовлю завтрак» — окончание -o уже сказало, что это yo" />
        <Nota>В книге слуги Королевства так и говорят: <i>«Enciendo la luz» — dice Tomás</i>. Без «yo» — свет и так знает, кто его зажёг.</Nota>
      </RuleCard>

      <TrainBtn onClick={onTrain} />
      <BackBtn onClick={onBack} />
    </div></div>
  );
}

// ============================================================
// ТЕМА II.1 — Presente de indicativo: регулярные глаголы
// ============================================================
function TemaPresenteRegulares({ onBack, onTrain }) {
  return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker="El verbo · II. Времена · Presente de indicativo" title="Регулярные глаголы" sub="Первое Королевство живёт только в этом времени: то, что говоришь, происходит сейчас." />
      <div style={{ textAlign: "center", marginBottom: 14 }}><LevelTag lvl="A1" /></div>

      <RuleCard>
        <b>Presente de indicativo</b> — настоящее время. Им говорят о том, что происходит сейчас, происходит регулярно или верно всегда:
        <Ejemplo es="Tomás <b>enciende</b> dieciocho faroles cada mañana." ru="привычка: Томас зажигает 18 фонарей каждое утро" />
        <Ejemplo es="Lucía <b>prepara</b> el desayuno." ru="прямо сейчас: Люсия готовит завтрак" />
        <div style={{ marginTop: 8 }}>
          <b>Регулярный глагол</b> — тот, что спрягается строго по правилу своей группы: корень не меняется, окончания стандартные. Таких глаголов — большинство.
        </div>
      </RuleCard>

      <ConjTable cols={[
        { inf: "cantar", ru: "петь", forms: ["canto", "cantas", "canta", "cantamos", "cantáis", "cantan"], endLen: [1, 2, 1, 4, 4, 2] },
        { inf: "comer", ru: "есть", forms: ["como", "comes", "come", "comemos", "coméis", "comen"], endLen: [1, 2, 1, 4, 4, 2] },
        { inf: "vivir", ru: "жить", forms: ["vivo", "vives", "vive", "vivimos", "vivís", "viven"], endLen: [1, 2, 1, 4, 2, 2] },
      ]} />

      <RuleCard>
        <Nota><b>yo всегда на -o</b> — во всех трёх группах: canto, como, vivo.</Nota>
        <Nota><b>-ER и -IR почти близнецы:</b> их окончания совпадают везде, кроме nosotros (-emos / -imos) и vosotros (-éis / -ís).</Nota>
        <Nota>У групп есть «фирменная гласная»: -AR держит <b>a</b> (cantas, canta, cantamos…), -ER держит <b>e</b> (comes, come, comemos…).</Nota>
      </RuleCard>

      <RuleCard>
        <b>Так это звучит в Королевстве:</b>
        <Ejemplo es="—Enciendo la luz —dice Tomás. Y la luz se enciende." ru="слова в Королевстве работают сразу: сказал — произошло" />
        <Ejemplo es="Los ayudantes <b>cantan</b> juntos una canción de trabajo." ru="помощники поют вместе рабочую песню (ellos → -an)" />
        <Ejemplo es="Bruno <b>abre</b> su lista: la lista de quién entra hoy." ru="Бруно открывает свой Список (él → -e)" />
        <Ejemplo es="El Jefe <b>desayuna</b> solo en su terraza favorita." ru="Шеф завтракает один на любимой террасе (él → -a)" />
      </RuleCard>

      <TrainBtn onClick={onTrain} />
      <BackBtn onClick={onBack} />
    </div></div>
  );
}

function TrainBtn({ onClick }) {
  return (
    <div onClick={onClick} style={{ background: C.raspberry, borderRadius: 16, padding: "16px 20px", cursor: "pointer", textAlign: "center", boxShadow: "0 4px 16px rgba(168,27,62,0.22)", marginTop: 6 }}>
      <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", fontFamily: SERIF }}>⚡ Тренировать</div>
      <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", marginTop: 3 }}>Проверь себя на глаголах Королевства</div>
    </div>
  );
}

// ============================================================
// МИНИ-ТРЕНАЖЁР — вставка форм (регулярные Presente)
// ============================================================
const DRILLS = {
  // I.1 — определи группу глагола по инфинитиву
  grupos: [
    { pre: "preparar — готовить. Какая группа?", gap: "", inf: "Lucía prepara el desayuno", ok: "-AR (1-я)", opts: ["-AR (1-я)", "-ER (2-я)", "-IR (3-я)"] },
    { pre: "encender — зажигать. Какая группа?", gap: "", inf: "Tomás enciende los faroles", ok: "-ER (2-я)", opts: ["-AR (1-я)", "-ER (2-я)", "-IR (3-я)"] },
    { pre: "abrir — открывать. Какая группа?", gap: "", inf: "Bruno abre su lista", ok: "-IR (3-я)", opts: ["-AR (1-я)", "-ER (2-я)", "-IR (3-я)"] },
    { pre: "caminar — идти. Какая группа?", gap: "", inf: "El Jefe camina por los pasillos", ok: "-AR (1-я)", opts: ["-AR (1-я)", "-ER (2-я)", "-IR (3-я)"] },
    { pre: "subir — поднимать(ся). Какая группа?", gap: "", inf: "Nico sube las jarras", ok: "-IR (3-я)", opts: ["-AR (1-я)", "-ER (2-я)", "-IR (3-я)"] },
    { pre: "aprender — учить. Какая группа?", gap: "", inf: "Tú aprendes las palabras del Reino", ok: "-ER (2-я)", opts: ["-AR (1-я)", "-ER (2-я)", "-IR (3-я)"] },
    { pre: "vivir — жить. Какая группа?", gap: "", inf: "Los ayudantes viven en el palacio", ok: "-IR (3-я)", opts: ["-AR (1-я)", "-ER (2-я)", "-IR (3-я)"] },
    { pre: "cantar — петь. Какая группа?", gap: "", inf: "Los ayudantes cantan juntos", ok: "-AR (1-я)", opts: ["-AR (1-я)", "-ER (2-я)", "-IR (3-я)"] },
  ],
  // I.2 — определи лицо по окончанию
  personas: [
    { pre: "«Preparo el desayuno». Кто действует?", gap: "", inf: "preparar → prepar-o", ok: "yo", opts: ["yo", "tú", "él / ella"] },
    { pre: "«Cantan una canción». Кто действует?", gap: "", inf: "cantar → cant-an", ok: "ellos / ellas", opts: ["nosotros", "ellos / ellas", "vosotros"] },
    { pre: "«Abre su lista». Кто действует?", gap: "", inf: "abrir → abr-e", ok: "él / ella", opts: ["yo", "tú", "él / ella"] },
    { pre: "«Vivimos en el palacio». Кто действует?", gap: "", inf: "vivir → viv-imos", ok: "nosotros", opts: ["nosotros", "vosotros", "ellos / ellas"] },
    { pre: "«Caminas despacio». Кто действует?", gap: "", inf: "caminar → camin-as", ok: "tú", opts: ["yo", "tú", "él / ella"] },
    { pre: "«Coméis caramelo». Кто действует?", gap: "", inf: "comer → com-éis", ok: "vosotros", opts: ["nosotros", "vosotros", "ellos / ellas"] },
    { pre: "«Sube las jarras». Кто действует?", gap: "", inf: "subir → sub-e", ok: "él / ella", opts: ["yo", "él / ella", "tú"] },
    { pre: "«Desayuno solo en la terraza». Кто действует?", gap: "", inf: "desayunar → desayun-o", ok: "yo", opts: ["yo", "él / ella", "tú"] },
  ],
  regulares: [
    { pre: "Lucía", gap: "el desayuno en la cocina.", inf: "preparar", ok: "prepara", opts: ["prepara", "preparo", "preparan"] },
    { pre: "Yo", gap: "por el pasillo con mi farol. (слова Томаса)", inf: "caminar", ok: "camino", opts: ["camino", "camina", "caminas"] },
    { pre: "Los ayudantes", gap: "juntos en la Cocina Mágica.", inf: "cantar", ok: "cantan", opts: ["canta", "cantan", "cantáis"] },
    { pre: "Bruno", gap: "su lista cada mañana.", inf: "abrir", ok: "abre", opts: ["abro", "abres", "abre"] },
    { pre: "Nosotros", gap: "en el Palacio de Caramelo.", inf: "vivir", ok: "vivimos", opts: ["vivimos", "viven", "vivís"] },
    { pre: "El Jefe", gap: "solo en su terraza.", inf: "desayunar", ok: "desayuna", opts: ["desayunas", "desayuna", "desayunan"] },
    { pre: "Tú", gap: "las palabras del Reino.", inf: "aprender", ok: "aprendes", opts: ["aprendes", "aprende", "aprendéis"] },
    { pre: "Nico", gap: "las jarras a la Sala Grande.", inf: "subir", ok: "sube", opts: ["subo", "subes", "sube"] },
    { pre: "Vosotros", gap: "con el Jefe cada día. (Шеф — к читателям)", inf: "caminar", ok: "camináis", opts: ["caminan", "camináis", "caminamos"] },
    { pre: "Ellos no", gap: "la palabra «ayer».", inf: "comprender", ok: "comprenden", opts: ["comprende", "comprendemos", "comprenden"] },
  ],
};

function Drill({ setKey, onBack }) {
  const isInput = setKey === "regulares"; // третий тип: сам впиши форму
  const items = DRILLS[setKey];
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState(0);
  const done = i >= items.length;

  if (done) return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker="Gramática · тренировка" title="¡Muy bien!" />
      <div style={{ background: C.card, borderRadius: 16, padding: "26px 20px", textAlign: "center", border: `2px solid ${C.gold}` }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🏅</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.raspberry }}>{score} из {items.length}</div>
        <div style={{ fontSize: 13.5, color: C.inkSoft, marginTop: 8, lineHeight: 1.55 }}>
          {score === items.length ? "Идеально. Окончания Королевства слушаются тебя." : score >= items.length * 0.7 ? "Отлично. Загляни в таблицу ещё раз — и будет идеально." : "Хорошее начало. Вернись к таблице и попробуй снова."}
        </div>
      </div>
      <div onClick={() => { setI(0); setScore(0); setPicked(null); setTyped(""); }} style={{ background: C.emerald, borderRadius: 14, padding: "14px", cursor: "pointer", textAlign: "center", marginTop: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>↻ Ещё раз</div>
      </div>
      <BackBtn onClick={onBack} label="← К теме" />
    </div></div>
  );

  const it = items[i];
  const TITLES = { grupos: "Определи группу глагола", personas: "Кто действует?", regulares: "Сам впиши форму" };
  const pick = (o) => {
    if (picked) return;
    setPicked(o);
    if (o === it.ok) setScore(s => s + 1);
  };

  return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker={`Тренировка · ${i + 1} / ${items.length}`} title={TITLES[setKey] || "Тренировка"} />
      <div style={{ background: C.card, borderRadius: 16, padding: "22px 20px", border: `1.5px solid ${C.line}`, boxShadow: "0 2px 10px rgba(61,43,31,0.08)" }}>
        <div style={{ fontSize: 12.5, color: C.goldDeep, fontWeight: 700, textAlign: "center", marginBottom: 12 }}>{it.inf}</div>
        <div style={{ fontSize: 18, lineHeight: 1.6, textAlign: "center" }}>
          {it.pre} <span style={{ display: "inline-block", minWidth: 90, borderBottom: `2px solid ${C.gold}`, color: picked ? (picked === it.ok ? C.emeraldDeep : C.raspberry) : "transparent", fontWeight: 800, textAlign: "center" }}>{picked ? it.ok : "____"}</span> {it.gap}
        </div>
        {isInput ? (
          <div style={{ marginTop: 20 }}>
            <input
              value={typed}
              onChange={e => setTyped(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && typed.trim() && !picked) pick(typed.trim().toLowerCase()); }}
              disabled={!!picked}
              placeholder="впиши форму глагола…"
              autoCapitalize="none" autoCorrect="off" spellCheck={false}
              style={{
                width: "100%", boxSizing: "border-box", padding: "13px 14px", fontSize: 17,
                fontFamily: SERIF, borderRadius: 12, outline: "none", textAlign: "center",
                border: `2px solid ${picked ? (picked === it.ok ? C.emerald : C.raspberry) : C.gold}`,
                background: C.cream, color: C.ink,
              }}
            />
            {!picked && (
              <div onClick={() => typed.trim() && pick(typed.trim().toLowerCase())} style={{
                background: typed.trim() ? C.emerald : C.creamDeep, borderRadius: 12, padding: "12px",
                cursor: typed.trim() ? "pointer" : "default", textAlign: "center", marginTop: 12, transition: "background .15s",
              }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: typed.trim() ? "#fff" : C.inkSoft }}>Проверить</div>
              </div>
            )}
            {picked && picked !== it.ok && (
              <div style={{ textAlign: "center", marginTop: 12, fontSize: 15 }}>
                Правильно: <b style={{ color: C.emeraldDeep }}>{it.ok}</b>
              </div>
            )}
          </div>
        ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
          {it.opts.map(o => {
            const isOk = picked && o === it.ok;
            const isBad = picked && o === picked && o !== it.ok;
            return (
              <div key={o} onClick={() => pick(o)} style={{
                padding: "12px", borderRadius: 12, textAlign: "center", fontSize: 16, fontWeight: 700, cursor: picked ? "default" : "pointer",
                background: isOk ? C.emerald : isBad ? C.raspberry : C.cream,
                color: isOk || isBad ? "#fff" : C.ink,
                border: `1.5px solid ${isOk ? C.emerald : isBad ? C.raspberry : C.line}`,
                transition: "all .15s",
              }}>{o}</div>
            );
          })}
        </div>
        )}
        {picked && it.note && <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 14, lineHeight: 1.5, background: C.cream, borderRadius: 10, padding: "10px 12px" }}>✦ {it.note}</div>}
        {picked && (
          <div onClick={() => { setI(i + 1); setPicked(null); setTyped(""); }} style={{ background: C.gold, borderRadius: 12, padding: "12px", cursor: "pointer", textAlign: "center", marginTop: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Дальше →</div>
          </div>
        )}
      </div>
      <BackBtn onClick={onBack} label="← К теме" />
    </div></div>
  );
}

// ============================================================
// КАТАЛОГ ТЕМ EL VERBO — гармошка трёх веток
// ============================================================
const BRANCHES = [
  {
    id: "estructura", num: "I", title: "Устройство глагола", sub: "Фундамент: как глагол устроен — вне времён",
    topics: [
      { id: "infinitivo", title: "Инфинитив и три спряжения: -AR, -ER, -IR", lvl: "A1", ready: true },
      { id: "personas", title: "Шесть лиц: корень + окончание", lvl: "A1", ready: true },
    ],
  },
  {
    id: "tiempos", num: "II", title: "Времена", sub: "Каждое время — своя тема; неправильности — слои внутри",
    topics: [
      { id: "presente-reg", title: "Presente de indicativo · регулярные глаголы", lvl: "A1", ready: true },
      { id: "presente-orto", title: "Presente · орфографические изменения (g→j…)", lvl: "A1", ready: false },
      { id: "presente-raiz", title: "Presente · чередования в корне (e→ie…)", lvl: "A1", ready: false },
      { id: "presente-irr", title: "Presente · полностью неправильные (estar, ir…)", lvl: "A1", ready: false },
      { id: "perfecto", title: "Pretérito Perfecto Compuesto", lvl: "A1–A2", ready: false },
    ],
  },
  {
    id: "tipos", num: "III", title: "Особые типы глаголов", sub: "Сквозные явления, живущие во всех временах",
    topics: [
      { id: "reflexivos", title: "Возвратные глаголы (verbos reflexivos)", lvl: "A2", ready: false },
    ],
  },
];

function VerboIndex({ onOpen, onBack }) {
  const [open, setOpen] = useState("estructura");
  return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker="Gramática" title="El verbo" sub="Глагол — сердце испанской фразы. Три ветки: как он устроен, в каких временах живёт и какие особые типы бывают." />
      {BRANCHES.map(b => {
        const isOpen = open === b.id;
        return (
          <div key={b.id} style={{ marginBottom: 12 }}>
            <div onClick={() => setOpen(isOpen ? null : b.id)} style={{
              background: isOpen ? C.gold : C.card, borderRadius: isOpen ? "14px 14px 0 0" : 14, padding: "14px 16px",
              cursor: "pointer", border: `1.5px solid ${C.gold}`, borderBottom: isOpen ? "none" : `1.5px solid ${C.gold}`,
              display: "flex", alignItems: "center", gap: 12, transition: "background .15s",
            }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: isOpen ? "rgba(255,255,255,0.85)" : C.goldDeep, fontFamily: SERIF, width: 26 }}>{b.num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16.5, fontWeight: 800, color: isOpen ? "#fff" : C.ink, fontFamily: SERIF }}>{b.title}</div>
                <div style={{ fontSize: 12, color: isOpen ? "rgba(255,255,255,0.8)" : C.inkSoft, marginTop: 2 }}>{b.sub}</div>
              </div>
              <div style={{ fontSize: 18, color: isOpen ? "#fff" : C.gold, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .15s" }}>›</div>
            </div>
            {isOpen && (
              <div style={{ border: `1.5px solid ${C.gold}`, borderTop: "none", borderRadius: "0 0 14px 14px", overflow: "hidden", background: C.card }}>
                {b.topics.map((t, i) => (
                  <div key={t.id} onClick={() => t.ready && onOpen(t.id)} style={{
                    padding: "13px 16px", borderTop: i ? `1px solid ${C.line}` : "none",
                    cursor: t.ready ? "pointer" : "default", opacity: t.ready ? 1 : 0.55,
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <div style={{ flex: 1, fontSize: 14.5, fontWeight: t.ready ? 700 : 500, color: C.ink, lineHeight: 1.4 }}>{t.title}</div>
                    {t.ready ? <LevelTag lvl={t.lvl} /> : <SoonTag />}
                    {t.ready && <span style={{ color: C.gold, fontSize: 16 }}>›</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <BackBtn onClick={onBack} label="← К частям речи" />
    </div></div>
  );
}

// ============================================================
// КОРЕНЬ — части речи (задел под рост)
// ============================================================
function GramaticaRoot({ onVerbo, onBack }) {
  const PARTS = [
    { id: "verbo", title: "El verbo", ru: "Глагол", emoji: "⚙️", ready: true, desc: "Спряжения, времена, особые типы" },
    { id: "sustantivo", title: "El sustantivo", ru: "Существительное", emoji: "📦", ready: false },
    { id: "pronombres", title: "Los pronombres", ru: "Местоимения", emoji: "👤", ready: false },
  ];
  return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker="La Ciudad de los Sentidos" title="Gramática" sub="Справочник Королевства: правило по-русски, примеры — из наших историй, тренировка — сразу под таблицей. Растёт вместе с книгой и играми." />
      {PARTS.map(p => (
        <div key={p.id} onClick={() => p.ready && onVerbo()} style={{
          background: p.ready ? C.card : C.cream, borderRadius: 16, padding: "18px 18px", marginBottom: 12,
          cursor: p.ready ? "pointer" : "default", border: `1.5px solid ${p.ready ? C.gold : C.line}`,
          boxShadow: p.ready ? "0 3px 14px rgba(201,162,75,0.18)" : "none", opacity: p.ready ? 1 : 0.6,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{ fontSize: 28 }}>{p.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: p.ready ? C.raspberry : C.inkSoft, fontFamily: SERIF }}>{p.title}</div>
            <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>{p.ru}{p.desc ? ` · ${p.desc}` : ""}</div>
          </div>
          {p.ready ? <span style={{ color: C.gold, fontSize: 20 }}>›</span> : <SoonTag />}
        </div>
      ))}
      <BackBtn onClick={onBack} label="← В меню" />
    </div></div>
  );
}

// ============================================================
// ГЛАВНЫЙ КОМПОНЕНТ
// ============================================================
export default function Gramatica({ onBack }) {
  // view: root | verbo | тема | drill:<set>
  const [view, setView] = useState("root");
  const [drillFrom, setDrillFrom] = useState(null);

  const openDrill = (set, from) => { setDrillFrom(from); setView("drill:" + set); };

  if (view === "root") return <GramaticaRoot onVerbo={() => setView("verbo")} onBack={onBack} />;
  if (view === "verbo") return <VerboIndex onOpen={(id) => setView(id)} onBack={() => setView("root")} />;
  if (view === "infinitivo") return <TemaInfinitivo onBack={() => setView("verbo")} onTrain={() => openDrill("grupos", "infinitivo")} />;
  if (view === "personas") return <TemaPersonas onBack={() => setView("verbo")} onTrain={() => openDrill("personas", "personas")} />;
  if (view === "presente-reg") return <TemaPresenteRegulares onBack={() => setView("verbo")} onTrain={() => openDrill("regulares", "presente-reg")} />;
  if (view.startsWith("drill:")) return <Drill setKey={view.slice(6)} onBack={() => setView(drillFrom || "verbo")} />;
  return <GramaticaRoot onVerbo={() => setView("verbo")} onBack={onBack} />;
}
