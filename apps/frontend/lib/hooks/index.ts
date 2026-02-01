/**
 * Hooks Index
 *
 * Re-exports all custom hooks for convenient importing.
 *
 * @example
 * import { useABTest, useAnalytics } from '@/lib/hooks';
 */

// A/B Testing hooks
export { useABTest, useABTestWithMeta, useABTestDebug, ABTest } from './use-ab-test';

// Analytics hooks
export {
  usePageTracking,
  useAnalytics,
  useListingViewTracking,
  useScrollDepthTracking,
} from './use-analytics';
