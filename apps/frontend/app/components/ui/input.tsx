import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react';

/**
 * Futuristic premium Input Components
 *
 * Key characteristics:
 * - Glassy surfaces with soft borders
 * - Clear focus rings
 * - Touch-friendly sizing
 */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error = false, leftElement, rightElement, className = '', ...props },
  ref
) {
  return (
    <div className="relative">
      {leftElement && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-text-muted]">
          {leftElement}
        </div>
      )}
      <input
        ref={ref}
        className={`
          w-full h-11
          bg-[--glass] text-[--color-text]
          rounded-xl
          border border-[--glass-border]
          px-4
          text-[--text-base]
          transition-all duration-200 ease-out
          placeholder:text-[--color-text-muted]
          backdrop-blur-xl
          hover:border-[--accent]/40
          focus:outline-none focus:border-[--accent]/70 focus:ring-2 focus:ring-[--accent]/25
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-[--error] focus:border-[--error] focus:ring-[--error]/25' : ''}
          ${leftElement ? 'pl-12' : ''}
          ${rightElement ? 'pr-12' : ''}
          ${className}
        `}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[--color-text-muted]">
          {rightElement}
        </div>
      )}
    </div>
  );
});

/**
 * Textarea - Multi-line text input
 */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error = false, className = '', ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={`
        w-full min-h-[120px]
        bg-[--glass] text-[--color-text]
        rounded-xl
        border border-[--glass-border]
        px-4 py-3
        text-[--text-base]
        transition-all duration-200 ease-out
        placeholder:text-[--color-text-muted]
        backdrop-blur-xl
        hover:border-[--accent]/40
        focus:outline-none focus:border-[--accent]/70 focus:ring-2 focus:ring-[--accent]/25
        disabled:opacity-50 disabled:cursor-not-allowed
        resize-y
        ${error ? 'border-[--error] focus:border-[--error] focus:ring-[--error]/25' : ''}
        ${className}
      `}
      {...props}
    />
  );
});

/**
 * Select - Dropdown selection
 */
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { error = false, className = '', children, ...props },
  ref
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={`
          w-full h-11
          bg-[--glass] text-[--color-text]
          rounded-xl
          border border-[--glass-border]
          px-4 pr-10
          text-[--text-base]
          appearance-none cursor-pointer
          transition-all duration-200 ease-out
          backdrop-blur-xl
          hover:border-[--accent]/40
          focus:outline-none focus:border-[--accent]/70 focus:ring-2 focus:ring-[--accent]/25
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-[--error] focus:border-[--error] focus:ring-[--error]/25' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {/* Dropdown arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[--color-text-muted]">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
});

/**
 * Label - Form field label
 */
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: ReactNode;
}

export function Label({ required = false, children, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`block mb-2 text-[--text-label-large] font-semibold text-[--color-text] ${className}`}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-[--error]">*</span>}
    </label>
  );
}

/**
 * HelperText - Supporting text below inputs
 */
interface HelperTextProps {
  error?: boolean;
  children: ReactNode;
}

export function HelperText({ error = false, children }: HelperTextProps) {
  return (
    <p
      className={`mt-1.5 text-[--text-label-medium] ${
        error ? 'text-[--error]' : 'text-[--color-text-muted]'
      }`}
    >
      {children}
    </p>
  );
}

/**
 * FormField - Wrapper for label + input + helper text
 */
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({ label, required = false, error, hint, children }: FormFieldProps) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      {children}
      {error && <HelperText error>{error}</HelperText>}
      {!error && hint && <HelperText>{hint}</HelperText>}
    </div>
  );
}

/**
 * SearchInput - Specialized search input with icon
 */
interface SearchInputProps extends Omit<InputProps, 'leftElement'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { onClear, value, className = '', ...props },
  ref
) {
  return (
    <Input
      ref={ref}
      type="search"
      value={value}
      leftElement={
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      rightElement={
        value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded-full hover:bg-[--glass-strong] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : undefined
      }
      className={className}
      {...props}
    />
  );
});
