'use client';

import { useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Width of the dialog */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

/**
 * Dialog Component
 * 
 * Modal dialog with backdrop and keyboard support.
 * Swiss minimal: clean, focused, no excessive styling.
 */
export function Dialog({ open, onClose, children, size = 'md' }: DialogProps) {
  // Handle escape key
  const handleKeyDown = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Dialog panel */}
          <div
            className={`
              relative w-full ${sizeStyles[size]}
              bg-[--color-bg-elevated]
              border border-[--color-border]
              rounded-[--radius-md]
              shadow-[--shadow-lg]
              animate-in fade-in zoom-in-95 duration-150
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * Dialog Header
 */
interface DialogHeaderProps {
  children: ReactNode;
  onClose?: () => void;
}

export function DialogHeader({ children, onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[--color-border]">
      <div>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="
            p-1.5 -mr-1.5
            text-[--color-text-muted]
            hover:text-[--color-text]
            hover:bg-[--color-bg-subtle]
            rounded-[--radius-sm]
            transition-colors duration-[--transition-fast]
          "
          aria-label="Close dialog"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * Dialog Title
 */
interface DialogTitleProps {
  children: ReactNode;
}

export function DialogTitle({ children }: DialogTitleProps) {
  return (
    <h2 className="text-[--text-lg] font-display font-semibold text-[--color-text]">
      {children}
    </h2>
  );
}

/**
 * Dialog Description
 */
interface DialogDescriptionProps {
  children: ReactNode;
}

export function DialogDescription({ children }: DialogDescriptionProps) {
  return (
    <p className="mt-1 text-[--text-sm] text-[--color-text-secondary]">
      {children}
    </p>
  );
}

/**
 * Dialog Body
 */
interface DialogBodyProps {
  children: ReactNode;
  className?: string;
}

export function DialogBody({ children, className = '' }: DialogBodyProps) {
  return (
    <div className={`px-5 py-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Dialog Footer
 */
interface DialogFooterProps {
  children: ReactNode;
}

export function DialogFooter({ children }: DialogFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[--color-border] bg-[--color-bg-subtle]">
      {children}
    </div>
  );
}

/**
 * Confirm Dialog - Pre-built confirmation dialog
 */
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size="sm">
      <DialogHeader onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      {description && (
        <DialogBody>
          <p className="text-[--text-sm] text-[--color-text-secondary]">{description}</p>
        </DialogBody>
      )}
      <DialogFooter>
        <button
          onClick={onClose}
          disabled={isLoading}
          className="
            h-9 px-4
            text-[--text-sm] font-medium
            text-[--color-text-secondary]
            hover:text-[--color-text]
            hover:bg-[--color-bg-subtle]
            rounded-[--radius-sm]
            transition-colors duration-[--transition-fast]
            disabled:opacity-50
          "
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`
            h-9 px-4
            text-[--text-sm] font-medium text-white
            rounded-[--radius-sm]
            transition-colors duration-[--transition-fast]
            disabled:opacity-50
            ${variant === 'danger' ? 'bg-[--error] hover:bg-red-700' : 'bg-[--accent] hover:bg-[--accent-hover]'}
          `}
        >
          {isLoading ? 'Loading...' : confirmLabel}
        </button>
      </DialogFooter>
    </Dialog>
  );
}
