# Source Distribution Mode

Source distribution mode allows consumers to install and compose the library with source-level registry metadata.

## Registry files

- `registry/source/core.json` — source entry, styles entry, dependency graph.
- `registry/source/presets.json` — preset bundles (`enterprise`, `saas`, `marketing`).

## Validation

```bash
pnpm registry:source:check
```

## Preset bootstrap

Generate a copy-ready preset guide:

```bash
pnpm preset:bootstrap enterprise
pnpm preset:bootstrap saas
pnpm preset:bootstrap marketing
```

This creates:

- `docs/guides/preset-enterprise.md`
- `docs/guides/preset-saas.md`
- `docs/guides/preset-marketing.md`

Each file includes dependency list and install command.
