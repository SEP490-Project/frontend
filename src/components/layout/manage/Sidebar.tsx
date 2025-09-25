import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaUserGear,
  FaChartPie,
  FaRegUser,
  FaRegCircleQuestion,
} from "react-icons/fa6";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

interface TabItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  subTabs?: TabItem[];
}

interface NavSectionProps {
  title: string;
  items: TabItem[];
  collapsed: boolean;
  currentPath: string;
}

const NavSection: React.FC<NavSectionProps> = ({ title, items, collapsed, currentPath }) => {
  if (items.length === 0) return null;

  // Lấy query param từ URL
  const url = new URL(window.location.href);
  const roleParam = url.searchParams.get("role");

  return (
    <div className="mb-4">
      {!collapsed && <div className="uppercase text-xs font-bold text-gray-400 mb-2">{title}</div>}
      <nav className="flex flex-col gap-2 relative">
        {items.map((item) => {
          // Active chính: chỉ so path
          const isMainActive =
            currentPath === item.href ||
            (item.href === "/users" && currentPath.startsWith("/users"));

          return (
            <React.Fragment key={item.href}>
              <a
                href={item.href}
                className={`relative rounded py-2 flex items-center ${
                  collapsed ? "justify-center" : "gap-2 px-3"
                }`}
              >
                {/* Highlight: chỉ animate khi mount/unmount, không re-run khi đổi query */}
                {isMainActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded bg-primary/10 border-l-4 border-primary shadow-md"
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-300 ${
                    isMainActive ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {item.icon}
                </span>
                {!collapsed && (
                  <span
                    className={`relative text-sm z-10 transition-colors duration-300 ${
                      isMainActive ? "text-primary font-semibold" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </a>

              {/* Sub-tabs */}
              {isMainActive && item.subTabs && !collapsed && (
                <motion.div
                  // Animate khi mount tab cha, nhưng không re-run khi chỉ đổi query
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  className="ml-8 mt-2 flex flex-col gap-1"
                >
                  {item.subTabs.map((sub) => {
                    const subUrl = new URL(sub.href, window.location.origin);
                    const subRole = subUrl.searchParams.get("role");
                    const isSubActive = currentPath.startsWith("/users") && roleParam === subRole;

                    return (
                      <a
                        key={sub.href}
                        href={sub.href}
                        className={`rounded px-3 py-1 flex items-center gap-2 text-sm transition-colors duration-200 ${
                          isSubActive
                            ? "bg-primary/20 text-primary font-semibold"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {sub.icon}
                        <span className="text-xs">{sub.label}</span>
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};

const Sidebar: React.FC<{ role?: string }> = ({ role = "brand" }) => {
  const [collapsed, setCollapsed] = useState(false);
  const currentPath = window.location.pathname + window.location.search;

  const dashboardTabs: TabItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: <FaChartLine size={18} /> },
  ];

  const roleBasedTabs: Record<string, TabItem[]> = {
    brand: [
      {
        href: "/brand/contracts",
        label: "Contracts & Campaigns",
        icon: <FaUserGear size={18} />,
      },
    ],
    marketing: [
      { href: "/marketing/campaigns", label: "Partners", icon: <FaUserGear size={18} /> },
      { href: "/marketing/contracts", label: "Contracts", icon: <FaUserGear size={18} /> },
      { href: "/marketing/tasks", label: "Tasks", icon: <FaUserGear size={18} /> },
      { href: "/marketing/requests", label: "Requests", icon: <FaUserGear size={18} /> },
      {
        href: "/marketing/finance",
        label: "Finance & Reports",
        icon: <FaChartPie size={20} />,
      },
    ],
    sale: [
      { href: "/sale/products", label: "Products", icon: <FaUserGear size={18} /> },
      { href: "/sale/categories", label: "Categories", icon: <FaUserGear size={18} /> },
      { href: "/sale/orders", label: "Orders", icon: <FaUserGear size={18} /> },
      { href: "/sale/reviews", label: "Reviews", icon: <FaUserGear size={18} /> },
      { href: "/sale/payment", label: "Payment", icon: <FaUserGear size={18} /> },
      { href: "/sale/tasks", label: "Assigned Tasks", icon: <FaUserGear size={18} /> },
    ],
    content: [
      { href: "/content/blogs", label: "Blogs", icon: <FaUserGear size={18} /> },
      { href: "/content/tasks", label: "Assigned Tasks", icon: <FaUserGear size={18} /> },
    ],
    admin: [
      {
        href: "/users",
        label: "Users",
        icon: <FaUserGear size={18} />,
        subTabs: [
          { href: "/users?role=customer", label: "Customer" },
          {
            href: "/users?role=marketing",
            label: "Marketing Staff",
          },
          {
            href: "/users?role=content",
            label: "Content Staff",
          },
          { href: "/users?role=sale", label: "Sale Staff" },
          { href: "/users?role=brand", label: "Brand Staff" },
        ],
      },
      { href: "/reports", label: "KPI & Reports", icon: <FaChartPie size={18} /> },
    ],
  };

  const otherTabs: TabItem[] = [
    { href: "/account", label: "Account", icon: <FaRegUser size={18} /> },
    { href: "/help", label: "Help", icon: <FaRegCircleQuestion size={18} /> },
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
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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

      {/* Management */}
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
