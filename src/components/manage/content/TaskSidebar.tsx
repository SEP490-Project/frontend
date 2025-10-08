import { Calendar } from "./Calendar";
import { motion } from "framer-motion";

const taskTypes = [
  { name: "Video", color: "#ff88fa", icon: "🎥" },
  { name: "Blog", color: "#f7c06d", icon: "📝" },
  { name: "Post", color: "#9976ff", icon: "📄" },
];

interface TaskSidebarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export function TaskSidebar({ currentDate, setCurrentDate }: TaskSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-2xl font-semibold text-[#1c1b1f] mb-6"
      >
        Assigned Tasks
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-3"
      >
        {taskTypes.map((type, index) => (
          <motion.div
            key={type.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.05, x: 5 }}
            className="flex items-center gap-3 cursor-pointer transition-all duration-200"
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
              style={{ backgroundColor: type.color }}
            >
              ✓
            </motion.div>
            <span className="text-[#1c1b1f] font-medium">{type.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
