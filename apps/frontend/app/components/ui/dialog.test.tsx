import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Dialog, DialogBody } from './dialog';

/**
 * Dialog unit tests
 *
 * Purpose:
 * - Ensure the modal renders reliably and can be dismissed.
 * - Guard against regressions where modals become non-interactive or non-dismissible.
 * - Verify we lock body scroll while a modal is open (common source of UX bugs).
 */
describe('Dialog', () => {
  it('renders children when open and locks body scroll', async () => {
    const onClose = vi.fn();

    const { unmount } = render(
      <Dialog open={true} onClose={onClose}>
        <DialogBody>Dialog content</DialogBody>
      </Dialog>
    );

    expect(screen.getByText('Dialog content')).toBeInTheDocument();

    // Scroll lock is applied via an effect; wait for it.
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden');
    });

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes on Escape and on backdrop click', async () => {
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open={true} onClose={onClose}>
        <DialogBody>Dialog content</DialogBody>
      </Dialog>
    );

    // Wait for the escape handler effect to be registered.
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden');
    });

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    // Clicking the overlay (outside the surface) should dismiss.
    const surface = container.querySelector('[role="dialog"]') as HTMLElement | null;
    expect(surface).not.toBeNull();
    fireEvent.click(surface!.parentElement!);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});

