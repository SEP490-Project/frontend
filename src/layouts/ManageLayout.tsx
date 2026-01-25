import React, { useEffect, useRef, useState } from "react";
import { Sidebar, Header } from "@/components/manage";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/libs/hooks/useAuth";
import { useIsStandalone } from "@/libs/hooks/useIsStandalone";

const ManageLayout: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const mainRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, role } = useAuth();
  const isStandalone = useIsStandalone();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    let lastScrollY = mainEl.scrollTop;
    const handleScroll = () => {
      const currentScrollY = mainEl.scrollTop;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY = currentScrollY;
    };

    mainEl.addEventListener("scroll", handleScroll);
    return () => mainEl.removeEventListener("scroll", handleScroll);
  }, []);

  if (isStandalone && role === "SALES_STAFF") {
    return (
      <Navigate
        to={isAuthenticated ? "/sales-app" : "/sales-app/login"}
        replace
        state={{ from: location }}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        isMobile={isMobile}
        isMobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col relative">
        <motion.div
          initial={false}
          animate={{ y: hidden ? "-100%" : "0%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute top-0 left-0 right-0 z-50"
        >
          <Header
            collapsed={collapsed}
            onToggleCollapse={() => {
              setCollapsed(!collapsed);
            }}
            onToggleMobileSidebar={() => {
              setMobileOpen((prev) => !prev);
            }}
          />
        </motion.div>

        <main ref={mainRef} className="flex-1 bg-gray-200 px-2 overflow-y-auto pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManageLayout;
