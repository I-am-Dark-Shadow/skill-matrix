import { Project } from '../models/project.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

/**
 * @desc    Create a new project
 * @route   POST /api/v1/projects
 */
export const createProjectController = async (req, res) => {
  const { title, description, domain, tags, github, live, teamSize } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Project image is required' });
  }

  try {
    const imageUploadResult = await uploadOnCloudinary(req.file);
    if (!imageUploadResult) {
      return res.status(500).json({ message: 'Failed to upload image' });
    }

    const newProject = await Project.create({
      owner: req.user._id,
      title,
      description,
      domain,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      github,
      live,
      teamSize,
      image: {
        public_id: imageUploadResult.public_id,
        url: imageUploadResult.secure_url,
      },
    });

    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error('Error in createProjectController:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get all projects for the logged-in user
 * @route   GET /api/v1/projects
 */
export const getUserProjectsController = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ projects });
    } catch (error) {
        console.error('Error in getUserProjectsController:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/v1/projects/:id
 */
export const deleteProjectController = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Ensure the user owns the project
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this project' });
        }

        // Delete image from Cloudinary
        await deleteFromCloudinary(project.image.public_id);
        
        // Delete project from database
        await project.deleteOne();
        
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error in deleteProjectController:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Note: An update controller would follow a similar logic to create and delete.
// It would find the project, check ownership, handle an optional new image upload
// (deleting the old one if a new one is provided), and update the fields.