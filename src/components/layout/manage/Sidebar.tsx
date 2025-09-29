import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaChartLine,
  FaUserGear,
  FaChartPie,
  FaRegUser,
  FaRegCircleQuestion,
  FaRegFileLines,
  FaFolderOpen,
  FaHashtag,
  FaCalendarDays,
  FaFilePen,
  FaBoxOpen,
  FaFolderTree,
  FaCartShopping,
  FaStar,
  FaMoneyCheckDollar,
  FaHandshake,
  FaFileContract,
  FaListCheck,
} from "react-icons/fa6";

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
                    className="absolute inset-0 rounded bg-primary/20 border-l-4 border-primary shadow-md"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
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

              {/* Sub tabs */}
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
                      pathname.startsWith("/manage/admin/users") && roleParam === subRole;

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

interface SidebarProps {
  role?: string;
  collapsed?: boolean;
  isMobile?: boolean;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  role = "marketing",
  collapsed = false,
  isMobile = false,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const location = useLocation();
  const pathname = location.pathname;
  const roleParam = new URLSearchParams(location.search).get("role");

  // Tabs
  const dashboardTabs: TabItem[] = [
    { href: "/manage", label: "Dashboard", icon: <FaChartLine size={18} /> },
  ];

  const roleBasedTabs: Record<string, TabItem[]> = {
    brand: [
      { href: "/manage/brand/contracts", label: "Contracts", icon: <FaRegFileLines size={18} /> },
      { href: "/manage/brand/campaigns", label: "Campaigns", icon: <FaFolderOpen size={18} /> },
    ],
    marketing: [
      { href: "/manage/marketing/partners", label: "Partners", icon: <FaHandshake size={18} /> },
      {
        href: "/manage/marketing/contracts",
        label: "Contracts",
        icon: <FaFileContract size={18} />,
      },
      {
        href: "/manage/marketing/assignments",
        label: "Assignments & Tasks",
        icon: <FaListCheck size={18} />,
      },
    ],
    sale: [
      { href: "/manage/sale/task", label: "Tasks & Schedule", icon: <FaCalendarDays size={18} /> },
      { href: "/manage/sale/product", label: "Product Management", icon: <FaBoxOpen size={18} /> },
      {
        href: "/manage/sale/categorie",
        label: "Category Management",
        icon: <FaFolderTree size={18} />,
      },
      { href: "/manage/sale/order", label: "Order Management", icon: <FaCartShopping size={18} /> },
      { href: "/manage/sale/review", label: "Review Management", icon: <FaStar size={18} /> },
      {
        href: "/manage/sale/transaction",
        label: "Transaction Management",
        icon: <FaMoneyCheckDollar size={18} />,
      },
    ],
    content: [
      {
        href: "/manage/content/task",
        label: "Tasks & Schedule",
        icon: <FaCalendarDays size={18} />,
      },
      { href: "/manage/content/blog", label: "Blog Management", icon: <FaFilePen size={18} /> },
      { href: "/manage/content/tag", label: "Tag Management", icon: <FaHashtag size={18} /> },
    ],
    admin: [
      {
        href: "/manage/admin/users",
        label: "Users",
        icon: <FaUserGear size={18} />,
        subTabs: [
          { href: "/manage/admin/users?role=customer", label: "Customer" },
          { href: "/manage/admin/users?role=marketing", label: "Marketing Staff" },
          { href: "/manage/admin/users?role=content", label: "Content Staff" },
          { href: "/manage/admin/users?role=sale", label: "Sale Staff" },
          { href: "/manage/admin/users?role=brand", label: "Brand Staff" },
        ],
      },
      { href: "/manage/admin/reports", label: "KPI & Reports", icon: <FaChartPie size={18} /> },
    ],
  };

  const otherTabs: TabItem[] = [
    { href: "/manage/account", label: "Account", icon: <FaRegUser size={18} /> },
    { href: "/manage/help", label: "Help", icon: <FaRegCircleQuestion size={18} /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex bg-white text-primary min-h-screen p-4 flex-col gap-4 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center gap-4 justify-center">
          <a href="/" className="flex items-center gap-2">
            {collapsed ? (
              <img src="/logo.svg" alt="Logo" className="w-8 h-8 object-contain" />
            ) : (
              <img src="/pink.png" alt="Logo" className="w-full h-14 object-contain" />
            )}
          </a>
        </div>

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

      {/* Mobile Sidebar with overlay */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black z-20 md:hidden"
            />

            {/* Sidebar */}
            <motion.aside
              key="sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white z-30 p-4 flex flex-col gap-4 shadow-lg md:hidden"
            >
              <button
                onClick={onCloseMobile}
                className="self-end text-gray-500 hover:text-gray-700 mb-4"
              >
                ✕
              </button>

              <div className="flex items-center justify-center">
                <img src="/pink.png" alt="Logo" className="w-full h-14 object-contain" />
              </div>

              <NavSection
                title="Dashboard"
                items={dashboardTabs}
                collapsed={false}
                pathname={pathname}
                roleParam={roleParam}
              />

              <NavSection
                title="Management"
                items={roleBasedTabs[role] || []}
                collapsed={false}
                pathname={pathname}
                roleParam={roleParam}
              />

              <NavSection
                title="Others"
                items={otherTabs}
                collapsed={false}
                pathname={pathname}
                roleParam={roleParam}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
