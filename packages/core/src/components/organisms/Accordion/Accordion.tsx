import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactNode,
  useState,
} from "react"

export interface AccordionProps {
  multiple?: boolean
  children: ReactNode
  className?: string
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ multiple = false, children, className, ...props }, ref) => {
    const [openItems, setOpenItems] = useState<number[]>([])

    const toggleItem = (index: number) => {
      if (multiple) {
        if (openItems.includes(index)) {
          setOpenItems(openItems.filter((i) => i !== index))
        } else {
          setOpenItems([...openItems, index])
        }
      } else {
        if (openItems[0] === index) {
          setOpenItems([])
        } else {
          setOpenItems([index])
        }
      }
    }

    return (
      <div ref={ref} className={className} data-testid="accordion" {...props}>
        {Children.map(children, (child, index) => {
          if (!isValidElement(child)) return null
          // Проверяем, что дочерний элемент — React-компонент, а не DOM-элемент
          if (typeof child.type === "string") return child
          return cloneElement(child, {
            isOpen: openItems.includes(index),
            onToggle: () => toggleItem(index),
          })
        })}
      </div>
    )
  }
)
Accordion.displayName = "Accordion"

export default Accordion
