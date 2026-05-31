import { Navigate, useLocation } from "react-router-dom";
import { AuthService } from "@/services/AuthService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = AuthService.isAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to home or login page, but here it seems the app expects to show AdminLogin on top of the current state or just redirect.
    // Let's redirect to /admin/login (which we will create)
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
