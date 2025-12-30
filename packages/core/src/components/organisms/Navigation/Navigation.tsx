import { forwardRef, HTMLAttributes, ReactNode } from "react"

export interface NavigationProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export const Navigation = forwardRef<HTMLElement, NavigationProps>(
  ({ children, ...props }, ref) => {
    return (
      <nav ref={ref} {...props}>
        {children}
      </nav>
    )
  }
)
Navigation.displayName = "Navigation"
