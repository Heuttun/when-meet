# 트러블슈팅 메모

막힌 문제를 3줄로 적어두세요: 문제 → 원인 → 해결
   ## B (데이터·배포) 1~2일차

   | 문제 | 원인 | 해결 |
   |---|---|---|
   | VS Code 터미널이 안 켜짐 ("untrusted workspace") | Restricted Mode(폴더 신뢰 안 함) | Manage Workspace Trust → Trust |
   | Supabase URL을 브라우저로 열면 `requested path is invalid` | 사람용 웹페이지가 아니라 API 주소 | 정상. `.env.local`에만 넣으면 됨 |
   | 크롬 콘솔에 코드 붙여넣기가 막힘 | 크롬 보안 경고 | `allow pasting` 직접 입력 후 붙여넣기 |
   | `getMeeting('test')` 때 콘솔에 빨간 400 에러 | uuid 모양이 아닌 id → Supabase가 `22P02` 응답 | 함수에서 `22P02`를 잡아 `null` 반환. 콘솔 빨간 줄은 기록일 뿐 |
   | PR 설명엔 "저장됨"인데 실제로는 저장 안 됨 | 연결 커밋이 push되지 않은 채 Merge | 리뷰 때 Files changed에서 함수 호출을 직접 검색해 보기 |