import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PrivateRoute({ role, children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (Array.isArray(role)) {
    if (!role.includes(user?.role)) return <Navigate to="/" replace />;
  } else if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}
