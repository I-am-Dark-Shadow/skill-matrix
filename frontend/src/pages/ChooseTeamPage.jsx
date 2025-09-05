import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Sparkles, Save } from 'lucide-react';
import useTeamStore from '../store/teamStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const MemberCard = ({ member }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center animate-fade-in">
        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.fullName}`} alt={member.fullName} className="w-16 h-16 rounded-full bg-gray-100 mb-3" />
        <h4 className="font-semibold text-sm text-gray-800">{member.fullName}</h4>
        <p className="text-xs text-gray-500 mb-2">{member.college}</p>
        <div className="flex flex-wrap justify-center gap-1">
            {(member.skills || []).slice(0, 3).map(skill => <span key={skill} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">{skill}</span>)}
        </div>
    </div>
);

const ChooseTeamPage = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();
    const { generatedTeam, isLoading, generateTeam, createTeam } = useTeamStore();
    
    const [teamName, setTeamName] = useState('');
    const [teamLeaderId, setTeamLeaderId] = useState('');

    const fullTeam = useMemo(() => {
        if (generatedTeam.length > 0) {
            const userWithId = { ...currentUser, _id: currentUser?._id || 'currentUser' };
            return [userWithId, ...generatedTeam];
        }
        return [];
    }, [generatedTeam, currentUser]);

    const handleGenerateTeam = async () => {
        const promise = generateTeam();
        toast.promise(promise, {
            loading: '🤖 AI is building your dream team...',
            success: 'Your team is ready!',
            error: (err) => {
                // This will display the specific error message from the backend
                return err.message || 'Something went wrong.';
            },
        });
    };

    const handleSaveTeam = async (e) => {
        e.preventDefault();
        if (!teamName || !teamLeaderId) {
            return toast.error('Please provide a team name and select a leader.');
        }
        
        const teamData = {
            teamName,
            teamLeaderId,
            memberIds: fullTeam.map(m => m._id)
        };
        
        try {
            const res = await createTeam(teamData);
            toast.success(res.message);
            navigate('/team-details');
        } catch (error) {
            toast.error(error.message);
        }
    };
    
    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Choose Your Team with AI</h2>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Let our AI analyze skills and interests to build the perfect team for your next big project.</p>
            </div>
            
            {fullTeam.length === 0 ? (
                <div className="bg-white text-center rounded-2xl shadow-lg border border-gray-100 p-12">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Build Your Dream Team?</h3>
                    <button onClick={handleGenerateTeam} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition transform hover:scale-105 disabled:bg-blue-400 flex items-center gap-2 mx-auto">
                        <BrainCircuit size={20} />
                        {isLoading ? 'Generating...' : 'Generate Team with AI'}
                    </button>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Your AI-Generated Dream Team</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                        {fullTeam.map(member => <MemberCard key={member._id} member={member} />)}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Configure Your Team</h3>
                        <form onSubmit={handleSaveTeam} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                                    <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g., The Innovators" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Team Leader</label>
                                    <select value={teamLeaderId} onChange={(e) => setTeamLeaderId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500" required>
                                        <option value="">-- Select a Leader --</option>
                                        {fullTeam.map(m => <option key={m._id} value={m._id}>{m.fullName}</option>)}
                                    </select>
                                </div>
                            </div>
                             <div className="flex justify-center pt-2">
                                <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:bg-blue-400 flex items-center gap-2">
                                    <Save size={16} />
                                    {isLoading ? 'Saving...' : 'Save Team'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChooseTeamPage;