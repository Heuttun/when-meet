// 담당: A — Day 4
// 결과 히트맵: 가능한 인원이 많은 칸일수록 진하게 칠합니다.
// 데이터는 B의 getParticipants() 와 countBySlot() 를 사용합니다.

// 5-1. 필요한 도구 가져오기 (TimeGrid와 같음)
import { Fragment } from 'react'
import { formatDate, makeTimes } from '../utils/format'

// 5-1. props: 날짜·시각 + 칸별 인원 수(counts) + 전체 인원(total)
function ResultGrid({ dates, startHour, endHour, counts, total }) {
  const times = makeTimes(startHour, endHour)

  return (
    <div>
      {/* 5-2. 표 뼈대: TimeGrid와 똑같은 CSS Grid */}
      <div
        style={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: `48px repeat(${dates.length}, 1fr)`,
        }}
      >
        {/* 맨 윗줄: 왼쪽 빈칸 + 날짜 머리글 */}
        <span />
        {dates.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: 13 }}>
            {formatDate(d)}
          </div>
        ))}

        {/* 시각마다 한 줄: 시각 글자 + 날짜 수만큼 결과 칸 */}
        {times.map((t) => (
          <Fragment key={t}>
            <div style={{ fontSize: 12, textAlign: 'right', paddingRight: 4 }}>{t}</div>
            {dates.map((d) => {
              // 5-2. 이 칸의 인원 수와 비율 계산
              const slot = `${d}_${t}` // "2026-10-13_19:30"
              const n = counts[slot] || 0 // 없으면 0명
              const ratio = total > 0 ? n / total : 0 // 0으로 나누기 막기
              const all = total > 0 && n === total // 전원 가능

              // 5-3. 비율만큼 진하게 칠하고, 칸 안에 숫자 쓰기
              return (
                <div
                  key={slot}
                  style={{
                    height: 30,
                    borderRadius: 4,
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: n === 0 ? '#fff' : `rgba(37, 99, 235, ${ratio})`,
                    color: ratio > 0.5 ? '#fff' : '#111827',
                    border: all ? '2px solid #111827' : '1px solid #d1d5db',
                  }}
                >
                  {n > 0 ? n : ''}
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>

      {/* 5-4. 범례: 0명(흰색) ~ N명(가장 진한 파랑) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 12 }}>
        <span>0명</span>
        <div
          style={{
            flex: 1,
            height: 10,
            borderRadius: 5,
            border: '1px solid #d1d5db',
            background: 'linear-gradient(to right, #fff, rgb(37, 99, 235))',
          }}
        />
        <span>{total}명</span>
      </div>
    </div>
  )
}

export default ResultGrid