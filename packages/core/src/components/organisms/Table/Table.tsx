import { forwardRef, ReactNode, TableHTMLAttributes } from "react"

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, ...props }, ref) => {
    return (
      <table
        ref={ref}
        className="min-w-full divide-y divide-gray-200"
        {...props}
      >
        {children}
      </table>
    )
  }
)
Table.displayName = "Table"
