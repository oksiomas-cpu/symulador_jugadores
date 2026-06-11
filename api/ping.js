// Тест подключения базы ciudad-game (Upstash Redis)
export default async function handler(req, res) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return res.status(200).json({ ok: false, error: "База не подключена к проекту (нет переменных окружения)" });
  }
  try {
    const stamp = new Date().toISOString();
    const setR = await fetch(`${url}/set/ciudad_ping/${encodeURIComponent(stamp)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!setR.ok) throw new Error(`запись не прошла: ${setR.status}`);
    const getR = await fetch(`${url}/get/ciudad_ping`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await getR.json();
    return res.status(200).json({ ok: true, message: "✅ База ciudad-game работает! Запись и чтение прошли.", value: data.result });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e) });
  }
}
