import { type HTMLAttributes, type ReactNode } from 'react';

/**
 * Material You (MD3) Badge/Chip Component
 *
 * Key characteristics:
 * - Pill-shaped (rounded-full)
 * - Uses tonal container colors
 * - Small, compact sizing
 */

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'accent';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[--md-surface-container-high] text-[--md-on-surface]',
  primary: 'bg-[--md-primary-container] text-[--md-on-primary-container]',
  secondary: 'bg-[--md-secondary-container] text-[--md-on-secondary-container]',
  success: 'bg-[--md-success-container] text-[--md-on-success-container]',
  error: 'bg-[--md-error-container] text-[--md-on-error-container]',
  warning: 'bg-[--md-warning-container] text-[--md-on-warning-container]',
  accent: 'bg-[--md-tertiary-container] text-[--md-on-tertiary-container]',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-[--md-outline]',
  primary: 'bg-[--md-primary]',
  secondary: 'bg-[--md-secondary]',
  success: 'bg-[--md-success]',
  error: 'bg-[--md-error]',
  warning: 'bg-[--md-warning]',
  accent: 'bg-[--md-tertiary]',
};

export function Badge({ variant = 'default', dot = false, children, className = '', ...props }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full px-3 py-1
        text-[--text-label-small] font-medium
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
            ? 'bg-[--md-secondary-container] text-[--md-on-secondary-container]'
            : 'bg-[--md-surface] text-[--md-on-surface-variant] border border-[--md-outline]'
        }
        hover:shadow-sm
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
