// 담당: A — Day 3 · 6
// 날짜 × 30분 단위 시각 표. 칸을 클릭하면 선택/해제.
// 칸 하나는 "2026-10-12_09:30" (날짜_시각) 형식의 문자열로 표현합니다.

// 5-4. Fragment 가져오기 (보이지 않는 묶음 상자)
import { Fragment } from 'react'
import { formatDate, makeTimes } from '../utils/format'

// 5-2. props로 날짜·시각·고른 칸·누를 때 할 일 받기
function TimeGrid({ dates, startHour, endHour, selected, onToggle }) {
  const times = makeTimes(startHour, endHour)

  return (
    // 6일차 3-1. 표가 화면보다 넓으면 표만 가로로 스크롤
    <div className="grid-scroll">
      {/* 5-3. CSS Grid로 표 그리기 (6일차 3-2. 칸 최소 너비 56px) */}
      <div
        style={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: `48px repeat(${dates.length}, minmax(56px, 1fr))`,
        }}
      >
        {/* 맨 윗줄: 왼쪽 빈칸 + 날짜 머리글 */}
        <span />
        {dates.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: 13 }}>
            {formatDate(d)}
          </div>
        ))}

        {/* 시각마다 한 줄: 시각 글자 + 날짜 수만큼 칸 */}
        {times.map((t) => (
          <Fragment key={t}>
            <div style={{ fontSize: 12, textAlign: 'right', paddingRight: 4, alignSelf: 'center' }}>
              {t}
            </div>
            {dates.map((d) => {
              const slot = `${d}_${t}` // "2026-10-13_19:30"
              const on = selected.includes(slot)
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onToggle(slot)}
                  style={{
                    height: 40, // 6일차 3-3. 손가락으로 누르기 좋게 40px
                    border: '1px solid var(--line)', // 6일차 4-2. 색은 변수로
                    borderRadius: 6,
                    background: on ? 'var(--main)' : '#fff',
                    cursor: 'pointer',
                  }}
                />
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default TimeGrid