/**
 * Futuristic premium Skeleton Components
 *
 * Soft shimmer blocks on glassy surfaces.
 */

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const roundedStyles = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
};

export function Skeleton({ 
  width = '100%', 
  height = 16, 
  className = '',
  rounded = 'md'
}: SkeletonProps) {
  return (
    <div
      className={`
        animate-pulse bg-[--glass-strong]
        ${roundedStyles[rounded]}
        ${className}
      `}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

/**
 * TextSkeleton - For text content
 */
interface TextSkeletonProps {
  lines?: number;
  className?: string;
}

export function TextSkeleton({ lines = 3, className = '' }: TextSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          width={i === lines - 1 ? '75%' : '100%'}
          rounded="sm"
        />
      ))}
    </div>
  );
}

/**
 * CardSkeleton - For card placeholders
 */
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-[--glass-border] bg-[--glass] p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <Skeleton height={24} width="60%" rounded="sm" />
        <Skeleton height={24} width={80} rounded="full" />
      </div>
      <TextSkeleton lines={2} />
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-[--glass-border]">
        <Skeleton height={24} width={80} rounded="full" />
        <Skeleton height={36} width={100} rounded="full" />
      </div>
    </div>
  );
}

/**
 * TableRowSkeleton - For table row placeholders
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b border-[--glass-border]">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <Skeleton height={16} width={i === 0 ? '70%' : '50%'} rounded="sm" />
        </td>
      ))}
    </tr>
  );
}

/**
 * TableSkeleton - Full table skeleton
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-2xl border border-[--glass-border] bg-[--glass] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[--glass-border] bg-[--glass-strong]">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-4 text-left">
                <Skeleton height={14} width="60%" rounded="sm" />
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
 * StatsCardSkeleton - For stats card placeholders
 */
export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[--glass-border] bg-[--glass] p-6">
      <Skeleton height={12} width={80} rounded="sm" className="mb-3" />
      <Skeleton height={32} width={100} rounded="sm" className="mb-2" />
      <Skeleton height={14} width="60%" rounded="sm" />
    </div>
  );
}

/**
 * AvatarSkeleton - For profile pictures
 */
export function AvatarSkeleton({ size = 40 }: { size?: number }) {
  return <Skeleton width={size} height={size} rounded="full" />;
}

/**
 * ListItemSkeleton - For list item placeholders
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3">
      <AvatarSkeleton />
      <div className="flex-1">
        <Skeleton height={16} width="40%" rounded="sm" className="mb-2" />
        <Skeleton height={14} width="60%" rounded="sm" />
      </div>
    </div>
  );
}
