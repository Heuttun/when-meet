-- 언제모여 DB 테이블 만들기
-- Supabase 대시보드 → SQL Editor → New query 에 전부 붙여넣고 Run 을 누르세요. (한 번만 실행)

-- 1. 모임
create table meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  dates jsonb not null,               -- 후보 날짜 목록 예: ["2026-10-12", "2026-10-13"]
  start_hour int2 not null,           -- 시작 시각 (0~23)
  end_hour int2 not null,             -- 끝 시각 (1~24)
  created_at timestamptz not null default now()
);

-- 2. 참여자
create table participants (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references meetings(id) on delete cascade,
  name text not null,
  slots jsonb not null default '[]',  -- 고른 칸 목록 예: ["2026-10-12_09:30"]
  created_at timestamptz not null default now(),
  constraint uniq_meeting_name unique (meeting_id, name)  -- 같은 모임에 같은 이름은 하나만 (덮어쓰기용)
);

-- 3. 보안 규칙 (RLS): 로그인 없는 서비스라 누구나 읽고 쓸 수 있게, 삭제는 막기
alter table meetings enable row level security;
alter table participants enable row level security;

create policy "누구나 모임 조회" on meetings for select using (true);
create policy "누구나 모임 생성" on meetings for insert with check (true);

create policy "누구나 참여자 조회" on participants for select using (true);
create policy "누구나 참여자 추가" on participants for insert with check (true);
create policy "누구나 참여자 수정" on participants for update using (true) with check (true);
