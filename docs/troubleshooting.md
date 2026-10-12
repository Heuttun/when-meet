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
      ## B (데이터·배포) 3일차

   | 문제 | 원인 | 해결 |
   |---|---|---|
   | 같은 이름으로 다시 저장하면 줄이 늘어날까? | `upsert`는 `onConflict`에 적은 칸을 기준으로 "이미 있음"을 판단 | `onConflict: 'meeting_id,name'`을 DB unique 제약(`uniq_meeting_name`)과 똑같이 맞춤 → 한 줄만 남고 slots만 바뀜 |
   | `" 철수 "`와 `"철수"`가 다른 사람으로 저장될 수 있음 | 앞뒤 공백까지 다른 글자로 취급 | 저장 전에 `name.trim()` |
   | 없는 모임 id로 저장하면 `409` + `23503` 에러 | FK(외래 키)가 meetings에 없는 id를 거절 | 정상 동작. 잘못된 데이터를 DB가 막아 줌 |
   | 테스트 후 `main.jsx`를 `git restore`했는데 화면엔 테스트 코드가 남아 있음 | VS Code 탭에 저장 안 된 내용(●)이 남아 있었음 | 탭을 닫을 때 **Don't Save**. `Ctrl + S`를 누르면 다시 써지니 주의 |
   | 내 함수 파일이 상대 PR에도 들어 있음 | 상대가 main을 받기 전에 내 코드를 복사해서 작업 | 내용이 같으면 충돌 없음. 다음엔 `git pull origin main`으로 받아 오기 |