import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import tasksData from "@/pages/manager/content/tasks-data.json";

// Transform JSON data to match expected format
const beautyTasks = tasksData.beautyTasks.map((task) => ({
  ...task,
  date: new Date(task.date),
  items: task.items.map((item) => ({
    ...item,
    status: item.status as "to-do" | "in-progress" | "completed",
  })),
}));

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

interface CalendarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export function Calendar({ currentDate, setCurrentDate }: CalendarProps) {
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Get the last day of the previous month correctly
  const lastDayOfPrevMonth = new Date(year, month, 0);
  const daysInPrevMonth = lastDayOfPrevMonth.getDate();

  // Function to check if a date has tasks
  const hasTasksOnDate = (date: Date): boolean => {
    return beautyTasks.some((task) => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate() &&
        task.items.length > 0
      );
    });
  };

  const calendarDays = [];

  // Previous month days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day),
    });
  }

  // Next month days to fill the grid
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month + 1, day),
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

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === currentDate.toDateString();
  };

  const monthYearKey = `${year}-${month}`;

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <AnimatePresence mode="wait">
          <motion.span
            key={monthYearKey}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="font-medium text-foreground"
          >
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </motion.span>
        </AnimatePresence>
        <div className="flex flex-col">
          <Button
            variant="ghost"
            size="sm"
            className="h-4 p-0 hover:scale-125 transition-transform duration-200"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 p-0 hover:scale-125 transition-transform duration-200"
            onClick={() => navigateMonth("next")}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={monthYearKey}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-7 gap-1 place-items-center"
        >
          {calendarDays.map((dayObj) => {
            const isTodayDate = isToday(dayObj.date);
            const isSelectedDate = isSelected(dayObj.date);
            const hasTasks = hasTasksOnDate(dayObj.date);

            return (
              <div
                key={dayObj.date.getTime()}
                className={`
                  text-center cursor-pointer rounded-lg transition-all duration-10 ease-out relative h-10 w-10 mx-auto
                  flex flex-col items-center justify-center 
                  group
                  ${
                    isSelectedDate
                      ? "bg-primary text-primary-foreground font-medium shadow-md"
                      : isTodayDate
                        ? "bg-accent text-accent-foreground font-medium"
                        : !dayObj.isCurrentMonth
                          ? "text-muted-foreground"
                          : "text-foreground"
                  }
                `}
                onClick={() => setCurrentDate(dayObj.date)}
              >
                <span
                  className={`text-sm leading-none relative transition-all duration-300 ease-out group-hover:font-bold ${
                    isSelectedDate || isTodayDate ? "font-medium" : ""
                  }`}
                >
                  {dayObj.day}
                  {hasTasks && (
                    <div
                      className={`absolute left-1/2 transform -translate-x-1/2 bottom-[-2px] h-0.5 w-4 rounded-full transition-all duration-300 ${
                        isSelectedDate ? "bg-primary-foreground" : "bg-primary"
                      }`}
                    />
                  )}
                </span>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
