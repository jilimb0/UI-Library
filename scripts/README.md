# Scripts

Вспомогательные скрипты для CI/CD, разработки и автоматизации проекта UI-Library.

## Структура

```
scripts/
  ├── core/         # базовые операции разработки
  ├── ci/           # CI/CD pipeline и релизы
  ├── checks/       # pre-commit проверки
  ├── generators/   # генерация (changelog, компонент)
  ├── pages/        # Pages site (assemble, serve)
  └── utils/        # вспомогательные скрипты
```

### core/ — базовые операции

- `build.sh` — сборка проекта
- `test.sh` — запуск тестов (vitest через turbo)
- `clean.sh` — очистка (node_modules, dist, .turbo)

**Использование:**
```bash
pnpm scripts/core/build.sh
pnpm scripts/core/test.sh
pnpm scripts/core/clean.sh
```

### ci/ — CI/CD и релизы

- `ci-publish.mjs` — публикация из CI (OIDC + provenance)
- `publish-stable.sh` — публичация стабильной версии
- `publish-canary.sh` — публичация canary версии
- `release.sh` — релиз проекта
- `prepare-release.sh` — подготовка релиза
- `rollback-package-versions.mjs` — откат версий
- `release-preflight.sh` — pre-flight проверки перед релизом

**Использование:**
```bash
pnpm scripts/ci/publish-stable.sh
pnpm scripts/ci/publish-canary.sh
pnpm scripts/ci/release.sh
```

### checks/ — pre-commit проверки

- `check-repo-hygiene.js` — проверка на secrets и локальные артефакты
- `check-package-boundaries.mjs` — проверка границ пакетов
- `check-public-surface.mjs` — проверка публичной поверхности
- `check-bundle-size.js` — проверка размера bundle
- `check-gold-kits.js` — проверка gold kits
- `check-launch-readiness.js` — проверка готовности к релизу
- `check-dependency-boundaries.sh` — проверка границ зависимостей
- `check-app-dependency-policy.sh` — политика зависимостей app
- `check-export-smoke.mjs` — smoke тест экспорта
- `check-preset-docs.js` — проверка preset документации
- `surface-checker.mjs` — проверка поверхности

**Использование:**
```bash
pnpm scripts/checks/check-repo-hygiene.js
pnpm scripts/checks/check-package-boundaries.mjs
pnpm scripts/checks/check-bundle-size.js
```

### generators/ — генерация

- `generate-package-changelogs.js` — генерация changelog пакетов
- `generate-root-changelog.js` — генерация root changelog
- `generate-component.js` — генерация компонента
- `create-mixed-changelog-changeset.js` — создание changeset с mixed changelog

**Использование:**
```bash
pnpm scripts/generators/generate-package-changelogs.js
pnpm scripts/generators/generate-component.js
```

### pages/ — Pages site

- `assemble-pages-site.sh` — сборка Pages site
- `serve-pages-preview.sh` — запуск preview сервера
- `pages-serve.json` — конфигурация сервера

**Использование:**
```bash
pnpm scripts/pages/assemble-pages-site.sh
pnpm scripts/pages/serve-pages-preview.sh
```

### utils/ — вспомогательные

- `bootstrap-preset.js` — bootstrap preset
- `bump-package-versions.js` — увеличение версий пакетов
- `upgrade-doctor.js` — upgrade doctor
- `setup.sh` — установка проекта
- `update-dependencies.js` — обновление зависимостей

**Использование:**
```bash
pnpm scripts/utils/bootstrap-preset.js
pnpm scripts/utils/setup.sh
```

## Общие команды

```bash
# Build всего проекта
pnpm build

# Test всего проекта
pnpm test

# Lint всего проекта
pnpm lint

# Clean всего проекта
pnpm clean
```

## Примечания

- `test.sh` использует `pnpm turbo run test` для параллельного запуска тестов
- `ci-publish.mjs` использует npm Trusted Publisher (OIDC) — не нужен NPM_TOKEN
- Все скрипты на bash/node — совместимы с macOS и Linux
