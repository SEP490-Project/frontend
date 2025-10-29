import TiptapEditor from "@/components/global/Editor";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { X, Tag } from "lucide-react";

import type { Content, CreateContentRequest } from "@/libs/types/content";
import { ArrowLeft, User, Calendar, Target, FileText } from "lucide-react";
import {
  getTaskStatusDisplay,
  getTaskCampaignDisplay,
  getStatusBadgeVariant,
  getStatusBadgeClassName,
} from "@/libs/helper/taskUtils";
import { useAuth } from "@/libs/hooks/useAuth";
import { getBrandIdFromToken } from "@/libs/helper/helper";
import { mockTags } from "@/pages/manager/content/mock-data/tag-mock-data";
import { useNavigationBlocker } from "@/libs/hooks/useNavigationBlocker";

interface Tag {
  id: string;
  name: string;
  description: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

type ContentType = "blog" | "video";

interface BlogEditorProps {
  editingContent?: Content | null;
  selectedTask?: any;
  onSave: (content: CreateContentRequest, contentType: ContentType) => void;
  onBack: () => void;
}

const BlogEditor = ({ editingContent, selectedTask, onSave, onBack }: BlogEditorProps) => {
  const contentType = "blog";
  const [showPreview, setShowPreview] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);

  // Get user from auth state
  const { user } = useAuth();

  // Get available tags (filtered to show only non-deleted)
  const availableTags = mockTags.filter((tag) => tag.deleted_at === null);

  // State for content tracking
  const [content, setContent] = React.useState<{ html: string; json: any } | null>(
    editingContent
      ? {
          html: editingContent.html_content || "",
          json: editingContent.json_content || null,
        }
      : null,
  );

  // Local state for title to avoid watch() performance issues
  const [localTitle, setLocalTitle] = React.useState(editingContent?.title || "");

  // Simple content update handler
  const handleContentChange = (data: any) => {
    setContent(data);
  };

  // Tag selection handlers
  const handleTagSelect = (tag: Tag) => {
    const isAlreadySelected = selectedTags.some((t) => t.id === tag.id);
    if (!isAlreadySelected) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagPopoverOpen(false);
  };

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  // Memoized save button disabled state
  const isSaveDisabled = React.useMemo(() => {
    return !content || !localTitle.trim() || localTitle.length < 3 || localTitle.length > 200;
  }, [content, localTitle]);

  // Handle form submission
  const handleFormSubmit = () => {
    if (content && localTitle.trim()) {
      // Create excerpt from content (first 150 characters of plain text)
      const plainText = content.html.replace(/<[^>]*>/g, "");
      const excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "");

      // Debug: Log user info to understand the issue

      const apiData: CreateContentRequest = {
        title: localTitle.trim(),
        body: content.html,
        type: "POST",
        blog_fields: {
          author_id: user?.id || getBrandIdFromToken() || "",
          excerpt: excerpt,
          read_time: calculateReadTime(content.html),
          tags: selectedTags.map((tag) => tag.name), // Convert selected tags to array of names
        },
        channels: ["0a2a3dcb-71c2-474f-8d15-7400dd424b2b"],
        task_id: selectedTask?.id?.toString() || null,
        affiliate_link: null,
        ai_generated_text: null,
      };

      onSave(apiData, contentType);
    }
  };

  // Keep track of initial content to detect unsaved changes
  const initialContent = React.useMemo(
    () => ({
      html: editingContent ? editingContent.html_content : "",
      json: editingContent ? editingContent.json_content : null,
    }),
    [editingContent],
  );

  // Check if there are unsaved changes
  const hasUnsavedChanges = React.useMemo(() => {
    if (!content) return localTitle !== (editingContent?.title || "");
    return (
      localTitle !== (editingContent?.title || "") ||
      content.html !== initialContent.html ||
      JSON.stringify(content.json) !== JSON.stringify(initialContent.json)
    );
  }, [content, initialContent, localTitle, editingContent?.title]);

  // Block browser navigation when there are unsaved changes
  useNavigationBlocker({
    when: hasUnsavedChanges,
    onNavigationAttempt: () => {
      setShowNavigationDialog(true);
    },
  });

  // Handle back navigation with unsaved changes check
  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      onBack();
    }
  };

  // Handle discarding changes and going back
  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    onBack();
  };

  // Handle keeping changes (close dialog)
  const handleKeepEditing = () => {
    setShowUnsavedDialog(false);
  };

  // Handle navigation dialog - stay on page
  const handleStayOnPage = () => {
    setShowNavigationDialog(false);
    setPendingNavigation(null);
  };

  // Handle navigation dialog - proceed with navigation
  const handleProceedNavigation = () => {
    setShowNavigationDialog(false);
    // Allow navigation by temporarily disabling the blocker
    if (pendingNavigation) {
      window.location.href = pendingNavigation;
    }
  };

  // Calculate estimated read time based on content
  const calculateReadTime = (htmlContent: string) => {
    // Remove HTML tags and get plain text
    const textContent = htmlContent.replace(/<[^>]*>/g, "");
    // Average reading speed: 200 words per minute
    const wordsPerMinute = 200;
    const wordCount = textContent.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime > 0 ? readTime : 1; // Minimum 1 minute
  };

  const defaultContent = "Edit your blog content here...";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="default"
            onClick={handleBackClick}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to List</span>
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingContent ? "Edit Blog Content" : "Create New Blog Content"}
            </h2>
          </div>
        </div>
        <Button
          onClick={handleFormSubmit}
          className="bg-[#FF9DB0] hover:bg-pink-600"
          disabled={isSaveDisabled}
        >
          {editingContent ? "Update Content" : "Save Content"}
        </Button>
      </div>

      {/* Task Details Panel */}
      {selectedTask && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Task: {selectedTask.title || "Untitled Task"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Campaign */}
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Campaign:</span>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {getTaskCampaignDisplay(selectedTask)}
                </Badge>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedTask.color || "#gray" }}
                />
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <Badge
                  variant={getStatusBadgeVariant(getTaskStatusDisplay(selectedTask))}
                  className={getStatusBadgeClassName(getTaskStatusDisplay(selectedTask))}
                >
                  {getTaskStatusDisplay(selectedTask)}
                </Badge>
              </div>

              {/* Assignee */}
              {selectedTask.details?.assignee && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Assignee:</span>
                  <span className="text-sm text-gray-600">{selectedTask.details.assignee}</span>
                </div>
              )}

              {/* Due Time */}
              {selectedTask.details?.dueTime && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Due:</span>
                  <span className="text-sm text-gray-600">{selectedTask.details.dueTime}</span>
                </div>
              )}

              {/* Priority */}
              {selectedTask.details?.priority && (
                <div className="flex items-center space-x-2 md:col-span-2">
                  <span className="text-sm font-medium text-gray-700">Priority:</span>
                  <Badge
                    variant="outline"
                    className={
                      selectedTask.details.priority === "High"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : selectedTask.details.priority === "Medium"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                    }
                  >
                    {selectedTask.details.priority}
                  </Badge>
                </div>
              )}
            </div>

            {/* Description */}
            {selectedTask.details?.description && (
              <div className="border-t pt-4">
                <span className="text-sm font-medium text-gray-700 block mb-2">Description:</span>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-md">
                  {selectedTask.details.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Editor */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {editingContent ? "Edit Blog Content" : `Create New ${contentType}`}
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter blog title..."
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Tag Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Tags</Label>
              {selectedTags.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAllTags}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Selected Tags Display */}
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag.id}
                  className="flex items-center gap-1 px-3 py-1 bg-[#FF9DB0] hover:bg-pink-600 text-white border-0"
                >
                  <Tag className="h-3 w-3" />
                  {tag.name}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-white/20 text-white"
                    onClick={() => handleTagRemove(tag.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}

              {/* Add Tag Button - Always Show */}
              <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
                <PopoverTrigger asChild>
                  {selectedTags.length > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      className="h-10 w-10 border-[#FF9DB0] text-[#FF9DB0] hover:bg-[#FF9DB0] hover:text-white transition-colors flex items-center justify-center"
                    >
                      <span className="text-2xl font-bold leading-none">+</span>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="justify-start gap-2 text-muted-foreground border-dashed hover:border-[#FF9DB0] hover:text-[#FF9DB0] transition-colors"
                    >
                      <Tag className="h-4 w-4" />
                      Add tags...
                    </Button>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-white border" align="start">
                  <Command className="bg-white">
                    <CommandInput placeholder="Search tags..." className="border-0 focus:ring-0" />
                    <CommandEmpty>No tags found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {availableTags
                        .filter((tag) => !selectedTags.some((selected) => selected.id === tag.id))
                        .map((tag) => (
                          <CommandItem
                            key={tag.id}
                            value={tag.name}
                            onSelect={() => handleTagSelect(tag)}
                            className="cursor-pointer hover:bg-[#FF9DB0]/10 data-[selected]:bg-[#FFFFFF]/20"
                          >
                            <div className="flex items-center space-x-2 flex-1">
                              <Tag className="h-4 w-4 text-[#FF9DB0]" />
                              <div className="flex-1">
                                <div className="font-medium">{tag.name}</div>
                                {tag.description && (
                                  <div className="text-sm text-muted-foreground">
                                    {tag.description}
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground bg-[#FF9DB0]/10 px-2 py-1 rounded-full">
                                {tag.usage_count} uses
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <TiptapEditor
              initialContent={editingContent ? editingContent.html_content : defaultContent}
              onChange={handleContentChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Toggle Button */}
      <div className="flex justify-center">
        <Button
          variant="default"
          onClick={() => setShowPreview(!showPreview)}
          className="w-[200px]"
          disabled={!content || !localTitle.trim()}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </div>

      {/* Preview Section */}
      {showPreview && content && localTitle.trim() && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Blog Preview</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Title and Read Time */}
              <div className="border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{localTitle}</h1>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="mr-4">{new Date().toLocaleDateString()}</span>
                  <span>{calculateReadTime(content.html)} min read</span>
                </div>
              </div>

              {/* Content */}
              <div
                className="ProseMirror prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-blockquote:my-2"
                dangerouslySetInnerHTML={{ __html: content.html }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unsaved Changes Dialog */}
      <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes that will be lost if you leave this page. Are you sure you
              want to continue without saving?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleKeepEditing}>
              Keep Editing
            </Button>
            <Button variant="destructive" onClick={handleDiscardChanges}>
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Navigation Blocker Dialog - for in-app navigation */}
      <Dialog open={showNavigationDialog} onOpenChange={setShowNavigationDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Leave Page?</DialogTitle>
            <DialogDescription>
              You have unsaved changes that will be lost if you navigate away from this page. Are
              you sure you want to leave?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleStayOnPage}>
              Stay on Page
            </Button>
            <Button variant="destructive" onClick={handleProceedNavigation}>
              Leave Without Saving
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogEditor;
