# UI-Library — План развития дизайн-системы и Pro-блоков экосистемы

> **Мировой бенчмарк:** Shadcn / MUI / Chakra UI ($10M+ ARR)  
> **Суть продукта:** Корпоративная монорепозиторная дизайн-система `@ui-construction-library/core` со Storybook, Chromatic и дизайн-токенами.  
> **Текущий статус:** 932 TS файла, 143 теста, 10 CI workflows, Chromatic visual tests, npm packages.  
> **Главная миссия:** Служить единым визуальным стандартом для ВСЕХ продуктов студии, полностью ликвидируя "Design Drift", ручные инлайн-стили и костыли с `!important`.

---

## 1. Технический бэклог доработок (Токены и Архитектура)

- [x] **Каноническая шкала скруглений (`packages/tokens/src/borders.ts`):**
  - Расширить шкалу: `xs: '4px'`, `sm: '6px'`, `md: '8px'` (кнопки/инпуты), `lg: '12px'` (канонический стандарт карточек), `xl: '16px'`, `'2xl': '20px'` (hero-секции), `full: '9999px'`.
  - Устранить конфликт с жестким ограничением в 8px, из-за которого в RepoRadar и service-app писались инлайн-стили.
- [x] **Каноническая палитра и Glassmorphism токен (`packages/tokens/src/colors.ts` & `cssVariables.ts`):**
  - Зафиксировать единый брендовый индиго-фиолетовый акцент `#6C7BFF` (шкала 50–900).
  - Внедрить официальный токен `glassCard`:
    `background: rgba(18, 21, 31, 0.75)`, `backdropFilter: blur(16px)`, `border: 1px solid rgba(108, 123, 255, 0.12)`.
  - Удалить необходимость использования хаков `!important` в прикладных проектах.
- [x] **Оптимизация tree-shaking и бандла:**
  - Гарантировать нулевой бандл-оверхед при импорте отдельных компонентов.

---

## 2. Готовые переиспользуемые Pro-блоки (Enterprise Component Patterns)

Добавить в `@ui-construction-library/core` составные компоненты для мгновенного переиспользования во всех продуктах:

- [x] **`PricingTable` компонент:**
  - Адаптивная таблица тарифов с интерактивным переключателем `Monthly / Annual` и авто-расчетом скидки (например, -20%).
  - Бейдж "Most Popular" / "Recommended".
  - Слоты под кнопки чекаута с поддержкой градиентного стиля `GRADIENT_BTN`.
  - *Переиспользуется в:* `RepoRadar`, `service-app`, `Converter`, `MyPersFin`.
- [x] **`AuthShell` компонент:**
  - Готовый двухколоночный лэйаут для Login / Register / ForgotPassword с брендовой панелью слева и формой справа.
  - Встроенные кнопки OAuth (GitHub, Google, GitLab) с правильными отступами и субтитрами.
  - *Переиспользуется в:* `RepoRadar`, `service-app`, `LifestyleEcosystem`.
- [x] **`KpiCard` / `StatCard` компонент:**
  - Карточка метрики с текущим значением, дельтой за период (+14%), цветовой кодировкой (зеленый/красный) и тултипом.
  - *Переиспользуется в:* `RepoRadar` (Health Score), `C&TLab` (выручка кофеен), `Trader` (PnL), `MyPersFin`.
- [x] **`NotificationItem` компонент:**
  - Элемент списка уведомлений со статусом unread (акцентная точка), severity (info/warning/error), именем сущности и человекопонятным временем.
  - *Переиспользуется в:* `RepoRadar`, `service-app`, `Trader`.

---

## 3. Модель монетизации и внешнего использования

* **Core:** Open Source лицензия (MIT) на npm для привлечения комьюнити.
* **Pro Blocks:** Коммерческий доступ к готовым экранам и шаблонам ($99 за пожизненную лицензию разработчика).

---

## 4. Пошаговые спринты реализации

### Спринт 1: Токены геометрии и Glassmorphism стандарт
- [x] Обновить `packages/tokens/src/borders.ts` (добавить `lg: 12px`, `xl: 16px`, `2xl: 20px`)
- [x] Обновить `packages/tokens/src/colors.ts` и `cssVariables.ts` (акцент `#6C7BFF` и `glassCard`)
- [x] Прогнать тесты токенов и запустить сборку пакета

### Спринт 2: Реализация Pro-блока `PricingTable`
- [x] Создать компонент `PricingTable` с переключателем периодов в `packages/core/src/components/organisms/PricingTable`
- [x] Добавить тесты поведения и расчета скидок
- [x] Проверить интеграцию на примере тарифов RepoRadar

### Спринт 3: Реализация Pro-блоков `AuthShell`, `KpiCard` / `StatCard` и `NotificationItem`
- [x] Реализовать `AuthShell` с поддержкой OAuth кнопок
- [x] Реализовать `StatCard` и `NotificationItem`
- [x] Опубликовать новую версию `@ui-construction-library/core`

