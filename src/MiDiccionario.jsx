import { useEffect, useState } from "react";
import {
  readDictionaryLocal, writeDictionaryLocal, dictionaryCloudCall,
  labelFor, translationFor, chapterTitle,
} from "./libroVivoDictionary.js";

// ============================================================
// МОЙ СЛОВАРЬ — личный список глагольных конструкций игрока,
// собранных через «+ добавить в словарь» в Libro Vivo (ТЗ, вариант A).
// Хранилище общее с Libro Vivo: localStorage + Redis dictionary:{tgId}.
// ============================================================

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

  return (
    <main className="ci-panel">
      <div>
        <button type="button" className="ci-back" onClick={onBack}>‹ Назад</button>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.2px", color: C.goldDeep, textTransform: "uppercase" }}>Libro Vivo</div>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: SERIF, color: C.raspberry }}>📓 Мой словарь</div>
          <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 2 }}>
            {sorted.length ? `${sorted.length} ${sorted.length === 1 ? "конструкция" : "конструкций"}` : "пока пусто"}
          </div>

        </div>

        {loading && (
          <div style={{ textAlign: "center", color: C.inkSoft, fontSize: 14, padding: "20px 0" }}>Загружаю…</div>
        )}

        {!loading && sorted.length === 0 && (
          <div style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 16, padding: "22px 18px", textAlign: "center", color: C.inkSoft, fontSize: 14.5, lineHeight: 1.6 }}>
            Здесь появятся глаголы, которые ты сохранишь в Libro Vivo: открой страницу истории, нажми на подчёркнутое слово и выбери «+ добавить в словарь».
          </div>
        )}

        {!loading && sorted.length > 0 && (
          <div style={{ display: "grid", gap: 10 }}>
            {sorted.map(it => (
              <div key={`${it.chapterId}:${it.verbId}`} style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 14, padding: "13px 16px", boxShadow: "0 2px 10px rgba(61,43,31,0.06)", display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 16.5, fontWeight: 800, color: C.raspberry }}>{labelFor(it.chapterId, it.verbId)}</div>
                  <div style={{ fontSize: 14, color: C.ink, marginTop: 3 }}>{translationFor(it.chapterId, it.verbId) || "—"}</div>
                  <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 6, textTransform: "uppercase", letterSpacing: ".3px" }}>{chapterTitle(it.chapterId)}</div>
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

        {onOpenLibro && <button type="button" className="ci-quiet ci-dictionary-link" onClick={onOpenLibro}>К истории в Libro Vivo →</button>}
      </div>
    </main>
  );
}
