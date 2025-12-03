import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaBox, FaClipboardList, FaUser } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

interface PWANavigationProps {
  className?: string;
}

const PWANavigation: React.FC<PWANavigationProps> = ({ className = "" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/sales-app" || location.pathname === "/sales-app/") {
      navigate("/sales-app/orders", { replace: true });
    }
  }, [location.pathname, navigate]);

  const navItems = [
    {
      id: "orders",
      label: "Orders",
      icon: FaBox,
      path: "/sales-app/orders",
    },
    {
      id: "pre-orders",
      label: "Pre-Orders",
      icon: FaClipboardList,
      path: "/sales-app/pre-orders",
    },
    {
      id: "profile",
      label: "Profile",
      icon: FaUser,
      path: "/sales-app/profile",
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
      <div className="grid grid-cols-3 h-16">
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
