// 담당: A — Day 3~5
// 모임 페이지: 내 시간 선택(TimeGrid) + 모두의 결과(ResultGrid)
// 할 일 목록: docs/checklist-A-frontend.md 의 "Day 3" ~ "Day 5"

// 4-1. 필요한 도구 가져오기
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMeeting } from '../api/meetings'
import { formatDate, formatHour } from '../utils/format'

function MeetingPage() {
  // 4-2. 주소 /m/:id 에서 id 꺼내기
  const { id } = useParams()

  // 4-2. 상태 만들기: undefined = 불러오는 중, null = 없는 모임
  const [meeting, setMeeting] = useState(undefined)
  const [loadError, setLoadError] = useState(false)

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
      {/* 5번 단계: 여기에 시간표(TimeGrid)를 붙일 거예요 */}
    </main>
  )
}

export default MeetingPage