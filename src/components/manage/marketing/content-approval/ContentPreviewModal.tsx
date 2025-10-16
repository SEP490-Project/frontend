import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, X, Eye, Calendar, User } from "lucide-react";
import type { Content } from "@/libs/types/content";

interface ContentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: Content | null;
  onApprove?: (content: Content) => void;
  onReject?: (content: Content) => void;
  loading?: string | null;
}

const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({
  open,
  onOpenChange,
  content,
  onApprove,
  onReject,
  loading,
}) => {
  if (!content) return null;

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "posted":
        return "default";
      case "pending":
        return "secondary";
      case "draft":
        return "outline";
      default:
        return "outline";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format views
  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k views`;
    }
    return `${views} views`;
  };

  const handleApprove = () => {
    onApprove?.(content);
    onOpenChange(false);
  };

  const handleReject = () => {
    onReject?.(content);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold leading-tight">
                {content.title}
              </DialogTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {content.actor}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(content.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {formatViews(content.views)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {content.content_type || "blog"}
              </Badge>
              <Badge variant={getStatusVariant(content.status)} className="capitalize">
                {content.status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Content Body */}
        <div className="space-y-4">
          {/* Description */}
          {content.json_content &&
            typeof content.json_content === "object" &&
            "description" in content.json_content && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {(content.json_content as { description: string }).description}
                </p>
              </div>
            )}

          {/* HTML Content Preview */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Content Preview</h3>
            <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content.html_content }}
              />
            </div>
          </div>

          {/* Video Preview for video content */}
          {content.content_type === "video" &&
            content.json_content &&
            typeof content.json_content === "object" &&
            "videoUrl" in content.json_content && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Video</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="text-sm text-gray-600">
                    Video URL: {(content.json_content as { videoUrl: string }).videoUrl}
                  </div>
                </div>
              </div>
            )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">Created:</span>
              <div className="text-gray-600">{formatDate(content.created_at)}</div>
            </div>
            <div>
              <span className="font-medium text-gray-900">Last Updated:</span>
              <div className="text-gray-600">{formatDate(content.updated_at)}</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="text-sm text-gray-500">ID: {content.id}</div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {content.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={handleReject}
                  disabled={
                    loading === `reject-${content.id}` || loading === `approve-${content.id}`
                  }
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  {loading === `reject-${content.id}` ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={
                    loading === `approve-${content.id}` || loading === `reject-${content.id}`
                  }
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading === `approve-${content.id}` ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Approving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPreviewModal;
