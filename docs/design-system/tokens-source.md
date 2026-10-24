# Design Tokens — Canonical Source (W3C)

> **Статус:** Новая каноничная цепочка (Ф0/Ф1). Сосуществует с унаследованной `generateCSSVariables` до полного переключения в breaking-мажоре.

## Единый источник истины

**`packages/tokens/src/tokens.w3c.json`** — каноничный источник дизайн-токенов в формате [W3C Design Tokens Format](https://design-tokens.org/). Отсюда генерируется всё остальное. Правка в одном месте распространяется на TS/CSS/Tailwind.

Дефолтная тема — **Mono Luxe** (монохром, Apple-материальность). Зафиксирована решением (см. `TARGET-ARCHITECTURE.md`).

## Три яруса токенов

| Ярус | Путь в JSON | Что это |
|---|---|---|
| Primitive (Tier 1) | `color.primitive.*`, `radius`, `spacing`, `typography`, `shadow`, `motion`, `zIndex`, `opacity` | Фреймворк-агностичный словарь масштабов |
| Semantic (Tier 2) | `color.semantic.{light,dark}` | Тема-зависимые алиасы **с парами `*-foreground`** |
| Component-state (Tier 3) | `color.component.{light,dark}` | `default/hover/active/focus/disabled` — потребляются компонентами через CSS `:state` |

Семантические и компонентные токены ссылаются на примитивы через алиасы (`{color.primitive.neutral.700}`), которые резолвит генератор.

## Генератор

**`packages/tokens/scripts/build-w3c.mjs`** — читает `tokens.w3c.json`, резолвит алиасы, эмитит в `dist/w3c/`:

| Артефакт | Назначение |
|---|---|
| `tokens.css` | CSS-переменные, **единый `--ucl-` префикс**. Нецветовые + primitive-масштабы → `:root`; semantic + component-state → `[data-theme="light"]` / `[data-theme="dark"]` (light по умолчанию через `:root:not([data-theme])`). |
| `tokens.ts` | Резолвнутое дерево как типизированный `designTokens` const (для in-code потребления). |
| `tokens.w3c.json` | Каноничный источник (с алиасами) — для Figma / Tokens Studio / Style Dictionary. |
| `tokens.resolved.json` | Полностью резолвнутое дерево — для инструментов, которым нужны только значения. |

Запуск: `pnpm --filter @ui-construction-library/tokens build:w3c` (также входит в основной `build`).

Потребление (после переключения):
```css
@import "@ui-construction-library/tokens/w3c/css";
```
```ts
import designTokens from "@ui-construction-library/tokens/w3c"; /* (wiring в процессе) */
```

## Что это решает из аудита

- **3 источника истины → 1** (нахождение #1): единственный `tokens.w3c.json`, всё генерируется.
- **Расхождение `*-foreground`** (#2): пары определены в схеме, а не только в CSS.
- **Component-state не потреблялись** (#3): Tier-3 эмитится как `--ucl-{component}-{variant}-{state}` для CSS `:hover/:focus/:active` (Ф3).
- **Тройное алиасирование** (#11): один канонический `--ucl-` префикс, непрефиксованные алиасы убраны.
- **Дублирование нетематических токенов в темах** (#12): spacing/type/radius/shadow — в `:root` один раз, в `[data-theme]` только палитра.

## Что ещё предстоит (другие фазы)

- Ф2: переключить `ThemeProvider`/`themes` на сгенерированный CSS, темы как объект первого класса, мультибренд.
- Ф3: довести `:hover/:focus/:active` в компонентах до потребления `--ucl-button-*-hover` и т.д.; расширить component-state на все интерактивные компоненты.
- Ф4: единый variant-движок (`tailwind-variants` + slots + compound), убрать Tailwind-утилиты из исходников компонентов.
- Ф5: опциональный Tailwind-мост (`@theme { --color-*: var(--ucl-*) }`) + пресет на CSS-варах.
- Ф6: a11y-дотяжка (Опция A).

## Регенерация

Исходник правится в `src/tokens.w3c.json`, затем `pnpm --filter @ui-construction-library/tokens build:w3c`. Артефакты в `dist/w3c/` не коммитятся (`dist/` в .gitignore).
