import { Router, type Request, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';

const router: IRouter = Router();

// GET /api/sponsors - List all sponsors
router.get('/', async (_req: Request, res: Response) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      include: {
        _count: {
          select: { campaigns: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(sponsors);
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    res.status(500).json({ error: 'Failed to fetch sponsors' });
  }
});

// GET /api/sponsors/:id - Get single sponsor with campaigns
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const sponsor = await prisma.sponsor.findUnique({
      where: { id },
      include: {
        campaigns: {
          include: {
            _count: { select: { placements: true } },
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!sponsor) {
      res.status(404).json({ error: 'Sponsor not found' });
      return;
    }

    res.json(sponsor);
  } catch (error) {
    console.error('Error fetching sponsor:', error);
    res.status(500).json({ error: 'Failed to fetch sponsor' });
  }
});

// POST /api/sponsors - Create new sponsor
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, website, logo, description, industry } = req.body;

    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }

    const sponsor = await prisma.sponsor.create({
      data: { name, email, website, logo, description, industry },
    });

    res.status(201).json(sponsor);
  } catch (error) {
    console.error('Error creating sponsor:', error);
    res.status(500).json({ error: 'Failed to create sponsor' });
  }
});

// PUT /api/sponsors/:id - Update sponsor details
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    // Check if sponsor exists first
    const existingSponsor = await prisma.sponsor.findUnique({
      where: { id },
    });

    if (!existingSponsor) {
      res.status(404).json({ error: 'Sponsor not found' });
      return;
    }

    // Extract updatable fields from request body
    const { name, email, website, logo, description, industry } = req.body;

    // Validate required fields if provided
    if (name !== undefined && (!name || typeof name !== 'string')) {
      res.status(400).json({ error: 'Name must be a non-empty string' });
      return;
    }

    if (email !== undefined && (!email || typeof email !== 'string')) {
      res.status(400).json({ error: 'Email must be a non-empty string' });
      return;
    }

    // Build update data object with only provided fields
    const updateData: Record<string, string | undefined> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (website !== undefined) updateData.website = website;
    if (logo !== undefined) updateData.logo = logo;
    if (description !== undefined) updateData.description = description;
    if (industry !== undefined) updateData.industry = industry;

    // Update the sponsor
    const updatedSponsor = await prisma.sponsor.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedSponsor);
  } catch (error) {
    console.error('Error updating sponsor:', error);
    res.status(500).json({ error: 'Failed to update sponsor' });
  }
});

// DELETE /api/sponsors/:id - Delete a sponsor
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    // Check if sponsor exists
    const existingSponsor = await prisma.sponsor.findUnique({
      where: { id },
    });

    if (!existingSponsor) {
      res.status(404).json({ error: 'Sponsor not found' });
      return;
    }

    // Delete the sponsor (cascading deletes should be handled by Prisma schema)
    await prisma.sponsor.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    res.status(500).json({ error: 'Failed to delete sponsor' });
  }
});

export default router;
