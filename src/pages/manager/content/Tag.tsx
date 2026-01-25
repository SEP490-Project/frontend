import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPenToSquare, FaFilter } from "react-icons/fa6";
import { Trash, Loader2 } from "lucide-react";
import { DeleteModal } from "@/components/modal/DeleteModal";
import { Dialog } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PaginationTable } from "@/components/global";
import TagManagement from "@/components/manage/content/TagManagement";
import { useAppDispatch } from "@/libs/stores";
import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";
import { tags, deleteTag } from "@/libs/stores/tagManager";
import type { Tag } from "@/libs/types/tag";

const PAGE_SIZE = 5;

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ManageTags: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tags: tagList, pagination, loading } = useSelector((state: RootState) => state.manageTag);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

  useEffect(() => {
    dispatch(
      tags({
        page,
        limit: PAGE_SIZE,
        keywords: searchTerm || undefined,
      }),
    );
  }, [dispatch, page, searchTerm]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAddTag = () => {
    setDialogMode("create");
    setSelectedTag(null);
    setDialogOpen(true);
  };

  const handleEditTag = (tag: Tag) => {
    setDialogMode("edit");
    setSelectedTag(tag);
    setDialogOpen(true);
  };

  const handleDeleteClick = (tag: Tag) => {
    setTagToDelete(tag);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (tagToDelete) {
      try {
        await dispatch(deleteTag(tagToDelete.id)).unwrap();
        setDeleteDialogOpen(false);
        setTagToDelete(null);
      } catch (error) {
        console.error("Failed to delete tag:", error);
      }
    }
  };

  const handleSuccess = () => {
    dispatch(
      tags({
        page,
        limit: PAGE_SIZE,
        keywords: searchTerm || undefined,
      }),
    );
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Tags</h1>
        <Button className="bg-primary hover:bg-[#f794a8] text-white" onClick={handleAddTag}>
          Add tag
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium">Search:</span>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="px-4">
              <TableRow className="border-b bg-gray-50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Created At</TableHead>
                <TableHead className="font-semibold">Updated At</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="mx-auto mb-4 h-12 w-12 text-primary animate-spin" />
                    <p className="text-gray-500">Loading tags</p>
                  </TableCell>
                </TableRow>
              ) : tagList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No tags found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                tagList.map((tag, index) => (
                  <TableRow
                    key={tag.id}
                    className={`border-b hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <TableCell className="py-4 max-w-xs">
                      <div>
                        <span className="font-medium text-gray-900 block">{tag.name}</span>
                        <span className="text-sm text-gray-500 block truncate max-w-xs">
                          {tag.description}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <span className="text-sm text-gray-600">{formatDate(tag.created_at)}</span>
                    </TableCell>

                    <TableCell className="py-4">
                      <span className="text-sm text-gray-600">{formatDate(tag.updated_at)}</span>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-yellow-50"
                              onClick={() => handleEditTag(tag)}
                            >
                              <FaPenToSquare className="text-yellow-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit tag</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-50"
                              onClick={() => handleDeleteClick(tag)}
                            >
                              <Trash className="text-red-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete tag</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden divide-y">
          {loading ? (
            <div className="p-4 text-center">
              <Loader2 className="mx-auto mb-4 h-12 w-12 text-primary animate-spin" />
              <p className="text-gray-500">Loading tags...</p>
            </div>
          ) : tagList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tags found matching your criteria.
            </div>
          ) : (
            tagList.map((tag) => (
              <div key={tag.id} className="p-4 flex flex-col gap-3 bg-white">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{tag.name}</div>
                    <div className="text-sm text-gray-500 mb-2">{tag.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Usage</div>
                    <div className="font-semibold text-lg">{tag.usage_count} times</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Created:</span>
                    <span>{formatDate(tag.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Updated:</span>
                    <span>{formatDate(tag.updated_at)}</span>
                  </div>
                </div>

                <div className="flex gap-1 pt-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-yellow-50"
                        onClick={() => handleEditTag(tag)}
                      >
                        <FaPenToSquare className="text-yellow-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit tag</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-50"
                        onClick={() => handleDeleteClick(tag)}
                      >
                        <Trash className="text-red-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete tag</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))
          )}
        </div>

        {pagination && pagination.total > 0 && (
          <div className="flex justify-end p-4 border-t bg-gray-50 [&>div]:p-0 [&>div]:border-0 [&>div]:bg-transparent">
            <PaginationTable
              page={page}
              totalItems={pagination.total}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <TagManagement
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        tag={selectedTag}
        onSuccess={handleSuccess}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DeleteModal name={tagToDelete?.name || ""} onDelete={handleDeleteConfirm} />
      </Dialog>
    </div>
  );
};

export default ManageTags;
