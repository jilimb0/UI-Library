# E2E Tests

End-to-end tests for the UI Construction Library platform, running against a
locally served preview build of `apps/builder`, `apps/docs`, `apps/storybook`,
and `apps/playground`.

## Running

```bash
# Install the browser (once per machine)
pnpm playwright:install

# Run the full E2E suite
pnpm check:e2e

# Or via the platform gate (validate + E2E)
pnpm validate:platform
```

The suite requires a running preview server. `playwright.config.ts` at the
workspace root starts the server automatically via `webServer`.

---

## Test files

| File | What it covers |
|---|---|
| `basic-usage.spec.ts` | Storybook and docs routes load |
| `accessibility.spec.ts` | Axe accessibility smoke checks |
| `canonical-journey.spec.ts` | Full prompt → editor → publish lifecycle |
| `builder-canonical-flow.spec.ts` | Project creation and route navigation |
| `builder-persistence.spec.ts` | Local storage persistence across reload |
| `builder-publish-and-roles.spec.ts` | Role-based publish UI surface |
| `builder-versioning.spec.ts` | Version save/restore surface |
| `builder-repository-lifecycle.spec.ts` | Repository mode switching (local / stub / Supabase) |
| `builder-a11y.spec.ts` | Builder-specific accessibility checks |
| `keyboard-contracts.spec.ts` | Keyboard navigation contracts (modal, dropdown, docs) |
| `visual-regression.spec.ts` | Screenshot regression against committed baselines |

---

## Known skips

### Supabase configured-mode test

**File:** `builder-repository-lifecycle.spec.ts`  
**Test:** `supabase configured mode exposes connected remote-backed lifecycle`

This test is permanently skipped unless both `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` environment variables are set:

```ts
test.skip(
  !hasSupabaseCredentials,
  'Requires Supabase credentials for the connected scenario.',
);
```

**Why it is skipped in CI and local runs:**  
The test validates the `remote connected` state, which only appears when the
builder app can reach a real Supabase project. Without credentials the builder
falls back to `remote stub` mode, which is covered by the adjacent
`supabase stub mode` test that runs unconditionally.

**To run the connected test locally:**

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co \
VITE_SUPABASE_ANON_KEY=your-anon-key \
pnpm check:e2e
```

This skip does not affect the overall pass/fail status of the suite. All other
34 tests run without credentials.

---

## Visual regression baselines

Screenshot baselines are committed to
`tests/e2e/visual-regression.spec.ts-snapshots/`. If a UI change is
intentional, update baselines with:

```bash
pnpm exec playwright test tests/e2e/visual-regression.spec.ts --update-snapshots
```

Then commit the new snapshot files.
