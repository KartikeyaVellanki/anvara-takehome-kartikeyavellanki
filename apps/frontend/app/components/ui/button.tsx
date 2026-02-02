import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

/**
 * Futuristic premium Button Component
 *
 * Key characteristics:
 * - Pill-shaped, confident emphasis
 * - Glassy secondary surfaces
 * - Subtle glow on primary actions
 */

// MD3 variants + backwards-compatible aliases
type ButtonVariant = 
  | 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated' | 'fab'  // MD3 native
  | 'primary' | 'secondary' | 'ghost' | 'danger';  // Legacy aliases
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  // Primary CTA
  filled: `
    bg-[--accent] text-[--md-on-primary]
    hover:bg-[--accent]/90 hover:shadow-glow
    active:bg-[--accent]/85 active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--accent]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]
  `,
  // Secondary actions
  tonal: `
    bg-[--glass] text-[--color-text] border border-[--glass-border] backdrop-blur
    hover:bg-[--glass-strong]
    active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--accent]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]
  `,
  // Outlined button
  outlined: `
    bg-transparent text-[--color-text] border border-[--glass-border]
    hover:border-[--accent]/60 hover:text-[--accent]
    active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--accent]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]
  `,
  // Text button
  text: `
    bg-transparent text-[--accent]
    hover:bg-[--accent]/10
    active:bg-[--accent]/5 active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--accent]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]
  `,
  // Elevated button
  elevated: `
    bg-[--glass-strong] text-[--color-text] border border-[--glass-border] shadow-float backdrop-blur-xl
    hover:bg-[--glass]
    active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--accent]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]
  `,
  // FAB
  fab: `
    bg-[--accent-2] text-[--md-on-tertiary] shadow-float
    hover:bg-[--accent-2]/90
    active:bg-[--accent-2]/85 active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--accent-2]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]
  `,

  // Legacy aliases
  primary: `
    bg-[--accent] text-[--md-on-primary]
    hover:bg-[--accent]/90 hover:shadow-glow
    active:bg-[--accent]/85 active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--accent]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]
  `,
  secondary: `
    bg-[--glass] text-[--color-text] border border-[--glass-border] backdrop-blur
    hover:bg-[--glass-strong]
    active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--accent]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]
  `,
  ghost: `
    bg-transparent text-[--accent]
    hover:bg-[--accent]/10
    active:bg-[--accent]/5 active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--accent]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]
  `,
  danger: `
    bg-[--error] text-white
    hover:bg-[--error]/90
    active:bg-[--error]/85 active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--error]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[--text-sm] gap-1.5',
  md: 'h-10 px-6 text-[--text-sm] gap-2',
  lg: 'h-12 px-8 text-[--text-base] gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'filled',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    disabled,
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        rounded-full font-semibold tracking-[0.01em]
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

/**
 * IconButton - For icon-only actions
 * Square aspect ratio with pill rounding
 */
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Exclude<ButtonVariant, 'fab'>;
  size?: ButtonSize;
  label: string;
  children: ReactNode;
}

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 w-9',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'text', size = 'md', label, children, className = '', disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      aria-label={label}
      className={`
        inline-flex items-center justify-center
        rounded-full
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantStyles[variant]}
        ${iconSizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
});

/**
 * FAB - Floating Action Button
 * Large, prominent action button
 */
interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  extended?: boolean;
  icon: ReactNode;
  label?: string;
}

const fabSizeStyles = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-24 w-24',
};

export const FAB = forwardRef<HTMLButtonElement, FABProps>(function FAB(
  { size = 'md', extended = false, icon, label, className = '', disabled, ...props },
  ref
) {
  if (extended && label) {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center gap-3
          h-14 px-4 rounded-2xl
          bg-[--accent-2] text-[--md-on-tertiary] shadow-float
          hover:bg-[--accent-2]/90
          active:bg-[--accent-2]/85 active:scale-95
          transition-all duration-200 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed
          font-semibold text-[--text-label-large]
          ${className}
        `}
        {...props}
      >
        <span className="shrink-0">{icon}</span>
        {label}
      </button>
    );
  }

  return (
    <button
      ref={ref}
      disabled={disabled}
      aria-label={label}
      className={`
        inline-flex items-center justify-center
        rounded-2xl
        bg-[--accent-2] text-[--md-on-tertiary] shadow-float
        hover:bg-[--accent-2]/90
        active:bg-[--accent-2]/85 active:scale-95
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${fabSizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
});
