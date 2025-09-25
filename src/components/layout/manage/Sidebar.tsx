import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaUserGear,
  FaChartPie,
  FaRegUser,
  FaRegCircleQuestion,
  FaRegFileLines,
  FaFolderOpen,
} from "react-icons/fa6";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { NavLink, useLocation } from "react-router-dom";

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
  pathname: string;
  roleParam: string | null;
}

const NavSection: React.FC<NavSectionProps> = ({
  title,
  items,
  collapsed,
  pathname,
  roleParam,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-4">
      {!collapsed && <div className="uppercase text-xs font-bold text-gray-400 mb-2">{title}</div>}
      <nav className="flex flex-col gap-2 relative">
        {items.map((item) => {
          const isMainActive =
            pathname === item.href ||
            (item.href === "/manage/users" && pathname.startsWith("/manage/users"));

          return (
            <React.Fragment key={item.href}>
              <NavLink
                to={item.href}
                className={`relative rounded py-2 flex items-center ${
                  collapsed ? "justify-center" : "gap-2 px-3"
                }`}
              >
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
              </NavLink>

              {isMainActive && item.subTabs && !collapsed && (
                <motion.div
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  className="ml-8 mt-2 flex flex-col gap-1"
                >
                  {item.subTabs.map((sub) => {
                    const subUrl = new URL(sub.href, window.location.origin);
                    const subRole = subUrl.searchParams.get("role");
                    const isSubActive =
                      pathname.startsWith("/manage/users") && roleParam === subRole;

                    return (
                      <NavLink
                        key={sub.href}
                        to={sub.href}
                        className={`rounded px-3 py-1 flex items-center gap-2 text-sm transition-colors duration-200 ${
                          isSubActive
                            ? "bg-primary/20 text-primary font-semibold"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {sub.icon}
                        <span className="text-xs">{sub.label}</span>
                      </NavLink>
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

  const location = useLocation();
  const pathname = location.pathname;
  const roleParam = new URLSearchParams(location.search).get("role");

  const dashboardTabs: TabItem[] = [
    { href: "/manage", label: "Dashboard", icon: <FaChartLine size={18} /> },
  ];

  const roleBasedTabs: Record<string, TabItem[]> = {
    brand: [
      {
        href: "/manage/brand/contracts",
        label: "Contracts",
        icon: <FaRegFileLines size={18} />,
      },
      {
        href: "/manage/brand/campaigns",
        label: "Campaigns",
        icon: <FaFolderOpen size={18} />,
      },
    ],
    marketing: [
      { href: "/manage/marketing/campaigns", label: "Partners", icon: <FaUserGear size={18} /> },
      { href: "/manage/marketing/contracts", label: "Contracts", icon: <FaUserGear size={18} /> },
      { href: "/manage/marketing/tasks", label: "Tasks", icon: <FaUserGear size={18} /> },
    ],
    sale: [
      { href: "/manage/sale/products", label: "Products", icon: <FaUserGear size={18} /> },
      { href: "/manage/sale/categories", label: "Categories", icon: <FaUserGear size={18} /> },
      { href: "/manage/sale/orders", label: "Orders", icon: <FaUserGear size={18} /> },
      { href: "/manage/sale/reviews", label: "Reviews", icon: <FaUserGear size={18} /> },
      { href: "/manage/sale/payment", label: "Transactions", icon: <FaUserGear size={18} /> },
      { href: "/manage/sale/tasks", label: "Assigned Tasks", icon: <FaUserGear size={18} /> },
    ],
    content: [
      { href: "/manage/content/blogs", label: "Blogs", icon: <FaUserGear size={18} /> },
      { href: "/manage/content/tasks", label: "Assigned Tasks", icon: <FaUserGear size={18} /> },
    ],
    admin: [
      {
        href: "/manage/users",
        label: "Users",
        icon: <FaUserGear size={18} />,
        subTabs: [
          { href: "/manage/users?role=customer", label: "Customer" },
          { href: "/manage/users?role=marketing", label: "Marketing Staff" },
          { href: "/manage/users?role=content", label: "Content Staff" },
          { href: "/manage/users?role=sale", label: "Sale Staff" },
          { href: "/manage/users?role=brand", label: "Brand Staff" },
        ],
      },
      { href: "/manage/reports", label: "KPI & Reports", icon: <FaChartPie size={18} /> },
    ],
  };

  const otherTabs: TabItem[] = [
    { href: "/manage/account", label: "Account", icon: <FaRegUser size={18} /> },
    { href: "/manage/help", label: "Help", icon: <FaRegCircleQuestion size={18} /> },
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

      <NavSection
        title="Dashboard"
        items={dashboardTabs}
        collapsed={collapsed}
        pathname={pathname}
        roleParam={roleParam}
      />

      <NavSection
        title="Management"
        items={roleBasedTabs[role] || []}
        collapsed={collapsed}
        pathname={pathname}
        roleParam={roleParam}
      />

      <NavSection
        title="Others"
        items={otherTabs}
        collapsed={collapsed}
        pathname={pathname}
        roleParam={roleParam}
      />
    </aside>
  );
};

export default Sidebar;
