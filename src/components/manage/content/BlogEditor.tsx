import TiptapEditor from "@/components/global/Editor";
import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { X, Tag as TagIcon } from "lucide-react";

import type { Content, CreateContentRequest, TipTapDocument } from "@/libs/types/content";
import type { Channel } from "@/libs/types/channel";
import { ArrowLeft, Calendar } from "lucide-react";
import { useAuth } from "@/libs/hooks/useAuth";
import { getBrandIdFromToken } from "@/libs/helper/helper";
import { useNavigationBlocker } from "@/libs/hooks/useNavigationBlocker";
import { useTag } from "@/libs/hooks/useTag";
import { manageChannel } from "@/libs/services/manageChannel";
import { tiptapToHtml } from "@/libs/utils/tiptapConverter";

import type { Tag } from "@/libs/types/tag";
import { HlsPlyrHydrator } from "@/components/hls-video-hydrator";
import AIGeneratedContent from "./AIGeneratedContent";

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
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);

  // Get user from auth state
  const { user } = useAuth();

  // Get available tags from API
  const { tags: availableTags, loading: tagsLoading, error: tagsError } = useTag();

  // Channel state
  const [availableChannels, setAvailableChannels] = React.useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = React.useState<string>("");
  const [channelLoading, setChannelLoading] = React.useState(true);

  // Fetch channels on component mount
  React.useEffect(() => {
    const fetchChannels = async () => {
      try {
        setChannelLoading(true);
        const response = await manageChannel.channelList();
        const channels = response.data.data || [];

        // Filter for Website and Facebook channels only
        const blogChannels = channels.filter(
          (channel: Channel) =>
            channel.name.toLowerCase() === "website" || channel.name.toLowerCase() === "facebook",
        );

        setAvailableChannels(blogChannels);

        // If editing, use the channel from editingContent
        if (editingContent?.content_channels?.[0]?.channel_id) {
          setSelectedChannel(editingContent.content_channels[0].channel_id);
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

  // Initialize selected tags from editing content - memoized to avoid recalculation
  const [selectedTags, setSelectedTags] = useState<Tag[]>(() => {
    if (editingContent?.blog?.tags && availableTags.length > 0) {
      return editingContent.blog.tags
        .map((tagName: string) => availableTags.find((tag) => tag.name === tagName))
        .filter((tag): tag is Tag => tag !== undefined);
    }
    return [];
  });

  // Memoized read time calculation
  const calculateReadTime = useCallback((htmlContent: string) => {
    const textContent = htmlContent.replace(/<[^>]*>/g, "");
    const wordsPerMinute = 200;
    const wordCount = textContent.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime > 0 ? readTime : 1;
  }, []);

  React.useEffect(() => {
    if (editingContent?.blog?.tags && availableTags.length > 0 && selectedTags.length === 0) {
      const tags = editingContent.blog.tags
        .map((tagName: string) => availableTags.find((tag) => tag.name === tagName))
        .filter((tag): tag is Tag => tag !== undefined);
      setSelectedTags(tags);
    }
  }, [availableTags, editingContent?.blog?.tags, selectedTags.length]);

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

  const [localTitle, setLocalTitle] = React.useState(editingContent?.title || "");
  const handleContentChange = useCallback((data: any) => {
    setContent(data);
  }, []);

  // Memoized tag selection handlers
  const handleTagSelect = useCallback((tag: Tag) => {
    setSelectedTags((prev) => {
      const isAlreadySelected = prev.some((t) => t.id === tag.id);
      if (!isAlreadySelected) {
        return [...prev, tag];
      }
      return prev;
    });
    setTagPopoverOpen(false);
  }, []);

  const handleTagRemove = useCallback((tagId: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  }, []);

  const clearAllTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

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
      !selectedTags.length ||
      channelLoading ||
      !selectedChannel
    );
  }, [content, localTitle, selectedTags.length, channelLoading, selectedChannel]);
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

      const apiData: CreateContentRequest = {
        title: localTitle.trim(),
        body: content.json,
        type: "POST",
        blog_fields: {
          author_id: user?.id || getBrandIdFromToken() || "",
          excerpt: excerpt,
          read_time: calculateReadTime(content.html),
          tags: selectedTags.map((tag) => tag.name),
        },
        channels: [selectedChannel],
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
    selectedTags,
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

  // Optimized unsaved changes detection
  const hasUnsavedChanges = useMemo(() => {
    const titleChanged = localTitle !== (editingContent?.title || "");
    if (!content) return titleChanged;

    const contentChanged =
      content.html !== initialContent.html ||
      JSON.stringify(content.json) !== JSON.stringify(initialContent.json);

    return titleChanged || contentChanged;
  }, [content, initialContent, localTitle, editingContent?.title]);

  // Block browser navigation when there are unsaved changes
  useNavigationBlocker({
    when: hasUnsavedChanges,
    onNavigationAttempt: (destinationUrl) => {
      setPendingNavigation(destinationUrl);
      setShowNavigationDialog(true);
    },
  });

  // Memoized navigation handlers
  const handleBackClick = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      onBack();
    }
  }, [hasUnsavedChanges, onBack]);

  const handleDiscardChanges = useCallback(() => {
    setShowUnsavedDialog(false);
    onBack();
  }, [onBack]);

  const handleKeepEditing = useCallback(() => {
    setShowUnsavedDialog(false);
  }, []);

  const handleStayOnPage = useCallback(() => {
    setShowNavigationDialog(false);
    setPendingNavigation(null);
  }, []);

  const handleProceedNavigation = useCallback(() => {
    setShowNavigationDialog(false);
    if (pendingNavigation) {
      window.location.href = pendingNavigation;
    }
  }, [pendingNavigation]);

  // AI Content Integration Handlers
  const handleAIContentGenerated = useCallback(
    (generatedContent: string, tiptapJson?: TipTapDocument) => {
      // Track AI-generated text (store plain text for tracking)
      const plainTextContent = generatedContent.replace(/<[^>]*>/g, "");
      setAiGeneratedText((prev) => (prev ? `${prev}\n\n${plainTextContent}` : plainTextContent));

      // Determine the HTML content to use
      let htmlContent = generatedContent;
      let jsonContent = tiptapJson;

      // If we have a TipTap JSON document, convert it to HTML
      if (tiptapJson && tiptapJson.type === "doc") {
        htmlContent = tiptapToHtml(tiptapJson);
        jsonContent = tiptapJson;
      }

      if (content) {
        // Append AI content to existing content
        const separator =
          content.html.trim() &&
          content.html !== "<p></p>" &&
          content.html !== "<p>Start typing...</p>"
            ? "<br><br>"
            : "";
        const newHTML = content.html + separator + htmlContent;

        // Merge JSON content if we have TipTap JSON
        let mergedJson = content.json;
        if (jsonContent && content.json?.type === "doc" && content.json?.content) {
          // Merge the content arrays
          mergedJson = {
            type: "doc",
            content: [...content.json.content, ...(jsonContent.content || [])],
          };
        }

        // Update content state and force editor re-render
        setContent({
          html: newHTML,
          json: mergedJson,
        });
        setEditorKey((prev) => prev + 1);
      } else {
        // If no existing content, set AI content as the initial content
        setContent({
          html: htmlContent,
          json: jsonContent || {
            type: "doc",
            content: [{ type: "paragraph", content: [{ type: "text", text: htmlContent }] }],
          },
        });
        setEditorKey((prev) => prev + 1);
      }
    },
    [content],
  );

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

          {/* Channel Selection */}
          <div className="space-y-2">
            <Label htmlFor="channel">Channel *</Label>
            <Select
              value={selectedChannel}
              onValueChange={(value) => setSelectedChannel(value)}
              disabled={channelLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={channelLoading ? "Loading channels..." : "Select a channel"}
                />
              </SelectTrigger>
              <SelectContent>
                {availableChannels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    {channel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <TagIcon className="h-3 w-3" />
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
                      <TagIcon className="h-4 w-4" />
                      Add tags...
                    </Button>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-white border" align="start">
                  <Command className="bg-white">
                    <CommandInput placeholder="Search tags..." className="border-0 focus:ring-0" />
                    {tagsLoading ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Loading tags...
                      </div>
                    ) : tagsError ? (
                      <div className="p-4 text-center text-sm text-red-500">
                        Error loading tags: {tagsError}
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>No tags found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {availableTags
                            .filter(
                              (tag) => !selectedTags.some((selected) => selected.id === tag.id),
                            )
                            .map((tag) => (
                              <CommandItem
                                key={tag.id}
                                value={tag.name}
                                onSelect={() => handleTagSelect(tag)}
                                className="cursor-pointer hover:bg-[#FF9DB0]/10 data-[selected]:bg-[#FFFFFF]/20"
                              >
                                <div className="flex items-center space-x-2 flex-1">
                                  <TagIcon className="h-4 w-4 text-[#FF9DB0]" />
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
                      </>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
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
            />
          </div>

          {/* AI Content Generator */}
          <AIGeneratedContent
            onContentGenerated={handleAIContentGenerated}
            selectedPlatform={availableChannels.find((ch) => ch.id === selectedChannel)?.name || ""}
          />
        </CardContent>
      </Card>

      {/* Preview Toggle Button */}
      <div className="flex justify-center">
        <Button
          variant="default"
          onClick={handlePreviewToggle}
          className="w-[200px]"
          disabled={isPreviewDisabled}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </div>

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
