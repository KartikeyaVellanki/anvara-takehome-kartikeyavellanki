'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, startTransition, useCallback } from 'react';
import { authClient } from '@/auth-client';
import { useTheme } from './theme-provider';
import { Button, IconButton } from './ui/button';

interface User {
  id: string;
  email: string;
  name: string;
}

interface RoleInfo {
  role: 'sponsor' | 'publisher' | null;
  name?: string;
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        px-4 py-2 rounded-full
        text-[--text-sm] font-semibold
        transition-all duration-200 ease-out
        border border-transparent
        ${
          isActive
            ? 'bg-[--glass-strong] text-[--color-text] border-[--glass-border]'
            : 'text-[--color-text-secondary] hover:bg-[--glass]'
        }
      `}
    >
      {children}
    </Link>
  );
}

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(function onMount() {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10" aria-hidden="true" />;
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <IconButton
      variant="text"
      onClick={toggleTheme}
      label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </IconButton>
  );
}

export function Nav() {
  const [user, setUser] = useState<User | null>(null);
  const [roleInfo, setRoleInfo] = useState<RoleInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const loadSession = useCallback(async (withLoading: boolean) => {
    if (withLoading) {
      setLoading(true);
    }

    try {
      const { data } = await authClient.getSession();
      if (data?.user) {
        const sessionUser = data.user as User;
        setUser(sessionUser);

        try {
          const roleRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/auth/role/${sessionUser.id}`
          );
          const roleData = await roleRes.json();
          setRoleInfo(roleData);
        } catch {
          setRoleInfo(null);
        }
      } else {
        setUser(null);
        setRoleInfo(null);
      }
    } finally {
      if (withLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadSession(true);
  }, [loadSession]);

  useEffect(() => {
    loadSession(false);
  }, [loadSession, pathname]);

  useEffect(() => {
    if (loading || user) return;
    const retryId = window.setTimeout(() => {
      loadSession(false);
    }, 800);
    return () => window.clearTimeout(retryId);
  }, [loading, user, loadSession]);

  const handleLogout = async () => {
    await authClient.signOut();
    setUser(null);
    setRoleInfo(null);
    window.location.href = '/';
  };

  const dashboardLink = roleInfo?.role === 'publisher' ? '/dashboard/publisher' : '/dashboard/sponsor';

  return (
    <nav className="sticky top-0 z-40 border-b border-[--glass-border] bg-[--glass-strong] backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-[--text-title-large] font-semibold text-[--accent] hover:opacity-80 transition-opacity"
          >
            Anvara
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            <NavLink href="/marketplace">Marketplace</NavLink>
            {user && <NavLink href={dashboardLink}>Dashboard</NavLink>}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-2">
              {loading ? (
                <div className="h-10 w-24 animate-pulse rounded-full bg-[--glass-strong]" />
              ) : user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-[--glass-border] bg-[--glass]">
                    <div className="h-8 w-8 rounded-full bg-[--accent]/20 flex items-center justify-center text-[--text-label-medium] font-semibold text-[--color-text]">
                      {(roleInfo?.name || user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[--text-sm] text-[--color-text]">
                      {roleInfo?.name || user.name || user.email.split('@')[0]}
                    </span>
                  </div>
                  <Button variant="text" onClick={handleLogout}>
                    Log out
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button variant="filled">Log in</Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <IconButton
              variant="text"
              label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </IconButton>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-[--glass-border] py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <Link
                href="/marketplace"
                className={`px-4 py-3 rounded-xl transition-colors ${
                  pathname === '/marketplace'
                    ? 'bg-[--glass-strong] text-[--color-text]'
                    : 'text-[--color-text-secondary] hover:bg-[--glass]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              {user && (
                <Link
                  href={dashboardLink}
                  className={`px-4 py-3 rounded-xl transition-colors ${
                    pathname === dashboardLink
                      ? 'bg-[--glass-strong] text-[--color-text]'
                      : 'text-[--color-text-secondary] hover:bg-[--glass]'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              <div className="border-t border-[--glass-border] pt-4 mt-2">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4">
                      <div className="h-10 w-10 rounded-full bg-[--accent]/20 flex items-center justify-center text-[--text-title-medium] font-semibold text-[--color-text]">
                        {(roleInfo?.name || user.name || user.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[--text-body-large] font-semibold text-[--color-text]">
                          {roleInfo?.name || user.name || 'User'}
                        </p>
                        <p className="text-[--text-body-medium] text-[--color-text-secondary]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outlined"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      Log out
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="filled" className="w-full">
                      Log in
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
