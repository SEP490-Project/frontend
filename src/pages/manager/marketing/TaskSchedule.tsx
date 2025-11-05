import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { TaskSidebar, TaskDetail, TaskList } from "@/components/manage/marketing/task";
import { useAppDispatch } from "@/libs/stores";
import { getTaskList, getTaskDetail } from "@/libs/stores/taskManager/thunk";
import type { TaskListMarketing } from "@/libs/types/task";
import { useTaskMarketing } from "@/libs/hooks/useTaskMarketing";

function TaskSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskListMarketing | null>(null);
  const { taskListMarketing, loading, detailLoading } = useTaskMarketing();
  const previousDateRef = useRef<Date | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        await dispatch(getTaskList({ page: 1, limit: 10 })).unwrap();
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [dispatch]);

  useEffect(() => {
    if (previousDateRef.current && previousDateRef.current.getTime() !== currentDate.getTime()) {
      if (showTaskDetail) {
        setShowTaskDetail(false);
        setSelectedTask(null);
      }
    }
    previousDateRef.current = currentDate;
  }, [currentDate, showTaskDetail]);

  const handleViewTaskDetail = async (taskId: string) => {
    setShowTaskDetail(true);
    try {
      const result = await dispatch(getTaskDetail(taskId)).unwrap();
      if (result && result.data) {
        setSelectedTask(result.data);
      }
    } catch (error) {
      setSelectedTask(null);
      console.error("Error fetching task detail:", error);
    }
  };

  const handleCloseTaskDetail = () => {
    setShowTaskDetail(false);
    setSelectedTask(null);
  };

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
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);

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
    <div className="flex min-h-screen">
      <div className="w-80 border-r mt-0.5 border-border p-6 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Assigned Tasks</h1>
        </div>
        <div className="flex-1">
          <TaskSidebar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            tasks={taskListMarketing}
          />
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col h-screen">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="default" onClick={goToToday} className="gap-2">
              <Calendar className="h-4 w-4" />
              Today
            </Button>
            <AnimatePresence mode="wait">
              <motion.h1
                key={formatWeekRange(currentDate)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="text-xl font-semibold text-foreground"
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
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek("next")}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <TaskList
            currentDate={currentDate}
            onViewTask={handleViewTaskDetail}
            tasks={taskListMarketing}
            loading={loading}
          />

          {showTaskDetail && (
            <div className="absolute inset-0 z-50">
              <TaskDetail
                task={selectedTask}
                onClose={handleCloseTaskDetail}
                isVisible={showTaskDetail}
                loading={detailLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskSchedule;
