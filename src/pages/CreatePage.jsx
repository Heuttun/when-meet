// 담당: A — Day 2
// 모임 만들기 화면: 제목, 후보 날짜, 시작·끝 시각을 입력하고 버튼을 누르면 /m/:id 로 이동
// 할 일 목록: docs/checklist-A-frontend.md 의 "Day 2"

import { useState } from 'react'

// ★ 새로 추가: "2026-10-13" → "10/13 (화)"
function formatDate(d) {
  const day = new Date(d + 'T00:00')
  return `${day.getMonth() + 1}/${day.getDate()} (${'일월화수목금토'[day.getDay()]})`
}

function CreatePage() {
  const [title, setTitle] = useState('')
  const [dates, setDates] = useState([])        // ★ 추가된 날짜 목록 ["2026-10-13", ...]
  const [picked, setPicked] = useState('')      // ★ 날짜 입력칸에서 고른 날짜
  const [dateMsg, setDateMsg] = useState('')    // ★ 날짜 안내 문구

  // ★ 추가 버튼을 눌렀을 때
  function addDate() {
    const today = new Date().toLocaleDateString('sv-SE') // 오늘 "2026-10-11"
    if (!picked) return setDateMsg('날짜를 골라 주세요')
    if (picked < today) return setDateMsg('지난 날짜는 고를 수 없어요')
    if (dates.includes(picked)) return setDateMsg('이미 추가한 날짜예요')
    if (dates.length >= 7) return setDateMsg('날짜는 최대 7개까지예요')

    setDates([...dates, picked].sort()) // 새 배열을 만들어 날짜순 정렬
    setPicked('')
    setDateMsg('')
  }

  return (
    <main>
      <h1>언제모여</h1>
      <h2>모임 만들기</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="예: 스터디 보충 모임"
      />

      {/* ★ 후보 날짜 */}
      <div>
        <input type="date" value={picked} onChange={(e) => setPicked(e.target.value)} />
        <button type="button" onClick={addDate}>추가</button>
      </div>
      {dateMsg && <p>{dateMsg}</p>}

      {/* ★ 추가된 날짜 칩 + ✕ 삭제 */}
      <div>
        {dates.map((d) => (
          <span key={d}>
            {formatDate(d)}
            <button type="button" onClick={() => setDates(dates.filter((x) => x !== d))}>✕</button>
          </span>
        ))}
      </div>
    </main>
  )
}

export default CreatePage