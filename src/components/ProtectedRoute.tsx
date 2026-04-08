import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export type ProtectedRouteProps = {
  requiredRoles: string[];
  component: React.ComponentType<Record<string, never>>;
  fallback?: React.ReactNode;
};

/**
 * ProtectedRoute Component
 * Validates user authentication and role before rendering the component
 *
 * @param requiredRoles - Array of roles allowed to access this route
 * @param component - Component to render if authorized
 * @param fallback - Optional fallback UI for unauthorized access
 */
export function ProtectedRoute({ requiredRoles, component: Component, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, userRole } = useAuth();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role
  if (!userRole || !requiredRoles.includes(userRole)) {
    if (fallback) {
      return fallback;
    }
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p>Required role: {requiredRoles.join(" or ")}</p>
        <p>Your role: {userRole || "none"}</p>
        <button onClick={() => window.location.href = "/"}>Go Home</button>
      </div>
    );
  }

  // Authorized - render component
  return <Component />;
}

/**
 * Hook to check if user has required role
 */
export function useHasRole(roles: string[]): boolean {
  const { userRole } = useAuth();
  return userRole ? roles.includes(userRole) : false;
}
