# Начало работы

Добро пожаловать в UI Construction Library — профессиональную, компонентную дизайн-систему на базе React, CSS-переменных и современных практик доступности.

Наша библиотека спроектирована по методологии Atomic Design и разделена на Atoms, Molecules, Organisms и Templates для максимальной переиспользуемости и масштабируемости.

---

## 1. Совместимость с Server-Side Rendering (SSR) и RSC

Все интерактивные компоненты в `@ui-construction-library/core` поставляются со встроенной директивой `"use client"`. Это гарантирует полную совместимость с современными фреймворками, такими как **Next.js (App Router)** и **Remix**, без необходимости оборачивать каждый компонент вручную.

### Рекомендации по интеграции с Next.js
При использовании в App Router убедитесь, что вы оборачиваете ваше приложение в `ThemeProvider` на уровне корневого лейаута (`layout.tsx`), который также должен быть клиентским компонентом или импортировать клиентский провайдер:

```tsx
// app/providers.tsx
"use client";

import { ThemeProvider } from '@ui-construction-library/core';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider defaultTheme="light">{children}</ThemeProvider>;
}
```

---

## 2. Паттерны композиции компонентов (Recipes)

Библиотека поощряет декларативный подход к построению сложных интерфейсов из атомарных блоков. Ниже приведен пример композиции карточки товара с формой отправки:

```tsx
import { Card, Heading, Text, Input, Button, Icon } from '@ui-construction-library/core';

export function ProductCard() {
  return (
    <Card className="max-w-sm p-6 stack">
      <Heading as="h3">Новый строительный модуль</Heading>
      <Text variant="muted">Усиленный стальной профиль для каркасных работ.</Text>
      
      <div className="row justify-between items-center my-4">
        <Text className="font-bold text-lg">9 990 ₽</Text>
        <Badge variant="success">В наличии</Badge>
      </div>

      <div className="stack stack-tight">
        <Input label="Количество" type="number" defaultValue="1" />
        <Button leftIcon={<Icon name="shopping-cart" />}>
          Добавить в корзину
        </Button>
      </div>
    </Card>
  );
}
```

---

## 3. Оптимизация размера сборки (Bundle Size & Treeshaking)

Дизайн-система полностью поддерживает **ES Modules (ESM)** и автоматический **Treeshaking**. При сборке вашего приложения с помощью Vite, Webpack 5 или Rollup неиспользуемые компоненты будут автоматически исключены из финального бандла.

### Оптимальный импорт
Используйте именованный импорт для импорта любых компонентов:

```tsx
// Правильно: Treeshaking автоматически оставит только Button и исключит остальные 40+ компонентов
import { Button } from '@ui-construction-library/core';
```

### Мониторинг размера бандла
Рекомендуется использовать плагины визуализации размера сборки в вашем проекте для постоянного аудита:
- Для Vite: `rollup-plugin-visualizer`
- Для Webpack: `webpack-bundle-analyzer`

---

## 4. Единый API компонентов (P1)

Для единообразия API в библиотеке действуют следующие правила:

- Размеры контролов: `sm | default | lg`
- Для value-driven компонентов поддерживается `onValueChange(...)`
- Для обратной совместимости в ряде компонентов также сохраняется `onChange(...)`

Рекомендуемый стиль:

```tsx
<SearchInput value={query} onValueChange={setQuery} />
<ComboBox value={value} onValueChange={setValue} />
<Pagination page={page} totalPages={totalPages} onValueChange={setPage} onPageChange={setPage} />
```
