'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdSlots, type PaginationMeta } from '@/lib/api';
import type { AdSlot } from '@/lib/types';
import { Button } from '@/app/components/ui/button';
import { StatusBadge, TypeBadge } from '@/app/components/ui/badge';
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
 * Error state - Material You style
 */
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-3xl bg-[--md-error-container] p-8 text-center">
      <div className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-[--md-error]/20 text-[--md-error]">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-[--text-title-large] font-medium text-[--md-on-error-container]">
        Unable to load marketplace
      </h3>
      <p className="mb-6 text-[--text-body-medium] text-[--md-on-error-container]/80">{message}</p>
      <Button variant="danger" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}

/**
 * Filter bar - Material You style
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
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <Select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value as FilterType)}
        aria-label="Filter by type"
        className="!h-12 w-auto min-w-[140px]"
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
        className="!h-12 w-auto min-w-[160px]"
      >
        <option value="name">Sort: Name</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </Select>

      <label className="flex cursor-pointer items-center gap-3 px-4 py-3 rounded-full bg-[--md-surface-container] text-[--text-label-large] text-[--md-on-surface-variant] hover:bg-[--md-surface-container-high] transition-colors">
        <input
          type="checkbox"
          checked={availableOnly}
          onChange={(e) => onAvailableChange(e.target.checked)}
          className="h-5 w-5 rounded-sm border-[--md-outline] text-[--md-primary] focus:ring-[--md-primary] focus:ring-offset-0"
        />
        Available only
      </label>
    </div>
  );
}

/**
 * Ad Slot Card - Material You style
 */
function AdSlotCard({ slot }: { slot: AdSlot }) {
  return (
    <Link
      href={`/marketplace/${slot.id}`}
      className="group block rounded-3xl bg-[--md-surface-container] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[--text-title-large] font-medium text-[--md-on-surface] transition-colors group-hover:text-[--md-primary]">
              {slot.name}
            </h3>
            {slot.publisher && (
              <p className="mt-1 truncate text-[--text-body-medium] text-[--md-on-surface-variant]">
                {slot.publisher.name}
              </p>
            )}
          </div>
          <TypeBadge
            type={slot.type as 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST'}
          />
        </div>

        {/* Description */}
        {slot.description && (
          <p className="mb-4 text-[--text-body-medium] leading-relaxed text-[--md-on-surface-variant] line-clamp-2">
            {slot.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[--md-outline-variant]">
          <StatusBadge status={slot.isAvailable ? 'available' : 'booked'} />
          <div className="text-right">
            <span className="text-[--text-headline-medium] font-medium text-[--md-on-surface]">
              ${Number(slot.basePrice).toLocaleString()}
            </span>
            <span className="text-[--text-body-medium] text-[--md-on-surface-variant]">/mo</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Pagination - Material You style
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
      <p className="text-[--text-body-medium] text-[--md-on-surface-variant]">
        Showing <span className="font-medium text-[--md-on-surface]">{startItem}</span> to{' '}
        <span className="font-medium text-[--md-on-surface]">{endItem}</span> of{' '}
        <span className="font-medium text-[--md-on-surface]">{total}</span>
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
              <span key={`ellipsis-${idx}`} className="px-2 text-[--md-on-surface-variant]">
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`
                  h-10 w-10 rounded-full text-[--text-label-large] font-medium
                  transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]
                  active:scale-95
                  ${
                    pageNum === page
                      ? 'bg-[--md-primary] text-[--md-on-primary]'
                      : 'text-[--md-on-surface-variant] hover:bg-[--md-primary]/10'
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
        onTypeChange={setTypeFilter}
        onSortChange={setSortOption}
        availableOnly={availableOnly}
        onAvailableChange={setAvailableOnly}
      />

      {filteredSlots.length === 0 ? (
        <div className="rounded-3xl bg-[--md-surface-container] py-12 text-center">
          <p className="text-[--md-on-surface-variant]">No ad slots match your filters.</p>
          <button
            onClick={() => {
              setTypeFilter('');
              setAvailableOnly(false);
            }}
            className="mt-2 text-[--text-label-large] text-[--md-primary] hover:underline"
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
