import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import useProjectStore from '../../store/projectStore';

const ProjectModal = ({ isOpen, onClose, projectToEdit }) => {
  const [formData, setFormData] = useState({ title: '', description: '', github: '', live: '', tags: '', image: null });
  const [preview, setPreview] = useState('');
  const addProject = useProjectStore((state) => state.addProject);
  // We will add the updateProject logic later
  // const updateProject = useProjectStore((state) => state.updateProject);
  const isLoading = useProjectStore((state) => state.isLoading);
  
  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        title: projectToEdit.title || '',
        description: projectToEdit.description || '',
        github: projectToEdit.github || '',
        live: projectToEdit.live || '',
        tags: (projectToEdit.tags || []).join(', '),
        image: null, // Don't pre-fill file input
      });
      setPreview(projectToEdit.image.url);
    } else {
      // Reset form when opening for a new project
      setFormData({ title: '', description: '', github: '', live: '', tags: '', image: null });
      setPreview('');
    }
  }, [projectToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || (!formData.image && !projectToEdit)) {
        return toast.error('Title and image are required!');
    }
    
    const data = new FormData();
    // Append all form fields to FormData
    Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
            data.append(key, formData[key]);
        }
    });

    try {
      // In a real app, you'd check if you are editing or adding
      // if (projectToEdit) { await updateProject(projectToEdit._id, data); } 
      // else { await addProject(data); }
      const res = await addProject(data);
      toast.success(res.message);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save project');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{projectToEdit ? 'Edit Project' : 'Add New Project'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Project Title*</label>
            <input name="title" onChange={handleChange} value={formData.title} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" onChange={handleChange} value={formData.description} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input name="tags" onChange={handleChange} value={formData.tags} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="React, Node.js, ..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="github" onChange={handleChange} value={formData.github} placeholder="GitHub URL" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
            <input name="live" onChange={handleChange} value={formData.live} placeholder="Live URL" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Cover Image*</label>
            <div className="mt-1 flex items-center gap-4">
              <div className="w-32 h-20 bg-gray-100 rounded-md flex items-center justify-center border">
                {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-md"/> : <ImageIcon className="text-gray-400" />}
              </div>
              <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md border bg-gray-50 hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2">
              <Save size={16} /> {isLoading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;