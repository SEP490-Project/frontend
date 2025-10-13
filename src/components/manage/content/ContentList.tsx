import React, { useEffect, useState } from "react";
import { useContentManager } from "@/libs/hooks/useContentManager";
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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Content } from "@/libs/types/content";

type ContentType = "blog" | "video";

interface ContentListProps {
  onCreateNew?: (contentType: ContentType) => void;
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
    unpublishExistingContent,
  } = useContentManager();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    keywords: "",
    status: "",
    actor: "",
  });

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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      await removeContent(id);
      fetchContents(filters);
    }
  };

  const handleToggleStatus = async (content: Content) => {
    if (content.status === "posted") {
      await unpublishExistingContent(content.id);
    } else {
      await publishExistingContent(content.id);
    }
    fetchContents(filters);
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
            <DropdownMenuItem onClick={() => onCreateNew?.("blog")}>
              <FileText className="w-4 h-4 mr-2" />
              Create Blog
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCreateNew?.("video")}>
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
                <div className="col-span-2">Date - Time</div>
                <div className="col-span-1">Views</div>
                <div className="col-span-2">Action</div>
                <div className="col-span-2">Status</div>
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

                    <div className="col-span-2 flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView?.(content)}
                        className="p-1 h-8 w-8"
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(content)}
                        className="p-1 h-8 w-8"
                      >
                        <Edit className="w-4 h-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(content.id)}
                        className="p-1 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>

                    <div className="col-span-2 flex items-center">
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
    </div>
  );
};

export default ContentList;
