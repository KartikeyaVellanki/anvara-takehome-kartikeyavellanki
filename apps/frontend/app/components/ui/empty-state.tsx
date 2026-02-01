import { type ReactNode } from 'react';

interface EmptyStateProps {
  /** Icon to display */
  icon?: ReactNode;
  /** Main title */
  title: string;
  /** Supporting description */
  description?: string;
  /** Call to action */
  action?: ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: {
    icon: 'w-10 h-10',
    title: 'text-[--text-base]',
    description: 'text-[--text-sm]',
    padding: 'py-8 px-4',
  },
  md: {
    icon: 'w-12 h-12',
    title: 'text-[--text-lg]',
    description: 'text-[--text-sm]',
    padding: 'py-12 px-6',
  },
  lg: {
    icon: 'w-16 h-16',
    title: 'text-[--text-xl]',
    description: 'text-[--text-base]',
    padding: 'py-16 px-8',
  },
};

/**
 * EmptyState Component
 *
 * Display when there's no content.
 * Clean, helpful, with clear next action.
 */
export function EmptyState({ icon, title, description, action, size = 'md' }: EmptyStateProps) {
  const styles = sizeStyles[size];

  return (
    <div className={`text-center ${styles.padding}`}>
      {icon && (
        <div className={`mx-auto mb-4 ${styles.icon} text-[--color-text-muted]`}>{icon}</div>
      )}
      <h3 className={`font-display font-semibold text-[--color-text] ${styles.title}`}>{title}</h3>
      {description && (
        <p className={`mt-2 text-[--color-text-secondary] max-w-sm mx-auto ${styles.description}`}>
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/**
 * Common empty state icons
 */
export const EmptyStateIcons = {
  inbox: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  ),
  search: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  folder: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  ),
  document: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  chart: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  users: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  cart: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
};
