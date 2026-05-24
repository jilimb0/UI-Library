# Auth And Persistence Spec

## Problem statement
Builder MVP now has in-browser state, but Phase 4 requires authenticated multi-user persistence, role-based permissions, and publish/version data model.

## Scope
- Auth contract (email/password, GitHub, optional magic link).
- Persistence model for projects/pages/versions/comments/export jobs.
- Supabase-ready relational schema skeleton.

## Non-goals
- Full production deployment in this phase.
- Full realtime CRDT implementation in this document.

## Core entities
- user_profile
- team
- team_membership
- project
- project_member
- page
- page_version
- publish_snapshot
- asset
- export_job
- comment_thread
- comment
- activity_event

## Auth contract
- Authentication provider: Supabase Auth.
- Supported providers: email/password, GitHub OAuth.
- Session token is required for all project-scoped mutations.

## Permission model
Roles:
- owner
- admin
- editor
- commenter
- viewer

Access rules:
- project members can read project/page/version data by role.
- only owner/admin can manage membership and publish visibility.
- editor can mutate layout/page content.
- commenter can create comments and review notes.

## Persistence contract
Project payload:
- id, team_id, name, slug, theme_preset_id, created_by, created_at, updated_at

Page payload:
- id, project_id, title, path, root_layout_json, created_at, updated_at

Version payload:
- id, page_id, snapshot_json, author_id, label, created_at

Publish payload:
- id, project_id, version_id, share_slug, visibility, password_hash?, created_at

## Migration path
1. Add SQL schema skeleton and policies.
2. Implement repository layer in builder backend.
3. Replace local storage with authenticated persistence.
4. Add realtime presence channels.

## Risks
- Permission drift if RLS and app-level checks diverge.
- Snapshot storage growth.

## Open questions
- Snapshot retention and archival policy.
- Whether publish snapshot should be page-based or project-wide atomically.
