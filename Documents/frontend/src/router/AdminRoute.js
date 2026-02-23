import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  console.log('AdminRoute - user from localStorage:', user); // Debug
  console.log('AdminRoute - user.role:', user?.role); // Debug
  console.log('AdminRoute - typeof user.role:', typeof user?.role); // Debug

  if (!user) return <Navigate to="/login" replace />;
  
  // More flexible admin check - handle various admin role formats
  const isAdmin = user.role === "admin" || 
                  user.role === "administrator" || 
                  user.role === "Admin" || 
                  user.role === "ADMIN" ||
                  user.role?.toLowerCase()?.includes("admin");
  
  console.log('AdminRoute - isAdmin check:', { user, role: user?.role, isAdmin }); // Debug
  
  if (!isAdmin) {
    console.error('AdminRoute - Access denied for role:', user.role); // Debug
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
