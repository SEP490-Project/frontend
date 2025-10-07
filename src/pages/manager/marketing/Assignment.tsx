import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

// --- Mock Data ---
const contracts = [
  {
    id: "c1",
    name: "GlowSkin 2025",
    status: "ACTIVE",
    logo: "/logos/glowskin.png",
    campaigns: [
      {
        id: "camp1",
        name: "Facebook Ads Q1",
        milestones: [
          {
            id: "m1",
            title: "Kickoff",
            due: "2025-01-10",
            progress: 100,
            tasks: [
              {
                id: "t1",
                title: "Briefing",
                status: "Done",
                priority: "High",
                assignees: [
                  { id: "u1", name: "Alice", avatar: "/avatars/alice.png", role: "Manager" },
                ],
                due: "2025-01-09",
              },
            ],
          },
          {
            id: "m2",
            title: "Content Creation",
            due: "2025-01-20",
            progress: 60,
            tasks: [
              {
                id: "t2",
                title: "Write Ad Copy",
                status: "In Progress",
                priority: "Medium",
                assignees: [
                  { id: "u2", name: "Bob", avatar: "/avatars/bob.png", role: "Copywriter" },
                ],
                due: "2025-01-18",
              },
              {
                id: "t3",
                title: "Design Banner",
                status: "To Do",
                priority: "High",
                assignees: [],
                due: "2025-01-19",
              },
            ],
          },
        ],
      },
    ],
  },
  // ...more contracts
];

const statusColors: Record<string, string> = {
  "To Do": "bg-gray-200 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Done: "bg-green-100 text-green-700",
  Blocked: "bg-red-100 text-red-700",
  ACTIVE: "bg-green-100 text-green-700",
  EXPIRED: "bg-gray-100 text-gray-500",
};

const priorityColors: Record<string, string> = {
  Low: "bg-gray-100 text-gray-500",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

// --- Sidebar: Contract List ---
function Sidebar({ contracts, selectedContractId, onSelect, collapsed, setCollapsed }: any) {
  return (
    <aside
      className={`bg-white border-r flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-72"
      }`}
      style={{ minHeight: "100vh" }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        {!collapsed && <span className="font-semibold text-lg">Contracts</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((v: boolean) => !v)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {contracts.map((c: any) => (
          <div
            key={c.id}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-indigo-50 transition ${
              selectedContractId === c.id && "bg-indigo-100"
            }`}
            onClick={() => onSelect(c.id)}
          >
            <img src={c.logo} alt={c.name} className="h-8 w-8 rounded-lg object-cover border" />
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{c.name}</div>
                  <Badge className={`text-xs mt-1 ${statusColors[c.status]}`}>
                    {c.status === "ACTIVE" ? "Active" : "Expired"}
                  </Badge>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

// --- Calendar Header (reuse from AssignedTasks) ---
function CalendarHeader({
  currentDate,
  setCurrentDate,
}: {
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
}) {
  const goToToday = () => setCurrentDate(new Date());
  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") newDate.setDate(newDate.getDate() - 7);
    else newDate.setDate(newDate.getDate() + 7);
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
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="bg-white border-[#dadada] text-[#1c1b1f] hover:bg-[#f8f9fa] transition-all duration-200 hover:scale-105"
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
    </div>
  );
}

// --- Main Content ---
const AssignmentPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(contracts[0]?.id);
  const [currentDate, setCurrentDate] = useState(new Date());

  const selectedContract = contracts.find((c) => c.id === selectedContractId);
  const campaign = selectedContract?.campaigns[0];
  const milestones = campaign?.milestones || [];

  // Flatten all tasks for the calendar
  const allTasks = milestones.flatMap((m: any) =>
    m.tasks.map((t: any) => ({ ...t, milestone: m.title })),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50"
    >
      {/* Sidebar */}
      <Sidebar
        contracts={contracts}
        selectedContractId={selectedContractId}
        onSelect={setSelectedContractId}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 p-8"
      >
        {/* Top Bar: Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Input
            className="w-56"
            placeholder="Search tasks..."
            prefix={<Search className="h-4 w-4 text-gray-400" />}
          />
          <Button variant="outline" size="sm">
            <Filter className="mr-1" /> Filter
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="mr-1" /> New Task
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="mr-1" /> New Milestone
          </Button>
        </div>

        {/* Calendar Header */}
        <CalendarHeader currentDate={currentDate} setCurrentDate={setCurrentDate} />

        {/* Calendar View */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="transition-all duration-300 ease-in-out"
        >
          <div className="bg-white rounded-xl shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allTasks.map((t: any) => (
                <div
                  key={t.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg shadow-sm ${
                    t.status === "Done"
                      ? "bg-green-50"
                      : t.status === "Blocked"
                        ? "bg-red-50"
                        : "bg-indigo-50"
                  }`}
                >
                  <span className="font-medium">{t.title}</span>
                  <Badge className={`text-xs ${statusColors[t.status]}`}>{t.status}</Badge>
                  <Badge className={`text-xs ${priorityColors[t.priority]}`}>{t.priority}</Badge>
                  <div className="flex -space-x-2">
                    {t.assignees.map((u: any) => (
                      <Avatar key={u.id} className="h-6 w-6 border-2 border-white">
                        <AvatarImage src={u.avatar} />
                        <AvatarFallback>{u.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{t.due}</span>
                  <span className="text-xs text-gray-400">({t.milestone})</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              * Drag & drop and overdue highlight: demo only
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AssignmentPage;
