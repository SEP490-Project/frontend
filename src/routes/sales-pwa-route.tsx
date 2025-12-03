// src/routes/sales-pwa-route.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/libs/hooks/useAuth";
import { useIsStandalone } from "@/libs/hooks/useIsStandalone";

const SalesPwaRoute: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const isStandalone = useIsStandalone();

  if (!isAuthenticated) {
    return <Navigate to="/sales-app/login" replace />;
  }

  if (role !== "SALES_STAFF") {
    return <Navigate to="/404" replace />;
  }

  // ✅ BẬT DÒNG NÀY LÊN
  if (!isStandalone) {
    return (
      <div style={{ padding: 16, textAlign: "center" }}>
        <h2>Ứng dụng chỉ dùng trên mobile app</h2>
        <p>Vui lòng cài app Sales và mở từ màn hình chính.</p>
      </div>
    );
  }

  return <Outlet />;
};

export default SalesPwaRoute;
