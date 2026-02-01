/**
 * A/B Testing Framework
 *
 * A lightweight, cookie-based A/B testing system that supports:
 * - Multiple concurrent experiments
 * - Percentage-based traffic splits (not just 50/50)
 * - Consistent user experience (same user = same variant)
 * - Debug mode for forcing specific variants
 * - Integration with analytics tracking
 *
 * No external services required - everything runs locally.
 */

import { trackExperiment } from './analytics';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Variant configuration for an experiment
 */
export interface Variant {
  id: string; // Unique variant identifier (e.g., 'A', 'B', 'control')
  weight: number; // Weight for probability (higher = more likely)
}

/**
 * Experiment configuration
 */
export interface Experiment {
  id: string; // Unique experiment identifier (e.g., 'cta-button-test')
  variants: Variant[]; // Available variants
  defaultVariant?: string; // Fallback variant if assignment fails
}

/**
 * Stored assignment for a user
 */
interface ExperimentAssignment {
  experimentId: string;
  variantId: string;
  assignedAt: number; // Timestamp
}

/**
 * All experiment assignments for a user
 */
interface UserAssignments {
  [experimentId: string]: ExperimentAssignment;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Cookie name for storing experiment assignments
 * Using a single cookie for all experiments to reduce cookie overhead
 */
const ASSIGNMENTS_COOKIE = 'anvara_ab_tests';

/**
 * Cookie expiration in days (30 days default)
 * Long enough to maintain consistency, short enough for re-evaluation
 */
const COOKIE_EXPIRY_DAYS = 30;

/**
 * Debug mode URL parameter
 * Add ?ab_debug=experimentId:variantId to force a variant
 * Example: ?ab_debug=cta-test:B
 */
const DEBUG_PARAM = 'ab_debug';

// ============================================================================
// PREDEFINED EXPERIMENTS
// ============================================================================

/**
 * Registry of all active experiments
 *
 * Add new experiments here. Each experiment needs:
 * - Unique ID (kebab-case recommended)
 * - Variants with weights (weights are relative, not percentages)
 *
 * Weight examples:
 * - 50/50 split: [{ id: 'A', weight: 1 }, { id: 'B', weight: 1 }]
 * - 80/20 split: [{ id: 'A', weight: 4 }, { id: 'B', weight: 1 }]
 * - 33/33/33 split: [{ id: 'A', weight: 1 }, { id: 'B', weight: 1 }, { id: 'C', weight: 1 }]
 */
export const EXPERIMENTS: Record<string, Experiment> = {
  // Example: CTA button text test
  'cta-button-text': {
    id: 'cta-button-text',
    variants: [
      { id: 'A', weight: 1 }, // "Book Now"
      { id: 'B', weight: 1 }, // "Get Started"
    ],
    defaultVariant: 'A',
  },

  // Example: Marketplace layout test
  'marketplace-layout': {
    id: 'marketplace-layout',
    variants: [
      { id: 'grid', weight: 1 }, // Current grid layout
      { id: 'list', weight: 1 }, // Alternative list layout
    ],
    defaultVariant: 'grid',
  },

  // Example: Price display format test (90/10 split for careful testing)
  'price-display': {
    id: 'price-display',
    variants: [
      { id: 'standard', weight: 9 }, // "$1,000/mo"
      { id: 'annual', weight: 1 }, // "$12,000/year (save 0%)"
    ],
    defaultVariant: 'standard',
  },

  // Example: CTA color test with 3 variants
  'cta-color': {
    id: 'cta-color',
    variants: [
      { id: 'primary', weight: 1 }, // Default primary color
      { id: 'green', weight: 1 }, // Green for urgency
      { id: 'orange', weight: 1 }, // Orange for attention
    ],
    defaultVariant: 'primary',
  },
};

// ============================================================================
// COOKIE UTILITIES
// ============================================================================

/**
 * Check if we're running in the browser
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  if (!isBrowser()) return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

/**
 * Set a cookie with expiration
 */
function setCookie(name: string, value: string, days: number): void {
  if (!isBrowser()) return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // SameSite=Lax for security while allowing normal navigation
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

// ============================================================================
// ASSIGNMENT STORAGE
// ============================================================================

/**
 * Load all experiment assignments from cookie
 */
function loadAssignments(): UserAssignments {
  const cookieValue = getCookie(ASSIGNMENTS_COOKIE);
  if (!cookieValue) return {};

  try {
    return JSON.parse(cookieValue) as UserAssignments;
  } catch {
    // Invalid JSON, start fresh
    return {};
  }
}

/**
 * Save all experiment assignments to cookie
 */
function saveAssignments(assignments: UserAssignments): void {
  setCookie(ASSIGNMENTS_COOKIE, JSON.stringify(assignments), COOKIE_EXPIRY_DAYS);
}

/**
 * Get stored assignment for a specific experiment
 */
function getStoredAssignment(experimentId: string): string | null {
  const assignments = loadAssignments();
  return assignments[experimentId]?.variantId || null;
}

/**
 * Store assignment for an experiment
 */
function storeAssignment(experimentId: string, variantId: string): void {
  const assignments = loadAssignments();
  assignments[experimentId] = {
    experimentId,
    variantId,
    assignedAt: Date.now(),
  };
  saveAssignments(assignments);
}

// ============================================================================
// VARIANT ASSIGNMENT LOGIC
// ============================================================================

/**
 * Check for debug override in URL parameters
 *
 * Format: ?ab_debug=experimentId:variantId
 * Multiple: ?ab_debug=exp1:A,exp2:B
 *
 * @returns Variant ID if debug override exists, null otherwise
 */
function getDebugOverride(experimentId: string): string | null {
  if (!isBrowser()) return null;

  const params = new URLSearchParams(window.location.search);
  const debugValue = params.get(DEBUG_PARAM);

  if (!debugValue) return null;

  // Parse comma-separated overrides
  const overrides = debugValue.split(',');
  for (const override of overrides) {
    const [expId, variantId] = override.split(':');
    if (expId === experimentId && variantId) {
      return variantId;
    }
  }

  return null;
}

/**
 * Select a variant based on weighted random selection
 *
 * Algorithm:
 * 1. Calculate total weight of all variants
 * 2. Generate random number between 0 and total weight
 * 3. Iterate through variants, accumulating weights
 * 4. Return variant when accumulated weight exceeds random number
 *
 * @param variants - Array of variants with weights
 * @returns Selected variant ID
 */
function selectVariant(variants: Variant[]): string {
  // Calculate total weight
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);

  // Generate random number in range [0, totalWeight)
  const random = Math.random() * totalWeight;

  // Find the variant that this random number falls into
  let accumulated = 0;
  for (const variant of variants) {
    accumulated += variant.weight;
    if (random < accumulated) {
      return variant.id;
    }
  }

  // Fallback to last variant (should never reach here)
  return variants[variants.length - 1].id;
}

/**
 * Get variant for an experiment
 *
 * Assignment priority:
 * 1. Debug override (if present in URL)
 * 2. Stored assignment (from cookie)
 * 3. New random assignment (stored for consistency)
 *
 * @param experimentId - The experiment to get variant for
 * @param trackAssignment - Whether to track in analytics (default true)
 * @returns Variant ID
 */
export function getVariant(experimentId: string, trackAssignment = true): string {
  const experiment = EXPERIMENTS[experimentId];

  // Experiment not found - return default or 'A'
  if (!experiment) {
    // eslint-disable-next-line no-console
    console.warn(`[A/B Test] Experiment "${experimentId}" not found`);
    return 'A';
  }

  // 1. Check for debug override
  const debugOverride = getDebugOverride(experimentId);
  if (debugOverride) {
    // Verify the override variant exists
    const validVariant = experiment.variants.find((v) => v.id === debugOverride);
    if (validVariant) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`[A/B Test] Debug override: ${experimentId} = ${debugOverride}`);
      }
      return debugOverride;
    }
  }

  // 2. Check for stored assignment
  const storedVariant = getStoredAssignment(experimentId);
  if (storedVariant) {
    // Verify stored variant still exists in experiment
    const validVariant = experiment.variants.find((v) => v.id === storedVariant);
    if (validVariant) {
      return storedVariant;
    }
    // Stored variant no longer valid, will reassign
  }

  // 3. Assign new variant
  const newVariant = selectVariant(experiment.variants);

  // Store assignment for consistency
  storeAssignment(experimentId, newVariant);

  // Track assignment in analytics
  if (trackAssignment) {
    trackExperiment(experimentId, newVariant);
  }

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`[A/B Test] New assignment: ${experimentId} = ${newVariant}`);
  }

  return newVariant;
}

/**
 * Get all current experiment assignments for a user
 * Useful for debugging and analytics
 */
export function getAllAssignments(): UserAssignments {
  return loadAssignments();
}

/**
 * Clear all experiment assignments (re-randomize user)
 * Useful for testing or user-requested reset
 */
export function clearAssignments(): void {
  if (isBrowser()) {
    document.cookie = `${ASSIGNMENTS_COOKIE}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}

/**
 * Force a specific variant for an experiment
 * Useful for debugging or user preferences
 */
export function forceVariant(experimentId: string, variantId: string): void {
  storeAssignment(experimentId, variantId);
}

// ============================================================================
// SERVER-SIDE SUPPORT
// ============================================================================

/**
 * Get variant from a cookie string (for server-side rendering)
 *
 * Use this in Server Components or API routes when you have access
 * to the cookie header but not the browser document.
 *
 * @param cookieString - The raw Cookie header value
 * @param experimentId - The experiment to get variant for
 * @returns Variant ID or null if not assigned
 *
 * @example
 * // In a Server Component
 * import { cookies } from 'next/headers';
 * const cookieStore = await cookies();
 * const variant = getVariantFromCookie(
 *   cookieStore.get(ASSIGNMENTS_COOKIE)?.value || '',
 *   'cta-button-text'
 * );
 */
export function getVariantFromCookie(cookieValue: string, experimentId: string): string | null {
  if (!cookieValue) return null;

  try {
    const assignments = JSON.parse(cookieValue) as UserAssignments;
    return assignments[experimentId]?.variantId || null;
  } catch {
    return null;
  }
}

/**
 * Get the cookie name constant for server-side access
 */
export function getAssignmentsCookieName(): string {
  return ASSIGNMENTS_COOKIE;
}

// ============================================================================
// EXPERIMENT METADATA
// ============================================================================

/**
 * Get experiment configuration
 */
export function getExperiment(experimentId: string): Experiment | null {
  return EXPERIMENTS[experimentId] || null;
}

/**
 * Get all active experiments
 */
export function getActiveExperiments(): Experiment[] {
  return Object.values(EXPERIMENTS);
}

/**
 * Calculate the percentage split for a variant
 */
export function getVariantPercentage(experimentId: string, variantId: string): number {
  const experiment = EXPERIMENTS[experimentId];
  if (!experiment) return 0;

  const variant = experiment.variants.find((v) => v.id === variantId);
  if (!variant) return 0;

  const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
  return Math.round((variant.weight / totalWeight) * 100);
}
