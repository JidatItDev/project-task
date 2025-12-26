import { Navigate } from 'react-router-dom';

const RoleRoute = ({ allowedRole, children }) => {
  const user = JSON.parse(localStorage.getItem('user')); 

  if (!user || user.role !== allowedRole) {
    return <Navigate to="/" />; 
  }

  return children; 
};

export default RoleRoute;
