import React, { useEffect, useRef, useState } from "react";
import { Sidebar, Header } from "@/components/layout/manage";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const ManageLayout: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col relative">
        <motion.div
          initial={false}
          animate={{ y: hidden ? "-100%" : "0%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute top-0 left-0 right-0 z-50"
        >
          <Header />
        </motion.div>

        <main ref={mainRef} className="flex-1 bg-gray-200 px-2 overflow-y-auto pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManageLayout;
