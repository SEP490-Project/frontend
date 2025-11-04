import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Filter } from "lucide-react";
import { PaginationTable } from "@/components/global";
import type { Content, ContentListParams } from "@/libs/types/content";
import { manageContent } from "@/libs/services/manageContent";
import ContentPreview from "./ContentPreview";

interface ContentsListProps {
  onViewContent?: (content: Content) => void;
}

const ContentsList: React.FC<ContentsListProps> = ({ onViewContent }) => {
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

  // Filter states
  const [filters, setFilters] = useState<ContentListParams>({
    page: 1,
    limit: 10,
    keywords: "",
    status: "",
    actor: "",
  });

  const [searchInput, setSearchInput] = useState("");

  // Fetch contents
  const fetchContents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await manageContent.contents(filters);
      // Type assertion to ensure proper typing
      const contentData = response.data.data as Content[];
      // Filter to only show blog content and exclude draft status for marketing
      const blogContent = contentData.filter(
        (content) =>
          // content.content_type === "blog" &&
          content.status === "AWAIT_STAFF" || content.status === "POSTED",
      );
      setContents(blogContent);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching contents:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  // Handle search
  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      keywords: searchInput,
      page: 1,
    }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      keywords: "",
      status: "",
      actor: "",
    });
    setSearchInput("");
  };

  // Get channel badge with pink theme
  const getChannelBadge = () => {
    return (
      <Badge className="bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-100">Website</Badge>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format status badge with pink theme colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "POSTED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
            Posted
          </Badge>
        );
      case "AWAIT_STAFF":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
            Awaiting Review
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
            Rejected
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100">
            Draft
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

  // Format published date
  const formatPublishedDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return "Not published";
    }
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle view content
  const handleViewContent = (content: Content) => {
    setSelectedContentId(content.id);
    onViewContent?.(content);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setSelectedContentId(null);
    // Refresh the content list to reflect any status changes
    fetchContents();
  };

  // Handle content updated from detail view
  const handleContentUpdated = (updatedContent: Content) => {
    setContents((prevContents) =>
      prevContents.map((content) => (content.id === updatedContent.id ? updatedContent : content)),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Content</h1>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Filter className="h-4 w-4" />
              Filters:
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="flex gap-2 flex-1 max-w-md">
                <Input
                  placeholder="Search by title, description, or author..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="h-9"
                />
                <Button onClick={handleSearch} size="sm" className="h-9">
                  Search
                </Button>
              </div>

              {/* Status Filter */}
              <Select
                value={filters.status || "all"}
                onValueChange={(status) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: status === "all" ? "" : status,
                    page: 1,
                  }))
                }
              >
                <SelectTrigger className="w-32 h-9">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="POSTED">Posted</SelectItem>
                  <SelectItem value="AWAIT_STAFF">Awaiting Review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters} size="sm" className="h-9">
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card className="border-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Content</TableHead>
                <TableHead className="font-semibold">Channel</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">Date Published</TableHead>
                <TableHead className="font-semibold hidden lg:table-cell">Author</TableHead>
                <TableHead className="font-semibold hidden lg:table-cell">Created</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading blog content...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : contents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No blog content found
                  </TableCell>
                </TableRow>
              ) : (
                contents.map((content) => (
                  <TableRow key={content.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate max-w-xs">
                          {content.title}
                        </div>

                        {/* Show author and date on mobile */}
                        <div className="flex items-center gap-2 mt-2 lg:hidden">
                          <span className="text-xs text-gray-500">{content.actor}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {formatDate(content.created_at)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getChannelBadge()}</TableCell>
                    <TableCell>{getStatusBadge(content.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600 hidden md:table-cell">
                      {formatPublishedDate(
                        content.status === "POSTED" ? content.publish_date : null,
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 hidden lg:table-cell">
                      {content?.blog?.author?.username}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 hidden lg:table-cell">
                      {formatDate(content.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {/* View Button - Only Eye Icon */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewContent(content)}
                          className="h-8 w-8 p-0 hover:bg-pink-50 hover:text-pink-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.total > 0 && (
          <PaginationTable
            page={pagination.page}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={handlePageChange}
          />
        )}
      </Card>

      {/* Results Summary */}
      {!loading && contents.length > 0 && (
        <div className="text-sm text-gray-500">
          Showing {(pagination.page - 1) * pagination.limit + 1}-
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
        </div>
      )}

      {/* Content Preview Modal */}
      <ContentPreview
        contentId={selectedContentId}
        isOpen={!!selectedContentId}
        onClose={handleCloseModal}
        onContentUpdated={handleContentUpdated}
      />
    </div>
  );
};

export default ContentsList;
