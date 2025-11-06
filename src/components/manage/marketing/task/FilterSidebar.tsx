import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBox,
  FaFileLines,
  FaCalendarDays,
  FaGlobe,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const taskTypes = [
  {
    name: "ALL",
    label: "All Tasks",
    color: "#6b7280",
    icon: <FaFilter className="h-4 w-4 text-white" />,
  },
  {
    name: "PRODUCT",
    label: "Product",
    color: "#f7c06d",
    icon: <FaBox className="h-4 w-4 text-white" />,
  },
  {
    name: "CONTENT",
    label: "Content",
    color: "#ff88fa",
    icon: <FaFileLines className="h-4 w-4 text-white" />,
  },
  {
    name: "EVENT",
    label: "Event",
    color: "#6ad1ff",
    icon: <FaCalendarDays className="h-4 w-4 text-white" />,
  },
  {
    name: "OTHER",
    label: "Other",
    color: "#9976ff",
    icon: <FaGlobe className="h-4 w-4 text-white" />,
  },
];

interface FilterSidebarProps {
  onFilterChange: (type: string) => void;
  activeFilter: string;
  taskCounts: Record<string, number>;
}

function FilterSidebar({ onFilterChange, activeFilter, taskCounts }: FilterSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? "60px" : "280px",
      }}
      transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
      className="bg-white border-r border-border/20 flex flex-col relative"
    >
      {/* Toggle Button */}
      <div className="absolute -right-3 top-6 z-10">
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0 rounded-full bg-white shadow-sm border border-border/40 hover:border-border"
        >
          {isCollapsed ? (
            <FaChevronRight className="h-3 w-3" />
          ) : (
            <FaChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col h-full">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Filters</h2>
                <p className="text-sm text-muted-foreground">Filter tasks by type</p>
              </div>

              <div className="space-y-2">
                {taskTypes.map((type, index) => (
                  <motion.div
                    key={type.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Button
                      variant={activeFilter === type.name ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 h-auto py-3 px-3 ${
                        activeFilter === type.name
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => onFilterChange(type.name)}
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: type.color }}
                      >
                        {type.icon}
                      </div>
                      <span className="font-medium flex-1 text-left">{type.label}</span>
                      {taskCounts[type.name] !== undefined && (
                        <Badge
                          variant={activeFilter === type.name ? "secondary" : "outline"}
                          className="text-xs px-2 py-0.5 h-auto"
                        >
                          {taskCounts[type.name]}
                        </Badge>
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {isCollapsed && (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 mt-4"
            >
              {taskTypes.map((type, index) => (
                <motion.div
                  key={type.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex justify-center"
                >
                  <Button
                    variant={activeFilter === type.name ? "default" : "ghost"}
                    size="sm"
                    className={`w-10 h-10 p-0 ${
                      activeFilter === type.name
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => onFilterChange(type.name)}
                    title={type.label}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center"
                      style={{ backgroundColor: type.color }}
                    >
                      {type.icon}
                    </div>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default FilterSidebar;
