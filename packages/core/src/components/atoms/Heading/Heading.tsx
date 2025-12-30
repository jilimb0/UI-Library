import { forwardRef, HTMLAttributes } from "react"

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, className, children, ...props }, ref) => {
    const Tag = `h${level}` as `h${1 | 2 | 3 | 4 | 5 | 6}`

    return (
      <Tag ref={ref} className={className} {...props}>
        {children}
      </Tag>
    )
  }
)

Heading.displayName = "Heading"

export { Heading }
