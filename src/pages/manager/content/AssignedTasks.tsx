import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskList } from "@/components/layout/manage/content/TasksList";
import { TaskSidebar } from "@/components/layout/manage/content/TaskSidebar";

export default function TaskManagement() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const formatWeekRange = (date: Date) => {
    // Get the start of the week (Monday)
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);

    // Get the end of the week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const startMonth = startOfWeek.toLocaleDateString("en-US", { month: "short" });
    const endMonth = endOfWeek.toLocaleDateString("en-US", { month: "short" });
    const startDay = startOfWeek.getDate();
    const endDay = endOfWeek.getDate();
    const year = startOfWeek.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen bg-[#ffffff]"
    >
      {/* Left Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-80 bg-[#ffffff] border-r border-[#dadada] p-6"
      >
        <TaskSidebar currentDate={currentDate} setCurrentDate={setCurrentDate} />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 p-6"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="bg-[#ffffff] border-[#dadada] text-[#1c1b1f] hover:bg-[#f8f9fa] transition-all duration-200 hover:scale-105"
              onClick={goToToday}
            >
              📅 Today
            </Button>
            <AnimatePresence mode="wait">
              <motion.h1
                key={formatWeekRange(currentDate)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="text-xl font-medium text-[#1c1b1f]"
              >
                {formatWeekRange(currentDate)}
              </motion.h1>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek("prev")}
              className="transition-all duration-200 hover:bg-[#f5f5f5] hover:scale-110"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek("next")}
              className="transition-all duration-200 hover:bg-[#f5f5f5] hover:scale-110"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="transition-all duration-300 ease-in-out"
        >
          <TaskList currentDate={currentDate} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
