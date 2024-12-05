import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  redirectPath?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ redirectPath = '/login' }) => {
  const token = localStorage.getItem('token');

  return token ? <Outlet /> : <Navigate to={redirectPath} />;
};

export default PrivateRoute;
