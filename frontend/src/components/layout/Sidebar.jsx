import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  User,
  BrainCircuit,
  UserCheck,
  Lightbulb,
  MessageSquare,
  GraduationCap,
  LogOut,
  X,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import axios from "axios";

const navLinks = [
  { icon: LayoutDashboard, text: "Dashboard", path: "/dashboard" },
  { icon: FolderOpen, text: "Projects", path: "/projects" },
  { icon: Users, text: "Domain Match", path: "/domain-match" },
  { icon: BrainCircuit, text: "Choose Team", path: "/choose-team" },
  { icon: UserCheck, text: "Team Details", path: "/team-details" },
  { icon: Lightbulb, text: "AI Suggestions", path: "/ai-suggestions" },
  { icon: MessageSquare, text: "Gemini Clone", path: "/gemini-clone" },
  { icon: GraduationCap, text: "Learning", path: "/learning" },
  { icon: User, text: "Edit Profile", path: "/profile/edit" },
];

const Sidebar = ({ closeSidebar }) => {
  const { logoutUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
      logoutUser();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
      logoutUser();
      navigate("/");
    }
  };

  return (
    <aside className="h-full w-64 bg-white shadow-sm border-r border-amber-100 flex flex-col">
      {/* Header + close button for mobile */}
      <div className="p-4 border-b border-amber-100 flex items-center justify-start">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-700 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-semibold text-sm">SM</span>
          </div>
          <span className="text-xl font-bold text-[#3b2f2f]">
            Skill Matrix
          </span>
        </NavLink>

        {/* Only show on mobile */}
        {closeSidebar && (
          <button
            onClick={closeSidebar}
            className="lg:hidden p-2 rounded-full hover:bg-amber-50"
          >
            <X className="w-5 h-5 text-[#3b2f2f]" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-amber-50 text-amber-700"
                  : "text-[#5c4a3f] hover:bg-amber-50"
              }`
            }
          >
            <link.icon className="mr-3 w-5 h-5" />
            {link.text}
          </NavLink>
        ))}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-amber-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-[#5c4a3f] hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
