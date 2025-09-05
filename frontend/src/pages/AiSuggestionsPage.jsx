import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, RefreshCw, Users } from 'lucide-react';
import useTeamStore from '../store/teamStore';
import toast from 'react-hot-toast';

const SuggestionCard = ({ suggestion }) => {
    // A simple way to pick an icon based on keywords in the title
    const getIcon = (title) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('e-commerce') || lowerTitle.includes('shop')) return <Lightbulb className="w-6 h-6 text-white" />;
        if (lowerTitle.includes('health') || lowerTitle.includes('fitness')) return <Lightbulb className="w-6 h-6 text-white" />;
        if (lowerTitle.includes('learn') || lowerTitle.includes('education')) return <Lightbulb className="w-6 h-6 text-white" />;
        if (lowerTitle.includes('security') || lowerTitle.includes('cyber')) return <Lightbulb className="w-6 h-6 text-white" />;
        return <Lightbulb className="w-6 h-6 text-white" />;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    {getIcon(suggestion.title)}
                </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{suggestion.title}</h3>
            <p className="text-gray-600 text-sm mb-4 flex-grow">{suggestion.description}</p>
            <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-800 mb-2">Required Skills:</h4>
                <div className="flex flex-wrap gap-2">
                    {suggestion.requiredSkills.map(skill => (
                        <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">{skill}</span>
                    ))}
                </div>
            </div>
            <button className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                Start This Project
            </button>
        </div>
    );
};


const AiSuggestionsPage = () => {
    const { projectSuggestions, isSuggestionsLoading, fetchProjectSuggestions, error } = useTeamStore();
    
    useEffect(() => {
        // Fetch suggestions only if they haven't been fetched yet to avoid repeated API calls
        if (projectSuggestions.length === 0) {
            fetchProjectSuggestions().catch(err => {
                // The store handles the error state, so we just catch it here
            });
        }
    }, [fetchProjectSuggestions, projectSuggestions.length]);

    const handleRegenerate = () => {
        const promise = fetchProjectSuggestions();
        toast.promise(promise, {
            loading: '🤖 AI is brainstorming new ideas...',
            success: 'New suggestions are ready!',
            error: (err) => err.message,
        });
    };

    const renderContent = () => {
        if (isSuggestionsLoading) {
            return <p className="text-center text-gray-500 py-10">AI is thinking... 🤔</p>;
        }

        if (error) {
            return (
                <div className="text-center py-16">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Couldn't get suggestions</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                    <Link to="/team-details" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        Check Your Team
                    </Link>
                </div>
            );
        }

        if (projectSuggestions.length > 0) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectSuggestions.map((suggestion, index) => (
                        <SuggestionCard key={index} suggestion={suggestion} />
                    ))}
                </div>
            );
        }

        return <p className="text-center text-gray-500 py-10">No suggestions available. Try regenerating.</p>;
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Project Suggestions</h2>
                    <p className="text-gray-600 mt-1">Personalized project ideas based on your team's skills.</p>
                </div>
                <button 
                    onClick={handleRegenerate}
                    disabled={isSuggestionsLoading}
                    className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isSuggestionsLoading ? 'animate-spin' : ''}`} />
                    Regenerate
                </button>
            </div>
            
            {renderContent()}
        </div>
    );
};

export default AiSuggestionsPage;