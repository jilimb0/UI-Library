# Realtime Collaboration Spec

## Problem statement
The builder must support multi-user collaboration with low-conflict editing and robust reconnect behavior.

## Scope
- Presence model.
- Shared document sync strategy.
- Snapshot/version integration.

## Non-goals
- Vendor-specific implementation lock-in in this document.

## Data model
- Presence: user/session cursor/selection metadata.
- Room events: join/leave/update.
- Document operations: mutation stream with ordering metadata.
- Snapshot metadata for recoverability.

## Public contracts
- Realtime channel events for room/presence/document.
- Conflict-safe apply/ack flow for editor mutations.

## Technical decisions
- Document-oriented state with CRDT semantics.
- Persistent metadata in relational storage.
- Immutable publish snapshots.

## Migration path
- Start with presence + basic collaborative edits.
- Add threaded comments and review mode.

## Risks
- Event ordering issues under unstable connections.
- Presence noise and UX overload in large sessions.

## Open questions
- CRDT provider selection.
- Operational transform fallback requirements.
