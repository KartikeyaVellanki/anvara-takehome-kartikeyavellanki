import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

/**
 * Material You (MD3) Card Component
 *
 * Key characteristics:
 * - Tonal surface backgrounds (not pure white)
 * - Large organic border radius (24px)
 * - Subtle elevation through shadows
 * - Smooth hover transitions with scale
 */

type CardVariant = 'elevated' | 'filled' | 'outlined';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  // Elevated - Default card with shadow
  elevated: `
    bg-[--md-surface] shadow-md
    hover:shadow-lg
  `,
  // Filled - Tonal surface background
  filled: `
    bg-[--md-surface-container] shadow-sm
    hover:shadow-md
  `,
  // Outlined - Border instead of shadow
  outlined: `
    bg-[--md-surface] border border-[--md-outline-variant]
    hover:border-[--md-outline]
  `,
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'filled', interactive = false, children, className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`
        rounded-3xl overflow-hidden
        transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]
        ${variantStyles[variant]}
        ${interactive ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});

/**
 * CardHeader - Header section of a card
 */
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { children, className = '', ...props },
  ref
) {
  return (
    <div ref={ref} className={`px-6 pt-6 pb-4 ${className}`} {...props}>
      {children}
    </div>
  );
});

/**
 * CardTitle - Title text in card header
 */
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { as: Component = 'h3', children, className = '', ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={`text-[--text-title-large] font-medium text-[--md-on-surface] leading-tight ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

/**
 * CardDescription - Subtitle/description text
 */
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ children, className = '', ...props }, ref) {
    return (
      <p
        ref={ref}
        className={`mt-1 text-[--text-body-medium] text-[--md-on-surface-variant] ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  }
);

/**
 * CardContent - Main content area of a card
 */
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { children, className = '', ...props },
  ref
) {
  return (
    <div ref={ref} className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
});

/**
 * CardFooter - Footer section with actions
 */
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { children, className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`flex items-center gap-2 px-6 pb-6 pt-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

/**
 * CardMedia - Image/media section at top of card
 */
interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  aspectRatio?: 'video' | 'square' | 'wide';
  children?: ReactNode;
}

const aspectRatioStyles = {
  video: 'aspect-video',
  square: 'aspect-square',
  wide: 'aspect-[21/9]',
};

export const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(function CardMedia(
  { src, alt, aspectRatio = 'video', children, className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${aspectRatioStyles[aspectRatio]} ${className}`}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || ''}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[--md-surface-container-high]">
          {children}
        </div>
      )}
    </div>
  );
});

/**
 * StatsCard - Specialized card for displaying metrics
 * Material You style with tonal background
 */
interface StatsCardProps {
  label: string;
  value: string;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
}

export function StatsCard({ label, value, subtext, trend, icon }: StatsCardProps) {
  const trendColors = {
    up: 'text-[--md-success]',
    down: 'text-[--md-error]',
    neutral: 'text-[--md-on-surface-variant]',
  };

  return (
    <Card variant="filled" className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[--text-label-medium] font-medium text-[--md-on-surface-variant] uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-2 text-[--text-headline-large] font-medium text-[--md-on-surface]">
            {value}
          </p>
          {subtext && (
            <p className={`mt-1 text-[--text-body-medium] ${trend ? trendColors[trend] : 'text-[--md-on-surface-variant]'}`}>
              {subtext}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[--md-primary-container] text-[--md-on-primary-container]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
