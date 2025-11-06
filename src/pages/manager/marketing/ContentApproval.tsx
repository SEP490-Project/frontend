import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaEye, FaListCheck } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PaginationTable from "@/components/global/PaginationTable";
import { useAppDispatch } from "@/libs/stores";
import { contents as fetchContents } from "@/libs/stores/contentManager/thunk";
import { channelList } from "@/libs/stores/channelManager/thunk";
import type { Content } from "@/libs/types/content";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { DatePicker } from "@/components/date-picker";
import { formatDate } from "@/libs/helper/helper";
import { motion } from "framer-motion";
import { useContentMarketing } from "@/libs/hooks/useContentMarketing";
import { useChannel } from "@/libs/hooks/useChannel";
import ContentPreview from "@/components/manage/marketing/content-approval/ContentPreview";

const PAGE_SIZE = 10;

const CONTENT_STATUS_LABELS: Record<string, string> = {
  PUBLISHED: "Published",
  AWAIT_STAFF: "Awaiting Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  DRAFT: "Draft",
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
  POST: "Post",
  VIDEO: "Video",
};

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-800 border-green-200",
  AWAIT_STAFF: "bg-amber-100 text-amber-800 border-amber-200",
  APPROVED: "bg-blue-100 text-blue-800 border-blue-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
};

const CONTENT_TYPE_COLORS: Record<string, string> = {
  POST: "bg-orange-100 text-orange-800 border-orange-200",
  VIDEO: "bg-purple-100 text-purple-800 border-purple-200",
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

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const dispatch = useAppDispatch();
  const { contents, loading, pagination } = useContentMarketing();
  const { channel } = useChannel();

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
    setSelectedContentId(content.id);
  };

  const handleCloseModal = () => {
    setSelectedContentId(null);
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
            Content Approval
          </motion.h1>
          <motion.p className="text-gray-600 mt-1" variants={itemVariants}>
            Review and approve content submissions from content creators
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
          <motion.div className="sm:col-span-2" variants={itemVariants}>
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
          <motion.div className="flex gap-1" variants={itemVariants}>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="AWAIT_STAFF">Awaiting Review</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="secondary"
              className="border-gray-300 px-3"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          </motion.div>
        </div>
        <div
          className="
          grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2
          items-end
        "
        >
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
        </div>
      </motion.div>

      <div className="bg-white rounded-lg overflow-hidden shadow">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading contents...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-gray-50">
                    <TableHead className="font-semibold">Content</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Channel</TableHead>
                    <TableHead className="font-semibold">Author</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contents.map((content: any, index) => (
                    <motion.tr
                      key={content.id}
                      layout="position"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <TableCell className="py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{content.title}</div>
                          {content.description && (
                            <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                              {content.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={`border text-xs font-medium px-2 py-1 ${CONTENT_TYPE_COLORS[content.type] || ""}`}
                        >
                          {CONTENT_TYPE_LABELS[content.type] || content.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={`border ${STATUS_COLORS[content.status] || ""} text-xs font-medium px-2 py-1`}
                        >
                          {CONTENT_STATUS_LABELS[content.status] || content.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm">{content.channel?.name || "Website"}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm text-gray-600">
                          {content.blog?.author?.username || content.author?.username || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-sm">
                        {formatDate(content.created_at)}
                      </TableCell>
                      <TableCell className="py-4">
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
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
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
                        <div className="font-semibold text-gray-900">{content.title}</div>
                        <div className="flex gap-2 mt-2">
                          <Badge
                            className={`border text-xs font-medium px-2 py-1 ${CONTENT_TYPE_COLORS[content.type] || ""}`}
                          >
                            {CONTENT_TYPE_LABELS[content.type] || content.type}
                          </Badge>
                          <Badge
                            className={`border ${STATUS_COLORS[content.status] || ""} text-xs font-medium px-2 py-1`}
                          >
                            {CONTENT_STATUS_LABELS[content.status] || content.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Created</div>
                        <div className="text-sm font-medium">{formatDate(content.created_at)}</div>
                      </div>
                    </div>

                    {content.description && (
                      <div className="text-sm text-gray-600">{content.description}</div>
                    )}

                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Channel:</span>{" "}
                        {content.channel?.name || "Website"}
                      </div>
                      <div>
                        <span className="font-medium">Author:</span>{" "}
                        {content.blog?.author?.username || content.author?.username || "-"}
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
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FaListCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || typeFilter !== "ALL" || statusFilter !== "ALL"
                    ? "No content matches your current filters."
                    : "No content submissions found."}
                </p>
              </motion.div>
            )}

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
          </>
        )}
      </div>

      <ContentPreview
        contentId={selectedContentId}
        isOpen={!!selectedContentId}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ContentApprovalPage;
