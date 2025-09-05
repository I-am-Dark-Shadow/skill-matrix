import { User } from '../models/user.model.js';
import { Team } from '../models/team.model.js';
import { geminiModel } from '../config/gemini.js';

/**
 * @desc    Generate a project team using AI
 * @route   POST /api/v1/teams/generate
 */
export const generateTeamController = async (req, res) => {
  try {
    const currentUser = req.user;

    // Find all users who are not yet in a team
    const availableCandidates = await User.find({ 
      teamId: null, 
      _id: { $ne: currentUser._id } 
    }).select('fullName skills domains');

    // Check if there are enough candidates to form a team
    if (availableCandidates.length < 4) {
      return res.status(400).json({ message: "Not enough available students to create your team." });
    }
    
    // Prepare data for the AI prompt
    const myProfile = {
      name: currentUser.fullName,
      skills: currentUser.skills,
      domains: currentUser.domains,
    };
    
    const candidatesJSON = JSON.stringify(availableCandidates.map(c => ({
        id: c._id,
        name: c.fullName,
        skills: c.skills,
        domains: c.domains
    })));

    const prompt = `
      You are an expert at building project teams for college students. Your task is to select the 4 best teammates for a given student from a list of available candidates. Build a well-rounded team with complementary skills.

      My Profile:
      ${JSON.stringify(myProfile)}

      Available Candidates (JSON format):
      ${candidatesJSON}

      Your Task:
      Respond with ONLY a JSON array containing the exact "_id" strings of the 4 best candidates you have selected. Do not add any other text, explanation, or formatting like \`\`\`json.

      Example Response:
      ["60d5f2f5c7b4f30015a8b4e8", "60d5f2f5c7b4f30015a8b4e9", "60d5f2f5c7b4f30015a8b4ea", "60d5f2f5c7b4f30015a8b4eb"]
    `;
    
    const result = await geminiModel.generateContent(prompt);
    const responseText = await result.response.text();
    
    const selectedIds = JSON.parse(responseText.trim());

    const selectedTeammates = await User.find({ '_id': { $in: selectedIds } }).select('-password');
    
    res.status(200).json({ teammates: selectedTeammates });
  } catch (error) {
    console.error('Error in generateTeamController:', error);
    res.status(500).json({ message: 'Failed to generate team using AI.' });
  }
};

/**
 * @desc    Create a new team and assign roles using AI
 * @route   POST /api/v1/teams/create
 */
export const createTeamController = async (req, res) => {
    try {
        const { teamName, teamLeaderId, memberIds } = req.body;
        
        if (!teamName || !teamLeaderId || !memberIds || memberIds.length === 0) {
            return res.status(400).json({ message: 'Team name, leader, and members are required.' });
        }
        
        const memberProfiles = await User.find({ _id: { $in: memberIds } }).select('fullName skills');
        
        const prompt = `
            You are an expert project manager. Given a list of team members with their skills, assign a suitable role to each member.
            Available roles: Leader, Frontend, Backend, Designer, Tester, Fullstack.
            The user with id ${teamLeaderId} must be assigned the 'Leader' role.
            Ensure the roles are diverse and complement each other based on their skills.

            Team Members (JSON):
            ${JSON.stringify(memberProfiles.map(m => ({ id: m._id, name: m.fullName, skills: m.skills })))}
            
            Designated Leader ID: "${teamLeaderId}"

            Your Task:
            Respond with ONLY a JSON array of objects, where each object has the member's "id" and their assigned "role". Do not add any explanation or formatting.

            Example Response:
            [ {"id": "${teamLeaderId}", "role": "Leader"}, {"id": "some_other_id", "role": "Frontend"}, ... ]
        `;

        const result = await geminiModel.generateContent(prompt);
        const responseText = await result.response.text();
        const memberRoles = JSON.parse(responseText.trim());

        const membersWithRoles = memberRoles.map(mr => ({
            user: mr.id,
            role: mr.role,
        }));

        const newTeam = await Team.create({
            teamName,
            teamLeader: teamLeaderId,
            members: membersWithRoles,
        });

        await User.updateMany(
            { _id: { $in: memberIds } },
            { $set: { teamId: newTeam._id } }
        );

        res.status(201).json({ message: 'Team created successfully with AI-assigned roles!', team: newTeam });
    } catch (error) {
        console.error('Error in createTeamController:', error);
        res.status(500).json({ message: 'Failed to create team.' });
    }
};

/**
 * @desc    Get details of the user's current team
 * @route   GET /api/v1/teams/details
 */
export const getTeamDetailsController = async (req, res) => {
    try {
        const teamId = req.user.teamId;
        if (!teamId) {
            return res.status(404).json({ message: "You are not part of any team yet." });
        }

        const team = await Team.findById(teamId).populate({
            path: 'members.user',
            select: 'fullName email college skills' // Fields to populate
        }).populate('teamLeader', 'fullName');

        if (!team) {
            await User.findByIdAndUpdate(req.user._id, { $set: { teamId: null } });
            return res.status(404).json({ message: "Team not found." });
        }
        
        res.status(200).json({ team });

    } catch (error)
    {
        console.error('Error in getTeamDetailsController:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};