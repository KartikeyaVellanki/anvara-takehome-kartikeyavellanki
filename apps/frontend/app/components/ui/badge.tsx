import { type HTMLAttributes, type ReactNode } from 'react';

/**
 * Futuristic premium Badge/Chip Component
 *
 * Compact pills with subtle borders and crisp contrast.
 */

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'accent';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-transparent text-[--color-text-secondary] border border-[--glass-border]',
  primary: 'bg-transparent text-[--accent] border border-[--accent]/60',
  secondary: 'bg-transparent text-[--accent-2] border border-[--accent-2]/50',
  success: 'bg-transparent text-[--success] border border-[--success]/60',
  error: 'bg-transparent text-[--error] border border-[--error]/60',
  warning: 'bg-transparent text-[--warning] border border-[--warning]/60',
  accent: 'bg-transparent text-[--accent] border border-[--accent]/50',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-[--color-border]',
  primary: 'bg-[--accent]',
  secondary: 'bg-[--accent-2]',
  success: 'bg-[--success]',
  error: 'bg-[--error]',
  warning: 'bg-[--warning]',
  accent: 'bg-[--accent]',
};

export function Badge({ variant = 'default', dot = false, children, className = '', ...props }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full px-3 py-1
        text-[--text-label-small] font-semibold
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}

/**
 * StatusBadge - Pre-configured for availability status
 */
interface StatusBadgeProps {
  status: 'available' | 'booked' | 'pending' | 'active' | 'inactive';
}

const statusConfig: Record<StatusBadgeProps['status'], { variant: BadgeVariant; label: string; showDot: boolean }> = {
  available: { variant: 'success', label: 'Available', showDot: true },
  booked: { variant: 'default', label: 'Booked', showDot: false },
  pending: { variant: 'warning', label: 'Pending', showDot: true },
  active: { variant: 'success', label: 'Active', showDot: true },
  inactive: { variant: 'default', label: 'Inactive', showDot: false },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} dot={config.showDot}>
      {config.label}
    </Badge>
  );
}

/**
 * TypeBadge - Pre-configured for ad slot types
 * Uses secondary container for consistency
 */
interface TypeBadgeProps {
  type: 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST';
}

const typeConfig: Record<TypeBadgeProps['type'], { label: string; variant: BadgeVariant }> = {
  DISPLAY: { label: 'Display', variant: 'primary' },
  VIDEO: { label: 'Video', variant: 'error' },
  NATIVE: { label: 'Native', variant: 'success' },
  NEWSLETTER: { label: 'Newsletter', variant: 'secondary' },
  PODCAST: { label: 'Podcast', variant: 'warning' },
};

export function TypeBadge({ type }: TypeBadgeProps) {
  const config = typeConfig[type];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

/**
 * CampaignStatusBadge - Pre-configured for campaign statuses
 */
interface CampaignStatusBadgeProps {
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

const campaignStatusConfig: Record<CampaignStatusBadgeProps['status'], { variant: BadgeVariant; label: string; showDot: boolean }> = {
  DRAFT: { variant: 'default', label: 'Draft', showDot: false },
  ACTIVE: { variant: 'success', label: 'Active', showDot: true },
  PAUSED: { variant: 'warning', label: 'Paused', showDot: true },
  COMPLETED: { variant: 'primary', label: 'Completed', showDot: false },
};

export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const config = campaignStatusConfig[status];
  return (
    <Badge variant={config.variant} dot={config.showDot}>
      {config.label}
    </Badge>
  );
}

/**
 * Chip - Interactive badge (can be selected/deselected)
 * Used for filters, tags
 */
interface ChipProps extends HTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children: ReactNode;
}

export function Chip({
  selected = false,
  leadingIcon,
  trailingIcon,
  children,
  className = '',
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      className={`
        inline-flex items-center gap-2
        rounded-full px-4 py-2
        text-[--text-label-large] font-medium
        transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]
        active:scale-95
        ${
          selected
            ? 'bg-[--accent]/20 text-[--color-text] border border-[--accent]/50'
            : 'bg-[--glass] text-[--color-text-secondary] border border-[--glass-border]'
        }
        hover:shadow-glow
        ${className}
      `}
      {...props}
    >
      {leadingIcon && <span className="shrink-0 -ml-1">{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className="shrink-0 -mr-1">{trailingIcon}</span>}
    </button>
  );
}
