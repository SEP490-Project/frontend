import { useState, useEffect } from "react";
import { Calendar, TaskListModalWithDetail } from "@/components/manage/marketing/task";
import { useAppDispatch } from "@/libs/stores";
import { getTaskList, getTaskDetail } from "@/libs/stores/taskManager/thunk";
import { clearTaskDetail } from "@/libs/stores/taskManager/slice";
import { useTaskMarketing } from "@/libs/hooks/useTaskMarketing";
import type { TaskListMarketing } from "@/libs/types/task";
import { motion } from "framer-motion";

const TaskSchedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const { taskListMarketing, detailLoading, taskDetail } = useTaskMarketing();
  const dispatch = useAppDispatch();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const params: any = { page: 1, limit: 100 }; // Increase limit to get all tasks for calendar view
        if (activeFilter !== "ALL") {
          params.type = activeFilter;
        }
        await dispatch(getTaskList(params)).unwrap();
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [dispatch, activeFilter]);

  const handleDateClick = (date: Date) => {
    const tasksForDate = getTasksForDate(date);
    if (tasksForDate.length > 0) {
      setSelectedDate(date);
      setShowModal(true);
    }
  };

  const handleTaskClick = async (taskId: string) => {
    try {
      await dispatch(getTaskDetail(taskId));
    } catch (error) {
      console.error("Error fetching task detail:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  const handleClearTaskDetail = () => {
    dispatch(clearTaskDetail());
  };

  const handleFilterChange = (type: string) => {
    setActiveFilter(type);
  };

  const getTasksForDate = (date: Date): TaskListMarketing[] => {
    return taskListMarketing.filter((task) => {
      const taskDate = new Date(task.deadline);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
  };

  const getTaskCounts = () => {
    const counts: Record<string, number> = {
      ALL: taskListMarketing.length,
    };

    taskListMarketing.forEach((task) => {
      counts[task.type] = (counts[task.type] || 0) + 1;
    });

    return counts;
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex flex-col h-full">
        <div className=" mb-6">
          <motion.h1 className="text-xl sm:text-2xl font-semibold" variants={itemVariants}>
            Task Schedule
          </motion.h1>
          <motion.p className="text-gray-600 mt-1" variants={itemVariants}>
            View and manage your tasks in schedule format
          </motion.p>
        </div>

        <div className="flex-1 px-6 pb-12">
          <Calendar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            tasks={taskListMarketing}
            onDateClick={handleDateClick}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            taskCounts={getTaskCounts()}
          />
        </div>
      </div>

      {/* Task List Modal with Detail Slider */}
      <TaskListModalWithDetail
        isOpen={showModal}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        tasks={selectedDateTasks}
        taskDetail={taskDetail}
        detailLoading={detailLoading}
        onTaskClick={handleTaskClick}
        onClearTaskDetail={handleClearTaskDetail}
      />
    </div>
  );
};

export default TaskSchedule;
