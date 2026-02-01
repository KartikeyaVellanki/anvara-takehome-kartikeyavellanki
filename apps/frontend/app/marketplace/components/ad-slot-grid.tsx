'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdSlots, type PaginationMeta } from '@/lib/api';
import type { AdSlot } from '@/lib/types';

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NATIVE: 'bg-green-100 text-green-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

const ITEMS_PER_PAGE = 9;

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

export function AdSlotGrid() {
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
    // Scroll to top of grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchAdSlots(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adSlots.map((slot) => (
          <Link
            key={slot.id}
            href={`/marketplace/${slot.id}`}
            className="group block rounded-lg border border-[--color-border] bg-white p-4 transition-all hover:border-[--color-primary]/50 hover:shadow-lg dark:bg-slate-800"
          >
            <div className="mb-2 flex items-start justify-between">
              <h3 className="font-semibold group-hover:text-[--color-primary]">{slot.name}</h3>
              <span
                className={`rounded px-2 py-0.5 text-xs ${typeColors[slot.type] || 'bg-gray-100'}`}
              >
                {slot.type}
              </span>
            </div>

            {slot.publisher && (
              <p className="mb-2 text-sm text-[--color-muted]">by {slot.publisher.name}</p>
            )}

            {slot.description && (
              <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{slot.description}</p>
            )}

            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-medium ${slot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
              >
                {slot.isAvailable ? '● Available' : '○ Booked'}
              </span>
              <span className="font-semibold text-[--color-primary]">
                ${Number(slot.basePrice).toLocaleString()}/mo
              </span>
            </div>
          </Link>
        ))}
      </div>

      {pagination && <Pagination pagination={pagination} onPageChange={handlePageChange} />}
    </>
  );
}
