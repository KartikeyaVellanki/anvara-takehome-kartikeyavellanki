import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './index.js';

/**
 * Newsletter route tests (additional coverage)
 *
 * Purpose:
 * - Validate idempotency: repeated subscriptions should not error or create duplicates.
 * - Keep the public API contract stable for marketing/lead-capture UI.
 */
describe('Newsletter API (extra)', () => {
  it('treats repeat subscriptions as idempotent', async () => {
    const email = `test+${Date.now()}@example.com`;

    const first = await request(app).post('/api/newsletter/subscribe').send({ email });
    expect(first.status).toBe(200);
    expect(first.body.success).toBe(true);

    const second = await request(app).post('/api/newsletter/subscribe').send({ email });
    expect(second.status).toBe(200);
    expect(second.body.success).toBe(true);
    expect(String(second.body.message || '')).toMatch(/already/i);
  });
});

