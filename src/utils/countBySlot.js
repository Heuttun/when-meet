// 담당: B — Day 4
// 참여자 목록을 받아 칸별 가능 인원 수를 반환합니다.
// 예: [{ name: '철수', slots: ['2026-10-12_09:30'] }] → { '2026-10-12_09:30': 1 }

export function countBySlot(participants) {
  const counts = {}
  for (const p of participants) {
    for (const slot of p.slots) {
      counts[slot] = (counts[slot] || 0) + 1 // 처음 보는 칸은 0에서 시작
    }
  }
  return counts
}

// 칸별 가능한 사람 이름 목록 (6일차 F-09 "가능한 사람 보기"용)
// 예: { '2026-10-12_09:30': ['철수', '영희'] }
export function namesBySlot(participants) {
  const names = {}
  for (const p of participants) {
    for (const slot of p.slots) {
      if (!names[slot]) names[slot] = []
      names[slot].push(p.name)
    }
  }
  return names
}