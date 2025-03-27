import {  Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const userRole = localStorage.getItem('userRole');
    const location = useLocation();
  
    if (!userRole) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  
    return children;
  };
  export default ProtectedRoute;
  