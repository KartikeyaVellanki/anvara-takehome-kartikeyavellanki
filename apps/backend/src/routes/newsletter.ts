import { Router, Request, Response, type IRouter } from 'express';

const router: IRouter = Router();

// Simple in-memory storage for demo (not persisted)
const subscribers = new Set<string>();

/**
 * Validates email format using a basic regex pattern.
 * @param email - The email string to validate
 * @returns true if email format is valid
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * POST /api/newsletter/subscribe
 * Subscribe to newsletter with email validation
 */
router.post('/subscribe', (req: Request, res: Response) => {
  const { email } = req.body;

  // Validate email is provided
  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Email is required',
    });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Validate email format
  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid email address',
    });
  }

  // Check for duplicate subscription
  if (subscribers.has(normalizedEmail)) {
    return res.status(200).json({
      success: true,
      message: "You're already subscribed! Thanks for your interest.",
    });
  }

  // Add to subscribers (in-memory for demo)
  subscribers.add(normalizedEmail);

  return res.status(200).json({
    success: true,
    message: 'Thanks for subscribing! Watch your inbox for exclusive deals.',
  });
});

export default router;
