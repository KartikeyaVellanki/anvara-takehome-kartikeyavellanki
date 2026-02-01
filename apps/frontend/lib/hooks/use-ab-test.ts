/**
 * React Hooks for A/B Testing
 *
 * Provides easy-to-use hooks for consuming A/B test variants in React components.
 * Handles hydration mismatches and SSR gracefully.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getVariant,
  getAllAssignments,
  clearAssignments,
  forceVariant,
  getVariantPercentage,
  type Experiment,
  EXPERIMENTS,
} from '../ab-testing';

// ============================================================================
// MAIN HOOK: useABTest
// ============================================================================

/**
 * Hook to get the variant for an A/B test experiment
 *
 * Features:
 * - Returns consistent variant for the user
 * - Handles SSR/hydration gracefully (returns default until mounted)
 * - Tracks assignment in analytics automatically
 *
 * @param experimentId - The experiment identifier
 * @returns The assigned variant ID
 *
 * @example
 * function CTAButton() {
 *   const variant = useABTest('cta-button-text');
 *
 *   return (
 *     <button>
 *       {variant === 'A' ? 'Book Now' : 'Get Started'}
 *     </button>
 *   );
 * }
 */
export function useABTest(experimentId: string): string {
  // Get experiment config for default variant
  const experiment = EXPERIMENTS[experimentId];
  const defaultVariant = experiment?.defaultVariant || experiment?.variants[0]?.id || 'A';

  // Start with default to avoid hydration mismatch
  // (server doesn't have access to cookies in the same way)
  const [variant, setVariant] = useState<string>(defaultVariant);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only run on client after mount
    setIsMounted(true);
    const assignedVariant = getVariant(experimentId);
    setVariant(assignedVariant);
  }, [experimentId]);

  // Return default during SSR, actual variant after hydration
  return isMounted ? variant : defaultVariant;
}

/**
 * Hook with additional metadata about the experiment
 *
 * Useful when you need more context about the test.
 *
 * @param experimentId - The experiment identifier
 * @returns Object with variant and metadata
 */
export function useABTestWithMeta(experimentId: string): {
  variant: string;
  experiment: Experiment | null;
  percentage: number;
  isLoaded: boolean;
} {
  const experiment = EXPERIMENTS[experimentId] || null;
  const defaultVariant = experiment?.defaultVariant || experiment?.variants[0]?.id || 'A';

  const [variant, setVariant] = useState<string>(defaultVariant);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const assignedVariant = getVariant(experimentId);
    setVariant(assignedVariant);
    setIsLoaded(true);
  }, [experimentId]);

  const percentage = getVariantPercentage(experimentId, variant);

  return {
    variant,
    experiment,
    percentage,
    isLoaded,
  };
}

// ============================================================================
// DEBUG HOOK: useABTestDebug
// ============================================================================

interface ABTestDebugState {
  assignments: Record<string, { variantId: string; assignedAt: number }>;
  experiments: Experiment[];
}

interface ABTestDebugActions {
  clearAll: () => void;
  forceVariant: (experimentId: string, variantId: string) => void;
  refresh: () => void;
}

/**
 * Hook for debugging A/B tests
 *
 * Provides access to all assignments and control functions.
 * Use this to build a debug panel or for testing.
 *
 * @returns State and actions for debugging
 *
 * @example
 * function ABTestDebugPanel() {
 *   const { assignments, experiments, clearAll, forceVariant } = useABTestDebug();
 *
 *   return (
 *     <div>
 *       {experiments.map(exp => (
 *         <div key={exp.id}>
 *           {exp.id}: {assignments[exp.id]?.variantId || 'not assigned'}
 *         </div>
 *       ))}
 *       <button onClick={clearAll}>Reset All</button>
 *     </div>
 *   );
 * }
 */
export function useABTestDebug(): ABTestDebugState & ABTestDebugActions {
  const [state, setState] = useState<ABTestDebugState>({
    assignments: {},
    experiments: [],
  });

  const refresh = useCallback(() => {
    setState({
      assignments: getAllAssignments(),
      experiments: Object.values(EXPERIMENTS),
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const clearAll = useCallback(() => {
    clearAssignments();
    refresh();
  }, [refresh]);

  const force = useCallback(
    (experimentId: string, variantId: string) => {
      forceVariant(experimentId, variantId);
      refresh();
    },
    [refresh]
  );

  return {
    ...state,
    clearAll,
    forceVariant: force,
    refresh,
  };
}

// ============================================================================
// CONDITIONAL RENDERING COMPONENT
// ============================================================================

interface ABTestProps {
  experimentId: string;
  variants: {
    [variantId: string]: React.ReactNode;
  };
  fallback?: React.ReactNode;
}

/**
 * Component for declarative A/B test rendering
 *
 * Alternative to the hook when you prefer component-based API.
 *
 * @example
 * <ABTest
 *   experimentId="cta-button-text"
 *   variants={{
 *     A: <button>Book Now</button>,
 *     B: <button>Get Started</button>,
 *   }}
 * />
 */
export function ABTest({ experimentId, variants, fallback = null }: ABTestProps): React.ReactNode {
  const variant = useABTest(experimentId);

  // Return the matching variant or fallback
  return variants[variant] ?? fallback;
}
