'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, startTransition } from 'react';
import { authClient } from '@/auth-client';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';

type UserRole = 'sponsor' | 'publisher' | null;

/**
 * NavLink with active state styling
 */
function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        text-[--text-sm] font-medium
        transition-colors duration-[--transition-fast]
        ${isActive ? 'text-[--accent]' : 'text-[--color-text-secondary] hover:text-[--color-text]'}
      `}
    >
      {children}
    </Link>
  );
}

/**
 * Theme Toggle Button
 */
function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  /**
   * Detect client-side hydration to prevent SSR mismatches.
   * Using startTransition to mark the update as non-urgent.
   */
  useEffect(function onMount() {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  // Show placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden="true" />;
  }

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      onClick={cycleTheme}
      className="
        flex h-9 w-9 items-center justify-center
        rounded-[--radius-sm]
        text-[--color-text-secondary]
        hover:bg-[--color-bg-subtle] hover:text-[--color-text]
        transition-colors duration-[--transition-fast]
      "
      aria-label={`Current theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {resolvedTheme === 'dark' ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
}

/**
 * Main Navigation Component
 *
 * Clean, minimal header with:
 * - Logo on left
 * - Nav links center
 * - User actions on right
 * - Mobile responsive menu
 */
export function Nav() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [role, setRole] = useState<UserRole>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch user role from backend when user is logged in
  useEffect(() => {
    let cancelled = false;

    async function fetchRole() {
      if (!user?.id) {
        setRole(null);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/auth/role/${user.id}`
        );
        const data = await res.json();
        if (!cancelled) {
          setRole(data.role);
        }
      } catch {
        if (!cancelled) {
          setRole(null);
        }
      }
    }

    fetchRole();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[--color-border] bg-[--color-bg-elevated]/95 backdrop-blur supports-[backdrop-filter]:bg-[--color-bg-elevated]/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-[--color-text] transition-opacity hover:opacity-80"
        >
          Anvara
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink href="/marketplace">Marketplace</NavLink>
          {user && role === 'sponsor' && <NavLink href="/dashboard/sponsor">Campaigns</NavLink>}
          {user && role === 'publisher' && <NavLink href="/dashboard/publisher">Ad Slots</NavLink>}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[--color-border] border-t-[--accent]" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 border-l border-[--color-border] pl-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[--accent] text-sm font-medium text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-[--color-text]">{user.name}</span>
                  {role && (
                    <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wide text-[--color-text-muted]">
                      {role}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = '/';
                      },
                    },
                  });
                }}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-[--radius-sm]
              border border-[--color-border]
              text-[--color-text-secondary]
              hover:bg-[--color-bg-subtle]
              transition-colors duration-[--transition-fast]
            "
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[--color-border] bg-[--color-bg-elevated] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <MobileNavLink href="/marketplace" onClick={closeMobileMenu}>
              Marketplace
            </MobileNavLink>
            {user && role === 'sponsor' && (
              <MobileNavLink href="/dashboard/sponsor" onClick={closeMobileMenu}>
                Campaigns
              </MobileNavLink>
            )}
            {user && role === 'publisher' && (
              <MobileNavLink href="/dashboard/publisher" onClick={closeMobileMenu}>
                Ad Slots
              </MobileNavLink>
            )}

            <div className="mt-4 border-t border-[--color-border] pt-4">
              {isPending ? (
                <span className="text-[--color-text-muted]">Loading...</span>
              ) : user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-[--radius-sm] bg-[--color-bg-subtle] p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[--accent] font-medium text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[--color-text]">{user.name}</p>
                      {role && (
                        <p className="text-[--text-xs] uppercase tracking-wide text-[--color-text-muted]">
                          {role}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={async () => {
                      await authClient.signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            window.location.href = '/';
                          },
                        },
                      });
                    }}
                  >
                    Sign out
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={closeMobileMenu} className="block">
                  <Button className="w-full">Sign in</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/**
 * Mobile Nav Link with larger tap target
 */
function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        block rounded-[--radius-sm] px-3 py-2.5
        text-[--text-sm] font-medium
        transition-colors duration-[--transition-fast]
        ${
          isActive
            ? 'bg-[--accent-muted] text-[--accent]'
            : 'text-[--color-text-secondary] hover:bg-[--color-bg-subtle] hover:text-[--color-text]'
        }
      `}
    >
      {children}
    </Link>
  );
}
