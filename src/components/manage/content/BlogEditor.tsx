import TiptapEditor from "@/components/global/Editor";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { ArrowLeft, Calendar, Eye, EyeOff, Plus } from "lucide-react";

import type { Content, CreateContentRequest, TipTapDocument } from "@/libs/types/content";
import type { Channel } from "@/libs/types/channel";
import type { Task } from "@/libs/types/task";
import { useAuth } from "@/libs/hooks/useAuth";
import { useContent } from "@/libs/hooks/useContent";
import { getBrandIdFromToken } from "@/libs/helper/helper";
import { useNavigationBlocker } from "@/libs/hooks/useNavigationBlocker";
import { useTag } from "@/libs/hooks/useTag";
import { manageChannel } from "@/libs/services/manageChannel";
import { tiptapToHtml } from "@/libs/utils/tiptapConverter";

import { HlsPlyrHydrator } from "@/components/hls-video-hydrator";
import TaskInfoCard from "./TaskInfoCard";
import TaskSelectionDialog from "./TaskSelectionDialog";
import ChannelSidebar from "./ChannelSidebar";
import AIGeneratedContentSidebar from "./AIGeneratedContentSidebar";
import TagInput, { type TagOption } from "./TagInput";

type ContentType = "blog" | "video";

interface BlogEditorProps {
  editingContent?: Content | null;
  initialTask?: Task | null;
  onSave: (content: CreateContentRequest, contentType: ContentType) => void;
  onBack: () => void;
}

const BlogEditor = ({ editingContent, initialTask, onSave, onBack }: BlogEditorProps) => {
  const contentType = "blog";
  const [showPreview, setShowPreview] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);

  // Local task state - allows changing/removing task
  const [selectedTask, setSelectedTask] = useState<Task | null>(initialTask || null);
  const [showTaskSelector, setShowTaskSelector] = useState(false);

  // Get user from auth state
  const { user } = useAuth();

  // Get streaming content from Redux store
  const { isStreaming, streamingContent } = useContent();

  // Get available tags from API
  const { tags: availableTags, loading: tagsLoading } = useTag();
  const [localTags, setLocalTags] = useState<TagOption[]>([]);

  // Channel state - now single-select
  const [availableChannels, setAvailableChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [channelLoading, setChannelLoading] = useState(true);

  // Fetch channels on component mount
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setChannelLoading(true);
        const response = await manageChannel.channelList();
        const channels = response.data.data || [];

        // Filter for Website and Facebook channels only for blog content
        const blogChannels = channels.filter(
          (channel: Channel) =>
            channel.name.toLowerCase() === "website" || channel.name.toLowerCase() === "facebook",
        );

        setAvailableChannels(blogChannels);

        // If editing, use the channel from editingContent
        if (editingContent?.content_channels && editingContent.content_channels.length > 0) {
          const existingChannelId = editingContent.content_channels[0]?.channel_id;
          if (existingChannelId) {
            setSelectedChannel(existingChannelId);
          }
        } else {
          // Set default selection to Website if available (for new content)
          const websiteChannel = blogChannels.find(
            (channel: Channel) => channel.name.toLowerCase() === "website",
          );
          if (websiteChannel) {
            setSelectedChannel(websiteChannel.id);
          } else if (blogChannels.length > 0) {
            setSelectedChannel(blogChannels[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setChannelLoading(false);
      }
    };

    fetchChannels();
  }, [editingContent]);

  const handleChannelChange = useCallback((channelId: string) => {
    setSelectedChannel(channelId);
  }, []);

  // Initialize selected tags from editing content - using IDs now
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(() => {
    if (editingContent?.blog?.tags && availableTags.length > 0) {
      return editingContent.blog.tags
        .map((tagName: string) => availableTags.find((tag) => tag.name === tagName)?.id)
        .filter((id): id is string => id !== undefined);
    }
    return [];
  });

  // Sync tags from editing content when available tags are loaded
  useEffect(() => {
    if (editingContent?.blog?.tags && availableTags.length > 0 && selectedTagIds.length === 0) {
      const tagIds = editingContent.blog.tags
        .map((tagName: string) => availableTags.find((tag) => tag.name === tagName)?.id)
        .filter((id): id is string => id !== undefined);
      setSelectedTagIds(tagIds);
    }
  }, [availableTags, editingContent?.blog?.tags, selectedTagIds]);

  const allAvailableTagOptions = useMemo(
    () => [...availableTags.map((tag) => ({ id: tag.id, name: tag.name })), ...localTags],
    [availableTags, localTags],
  );

  const handleCreateTag = async (tagName: string): Promise<TagOption | null> => {
    const newTag: TagOption = {
      id: `new-${tagName}-${Date.now()}`,
      name: tagName.trim(),
    };

    setLocalTags((prev) => [...prev, newTag]);
    return newTag;
  };

  // Calculate read time from HTML content
  const calculateReadTime = useCallback((htmlContent: string) => {
    const textContent = htmlContent.replace(/<[^>]*>/g, "");
    const wordCount = textContent.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  }, []);

  const initialContentState = useMemo(() => {
    if (!editingContent) return null;
    return {
      html: typeof editingContent.body === "string" ? editingContent.body : "",
      json:
        typeof editingContent.body === "object" ? editingContent.body : editingContent.body || null,
    };
  }, [editingContent]);

  const [content, setContent] = useState<{ html: string; json: any } | null>(initialContentState);
  const [editorKey, setEditorKey] = useState(0);
  const [aiGeneratedText, setAiGeneratedText] = useState<string | null>(
    editingContent?.ai_generated_text || null,
  );

  // AI Diff Preview state
  const [showDiffPreview, setShowDiffPreview] = useState(false);
  const [pendingAIContent, setPendingAIContent] = useState<{
    html: string;
    json?: TipTapDocument;
  } | null>(null);

  const [localTitle, setLocalTitle] = useState(editingContent?.title || "");
  const handleContentChange = useCallback((data: any) => {
    setContent(data);
  }, []);

  // Show diff preview when streaming starts
  useEffect(() => {
    if (isStreaming) {
      setShowDiffPreview(true);
    }
  }, [isStreaming]);

  // Memoized save button disabled state
  const isSaveDisabled = useMemo(() => {
    // Check if content is empty or just whitespace/empty HTML tags
    const isContentEmpty =
      !content ||
      !content.html ||
      content.html.trim() === "" ||
      content.html === "<p></p>" ||
      content.html.replace(/<[^>]*>/g, "").trim() === "";

    return (
      isContentEmpty ||
      !localTitle.trim() ||
      localTitle.length < 3 ||
      localTitle.length > 200 ||
      !selectedTagIds.length ||
      channelLoading ||
      !selectedChannel
    );
  }, [content, localTitle, selectedTagIds.length, channelLoading, selectedChannel]);
  // Memoized preview toggle handler
  const handlePreviewToggle = useCallback(() => {
    setShowPreview((prev) => !prev);
  }, []);

  // Memoized preview disabled state
  const isPreviewDisabled = useMemo(() => {
    return !content || !localTitle.trim();
  }, [content, localTitle]);

  // Memoized form submission handler
  const handleFormSubmit = useCallback(() => {
    if (content && localTitle.trim() && selectedChannel) {
      // Create excerpt from content (first 150 characters of plain text)
      const plainText = content.html.replace(/<[^>]*>/g, "");
      const excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "");

      // Get selected tag names from IDs
      const selectedTagNames = selectedTagIds
        .map((id) => allAvailableTagOptions.find((tag) => tag.id === id)?.name)
        .filter((name): name is string => name !== undefined);

      const apiData: CreateContentRequest = {
        title: localTitle.trim(),
        body: content.json,
        type: "POST",
        blog_fields: {
          author_id: user?.id || getBrandIdFromToken() || "",
          excerpt: excerpt,
          read_time: calculateReadTime(content.html),
          tags: selectedTagNames,
        },
        channels: [selectedChannel], // Now single channel in array
        task_id: selectedTask?.id?.toString() || null,
        affiliate_link: null,
        ai_generated_text: aiGeneratedText || null,
      };

      onSave(apiData, contentType);
    }
  }, [
    content,
    localTitle,
    selectedChannel,
    selectedTagIds,
    allAvailableTagOptions,
    user?.id,
    selectedTask?.id,
    onSave,
    contentType,
    calculateReadTime,
    aiGeneratedText,
  ]);

  // Memoized initial content for unsaved changes detection
  const initialContent = useMemo(
    () => ({
      html: editingContent && typeof editingContent.body === "string" ? editingContent.body : "",
      json:
        editingContent && typeof editingContent.body === "object"
          ? editingContent.body
          : editingContent?.body || null,
    }),
    [editingContent],
  );

  // Bypass flag to disable blocker when user confirms navigation
  const [bypassBlocker, setBypassBlocker] = useState(false);

  // Detect unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    const titleChanged = localTitle !== (editingContent?.title || "");
    if (!content) return titleChanged;

    const contentChanged =
      content.html !== initialContent.html ||
      JSON.stringify(content.json) !== JSON.stringify(initialContent.json);

    return titleChanged || contentChanged;
  }, [content, initialContent, localTitle, editingContent?.title]);

  // Block navigation when there are unsaved changes
  useNavigationBlocker({
    when: hasUnsavedChanges && !bypassBlocker,
    onNavigationAttempt: () => {
      setShowNavigationDialog(true);
    },
  });

  // Navigation handlers
  const handleBackClick = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      onBack();
    }
  }, [hasUnsavedChanges, onBack]);

  const handleDiscardChanges = useCallback(() => {
    setShowUnsavedDialog(false);
    setBypassBlocker(true);
    onBack();
  }, [onBack]);

  const handleKeepEditing = useCallback(() => {
    setShowUnsavedDialog(false);
  }, []);

  const handleStayOnPage = useCallback(() => {
    setShowNavigationDialog(false);
  }, []);

  const handleProceedNavigation = useCallback(() => {
    setShowNavigationDialog(false);
    setBypassBlocker(true);
  }, []);

  // AI Content handlers
  const handleAIContentGenerated = useCallback(
    (generatedContent: string, tiptapJson?: TipTapDocument) => {
      let htmlContent = generatedContent;
      let jsonContent = tiptapJson;

      if (tiptapJson?.type === "doc") {
        htmlContent = tiptapToHtml(tiptapJson);
        jsonContent = tiptapJson;
      }

      setPendingAIContent({ html: htmlContent, json: jsonContent });
      setShowDiffPreview(true);
    },
    [],
  );

  const handleApplyAIContent = useCallback(() => {
    if (!pendingAIContent) return;

    const plainTextContent = pendingAIContent.html.replace(/<[^>]*>/g, "");
    setAiGeneratedText((prev) => (prev ? `${prev}\n\n${plainTextContent}` : plainTextContent));

    const { html: htmlContent, json: jsonContent } = pendingAIContent;

    const hasExistingContent =
      content?.html?.trim() &&
      content.html !== "<p></p>" &&
      content.html.replace(/<[^>]*>/g, "").trim().length > 0;

    if (hasExistingContent && content) {
      const mergedJson =
        jsonContent && content.json?.type === "doc" && content.json?.content
          ? { type: "doc", content: [...content.json.content, ...(jsonContent.content || [])] }
          : content.json;

      setContent({ html: content.html + "<br><br>" + htmlContent, json: mergedJson });
    } else {
      setContent({
        html: htmlContent,
        json: jsonContent || {
          type: "doc",
          content: [{ type: "paragraph", content: [{ type: "text", text: htmlContent }] }],
        },
      });
    }

    setEditorKey((prev) => prev + 1);
    setShowDiffPreview(false);
    setPendingAIContent(null);
  }, [content, pendingAIContent]);

  const handleDiscardAIContent = useCallback(() => {
    setShowDiffPreview(false);
    setPendingAIContent(null);
  }, []);

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
        <div className="flex items-center gap-3">
          {/* Preview Button - Now in header */}
          <Button
            variant="outline"
            onClick={handlePreviewToggle}
            disabled={isPreviewDisabled}
            className="flex items-center gap-2"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show Preview
              </>
            )}
          </Button>
          <Button
            onClick={handleFormSubmit}
            className="bg-[#FF9DB0] hover:bg-pink-600"
            disabled={isSaveDisabled}
          >
            {editingContent ? "Update Content" : "Save Content"}
          </Button>
        </div>
      </div>

      {/* Task Info Section - Above Editor */}
      <div className="space-y-3">
        {selectedTask ? (
          <div className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
            <TaskInfoCard
              task={selectedTask}
              onChangeTask={() => setShowTaskSelector(true)}
              onRemoveTask={() => setSelectedTask(null)}
            />
          </div>
        ) : (
          <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 hover:border-gray-300 transition-all duration-200 hover:shadow-sm group">
            <CardContent className="p-4">
              <Button
                variant="ghost"
                className="w-full h-auto py-3 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 transition-all duration-200"
                onClick={() => setShowTaskSelector(true)}
              >
                <Plus className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />
                <span>Link to a Task (Optional)</span>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Task Selection Dialog */}
      <TaskSelectionDialog
        isOpen={showTaskSelector}
        onClose={() => setShowTaskSelector(false)}
        onTaskSelect={(task) => {
          setSelectedTask(task);
          setShowTaskSelector(false);
        }}
      />

      {/* Two-Column Layout */}
      <div className="flex gap-4">
        {/* Left Column - Main Editor */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Editor Card */}
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
                <Label>Tags *</Label>
                <TagInput
                  availableTags={allAvailableTagOptions} // Use the combined list
                  selectedTags={selectedTagIds}
                  onTagsChange={setSelectedTagIds}
                  onCreateTag={handleCreateTag} // Pass the creation handler
                  placeholder="Select or create tags..."
                  allowCreate={true} // Set to true
                />
                {tagsLoading && <p className="text-sm text-muted-foreground">Loading tags...</p>}
              </div>

              {/* Content Editor */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <TiptapEditor
                  key={editorKey}
                  initialContent={
                    content?.json?.type === "doc"
                      ? content.json
                      : content?.html ||
                        (editingContent
                          ? typeof editingContent.body === "string"
                            ? editingContent.body
                            : typeof editingContent.body === "object"
                              ? editingContent.body
                              : ""
                          : "")
                  }
                  onChange={handleContentChange}
                  diffMode={showDiffPreview && (isStreaming || !!pendingAIContent)}
                  diffContent={isStreaming ? streamingContent : pendingAIContent?.html || ""}
                  onDiffAccept={handleApplyAIContent}
                  onDiffReject={handleDiscardAIContent}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview Section - Memoized */}
          {useMemo(() => {
            if (!showPreview || !content || !localTitle.trim()) return null;

            return (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Blog Preview</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{localTitle}</h1>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="mr-4">{new Date().toLocaleDateString()}</span>
                        <span>{calculateReadTime(content.html)} min read</span>
                      </div>
                    </div>
                    <div
                      className="ProseMirror prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-blockquote:my-2"
                      dangerouslySetInnerHTML={{ __html: content.html }}
                    />
                    <HlsPlyrHydrator />
                  </div>
                </CardContent>
              </Card>
            );
          }, [showPreview, content, localTitle, calculateReadTime])}
        </div>

        {/* Right Sidebar - Channel Selection + AI Generator */}
        <div className="w-80 shrink-0 space-y-4">
          {/* Channel Selection */}
          <ChannelSidebar
            channels={availableChannels}
            selectedChannel={selectedChannel}
            onChannelChange={handleChannelChange}
            isLoading={channelLoading}
            allowedChannelTypes={["website", "facebook"]}
          />

          {/* AI Content Generator Sidebar */}
          <AIGeneratedContentSidebar
            onContentGenerated={handleAIContentGenerated}
            selectedPlatform={availableChannels.find((ch) => ch.id === selectedChannel)?.name || ""}
            currentContent={content?.json || ""}
          />
        </div>
      </div>

      {/* Unsaved Changes Dialog */}
      <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <DialogContent className="sm:max-w-md">
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

      {/* Navigation Blocker Dialog */}
      <Dialog open={showNavigationDialog} onOpenChange={setShowNavigationDialog}>
        <DialogContent className="sm:max-w-md">
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
