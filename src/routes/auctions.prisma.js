import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/auctions - Get all auctions
router.get('/', async (req, res) => {
  try {
    const { status, category, limit = '20' } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    
    const auctions = await prisma.auction.findMany({
      where: whereClause,
      include: { seller: { select: { id: true, name: true } } },
      orderBy: { endTime: 'asc' },
      take: parseInt(limit)
    });
    res.json({ success: true, data: auctions });
  } catch (error) {
    console.error('Get auctions error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch auctions', message: error.message });
  }
});

// GET /api/auctions/:id - Get single auction
router.get('/:id', async (req, res) => {
  try {
    const auction = await prisma.auction.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        seller: { select: { id: true, name: true } },
        bids: { orderBy: { bidTime: 'desc' }, take: 10, include: { user: { select: { name: true } } } }
      }
    });
    if (!auction) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: auction });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch auction' });
  }
});

// POST /api/auctions/:id/bid - Place bid
router.post('/:id/bid', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const auction = await prisma.auction.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!auction || auction.status !== 'active') {
      return res.status(400).json({ success: false, error: 'Invalid auction' });
    }
    if (amount < auction.currentBid + auction.minIncrement) {
      return res.status(400).json({ success: false, error: 'Bid too low' });
    }
    const [bid] = await prisma.$transaction([
      prisma.bid.create({ data: { auctionId: parseInt(req.params.id), userId: req.user.userId, amount } }),
      prisma.auction.update({ where: { id: parseInt(req.params.id) }, data: { currentBid: amount, totalBids: { increment: 1 } } })
    ]);
    res.json({ success: true, data: bid });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to place bid' });
  }
});

// POST /api/auctions - Create auction (Admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('Creating auction with data:', req.body);
    console.log('User:', req.user);
    
    const auctionData = {
      title: req.body.title,
      fullDescription: req.body.fullDescription,
      startingBid: req.body.startingBid,
      currentBid: req.body.startingBid, // Initialize currentBid to startingBid
      minIncrement: req.body.minIncrement,
      endTime: new Date(req.body.endTime),
      images: req.body.images || null,
      category: req.body.category,
      condition: req.body.condition,
      location: req.body.location,
      shipping: req.body.shipping || null,
      returns: req.body.returns || null,
      sellerId: req.user.userId,
      isFeatured: req.body.isFeatured || false,
      status: 'active'
    };
    
    const auction = await prisma.auction.create({
      data: auctionData
    });
    res.status(201).json({ success: true, data: auction });
  } catch (error) {
    console.error('Create auction error:', error);
    console.error('Error message:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create auction',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/auctions/:id - Update auction
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    console.log('Updating auction:', req.params.id, 'with data:', req.body);
    
    const updateData = { ...req.body };
    if (req.body.endTime) {
      updateData.endTime = new Date(req.body.endTime);
    }
    
    const auction = await prisma.auction.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });
    res.json({ success: true, data: auction });
  } catch (error) {
    console.error('Update auction error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update',
      message: error.message
    });
  }
});

// DELETE /api/auctions/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.auction.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete' });
  }
});

export default router;
