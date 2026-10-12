// 담당: A — Day 3
// 날짜 × 30분 단위 시각 표. 칸을 클릭하면 선택/해제.
// 칸 하나는 "2026-10-12_09:30" (날짜_시각) 형식의 문자열로 표현합니다.

// 5-4. Fragment 가져오기 (보이지 않는 묶음 상자)
import { Fragment } from 'react'
import { formatDate } from '../utils/format'

// 5-1. 칸 시각 목록 만들기: < 라서 끝 시각은 안 들어가요
function makeTimes(startHour, endHour) {
  const times = []
  for (let h = startHour; h < endHour; h++) {
    const hh = String(h).padStart(2, '0')
    times.push(`${hh}:00`, `${hh}:30`)
  }
  return times // 18~22시 → ["18:00", "18:30", ..., "21:30"] 8개
}

// 5-2. props로 날짜·시각·고른 칸·누를 때 할 일 받기
function TimeGrid({ dates, startHour, endHour, selected, onToggle }) {
  const times = makeTimes(startHour, endHour)

  // 5-3. CSS Grid로 표 그리기: 첫 열은 시각(48px), 나머지는 날짜 수만큼 같은 너비
  return (
    <div
      style={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: `48px repeat(${dates.length}, 1fr)`,
      }}
    >
      {/* 5-3. 맨 윗줄: 왼쪽 빈칸 + 날짜 머리글 */}
      <span />
      {dates.map((d) => (
        <div key={d} style={{ textAlign: 'center', fontSize: 13 }}>
          {formatDate(d)}
        </div>
      ))}

      {/* 5-3. 시각마다 한 줄: 시각 글자 + 날짜 수만큼 칸 */}
      {times.map((t) => (
        <Fragment key={t}>
          <div style={{ fontSize: 12, textAlign: 'right', paddingRight: 4 }}>{t}</div>
          {dates.map((d) => {
            const slot = `${d}_${t}` // "2026-10-13_19:30"
            const on = selected.includes(slot)
            return (
              <button
                key={slot}
                type="button"
                onClick={() => onToggle(slot)}
                style={{
                  height: 30,
                  border: '1px solid #d1d5db',
                  borderRadius: 4,
                  background: on ? '#2563eb' : '#fff',
                  cursor: 'pointer',
                }}
              />
            )
          })}
        </Fragment>
      ))}
    </div>
  )
}

export default TimeGrid