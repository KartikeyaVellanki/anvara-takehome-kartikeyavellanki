// Test setup for the Next.js frontend.
//
// We keep this lightweight: add DOM matchers and ensure RTL cleans up between tests.
import '@testing-library/jest-dom/vitest';

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

