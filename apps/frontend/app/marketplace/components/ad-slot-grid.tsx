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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Error state
 */
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="border border-[--error] bg-[--error-light] p-8 text-center">
      <div className="mx-auto mb-4 h-12 w-12 text-[--error]">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="mb-2 font-display text-[--text-lg] font-semibold text-[--error]">
        Unable to load marketplace
      </h3>
      <p className="mb-6 text-[--text-sm] text-red-700">{message}</p>
      <Button variant="danger" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}

/**
 * Filter bar
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
        size="sm"
        className="w-auto min-w-[140px]"
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
        size="sm"
        className="w-auto min-w-[160px]"
      >
        <option value="name">Sort: Name</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </Select>

      <label className="flex cursor-pointer items-center gap-2 text-[--text-sm] text-[--color-text-secondary]">
        <input
          type="checkbox"
          checked={availableOnly}
          onChange={(e) => onAvailableChange(e.target.checked)}
          className="h-4 w-4 rounded-[--radius-sm] border-[--color-border] text-[--accent] focus:ring-[--accent]"
        />
        Available only
      </label>
    </div>
  );
}

/**
 * Ad Slot Card - Clean, minimal design
 */
function AdSlotCard({ slot }: { slot: AdSlot }) {
  return (
    <Link
      href={`/marketplace/${slot.id}`}
      className="group block border border-[--color-border] bg-[--color-bg-elevated] transition-all duration-[--transition-base] hover:border-[--accent]"
    >
      <div className="p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-[--text-base] font-semibold text-[--color-text] transition-colors group-hover:text-[--accent]">
              {slot.name}
            </h3>
            {slot.publisher && (
              <p className="mt-0.5 truncate text-[--text-sm] text-[--color-text-muted]">
                {slot.publisher.name}
              </p>
            )}
          </div>
          <TypeBadge type={slot.type as 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST'} />
        </div>

        {/* Description */}
        {slot.description && (
          <p className="mb-4 text-[--text-sm] leading-relaxed text-[--color-text-secondary] line-clamp-2">
            {slot.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[--color-border] pt-4">
          <StatusBadge status={slot.isAvailable ? 'available' : 'booked'} />
          <div className="text-right">
            <span className="font-display text-[--text-lg] font-semibold text-[--color-text]">
              ${Number(slot.basePrice).toLocaleString()}
            </span>
            <span className="text-[--text-sm] text-[--color-text-muted]">/mo</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Pagination
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
      <p className="text-[--text-sm] text-[--color-text-muted]">
        Showing <span className="font-medium text-[--color-text]">{startItem}</span> to{' '}
        <span className="font-medium text-[--color-text]">{endItem}</span> of{' '}
        <span className="font-medium text-[--color-text]">{total}</span>
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((pageNum, idx) =>
            pageNum === 'ellipsis' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-[--color-text-muted]">
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`
                  h-9 w-9 text-[--text-sm] font-medium
                  transition-colors duration-[--transition-fast]
                  ${pageNum === page
                    ? 'bg-[--accent] text-white'
                    : 'border border-[--color-border] text-[--color-text-secondary] hover:border-[--accent] hover:text-[--accent]'
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
          variant="secondary"
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
            <Button variant="secondary">Return to Homepage</Button>
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
        <div className="border border-[--color-border] bg-[--color-bg-subtle] py-12 text-center">
          <p className="text-[--color-text-muted]">No ad slots match your filters.</p>
          <button
            onClick={() => {
              setTypeFilter('');
              setAvailableOnly(false);
            }}
            className="mt-2 text-[--text-sm] text-[--accent] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
