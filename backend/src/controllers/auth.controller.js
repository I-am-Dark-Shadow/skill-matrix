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

    const emailHtml = (otp) => `
  <div style="background-color: #fdf6e3; padding: 20px; font-family: Arial, sans-serif; color: #4a2c2a;">
    <div style="max-width: 500px; margin: auto; background: #fff8e7; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 20px;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #8b5e3c; margin: 0;">Welcome to <span style="color:#d97706;">Skill Matrix</span> 🎉</h2>
        <p style="color: #6b4f3f; margin: 5px 0 0;">Your collaboration journey starts here!</p>
      </div>
      
      <!-- Card Content -->
      <div style="background: #fff3cd; border: 1px solid #e2c68e; border-radius: 10px; padding: 20px; text-align: center;">
        <p style="font-size: 16px; margin: 0; color: #4a2c2a;">Here’s your One-Time Password (OTP):</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; margin: 15px 0; color: #d97706;">${otp}</p>
        <p style="font-size: 14px; color: #6b4f3f;">This OTP is valid for <strong>5 minutes</strong>.</p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 20px; font-size: 13px; color: #7c6f64;">
        <p>If you did not request this, please ignore this email.</p>
        <p style="margin-top: 10px;">📧 Sent from <strong>Skill Matrix</strong> <br/> skillmatrix247@gmail.com</p>
      </div>
    </div>
  </div>
`;

    await sendEmail(
      email,
      'Your OTP for Skill Matrix Registration',
      emailHtml(otp)
    );

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