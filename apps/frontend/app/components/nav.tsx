'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authClient } from '@/auth-client';

type UserRole = 'sponsor' | 'publisher' | null;

// NavLink with active state styling
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
      className={`transition-colors ${
        isActive
          ? 'font-medium text-[--color-primary]'
          : 'text-[--color-muted] hover:text-[--color-foreground]'
      }`}
    >
      {children}
    </Link>
  );
}

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

  // Close mobile menu on route change
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[--color-border] bg-[--color-background]/95 backdrop-blur supports-[backdrop-filter]:bg-[--color-background]/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-[--color-primary] transition-transform hover:scale-105"
        >
          Anvara
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLink href="/marketplace">Marketplace</NavLink>

          {user && role === 'sponsor' && <NavLink href="/dashboard/sponsor">My Campaigns</NavLink>}
          {user && role === 'publisher' && (
            <NavLink href="/dashboard/publisher">My Ad Slots</NavLink>
          )}

          {isPending ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[--color-muted] border-t-[--color-primary]" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[--color-primary] text-xs font-medium text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium">{user.name}</span>
                {role && (
                  <span className="rounded bg-[--color-primary]/10 px-1.5 py-0.5 text-xs font-medium text-[--color-primary]">
                    {role}
                  </span>
                )}
              </div>
              <button
                onClick={async () => {
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = '/';
                      },
                    },
                  });
                }}
                className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-[--color-primary] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[--color-primary-hover] hover:shadow-md"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[--color-border] md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[--color-border] bg-[--color-background] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink href="/marketplace" onClick={closeMobileMenu}>
              Marketplace
            </NavLink>

            {user && role === 'sponsor' && (
              <NavLink href="/dashboard/sponsor" onClick={closeMobileMenu}>
                My Campaigns
              </NavLink>
            )}
            {user && role === 'publisher' && (
              <NavLink href="/dashboard/publisher" onClick={closeMobileMenu}>
                My Ad Slots
              </NavLink>
            )}

            <div className="border-t border-[--color-border] pt-4">
              {isPending ? (
                <span className="text-[--color-muted]">Loading...</span>
              ) : user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[--color-primary] text-sm font-medium text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      {role && <p className="text-xs text-[--color-muted] capitalize">{role}</p>}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await authClient.signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            window.location.href = '/';
                          },
                        },
                      });
                    }}
                    className="w-full rounded-lg bg-slate-200 px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="block w-full rounded-lg bg-[--color-primary] px-4 py-3 text-center text-sm font-medium text-white hover:bg-[--color-primary-hover]"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
