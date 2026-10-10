/* ============================================================
   PIENSA COMO EL INTRUSO — тренировка к игре №4 (cap4)
   La Ciudad de los Sentidos · 09.10.2026
   10.10.2026: сначала участник читает и слушает историю преступника
   (полная цепочка: чего хочет, что может, что обязан сделать и почему),
   потом по ситуации раскладывает 7 действий по трём операторам:
   quiere / puede / tiene que. Проверка идёт по
   канону той же матрицы, что и игра (game4Data.js), — второго
   источника истины нет.
   ============================================================ */
import { useState, useRef } from "react";
import { ACTIONS4, TARGETS4, intrusoKey4 } from "./game4Data.js";

const C = {
  cream: "#FAF3E6", creamDeep: "#F3E8D2", card: "#FFFFFF",
  ink: "#3D2B1F", inkSoft: "#6B5544",
  gold: "#C9A24B", goldDeep: "#A67C2E", goldSoft: "#EBD9A8",
  raspberry: "#A81B3E", emerald: "#16795B", emeraldDeep: "#0F5E47", line: "#E6D6B8",
};
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const DONE_KEY = "ciudad_intruso4_done";

const ROWS = [
  { cat: "querer", icon: "❤️", es: "¿Qué quiere hacer?", ru: "Чего он хочет?", verb: "quiere", none: "no quiere hacer nada con" },
  { cat: "poder", icon: "🔑", es: "¿Qué puede hacer?", ru: "Что он может?", verb: "puede", none: "no puede hacer nada con" },
  { cat: "tener_que", icon: "⚖️", es: "¿Qué tiene que hacer?", ru: "Что ему нужно сделать?", verb: "tiene que", none: "no tiene que hacer nada con" },
];

function readDone() {
  try { return new Set(JSON.parse(localStorage.getItem(DONE_KEY) || "[]")); } catch { return new Set(); }
}
function saveDone(set) {
  try { localStorage.setItem(DONE_KEY, JSON.stringify([...set])); } catch { /* приватный режим — прогресс не сохраняем */ }
}
function speak(text) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";
    u.rate = 0.9;
    synth.speak(u);
  } catch { /* озвучка недоступна — текст остаётся на экране */ }
}
function lowerFirst(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
function listEs(words) {
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} y ${words[words.length - 1]}`;
}
export function sentenceEs(item, key) {
  const obj = lowerFirst(item.inf);
  return ROWS.map((r) => {
    const acts = key[r.cat];
    return acts.length ? `El intruso ${r.verb} ${listEs(acts)} ${obj}.` : `El intruso ${r.none} ${obj}.`;
  }).join(" ");
}

// Подсветка оператора и связанных с ним инфинитивов (10.10.2026):
// участник сразу видит линию «quiere / puede / tiene que + действие».
const OP_COLOR = { querer: "#A81B3E", poder: "#A67C2E", tener_que: "#0F5E47" };
const OP_RE = /(?:\b[Nn]o )?\b(?:[Qq]uiere|[Pp]uede|[Tt]iene que)\b/g;
const INF_RE = /\b(?:abrir|llevar|buscar|recoger|guardar|usar|dar|d[aá]r)(?:l[oa]s?|se(?:l[oa]s?)?)?\b/gi;
function opCat(word) {
  const w = word.toLowerCase();
  if (w.includes("quiere")) return "querer";
  if (w.includes("puede")) return "poder";
  return "tener_que";
}
export function OpLine({ text }) {
  const out = [];
  const ops = [...text.matchAll(OP_RE)];
  let pos = 0;
  ops.forEach((m, i) => {
    const start = m.index;
    if (start > pos) out.push(text.slice(pos, start));
    const color = OP_COLOR[opCat(m[0])];
    out.push(<b key={`o${i}`} style={{ color }}>{m[0]}</b>);
    const after = start + m[0].length;
    const nextOp = i + 1 < ops.length ? ops[i + 1].index : text.length;
    const stop = text.slice(after).search(/[.:;]/);
    const end = Math.min(nextOp, stop === -1 ? text.length : after + stop);
    const seg = text.slice(after, end);
    let p = 0;
    for (const v of seg.matchAll(INF_RE)) {
      if (v.index > p) out.push(seg.slice(p, v.index));
      out.push(<b key={`o${i}v${v.index}`} style={{ color }}>{v[0]}</b>);
      p = v.index + v[0].length;
    }
    if (p < seg.length) out.push(seg.slice(p));
    pos = end;
  });
  if (pos < text.length) out.push(text.slice(pos));
  return <>{out}</>;
}

function emptyMarks() { return { querer: new Set(), poder: new Set(), tener_que: new Set() }; }

export default function IntrusoTrainer({ onClose }) {
  const [idx, setIdx] = useState(null);
  const [marks, setMarks] = useState(emptyMarks);
  const [checked, setChecked] = useState(false);
  const [ru, setRu] = useState(false);
  const [step, setStep] = useState("historia");
  const shellRef = useRef(null);
  function toTop() { try { shellRef.current?.scrollTo(0, 0); } catch { /* старые браузеры */ } }
  const [done, setDone] = useState(readDone);

  const item = idx === null ? null : TARGETS4[idx];
  const key = item ? intrusoKey4(item) : null;

  function open(i) { setIdx(i); setMarks(emptyMarks()); setChecked(false); setRu(false); setStep("historia"); toTop(); }
  function retry() { setMarks(emptyMarks()); setChecked(false); setRu(false); setStep("juego"); }
  function toggle(cat, act) {
    if (checked) return;
    setMarks((m) => {
      const next = { ...m, [cat]: new Set(m[cat]) };
      if (next[cat].has(act)) next[cat].delete(act); else next[cat].add(act);
      return next;
    });
  }
  function check() {
    setChecked(true);
    const allRight = ROWS.every((r) => ACTIONS4.every((a) => marks[r.cat].has(a.id) === key[r.cat].includes(a.id)));
    if (allRight) {
      const next = new Set(done); next.add(item.key); setDone(next); saveDone(next);
    }
  }

  const shell = { position: "fixed", inset: 0, zIndex: 1000, background: `radial-gradient(120% 80% at 50% 0%, ${C.cream} 0%, ${C.creamDeep} 100%)`, overflowY: "auto", fontFamily: SERIF, color: C.ink };
  // Верхний отступ 64px: шапка тренировки ниже плавающей кнопки «🧹 Сброс» (10.10.2026).
  const inner = { maxWidth: 560, margin: "0 auto", padding: "64px 14px 60px", boxSizing: "border-box" };
  const topBtn = { background: "none", border: `1.5px solid ${C.gold}`, color: C.goldDeep, fontSize: 13.5, fontWeight: 600, borderRadius: 10, padding: "7px 14px", cursor: "pointer", fontFamily: SERIF };
  const card = { background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px", marginBottom: 12, boxShadow: "0 2px 10px rgba(61,43,31,0.08)" };

  // ---------- Список предметов ----------
  if (!item) {
    return (
      <div role="dialog" aria-label="Piensa como el intruso" ref={shellRef} style={shell}><div style={inner}>
        <div style={{ marginBottom: 14 }}><button type="button" onClick={onClose} style={topBtn}>← К игре El Libro Mágico</button></div>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 40 }}>🕵️</div>
          <h2 style={{ margin: "4px 0 2px", fontSize: 22 }}>Piensa como el intruso</h2>
          <div style={{ fontSize: 13, color: C.goldDeep, fontWeight: 600 }}>Думай как преступник · {done.size} из {TARGETS4.length}</div>
        </div>
        <div style={card}>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: C.inkSoft }}>
            Открой предмет. Сначала прочитай и послушай <b>историю преступника</b>: чего он хочет,
            что может и что обязан сделать с этой вещью. Представь её как картинку.
            Потом разложи семь действий по трём полкам: <b>хочет</b>, <b>может</b>, <b>нужно сделать</b>.
            В игре ты сможешь сослаться на любой факт из истории.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {TARGETS4.map((it, i) => (
            <button key={it.key} type="button" onClick={() => open(i)}
              style={{ background: done.has(it.key) ? "#E7F4EE" : C.card, border: `1px solid ${done.has(it.key) ? C.emerald : C.line}`, borderRadius: 10, padding: "10px", textAlign: "left", cursor: "pointer", fontFamily: SERIF }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{it.emoji} {it.inf} {done.has(it.key) ? "✓" : ""}</div>
              <div style={{ fontSize: 12, color: C.inkSoft }}>{it.ru}</div>
            </button>
          ))}
        </div>
      </div></div>
    );
  }

  // ---------- Шаг 1: история преступника ----------
  if (step === "historia") {
    const storyEs = item.historiaEs.join(" ");
    return (
      <div role="dialog" aria-label={`La historia del intruso · ${item.inf}`} ref={shellRef} style={shell}><div style={inner}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, gap: 8 }}>
          <button type="button" onClick={() => setIdx(null)} style={topBtn}>← Все предметы</button>
          <button type="button" onClick={onClose} style={topBtn}>К игре ✕</button>
        </div>
        <div style={card}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{item.emoji} {item.inf}</div>
          <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 4 }}>{item.ru}</div>
          <div style={{ fontSize: 13, color: C.goldDeep, fontWeight: 700, marginBottom: 6 }}>📜 Шаг 1 · История преступника</div>
          <div style={{ fontSize: 12.5, marginBottom: 10 }}>
            <b style={{ color: OP_COLOR.querer }}>❤️ quiere</b> · <b style={{ color: OP_COLOR.poder }}>🔑 puede</b> · <b style={{ color: OP_COLOR.tener_que }}>⚖️ tiene que</b>
            <span style={{ color: C.inkSoft }}> — следи за этими линиями</span>
          </div>
          {item.historiaEs.map((line, i) => (
            <div key={i} style={{ marginBottom: 9 }}>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65 }}><OpLine text={line} /></p>
              {ru && <p style={{ margin: "2px 0 0", fontSize: 13.5, lineHeight: 1.55, color: C.inkSoft, fontStyle: "italic" }}>{item.historiaRu[i]}</p>}
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button type="button" onClick={() => speak(storyEs)} style={{ ...topBtn, padding: "6px 12px" }}>🔊 Escuchar</button>
            <button type="button" onClick={() => setRu((v) => !v)} style={{ ...topBtn, padding: "6px 12px" }}>{ru ? "ES ✓" : "RU перевод"}</button>
          </div>
        </div>
        <div style={{ ...card, background: C.cream }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: C.inkSoft }}>
            Представь эту сцену. Потом история закроется, и ты разложишь действия по памяти.
          </p>
        </div>
        <button type="button" onClick={() => { setRu(false); setStep("juego"); toTop(); }}
          style={{ width: "100%", background: C.raspberry, color: "#fff", border: "none", borderRadius: 14, padding: "15px", fontSize: 17, fontWeight: 800, fontFamily: SERIF, cursor: "pointer" }}>
          Lo veo · Шаг 2 →
        </button>
      </div></div>
    );
  }

  // ---------- Шаг 2: упражнение ----------
  const total = ROWS.length * ACTIONS4.length;
  const right = checked ? ROWS.reduce((n, r) => n + ACTIONS4.filter((a) => marks[r.cat].has(a.id) === key[r.cat].includes(a.id)).length, 0) : 0;
  const nextIdx = (idx + 1) % TARGETS4.length;

  return (
    <div role="dialog" aria-label={`Piensa como el intruso · ${item.inf}`} ref={shellRef} style={shell}><div style={inner}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, gap: 8 }}>
        <button type="button" onClick={() => setIdx(null)} style={topBtn}>← Все предметы</button>
        <button type="button" onClick={onClose} style={topBtn}>К игре ✕</button>
      </div>

      <div style={card}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>{item.emoji} {item.inf}</div>
        <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 10 }}>{item.ru}</div>
        <p style={{ margin: "0 0 8px", fontSize: 16, lineHeight: 1.7 }}>{item.situationEs}</p>
        {ru && <p style={{ margin: "0 0 8px", fontSize: 13.5, lineHeight: 1.6, color: C.inkSoft, fontStyle: "italic" }}>{item.situationRu}</p>}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={() => { setRu(false); setStep("historia"); }} style={{ ...topBtn, padding: "6px 12px" }}>📜 История</button>
          <button type="button" onClick={() => speak(item.situationEs)} style={{ ...topBtn, padding: "6px 12px" }}>🔊 Escuchar</button>
          <button type="button" onClick={() => setRu((v) => !v)} style={{ ...topBtn, padding: "6px 12px" }}>{ru ? "ES ✓" : "RU перевод"}</button>
        </div>
      </div>

      {ROWS.map((r) => {
        const rowWrong = checked && ACTIONS4.some((a) => marks[r.cat].has(a.id) !== key[r.cat].includes(a.id));
        return (
          <div key={r.cat} style={card}>
            <div style={{ fontWeight: 700, fontSize: 15.5 }}>{r.icon} {r.es}</div>
            <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 8 }}>{r.ru}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {ACTIONS4.map((a) => {
                const sel = marks[r.cat].has(a.id);
                const should = key[r.cat].includes(a.id);
                let bg = sel ? C.goldSoft : C.cream, border = `1.5px solid ${sel ? C.gold : C.line}`, color = C.ink, mark = "";
                if (checked) {
                  if (sel && should) { bg = "#DDF0E7"; border = `1.5px solid ${C.emerald}`; mark = " ✓"; }
                  else if (sel && !should) { bg = "#F7DDE4"; border = `1.5px solid ${C.raspberry}`; color = C.raspberry; mark = " ✕"; }
                  else if (!sel && should) { bg = C.card; border = `1.5px dashed ${C.emerald}`; color = C.emeraldDeep; mark = " +"; }
                }
                return (
                  <button key={a.id} type="button" onClick={() => toggle(r.cat, a.id)} title={a.ru}
                    style={{ background: bg, border, color, borderRadius: 99, padding: "7px 12px", fontSize: 14, cursor: checked ? "default" : "pointer", fontFamily: SERIF }}>
                    {a.id}{mark}
                  </button>
                );
              })}
            </div>
            {rowWrong && (
              <div style={{ marginTop: 10, fontSize: 13.5, lineHeight: 1.55, color: C.inkSoft, background: C.cream, borderRadius: 8, padding: "8px 10px" }}>
                <b>Почему:</b> {item.why[r.cat]}
              </div>
            )}
          </div>
        );
      })}

      {!checked ? (
        <button type="button" onClick={check}
          style={{ width: "100%", background: C.raspberry, color: "#fff", border: "none", borderRadius: 14, padding: "15px", fontSize: 17, fontWeight: 800, fontFamily: SERIF, cursor: "pointer" }}>
          Comprobar
        </button>
      ) : (
        <>
          <div style={{ ...card, borderColor: right === total ? C.emerald : C.gold }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              {right === total ? "🎯 Ты думаешь как нарушитель!" : `Совпало ${right} из ${total}`}
            </div>
            <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 6 }}>✓ верно · ✕ лишнее · + пропущено</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginTop: 8 }}>🗣 Tu historia</div>
            <div style={{ fontSize: 13, color: C.inkSoft, margin: "2px 0 8px" }}>
              Скажи вслух, как думает нарушитель. Начни так: «El intruso quiere…, pero tiene que…». Вот версия по плану:
            </div>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7 }}>{sentenceEs(item, key)}</p>
            <button type="button" onClick={() => speak(sentenceEs(item, key))} style={{ ...topBtn, padding: "6px 12px", marginTop: 8 }}>🔊 Escuchar</button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={retry}
              style={{ flex: 1, background: C.card, color: C.goldDeep, border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, fontFamily: SERIF, cursor: "pointer" }}>
              Ещё раз
            </button>
            <button type="button" onClick={() => open(nextIdx)}
              style={{ flex: 1, background: C.emerald, color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, fontFamily: SERIF, cursor: "pointer" }}>
              Следующий →
            </button>
          </div>
        </>
      )}
    </div></div>
  );
}
