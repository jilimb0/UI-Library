# Platform Vocabulary

- Component: reusable UI unit with stable metadata contract.
- Primitive: low-level interaction/styling foundation component.
- Block: medium-granularity reusable composition of components.
- Section: page-level content slice (hero, pricing, FAQ).
- Pattern: repeatable composition approach across contexts.
- Template: multi-section starter page/application layout.
- Layout node: schema entry representing one rendered instance.
- Instance: placed occurrence of a component in a layout tree.
- Slot: named insertion point for child content/components.
- Canvas: editable visual surface in the builder.
- Project: top-level workspace object containing pages and settings.
- Page: renderable route-level document inside a project.
- Version: immutable saved state pointer for a page/project.
- Snapshot: persisted serialized state used for compare/restore/publish.
- Publish build: immutable public output linked to a snapshot.
- Export target: framework/runtime destination for generated code.
- Recipe: validated composition guideline with defaults and caveats.
- Generator mode: deterministic or hybrid prompt-to-layout orchestration mode.
