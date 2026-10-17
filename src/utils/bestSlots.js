// 담당: B — Day 6
// 칸별 인원(countBySlot 결과)에서 가장 많이 겹치는 시간을 "구간"으로 묶어 돌려줍니다.
// 예: { '2026-10-13_19:00': 4, '2026-10-13_19:30': 4 }
//  → [{ date: '2026-10-13', start: '19:00', end: '20:00', count: 4 }]

// "19:30" → "20:00" (30분 뒤)
function addHalfHour(time) {
    const [h, m] = time.split(':').map(Number)
    const total = h * 60 + m + 30
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

export function bestRanges(counts, limit = 3) {
    const values = Object.values(counts)
    if (values.length === 0) return [] // 아무도 안골랐으면 추천 없음
    const max = Math.max(...values)

    // 1. 가장 많은 인원인 칸만 골라 날짜·시각 순으로 정렬 (글자 정렬 = 시간 순서)
    const top = Object.keys(counts)
    .filter((slot) => counts[slot] === max)
    .sort()

    // 2. 같은 날짜에서 30분씩 이어지는 칸은 하나의 구간으로 묶기
    const ranges = []
    for (const slot of top) {
        const [date, time] = slot.split('_')
        const last = ranges[ranges.length - 1]
        if (last && last.date === date && last.end === time) {
            last.end = addHalfHour(time) // 앞 구간에 이어 붙이기
        } else {
            ranges.push({ date, start: time, end: addHalfHour(time), count: max })
        }
    }

    // 3. 최대 limit개 (날짜·시각이 빠른 순)
    return ranges.slice(0, limit)
}