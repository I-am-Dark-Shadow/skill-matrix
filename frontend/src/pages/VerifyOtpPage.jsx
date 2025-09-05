import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';
import BgAnimation from '../components/BgAnimation';

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const email = location.state?.email;

  // If the user lands on this page without an email
  useEffect(() => {
    if (!email) {
      toast.error("Please register first.");
      navigate('/register');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error("OTP must be a 6-digit number.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/verify-otp`,
        { email, otp }
      );
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#1c1106] text-[#3b2f2f] overflow-hidden">
      <BgAnimation />
      <div className="relative z-10 max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <Mail className="w-8 h-8 text-amber-700" />
            </div>
            <h1 className="text-2xl font-bold text-[#3b2f2f]">Verify Your Email</h1>
            <p className="text-[#5c4a3f] mt-2">
              We sent a 6-digit code to <span className="font-semibold text-amber-700">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#3b2f2f] mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                className="w-full px-4 py-3 border border-amber-200 rounded-lg text-center text-2xl tracking-[0.5em] focus:ring-2 focus:ring-amber-500"
                placeholder="000000"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:bg-amber-400 shadow-md"
            >
              <Lock size={16} />
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-[#5c4a3f]">
              Didn't receive the code?{' '}
              <button
                className="text-amber-700 hover:text-amber-800 font-medium"
                type="button"
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
