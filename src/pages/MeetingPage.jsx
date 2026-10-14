// 담당: A — Day 3~5
// 모임 페이지: 내 시간 선택(TimeGrid) + 모두의 결과(ResultGrid)
// 할 일 목록: docs/checklist-A-frontend.md 의 "Day 3" ~ "Day 5"

// 4-1. 필요한 도구 가져오기
import { useEffect, useState } from 'react'
// 5일차 5-2. useLocation 추가 (어떻게 들어왔는지 쪽지 읽기)
import { useParams, Link, useLocation } from 'react-router-dom'
// 7-4. B의 저장 함수 + 4일차 6-1. 참여자 불러오기 + 5일차 6-1. 예전 칸 불러오기 함수
import { getMeeting, saveAvailability, getParticipants, getMyAvailability } from '../api/meetings'
// 4일차 6-1. 칸별 인원 세기 함수 가져오기 (B)
import { countBySlot } from '../utils/countBySlot'
import { formatDate, formatHour } from '../utils/format'
// 5-5. 시간표 컴포넌트 가져오기
import TimeGrid from '../components/TimeGrid'
// 4일차 5-5. 결과 표 컴포넌트 가져오기
import ResultGrid from '../components/ResultGrid'

function MeetingPage() {
  // 4-2. 주소 /m/:id 에서 id 꺼내기
  const { id } = useParams()

  // 4-2. 상태 만들기: undefined = 불러오는 중, null = 없는 모임
  const [meeting, setMeeting] = useState(undefined)
  const [loadError, setLoadError] = useState(false)

  // 5일차 5-2. 방금 만든 모임인지 쪽지 읽기 (링크로 들어오면 쪽지가 없음)
  const location = useLocation()
  const justCreated = location.state?.justCreated === true

  // 5일차 4-1. 링크 복사 결과 문구
  const [copyMsg, setCopyMsg] = useState('')

  // 5일차 4-2. 링크 복사: 지금 주소를 클립보드에 넣고, 2초 뒤 문구 지우기
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopyMsg('복사됐어요!')
    } catch (e) {
      console.error(e)
      setCopyMsg('복사하지 못했어요. 주소창의 주소를 복사해 주세요')
    }
    setTimeout(() => setCopyMsg(''), 2000)
  }

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

  // 5일차 6-2. 다시 들어온 사람: 불러왔다는 안내 문구
  const [loadedMsg, setLoadedMsg] = useState('')

  // 5일차 6-3. 이름칸에서 나가면(onBlur) 그 이름으로 예전에 고른 칸 불러오기
  async function loadMySlots() {
    const trimmed = name.trim()
    if (!trimmed) return
    try {
      const mine = await getMyAvailability(id, trimmed)
      if (mine.length > 0) {
        setSelected(mine)
        setLoadedMsg(`${trimmed}님이 전에 고른 칸을 불러왔어요. 고친 뒤 다시 저장하세요`)
      } else {
        setLoadedMsg('')
      }
    } catch (e) {
      console.error(e)
    }
  }

  // 4일차 6-2. 참여자 목록 상태 (처음엔 빈 목록)
  const [participants, setParticipants] = useState([])

  // 4일차 7-1. 참여자 다시 불러오기 (새로고침 버튼 · 저장 직후에 사용)
  async function loadResults() {
    try {
      setParticipants(await getParticipants(id))
    } catch (e) {
      console.error(e)
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
      loadResults() // 4일차 7-3. 저장하면 결과도 다시 불러오기
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

    // 4일차 6-3. 참여자도 같이 불러오기
    getParticipants(id)
      .then((list) => setParticipants(list))
      .catch((e) => console.error(e))
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

  // 4일차 6-4. 칸별 인원 세기: { "2026-10-13_19:00": 3, ... }
  const counts = countBySlot(participants)

  return (
    <main>
      <h1>{meeting.title}</h1>
      <p>
        {dateText} · {formatHour(meeting.startHour)} ~ {formatHour(meeting.endHour)} · 30분 단위
      </p>

      {/* 5일차 5-3. 방금 만든 모임이면 안내 */}
      {justCreated && <p>모임을 만들었어요! 이 링크를 친구들에게 보내세요 👇</p>}

      {/* 5일차 4-3. 링크 복사 버튼 + 결과 문구 (2초 뒤 사라짐) */}
      <button type="button" onClick={copyLink}>
        링크 복사
      </button>
      {copyMsg && <p>{copyMsg}</p>}

      {/* 4일차 4-1. 두 부분 감싸기: 휴대폰은 위아래, PC는 나란히 (App.css) */}
      <div className="meeting-layout">
        {/* 4일차 4-1. 왼쪽(휴대폰은 위): 내 시간 고르기 */}
        <section>
          <h2>내 시간 고르기</h2>

          {/* 6-3. 이름 입력칸 (최대 10자) */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={loadMySlots} // 5일차 6-4. 이름칸에서 나갈 때 예전 칸 불러오기
            placeholder="이름 (최대 10자)"
            maxLength={10}
          />

          {/* 5일차 6-5. 예전 칸을 불러왔다는 안내 */}
          {loadedMsg && <p>{loadedMsg}</p>}

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
        </section>

        {/* 4일차 4-1. 오른쪽(휴대폰은 아래): 모두의 결과 */}
        <section>
          <h2>모두의 결과</h2>

          {/* 4일차 7-2. 새로고침 버튼: 다른 사람이 새로 저장한 결과 불러오기 */}
          <button type="button" onClick={loadResults}>
            새로고침
          </button>

          {/* 4일차 6-5. 참여자 목록: 0명이면 안내 문구 */}
          {participants.length === 0 ? (
            <p>아직 아무도 입력하지 않았어요</p>
          ) : (
            <p>
              참여자 {participants.length}명: {participants.map((p) => p.name).join(', ')}
            </p>
          )}

          {/* 4일차 6-6. 결과 표: 이제 진짜 값 */}
          <ResultGrid
            dates={meeting.dates}
            startHour={meeting.startHour}
            endHour={meeting.endHour}
            counts={counts}
            total={participants.length}
          />
        </section>
      </div>
    </main>
  )
}

export default MeetingPage