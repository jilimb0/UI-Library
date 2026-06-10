# Quality Gates

Это официальная документация по quality gates в UI-Library: какие команды обязательны тогда́ разработчика, какие — только в CI, а какие существуют для release/platform maintenance.

## Канонические команды валидации

Проект использует **два канонических entrypoints** для валидации:

### `pnpm validate`

- **Назначение**: основной quality gate для package/library уровня.
- **Доступность**: локально, CI, ручные триггеры.
- **Что включает**: repo hygiene, workspace scripts, boundaries, public surface, surface tests, deps, API, source registry, preset checks, gold kits, launch readiness, lint, build, typecheck, test, build-storybook, bundle size, perf.
- **Кто должен запускать**: разработчик локально (например, перед коммитом или push), а также главный CI pipeline.
</metadata>

### `pnpm validate:platform`

- **Назначение**: integration и platform gate.
- **Доступность**: локально, CI.
- **Что включает**: `pnpm validate` + `check:supabase-schema` + `check:e2e` (Playwright).
- **Кто должен запускать**: разработчик при изменениях в platform/apps, а также CI для PR к `main`.
- **Важно**: это более тяжёлый гейт, который включает e2e и проверку schema. Если изменения только в package, обычно достаточно `validate`.

## Workflow уровня

### `CI` (ci.yml)

- **Триггеры**: PR на `main` по путям `packages/**`, `apps/**`, `scripts/**`, `tests/**`, `pnpm-lock.yaml`, `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `playwright.config.ts`, workflows и setup action.
- **Что запускает**:
  - `pnpm validate:platform` — основной platform gate
  - `check:security` — audit зависимостей (continue-on-error)
  - `check:contracts` — контрактная комплаенс
  - `check:published` — проверка опубликованных версий
  - upload compliance report и coverage
- **Обязательность**: обязательный workflow для всех PR.

### `Chromatic` (chromatic.yml)

- **Триггеры**: PR на `main` по путям `packages/**`, `apps/storybook/**`, workflow и setup action.
- **Что запускает**:
  - `chromaui/action@v16` с `buildScriptName: build-storybook`
- **Что делает**: собирает Storybook, публикует в Chromatic, запускает визуальные тесты.
- **Обязательность**: обязательный workflow для изменений в UI/packages/storybook.
- **Важно**: Chromatic сам собирает Storybook через `buildScriptName`, поэтому отдельный `pnpm build-storybook` перед ним не требуется.

### `CodeQL` (codeql.yml)

- **Триггеры**: push на `main`, PR на `main`, schedule, workflow_dispatch.
- **Что запускает**: CodeQL static analysis для JavaScript.
- **Обязательность**: не обязательный для блокировки PR, но включён в security-стратегию.

### `Performance` (performance.yml)

- **Триггеры**: PR на `main` по путям `packages/**`, `pnpm-lock.yaml`, workflow и setup action.
- **Что запускает**: `pnpm build` + vitest performance tests.
- **Обязательность**: optional/performance gate, не блокирует merge.

### `Platform Future Gates` (platform-future-gates.yml)

- **Триггеры**: PR на `main`.
- **Что запускает**:
  - `schema-and-registry-gates` — typecheck/test для @ui-construction-library/schema и @ui-construction-library/registry
  - `export-smoke-builds` — build для @ui-construction-library/tokens и @ui-construction-library/registry, test/build для @ui-construction-library/export-core
  - `builder-quality-gates` — build/test/typecheck для @ui-app/builder и @ui-construction-library/registry
- **Обязательность**: optional для platform R&D, не блокирует merge.

### `Security Audit` (security-audit.yml)

- **Триггеры**: schedule (еженедельно), workflow_dispatch.
- **Что запускает**: `pnpm audit --audit-level high` и `pnpm audit --audit-level critical`.
- **Обязательность**: scheduled security audit, не блокирует PR.

### `Pages` (pages.yml)

- **Триггеры**: push на `main` по путям `apps/demo-showcase/**`, `apps/docs/**`, `apps/storybook/**`, `packages/**`, `pnpm-lock.yaml`, `package.json`, `pnpm-workspace.yaml`, `turbo.json`, скрипт assemble, workflow и setup action.
- **Что запускает**: assemble Pages site + upload artifact + deploy.
- **Обязательность**: deployment workflow для docs/showcase.

### `Release` (release.yml)

- **Триггеры**: workflow_dispatch, workflow_run после успешного CI на `main`.
- **Что запускает**: build всех пакетов + OIDC trusted publishing + changeset action (version + publish).
- **Обязательность**: release automation для npm.

## Практические правила для разработчика

- **Локально перед коммитом/push**:
  - `pnpm validate` — для изменений в package, без e2e.
  - `pnpm validate:platform` — если нарушены changes в platform/apps, e2e или supabase.

- **В CI**:
  - `pnpm validate:platform` — основной gate.
  - Дополнительно: `check:security` / `check:contracts` / `check:published`.
  - Визуальный контроль: Chromatic.

- **Для release**:
  - `Release` workflow — автоматический publishing после CI.
  - `Pages` — автоматически накатывается на `main`.

- **Для platform R&D**:
  - `Platform Future Gates` — для изменений в schema/registry/export-core/builder.

## Итог

- **Главная команда разработчика**: `pnpm validate`.
- **Главный CI gate**: `pnpm validate:platform`.
- **Визуальный контроль**: `Chromatic`.
- **Security**: scheduled `Security Audit` + `check:security` в CI.
- **Platform R&D**: `Platform Future Gates`.
- **Release / Docs**: `Release` и `Pages`.

