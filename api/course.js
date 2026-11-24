// ============================================================
// API прогресса курса глаголов (Курс глаголов · La Ciudad de los Sentidos).
// Тот же приём, что у капсул (api/capsules.js) и словаря (api/dictionary.js):
// localStorage в рамке модуля — мгновенный кэш на устройстве, Redis —
// источник правды между устройствами (ciudad-game, Upstash Redis).
//
// Ключ: course:{tgId}:{moduleId} — строка JSON с состоянием модуля
// (шаг, ответы, ошибки, род, личный словарь модуля).
//
// Действия:
//   get {tgId, moduleId}         → { ok:true, state:{...}|null }
//   set {tgId, moduleId, state}  → сохранить состояние целиком
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

// Модули курса: m1, m2, … Других ключей API не пишет.
const VALID_MODULE = /^m\d{1,2}$/;
const MAX_BYTES = 100000;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const body = req.method === "POST" ? (req.body || {}) : (req.query || {});
    const action = body.action;
    const tgId = String(body.tgId || "").replace(/\D/g, "");
    const moduleId = String(body.moduleId || "");
    if (!tgId) return res.status(400).json({ error: "Нет tgId" });
    if (!VALID_MODULE.test(moduleId)) return res.status(400).json({ error: "Неверный модуль" });
    const key = `course:${tgId}:${moduleId}`;

    if (action === "get") {
      const raw = await cmd(["GET", key]);
      let state = null;
      try { state = raw ? JSON.parse(raw) : null; } catch (e) { state = null; }
      return res.status(200).json({ ok: true, state });
    }

    if (action === "set") {
      const state = body.state;
      if (!state || typeof state !== "object" || Array.isArray(state)) {
        return res.status(400).json({ error: "Нет состояния" });
      }
      const json = JSON.stringify(state);
      if (json.length > MAX_BYTES) return res.status(413).json({ error: "Слишком большое состояние" });
      await cmd(["SET", key, json]);
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "Неизвестное действие" });
  } catch (e) {
    return res.status(500).json({ error: "Ошибка хранилища" });
  }
};
