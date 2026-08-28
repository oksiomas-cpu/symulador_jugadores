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
  // Четыре акцента времён — прямо из канона Штурвала («бордовый · шоколадный · изумрудный · королевский синий»).
  chocolate: "#8B5A2B", chocolateDeep: "#6B4226",
  sapphire: "#3B7CB8", sapphireDeep: "#2C5F8A", // тот же синий, что уже используется в приложении (SimuladorJugador.jsx)
};
// Каждое время «Времена» — свой цвет, чтобы темы читались как вкладки, не сливались в один список.
// Presente — шоколадный · Perfecto Compuesto — изумрудный · Imperfecto — бордовый · Indefinido — синий.
const TENSE_OF_TOPIC = {
  "presente-reg": "presente", "presente-orto": "presente", "presente-raiz": "presente", "presente-irr": "presente",
  "perfecto": "perfecto", "participios-irr": "perfecto",
  "imperfecto": "imperfecto",
  "indefinido": "indefinido", "indefinido-irr": "indefinido",
};
const TENSE_PALETTE = {
  presente:   { strong: C.chocolateDeep, soft: C.chocolate },
  perfecto:   { strong: C.emeraldDeep,   soft: C.emerald },
  imperfecto: { strong: C.raspberryDeep, soft: C.raspberry },
  indefinido: { strong: C.sapphireDeep,  soft: C.sapphire },
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
// Название темы в списке — раньше все темы «Времена» были одного цвета и сливались друг с другом.
// Теперь каждое ВРЕМЯ красится целиком в свой акцент из TENSE_PALETTE (голова темнее/жирнее,
// уточнение после « · » — тем же цветом чуть светлее) — так время видно на пробегающий взгляд,
// а не только при чтении текста. Темы вне «Времена» (Устройство глагола и т.п.) остаются нейтральными.
function TopicTitle({ title, tenseKey, ready }) {
  const pal = ready ? TENSE_PALETTE[tenseKey] : null;
  const idx = title.indexOf(" · ");
  if (idx === -1) {
    return <span style={{ color: pal ? pal.strong : undefined, fontWeight: pal ? 800 : undefined }}>{title}</span>;
  }
  const head = title.slice(0, idx);
  const tail = title.slice(idx + 3);
  return (
    <>
      <span style={{ color: pal ? pal.strong : C.raspberry, fontWeight: 800 }}>{head}</span>
      <span style={{ color: pal ? pal.soft : C.emeraldDeep, fontWeight: 700 }}> · {tail}</span>
    </>
  );
}
// Цветная метка-«вкладка» слева от темы — тот же приём, что у Nivel 1–4 в выборе игры.
function TenseDot({ tenseKey, ready }) {
  const pal = ready ? TENSE_PALETTE[tenseKey] : null;
  if (!pal) return null;
  return <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: pal.strong, flexShrink: 0 }} />;
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
        <div style={{ overflowX: "auto", margin: "12px 0 4px" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 420, fontSize: 14 }}>
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
        </div>
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

// ============================================================
// ТЕМА II.2 — Presente: орфографические изменения (g→j)
// ============================================================
function TemaPresenteOrto({ onBack, onTrain }) {
  return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker="El verbo · II. Времена · Presente de indicativo" title="Орфографические изменения" sub="Глагол спрягается по правилу — меняется только запись. Виновата не грамматика, а чтение." />
      <div style={{ textAlign: "center", marginBottom: 14 }}><LevelTag lvl="A1" /></div>

      <RuleCard>
        Буква <b>g</b> читается по-разному: перед <b>e, i</b> — как /х/ (<i>recoger</i> — «рекох́ер»), перед <b>a, o, u</b> — как /г/.
        <div style={{ marginTop: 10 }}>
          Теперь смотри: в форме <b>yo</b> окончание — <b>-o</b>. Если написать <i>recogo</i>, придётся прочитать «реко<b>го</b>» — звук /х/ пропал. Чтобы <b>звук остался тем же</b>, испанцы меняют букву: <b>g → j</b>.
        </div>
        <div style={{ textAlign: "center", fontSize: 18, margin: "12px 0 4px", color: C.ink }}>
          recoger → <span style={{ color: C.raspberry, fontWeight: 800 }}>reco<span style={{ color: C.goldDeep }}>j</span>o</span>
        </div>
        <Nota>Это <b>не исключение</b> и не каприз глагола. Произношение во всех шести формах абсолютно правильное — подстраивается только орфография, и только там, где после g идёт -o: в форме <b>yo</b>.</Nota>
      </RuleCard>

      <ConjTable cols={[
        { inf: "recoger", ru: "собирать", forms: ["recojo", "recoges", "recoge", "recogemos", "recogéis", "recogen"], endLen: [2, 2, 1, 4, 4, 2] },
        { inf: "dirigir", ru: "направлять", forms: ["dirijo", "diriges", "dirige", "dirigimos", "dirigís", "dirigen"], endLen: [2, 2, 1, 4, 2, 2] },
      ]} />

      <RuleCard>
        <Nota><b>Меняется одна форма — yo.</b> Во всех остальных после g идёт e или i, звук /х/ сохраняется сам — писать нечего.</Nota>
        <Nota>Правило работает для глаголов на <b>-ger / -gir</b>: recoger → reco<b>j</b>o, coger → co<b>j</b>o, dirigir → diri<b>j</b>o.</Nota>
        <Nota>Есть и зеркальный случай: у глаголов на <b>-guir</b> перед -o исчезает немая u (gu → g) — перед o звук /г/ и так твёрдый, помощница-u не нужна. Такие глаголы встретятся в историях позже.</Nota>
      </RuleCard>

      <RuleCard>
        <b>Так это звучит в Королевстве:</b>
        <Ejemplo es="—Reco<b>j</b>o las tazas del desayuno —dice Nico." ru="«Собираю чашки после завтрака», — говорит Нико (yo → g стала j)" />
        <Ejemplo es="Tomás reco<b>g</b>e su farol y sale al pasillo." ru="Томас берёт свой фонарь и выходит в коридор (él → g на месте)" />
        <Ejemplo es="Los ayudantes reco<b>g</b>en la Sala Grande." ru="помощники убирают Большой зал (ellos → g на месте)" />
        <Ejemplo es="—Diri<b>j</b>o la Cocina Mágica —dice el Jefe." ru="«Я руковожу Волшебной Кухней», — говорит Шеф (yo → снова j)" />
      </RuleCard>

      <TrainBtn onClick={onTrain} />
      <BackBtn onClick={onBack} />
    </div></div>
  );
}

// ============================================================
// ТЕМА II.3 — Presente: чередования в корне (e→ie)
// ============================================================
function TemaPresenteRaiz({ onBack, onTrain }) {
  return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker="El verbo · II. Времена · Presente de indicativo" title="Чередования в корне" sub="Здесь меняется уже не буква, а звук: под ударением гласная корня раскрывается в дифтонг." />
      <div style={{ textAlign: "center", marginBottom: 14 }}><LevelTag lvl="A1" /></div>

      <RuleCard>
        У части глаголов гласная корня <b>под ударением</b> превращается в дифтонг: <b>e → ie</b>.
        <div style={{ textAlign: "center", fontSize: 18, margin: "12px 0 4px", color: C.ink }}>
          encender → <span style={{ color: C.raspberry, fontWeight: 800 }}>enc<span style={{ color: C.goldDeep }}>ie</span>ndo</span>
        </div>
        <div style={{ marginTop: 8 }}>
          Ключ — <b>ударение</b>. В формах yo, tú, él, ellos оно падает на корень — и e раскрывается в ie. В <b>nosotros и vosotros</b> ударение уходит на окончание (encend<b>e</b>mos, encend<b>é</b>is) — корень без ударения остаётся спокойным: <b>e</b>.
        </div>
        <Nota>Окончания при этом — <b>обычные, регулярные</b>. Меняется только корень, и только там, где на него давит ударение.</Nota>
      </RuleCard>

      <ConjTable cols={[
        { inf: "encender", ru: "зажигать", forms: ["enciendo", "enciendes", "enciende", "encendemos", "encendéis", "encienden"], endLen: [5, 6, 5, 4, 4, 6] },
      ]} />

      <RuleCard>
        <Nota><b>Схема 1-2-3-6:</b> чередование живёт в четырёх формах (yo, tú, él, ellos), а nosotros и vosotros — всегда с исходной гласной. Если обвести эти четыре формы в таблице — получится «сапожок».</Nota>
        <Nota>Тот же механизм есть у других пар гласных (например, <b>o → ue</b>) — принцип один: дифтонг под ударением. Эти глаголы придут со следующими главами книги.</Nota>
      </RuleCard>

      <RuleCard>
        <b>Так это звучит в Королевстве:</b>
        <Ejemplo es="—Enc<b>ie</b>ndo la luz —dice Tomás. Y la luz se enciende." ru="«Зажигаю свет», — говорит Томас. И свет зажигается (yo → ударение на корне)" />
        <Ejemplo es="Tomás enc<b>ie</b>nde dieciocho faroles cada mañana." ru="Томас зажигает восемнадцать фонарей каждое утро (él → ie)" />
        <Ejemplo es="Nosotros enc<b>e</b>ndemos las luces de la Sala Grande." ru="мы зажигаем огни Большого зала (nosotros → ударение ушло, корень спокоен: e)" />
        <Ejemplo es="Los ayudantes enc<b>ie</b>nden los hornos de la Cocina Mágica." ru="помощники зажигают печи Волшебной Кухни (ellos → ie)" />
      </RuleCard>

      <TrainBtn onClick={onTrain} />
      <BackBtn onClick={onBack} />
    </div></div>
  );
}

// ============================================================
// ТЕМА II.4 — Presente: полностью неправильные (estar, ir)
// ============================================================
function TemaPresenteIrr({ onBack, onTrain }) {
  return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker="El verbo · II. Времена · Presente de indicativo" title="Полностью неправильные" sub="Самые древние и самые частые глаголы языка. Они не подчиняются схемам — их формы знают в лицо." />
      <div style={{ textAlign: "center", marginBottom: 14 }}><LevelTag lvl="A1" /></div>

      <RuleCard>
        Есть глаголы, которые звучат так часто, что время обточило их до неузнаваемости. Правило «корень + окончание» тут не работает: у <b>ir</b> («идти») от инфинитива в формах не остаётся <b>ни одной буквы</b>.
        <div style={{ marginTop: 10 }}>
          Такие глаголы не выводят — их <b>запоминают целиком</b>, как имена. Хорошая новость: их мало, и это самые нужные слова языка. Начинаем с двух: <b>estar</b> (находиться, быть где-то / в каком-то состоянии) и <b>ir</b> (идти, ехать).
        </div>
      </RuleCard>

      <ConjTable cols={[
        { inf: "estar", ru: "находиться", forms: ["estoy", "estás", "está", "estamos", "estáis", "están"], endLen: [2, 2, 1, 4, 4, 2] },
        { inf: "ir", ru: "идти", forms: ["voy", "vas", "va", "vamos", "vais", "van"], endLen: [3, 3, 2, 5, 4, 3] },
      ]} />

      <RuleCard>
        <Nota><b>estar</b> почти честный: окончания знакомые, но <b>yo → estoy</b> (не «esto») и ударения на окончаниях: est<b>á</b>s, est<b>á</b>, est<b>á</b>is, est<b>á</b>n. Не забывай знаки — они здесь часть формы.</Nota>
        <Nota><b>ir</b> — главный обманщик Королевства: взял чужой корень <b>v-</b> и спрягается как глагол на -AR: v-oy, v-as, v-a, v-amos, v-ais, v-an.</Nota>
        <Nota>Заметь пару: est<b>oy</b> — v<b>oy</b>. У неправильных глаголов yo часто кончается на <b>-oy</b>.</Nota>
      </RuleCard>

      <RuleCard>
        <b>Так это звучит в Королевстве:</b>
        <Ejemplo es="—<b>Estoy</b> en el pasillo con mi farol —dice Tomás." ru="«Я в коридоре со своим фонарём», — говорит Томас (где я — estar)" />
        <Ejemplo es="Lucía <b>está</b> en la cocina: el desayuno casi está listo." ru="Люсия на кухне: завтрак почти готов (где она + состояние)" />
        <Ejemplo es="Nico <b>va</b> a la Sala Grande con las jarras." ru="Нико идёт в Большой зал с кувшинами (движение — ir)" />
        <Ejemplo es="—<b>Vamos</b> al palacio —dice el Jefe. Y todos van." ru="«Идём во дворец», — говорит Шеф. И все идут." />
      </RuleCard>

      <TrainBtn onClick={onTrain} />
      <BackBtn onClick={onBack} />
    </div></div>
  );
}

// ============================================================
// ТЕМА II.5 — Pretérito Perfecto Compuesto (причастия регулярные)
// ============================================================
function TemaPerfecto({ onBack, onTrain }) {
  return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker="El verbo · II. Времена" title="Pretérito Perfecto Compuesto" sub="Второе Королевство говорит о том, что уже случилось — но связано с сегодня. Шеф ведёт допрос именно в этом времени." />
      <div style={{ textAlign: "center", marginBottom: 14 }}><LevelTag lvl="A1–A2" /></div>

      <RuleCard>
        Pretérito Perfecto Compuesto собирается из двух частей: <b>haber</b> (вспомогательный глагол, спрягается) + <b>причастие</b> (participio, не меняется никогда).
        <div style={{ textAlign: "center", fontSize: 18, margin: "12px 0 4px", color: C.ink }}>
          <span style={{ color: C.raspberry, fontWeight: 800 }}>he</span> + llev<span style={{ color: C.goldDeep, fontWeight: 800 }}>ado</span>
        </div>
        <div style={{ marginTop: 10 }}>
          Причастие строится от инфинитива: <b>-ar → -ado</b> (llevar → llevado), <b>-er / -ir → -ido</b> (recoger → recogido, recibir → recibido). Спрягается только <b>haber</b> — причастие во всех шести лицах выглядит одинаково.
        </div>
        <Nota>Меняется только то, что стоит ПЕРЕД причастием. Само причастие — как печать: одна форма на все лица.</Nota>
      </RuleCard>

      <ConjTable cols={[
        { inf: "llevar", ru: "носить", forms: ["he llevado", "has llevado", "ha llevado", "hemos llevado", "habéis llevado", "han llevado"], endLen: [3, 3, 3, 3, 3, 3] },
        { inf: "recoger", ru: "собирать", forms: ["he recogido", "has recogido", "ha recogido", "hemos recogido", "habéis recogido", "han recogido"], endLen: [3, 3, 3, 3, 3, 3] },
        { inf: "recibir", ru: "принимать", forms: ["he recibido", "has recibido", "ha recibido", "hemos recibido", "habéis recibido", "han recibido"], endLen: [3, 3, 3, 3, 3, 3] },
      ]} />

      <RuleCard>
        <Nota><b>haber</b> — единственная переменная часть: he, has, ha, hemos, habéis, han.</Nota>
        <Nota><b>-ER и -IR совпадают</b> в причастии: comer → comido, recibir → recibido. Разница -ado/-ido — единственное, что нужно помнить.</Nota>
        <Nota>Pretérito Perfecto Compuesto без маркера времени звучит как «просто в прошлом» и теряет смысл. Всегда рядом маркер: <b>esta mañana, esta noche, hoy, esta semana, ya, todavía no, nunca, siempre, acaba de</b>.</Nota>
      </RuleCard>

      <RuleCard>
        <b>Так это звучит в допросе Шефа:</b>
        <Ejemplo es="—<b>He encendido</b> las luces —dice el primer ayudante." ru="«Я зажёг свет», — говорит первый помощник (yo → he + encendido)" />
        <Ejemplo es="La segunda ayudante <b>ha llevado</b> el desayuno del Jefe esta mañana, como cada día." ru="вторая помощница принесла завтрак Шефа сегодня утром, как каждый день (ella → ha)" />
        <Ejemplo es="El tercer ayudante <b>ha revisado</b> todos los documentos esta semana." ru="третий помощник проверил все документы на этой неделе (él → ha)" />
        <Ejemplo es="El guardia <b>ha recibido</b> a las visitas en la puerta principal toda la tarde." ru="охранник принимал гостей у главной двери весь день (él → ha, -ir → -ido)" />
        <Ejemplo es="Todos <b>han buscado</b> los ingredientes esta noche: en la Sala, en la cocina, en el jardín." ru="все искали ингредиенты этой ночью: в Зале, на кухне, в саду (ellos → han)" />
      </RuleCard>

      <TrainBtn onClick={onTrain} />
      <BackBtn onClick={onBack} />
    </div></div>
  );
}

// ============================================================
// ТЕМА II.5b — Pretérito Perfecto Compuesto: причастия неправильные (слой внутри времени)
// Полный список 18 частотных форм + производные + двойные формы.
// Упражнения: канонные реплики Главы 2 (прямая речь СОХРАНЯЕТСЯ в кавычках «...»).
// Источник структуры — методичка, в UI НЕ упоминается (решение Оксаны 7.07). Голос — Оксаны.
// ============================================================
function TemaParticipiosIrr({ onBack, onTrain }) {
  return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker="El verbo · II. Времена · Pretérito Perfecto Compuesto" title="Причастия неправильные" sub="Правило Pretérito Perfecto Compuesto не меняется — меняется только само причастие: у нескольких частых глаголов оно не по шаблону -ado/-ido, и его просто нужно запомнить." />
      <div style={{ textAlign: "center", marginBottom: 14 }}><LevelTag lvl="A2" /></div>

      <RuleCard>
        Haber спрягается как обычно: <b>he, has, ha, hemos, habéis, han</b>. Но у части глаголов причастие — не «-ado/-ido», а особое слово, которое нужно выучить целиком, как печать с новым рисунком. Правил нет, но почти все они кончаются на <b>-erto, -esto, -echo, -elto, -ito, -icho, -isto</b>.
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "14px 0 6px", textAlign: "center" }}>
          {[["abrir", "abierto"], ["absolver", "absuelto"], ["cubrir", "cubierto"], ["decir", "dicho"], ["describir", "descrito"], ["disolver", "disuelto"], ["escribir", "escrito"], ["hacer", "hecho"], ["inscribir", "inscrito"], ["morir", "muerto"], ["poner", "puesto"], ["pudrir", "podrido"], ["resolver", "resuelto"], ["romper", "roto"], ["satisfacer", "satisfecho"], ["suscribir", "suscrito"], ["ver", "visto"], ["volver", "vuelto"]].map(([inf, part]) => (
            <div key={inf} style={{ flex: "1 1 auto", minWidth: 74, background: C.cream, border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: "10px 8px" }}>
              <div style={{ fontSize: 14, color: C.inkSoft }}>{inf}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.raspberry, marginTop: 2 }}>{part}</div>
            </div>
          ))}
        </div>
        <Nota>Это полный список — других сюрпризов на этом уровне не будет. А родственники наследуют форму, как фамилию: descubrir → descu<b>bierto</b>, devolver → de<b>vuelto</b>, componer → com<b>puesto</b>. Выучил один — вся семья в подарок.</Nota>
        <Nota>У freír две законные формы: freído и <b>frito</b>. Вторая тебе давно знакома — patatas fritas.</Nota>
        <Nota>В допросе Главы 2 неправильные причастия уже звучали: <b>vuelto</b> (3-й помощник, его алиби), <b>abierto, dicho, visto</b> (свидетели той же ночи). Остальные 15 глаголов улик — с регулярными причастиями.</Nota>
      </RuleCard>

      <ConjTable cols={[
        { inf: "volver", ru: "возвращаться", forms: ["he vuelto", "has vuelto", "ha vuelto", "hemos vuelto", "habéis vuelto", "han vuelto"], endLen: [6, 6, 6, 6, 6, 6] },
        { inf: "abrir", ru: "открывать", forms: ["he abierto", "has abierto", "ha abierto", "hemos abierto", "habéis abierto", "han abierto"], endLen: [7, 7, 7, 7, 7, 7] },
        { inf: "decir", ru: "говорить", forms: ["he dicho", "has dicho", "ha dicho", "hemos dicho", "habéis dicho", "han dicho"], endLen: [5, 5, 5, 5, 5, 5] },
        { inf: "ver", ru: "видеть", forms: ["he visto", "has visto", "ha visto", "hemos visto", "habéis visto", "han visto"], endLen: [5, 5, 5, 5, 5, 5] },
      ]} />

      <RuleCard>
        <Nota>Причастие подсвечено целиком — потому что здесь неправильна вся форма, не только окончание.</Nota>
        <Nota>Маркер времени по-прежнему обязателен: <b>esta mañana, esta tarde, hoy, todavía no, nunca</b>.</Nota>
      </RuleCard>

      <RuleCard>
        <b>Так это прозвучало в допросе Шефа (Глава 2):</b>
        <Ejemplo es="El primer ayudante: «Esta mañana <b>he abierto</b> la Sala yo solo. He encendido las luces.»" ru="abrir → abierto (не «abrido»). Рядом — регулярное encendido: неправильное причастие не отменяет остальные." />
        <Ejemplo es="El ayudante más joven: «<b>He visto</b> una sombra. Pero no <b>he dicho</b> nada porque no estaba seguro.»" ru="ver → visto, decir → dicho — два неправильных причастия в одной фразе одного свидетеля." />
        <Ejemplo es="El tercer ayudante: «Hoy todavía no <b>he vuelto</b> a la Sala.»" ru="volver → vuelto — его алиби построено на этой форме: обычно возвращается cada tarde a las seis, но сегодня — нет." />
      </RuleCard>

      <TrainBtn onClick={onTrain} />
      <BackBtn onClick={onBack} />
    </div></div>
  );
}

// ============================================================
// ТЕМА II.6 — Pretérito Imperfecto (регулярные + 3 неправильных: ser, ir, ver)
// Источник примеров — утверждённые карточки-улики «El Caso de las Tres Huellas»
// (блок «Vida habitual · Imperfecto» в каждой карточке), плюс два новых
// предложения для ir/ver, согласованные с Оксаной 28.08.2026.
// ============================================================
function TemaImperfecto({ onBack, onTrain }) {
  return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker="El verbo · II. Времена" title="Pretérito Imperfecto" sub="Третье время допроса Шефа: не «что случилось», а «как всё было обычно» — привычки, описания, фон, на котором произошла улика." />
      <div style={{ textAlign: "center", marginBottom: 14 }}><LevelTag lvl="A1–A2" /></div>

      <RuleCard>
        Pretérito Imperfecto — самое простое время из всех прошедших: у него всего <b>два набора окончаний</b>, и корень глагола не меняется никогда (в отличие от Presente с его чередованиями).
        <div style={{ textAlign: "center", fontSize: 18, margin: "12px 0 4px", color: C.ink }}>
          llev<span style={{ color: C.goldDeep, fontWeight: 800 }}>aba</span> · serv<span style={{ color: C.goldDeep, fontWeight: 800 }}>ía</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <b>-AR</b> получает окончания на <b>-aba</b> (llevar → llevaba). <b>-ER и -IR</b> получают одинаковые окончания на <b>-ía</b> (tener → tenía, servir → servía) — разницы между 2-й и 3-й группой здесь нет вообще.
        </div>
        <Nota>Даже <b>encender</b>, который в Presente превращается в enciendo (e→ie), в Imperfecto ведёт себя абсолютно регулярно: enc<b>e</b>ndía, без чередования. Чередования Presente в Imperfecto не работают ни у одного глагола.</Nota>
      </RuleCard>

      <ConjTable cols={[
        { inf: "llevar", ru: "носить", forms: ["llevaba", "llevabas", "llevaba", "llevábamos", "llevabais", "llevaban"], endLen: [3, 4, 3, 6, 5, 4] },
        { inf: "tener", ru: "иметь", forms: ["tenía", "tenías", "tenía", "teníamos", "teníais", "tenían"], endLen: [2, 3, 2, 5, 4, 3] },
        { inf: "servir", ru: "служить", forms: ["servía", "servías", "servía", "servíamos", "servíais", "servían"], endLen: [2, 3, 2, 5, 4, 3] },
      ]} />

      <RuleCard>
        <Nota>Ударение: у -AR тильда стоит только в <b>nosotros</b> (llev<b>á</b>bamos) — остальные формы без знака. У -ER/-IR тильда есть во <b>всех</b> шести формах, на -í-: ten<b>í</b>a, serv<b>í</b>amos.</Nota>
        <Nota>Маркеры Imperfecto — не «вчера», а <b>antes, siempre, cada día / mañana / semana, normalmente, mientras</b>. С «mientras» Imperfecto показывает два действия одновременно: пока один делал одно, другой — другое.</Nota>
      </RuleCard>

      <RuleCard>
        <b>Так это звучало в улике «La llave dorada» и «El libro de recetas»:</b>
        <Ejemplo es="La llave <b>era</b> de oro y <b>era</b> única. El guardia la <b>llevaba</b> y la <b>guardaba</b> cada día." ru="ключ был золотым и единственным; охранник носил и хранил его каждый день (обычная жизнь предмета — не то, что случилось вчера)" />
        <Ejemplo es="<b>Servía</b> para cerrar la puerta principal y el despacho. El Jefe <b>podía</b> pedirla, pero después la <b>devolvía</b>." ru="служил, чтобы запирать главную дверь и кабинет; Шеф мог попросить его, но потом возвращал (-IR и модальный глагол в одной фразе)" />
        <Ejemplo es="El libro de recetas <b>pertenecía</b> al Jefe y <b>era</b> su tesoro. <b>Tenía</b> letras doradas." ru="книга рецептов принадлежала Шефу и была его сокровищем; на ней были золотые буквы" />
      </RuleCard>

      <RuleCard>
        <b>Так это звучало в улике «Las lámparas»:</b>
        <Ejemplo es="Cada mañana, el primer ayudante <b>encendía</b> la luz antes de que llegaran los demás. Las <b>limpiaban</b> cada semana." ru="каждое утро первый помощник включал свет до прихода остальных; их чистили каждую неделю (cada mañana / cada semana — маркеры привычки)" />
        <Ejemplo es="Los ayudantes <b>podían</b> mirarlo de lejos, pero normalmente no lo <b>tocaban</b>." ru="помощники могли смотреть на неё издалека, но обычно не прикасались (normalmente)" />
        <Ejemplo es="Mientras el guardia <b>guardaba</b> la llave, el Jefe <b>estudiaba</b> el libro de recetas." ru="пока охранник хранил ключ, Шеф изучал книгу рецептов — два привычных действия одновременно (mientras)" />
      </RuleCard>

      <RuleCard>
        <b>Только 3 неправильных глагола на всё время</b> — ser, ir, ver. Больше исключений в Imperfecto нет ни у одного глагола испанского языка.
      </RuleCard>

      <ConjTable cols={[
        { inf: "ser", ru: "быть", forms: ["era", "eras", "era", "éramos", "erais", "eran"], endLen: [4, 4, 4, 6, 5, 4] },
        { inf: "ir", ru: "идти", forms: ["iba", "ibas", "iba", "íbamos", "ibais", "iban"], endLen: [3, 4, 3, 6, 5, 4] },
        { inf: "ver", ru: "видеть", forms: ["veía", "veías", "veía", "veíamos", "veíais", "veían"], endLen: [4, 5, 4, 7, 6, 5] },
      ]} />

      <RuleCard>
        <Nota><b>ser</b> и <b>ir</b> делят одну особую основу окончаний: -a, -as, -a, -amos, -ais, -an — только корень разный (er- у ser, ib- у ir).</Nota>
        <Nota><b>ver</b> почти регулярный: просто добавляет лишнюю -e- к корню (v- → ve-) и дальше спрягается как обычный -ER: ve-ía, ve-íamos.</Nota>
      </RuleCard>

      <RuleCard>
        <b>Так это звучало в допросе Шефа:</b>
        <Ejemplo es="—La llave <b>era</b> de oro —dice el guardia." ru="«Ключ был золотым», — говорит охранник (era — единственная неправильная форма во всей фразе)" />
        <Ejemplo es="Cada tarde, Don Verbo <b>iba</b> al mercado a comprar los ingredientes." ru="каждый вечер Don Verbo ходил на рынок за ингредиентами (привычка — ir в Imperfecto)" />
        <Ejemplo es="Desde la Sala, los ayudantes <b>veían</b> las lámparas encendidas cada noche." ru="из Sala помощники видели зажжённые лампы каждую ночь (ver → veían, ellos)" />
      </RuleCard>

      <TrainBtn onClick={onTrain} />
      <BackBtn onClick={onBack} />
    </div></div>
  );
}

// ============================================================
// ТЕМА II.7 — Pretérito Indefinido (регулярные глаголы)
// Источник примеров — карточки-улики «El Caso de las Tres Huellas»,
// блок «El corte de ayer · Indefinido» (game3Data.js).
// ============================================================
function TemaIndefinido({ onBack, onTrain }) {
  return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker="El verbo · II. Времена" title="Pretérito Indefinido" sub="Четвёртое время допроса Шефа: не «как было обычно», а «что случилось вчера, в конкретный момент» — законченное действие с чёткой границей." />
      <div style={{ textAlign: "center", marginBottom: 14 }}><LevelTag lvl="A2" /></div>

      <RuleCard>
        Pretérito Indefinido рассказывает о действии, которое <b>началось и закончилось</b> в прошлом, в конкретный момент времени — в отличие от Imperfecto, который описывает фон и привычки.
        <div style={{ textAlign: "center", fontSize: 18, margin: "12px 0 4px", color: C.ink }}>
          guard<span style={{ color: C.goldDeep, fontWeight: 800 }}>ó</span> · abr<span style={{ color: C.goldDeep, fontWeight: 800 }}>ió</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <b>-AR</b> получает окончания <b>-é, -aste, -ó, -amos, -asteis, -aron</b>. <b>-ER и -IR</b> получают ОБЩИЙ набор — <b>-í, -iste, -ió, -imos, -isteis, -ieron</b>: разницы между 2-й и 3-й группой здесь так же нет, как в Imperfecto.
        </div>
        <Nota><b>yo и él/ella всегда с ударением</b> — é, ó, í, ió. Без знака смысл меняется: <i>hablo</i> (говорю, сейчас) ≠ <i>habló</i> (сказал, вчера).</Nota>
      </RuleCard>

      <ConjTable cols={[
        { inf: "guardar", ru: "хранить", forms: ["guardé", "guardaste", "guardó", "guardamos", "guardasteis", "guardaron"], endLen: [1, 4, 1, 4, 6, 4] },
        { inf: "volver", ru: "возвращаться", forms: ["volví", "volviste", "volvió", "volvimos", "volvisteis", "volvieron"], endLen: [1, 4, 2, 4, 6, 5] },
        { inf: "abrir", ru: "открывать", forms: ["abrí", "abriste", "abrió", "abrimos", "abristeis", "abrieron"], endLen: [1, 4, 2, 4, 6, 5] },
      ]} />

      <RuleCard>
        <Nota><b>-AR и -IR делят форму nosotros</b> с Presente: <i>guardamos</i> звучит одинаково «(мы) храним» и «(мы) сохранили» — различает контекст и маркер времени. У -ER формы разные: <i>volvemos</i> (Presente) ≠ <i>volvimos</i> (Indefinido).</Nota>
        <Nota>Маркеры Indefinido — не «всегда», а <b>ayer, anteayer, el año/mes pasado, la semana pasada, hace + время, de repente, en ese momento</b>.</Nota>
      </RuleCard>

      <RuleCard>
        <b>Так это звучало в улике «La lupa» и «Los ingredientes»:</b>
        <Ejemplo es="<b>Ayer</b>, a las dos, el Jefe <b>sacó</b> la lupa del cajón y <b>examinó</b> una marca extraña sobre la mesa. Después la <b>guardó</b> otra vez." ru="вчера, в два часа, Шеф достал лупу из ящика и осмотрел странную отметину; потом убрал её обратно — три законченных действия подряд" />
        <Ejemplo es="Don Verbo <b>compró</b> una nueva porción de ingredientes en el Mercado del Caramelo. <b>Salió</b> del mercado a las seis, <b>volvió</b> al palacio y <b>entregó</b> la bolsa al primer ayudante." ru="Don Verbo купил новую порцию ингредиентов; вышел с рынка в шесть, вернулся во дворец и отдал сумку первому помощнику" />
      </RuleCard>

      <RuleCard>
        <b>Так это звучало в улике «La puerta»:</b>
        <Ejemplo es="El guardia <b>abrió</b> la puerta para que Don Verbo saliera hacia el Mercado del Caramelo. A las seis la <b>abrió</b> otra vez para su regreso. Después <b>cerró</b> la puerta con llave." ru="охранник открыл дверь, чтобы Don Verbo вышел на рынок; в шесть открыл её снова для его возвращения; потом запер дверь на ключ (одна и та же форма abrió — дважды, в разные моменты)" />
        <Ejemplo es="El tercer ayudante <b>revisó</b> los últimos diez documentos. <b>Numeró</b> el documento cien y <b>guardó</b> los papeles en su caja." ru="третий помощник проверил последние десять документов, пронумеровал сотый документ и убрал бумаги в свою коробку" />
      </RuleCard>

      <TrainBtn onClick={onTrain} />
      <BackBtn onClick={onBack} />
    </div></div>
  );
}

// ============================================================
// ТЕМА II.7b — Pretérito Indefinido: глаголы исключения (слой внутри времени)
// Отдельная вкладка (решение Оксаны 28.08.2026) — в отличие от Imperfecto,
// где хватило 3 исключений внутри одной темы, здесь неправильных глаголов
// на порядок больше и они образуют три разные группы со своей логикой.
// Канон: estuvo, dio, fue — из карточек-улик «El Caso de las Tres Huellas».
// Остальные глаголы группы raíz fuerte — примеры в голосе мира, отдельно
// от прямых цитат карточек; согласовать с Оксаной при следующей сверке.
// ============================================================
function TemaIndefinidoIrr({ onBack, onTrain }) {
  return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker="El verbo · II. Времена · Pretérito Indefinido" title="Глаголы исключения" sub="Здесь неправильность — не одна форма, а целая новая основа. Зато у всех этих глаголов ОДИН общий набор окончаний." />
      <div style={{ textAlign: "center", marginBottom: 14 }}><LevelTag lvl="A2–B1" /></div>

      <RuleCard>
        Группа частых глаголов (raíz fuerte — «сильная основа») в Indefinido меняет весь корень целиком и получает окончания <b>-e, -iste, -o, -imos, -isteis, -ieron</b> — без единого знака ударения, и в yo не -í, а <b>-e</b>; в él/ella не -ió, а голое <b>-o</b>.
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "14px 0 6px", textAlign: "center" }}>
          {[["estar", "estuv-"], ["tener", "tuv-"], ["andar", "anduv-"], ["poder", "pud-"], ["poner", "pus-"], ["saber", "sup-"], ["querer", "quis-"], ["venir", "vin-"], ["hacer", "hic-/hiz-"], ["decir", "dij-"], ["traer", "traj-"]].map(([inf, raiz]) => (
            <div key={inf} style={{ flex: "1 1 auto", minWidth: 74, background: C.cream, border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: "10px 8px" }}>
              <div style={{ fontSize: 14, color: C.inkSoft }}>{inf}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.raspberry, marginTop: 2 }}>{raiz}</div>
            </div>
          ))}
        </div>
        <Nota>Это полный список частотных глаголов этой группы на уровне A2–B1 — других сюрпризов здесь не будет.</Nota>
      </RuleCard>

      <ConjTable cols={[
        { inf: "estar", ru: "находиться", forms: ["estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis", "estuvieron"], endLen: [1, 4, 1, 4, 6, 5] },
        { inf: "tener", ru: "иметь", forms: ["tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis", "tuvieron"], endLen: [1, 4, 1, 4, 6, 5] },
        { inf: "hacer", ru: "делать", forms: ["hice", "hiciste", "hizo", "hicimos", "hicisteis", "hicieron"], endLen: [1, 4, 2, 4, 6, 5] },
      ]} />

      <RuleCard>
        <Nota><b>estar → estuv-, tener → tuv-</b> — та же добавка -uv- к укороченной основе; окончания у всей группы одинаковые, отличается только сама основа.</Nota>
        <Nota><b>hacer</b> в él/ella пишется <b>hizo</b>, не «hico»: c → z перед o — тот же приём, что g → j в Presente (Тема II.2): буква меняется, чтобы звук остался тем же.</Nota>
        <Nota><b>decir → dij-, traer → traj-</b>: у глаголов с основой на -j в ellos окончание теряет i — <b>dijeron, trajeron</b>, а не «dijieron», «trajieron».</Nota>
      </RuleCard>

      <RuleCard>
        <b>Отдельная короткая группа — dar и ver.</b> Формально они регулярные -AR и -ER, но получают чужие, «голые» окончания без ударения — как у raíz fuerte, только основа у них не меняется, а просто теряет гласную группы.
      </RuleCard>

      <ConjTable cols={[
        { inf: "dar", ru: "давать", forms: ["di", "diste", "dio", "dimos", "disteis", "dieron"], endLen: [1, 4, 2, 4, 6, 5] },
        { inf: "ver", ru: "видеть", forms: ["vi", "viste", "vio", "vimos", "visteis", "vieron"], endLen: [1, 4, 2, 4, 6, 5] },
      ]} />

      <RuleCard>
        <Nota><b>dar</b> — глагол на -AR, но окончания как у -ER/-IR без ударения: di, diste, dio (не «dó»).</Nota>
        <Nota><b>ver</b> — самый короткий регулярный: основа всего одна буква v-, дальше обычные -ER-окончания без знака: vi, viste, vio.</Nota>
      </RuleCard>

      <RuleCard>
        <b>Последняя пара — ser и ir: РАЗНЫЕ глаголы, но ОДНА форма на двоих.</b> Контекст всегда подсказывает, какой из них имеется в виду.
      </RuleCard>

      <ConjTable cols={[
        { inf: "ir / ser", ru: "идти / быть", forms: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"], endLen: [1, 4, 1, 4, 6, 4] },
      ]} />

      <RuleCard>
        <Nota>«<i>Fue al mercado</i>» — точно ir (движение). «<i>Fue una decisión difícil</i>» — точно ser (характеристика). Формы совпадают полностью — omónimos, не ошибка.</Nota>
      </RuleCard>

      <RuleCard>
        <b>Так это звучало в улике «La llave» и в допросе:</b>
        <Ejemplo es="—¿La pista <b>estuvo</b> fuera del Palacio ayer? —Sí, la pista <b>estuvo</b> fuera del Palacio ayer." ru="«Улика была вне дворца вчера?» — «Да, была» (estar, вопрос-ответ допроса)" />
        <Ejemplo es="Ayer el guardia se la <b>dio</b> a Don Verbo y la llave <b>salió</b> del Palacio con él." ru="вчера охранник отдал его Don Verbo, и ключ покинул дворец вместе с ним (dar)" />
        <Ejemplo es="El guardia utilizó la llave... Después cerró la puerta y guardó la llave en su bolsillo. La llave no <b>fue</b> al mercado." ru="охранник запер дверь и убрал ключ в карман; ключ на рынок не ходил (ir — движения не было)" />
      </RuleCard>

      <RuleCard>
        <b>А так это могло бы прозвучать в допросе Шефа (примеры в голосе мира, для проверки Оксаны):</b>
        <Ejemplo es="—<b>Tuve</b> la varilla en la mano un momento, nada más —dice el segundo ayudante." ru="«У меня венчик был в руке всего момент, не больше», — говорит второй помощник (tener)" />
        <Ejemplo es="El Jefe <b>hizo</b> la última palabra del día antes de las ocho." ru="Шеф сделал последнее слово дня до восьми (hacer)" />
        <Ejemplo es="—No <b>dije</b> nada sobre la sombra hasta hoy —dice el ayudante más joven." ru="«Я ничего не говорил о тени до сегодня», — говорит самый молодой помощник (decir)" />
        <Ejemplo es="Don Verbo <b>pudo</b> volver al palacio antes de que cerraran la puerta." ru="Don Verbo успел вернуться во дворец до того, как закрыли дверь (poder)" />
      </RuleCard>

      <TrainBtn onClick={onTrain} />
      <BackBtn onClick={onBack} />
    </div></div>
  );
}

function TrainBtn({ onClick, label = "⚡ Тренировать", sub = "Проверь себя на глаголах Королевства", bg = C.raspberry, shadow = "rgba(168,27,62,0.22)" }) {
  return (
    <div onClick={onClick} style={{ background: bg, borderRadius: 16, padding: "16px 20px", cursor: "pointer", textAlign: "center", boxShadow: `0 4px 16px ${shadow}`, marginTop: 6 }}>
      <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", fontFamily: SERIF }}>{label}</div>
      <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", marginTop: 3 }}>{sub}</div>
    </div>
  );
}

// ============================================================
// ВЕТКА IV — ГЛАГОЛЫ-ОПЕРАТОРЫ (решение Оксаны 28.08.2026)
// Восемь операторов из «капсул действия» (querer/poder/tener que/ir a/
// intentar/empezar a/dejar de/volver a) спрягаются здесь в трёх прошедших
// временах — отдельная кросс-временная ветка, не слой внутри «Времена».
// Капсульная игра сознательно НЕ содержит таблицу спряжения (решение
// содержательной сессии 28.08.2026) — при ошибке формы игрок направляется
// именно сюда через deep-link `?tema=op-<verb>-<tense>` (та же логистика,
// что и у обычных капсул, канон 6 июля 2026).
// Базовое действие в каждом упражнении остаётся в infinitivo — спрягается
// только оператор (закон формы капсул: «спрягается только первый глагол»).
// ============================================================
const OPERATORS = [
  {
    id: "op-querer", verb: "querer", particle: "", meaning: "хотеть сделать",
    action: "abrir la puerta", actionRu: "открыть дверь",
    presente: { forms: ["quiero", "quieres", "quiere", "queremos", "queréis", "quieren"], endLen: [4, 4, 4, 4, 4, 4], note: "В Presente корень e→ie меняется в yo, tú, él/ella и ellos/ellas. Nosotros и vosotros сохраняют quer-." },
    ppc: { forms: ["he querido", "has querido", "ha querido", "hemos querido", "habéis querido", "han querido"], endLen: [3, 3, 3, 3, 3, 3], note: "querido — регулярное причастие -ER: quer- + -ido." },
    indefinido: { forms: ["quise", "quisiste", "quiso", "quisimos", "quisisteis", "quisieron"], endLen: [1, 4, 1, 4, 6, 5], note: "raíz fuerte: quis-, окончания без ударения — quise (не «querí»), quiso (не «querió»)." },
    imperfecto: { forms: ["quería", "querías", "quería", "queríamos", "queríais", "querían"], endLen: [2, 3, 2, 5, 4, 3], note: "в Imperfecto querer полностью регулярный: quer- + -ía." },
  },
  {
    id: "op-poder", verb: "poder", particle: "", meaning: "мочь сделать",
    action: "abrir la caja", actionRu: "открыть шкатулку",
    ppc: { forms: ["he podido", "has podido", "ha podido", "hemos podido", "habéis podido", "han podido"], endLen: [3, 3, 3, 3, 3, 3], note: "podido — регулярное причастие: pod- + -ido." },
    indefinido: { forms: ["pude", "pudiste", "pudo", "pudimos", "pudisteis", "pudieron"], endLen: [1, 4, 1, 4, 6, 5], note: "raíz fuerte: pud- (не «pod-»), окончания без ударения — та же схема, что у querer." },
    imperfecto: { forms: ["podía", "podías", "podía", "podíamos", "podíais", "podían"], endLen: [2, 3, 2, 5, 4, 3], note: "в Imperfecto poder регулярный: pod- + -ía." },
  },
  {
    id: "op-tenerque", verb: "tener", particle: "que", meaning: "быть должным сделать",
    action: "dar el libro a Marta", actionRu: "отдать книгу Марте",
    ppc: { forms: ["he tenido", "has tenido", "ha tenido", "hemos tenido", "habéis tenido", "han tenido"], endLen: [3, 3, 3, 3, 3, 3], note: "tenido — регулярное причастие: ten- + -ido." },
    indefinido: { forms: ["tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis", "tuvieron"], endLen: [1, 4, 1, 4, 6, 5], note: "raíz fuerte: tuv- (тот же приём, что у estar → estuv-)." },
    imperfecto: { forms: ["tenía", "tenías", "tenía", "teníamos", "teníais", "tenían"], endLen: [2, 3, 2, 5, 4, 3], note: "в Imperfecto tener регулярный, несмотря на неправильный Presente (tengo)." },
  },
  {
    id: "op-ira", verb: "ir", particle: "a", meaning: "собираться сделать",
    action: "buscar la pista", actionRu: "искать улику",
    ppc: { forms: ["he ido", "has ido", "ha ido", "hemos ido", "habéis ido", "han ido"], endLen: [3, 3, 3, 3, 3, 3], note: "ido — participio без своего корня: у ir от инфинитива в форме ничего не остаётся, как и в Presente (voy)." },
    indefinido: { forms: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"], endLen: [1, 4, 1, 4, 6, 4], note: "ir делит эти формы с ser целиком — fui значит и «пошёл», и «был», контекст решает." },
    imperfecto: { forms: ["iba", "ibas", "iba", "íbamos", "ibais", "iban"], endLen: [3, 4, 3, 6, 5, 4], note: "ir — один из всего трёх неправильных глаголов в Imperfecto (вместе с ser и ver): особая основа ib-." },
  },
  {
    id: "op-intentar", verb: "intentar", particle: "", meaning: "пытаться сделать",
    action: "recoger la pista", actionRu: "собрать улику",
    ppc: { forms: ["he intentado", "has intentado", "ha intentado", "hemos intentado", "habéis intentado", "han intentado"], endLen: [3, 3, 3, 3, 3, 3], note: "intentado — регулярное причастие -AR: intent- + -ado." },
    indefinido: { forms: ["intenté", "intentaste", "intentó", "intentamos", "intentasteis", "intentaron"], endLen: [1, 4, 1, 4, 6, 4], note: "intentar полностью регулярный -AR — никаких сюрпризов ни в одном лице." },
    imperfecto: { forms: ["intentaba", "intentabas", "intentaba", "intentábamos", "intentabais", "intentaban"], endLen: [3, 4, 3, 6, 5, 4], note: "регулярный -AR: intent- + -aba." },
  },
  {
    id: "op-empezara", verb: "empezar", particle: "a", meaning: "начинать делать",
    action: "hablar con el Jefe", actionRu: "говорить с Шефом",
    ppc: { forms: ["he empezado", "has empezado", "ha empezado", "hemos empezado", "habéis empezado", "han empezado"], endLen: [3, 3, 3, 3, 3, 3], note: "empezado — регулярное причастие: empez- + -ado." },
    indefinido: { forms: ["empecé", "empezaste", "empezó", "empezamos", "empezasteis", "empezaron"], endLen: [1, 4, 1, 4, 6, 4], note: "меняется только форма yo — empecé, не «empezé»: z → c перед e, тот же приём, что g → j в Presente." },
    imperfecto: { forms: ["empezaba", "empezabas", "empezaba", "empezábamos", "empezabais", "empezaban"], endLen: [3, 4, 3, 6, 5, 4], note: "регулярный -AR во всех шести формах — орфография z/c в Imperfecto не нужна, после -aba гласная не e." },
  },
  {
    id: "op-dejarde", verb: "dejar", particle: "de", meaning: "переставать делать",
    action: "mirar la sombra", actionRu: "смотреть на тень",
    ppc: { forms: ["he dejado", "has dejado", "ha dejado", "hemos dejado", "habéis dejado", "han dejado"], endLen: [3, 3, 3, 3, 3, 3], note: "dejado — регулярное причастие: dej- + -ado." },
    indefinido: { forms: ["dejé", "dejaste", "dejó", "dejamos", "dejasteis", "dejaron"], endLen: [1, 4, 1, 4, 6, 4], note: "dejar полностью регулярный -AR." },
    imperfecto: { forms: ["dejaba", "dejabas", "dejaba", "dejábamos", "dejabais", "dejaban"], endLen: [3, 4, 3, 6, 5, 4], note: "регулярный -AR: dej- + -aba." },
  },
  {
    id: "op-volvera", verb: "volver", particle: "a", meaning: "делать снова",
    action: "guardar la llave", actionRu: "убрать ключ",
    ppc: { forms: ["he vuelto", "has vuelto", "ha vuelto", "hemos vuelto", "habéis vuelto", "han vuelto"], endLen: [6, 6, 6, 6, 6, 6], note: "vuelto — неправильное причастие (не «volvido»): та же форма, что в теме «Причастия неправильные»." },
    indefinido: { forms: ["volví", "volviste", "volvió", "volvimos", "volvisteis", "volvieron"], endLen: [1, 4, 2, 4, 6, 5], note: "в Indefinido volver полностью регулярный -ER — неправильность живёт только в причастии." },
    imperfecto: { forms: ["volvía", "volvías", "volvía", "volvíamos", "volvíais", "volvían"], endLen: [2, 3, 2, 5, 4, 3], note: "регулярный -ER: volv- + -ía." },
  },
];
const OP_TENSE_LABEL = { presente: "Presente de indicativo", ppc: "Pretérito Perfecto Compuesto", indefinido: "Pretérito Indefinido", imperfecto: "Pretérito Imperfecto" };
const OP_TENSE_KEY = { presente: "presente", ppc: "perfecto", indefinido: "indefinido", imperfecto: "imperfecto" };
function operatorTenses(op) { return op.presente ? ["presente", "ppc", "indefinido", "imperfecto"] : ["ppc", "indefinido", "imperfecto"]; }
function opTitle(op) { return op.verb.toUpperCase() + (op.particle ? " " + op.particle.toUpperCase() : ""); }
function opGap(op) { return (op.particle ? op.particle + " " : "") + op.action + "."; }

function TemaOperador({ data: op, onBack, onTrain }) {
  return (
    <div style={wrap}><div style={maxw}>
      <GHeader kicker="El verbo · IV. Глаголы-операторы" title={`${opTitle(op)} + infinitivo`} sub={`${op.meaning} — та же капсула, что в игре Дона Вербо: оператор надевается сверху на действие, само действие (${op.action}) в infinitivo не меняется.`} />
      <div style={{ textAlign: "center", marginBottom: 14 }}><LevelTag lvl="A2" /></div>

      <RuleCard>
        Здесь спрягается только оператор <b>{op.verb}</b>{op.particle && <> — не забывай частицу <b>{op.particle}</b> после него</>}. Три времени допроса Шефа: что уже случилось и связано с сегодня (Perfecto Compuesto), что случилось в конкретный момент (Indefinido), как было обычно (Imperfecto).
      </RuleCard>

      {operatorTenses(op).map(t => {
        const pal = TENSE_PALETTE[OP_TENSE_KEY[t]];
        return (
          <div key={t}>
            <RuleCard>
              <TopicTitle title={OP_TENSE_LABEL[t]} tenseKey={OP_TENSE_KEY[t]} ready />
            </RuleCard>
            <ConjTable cols={[{ inf: op.verb, ru: op.meaning, forms: op[t].forms, endLen: op[t].endLen }]} />
            <RuleCard><Nota>{op[t].note}</Nota></RuleCard>
            <TrainBtn onClick={() => onTrain(t)} label={`⚡ Тренировать · ${OP_TENSE_LABEL[t]}`} sub={`${opTitle(op)} + ${op.action}`} bg={pal.strong} shadow="rgba(61,43,31,0.22)" />
          </div>
        );
      })}

      <BackBtn onClick={onBack} />
    </div></div>
  );
}

// Программная сборка тренажёров: одно упражнение на каждое лицо (6) на
// каждое время (3) на каждый оператор (8) = 144 карточки, «в хвост и в
// гриву» (решение Оксаны 28.08.2026). Персонажи-подлежащие переиспользуют
// голос Королевства (охранник, помощники) в порядке лиц PERSONS.
const OP_SUBJ = ["Yo", "Tú", "El guardia", "Nosotros", "Vosotros", "Los ayudantes"];
const OPERATOR_DRILLS = {};
const OPERATOR_TITLES = {};
OPERATORS.forEach(op => {
  operatorTenses(op).forEach(t => {
    const key = op.id + "-" + t;
    const set = op[t];
    OPERATOR_DRILLS[key] = OP_SUBJ.map((subj, i) => ({
      pre: t === "presente" && [1, 4].includes(i) ? `${i === 1 ? "Tú" : "Vosotros"} no` : (t === "presente" && [2, 5].includes(i) ? `¿${subj}` : subj),
      gap: t === "presente" && [2, 5].includes(i) ? `${opGap(op).replace(/\.$/, "")}?` : opGap(op),
      inf: opTitle(op) + " + infinitivo",
      ok: set.forms[i],
      note: i === 0 ? set.note : undefined,
    }));
    OPERATOR_TITLES[key] = `${opTitle(op)} + infinitivo · ${OP_TENSE_LABEL[t]}`;
  });
});

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
  // II.2 — орфография g→j: сам впиши форму
  orto: [
    { pre: "Yo", gap: "las tazas del desayuno. (слова Нико)", inf: "recoger", ok: "recojo", note: "yo → окончание -o, поэтому g → j: reco-j-o. Звук /х/ сохранён." },
    { pre: "Tú", gap: "los caramelos de la mesa.", inf: "recoger", ok: "recoges", note: "после g идёт e — звук /х/ на месте сам, менять нечего." },
    { pre: "Bruno", gap: "su lista y la abre.", inf: "recoger", ok: "recoge" },
    { pre: "Nosotros", gap: "la Sala Grande después de la cena.", inf: "recoger", ok: "recogemos" },
    { pre: "Yo", gap: "el coro de los ayudantes. (слова Шефа)", inf: "dirigir", ok: "dirijo", note: "то же правило в группе -IR: g → j только в yo." },
    { pre: "El Jefe", gap: "la Cocina Mágica.", inf: "dirigir", ok: "dirige" },
    { pre: "Yo", gap: "mi farol antes de salir. (слова Томаса)", inf: "coger", ok: "cojo", note: "coger → cojo: g → j перед -o." },
    { pre: "Los ayudantes", gap: "las jarras de la cocina.", inf: "coger", ok: "cogen" },
  ],
  // II.3 — чередование e→ie: сам впиши форму
  raiz: [
    { pre: "Yo", gap: "la luz. (слова Томаса)", inf: "encender", ok: "enciendo", note: "ударение на корне → e раскрывается в ie." },
    { pre: "Tomás", gap: "dieciocho faroles cada mañana.", inf: "encender", ok: "enciende" },
    { pre: "Tú", gap: "el primer farol del pasillo.", inf: "encender", ok: "enciendes" },
    { pre: "Nosotros", gap: "las luces de la Sala Grande.", inf: "encender", ok: "encendemos", note: "nosotros: ударение ушло на окончание — корень спокоен, остаётся e." },
    { pre: "Los ayudantes", gap: "los hornos de la Cocina Mágica.", inf: "encender", ok: "encienden" },
    { pre: "Vosotros", gap: "vuestras velas con el Jefe.", inf: "encender", ok: "encendéis", note: "vosotros — вторая форма без чередования: encend-éis (не забудь é)." },
    { pre: "Lucía", gap: "el fuego de la cocina.", inf: "encender", ok: "enciende" },
    { pre: "Yo no", gap: "los faroles de día.", inf: "encender", ok: "enciendo" },
  ],
  // II.4 — полностью неправильные estar/ir: сам впиши форму
  irr: [
    { pre: "Yo", gap: "en el pasillo con mi farol. (слова Томаса)", inf: "estar", ok: "estoy", note: "estar в yo — особая форма: estoy, не «esto»." },
    { pre: "Nico", gap: "a la Sala Grande con las jarras.", inf: "ir", ok: "va", note: "ir живёт на чужом корне v-: va." },
    { pre: "Lucía", gap: "en la cocina.", inf: "estar", ok: "está", note: "не забудь ударение: está." },
    { pre: "Yo", gap: "al palacio cada mañana.", inf: "ir", ok: "voy", note: "пара на -oy: estoy — voy." },
    { pre: "Los ayudantes", gap: "en la Cocina Mágica.", inf: "estar", ok: "están", note: "ударение: están." },
    { pre: "Nosotros", gap: "a la Sala Grande con el Jefe.", inf: "ir", ok: "vamos" },
    { pre: "Tú", gap: "cerca de la puerta, con tu farol.", inf: "estar", ok: "estás", note: "ударение: estás." },
    { pre: "Vosotros", gap: "con el Jefe por los pasillos.", inf: "ir", ok: "vais" },
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
  // II.5 — Pretérito Perfecto Compuesto: сам впиши haber + participio
  perfecto: [
    { pre: "Yo", gap: "las luces esta mañana. (dice el primer ayudante)", inf: "encender", ok: "he encendido", note: "encender → encendido: -er → -ido. Haber en yo: he." },
    { pre: "Tú", gap: "el desayuno del Jefe. ¿Ya lo has hecho?", inf: "llevar", ok: "has llevado", note: "llevar → llevado: -ar → -ado. Haber en tú: has." },
    { pre: "La segunda ayudante", gap: "los papeles del suelo dos veces hoy.", inf: "recoger", ok: "ha recogido", note: "recoger → recogido: -er → -ido, como cualquier -ER." },
    { pre: "El tercer ayudante", gap: "todos los documentos esta semana.", inf: "revisar", ok: "ha revisado" },
    { pre: "Nosotros", gap: "en la Sala dos veces hoy.", inf: "entrar", ok: "hemos entrado", note: "nosotros: hem-os + entrado. El participio no cambia." },
    { pre: "Vosotros", gap: "en la cocina toda la tarde. ¿No es así?", inf: "trabajar", ok: "habéis trabajado", note: "vosotros: hab-éis — la forma menos usada, pero regular." },
    { pre: "Todos", gap: "los ingredientes esta noche: en la Sala, en la cocina, en el jardín.", inf: "buscar", ok: "han buscado", note: "ellos/todos: han. El participio sigue siendo buscado, sin importar cuántos sean." },
    { pre: "El guardia", gap: "a las visitas en la puerta principal toda la tarde.", inf: "recibir", ok: "ha recibido", note: "recibir → recibido: -ir → -ido, igual que -er." },
  ],
  // II.5b — причастия неправильные: сам впиши форму (canon Cap.2 + contraste)
  "participios-irr": [
    { pre: "El primer ayudante: «Esta mañana", gap: "la Sala yo solo.»", inf: "abrir", ok: "he abierto", note: "abrir → abierto, no «abrido». Прямая речь помощника: yo → he." },
    { pre: "El ayudante más joven: «", gap: "una sombra esta tarde.»", inf: "ver", ok: "he visto", note: "ver → visto. Прямая речь: yo → he." },
    { pre: "El ayudante más joven sigue: «Pero no", gap: "nada porque no estaba seguro.»", inf: "decir", ok: "he dicho", note: "decir → dicho, no «decido». Он всё ещё говорит о себе: yo → he." },
    { pre: "El tercer ayudante hoy todavía no", gap: "a la Sala.", inf: "volver", ok: "ha vuelto", note: "volver → vuelto. О помощнике говорим в 3-м лице: ha." },
    { pre: "Los niños todavía no", gap: "los deberes.", inf: "hacer", ok: "han hecho", note: "hacer → hecho. ellos → han." },
    { pre: "Yo nunca", gap: "una ópera.", inf: "ver", ok: "he visto", note: "ver → visto. nunca дружит с Pretérito Perfecto Compuesto." },
    { pre: "Nosotros", gap: "la puerta principal esta tarde.", inf: "abrir", ok: "hemos abierto", note: "nosotros: hemos + abierto. Причастие не меняется по лицам." },
    { pre: "¿Vosotros", gap: "la verdad al Jefe?", inf: "decir", ok: "habéis dicho", note: "vosotros: habéis + dicho." },
    { pre: "¿Quién", gap: "la puerta de la Sala esta noche?", inf: "abrir", ok: "ha abierto", note: "¿quién? → 3-е лицо ед.: ha + abierto." },
    { pre: "Tú nunca", gap: "tan tarde antes.", inf: "volver", ok: "has vuelto", note: "tú: has + vuelto." },
  ],
  // II.6 — Pretérito Imperfecto: сам впиши форму (canon «El Caso de las Tres Huellas»)
  imperfecto: [
    { pre: "El guardia", gap: "la llave cada día.", inf: "llevar", ok: "llevaba", note: "-AR → -aba: llev-aba." },
    { pre: "El libro de recetas", gap: "letras doradas.", inf: "tener", ok: "tenía", note: "-ER → -ía: ten-ía. tener regular en Imperfecto (a diferencia de otros tiempos)." },
    { pre: "La llave", gap: "para cerrar la puerta principal.", inf: "servir", ok: "servía", note: "-IR → -ía, igual que -ER: serv-ía." },
    { pre: "Los ayudantes", gap: "el libro de lejos, pero normalmente no lo tocaban.", inf: "poder", ok: "podían", note: "ellos/ellas → -ían." },
    { pre: "Cada mañana, el primer ayudante", gap: "la luz antes de que llegaran los demás.", inf: "encender", ok: "encendía", note: "en Imperfecto encender es regular: sin el cambio e→ie que tiene en Presente." },
    { pre: "—La llave", gap: "de oro —dice el guardia.", inf: "ser", ok: "era", note: "ser: solo 3 verbos irregulares en todo el tiempo — ser, ir, ver." },
    { pre: "Cada tarde, Don Verbo", gap: "al mercado a comprar los ingredientes.", inf: "ir", ok: "iba", note: "ir: raíz especial ib- + terminaciones -a, -as, -a, -amos, -ais, -an." },
    { pre: "Desde la Sala, los ayudantes", gap: "las lámparas encendidas cada noche.", inf: "ver", ok: "veían", note: "ver: añade una -e- extra a la raíz: ve-ían." },
  ],
  // II.7 — Pretérito Indefinido regular: сам впиши форму (canon «El corte de ayer»)
  indefinido: [
    { pre: "El Jefe", gap: "la lupa del cajón. Después la guardó otra vez.", inf: "sacar", ok: "sacó", note: "-AR → -ó: sac-ó." },
    { pre: "El guardia", gap: "la puerta a las cuatro y otra vez a las seis.", inf: "abrir", ok: "abrió", note: "-IR → -ió: abr-ió." },
    { pre: "Don Verbo", gap: "una nueva porción de ingredientes en el mercado.", inf: "comprar", ok: "compró" },
    { pre: "Yo", gap: "la puerta con llave. (слова охранника)", inf: "cerrar", ok: "cerré", note: "yo → -é: cerr-é." },
    { pre: "El tercer ayudante", gap: "los últimos diez documentos.", inf: "revisar", ok: "revisó" },
    { pre: "Nosotros", gap: "la bolsa al primer ayudante.", inf: "entregar", ok: "entregamos", note: "-AR, nosotros: forma совпадает с Presente — различает контекст «ayer»." },
    { pre: "Don Verbo", gap: "al palacio a las seis.", inf: "volver", ok: "volvió", note: "-ER → -ió: volv-ió." },
    { pre: "Tú no", gap: "nada extraño ayer. ¿Verdad?", inf: "escribir", ok: "escribiste", note: "tú → -iste: escrib-iste." },
  ],
  // II.7b — Pretérito Indefinido irregular (raíz fuerte + dar/ver + ser/ir): сам впиши форму
  "indefinido-irr": [
    { pre: "—¿La pista", gap: "fuera del Palacio ayer? —Sí, estuvo.", inf: "estar", ok: "estuvo", note: "estar → estuv- + -o (sin tilde, no «estuvó»)." },
    { pre: "El guardia se la", gap: "a Don Verbo y la llave salió del Palacio con él.", inf: "dar", ok: "dio", note: "dar: forma corta, sin tilde — dio, no «dió»." },
    { pre: "La llave no", gap: "al mercado.", inf: "ir", ok: "fue", note: "ir/ser comparten fui, fuiste, fue, fuimos, fuisteis, fueron." },
    { pre: "Yo", gap: "la varilla en la mano un momento, nada más. (dice el segundo ayudante)", inf: "tener", ok: "tuve", note: "tener → tuv- + -e en yo." },
    { pre: "El Jefe", gap: "la última palabra del día antes de las ocho.", inf: "hacer", ok: "hizo", note: "hacer → hic-, pero en él: c → z antes de o: hizo, no «hico»." },
    { pre: "—No", gap: "nada sobre la sombra hasta hoy —dice el ayudante más joven.", inf: "decir", ok: "dije", note: "decir → dij- + -e en yo." },
    { pre: "Don Verbo", gap: "volver al palacio antes de que cerraran la puerta.", inf: "poder", ok: "pudo", note: "poder → pud- + -o en él." },
    { pre: "Los ayudantes", gap: "la lupa sobre la mesa de la Sala.", inf: "ver", ok: "vieron", note: "ver: forma corta sin tilde, ellos → vieron." },
    { pre: "Nosotros no", gap: "nada extraño esa noche.", inf: "traer", ok: "trajimos", note: "traer → traj-; ellos sería trajeron, no «trajieron» — la j se come la i." },
    { pre: "El tercer ayudante", gap: "los papeles en su caja.", inf: "poner", ok: "puso", note: "poner → pus- + -o en él." },
  ],
  ...OPERATOR_DRILLS,
};

function Drill({ setKey, onBack, onComplete }) {
  const isInput = ["regulares", "orto", "raiz", "irr", "perfecto", "participios-irr", "imperfecto", "indefinido", "indefinido-irr"].includes(setKey) || setKey.startsWith("op-"); // спряжение = всегда текстовый ввод (решение Оксаны, 6 июля)
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
      <BackBtn onClick={onComplete || onBack} label={onComplete ? "← Вернуться в ту же сцену" : "← К теме"} />
    </div></div>
  );

  const it = items[i];
  const TITLES = { grupos: "Определи группу глагола", personas: "Кто действует?", regulares: "Сам впиши форму", orto: "g или j? Впиши форму", raiz: "e или ie? Впиши форму", irr: "Неправильные: впиши форму", perfecto: "Haber + participio: впиши форму", "participios-irr": "Причастие неправильное: впиши форму", imperfecto: "Pretérito Imperfecto: впиши форму", indefinido: "Pretérito Indefinido: впиши форму", "indefinido-irr": "Глагол исключение: впиши форму", ...OPERATOR_TITLES };
  const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, " "); // схлопываем лишние пробелы: «habéis  trabajado» = «habéis trabajado»
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
              onKeyDown={e => { if (e.key === "Enter" && typed.trim() && !picked) pick(norm(typed)); }}
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
              <div onClick={() => typed.trim() && pick(norm(typed))} style={{
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
      { id: "presente-orto", title: "Presente · орфографические изменения (g→j…)", lvl: "A1", ready: true },
      { id: "presente-raiz", title: "Presente · чередования в корне (e→ie…)", lvl: "A1", ready: true },
      { id: "presente-irr", title: "Presente · полностью неправильные (estar, ir…)", lvl: "A1", ready: true },
      { id: "perfecto", title: "Pretérito Perfecto Compuesto", lvl: "A1–A2", ready: true },
      { id: "participios-irr", title: "Pretérito Perfecto Compuesto · причастия неправильные (vuelto, abierto…)", lvl: "A2", ready: true },
      { id: "imperfecto", title: "Pretérito Imperfecto", lvl: "A1–A2", ready: true },
      { id: "indefinido", title: "Pretérito Indefinido · регулярные глаголы", lvl: "A2", ready: true },
      { id: "indefinido-irr", title: "Pretérito Indefinido · глаголы исключения", lvl: "A2–B1", ready: true },
    ],
  },
  {
    id: "tipos", num: "III", title: "Особые типы глаголов", sub: "Сквозные явления, живущие во всех временах",
    topics: [
      { id: "reflexivos", title: "Возвратные глаголы (verbos reflexivos)", lvl: "A2", ready: false },
    ],
  },
  {
    id: "operadores", num: "IV", title: "Глаголы-операторы", sub: "Форма операторов по временам; сюжетные капсулы живут в Главе 4",
    topics: OPERATORS.map(op => ({ id: op.id, title: `${opTitle(op)} + infinitivo · ${op.meaning}`, lvl: "A2", ready: true })),
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
                    <TenseDot tenseKey={TENSE_OF_TOPIC[t.id]} ready={t.ready} />
                    <div style={{ flex: 1, fontSize: 14.5, fontWeight: t.ready ? 700 : 500, color: C.ink, lineHeight: 1.4 }}><TopicTitle title={t.title} tenseKey={TENSE_OF_TOPIC[t.id]} ready={t.ready} /></div>
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
// Deep-link из капсул Don Verbo: id темы → её дрилл (приземление сразу в тренировку).
const TEMA_TO_DRILL = {
  "infinitivo": "grupos",
  "personas": "personas",
  "presente-reg": "regulares",
  "presente-orto": "orto",
  "presente-raiz": "raiz",
  "presente-irr": "irr",
  "perfecto": "perfecto",
  "participios-irr": "participios-irr",
  "imperfecto": "imperfecto",
  "indefinido": "indefinido",
  "indefinido-irr": "indefinido-irr",
};
// Deep-link на конкретное время конкретного оператора — op-<verb>-<tense> —
// приземляет сразу в дрилл (та же логистика, что у обычных капсул); topic-id
// без времени (op-querer) открывает страницу оператора со всеми тремя.
OPERATORS.forEach(op => { operatorTenses(op).forEach(t => { TEMA_TO_DRILL[op.id + "-" + t] = op.id + "-" + t; }); });
const OPERATOR_TOPIC_IDS = OPERATORS.map(op => op.id);

export default function Gramatica({ onBack, startTema, onComplete }) {
  // view: root | verbo | тема | drill:<set>
  // startTema (deep-link ?tema=): открываем сразу дрилл темы; «назад» ведёт на страницу темы.
  const startDrill = startTema && TEMA_TO_DRILL[startTema] ? "drill:" + TEMA_TO_DRILL[startTema] : null;
  const startView = OPERATOR_TOPIC_IDS.includes(startTema) ? startTema
    : startDrill;
  const [view, setView] = useState(startView || "root");
  const [drillFrom, setDrillFrom] = useState(startDrill ? startTema : null);

  const openDrill = (set, from) => { setDrillFrom(from); setView("drill:" + set); };

  if (view === "root") return <GramaticaRoot onVerbo={() => setView("verbo")} onBack={onBack} />;
  if (view === "verbo") return <VerboIndex onOpen={(id) => setView(id)} onBack={() => setView("root")} />;
  if (view === "infinitivo") return <TemaInfinitivo onBack={() => setView("verbo")} onTrain={() => openDrill("grupos", "infinitivo")} />;
  if (view === "personas") return <TemaPersonas onBack={() => setView("verbo")} onTrain={() => openDrill("personas", "personas")} />;
  if (view === "presente-reg") return <TemaPresenteRegulares onBack={() => setView("verbo")} onTrain={() => openDrill("regulares", "presente-reg")} />;
  if (view === "presente-orto") return <TemaPresenteOrto onBack={() => setView("verbo")} onTrain={() => openDrill("orto", "presente-orto")} />;
  if (view === "presente-raiz") return <TemaPresenteRaiz onBack={() => setView("verbo")} onTrain={() => openDrill("raiz", "presente-raiz")} />;
  if (view === "presente-irr") return <TemaPresenteIrr onBack={() => setView("verbo")} onTrain={() => openDrill("irr", "presente-irr")} />;
  if (view === "perfecto") return <TemaPerfecto onBack={() => setView("verbo")} onTrain={() => openDrill("perfecto", "perfecto")} />;
  if (view === "participios-irr") return <TemaParticipiosIrr onBack={() => setView("verbo")} onTrain={() => openDrill("participios-irr", "participios-irr")} />;
  if (view === "imperfecto") return <TemaImperfecto onBack={() => setView("verbo")} onTrain={() => openDrill("imperfecto", "imperfecto")} />;
  if (view === "indefinido") return <TemaIndefinido onBack={() => setView("verbo")} onTrain={() => openDrill("indefinido", "indefinido")} />;
  if (view === "indefinido-irr") return <TemaIndefinidoIrr onBack={() => setView("verbo")} onTrain={() => openDrill("indefinido-irr", "indefinido-irr")} />;
  const opView = OPERATORS.find(o => o.id === view);
  if (opView) return <TemaOperador data={opView} onBack={() => setView("verbo")} onTrain={(t) => openDrill(opView.id + "-" + t, opView.id)} />;
  if (view.startsWith("drill:")) return <Drill setKey={view.slice(6)} onBack={() => setView(drillFrom || "verbo")} onComplete={onComplete} />;
  return <GramaticaRoot onVerbo={() => setView("verbo")} onBack={onBack} />;
}
