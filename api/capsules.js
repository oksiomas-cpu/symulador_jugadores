// ============================================================
// API прогресса капсул операторов (Капсулы Дона Вербо · La Ciudad de
// los Sentidos). Тот же приём, что у общей копилки очков (api/score.js):
// localStorage — мгновенный кэш на устройстве, Redis — источник правды
// между устройствами (ciudad-game, Upstash Redis через Vercel Storage).
//
// Ключ: capsules:{tgId} — Redis SET id'шников пройденных капсул.
// SADD идемпотентен и работает как объединение множеств, поэтому синк
// безопасно повторять на каждом открытии экрана: конфликт между
// устройствами невозможен, прогресс только растёт, никогда не откатывается.
//
// Действия:
//   get   {tgId}                → { ok:true, completed:[...] }
//   add   {tgId, capsuleId}     → SADD одного id, вернуть полный список
//   sync  {tgId, completed:[]}  → SADD всех локальных id разом (повторный
//                                  вызов безопасен — задвоения не бывает)
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

// Формат id капсулы в CAPSULE_LINE: querer-1, tener-que-1, empezar-a-2 и т.д.
const VALID_ID = /^[a-z]+(-[a-z]+)*-\d$/;

async function readCompleted(tgId) {
  const members = await cmd(["SMEMBERS", `capsules:${tgId}`]);
  return Array.isArray(members) ? members : [];
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
    const key = `capsules:${tgId}`;

    if (action === "get") {
      return res.status(200).json({ ok: true, completed: await readCompleted(tgId) });
    }

    if (action === "add") {
      const capsuleId = String(body.capsuleId || "");
      if (!VALID_ID.test(capsuleId)) return res.status(400).json({ error: "Неверный capsuleId" });
      await cmd(["SADD", key, capsuleId]);
      return res.status(200).json({ ok: true, completed: await readCompleted(tgId) });
    }

    if (action === "sync") {
      const list = Array.isArray(body.completed)
        ? body.completed.filter(id => VALID_ID.test(String(id))).slice(0, 16)
        : [];
      if (list.length) await cmd(["SADD", key, ...list]);
      return res.status(200).json({ ok: true, completed: await readCompleted(tgId) });
    }

    return res.status(400).json({ error: "Неизвестное действие" });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
};
