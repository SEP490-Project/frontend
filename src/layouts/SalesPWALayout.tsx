import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import PWANavigation from "@/components/pwa/PWANavigation";

const SalesPwaLayout: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const currentY = e.touches[0].clientY;
      const isPullingDown = currentY > startY;

      if (el.scrollTop === 0 && isPullingDown) {
        e.preventDefault();
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="sales-pwa-layout min-h-screen max-h-screen overflow-y-auto bg-gray-100"
    >
      <main className="p-3 pb-20">
        <Outlet />
      </main>
      <PWANavigation className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
};

export default SalesPwaLayout;
