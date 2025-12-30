# Продвинутые паттерны

## Compound Components

Пример составных компонентов для более гибкого использования.

```tsx
import { useState, ReactNode, ReactElement } from "react"

interface TabsProps {
  children: ReactNode
}

interface TabProps {
  label: string
  children: ReactNode
}

export function Tabs({ children }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const tabs = children as ReactElement<TabProps>[]

  return (
    <div>
      <nav className="flex space-x-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`${
              index === activeIndex ? "border-b-2 border-blue-500" : ""
            }`}
          >
            {tab.props.label}
          </button>
        ))}
      </nav>
      <div>{tabs[activeIndex]}</div>
    </div>
  )
}

export function Tab({ children }: TabProps) {
  return <div>{children}</div>
}
```

## Controlled vs Uncontrolled Components

- Controlled: передача значения и управление из родителя
- Uncontrolled: внутреннее состояние компонента
