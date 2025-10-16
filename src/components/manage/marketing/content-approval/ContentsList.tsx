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
import { Eye, Check, X, Filter } from "lucide-react";
import { PaginationTable } from "@/components/global";
import type { Content, ContentListParams } from "@/libs/types/content";
import { manageContent } from "@/libs/services/manageContent";

interface ContentsListProps {
  onViewContent?: (content: Content) => void;
  onApproveContent?: (content: Content) => void;
  onRejectContent?: (content: Content) => void;
}

const ContentsList: React.FC<ContentsListProps> = ({
  onViewContent,
  onApproveContent,
  onRejectContent,
}) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
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
      setContents(contentData);
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

  // Handle filter changes
  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status === "all" ? "" : status,
      page: 1,
    }));
  };

  const handleActorFilter = (actor: string) => {
    setFilters((prev) => ({
      ...prev,
      actor: actor === "all" ? "" : actor,
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

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "posted":
        return "default";
      case "pending":
        return "secondary";
      case "draft":
        return "outline";
      default:
        return "outline";
    }
  };

  // Get content type badge variant
  const getContentTypeVariant = (type: string) => {
    switch (type) {
      case "blog":
        return "secondary";
      case "video":
        return "default";
      default:
        return "outline";
    }
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

  // Format views
  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Content Approval</h1>
          <p className="text-gray-600">Review and approve marketing content</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Pending Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>Draft</span>
          </div>
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
              <Select value={filters.status || "all"} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="posted">Posted</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              {/* Actor Filter */}
              <Select value={filters.actor || "all"} onValueChange={handleActorFilter}>
                <SelectTrigger className="w-36 h-9">
                  <SelectValue placeholder="All Authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Authors</SelectItem>
                  <SelectItem value="Content Staff">Content Staff</SelectItem>
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
                <TableHead className="font-semibold hidden sm:table-cell">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">Views</TableHead>
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
                      <span className="ml-2">Loading contents...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : contents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No content found
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
                        <div className="text-sm text-gray-500 truncate max-w-xs mt-1">
                          {content.json_content &&
                          typeof content.json_content === "object" &&
                          "description" in content.json_content
                            ? (content.json_content as { description: string }).description
                            : "No description available"}
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
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant={getContentTypeVariant(content.content_type || "blog")}
                        className="capitalize"
                      >
                        {content.content_type || "blog"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(content.status)} className="capitalize">
                        {content.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 hidden md:table-cell">
                      {formatViews(content.views)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 hidden lg:table-cell">
                      {content.actor}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 hidden lg:table-cell">
                      {formatDate(content.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewContent?.(content)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Approval Actions - only show for pending content */}
                        {content.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onApproveContent?.(content)}
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRejectContent?.(content)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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
    </div>
  );
};

export default ContentsList;
