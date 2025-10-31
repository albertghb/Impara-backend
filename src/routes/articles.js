import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { listArticles, getArticle, createArticle, updateArticle, deleteArticle, toggleBreaking } from '../controllers/articles.controller.js';

const router = Router();

router.get('/', listArticles);
router.get('/:id', getArticle);
router.post('/', authenticate, createArticle);
router.put('/:id', authenticate, updateArticle);
router.delete('/:id', authenticate, deleteArticle);
router.patch('/:id/breaking', authenticate, toggleBreaking);

export default router;
