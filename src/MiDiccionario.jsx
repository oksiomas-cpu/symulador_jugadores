import { useEffect, useState } from "react";
import DiccionarioJuegos, { loadStats, readStatsLocal } from "./DiccionarioJuegos.jsx";
import {
  readDictionaryLocal, writeDictionaryLocal, dictionaryCloudCall,
  labelFor, translationFor, chapterTitle,
} from "./libroVivoDictionary.js";

// ============================================================
// МОЙ СЛОВАРЬ — личный список глагольных конструкций игрока,
// собранных через «+ добавить в словарь» в Libro Vivo (ТЗ, вариант A).
// Хранилище общее с Libro Vivo: localStorage + Redis dictionary:{tgId}.
// 25.11.2026 (Оксана): один словарь — сюда же слова курса глаголов (модуль 1, «+ Mi diccionario»;
// они лежат в состоянии модуля course:{tgId}:m1), и вкладка «Игры» с тремя играми, как в Taller de Lengua.
// ============================================================
const KURS = [{ id: "m1", key: "kv_r1_ser_estar_v1", title: "Курс глаголов · Ser, estar, hay" }];
function kursLocal(key) { try { const s = JSON.parse(localStorage.getItem(key) || "null"); return s && Array.isArray(s.dict) ? s.dict : []; } catch (_) { return []; } }

const C = {
  cream: "#FAF3E6", creamDeep: "#F3E8D2", card: "#FFFFFF",
  ink: "#3D2B1F", inkSoft: "#6B5544",
  gold: "#C9A24B", goldDeep: "#A67C2E",
  raspberry: "#A81B3E", line: "#E6D6B8",
};
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

export default function MiDiccionario({ onBack, onOpenLibro, tgId = null }) {
  const [items, setItems] = useState(() => readDictionaryLocal());
  const [loading, setLoading] = useState(!!tgId);
  const [tab, setTab] = useState("words");
  const [stats, setStats] = useState(() => readStatsLocal());
  const [kurs, setKurs] = useState(() => KURS.map(m => ({ ...m, dict: kursLocal(m.key) })));

  useEffect(() => {
    loadStats(tgId).then(setStats);
    if (!tgId) return;
    KURS.forEach(m => {
      fetch(`/api/course?action=get&tgId=${encodeURIComponent(tgId)}&moduleId=${m.id}`).then(r => r.json()).then(d => {
        const cloud = d && d.state && Array.isArray(d.state.dict) ? d.state.dict : null;
        if (cloud && cloud.length >= kursLocal(m.key).length) setKurs(prev => prev.map(x => x.id === m.id ? { ...x, dict: cloud } : x));
      }).catch(() => {});
    });
  }, [tgId]);

  useEffect(() => {
    if (!tgId) return;
    (async () => {
      try {
        const cloudItems = await dictionaryCloudCall({ action: "get", tgId });
        writeDictionaryLocal(cloudItems);
        setItems(cloudItems);
      } catch (_) { /* офлайн — остаёмся на локальном кэше */ }
      setLoading(false);
    })();
  }, [tgId]);

  async function removeWord(chapterId, verbId) {
    setItems(prev => {
      const next = prev.filter(it => !(it.chapterId === chapterId && it.verbId === verbId));
      writeDictionaryLocal(next);
      return next;
    });
    if (!tgId) return;
    try {
      const cloudItems = await dictionaryCloudCall({ action: "remove", tgId, chapterId, verbId });
      writeDictionaryLocal(cloudItems);
      setItems(cloudItems);
    } catch (_) { /* локальный кэш уже обновлён, повторим синк на следующем открытии листа */ }
  }

  const sorted = [...items].sort((a, b) => (b.addedAt || "").localeCompare(a.addedAt || ""));
  // общий список для игр: Libro Vivo + курс глаголов, без повторов
  const words = [];
  const seenK = {};
  sorted.forEach(it => { const k = labelFor(it.chapterId, it.verbId); if (!seenK[k]) { seenK[k] = 1; words.push({ k, ru: translationFor(it.chapterId, it.verbId) || "", src: "libro" }); } });
  kurs.forEach(m => m.dict.forEach(d => { if (d && d.w && !seenK[d.w]) { seenK[d.w] = 1; words.push({ k: d.w, ru: d.ru || "", lemma: d.lemma || "", ctx: d.ctx || "", src: m.id }); } }));
  const total = words.length;
  const stLabel = k => ({ new: "новое", learning: "учу", known: "знаю" }[(stats[k] && stats[k].st) || "new"]);
  const tabBtn = (id, label) => (
    <button type="button" onClick={() => setTab(id)} style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 15, borderRadius: 999, padding: "8px 16px", cursor: "pointer",
      border: `1.5px solid ${tab === id ? C.raspberry : C.line}`, background: tab === id ? "#fbeef1" : C.card, color: tab === id ? C.raspberry : C.inkSoft }}>{label}</button>
  );

  return (
    <main className="ci-panel">
      <div>
        <button type="button" className="ci-back" onClick={onBack}>‹ Назад</button>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.2px", color: C.goldDeep, textTransform: "uppercase" }}>Libro Vivo</div>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: SERIF, color: C.raspberry }}>📓 Мой словарь</div>
          <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 2 }}>
            {total ? `${total} ${total % 10 === 1 && total % 100 !== 11 ? "слово" : (total % 10 >= 2 && total % 10 <= 4 && (total % 100 < 12 || total % 100 > 14)) ? "слова" : "слов"}` : "пока пусто"}
          </div>
        </div>
        {total > 0 && <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 14 }}>{tabBtn("words", "📚 Слова")}{tabBtn("games", "🎮 Игры")}</div>}
        {tab === "games" && total > 0 && <DiccionarioJuegos words={words} stats={stats} setStats={setStats} tgId={tgId} />}

        {loading && (
          <div style={{ textAlign: "center", color: C.inkSoft, fontSize: 14, padding: "20px 0" }}>Загружаю…</div>
        )}

        {tab === "words" && !loading && total === 0 && (
          <div style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 16, padding: "22px 18px", textAlign: "center", color: C.inkSoft, fontSize: 14.5, lineHeight: 1.6 }}>
            Здесь появятся слова, которые ты сохранишь: в Libro Vivo (нажми на подчёркнутое слово и выбери «+ добавить в словарь») и в курсе глаголов («+ Mi diccionario»).
          </div>
        )}

        {tab === "words" && !loading && sorted.length > 0 && (
          <div style={{ display: "grid", gap: 10 }}>
            {sorted.map(it => (
              <div key={`${it.chapterId}:${it.verbId}`} style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 14, padding: "13px 16px", boxShadow: "0 2px 10px rgba(61,43,31,0.06)", display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 16.5, fontWeight: 800, color: C.raspberry }}>{labelFor(it.chapterId, it.verbId)}</div>
                  <div style={{ fontSize: 14, color: C.ink, marginTop: 3 }}>{translationFor(it.chapterId, it.verbId) || "—"}</div>
                  <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 6, textTransform: "uppercase", letterSpacing: ".3px" }}>{chapterTitle(it.chapterId)} · {stLabel(labelFor(it.chapterId, it.verbId))}</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeWord(it.chapterId, it.verbId)}
                  title="Выучил — убрать из словаря"
                  style={{ flexShrink: 0, alignSelf: "flex-start", background: "none", border: `1.5px solid ${C.line}`, color: C.inkSoft, borderRadius: 10, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: SERIF, whiteSpace: "nowrap" }}
                >
                  ✓ Выучено
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "words" && kurs.filter(m => m.dict.length).map(m => (
          <div key={m.id} style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.2px", color: C.goldDeep, textTransform: "uppercase", margin: "0 0 8px" }}>{m.title}</div>
            <div style={{ display: "grid", gap: 10 }}>
              {m.dict.map(d => (
                <div key={d.w} style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 14, padding: "13px 16px", boxShadow: "0 2px 10px rgba(61,43,31,0.06)" }}>
                  <div style={{ fontSize: 16.5, fontWeight: 800, color: C.raspberry }}>{d.w}{d.lemma ? <span style={{ fontWeight: 600, color: C.inkSoft, fontSize: 13 }}> · {d.lemma}</span> : null}</div>
                  <div style={{ fontSize: 14, color: C.ink, marginTop: 3 }}>{d.ru || "—"}</div>
                  {d.ctx && <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4, fontStyle: "italic" }}>«{d.ctx}»</div>}
                  <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 6, textTransform: "uppercase", letterSpacing: ".3px" }}>{stLabel(d.w)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {onOpenLibro && <button type="button" className="ci-quiet ci-dictionary-link" onClick={onOpenLibro}>К истории в Libro Vivo →</button>}
      </div>
    </main>
  );
}
