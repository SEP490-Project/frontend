import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Loader2 } from "lucide-react";
import PaginationTable from "@/components/global/PaginationTable";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import ContentPreview from "@/components/manage/marketing/content-approval/ContentPreview";
import { manageContent } from "@/libs/services/manageContent";
import type { Content, ContentListParams } from "@/libs/types/content";

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "POST", label: "Post" },
  { value: "VIDEO", label: "Video" },
];

const channelOptions = [
  { value: "all", label: "All Channels" },
  { value: "1", label: "Channel 1" },
  { value: "2", label: "Channel 2" },
  { value: "3", label: "Channel 3" },
];

const sortOptions = [
  { value: "desc", label: "Newest first" },
  { value: "asc", label: "Oldest first" },
];

interface ContentsListProps {
  onViewContent?: (content: Content) => void;
}

export const ContentApprovalPage: React.FC<ContentsListProps> = ({ onViewContent }) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });

  const [filters, setFilters] = useState<ContentListParams>({
    page: 1,
    limit: 10,
    sort_by: "",
    sort_order: "",
    status: "",
    type: "",
    channel_id: "",
    search: "",
    from_date: "",
    to_date: "",
  });

  const fetchContents = useCallback(async () => {
    setLoading(true);
    try {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );

      const res = await manageContent.contents(cleanedFilters);
      setContents(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Error fetching contents:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sort_by: "",
      sort_order: "desc",
      status: "AWAIT_STAFF",
      type: "",
      channel_id: "",
      search: "",
      from_date: "",
      to_date: "",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Published</Badge>;
      case "AWAIT_STAFF":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">Awaiting Review</Badge>
        );
      case "APPROVED":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Approved</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case "DRAFT":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewContent = (content: Content) => {
    setSelectedContentId(content.id);
    onViewContent?.(content);
  };

  const handleCloseModal = () => {
    setSelectedContentId(null);
    fetchContents();
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Content Approval</h1>
          <p className="text-gray-600 mt-1">
            Review and approve content submissions from content creators
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search content..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="sm:w-36">
            <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:w-40">
            <Select
              value={filters.channel_id}
              onValueChange={(v) => setFilters({ ...filters, channel_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                {channelOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:w-40">
            <DatePicker
              label="From"
              value={filters.from_date}
              onChange={(v) => setFilters({ ...filters, from_date: v })}
            />
          </div>

          <div className="sm:w-40">
            <DatePicker
              label="To"
              value={filters.to_date}
              onChange={(v) => setFilters({ ...filters, to_date: v })}
            />
          </div>

          <div className="sm:w-36">
            <Select
              value={filters.sort_order}
              onValueChange={(v) => setFilters({ ...filters, sort_order: v as "asc" | "desc" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:w-24">
            <Button onClick={fetchContents} className="w-full">
              Apply
            </Button>
          </div>

          <div className="sm:w-24">
            <Button variant="secondary" className="border-gray-300 w-full" onClick={clearFilters}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden shadow">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading contents...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-gray-50">
                    <TableHead className="font-semibold">Content</TableHead>
                    <TableHead className="font-semibold">Channel</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Author</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contents.map((content, index) => (
                    <TableRow
                      key={content.id}
                      className={`border-b hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <TableCell className="py-4 max-w-xs">
                        <div className="font-medium text-gray-900 truncate">{content.title}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className="bg-pink-100 text-pink-800 border-pink-200">Website</Badge>
                      </TableCell>
                      <TableCell className="py-4">{getStatusBadge(content.status)}</TableCell>
                      <TableCell className="py-4 text-sm text-gray-600">
                        {content.blog?.author.username}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-600">
                        {formatDate(content.created_at)}
                      </TableCell>
                      <TableCell className="py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                          onClick={() => handleViewContent(content)}
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y">
              {contents.map((content) => (
                <div key={content.id} className="p-4 flex flex-col gap-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{content.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(content.status)}
                        <Badge className="bg-pink-100 text-pink-800 border-pink-200">Website</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-blue-50"
                      onClick={() => handleViewContent(content)}
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Author:</span>
                      <span>{content.blog?.author.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Created:</span>
                      <span>{formatDate(content.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No results */}
            {contents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No content found matching your criteria.
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <PaginationTable
                page={pagination.page}
                totalItems={pagination.total}
                pageSize={pagination.limit}
                onPageChange={handlePageChange}
              />
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
