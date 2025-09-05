import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { 
    generateTeamController, 
    createTeamController, 
    getTeamDetailsController 
} from '../controllers/team.controller.js';

const router = Router();

// Apply the JWT verification middleware to all routes in this file
router.use(verifyJWT);

// @route   POST /api/v1/teams/generate
// @desc    Uses AI to generate a list of potential teammates
router.post('/generate', generateTeamController);

// @route   POST /api/v1/teams/create
// @desc    Creates a new team and uses AI to assign roles
router.post('/create', createTeamController);

// @route   GET /api/v1/teams/details
// @desc    Gets the details of the user's current team
router.get('/details', getTeamDetailsController);

export default router;