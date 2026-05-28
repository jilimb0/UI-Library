create table if not exists builder_projects (
  id text primary key,
  name text not null,
  pages jsonb not null default '[]'::jsonb,
  publish jsonb not null default '{}'::jsonb,
  members jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table builder_projects enable row level security;

create policy builder_projects_dev_all_select
on builder_projects
for select
using (true);

create policy builder_projects_dev_all_insert
on builder_projects
for insert
with check (true);

create policy builder_projects_dev_all_update
on builder_projects
for update
using (true)
with check (true);
