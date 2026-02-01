'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/auth-client';
import { Button } from '@/app/components/ui/button';
import { Select, Label } from '@/app/components/ui/input';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

/**
 * Login Page
 * 
 * Quick login for demo accounts (sponsor/publisher).
 * Swiss minimalist design with clean form.
 */
export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'sponsor' | 'publisher'>('sponsor');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-fill credentials based on selected role
  const email = role === 'sponsor' ? 'sponsor@example.com' : 'publisher@example.com';
  const password = 'password';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: async (ctx) => {
          try {
            const userId = ctx.data?.user?.id;
            if (userId) {
              const roleRes = await fetch(`${API_URL}/api/auth/role/${userId}`);
              const roleData = await roleRes.json();
              if (roleData.role === 'sponsor') {
                router.push('/dashboard/sponsor');
              } else if (roleData.role === 'publisher') {
                router.push('/dashboard/publisher');
              } else {
                router.push('/');
              }
            } else {
              router.push('/');
            }
          } catch {
            router.push('/');
          }
        },
        onError: (ctx) => {
          setError(ctx.error.message || 'Login failed');
          setLoading(false);
        },
      }
    );

    if (signInError) {
      setError(signInError.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-[--text-2xl] font-semibold text-[--color-text]">
            Sign in to Anvara
          </h1>
          <p className="mt-2 text-[--text-sm] text-[--color-text-secondary]">
            Select a demo account to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 border border-[--error] bg-[--error-light] p-4 text-[--text-sm] text-red-800">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="role">Account Type</Label>
            <Select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'sponsor' | 'publisher')}
            >
              <option value="sponsor">Sponsor (sponsor@example.com)</option>
              <option value="publisher">Publisher (publisher@example.com)</option>
            </Select>
            <p className="mt-1.5 text-[--text-xs] text-[--color-text-muted]">
              Password: password
            </p>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Signing in...' : `Sign in as ${role === 'sponsor' ? 'Sponsor' : 'Publisher'}`}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-[--text-xs] text-[--color-text-muted]">
          Demo accounts for testing purposes only.
        </p>
      </div>
    </div>
  );
}
