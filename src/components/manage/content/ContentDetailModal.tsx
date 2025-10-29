import React from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle } from "lucide-react";
import type { LegacyContent } from "@/libs/utils/contentConverter";

interface ContentDetailModalProps {
  content: LegacyContent | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestApproval?: (contentId: string) => void;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({
  content,
  isOpen,
  onClose,
  onRequestApproval,
}) => {
  if (!content) return null;

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "posted":
        return <Badge className="bg-green-100 text-green-800">Posted</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getReadTimeEstimate = (htmlContent: string) => {
    // Remove HTML tags and calculate reading time
    const textContent = htmlContent.replace(/<[^>]*>/g, "");
    const wordsPerMinute = 200;
    const wordCount = textContent.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime > 0 ? readTime : 1;
  };

  const handleRequestApproval = () => {
    if (onRequestApproval) {
      onRequestApproval(content.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="text-sm text-purple-600 uppercase tracking-wide font-medium">
                TRENDS & RESEARCH
              </div>
            </div>
            {content.status === "draft" && (
              <Button
                onClick={handleRequestApproval}
                className="bg-[#FF9DB0] hover:bg-pink-600 text-white mr-2"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Request Approval
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pb-6 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
                {content.title}
              </h1>

              {/* Meta information */}
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <span>
                    {formatDateTime(content.date_time)} by {content.actor}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{getReadTimeEstimate(content.html_content)} min to read</span>
                </div>
                <div>{getStatusBadge(content.status)}</div>
              </div>
            </div>

            {/* Featured Image/Video */}
            <div className="w-full rounded-lg overflow-hidden">
              {content.content_type === "video" &&
              content.json_content &&
              typeof content.json_content === "object" &&
              "videoUrl" in content.json_content ? (
                <video
                  className="w-full aspect-video object-cover"
                  controls
                  poster="/api/placeholder/800/400"
                >
                  <source src={String((content.json_content as any).videoUrl)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src="/api/placeholder/800/400"
                  alt={content.title}
                  className="w-full aspect-video object-cover"
                />
              )}
            </div>

            {/* Content Body */}
            <div className="prose prose-lg max-w-none">
              {content.html_content ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: content.html_content,
                  }}
                  className="text-gray-800 leading-relaxed"
                />
              ) : (
                <div className="text-gray-800 leading-relaxed">
                  <p className="mb-4">
                    {content.json_content &&
                    typeof content.json_content === "object" &&
                    "description" in content.json_content
                      ? String((content.json_content as any).description)
                      : "No content available."}
                  </p>
                </div>
              )}

              {/* Sample content for demonstration */}
              <div className="mt-8 space-y-4">
                <p className="text-gray-800 leading-relaxed">
                  Curabiturem auctor lorem lorem volutpat maecenas lorem nunc bibendum a sem diam
                  feugiat lectus mauris ut enim eget vehicula ut id est.
                </p>
                <p className="text-gray-800 leading-relaxed">
                  Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit
                  amet fermentum. Aenean lacinia bibendum nulla sed consectetur.
                </p>

                <div className="bg-gray-50 p-6 rounded-lg my-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Heading</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vestibulum sagittis lorem vel susque lorem, cursus non lorem dolor auctor. Donec
                    mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio
                    sem nec elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDetailModal;
