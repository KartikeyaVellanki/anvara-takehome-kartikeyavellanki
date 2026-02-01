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
        className="fixed bottom-4 left-4 z-[200] flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-transform hover:scale-110"
        title="A/B Test Debug Panel"
        aria-label="Toggle A/B test debug panel"
      >
        <span className="text-xl">🧪</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 z-[200] w-96 max-w-[calc(100vw-2rem)] rounded-xl border border-purple-200 bg-white shadow-2xl dark:border-purple-800 dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-purple-100 px-4 py-3 dark:border-purple-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧪</span>
              <h2 className="font-semibold">A/B Test Debug</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={refresh}
                className="rounded p-1 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/50"
                title="Refresh"
              >
                🔄
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto p-4">
            {experiments.length === 0 ? (
              <p className="text-center text-sm text-gray-500">No experiments configured</p>
            ) : (
              <div className="space-y-4">
                {experiments.map((experiment) => {
                  const currentVariant = assignments[experiment.id]?.variantId;
                  const assignedAt = assignments[experiment.id]?.assignedAt;

                  return (
                    <div
                      key={experiment.id}
                      className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                    >
                      {/* Experiment Name */}
                      <div className="mb-2 flex items-center justify-between">
                        <code className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {experiment.id}
                        </code>
                        {currentVariant && (
                          <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
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
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
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
                        <p className="text-xs text-gray-500">
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
          <div className="border-t border-purple-100 px-4 py-3 dark:border-purple-800">
            <button
              onClick={clearAll}
              className="w-full rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/70"
            >
              🗑️ Clear All Assignments
            </button>
            <p className="mt-2 text-center text-xs text-gray-500">
              Use{' '}
              <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
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
