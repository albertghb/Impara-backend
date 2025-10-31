import { Router } from 'express';
import authRoutes from './auth.js';
import articleRoutes from './articles.prisma.js';
import adRoutes from './ads.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);
router.use('/ads', adRoutes);

export default router;
