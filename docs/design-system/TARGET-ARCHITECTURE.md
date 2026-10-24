# Design System — Целевая архитектура и план миграции

> **Статус:** Черновик для ревью — предстоящий мажорный рефакторинг (breaking changes допустимы)
> **Область:** `@ui-construction-library/*` (tokens, themes, styles, behaviors, primitives, core, utils)
> **Дата:** Октябрь 2026
> **Связанные доки:** `docs/SYSTEM_DESIGN_REPORT.md` (текущее состояние), `docs/design-system/tokens.md`, `docs/migration/MIGRATION-GUIDE.md`

---

## 0. Контекст и зафиксированные решения

Библиотека позиционируется как **самый актуальный, адаптивный и простой в использовании** дизайн-конструктор на рынке: «лего» — каждый слот и каждый токен переопределяем, дефолт минималистичный, современный и приятный глазу. Аудит текущего состояния (см. §6) выявил, что архитектура задумана верно, но не доведена до конца ни в одном слое: несколько источников истины уже разошлись, а стилевой движок не работает полностью.

Зафиксированные решения (из требований):

| Решение | Значение |
|---|---|
| A11y-слой | **Опция A — полностью самописный стек** (`behaviors` + `primitives`), без Radix/Zag. Дотягиваем до APG-корректности; честный scope на сложных паттернах. |
| Стилевой движок | CSS-переменные + семантические классы — **primary**, библиотека работает **без Tailwind**. Tailwind — опциональный мост. |
| Вариативность | И **визуальная** (мультибренд/темы), и **API** (варианты/размеры/compound) — обе в приоритете. |
| Component-tier токены | Доводим до **реального потребления** компонентами (состояния default/hover/active/focus/disabled). |
| Breaking changes | Допустимы. |
| Префикс CSS-переменных | Оставить `--ucl-` (короткий, совпадает со scope пакета `ui-construction-library`, минимизирует churn). |
| Токены | Единый источник + **W3C Design Tokens Format** для удобной инструментации (Figma/Style Dictionary/Tokens Studio). |
| Мультифреймворк | Опционально (не блокируем); архитектура core/behaviors не должна идти против него. React — primary. |
| Дефолтный стиль | Спроектировать с нуля — минималистичный, современный. Направления представлены отдельно (design exploration). |

---

## 1. Принципы

1. **Single source of truth** — один каноничный источник токенов; всё остальное генерируется.
2. **Works without Tailwind** — компоненты не используют Tailwind-утилиты в исходниках; стили — это CSS-переменные + семантические классы.
3. **Lego** — каждый слот компонента и каждый токен переопределяемы снаружи; тема — полный override-слой.
4. **Minimalist modern default** — спокойный, сдержанный дефолт; выразительность — по требованию.
5. **APG-correct a11y** (в рамках scope Опции A) — roving tabindex, focus trap, keyboard, ARIA по WAI-ARIA APG.
6. **Framework-agnostic core, React-first** — `behaviors` остаётся чистым JS; `primitives` — React-адаптеры.

---

## 2. Целевая архитектура — по слоям

### 2.1 Токены

- **Каноничный источник:** JSON в формате **W3C Design Tokens Format** (`$value` / `$type` / группы).
- **Генераторы** (single-direction pipeline) из JSON → TS-объекты, CSS-переменные, опциональный Tailwind-пресет. Правка в одном месте распространяется везде.
- **Три яруса:**
  - **Primitive** — масштабы: color, radius, spacing, typography, motion, shadow, elevation, z-index.
  - **Semantic** — `background`, `foreground`, `primary`/`primary-foreground`, `card`/`card-foreground`, `popover`/`popover-foreground`, `muted`/`muted-foreground`, `accent`/`accent-foreground`, `border`, `input`, `ring`, `success`/`warning`/`error`/`info` + `*-foreground`, `intent.*`. **Дополнить** пары `*-foreground`, которых сейчас нет в TS (есть только в CSS) — закрыть расхождение.
  - **Component-state (Tier-3)** — `default/hover/active/focus/disabled/placeholder` на каждый интерактивный компонент. **Реально потребляются компонентами** (см. 2.3). Покрытие — все интерактивные компоненты, не только 6 текущих.
- **Чистка алиасов (breaking):** один канонический префикс `--ucl-`; убрать тройное алиасирование `--ucl-color-primary` → `--ucl-primary` → `--primary` → `--color-primary`.
- **Убрать дублирование:** spacing/typography/radius/shadow — в общем `:root` один раз; в `[data-theme]` переопределяется только палитра (сейчас нетематические токены дублированы в 3 файлах тем).

### 2.2 Темы

- **Тема — объект первого класса:** полный override `semantic` + `component-state` токенов.
- **`ThemeProvider` принимает произвольное имя темы** (не только `'light' | 'dark'`) — сейчас `neutral` существует как CSS, но недоступен из API. Произвольные темы — `data-theme="brand-x"`.
- **Мультибренд:** именованные бренд-темы подключаются как lego-блоки (переопределяют только цветовые масштабы + semantic).
- **`data-theme` атрибут** — единый механизм переключения (без `.dark`-класса). `prefers-color-scheme` — опционально, через explicit-режим, а не молчаливую третью ветку в `globals.css`.
- **Дефолт:** новый минималистичный набор (направления — в design exploration; выбранное фиксируется здесь).
- **Цвет — только в `[data-theme]`-блоках;** всё остальное — общий `:root` один раз.

### 2.3 Стилевой движок (primary)

- Компоненты **эмитят семантические классы** (`ucl-button`, `ucl-button--primary`, `ucl-button--sm`); раскраска живёт в CSS.
- Классы маппятся на **CSS-переменные, включая состояния**: `:hover` → `var(--ucl-button-primary-hover)`, `:focus-visible` → `var(--ucl-button-primary-focus)` и т.д. Это и есть «доведение component-tier до потребления».
- **Запрет Tailwind-утилит в исходниках компонентов** (`bg-primary`, `text-muted-foreground`, `bg-card`, `border-border` и т.д.) — они нарушают принцип «без Tailwind» и сейчас молчаливо сломаны (нет `@theme`-моста).

### 2.4 Опциональный Tailwind-мост

- `@theme { --color-primary: var(--ucl-primary); --color-muted: var(--ucl-muted); … }` — для потребителей Tailwind v4, чтобы `bg-primary`/`text-muted-foreground` работали и следовали за темой.
- Пресет **маппит на CSS-вары, не на raw hex** (текущий `tailwind.preset.ts` маппит хексы и ломает рантайм-переключение; он же орфан — никем не потребляется). Заменяется.
- Мост — отдельный опциональный артефакт; не влияет на работу без Tailwind.

### 2.5 Variant-движок

- **Единый механизм:** `tailwind-variants` (`tv`) + **slots** + **compoundVariants**.
- `tv` рантайм-легковесен и **не требует Tailwind** — он резолвит class-строки, которые маппятся в наш CSS (семантические классы).
- **Slots** — каждое под-свойство компонента рестайлится снаружи (`root`, `trigger`, `content`, `icon`…). Это и есть «лего».
- **compoundVariants** — перекрёстные варианты (сейчас отсутствуют): `destructive + sm`, `outline + success` и т.д.
- Заменяет **три текущие стратегии** (CVA на Badge/Text/TextArea/Modal; `behaviors`+`cx` на Button/Input; inline-шаблоны на Card) — единая конвенция.
- Согласовать имена размеров/вариантов по всему ядру (убрать несовместимые дубляжи `ButtonSize`).

### 2.6 Полиморфизм

- **Единая конвенция `asChild` (Slot)** на всех компонентах — один Slot-механизм.
- Заменяет split: `as` на 3 атомах + самописный `asChild` только на триггерах оверлеев.
- Общий базовый props-тип (вместо того, чтобы каждый компонент extends свой нативный атрибут ad-hoc).

### 2.7 A11y (Опция A — самописный стек)

- **Полностью своё:** `behaviors` (framework-agnostic стейт-машины / ARIA-фабрики / хендлеры) + `primitives` (React-обёртки на Context + `forwardRef` + controllable state).
- **Цель:** APG-корректность.
- **Scope:**
  - **Feasible-to-APG (дотягиваем до полного соответствия):** Dialog, Popover, Tooltip, Tabs, Accordion, Menu, Select, Switch, Checkbox, Slider, Radio, Disclosure, Field.
  - **High-risk / итеративно (честный scope — не обещаем мгновенный уровень Radix):** Combobox, TreeView, DatePicker, ColorPicker, Kanban DnD. Строим по APG, тестируем键盘ом, ship-им по мере готовности.
- **Покрытие качества:** `jest-axe` (уже есть) + keyboard-тесты Playwright + ручной APG-ревью.
- **Мультифреймворк:** `behaviors` сохраняет путь к Solid/Svelte/Vue-адаптерам (опционально, не блокирует).

### 2.8 Префикс

- Оставить `--ucl-`. Один канонический префикс; убрать непрефиксованные алиасы и дублирующий `--color-*` неймспейс из `generateCSSVariables` (breaking).

---

## 3. Аудиторские находки → решения

| # | Находка (текущее) | Решение (целевое) |
|---|---|---|
| 1 | Три источника истины для `#7c3aed` (TS `colors.ts`, хардкод в `themes/*.css`, hex-fallback в `globals.css`) | Единый W3C JSON → генераторы (§2.1) |
| 2 | `SemanticColors` (TS) не имеет `*-foreground`, в CSS — есть; расхождение | Дополнить пары в схеме (§2.1) |
| 3 | Component-tier токены определены, но не потребляются; hover = хак `opacity: 0.9` | Tier-3 драйвит состояния через CSS `:hover`/`:focus` (§2.3) |
| 4 | Component-токены только для 6 компонентов из 70+ | Покрытие — все интерактивные (§2.1) |
| 5 | `ButtonVariant` (9) vs `ButtonTokens` (4) — несоответствие имён | Согласовать имена вариантов (§2.5) |
| 6 | Tailwind v4: нет `@theme` → `bg-primary` и др. молчаливо сломаны; `tailwind.preset.ts` орфан с raw hex | Убрать утилиты из компонентов; `@theme`-мост на CSS-варах как опция (§2.4) |
| 7 | Три стратегии вариантов (CVA / behaviors+cx / inline); нет compound | Единый `tv` + slots + compound (§2.5) |
| 8 | `ButtonSize` определён дважды несовместимо; нет общего базового props-типа | Общий базовый тип + единый размер-enum (§2.6) |
| 9 | Полиморфизм split: `as` на 3 атомах + самописный `asChild` на триггерах | Единый `asChild`/Slot (§2.6) |
| 10 | Тёмный режим: `data-theme` + лишняя `@media (prefers-color-scheme)` ветка только в `globals.css` | Единый `data-theme`; OS-режим — explicit-опция (§2.2) |
| 11 | Тройное алиасирование каждой переменной | Один канонический `--ucl-` (§2.8) |
| 12 | Нетематические токены дублированы в 3 файлах тем | В общем `:root` один раз (§2.1) |
| 13 | `ThemeProvider` ограничен `light`/`dark`; neutral недоступен из API; один захардкоженный бренд | Произвольные имена тем + мультибренд lego (§2.2) |
| 14 | A11y полностью самописный, риск на сложных паттернах | Опция A: дотянуть feasible до APG, честный scope на сложных (§2.7) |
| 15 | Магические значения `brand-accent`, `glass-card-*` в `cssVariables.ts` | Вынести в токены (§2.1) |

---

## 4. План миграции (фазы, breaking changes допустимы)

- **Ф0 — Фундамент:** зафиксировать структуру W3C JSON-схемы токенов + генераторы (JSON → TS/CSS/Tailwind). Выбрать и зафиксировать дефолтный визуальный стиль (design exploration).
- **Ф1 — Токенный конвейер:** W3C JSON как единственный источник; добавить `*-foreground`; убрать тройные алиасы (один `--ucl-`); убрать дублирование нетематических токенов в темах; вынести магические значения в токены.
- **Ф2 — Темы первого класса:** произвольные имена в `ThemeProvider`; мультибренд как lego-блоки; минималистичный дефолт; `data-theme` как единый механизм; OS-режим — explicit-опция.
- **Ф3 — Component-state в потреблении:** Tier-3 реально драйвит hover/active/focus/disabled/placeholder через CSS; расширить покрытие на все интерактивные компоненты; согласовать имена вариантов (default↔primary, destructive↔danger).
- **Ф4 — Единый variant-движок:** мигрировать все компоненты на `tv` + slots + compoundVariants; убрать Tailwind-утилиты из исходников; общий базовый props-тип; единый size-enum.
- **Ф5 — Полиморфизм + Tailwind-мост:** единый `asChild`/Slot на всех; опциональный `@theme`-мост + пресет на CSS-варах.
- **Ф6 — A11y-дотяжка (Опция A):** feasible-паттерны до APG-корректности; keyboard-тесты Playwright; сложные — итеративно.
- **Ф7 — Экспорт/инструментация:** W3C JSON-экспорт + интеграции (Figma/Style Dictionary); обновить docs/changesets.

---

## 5. За пределами плана / открытое

- Дефолтный визуальный стиль — выбирается из design exploration (3 направления), фиксируется в §2.2.
- Стратегия переименования вариантов (`default`↔`primary`, `destructive`↔`danger`) — детали на Ф3.
- Мажорная версия / changeset-стратегия — отдельный шаг перед релизом.
- Решение о судьбе текущего `tailwind.preset.ts` (удалить после ввода нового моста).

---

## 6. Приложение — детальные аудиторские находки (по файлам)

- `packages/tokens/src/colors.ts` — `#7c3aed` и др. как единственный TS-источник; `SemanticColors` без `*-foreground`; `brandIndigo` — единственный захардкоженный бренд.
- `packages/tokens/src/cssVariables.ts` — тройное алиасирование (`toCSSVarLines`); магические `brand-accent`/`glass-card-*` (~149-155); `Theme.mode` deprecated.
- `packages/tokens/src/componentTokens.ts` — богатые state-токены (button primary default/hover/active/focus/disabled/fg) для light+dark, **но только 6 компонентов**; `ButtonTokens` = 4 варианта против `ButtonVariant` = 9.
- `packages/tokens/src/tokens.raw.ts` — 3-ярусная агрегация (правильная концепция).
- `packages/tokens/tailwind.preset.ts` — маппит **raw hex**, орфан (никем не потребляется).
- `packages/themes/src/theme-{light,dark,neutral}.css` — хардкод значений (дублируют TS); ~150 строк spacing/typography/radius/shadow **дублированы в каждом из 3 файлов** (меняются только цвета); `neutral` существует, но недоступен из `ThemeProvider`.
- `packages/core/src/styles/globals.css` — третья копия значений с hex-fallback; лишняя `@media (prefers-color-scheme)` ветка; тройное алиасирование.
- `packages/core/src/styles/components.css` — компоненты берут `var(--primary)` и хак `opacity: 0.9` для hover вместо state-токенов.
- `packages/core/src/themes/ThemeProvider.tsx` — `ThemeMode = 'light' | 'dark'`; `customTokens` = оверрайд единственного indigo-бренда.
- `packages/core/src/components/atoms/Badge/Badge.tsx` — каноничный CVA-пример (семантические классы).
- `packages/behaviors/src/button.ts` — альтернативная стратегия (`cx`), без CVA; `ButtonSize = 'default'|'sm'|'lg'|'icon'` (несовместимо с core).
- `packages/core/src/types/component-types.ts` — `ButtonSize = 'sm'|'md'|'lg'` (дубль); `VariantProps`-деривация только для CVA-компонентов.
- `packages/core/src/components/organisms/PricingTable/PricingTable.tsx`, `…/StatCard.tsx`, `…/NotificationItem.tsx`, `…/templates/AuthShell/AuthShell.tsx`, `…/atoms/Select/Select.tsx` — используют Tailwind-утилиты `bg-primary`/`text-muted-foreground`/`bg-card`/`border-border`, которые не резолвятся (нет `@theme`).
- `packages/primitives/src/dialog.tsx`, `…/internal/Slottable` — самописный `asChild` (не Radix Slot); `as`-полиморфизм только на Box/Text/Heading/Button.
- Поиск по репо: **ноль** импортов `@radix-ui`/`@ark-ui`/`@headlessui`/`react-aria`/`@floating-ui`; **ноль** блоков `@theme`.
