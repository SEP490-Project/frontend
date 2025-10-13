import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Content } from "@/libs/types/content";
import { ArrowLeft, Upload, X } from "lucide-react";

type ContentType = "blog" | "video";

interface VideoEditorProps {
  editingContent?: Content | null;
  onSave: (content: { html: string; json: object }, contentType: ContentType) => void;
  onBack: () => void;
  onContentTypeChange?: (contentType: ContentType) => void;
}

interface VideoContent {
  title: string;
  description: string;
  videoFile: File | null;
  videoUrl: string;
}

const VideoEditor = ({ editingContent, onSave, onBack, onContentTypeChange }: VideoEditorProps) => {
  const [contentType, setContentType] = useState<ContentType>("video");
  const [showPreview, setShowPreview] = useState(false);
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
      <div className="flex items-center space-x-3">
        <Button variant="default" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to List</span>
        </Button>
        <Select
          value={contentType}
          onValueChange={(value) => {
            const newContentType = value as ContentType;
            setContentType(newContentType);
            if (newContentType !== "video" && onContentTypeChange) {
              onContentTypeChange(newContentType);
            }
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Content Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blog">Blog</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSave} className="bg-[#FF9DB0] hover:bg-pink-600">
          {editingContent ? "Update Content" : "Save Content"}
        </Button>
      </div>

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
