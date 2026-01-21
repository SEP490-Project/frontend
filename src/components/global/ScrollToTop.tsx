import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { animate } from "framer-motion";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    animate(window.scrollY, 0, {
      duration: 0.5,
      onUpdate: (value) => window.scrollTo(0, value),
    });
  }, [pathname]);
  return null;
};

export default ScrollToTop;
