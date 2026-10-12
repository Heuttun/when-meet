// 담당: A — Day 2
// 모임 만들기 화면: 제목, 후보 날짜, 시작·끝 시각을 입력하고 버튼을 누르면 /m/:id 로 이동
// 할 일 목록: docs/checklist-A-frontend.md 의 "Day 2"

// 3-1. useState 가져오기 (화면이 값을 기억하게 해 주는 도구)
import { useState } from 'react'
// 6-4. 페이지 이동 도구 가져오기
import { useNavigate } from 'react-router-dom'
// 7-3. B가 만든 모임 저장 함수 가져오기
import { createMeeting } from '../api/meetings'
// 3일차. 날짜·시각 모양 함수 가져오기 (src/utils/format.js로 옮김)
import { formatDate, formatHour } from '../utils/format'

// 6-3. 오류 문구를 빨간 글씨로 보여 줄 모양
const errorStyle = { color: '#dc2626', fontSize: 13, margin: '4px 0' }

function CreatePage() {
  // 6-4. 페이지 이동 도구 준비
  const navigate = useNavigate()

  // 3-2. 제목 상태 만들기
  const [title, setTitle] = useState('')

  // 4-1. 날짜 목록 상태와 "고르는 중인 날짜" 상태 만들기 (+ 날짜 안내 문구)
  const [dates, setDates] = useState([])      // ["2026-10-13", ...]
  const [picked, setPicked] = useState('')    // <input type="date"> 값
  const [dateMsg, setDateMsg] = useState('')  // 날짜 안내 문구

  // 5-1. 시작·끝 시각 상태 만들기 (기본값 9시, 22시)
  const [startHour, setStartHour] = useState(9)
  const [endHour, setEndHour] = useState(22)

  // 6-1. 오류 메시지 상태 만들기
  const [errors, setErrors] = useState({})

  // 6-5. 저장 중 상태 만들기
  const [saving, setSaving] = useState(false)

  // 4-3. 추가 버튼: 비었거나, 오늘 이전이거나, 이미 있거나, 7개면 안내만 하고 멈추기
  function addDate() {
    const today = new Date().toLocaleDateString('sv-SE') // "2026-10-11"
    if (!picked) return setDateMsg('날짜를 골라 주세요')
    if (picked < today) return setDateMsg('지난 날짜는 고를 수 없어요')
    if (dates.includes(picked)) return setDateMsg('이미 추가한 날짜예요')
    if (dates.length >= 7) return setDateMsg('날짜는 최대 7개까지예요')
    setDates([...dates, picked].sort()) // 새 목록을 만들어 날짜순 정렬
    setPicked('')
    setDateMsg('')
  }

  // 6-2. 만들기 버튼: 규칙을 검사해서 오류를 모으고, 하나라도 있으면 멈추기
  async function handleCreate() {
    const next = {}
    if (!title.trim()) next.title = '모임 제목을 입력해 주세요'
    else if (title.trim().length > 30) next.title = '30자 이내로 입력해 주세요'
    if (dates.length === 0) next.dates = '날짜를 하나 이상 추가해 주세요'
    if (startHour >= endHour) next.time = '끝 시각은 시작 시각보다 늦어야 해요'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    // 6-5. 저장 중에는 버튼 막기
    setSaving(true)
    try {
      // 7-3. 진짜 저장: B의 createMeeting으로 저장하고 받은 id로 이동
      const id = await createMeeting({ title: title.trim(), dates, startHour, endHour })
      navigate('/m/' + id)
    } catch (e) {
      // 7-3. 저장 실패 안내
      console.error(e)
      setErrors({ save: '모임을 만들지 못했어요. 다시 시도해 주세요' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <main>
      <h1>언제모여</h1>
      <h2>모임 만들기</h2>

      {/* 3-2. 제목 입력칸 */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="예: 스터디 보충 모임"
      />
      {/* 6-3. 제목 오류 */}
      {errors.title && <p style={errorStyle}>{errors.title}</p>}

      {/* 4-2. 날짜 입력칸과 추가 버튼 */}
      <div>
        <input type="date" value={picked} onChange={(e) => setPicked(e.target.value)} />
        <button type="button" onClick={addDate}>추가</button>
      </div>
      {/* 4-3. 날짜 안내 문구 */}
      {dateMsg && <p>{dateMsg}</p>}

      {/* 4-4. 추가된 날짜를 칩으로 보여 주고 ✕로 지우기 */}
      <div>
        {dates.map((d) => (
          <span key={d}>
            {formatDate(d)}
            <button type="button" onClick={() => setDates(dates.filter((x) => x !== d))}>✕</button>
          </span>
        ))}
      </div>
      {/* 6-3. 날짜 오류 */}
      {errors.dates && <p style={errorStyle}>{errors.dates}</p>}

      {/* 5-2. 시작 시각(0~23시)·끝 시각(1~24시) 선택 */}
      <div>
        {/* 5-3. Number(...)로 글자 "9"를 숫자 9로 바꾸기 */}
        <select value={startHour} onChange={(e) => setStartHour(Number(e.target.value))}>
          {Array.from({ length: 24 }, (_, h) => (
            <option key={h} value={h}>{formatHour(h)}</option>
          ))}
        </select>
        <span> 부터 </span>
        <select value={endHour} onChange={(e) => setEndHour(Number(e.target.value))}>
          {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
            <option key={h} value={h}>{formatHour(h)}</option>
          ))}
        </select>
        <span> 까지</span>
      </div>
      {/* 6-3. 시간 오류 */}
      {errors.time && <p style={errorStyle}>{errors.time}</p>}

      {/* 6-3. 저장 실패 오류 (7단계에서 사용) */}
      {errors.save && <p style={errorStyle}>{errors.save}</p>}

      {/* 6-5. 만들기 버튼: 저장 중에는 막고 글자 바꾸기 */}
      <button type="button" onClick={handleCreate} disabled={saving}>
        {saving ? '만드는 중...' : '모임 만들기'}
      </button>
    </main>
  )
}

export default CreatePage