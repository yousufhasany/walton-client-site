import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('authRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return role === 'admin' ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
