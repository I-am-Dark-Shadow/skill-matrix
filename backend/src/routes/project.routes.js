import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { 
    createProjectController, 
    getUserProjectsController, 
    deleteProjectController 
} from '../controllers/project.controller.js';

const router = Router();

// Apply the JWT verification middleware to all routes in this file
router.use(verifyJWT);

router.route('/')
    // GET all projects for the logged-in user
    .get(getUserProjectsController)
    // POST a new project with an image upload
    .post(upload.single('image'), createProjectController);

router.route('/:id')
    // DELETE a specific project
    .delete(deleteProjectController);
    // PATCH route for updating a project can be added here later
    // .patch(upload.single('image'), updateProjectController);

export default router;