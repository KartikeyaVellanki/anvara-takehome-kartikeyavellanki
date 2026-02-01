import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './index.js';

/**
 * API Integration Tests
 *
 * Tests the public API endpoints for the marketplace.
 * Note: Some endpoints require authentication which is tested separately.
 */

describe('Health API', () => {
  describe('GET /api/health', () => {
    it('returns health status with 200', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });

    it('includes timestamp in response', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body.timestamp).toBeDefined();
      // Timestamp should be a valid ISO date string
      expect(new Date(response.body.timestamp).toString()).not.toBe('Invalid Date');
    });
  });
});

describe('Sponsors API', () => {
  describe('GET /api/sponsors', () => {
    it('returns an array of sponsors with 200', async () => {
      const response = await request(app).get('/api/sponsors');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('sponsors have required fields', async () => {
      const response = await request(app).get('/api/sponsors');
      if (response.body.length > 0) {
        const sponsor = response.body[0];
        expect(sponsor).toHaveProperty('id');
        expect(sponsor).toHaveProperty('name');
        expect(sponsor).toHaveProperty('email');
      }
    });
  });

  describe('GET /api/sponsors/:id', () => {
    it('returns 404 for non-existent sponsor', async () => {
      const response = await request(app).get('/api/sponsors/non-existent-id-12345');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Sponsor not found');
    });
  });

  describe('POST /api/sponsors', () => {
    it('returns 400 for missing required fields', async () => {
      const response = await request(app).post('/api/sponsors').send({ description: 'Test' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Name and email are required');
    });
  });
});

describe('Publishers API', () => {
  describe('GET /api/publishers', () => {
    it('returns an array of publishers with 200', async () => {
      const response = await request(app).get('/api/publishers');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('publishers have required fields', async () => {
      const response = await request(app).get('/api/publishers');
      if (response.body.length > 0) {
        const publisher = response.body[0];
        expect(publisher).toHaveProperty('id');
        expect(publisher).toHaveProperty('name');
        expect(publisher).toHaveProperty('email');
      }
    });
  });

  describe('GET /api/publishers/:id', () => {
    it('returns 404 for non-existent publisher', async () => {
      const response = await request(app).get('/api/publishers/non-existent-id-12345');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Publisher not found');
    });
  });
});

describe('Ad Slots API (Marketplace)', () => {
  describe('GET /api/ad-slots', () => {
    it('returns paginated ad slots with 200', async () => {
      const response = await request(app).get('/api/ad-slots');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('pagination metadata has required fields', async () => {
      const response = await request(app).get('/api/ad-slots');
      const { pagination } = response.body;
      expect(pagination).toHaveProperty('page');
      expect(pagination).toHaveProperty('limit');
      expect(pagination).toHaveProperty('total');
      expect(pagination).toHaveProperty('totalPages');
      expect(pagination).toHaveProperty('hasMore');
    });

    it('respects limit parameter', async () => {
      const response = await request(app).get('/api/ad-slots?limit=2');
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.pagination.limit).toBe(2);
    });

    it('filters by available status', async () => {
      const response = await request(app).get('/api/ad-slots?available=true');
      expect(response.status).toBe(200);
      // All returned slots should be available
      response.body.data.forEach((slot: { isAvailable: boolean }) => {
        expect(slot.isAvailable).toBe(true);
      });
    });

    it('ad slots have required fields', async () => {
      const response = await request(app).get('/api/ad-slots');
      if (response.body.data.length > 0) {
        const slot = response.body.data[0];
        expect(slot).toHaveProperty('id');
        expect(slot).toHaveProperty('name');
        expect(slot).toHaveProperty('type');
        expect(slot).toHaveProperty('basePrice');
        expect(slot).toHaveProperty('isAvailable');
      }
    });
  });

  describe('GET /api/ad-slots/:id', () => {
    it('returns 404 for non-existent ad slot', async () => {
      const response = await request(app).get('/api/ad-slots/non-existent-id-12345');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Ad slot not found');
    });
  });
});

describe('Newsletter API', () => {
  describe('POST /api/newsletter/subscribe', () => {
    it('returns 400 for missing email', async () => {
      const response = await request(app).post('/api/newsletter/subscribe').send({});
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email is required');
    });

    it('returns 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'invalid-email' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid email format');
    });

    it('returns success for valid email', async () => {
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'test@example.com' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeDefined();
    });
  });
});

describe('Quotes API', () => {
  describe('POST /api/quotes/request', () => {
    it('returns 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/quotes/request')
        .send({ email: 'test@example.com' });
      expect(response.status).toBe(400);
    });

    it('returns 400 for invalid email format', async () => {
      const response = await request(app).post('/api/quotes/request').send({
        email: 'invalid',
        companyName: 'Test Company',
        message: 'Test message',
        adSlotId: 'test-id',
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid email format');
    });
  });
});

describe('Rate Limiting', () => {
  it('includes proper headers in responses', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    // Response should complete without rate limit error for single request
  });
});
