import React from "react";
import { Outlet } from "react-router-dom";

const SalesPwaLayout: React.FC = () => {
  return (
    <div className="sales-pwa-layout">
      <main className="p-3">
        <Outlet />
      </main>
    </div>
  );
};

export default SalesPwaLayout;
