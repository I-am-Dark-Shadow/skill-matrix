import { User } from '../models/user.model.js';

/**
 * @desc    Get current logged in user details
 * @route   GET /api/v1/users/me
 */
export const getCurrentUserController = (req, res) => {
  // The user object is attached to the request by the verifyJWT middleware
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ user: req.user });
};

/**
 * @desc    Get users based on domain match, search, and filters
 * @route   GET /api/v1/users/domain-match
 */
export const getDomainMatchedUsersController = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const loggedInUserDomains = req.user.domains;

    const { search, domain } = req.query;

    // Base query: find users other than the logged-in one
    const query = { _id: { $ne: loggedInUserId } };
    
    // Filter by a specific domain if provided, otherwise match with user's domains
    if (domain) {
      query.domains = domain;
    } else {
      query.domains = { $in: loggedInUserDomains };
    }

    // Add search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
      query.$or = [
        { fullName: { $regex: searchRegex } },
        { college: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { skills: { $regex: searchRegex } },
      ];
    }
    
    const users = await User.find(query).select('-password');
    
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error in getDomainMatchedUsersController:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Update current logged in user details
 * @route   PUT /api/v1/users/me
 */
export const updateCurrentUserController = async (req, res) => {
    const { fullName, college, roll, skills, domains } = req.body;
    
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    fullName,
                    college,
                    roll,
                    skills,
                    domains,
                },
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });

    } catch (error) {
        console.error('Error in updateCurrentUserController:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};