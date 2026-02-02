import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

/**
 * Button unit tests
 *
 * Purpose:
 * - When a button enters a loading state we still keep the label visible, avoiding
 *   "blank" CTAs that look broken to users.
 */
describe('Button', () => {
  it('keeps the label visible while loading', () => {
    const { container } = render(<Button isLoading>Submit</Button>);

    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).not.toBeNull();

    const el = container.querySelector('button');
    expect(el?.getAttribute('aria-busy')).toBe('true');
  });
});

