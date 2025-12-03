import React from "react";
import { Button } from "@/components/ui/button";
import { FaBox, FaClipboardList, FaUser, FaBell } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface PWANavigationProps {
  className?: string;
}

const PWANavigation: React.FC<PWANavigationProps> = ({ className = "" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: "orders",
      label: "Orders",
      icon: FaBox,
      path: "/sales-app/orders",
      badge: null,
    },
    {
      id: "pre-orders",
      label: "Pre-Orders",
      icon: FaClipboardList,
      path: "/sales-app/pre-orders",
      badge: null,
    },
    {
      id: "profile",
      label: "Profile",
      icon: FaUser,
      path: "/sales-app/profile",
      badge: null,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: FaBell,
      path: "/sales-app/notifications",
      badge: 3,
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`h-full rounded-none flex flex-col items-center justify-center gap-1 relative ${
                active
                  ? "text-primary bg-primary/5 border-t-2 border-primary"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? "text-primary" : ""}`} />
                {item.badge && item.badge > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs bg-red-500 hover:bg-red-500"
                    variant="destructive"
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-xs font-medium ${active ? "text-primary" : ""}`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default PWANavigation;
