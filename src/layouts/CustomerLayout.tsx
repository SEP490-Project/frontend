import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlobalFooter, GlobalHeader } from "@/components/customer";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/libs/hooks/useAuth";
import { useIsStandalone } from "@/libs/hooks/useIsStandalone";

const CustomerLayout = () => {
  const [hidden, setHidden] = useState(false);

  const { isAuthenticated, role } = useAuth();
  const isStandalone = useIsStandalone();
  const location = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
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
    <div className="flex min-h-screen flex-col">
      <motion.div
        initial={false}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="sticky top-0 z-50"
      >
        <GlobalHeader />
      </motion.div>

      <main className="flex-1 bg-gray-200">
        <Outlet />
      </main>

      <GlobalFooter />
    </div>
  );
};

export default CustomerLayout;
