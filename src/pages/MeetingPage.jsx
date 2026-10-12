// 담당: A — Day 3~5
// 모임 페이지: 내 시간 선택(TimeGrid) + 모두의 결과(ResultGrid)
// 할 일 목록: docs/checklist-A-frontend.md 의 "Day 3" ~ "Day 5"

// 4-1. 필요한 도구 가져오기
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
// 7-4. B의 저장 함수도 같이 가져오기
import { getMeeting, saveAvailability } from '../api/meetings'
import { formatDate, formatHour } from '../utils/format'
// 5-5. 시간표 컴포넌트 가져오기
import TimeGrid from '../components/TimeGrid'

function MeetingPage() {
  // 4-2. 주소 /m/:id 에서 id 꺼내기
  const { id } = useParams()

  // 4-2. 상태 만들기: undefined = 불러오는 중, null = 없는 모임
  const [meeting, setMeeting] = useState(undefined)
  const [loadError, setLoadError] = useState(false)

  // 6-1. 이름과 고른 칸 상태 만들기
  const [name, setName] = useState('')
  const [selected, setSelected] = useState([]) // ["2026-10-13_19:00", ...]

  // 6-2. 칸 누르기: 이미 골랐으면 빼고, 아니면 넣기
  function toggleSlot(slot) {
    if (selected.includes(slot)) {
      setSelected(selected.filter((s) => s !== slot))
    } else {
      setSelected([...selected, slot])
    }
  }

  // 7-1. 저장 중인지, 저장 결과 문구 상태 만들기
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [saveOk, setSaveOk] = useState(false) // 성공이면 검정, 실패면 빨강

  // 7-4. 저장 버튼: B의 saveAvailability로 이름과 고른 칸 저장
  async function handleSave() {
    setSaving(true)
    setSaveMsg('')
    try {
      await saveAvailability(id, name.trim(), selected)
      setSaveOk(true)
      setSaveMsg('저장됐어요')
    } catch (e) {
      console.error(e)
      setSaveOk(false)
      setSaveMsg('저장하지 못했어요. 다시 시도해 주세요')
    } finally {
      setSaving(false)
    }
  }

  // 4-3. 화면이 뜨면(그리고 id가 바뀌면) 모임 불러오기
  useEffect(() => {
    getMeeting(id)
      .then((m) => setMeeting(m))
      .catch((e) => {
        console.error(e)
        setLoadError(true)
      })
  }, [id])

  // 4-4. return 앞에서 상태별로 먼저 돌려보내기
  if (loadError) return <p>모임을 불러오지 못했어요. 새로고침해 주세요</p>
  if (meeting === undefined) return <p>불러오는 중...</p>
  if (meeting === null)
    return (
      <main>
        <p>존재하지 않는 모임이에요</p>
        <Link to="/">새 모임 만들기</Link>
      </main>
    )

  // 4-5. 모임 정보 보여 주기: 첫 날짜 ~ 마지막 날짜 · 시작 ~ 끝 · 30분 단위
  const first = meeting.dates[0]
  const last = meeting.dates[meeting.dates.length - 1]
  const dateText = first === last ? formatDate(first) : `${formatDate(first)} ~ ${formatDate(last)}`

  return (
    <main>
      <h1>{meeting.title}</h1>
      <p>
        {dateText} · {formatHour(meeting.startHour)} ~ {formatHour(meeting.endHour)} · 30분 단위
      </p>

      {/* 6-3. 이름 입력칸 (최대 10자) */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름 (최대 10자)"
        maxLength={10}
      />

      {/* 6-3. 안내 문구 */}
      <p>되는 칸을 눌러 칠하세요</p>

      {/* 6-3. 시간표: 진짜 상태를 넘겨요 */}
      <TimeGrid
        dates={meeting.dates}
        startHour={meeting.startHour}
        endHour={meeting.endHour}
        selected={selected}
        onToggle={toggleSlot}
      />

      {/* 7-2. 저장 버튼: 이름이 비었거나 저장 중이면 막기 */}
      <button type="button" onClick={handleSave} disabled={!name.trim() || saving}>
        {saving ? '저장 중...' : '저장'}
      </button>

      {/* 7-4. 저장 결과 문구: 성공은 검정, 실패는 빨강 */}
      {saveMsg && (
        <p
          style={{
            background: saveOk ? '#111827' : '#dc2626',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          {saveMsg}
        </p>
      )}
    </main>
  )
}

export default MeetingPage