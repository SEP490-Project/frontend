"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch } from "@/libs/stores";
import { useParams } from "react-router-dom";
import { getTaskList, assignTask } from "@/libs/stores/taskManager/thunk";
import { getAllUsersThunk } from "@/libs/stores/userManager/thunk";
import { useTaskMarketing } from "@/libs/hooks/useTaskMarketing";
import { useCampaign } from "@/libs/hooks/useCampaign";
import { useUserManager } from "@/libs/hooks/useUserManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DataSelector from "@/components/global/DataSelector";
import { Loader2 } from "lucide-react";
import {
  FaCalendarDays,
  FaBox,
  FaFileLines,
  FaGlobe,
  FaClock,
  FaCalendarCheck,
} from "react-icons/fa6";
import { motion } from "framer-motion";
import TaskCalendar from "@/components/manage/marketing/task/Calendar";
import { formatDate } from "@/libs/helper/helper";
import type { TaskListMarketing } from "@/libs/types/task";

interface ScheduleProps {
  campaignId?: string;
}

const Schedule: React.FC<ScheduleProps> = ({ campaignId }) => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const currentCampaignId = campaignId || id;

  const { taskListMarketing, loading: tasksLoading } = useTaskMarketing();
  const { campaignDetail } = useCampaign();
  const { users, loading: usersLoading, pagination: usersPagination } = useUserManager();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [showModal, setShowModal] = useState(false);

  const [selectedTask, setSelectedTask] = useState<TaskListMarketing | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");

  // User management state
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [currentTaskType, setCurrentTaskType] = useState<string>("");

  useEffect(() => {
    if (currentCampaignId) {
      dispatch(
        getTaskList({
          page: 1,
          limit: 100,
          campaign_id: currentCampaignId,
        }),
      );
    }
  }, [dispatch, currentCampaignId]);

  // Get roles for task type as comma-separated string
  const getRolesForTaskType = useCallback((taskType: string): string => {
    switch (taskType) {
      case "CONTENT":
        return "CONTENT_STAFF";
      case "PRODUCT":
        return "SALES_STAFF";
      case "OTHER":
      case "EVENT":
        return "MARKETING_STAFF,CONTENT_STAFF,SALES_STAFF";
      default:
        return "MARKETING_STAFF,CONTENT_STAFF,SALES_STAFF";
    }
  }, []);

  // Load users with role filter when task type changes
  useEffect(() => {
    if (currentTaskType) {
      const roles = getRolesForTaskType(currentTaskType);
      setUserPage(1); // Reset page
      dispatch(
        getAllUsersThunk({
          page: 1,
          limit: 10,
          role: roles,
          is_active: true,
          ...(userSearch ? { search: userSearch } : {}),
        }),
      );
    }
  }, [dispatch, currentTaskType, userSearch, getRolesForTaskType]);

  // Load more users for pagination
  useEffect(() => {
    if (currentTaskType && userPage > 1) {
      const roles = getRolesForTaskType(currentTaskType);
      dispatch(
        getAllUsersThunk({
          page: userPage,
          limit: 10,
          role: roles,
          is_active: true,
          ...(userSearch ? { search: userSearch } : {}),
        }),
      );
    }
  }, [dispatch, userPage, currentTaskType, userSearch, getRolesForTaskType]);

  const loadMoreUsers = useCallback(() => {
    if (usersPagination?.has_next && !usersLoading) {
      setUserPage((p) => p + 1);
    }
  }, [usersPagination?.has_next, usersLoading]);

  const handleDateClick = (date: Date) => {
    const tasksForDate = getTasksForDate(date);
    if (tasksForDate.length > 0) {
      setSelectedDate(date);
      setShowModal(true);
    }
  };

  const handleOpenTaskDetail = (task: TaskListMarketing) => {
    setSelectedTask(task);
    setCurrentTaskType(task.type);
    setSelectedUser("");
    setShowTaskDetail(true);
  };

  const handleAssign = async () => {
    if (selectedTask && selectedUser) {
      try {
        await dispatch(
          assignTask({
            task_id: selectedTask.id,
            user_id: selectedUser,
          }),
        );

        // Reload task list to get updated assignment
        if (currentCampaignId) {
          dispatch(
            getTaskList({
              page: 1,
              limit: 100,
              campaign_id: currentCampaignId,
            }),
          );
        }

        setShowTaskDetail(false);
        setSelectedUser("");
        setCurrentTaskType("");
      } catch (error) {
        console.error("Failed to assign task:", error);
      }
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "EVENT":
        return <FaCalendarCheck className="h-4 w-4 text-white" />;
      case "PRODUCT":
        return <FaBox className="h-4 w-4 text-white" />;
      case "CONTENT":
        return <FaFileLines className="h-4 w-4 text-white" />;
      case "OTHER":
        return <FaGlobe className="h-4 w-4 text-white" />;
      default:
        return <div className="w-2 h-2 bg-white rounded-full" />;
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case "EVENT":
        return "#4ade80"; // xanh lá
      case "PRODUCT":
        return "#f7c06d";
      case "CONTENT":
        return "#ff88fa";
      case "OTHER":
        return "#9976ff";
      default:
        return "#e5e7eb";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "DOING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DONE":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTasksForDate = (date: Date): TaskListMarketing[] => {
    return (
      taskListMarketing?.filter((task) => {
        const taskDate = new Date(task.deadline);
        return (
          taskDate.getFullYear() === date.getFullYear() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getDate() === date.getDate()
        );
      }) || []
    );
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (tasksLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaCalendarDays className="h-5 w-5 text-purple-600" />
              Campaign Timeline & Tasks
            </CardTitle>
            <p className="text-sm text-gray-600">
              View and manage milestone tasks throughout the campaign
            </p>
          </CardHeader>
          <CardContent>
            <TaskCalendar
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              tasks={taskListMarketing || []}
              onDateClick={handleDateClick}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              taskCounts={{}}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Tasks by Date Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            Tasks for {selectedDate ? formatDate(selectedDate) : ""}
          </h3>

          {selectedDate && getTasksForDate(selectedDate).length > 0 ? (
            <div className="space-y-3">
              {getTasksForDate(selectedDate).map((task) => (
                <Card
                  key={task.id}
                  onClick={() => handleOpenTaskDetail(task)}
                  className="cursor-pointer border-l-4 hover:shadow-md transition"
                  style={{ borderLeftColor: getTaskColor(task.type) }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: getTaskColor(task.type) }}
                        >
                          {getTaskIcon(task.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-gray-900">{task.name}</h4>
                            <Badge className={getStatusBadgeColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>

                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <FaClock className="h-4 w-4" />
                              <span>Due: {formatDate(new Date(task.deadline))}</span>
                            </div>
                            {task.assigned_to_name && (
                              <div className="flex items-center space-x-2">
                                <span>Assigned to: {task.assigned_to_name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No tasks found for this date</div>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Detail Modal */}
      <Dialog open={showTaskDetail} onOpenChange={setShowTaskDetail}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedTask.name}</h3>
                <p className="text-sm text-gray-600">{selectedTask.type}</p>
              </div>

              <div className="text-sm space-y-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <FaClock className="h-4 w-4" />
                  <span>Deadline: {formatDate(new Date(selectedTask.deadline))}</span>
                </div>
                <div>
                  <span>Status: </span>
                  <Badge className={getStatusBadgeColor(selectedTask.status)}>
                    {selectedTask.status}
                  </Badge>
                </div>
              </div>

              {/* Chỉ hiển thị phần assign nếu campaign đang RUNNING và task chưa có assigned_to_id */}
              {campaignDetail?.status === "RUNNING" && !selectedTask.assigned_to_id && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assign to:</label>
                  <DataSelector
                    data={users}
                    selectedId={selectedUser}
                    onSelect={(userId) => setSelectedUser(userId || "")}
                    renderItem={(user) => (
                      <div className="flex items-center gap-3 p-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{user.full_name}</div>
                          <div className="text-xs text-gray-500">{user.role}</div>
                        </div>
                      </div>
                    )}
                    getLabel={(user) => user.full_name || "Unknown User"}
                    title="Staff Members"
                    placeholder="Search and select staff member..."
                    onSearch={setUserSearch}
                    searchValue={userSearch}
                    onScrollEnd={loadMoreUsers}
                    loading={usersLoading}
                  />
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleAssign} disabled={!selectedUser}>
                      Assign Task
                    </Button>
                  </div>
                </div>
              )}

              {(campaignDetail?.status !== "RUNNING" || selectedTask.assigned_to_id) && (
                <div className="border-t pt-4 text-sm text-gray-600">
                  {selectedTask.assigned_to_name ? (
                    <p>
                      Assigned to:{" "}
                      <span className="font-medium text-gray-900">
                        {selectedTask.assigned_to_name}
                      </span>
                    </p>
                  ) : (
                    <p>No assigned staff.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
