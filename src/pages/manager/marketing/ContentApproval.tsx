import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
// import { channelList } from "@/libs/stores/channelManager/thunk";
// import { useChannel } from "@/libs/hooks/useChannel";

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
  const [filterOpen, setFilterOpen] = useState(false);
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
    <div className="min-h-screen pt-6 flex flex-col items-center">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Content Approval</h1>
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 sm:hidden">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[90vw] max-w-sm p-4">
              <FilterForm
                filters={filters}
                setFilters={setFilters}
                fetchContents={fetchContents}
                clearFilters={clearFilters}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Desktop Filters */}
        <Card className="border-0 shadow-sm hidden sm:block">
          <CardContent className="p-4">
            <FilterForm
              filters={filters}
              setFilters={setFilters}
              fetchContents={fetchContents}
              clearFilters={clearFilters}
            />
          </CardContent>
        </Card>

        {/* Content Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="px-4 py-3 border-b">
            <CardTitle className="text-lg font-semibold">Content List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Content</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Date Published</TableHead>
                    <TableHead className="hidden lg:table-cell">Author</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading...
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
                          <div className="font-medium text-gray-900 truncate max-w-xs">
                            {content.title}
                          </div>
                          <div className="flex items-center gap-2 mt-2 lg:hidden text-xs text-gray-500">
                            <span>{content.blog?.author.username}</span>
                            <span>•</span>
                            <span>{formatDate(content.created_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-pink-100 text-pink-800">Website</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(content.status)}</TableCell>
                        {/* <TableCell className="hidden md:table-cell">
                        {content.status === "PUBLISHED" ? formatDate(content.date_time) : "Not published"}
                      </TableCell> */}
                        <TableCell className="hidden lg:table-cell">
                          {content.blog?.author.username}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {formatDate(content.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewContent(content)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {pagination.total > 0 && (
              <div className="p-4 border-t flex justify-end">
                <PaginationTable
                  page={pagination.page}
                  totalItems={pagination.total}
                  pageSize={pagination.limit}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <ContentPreview
          contentId={selectedContentId}
          isOpen={!!selectedContentId}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

const FilterForm = ({ filters, setFilters, fetchContents, clearFilters }: any) => (
  <div className="flex flex-wrap gap-3 items-end">
    <Input
      placeholder="Search..."
      value={filters.search}
      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      className="h-9 max-w-xs"
    />

    <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
      <SelectTrigger className="w-[120px] h-9">
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

    <Select
      value={filters.channel_id}
      onValueChange={(v) => setFilters({ ...filters, channel_id: v })}
    >
      <SelectTrigger className="w-[140px] h-9">
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

    <DatePicker
      label="From"
      value={filters.from_date}
      onChange={(v) => setFilters({ ...filters, from_date: v })}
      className="w-[150px]"
    />
    <DatePicker
      label="To"
      value={filters.to_date}
      onChange={(v) => setFilters({ ...filters, to_date: v })}
      className="w-[150px]"
    />

    <Select
      value={filters.sort_order}
      onValueChange={(v) => setFilters({ ...filters, sort_order: v as "asc" | "desc" })}
    >
      <SelectTrigger className="w-[150px] h-9">
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

    <Button onClick={fetchContents} size="sm" className="h-9">
      Apply
    </Button>
    <Button variant="outline" onClick={clearFilters} size="sm" className="h-9">
      Clear
    </Button>
  </div>
);

export default ContentApprovalPage;
