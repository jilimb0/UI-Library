import { forwardRef, type ReactNode, type TableHTMLAttributes } from 'react';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children?: ReactNode;
}

/**
 * Base HTML table wrapper with consistent styling.
 *
 * @example
 * ```tsx
 * <Table>
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Role</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Alice</td>
 *       <td>Admin</td>
 *     </tr>
 *   </tbody>
 * </Table>
 * ```
 */
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
