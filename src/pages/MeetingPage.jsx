// 담당: A — Day 3~5
// 모임 페이지: 내 시간 선택(TimeGrid) + 모두의 결과(ResultGrid)
// 할 일 목록: docs/checklist-A-frontend.md 의 "Day 3" ~ "Day 5"
import { useParams } from 'react-router-dom'

function MeetingPage() {
  const { id } = useParams()

  return (
    <main>
      <h1>언제모여</h1>
      <h2>모임 페이지</h2>
      <p>모임 id: {id}</p>
    </main>
  )
}

export default MeetingPage
