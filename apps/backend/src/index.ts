import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app: Application = express();
const PORT = process.env.BACKEND_PORT || 4291;

// ============================================================================
// CORS CONFIGURATION
// ============================================================================

/**
 * Configure CORS with proper security settings
 * In production, this should use environment-specific allowed origins
 */
const corsOptions: cors.CorsOptions = {
  // In development, allow all origins; in production, use specific origins
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3847']
      : true,
  credentials: true, // Allow cookies for authentication
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Simple in-memory rate limiter
 * For production, consider using redis-based rate limiting (e.g., express-rate-limit with redis store)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const RATE_LIMIT_MAX_REQUESTS = 100; // Max 100 requests per minute

function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  // Use IP address as identifier (in production, consider using user ID for authenticated requests)
  const clientId = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const clientData = rateLimitStore.get(clientId);

  if (!clientData || now > clientData.resetTime) {
    // New window - reset counter
    rateLimitStore.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    next();
    return;
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    // Rate limit exceeded
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
    });
    return;
  }

  // Increment counter
  clientData.count++;
  next();
}

// Clean up old rate limit entries periodically (every 5 minutes)
// Only run in non-test environment to avoid open handles in tests
if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetTime) {
          rateLimitStore.delete(key);
        }
      }
    },
    5 * 60 * 1000
  );
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(cors(corsOptions));
app.use(express.json());
app.use(rateLimiter); // Apply rate limiting to all routes

// Mount all API routes
app.use('/api', routes);

// ============================================================================
// SERVER STARTUP
// ============================================================================

/**
 * Only start the server if this file is run directly (not imported for testing).
 * When imported by tests, we just export the app without starting the listener.
 */
const isTestEnvironment = process.env.NODE_ENV === 'test' || process.env.VITEST;

if (!isTestEnvironment) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Backend server running at http://localhost:${PORT}\n`);
    console.log('Available API endpoints:');
    console.log('  Auth:');
    console.log('    POST   /api/auth/login');
    console.log('  Sponsors:');
    console.log('    GET    /api/sponsors');
    console.log('    GET    /api/sponsors/:id');
    console.log('    POST   /api/sponsors');
    console.log('    PUT    /api/sponsors/:id');
    console.log('    DELETE /api/sponsors/:id');
    console.log('  Publishers:');
    console.log('    GET    /api/publishers');
    console.log('    GET    /api/publishers/:id');
    console.log('  Campaigns:');
    console.log('    GET    /api/campaigns');
    console.log('    GET    /api/campaigns/:id');
    console.log('    POST   /api/campaigns');
    console.log('  Ad Slots:');
    console.log('    GET    /api/ad-slots');
    console.log('    GET    /api/ad-slots/:id');
    console.log('    POST   /api/ad-slots');
    console.log('  Placements:');
    console.log('    GET    /api/placements');
    console.log('    POST   /api/placements');
    console.log('  Newsletter:');
    console.log('    POST   /api/newsletter/subscribe');
    console.log('  Quotes:');
    console.log('    POST   /api/quotes/request');
    console.log('  Dashboard:');
    console.log('    GET    /api/dashboard/stats');
    console.log('  Health:');
    console.log('    GET    /api/health');
    console.log('');
  });
}

export default app;
