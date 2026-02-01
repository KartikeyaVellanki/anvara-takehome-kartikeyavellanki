import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react';

/**
 * Shared input styles
 */
const baseInputStyles = `
  w-full
  bg-[--color-bg-elevated]
  text-[--color-text]
  border border-[--color-border]
  rounded-[--radius-sm]
  transition-colors duration-[--transition-fast]
  placeholder:text-[--color-text-muted]
  focus:outline-none focus:border-[--accent] focus:ring-1 focus:ring-[--accent]
  disabled:bg-[--color-bg-subtle] disabled:text-[--color-text-muted] disabled:cursor-not-allowed
`;

const inputSizeStyles = {
  sm: 'h-8 px-2.5 text-[--text-sm]',
  md: 'h-10 px-3 text-[--text-sm]',
  lg: 'h-12 px-4 text-[--text-base]',
};

/**
 * Label Component
 */
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
}

export function Label({ children, required, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`block text-[--text-sm] font-medium text-[--color-text] mb-1.5 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-[--error] ml-0.5">*</span>}
    </label>
  );
}

/**
 * Helper Text Component
 */
interface HelperTextProps {
  children: ReactNode;
  error?: boolean;
}

export function HelperText({ children, error = false }: HelperTextProps) {
  return (
    <p className={`mt-1.5 text-[--text-xs] ${error ? 'text-[--error]' : 'text-[--color-text-muted]'}`}>
      {children}
    </p>
  );
}

/**
 * Input Component
 */
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'md', error = false, leftElement, rightElement, className = '', ...props }, ref) => {
    const hasLeft = Boolean(leftElement);
    const hasRight = Boolean(rightElement);

    if (hasLeft || hasRight) {
      return (
        <div className="relative">
          {leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-text-muted]">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            className={`
              ${baseInputStyles}
              ${inputSizeStyles[size]}
              ${hasLeft ? 'pl-10' : ''}
              ${hasRight ? 'pr-10' : ''}
              ${error ? 'border-[--error] focus:border-[--error] focus:ring-[--error]' : ''}
              ${className}
            `.trim()}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[--color-text-muted]">
              {rightElement}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={`
          ${baseInputStyles}
          ${inputSizeStyles[size]}
          ${error ? 'border-[--error] focus:border-[--error] focus:ring-[--error]' : ''}
          ${className}
        `.trim()}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

/**
 * Textarea Component
 */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`
          ${baseInputStyles}
          px-3 py-2.5 text-[--text-sm]
          min-h-[100px] resize-y
          ${error ? 'border-[--error] focus:border-[--error] focus:ring-[--error]' : ''}
          ${className}
        `.trim()}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

/**
 * Select Component
 */
interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ size = 'md', error = false, children, className = '', ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={`
            ${baseInputStyles}
            ${inputSizeStyles[size]}
            pr-10 appearance-none cursor-pointer
            ${error ? 'border-[--error] focus:border-[--error] focus:ring-[--error]' : ''}
            ${className}
          `.trim()}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="h-4 w-4 text-[--color-text-muted]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

/**
 * Form Field - Combines label, input, and helper text
 */
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: ReactNode;
}

export function FormField({ label, required, error, helperText, children }: FormFieldProps) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      {children}
      {(error || helperText) && (
        <HelperText error={Boolean(error)}>{error || helperText}</HelperText>
      )}
    </div>
  );
}
