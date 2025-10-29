import { Calendar } from "./Calendar";
import { motion } from "framer-motion";

const taskTypes = [
  { name: "Video", color: "#ff88fa", icon: "🎥" },
  { name: "Blog", color: "#f7c06d", icon: "📝" },
];

interface TaskSidebarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export function TaskSidebar({ currentDate, setCurrentDate }: TaskSidebarProps) {
  return (
    <div className="space-y-6">
      <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} />

      <div className="space-y-3">
        {taskTypes.map((type, index) => (
          <motion.div
            key={type.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-3 cursor-pointer hover:translate-x-1 transition-transform duration-200"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm"
              style={{ backgroundColor: type.color }}
            >
              ✓
            </div>
            <span className="text-foreground font-medium">{type.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
