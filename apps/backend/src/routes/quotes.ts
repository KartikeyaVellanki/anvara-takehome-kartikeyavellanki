import { Router, Request, Response, type IRouter } from 'express';

const router: IRouter = Router();

// Simple in-memory storage for demo (not persisted)
const quoteRequests: Array<{
  id: string;
  email: string;
  companyName: string;
  phone?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  adSlotId?: string;
  adSlotName?: string;
  createdAt: Date;
}> = [];

/**
 * Validates email format using a basic regex pattern.
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Generates a simple quote ID for demo purposes.
 */
function generateQuoteId(): string {
  return `QR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

/**
 * POST /api/quotes/request
 * Submit a quote request for an ad slot
 */
router.post('/request', (req: Request, res: Response) => {
  const { email, companyName, phone, budget, timeline, message, adSlotId, adSlotName } = req.body;

  // Validate required fields
  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Email is required',
    });
  }

  if (!companyName || typeof companyName !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Company name is required',
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const trimmedCompanyName = companyName.trim();

  // Validate email format
  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format',
    });
  }

  // Validate company name length
  if (trimmedCompanyName.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Company name must be at least 2 characters',
    });
  }

  // Create quote request
  const quoteId = generateQuoteId();
  const quoteRequest = {
    id: quoteId,
    email: normalizedEmail,
    companyName: trimmedCompanyName,
    phone: phone?.trim() || undefined,
    budget: budget?.trim() || undefined,
    timeline: timeline?.trim() || undefined,
    message: message?.trim() || undefined,
    adSlotId: adSlotId || undefined,
    adSlotName: adSlotName || undefined,
    createdAt: new Date(),
  };

  // Store quote request (in-memory for demo)
  quoteRequests.push(quoteRequest);

  return res.status(200).json({
    success: true,
    quoteId,
    message: "Thanks for your interest! We'll get back to you within 24 hours.",
  });
});

/**
 * GET /api/quotes
 * List all quote requests (for admin/demo purposes)
 */
router.get('/', (_req: Request, res: Response) => {
  return res.json({
    data: quoteRequests,
    total: quoteRequests.length,
  });
});

export default router;
