import { useMemo, useState } from "react";

// ============================================================
// ИГРЫ СЛОВАРЯ (решение Оксаны 25.11.2026) — тот же тренажёр, что в Taller de Lengua:
// три игры подряд, от узнавания к написанию:
//   1 «Пара или нет» · 2 «Какое из четырёх» (картинка-значок, если она однозначна, иначе перевод) · 3 «По буквам».
// Слова — общий список «Моего словаря» (Libro Vivo + курс глаголов).
// Состояние слова: новое → учу → знаю (все три игры без ошибки; через 7 дней слово вернётся на проверку).
// Хранится в Redis dictstats:{tgId} через /api/dictionary (stats / stat), кэш — localStorage.
// ============================================================

const C = {
  ink: "#3D2B1F", inkSoft: "#6B5544", gold: "#C9A24B", goldDeep: "#A67C2E",
  raspberry: "#A81B3E", line: "#E6D6B8", card: "#FFFFFF", ok: "#2f7d57", okbg: "#e4f3ea", bad: "#A81B3E", badbg: "#f9e6ee",
};
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const N = 8;
const PIC = { agua: "💧", amigo: "🧑‍🤝‍🧑", "año": "📅", "cafetería": "☕", clase: "🏫", "día": "☀️", frase: "💬", idea: "💡", miedo: "😨", palabra: "🔤",
  profesor: "🧑‍🏫", semana: "🗓️", tiempo: "⏳", vaso: "🥛", "vergüenza": "😳", hablar: "🗣️", llegar: "🛬", pensar: "🤔", respirar: "😮‍💨",
  mirar: "👀", ver: "👀", prometer: "🤞", "rápido": "⚡", despacio: "🐢", gente: "👥", aprender: "📚", empezar: "🏁", abrir: "🔓", cerrar: "🔒",
  escribir: "✍️", leer: "📖", casa: "🏠", silla: "🪑", mesa: "🍽️", libro: "📕", sol: "☀️", noche: "🌙", ventana: "🪟", puerta: "🚪", "café": "☕",
  oler: "👃", encender: "💡", dormir: "😴", comer: "🍽️", beber: "🥤", caminar: "🚶", "oír": "👂", sonreír: "😊", cortar: "✂️", buscar: "🔍" };
const LAT = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/;
// перевод для игр без испанских подсказок («me da vergüenza — мне стыдно»), чтобы он не выдавал слово
function ruG(ru) {
  const ps = String(ru || "").split(";").map(x => x.trim()).filter(Boolean), pure = ps.filter(x => !LAT.test(x));
  if (pure.length) return pure.join("; ");
  const tail = ps.filter(x => x.includes("—")).map(x => x.split("—").pop().trim()).filter(x => x && !LAT.test(x));
  return tail.length ? tail.join("; ") : String(ru || "");
}
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const letters = k => [...String(k).normalize("NFC")];
const g3able = k => k.length > 2 && !/\s/.test(k);
const picOf = w => PIC[w.k] || (w.lemma && PIC[w.lemma]) || "";
const GN = ["Пара или нет", "Какое из четырёх", "По буквам"];
const STKEY = "ciudad:dict-stats:v1";

export function readStatsLocal() { try { return JSON.parse(localStorage.getItem(STKEY) || "{}") || {}; } catch (_) { return {}; } }
function writeStatsLocal(s) { try { localStorage.setItem(STKEY, JSON.stringify(s)); } catch (_) {} }
export async function loadStats(tgId) {
  const local = readStatsLocal();
  if (!tgId) return local;
  try {
    const r = await fetch("/api/dictionary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "stats", tgId }) });
    const d = await r.json();
    if (d.ok) { const s = { ...local, ...d.stats }; writeStatsLocal(s); return s; }
  } catch (_) {}
  return local;
}

const btn = (primary, extra = {}) => ({ fontFamily: SERIF, fontWeight: 700, fontSize: 17, borderRadius: 14, padding: "12px 18px", minHeight: 48, cursor: "pointer",
  border: `2px solid ${primary ? C.raspberry : C.line}`, background: primary ? C.raspberry : C.card, color: primary ? "#fff" : C.ink, ...extra });
const card = { background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 16, padding: "16px 16px 18px", marginBottom: 12, boxShadow: "0 2px 10px rgba(61,43,31,0.06)" };

export default function DiccionarioJuegos({ words, stats, setStats, tgId }) {
  const [game, setGame] = useState(null); // {ks, g, i, items, res, o2, o3}
  const [fb, setFb] = useState(null);
  const byK = useMemo(() => Object.fromEntries(words.map(w => [w.k, w])), [words]);
  const stOf = k => (stats[k] && stats[k].st) || "new";
  const now = Date.now();
  const pool = words.filter(w => stOf(w.k) !== "known" || (stats[w.k].due && new Date(stats[w.k].due).getTime() < now));
  const hard = k => (stats[k] && stats[k].bad) || 0;

  function save(k, ok, g) {
    const cur = stats[k] || { st: "new", g: {}, bad: 0, due: null };
    let v = { ...cur, st: cur.st === "new" ? "learning" : cur.st };
    if (ok) { v.g = { ...(cur.g || {}), ["g" + g]: 1 }; if (v.g.g1 && v.g.g2 && v.g.g3) { v = { ...v, st: "known", g: {}, due: new Date(Date.now() + 7 * 864e5).toISOString() }; } }
    else { v = { ...v, st: "learning", g: {}, bad: (cur.bad || 0) + 1, due: null }; }
    const next = { ...stats, [k]: v }; setStats(next); writeStatsLocal(next);
    if (tgId) fetch("/api/dictionary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "stat", tgId, items: [{ k, v }] }) }).catch(() => {});
  }

  function start() {
    const fresh = pool.filter(w => stOf(w.k) === "new"), learning = pool.filter(w => stOf(w.k) !== "new").sort((a, b) => hard(b.k) - hard(a.k));
    const ks = fresh.slice(0, N - Math.min(3, learning.length)).concat(learning).slice(0, N).map(w => w.k);
    if (!ks.length) return;
    const p1 = shuffle(ks).map((k, i) => {
      const real = ruG(byK[k].ru);
      if (i % 2 === 0) return { k, ru: real, yes: true };
      const alt = shuffle(words.filter(w => w.k !== k)).find(w => ruG(w.ru) !== real);
      return alt ? { k, ru: ruG(alt.ru), yes: false } : { k, ru: real, yes: true };
    });
    setFb(null);
    setGame({ ks, g: 0, i: 0, items: [p1, shuffle(ks), shuffle(ks)], res: [{}, {}, {}], o2: null, o3: null });
  }
  function answer(k, ok, msg) {
    if (game.res[game.g][k] === undefined) { save(k, ok, game.g + 1); game.res[game.g][k] = ok ? 1 : 0; }
    setGame({ ...game }); setFb({ ok, msg });
  }
  function next() { setFb(null); setGame({ ...game, i: game.i + 1, o2: null, o3: null }); }

  if (!words.length) return null;

  // ---------- главный экран ----------
  if (!game) {
    return (
      <div>
        <div style={{ ...card, display: "flex", gap: 12 }}>
          <div style={{ fontSize: 34, lineHeight: 1 }}>🎩</div>
          <div style={{ fontSize: 15.5, lineHeight: 1.55, color: C.ink }}>
            Я <b style={{ color: C.raspberry }}>Дон Вербо</b>. Здесь живут слова, которые ты сохранил. Слово, которым не пользуешься, забывается, поэтому мы не даём им спать: сначала узнаёшь, потом выбираешь верное, а в конце пишешь по буквам.
          </div>
        </div>
        {pool.length ? (
          <div style={{ textAlign: "center", margin: "6px 0 14px" }}>
            <button type="button" style={btn(true, { fontSize: 20, padding: "14px 26px" })} onClick={start}>Играть →</button>
            <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 8 }}>За одну партию — до {N} слов: новые и те, что даются труднее.</div>
          </div>
        ) : (
          <div style={{ ...card, textAlign: "center", color: C.inkSoft }}>Все слова уже в «знаю». Через несколько дней они вернутся на быструю проверку.</div>
        )}
      </div>
    );
  }

  const bar = (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
      {GN.map((n, i) => {
        const done = Object.keys(game.res[i]).length >= game.items[i].length;
        return <span key={i} style={{ fontSize: 13, fontWeight: 700, borderRadius: 999, padding: "6px 11px", border: `1.5px solid ${i === game.g ? C.raspberry : done ? C.ok : C.line}`, color: i === game.g ? C.raspberry : done ? C.ok : C.inkSoft, background: done ? C.okbg : C.card }}>{done ? "✓ " : ""}{i + 1} · {n}</span>;
      })}
      <button type="button" onClick={() => setGame(null)} style={{ fontSize: 13, fontWeight: 700, borderRadius: 999, padding: "6px 11px", border: `1.5px solid ${C.line}`, background: C.card, color: C.inkSoft, cursor: "pointer" }}>✕ Выйти</button>
    </div>
  );
  const fbBox = fb && <div style={{ borderRadius: 12, padding: "10px 14px", margin: "10px 0", fontSize: 16, background: fb.ok ? C.okbg : C.badbg, borderLeft: `5px solid ${fb.ok ? C.ok : C.bad}` }} dangerouslySetInnerHTML={{ __html: fb.msg }} />;
  const nextBtn = fb && <div style={{ textAlign: "center" }}><button type="button" style={btn(true)} onClick={next}>Дальше →</button></div>;
  const esc = t => String(t == null ? "" : t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const es = t => <div style={{ fontSize: 34, fontWeight: 800, color: C.raspberry, textAlign: "center", margin: "8px 0 4px", fontFamily: SERIF }}>{t}</div>;

  // ---------- итог ----------
  if (game.g >= 3) {
    const known = game.ks.filter(k => [0, 1, 2].every(g => game.res[g][k])), miss = game.ks.filter(k => !known.includes(k));
    return (
      <div>
        <div style={card}>
          <div style={{ fontSize: 16, lineHeight: 1.55 }}>🎩 Сегодня в деле было <b>{game.ks.length}</b> слов. {known.length ? <>Уже твои: <b>{known.length}</b> — они переходят в «знаю». </> : null}{miss.length ? "Те, что сопротивлялись, вернутся в следующей партии: так они не забудутся." : "Ни одно не устояло!"}</div>
        </div>
        {miss.length > 0 && <div style={card}><div style={{ fontWeight: 800, marginBottom: 6 }}>🔁 Вернутся в следующий раз</div>{miss.map(k => <div key={k} style={{ padding: "4px 0" }}><b style={{ color: C.raspberry }}>{k}</b> — {ruG(byK[k].ru)}</div>)}</div>}
        <div style={{ textAlign: "center" }}><button type="button" style={btn(true)} onClick={start}>Ещё партия →</button> <button type="button" style={btn(false)} onClick={() => setGame(null)}>К словарю</button></div>
      </div>
    );
  }
  const list = game.items[game.g], it = list[game.i];
  // ---------- мостик между играми ----------
  if (it === undefined) {
    const ok = Object.values(game.res[game.g]).filter(Boolean).length;
    const B = ["Отлично: ты знаешь, какой перевод к какому слову. Теперь выбирай сам — из четырёх верный только один.", "Узнаёшь без запинки. Теперь самое трудное: написать слово самому, по буквам, со всеми ударениями."];
    return (
      <div>{bar}
        <div style={{ ...card, fontSize: 16, lineHeight: 1.55 }}>🎩 <b>{ok} из {list.length}</b> с первого раза. {B[game.g]}</div>
        <div style={{ textAlign: "center" }}><button type="button" style={btn(true, { fontSize: 19 })} onClick={() => { setFb(null); setGame({ ...game, g: game.g + 1, i: 0 }); }}>{game.g + 2} · {GN[game.g + 1]} →</button></div>
      </div>
    );
  }
  const head = <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><div style={{ fontSize: 19, fontWeight: 800, color: C.goldDeep, fontFamily: SERIF }}>{game.g + 1} · {GN[game.g]}</div><div style={{ fontSize: 13, color: C.inkSoft }}>{game.i + 1} / {list.length}</div></div>;

  // ---------- игра 1 ----------
  if (game.g === 0) {
    const w = byK[it.k];
    return (
      <div>{bar}<div style={card}>{head}
        <div style={{ fontSize: 17, fontWeight: 700, margin: "6px 0 2px" }}>Это пара?</div>
        {es(w.k)}<div style={{ fontSize: 22, textAlign: "center", marginBottom: 14 }}>{it.ru}</div>
        {!fb && <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" style={btn(true)} onClick={() => { const ok = it.yes; answer(it.k, ok, (ok ? "✓ Верно! " : "✗ Нет. ") + "<b>" + esc(w.k) + "</b> — " + esc(ruG(w.ru)) + (it.yes ? "" : ". «" + esc(it.ru) + "» — перевод другого слова.")); }}>✓ Да, пара</button>
          <button type="button" style={btn(false)} onClick={() => { const ok = !it.yes; answer(it.k, ok, (ok ? "✓ Верно! " : "✗ Нет. ") + "<b>" + esc(w.k) + "</b> — " + esc(ruG(w.ru))); }}>✗ Нет</button>
        </div>}
        {fbBox}{nextBtn}
      </div></div>
    );
  }
  // ---------- игра 2 ----------
  if (game.g === 1) {
    const k = it, w = byK[k];
    let o = game.o2;
    if (!o) {
      const pic = picOf(w);
      if (pic) {
        const others = shuffle(Object.entries(PIC).filter(([x, p]) => p !== pic && x !== w.k && x !== w.lemma)).slice(0, 3).map(([x, p]) => ({ v: p, k: x }));
        o = { pic: true, opts: shuffle([{ v: pic, k }].concat(others)) };
      } else {
        const seen = { [ruG(w.ru)]: 1 }, d = [];
        shuffle(words.filter(x => x.k !== k)).forEach(x => { const v = ruG(x.ru); if (d.length < 3 && v && !seen[v]) { seen[v] = 1; d.push({ v, k: x.k }); } });
        o = { pic: false, opts: shuffle([{ v: ruG(w.ru), k }].concat(d)) };
      }
      game.o2 = o;
    }
    return (
      <div>{bar}<div style={card}>{head}
        <div style={{ fontSize: 17, fontWeight: 700, margin: "6px 0 2px" }}>{o.pic ? "Какая картинка?" : "Что это значит?"}</div>
        {es(w.k)}
        {w.ctx && <div style={{ fontSize: 13.5, color: C.inkSoft, fontStyle: "italic", textAlign: "center", marginBottom: 10 }}>«{w.ctx}»</div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "8px 0" }}>
          {o.opts.map((x, i) => {
            const good = fb && x.k === k, chosen = fb && fb.pick === i && x.k !== k;
            return <button key={i} type="button" disabled={!!fb} onClick={() => { const ok = x.k === k; answer(k, ok, (ok ? "✓ Верно! " : "✗ Нет: ") + "<b>" + esc(w.k) + "</b> — " + esc(ruG(w.ru))); setFb(f => ({ ...f, pick: i })); }}
              style={{ fontFamily: SERIF, fontSize: o.pic ? 46 : 18, fontWeight: 600, minHeight: o.pic ? 96 : 64, borderRadius: 14, cursor: fb ? "default" : "pointer", color: C.ink,
                border: `2px solid ${good ? C.ok : chosen ? C.bad : C.line}`, background: good ? C.okbg : chosen ? C.badbg : C.card }}>{x.v}</button>;
          })}
        </div>
        {fbBox}{nextBtn}
      </div></div>
    );
  }
  // ---------- игра 3 ----------
  const k = it, w = byK[k];
  if (!g3able(k)) {
    return (
      <div>{bar}<div style={card}>{head}{es(w.k)}<div style={{ fontSize: 20, textAlign: "center" }}>{ruG(w.ru)}</div>
        <div style={{ fontSize: 14, color: C.inkSoft, textAlign: "center", margin: "8px 0 12px" }}>Короткое слово: прочитай вслух и дальше.</div>
        <div style={{ textAlign: "center" }}><button type="button" style={btn(true)} onClick={() => { if (game.res[2][k] === undefined) { save(k, true, 3); game.res[2][k] = 1; } next(); }}>Дальше →</button></div>
      </div></div>
    );
  }
  const L = letters(k);
  let o = game.o3;
  if (!o) { let t = shuffle(L.map((c, i) => ({ c, i }))); if (L.length > 1 && t.every((x, i) => x.i === i)) t = t.reverse(); o = game.o3 = { t, pos: 0, err: 0, used: [], hint: false }; }
  const acc = (k.match(/[áéíóúüñ]/) || [""])[0];
  const sw = L.length > 9 ? `min(32px, calc((100vw - 80px) / ${L.length}))` : "40px";
  return (
    <div>{bar}<div style={card}>{head}
      <div style={{ fontSize: 17, fontWeight: 700, margin: "6px 0 2px" }}>Напиши по буквам</div>
      <div style={{ fontSize: 13.5, color: C.inkSoft }}>Нажимай буквы по порядку.{acc ? <> Внимание: <b>{acc}</b> и <b>{acc.normalize("NFD")[0]}</b> — разные буквы.</> : null}</div>
      <div style={{ fontSize: 22, textAlign: "center", margin: "10px 0" }}>{ruG(w.ru)}</div>
      <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap", margin: "6px 0 14px" }}>
        {L.map((c, i) => <span key={i} style={{ width: sw, height: 50, lineHeight: "50px", borderBottom: `3px solid ${C.gold}`, fontSize: 28, fontWeight: 800, textAlign: "center", color: C.raspberry }}>{i < o.pos ? c : ""}</span>)}
      </div>
      <div style={{ display: "flex", gap: 7, justifyContent: "center", flexWrap: "wrap", marginBottom: 10 }}>
        {o.t.map((x, j) => <button key={j} type="button" disabled={o.used.includes(j) || o.pos >= L.length}
          onClick={() => {
            if (x.c === L[o.pos]) { o.used.push(j); o.pos++; if (o.pos >= L.length) answer(k, o.err === 0, (o.err ? "Готово: " : "✓ Идеально! ") + "<b>" + esc(w.k) + "</b> — " + esc(ruG(w.ru))); else setGame({ ...game }); }
            else { o.err++; if (o.err >= 3) o.hint = true; setGame({ ...game }); }
          }}
          style={{ visibility: o.used.includes(j) ? "hidden" : "visible", fontFamily: SERIF, fontSize: 26, fontWeight: 800, width: 50, height: 54, borderRadius: 12, border: `2px solid ${C.line}`, background: C.card, color: C.ink, cursor: "pointer" }}>{x.c}</button>)}
      </div>
      {o.hint && !fb && <div style={{ borderRadius: 12, padding: "8px 12px", background: "#f6efe0", fontSize: 15 }}>Подсказка: следующая буква — <b>{L[o.pos]}</b></div>}
      {o.err > 0 && !fb && <div style={{ fontSize: 13, color: C.inkSoft, textAlign: "center" }}>Ошибок: {o.err}</div>}
      {fbBox}{nextBtn}
    </div></div>
  );
}
