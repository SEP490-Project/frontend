"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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

  const prevMonth = new Date(year, month - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#ffffff] rounded-lg border border-[#dadada] p-4"
    >
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={monthYearKey}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="font-medium text-[#1c1b1f]"
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
      </motion.div>

      <motion.div
        className="grid grid-cols-7 gap-1 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {daysOfWeek.map((day, index) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.02 }}
            className="text-center text-sm font-medium text-[#515663] py-1"
          >
            {day}
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={monthYearKey}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-7 gap-1"
        >
          {calendarDays.map((dayObj, index) => {
            const isTodayDate = isToday(dayObj.date);
            const isSelectedDate = isSelected(dayObj.date);

            return (
              <motion.div
                key={`${dayObj.date.getTime()}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  text-center py-2 text-sm cursor-pointer rounded transition-all duration-200
                  ${
                    isSelectedDate
                      ? "bg-[#6366f1] text-white font-medium shadow-md"
                      : isTodayDate
                        ? "bg-[#accfff] text-[#1c1b1f] font-medium"
                        : !dayObj.isCurrentMonth
                          ? "text-[#8c96ab] hover:bg-[#f0f0f0]"
                          : "text-[#1c1b1f] hover:bg-[#f5f5f5]"
                  }
                `}
                onClick={() => setCurrentDate(dayObj.date)}
              >
                {dayObj.day}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
