import { Skeleton, CardSkeleton, StatsCardSkeleton } from '@/app/components/ui/skeleton';

/**
 * Loading UI for sponsor dashboard
 * Shown while data is being fetched via Suspense.
 */
export default function Loading() {
  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton height={32} width={180} className="mb-2" />
          <Skeleton height={20} width={240} />
        </div>
        <Skeleton height={40} width={140} />
      </div>

      {/* Stats Grid */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Section Header */}
      <Skeleton height={24} width={140} className="mb-4" />

      {/* Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
