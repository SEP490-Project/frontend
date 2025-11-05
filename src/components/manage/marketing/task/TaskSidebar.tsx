import Calendar from "./Calendar";
import { motion } from "framer-motion";
import type { Task } from "@/libs/types/task";
import { useAppDispatch } from "@/libs/stores";
import { getTaskList } from "@/libs/stores/taskManager/thunk";
import { FaBox, FaFileLines, FaCalendarDays, FaGlobe } from "react-icons/fa6";

const taskTypes = [
  { name: "PRODUCT", color: "#f7c06d", icon: <FaBox className="h-4 w-4 text-white" /> },
  { name: "CONTENT", color: "#ff88fa", icon: <FaFileLines className="h-4 w-4 text-white" /> },
  { name: "EVENT", color: "#6ad1ff", icon: <FaCalendarDays className="h-4 w-4 text-white" /> },
  { name: "OTHER", color: "#9976ff", icon: <FaGlobe className="h-4 w-4 text-white" /> },
];

interface TaskSidebarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  tasks: Task[];
}

function TaskSidebar({ currentDate, setCurrentDate, tasks }: TaskSidebarProps) {
  const dispatch = useAppDispatch();

  const handleFilterByType = async (type: string) => {
    await dispatch(getTaskList({ page: 1, limit: 10, type })).unwrap();
  };

  return (
    <div className="space-y-6">
      <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} tasks={tasks} />

      <div className="space-y-3">
        {taskTypes.map((type, index) => (
          <motion.div
            key={type.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-3 cursor-pointer hover:translate-x-1 transition-transform duration-200"
            onClick={() => handleFilterByType(type.name)}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm"
              style={{ backgroundColor: type.color }}
            >
              {type.icon}
            </div>
            <span className="text-foreground font-medium">{type.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TaskSidebar;
