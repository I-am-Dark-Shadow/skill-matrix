import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheck, ChevronDown, X, Check } from 'lucide-react';
import BgAnimation from '../components/BgAnimation';

const SKILLS_OPTIONS = ["React", "Node.js", "Python", "MongoDB", "Figma", "Next.js", "Vue", "Express", "Django", "Java", "AWS", "Docker", "TailwindCSS", "JavaScript"];
const DOMAIN_OPTIONS = ["Web Development", "Mobile Apps", "AI/ML", "Data Science", "Cybersecurity", "Blockchain", "Cloud/DevOps"];

// Reusable MultiSelect Component (unchanged logic, only theme tweaks)
const MultiSelect = ({ options, selected, onChange, placeholder }) => {
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

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)} className="flex min-h-[50px] flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-white px-3 py-2 cursor-pointer">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {selected.length > 0 ? selected.map(item => (
            <span key={item} className="inline-flex items-center gap-1.5 rounded-full text-xs font-medium px-2 py-1 bg-amber-100 text-amber-800">
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
              <li key={option} onClick={() => toggleOption(option)} className={`flex justify-between items-center p-2 text-sm cursor-pointer hover:bg-amber-50 ${selected.includes(option) ? `font-semibold text-amber-700` : 'text-gray-700'}`}>
                {option}
                {selected.includes(option) && <Check size={16} className="bg-amber-700 text-white rounded-full p-0.5" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', college: '', email: '', roll: '',
    skills: [], domains: [],
    password: '', confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }
    if (formData.skills.length === 0 || formData.domains.length === 0) {
      toast.error("Please select at least one skill and domain!");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/send-otp`, formData);
      toast.success(response.data.message);
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#1c1106] text-[#3b2f2f] overflow-hidden">
      <BgAnimation />
      <div className="relative z-10 max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-amber-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-sm">SM</span>
            </div>
            <span className="text-xl font-semibold text-white">Skill Matrix</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-amber-100 mt-2">Join students collaborating on amazing projects</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="fullName" onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-3 border border-amber-200 rounded-lg" required />
              <input name="college" onChange={handleChange} placeholder="College/University" className="w-full px-4 py-3 border border-amber-200 rounded-lg" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="email" type="email" onChange={handleChange} placeholder="Email" className="w-full px-4 py-3 border border-amber-200 rounded-lg" required />
              <input name="roll" onChange={handleChange} placeholder="Roll Number" className="w-full px-4 py-3 border border-amber-200 rounded-lg" required />
            </div>
            <MultiSelect options={SKILLS_OPTIONS} selected={formData.skills} onChange={(val) => setFormData({...formData, skills: val})} placeholder="Select your skills" />
            <MultiSelect options={DOMAIN_OPTIONS} selected={formData.domains} onChange={(val) => setFormData({...formData, domains: val})} placeholder="Select your domains" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="password" type="password" onChange={handleChange} placeholder="Password" className="w-full px-4 py-3 border border-amber-200 rounded-lg" required />
              <input name="confirmPassword" type="password" onChange={handleChange} placeholder="Confirm Password" className="w-full px-4 py-3 border border-amber-200 rounded-lg" required />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:bg-amber-400 shadow-md">
              <ShieldCheck size={16} />
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-[#5c4a3f]">Already have an account?{' '}
              <Link to="/login" className="text-amber-700 hover:text-amber-800 font-medium">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
