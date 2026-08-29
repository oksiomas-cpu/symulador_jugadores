import { useEffect, useMemo, useState } from "react";
import {
  CAPSULE_ACTIONS,
  CAPSULE_OPERATORS,
  CAPSULE_STORIES,
  capsuleByIds,
  capsulePhrase,
} from "./actionCapsulesData.js";
import { QUERER_DIALOGUES, QUERER_INTRO, QUERER_REVIEW } from "./quererDialogueData.js";
import { PODER_DIALOGUES, PODER_INTRO, PODER_REVIEW } from "./poderDialogueData.js";
import {
  CAPSULE_LINE,
  QUERER_CAPSULE_1,
  QUERER_CAPSULE_1_STEPS,
  QUERER_PRESENT,
} from "./quererCapsule1Data.js";
import {
  PODER_CAPSULE_1,
  PODER_CAPSULE_1_STEPS,
  PODER_PRESENT,
} from "./poderCapsule1Data.js";
import {
  TENER_QUE_CAPSULE_1,
  TENER_QUE_CAPSULE_1_STEPS,
  TENER_QUE_PRESENT,
} from "./tenerQueCapsule1Data.js";
import {
  IR_A_CAPSULE_1,
  IR_A_CAPSULE_1_STEPS,
  IR_A_PRESENT,
} from "./irACapsule1Data.js";
import {
  INTENTAR_CAPSULE_1,
  INTENTAR_CAPSULE_1_STEPS,
  INTENTAR_PRESENT,
} from "./intentarCapsule1Data.js";
import {
  EMPEZAR_A_CAPSULE_1,
  EMPEZAR_A_CAPSULE_1_STEPS,
  EMPEZAR_A_PRESENT,
} from "./empezarACapsule1Data.js";
import {
  DEJAR_DE_CAPSULE_1,
  DEJAR_DE_CAPSULE_1_STEPS,
  DEJAR_DE_PRESENT,
} from "./dejarDeCapsule1Data.js";
import {
  VOLVER_A_CAPSULE_1,
  VOLVER_A_CAPSULE_1_STEPS,
  VOLVER_A_PRESENT,
} from "./volverACapsule1Data.js";

const C = {
  cream: "#FAF3E6", creamDeep: "#F3E8D2", card: "#FFFFFF",
  ink: "#3D2B1F", inkSoft: "#6B5544", gold: "#C9A24B",
  goldDeep: "#A67C2E", line: "#E6D6B8", raspberry: "#A81B3E",
  emerald: "#16795B", emeraldDeep: "#0F5E47",
};
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const wrap = { minHeight: "100vh", background: `radial-gradient(120% 80% at 50% 0%, ${C.cream} 0%, ${C.creamDeep} 100%)`, fontFamily: SERIF, color: C.ink, padding: "18px 14px 90px", boxSizing: "border-box" };
const maxw = { maxWidth: 560, margin: "0 auto" };
const PROGRESS_KEY = "ciudad:operator-capsules:v1";

function readProgress() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "null");
    if (saved && Array.isArray(saved.completed)) return saved;
  } catch (_) { /* localStorage может быть недоступен внутри webview. */ }
  return { currentId: "querer-1", completed: [], stepByCapsule: {} };
}

function writeProgress(next) {
  try { window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next)); } catch (_) { /* UI остаётся рабочим без storage. */ }
}

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

function DialogueLine({ speaker, text, missing = false }) {
  return <div style={{ marginBottom: 10 }}>
    <div style={{ color: C.goldDeep, fontSize: 11, fontWeight: 900, letterSpacing: ".5px", textTransform: "uppercase" }}>{speaker}</div>
    <div style={{ marginTop: 3, padding: "10px 12px", borderRadius: 12, background: missing ? C.cream : "#fff", border: `1px solid ${missing ? C.gold : C.line}`, fontSize: 15, lineHeight: 1.5, fontWeight: missing ? 800 : 600 }}>{text}</div>
  </div>;
}

function shuffledTokens(dialogue) {
  const result = dialogue.answerTokens.map((text, index) => ({ id: `${dialogue.id}-${index}`, text, index }));
  let seed = dialogue.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  for (let i = result.length - 1; i > 0; i -= 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function DialogueExercise({ dialogue, onSolved, capsuleLabel = "Cápsula 2", total = QUERER_DIALOGUES.length }) {
  const tokens = useMemo(() => shuffledTokens(dialogue), [dialogue]);
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const answer = dialogue.answerTokens.join(" ");
  const assembled = selected.map(id => tokens.find(token => token.id === id)?.text).filter(Boolean).join(" ");
  const remaining = tokens.filter(token => !selected.includes(token.id));

  function checkAnswer() {
    if (assembled === answer) {
      setFeedback({ ok: true });
      return;
    }
    const selectedIndexes = selected.map(id => tokens.find(token => token.id === id)?.index);
    const mismatch = selectedIndexes.findIndex((sourceIndex, targetIndex) => sourceIndex !== targetIndex);
    const layer = dialogue.layers[Math.max(0, mismatch)] || "CAPSULA";
    setFeedback({ ok: false, layer });
  }

  return <div style={wrap}><div style={maxw}>
    <Header small={`${capsuleLabel} · ${dialogue.number} de ${total}`} title={dialogue.title} sub={dialogue.context} />
    <Progress index={dialogue.number - 1} total={total} />
    <Card>
      {dialogue.before.map((line, index) => <DialogueLine key={`before-${index}`} {...line} />)}
      <DialogueLine speaker={dialogue.answerSpeaker} text={feedback?.ok ? answer : assembled || "…"} missing={!feedback?.ok} />
      {feedback?.ok && dialogue.after.map((line, index) => <DialogueLine key={`after-${index}`} {...line} />)}

      {!feedback?.ok && <>
        <div style={{ color: C.goldDeep, fontSize: 11, fontWeight: 900, margin: "18px 0 8px", letterSpacing: ".6px" }}>CONSTRUYE LA RESPUESTA</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {remaining.map(token => <button key={token.id} onClick={() => { setSelected(items => [...items, token.id]); setFeedback(null); }} style={{ border: `1.5px solid ${C.gold}`, borderRadius: 999, background: C.card, color: C.ink, padding: "9px 12px", fontFamily: SERIF, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>{token.text}</button>)}
        </div>
        {selected.length > 0 && <button onClick={() => { setSelected(items => items.slice(0, -1)); setFeedback(null); }} style={{ marginTop: 12, border: 0, background: "none", color: C.inkSoft, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>← Quitar la última parte</button>}
        {feedback && !feedback.ok && <div style={{ marginTop: 14, background: "#FFF4F5", border: `1px solid ${C.raspberry}`, borderRadius: 12, padding: 12, color: C.raspberry, fontSize: 13.5, lineHeight: 1.55 }}><b>Revisa la capa: {feedback.layer}.</b><br />La acción debe conservarse en infinitivo y todos los participantes de la escena deben permanecer en la frase.</div>}
        <button disabled={selected.length !== tokens.length} onClick={checkAnswer} style={{ marginTop: 14, width: "100%", background: selected.length === tokens.length ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: selected.length === tokens.length ? "pointer" : "default" }}>Comprobar la cápsula</button>
      </>}

      {feedback?.ok && <>
        <div style={{ marginTop: 14, color: C.emeraldDeep, background: "#ECF8F3", borderRadius: 12, padding: 12, textAlign: "center", fontWeight: 900 }}>La intención está completa.</div>
        <button onClick={onSolved} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{dialogue.number === total ? "Ir al interrogatorio →" : "Continuar el diálogo →"}</button>
      </>}
    </Card>
  </div></div>;
}

function normalizeAnswer(value) {
  return String(value || "").trim().toLowerCase().replace(/[¿?¡!.,]/g, "").replace(/\s+/g, " ");
}

function QuererOne({ onBack, onPracticeGrammar, onComplete, initialStep = 0, onStep }) {
  const [phase, setPhase] = useState(initialStep > 0 ? "steps" : "scene");
  const [stepIndex, setStepIndex] = useState(Math.min(initialStep, QUERER_CAPSULE_1_STEPS.length - 1));
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => { onStep?.(stepIndex); }, [stepIndex]);

  const resetAnswer = () => { setPicked(null); setTyped(""); setFeedback(null); };
  const goNext = () => {
    resetAnswer();
    if (stepIndex === QUERER_CAPSULE_1_STEPS.length - 1) setPhase("review");
    else setStepIndex(value => value + 1);
  };
  const goPrev = () => { resetAnswer(); setStepIndex(value => Math.max(0, value - 1)); };

  const grammarButton = (label = "Точечно потренировать QUERER") => (
    <button onClick={() => onPracticeGrammar?.({ capsuleId: "querer-1", stepIndex })} style={{ marginTop: 10, width: "100%", background: C.card, color: C.goldDeep, border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{label} →</button>
  );

  if (phase === "scene") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 1 de 16 · QUERER" title={QUERER_CAPSULE_1.title} sub={QUERER_CAPSULE_1.linkTitle} />
    <Card>
      <div style={{ fontSize: 16, lineHeight: 1.7, borderLeft: `3px solid ${C.gold}`, paddingLeft: 13 }}>{QUERER_CAPSULE_1.scene.es}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: C.inkSoft, marginTop: 9, borderLeft: `3px solid ${C.line}`, paddingLeft: 13 }}>{QUERER_CAPSULE_1.scene.ru}</div>
      <div style={{ marginTop: 16, background: C.cream, borderRadius: 12, padding: 12, fontSize: 13.5, lineHeight: 1.55 }}><b>Задача:</b> понять намерение, вступить в диалог и самому открыть дверь репликой.</div>
      <button onClick={() => setPhase("steps")} style={{ marginTop: 16, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Войти в диалог →</button>
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;

  if (phase === "review") {
    const item = QUERER_PRESENT[reviewIndex];
    const correct = feedback?.ok;
    const submit = () => {
      if (!typed.trim()) return;
      setFeedback({ ok: normalizeAnswer(typed) === item.form });
    };
    return <div style={wrap}><div style={maxw}>
      <Header small={`Закрепление · ${reviewIndex + 1} из ${QUERER_PRESENT.length}`} title="Шесть лиц QUERER" sub="Смысл уже понятен. Теперь закрепляем форму, чтобы реплика держалась уверенно." />
      <Progress index={reviewIndex} total={QUERER_PRESENT.length} />
      <Card>
        <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.6 }}><b>{item.person}</b> <span style={{ color: C.goldDeep }}>___</span> abrir la puerta.</div>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit()} disabled={!!feedback} placeholder="форма querer" autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={submit} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить</button>}
        {feedback && <div style={{ marginTop: 13, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, textAlign: "center", fontWeight: 800 }}>{correct ? `${item.person} — ${item.form}.` : `Нужна форма ${item.form}. Ошибка в слое ОПЕРАТОР.`}</div>}
        {feedback && !correct && grammarButton("Отработать шесть форм QUERER")}
        {feedback && <button onClick={() => {
          if (!correct) { setTyped(""); setFeedback(null); return; }
          if (reviewIndex === QUERER_PRESENT.length - 1) {
            onComplete?.("querer-1");
            setPhase("finish");
          } else {
            setReviewIndex(value => value + 1); setTyped(""); setFeedback(null);
          }
        }} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? (reviewIndex === QUERER_PRESENT.length - 1 ? "Завершить капсулу →" : "Следующее лицо →") : "Исправить форму ↻"}</button>}
      </Card>
    </div></div>;
  }

  if (phase === "finish") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 1 de 16 · completada" title="Дверь открыта" sub="QUERER управляет намерением; ABRIR остаётся действием; LA PUERTA остаётся частью сцены." />
    <Card style={{ textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>✦</div>
      <div style={{ fontSize: 16, lineHeight: 1.65 }}>{QUERER_CAPSULE_1.law}</div>
      <button onClick={onBack} style={{ marginTop: 18, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>Вернуться к линейке →</button>
    </Card>
  </div></div>;

  const step = QUERER_CAPSULE_1_STEPS[stepIndex];
  const correct = feedback?.ok;
  const selectedValue = step.kind === "choice" ? picked : typed;
  const submit = (value = selectedValue) => {
    if (!String(value || "").trim()) return;
    const ok = normalizeAnswer(value) === normalizeAnswer(step.answer);
    let layer = "ОПЕРАТОР";
    const normalized = normalizeAnswer(value);
    if (!normalized.includes("la puerta")) layer = "ПРЕДМЕТ";
    else if (/\b(abro|abres|abre|abrimos|abrís|abren)\b/.test(normalized)) layer = "ДЕЙСТВИЕ";
    setFeedback({ ok, layer, grammar: step.kind === "form" || step.grammarErrorOptions?.includes(value) || layer === "ОПЕРАТОР" });
  };

  return <div style={wrap}><div style={maxw}>
    <Header small={`Cápsula 1 · ${stepIndex + 1} из ${QUERER_CAPSULE_1_STEPS.length}`} title={step.stage} sub={step.ru} />
    <Progress index={stepIndex} total={QUERER_CAPSULE_1_STEPS.length} />
    <Card>
      <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.55, fontWeight: 800 }}>{step.prompt}</div>
      {step.kind === "choice" ? <div style={{ display: "grid", gap: 9, marginTop: 18 }}>{step.options.map(option => <Choice key={option} active={picked === option} disabled={!!feedback} onClick={() => { setPicked(option); submit(option); }}>{option}</Choice>)}</div> : <>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit(event.currentTarget.value)} disabled={!!feedback} placeholder={step.kind === "form" ? "форма querer" : "твоя реплика по-испански"} autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={() => submit()} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить реплику</button>}
      </>}
      {feedback && <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, fontSize: 13.5, lineHeight: 1.55, textAlign: "center" }}>{correct ? <b>Реплика собрана точно.</b> : <><b>Ошибка в слое: {feedback.layer}.</b><br />Правильная реплика: {step.answer}</>}</div>}
      {feedback && !correct && feedback.grammar && grammarButton()}
      {feedback && <button onClick={correct ? goNext : resetAnswer} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? "Продолжить →" : "Исправить этот ход ↻"}</button>}
      {stepIndex > 0 && <button onClick={goPrev} style={{ marginTop: 10, width: "100%", background: "none", color: C.inkSoft, border: `1px solid ${C.line}`, borderRadius: 12, padding: 11, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>← Предыдущий шаг</button>}
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;
}

// Капсула 3 · PODER. Та же механика, что у QuererOne — меняются только
// данные (poderCapsule1Data.js) и точки, привязанные к сцене: объект LOS
// PAPELES вместо LA PUERTA, спрягаемый глагол PODER вместо QUERER, ошибочные
// формы RECOGER вместо ABRIR.
function PoderOne({ onBack, onPracticeGrammar, onComplete, initialStep = 0, onStep }) {
  const [phase, setPhase] = useState(initialStep > 0 ? "steps" : "scene");
  const [stepIndex, setStepIndex] = useState(Math.min(initialStep, PODER_CAPSULE_1_STEPS.length - 1));
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => { onStep?.(stepIndex); }, [stepIndex]);

  const resetAnswer = () => { setPicked(null); setTyped(""); setFeedback(null); };
  const goNext = () => {
    resetAnswer();
    if (stepIndex === PODER_CAPSULE_1_STEPS.length - 1) setPhase("review");
    else setStepIndex(value => value + 1);
  };
  const goPrev = () => { resetAnswer(); setStepIndex(value => Math.max(0, value - 1)); };

  const grammarButton = (label = "Точечно потренировать PODER") => (
    <button onClick={() => onPracticeGrammar?.({ capsuleId: "poder-1", stepIndex })} style={{ marginTop: 10, width: "100%", background: C.card, color: C.goldDeep, border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{label} →</button>
  );

  if (phase === "scene") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 3 de 16 · PODER" title={PODER_CAPSULE_1.title} sub={PODER_CAPSULE_1.linkTitle} />
    <Card>
      <div style={{ fontSize: 16, lineHeight: 1.7, borderLeft: `3px solid ${C.gold}`, paddingLeft: 13 }}>{PODER_CAPSULE_1.scene.es}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: C.inkSoft, marginTop: 9, borderLeft: `3px solid ${C.line}`, paddingLeft: 13 }}>{PODER_CAPSULE_1.scene.ru}</div>
      <div style={{ marginTop: 16, background: C.cream, borderRadius: 12, padding: 12, fontSize: 13.5, lineHeight: 1.55 }}><b>Задача:</b> понять, у кого есть возможность, вступить в диалог и самому сказать, можешь ли ты собрать бумаги.</div>
      <button onClick={() => setPhase("steps")} style={{ marginTop: 16, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Войти в диалог →</button>
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;

  if (phase === "review") {
    const item = PODER_PRESENT[reviewIndex];
    const correct = feedback?.ok;
    const submit = () => {
      if (!typed.trim()) return;
      setFeedback({ ok: normalizeAnswer(typed) === item.form });
    };
    return <div style={wrap}><div style={maxw}>
      <Header small={`Закрепление · ${reviewIndex + 1} из ${PODER_PRESENT.length}`} title="Шесть лиц PODER" sub="Смысл уже понятен. Теперь закрепляем форму, чтобы реплика держалась уверенно." />
      <Progress index={reviewIndex} total={PODER_PRESENT.length} />
      <Card>
        <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.6 }}><b>{item.person}</b> <span style={{ color: C.goldDeep }}>___</span> recoger los papeles.</div>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit()} disabled={!!feedback} placeholder="форма poder" autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={submit} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить</button>}
        {feedback && <div style={{ marginTop: 13, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, textAlign: "center", fontWeight: 800 }}>{correct ? `${item.person} — ${item.form}.` : `Нужна форма ${item.form}. Ошибка в слое ОПЕРАТОР.`}</div>}
        {feedback && !correct && grammarButton("Отработать шесть форм PODER")}
        {feedback && <button onClick={() => {
          if (!correct) { setTyped(""); setFeedback(null); return; }
          if (reviewIndex === PODER_PRESENT.length - 1) {
            onComplete?.("poder-1");
            setPhase("finish");
          } else {
            setReviewIndex(value => value + 1); setTyped(""); setFeedback(null);
          }
        }} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? (reviewIndex === PODER_PRESENT.length - 1 ? "Завершить капсулу →" : "Следующее лицо →") : "Исправить форму ↻"}</button>}
      </Card>
    </div></div>;
  }

  if (phase === "finish") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 3 de 16 · completada" title="Бумаги подняты" sub="PODER управляет возможностью; RECOGER остаётся действием; LOS PAPELES остаются частью сцены." />
    <Card style={{ textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>✦</div>
      <div style={{ fontSize: 16, lineHeight: 1.65 }}>{PODER_CAPSULE_1.law}</div>
      <button onClick={onBack} style={{ marginTop: 18, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>Вернуться к линейке →</button>
    </Card>
  </div></div>;

  const step = PODER_CAPSULE_1_STEPS[stepIndex];
  const correct = feedback?.ok;
  const selectedValue = step.kind === "choice" ? picked : typed;
  const submit = (value = selectedValue) => {
    if (!String(value || "").trim()) return;
    const ok = normalizeAnswer(value) === normalizeAnswer(step.answer);
    let layer = "ОПЕРАТОР";
    const normalized = normalizeAnswer(value);
    if (!normalized.includes("los papeles")) layer = "ПРЕДМЕТ";
    else if (/\b(recojo|recoges|recoge|recogemos|recogéis|recogen)\b/.test(normalized)) layer = "ДЕЙСТВИЕ";
    setFeedback({ ok, layer, grammar: step.kind === "form" || step.grammarErrorOptions?.includes(value) || layer === "ОПЕРАТОР" });
  };

  return <div style={wrap}><div style={maxw}>
    <Header small={`Cápsula 3 · ${stepIndex + 1} из ${PODER_CAPSULE_1_STEPS.length}`} title={step.stage} sub={step.ru} />
    <Progress index={stepIndex} total={PODER_CAPSULE_1_STEPS.length} />
    <Card>
      <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.55, fontWeight: 800 }}>{step.prompt}</div>
      {step.kind === "choice" ? <div style={{ display: "grid", gap: 9, marginTop: 18 }}>{step.options.map(option => <Choice key={option} active={picked === option} disabled={!!feedback} onClick={() => { setPicked(option); submit(option); }}>{option}</Choice>)}</div> : <>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit(event.currentTarget.value)} disabled={!!feedback} placeholder={step.kind === "form" ? "форма poder" : "твоя реплика по-испански"} autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={() => submit()} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить реплику</button>}
      </>}
      {feedback && <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, fontSize: 13.5, lineHeight: 1.55, textAlign: "center" }}>{correct ? <b>Реплика собрана точно.</b> : <><b>Ошибка в слое: {feedback.layer}.</b><br />Правильная реплика: {step.answer}</>}</div>}
      {feedback && !correct && feedback.grammar && grammarButton()}
      {feedback && <button onClick={correct ? goNext : resetAnswer} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? "Продолжить →" : "Исправить этот ход ↻"}</button>}
      {stepIndex > 0 && <button onClick={goPrev} style={{ marginTop: 10, width: "100%", background: "none", color: C.inkSoft, border: `1px solid ${C.line}`, borderRadius: 12, padding: 11, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>← Предыдущий шаг</button>}
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;
}

// Капсула 5 · TENER QUE. Та же механика, что у QuererOne/PoderOne —
// меняются только данные (tenerQueCapsule1Data.js) и точки, привязанные к
// сцене: объект EL RELOJ, спрягаемый глагол TENER QUE, ошибочные формы USAR.
function TenerQueOne({ onBack, onPracticeGrammar, onComplete, initialStep = 0, onStep }) {
  const [phase, setPhase] = useState(initialStep > 0 ? "steps" : "scene");
  const [stepIndex, setStepIndex] = useState(Math.min(initialStep, TENER_QUE_CAPSULE_1_STEPS.length - 1));
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  
  useEffect(() => { onStep?.(stepIndex); }, [stepIndex]);
  
  const resetAnswer = () => { setPicked(null); setTyped(""); setFeedback(null); };
  const goNext = () => {
    resetAnswer();
    if (stepIndex === TENER_QUE_CAPSULE_1_STEPS.length - 1) setPhase("review");
    else setStepIndex(value => value + 1);
  };
  const goPrev = () => { resetAnswer(); setStepIndex(value => Math.max(0, value - 1)); };
  
    const grammarButton = (label = "Точечно потренировать TENER QUE") => (
    <button onClick={() => onPracticeGrammar?.({ capsuleId: "tener-que-1", stepIndex })} style={{ marginTop: 10, width: "100%", background: C.card, color: C.goldDeep, border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{label} →</button>
  );

  if (phase === "scene") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 5 de 16 · TENER QUE" title={TENER_QUE_CAPSULE_1.title} sub={TENER_QUE_CAPSULE_1.linkTitle} />
    <Card>
      <div style={{ fontSize: 16, lineHeight: 1.7, borderLeft: `3px solid ${C.gold}`, paddingLeft: 13 }}>{TENER_QUE_CAPSULE_1.scene.es}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: C.inkSoft, marginTop: 9, borderLeft: `3px solid ${C.line}`, paddingLeft: 13 }}>{TENER_QUE_CAPSULE_1.scene.ru}</div>
      <div style={{ marginTop: 16, background: C.cream, borderRadius: 12, padding: 12, fontSize: 13.5, lineHeight: 1.55 }}><b>Задача:</b> понять, что необходимо сделать, вступить в диалог и самому сказать, должен ли ты завести часы.</div>
      <button onClick={() => setPhase("steps")} style={{ marginTop: 16, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Войти в диалог →</button>
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;

  if (phase === "review") {
    const item = TENER_QUE_PRESENT[reviewIndex];
    const correct = feedback?.ok;
    const submit = () => {
      if (!typed.trim()) return;
      setFeedback({ ok: normalizeAnswer(typed) === item.form });
    };
    return <div style={wrap}><div style={maxw}>
      <Header small={`Закрепление · ${reviewIndex + 1} из ${TENER_QUE_PRESENT.length}`} title="Шесть лиц TENER QUE" sub="Смысл уже понятен. Теперь закрепляем форму, чтобы реплика держалась уверенно." />
      <Progress index={reviewIndex} total={TENER_QUE_PRESENT.length} />
      <Card>
        <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.6 }}><b>{item.person}</b> <span style={{ color: C.goldDeep }}>___</span> que usar el reloj.</div>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit()} disabled={!!feedback} placeholder="форма tener que" autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={submit} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить</button>}
        {feedback && <div style={{ marginTop: 13, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, textAlign: "center", fontWeight: 800 }}>{correct ? `${item.person} — ${item.form}.` : `Нужна форма ${item.form}. Ошибка в слое ОПЕРАТОР.`}</div>}
        {feedback && !correct && grammarButton("Отработать шесть форм TENER QUE")}
        {feedback && <button onClick={() => {
          if (!correct) { setTyped(""); setFeedback(null); return; }
          if (reviewIndex === TENER_QUE_PRESENT.length - 1) {
            onComplete?.("tener-que-1");
            setPhase("finish");
          } else {
            setReviewIndex(value => value + 1); setTyped(""); setFeedback(null);
          }
        }} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? (reviewIndex === TENER_QUE_PRESENT.length - 1 ? "Завершить капсулу →" : "Следующее лицо →") : "Исправить форму ↻"}</button>}
      </Card>
    </div></div>;
  }

  if (phase === "finish") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 5 de 16 · completada" title="Часы снова идут" sub="TENER QUE управляет необходимостью; USAR остаётся действием; EL RELOJ остаётся частью сцены." />
    <Card style={{ textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>✦</div>
      <div style={{ fontSize: 16, lineHeight: 1.65 }}>{TENER_QUE_CAPSULE_1.law}</div>
      <button onClick={onBack} style={{ marginTop: 18, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>Вернуться к линейке →</button>
    </Card>
  </div></div>;

  const step = TENER_QUE_CAPSULE_1_STEPS[stepIndex];
  const correct = feedback?.ok;
  const selectedValue = step.kind === "choice" ? picked : typed;
  const submit = (value = selectedValue) => {
    if (!String(value || "").trim()) return;
    const ok = normalizeAnswer(value) === normalizeAnswer(step.answer);
    let layer = "ОПЕРАТОР";
    const normalized = normalizeAnswer(value);
    if (!normalized.includes("el reloj")) layer = "ПРЕДМЕТ";
    else if (/\b(uso|usas|usa|usamos|usáis|usan)\b/.test(normalized)) layer = "ДЕЙСТВИЕ";
    setFeedback({ ok, layer, grammar: step.kind === "form" || step.grammarErrorOptions?.includes(value) || layer === "ОПЕРАТОР" });
  };

  return <div style={wrap}><div style={maxw}>
    <Header small={`Cápsula 5 · ${stepIndex + 1} из ${TENER_QUE_CAPSULE_1_STEPS.length}`} title={step.stage} sub={step.ru} />
    <Progress index={stepIndex} total={TENER_QUE_CAPSULE_1_STEPS.length} />
    <Card>
      <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.55, fontWeight: 800 }}>{step.prompt}</div>
      {step.kind === "choice" ? <div style={{ display: "grid", gap: 9, marginTop: 18 }}>{step.options.map(option => <Choice key={option} active={picked === option} disabled={!!feedback} onClick={() => { setPicked(option); submit(option); }}>{option}</Choice>)}</div> : <>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit(event.currentTarget.value)} disabled={!!feedback} placeholder={step.kind === "form" ? "форма tener que" : "твоя реплика по-испански"} autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={() => submit()} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить реплику</button>}
      </>}
      {feedback && <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, fontSize: 13.5, lineHeight: 1.55, textAlign: "center" }}>{correct ? <b>Реплика собрана точно.</b> : <><b>Ошибка в слое: {feedback.layer}.</b><br />Правильная реплика: {step.answer}</>}</div>}
      {feedback && !correct && feedback.grammar && grammarButton()}
      {feedback && <button onClick={correct ? goNext : resetAnswer} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? "Продолжить →" : "Исправить этот ход ↻"}</button>}
      {stepIndex > 0 && <button onClick={goPrev} style={{ marginTop: 10, width: "100%", background: "none", color: C.inkSoft, border: `1px solid ${C.line}`, borderRadius: 12, padding: 11, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>← Предыдущий шаг</button>}
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;
}

// Капсула 7 · IR A. Та же механика, что у предыдущих капсул —
// меняются только данные (irACapsule1Data.js) и точки, привязанные к сцене: объект
// EL LIBRO DE RECETAS, спрягаемый глагол IR A, ошибочные формы соответствующего
// действия.
function IrAOne({ onBack, onPracticeGrammar, onComplete, initialStep = 0, onStep }) {
  const [phase, setPhase] = useState(initialStep > 0 ? "steps" : "scene");
  const [stepIndex, setStepIndex] = useState(Math.min(initialStep, IR_A_CAPSULE_1_STEPS.length - 1));
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => { onStep?.(stepIndex); }, [stepIndex]);

  const resetAnswer = () => { setPicked(null); setTyped(""); setFeedback(null); };
  const goNext = () => {
    resetAnswer();
    if (stepIndex === IR_A_CAPSULE_1_STEPS.length - 1) setPhase("review");
    else setStepIndex(value => value + 1);
  };
  const goPrev = () => { resetAnswer(); setStepIndex(value => Math.max(0, value - 1)); };

  const grammarButton = (label = "Точечно потренировать IR A") => (
    <button onClick={() => onPracticeGrammar?.({ capsuleId: "ir-a-1", stepIndex })} style={{ marginTop: 10, width: "100%", background: C.card, color: C.goldDeep, border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{label} →</button>
  );

  if (phase === "scene") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 7 de 16 · IR A" title={IR_A_CAPSULE_1.title} sub={IR_A_CAPSULE_1.linkTitle} />
    <Card>
      <div style={{ fontSize: 16, lineHeight: 1.7, borderLeft: `3px solid ${C.gold}`, paddingLeft: 13 }}>{IR_A_CAPSULE_1.scene.es}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: C.inkSoft, marginTop: 9, borderLeft: `3px solid ${C.line}`, paddingLeft: 13 }}>{IR_A_CAPSULE_1.scene.ru}</div>
      <div style={{ marginTop: 16, background: C.cream, borderRadius: 12, padding: 12, fontSize: 13.5, lineHeight: 1.55 }}><b>Задача:</b> понять, что Томас только планирует, вступить в диалог и самому сказать, собираешься ли ты отнести книгу рецептов.</div>
      <button onClick={() => setPhase("steps")} style={{ marginTop: 16, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Войти в диалог →</button>
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;

  if (phase === "review") {
    const item = IR_A_PRESENT[reviewIndex];
    const correct = feedback?.ok;
    const submit = () => {
      if (!typed.trim()) return;
      setFeedback({ ok: normalizeAnswer(typed) === item.form });
    };
    return <div style={wrap}><div style={maxw}>
      <Header small={`Закрепление · ${reviewIndex + 1} из ${IR_A_PRESENT.length}`} title="Шесть лиц IR A" sub="Смысл уже понятен. Теперь закрепляем форму, чтобы реплика держалась уверенно." />
      <Progress index={reviewIndex} total={IR_A_PRESENT.length} />
      <Card>
        <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.6 }}><b>{item.person}</b> <span style={{ color: C.goldDeep }}>___</span> a llevar el libro de recetas.</div>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit()} disabled={!!feedback} placeholder="форма ir a" autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={submit} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить</button>}
        {feedback && <div style={{ marginTop: 13, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, textAlign: "center", fontWeight: 800 }}>{correct ? `${item.person} — ${item.form}.` : `Нужна форма ${item.form}. Ошибка в слое ОПЕРАТОР.`}</div>}
        {feedback && !correct && grammarButton("Отработать шесть форм IR A")}
        {feedback && <button onClick={() => {
          if (!correct) { setTyped(""); setFeedback(null); return; }
          if (reviewIndex === IR_A_PRESENT.length - 1) {
            onComplete?.("ir-a-1");
            setPhase("finish");
          } else {
            setReviewIndex(value => value + 1); setTyped(""); setFeedback(null);
          }
        }} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? (reviewIndex === IR_A_PRESENT.length - 1 ? "Завершить капсулу →" : "Следующее лицо →") : "Исправить форму ↻"}</button>}
      </Card>
    </div></div>;
  }

  if (phase === "finish") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 7 de 16 · completada" title="Путь уже начат" sub="IR A управляет планом действия; LLEVAR остаётся действием; EL LIBRO DE RECETAS остаётся частью сцены." />
    <Card style={{ textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>✦</div>
      <div style={{ fontSize: 16, lineHeight: 1.65 }}>{IR_A_CAPSULE_1.law}</div>
      <button onClick={onBack} style={{ marginTop: 18, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>Вернуться к линейке →</button>
    </Card>
  </div></div>;

  const step = IR_A_CAPSULE_1_STEPS[stepIndex];
  const correct = feedback?.ok;
  const selectedValue = step.kind === "choice" ? picked : typed;
  const submit = (value = selectedValue) => {
    if (!String(value || "").trim()) return;
    const ok = normalizeAnswer(value) === normalizeAnswer(step.answer);
    let layer = "ОПЕРАТОР";
    const normalized = normalizeAnswer(value);
    if (!normalized.includes("el libro de recetas")) layer = "ПРЕДМЕТ";
    else if (/\b(llevo|llevas|lleva|llevamos|lleváis|llevan)\b/.test(normalized)) layer = "ДЕЙСТВИЕ";
    setFeedback({ ok, layer, grammar: step.kind === "form" || step.grammarErrorOptions?.includes(value) || layer === "ОПЕРАТОР" });
  };

  return <div style={wrap}><div style={maxw}>
    <Header small={`Cápsula 7 · ${stepIndex + 1} из ${IR_A_CAPSULE_1_STEPS.length}`} title={step.stage} sub={step.ru} />
    <Progress index={stepIndex} total={IR_A_CAPSULE_1_STEPS.length} />
    <Card>
      <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.55, fontWeight: 800 }}>{step.prompt}</div>
      {step.kind === "choice" ? <div style={{ display: "grid", gap: 9, marginTop: 18 }}>{step.options.map(option => <Choice key={option} active={picked === option} disabled={!!feedback} onClick={() => { setPicked(option); submit(option); }}>{option}</Choice>)}</div> : <>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit(event.currentTarget.value)} disabled={!!feedback} placeholder={step.kind === "form" ? "форма ir a" : "твоя реплика по-испански"} autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={() => submit()} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить реплику</button>}
      </>}
      {feedback && <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, fontSize: 13.5, lineHeight: 1.55, textAlign: "center" }}>{correct ? <b>Реплика собрана точно.</b> : <><b>Ошибка в слое: {feedback.layer}.</b><br />Правильная реплика: {step.answer}</>}</div>}
      {feedback && !correct && feedback.grammar && grammarButton()}
      {feedback && <button onClick={correct ? goNext : resetAnswer} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? "Продолжить →" : "Исправить этот ход ↻"}</button>}
      {stepIndex > 0 && <button onClick={goPrev} style={{ marginTop: 10, width: "100%", background: "none", color: C.inkSoft, border: `1px solid ${C.line}`, borderRadius: 12, padding: 11, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>← Предыдущий шаг</button>}
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;
}


// Капсула 9 · INTENTAR. Та же механика, что у предыдущих капсул —
// меняются только данные (intentarCapsule1Data.js) и точки, привязанные к сцене: объект
// EL LIBRO, спрягаемый глагол INTENTAR, ошибочные формы соответствующего
// действия.
function IntentarOne({ onBack, onPracticeGrammar, onComplete, initialStep = 0, onStep }) {
  const [phase, setPhase] = useState(initialStep > 0 ? "steps" : "scene");
  const [stepIndex, setStepIndex] = useState(Math.min(initialStep, INTENTAR_CAPSULE_1_STEPS.length - 1));
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => { onStep?.(stepIndex); }, [stepIndex]);

  const resetAnswer = () => { setPicked(null); setTyped(""); setFeedback(null); };
  const goNext = () => {
    resetAnswer();
    if (stepIndex === INTENTAR_CAPSULE_1_STEPS.length - 1) setPhase("review");
    else setStepIndex(value => value + 1);
  };
  const goPrev = () => { resetAnswer(); setStepIndex(value => Math.max(0, value - 1)); };

  const grammarButton = (label = "Точечно потренировать INTENTAR") => (
    <button onClick={() => onPracticeGrammar?.({ capsuleId: "intentar-1", stepIndex })} style={{ marginTop: 10, width: "100%", background: C.card, color: C.goldDeep, border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{label} →</button>
  );

  if (phase === "scene") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 9 de 16 · INTENTAR" title={INTENTAR_CAPSULE_1.title} sub={INTENTAR_CAPSULE_1.linkTitle} />
    <Card>
      <div style={{ fontSize: 16, lineHeight: 1.7, borderLeft: `3px solid ${C.gold}`, paddingLeft: 13 }}>{INTENTAR_CAPSULE_1.scene.es}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: C.inkSoft, marginTop: 9, borderLeft: `3px solid ${C.line}`, paddingLeft: 13 }}>{INTENTAR_CAPSULE_1.scene.ru}</div>
      <div style={{ marginTop: 16, background: C.cream, borderRadius: 12, padding: 12, fontSize: 13.5, lineHeight: 1.55 }}><b>Задача:</b> понять, кто пытается передать книгу, вступить в диалог и самому сказать, пытаешься ли ты передать книгу Дону Вербо.</div>
      <button onClick={() => setPhase("steps")} style={{ marginTop: 16, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Войти в диалог →</button>
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;

  if (phase === "review") {
    const item = INTENTAR_PRESENT[reviewIndex];
    const correct = feedback?.ok;
    const submit = () => {
      if (!typed.trim()) return;
      setFeedback({ ok: normalizeAnswer(typed) === item.form });
    };
    return <div style={wrap}><div style={maxw}>
      <Header small={`Закрепление · ${reviewIndex + 1} из ${INTENTAR_PRESENT.length}`} title="Шесть лиц INTENTAR" sub="Смысл уже понятен. Теперь закрепляем форму, чтобы реплика держалась уверенно." />
      <Progress index={reviewIndex} total={INTENTAR_PRESENT.length} />
      <Card>
        <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.6 }}><b>{item.person}</b> <span style={{ color: C.goldDeep }}>___</span> dar el libro a Don Verbo.</div>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit()} disabled={!!feedback} placeholder="форма intentar" autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={submit} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить</button>}
        {feedback && <div style={{ marginTop: 13, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, textAlign: "center", fontWeight: 800 }}>{correct ? `${item.person} — ${item.form}.` : `Нужна форма ${item.form}. Ошибка в слое ОПЕРАТОР.`}</div>}
        {feedback && !correct && grammarButton("Отработать шесть форм INTENTAR")}
        {feedback && <button onClick={() => {
          if (!correct) { setTyped(""); setFeedback(null); return; }
          if (reviewIndex === INTENTAR_PRESENT.length - 1) {
            onComplete?.("intentar-1");
            setPhase("finish");
          } else {
            setReviewIndex(value => value + 1); setTyped(""); setFeedback(null);
          }
        }} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? (reviewIndex === INTENTAR_PRESENT.length - 1 ? "Завершить капсулу →" : "Следующее лицо →") : "Исправить форму ↻"}</button>}
      </Card>
    </div></div>;
  }

  if (phase === "finish") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 9 de 16 · completada" title="Попытка сделана" sub="INTENTAR управляет попыткой; DAR остаётся действием; EL LIBRO и A DON VERBO остаются частью сцены." />
    <Card style={{ textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>✦</div>
      <div style={{ fontSize: 16, lineHeight: 1.65 }}>{INTENTAR_CAPSULE_1.law}</div>
      <button onClick={onBack} style={{ marginTop: 18, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>Вернуться к линейке →</button>
    </Card>
  </div></div>;

  const step = INTENTAR_CAPSULE_1_STEPS[stepIndex];
  const correct = feedback?.ok;
  const selectedValue = step.kind === "choice" ? picked : typed;
  const submit = (value = selectedValue) => {
    if (!String(value || "").trim()) return;
    const ok = normalizeAnswer(value) === normalizeAnswer(step.answer);
    let layer = "ОПЕРАТОР";
    const normalized = normalizeAnswer(value);
    if (!normalized.includes("el libro")) layer = "ПРЕДМЕТ";
    else if (/\b(doy|das|da|damos|dais|dan)\b/.test(normalized)) layer = "ДЕЙСТВИЕ";
    setFeedback({ ok, layer, grammar: step.kind === "form" || step.grammarErrorOptions?.includes(value) || layer === "ОПЕРАТОР" });
  };

  return <div style={wrap}><div style={maxw}>
    <Header small={`Cápsula 9 · ${stepIndex + 1} из ${INTENTAR_CAPSULE_1_STEPS.length}`} title={step.stage} sub={step.ru} />
    <Progress index={stepIndex} total={INTENTAR_CAPSULE_1_STEPS.length} />
    <Card>
      <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.55, fontWeight: 800 }}>{step.prompt}</div>
      {step.kind === "choice" ? <div style={{ display: "grid", gap: 9, marginTop: 18 }}>{step.options.map(option => <Choice key={option} active={picked === option} disabled={!!feedback} onClick={() => { setPicked(option); submit(option); }}>{option}</Choice>)}</div> : <>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit(event.currentTarget.value)} disabled={!!feedback} placeholder={step.kind === "form" ? "форма intentar" : "твоя реплика по-испански"} autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={() => submit()} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить реплику</button>}
      </>}
      {feedback && <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, fontSize: 13.5, lineHeight: 1.55, textAlign: "center" }}>{correct ? <b>Реплика собрана точно.</b> : <><b>Ошибка в слое: {feedback.layer}.</b><br />Правильная реплика: {step.answer}</>}</div>}
      {feedback && !correct && feedback.grammar && grammarButton()}
      {feedback && <button onClick={correct ? goNext : resetAnswer} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? "Продолжить →" : "Исправить этот ход ↻"}</button>}
      {stepIndex > 0 && <button onClick={goPrev} style={{ marginTop: 10, width: "100%", background: "none", color: C.inkSoft, border: `1px solid ${C.line}`, borderRadius: 12, padding: 11, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>← Предыдущий шаг</button>}
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;
}


// Капсула 11 · EMPEZAR A. Та же механика, что у предыдущих капсул —
// меняются только данные (empezarACapsule1Data.js) и точки, привязанные к сцене: объект
// LAS PISTAS, спрягаемый глагол EMPEZAR A, ошибочные формы соответствующего
// действия.
function EmpezarAOne({ onBack, onPracticeGrammar, onComplete, initialStep = 0, onStep }) {
  const [phase, setPhase] = useState(initialStep > 0 ? "steps" : "scene");
  const [stepIndex, setStepIndex] = useState(Math.min(initialStep, EMPEZAR_A_CAPSULE_1_STEPS.length - 1));
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => { onStep?.(stepIndex); }, [stepIndex]);

  const resetAnswer = () => { setPicked(null); setTyped(""); setFeedback(null); };
  const goNext = () => {
    resetAnswer();
    if (stepIndex === EMPEZAR_A_CAPSULE_1_STEPS.length - 1) setPhase("review");
    else setStepIndex(value => value + 1);
  };
  const goPrev = () => { resetAnswer(); setStepIndex(value => Math.max(0, value - 1)); };

  const grammarButton = (label = "Точечно потренировать EMPEZAR A") => (
    <button onClick={() => onPracticeGrammar?.({ capsuleId: "empezar-a-1", stepIndex })} style={{ marginTop: 10, width: "100%", background: C.card, color: C.goldDeep, border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{label} →</button>
  );

  if (phase === "scene") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 11 de 16 · EMPEZAR A" title={EMPEZAR_A_CAPSULE_1.title} sub={EMPEZAR_A_CAPSULE_1.linkTitle} />
    <Card>
      <div style={{ fontSize: 16, lineHeight: 1.7, borderLeft: `3px solid ${C.gold}`, paddingLeft: 13 }}>{EMPEZAR_A_CAPSULE_1.scene.es}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: C.inkSoft, marginTop: 9, borderLeft: `3px solid ${C.line}`, paddingLeft: 13 }}>{EMPEZAR_A_CAPSULE_1.scene.ru}</div>
      <div style={{ marginTop: 16, background: C.cream, borderRadius: 12, padding: 12, fontSize: 13.5, lineHeight: 1.55 }}><b>Задача:</b> понять, кто начинает действие, вступить в диалог и самому сказать, начинаешь ли ты убирать улики.</div>
      <button onClick={() => setPhase("steps")} style={{ marginTop: 16, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Войти в диалог →</button>
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;

  if (phase === "review") {
    const item = EMPEZAR_A_PRESENT[reviewIndex];
    const correct = feedback?.ok;
    const submit = () => {
      if (!typed.trim()) return;
      setFeedback({ ok: normalizeAnswer(typed) === item.form });
    };
    return <div style={wrap}><div style={maxw}>
      <Header small={`Закрепление · ${reviewIndex + 1} из ${EMPEZAR_A_PRESENT.length}`} title="Шесть лиц EMPEZAR A" sub="Смысл уже понятен. Теперь закрепляем форму, чтобы реплика держалась уверенно." />
      <Progress index={reviewIndex} total={EMPEZAR_A_PRESENT.length} />
      <Card>
        <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.6 }}><b>{item.person}</b> <span style={{ color: C.goldDeep }}>___</span> a guardar las pistas.</div>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit()} disabled={!!feedback} placeholder="форма empezar a" autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={submit} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить</button>}
        {feedback && <div style={{ marginTop: 13, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, textAlign: "center", fontWeight: 800 }}>{correct ? `${item.person} — ${item.form}.` : `Нужна форма ${item.form}. Ошибка в слое ОПЕРАТОР.`}</div>}
        {feedback && !correct && grammarButton("Отработать шесть форм EMPEZAR A")}
        {feedback && <button onClick={() => {
          if (!correct) { setTyped(""); setFeedback(null); return; }
          if (reviewIndex === EMPEZAR_A_PRESENT.length - 1) {
            onComplete?.("empezar-a-1");
            setPhase("finish");
          } else {
            setReviewIndex(value => value + 1); setTyped(""); setFeedback(null);
          }
        }} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? (reviewIndex === EMPEZAR_A_PRESENT.length - 1 ? "Завершить капсулу →" : "Следующее лицо →") : "Исправить форму ↻"}</button>}
      </Card>
    </div></div>;
  }

  if (phase === "finish") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 11 de 16 · completada" title="Первая улика убрана" sub="EMPEZAR A управляет началом действия; GUARDAR остаётся действием; LAS PISTAS остаются частью сцены." />
    <Card style={{ textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>✦</div>
      <div style={{ fontSize: 16, lineHeight: 1.65 }}>{EMPEZAR_A_CAPSULE_1.law}</div>
      <button onClick={onBack} style={{ marginTop: 18, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>Вернуться к линейке →</button>
    </Card>
  </div></div>;

  const step = EMPEZAR_A_CAPSULE_1_STEPS[stepIndex];
  const correct = feedback?.ok;
  const selectedValue = step.kind === "choice" ? picked : typed;
  const submit = (value = selectedValue) => {
    if (!String(value || "").trim()) return;
    const ok = normalizeAnswer(value) === normalizeAnswer(step.answer);
    let layer = "ОПЕРАТОР";
    const normalized = normalizeAnswer(value);
    if (!normalized.includes("las pistas")) layer = "ПРЕДМЕТ";
    else if (/\b(guardo|guardas|guarda|guardamos|guardáis|guardan)\b/.test(normalized)) layer = "ДЕЙСТВИЕ";
    setFeedback({ ok, layer, grammar: step.kind === "form" || step.grammarErrorOptions?.includes(value) || layer === "ОПЕРАТОР" });
  };

  return <div style={wrap}><div style={maxw}>
    <Header small={`Cápsula 11 · ${stepIndex + 1} из ${EMPEZAR_A_CAPSULE_1_STEPS.length}`} title={step.stage} sub={step.ru} />
    <Progress index={stepIndex} total={EMPEZAR_A_CAPSULE_1_STEPS.length} />
    <Card>
      <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.55, fontWeight: 800 }}>{step.prompt}</div>
      {step.kind === "choice" ? <div style={{ display: "grid", gap: 9, marginTop: 18 }}>{step.options.map(option => <Choice key={option} active={picked === option} disabled={!!feedback} onClick={() => { setPicked(option); submit(option); }}>{option}</Choice>)}</div> : <>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit(event.currentTarget.value)} disabled={!!feedback} placeholder={step.kind === "form" ? "форма empezar a" : "твоя реплика по-испански"} autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={() => submit()} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить реплику</button>}
      </>}
      {feedback && <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, fontSize: 13.5, lineHeight: 1.55, textAlign: "center" }}>{correct ? <b>Реплика собрана точно.</b> : <><b>Ошибка в слое: {feedback.layer}.</b><br />Правильная реплика: {step.answer}</>}</div>}
      {feedback && !correct && feedback.grammar && grammarButton()}
      {feedback && <button onClick={correct ? goNext : resetAnswer} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? "Продолжить →" : "Исправить этот ход ↻"}</button>}
      {stepIndex > 0 && <button onClick={goPrev} style={{ marginTop: 10, width: "100%", background: "none", color: C.inkSoft, border: `1px solid ${C.line}`, borderRadius: 12, padding: 11, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>← Предыдущий шаг</button>}
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;
}


// Капсула 13 · DEJAR DE. Та же механика, что у предыдущих капсул —
// меняются только данные (dejarDeCapsule1Data.js) и точки, привязанные к сцене: объект
// LA LLAVE DORADA, спрягаемый глагол DEJAR DE, ошибочные формы соответствующего
// действия.
function DejarDeOne({ onBack, onPracticeGrammar, onComplete, initialStep = 0, onStep }) {
  const [phase, setPhase] = useState(initialStep > 0 ? "steps" : "scene");
  const [stepIndex, setStepIndex] = useState(Math.min(initialStep, DEJAR_DE_CAPSULE_1_STEPS.length - 1));
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => { onStep?.(stepIndex); }, [stepIndex]);

  const resetAnswer = () => { setPicked(null); setTyped(""); setFeedback(null); };
  const goNext = () => {
    resetAnswer();
    if (stepIndex === DEJAR_DE_CAPSULE_1_STEPS.length - 1) setPhase("review");
    else setStepIndex(value => value + 1);
  };
  const goPrev = () => { resetAnswer(); setStepIndex(value => Math.max(0, value - 1)); };

  const grammarButton = (label = "Точечно потренировать DEJAR DE") => (
    <button onClick={() => onPracticeGrammar?.({ capsuleId: "dejar-de-1", stepIndex })} style={{ marginTop: 10, width: "100%", background: C.card, color: C.goldDeep, border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{label} →</button>
  );

  if (phase === "scene") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 13 de 16 · DEJAR DE" title={DEJAR_DE_CAPSULE_1.title} sub={DEJAR_DE_CAPSULE_1.linkTitle} />
    <Card>
      <div style={{ fontSize: 16, lineHeight: 1.7, borderLeft: `3px solid ${C.gold}`, paddingLeft: 13 }}>{DEJAR_DE_CAPSULE_1.scene.es}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: C.inkSoft, marginTop: 9, borderLeft: `3px solid ${C.line}`, paddingLeft: 13 }}>{DEJAR_DE_CAPSULE_1.scene.ru}</div>
      <div style={{ marginTop: 16, background: C.cream, borderRadius: 12, padding: 12, fontSize: 13.5, lineHeight: 1.55 }}><b>Задача:</b> понять, кто прекращает действие, вступить в диалог и самому сказать, перестаёшь ли ты искать золотой ключ.</div>
      <button onClick={() => setPhase("steps")} style={{ marginTop: 16, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Войти в диалог →</button>
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;

  if (phase === "review") {
    const item = DEJAR_DE_PRESENT[reviewIndex];
    const correct = feedback?.ok;
    const submit = () => {
      if (!typed.trim()) return;
      setFeedback({ ok: normalizeAnswer(typed) === item.form });
    };
    return <div style={wrap}><div style={maxw}>
      <Header small={`Закрепление · ${reviewIndex + 1} из ${DEJAR_DE_PRESENT.length}`} title="Шесть лиц DEJAR DE" sub="Смысл уже понятен. Теперь закрепляем форму, чтобы реплика держалась уверенно." />
      <Progress index={reviewIndex} total={DEJAR_DE_PRESENT.length} />
      <Card>
        <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.6 }}><b>{item.person}</b> <span style={{ color: C.goldDeep }}>___</span> de buscar la llave dorada.</div>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit()} disabled={!!feedback} placeholder="форма dejar de" autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={submit} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить</button>}
        {feedback && <div style={{ marginTop: 13, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, textAlign: "center", fontWeight: 800 }}>{correct ? `${item.person} — ${item.form}.` : `Нужна форма ${item.form}. Ошибка в слое ОПЕРАТОР.`}</div>}
        {feedback && !correct && grammarButton("Отработать шесть форм DEJAR DE")}
        {feedback && <button onClick={() => {
          if (!correct) { setTyped(""); setFeedback(null); return; }
          if (reviewIndex === DEJAR_DE_PRESENT.length - 1) {
            onComplete?.("dejar-de-1");
            setPhase("finish");
          } else {
            setReviewIndex(value => value + 1); setTyped(""); setFeedback(null);
          }
        }} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? (reviewIndex === DEJAR_DE_PRESENT.length - 1 ? "Завершить капсулу →" : "Следующее лицо →") : "Исправить форму ↻"}</button>}
      </Card>
    </div></div>;
  }

  if (phase === "finish") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 13 de 16 · completada" title="Поиск завершён" sub="DEJAR DE управляет прекращением действия; BUSCAR остаётся действием; LA LLAVE DORADA остаётся частью сцены." />
    <Card style={{ textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>✦</div>
      <div style={{ fontSize: 16, lineHeight: 1.65 }}>{DEJAR_DE_CAPSULE_1.law}</div>
      <button onClick={onBack} style={{ marginTop: 18, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>Вернуться к линейке →</button>
    </Card>
  </div></div>;

  const step = DEJAR_DE_CAPSULE_1_STEPS[stepIndex];
  const correct = feedback?.ok;
  const selectedValue = step.kind === "choice" ? picked : typed;
  const submit = (value = selectedValue) => {
    if (!String(value || "").trim()) return;
    const ok = normalizeAnswer(value) === normalizeAnswer(step.answer);
    let layer = "ОПЕРАТОР";
    const normalized = normalizeAnswer(value);
    if (!normalized.includes("la llave dorada")) layer = "ПРЕДМЕТ";
    else if (/\b(busco|buscas|busca|buscamos|buscáis|buscan)\b/.test(normalized)) layer = "ДЕЙСТВИЕ";
    setFeedback({ ok, layer, grammar: step.kind === "form" || step.grammarErrorOptions?.includes(value) || layer === "ОПЕРАТОР" });
  };

  return <div style={wrap}><div style={maxw}>
    <Header small={`Cápsula 13 · ${stepIndex + 1} из ${DEJAR_DE_CAPSULE_1_STEPS.length}`} title={step.stage} sub={step.ru} />
    <Progress index={stepIndex} total={DEJAR_DE_CAPSULE_1_STEPS.length} />
    <Card>
      <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.55, fontWeight: 800 }}>{step.prompt}</div>
      {step.kind === "choice" ? <div style={{ display: "grid", gap: 9, marginTop: 18 }}>{step.options.map(option => <Choice key={option} active={picked === option} disabled={!!feedback} onClick={() => { setPicked(option); submit(option); }}>{option}</Choice>)}</div> : <>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit(event.currentTarget.value)} disabled={!!feedback} placeholder={step.kind === "form" ? "форма dejar de" : "твоя реплика по-испански"} autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={() => submit()} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить реплику</button>}
      </>}
      {feedback && <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, fontSize: 13.5, lineHeight: 1.55, textAlign: "center" }}>{correct ? <b>Реплика собрана точно.</b> : <><b>Ошибка в слое: {feedback.layer}.</b><br />Правильная реплика: {step.answer}</>}</div>}
      {feedback && !correct && feedback.grammar && grammarButton()}
      {feedback && <button onClick={correct ? goNext : resetAnswer} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? "Продолжить →" : "Исправить этот ход ↻"}</button>}
      {stepIndex > 0 && <button onClick={goPrev} style={{ marginTop: 10, width: "100%", background: "none", color: C.inkSoft, border: `1px solid ${C.line}`, borderRadius: 12, padding: 11, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>← Предыдущий шаг</button>}
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;
}


// Капсула 15 · VOLVER A. Та же механика, что у предыдущих капсул —
// меняются только данные (volverACapsule1Data.js) и точки, привязанные к сцене: объект
// EN LA SALA, спрягаемый глагол VOLVER A, ошибочные формы соответствующего
// действия.
function VolverAOne({ onBack, onPracticeGrammar, onComplete, initialStep = 0, onStep }) {
  const [phase, setPhase] = useState(initialStep > 0 ? "steps" : "scene");
  const [stepIndex, setStepIndex] = useState(Math.min(initialStep, VOLVER_A_CAPSULE_1_STEPS.length - 1));
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => { onStep?.(stepIndex); }, [stepIndex]);

  const resetAnswer = () => { setPicked(null); setTyped(""); setFeedback(null); };
  const goNext = () => {
    resetAnswer();
    if (stepIndex === VOLVER_A_CAPSULE_1_STEPS.length - 1) setPhase("review");
    else setStepIndex(value => value + 1);
  };
  const goPrev = () => { resetAnswer(); setStepIndex(value => Math.max(0, value - 1)); };

  const grammarButton = (label = "Точечно потренировать VOLVER A") => (
    <button onClick={() => onPracticeGrammar?.({ capsuleId: "volver-a-1", stepIndex })} style={{ marginTop: 10, width: "100%", background: C.card, color: C.goldDeep, border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{label} →</button>
  );

  if (phase === "scene") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 15 de 16 · VOLVER A" title={VOLVER_A_CAPSULE_1.title} sub={VOLVER_A_CAPSULE_1.linkTitle} />
    <Card>
      <div style={{ fontSize: 16, lineHeight: 1.7, borderLeft: `3px solid ${C.gold}`, paddingLeft: 13 }}>{VOLVER_A_CAPSULE_1.scene.es}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: C.inkSoft, marginTop: 9, borderLeft: `3px solid ${C.line}`, paddingLeft: 13 }}>{VOLVER_A_CAPSULE_1.scene.ru}</div>
      <div style={{ marginTop: 16, background: C.cream, borderRadius: 12, padding: 12, fontSize: 13.5, lineHeight: 1.55 }}><b>Задача:</b> понять, кто повторяет действие, вступить в диалог и самому сказать, входишь ли ты снова в Зал.</div>
      <button onClick={() => setPhase("steps")} style={{ marginTop: 16, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Войти в диалог →</button>
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;

  if (phase === "review") {
    const item = VOLVER_A_PRESENT[reviewIndex];
    const correct = feedback?.ok;
    const submit = () => {
      if (!typed.trim()) return;
      setFeedback({ ok: normalizeAnswer(typed) === item.form });
    };
    return <div style={wrap}><div style={maxw}>
      <Header small={`Закрепление · ${reviewIndex + 1} из ${VOLVER_A_PRESENT.length}`} title="Шесть лиц VOLVER A" sub="Смысл уже понятен. Теперь закрепляем форму, чтобы реплика держалась уверенно." />
      <Progress index={reviewIndex} total={VOLVER_A_PRESENT.length} />
      <Card>
        <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.6 }}><b>{item.person}</b> <span style={{ color: C.goldDeep }}>___</span> a entrar en la Sala.</div>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit()} disabled={!!feedback} placeholder="форма volver a" autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={submit} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить</button>}
        {feedback && <div style={{ marginTop: 13, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, textAlign: "center", fontWeight: 800 }}>{correct ? `${item.person} — ${item.form}.` : `Нужна форма ${item.form}. Ошибка в слое ОПЕРАТОР.`}</div>}
        {feedback && !correct && grammarButton("Отработать шесть форм VOLVER A")}
        {feedback && <button onClick={() => {
          if (!correct) { setTyped(""); setFeedback(null); return; }
          if (reviewIndex === VOLVER_A_PRESENT.length - 1) {
            onComplete?.("volver-a-1");
            setPhase("finish");
          } else {
            setReviewIndex(value => value + 1); setTyped(""); setFeedback(null);
          }
        }} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? (reviewIndex === VOLVER_A_PRESENT.length - 1 ? "Завершить капсулу →" : "Следующее лицо →") : "Исправить форму ↻"}</button>}
      </Card>
    </div></div>;
  }

  if (phase === "finish") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 15 de 16 · completada" title="Порог пройден снова" sub="VOLVER A управляет повторением действия; ENTRAR остаётся действием; EN LA SALA остаётся частью сцены." />
    <Card style={{ textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>✦</div>
      <div style={{ fontSize: 16, lineHeight: 1.65 }}>{VOLVER_A_CAPSULE_1.law}</div>
      <button onClick={onBack} style={{ marginTop: 18, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>Вернуться к линейке →</button>
    </Card>
  </div></div>;

  const step = VOLVER_A_CAPSULE_1_STEPS[stepIndex];
  const correct = feedback?.ok;
  const selectedValue = step.kind === "choice" ? picked : typed;
  const submit = (value = selectedValue) => {
    if (!String(value || "").trim()) return;
    const ok = normalizeAnswer(value) === normalizeAnswer(step.answer);
    let layer = "ОПЕРАТОР";
    const normalized = normalizeAnswer(value);
    if (!normalized.includes("en la sala")) layer = "ПРЕДМЕТ";
    else if (/\b(entro|entras|entra|entramos|entráis|entran)\b/.test(normalized)) layer = "ДЕЙСТВИЕ";
    setFeedback({ ok, layer, grammar: step.kind === "form" || step.grammarErrorOptions?.includes(value) || layer === "ОПЕРАТОР" });
  };

  return <div style={wrap}><div style={maxw}>
    <Header small={`Cápsula 15 · ${stepIndex + 1} из ${VOLVER_A_CAPSULE_1_STEPS.length}`} title={step.stage} sub={step.ru} />
    <Progress index={stepIndex} total={VOLVER_A_CAPSULE_1_STEPS.length} />
    <Card>
      <div style={{ textAlign: "center", fontSize: 19, lineHeight: 1.55, fontWeight: 800 }}>{step.prompt}</div>
      {step.kind === "choice" ? <div style={{ display: "grid", gap: 9, marginTop: 18 }}>{step.options.map(option => <Choice key={option} active={picked === option} disabled={!!feedback} onClick={() => { setPicked(option); submit(option); }}>{option}</Choice>)}</div> : <>
        <input value={typed} onChange={event => { setTyped(event.target.value); setFeedback(null); }} onKeyDown={event => event.key === "Enter" && submit(event.currentTarget.value)} disabled={!!feedback} placeholder={step.kind === "form" ? "форма volver a" : "твоя реплика по-испански"} autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", marginTop: 18, padding: "13px 14px", borderRadius: 12, border: `2px solid ${feedback ? (correct ? C.emerald : C.raspberry) : C.gold}`, background: C.cream, color: C.ink, fontFamily: SERIF, fontSize: 17, textAlign: "center", outline: "none" }} />
        {!feedback && <button onClick={() => submit()} disabled={!typed.trim()} style={{ marginTop: 12, width: "100%", background: typed.trim() ? C.emerald : C.line, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: typed.trim() ? "pointer" : "default" }}>Проверить реплику</button>}
      </>}
      {feedback && <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: correct ? "#ECF8F3" : "#FFF4F5", color: correct ? C.emeraldDeep : C.raspberry, fontSize: 13.5, lineHeight: 1.55, textAlign: "center" }}>{correct ? <b>Реплика собрана точно.</b> : <><b>Ошибка в слое: {feedback.layer}.</b><br />Правильная реплика: {step.answer}</>}</div>}
      {feedback && !correct && feedback.grammar && grammarButton()}
      {feedback && <button onClick={correct ? goNext : resetAnswer} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{correct ? "Продолжить →" : "Исправить этот ход ↻"}</button>}
      {stepIndex > 0 && <button onClick={goPrev} style={{ marginTop: 10, width: "100%", background: "none", color: C.inkSoft, border: `1px solid ${C.line}`, borderRadius: 12, padding: 11, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>← Предыдущий шаг</button>}
    </Card>
    <Back onClick={onBack} label="← К линейке капсул" />
  </div></div>;
}

function pickReviewQuestions(sourcePool = QUERER_REVIEW) {
  const pool = [...sourcePool];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 4);
}

function MeaningReview({ onFinish, pool = QUERER_REVIEW }) {
  const questions = useMemo(() => pickReviewQuestions(pool), [pool]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState([]);
  const question = questions[index];
  const isCorrect = picked === question?.answer;

  function next() {
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    const nextMissed = isCorrect ? missed : [...missed, question.sourceId];
    if (index === questions.length - 1) {
      onFinish({ correct: nextCorrect, total: questions.length, missed: nextMissed });
      return;
    }
    setCorrect(nextCorrect);
    setMissed(nextMissed);
    setIndex(value => value + 1);
    setPicked(null);
  }

  return <div style={wrap}><div style={maxw}>
    <Header small={`Interrogatorio · ${index + 1} de ${questions.length}`} title="Don Verbo pregunta" sub="No repitas la frase: reconstruye el sentido." />
    <Progress index={index} total={questions.length} />
    <Card>
      <div style={{ fontSize: 19, lineHeight: 1.5, fontWeight: 900, textAlign: "center", marginBottom: 18 }}>{question.question}</div>
      <div style={{ display: "grid", gap: 9 }}>
        {question.options.map(option => <Choice key={option} active={picked === option} disabled={!!picked} onClick={() => setPicked(option)}>{option}</Choice>)}
      </div>
      {picked && <div style={{ marginTop: 14, padding: 12, borderRadius: 12, textAlign: "center", background: isCorrect ? "#ECF8F3" : "#FFF4F5", color: isCorrect ? C.emeraldDeep : C.raspberry, fontWeight: 900 }}>{isCorrect ? "Sí. Has reconstruido la intención." : `La respuesta de la escena es: ${question.answer}.`}</div>}
      {picked && <button onClick={next} style={{ marginTop: 12, width: "100%", background: C.gold, color: "#fff", border: 0, borderRadius: 12, padding: 12, fontFamily: SERIF, fontWeight: 800, cursor: "pointer" }}>{index === questions.length - 1 ? "Cerrar el informe →" : "Siguiente pregunta →"}</button>}
    </Card>
  </div></div>;
}

function IntentionsFinish({
  result,
  onAgain,
  onBack,
  capsuleLabel = "Cápsula 2",
  title = "Informe de intenciones",
  closingLine = <>Ya sabemos <b>qué querían hacer</b> Tomás y Lucía.<br />Todavía no sabemos qué podían hacer realmente.</>,
  gramaticaTema = "op-querer",
  gramaticaLabel = "Practicar QUERER en Gramática",
}) {
  return <div style={wrap}><div style={maxw}>
    <Header small={`${capsuleLabel} · completada`} title={title} sub={`${result.correct} de ${result.total} respuestas reconstruidas con precisión.`} />
    <Card style={{ textAlign: "center" }}>
      <div style={{ fontSize: 38, marginBottom: 8 }}>{result.correct === result.total ? "✦" : "↻"}</div>
      <div style={{ fontSize: 16, lineHeight: 1.65 }}>{closingLine}</div>
      {result.missed.length > 0 && <div style={{ marginTop: 14, background: C.cream, borderRadius: 12, padding: 12, color: C.inkSoft, fontSize: 13.5, lineHeight: 1.5 }}>В App стоит повторить сцены: <b>{result.missed.join(" · ")}</b>.</div>}
      <button onClick={onAgain} style={{ marginTop: 18, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Repetir la cápsula</button>
      <button onClick={() => { window.location.search = `?tema=${gramaticaTema}`; }} style={{ marginTop: 9, width: "100%", background: C.card, color: C.goldDeep, border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: 12, fontFamily: SERIF, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>{gramaticaLabel}</button>
    </Card>
    <Back onClick={onBack} label="← Volver a las cápsulas" />
  </div></div>;
}

function Intentions({ onBack, onComplete }) {
  const [phase, setPhase] = useState("intro");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [result, setResult] = useState(null);

  if (phase === "intro") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 2 · QUERER" title={QUERER_INTRO.title} sub="Reconstruye una intención completa. No traduzcas: sigue la escena." />
    <Card>
      {QUERER_INTRO.paragraphs.map((paragraph, index) => <p key={index} style={{ margin: index ? "10px 0 0" : 0, fontSize: 15, lineHeight: 1.65 }}>{paragraph}</p>)}
      <div style={{ marginTop: 16, borderLeft: `3px solid ${C.gold}`, padding: "10px 0 10px 13px", color: C.raspberry, fontWeight: 900, lineHeight: 1.55 }}>{QUERER_INTRO.mission}</div>
      <button onClick={() => setPhase("dialogues")} style={{ marginTop: 18, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Entrar en la Sala →</button>
    </Card>
    <Back onClick={onBack} label="← Volver a las cápsulas" />
  </div></div>;

  if (phase === "dialogues") {
    const dialogue = QUERER_DIALOGUES[dialogueIndex];
    return <DialogueExercise key={dialogue.id} dialogue={dialogue} onSolved={() => {
      if (dialogueIndex === QUERER_DIALOGUES.length - 1) setPhase("review");
      else setDialogueIndex(value => value + 1);
    }} />;
  }

  if (phase === "review") return <MeaningReview onFinish={(nextResult) => {
    setResult(nextResult);
    try {
      window.localStorage.setItem("ciudad:capsula2:querer", JSON.stringify({ ...nextResult, completedAt: new Date().toISOString() }));
    } catch (_) { /* El resultado visual sigue disponible aunque el navegador bloquee storage. */ }
    onComplete?.("querer-2");
    setPhase("finish");
  }} />;

  return <IntentionsFinish result={result || { correct: 0, total: 4, missed: [] }} onAgain={() => { setDialogueIndex(0); setResult(null); setPhase("intro"); }} onBack={onBack} />;
}

// Капсула 4 · PODER. Та же механика, что у Intentions (Капсула 2, QUERER) —
// меняются только данные (poderDialogueData.js) и закрывающая реплика/ссылка
// на Gramática. DialogueExercise/MeaningReview/IntentionsFinish уже приняли
// параметры capsuleLabel/total/pool, поэтому движок не копируется.
function PoderIntentions({ onBack, onComplete }) {
  const [phase, setPhase] = useState("intro");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [result, setResult] = useState(null);

  if (phase === "intro") return <div style={wrap}><div style={maxw}>
    <Header small="Cápsula 4 · PODER" title={PODER_INTRO.title} sub="Reconstruye una posibilidad completa. No traduzcas: sigue la escena." />
    <Card>
      {PODER_INTRO.paragraphs.map((paragraph, index) => <p key={index} style={{ margin: index ? "10px 0 0" : 0, fontSize: 15, lineHeight: 1.65 }}>{paragraph}</p>)}
      <div style={{ marginTop: 16, borderLeft: `3px solid ${C.gold}`, padding: "10px 0 10px 13px", color: C.raspberry, fontWeight: 900, lineHeight: 1.55 }}>{PODER_INTRO.mission}</div>
      <button onClick={() => setPhase("dialogues")} style={{ marginTop: 18, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Entrar en la Sala →</button>
    </Card>
    <Back onClick={onBack} label="← Volver a las cápsulas" />
  </div></div>;

  if (phase === "dialogues") {
    const dialogue = PODER_DIALOGUES[dialogueIndex];
    return <DialogueExercise key={dialogue.id} dialogue={dialogue} capsuleLabel="Cápsula 4" total={PODER_DIALOGUES.length} onSolved={() => {
      if (dialogueIndex === PODER_DIALOGUES.length - 1) setPhase("review");
      else setDialogueIndex(value => value + 1);
    }} />;
  }

  if (phase === "review") return <MeaningReview pool={PODER_REVIEW} onFinish={(nextResult) => {
    setResult(nextResult);
    try {
      window.localStorage.setItem("ciudad:capsula4:poder", JSON.stringify({ ...nextResult, completedAt: new Date().toISOString() }));
    } catch (_) { /* El resultado visual sigue disponible aunque el navegador bloquee storage. */ }
    onComplete?.("poder-2");
    setPhase("finish");
  }} />;

  return <IntentionsFinish
    result={result || { correct: 0, total: 4, missed: [] }}
    onAgain={() => { setDialogueIndex(0); setResult(null); setPhase("intro"); }}
    onBack={onBack}
    capsuleLabel="Cápsula 4"
    title="Informe de posibilidades"
    closingLine={<>Ya sabemos <b>qué podían hacer</b> Tomás y Lucía.<br />Poder no siempre significa hacerlo.</>}
    gramaticaTema="op-poder"
    gramaticaLabel="Practicar PODER en Gramática"
  />;
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

function Start({ progress, onOpen, onBack }) {
  const completed = CAPSULE_LINE.filter(item => progress.completed.includes(item.id));
  // «Следующая капсула» всегда выводится из фактического completed, а не из
  // отдельно хранимого currentId — так открытие уже пройденной капсулы для
  // повтора (из списка ниже) не может откатить указатель линейки назад.
  // Пропускает неготовые «Капсула 2»-заглушки (регресс 29.08: прежняя версия
  // брала первую НЕ ПРОЙДЕННУЮ без учёта ready и после tener-que-1 упиралась
  // в неготовую tener-que-2, блокируя пять уже задеплоенных капсул
  // ir-a-1…volver-a-1, стоящих в линейке дальше).
  const nextReadyIndex = CAPSULE_LINE.findIndex(item => item.ready && !progress.completed.includes(item.id));
  const currentIndex = nextReadyIndex >= 0 ? nextReadyIndex : CAPSULE_LINE.length - 1;
  const current = CAPSULE_LINE[currentIndex] || CAPSULE_LINE[CAPSULE_LINE.length - 1];
  const currentReady = nextReadyIndex >= 0;
  return <div style={wrap}><div style={maxw}>
    <Header small="Capítulo 4 · App" title="Капсулы Дона Вербо" sub={`${Math.min(currentIndex + 1, 16)} из 16 · App хранит этот прогресс самостоятельно.`} />
    <Card>
      <div style={{ color: C.goldDeep, fontSize: 11, fontWeight: 900, letterSpacing: "1px", textTransform: "uppercase" }}>{currentReady ? "Текущая капсула" : "Следующая капсула"}</div>
      <div style={{ color: C.raspberry, fontSize: 21, fontWeight: 900, marginTop: 6 }}>{current?.operator} · {current?.title}</div>
      <div style={{ color: C.inkSoft, fontSize: 13.5, lineHeight: 1.5, marginTop: 7 }}>{currentReady ? "Контекст → диалог → собственная реплика → закрепление формы." : "Эта капсула откроется после проверки текущего эталона."}</div>
      {currentReady && <button onClick={() => onOpen(current.id)} style={{ marginTop: 16, width: "100%", background: C.emerald, color: "#fff", border: 0, borderRadius: 12, padding: 13, fontFamily: SERIF, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>{progress.stepByCapsule?.[current.id] ? "Продолжить капсулу →" : "Начать капсулу →"}</button>}
    </Card>
    {completed.length > 0 && <details style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 14, padding: "13px 15px", marginBottom: 14 }}>
      <summary style={{ cursor: "pointer", color: C.goldDeep, fontWeight: 800 }}>Пройдено: {completed.length} из 16</summary>
      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>{completed.map(item => <button key={item.id} onClick={() => onOpen(item.id)} style={{ width: "100%", background: C.cream, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 10, padding: 11, textAlign: "left", fontFamily: SERIF, cursor: "pointer" }}><b>{item.operator}</b> · {item.title}</button>)}</div>
    </details>}
    <Back onClick={onBack} label="← В Главу 4" />
  </div></div>;
}

export default function ActionCapsules({ onBack, onPracticeGrammar, initialCapsuleId = null, resumeStep = 0 }) {
  const [progress, setProgress] = useState(readProgress);
  const [mode, setMode] = useState(initialCapsuleId || "start");
  const saveStep = (capsuleId, stepIndex) => setProgress(previous => {
    // Открытие уже пройденной капсулы для повтора не должно двигать currentId
    // назад — линейка сама выводит «следующую» из completed (см. Start).
    const currentId = previous.completed.includes(capsuleId) ? previous.currentId : capsuleId;
    const next = { ...previous, currentId, stepByCapsule: { ...previous.stepByCapsule, [capsuleId]: stepIndex } };
    writeProgress(next); return next;
  });
  const complete = (capsuleId) => setProgress(previous => {
    const completed = Array.from(new Set([...previous.completed, capsuleId]));
    const index = CAPSULE_LINE.findIndex(item => item.id === capsuleId);
    const nextItem = CAPSULE_LINE[index + 1];
    const next = { ...previous, completed, currentId: nextItem?.id || capsuleId, stepByCapsule: { ...previous.stepByCapsule, [capsuleId]: 0 } };
    writeProgress(next); return next;
  });
  if (mode === "querer-1") return <QuererOne initialStep={resumeStep || progress.stepByCapsule?.["querer-1"] || 0} onStep={(step) => saveStep("querer-1", step)} onPracticeGrammar={onPracticeGrammar} onComplete={complete} onBack={() => setMode("start")} />;
  if (mode === "querer-2") return <Intentions onComplete={complete} onBack={() => setMode("start")} />;
  if (mode === "poder-1") return <PoderOne initialStep={resumeStep || progress.stepByCapsule?.["poder-1"] || 0} onStep={(step) => saveStep("poder-1", step)} onPracticeGrammar={onPracticeGrammar} onComplete={complete} onBack={() => setMode("start")} />;
  if (mode === "poder-2") return <PoderIntentions onComplete={complete} onBack={() => setMode("start")} />;
    if (mode === "tener-que-1") return <TenerQueOne initialStep={resumeStep || progress.stepByCapsule?.["tener-que-1"] || 0} onStep={(step) => saveStep("tener-que-1", step)} onPracticeGrammar={onPracticeGrammar} onComplete={complete} onBack={() => setMode("start")} />;
  if (mode === "ir-a-1") return <IrAOne initialStep={resumeStep || progress.stepByCapsule?.["ir-a-1"] || 0} onStep={(step) => saveStep("ir-a-1", step)} onPracticeGrammar={onPracticeGrammar} onComplete={complete} onBack={() => setMode("start")} />;
  if (mode === "intentar-1") return <IntentarOne initialStep={resumeStep || progress.stepByCapsule?.["intentar-1"] || 0} onStep={(step) => saveStep("intentar-1", step)} onPracticeGrammar={onPracticeGrammar} onComplete={complete} onBack={() => setMode("start")} />;
  if (mode === "empezar-a-1") return <EmpezarAOne initialStep={resumeStep || progress.stepByCapsule?.["empezar-a-1"] || 0} onStep={(step) => saveStep("empezar-a-1", step)} onPracticeGrammar={onPracticeGrammar} onComplete={complete} onBack={() => setMode("start")} />;
  if (mode === "dejar-de-1") return <DejarDeOne initialStep={resumeStep || progress.stepByCapsule?.["dejar-de-1"] || 0} onStep={(step) => saveStep("dejar-de-1", step)} onPracticeGrammar={onPracticeGrammar} onComplete={complete} onBack={() => setMode("start")} />;
  if (mode === "volver-a-1") return <VolverAOne initialStep={resumeStep || progress.stepByCapsule?.["volver-a-1"] || 0} onStep={(step) => saveStep("volver-a-1", step)} onPracticeGrammar={onPracticeGrammar} onComplete={complete} onBack={() => setMode("start")} />;
  if (mode === "recognize") return <Recognize onBack={() => setMode("start")} />;
  if (mode === "build") return <Build onBack={() => setMode("start")} />;
  if (mode === "transform") return <Transform onBack={() => setMode("start")} />;
  if (mode === "story") return <Story onBack={() => setMode("start")} />;
  if (mode === "intentions") return <Intentions onComplete={complete} onBack={() => setMode("start")} />;
  return <Start progress={progress} onOpen={setMode} onBack={onBack} />;
}
