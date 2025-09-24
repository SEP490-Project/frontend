import React, { useState } from "react";
import {
  AiOutlineDashboard,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineSetting,
  AiOutlineUser,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import { MdManageAccounts } from "react-icons/md";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const currentPath = window.location.pathname;
  const dashboardTabs = [{ href: "/", label: "Dashboard", icon: <AiOutlineDashboard size={20} /> }];
  const managementTabs = [
    { href: "/login", label: "Users", icon: <MdManageAccounts size={20} /> },
    { href: "/profile", label: "Profile", icon: <AiOutlineUser size={20} /> },
    // Thêm các tab liên quan đến management ở đây nếu cần
  ];
  const otherTabs = [
    { href: "/settings", label: "Settings", icon: <AiOutlineSetting size={20} /> },
    { href: "/account", label: "Account", icon: <AiOutlineUser size={20} /> },
    { href: "/help", label: "Help", icon: <AiOutlineQuestionCircle size={20} /> },
  ];

  return (
    <aside
      className={`bg-white text-primary min-h-screen p-4 flex flex-col gap-4 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
    >
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="mb-4 rounded px-2 py-1 self-end"
        aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
      >
        {collapsed ? <AiOutlineMenuUnfold size={24} /> : <AiOutlineMenuFold size={24} />}
      </button>
      {/* Vùng 1: Dashboard */}
      <div className="mb-4">
        {!collapsed && (
          <div className="uppercase text-xs font-bold text-gray-400 mb-2">Dashboard</div>
        )}
        <nav className="flex flex-col gap-2">
          {dashboardTabs.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`rounded py-2 flex items-center ${collapsed ? "justify-center" : "gap-2 px-3"} transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary shadow-sm"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
                style={isActive ? { boxShadow: "0 2px 8px rgba(37,99,235,0.08)" } : {}}
              >
                <span
                  className={`transition-colors duration-200 ${isActive ? "text-primary" : "text-gray-500"}`}
                >
                  {item.icon}
                </span>
                {!collapsed && item.label}
              </a>
            );
          })}
        </nav>
      </div>
      {/* Vùng 2: Management */}
      <div className="mb-4">
        {!collapsed && (
          <div className="uppercase text-xs font-bold text-gray-400 mb-2">Management</div>
        )}
        <nav className="flex flex-col gap-2">
          {managementTabs.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`rounded py-2 flex items-center ${collapsed ? "justify-center" : "gap-2 px-3"} transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary shadow-sm"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
                style={isActive ? { boxShadow: "0 2px 8px rgba(37,99,235,0.08)" } : {}}
              >
                <span
                  className={`transition-colors duration-200 ${isActive ? "text-primary" : "text-gray-500"}`}
                >
                  {item.icon}
                </span>
                {!collapsed && item.label}
              </a>
            );
          })}
        </nav>
      </div>
      {/* Vùng 3: Others */}
      <div>
        {!collapsed && <div className="uppercase text-xs font-bold text-gray-400 mb-2">Others</div>}
        <nav className="flex flex-col gap-2">
          {otherTabs.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`rounded py-2 flex items-center ${collapsed ? "justify-center" : "gap-2 px-3"} transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary shadow-sm"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
                style={isActive ? { boxShadow: "0 2px 8px rgba(37,99,235,0.08)" } : {}}
              >
                <span
                  className={`transition-colors duration-200 ${isActive ? "text-primary" : "text-gray-500"}`}
                >
                  {item.icon}
                </span>
                {!collapsed && item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
