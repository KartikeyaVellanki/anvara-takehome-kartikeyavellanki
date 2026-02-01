import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
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
  primary: `
    bg-[--accent] text-white
    hover:bg-[--accent-hover]
    active:bg-[--accent-hover]
    disabled:bg-[--gray-300] disabled:text-[--gray-500]
  `,
  secondary: `
    bg-transparent text-[--color-text]
    border border-[--color-border]
    hover:bg-[--color-bg-subtle] hover:border-[--color-text-muted]
    active:bg-[--color-bg-subtle]
    disabled:text-[--color-text-muted] disabled:border-[--color-border]
  `,
  ghost: `
    bg-transparent text-[--color-text-secondary]
    hover:bg-[--color-bg-subtle] hover:text-[--color-text]
    active:bg-[--color-bg-subtle]
    disabled:text-[--color-text-muted]
  `,
  danger: `
    bg-[--error] text-white
    hover:bg-red-700
    active:bg-red-800
    disabled:bg-[--gray-300] disabled:text-[--gray-500]
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[--text-sm] gap-1.5',
  md: 'h-10 px-4 text-[--text-sm] gap-2',
  lg: 'h-12 px-6 text-[--text-base] gap-2',
};

/**
 * Button Component
 * 
 * A versatile button with multiple variants and sizes.
 * Follows Swiss minimalist design with sharp corners and clear hierarchy.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center
          font-medium
          rounded-[--radius-sm]
          transition-colors duration-[--transition-fast]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--accent] focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-60
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `.trim()}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner size={size} />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * Loading spinner for button loading state
 */
function LoadingSpinner({ size }: { size: ButtonSize }) {
  const sizeMap = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <svg
      className={`animate-spin ${sizeMap[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * IconButton - Square button for icon-only actions
 */
interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: ReactNode;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', className = '', ...props }, ref) => {
    const sizeMap = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
    };

    return (
      <Button
        ref={ref}
        size={size}
        className={`${sizeMap[size]} !px-0 ${className}`}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
