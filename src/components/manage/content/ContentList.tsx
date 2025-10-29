import React, { useEffect, useState } from "react";
import { useContentManager } from "@/libs/hooks/useContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  FileText,
  Video,
  Settings,
  Globe,
  Check,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { DeleteContentModal } from "@/components/modal/content/DeleteContentModal";
import { RequestApprovalModal } from "@/components/modal/content/RequestApprovalModal";
import { RejectContentModal } from "@/components/modal/content/RejectContentModal";
import ContentDetailModal from "./ContentDetailModal";
import TaskSelectionDialog from "./TaskSelectionDialog";
import type { LegacyContent } from "@/libs/utils/contentConverter";

type ContentType = "blog" | "video";

interface ContentTask {
  id: number;
  title: string;
  type: "Blog" | "Video" | "Post";
  campaign: string;
  status: "to-do" | "in-progress" | "completed";
  details: {
    description: string;
    assignee: string;
    dueTime: string;
    priority: "High" | "Medium" | "Low";
  };
  color: string;
}

interface ContentListProps {
  onCreateNew?: (contentType: ContentType, task?: ContentTask) => void;
  onEdit?: (content: LegacyContent) => void;
  onView?: (content: LegacyContent) => void;
}

const ContentList: React.FC<ContentListProps> = ({ onCreateNew, onEdit, onView }) => {
  const {
    loading,
    contentList,
    pagination,
    error,
    fetchContents,
    removeContent,
    publishExistingContent,
    submitExistingContent,
    approveExistingContent,
    rejectExistingContent,
  } = useContentManager();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    keywords: "",
    status: "",
    actor: "",
  });

  const [selectedContent, setSelectedContent] = useState<LegacyContent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isTaskSelectionOpen, setIsTaskSelectionOpen] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>("blog");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<LegacyContent | null>(null);
  const [showRequestApprovalModal, setShowRequestApprovalModal] = useState(false);
  const [contentToSubmit, setContentToSubmit] = useState<LegacyContent | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [contentToReject, setContentToReject] = useState<LegacyContent | null>(null);

  useEffect(() => {
    fetchContents(filters);
  }, [filters, fetchContents]);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, keywords: value, page: 1 }));
  };

  const handleStatusFilter = (value: string) => {
    const statusValue = value === "all" ? "" : value;
    setFilters((prev) => ({ ...prev, status: statusValue, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleDelete = (content: LegacyContent) => {
    setContentToDelete(content);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!contentToDelete) return;

    try {
      const deleteResponse = await removeContent(contentToDelete.id);

      // Check if deletion was successful based on API response
      if (deleteResponse.meta.requestStatus === "fulfilled") {
        // Refresh content list only if successful
        fetchContents(filters);
      }

      // Always close modal and clear state
      setShowDeleteModal(false);
      setContentToDelete(null);
    } catch (error) {
      console.error("Error deleting content:", error);
      // Close modal and clear state
      setShowDeleteModal(false);
      setContentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setContentToDelete(null);
  };

  const handleToggleStatus = async (content: LegacyContent) => {
    if (content.status === "draft") {
      await publishExistingContent(content.id);
      fetchContents(filters);
    }
    // For other statuses, we might need different actions like approve/reject
    // This will be handled by specific buttons in the dropdown menu
  };

  const handleViewContent = (content: LegacyContent) => {
    setSelectedContent(content);
    setIsDetailModalOpen(true);
    // Also call the parent onView if provided
    onView?.(content);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedContent(null);
  };

  const handleRequestApproval = (contentId: string) => {
    // Find the content by ID and show confirmation modal
    const content = contentList.find((c) => c.id === contentId);
    if (content) {
      setContentToSubmit(content);
      setShowRequestApprovalModal(true);
    }
  };

  const handleConfirmRequestApproval = async () => {
    if (!contentToSubmit) return;

    try {
      const submitResponse = await submitExistingContent(contentToSubmit.id);

      // Check if submission was successful
      if (submitResponse.meta.requestStatus === "fulfilled") {
        fetchContents(filters);
      }

      // Always close modals and clear state
      setShowRequestApprovalModal(false);
      setContentToSubmit(null);
      handleCloseDetailModal();
    } catch (error) {
      console.error("Error submitting content for approval:", error);
      // Close modals and clear state on error
      setShowRequestApprovalModal(false);
      setContentToSubmit(null);
      handleCloseDetailModal();
    }
  };

  const handleCancelRequestApproval = () => {
    setShowRequestApprovalModal(false);
    setContentToSubmit(null);
  };

  const handleReject = (content: LegacyContent) => {
    setContentToReject(content);
    setShowRejectModal(true);
  };

  const handleConfirmReject = async (reason: string) => {
    if (!contentToReject) return;

    try {
      const rejectResponse = await rejectExistingContent(contentToReject.id, reason);

      // Check if rejection was successful
      if (rejectResponse.meta.requestStatus === "fulfilled") {
        fetchContents(filters);
      }

      // Always close modals and clear state
      setShowRejectModal(false);
      setContentToReject(null);
    } catch (error) {
      console.error("Error rejecting content:", error);
      // Close modals and clear state on error
      setShowRejectModal(false);
      setContentToReject(null);
    }
  };

  const handleCancelReject = () => {
    setShowRejectModal(false);
    setContentToReject(null);
  };

  const handleApprove = async (content: LegacyContent) => {
    try {
      const approveResponse = await approveExistingContent(content.id);

      // Check if approval was successful
      if (approveResponse.meta.requestStatus === "fulfilled") {
        fetchContents(filters);
      }
    } catch (error) {
      console.error("Error approving content:", error);
    }
  };

  const handleCreateNewClick = (contentType: ContentType) => {
    setSelectedContentType(contentType);
    setIsTaskSelectionOpen(true);
  };

  const handleTaskSelect = (task: any) => {
    // Accept either a LegacyTask (id as string) or ContentTask; normalize to ContentTask before forwarding.
    setIsTaskSelectionOpen(false);
    const normalizedTask: ContentTask = {
      id: typeof task?.id === "string" ? Number(task.id) : ((task?.id as number) ?? 0),
      title: task?.title ?? "",
      type: (task?.type as ContentTask["type"]) ?? "Blog",
      campaign: task?.campaign ?? "",
      status: (task?.status as ContentTask["status"]) ?? "to-do",
      details: {
        description: task?.details?.description ?? task?.description ?? "",
        assignee: task?.details?.assignee ?? task?.assignee ?? "",
        dueTime: task?.details?.dueTime ?? task?.dueTime ?? "",
        priority:
          (task?.details?.priority as ContentTask["details"]["priority"]) ??
          task?.priority ??
          "Medium",
      },
      color: task?.color ?? "#000000",
    };
    onCreateNew?.(selectedContentType, normalizedTask);
  };

  const handleTaskSelectionClose = () => {
    setIsTaskSelectionOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "posted":
        return <Badge className="bg-green-100 text-green-800">Posted</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getChannelDisplay = (channel: string, contentType?: string) => {
    switch (channel?.toLowerCase()) {
      case "facebook":
        return {
          name: "Facebook",
          icon: (
            <div className="w-4 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
              f
            </div>
          ),
          color: "text-blue-600",
        };
      case "tiktok":
        return {
          name: "TikTok",
          icon: (
            <div className="w-4 h-4 bg-black rounded text-white text-xs flex items-center justify-center font-bold">
              T
            </div>
          ),
          color: "text-black",
        };
      case "website":
      default:
        // For video content, default to Facebook if no valid channel is specified
        if (contentType === "video") {
          return {
            name: "Facebook",
            icon: (
              <div className="w-4 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                f
              </div>
            ),
            color: "text-blue-600",
          };
        }
        return {
          name: "Website",
          icon: <Globe className="w-4 h-4 text-green-600" />,
          color: "text-green-600",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recent contents</h2>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by title..."
                  value={filters.keywords}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filters.status || "all"} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="posted">Posted</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Create New Button */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#FF9DB0] hover:bg-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleCreateNewClick("blog")}>
              <FileText className="w-4 h-4 mr-2" />
              Create Blog
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreateNewClick("video")}>
              <Video className="w-4 h-4 mr-2" />
              Create Video
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading contents...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p>Error loading contents: {error}</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium text-sm text-gray-600">
                <div className="col-span-3">Title</div>
                <div className="col-span-2">Actor</div>
                <div className="col-span-2">Time Created</div>
                <div className="col-span-1">Views</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-1">Channel</div>
                <div className="col-span-1">Action</div>
                <div className="col-span-1">Status</div>
              </div>

              {/* Table Body */}
              {contentList.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No contents found</p>
                </div>
              ) : (
                contentList.map((content) => (
                  <div
                    key={content.id}
                    className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-3">
                      <h4 className="font-medium text-gray-900 truncate">{content.title}</h4>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">{content.actor}</span>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600 text-sm">
                        {formatDateTime(content.date_time)}
                      </span>
                    </div>

                    <div className="col-span-1 flex items-center">
                      <span className="text-gray-600">{content.views}</span>
                    </div>

                    <div className="col-span-1 flex items-center">
                      <div className="flex items-center">
                        {content.content_type === "video" ? (
                          <Video className="w-4 h-4 mr-1 text-purple-500" />
                        ) : (
                          <FileText className="w-4 h-4 mr-1 text-blue-500" />
                        )}
                        <span className="text-gray-600 capitalize">
                          {content.content_type || "blog"}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-1 flex items-center">
                      <div className="flex items-center">
                        {(() => {
                          // For video content, ensure channel is either facebook or tiktok
                          let channel = (content as any).channel || "website";
                          if (content.content_type === "video") {
                            // If it's a video and channel is not facebook or tiktok, default to facebook
                            if (!["facebook", "tiktok"].includes(channel.toLowerCase())) {
                              channel = "facebook";
                            }
                          }
                          const channelInfo = getChannelDisplay(channel, content.content_type);
                          return (
                            <>
                              <span className="mr-1">{channelInfo.icon}</span>
                              <span className={`text-sm ${channelInfo.color}`}>
                                {channelInfo.name}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="col-span-1 flex items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-8 w-8 hover:bg-gray-100"
                          >
                            <Settings className="w-4 h-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => handleViewContent(content)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit?.(content)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {content.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleApprove(content)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleReject(content)}
                                className="text-pink-600 hover:text-pink-700"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(content)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="col-span-1 flex items-center">
                      <div className="cursor-pointer" onClick={() => handleToggleStatus(content)}>
                        {getStatusBadge(content.status)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{" "}
            results
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.has_prev}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="px-3 py-1 text-sm">
              Page {pagination.page} of {pagination.total_pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.has_next}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Content Detail Modal */}
      <ContentDetailModal
        content={selectedContent}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onRequestApproval={handleRequestApproval}
      />

      {/* Task Selection Dialog */}
      <TaskSelectionDialog
        isOpen={isTaskSelectionOpen}
        onClose={handleTaskSelectionClose}
        contentType={selectedContentType}
        onTaskSelect={handleTaskSelect}
      />

      {/* Delete Confirmation Modal */}
      <Dialog
        open={showDeleteModal}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelDelete();
          }
        }}
      >
        <DeleteContentModal
          contentTitle={contentToDelete?.title || "content"}
          onConfirm={handleConfirmDelete}
        />
      </Dialog>

      {/* Request Approval Confirmation Modal */}
      <Dialog
        open={showRequestApprovalModal}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelRequestApproval();
          }
        }}
      >
        <RequestApprovalModal
          contentTitle={contentToSubmit?.title || "content"}
          onConfirm={handleConfirmRequestApproval}
        />
      </Dialog>

      {/* Reject Content Modal */}
      <Dialog
        open={showRejectModal}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelReject();
          }
        }}
      >
        <RejectContentModal
          contentTitle={contentToReject?.title || "content"}
          onConfirm={handleConfirmReject}
        />
      </Dialog>
    </div>
  );
};

export default ContentList;
