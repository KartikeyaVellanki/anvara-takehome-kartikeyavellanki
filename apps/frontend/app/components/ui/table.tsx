import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes, type ReactNode } from 'react';

/**
 * Table Component
 * 
 * Clean, minimal table with Swiss styling.
 * Thin borders, clear hierarchy, good readability.
 */

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div className="w-full overflow-x-auto">
        <table
          ref={ref}
          className={`w-full border-collapse text-[--text-sm] ${className}`}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

/**
 * Table Header
 */
interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={`bg-[--color-bg-subtle] ${className}`}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

TableHeader.displayName = 'TableHeader';

/**
 * Table Body
 */
interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <tbody ref={ref} className={className} {...props}>
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = 'TableBody';

/**
 * Table Row
 */
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  /** Highlight row on hover */
  hoverable?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, hoverable = true, className = '', ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={`
          border-b border-[--color-border]
          ${hoverable ? 'hover:bg-[--color-bg-subtle] transition-colors duration-[--transition-fast]' : ''}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

/**
 * Table Head Cell
 */
interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
  /** Sortable column */
  sortable?: boolean;
  /** Sort direction */
  sortDirection?: 'asc' | 'desc' | null;
  /** On sort click */
  onSort?: () => void;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ children, sortable = false, sortDirection, onSort, className = '', ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={`
          py-3 px-4
          text-left text-[11px] font-semibold uppercase tracking-wide
          text-[--color-text-secondary]
          ${sortable ? 'cursor-pointer select-none hover:text-[--color-text]' : ''}
          ${className}
        `.trim()}
        onClick={sortable ? onSort : undefined}
        {...props}
      >
        <div className="flex items-center gap-1">
          {children}
          {sortable && (
            <span className="text-[--color-text-muted]">
              {sortDirection === 'asc' ? (
                <SortAscIcon />
              ) : sortDirection === 'desc' ? (
                <SortDescIcon />
              ) : (
                <SortIcon />
              )}
            </span>
          )}
        </div>
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

/**
 * Table Cell
 */
interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={`py-3 px-4 text-[--color-text] ${className}`}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';

/**
 * Table Wrapper - Adds border and rounded corners
 */
interface TableWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function TableWrapper({ children, className = '', ...props }: TableWrapperProps) {
  return (
    <div
      className={`
        bg-[--color-bg-elevated]
        border border-[--color-border]
        rounded-[--radius-sm]
        overflow-hidden
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Empty Table State
 */
interface TableEmptyProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function TableEmpty({
  title = 'No data',
  description = 'No items to display.',
  action,
}: TableEmptyProps) {
  return (
    <div className="py-12 px-4 text-center">
      <div className="mx-auto w-12 h-12 mb-4 text-[--color-text-muted]">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-[--text-base] font-medium text-[--color-text] mb-1">{title}</h3>
      <p className="text-[--text-sm] text-[--color-text-muted] mb-4">{description}</p>
      {action}
    </div>
  );
}

// Sort icons
function SortIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

function SortAscIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );
}

function SortDescIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
