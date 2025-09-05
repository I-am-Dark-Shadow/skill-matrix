import { User } from '../models/user.model.js';
import { OTP } from '../models/otp.model.js';
import sendEmail from '../utils/sendEmail.js';

/**
 * @desc    Send OTP for registration
 * @route   POST /api/v1/auth/send-otp
 */
export const sendOtpController = async (req, res) => {
  try {
    const { email, roll, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { roll }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email or roll number already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP and the full user data temporarily
    await OTP.findOneAndUpdate(
        { email },
        { otp, userData: req.body },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2>Welcome to TeamSync!</h2>
        <p>Your One-Time Password (OTP) for registration is:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #1a73e8;">${otp}</p>
        <p>This OTP is valid for 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail(email, 'Your OTP for TeamSync Registration', emailHtml);

    res.status(200).json({ message: 'OTP sent to your email successfully' });
  } catch (error) {
    console.error('Error in sendOtpController:', error);
    res.status(500).json({ message: 'Server error while sending OTP' });
  }
};

/**
 * @desc    Verify OTP and register user
 * @route   POST /api/v1/auth/verify-otp
 */
export const verifyOtpAndRegisterController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Find the OTP data using the provided email
    const otpData = await OTP.findOne({ email });

    // 2. If no data is found, it means the OTP has expired or was never sent
    if (!otpData) {
      return res.status(404).json({ message: 'OTP has expired or is invalid. Please try again.' });
    }
    
    // 3. Compare the OTP from the request with the one in the database
    if (otpData.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // 4. If OTP is correct, create a new user from the temporarily stored userData
    const newUser = new User(otpData.userData);
    
    // 5. Save the new user to the 'users' collection (password will be hashed automatically by the pre-save hook)
    await newUser.save();

    // 6. Delete the temporary OTP document from the 'otps' collection
    await OTP.deleteOne({ email });

    res.status(201).json({ message: 'User registered successfully! Please login.' });
  } catch (error) {
    // This will catch any errors during the process (e.g., validation errors on user save)
    console.error('Error in verifyOtpAndRegisterController:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 */
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.isPasswordCorrect(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAccessToken();

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    };

    // Remove password from user object before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    res
      .status(200)
      .cookie('token', token, options)
      .json({
        message: 'Login successful',
        user: userResponse,
        token,
      });
  } catch (error) {
    console.error('Error in loginController:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 */
export const logoutController = (req, res) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    res
        .status(200)
        .clearCookie('token', options)
        .json({ message: 'User logged out successfully' });
};