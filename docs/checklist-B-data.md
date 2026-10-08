# 언제모여 — B(데이터·배포 담당) 할 일 체크리스트

## 이 문서 사용법

B는 데이터 저장·불러오기, 배포, 레포 관리, README를 맡습니다. A가 화면에서 부를 수 있게 함수를 만들어 주는 것이 핵심 역할입니다.

- 위에서부터 순서대로 체크하세요.
- 함수 하나를 완성할 때마다 바로 A에게 "`createMeeting` 준비됐어, 이렇게 쓰면 돼"라고 알려주세요. A는 그 전까지 가짜 데이터로 작업합니다.
- 30분 이상 막히면 바로 A에게 말하거나 검색·AI에 물어보세요.

**A에게 만들어 줄 함수 목록** (DB를 쓰는 함수는 `src/api/meetings.js`, `countBySlot`처럼 계산만 하는 함수는 `src/utils`에)

| 함수 | 하는 일 | 완성일 |
| --- | --- | --- |
| `createMeeting({ title, dates, startHour, endHour })` | 모임 저장 후 id 반환 | Day 2 |
| `getMeeting(id)` | 모임 정보 반환, 없으면 null | Day 2 |
| `saveAvailability(meetingId, name, slots)` | 참여자 이름과 선택한 칸 저장 | Day 3 |
| `getParticipants(meetingId)` | 참여자 목록 반환 | Day 4 |
| `countBySlot(participants)` | 칸별 가능 인원 수 계산 | Day 4 |
| `getMyAvailability(meetingId, name)` | 다시 들어온 사람의 기존 선택 반환 | Day 5 |

## 시작 전 준비 (Day 1 전날, 1시간)

- [ ] [Node.js](https://nodejs.org) LTS 버전 설치, 터미널에서 `node -v`, `npm -v` 확인
- [ ] [VS Code](https://code.visualstudio.com) 설치, 확장 Prettier 설치
- [ ] [Git](https://git-scm.com) 설치 후 `git --version` 확인
- [ ] `git config --global user.name "내이름"`, `git config --global user.email "깃허브이메일"` 입력
- [ ] GitHub 계정 준비, A의 GitHub 아이디 받아두기
- [ ] [Supabase](https://supabase.com) 가입 (GitHub 계정으로 로그인하면 편함)
- [ ] [Vercel](https://vercel.com) 가입 (GitHub 계정으로 로그인)
- [ ] Supabase 공식 문서의 "Use Supabase with React" 빠른 시작 페이지를 10분 정도 훑어보기

## Day 1 — 레포, DB 테이블, 첫 배포

목표: 레포에 A가 초대되어 있고, Supabase 테이블 2개가 있고, 빈 사이트가 인터넷 주소로 열리는 상태.

**오전: A와 함께 기획**

- [ ] A와 15분 회의: 서비스 이름, 화면 3개 확인
- [ ] 저장해야 할 정보 적어보기: 모임(제목, 날짜들, 시작·끝 시각), 참여자(이름, 선택한 칸)

**GitHub 레포**

- [ ] GitHub에서 New repository → 이름 `when-meet`(예시), Public, README 체크 없이 생성
- [ ] Settings → Collaborators → A의 아이디로 초대
- [ ] A에게 레포 주소 보내고 "Day 1 오후에 Vite 프로젝트 올려줘"라고 요청
- [ ] Issues 탭에서 라벨 만들기: `A-화면`, `B-데이터`, `bug`, `다음 개선`
- [ ] Issue 5개 등록 (Day 2~6 할 일 제목만, 담당자 지정) → 협업 기록의 시작

**Supabase 테이블**

- [ ] Supabase에서 New project 생성, 지역은 Northeast Asia (Seoul)
- [ ] DB 비밀번호는 비밀번호 관리자나 메모장에 저장 (레포에 절대 올리지 않기)
- [ ] Table Editor → New table → 이름 `meetings`
- [ ] `meetings` 컬럼: `id`(uuid, 기본값 `gen_random_uuid()`), `title`(text), `dates`(jsonb), `start_hour`(int2), `end_hour`(int2), `created_at`(기본 생성됨)
- [ ] New table → 이름 `participants`
- [ ] `participants` 컬럼: `id`(uuid), `meeting_id`(uuid, Foreign key → `meetings.id`), `name`(text), `slots`(jsonb, 기본값 `'[]'`), `created_at`
- [ ] SQL Editor에서 `meeting_id`+`name` 조합이 중복되지 않게 unique 제약 추가 (Day 3 덮어쓰기에 필요): `alter table participants add constraint uniq_meeting_name unique (meeting_id, name);`
- [ ] 두 테이블 모두 RLS(행 보안)가 켜져 있는지 확인
- [ ] Policies에서 두 테이블에 "누구나 select, insert 가능" 정책 추가, `participants`에는 update도 허용 (로그인 없는 서비스라서)
- [ ] Table Editor에서 직접 행 하나를 입력해 보고 저장되는지 확인 후 삭제

**Vercel 첫 배포 (A가 푸시한 뒤)**

- [ ] `git clone <레포주소>` 후 `npm install`, `npm run dev`로 로컬 실행 확인
- [ ] Vercel → Add New Project → GitHub 레포 선택 → Framework는 Vite로 자동 인식 → Deploy
- [ ] 배포 주소(`xxx.vercel.app`)에 들어가 "언제모여"가 보이는지 확인
- [ ] 레포에 `vercel.json` 추가해 `/m/abc` 같은 주소에서 새로고침해도 404가 안 나게 설정 (모든 경로를 `/index.html`로 rewrite) — 검색어: "vercel vite react router 404"
- [ ] 배포 주소를 A에게 공유하고 GitHub 레포 About란 Website에도 입력

## Day 2 — Supabase 연결, 모임 저장·불러오기

목표: `createMeeting`, `getMeeting` 두 함수가 동작하고 A에게 사용법이 전달된 상태.

**연결 준비**

- [ ] `git checkout main` → `git pull` → `git checkout -b feat/supabase-meeting`
- [ ] `npm install @supabase/supabase-js`
- [ ] Supabase → Project Settings → API에서 Project URL과 anon(public) key 복사
- [ ] 프로젝트 맨 위에 `.env.local` 파일 만들고 `VITE_SUPABASE_URL=...`, `VITE_SUPABASE_ANON_KEY=...` 입력
- [ ] `.gitignore`에 `.env.local`이 들어 있는지 확인 (없으면 추가) — 키를 GitHub에 올리지 않기
- [ ] `.env.example` 파일을 만들어 값 없이 변수 이름만 적기 (다른 사람이 보고 따라 할 수 있게, 이건 커밋함)
- [ ] A에게 `.env.local` 값을 카톡 등으로 따로 전달
- [ ] `src/lib/supabase.js`에 `createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)`로 클라이언트 만들어 export

**함수 만들기**

- [ ] `src/api/meetings.js` 파일 만들기
- [ ] `createMeeting({ title, dates, startHour, endHour })` 작성: `supabase.from('meetings').insert({...}).select('id').single()`
- [ ] 에러가 있으면 `throw error`, 성공하면 `data.id` 반환
- [ ] `getMeeting(id)` 작성: `supabase.from('meetings').select('*').eq('id', id).maybeSingle()`
- [ ] 없는 id면 `null` 반환하는지 확인
- [ ] DB 컬럼 이름(`start_hour`)과 화면 이름(`startHour`)이 다르니 반환할 때 화면용 이름으로 바꿔주기

**테스트**

- [ ] `App.jsx`에 임시 버튼을 만들어 `createMeeting` 호출 → 콘솔에 id 출력 확인
- [ ] Supabase Table Editor에서 행이 생겼는지 확인
- [ ] 그 id로 `getMeeting` 호출 → 콘솔에 모임 정보 출력 확인
- [ ] 임시 버튼 삭제
- [ ] 저장이 안 되면 브라우저 콘솔 에러 확인 → 대부분 RLS 정책 문제 (Day 1 정책 다시 확인)

**배포 설정과 전달**

- [ ] Vercel → 프로젝트 Settings → Environment Variables에 두 변수 똑같이 추가 → Redeploy
- [ ] 커밋 → 푸시 → PR → A에게 리뷰 요청 → Merge
- [ ] A에게 사용 예시 보내기: `const id = await createMeeting({ title, dates, startHour, endHour })`
- [ ] A의 PR 리뷰하기

## Day 3 — 참여자 시간 저장

목표: A의 시간표에서 저장 버튼을 누르면 이름과 선택한 칸이 DB에 들어가는 상태.

**A와 먼저 약속할 것 (아침 회의)**

- [ ] 칸 하나를 나타내는 문자열 형식: `"2026-10-12_09:30"` (날짜_시각)
- [ ] 선택한 칸은 이 문자열 배열로 주고받기로 확인
- [ ] 이 약속을 README 초안이나 `docs/data.md`에 한 줄로 기록

**함수 만들기**

- [ ] `git checkout main` → `git pull` → `git checkout -b feat/save-availability`
- [ ] `saveAvailability(meetingId, name, slots)` 작성
- [ ] 이름 앞뒤 공백 제거 (`name.trim()`), 빈 이름이면 에러 던지기
- [ ] `supabase.from('participants').upsert({ meeting_id, name, slots }, { onConflict: 'meeting_id,name' })` 사용 — 같은 이름이면 새로 만들지 않고 덮어씀
- [ ] 에러가 있으면 `throw error`

**테스트**

- [ ] 임시 버튼으로 `saveAvailability(실제모임id, '테스트', ['2026-10-12_09:00'])` 호출
- [ ] Table Editor에서 `participants`에 행이 생겼는지 확인
- [ ] 같은 이름으로 다른 칸을 넣어 다시 호출 → 행이 늘지 않고 `slots`만 바뀌는지 확인
- [ ] 없는 모임 id로 호출하면 에러가 나는지 확인 (Foreign key 덕분)
- [ ] 임시 버튼과 테스트 데이터 삭제

**전달**

- [ ] 커밋 → 푸시 → PR → Merge
- [ ] A에게 사용 예시 보내기: `await saveAvailability(id, name, selectedSlots)`
- [ ] A의 시간표가 연결되면 같이 실제로 저장해 보기
- [ ] 막혔던 점을 `docs/troubleshooting.md`에 3줄 메모

## Day 4 — 참여자 목록과 칸별 인원 계산

목표: A의 결과 화면이 실제 데이터로 색칠되는 상태.

**참여자 불러오기**

- [ ] `git checkout main` → `git pull` → `git checkout -b feat/aggregate`
- [ ] `getParticipants(meetingId)` 작성: `select('name, slots').eq('meeting_id', meetingId).order('created_at')`
- [ ] 참여자가 0명이면 빈 배열 반환되는지 확인

**칸별 인원 계산 (DB 없이 순수 JavaScript)**

- [ ] `src/utils/countBySlot.js` 파일 만들기
- [ ] 빈 객체 `{}`를 만들고, 참여자마다 `slots` 배열을 돌면서 해당 칸 숫자를 1씩 올리기
- [ ] 결과 예: `{ "2026-10-12_09:30": 3, "2026-10-12_10:00": 1 }`
- [ ] 가짜 참여자 3명 배열을 넣어 손으로 계산한 값과 같은지 `console.log`로 확인
- [ ] 같은 방식으로 칸별 "가능한 사람 이름 목록"을 돌려주는 `namesBySlot(participants)`도 만들기 (Day 6 추가 기능에서 A가 사용)

**테스트 코드 (포트폴리오 가산점)**

- [ ] `npm install -D vitest`
- [ ] `package.json`의 scripts에 `"test": "vitest"` 추가
- [ ] `src/utils/countBySlot.test.js` 만들고 테스트 3개 작성: 참여자 0명 / 1명 / 겹치는 3명
- [ ] `npm test`로 모두 통과하는지 확인

**전달과 확인**

- [ ] 커밋 → 푸시 → PR → Merge
- [ ] A에게 `getParticipants`, `countBySlot` 사용 예시 전달
- [ ] 배포 주소에서 브라우저 2개로 다른 이름을 저장해 결과가 합쳐지는지 A와 함께 확인
- [ ] 여기까지 안 되면 Day 6 추가 기능은 버리고 핵심 흐름부터 끝내기

## Day 5 — 재방문 처리, 자동 검사, 실사용 테스트

목표: 친구들이 실제로 써보고, 나온 문제가 Issue로 정리된 상태.

**다시 들어온 사람**

- [ ] `git checkout -b feat/my-availability`
- [ ] `getMyAvailability(meetingId, name)` 작성: 그 이름의 `slots`를 반환, 없으면 빈 배열
- [ ] A에게 전달 → A가 이름 입력 시 기존 선택을 불러오도록 연결

**GitHub Actions (자동 검사)**

- [ ] 레포에 `.github/workflows/ci.yml` 파일 만들기
- [ ] 내용: PR이 올라오면 `npm ci` → `npm run lint` → `npm test -- --run` → `npm run build` 실행 (검색어: "github actions node vite 예제")
- [ ] PR을 하나 올려 Actions 탭에서 초록 체크가 뜨는지 확인
- [ ] 빨간 X가 뜨면 로그를 읽고 고치기 (lint 경고가 가장 흔함)

**실사용 테스트 (A와 함께)**

- [ ] 배포 주소를 친구 3~5명에게 보내 써달라고 부탁
- [ ] 나온 문제를 GitHub Issues에 등록: 제목 + 재현 방법 + 스크린샷, 라벨 `bug`
- [ ] 화면 문제는 A, 데이터·저장 문제는 B로 Assignees 지정
- [ ] 직접 확인할 것: 없는 모임 주소 접속, 이름에 공백만 입력, 칸 0개 저장, 같은 이름 두 번 저장
- [ ] 고칠 때 PR 설명에 `Closes #이슈번호` 적기 → 머지되면 이슈 자동 종료
- [ ] 못 고친 건 Day 6로 넘기기

## Day 6 — 추가 기능 데이터와 점검

목표: 추천 표시에 필요한 데이터가 준비되고, 키 유출 같은 실수가 없는 상태.

**추천 시간 (Day 4까지 핵심이 끝났을 때만)**

- [ ] `src/utils/bestSlots.js`에 `countBySlot` 결과에서 인원이 가장 많은 칸들을 골라 반환하는 함수 작성
- [ ] 동점이면 날짜·시각이 빠른 순으로 정렬
- [ ] 테스트 2개 추가 (동점 있음 / 참여자 0명) → `npm test` 통과 확인
- [ ] A에게 전달 → 결과 화면에 "추천" 표시

**점검**

- [ ] GitHub 레포에서 `.env.local`이 올라가지 않았는지 확인 (파일 목록과 커밋 기록 검색)
- [ ] 혹시 올라갔다면 Supabase에서 키를 재발급(Rotate)하고 A와 Vercel에 새 키 반영
- [ ] Supabase Policies에서 delete가 허용되어 있지 않은지 확인 (아무나 지울 수 없게)
- [ ] Supabase 무료 플랜은 1주일 넘게 사용이 없으면 일시정지될 수 있음 → README에 "데모가 안 열리면 연락 주세요" 문구 준비
- [ ] 남은 `bug` Issue 처리

**마무리**

- [ ] 커밋 → 푸시 → PR → Merge
- [ ] 배포 주소에서 처음부터 끝까지 사용해 보기 (PC 1번, 휴대폰 1번)

## Day 7 — README와 회고

목표: 레포 첫 화면만 보고도 무엇을, 누가, 어떻게 만들었는지 알 수 있는 상태.

**README 작성 (`README.md`)**

- [ ] 맨 위: 서비스 이름, 한 줄 소개, 배포 주소 링크
- [ ] A가 만든 데모 GIF 넣기 (`![demo](docs/images/demo.gif)`)
- [ ] 주요 기능 3~5개 (각 1줄)
- [ ] 기술 스택과 선택 이유 (예: "서버 없이 1주일 안에 배포하려고 Supabase 선택")
- [ ] 데이터 구조: 테이블 2개와 칸 문자열 형식 설명
- [ ] 폴더 구조 (`src/pages`, `src/components`, `src/api`, `src/utils`)
- [ ] 로컬 실행 방법: `git clone` → `npm install` → `.env.example` 복사해 `.env.local` 만들기 → `npm run dev`
- [ ] 팀원과 역할: A(화면), B(데이터·배포), 각자 GitHub 링크
- [ ] 트러블슈팅 2~4개: A와 B가 `docs/troubleshooting.md`에 모은 메모를 문제 → 원인 → 해결 → 배운 점으로 정리
- [ ] 회고와 다음 개선 계획 (`docs/retrospective.md` 링크)
- [ ] A에게 README 리뷰 받고 Merge

**레포 다듬기**

- [ ] 레포 About에 설명, Website(배포 주소), Topics(`react`, `supabase`, `vercel`) 입력
- [ ] 불필요한 파일(테스트용 코드, 안 쓰는 이미지) 삭제
- [ ] Supabase에서 테스트 데이터 정리하고 예시 모임 1개만 남기기

**회고 (A와 함께, 30분)**

- [ ] 잘된 점 3개, 아쉬운 점 3개, 다음에 하고 싶은 기능 정리
- [ ] `docs/retrospective.md`로 저장
- [ ] 남은 Issue 정리: 고친 건 Close, 못 고친 건 `다음 개선` 라벨

## 매일 반복하는 Git·리뷰 순서

기능 하나마다 이 순서를 반복하세요. B는 레포 관리자라서 `main`을 깨끗하게 지키는 책임도 있습니다.

1. `git checkout main`
2. `git pull origin main`
3. `git checkout -b feat/기능이름`
4. 의미 있는 단위마다 `git add .` → `git commit -m "feat: 무엇을 했는지"`
5. `git push origin feat/기능이름`
6. GitHub에서 Pull Request 만들기: 무엇을 했는지 2~3줄 + 관련 Issue 번호
7. A에게 리뷰 요청, 댓글 반영
8. 승인되면 Merge, 1번으로 돌아가기

**A의 PR을 리뷰할 때**

- [ ] 브랜치를 받아 직접 실행해 보기: `git fetch` → `git checkout feat/A의브랜치` → `npm run dev`
- [ ] 이해 안 되는 줄에 "이건 왜 이렇게 했어?" 질문 댓글 (질문도 좋은 리뷰입니다)
- [ ] 좋은 점 하나 이상 댓글로 남기기
- [ ] 문제없으면 Approve

커밋 메시지 앞머리: `feat`(기능) · `fix`(버그) · `test`(테스트) · `docs`(문서) · `chore`(설정)
