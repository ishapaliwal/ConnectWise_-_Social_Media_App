import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectInitialCheckDone,
  selectUserRole
} from '../../features/auth/authSlice';

const ProtectedRoute = ({ children, role = null }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const initialCheckDone = useSelector(selectInitialCheckDone);
  const userRole = useSelector(selectUserRole);

  if (!initialCheckDone) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // if (allowedRoles && !allowedRoles.includes(userRole)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }  

  return children;
};

export default ProtectedRoute;