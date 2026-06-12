// ============================================================
// API общего счёта La Ciudad de los Sentidos
// Единая копилка очков человека (по Telegram ID) в Redis:
// тренажёр Mini App пишет сюда свои очки, бот Don Verbo — свои.
// База: ciudad-game (Upstash Redis через Vercel Storage).
//
// Ключ: score:{tgId} — Redis HASH, поля:
//   detective / canon / fantasia / diario  — очки тренажёра по ролям
//   warmup                                  — очки разминки Don Verbo
// trainer = сумма четырёх полей тренажёра; total = trainer + warmup.
// HINCRBY атомарен — бот и тренажёр могут писать одновременно без гонок.
//
// Действия:
//   get  {tgId}                       → текущий счёт
//   add  {tgId, src, pts, name?}      → +pts в поле src, вернуть счёт
//   sync {tgId, detective, canon, fantasia, diario, name?}
//        → одноразовый переезд копилки из localStorage (HSETNX —
//          пишет только отсутствующие поля, задвоения нет)
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

const TRAINER_FIELDS = ["detective", "canon", "fantasia", "diario"];
const ALL_FIELDS = TRAINER_FIELDS.concat(["warmup"]);

async function readScore(tgId) {
  const flat = await cmd(["HGETALL", `score:${tgId}`]);
  const h = {};
  if (Array.isArray(flat)) {
    for (let i = 0; i < flat.length; i += 2) h[flat[i]] = flat[i + 1];
  } else if (flat && typeof flat === "object") {
    Object.assign(h, flat);
  }
  const out = {};
  for (const f of ALL_FIELDS) out[f] = parseInt(h[f], 10) || 0;
  out.trainer = TRAINER_FIELDS.reduce((s, f) => s + out[f], 0);
  out.total = out.trainer + out.warmup;
  return out;
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
    const key = `score:${tgId}`;

    if (action === "get") {
      return res.status(200).json({ ok: true, score: await readScore(tgId) });
    }

    if (action === "add") {
      const src = String(body.src || "");
      const pts = parseInt(body.pts, 10);
      if (!ALL_FIELDS.includes(src)) return res.status(400).json({ error: "Неизвестный src" });
      if (!Number.isFinite(pts) || pts <= 0 || pts > 100) return res.status(400).json({ error: "Неверные очки" });
      await cmd(["HINCRBY", key, src, String(pts)]);
      if (body.name) await cmd(["HSET", key, "name", String(body.name).slice(0, 60)]).catch(() => {});
      return res.status(200).json({ ok: true, score: await readScore(tgId) });
    }

    if (action === "sync") {
      // Одноразовый переезд копилки localStorage → облако.
      // HSETNX: пишет поле только если его ещё нет — повторный вызов безопасен.
      for (const f of TRAINER_FIELDS) {
        const v = parseInt(body[f], 10);
        const safe = Number.isFinite(v) && v >= 0 && v < 100000 ? v : 0;
        await cmd(["HSETNX", key, f, String(safe)]);
      }
      if (body.name) await cmd(["HSET", key, "name", String(body.name).slice(0, 60)]).catch(() => {});
      return res.status(200).json({ ok: true, score: await readScore(tgId) });
    }

    return res.status(400).json({ error: "Неизвестное действие" });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
};
