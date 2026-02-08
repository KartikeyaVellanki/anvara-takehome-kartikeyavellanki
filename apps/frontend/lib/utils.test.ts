import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  cn,
  debounce,
  deepClone,
  formatPrice,
  formatRelativeTime,
  isClient,
  parseQueryString,
  truncate,
} from './utils.js';

describe('frontend utils', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('formatPrice uses Intl.NumberFormat with USD currency', () => {
    const expected = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(1234.5);

    expect(formatPrice(1234.5)).toBe(expected);
  });

  it('debounce delays execution and uses the last arguments', () => {
    // Fake timers keep the test fast and deterministic.
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced('first');
    debounced('second');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(199);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('second');
  });

  it('parseQueryString parses query params into a record', () => {
    expect(parseQueryString('a=1&b=two')).toEqual({ a: '1', b: 'two' });
    expect(parseQueryString('')).toEqual({});
  });

  it('truncate returns original text when under max length and appends ellipsis otherwise', () => {
    expect(truncate('short', 10)).toBe('short');
    expect(truncate('this is long', 7)).toBe('this is...');
  });

  it('cn joins truthy class names and ignores falsy values', () => {
    expect(cn('a', false, undefined, 'b', null, '')).toBe('a b');
  });

  it('deepClone creates a separate copy for nested objects', () => {
    const original = { a: 1, nested: { b: 2 }, list: [1, 2, 3] };
    const clone = deepClone(original);

    clone.nested.b = 99;
    clone.list.push(4);

    expect(original.nested.b).toBe(2);
    expect(original.list).toEqual([1, 2, 3]);
  });

  it('formatRelativeTime returns relative strings for recent dates', () => {
    // Freeze time to make relative calculations deterministic.
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-10T12:00:00.000Z'));

    expect(formatRelativeTime('2024-01-10T00:00:00.000Z')).toBe('Today');
    expect(formatRelativeTime('2024-01-09T00:00:00.000Z')).toBe('Yesterday');
    expect(formatRelativeTime('2024-01-07T00:00:00.000Z')).toBe('3 days ago');

    const olderDate = '2024-01-01T00:00:00.000Z';
    const expected = new Date(olderDate).toLocaleDateString();
    expect(formatRelativeTime(olderDate)).toBe(expected);
  });

  it('isClient reflects the browser environment', () => {
    expect(isClient).toBe(true);
  });
});
