-- Draft migration: RLS helper functions for membership checks

create or replace function app_is_team_member(_team_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from team_membership tm
    where tm.team_id = _team_id
      and tm.user_id = auth.uid()
  );
$$;

create or replace function app_has_project_role(_team_id uuid, _roles text[])
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from team_membership tm
    where tm.team_id = _team_id
      and tm.user_id = auth.uid()
      and tm.role = any(_roles)
  );
$$;
