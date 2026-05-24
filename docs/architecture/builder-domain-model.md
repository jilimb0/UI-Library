# Builder Domain Model

## Problem statement
The repo lacks a formal product domain model for the upcoming builder app.

## Scope
- Define first-class entities for auth, collaboration, pages, versions, exports, publishing.

## Non-goals
- Full DB migration scripts in this document.

## Data model
Core entities:
- User
- Team
- Membership
- Project
- Page
- PageVersion
- ThemePreset
- Asset
- PublishTarget
- ExportJob
- PromptSession
- ActivityEvent
- Comment
- PresenceState

Layout node contract:
- `id`, `componentId`, `props`, `bindings`, `children`, `slotAssignments`, `styleOverrides`, `responsiveRules`, `visibilityRules`, `lockState`, `meta`

## Public contracts
- CRUD APIs for projects/pages/versions.
- Collaboration channel contract for presence, selection, and mutation events.
- Publish contract for immutable snapshots.

## Technical decisions
- Separate persistent metadata from collaborative document state.
- Version snapshots are immutable and publish references are pinned.

## Migration path
- Start with single-team ownership model.
- Add role-based permissions and invites.
- Expand to advanced branching/forking in later phase.

## Risks
- Inconsistent version references across exports and publish operations.
- Complex permission matrix too early.

## Open questions
- Soft delete policy for pages/projects.
- Retention policy for snapshots and export artifacts.
