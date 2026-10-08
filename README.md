# 언제모여

> 링크 하나로 끝내는 모임 시간 조율 서비스

🚧 1주일 2인 프로젝트로 개발 중입니다. 완성 후 데모 링크와 GIF가 여기에 들어갑니다.

## 주요 기능 (예정)

- 모임 만들기: 제목, 후보 날짜, 시간 범위를 입력하면 공유 링크 생성
- 시간 선택: 로그인 없이 이름만 입력하고 30분 단위 칸을 클릭해 선택
- 결과 히트맵: 겹치는 인원이 많은 시간일수록 진하게 표시

## 기술 스택

React (Vite) · Supabase · Vercel · GitHub Actions

## 폴더 구조

```
src/
├── pages/        화면 단위 (CreatePage, MeetingPage)       — A
├── components/   화면 조각 (TimeGrid, ResultGrid)          — A
├── api/          Supabase 저장·불러오기 함수               — B
├── lib/          Supabase 클라이언트                      — B
└── utils/        계산 함수와 테스트 (countBySlot)          — B
docs/
├── checklist-A-frontend.md   A(화면 담당) 할 일
├── checklist-B-data.md       B(데이터·배포 담당) 할 일
└── images/                   스크린샷·GIF
```

## 로컬 실행

```bash
git clone <이 레포 주소>
cd when-meet
npm install
cp .env.example .env.local   # 값은 팀원에게 따로 받기
npm run dev
```

## 팀원

| 역할 | 이름 | 담당 |
| --- | --- | --- |
| A | (이름 / GitHub 링크) | 화면: 모임 만들기, 시간표, 결과 히트맵 |
| B | (이름 / GitHub 링크) | 데이터·배포: Supabase, Vercel, CI, README |

## 트러블슈팅

(작업하며 `docs/troubleshooting.md`에 모은 내용을 Day 7에 정리)

## 회고

(Day 7에 `docs/retrospective.md` 링크)
