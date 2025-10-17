import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import type { Content } from "@/libs/types/content";
import { ArrowLeft, Upload, X, User, Calendar, Target, FileText } from "lucide-react";
import {
  getTaskStatusDisplay,
  getTaskCampaignDisplay,
  getStatusBadgeVariant,
  getStatusBadgeClassName,
} from "@/libs/helper/taskUtils";

type ContentType = "blog" | "video";

interface VideoEditorProps {
  editingContent?: Content | null;
  selectedTask?: any;
  onSave: (content: { html: string; json: object }, contentType: ContentType) => void;
  onBack: () => void;
}

interface VideoContent {
  title: string;
  description: string;
  videoFile: File | null;
  videoUrl: string;
}

const VideoEditor = ({ editingContent, selectedTask, onSave, onBack }: VideoEditorProps) => {
  const contentType = "video";
  const [showPreview, setShowPreview] = useState(false);

  // Debug logging to verify task data
  React.useEffect(() => {
    if (selectedTask) {
      console.log("VideoEditor received task:", selectedTask);
      console.log("Task campaign:", selectedTask.campaign);
      console.log("Task status:", selectedTask.status);
    }
  }, [selectedTask]);
  const [videoContent, setVideoContent] = useState<VideoContent>({
    title: editingContent?.title || "",
    description: editingContent ? (editingContent.json_content as any)?.description || "" : "",
    videoFile: null,
    videoUrl: editingContent ? (editingContent.json_content as any)?.videoUrl || "" : "",
  });

  const handleSave = () => {
    if (
      videoContent.title &&
      videoContent.description &&
      (videoContent.videoFile || videoContent.videoUrl)
    ) {
      const content = {
        html: `<h1>${videoContent.title}</h1><p>${videoContent.description}</p><video src="${videoContent.videoUrl}" controls></video>`,
        json: {
          title: videoContent.title,
          description: videoContent.description,
          videoUrl: videoContent.videoUrl,
          type: "video",
        },
      };
      onSave(content, contentType);
    } else {
      alert("Please fill in all required fields (title, description, and video)");
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoContent((prev) => ({
        ...prev,
        videoFile: file,
        videoUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemoveVideo = () => {
    if (videoContent.videoUrl && videoContent.videoUrl.startsWith("blob:")) {
      URL.revokeObjectURL(videoContent.videoUrl);
    }
    setVideoContent((prev) => ({
      ...prev,
      videoFile: null,
      videoUrl: "",
    }));
  };

  const handleInputChange = (field: keyof VideoContent, value: string) => {
    setVideoContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="default" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to List</span>
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingContent ? `Editing: ${editingContent.title}` : "Create New Video Content"}
            </h2>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-[#FF9DB0] hover:bg-pink-600">
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
            {editingContent ? `Editing: ${editingContent.title}` : `Create New ${contentType}`}
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title Input */}
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

          {/* Video Upload */}
          <div className="space-y-2">
            <Label htmlFor="video">Video *</Label>
            {!videoContent.videoUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Upload your video file</p>
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("video-upload")?.click()}
                >
                  Choose Video File
                </Button>
              </div>
            ) : (
              <div className="relative">
                <video
                  src={videoContent.videoUrl}
                  controls
                  className="w-full max-h-[300px] rounded-lg"
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
          disabled={!videoContent.title || !videoContent.description || !videoContent.videoUrl}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </div>

      {/* Preview Section */}
      {showPreview && videoContent.title && videoContent.description && videoContent.videoUrl && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {editingContent ? `Preview: ${editingContent.title}` : "Video Preview"}
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Title Preview */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{videoContent.title}</h1>
              </div>

              {/* Description Preview */}
              <div>
                <p className="text-gray-700 leading-relaxed">{videoContent.description}</p>
              </div>

              {/* Video Preview */}
              <div className="mt-6">
                <video src={videoContent.videoUrl} controls className="w-full rounded-lg shadow-lg">
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoEditor;
