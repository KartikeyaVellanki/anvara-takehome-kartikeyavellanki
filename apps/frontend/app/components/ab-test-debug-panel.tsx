'use client';

import { useState } from 'react';
import { useABTestDebug } from '@/lib/hooks/use-ab-test';
import { getVariantPercentage } from '@/lib/ab-testing';

/**
 * A/B Test Debug Panel
 *
 * A floating panel for developers to:
 * - View all active experiments and current assignments
 * - Force specific variants for testing
 * - Reset all assignments
 *
 * Only visible in development mode by default.
 * Can be enabled in production with ?ab_panel=true URL param.
 *
 * @example
 * // Add to layout.tsx
 * <ABTestDebugPanel />
 */
export function ABTestDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { assignments, experiments, clearAll, forceVariant, refresh } = useABTestDebug();

  // Check if we should show the panel
  const isDev = process.env.NODE_ENV === 'development';
  const hasUrlParam =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('ab_panel');

  // Don't render in production unless explicitly enabled
  if (!isDev && !hasUrlParam) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-[200] flex h-12 w-12 items-center justify-center rounded-full bg-[--accent] text-[--md-on-primary] shadow-glow transition-transform hover:scale-110"
        title="A/B Test Debug Panel"
        aria-label="Toggle A/B test debug panel"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6M10 3v5.5l-4.5 7.7A3 3 0 008.1 20h7.8a3 3 0 002.6-3.8L14 8.5V3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 14h8" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 z-[200] w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-[--glass-border] bg-[--glass] shadow-float backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[--glass-border] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[--accent]/20 text-[--accent]">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6M10 3v5.5l-4.5 7.7A3 3 0 008.1 20h7.8a3 3 0 002.6-3.8L14 8.5V3" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 14h8" />
                </svg>
              </div>
              <h2 className="font-semibold text-[--color-text]">A/B Test Debug</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={refresh}
                className="rounded p-1 text-[--color-text-secondary] hover:bg-[--glass-strong]"
                title="Refresh"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12a8 8 0 10-3.2 6.4M20 12v-4m0 4h-4" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-[--color-text-secondary] hover:bg-[--glass-strong]"
                title="Close"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto p-4">
            {experiments.length === 0 ? (
              <p className="text-center text-sm text-[--color-text-secondary]">No experiments configured</p>
            ) : (
              <div className="space-y-4">
                {experiments.map((experiment) => {
                  const currentVariant = assignments[experiment.id]?.variantId;
                  const assignedAt = assignments[experiment.id]?.assignedAt;

                  return (
                    <div
                      key={experiment.id}
                      className="rounded-xl border border-[--glass-border] bg-[--glass-strong] p-3 backdrop-blur-xl"
                    >
                      {/* Experiment Name */}
                      <div className="mb-2 flex items-center justify-between">
                        <code className="text-sm font-semibold text-[--accent]">
                          {experiment.id}
                        </code>
                        {currentVariant && (
                          <span className="rounded bg-[--accent]/15 px-2 py-0.5 text-xs font-medium text-[--color-text]">
                            Current: {currentVariant}
                          </span>
                        )}
                      </div>

                      {/* Variants */}
                      <div className="mb-2 flex flex-wrap gap-1">
                        {experiment.variants.map((variant) => {
                          const percentage = getVariantPercentage(experiment.id, variant.id);
                          const isActive = variant.id === currentVariant;

                          return (
                            <button
                              key={variant.id}
                              onClick={() => forceVariant(experiment.id, variant.id)}
                              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                                isActive
                                  ? 'bg-[--accent] text-[--md-on-primary]'
                                  : 'bg-[--glass-strong] text-[--color-text-secondary] hover:bg-[--glass]'
                              }`}
                              title={`Force variant ${variant.id} (${percentage}%)`}
                            >
                              {variant.id} ({percentage}%)
                            </button>
                          );
                        })}
                      </div>

                      {/* Assignment Info */}
                      {assignedAt && (
                        <p className="text-xs text-[--color-text-secondary]">
                          Assigned: {new Date(assignedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[--glass-border] px-4 py-3">
            <button
              onClick={clearAll}
              className="w-full rounded-lg bg-[--error]/15 px-4 py-2 text-sm font-semibold text-[--color-text] transition-colors hover:bg-[--error]/25"
            >
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5h6v2m-8 0l1 12h6l1-12" />
                </svg>
                Clear All Assignments
              </span>
            </button>
            <p className="mt-2 text-center text-xs text-[--color-text-secondary]">
              Use{' '}
              <code className="rounded bg-[--glass-strong] px-1">
                ?ab_debug=exp:variant
              </code>{' '}
              to force variants via URL
            </p>
          </div>
        </div>
      )}
    </>
  );
}
