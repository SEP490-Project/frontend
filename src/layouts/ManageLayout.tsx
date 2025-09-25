import React from "react";
import { Sidebar, Header } from "@/components/layout/manage";
import { Outlet } from "react-router-dom";

const ManageLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-200 px-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManageLayout;
