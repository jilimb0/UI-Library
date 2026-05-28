-- Migration: Seed and Rollback instructions for builder development & staging confidence
-- Created at: 2026-05-28T02:00:00Z

-- ============================================================================
-- 1. SEED DATA FOR STAGING AND DEVELOPMENT
-- ============================================================================

-- Inserts a mock developer project with multiple pages and default member list
insert into builder_projects (id, name, pages, publish, members)
values (
  'project-seed-demo',
  'Staging seed demo project',
  '[
    {
      "id": "generated-page",
      "title": "Welcome Page",
      "root": {
        "id": "welcome-root",
        "componentId": "card",
        "props": { "padding": "lg", "interactive": false, "shadow": "sm" },
        "children": [
          {
            "id": "welcome-heading",
            "componentId": "heading",
            "props": { "level": "1", "children": "Welcome to Seed Stage!" },
            "children": []
          },
          {
            "id": "welcome-copy",
            "componentId": "text",
            "props": { "children": "This project is populated by the migrations seed script.", "align": "start" },
            "children": []
          }
        ]
      }
    }
  ]'::jsonb,
  '{
    "status": "draft",
    "publishedAt": null,
    "publishedBy": null,
    "sourceVersionId": null
  }'::jsonb,
  '[
    { "userId": "local-owner", "email": "owner@builder.dev", "role": "owner" },
    { "userId": "local-admin", "email": "admin@builder.dev", "role": "admin" },
    { "userId": "local-editor", "email": "editor@builder.dev", "role": "editor" },
    { "userId": "local-viewer", "email": "viewer@builder.dev", "role": "viewer" }
  ]'::jsonb
)
on conflict (id) do update set
  name = excluded.name,
  pages = excluded.pages,
  members = excluded.members;

-- ============================================================================
-- 2. ROLLBACK STRATEGY / PROCEDURES
-- ============================================================================
-- To rollback the seed data or tables, you can run the following SQL block:
/*
-- Rollback seed data:
delete from builder_projects where id = 'project-seed-demo';

-- Rollback schema / clean database:
drop policy if exists builder_projects_dev_all_select on builder_projects;
drop policy if exists builder_projects_dev_all_insert on builder_projects;
drop policy if exists builder_projects_dev_all_update on builder_projects;
drop table if exists builder_projects;
*/
