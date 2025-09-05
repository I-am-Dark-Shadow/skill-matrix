import React, { useEffect, useState } from 'react';
import { Plus, Github, ExternalLink, Edit, Trash2, FolderSearch } from 'lucide-react';
import useProjectStore from '../store/projectStore';
import ProjectModal from '../components/projects/ProjectModal';
import toast from 'react-hot-toast';

const ProjectCard = ({ project, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group transition-shadow hover:shadow-md">
    <div className="h-40 bg-gray-200 overflow-hidden">
      <img src={project.image.url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-semibold text-gray-800 truncate">{project.title}</h3>
      <p className="text-sm text-gray-600 mt-1 h-10 line-clamp-2">{project.description || 'No description provided.'}</p>
      <div className="mt-3 flex flex-wrap gap-2 h-8">
        {(project.tags || []).slice(0, 3).map(tag => <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">{tag}</span>)}
      </div>
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        <div className="flex gap-3">
          {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900" title="GitHub Repository"><Github size={18}/></a>}
          {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900" title="Live Demo"><ExternalLink size={18}/></a>}
        </div>
        <div className="flex gap-3">
          <button onClick={() => onEdit(project)} className="text-gray-500 hover:text-blue-600" title="Edit Project"><Edit size={18}/></button>
          <button onClick={() => onDelete(project._id)} className="text-gray-500 hover:text-red-600" title="Delete Project"><Trash2 size={18}/></button>
        </div>
      </div>
    </div>
  </div>
);


const ProjectsPage = () => {
  const { projects, isLoading, fetchProjects, deleteProject } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  const handleOpenModal = (project = null) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
      setIsModalOpen(false);
      setProjectToEdit(null);
  }

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        try {
            await deleteProject(projectId);
            toast.success('Project deleted successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete project');
        }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
          <p className="text-gray-600 mt-1">Showcase your amazing work to the world.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add Project
        </button>
      </div>

      {isLoading && projects.length === 0 ? (
        <p>Loading projects...</p>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} onEdit={handleOpenModal} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg mt-8">
          <FolderSearch className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Projects Found</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't added any projects yet.</p>
          <button onClick={() => handleOpenModal()} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Add your first project
          </button>
        </div>
      )}

      <ProjectModal isOpen={isModalOpen} onClose={handleCloseModal} projectToEdit={projectToEdit} />
    </>
  );
};

export default ProjectsPage;