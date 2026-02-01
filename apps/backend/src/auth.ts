import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from './db.js';

// Extended Request type with authenticated user information
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'sponsor' | 'publisher' | null;
    sponsorId?: string;
    publisherId?: string;
  };
}

// Parse session token from cookies
function getSessionToken(req: Request): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  // Better Auth uses 'better-auth.session_token' cookie
  const cookies = cookieHeader.split(';').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

  return cookies['better-auth.session_token'] || null;
}

// Authentication middleware - validates session and attaches user info
export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const sessionToken = getSessionToken(req);

    if (!sessionToken) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Look up session in database (Better Auth stores sessions in 'session' table)
    // The session token is hashed, so we query by the token directly
    const session = await prisma.$queryRaw<
      Array<{ id: string; userId: string; expiresAt: Date }>
    >`SELECT id, "userId", "expiresAt" FROM session WHERE token = ${sessionToken}`;

    if (!session || session.length === 0) {
      res.status(401).json({ error: 'Invalid session' });
      return;
    }

    const sessionData = session[0];

    // Check if session is expired
    if (new Date(sessionData.expiresAt) < new Date()) {
      res.status(401).json({ error: 'Session expired' });
      return;
    }

    // Get user from Better Auth's user table
    const users = await prisma.$queryRaw<
      Array<{ id: string; email: string; name: string }>
    >`SELECT id, email, name FROM "user" WHERE id = ${sessionData.userId}`;

    if (!users || users.length === 0) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const user = users[0];

    // Check if user is a sponsor
    const sponsor = await prisma.sponsor.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    // Check if user is a publisher
    const publisher = await prisma.publisher.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: sponsor ? 'sponsor' : publisher ? 'publisher' : null,
      sponsorId: sponsor?.id,
      publisherId: publisher?.id,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
}

// Role-based authorization middleware
export function requireRole(allowedRoles: Array<'sponsor' | 'publisher'>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
}
