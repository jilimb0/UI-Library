import { forwardRef, type ReactNode, type TableHTMLAttributes } from 'react';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children?: ReactNode;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <table ref={ref} className="table" style={style} {...props}>
        {children}
      </table>
    );
  }
);
Table.displayName = 'Table';
