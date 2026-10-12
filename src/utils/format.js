// src/utils/format.js — 화면에서 같이 쓰는 날짜·시각 모양 함수

// "2026-10-13" → "10/13 (화)"
export function formatDate(d) {
  const day = new Date(d + 'T00:00')
  return `${day.getMonth() + 1}/${day.getDate()} (${'일월화수목금토'[day.getDay()]})`
}

// 9 → "09:00"
export function formatHour(h) {
  return `${String(h).padStart(2, '0')}:00`
}