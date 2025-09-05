import { Router } from 'express';
import { getCurrentUserController, getDomainMatchedUsersController, updateCurrentUserController } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply the JWT verification middleware to all routes in this file
router.use(verifyJWT);

// @route   GET /api/v1/users/me
// @desc    Gets the profile of the currently logged-in user
router.get('/me', getCurrentUserController);

// @route   PUT /api/v1/users/me
// @desc    Updates the profile of the currently logged-in user
router.put('/me', updateCurrentUserController);

// @route   GET /api/v1/users/domain-match
// @desc    Gets a list of users with matching domains
router.get('/domain-match', getDomainMatchedUsersController);

export default router;