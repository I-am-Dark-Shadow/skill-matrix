import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Page Imports
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import DomainMatchPage from './pages/DomainMatchPage';
import ChooseTeamPage from './pages/ChooseTeamPage';
import TeamDetailsPage from './pages/TeamDetailsPage';
import AiSuggestionsPage from './pages/AiSuggestionsPage';
import GeminiClonePage from './pages/GeminiClonePage';
import LearningPage from './pages/LearningPage';
import EditProfilePage from './pages/EditProfilePage';

// Component Imports
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/domain-match" element={<DomainMatchPage />} />
            <Route path="/choose-team" element={<ChooseTeamPage />} />
            <Route path="/team-details" element={<TeamDetailsPage />} />
            <Route path="/ai-suggestions" element={<AiSuggestionsPage />} />
            <Route path="/gemini-clone" element={<GeminiClonePage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;