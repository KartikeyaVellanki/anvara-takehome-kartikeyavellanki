import { type HTMLAttributes, type ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'accent';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  /** Optional dot indicator */
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[--color-bg-subtle] text-[--color-text-secondary] border-[--color-border]',
  success: 'bg-[--success-light] text-green-800 border-green-200',
  warning: 'bg-[--warning-light] text-yellow-800 border-yellow-200',
  error: 'bg-[--error-light] text-red-800 border-red-200',
  accent: 'bg-[--accent-muted] text-[--accent] border-teal-200',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-[--color-text-muted]',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  error: 'bg-red-600',
  accent: 'bg-[--accent]',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-[11px]',
};

/**
 * Badge Component
 * 
 * Status indicator with semantic colors.
 * Uses subtle backgrounds with clear text contrast.
 */
export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium uppercase tracking-wide
        border rounded-[--radius-sm]
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `.trim()}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

/**
 * Status Badge - Predefined badges for common statuses
 */
type StatusType = 'active' | 'inactive' | 'pending' | 'completed' | 'draft' | 'paused' | 'available' | 'booked';

const statusConfig: Record<StatusType, { variant: BadgeVariant; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'default', label: 'Inactive' },
  pending: { variant: 'warning', label: 'Pending' },
  completed: { variant: 'accent', label: 'Completed' },
  draft: { variant: 'default', label: 'Draft' },
  paused: { variant: 'warning', label: 'Paused' },
  available: { variant: 'success', label: 'Available' },
  booked: { variant: 'accent', label: 'Booked' },
};

interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  status: StatusType;
}

export function StatusBadge({ status, ...props }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} dot {...props}>
      {config.label}
    </Badge>
  );
}

/**
 * Type Badge - For ad slot types
 */
type AdSlotType = 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST';

const typeConfig: Record<AdSlotType, { label: string }> = {
  DISPLAY: { label: 'Display' },
  VIDEO: { label: 'Video' },
  NATIVE: { label: 'Native' },
  NEWSLETTER: { label: 'Newsletter' },
  PODCAST: { label: 'Podcast' },
};

interface TypeBadgeProps extends Omit<BadgeProps, 'children'> {
  type: AdSlotType;
}

export function TypeBadge({ type, ...props }: TypeBadgeProps) {
  const config = typeConfig[type];
  return (
    <Badge variant="default" {...props}>
      {config.label}
    </Badge>
  );
}
