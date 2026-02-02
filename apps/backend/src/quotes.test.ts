import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './index.js';

/**
 * Quotes route tests (additional coverage)
 *
 * Purpose:
 * - Ensure successful requests return a quoteId (used by the UI confirmation state).
 * - Guard required validation messaging so the frontend can render errors consistently.
 */
describe('Quotes API (extra)', () => {
  it('returns a quoteId on success', async () => {
    const response = await request(app).post('/api/quotes/request').send({
      email: `test+${Date.now()}@example.com`,
      companyName: 'Acme Inc',
      message: 'Interested in custom pricing',
      adSlotId: 'test-ad-slot-id',
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(typeof response.body.quoteId).toBe('string');
    expect(response.body.quoteId.length).toBeGreaterThan(0);
  });

  it('validates company name length', async () => {
    const response = await request(app).post('/api/quotes/request').send({
      email: `test+${Date.now()}@example.com`,
      companyName: 'A',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Company name must be at least 2 characters');
  });
});

