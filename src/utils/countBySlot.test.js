import { describe, it, expect } from 'vitest'
import { countBySlot, namesBySlot } from './countBySlot'

describe('countBySlot', () => {
  it('참여자가 0명이면 빈 객체를 반환한다', () => {
    expect(countBySlot([])).toEqual({})
  })

  it('1명이면 고른 칸마다 1이다', () => {
    const people = [{ name: '철수', slots: ['2026-10-13_19:00', '2026-10-13_19:30'] }]
    expect(countBySlot(people)).toEqual({ '2026-10-13_19:00': 1, '2026-10-13_19:30': 1 })
  })

  it('3명이 겹치면 겹친 만큼 센다', () => {
    const people = [
      { name: '철수', slots: ['2026-10-13_19:00', '2026-10-13_19:30'] },
      { name: '영희', slots: ['2026-10-13_19:00'] },
      { name: '민수', slots: ['2026-10-13_19:00', '2026-10-14_18:00'] },
    ]
    expect(countBySlot(people)).toEqual({
      '2026-10-13_19:00': 3,
      '2026-10-13_19:30': 1,
      '2026-10-14_18:00': 1,
    })
  })

  it('칸을 하나도 안 고른 사람은 세지 않는다', () => {
    expect(countBySlot([{ name: '영희', slots: [] }])).toEqual({})
  })
})

describe('namesBySlot', () => {
  it('칸마다 가능한 사람 이름을 입력 순서대로 모은다', () => {
    const people = [
      { name: '철수', slots: ['2026-10-13_19:00'] },
      { name: '영희', slots: ['2026-10-13_19:00', '2026-10-13_19:30'] },
    ]
    expect(namesBySlot(people)).toEqual({
      '2026-10-13_19:00': ['철수', '영희'],
      '2026-10-13_19:30': ['영희'],
    })
  })
})