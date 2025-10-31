import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// PUBLIC ROUTES
// ============================================

// GET /api/advertisements - Get all advertisements
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      featured, 
      active = 'true',
      search,
      limit = '20',
      offset = '0'
    } = req.query;

    const where = {
      isActive: active === 'true',
      ...(category && { category }),
      ...(featured === 'true' && { isFeatured: true }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { company: { contains: search } },
          { fullDescription: { contains: search } }
        ]
      })
    };

    const advertisements = await prisma.advertisement.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    const total = await prisma.advertisement.count({ where });

    res.json({
      success: true,
      data: advertisements,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > parseInt(offset) + parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch advertisements' 
    });
  }
});

// GET /api/advertisements/featured - Get featured advertisements
router.get('/featured', async (req, res) => {
  try {
    const { limit = '6' } = req.query;

    const advertisements = await prisma.advertisement.findMany({
      where: {
        isActive: true,
        isFeatured: true
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json({
      success: true,
      data: advertisements
    });
  } catch (error) {
    console.error('Error fetching featured advertisements:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch featured advertisements' 
    });
  }
});

// GET /api/advertisements/:id - Get single advertisement
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const advertisement = await prisma.advertisement.findUnique({
      where: { id: parseInt(id) }
    });

    if (!advertisement) {
      return res.status(404).json({ 
        success: false, 
        error: 'Advertisement not found' 
      });
    }

    res.json({
      success: true,
      data: advertisement
    });
  } catch (error) {
    console.error('Error fetching advertisement:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch advertisement' 
    });
  }
});

// POST /api/advertisements/:id/view - Increment view count
router.post('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;

    const advertisement = await prisma.advertisement.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } }
    });

    res.json({
      success: true,
      data: { views: advertisement.views }
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to increment views' 
    });
  }
});

// POST /api/advertisements/:id/apply - Track application
router.post('/:id/apply', async (req, res) => {
  try {
    const { id } = req.params;

    const advertisement = await prisma.advertisement.update({
      where: { id: parseInt(id) },
      data: { applicants: { increment: 1 } }
    });

    res.json({
      success: true,
      data: { applicants: advertisement.applicants }
    });
  } catch (error) {
    console.error('Error tracking application:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to track application' 
    });
  }
});

// ============================================
// PROTECTED ROUTES (Admin only)
// ============================================

// POST /api/advertisements - Create advertisement
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      fullDescription,
      company,
      category,
      imageUrl,
      location,
      deadline,
      contactPhone,
      contactEmail,
      contactWebsite,
      contactAddress,
      requirements,
      benefits,
      isFeatured
    } = req.body;

    // Validation
    if (!title || !fullDescription || !company || !category || !location) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    const advertisement = await prisma.advertisement.create({
      data: {
        title,
        fullDescription,
        company,
        category,
        imageUrl,
        location,
        deadline: deadline ? new Date(deadline) : null,
        contactPhone,
        contactEmail,
        contactWebsite,
        contactAddress,
        requirements: requirements ? JSON.stringify(requirements) : null,
        benefits: benefits ? JSON.stringify(benefits) : null,
        isFeatured: isFeatured || false
      }
    });

    res.status(201).json({
      success: true,
      data: advertisement,
      message: 'Advertisement created successfully'
    });
  } catch (error) {
    console.error('Error creating advertisement:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create advertisement' 
    });
  }
});

// PUT /api/advertisements/:id - Update advertisement
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      fullDescription,
      company,
      category,
      imageUrl,
      location,
      deadline,
      contactPhone,
      contactEmail,
      contactWebsite,
      contactAddress,
      requirements,
      benefits,
      isActive,
      isFeatured
    } = req.body;

    const advertisement = await prisma.advertisement.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(fullDescription && { fullDescription }),
        ...(company && { company }),
        ...(category && { category }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(location && { location }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(contactPhone !== undefined && { contactPhone }),
        ...(contactEmail !== undefined && { contactEmail }),
        ...(contactWebsite !== undefined && { contactWebsite }),
        ...(contactAddress !== undefined && { contactAddress }),
        ...(requirements !== undefined && { requirements: requirements ? JSON.stringify(requirements) : null }),
        ...(benefits !== undefined && { benefits: benefits ? JSON.stringify(benefits) : null }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured })
      }
    });

    res.json({
      success: true,
      data: advertisement,
      message: 'Advertisement updated successfully'
    });
  } catch (error) {
    console.error('Error updating advertisement:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update advertisement' 
    });
  }
});

// DELETE /api/advertisements/:id - Delete advertisement
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.advertisement.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Advertisement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete advertisement' 
    });
  }
});

export default router;
