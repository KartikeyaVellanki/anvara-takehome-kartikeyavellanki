'use client';

import { useEffect, type ReactNode } from 'react';
import { Button } from './button';

/**
 * Futuristic premium Dialog Component
 *
 * Glassy surface, soft borders, and focused contrast.
 */

interface DialogProps {
  open: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Dialog({ open, onClose, size = 'md', children }: DialogProps) {
  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Scrim (backdrop) */}
      <div className="fixed inset-0 bg-[--scrim] animate-in fade-in duration-200" />

      <div
        className="relative flex min-h-full items-start justify-center p-4 py-10"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Dialog surface */}
        <div
          className={`
            relative w-full ${sizeStyles[size]}
            max-h-[calc(100vh-5rem)]
            overflow-hidden
            rounded-2xl
            border border-[--modal-border]
            bg-[--modal-bg]
            shadow-[0_18px_60px_rgba(0,0,0,0.55)]
            backdrop-blur-2xl
            flex flex-col
            animate-in fade-in zoom-in-95 duration-300 ease-[cubic-bezier(0.2,0,0,1)]
          `}
          role="dialog"
          aria-modal="true"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent"
          />
          <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * DialogHeader - Header with title and optional close button
 */
interface DialogHeaderProps {
  onClose?: () => void;
  children: ReactNode;
}

export function DialogHeader({ onClose, children }: DialogHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full text-[--color-text-secondary]
            hover:bg-white/10
            transition-colors duration-200
          "
          aria-label="Close dialog"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * DialogTitle - Title text
 */
interface DialogTitleProps {
  children: ReactNode;
}

export function DialogTitle({ children }: DialogTitleProps) {
  return (
    <h2 className="text-[--text-headline-medium] font-semibold text-[--color-text]">
      {children}
    </h2>
  );
}

/**
 * DialogDescription - Supporting text below title
 */
interface DialogDescriptionProps {
  children: ReactNode;
}

export function DialogDescription({ children }: DialogDescriptionProps) {
  return (
    <p className="mt-2 text-[--text-body-medium] text-[--color-text-secondary]">
      {children}
    </p>
  );
}

/**
 * DialogBody - Main content area
 */
interface DialogBodyProps {
  className?: string;
  children: ReactNode;
}

export function DialogBody({ className = '', children }: DialogBodyProps) {
  return (
    <div className={`min-h-0 flex-1 overflow-y-auto px-6 py-5 ${className}`}>
      {children}
    </div>
  );
}

/**
 * DialogFooter - Action buttons area
 */
interface DialogFooterProps {
  children: ReactNode;
}

export function DialogFooter({ children }: DialogFooterProps) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-white/10 px-6 py-5">
      {children}
    </div>
  );
}

/**
 * ConfirmDialog - Pre-built confirmation dialog
 */
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
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
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="text" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'filled' : 'filled'}
          onClick={onConfirm}
          isLoading={isLoading}
          className={variant === 'danger' ? 'bg-[--error] hover:bg-[--error]/90' : ''}
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

/**
 * FullScreenDialog - For mobile or large content
 */
interface FullScreenDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function FullScreenDialog({ open, onClose, title, children }: FullScreenDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[--color-bg]">
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-[--glass-border] px-4 h-16">
        <button
          onClick={onClose}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full text-[--color-text]
            hover:bg-[--glass-strong]
            transition-colors duration-200
          "
          aria-label="Close"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-[--text-title-large] font-semibold text-[--color-text]">
          {title}
        </h2>
      </header>
      {/* Content */}
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
