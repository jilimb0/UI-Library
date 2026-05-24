-- Phase 4 foundation schema skeleton (draft)

create table if not exists user_profile (
  id uuid primary key,
  email text unique not null,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists team (
  id uuid primary key,
  name text not null,
  created_by uuid not null references user_profile(id),
  created_at timestamptz not null default now()
);

create table if not exists team_membership (
  team_id uuid not null references team(id) on delete cascade,
  user_id uuid not null references user_profile(id) on delete cascade,
  role text not null check (role in ('owner','admin','editor','commenter','viewer')),
  created_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

create table if not exists project (
  id uuid primary key,
  team_id uuid not null references team(id) on delete cascade,
  name text not null,
  slug text unique,
  created_by uuid not null references user_profile(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists page (
  id uuid primary key,
  project_id uuid not null references project(id) on delete cascade,
  title text not null,
  path text not null,
  root_layout_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists page_version (
  id uuid primary key,
  page_id uuid not null references page(id) on delete cascade,
  snapshot_json jsonb not null,
  label text,
  author_id uuid not null references user_profile(id),
  created_at timestamptz not null default now()
);

create table if not exists publish_snapshot (
  id uuid primary key,
  project_id uuid not null references project(id) on delete cascade,
  version_id uuid not null references page_version(id) on delete cascade,
  share_slug text unique not null,
  visibility text not null check (visibility in ('public','password','private')),
  password_hash text,
  created_by uuid not null references user_profile(id),
  created_at timestamptz not null default now()
);

-- RLS policies are intentionally omitted here and should be added in Phase 4.3.

-- Phase 4.3 RLS skeleton
alter table project enable row level security;
alter table page enable row level security;
alter table page_version enable row level security;
alter table publish_snapshot enable row level security;

create policy project_read_members
on project for select
using (
  exists (
    select 1 from team_membership tm
    where tm.team_id = project.team_id and tm.user_id = auth.uid()
  )
);

create policy project_edit_members
on project for update
using (
  exists (
    select 1 from team_membership tm
    where tm.team_id = project.team_id
      and tm.user_id = auth.uid()
      and tm.role in ('owner','admin','editor')
  )
);
