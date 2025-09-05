import React from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import useAuthStore from "../../store/authStore";

// Route → Title mapping
const pageTitles = {
  "/dashboard": "Dashboard",
  "/projects": "My Projects",
  "/domain-match": "Domain Match",
  "/choose-team": "Choose Team with AI",
  "/team-details": "Team Details",
  "/ai-suggestions": "AI Project Suggestions",
  "/gemini-clone": "AI Assistant",
  "/learning": "Learning Hub",
};

const Topbar = ({ toggleSidebar }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-amber-100 h-16 sticky top-0 z-10">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left side: Hamburger + Title */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-full hover:bg-amber-50"
          >
            <Menu className="w-6 h-6 text-[#3b2f2f]" />
          </button>

          {/* Title → visible on md and larger */}
          <h1 className="text-lg sm:text-xl font-semibold text-[#3b2f2f] hidden md:block">
            {title}
          </h1>
        </div>

        {/* Right side: User Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                user?.fullName || "User"
              }`}
              alt="avatar"
              className="w-9 h-9 rounded-full bg-amber-50 border-2 border-white shadow"
            />
            {/* User details only on md+ */}
            <div className="hidden md:block">
              <p className="text-sm font-medium text-[#3b2f2f] leading-tight">
                {user?.fullName}
              </p>
              <p className="text-xs text-[#8b7355] leading-tight">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
