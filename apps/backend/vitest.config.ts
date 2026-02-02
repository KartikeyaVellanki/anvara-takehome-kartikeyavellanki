import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';
import path from 'path';

// Ensure `pnpm test` uses the same monorepo env as `pnpm dev` (DATABASE_URL, ports, etc).
// Dotenv won't override an existing DATABASE_URL unless we pass `override: true`.
dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });

export default defineConfig({
  test: {
    environment: 'node',
  },
});

