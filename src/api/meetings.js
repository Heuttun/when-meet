// 담당: B — Day 2~5
// A가 화면에서 호출하는 데이터 함수 모음. 할 일 목록: docs/checklist-B-data.md
import { supabase } from '../lib/supabase'

// Day 2: 모임 저장 후 id 반환
export async function createMeeting({ title, dates, startHour, endHour }) {
  throw new Error('TODO: createMeeting')
}

// Day 2: 모임 정보 반환, 없으면 null
export async function getMeeting(id) {
  throw new Error('TODO: getMeeting')
}

// Day 3: 참여자 이름과 선택한 칸 저장 (같은 이름이면 덮어쓰기)
export async function saveAvailability(meetingId, name, slots) {
  throw new Error('TODO: saveAvailability')
}

// Day 4: 참여자 목록 [{ name, slots }] 반환
export async function getParticipants(meetingId) {
  throw new Error('TODO: getParticipants')
}

// Day 5: 다시 들어온 사람의 기존 선택 반환, 없으면 []
export async function getMyAvailability(meetingId, name) {
  throw new Error('TODO: getMyAvailability')
}
