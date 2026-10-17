// 담당: A — Day 4 · 6
// 결과 히트맵: 가능한 인원이 많은 칸일수록 진하게 칠합니다.
// 데이터는 B의 getParticipants() · countBySlot() · namesBySlot() 를 사용합니다.

// 5-1. 필요한 도구 가져오기 (6일차 5-1. 고른 칸 기억용 useState 추가)
import { Fragment, useState } from 'react'
import { formatDate, makeTimes } from '../utils/format'

// 5-1. props: 날짜·시각 + 칸별 인원(counts) + 전체 인원(total) + 6일차 칸별 이름(names)
function ResultGrid({ dates, startHour, endHour, counts, total, names = {} }) {
  const times = makeTimes(startHour, endHour)

  // 6일차 5-1. 누른(또는 마우스를 올린) 칸 기억하기
  const [picked, setPicked] = useState('')

  return (
    <div>
      {/* 6일차 3-1. 표가 화면보다 넓으면 표만 가로로 스크롤 */}
      <div className="grid-scroll">
        {/* 5-2. 표 뼈대: TimeGrid와 똑같은 CSS Grid (6일차 3-2. 칸 최소 너비 56px) */}
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

          {/* 시각마다 한 줄: 시각 글자 + 날짜 수만큼 결과 칸 */}
          {times.map((t) => (
            <Fragment key={t}>
              <div style={{ fontSize: 12, textAlign: 'right', paddingRight: 4, alignSelf: 'center' }}>
                {t}
              </div>
              {dates.map((d) => {
                // 5-2. 이 칸의 인원 수와 비율 계산
                const slot = `${d}_${t}` // "2026-10-13_19:30"
                const n = counts[slot] || 0 // 없으면 0명
                const ratio = total > 0 ? n / total : 0 // 0으로 나누기 막기
                const all = total > 0 && n === total // 전원 가능

                // 5-3. 비율만큼 진하게 칠하고, 칸 안에 숫자 쓰기
                // 6일차 5-2. 칸을 버튼으로: 누르거나(휴대폰) 마우스를 올리면(PC) picked로
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setPicked(slot)}
                    onMouseEnter={() => setPicked(slot)}
                    style={{
                      height: 40, // 6일차 3-3. 손가락으로 누르기 좋게 40px
                      borderRadius: 6,
                      fontSize: 13,
                      background: n === 0 ? '#fff' : `rgba(37, 99, 235, ${ratio})`,
                      color: ratio > 0.5 ? '#fff' : 'var(--ink)',
                      border: all ? '2px solid var(--ink)' : '1px solid var(--line)',
                      outline: picked === slot ? '2px solid #f59e0b' : 'none', // 고른 칸은 주황 테두리
                    }}
                  >
                    {n > 0 ? n : ''}
                  </button>
                )
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {/* 5-4. 범례: 0명(흰색) ~ N명(가장 진한 파랑) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 12 }}>
        <span>0명</span>
        <div
          style={{
            flex: 1,
            height: 10,
            borderRadius: 5,
            border: '1px solid var(--line)',
            background: 'linear-gradient(to right, #fff, rgb(37, 99, 235))',
          }}
        />
        <span>{total}명</span>
      </div>

      {/* 6일차 5-3. 고른 칸의 "날짜 시각 · N명 / 이름들" */}
      {picked && (
        <p className="picked-info">
          {formatDate(picked.split('_')[0])} {picked.split('_')[1]} · {counts[picked] || 0}명
          {(names[picked] || []).length > 0 && <> / {names[picked].join(', ')}</>}
        </p>
      )}
    </div>
  )
}

export default ResultGrid