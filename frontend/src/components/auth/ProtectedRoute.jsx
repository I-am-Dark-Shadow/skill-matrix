import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = () => {
  const { user } = useAuthStore();

  // If there is no user in the global state, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If there is a user, render the nested routes (e.g., AppLayout and its children)
  return <Outlet />;
};

export default ProtectedRoute;