import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { DataSelector } from "@/components/global";
import type { TaskListMarketing } from "@/libs/types/task";
import type { ContractBase } from "@/libs/types/contract";

const daysOfWeekShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const taskTypes = [
  { name: "ALL", label: "All Tasks", color: "#6b7280" },
  { name: "PRODUCT", label: "Product", color: "#f7c06d" },
  { name: "CONTENT", label: "Content", color: "#ff88fa" },
  { name: "EVENT", label: "Event", color: "#6ad1ff" },
  { name: "OTHER", label: "Other", color: "#9976ff" },
];

const ContractItem = ({ contract }: { contract: ContractBase }) => (
  <div className="flex items-center justify-between w-full p-2">
    <span className="font-medium">{contract.title}</span>
    <Badge variant="secondary" className="capitalize">
      {contract.type.toLowerCase().replace("_", " ")}
    </Badge>
  </div>
);

interface CalendarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  tasks: TaskListMarketing[];
  onDateClick: (date: Date) => void;
  activeFilter: string;
  onFilterChange: (type: string) => void;
  taskCounts: Record<string, number>;
  contracts: ContractBase[];
  selectedContract: ContractBase | null;
  onContractSelect: (contract: ContractBase | null) => void;
  contractSearch: string;
  onContractSearch: (search: string) => void;
  contractLoading: boolean;
  onContractLoadMore?: () => void;
  taskLoading?: boolean;
}

function Calendar({
  currentDate,
  setCurrentDate,
  tasks,
  onDateClick,
  activeFilter,
  onFilterChange,
  contracts,
  selectedContract,
  onContractSelect,
  contractSearch,
  onContractSearch,
  contractLoading,
  onContractLoadMore,
  taskLoading = false,
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

  const isToday = (date: Date) => date.toDateString() === today.toDateString();

  const getTasksForDate = (date: Date) =>
    tasks.filter((task) => {
      const d = new Date(task.deadline);
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
    });

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

  const calendarDays: {
    day: number;
    isCurrentMonth: boolean;
    date: Date;
    key: string;
  }[] = [];

  // Previous month
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
      key: `prev-${daysInPrevMonth - i}`,
    });
  }

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day),
      key: `current-${day}`,
    });
  }

  // Next month
  const remaining = 42 - calendarDays.length;
  for (let day = 1; day <= remaining; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month + 1, day),
      key: `next-${day}`,
    });
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(direction === "prev" ? newDate.getMonth() - 1 : newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const monthYearKey = `${year}-${month}`;

  return (
    <div className="flex flex-col bg-white h-full rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
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
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="text-xl font-semibold min-w-[200px] text-center"
              >
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
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

          {/* Task Type Filter */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {taskTypes.map((type) => {
              const isActive = activeFilter === type.name;

              return (
                <Button
                  key={type.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => onFilterChange(type.name)}
                  className={`
                    h-7 px-3 text-xs font-medium transition-all
                    ${
                      isActive
                        ? "bg-white text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-gray-200 hover:text-foreground"
                    }
                  `}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full mr-2"
                    style={{ backgroundColor: type.color }}
                  />
                  {type.name}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-64">
            <DataSelector
              data={contracts}
              selectedId={selectedContract?.id || null}
              onSelect={(id) => onContractSelect(contracts.find((c) => c.id === id) || null)}
              renderItem={(c) => <ContractItem contract={c} />}
              getLabel={(c) => c.title}
              title="Contracts"
              placeholder={selectedContract ? selectedContract.title : "All Contracts"}
              onSearch={onContractSearch}
              searchValue={contractSearch}
              onScrollEnd={onContractLoadMore}
              loading={contractLoading}
            />
          </div>

          <Button onClick={() => setCurrentDate(new Date())}>Today</Button>
        </div>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 border-b border-border/20">
        {daysOfWeekShort.map((d) => (
          <div key={d} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-hidden px-6 py-4">
        <motion.div
          animate={{ opacity: taskLoading ? 0.5 : 1 }}
          transition={{ duration: 0.2 }}
          className={`grid grid-cols-7 auto-rows-[80px] ${
            taskLoading ? "pointer-events-none select-none" : ""
          }`}
        >
          {calendarDays.map((dayObj) => {
            const dayTasks = getTasksForDate(dayObj.date);
            const displayTasks = dayTasks.slice(0, 4);

            return (
              <div
                key={dayObj.key}
                onClick={() => dayTasks.length > 0 && onDateClick(dayObj.date)}
                className={`
                  border-r border-b border-border/20 p-2 cursor-pointer
                  hover:bg-gray-50 flex flex-col justify-between
                  ${!dayObj.isCurrentMonth ? "bg-gray-50/50" : "bg-white"}
                `}
              >
                <span
                  className={`text-sm font-medium ${
                    isToday(dayObj.date)
                      ? "bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      : !dayObj.isCurrentMonth
                        ? "text-muted-foreground/60"
                        : "text-foreground"
                  }`}
                >
                  {dayObj.day}
                </span>

                <div className="flex gap-1 mt-1">
                  {displayTasks.map((task) => (
                    <div
                      key={task.id}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getTaskTypeColor(task.type) }}
                    />
                  ))}
                </div>

                {displayTasks[0] && (
                  <p className="text-[10px] text-muted-foreground line-clamp-1">
                    {displayTasks[0].name}
                  </p>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

export default Calendar;
