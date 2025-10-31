import express from 'express';
import prisma from '../config/prisma.js';

const router = express.Router();

// Get all ads
router.get('/', async (req, res) => {
  try {
    const { position, isActive } = req.query;

    const where = {};

    if (position) {
      where.position = position;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const ads = await prisma.ad.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ ads });
  } catch (error) {
    console.error('Get ads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single ad
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const ad = await prisma.ad.findUnique({
      where: { id: parseInt(id) },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.json({ ad });
  } catch (error) {
    console.error('Get ad error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create ad
router.post('/', async (req, res) => {
  try {
    const {
      title,
      imageUrl,
      linkUrl,
      position,
      isActive,
      startDate,
      endDate,
      createdBy
    } = req.body;

    if (!title || !imageUrl || !position || !createdBy) {
      return res.status(400).json({ 
        message: 'Title, imageUrl, position, and createdBy are required' 
      });
    }

    const ad = await prisma.ad.create({
      data: {
        title,
        imageUrl,
        linkUrl,
        position,
        isActive: isActive !== undefined ? isActive : true,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        createdBy: parseInt(createdBy)
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({ ad });
  } catch (error) {
    console.error('Create ad error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update ad
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      imageUrl,
      linkUrl,
      position,
      isActive,
      startDate,
      endDate
    } = req.body;

    const updateData = {};

    if (title) updateData.title = title;
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (linkUrl !== undefined) updateData.linkUrl = linkUrl;
    if (position) updateData.position = position;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);

    const ad = await prisma.ad.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({ ad });
  } catch (error) {
    console.error('Update ad error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete ad
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.ad.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    console.error('Delete ad error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Track ad click
router.post('/:id/click', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.ad.update({
      where: { id: parseInt(id) },
      data: {
        clicks: {
          increment: 1
        }
      }
    });

    res.json({ message: 'Click tracked' });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Track ad impression
router.post('/:id/impression', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.ad.update({
      where: { id: parseInt(id) },
      data: {
        impressions: {
          increment: 1
        }
      }
    });

    res.json({ message: 'Impression tracked' });
  } catch (error) {
    console.error('Track impression error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
