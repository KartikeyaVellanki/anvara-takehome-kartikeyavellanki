'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdSlots, type PaginationMeta } from '@/lib/api';
import type { AdSlot } from '@/lib/types';

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  VIDEO: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  NATIVE: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  NEWSLETTER: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  PODCAST: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
};

const typeIcons: Record<string, string> = {
  DISPLAY: '🖼️',
  VIDEO: '🎬',
  NATIVE: '📱',
  NEWSLETTER: '📧',
  PODCAST: '🎙️',
};

const ITEMS_PER_PAGE = 9;

// Filter types
type FilterType = '' | 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST';
type SortOption = 'price-asc' | 'price-desc' | 'name';

// Skeleton loader for loading state
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-[--color-border] p-4">
      <div className="mb-2 flex items-start justify-between">
        <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="mb-2 h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mb-3 space-y-2">
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-5 w-20 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

// Loading state with skeleton cards
function LoadingState() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Error state with retry button
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-12 text-center dark:border-red-900 dark:bg-red-900/20">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-3xl dark:bg-red-900/50">
        ⚠️
      </div>
      <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">
        Unable to load marketplace
      </h3>
      <p className="mb-6 text-red-600 dark:text-red-300">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-red-600 px-6 py-2 text-white transition-colors hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}

// Empty state with helpful messaging
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[--color-border] bg-slate-50/50 py-16 text-center dark:bg-slate-800/30">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-4xl dark:bg-slate-700">
        🔍
      </div>
      <h3 className="mb-2 text-xl font-semibold">No ad slots available</h3>
      <p className="mb-6 max-w-sm text-[--color-muted]">
        There are no ad slots in the marketplace right now. Check back later for new opportunities!
      </p>
      <Link href="/" className="text-[--color-primary] hover:underline">
        Return to Homepage
      </Link>
    </div>
  );
}

// Pagination component
function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  const { page, totalPages, total } = pagination;
  const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, total);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('ellipsis');

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-sm text-[--color-muted]">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{total}</span> results
      </p>

      <nav className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="rounded-lg border border-[--color-border] px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800"
        >
          Previous
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, idx) =>
            pageNum === 'ellipsis' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-[--color-muted]">
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                  pageNum === page
                    ? 'bg-[--color-primary] text-white'
                    : 'border border-[--color-border] hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {pageNum}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="rounded-lg border border-[--color-border] px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800"
        >
          Next
        </button>
      </nav>
    </div>
  );
}

// Filter bar component
function FilterBar({
  typeFilter,
  sortOption,
  onTypeChange,
  onSortChange,
  availableOnly,
  onAvailableChange,
}: {
  typeFilter: FilterType;
  sortOption: SortOption;
  onTypeChange: (type: FilterType) => void;
  onSortChange: (sort: SortOption) => void;
  availableOnly: boolean;
  onAvailableChange: (available: boolean) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      {/* Type Filter */}
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value as FilterType)}
        className="rounded-lg border border-[--color-border] bg-white px-3 py-2 text-sm dark:bg-slate-800"
        aria-label="Filter by type"
      >
        <option value="">All Types</option>
        <option value="DISPLAY">🖼️ Display</option>
        <option value="VIDEO">🎬 Video</option>
        <option value="NATIVE">📱 Native</option>
        <option value="NEWSLETTER">📧 Newsletter</option>
        <option value="PODCAST">🎙️ Podcast</option>
      </select>

      {/* Sort */}
      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="rounded-lg border border-[--color-border] bg-white px-3 py-2 text-sm dark:bg-slate-800"
        aria-label="Sort by"
      >
        <option value="name">Sort: Name</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>

      {/* Available Only */}
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={availableOnly}
          onChange={(e) => onAvailableChange(e.target.checked)}
          className="h-4 w-4 rounded border-[--color-border] text-[--color-primary] focus:ring-[--color-primary]"
        />
        Available only
      </label>
    </div>
  );
}

// Enhanced ad slot card
function AdSlotCard({ slot, index }: { slot: AdSlot; index: number }) {
  // Simulate "popular" or "featured" based on index for demo
  const isFeatured = index === 0;
  const isPopular = index < 3;

  return (
    <Link
      href={`/marketplace/${slot.id}`}
      className="group relative block overflow-hidden rounded-xl border border-[--color-border] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[--color-primary]/50 hover:shadow-xl dark:bg-slate-800"
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute left-0 top-0 z-10 rounded-br-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-semibold text-white">
          ⭐ Featured
        </div>
      )}

      {/* Type Header with Color */}
      <div
        className={`h-2 ${
          {
            DISPLAY: 'bg-blue-500',
            VIDEO: 'bg-red-500',
            NATIVE: 'bg-green-500',
            NEWSLETTER: 'bg-purple-500',
            PODCAST: 'bg-orange-500',
          }[slot.type] || 'bg-gray-500'
        }`}
      />

      <div className="p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold transition-colors group-hover:text-[--color-primary]">
              {slot.name}
            </h3>
            {slot.publisher && (
              <p className="text-sm text-[--color-muted]">by {slot.publisher.name}</p>
            )}
          </div>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${typeColors[slot.type] || 'bg-gray-100'}`}
          >
            {typeIcons[slot.type]} {slot.type}
          </span>
        </div>

        {/* Description */}
        {slot.description && (
          <p className="mb-4 text-sm leading-relaxed text-[--color-muted] line-clamp-2">
            {slot.description}
          </p>
        )}

        {/* Simulated metrics for better conversion */}
        {isPopular && (
          <div className="mb-4 flex items-center gap-4 text-xs text-[--color-muted]">
            <span className="flex items-center gap-1">
              <span className="text-amber-500">★</span> 4.{8 - index} rating
            </span>
            <span>•</span>
            <span>{15 - index * 2}+ bookings</span>
          </div>
        )}

        {/* Price & Availability */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
          <div className="flex items-center gap-2">
            {slot.isAvailable ? (
              <>
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Available
                </span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-gray-400" />
                <span className="text-sm text-[--color-muted]">Booked</span>
              </>
            )}
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-[--color-primary]">
              ${Number(slot.basePrice).toLocaleString()}
            </span>
            <span className="text-sm text-[--color-muted]">/mo</span>
          </div>
        </div>

        {/* CTA Hint */}
        <div className="mt-4 text-center">
          <span className="text-sm font-medium text-[--color-primary] opacity-0 transition-opacity group-hover:opacity-100">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function AdSlotGrid() {
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [typeFilter, setTypeFilter] = useState<FilterType>('');
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [availableOnly, setAvailableOnly] = useState(false);

  const fetchAdSlots = (page: number) => {
    setLoading(true);
    setError(null);
    getAdSlots({ page, limit: ITEMS_PER_PAGE })
      .then((response) => {
        setAdSlots(response.data);
        setPagination(response.pagination);
      })
      .catch(() => setError('Please check your connection and try again.'))
      .finally(() => setLoading(false));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAdSlots(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchAdSlots(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Client-side filtering and sorting (in real app, this would be server-side)
  const filteredSlots = adSlots
    .filter((slot) => {
      if (typeFilter && slot.type !== typeFilter) return false;
      if (availableOnly && !slot.isAvailable) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'price-asc') return Number(a.basePrice) - Number(b.basePrice);
      if (sortOption === 'price-desc') return Number(b.basePrice) - Number(a.basePrice);
      return a.name.localeCompare(b.name);
    });

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => fetchAdSlots(currentPage)} />;
  }

  if (adSlots.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <FilterBar
        typeFilter={typeFilter}
        sortOption={sortOption}
        onTypeChange={setTypeFilter}
        onSortChange={setSortOption}
        availableOnly={availableOnly}
        onAvailableChange={setAvailableOnly}
      />

      {filteredSlots.length === 0 ? (
        <div className="rounded-xl border border-[--color-border] bg-slate-50 py-12 text-center dark:bg-slate-800/50">
          <p className="text-[--color-muted]">No ad slots match your filters.</p>
          <button
            onClick={() => {
              setTypeFilter('');
              setAvailableOnly(false);
            }}
            className="mt-2 text-[--color-primary] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSlots.map((slot, index) => (
            <AdSlotCard key={slot.id} slot={slot} index={index} />
          ))}
        </div>
      )}

      {pagination && filteredSlots.length > 0 && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}
    </>
  );
}
