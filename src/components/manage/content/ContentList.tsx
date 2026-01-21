import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContent } from "@/libs/hooks/useContent";
import { useAppDispatch } from "@/libs/stores";
import {
  contents,
  deleteContent,
  publishContent,
  submitContent,
} from "@/libs/stores/contentManager/thunk";
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
  Clock,
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
import { ScheduleContentModal } from "@/components/modal/content/ScheduleContentModal";
import {
  ContentCreationModal,
  type ContentType as CreationContentType,
} from "@/components/modal/content/ContentCreationModal";
import type { Content } from "@/libs/types/content";
import type { Task } from "@/libs/types/task";

type ContentType = "blog" | "video";

interface ContentListProps {
  onCreateNew?: (contentType: ContentType, task?: Task) => void;
  onEdit?: (content: Content) => void;
  onView?: (content: Content) => void;
}

const ContentList: React.FC<ContentListProps> = ({ onCreateNew, onEdit, onView }) => {
  const navigate = useNavigate();
  const { loading, contents: contentList, pagination, error } = useContent();

  const dispatch = useAppDispatch();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    keywords: "",
    status: "",
    actor: "",
  });

  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);
  const [isDeletingContent, setIsDeletingContent] = useState(false);
  const [showRequestApprovalModal, setShowRequestApprovalModal] = useState(false);
  const [contentToSubmit, setContentToSubmit] = useState<Content | null>(null);
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [contentToSchedule, setContentToSchedule] = useState<Content | null>(null);

  const handleSchedule = (content: Content) => {
    setContentToSchedule(content);
    setShowScheduleModal(true);
  };

  useEffect(() => {
    dispatch(contents(filters));
  }, [filters, dispatch]);

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
      const deleteResponse = await dispatch(deleteContent(contentToDelete.id));

      // Check if deletion was successful based on API response
      if (deleteResponse.meta.requestStatus === "fulfilled") {
        // Refresh content list only if successful
        dispatch(contents(filters));
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

  const handleViewContent = (content: Content) => {
    navigate(`/manage/content/all-contents/${content.id}`);
    onView?.(content);
  };

  const handleEditContent = async (content: Content) => {
    setIsLoadingEdit(true);

    try {
      const response = await manageContent.contentDetail(content.id);
      const apiData = response.data.data;
      if (apiData) {
        onEdit?.(apiData);
      } else {
        onEdit?.(content);
      }
    } catch (error) {
      console.error("Error fetching content detail for edit:", error);
      onEdit?.(content);
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const handleConfirmRequestApproval = async () => {
    if (!contentToSubmit || isSubmittingApproval) return;

    setIsSubmittingApproval(true);
    try {
      const submitResponse = await dispatch(submitContent(contentToSubmit.id));

      // Check if submission was successful
      if (submitResponse.meta.requestStatus === "fulfilled") {
        dispatch(contents(filters));
      }

      // Always close modals and clear state
      setShowRequestApprovalModal(false);
      setContentToSubmit(null);
    } catch (error) {
      console.error("Error submitting content for approval:", error);
      // Close modals and clear state on error
      setShowRequestApprovalModal(false);
      setContentToSubmit(null);
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
      await dispatch(publishContent({ id: content.id })).unwrap();
      /* if (content.task_id) {
        try {
          const maxAttempts = 10;
          const pollInterval = 1500;
          let isPosted = false;

          for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await new Promise((resolve) => setTimeout(resolve, pollInterval));
            const response = await manageContent.contentDetail(content.id);
            const latestContent = response.data.data;

            if (latestContent?.status === "POSTED") {
              isPosted = true;
              break;
            }
          }

          if (isPosted) {
            await dispatch(
              updateTaskState({
                taskId: content.task_id,
                state: "DONE",
              }),
            ).unwrap();
          } else {
            console.warn("Content was not confirmed as posted after polling, skipping task update");
          }
        } catch (taskError) {
          console.warn("Failed to update task state:", taskError);
        }
      } */

      dispatch(contents(filters));
      toast.success(`Content "${content.title}" has been published successfully.`);
    } catch (error) {
      console.error("Error publishing content:", error);
      toast.error(error instanceof Error ? error.message : "Failed to publish content");
    }
  };

  const handleOpenCreationModal = () => {
    setIsCreationModalOpen(true);
  };

  const handleCreationConfirm = (contentType: CreationContentType, task?: Task) => {
    setIsCreationModalOpen(false);
    onCreateNew?.(contentType, task);
  };

  const handleCreationModalClose = () => {
    setIsCreationModalOpen(false);
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

        {/* Create New Button */}
        <div className="flex justify-end">
          <Button className="bg-[#FF9DB0] hover:bg-pink-600" onClick={handleOpenCreationModal}>
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </div>
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
                        {/* {content.blog?.author?.username || "System"} */}
                        {content.type === "BLOG"
                          ? content.blog?.author?.username || "System"
                          : content.created_by?.username || "System"}
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
                          <DropdownMenuItem onClick={() => handleViewContent(content)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          {/* Only show Edit for draft and rejected content */}
                          {(content.status === "DRAFT" || content.status === "REJECTED") && (
                            <DropdownMenuItem
                              onClick={() => handleEditContent(content)}
                              disabled={isLoadingEdit}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              {isLoadingEdit ? "Loading..." : "Edit"}
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
                          {content.status === "APPROVED" &&
                            content.content_channels?.length > 0 && (
                              <DropdownMenuItem
                                onClick={() => handleSchedule(content)}
                                className="text-purple-600 hover:text-purple-700"
                              >
                                <Clock className="w-4 h-4 mr-2" />
                                Schedule publishing
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

      {/* Content Creation Modal */}
      <ContentCreationModal
        isOpen={isCreationModalOpen}
        onClose={handleCreationModalClose}
        onConfirm={handleCreationConfirm}
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

      {/* Schedule Content Modal */}
      <Dialog
        open={showScheduleModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowScheduleModal(false);
            setContentToSchedule(null);
          }
        }}
      >
        {contentToSchedule && (
          <ScheduleContentModal
            contentId={contentToSchedule.id}
            contentTitle={contentToSchedule.title}
            contentChannels={(contentToSchedule.content_channels || []).map((ch) => ({
              id: ch.id,
              channel_id: ch.channel_id,
              channel_name: ch.channel_name,
              auto_post_status: ch.auto_post_status,
            }))}
            onSuccess={() => {
              setShowScheduleModal(false);
              setContentToSchedule(null);
              dispatch(contents(filters));
            }}
          />
        )}
      </Dialog>
    </div>
  );
};

export default ContentList;
