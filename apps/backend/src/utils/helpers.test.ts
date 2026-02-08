import { describe, expect, it } from 'vitest';
import {
  buildFilters,
  calculatePercentChange,
  clampValue,
  formatCurrency,
  formatDate,
  getParam,
  isValidEmail,
  parsePagination,
} from './helpers.js';

describe('helpers utilities', () => {
  it('getParam returns the first valid string value', () => {
    expect(getParam('abc')).toBe('abc');
    expect(getParam(['value'])).toBe('value');
  });

  it('getParam returns undefined for invalid or empty values', () => {
    expect(getParam('')).toBeUndefined();
    expect(getParam([''])).toBeUndefined();
    expect(getParam(123)).toBeUndefined();
    expect(getParam(null)).toBeUndefined();
  });

  it('formatCurrency uses Intl.NumberFormat with the requested currency', () => {
    const usd = formatCurrency(1234);
    const expectedUsd = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(1234);
    expect(usd).toBe(expectedUsd);

    const eur = formatCurrency(99.5, 'EUR');
    const expectedEur = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(99.5);
    expect(eur).toBe(expectedEur);
  });

  it('calculatePercentChange handles zero baselines and positive/negative deltas', () => {
    // Edge case: oldValue is 0
    expect(calculatePercentChange(0, 0)).toBe(0);
    expect(calculatePercentChange(0, 10)).toBe(100);

    expect(calculatePercentChange(100, 120)).toBeCloseTo(20);
    expect(calculatePercentChange(100, 80)).toBeCloseTo(-20);
  });

  it('parsePagination returns sane defaults and computed skip', () => {
    expect(parsePagination({})).toEqual({ page: 1, limit: 10, skip: 0 });
    expect(parsePagination({ page: '2', limit: '5' })).toEqual({ page: 2, limit: 5, skip: 5 });
    expect(parsePagination({ page: 'abc', limit: '0' })).toEqual({ page: 1, limit: 10, skip: 0 });
  });

  it('isValidEmail accepts valid emails and rejects invalid ones', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name+tag@domain.co')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
  });

  it('buildFilters only includes allowed fields with defined values', () => {
    const filters = buildFilters(
      { status: 'ACTIVE', type: undefined, extra: 'ignore' },
      ['status', 'type']
    );

    expect(filters).toEqual({ status: 'ACTIVE' });
  });

  it('clampValue handles ranges and edge cases (including min > max and NaN)', () => {
    // Normal range clamping
    expect(clampValue(5, 1, 10)).toBe(5);
    expect(clampValue(-5, 1, 10)).toBe(1);
    expect(clampValue(25, 1, 10)).toBe(10);

    // Swap min/max when passed in reverse order
    expect(clampValue(5, 10, 1)).toBe(5);

    // NaN fallback returns min
    expect(clampValue(Number.NaN, 3, 9)).toBe(3);
  });

  it('formatDate delegates to Date.toLocaleDateString', () => {
    const dateString = '2024-01-15T00:00:00.000Z';
    const expected = new Date(dateString).toLocaleDateString();

    expect(formatDate(dateString)).toBe(expected);
    expect(formatDate(new Date(dateString))).toBe(expected);
  });
});

