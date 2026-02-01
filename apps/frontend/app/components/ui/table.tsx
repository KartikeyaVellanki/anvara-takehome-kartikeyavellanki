import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes, type ReactNode } from 'react';

/**
 * Material You (MD3) Table Components
 *
 * Key characteristics:
 * - Large border radius on container
 * - Tonal surface backgrounds
 * - Subtle row hover states
 * - Proper spacing and typography
 */

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { children, className = '', ...props },
  ref
) {
  return (
    <div className="rounded-3xl bg-[--md-surface-container] overflow-hidden">
      <div className="overflow-x-auto">
        <table ref={ref} className={`w-full ${className}`} {...props}>
          {children}
        </table>
      </div>
    </div>
  );
});

/**
 * TableHeader - Table header section
 */
interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader({ children, className = '', ...props }, ref) {
    return (
      <thead
        ref={ref}
        className={`bg-[--md-surface-container-high] ${className}`}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

/**
 * TableBody - Table body section
 */
interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ children, className = '', ...props }, ref) {
    return (
      <tbody ref={ref} className={className} {...props}>
        {children}
      </tbody>
    );
  }
);

/**
 * TableRow - Table row
 */
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  hoverable?: boolean;
  children: ReactNode;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { hoverable = true, children, className = '', ...props },
  ref
) {
  return (
    <tr
      ref={ref}
      className={`
        border-b border-[--md-outline-variant] last:border-b-0
        transition-colors duration-200
        ${hoverable ? 'hover:bg-[--md-surface-container-high]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </tr>
  );
});

/**
 * TableHead - Table header cell
 */
interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
  children: ReactNode;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { sortable = false, sortDirection, onSort, children, className = '', ...props },
  ref
) {
  return (
    <th
      ref={ref}
      className={`
        px-4 py-4 text-left
        text-[--text-label-large] font-medium text-[--md-on-surface-variant]
        ${sortable ? 'cursor-pointer select-none hover:text-[--md-on-surface]' : ''}
        ${className}
      `}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && sortDirection && (
          <span className="text-[--md-primary]">
            {sortDirection === 'asc' ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </span>
        )}
      </div>
    </th>
  );
});

/**
 * TableCell - Table data cell
 */
interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { children, className = '', ...props },
  ref
) {
  return (
    <td
      ref={ref}
      className={`px-4 py-4 text-[--text-body-medium] text-[--md-on-surface] ${className}`}
      {...props}
    >
      {children}
    </td>
  );
});

/**
 * TableEmpty - Empty state for tables
 */
interface TableEmptyProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  colSpan?: number;
}

export function TableEmpty({ icon, title, description, action, colSpan = 4 }: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center">
          {icon && (
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[--md-surface-container-high] text-[--md-on-surface-variant]">
              {icon}
            </div>
          )}
          <h3 className="mb-2 text-[--text-title-large] font-medium text-[--md-on-surface]">
            {title}
          </h3>
          {description && (
            <p className="mb-6 max-w-sm text-[--text-body-medium] text-[--md-on-surface-variant]">
              {description}
            </p>
          )}
          {action}
        </div>
      </td>
    </tr>
  );
}

/**
 * TablePagination - Pagination controls for table
 */
interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export function TablePagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
}: TablePaginationProps) {
  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems || page * itemsPerPage);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[--md-outline-variant]">
      <div className="text-[--text-body-medium] text-[--md-on-surface-variant]">
        {totalItems ? (
          <span>
            {startItem}&ndash;{endItem} of {totalItems}
          </span>
        ) : (
          <span>Page {page} of {totalPages}</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full text-[--md-on-surface-variant]
            hover:bg-[--md-on-surface-variant]/10
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
          "
          aria-label="Previous page"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full text-[--md-on-surface-variant]
            hover:bg-[--md-on-surface-variant]/10
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
          "
          aria-label="Next page"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
