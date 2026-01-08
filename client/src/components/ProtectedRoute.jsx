// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child route
  return <Outlet />;
}

export default ProtectedRoute;