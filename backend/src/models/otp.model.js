import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  userData: {
    // এই userData অবজেক্টের ভেতরেও email যোগ করতে হবে
    fullName: { type: String, required: true },
    college: { type: String, required: true },
    email: { type: String, required: true }, // এই লাইনটি যোগ করা হয়েছে
    roll: { type: String, required: true },
    skills: { type: [String], required: true },
    domains: { type: [String], required: true },
    password: { type: String, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // The document will be automatically deleted after 300 seconds (5 minutes)
  },
});

export const OTP = mongoose.model('OTP', otpSchema);