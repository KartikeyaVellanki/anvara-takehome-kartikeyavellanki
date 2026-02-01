import { Router, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { getParam } from '../utils/helpers.js';
import { requireAuth, type AuthRequest } from '../auth.js';

const router: IRouter = Router();

// All campaign routes require authentication
router.use(requireAuth);

// GET /api/campaigns - List campaigns (filtered by user's sponsorId)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.sponsorId) {
      res.status(403).json({ error: 'Only sponsors can view campaigns' });
      return;
    }

    const { status } = req.query;

    // Only return campaigns belonging to the authenticated user's sponsor
    const campaigns = await prisma.campaign.findMany({
      where: {
        sponsorId: req.user.sponsorId,
        ...(status && { status: status as 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' }),
      },
      include: {
        sponsor: { select: { id: true, name: true, logo: true } },
        _count: { select: { creatives: true, placements: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// GET /api/campaigns/:id - Get single campaign with details (verify ownership)
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    // Find campaign and verify ownership
    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        sponsor: { userId: req.user!.id },
      },
      include: {
        sponsor: true,
        creatives: true,
        placements: {
          include: {
            adSlot: true,
            publisher: { select: { id: true, name: true, category: true } },
          },
        },
      },
    });

    if (!campaign) {
      // Return 404 for both not found and not owned (security best practice)
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// POST /api/campaigns - Create new campaign (for authenticated sponsor)
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.sponsorId) {
      res.status(403).json({ error: 'Only sponsors can create campaigns' });
      return;
    }

    const {
      name,
      description,
      budget,
      cpmRate,
      cpcRate,
      startDate,
      endDate,
      targetCategories,
      targetRegions,
    } = req.body;

    if (!name || !budget || !startDate || !endDate) {
      res.status(400).json({
        error: 'Name, budget, startDate, and endDate are required',
      });
      return;
    }

    // Validate budget is positive
    if (Number(budget) <= 0) {
      res.status(400).json({ error: 'Budget must be a positive number' });
      return;
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        budget,
        cpmRate,
        cpcRate,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        targetCategories: targetCategories || [],
        targetRegions: targetRegions || [],
        sponsorId: req.user.sponsorId, // Use authenticated user's sponsorId
      },
      include: {
        sponsor: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// PUT /api/campaigns/:id - Update campaign (verify ownership)
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    // Verify ownership
    const existingCampaign = await prisma.campaign.findFirst({
      where: {
        id,
        sponsor: { userId: req.user!.id },
      },
    });

    if (!existingCampaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    const {
      name,
      description,
      budget,
      cpmRate,
      cpcRate,
      startDate,
      endDate,
      targetCategories,
      targetRegions,
      status,
    } = req.body;

    // Validate budget if provided
    if (budget !== undefined && Number(budget) <= 0) {
      res.status(400).json({ error: 'Budget must be a positive number' });
      return;
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(budget !== undefined && { budget }),
        ...(cpmRate !== undefined && { cpmRate }),
        ...(cpcRate !== undefined && { cpcRate }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
        ...(targetCategories !== undefined && { targetCategories }),
        ...(targetRegions !== undefined && { targetRegions }),
        ...(status !== undefined && { status }),
      },
      include: {
        sponsor: { select: { id: true, name: true } },
      },
    });

    res.json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// DELETE /api/campaigns/:id - Delete campaign (verify ownership)
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    // Verify ownership
    const existingCampaign = await prisma.campaign.findFirst({
      where: {
        id,
        sponsor: { userId: req.user!.id },
      },
    });

    if (!existingCampaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    await prisma.campaign.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

export default router;
