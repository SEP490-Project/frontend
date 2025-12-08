import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

import type { Content, CreateContentRequest } from "@/libs/types/content";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useNavigationBlocker } from "@/libs/hooks/useNavigationBlocker";
import { useChunkUpload } from "@/libs/hooks/useChunkUpload";
import { useChannel } from "@/libs/hooks/useChannel";
import TikTokGuidelineCard from "./TikTokGuideline";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/libs/stores";
import { channelList } from "@/libs/stores/channelManager/thunk";
import { toast } from "sonner";

type ContentType = "blog" | "video";

interface VideoEditorProps {
  editingContent?: Content | null;
  selectedTask?: any;
  onSave: (content: CreateContentRequest, contentType: ContentType) => void;
  onBack: () => void;
}

const VideoEditor = ({ editingContent, selectedTask, onSave, onBack }: VideoEditorProps) => {
  const contentType = "video";
  const dispatch = useDispatch<AppDispatch>();
  const { loading: isLoadingChannels, channel: channels } = useChannel();

  const [showPreview, setShowPreview] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { uploadFileInChunks, progress, isUploading, error } = useChunkUpload();

  const [videoContent, setVideoContent] = useState<{
    channel: string;
    title: string;
    description: string;
    body: string;
  }>({
    channel: editingContent ? editingContent.content_channels?.[0]?.channel_id || "" : "",
    title: editingContent ? editingContent.title || "" : "",
    description: editingContent ? editingContent.description || "" : "",
    body: editingContent
      ? // Try multiple ways to extract video URL
        editingContent.video_url || // Direct video_url field
        (typeof editingContent.body === "string"
          ? editingContent.body
          : (editingContent.body as any)?.video_url || (editingContent.body as any)?.body || "") ||
        ""
      : "",
  });

  // Keep track of initial values to detect unsaved changes
  const initialContent = React.useMemo(
    () => ({
      channel: editingContent ? editingContent.content_channels?.[0]?.channel_id || "" : "",
      title: editingContent ? editingContent.title || "" : "",
      description: editingContent ? editingContent.description || "" : "",
      body: editingContent
        ? // Try multiple ways to extract video URL
          editingContent.video_url || // Direct video_url field
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

  // Debug log to see what content we're working with
  useEffect(() => {
    if (editingContent) {
      console.log("Editing content:", editingContent);
      console.log("Extracted video URL:", videoContent.body);
    }
  }, [editingContent, videoContent.body]); // Filter channels for video content (only Facebook and TikTok allowed)
  const allowedVideoChannels = React.useMemo(() => {
    return channels.filter(
      (channel) =>
        channel.name.toLowerCase() === "facebook" || channel.name.toLowerCase() === "tiktok",
    );
  }, [channels]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = React.useMemo(() => {
    return (
      videoContent.channel !== initialContent.channel ||
      videoContent.title !== initialContent.title ||
      videoContent.description !== initialContent.description ||
      videoContent.body !== initialContent.body ||
      uploadedFile !== null
    );
  }, [videoContent, initialContent, uploadedFile]);

  // Block browser navigation when there are unsaved changes
  useNavigationBlocker({
    when: hasUnsavedChanges,
    onNavigationAttempt: (destinationUrl) => {
      setPendingNavigation(destinationUrl);
      setShowNavigationDialog(true);
    },
  });

  const handleSave = () => {
    if (isUploading) {
      toast.warning("Please wait for the video upload to complete.");
      return;
    }

    if (
      videoContent.channel &&
      videoContent.title &&
      videoContent.description &&
      videoContent.body
    ) {
      const apiData: CreateContentRequest = {
        title: videoContent.title,
        body: {
          title: videoContent.title,
          video_url: videoContent.body,
          description: videoContent.description,
        },
        type: "VIDEO",
        channels: [videoContent.channel],
        task_id: selectedTask?.id?.toString() || null,
        affiliate_link: null,
        ai_generated_text: null,
      };

      onSave(apiData, contentType);
    }
  };

  const handleInputChange = (field: keyof typeof videoContent, value: string) => {
    setVideoContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);

      try {
        const response = await uploadFileInChunks(file);
        if (response && response?.data.HostURL) {
          setVideoContent((prev) => ({
            ...prev,
            body: response.data.HostURL,
          }));
        }
      } catch (error) {
        console.error("Video upload failed:", error);
        toast.error("Video upload failed. Please try again.");
      }
    }
  };

  const handleRemoveVideo = () => {
    setVideoContent((prev) => ({
      ...prev,
      body: "",
    }));
    setUploadedFile(null);
  };

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
              {editingContent ? "Edit Video Content" : "Create New Video Content"}
            </h2>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isUploading}
          className="bg-[#FF9DB0] hover:bg-pink-600 disabled:opacity-50"
        >
          {isUploading
            ? `Uploading... ${progress}%`
            : editingContent
              ? "Update Content"
              : "Save Content"}
        </Button>
      </div>

      {/* Editor */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {editingContent ? "Edit Video Content" : `Create New ${contentType}`}
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Channel Selector */}
          <div className="space-y-2">
            <Label htmlFor="channel">Channel *</Label>
            <Select
              value={videoContent.channel}
              onValueChange={(value) => handleInputChange("channel", value)}
              disabled={isLoadingChannels}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={isLoadingChannels ? "Loading channels..." : "Select a channel"}
                />
              </SelectTrigger>
              <SelectContent>
                {allowedVideoChannels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    {channel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <input
              type="text"
              id="title"
              placeholder="Enter video title..."
              value={videoContent.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description Input */}
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

          {/* TikTok Guidelines - Show only when TikTok is selected */}
          {videoContent.channel &&
            allowedVideoChannels
              .find((ch) => ch.id === videoContent.channel)
              ?.name.toLowerCase() === "tiktok" && (
              <div className="space-y-2">
                <TikTokGuidelineCard />
              </div>
            )}

          {/* Video Upload */}
          <div className="space-y-2">
            <Label htmlFor="video">Video *</Label>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            {!videoContent.body ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">
                  {isUploading ? `Uploading... ${progress}%` : "Upload your video file"}
                </p>
                {isUploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => document.getElementById("video-upload")?.click()}
                >
                  {isUploading ? `Uploading ${progress}%` : "Choose Video File"}
                </Button>
              </div>
            ) : (
              <div className="relative">
                <video
                  key={videoContent.body}
                  src={videoContent.body}
                  controls
                  preload="metadata"
                  className="w-full max-h-[300px] rounded-lg"
                  onLoadedData={(e) => {
                    // Seek to first frame to show thumbnail
                    const video = e.currentTarget;
                    if (video.currentTime === 0) {
                      video.currentTime = 0.1;
                    }
                  }}
                  onError={(e) => {
                    console.error("Video load error:", e);
                    console.log("Video URL that failed:", videoContent.body);
                  }}
                >
                  Your browser does not support the video tag.
                </video>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveVideo}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {uploadedFile ? (
                      <span>Uploaded: {uploadedFile.name}</span>
                    ) : editingContent ? (
                      <span>Current video loaded</span>
                    ) : (
                      <span>Video ready</span>
                    )}
                  </div>
                  <div className="space-x-2">
                    <input
                      type="file"
                      id="video-replace"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUploading}
                      onClick={() => document.getElementById("video-replace")?.click()}
                    >
                      {isUploading ? `Uploading ${progress}%` : "Replace Video"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Toggle Button */}
      <div className="flex justify-center">
        <Button
          variant="default"
          onClick={() => setShowPreview(!showPreview)}
          className="w-[200px]"
          disabled={
            isUploading ||
            !videoContent.channel ||
            !videoContent.title ||
            !videoContent.description ||
            !videoContent.body
          }
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </div>

      {/* Preview Section */}
      {showPreview &&
        videoContent.channel &&
        videoContent.title &&
        videoContent.description &&
        videoContent.body && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Video Preview</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Channel Preview */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Channel:</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {allowedVideoChannels.find((ch) => ch.id === videoContent.channel)?.name ||
                      videoContent.channel}
                  </Badge>
                </div>

                {/* Title Preview */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{videoContent.title}</h4>
                </div>

                {/* Description Preview */}
                <div>
                  <p className="text-gray-700 leading-relaxed">{videoContent.description}</p>
                </div>

                {/* Video Preview */}
                <div className="mt-6">
                  <video
                    src={videoContent.body || undefined}
                    controls
                    className="w-full rounded-lg shadow-lg"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
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

export default VideoEditor;
