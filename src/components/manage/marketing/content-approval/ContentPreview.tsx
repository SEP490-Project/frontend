import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, ArrowLeft } from "lucide-react";
import type { Content } from "@/libs/types/content";
import { manageContent } from "@/libs/services/manageContent";

// Note: This component is currently using mock data
// Real API calls are commented out in the service layer

interface ContentPreviewProps {
  contentId: string;
  onBack: () => void;
  onApproveContent?: (content: Content) => void;
  onRejectContent?: (content: Content) => void;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  contentId,
  onBack,
  onApproveContent,
  onRejectContent,
}) => {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch content details - Using Mock Data
  useEffect(() => {
    const fetchContent = async () => {
      if (!contentId) return;

      setLoading(true);
      try {
        // Using mock data from manageContent service
        const response = await manageContent.contentDetail(contentId);
        setContent(response.data.data);

        // Comment out the API call above and uncomment below for real API implementation:
        // const response = await api.get(`/contents/${contentId}`);
        // setContent(response.data);
      } catch (error) {
        console.error("Error fetching content:", error);
        // Handle error - content not found in mock data
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentId]);

  // Format date for preview
  const formatDateLong = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get reading time estimate
  const getReadingTime = (htmlContent: string) => {
    const wordCount = htmlContent.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed
    return `${readingTime} min to read`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3">Loading content...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="text-center py-12">
              <div className="text-gray-500">Content not found</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button and Approval Actions */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Approval Actions in Header - Only show for pending content */}
        {content && content.status === "pending" && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => onRejectContent?.(content)}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 px-4"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => onApproveContent?.(content)}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve for Publication
            </Button>
          </div>
        )}
      </div>

      {/* Content Preview */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          {/* Category Badge */}
          <div className="mb-4">
            <Badge
              variant="secondary"
              className="text-purple-600 bg-purple-100 font-medium px-3 py-1 text-xs uppercase tracking-wide"
            >
              TRENDS & RESEARCH
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{content.title}</h1>

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>{formatDateLong(content.created_at)}</span>
            <span>by {content.actor}</span>
            <span>•</span>
            <span>{getReadingTime(content.html_content)}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-16 h-1 bg-purple-400 rounded mb-6"></div>

          {/* Content Image */}
          <div className="w-full h-48 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200/10 to-pink-200/10"></div>
            <div className="relative z-10">
              <div className="w-40 h-28 bg-white/90 rounded-md shadow-md flex items-center justify-center">
                <div className="text-gray-600 font-medium text-sm">Blog Content Image</div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="prose prose-base max-w-none text-gray-700 leading-relaxed mb-8">
            <div dangerouslySetInnerHTML={{ __html: content.html_content }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentPreview;
