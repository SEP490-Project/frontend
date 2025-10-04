import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/libs/hooks/useAuth";

const PublicRoute: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    if (role === "CUSTOMER") {
      return <Navigate to="/" replace />;
    }

    return <Navigate to="/manage" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
