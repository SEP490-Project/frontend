import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaEye } from "react-icons/fa6";
import { Loader2, User, Calendar, FileText, Video, Globe } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PaginationTable from "@/components/global/PaginationTable";
import { useAppDispatch } from "@/libs/stores";
import { contents as fetchContents } from "@/libs/stores/contentManager/thunk";
import { channelList } from "@/libs/stores/channelManager/thunk";
import type { Content } from "@/libs/types/content";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { DatePicker } from "@/components/date-picker";
import { motion } from "framer-motion";
import { useContentMarketing } from "@/libs/hooks/useContentMarketing";
import { useChannel } from "@/libs/hooks/useChannel";
import ContentPreview from "@/components/manage/marketing/content-approval/ContentPreview";
import { getItem } from "@/libs/local-storage";

const PAGE_SIZE = 5;

const CONTENT_TYPE_LABELS: Record<string, string> = {
  POST: "Post",
  VIDEO: "Video",
};

const CONTENT_TYPE_COLORS: Record<string, string> = {
  POST: "bg-orange-100 text-orange-800 border-orange-200",
  VIDEO: "bg-purple-100 text-purple-800 border-purple-200",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  AWAIT_BRAND: "Awaiting Brand",
  REJECTED: "Rejected",
  APPROVED: "Approved",
  POSTED: "Posted",
  CANCELLED: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
  AWAIT_BRAND: "bg-yellow-100 text-yellow-800 border-yellow-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  POSTED: "bg-blue-100 text-blue-800 border-blue-200",
  CANCELLED: "bg-gray-100 text-gray-800 border-gray-200",
};

const ContentApprovalPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const user = getItem<{
    id: string;
  }>("user");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const dispatch = useAppDispatch();
  const { contents, loading, pagination } = useContentMarketing();
  const { channel } = useChannel();

  // Helper function to format date time like in ContentList
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Helper function to get channel display info like in ContentList
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

  // Fetch channels when component mounts
  useEffect(() => {
    dispatch(channelList());
  }, [dispatch]);

  // Fetch contents when filters change
  useEffect(() => {
    const params: Record<string, any> = {
      page,
      limit: PAGE_SIZE,
      ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      ...(statusFilter !== "ALL" && { status: statusFilter }),
      user_id: user?.id,
      ...(typeFilter !== "ALL" && { type: typeFilter }),
      ...(channelFilter !== "ALL" && { channel_id: channelFilter }),
      ...(startDate && { from_date: toISOStringDate(startDate) }),
      ...(endDate && { to_date: toISOStringDate(endDate) }),
      sort_by: sortBy,
      sort_order: sortOrder,
    };

    dispatch(fetchContents(params as any));
  }, [
    dispatch,
    page,
    typeFilter,
    statusFilter,
    channelFilter,
    debouncedSearchTerm,
    startDate,
    endDate,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter, channelFilter, debouncedSearchTerm, startDate, endDate]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setChannelFilter("ALL");
    setStartDate("");
    setEndDate("");
    setSortBy("created_at");
    setSortOrder("desc");
  };

  const toISOStringDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return "";
    return `${dateStr}T00:00:00Z`;
  };

  const handleViewContent = (content: Content) => {
    setIsDetailLoading(true);
    setSelectedContentId(content.id);
    // Reset loading state after a short delay to allow modal to open
    setTimeout(() => setIsDetailLoading(false), 100);
  };

  const handleCloseModal = () => {
    setSelectedContentId(null);
    setIsDetailLoading(false);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const filterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-6"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <motion.h1 className="text-xl sm:text-2xl font-semibold" variants={itemVariants}>
            Brand Content Approval
          </motion.h1>
          <motion.p className="text-gray-600 mt-1" variants={itemVariants}>
            Review and approve content submissions as brand representative
          </motion.p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-white rounded-lg shadow mb-4 p-4"
        variants={filterVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="
          grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-2 mb-1
          items-end
        "
        >
          <motion.div variants={itemVariants}>
            <Input
              placeholder="Search by content title or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              autoComplete="off"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="POST">Post</SelectItem>
                <SelectItem value="VIDEO">Video</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="AWAIT_BRAND">Awaiting Brand</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="POSTED">Posted</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Channels</SelectItem>
                {channel.map((ch) => (
                  <SelectItem key={ch.id} value={ch.id}>
                    {ch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        </div>
        <div
          className="
          grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2
          items-end
        "
        >
          <motion.div variants={itemVariants}>
            <DatePicker
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
                if (endDate && date && endDate < date) setEndDate("");
              }}
              placeholder="Start Date"
              dateFormat="dd/MM/yyyy"
              className="w-full"
              maxDate={endDate || undefined}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              placeholder="End Date"
              dateFormat="dd/MM/yyyy"
              className="w-full"
              minDate={startDate || undefined}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              variant="secondary"
              className="border-gray-300 w-full"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Table */}
      <Card>
        <CardContent className="p-0">
          {loading && !isDetailLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="mx-auto mb-4 h-12 w-12 text-primary animate-spin" />
              <p className="text-gray-500">Loading contents...</p>
            </div>
          ) : (
            <>
              {/* Desktop Grid Layout */}
              <div className="hidden lg:block">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium text-sm text-gray-600">
                  <div className="col-span-3">Title</div>
                  <div className="col-span-2">Actor</div>
                  <div className="col-span-2">Time Created</div>
                  <div className="col-span-1">Type</div>
                  <div className="col-span-1">Channel</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-2">Actions</div>
                </div>

                {/* Table Body */}
                {contents.map((content: any, index) => (
                  <motion.div
                    key={content.id}
                    layout="position"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-3">
                      <h4 className="font-medium text-gray-900 truncate">{content.title}</h4>
                      {content.description && (
                        <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                          {content.description}
                        </div>
                      )}
                    </div>

                    <div className="col-span-2 flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">
                        {content.blog?.author?.username || content.author?.username || "System"}
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600 text-sm">
                        {formatDateTime(content.updated_at || content.created_at)}
                      </span>
                    </div>

                    <div className="col-span-1 flex items-center">
                      <div className="flex items-center">
                        {content.blog || content.type === "POST" ? (
                          <FileText className="w-4 h-4 mr-1 text-blue-500" />
                        ) : (
                          <Video className="w-4 h-4 mr-1 text-purple-500" />
                        )}
                        <span className="text-gray-600 capitalize">
                          {content.blog || content.type === "POST" ? "Post" : "Video"}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-1 flex items-center">
                      <div className="flex items-center">
                        {(() => {
                          const contentType =
                            content.blog || content.type === "POST" ? "blog" : "video";
                          let channel = content.content_channels?.length
                            ? content.content_channels.map((c: any) => c.channel_name).join(", ")
                            : "website";
                          if (contentType === "video") {
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
                      <Badge
                        className={`border text-xs font-medium px-2 py-1 ${STATUS_COLORS[content.status] || "bg-gray-100 text-gray-800 border-gray-200"}`}
                      >
                        {STATUS_LABELS[content.status] || content.status}
                      </Badge>
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                            onClick={() => handleViewContent(content)}
                          >
                            <FaEye className="text-blue-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View content</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Card List */}
              <div className="lg:hidden divide-y">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.05 },
                    },
                  }}
                >
                  {contents.map((content: any) => (
                    <motion.div
                      key={content.id}
                      className="p-4 flex flex-col gap-3 bg-white"
                      variants={itemVariants}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{content.title}</h4>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <Badge
                              className={`border text-xs font-medium px-2 py-1 ${CONTENT_TYPE_COLORS[content.type] || ""}`}
                            >
                              {CONTENT_TYPE_LABELS[content.type] || content.type}
                            </Badge>
                            <Badge
                              className={`border text-xs font-medium px-2 py-1 ${STATUS_COLORS[content.status] || "bg-gray-100 text-gray-800 border-gray-200"}`}
                            >
                              {STATUS_LABELS[content.status] || content.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Created</div>
                          <div className="text-sm font-medium">
                            {formatDateTime(content.updated_at || content.created_at)}
                          </div>
                        </div>
                      </div>

                      {content.description && (
                        <div className="text-sm text-gray-600">{content.description}</div>
                      )}

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium">Author:</span>
                          <span className="ml-1">
                            {content.blog?.author?.username || content.author?.username || "System"}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <div className="flex items-center mr-2">
                            {content.blog || content.type === "POST" ? (
                              <FileText className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Video className="w-4 h-4 text-purple-500" />
                            )}
                          </div>
                          <span className="font-medium">Type:</span>
                          <span className="ml-1 capitalize">
                            {content.blog || content.type === "POST" ? "Post" : "Video"}
                          </span>
                        </div>

                        <div className="flex items-center">
                          {(() => {
                            const contentType =
                              content.blog || content.type === "POST" ? "blog" : "video";
                            let channel = content.content_channels?.length
                              ? content.content_channels[0]?.channel_name || "website"
                              : "website";
                            if (contentType === "video") {
                              if (!["facebook", "tiktok"].includes(channel.toLowerCase())) {
                                channel = "facebook";
                              }
                            }
                            const channelInfo = getChannelDisplay(channel, contentType);
                            return (
                              <>
                                <span className="mr-2">{channelInfo.icon}</span>
                                <span className="font-medium">Channel:</span>
                                <span className={`ml-1 ${channelInfo.color}`}>
                                  {channelInfo.name}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="flex gap-1 pt-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50"
                              onClick={() => handleViewContent(content)}
                            >
                              <FaEye className="text-blue-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View content</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* No results message */}
              {(!contents || contents.length === 0) && (
                <motion.div
                  className="p-8 text-center text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p>
                    {searchTerm ||
                    typeFilter !== "ALL" ||
                    statusFilter !== "ALL" ||
                    channelFilter !== "ALL"
                      ? "No content matches your current filters."
                      : "No content submissions found for brand approval."}
                  </p>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: contents.length * 0.05 + 0.2 }}
        >
          <PaginationTable
            page={pagination.page}
            totalItems={pagination.total}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </motion.div>
      )}

      <ContentPreview
        contentId={selectedContentId}
        isOpen={!!selectedContentId}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ContentApprovalPage;
