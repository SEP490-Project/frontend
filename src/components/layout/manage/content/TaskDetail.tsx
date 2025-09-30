"use client";

import { motion } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  FileText,
  Target,
  DollarSign,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { beautyTasks } from "./TasksList";

// Extended task data with contract and campaign information
const taskContractData = {
  1: {
    contract: {
      id: "CNT-2025-001",
      clientName: "Beauty Essentials Co.",
      contractValue: "$45,000",
      startDate: "2025-09-01",
      endDate: "2025-12-31",
      status: "Active",
    },
    campaign: {
      name: "Autumn Glow Campaign",
      objective: "Promote fall skincare products and increase brand awareness",
      budget: "$25,000",
      timeline: "Sep 2025 - Nov 2025",
      targetAudience: "Women 25-45 interested in skincare",
    },
    milestones: [
      { id: 1, name: "Content Strategy Development", status: "completed", dueDate: "2025-09-15" },
      { id: 2, name: "Fall Skincare Blog Series", status: "in-progress", dueDate: "2025-10-30" },
      { id: 3, name: "Social Media Campaign Launch", status: "pending", dueDate: "2025-11-01" },
      { id: 4, name: "Performance Analysis & Report", status: "pending", dueDate: "2025-11-30" },
    ],
  },
  2: {
    contract: {
      id: "CNT-2025-002",
      clientName: "Glamour Studios",
      contractValue: "$32,000",
      startDate: "2025-08-15",
      endDate: "2025-11-15",
      status: "Active",
    },
    campaign: {
      name: "Autumn Glow Campaign",
      objective: "Create engaging video content for makeup tutorials",
      budget: "$18,000",
      timeline: "Aug 2025 - Nov 2025",
      targetAudience: "Beauty enthusiasts and makeup beginners",
    },
    milestones: [
      { id: 1, name: "Video Concept Development", status: "completed", dueDate: "2025-08-30" },
      { id: 2, name: "Makeup Tutorial Production", status: "in-progress", dueDate: "2025-10-15" },
      { id: 3, name: "Post-Production & Editing", status: "pending", dueDate: "2025-10-30" },
      { id: 4, name: "Campaign Distribution", status: "pending", dueDate: "2025-11-10" },
    ],
  },
  3: {
    contract: {
      id: "CNT-2025-003",
      clientName: "Spooky Beauty Inc.",
      contractValue: "$28,500",
      startDate: "2025-09-01",
      endDate: "2025-10-31",
      status: "Active",
    },
    campaign: {
      name: "Spooky Beauty Series",
      objective: "Halloween-themed beauty content and product promotion",
      budget: "$15,000",
      timeline: "Sep 2025 - Oct 2025",
      targetAudience: "Young adults interested in seasonal beauty trends",
    },
    milestones: [
      { id: 1, name: "Halloween Content Planning", status: "completed", dueDate: "2025-09-10" },
      { id: 2, name: "Spooky Makeup Tutorials", status: "in-progress", dueDate: "2025-10-15" },
      {
        id: 3,
        name: "Halloween Beauty Tips Campaign",
        status: "in-progress",
        dueDate: "2025-10-25",
      },
      { id: 4, name: "Campaign Wrap-up & Analysis", status: "pending", dueDate: "2025-10-31" },
    ],
  },
};

interface TaskDetailProps {
  taskId: number | null;
  onClose: () => void;
  isVisible: boolean;
}

export function TaskDetail({ taskId, onClose, isVisible }: TaskDetailProps) {
  if (!taskId || !isVisible) return null;

  // Find the task details with proper typing
  let task: any = null;
  for (const taskGroup of beautyTasks) {
    const foundTask = taskGroup.items.find((item) => item.id === taskId);
    if (foundTask) {
      task = foundTask;
      break;
    }
  }

  if (!task) return null;

  const contractData = taskContractData[taskId as keyof typeof taskContractData];
  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500 text-white shadow-red-500/25";
      case "Medium":
        return "bg-amber-500 text-white shadow-amber-500/25";
      case "Low":
        return "bg-gray-500 text-white shadow-gray-500/25";
      default:
        return "bg-gray-500 text-white shadow-gray-500/25";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      className="w-full bg-white overflow-y-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.1 }}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
            style={{ backgroundColor: task.color }}
          >
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {task.type} Content
            </p>
          </div>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="hover:bg-gray-100 rounded-full p-2"
        >
          <X className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Content */}
      <div className="px-6 py-6 space-y-8">
        {/* Task Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            Task Overview
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">{task.details.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <User className="h-4 w-4" />
                  Assignee
                </div>
                <p className="font-semibold text-gray-900">{task.details.assignee}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Clock className="h-4 w-4" />
                  Due Time
                </div>
                <p className="font-semibold text-gray-900">{task.details.dueTime}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  Priority
                </div>
                <span
                  className={`inline-flex px-3 py-1 rounded-lg text-sm font-semibold ${getPriorityColor(task.details.priority)}`}
                >
                  {task.details.priority}
                </span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <FileText className="h-4 w-4" />
                  Type
                </div>
                <p className="font-semibold text-gray-900">{task.type}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contract Information */}
        {contractData && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-200 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Contract Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Contract ID</p>
                <p className="font-semibold text-gray-900">{contractData.contract.id}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Client</p>
                <p className="font-semibold text-gray-900">{contractData.contract.clientName}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Contract Value</p>
                <p className="font-semibold text-green-600 text-lg">
                  {contractData.contract.contractValue}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Start Date</p>
                <p className="font-semibold text-gray-900">{contractData.contract.startDate}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">End Date</p>
                <p className="font-semibold text-gray-900">{contractData.contract.endDate}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  {contractData.contract.status}
                </span>
              </div>
            </div>
          </motion.section>
        )}

        {/* Campaign Information */}
        {contractData && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-200 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Campaign Details
            </h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {contractData.campaign.name}
                </h3>
                <p className="text-gray-700 mb-3">{contractData.campaign.objective}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Budget</p>
                    <p className="font-semibold text-purple-600">{contractData.campaign.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Timeline</p>
                    <p className="font-semibold text-gray-900">{contractData.campaign.timeline}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Target Audience</p>
                    <p className="font-semibold text-gray-900">
                      {contractData.campaign.targetAudience}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Campaign Milestones */}
        {contractData && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-200 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Campaign Milestones
            </h2>
            <div className="space-y-3">
              {contractData.milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="bg-white p-4 rounded-lg border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                      {milestone.id}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{milestone.name}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {milestone.dueDate}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getMilestoneStatusColor(milestone.status)}`}
                  >
                    {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
}
