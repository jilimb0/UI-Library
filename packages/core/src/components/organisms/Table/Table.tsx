
import * as React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(({ children, ...props }, ref) => {
  return (
    <table ref={ref} className="min-w-full divide-y divide-gray-200" {...props}>
      {children}
    </table>
  );
});
Table.displayName = 'Table';
