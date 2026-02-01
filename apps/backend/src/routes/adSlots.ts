import { Router, type Request, type Response, type IRouter } from 'express';
import { prisma, AdSlotType } from '../db.js';
import { getParam } from '../utils/helpers.js';
import { requireAuth, type AuthRequest } from '../auth.js';

const router: IRouter = Router();

// Valid ad slot types
const VALID_AD_SLOT_TYPES: AdSlotType[] = ['DISPLAY', 'VIDEO', 'NATIVE', 'NEWSLETTER', 'PODCAST'];

// GET /api/ad-slots - List ad slots with pagination (public for marketplace)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { publisherId, type, available, page, limit } = req.query;

    // Pagination parameters with defaults
    const pageNum = Math.max(1, parseInt(getParam(page) || '1', 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(getParam(limit) || '9', 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {
      ...(publisherId && { publisherId: getParam(publisherId) }),
      ...(type && { type: type as AdSlotType }),
      ...(available === 'true' && { isAvailable: true }),
    };

    // Get total count for pagination metadata
    const total = await prisma.adSlot.count({ where });

    // Get paginated results
    const adSlots = await prisma.adSlot.findMany({
      where,
      include: {
        publisher: { select: { id: true, name: true, category: true, monthlyViews: true } },
        _count: { select: { placements: true } },
      },
      orderBy: { basePrice: 'desc' },
      skip,
      take: limitNum,
    });

    // Return paginated response with metadata
    res.json({
      data: adSlots,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasMore: pageNum * limitNum < total,
      },
    });
  } catch (error) {
    console.error('Error fetching ad slots:', error);
    res.status(500).json({ error: 'Failed to fetch ad slots' });
  }
});

// GET /api/ad-slots/:id - Get single ad slot with details (public for marketplace)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: {
        publisher: true,
        placements: {
          include: {
            campaign: { select: { id: true, name: true, status: true } },
          },
        },
      },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    res.json(adSlot);
  } catch (error) {
    console.error('Error fetching ad slot:', error);
    res.status(500).json({ error: 'Failed to fetch ad slot' });
  }
});

// POST /api/ad-slots - Create new ad slot (requires authentication)
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.publisherId) {
      res.status(403).json({ error: 'Only publishers can create ad slots' });
      return;
    }

    const { name, description, type, basePrice, position, width, height } = req.body;

    if (!name || !type || !basePrice) {
      res.status(400).json({
        error: 'Name, type, and basePrice are required',
      });
      return;
    }

    // Validate basePrice is positive
    if (Number(basePrice) <= 0) {
      res.status(400).json({ error: 'basePrice must be a positive number' });
      return;
    }

    // Validate type is valid enum
    if (!VALID_AD_SLOT_TYPES.includes(type as AdSlotType)) {
      res.status(400).json({
        error: `Invalid type. Must be one of: ${VALID_AD_SLOT_TYPES.join(', ')}`,
      });
      return;
    }

    const adSlot = await prisma.adSlot.create({
      data: {
        name,
        description,
        type: type as AdSlotType,
        basePrice,
        position,
        width,
        height,
        publisherId: req.user.publisherId, // Use authenticated user's publisherId
      },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(adSlot);
  } catch (error) {
    console.error('Error creating ad slot:', error);
    res.status(500).json({ error: 'Failed to create ad slot' });
  }
});

// PUT /api/ad-slots/:id - Update ad slot (requires authentication, verify ownership)
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    // Verify ownership
    const existingSlot = await prisma.adSlot.findFirst({
      where: {
        id,
        publisher: { userId: req.user!.id },
      },
    });

    if (!existingSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    const { name, description, type, basePrice, position, width, height, isAvailable } = req.body;

    // Validate basePrice if provided
    if (basePrice !== undefined && Number(basePrice) <= 0) {
      res.status(400).json({ error: 'basePrice must be a positive number' });
      return;
    }

    // Validate type if provided
    if (type !== undefined && !VALID_AD_SLOT_TYPES.includes(type as AdSlotType)) {
      res.status(400).json({
        error: `Invalid type. Must be one of: ${VALID_AD_SLOT_TYPES.join(', ')}`,
      });
      return;
    }

    const adSlot = await prisma.adSlot.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type: type as AdSlotType }),
        ...(basePrice !== undefined && { basePrice }),
        ...(position !== undefined && { position }),
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
        ...(isAvailable !== undefined && { isAvailable }),
      },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.json(adSlot);
  } catch (error) {
    console.error('Error updating ad slot:', error);
    res.status(500).json({ error: 'Failed to update ad slot' });
  }
});

// DELETE /api/ad-slots/:id - Delete ad slot (requires authentication, verify ownership)
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    // Verify ownership
    const existingSlot = await prisma.adSlot.findFirst({
      where: {
        id,
        publisher: { userId: req.user!.id },
      },
    });

    if (!existingSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    await prisma.adSlot.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting ad slot:', error);
    res.status(500).json({ error: 'Failed to delete ad slot' });
  }
});

// POST /api/ad-slots/:id/book - Book an ad slot (requires authentication as sponsor)
router.post('/:id/book', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.sponsorId) {
      res.status(403).json({ error: 'Only sponsors can book ad slots' });
      return;
    }

    const id = getParam(req.params.id);
    const { message } = req.body;

    // Check if slot exists and is available
    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: { publisher: true },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (!adSlot.isAvailable) {
      res.status(400).json({ error: 'Ad slot is no longer available' });
      return;
    }

    // Mark slot as unavailable
    const updatedSlot = await prisma.adSlot.update({
      where: { id },
      data: { isAvailable: false },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    console.log(
      `Ad slot ${id} booked by sponsor ${req.user.sponsorId}. Message: ${message || 'None'}`
    );

    res.json({
      success: true,
      message: 'Ad slot booked successfully!',
      adSlot: updatedSlot,
    });
  } catch (error) {
    console.error('Error booking ad slot:', error);
    res.status(500).json({ error: 'Failed to book ad slot' });
  }
});

// POST /api/ad-slots/:id/unbook - Reset ad slot to available (requires authentication, verify ownership)
router.post('/:id/unbook', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    // Verify ownership (only publisher can unbook their own slots)
    const existingSlot = await prisma.adSlot.findFirst({
      where: {
        id,
        publisher: { userId: req.user!.id },
      },
    });

    if (!existingSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    const updatedSlot = await prisma.adSlot.update({
      where: { id },
      data: { isAvailable: true },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.json({
      success: true,
      message: 'Ad slot is now available again',
      adSlot: updatedSlot,
    });
  } catch (error) {
    console.error('Error unbooking ad slot:', error);
    res.status(500).json({ error: 'Failed to unbook ad slot' });
  }
});

export default router;
