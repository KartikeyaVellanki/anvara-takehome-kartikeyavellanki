import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

/**
 * Material You (MD3) Button Component
 *
 * Key characteristics:
 * - Pill-shaped (rounded-full)
 * - State layers (opacity overlays for hover/active)
 * - Tactile feedback (scale on press)
 * - Smooth cubic-bezier easing
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
  // MD3 Native Variants
  // Filled button - Primary CTA
  filled: `
    bg-[--md-primary] text-[--md-on-primary]
    hover:bg-[--md-primary]/90 hover:shadow-md
    active:bg-[--md-primary]/80 active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--md-primary] focus-visible:ring-offset-2
  `,
  // Tonal button - Secondary actions
  tonal: `
    bg-[--md-secondary-container] text-[--md-on-secondary-container]
    hover:bg-[--md-secondary-container]/80 hover:shadow-sm
    active:bg-[--md-secondary-container]/70 active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--md-secondary] focus-visible:ring-offset-2
  `,
  // Outlined button - Tertiary actions
  outlined: `
    bg-transparent text-[--md-primary] border border-[--md-outline]
    hover:bg-[--md-primary]/5
    active:bg-[--md-primary]/10 active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--md-primary] focus-visible:ring-offset-2
  `,
  // Text button - Minimal emphasis
  text: `
    bg-transparent text-[--md-primary]
    hover:bg-[--md-primary]/10
    active:bg-[--md-primary]/5 active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--md-primary] focus-visible:ring-offset-2
  `,
  // Elevated button - With shadow
  elevated: `
    bg-[--md-surface-container-low] text-[--md-primary] shadow-md
    hover:bg-[--md-surface-container] hover:shadow-lg
    active:bg-[--md-surface-container-high] active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--md-primary] focus-visible:ring-offset-2
  `,
  // FAB - Floating Action Button (uses tertiary color)
  fab: `
    bg-[--md-tertiary] text-[--md-on-tertiary] shadow-lg
    hover:bg-[--md-tertiary]/90 hover:shadow-xl
    active:bg-[--md-tertiary]/80 active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--md-tertiary] focus-visible:ring-offset-2
  `,
  
  // Legacy Aliases (backwards compatibility)
  // Primary = Filled
  primary: `
    bg-[--md-primary] text-[--md-on-primary]
    hover:bg-[--md-primary]/90 hover:shadow-md
    active:bg-[--md-primary]/80 active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--md-primary] focus-visible:ring-offset-2
  `,
  // Secondary = Tonal
  secondary: `
    bg-[--md-secondary-container] text-[--md-on-secondary-container]
    hover:bg-[--md-secondary-container]/80 hover:shadow-sm
    active:bg-[--md-secondary-container]/70 active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--md-secondary] focus-visible:ring-offset-2
  `,
  // Ghost = Text
  ghost: `
    bg-transparent text-[--md-primary]
    hover:bg-[--md-primary]/10
    active:bg-[--md-primary]/5 active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--md-primary] focus-visible:ring-offset-2
  `,
  // Danger = Error filled
  danger: `
    bg-[--md-error] text-[--md-on-error]
    hover:bg-[--md-error]/90 hover:shadow-md
    active:bg-[--md-error]/80 active:scale-95
    focus-visible:ring-2 focus-visible:ring-[--md-error] focus-visible:ring-offset-2
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[--text-label-medium] gap-1.5',
  md: 'h-10 px-6 text-[--text-label-large] gap-2',
  lg: 'h-12 px-8 text-[--text-body-large] gap-2',
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
        rounded-full font-medium
        transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]
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
        transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]
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
          bg-[--md-tertiary] text-[--md-on-tertiary] shadow-lg
          hover:bg-[--md-tertiary]/90 hover:shadow-xl
          active:bg-[--md-tertiary]/80 active:scale-95
          transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]
          disabled:opacity-50 disabled:cursor-not-allowed
          font-medium text-[--text-label-large]
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
        bg-[--md-tertiary] text-[--md-on-tertiary] shadow-lg
        hover:bg-[--md-tertiary]/90 hover:shadow-xl
        active:bg-[--md-tertiary]/80 active:scale-95
        transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]
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
