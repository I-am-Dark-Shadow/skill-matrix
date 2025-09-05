import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getLearningRecommendationsController } from '../controllers/learning.controller.js';

const router = Router();

// Apply the JWT verification middleware to all routes in this file
router.use(verifyJWT);

// @route   POST /api/v1/learning/recommendations
// @desc    Gets AI-powered learning recommendations for a project idea
router.post('/recommendations', getLearningRecommendationsController);

export default router;