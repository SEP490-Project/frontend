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

interface TabItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavSectionProps {
  title: string;
  items: TabItem[];
  collapsed: boolean;
  currentPath: string;
}

const NavSection: React.FC<NavSectionProps> = ({ title, items, collapsed, currentPath }) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-4">
      {!collapsed && <div className="uppercase text-xs font-bold text-gray-400 mb-2">{title}</div>}
      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`rounded py-2 flex items-center ${
                collapsed ? "justify-center" : "gap-2 px-3"
              } transition-all duration-200 relative overflow-hidden ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary shadow-sm"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
              style={isActive ? { boxShadow: "0 2px 8px rgba(37,99,235,0.08)" } : {}}
            >
              <span
                className={`transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                {item.icon}
              </span>
              {!collapsed && item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
};

const Sidebar: React.FC<{ role?: string }> = ({ role = "admin" }) => {
  const [collapsed, setCollapsed] = useState(false);
  const currentPath = window.location.pathname;

  const dashboardTabs: TabItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: <AiOutlineDashboard size={20} /> },
  ];

  // Tabs cho từng role
  const roleBasedTabs: Record<string, TabItem[]> = {
    brand: [
      {
        href: "/brand/users",
        label: "Contracts & Campaigns",
        icon: <MdManageAccounts size={20} />,
      },
    ],
    marketing: [
      { href: "/marketing/campaigns", label: "Partners", icon: <MdManageAccounts size={20} /> },
      { href: "/marketing/campaigns", label: "Contracts", icon: <MdManageAccounts size={20} /> },
      { href: "/marketing/campaigns", label: "Tasks", icon: <MdManageAccounts size={20} /> },
      { href: "/marketing/campaigns", label: "Requests", icon: <MdManageAccounts size={20} /> },
      {
        href: "/marketing/campaigns",
        label: "Finance & Reports",
        icon: <MdManageAccounts size={20} />,
      },
    ],
    sale: [
      { href: "/sale/orders", label: "Products", icon: <MdManageAccounts size={20} /> },
      { href: "/sale/orders", label: "Categories", icon: <MdManageAccounts size={20} /> },
      { href: "/sale/orders", label: "Orders", icon: <MdManageAccounts size={20} /> },
      { href: "/sale/orders", label: "Reviews", icon: <MdManageAccounts size={20} /> },
      { href: "/sale/orders", label: "Payment", icon: <MdManageAccounts size={20} /> },
      { href: "/sale/orders", label: "Assigned Tasks", icon: <MdManageAccounts size={20} /> },
    ],
    content: [
      { href: "/content/posts", label: "Blogs", icon: <MdManageAccounts size={20} /> },
      { href: "/content/posts", label: "Assigned Tasks", icon: <MdManageAccounts size={20} /> },
    ],
    admin: [
      { href: "/users", label: "Users", icon: <MdManageAccounts size={20} /> },
      { href: "/profile", label: "KPI & Reports", icon: <AiOutlineUser size={20} /> },
    ],
  };

  const otherTabs: TabItem[] = [
    { href: "/settings", label: "Settings", icon: <AiOutlineSetting size={20} /> },
    { href: "/account", label: "Account", icon: <AiOutlineUser size={20} /> },
    { href: "/help", label: "Help", icon: <AiOutlineQuestionCircle size={20} /> },
  ];

  return (
    <aside
      className={`bg-white text-primary min-h-screen p-4 flex flex-col gap-4 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="mb-4 rounded px-2 py-1 self-end"
        aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
      >
        {collapsed ? <AiOutlineMenuUnfold size={24} /> : <AiOutlineMenuFold size={24} />}
      </button>

      {/* Dashboard */}
      <NavSection
        title="Dashboard"
        items={dashboardTabs}
        collapsed={collapsed}
        currentPath={currentPath}
      />

      {/* Management (theo role) */}
      <NavSection
        title="Management"
        items={roleBasedTabs[role] || []}
        collapsed={collapsed}
        currentPath={currentPath}
      />

      {/* Others */}
      <NavSection
        title="Others"
        items={otherTabs}
        collapsed={collapsed}
        currentPath={currentPath}
      />
    </aside>
  );
};

export default Sidebar;
