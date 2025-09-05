import React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import useUserStore from '../store/userStore';
import useAuthStore from '../store/authStore';

// A list of all possible domains for the filter dropdown
const DOMAIN_OPTIONS = ["Web Development", "Mobile Apps", "AI/ML", "Data Science", "Cybersecurity", "Blockchain", "Cloud/DevOps", "Game Dev"];

// Custom hook for debouncing input to prevent excessive API calls
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

const DomainMatchPage = () => {
  const { matchedUsers, isLoading, fetchMatchedUsers } = useUserStore();
  const { user: loggedInUser } = useAuthStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('');

  // Use the debounced search term for the API call
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const params = {};
    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (domainFilter) params.domain = domainFilter;
    
    fetchMatchedUsers(params);
  }, [debouncedSearchTerm, domainFilter, fetchMatchedUsers]);

  // Memoize the user's domains to prevent unnecessary recalculations
  const userDomains = useMemo(() => loggedInUser?.domains || [], [loggedInUser]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Domain Match</h2>
        <p className="text-gray-600 mt-1">
          Find students who share your interests in: <span className="font-semibold text-blue-600">{userDomains.join(', ')}</span>
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, college, skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Matched Domains</option>
          {DOMAIN_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Top Skills</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domains</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-10 text-gray-500">Loading...</td></tr>
              ) : matchedUsers.length > 0 ? (
                matchedUsers.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} alt={user.fullName} className="w-10 h-10 rounded-full bg-gray-100"/>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{user.college}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.skills.slice(0, 3).map(skill => <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">{skill}</span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.domains.slice(0, 2).map(domain => <span key={domain} className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">{domain}</span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors">Connect</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-10 text-gray-500">No matching students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DomainMatchPage;