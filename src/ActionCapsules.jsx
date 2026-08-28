import { useMemo, useState } from "react";
import {
  CAPSULE_ACTIONS,
  CAPSULE_OPERATORS,
  CAPSULE_STORIES,
  capsuleByIds,
  capsulePhrase,
} from "./actionCapsulesData.js";

const C = {
  cream: "#FAF3E6", creamDeep: "#F3E8D2", card: "#FFFFFF",
  ink: "#3D2B1F", inkSoft: "#6B5544", gold: "#C9A24B",
  goldDeep: "#A67C2E", line: "#E6D6B8", raspberry: "#A81B3E",
  emerald: "#16795B", emeraldDeep: "#0F5E47",
};
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const wrap = { minHeight: "100vh", background: `radial-gradient(120% 80% at 50% 0%, ${C.cream} 0%, ${C.creamDeep} 100%)`, fontFamily: SERIF, color: C.ink, padding: "18px 14px 90px", boxSizing: "border-box" };
const maxw = { maxWidth: 560, margin: "0 auto" };

const MODE_INFO = [
  ["recognize", "Узнать", "Что изменилось в статусе действия"],
  ["build", "Собрать", "Оператор + действие + предмет"],
  ["transform", "Перестроить", "Сохранить действие, сменить команду"],
  ["story", "История", "Выбрать речевой ход по ситуации"],
];

function Back({ onClick, label = "← Назад" }) {
  return <button onClick={onClick} style={{ display: "block", margin: "22px auto 0", background: "none", border: "none", color: C.inkSoft, fontFamily: SERIF, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>{label}</button>;
}

function Header({ small, title, sub }) {
  return <div style={{ textAlign: "center", marginBottom: 18 }}>
    <div style={{ color: C.goldDeep, fontSize: 10.5, fontWeight: 800, letterSpacing: "1.4px", textTransform: "uppercase", marginBottom: 6 }}>{small}</div>
    <div style={{ color: C.raspberry, fontSize: 27, fontWeight: 800, lineHeight: 1.15 }}>{title}</div>
    {sub && <div style={{ color: C.inkSoft, fontSize: 13.5, lineHeight: 1.55, marginTop: 8 }}>{sub}</div>}
  </div>;
}

function Card({ children, style }) {
  return <div style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 16, padding: 18, boxShadow: "0 3px 14px rgba(61,43,31,.07)", marginBottom: 14, ...style }}>{children}</div>;
}

function Capsule({ operator, action, compact = false }) {
  if (!operator || !action) return null;
  return <div aria-label={`${operator.yo} ${action.infinitive} ${action.object}`} style={{ display: "grid", gap: 6, margin: compact ? "10px 0" : "16px 0" }}>
    <div style={{ justifySelf: "center", background: operator.color, color: "#fff", borderRadius: 999, padding: compact ? "7px 16px" : "9px 20px", fontSize: compact ? 14 : 17, fontWeight: 900, letterSpacing: ".4px", boxShadow: "0 4px 10px rgba(61,43,31,.14)" }}>{operator.yo}</div>
    <div style={{ width: 2, height: 9, justifySelf: "center", background: C.gold }} />
    <div style={{ border: `2px solid ${C.gold}`, background: C.cream, borderRadius: 14, padding: compact ? "10px 12px" : "13px 16px", textAlign: "center" }}>
      <b style={{ color: C.raspberry, fontSize: compact ? 16 : 19 }}>{action.infinitive}</b>
      <span style={{ color: C.inkSoft, fontSize: compact ? 13 : 15 }}> {action.object}</span>
    </div>
  </div>;
}

function LayerFeedback({ expected, selectedOperator, selectedAction }) {
  const operatorOk = selectedOperator === expected.operator.id;
  const actionOk = selectedAction === expected.action.id;
  const expectedOperator = expected.person === "el" ? expected.operator.el : expected.person === "ella" ? expected.operator.ella : expected.operator.yo;
  return <div style={{ background: C.cream, borderRadius: 12, padding: "11px 12px", marginTop: 14, fontSize: 13.5, lineHeight: 1.55 }}>
    <div>Оператор: <b style={{ color: operatorOk ? C.emerald : C.raspberry }}>{operatorOk ? "✓ верно" : `✕ нужен ${expectedOperator}`}</b></div>
    <div>Действие: <b style={{ color: actionOk ? C.emerald : C.raspberry }}>{actionOk ? "✓ infinitivo сохранён" : `✕ нужен ${expected.action.infinitive}`}</b></div>
    <div>Предмет: <b style={{ color: C.emerald }}>✓ остаётся частью сцены</b></div>
  </div>;
}

function Choice({ active, children, onClick, disabled }) {
  return <button onClick={onClick} disabled={disabled} style={{ width: "100%", minWidth: 0, border: `1.5px solid ${active ? C.goldDeep : C.line}`, background: active ? C.gold : C.card, color: active ? "#fff" : C.ink, borderRadius: 12, padding: "11px 8px", fontFamily: SERIF, fontSize: 14.5, fontWeight: 800, lineHeight: 1.2, overflowWrap: "anywhere", cursor: disabled ? "default" : "pointer" }}>{children}</button>;
}

function Progress({ index, total }) {
  return <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>{Array.from({ length: total }, (_, i) => <div key={i} style={{ height: 5, flex: 1, borderRadius: 999, background: i <= index ? C.gold : C.line }} />)}</div>;
}

function Finish({ score, total, onAgain, onBack }) {
  return <div style={wrap}><div style={maxw}>
    <Header small="Капсулы действия A1" title="Маршрут пройден" sub={`${score} из ${total} ходов собраны точно.`} />
    <Card style={{ textAlign: "center" }}>
      <div style={{ fontSize: 38, marginBottom: 8 }}>{score === total ? "✦" : "↻"}</div>
      <div style={{ fontSize: 16, lineHeight: 1.6 }}>Первый глагол меняет статус действия.<br /><b>Само действие остаётся в infinitivo.</b></div>
      <button onClick={onAgain} style={{ marginTop: 18, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Пройти ещё раз</button>
    </Card>
    <Back onClick={onBack} label="← К режимам" />
  </div></div>;
}

function Recognize({ onBack }) {
  const tasks = useMemo(() => CAPSULE_ACTIONS.map((action, i) => ({
    action,
    operator: CAPSULE_OPERATORS[i % CAPSULE_OPERATORS.length],
    person: i % 2 === 0 ? "el" : "ella",
  })), []);
  const [i, setI] = useState(0); const [picked, setPicked] = useState(null); const [score, setScore] = useState(0);
  if (i >= tasks.length) return <Finish score={score} total={tasks.length} onAgain={() => { setI(0); setPicked(null); setScore(0); }} onBack={onBack} />;
  const task = tasks[i]; const ok = picked === task.operator.id;
  return <div style={wrap}><div style={maxw}>
    <Header small="1 · Узнать" title="Что делает оператор?" sub="Действие уже дано. Определи его статус." />
    <Progress index={i} total={tasks.length} />
    <Card>
      <div style={{ color: C.inkSoft, fontSize: 13, textAlign: "center" }}>{task.action.scene}</div>
      <div style={{ textAlign: "center", fontSize: 21, fontWeight: 800, margin: "18px 0" }}>{capsulePhrase(task.operator.id, task.action.id, task.person)}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 7 }}>
        {CAPSULE_OPERATORS.map(op => <Choice key={op.id} active={picked === op.id} disabled={!!picked} onClick={() => { setPicked(op.id); if (op.id === task.operator.id) setScore(s => s + 1); }}>{op.label}</Choice>)}
      </div>
      {picked && <div style={{ marginTop: 14, color: ok ? C.emeraldDeep : C.raspberry, textAlign: "center", fontWeight: 800 }}>{ok ? "Точно: статус действия распознан." : `Здесь ${task.person === "el" ? task.operator.el : task.operator.ella} = «${task.person === "el" ? task.operator.elRu : task.operator.ellaRu}».`}</div>}
      {picked && <button onClick={() => { setI(i + 1); setPicked(null); }} style={{ marginTop: 14, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>Следующий ход →</button>}
    </Card>
    <Back onClick={onBack} label="← К режимам" />
  </div></div>;
}

function Build({ onBack }) {
  const tasks = useMemo(() => CAPSULE_ACTIONS.map((action, i) => ({ action, operator: CAPSULE_OPERATORS[(i + 1) % CAPSULE_OPERATORS.length] })), []);
  const [i, setI] = useState(0); const [op, setOp] = useState(null); const [act, setAct] = useState(null); const [checked, setChecked] = useState(false); const [score, setScore] = useState(0);
  if (i >= tasks.length) return <Finish score={score} total={tasks.length} onAgain={() => { setI(0); setOp(null); setAct(null); setChecked(false); setScore(0); }} onBack={onBack} />;
  const task = tasks[i];
  return <div style={wrap}><div style={maxw}>
    <Header small="2 · Собрать" title="Собери речевой ход" sub={`Задание: «${task.operator.taskRu} ${task.action.taskRu}».`} />
    <Progress index={i} total={tasks.length} />
    <Card>
      <div style={{ fontSize: 12, fontWeight: 800, color: C.goldDeep, marginBottom: 7 }}>1. ОПЕРАТОР</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 7 }}>{CAPSULE_OPERATORS.map(x => <Choice key={x.id} active={op === x.id} disabled={checked} onClick={() => setOp(x.id)}>{x.yo}</Choice>)}</div>
      <div style={{ fontSize: 12, fontWeight: 800, color: C.goldDeep, margin: "16px 0 7px" }}>2. ДЕЙСТВИЕ</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 7 }}>{CAPSULE_ACTIONS.map(x => <Choice key={x.id} active={act === x.id} disabled={checked} onClick={() => setAct(x.id)}>{x.infinitive}</Choice>)}</div>
      {op && act && <Capsule {...capsuleByIds(op, act)} compact />}
      {!checked && <button disabled={!op || !act} onClick={() => { setChecked(true); if (op === task.operator.id && act === task.action.id) setScore(s => s + 1); }} style={{ marginTop: 14, width: "100%", background: op && act ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: op && act ? "pointer" : "default" }}>Проверить капсулу</button>}
      {checked && <LayerFeedback expected={task} selectedOperator={op} selectedAction={act} />}
      {checked && <button onClick={() => { setI(i + 1); setOp(null); setAct(null); setChecked(false); }} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>Новая сцена →</button>}
    </Card>
    <Back onClick={onBack} label="← К режимам" />
  </div></div>;
}

function Transform({ onBack }) {
  const tasks = useMemo(() => CAPSULE_ACTIONS.map((action, i) => ({ action, from: CAPSULE_OPERATORS[i % 3], to: CAPSULE_OPERATORS[(i + 1) % 3] })), []);
  const [i, setI] = useState(0); const [picked, setPicked] = useState(null); const [score, setScore] = useState(0);
  if (i >= tasks.length) return <Finish score={score} total={tasks.length} onAgain={() => { setI(0); setPicked(null); setScore(0); }} onBack={onBack} />;
  const task = tasks[i];
  return <div style={wrap}><div style={maxw}>
    <Header small="3 · Перестроить" title="Действие не меняется" sub={`Было «${task.from.label.toLowerCase()}». Сделай «${task.to.label.toLowerCase()}».`} />
    <Progress index={i} total={tasks.length} />
    <Card>
      <div style={{ textAlign: "center", color: C.inkSoft, fontSize: 13 }}>Было</div>
      <div style={{ textAlign: "center", fontSize: 18, fontWeight: 800, margin: "6px 0 16px" }}>{capsulePhrase(task.from.id, task.action.id)}</div>
      <div style={{ display: "grid", gap: 8 }}>
        {CAPSULE_OPERATORS.map(operator => <Choice key={operator.id} active={picked === operator.id} disabled={!!picked} onClick={() => { setPicked(operator.id); if (operator.id === task.to.id) setScore(s => s + 1); }}>{capsulePhrase(operator.id, task.action.id)}</Choice>)}
      </div>
      {picked && <LayerFeedback expected={{ operator: task.to, action: task.action }} selectedOperator={picked} selectedAction={task.action.id} />}
      {picked && <button onClick={() => { setI(i + 1); setPicked(null); }} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>Следующая перестройка →</button>}
    </Card>
    <Back onClick={onBack} label="← К режимам" />
  </div></div>;
}

function Story({ onBack }) {
  const [i, setI] = useState(0); const [picked, setPicked] = useState(null); const [score, setScore] = useState(0);
  if (i >= CAPSULE_STORIES.length) return <Finish score={score} total={CAPSULE_STORIES.length} onAgain={() => { setI(0); setPicked(null); setScore(0); }} onBack={onBack} />;
  const story = CAPSULE_STORIES[i]; const expected = capsuleByIds(story.operatorId, story.actionId);
  return <div style={wrap}><div style={maxw}>
    <Header small="4 · История" title="Выбери речевой ход" sub={story.prompt} />
    <Progress index={i} total={CAPSULE_STORIES.length} />
    <Card>
      <div style={{ fontSize: 15, lineHeight: 1.7, borderLeft: `3px solid ${C.gold}`, paddingLeft: 13 }}>{story.story}</div>
      <div style={{ fontSize: 13, lineHeight: 1.6, color: C.inkSoft, borderLeft: `3px solid ${C.line}`, paddingLeft: 13, marginTop: 7 }}>{story.storyRu}</div>
      <div style={{ display: "grid", gap: 8, marginTop: 18 }}>
        {CAPSULE_OPERATORS.map(operator => <Choice key={operator.id} active={picked === operator.id} disabled={!!picked} onClick={() => { setPicked(operator.id); if (operator.id === story.operatorId) setScore(s => s + 1); }}>{capsulePhrase(operator.id, story.actionId)}</Choice>)}
      </div>
      {picked && <LayerFeedback expected={expected} selectedOperator={picked} selectedAction={story.actionId} />}
      {picked && <button onClick={() => { setI(i + 1); setPicked(null); }} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>Продолжить расследование →</button>}
    </Card>
    <Back onClick={onBack} label="← К режимам" />
  </div></div>;
}

function Start({ onMode, onBack }) {
  const demo = capsuleByIds("querer", "abrir");
  return <div style={wrap}><div style={maxw}>
    <Header small="El verbo · A1" title="Капсулы действия" sub="Одна знакомая сцена получает новую команду. Спрягается только первый глагол; действие остаётся в infinitivo." />
    <Card>
      <Capsule {...demo} />
      <div style={{ textAlign: "center", fontSize: 13.5, color: C.inkSoft, lineHeight: 1.55 }}><b style={{ color: C.ink }}>Yo quiero</b> сообщает намерение.<br /><b style={{ color: C.raspberry }}>Abrir</b> сохраняет действие.</div>
    </Card>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
      {MODE_INFO.map(([id, title, sub], i) => <button key={id} onClick={() => onMode(id)} style={{ minHeight: 118, background: C.card, border: `1.5px solid ${C.gold}`, borderRadius: 15, padding: 13, textAlign: "left", fontFamily: SERIF, cursor: "pointer", boxShadow: "0 3px 12px rgba(201,162,75,.12)" }}>
        <div style={{ color: C.goldDeep, fontSize: 11, fontWeight: 900 }}>{i + 1}</div>
        <div style={{ color: C.raspberry, fontSize: 17, fontWeight: 900, margin: "4px 0" }}>{title}</div>
        <div style={{ color: C.inkSoft, fontSize: 12.5, lineHeight: 1.4 }}>{sub}</div>
      </button>)}
    </div>
    <div style={{ textAlign: "center", color: C.inkSoft, fontSize: 12, lineHeight: 1.55, marginTop: 16 }}>Первый этаж: abrir · llevar · buscar · recoger · guardar · usar · dar</div>
    <Back onClick={onBack} label="← К темам глагола" />
  </div></div>;
}

export default function ActionCapsules({ onBack }) {
  const [mode, setMode] = useState("start");
  if (mode === "recognize") return <Recognize onBack={() => setMode("start")} />;
  if (mode === "build") return <Build onBack={() => setMode("start")} />;
  if (mode === "transform") return <Transform onBack={() => setMode("start")} />;
  if (mode === "story") return <Story onBack={() => setMode("start")} />;
  return <Start onMode={setMode} onBack={onBack} />;
}
