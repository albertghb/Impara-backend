import express from 'express';
import prisma from '../config/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all articles
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      status = 'published', 
      isBreaking, 
      limit = 20, 
      offset = 0 
    } = req.query;

    const where = {};

    if (category) {
      where.category = { slug: category };
    }

    if (status) {
      where.status = status;
    }

    if (isBreaking !== undefined) {
      where.isBreaking = isBreaking === 'true';
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              nameRw: true,
              slug: true
            }
          }
        },
        orderBy: {
          publishedAt: 'desc'
        },
        take: parseInt(limit),
        skip: parseInt(offset)
      }),
      prisma.article.count({ where })
    ]);

    res.json({
      articles,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/articles/breaking/all - Get breaking news (MUST be before /:id)
router.get('/breaking/all', async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      where: {
        isBreaking: true,
        status: 'published'
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameRw: true,
            slug: true
          }
        },
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 5
    });

    res.json({ articles });
  } catch (error) {
    console.error('Get breaking news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/articles/latest - Get latest articles (MUST be before /:id)
router.get('/latest', async (req, res) => {
  try {
    const { limit = '10' } = req.query;
    const articles = await prisma.article.findMany({
      where: { status: 'published' },
      include: {
        category: { select: { id: true, name: true, nameRw: true, slug: true } },
        author: { select: { name: true } }
      },
      orderBy: { publishedAt: 'desc' },
      take: parseInt(limit)
    });
    res.json({ success: true, data: articles });
  } catch (error) {
    console.error('Get latest articles error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch latest articles' });
  }
});

// GET /api/articles/featured - Get featured articles (MUST be before /:id)
router.get('/featured', async (req, res) => {
  try {
    const { limit = '6' } = req.query;
    const articles = await prisma.article.findMany({
      where: { status: 'published', isFeatured: true },
      include: {
        category: { select: { id: true, name: true, nameRw: true, slug: true } },
        author: { select: { name: true } }
      },
      orderBy: { publishedAt: 'desc' },
      take: parseInt(limit)
    });
    res.json({ success: true, data: articles });
  } catch (error) {
    console.error('Get featured articles error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch featured articles' });
  }
});

// Get single article by ID (MUST be after special routes)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);
    
    if (isNaN(articleId)) {
      return res.status(400).json({ message: 'Invalid article ID' });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            nameRw: true,
            slug: true
          }
        },
        comments: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Increment views
    await prisma.article.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } }
    });

    res.json({ article });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create article
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      imageUrl,
      categoryId,
      authorId,
      isBreaking,
      isFeatured,
      status
    } = req.body;

    if (!title || !content || !categoryId || !authorId) {
      return res.status(400).json({ 
        message: 'Title, content, categoryId, and authorId are required' 
      });
    }

    // Generate unique slug
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug exists and make it unique
    let uniqueSlug = slug;
    let counter = 1;
    while (true) {
      const existing = await prisma.article.findUnique({
        where: { slug: uniqueSlug }
      });
      if (!existing) break;
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug: uniqueSlug,
        content,
        excerpt,
        imageUrl,
        categoryId: parseInt(categoryId),
        authorId: parseInt(authorId),
        isBreaking: isBreaking || false,
        isFeatured: isFeatured || false,
        status: status || 'draft',
        publishedAt: status === 'published' ? new Date() : null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            nameRw: true,
            slug: true
          }
        }
      }
    });

    res.status(201).json({ id: article.id, slug: article.slug });
  } catch (error) {
    console.error('Create article error:', error);
    console.error('Error details:', error.message);
    console.error('Request body:', req.body);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update article
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      imageUrl,
      categoryId,
      isBreaking,
      isFeatured,
      status
    } = req.body;

    const updateData = {};

    if (title) {
      updateData.title = title;
      let slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Check if slug exists (excluding current article)
      let uniqueSlug = slug;
      let counter = 1;
      while (true) {
        const existing = await prisma.article.findUnique({
          where: { slug: uniqueSlug }
        });
        if (!existing || existing.id === parseInt(id)) break;
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      updateData.slug = uniqueSlug;
    }
    if (content) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (categoryId) updateData.categoryId = parseInt(categoryId);
    if (isBreaking !== undefined) updateData.isBreaking = isBreaking;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (status) {
      updateData.status = status;
      if (status === 'published' && !updateData.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            nameRw: true,
            slug: true
          }
        }
      }
    });

    res.json({ article });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete article
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.article.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/articles/search - Search articles
router.get('/search', async (req, res) => {
  try {
    const { q, limit = '20' } = req.query;
    if (!q) return res.status(400).json({ success: false, error: 'Query required' });
    
    const articles = await prisma.article.findMany({
      where: {
        status: 'published',
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
          { excerpt: { contains: q } }
        ]
      },
      include: {
        category: { select: { name: true, nameRw: true, slug: true } },
        author: { select: { name: true } }
      },
      orderBy: { publishedAt: 'desc' },
      take: parseInt(limit)
    });
    res.json({ success: true, data: articles, query: q });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

// POST /api/articles/:id/view - Increment view count
router.post('/:id/view', async (req, res) => {
  try {
    const article = await prisma.article.update({
      where: { id: parseInt(req.params.id) },
      data: { views: { increment: 1 } }
    });
    res.json({ success: true, views: article.views });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update views' });
  }
});

export default router;
