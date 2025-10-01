import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlobalFooter, GlobalHeader } from "@/components/layout/customer";
import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
  const [hidden, setHidden] = useState(false);
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

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header có animation */}
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
