import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router";
import { AuthContext, type AuthContextType } from "./AuthProvider.tsx";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useContext(AuthContext) as AuthContextType;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
