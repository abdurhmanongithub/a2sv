import { Router } from 'express';
import { createOrUpdateRating } from '../controllers/blogRatingController';
import authenticateToken from '../middleware/authMiddleware';

const router = Router();

// Route for creating or updating a blog rating
router.post('/:blogId/rating', authenticateToken, createOrUpdateRating);

export default router;
