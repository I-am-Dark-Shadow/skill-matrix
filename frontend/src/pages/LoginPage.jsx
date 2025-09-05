import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import BgAnimation from '../components/BgAnimation';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`, formData, { withCredentials: true });
      setUser(response.data);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-amber-100 mt-2">Sign in to your account to continue</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#3b2f2f] mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="you@college.edu"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3b2f2f] mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:bg-amber-400 shadow-md"
            >
              {isLoading ? 'Logging in...' : 'Login'}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-[#5c4a3f]">Don't have an account?{' '}
              <Link to="/register" className="text-amber-700 hover:text-amber-800 font-medium">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
