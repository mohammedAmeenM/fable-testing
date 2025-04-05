import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../app/redux';

const PrivateRoute:React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.userId);

  // Check if the user is authenticated either from Redux or localStorage
  if (!userId) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;