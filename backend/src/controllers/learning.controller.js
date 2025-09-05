import { geminiModel } from '../config/gemini.js';

export const getLearningRecommendationsController = async (req, res) => {
    try {
        const { projectIdea } = req.body;
        const userSkills = req.user.skills;

        if (!projectIdea) {
            return res.status(400).json({ message: 'Project idea is required.' });
        }

        const prompt = `
            You are an expert tech education curator. Your task is to recommend 3 relevant and popular YouTube video tutorials for a student.

            Student's Existing Skills:
            ${JSON.stringify(userSkills)}

            Student's Project Idea:
            "${projectIdea}"

            Your Task:
            Find real, popular, and currently available YouTube videos. Respond with ONLY a valid JSON array of 3 objects. Each object must have these keys: "title", "channel", and a "videoId" that is currently working on YouTube. Do not add any extra text, explanations, or markdown formatting like \`\`\`json.
            
            Example Response:
            [
              {
                "title": "React JS Crash Course",
                "channel": "Traversy Media",
                "videoId": "w7ejDZ8o_Q8"
              },
              {
                "title": "Build and Deploy a Modern Full Stack MERN AI App",
                "channel": "JavaScript Mastery",
                "videoId": "p_wA1s3a_lA"
              }
            ]
        `;
        
        const result = await geminiModel.generateContent(prompt);
        let responseText = await result.response.text();
        
        // --- কোড আপডেট: রেসপন্স পরিষ্কার করার জন্য ---
        // Find the start and end of the JSON array to handle extra text or markdown
        const startIndex = responseText.indexOf('[');
        const endIndex = responseText.lastIndexOf(']');

        if (startIndex === -1 || endIndex === -1) {
            throw new Error("AI did not return a valid JSON array.");
        }

        // Extract only the JSON part of the string
        const jsonString = responseText.substring(startIndex, endIndex + 1);
        // --- পরিবর্তন এখানে শেষ ---

        const recommendations = JSON.parse(jsonString);

        res.status(200).json({ recommendations });

    } catch (error) {
        console.error('Error in learning recommendations controller:', error);
        res.status(500).json({ message: 'Failed to generate learning recommendations from AI.' });
    }
};