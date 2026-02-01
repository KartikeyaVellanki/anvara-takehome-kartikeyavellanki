import { type HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Make it circular */
  circle?: boolean;
}

/**
 * Skeleton Component
 *
 * Loading placeholder with subtle animation.
 * Swiss minimal style: clean, no distracting effects.
 */
export function Skeleton({
  width,
  height,
  circle = false,
  className = '',
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={`
        bg-[--color-bg-subtle]
        animate-pulse
        ${circle ? 'rounded-full' : 'rounded-[--radius-sm]'}
        ${className}
      `.trim()}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * Text Skeleton - For placeholder text lines
 */
interface TextSkeletonProps {
  lines?: number;
  /** Last line is shorter */
  lastLineWidth?: string;
}

export function TextSkeleton({ lines = 3, lastLineWidth = '60%' }: TextSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={14} width={i === lines - 1 ? lastLineWidth : '100%'} />
      ))}
    </div>
  );
}

/**
 * Card Skeleton - For placeholder cards
 */
export function CardSkeleton() {
  return (
    <div className="bg-[--color-bg-elevated] border border-[--color-border] rounded-[--radius-sm] p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <Skeleton height={20} width={140} />
          <Skeleton height={14} width={80} />
        </div>
        <Skeleton height={24} width={60} />
      </div>
      <Skeleton height={14} width="100%" className="mb-2" />
      <Skeleton height={14} width="70%" className="mb-4" />
      <div className="flex items-center justify-between pt-4 border-t border-[--color-border]">
        <Skeleton height={14} width={100} />
        <Skeleton height={32} width={80} />
      </div>
    </div>
  );
}

/**
 * Table Row Skeleton
 */
interface TableRowSkeletonProps {
  columns: number;
}

export function TableRowSkeleton({ columns }: TableRowSkeletonProps) {
  return (
    <tr className="border-b border-[--color-border]">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton height={14} width={i === 0 ? '80%' : '60%'} />
        </td>
      ))}
    </tr>
  );
}

/**
 * Table Skeleton
 */
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <div className="bg-[--color-bg-elevated] border border-[--color-border] rounded-[--radius-sm] overflow-hidden">
      <table className="w-full">
        <thead className="bg-[--color-bg-subtle]">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="py-3 px-4 text-left">
                <Skeleton height={12} width={80} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Stats Card Skeleton
 */
export function StatsCardSkeleton() {
  return (
    <div className="bg-[--color-bg-elevated] border border-[--color-border] rounded-[--radius-sm] p-5">
      <Skeleton height={12} width={80} className="mb-2" />
      <Skeleton height={32} width={120} className="mb-1" />
      <Skeleton height={12} width={60} />
    </div>
  );
}
