// ============================================================
// API личного словаря игрока (Libro Vivo · La Ciudad de los Sentidos).
// Тот же приём, что у прогресса капсул (api/capsules.js): localStorage —
// мгновенный кэш на устройстве, Redis — источник правды между
// устройствами (ciudad-game, Upstash Redis через Vercel Storage).
//
// Ключ: dictionary:{tgId} — Redis HASH, поле "{chapterId}:{verbId}",
// значение — ISO-дата добавления. HSET идемпотентен (повторное
// добавление просто обновляет дату), поэтому синк безопасно повторять
// на каждом открытии листа.
//
// Действия:
//   get    {tgId}                              → { ok:true, items:[...] }
//   add    {tgId, chapterId, verbId}            → HSET одной записи, вернуть полный список
//   sync   {tgId, items:[{chapterId,verbId}]}   → HSET всех локальных записей разом
//   remove {tgId, chapterId, verbId}            → HDEL одной записи («выучил — выбросил»), вернуть полный список
// ============================================================

function env() {
  return {
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
  };
}

async function cmd(arr) {
  const { url, token } = env();
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(arr),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error);
  return d.result;
}

// Формат id конструкции в CAP1_DICT: se-despierta, entrar-por, tener-que и т.д.
const VALID_VERB_ID = /^[a-z]+(-[a-z]+)*$/;
const VALID_CHAPTER_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function parseField(field) {
  const i = field.indexOf(":");
  if (i < 0) return null;
  return { chapterId: field.slice(0, i), verbId: field.slice(i + 1) };
}

async function readItems(tgId) {
  const flat = await cmd(["HGETALL", `dictionary:${tgId}`]);
  const items = [];
  if (Array.isArray(flat)) {
    for (let i = 0; i < flat.length; i += 2) {
      const parsed = parseField(flat[i]);
      if (parsed) items.push({ ...parsed, addedAt: flat[i + 1] });
    }
  }
  return items;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const body = req.method === "POST" ? (req.body || {}) : (req.query || {});
    const action = body.action;
    const tgId = String(body.tgId || "").replace(/\D/g, "");
    if (!tgId) return res.status(400).json({ error: "Нет tgId" });
    const key = `dictionary:${tgId}`;

    if (action === "get") {
      return res.status(200).json({ ok: true, items: await readItems(tgId) });
    }

    if (action === "add") {
      const chapterId = String(body.chapterId || "");
      const verbId = String(body.verbId || "");
      if (!VALID_CHAPTER_ID.test(chapterId) || !VALID_VERB_ID.test(verbId)) {
        return res.status(400).json({ error: "Неверный chapterId/verbId" });
      }
      await cmd(["HSET", key, `${chapterId}:${verbId}`, new Date().toISOString()]);
      return res.status(200).json({ ok: true, items: await readItems(tgId) });
    }

    if (action === "remove") {
      const chapterId = String(body.chapterId || "");
      const verbId = String(body.verbId || "");
      if (!VALID_CHAPTER_ID.test(chapterId) || !VALID_VERB_ID.test(verbId)) {
        return res.status(400).json({ error: "Неверный chapterId/verbId" });
      }
      await cmd(["HDEL", key, `${chapterId}:${verbId}`]);
      return res.status(200).json({ ok: true, items: await readItems(tgId) });
    }

    if (action === "sync") {
      const list = Array.isArray(body.items)
        ? body.items.filter(it => it && VALID_CHAPTER_ID.test(String(it.chapterId)) && VALID_VERB_ID.test(String(it.verbId))).slice(0, 64)
        : [];
      if (list.length) {
        const args = ["HSET", key];
        const now = new Date().toISOString();
        for (const it of list) args.push(`${it.chapterId}:${it.verbId}`, it.addedAt || now);
        await cmd(args);
      }
      return res.status(200).json({ ok: true, items: await readItems(tgId) });
    }

    return res.status(400).json({ error: "Неизвестное действие" });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
};
