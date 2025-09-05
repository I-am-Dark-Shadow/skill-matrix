import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import useProjectStore from '../store/projectStore';
import { Folder, Award, Layers, Users, Plus, BrainCircuit, Bot, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// Badge component
const Badge = ({ text, color }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${colors[color]}`}>
      {text}
    </span>
  );
};

// Modal component
const Modal = ({ title, items, color, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.length > 0 ? (
            items.map((item, idx) => (
              <Badge key={idx} text={item} color={color} />
            ))
          ) : (
            <p className="text-sm text-gray-500">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

// StatCard with restored icon colors
const StatCard = ({ icon: Icon, title, items, color }) => {
  const [showModal, setShowModal] = useState(false);
  const displayItems = items?.slice(0, 2) || [];

  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  };
  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {displayItems.length > 0 ? (
              displayItems.map((item, idx) => (
                <Badge key={idx} text={item} color={color} />
              ))
            ) : (
              <span className="text-gray-400 text-sm">N/A</span>
            )}
            {items && items.length > 2 && (
              <button
                onClick={() => setShowModal(true)}
                className="text-xs text-blue-600 hover:underline"
              >
                View More
              </button>
            )}
          </div>
        </div>

        {/* ✅ icon color restored */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>

      {showModal && (
        <Modal
          title={title}
          items={items}
          color={color}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

// Reusable ActionButton
const ActionButton = ({ icon: Icon, title, desc, path, color }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', hoverBorder: 'hover:border-blue-300', hoverBg: 'hover:bg-blue-50' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', hoverBorder: 'hover:border-purple-300', hoverBg: 'hover:bg-purple-50' },
    green: { bg: 'bg-green-100', text: 'text-green-600', hoverBorder: 'hover:border-green-300', hoverBg: 'hover:bg-green-50' },
  };
  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <Link to={path} className={`flex items-center space-x-3 p-4 rounded-lg border border-gray-200 transition-colors ${colors.hoverBorder} ${colors.hoverBg}`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colors.bg}`}>
        <Icon className={`w-5 h-5 ${colors.text}`} />
      </div>
      <div className="text-left">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </Link>
  );
};

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Welcome back, {user?.fullName?.split(' ')[0]}! 👋
        </h2>
        <p className="text-gray-600 mt-1">Here's what's happening with your projects today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Folder} title="Total Projects" items={[projects.length.toString()]} color="blue" />
        <StatCard icon={Award} title="My Skills" items={user?.skills || []} color="purple" />
        <StatCard icon={Layers} title="My Domains" items={user?.domains || []} color="green" />
        <StatCard icon={Users} title="Teams Joined" items={[user?.teamId ? "1" : "0"]} color="orange" />
      </div>

      {/* Quick Actions & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.slice(0,2).map(p => (
                <Link to="/projects" key={p._id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <h4 className="font-semibold text-gray-800 truncate">{p.title}</h4>
                    <p className="text-sm text-gray-500 truncate">{p.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">No projects yet. Add one to get started!</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
                <ActionButton icon={Plus} title="Add Project" desc="Showcase your work" path="/projects" color="blue" />
                <ActionButton icon={BrainCircuit} title="Find Team" desc="Use AI matching" path="/choose-team" color="purple" />
                <ActionButton icon={Bot} title="AI Suggestions" desc="Get project ideas" color="green" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
