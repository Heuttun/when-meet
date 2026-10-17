import { describe, it, expect } from 'vitest'
import { bestRanges } from './bestSlots'

describe('bestRanges', () => {
  it('아무도 안 골랐으면 빈 목록', () => {
    expect(bestRanges({})).toEqual([])
  })

  it('이어지는 칸은 하나의 구간으로 묶는다', () => {
    const counts = { '2026-10-13_19:00': 3, '2026-10-13_19:30': 3, '2026-10-13_20:00': 1 }
    expect(bestRanges(counts)).toEqual([
      { date: '2026-10-13', start: '19:00', end: '20:00', count: 3 },
    ])
  })

  it('동점이 떨어져 있으면 날짜·시각이 빠른 순으로 따로', () => {
    const counts = { '2026-10-14_18:00': 2, '2026-10-13_21:30': 2, '2026-10-13_19:00': 1 }
    expect(bestRanges(counts)).toEqual([
      { date: '2026-10-13', start: '21:30', end: '22:00', count: 2 },
      { date: '2026-10-14', start: '18:00', end: '18:30', count: 2 },
    ])
  })

  it('날짜가 바뀌면 이어 붙이지 않는다', () => {
    const counts = { '2026-10-13_23:30': 1, '2026-10-14_00:00': 1 }
    expect(bestRanges(counts)).toHaveLength(2)
  })

  it('구간은 최대 3개', () => {
    const counts = {
      '2026-10-13_09:00': 1,
      '2026-10-13_11:00': 1,
      '2026-10-13_13:00': 1,
      '2026-10-13_15:00': 1,
    }
    expect(bestRanges(counts)).toHaveLength(3)
  })
})