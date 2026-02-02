'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdSlots, type PaginationMeta } from '@/lib/api';
import type { AdSlot } from '@/lib/types';
import { useAnalytics } from '@/lib/hooks/use-analytics';
import { Button } from '@/app/components/ui/button';
import { StatusBadge } from '@/app/components/ui/badge';
import { Select } from '@/app/components/ui/input';
import { CardSkeleton } from '@/app/components/ui/skeleton';
import { EmptyState, EmptyStateIcons } from '@/app/components/ui/empty-state';

const ITEMS_PER_PAGE = 9;

type FilterType = '' | 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST';
type SortOption = 'price-asc' | 'price-desc' | 'name';

/**
 * Loading state with skeleton cards
 */
function LoadingState() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Error state - glass surface
 */
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-[--error]/30 bg-[--error-light] p-8 text-center">
      <div className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-[--error]/15 text-[--error]">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-[--text-title-large] font-semibold text-[--color-text]">
        Unable to load marketplace
      </h3>
      <p className="mb-6 text-[--text-body-medium] text-[--color-text-secondary]">{message}</p>
      <Button variant="danger" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}

/**
 * Filter bar - glass controls
 */
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
    <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--glass-surface)] p-3 backdrop-blur-xl">
      <Select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value as FilterType)}
        aria-label="Filter by type"
        className="!h-11 w-auto min-w-[150px] !rounded-full !bg-[var(--glass-surface)] !border-[var(--card-border)] backdrop-blur-xl"
      >
        <option value="">All Types</option>
        <option value="DISPLAY">Display</option>
        <option value="VIDEO">Video</option>
        <option value="NATIVE">Native</option>
        <option value="NEWSLETTER">Newsletter</option>
        <option value="PODCAST">Podcast</option>
      </Select>

      <Select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        aria-label="Sort by"
        className="!h-11 w-auto min-w-[170px] !rounded-full !bg-[var(--glass-surface)] !border-[var(--card-border)] backdrop-blur-xl"
      >
        <option value="name">Sort: Name</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </Select>

      <label className="flex cursor-pointer items-center gap-3 rounded-full border border-[var(--card-border)] bg-[var(--glass-surface)] px-4 py-2 text-[--text-sm] text-[--color-text-secondary] transition-colors backdrop-blur-xl hover:border-[var(--card-border-hover)] hover:bg-[var(--glass-surface-strong)]">
        <input
          type="checkbox"
          checked={availableOnly}
          onChange={(e) => onAvailableChange(e.target.checked)}
          className="h-4 w-4 rounded-sm border-[var(--card-border)] text-[--accent] focus:ring-[--accent]/40 focus:ring-offset-0"
        />
        Available only
      </label>
    </div>
  );
}

/**
 * Ad Slot Card - premium glass
 */
function AdSlotCard({ slot }: { slot: AdSlot }) {
  const { trackCTA } = useAnalytics();
  const typeLabel = {
    DISPLAY: 'Display',
    VIDEO: 'Video',
    NATIVE: 'Native',
    NEWSLETTER: 'Newsletter',
    PODCAST: 'Podcast',
  }[slot.type];

  return (
    <Link
      href={`/marketplace/${slot.id}`}
      onClick={() => {
        trackCTA('View', 'marketplace-grid', {
          listingId: slot.id,
          listingType: slot.type,
          listingPrice: Number(slot.basePrice),
        });
      }}
      className="group block transform transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_60px_rgba(0,0,0,0.55)] active:scale-[0.98]"
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--glass-surface)] p-6 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:border-[var(--card-border-hover)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-[--text-title-large] font-semibold text-[--color-text]">
              {slot.name}
            </h3>
            <p className="mt-1 truncate text-[--text-label-medium] text-[--color-text-muted]">
              {slot.publisher?.name || 'Publisher'} · {typeLabel}
            </p>
          </div>
          <StatusBadge status={slot.isAvailable ? 'available' : 'booked'} />
        </div>

        {slot.description && (
          <p className="mt-4 text-[--text-body-medium] leading-relaxed text-[--color-text-secondary] line-clamp-2">
            {slot.description}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/5 pt-4">
          <div>
            <p className="text-[--text-label-small] uppercase tracking-wide text-[--color-text-muted]">
              Starting from
            </p>
            <p className="text-[--text-title-large] font-semibold text-[--accent]">
              ${Number(slot.basePrice).toLocaleString()}
              <span className="text-[--text-label-medium] text-[--color-text-muted]">/mo</span>
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] px-4 py-2 text-[--text-label-large] font-semibold text-[--color-text] transition-colors group-hover:border-[var(--card-border-hover)] group-hover:text-[--accent]">
            View
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l6 7-6 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Pagination - glass controls
 */
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
      <p className="text-[--text-body-medium] text-[--color-text-secondary]">
        Showing <span className="font-semibold text-[--color-text]">{startItem}</span> to{' '}
        <span className="font-semibold text-[--color-text]">{endItem}</span> of{' '}
        <span className="font-semibold text-[--color-text]">{total}</span>
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <Button
          variant="tonal"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((pageNum, idx) =>
            pageNum === 'ellipsis' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-[--color-text-secondary]">
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`
                  h-10 w-10 rounded-full text-[--text-label-large] font-medium
                  transition-all duration-200 ease-out
                  active:scale-95
                  ${
                    pageNum === page
                      ? 'bg-[--accent] text-[--md-on-primary]'
                      : 'text-[--color-text-secondary] hover:bg-[--accent]/10'
                  }
                `}
                aria-current={pageNum === page ? 'page' : undefined}
              >
                {pageNum}
              </button>
            )
          )}
        </div>

        <Button
          variant="tonal"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </nav>
    </div>
  );
}

/**
 * Main Ad Slot Grid Component
 */
export function AdSlotGrid() {
  const { trackFilter } = useAnalytics();
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [typeFilter, setTypeFilter] = useState<FilterType>('');
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [availableOnly, setAvailableOnly] = useState(false);

  const handleTypeChange = (type: FilterType) => {
    setTypeFilter(type);
    trackFilter('type', type || 'all');
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
    trackFilter('sort', sort);
  };

  const handleAvailableChange = (available: boolean) => {
    setAvailableOnly(available);
    trackFilter('available_only', available ? 'true' : 'false');
  };

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

  useEffect(() => {
    fetchAdSlots(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Client-side filtering and sorting
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
    return (
      <EmptyState
        icon={EmptyStateIcons.search}
        title="No ad slots available"
        description="There are no ad slots in the marketplace right now. Check back later for new opportunities."
        action={
          <Link href="/">
            <Button variant="tonal">Return to Homepage</Button>
          </Link>
        }
      />
    );
  }

  return (
    <>
      <FilterBar
        typeFilter={typeFilter}
        sortOption={sortOption}
        onTypeChange={handleTypeChange}
        onSortChange={handleSortChange}
        availableOnly={availableOnly}
        onAvailableChange={handleAvailableChange}
      />

      {filteredSlots.length === 0 ? (
        <div className="rounded-3xl border border-[--glass-border] bg-[--glass] py-12 text-center backdrop-blur-xl">
          <p className="text-[--color-text-secondary]">No ad slots match your filters.</p>
          <button
            onClick={() => {
              setTypeFilter('');
              setAvailableOnly(false);
              trackFilter('clear', 'true');
            }}
            className="mt-2 text-[--text-label-large] text-[--accent] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSlots.map((slot) => (
            <AdSlotCard key={slot.id} slot={slot} />
          ))}
        </div>
      )}

      {pagination && filteredSlots.length > 0 && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}
    </>
  );
}
