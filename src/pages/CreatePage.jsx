// 담당: A — Day 2
// 모임 만들기 화면: 제목, 후보 날짜, 시작·끝 시각을 입력하고 버튼을 누르면 /m/:id 로 이동
// 할 일 목록: docs/checklist-A-frontend.md 의 "Day 2"

import {useState} from 'react'

function CreatePage() {
  const [title, setTtitle] = useState('')

  return (
    <main>
      <h1>언제모여</h1>
      <h2>모임 만들기</h2>

      <input value={title} onChang={(e) => setTtitle(e.target.value)}
      placeholder="예: 보충 모임" />

      <p>{title}</p>

    </main>
  )
}

export default CreatePage
