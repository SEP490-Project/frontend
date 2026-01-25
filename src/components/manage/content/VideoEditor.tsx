import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Content, CreateContentRequest } from "@/libs/types/content";
import type { Task } from "@/libs/types/task";
import { ArrowLeft, Upload, X, Eye, EyeOff, BookOpen, Scissors, Loader2, Plus } from "lucide-react";
import { useNavigationBlocker } from "@/libs/hooks/useNavigationBlocker";
import { useChunkUpload } from "@/libs/hooks/useChunkUpload";
import { useChannel } from "@/libs/hooks/useChannel";
import TikTokGuidelineSidebar from "./TikTokGuidelineSidebar";
import TaskInfoCard from "./TaskInfoCard";
import TaskSelectionDialog from "./TaskSelectionDialog";
import ChannelSidebar from "./ChannelSidebar";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/libs/stores";
import { channelList } from "@/libs/stores/channelManager/thunk";
import { toast } from "sonner";
import FFmpegVideoEditor from "@/components/global/FFmpegVideoEditor";

type ContentType = "blog" | "video";

interface VideoEditorProps {
  editingContent?: Content | null;
  initialTask?: Task | null;
  onSave: (content: CreateContentRequest, contentType: ContentType) => void;
  onBack: () => void;
}

const VideoEditor = ({ editingContent, initialTask, onSave, onBack }: VideoEditorProps) => {
  const contentType = "video";
  const dispatch = useDispatch<AppDispatch>();
  const { loading: isLoadingChannels, channel: channels } = useChannel();

  // --- Local Task State ---
  const [selectedTask, setSelectedTask] = useState<Task | null>(initialTask || null);
  const [showTaskSelector, setShowTaskSelector] = useState(false);

  // --- State for Deferred Upload & Preview ---
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  // --- Advanced Editor State ---
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);

  // --- Standard Component State ---
  const [showPreview, setShowPreview] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // TikTok Guidelines Sidebar state
  const [showTikTokGuidelines, setShowTikTokGuidelines] = useState(false);
  const hasShownGuidelinesRef = useRef(false);

  // Upload Hook
  const { uploadFileInChunks, progress, isUploading, error: uploadError } = useChunkUpload();

  // Channel Selection
  const [selectedChannel, setSelectedChannel] = useState<string>(() => {
    if (editingContent?.content_channels && editingContent.content_channels.length > 0) {
      return editingContent.content_channels[0]?.channel_id || "";
    }
    return "";
  });

  const [videoContent, setVideoContent] = useState<{
    title: string;
    description: string;
    body: string;
  }>({
    title: editingContent ? editingContent.title || "" : "",
    description: editingContent ? editingContent.description || "" : "",
    body: editingContent
      ? editingContent.video_url ||
        (typeof editingContent.body === "string"
          ? editingContent.body
          : (editingContent.body as any)?.video_url || (editingContent.body as any)?.body || "") ||
        ""
      : "",
  });

  // Keep track of initial values to detect unsaved changes
  const initialContent = React.useMemo(
    () => ({
      channel: editingContent?.content_channels
        ? editingContent.content_channels[0]?.channel_id || ""
        : "",
      title: editingContent ? editingContent.title || "" : "",
      description: editingContent ? editingContent.description || "" : "",
      body: editingContent
        ? editingContent.video_url ||
          (typeof editingContent.body === "string"
            ? editingContent.body
            : (editingContent.body as any)?.video_url ||
              (editingContent.body as any)?.body ||
              "") ||
          ""
        : "",
    }),
    [editingContent],
  );

  // Fetch channels on component mount
  useEffect(() => {
    dispatch(channelList());
  }, [dispatch]);

  // Sync state when editingContent changes
  useEffect(() => {
    if (editingContent) {
      const extractedVideoUrl =
        editingContent.video_url ||
        (typeof editingContent.body === "string"
          ? editingContent.body
          : (editingContent.body as any)?.video_url || (editingContent.body as any)?.body || "") ||
        "";

      setVideoContent({
        title: editingContent.title || "",
        description: editingContent.description || "",
        body: extractedVideoUrl,
      });

      if (editingContent.content_channels && editingContent.content_channels.length > 0) {
        const channelId = editingContent.content_channels[0]?.channel_id;
        if (channelId) {
          setSelectedChannel(channelId);
        }
      }
    }
  }, [editingContent]);

  // Set default channel selection when channels load
  useEffect(() => {
    if (!editingContent && channels.length > 0 && !selectedChannel) {
      const tiktokChannel = channels.find((channel) => channel.name.toLowerCase() === "tiktok");
      if (tiktokChannel) {
        setSelectedChannel(tiktokChannel.id);
      }
    }
  }, [channels, editingContent, selectedChannel]);

  const allowedVideoChannels = React.useMemo(() => {
    return channels.filter(
      (channel) =>
        channel.name.toLowerCase() === "facebook" || channel.name.toLowerCase() === "tiktok",
    );
  }, [channels]);

  // Auto-open TikTok guidelines when TikTok channel is selected (initial load or edit)
  useEffect(() => {
    // Only run once channels are loaded and we have a selected channel
    if (selectedChannel && allowedVideoChannels.length > 0 && !hasShownGuidelinesRef.current) {
      const channel = allowedVideoChannels.find((ch) => ch.id === selectedChannel);
      if (channel?.name.toLowerCase() === "tiktok") {
        setShowTikTokGuidelines(true);
        hasShownGuidelinesRef.current = true;
      }
    }
  }, [selectedChannel, allowedVideoChannels]);

  // Handle channel change
  const handleChannelChange = useCallback(
    (channelId: string) => {
      setSelectedChannel(channelId);
      const channel = allowedVideoChannels.find((ch) => ch.id === channelId);
      if (channel?.name.toLowerCase() === "tiktok" && !hasShownGuidelinesRef.current) {
        setShowTikTokGuidelines(true);
        hasShownGuidelinesRef.current = true;
      }
    },
    [allowedVideoChannels],
  );

  const hasTikTokSelected = useMemo(() => {
    const channel = allowedVideoChannels.find((ch) => ch.id === selectedChannel);
    return channel?.name.toLowerCase() === "tiktok";
  }, [selectedChannel, allowedVideoChannels]);

  // Check unsaved changes
  const hasUnsavedChanges = React.useMemo(() => {
    const channelChanged = selectedChannel !== initialContent.channel;
    return (
      channelChanged ||
      videoContent.title !== initialContent.title ||
      videoContent.description !== initialContent.description ||
      videoContent.body !== initialContent.body ||
      localFile !== null
    );
  }, [videoContent, initialContent, localFile, selectedChannel]);

  // Navigation Blocker
  useNavigationBlocker({
    when: hasUnsavedChanges,
    onNavigationAttempt: (destinationUrl) => {
      setPendingNavigation(destinationUrl);
      setShowNavigationDialog(true);
    },
  });

  // --- Handlers ---

  const handleInputChange = (field: keyof typeof videoContent, value: string) => {
    setVideoContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 1. File Selection (No Upload Yet)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLocalFile(file);
      const url = URL.createObjectURL(file);
      setLocalPreviewUrl(url);
    }
  };

  // 2. Handle Save from Advanced Editor
  const handleEditorSave = (editedFile: File) => {
    setLocalFile(editedFile);
    // Revoke old URL to prevent memory leaks
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);

    setLocalPreviewUrl(URL.createObjectURL(editedFile));
    setShowAdvancedEditor(false);
  };

  const handleRemoveVideo = () => {
    setVideoContent((prev) => ({ ...prev, body: "" }));
    setLocalFile(null);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }
  };

  // 3. Final Save: Upload -> Submit API
  const handleSave = async () => {
    if (isUploading) {
      toast.warning("Upload is already in progress.");
      return;
    }

    if (!selectedChannel || !videoContent.title || !videoContent.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let finalVideoUrl = videoContent.body;

    // A. Perform Upload if there is a local file
    if (localFile) {
      try {
        const response = await uploadFileInChunks(localFile);
        if (response && response.data && response.data.HostURL) {
          finalVideoUrl = response.data.HostURL;
          // Update state so if saving fails later, we don't re-upload
          setVideoContent((prev) => ({ ...prev, body: finalVideoUrl }));
          setLocalFile(null); // Clear local file as it is now uploaded
        } else {
          throw new Error("Invalid upload response");
        }
      } catch (error) {
        console.error("Video upload failed:", error);
        toast.error("Video upload failed. Please try again.");
        return; // Stop execution
      }
    }

    // B. Validation before API call
    if (!finalVideoUrl) {
      toast.error("Please provide a video file.");
      return;
    }

    // C. Submit Content API
    const apiData: CreateContentRequest = {
      title: videoContent.title,
      body: {
        title: videoContent.title,
        video_url: finalVideoUrl,
        description: videoContent.description,
      },
      type: "VIDEO",
      channels: [selectedChannel],
      task_id: selectedTask?.id?.toString() || null,
      affiliate_link: null,
      ai_generated_text: null,
    };

    onSave(apiData, contentType);
  };

  // Navigation handlers
  const handleBackClick = () => (hasUnsavedChanges ? setShowUnsavedDialog(true) : onBack());
  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    onBack();
  };
  const handleKeepEditing = () => setShowUnsavedDialog(false);
  const handleStayOnPage = () => {
    setShowNavigationDialog(false);
    setPendingNavigation(null);
  };
  const handleProceedNavigation = () => {
    setShowNavigationDialog(false);
    if (pendingNavigation) window.location.href = pendingNavigation;
  };

  const isPreviewDisabled = useMemo(() => {
    return (
      isUploading ||
      !selectedChannel ||
      !videoContent.title ||
      !videoContent.description ||
      (!videoContent.body && !localPreviewUrl)
    );
  }, [isUploading, selectedChannel, videoContent, localPreviewUrl]);

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
          <h2 className="text-xl font-semibold text-gray-900">
            {editingContent ? "Edit Video Content" : "Create New Video Content"}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {hasTikTokSelected && (
            <Button
              variant="outline"
              onClick={() => setShowTikTokGuidelines(true)}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> TikTok Guidelines
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            disabled={isPreviewDisabled}
            className="flex items-center gap-2"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4" /> Hide Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> Show Preview
              </>
            )}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUploading || isPreviewDisabled}
            className="bg-[#FF9DB0] hover:bg-pink-600 disabled:opacity-50 min-w-[140px]"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {progress}%
              </>
            ) : editingContent ? (
              "Update Content"
            ) : (
              "Save Content"
            )}
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

      <div className="flex gap-6">
        {/* Main Editor Column */}
        <div className="flex-1 min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Video Details</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter video title..."
                  value={videoContent.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Enter video description..."
                  value={videoContent.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full min-h-[120px] resize-none"
                />
              </div>

              {/* Video Upload Area */}
              <div className="space-y-2">
                <Label>Video *</Label>
                {uploadError && <div className="text-red-500 text-sm mb-2">{uploadError}</div>}

                {!localPreviewUrl && !videoContent.body ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">
                      {isUploading ? `Uploading... ${progress}%` : "Upload your video file"}
                    </p>

                    {isUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4 max-w-md mx-auto">
                        <div
                          className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    )}

                    <input
                      type="file"
                      id="video-upload"
                      accept="video/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploading}
                      onClick={() => document.getElementById("video-upload")?.click()}
                    >
                      Choose Video File
                    </Button>
                  </div>
                ) : (
                  <div className="relative group">
                    <video
                      key={localPreviewUrl || videoContent.body}
                      src={localPreviewUrl || videoContent.body}
                      controls
                      className="w-full max-h-[400px] rounded-lg bg-black"
                    />

                    {/* Control Bar Overlay */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {localFile && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowAdvancedEditor(true)}
                          className="text-black bg-white/90 hover:bg-white"
                        >
                          <Scissors className="w-4 h-4 mr-2" /> Edit Video
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveVideo}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {localFile ? (
                          <span className="text-green-600 font-medium">
                            Ready to upload: {localFile.name}
                          </span>
                        ) : (
                          <span>Current video loaded</span>
                        )}
                      </div>

                      {/* Replace Button */}
                      {!isUploading && (
                        <div className="space-x-2">
                          <input
                            type="file"
                            id="video-replace"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("video-replace")?.click()}
                          >
                            Replace Video
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          {showPreview && !isPreviewDisabled && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Post Preview</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-700">Channel:</span>
                    {(() => {
                      const channel = allowedVideoChannels.find((ch) => ch.id === selectedChannel);
                      return channel ? (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                          {channel.name}
                        </span>
                      ) : null;
                    })()}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{videoContent.title}</h4>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {videoContent.description}
                    </p>
                  </div>
                  <div className="mt-6">
                    <video
                      src={localPreviewUrl || videoContent.body}
                      controls
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="w-80 flex-shrink-0">
          <ChannelSidebar
            channels={allowedVideoChannels}
            selectedChannel={selectedChannel}
            onChannelChange={handleChannelChange}
            isLoading={isLoadingChannels}
            allowedChannelTypes={["tiktok", "facebook"]}
          />
        </div>
      </div>

      {/* Sidebars & Dialogs */}
      <TikTokGuidelineSidebar
        isOpen={showTikTokGuidelines}
        onClose={() => setShowTikTokGuidelines(false)}
      />

      {/* Advanced Editor Fullscreen Dialog */}
      <Dialog open={showAdvancedEditor} onOpenChange={setShowAdvancedEditor}>
        <DialogContent className="max-w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col bg-transparent border-none shadow-none [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Video Editor</DialogTitle>
          </DialogHeader>
          {localFile && (
            <FFmpegVideoEditor
              file={localFile}
              onSave={handleEditorSave}
              onCancel={() => setShowAdvancedEditor(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Dialog */}
      <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to continue without saving?
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Leave Page?</DialogTitle>
            <DialogDescription>
              You have unsaved changes that will be lost. Leave anyway?
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

export default VideoEditor;
