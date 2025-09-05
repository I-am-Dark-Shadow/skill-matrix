import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save, ChevronDown, X, Check } from 'lucide-react';
import useAuthStore from '../store/authStore';

const SKILLS_OPTIONS = ["React", "Node.js", "Python", "MongoDB", "Figma", "Next.js", "Vue", "Express", "Django", "Java", "AWS", "Docker", "TailwindCSS", "JavaScript"];
const DOMAIN_OPTIONS = ["Web Development", "Mobile Apps", "AI/ML", "Data Science", "Cybersecurity", "Blockchain", "Cloud/DevOps"];

// Reusable MultiSelect Component
const MultiSelect = ({ options, selected, onChange, placeholder, color }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    const filteredOptions = options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));
    const colorClasses = {
        blue: {
            badge: 'bg-blue-100 text-blue-800',
            text: 'text-blue-600',
            bg: 'bg-blue-600',
        },
        purple: {
            badge: 'bg-purple-100 text-purple-800',
            text: 'text-purple-600',
            bg: 'bg-purple-600',
        },
    };
    const colors = colorClasses[color] || colorClasses.blue;

    const toggleOption = (option) => {
        if (selected.includes(option)) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    return (
        <div className="relative" ref={ref}>
            <div onClick={() => setIsOpen(!isOpen)} className="flex min-h-[50px] flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 cursor-pointer">
                <div className="flex flex-wrap gap-1.5 flex-1">
                    {selected.length > 0 ? selected.map(item => (
                        <span key={item} className={`inline-flex items-center gap-1.5 rounded-full text-xs font-medium px-2 py-1 ${colors.badge}`}>
                            {item}
                            <button onClick={(e) => { e.stopPropagation(); toggleOption(item); }} className="hover:text-red-500"><X size={12}/></button>
                        </span>
                    )) : <span className="text-gray-500">{placeholder}</span>}
                </div>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full p-2 border-b text-sm"
                    />
                    <ul className="max-h-48 overflow-y-auto">
                        {filteredOptions.map(option => (
                            <li key={option} onClick={() => toggleOption(option)} className={`flex justify-between items-center p-2 text-sm cursor-pointer hover:bg-gray-50 ${selected.includes(option) ? `font-semibold ${colors.text}` : 'text-gray-700'}`}>
                                {option}
                                {selected.includes(option) && <Check size={16} className={colors.bg + ' text-white rounded-full p-0.5'} />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const EditProfilePage = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuthStore();
    const [formData, setFormData] = useState({
        fullName: '',
        college: '',
        roll: '',
        skills: [],
        domains: [],
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                college: user.college || '',
                roll: user.roll || '',
                skills: user.skills || [],
                domains: user.domains || [],
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/me`, formData, { withCredentials: true });
            setUser({ user: response.data.user, token: useAuthStore.getState().token });
            toast.success('Profile updated successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Edit Your Profile</h2>
                <p className="text-gray-600 mt-1">Keep your information up to date.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input name="email" value={user?.email || ''} className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed" disabled />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">College/University</label>
                            <input name="college" value={formData.college} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                            <input name="roll" value={formData.roll} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
                        </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                      <MultiSelect options={SKILLS_OPTIONS} selected={formData.skills} onChange={(val) => setFormData({...formData, skills: val})} placeholder="Update your skills" color="blue" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Domains</label>
                      <MultiSelect options={DOMAIN_OPTIONS} selected={formData.domains} onChange={(val) => setFormData({...formData, domains: val})} placeholder="Update your domains" color="purple" />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:bg-blue-400 flex items-center gap-2">
                            <Save size={16} />
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;