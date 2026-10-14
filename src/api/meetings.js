// 담당: B — Day 2~5
// A가 화면에서 호출하는 데이터 함수 모음. 할 일 목록: docs/checklist-B-data.md
import { supabase } from '../lib/supabase'

// Day 2: 모임 저장 후 id 반환
export async function createMeeting({ title, dates, startHour, endHour }) {
  const { data, error } = await supabase
    .from('meetings')
    .insert({ title, dates, start_hour: startHour, end_hour: endHour })
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

// Day 2: 모임 정보 반환, 없으면 null
export async function getMeeting(id) {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) {
    if (error.code === '22P02') return null // id 모양이 아예 틀림 (예: "test")
    throw error
  }
  if (!data) return null
  return {
    id: data.id,
    title: data.title,
    dates: data.dates,
    startHour: data.start_hour,
    endHour: data.end_hour,
  }
}

// Day 3: 참여자 이름과 선택한 칸 저장 (같은 이름이면 덮어쓰기)
export async function saveAvailability(meetingId, name, slots) {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('이름이 비어 있어요')

  const { error } = await supabase
    .from('participants')
    .upsert(
      { meeting_id: meetingId, name: trimmed, slots },
      { onConflict: 'meeting_id,name' } // 같은 모임 + 같은 이름이면 덮어쓰기
    )
  if (error) throw error
}

// Day 4: 참여자 목록 [{ name, slots }] 반환
export async function getParticipants(meetingId) {
  const { data, error } = await supabase
    .from('participants')
    .select('name, slots') // 필요한 칸만
    .eq('meeting_id', meetingId) // 이 모임 사람만
    .order('created_at') // 먼저 입력한 사람부터
  if (error) throw error
  return data // 아무도 없으면 []
}

// Day 5: 다시 들어온 사람의 기존 선택 반환, 없으면 []
export async function getMyAvailability(meetingId, name) {
  const trimmed = name.trim()
  if (!trimmed) return [] // 빈 이름은 찾을 것도 없음

  const { data, error } = await supabase
    .from('participants')
    .select('slots')
    .eq('meeting_id', meetingId)
    .eq('name', trimmed) // 저장할 때처럼 공백 지운 이름으로
    .maybeSingle() // 한 줄 또는 없음
  if (error) throw error
  return data ? data.slots : [] // 없으면 빈 목록
}
