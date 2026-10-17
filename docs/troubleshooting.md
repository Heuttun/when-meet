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

   ## B (데이터·배포) 4~5일차

| 문제 | 원인 | 해결 |
|---|---|---|
| `npm test`가 끝나지 않음 | vitest 기본은 파일을 계속 지켜보는 감시 모드 | 한 번만 돌릴 땐 `npx vitest run`, 감시 모드는 `q`로 종료 |
| push했는데 PR에 "비교할 게 없음" | `git add`·`commit` 없이 push함 | `git status`로 초록색(담김) 확인 → commit 메시지에 `1 file changed` 확인 후 push |
| PR을 Merge해도 이슈가 안 닫힘 | 템플릿의 `Closes #번호`를 숫자로 안 바꿈 | PR 본문 Edit로 `Closes #22` 수정. 리뷰어가 발견 |
| 이슈 양식 이름·라벨이 안 먹을 수 있음 | `bug.md` 붙여넣을 때 줄 앞에 공백 3칸 | 1번 줄이 `---`로 시작하도록 공백 제거 (front matter는 맨 앞 칸에서 시작해야 함) |
| A의 Vercel Preview 링크가 안 열림 | Preview는 프로젝트 주인 계정만 볼 수 있음 | `git checkout feat/...`로 상대 브랜치를 받아 로컬(`npm run dev`)에서 테스트 |
| `/m/test`에서 콘솔에 `22P02` 에러 객체 | `getParticipants`가 uuid가 아닌 id 에러를 그대로 던짐 | 데이터 점검 중 발견 → 이슈 #26 → `22P02`면 `[]` 반환으로 수정 (PR #27) |
| 커밋 메시지에 `22ㅖ02aus` 오타 | 한/영 전환 실수 | PR 제목은 직접 수정. 명령어는 복사-붙여넣기 권장 |