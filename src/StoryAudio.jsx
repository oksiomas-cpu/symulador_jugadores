// Записи Оксаны для игры №4 (10.10.2026): один общий проигрыватель на всё приложение,
// чтобы две истории никогда не звучали одновременно. Запуск идёт синхронно из нажатия,
// поэтому работает и в Telegram Mini App на iPhone.
import { useEffect, useState } from "react";

let player = null;
const listeners = new Set();
function getPlayer() {
  if (!player && typeof Audio !== "undefined") {
    player = new Audio();
    player.preload = "none";
    ["play", "pause", "ended", "timeupdate", "loadedmetadata", "error"].forEach((ev) =>
      player.addEventListener(ev, () => listeners.forEach((fn) => fn()))
    );
  }
  return player;
}
function same(src) {
  const p = getPlayer();
  return !!p && !!p.src && p.src.endsWith(src);
}
export function playStory(src) {
  const p = getPlayer();
  if (!p) return;
  try {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  } catch { /* синтезатора нет — ничего не гасим */ }
  if (!same(src)) { p.src = src; }
  p.play().catch(() => { /* браузер не дал запустить — кнопка останется ▶ */ });
}
export function stopStory() {
  const p = getPlayer();
  if (p) p.pause();
}

export const audio4 = {
  prologo: "/audio/cap4-historia-prologo.mp3",
  noche: "/audio/cap4-historia-noche.mp3",
  intruso: (key) => `/audio/cap4-intruso-${key}.mp3`,
  presenta: (key) => `/audio/cap4-presenta-${key}.mp3`,
};

function fmt(s) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

// Кнопка-проигрыватель: ▶/⏸, полоса перемотки, время. Уходит со страницы — звук стихает.
export function StoryPlayer({ src, label = "Escuchar", color = "#8A6A2F" }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const fn = () => tick((n) => n + 1);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
      if (same(src)) stopStory();
    };
  }, [src]);
  const p = getPlayer();
  const mine = same(src);
  const playing = mine && p && !p.paused;
  const cur = mine && p ? p.currentTime : 0;
  const dur = mine && p ? p.duration : NaN;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1.5px solid ${color}`, borderRadius: 12, padding: "6px 10px", margin: "6px 0", background: "rgba(255,255,255,.6)" }}>
      <button type="button" aria-label={playing ? "Пауза" : "Слушать"}
        onClick={() => (playing ? stopStory() : playStory(src))}
        style={{ background: color, color: "#fff", border: "none", borderRadius: 99, width: 34, height: 34, fontSize: 15, cursor: "pointer", flexShrink: 0 }}>
        {playing ? "⏸" : "▶"}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color }}>🔊 {label}</div>
        {mine && isFinite(dur) && (
          <input type="range" min={0} max={dur} step={1} value={cur}
            onChange={(e) => { try { p.currentTime = Number(e.target.value); } catch { /* перемотка недоступна */ } }}
            style={{ width: "100%", accentColor: color }} aria-label="Перемотка" />
        )}
      </div>
      {mine && <span style={{ fontSize: 12, color, flexShrink: 0 }}>{fmt(cur)}{isFinite(dur) ? ` / ${fmt(dur)}` : ""}</span>}
    </div>
  );
}
