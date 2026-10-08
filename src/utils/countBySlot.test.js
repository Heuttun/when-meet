import { describe, it, expect } from 'vitest'
import { countBySlot } from './countBySlot'

describe('countBySlot', () => {
  it('참여자가 0명이면 빈 객체를 반환한다', () => {
    expect(countBySlot([])).toEqual({})
  })

  // TODO (B, Day 4): 1명 / 겹치는 3명 테스트 추가
})
