// Utility helpers for the API

/**
 * Safely extract route/query params from Express request
 *
 * @param param - The parameter value from req.params or req.query
 * @returns The string value or undefined if not a valid string
 *
 * Note: Returns undefined instead of empty string to clearly indicate missing params.
 * This is compatible with Prisma query filters which expect string | undefined.
 * Callers should handle undefined case explicitly for proper error responses.
 */
export function getParam(param: unknown): string | undefined {
  if (typeof param === 'string' && param.length > 0) return param;
  if (Array.isArray(param) && typeof param[0] === 'string' && param[0].length > 0) {
    return param[0];
  }
  return undefined;
}

// Helper to format currency values
export function formatCurrency(amount: number, currency = 'USD') {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });
  return formatter.format(amount);
}

// Helper to calculate percentage change
export function calculatePercentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

// Parse pagination params from query
interface PaginationQuery {
  page?: string;
  limit?: string;
}

export function parsePagination(query: PaginationQuery) {
  const page = parseInt(query.page || '1') || 1;
  const limit = parseInt(query.limit || '10') || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper to build filter object from query params
export const buildFilters = (
  query: Record<string, string | undefined>,
  allowedFields: string[]
): Record<string, string> => {
  const filters: Record<string, string> = {};

  for (const field of allowedFields) {
    if (query[field] !== undefined) {
      filters[field] = query[field];
    }
  }

  return filters;
};

// Deprecated config - kept for backwards compatibility
export const DEPRECATED_CONFIG = {
  apiVersion: 'v1',
  timeout: 5000,
};

/**
 * Clamp a number value between min and max bounds
 *
 * Handles edge cases including:
 * - Negative numbers
 * - When min > max (swaps them automatically)
 * - NaN values (returns min as fallback)
 *
 * @param value - The number to clamp
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @returns The clamped value
 */
export function clampValue(value: number, min: number, max: number): number {
  // Handle NaN input
  if (Number.isNaN(value)) return min;

  // Ensure min <= max by swapping if needed
  const actualMin = Math.min(min, max);
  const actualMax = Math.max(min, max);

  // Use Math.max/min for clean, correct clamping
  return Math.max(actualMin, Math.min(actualMax, value));
}

// Format date for display
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}
