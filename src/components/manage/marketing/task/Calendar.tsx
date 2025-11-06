import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaBox, FaFileLines, FaCalendarDays, FaGlobe, FaFilter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import type { TaskListMarketing } from "@/libs/types/task";

const daysOfWeekShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const taskTypes = [
  { name: "ALL", label: "All Tasks", color: "#6b7280", icon: <FaFilter className="h-4 w-4" /> },
  { name: "PRODUCT", label: "Product", color: "#f7c06d", icon: <FaBox className="h-4 w-4" /> },
  {
    name: "CONTENT",
    label: "Content",
    color: "#ff88fa",
    icon: <FaFileLines className="h-4 w-4" />,
  },
  { name: "EVENT", label: "Event", color: "#6ad1ff", icon: <FaCalendarDays className="h-4 w-4" /> },
  { name: "OTHER", label: "Other", color: "#9976ff", icon: <FaGlobe className="h-4 w-4" /> },
];

interface CalendarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  tasks: TaskListMarketing[];
  onDateClick: (date: Date) => void;
  activeFilter: string;
  onFilterChange: (type: string) => void;
  taskCounts: Record<string, number>;
}

function Calendar({
  currentDate,
  setCurrentDate,
  tasks,
  onDateClick,
  activeFilter,
  onFilterChange,
  taskCounts,
}: CalendarProps) {
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const lastDayOfPrevMonth = new Date(year, month, 0);
  const daysInPrevMonth = lastDayOfPrevMonth.getDate();

  const getTasksForDate = (date: Date): TaskListMarketing[] => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.deadline);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case "PRODUCT":
        return "#f7c06d";
      case "CONTENT":
        return "#ff88fa";
      case "EVENT":
        return "#6ad1ff";
      case "OTHER":
        return "#9976ff";
      default:
        return "#e5e7eb";
    }
  };

  const calendarDays = [];

  // Previous month days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
      key: `prev-${daysInPrevMonth - i}`,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day),
      key: `current-${day}`,
    });
  }

  // Next month days
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month + 1, day),
      key: `next-${day}`,
    });
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => date.toDateString() === today.toDateString();

  const monthYearKey = `${year}-${month}`;

  return (
    <div className="flex flex-col bg-white h-full rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/20">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("prev")}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <AnimatePresence mode="wait">
            <motion.h1
              key={monthYearKey}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="text-xl font-semibold text-foreground"
            >
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </motion.h1>
          </AnimatePresence>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("next")}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {taskTypes.find((t) => t.name === activeFilter)?.icon}
                <span>{taskTypes.find((t) => t.name === activeFilter)?.label}</span>
                <Badge variant="secondary" className="ml-1">
                  {taskCounts[activeFilter] || 0}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {taskTypes.map((type) => (
                <DropdownMenuItem
                  key={type.name}
                  onClick={() => onFilterChange(type.name)}
                  className={`gap-3 ${activeFilter === type.name ? "bg-accent" : ""}`}
                >
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: type.color }}
                  >
                    {type.icon}
                  </div>
                  <span className="flex-1">{type.label}</span>
                  <Badge variant="outline" className="text-xs">
                    {taskCounts[type.name] || 0}
                  </Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="default"
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2"
          >
            Today
          </Button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 border-b border-border/20">
        {daysOfWeekShort.map((day) => (
          <div key={day} className="p-2 text-center">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {day}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-hidden px-6 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={monthYearKey}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-7 auto-rows-[80px]"
          >
            {calendarDays.map((dayObj) => {
              const isTodayDate = isToday(dayObj.date);
              const dayTasks = getTasksForDate(dayObj.date);
              const displayTasks = dayTasks.slice(0, 4);
              const hasMoreTasks = dayTasks.length > 4;

              return (
                <div
                  key={dayObj.key}
                  className={`
                    border-r border-b border-border/20 p-2 cursor-pointer transition-all duration-200 
                    hover:bg-gray-50 flex flex-col justify-between overflow-hidden
                    ${!dayObj.isCurrentMonth ? "bg-gray-50/50" : "bg-white"}
                  `}
                  onClick={() => {
                    if (dayTasks.length > 0) onDateClick(dayObj.date);
                  }}
                >
                  {/* Day Number + More */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        isTodayDate
                          ? "bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs"
                          : !dayObj.isCurrentMonth
                            ? "text-muted-foreground/60"
                            : "text-foreground"
                      }`}
                    >
                      {dayObj.day}
                    </span>
                    {hasMoreTasks && (
                      <span className="text-[10px] text-muted-foreground font-medium">
                        +{dayTasks.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Task Dots */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {displayTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="w-2 h-2 rounded-full shadow-sm"
                        style={{ backgroundColor: getTaskTypeColor(task.type) }}
                        title={task.name}
                      />
                    ))}
                  </div>

                  {/* Task Preview */}
                  {displayTasks.length > 0 && (
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1 leading-tight">
                      {displayTasks[0].name}
                    </p>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Calendar;
