import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Crown, UserCheck } from 'lucide-react';
import useTeamStore from '../store/teamStore';

const MemberDetailCard = ({ member, isLeader }) => {
    // Color mapping for different roles
    const roleColors = {
        Leader: 'bg-yellow-100 text-yellow-800',
        Frontend: 'bg-blue-100 text-blue-800',
        Backend: 'bg-green-100 text-green-800',
        Designer: 'bg-purple-100 text-purple-800',
        Tester: 'bg-red-100 text-red-800',
        Fullstack: 'bg-indigo-100 text-indigo-800',
        Member: 'bg-gray-100 text-gray-800',
    };
    
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center relative transition-shadow hover:shadow-lg">
            {isLeader && (
                <div className="absolute top-4 right-4 text-yellow-500" title="Team Leader">
                    <Crown className="w-6 h-6 fill-current" />
                </div>
            )}
            <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.user.fullName}`} 
                alt={member.user.fullName} 
                className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-100 border-4 border-white shadow-md"
            />
            <h3 className="text-lg font-semibold text-gray-900">{member.user.fullName}</h3>
            <p className="text-sm text-gray-500 mb-3">{member.user.college}</p>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${roleColors[member.role] || roleColors.Member}`}>
                {member.role}
            </span>
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap justify-center gap-2">
                {(member.user.skills || []).slice(0, 4).map(skill => (
                    <span key={skill} className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">{skill}</span>
                ))}
            </div>
        </div>
    );
};

const TeamDetailsPage = () => {
    const { currentTeam, isLoading, fetchTeamDetails } = useTeamStore();

    useEffect(() => {
        fetchTeamDetails();
    }, [fetchTeamDetails]);

    if (isLoading) {
        return <p className="text-center text-gray-500">Loading team details...</p>;
    }
    
    // Display if the user is not part of any team
    if (!currentTeam) {
        return (
            <div className="text-center py-16">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">You are not in a team yet</h3>
                <p className="mt-1 text-sm text-gray-500">Generate a new team to see details here.</p>
                <Link to="/choose-team" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                    <UserCheck className="-ml-1 mr-2 h-5 w-5" />
                    Find Your Team
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Team: {currentTeam.teamName}</h2>
                <p className="text-gray-600 mt-1">Leader: {currentTeam.teamLeader.fullName}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentTeam.members.map(member => (
                    <MemberDetailCard 
                        key={member.user._id} 
                        member={member} 
                        isLeader={member.user._id === currentTeam.teamLeader._id} 
                    />
                ))}
            </div>
        </div>
    );
};

export default TeamDetailsPage;