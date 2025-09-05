import { Router } from 'express';
import { 
    sendOtpController, 
    verifyOtpAndRegisterController,
    loginController,
    logoutController 
} from '../controllers/auth.controller.js';

const router = Router();

// @route   POST /api/v1/auth/send-otp
// @desc    Sends OTP to user's email for registration
router.post('/send-otp', sendOtpController);

// @route   POST /api/v1/auth/verify-otp
// @desc    Verifies OTP and creates a new user
router.post('/verify-otp', verifyOtpAndRegisterController);

// @route   POST /api/v1/auth/login
// @desc    Logs in a user and returns a JWT
router.post('/login', loginController);

// @route   POST /api/v1/auth/logout
// @desc    Clears the user's session cookie
router.post('/logout', logoutController);


export default router;