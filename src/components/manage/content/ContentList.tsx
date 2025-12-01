import React, { useEffect, useState } from "react";
import { useContentManager } from "@/libs/hooks/useContent";
import { useAppDispatch } from "@/libs/stores";
import { updateTaskState } from "@/libs/stores/taskManager/thunk";
import { manageContent } from "@/libs/services/manageContent";
import { toast } from "sonner";
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
  FileText,
  Video,
  Settings,
  Globe,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dialog } from "@/components/ui/dialog";
import { DeleteContentModal } from "@/components/modal/content/DeleteContentModal";
import { RequestApprovalModal } from "@/components/modal/content/RequestApprovalModal";
import ContentDetailModal from "./ContentDetailModal";
import TaskSelectionDialog from "./TaskSelectionDialog";
import type { Content } from "@/libs/types/content";
import type { Task } from "@/libs/types/task";

type ContentType = "blog" | "video";

interface ContentListProps {
  onCreateNew?: (contentType: ContentType, task?: Task) => void;
  onEdit?: (content: Content) => void;
  onView?: (content: Content) => void;
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
  } = useContentManager();

  const dispatch = useAppDispatch();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    keywords: "",
    status: "",
    actor: "",
  });

  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isTaskSelectionOpen, setIsTaskSelectionOpen] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>("blog");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);
  const [isDeletingContent, setIsDeletingContent] = useState(false);
  const [showRequestApprovalModal, setShowRequestApprovalModal] = useState(false);
  const [contentToSubmit, setContentToSubmit] = useState<Content | null>(null);
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);

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

  const handleDelete = (content: Content) => {
    setContentToDelete(content);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!contentToDelete || isDeletingContent) return;

    setIsDeletingContent(true);
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
    } finally {
      setIsDeletingContent(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setContentToDelete(null);
  };

  const handleViewContent = async (content: Content) => {
    setIsLoadingDetail(true);

    try {
      // Fetch detailed content from API first
      const response = await manageContent.contentDetail(content.id);
      const apiData = response.data.data;

      if (apiData) {
        // Use the API response directly as Content (not as array!)
        const detailedContent: Content = apiData;
        // Show modal only after we have the complete data
        setSelectedContent(detailedContent);
        setIsDetailModalOpen(true);
      } else {
        // Fallback: use the content passed to the function
        setSelectedContent(content);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching content detail:", error);
      setSelectedContent(content);
      setIsDetailModalOpen(true);
    } finally {
      setIsLoadingDetail(false);
    }

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
    if (!contentToSubmit || isSubmittingApproval) return;

    setIsSubmittingApproval(true);
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
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  const handleCancelRequestApproval = () => {
    setShowRequestApprovalModal(false);
    setContentToSubmit(null);
  };

  const handlePublish = async (content: Content) => {
    try {
      const publishResponse = await publishExistingContent(content.id);

      // Check if publishing was successful
      if (publishResponse.meta.requestStatus === "fulfilled") {
        // Update task state to DONE if content has a task_id
        if (content.task_id) {
          try {
            await dispatch(
              updateTaskState({
                taskId: content.task_id,
                state: "DONE",
              }),
            ).unwrap();
          } catch (taskError) {
            console.warn("Failed to update task state:", taskError);
            // Don't fail the entire operation if task update fails
          }
        }

        fetchContents(filters);
        toast.success(`Content "${content.title}" has been published successfully.`);
      }
    } catch (error) {
      console.error("Error publishing content:", error);
      toast.error(error instanceof Error ? error.message : "Failed to publish content");
    }
  };

  const handleCreateNewClick = (contentType: ContentType) => {
    setSelectedContentType(contentType);
    setIsTaskSelectionOpen(true);
  };

  const handleTaskSelect = (task: Task) => {
    setIsTaskSelectionOpen(false);
    onCreateNew?.(selectedContentType, task);
  };

  const handleTaskSelectionClose = () => {
    setIsTaskSelectionOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toUpperCase();
    switch (normalizedStatus) {
      case "APPROVED":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
            Approved
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100">
            Draft
          </Badge>
        );
      case "AWAIT_STAFF":
      case "PENDING":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
            Awaiting Review
          </Badge>
        );
      case "AWAIT_BRAND":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100">
            Awaiting Brand
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
            Rejected
          </Badge>
        );
      case "POSTED":
      case "PUBLISHED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
            Posted
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600">
            {status}
          </Badge>
        );
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
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="AWAIT_STAFF">Awaiting Review</SelectItem>
                <SelectItem value="AWAIT_BRAND">Awaiting Brand</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="POSTED">Posted</SelectItem>
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
              <Loader2 className="mx-auto mb-4 h-12 w-12 text-primary animate-spin" />
              <p className="text-gray-500">Loading contents</p>
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
                      <span className="text-gray-600">
                        {content.blog?.author?.username || "System"}
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600 text-sm">
                        {formatDateTime(content.updated_at)}
                      </span>
                    </div>

                    <div className="col-span-1 flex items-center">
                      <div className="flex items-center">
                        {content.blog ? (
                          <FileText className="w-4 h-4 mr-1 text-blue-500" />
                        ) : (
                          <Video className="w-4 h-4 mr-1 text-purple-500" />
                        )}
                        <span className="text-gray-600 capitalize">
                          {content.blog ? "blog" : "video"}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-1 flex items-center">
                      <div className="flex items-center">
                        {(() => {
                          // For video content, ensure channel is either facebook or tiktok
                          const contentType = content.blog ? "blog" : "video";
                          let channel = content.content_channels?.[0]?.channel_name || "website";
                          if (contentType === "video") {
                            // If it's a video and channel is not facebook or tiktok, default to facebook
                            if (!["facebook", "tiktok"].includes(channel.toLowerCase())) {
                              channel = "facebook";
                            }
                          }
                          const channelInfo = getChannelDisplay(channel, contentType);
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
                          <DropdownMenuItem
                            onClick={() => handleViewContent(content)}
                            disabled={isLoadingDetail}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {isLoadingDetail ? "Loading..." : "View"}
                          </DropdownMenuItem>
                          {/* Only show Edit for draft and rejected content */}
                          {(content.status === "DRAFT" || content.status === "REJECTED") && (
                            <DropdownMenuItem onClick={() => onEdit?.(content)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}

                          {content.status === "APPROVED" && (
                            <DropdownMenuItem
                              onClick={() => handlePublish(content)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Globe className="w-4 h-4 mr-2" />
                              Post content
                            </DropdownMenuItem>
                          )}
                          {/* Only show Delete for draft and rejected content */}
                          {(content.status === "DRAFT" || content.status === "REJECTED") && (
                            <DropdownMenuItem
                              onClick={() => handleDelete(content)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="col-span-1 flex items-center">
                      <div>{getStatusBadge(content.status)}</div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="flex justify-end p-4 border-t bg-gray-50">
              <Pagination className="w-auto mx-0 justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(pagination.page - 1)}
                      className={
                        !pagination.has_prev ? "pointer-events-none opacity-50" : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={pagination.page === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(pagination.page + 1)}
                      className={
                        !pagination.has_next ? "pointer-events-none opacity-50" : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

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
        onTaskSelect={handleTaskSelect}
      />

      {/* Delete Confirmation Modal */}
      <Dialog
        open={showDeleteModal}
        onOpenChange={(open) => {
          // Prevent closing modal while deleting
          if (!open && !isDeletingContent) {
            handleCancelDelete();
          }
        }}
      >
        <DeleteContentModal
          contentTitle={contentToDelete?.title || "content"}
          onConfirm={handleConfirmDelete}
          isLoading={isDeletingContent}
        />
      </Dialog>

      {/* Request Approval Confirmation Modal */}
      <Dialog
        open={showRequestApprovalModal}
        onOpenChange={(open) => {
          // Prevent closing modal while submitting
          if (!open && !isSubmittingApproval) {
            handleCancelRequestApproval();
          }
        }}
      >
        <RequestApprovalModal
          contentTitle={contentToSubmit?.title || "content"}
          onConfirm={handleConfirmRequestApproval}
          isLoading={isSubmittingApproval}
        />
      </Dialog>
    </div>
  );
};

export default ContentList;
