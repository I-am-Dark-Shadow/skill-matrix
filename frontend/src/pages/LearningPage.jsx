import React, { useState } from 'react';
import { BookOpen, Youtube, Search } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useLearningStore from '../store/learningStore';
import toast from 'react-hot-toast';

const LearningCard = ({ recommendation }) => {
    const { title, channel, videoId } = recommendation;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

    return (
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow">
            <img src={thumbnailUrl} alt={title} className="w-full h-32 object-cover" />
            <div className="p-4">
                <h4 className="font-semibold text-gray-800 text-sm h-10 line-clamp-2">{title}</h4>
                <p className="text-xs text-gray-500 mt-1 mb-3">{channel}</p>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                    <Youtube size={14} />
                    Watch on YouTube
                </div>
            </div>
        </a>
    );
};

const LearningPage = () => {
    const { user } = useAuthStore();
    const { recommendations, isLoading, fetchRecommendations } = useLearningStore();
    const [projectIdea, setProjectIdea] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!projectIdea.trim()) {
            return toast.error("Please enter your project idea.");
        }
        const promise = fetchRecommendations(projectIdea);
        toast.promise(promise, {
            loading: '🤖 AI is finding the best resources for you...',
            success: 'Recommendations are ready!',
            error: (err) => err.message,
        });
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Learning Hub</h2>
                <p className="text-gray-600 mt-1">Get AI-powered learning recommendations for your project ideas.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Input Form */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Find Learning Resources</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Project Idea</label>
                            <textarea
                                value={projectIdea}
                                onChange={(e) => setProjectIdea(e.target.value)}
                                rows="4"
                                placeholder="e.g., A real-time chat application with a beautiful UI..."
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Based on Your Skills</label>
                            <div className="flex flex-wrap gap-2">
                                {user?.skills.map(skill => <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{skill}</span>)}
                            </div>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:bg-blue-400">
                            <Search size={16} />
                            {isLoading ? 'Searching...' : 'Get Recommendations'}
                        </button>
                    </form>
                </div>

                {/* Right: Results */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800">AI Recommendations</h3>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : recommendations.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {recommendations.map((rec, i) => <LearningCard key={i} recommendation={rec} />)}
                        </div>
                    ) : (
                        <div className="text-center bg-white rounded-xl shadow-sm border p-12">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-400"/>
                            <p className="mt-4 text-sm text-gray-500">Your recommended tutorials will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LearningPage;