import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { listAds, getAd, createAd, updateAd, deleteAd } from '../controllers/ads.controller.js';

const router = Router();

router.get('/', listAds);
router.get('/:id', getAd);
router.post('/', authenticate, createAd);
router.put('/:id', authenticate, updateAd);
router.delete('/:id', authenticate, deleteAd);

export default router;
