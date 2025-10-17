import * as motion from "framer-motion/client";

export const LogoSpinner = () => {
  const letters = "Loading...".split("");
  return (
    <div className="fixed inset-0 select-none z-50 min-h-screen flex flex-col items-center justify-center bg-white/40 backdrop-blur-xs gap-3">
      <motion.img
        src="/logo.svg"
        alt="Loading..."
        className=" w-20 h-20 z-50 select-none"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <div>
        {letters.map((char, i) => (
          <motion.span
            key={i}
            className="text-3xl text-primary font-bold"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              repeat: Infinity,
              delay: i * 0.1,
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  );
};
