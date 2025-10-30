import React from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Tag } from "lucide-react";
import type { LegacyContent } from "@/libs/utils/contentConverter";
import { tiptapJsonToHtml, isTiptapJson } from "@/libs/helper/tiptapHelper";

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
  const formatDateTime = (dateTime: string | null | undefined) => {
    if (!dateTime) return "Unknown date";

    try {
      // Handle MySQL datetime format: "YYYY-MM-DD HH:MM:SS"
      // Replace space with 'T' to make it ISO 8601 compliant
      const isoDateTime = dateTime.replace(" ", "T");
      const date = new Date(isoDateTime);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateTime, "parsed as:", date);
        return "Unknown date";
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      console.error("Error parsing date:", dateTime, err);
      return "Unknown date";
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "posted":
      case "published":
        return <Badge className="bg-green-100 text-green-800">Posted</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "pending":
      case "await_staff":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status || "Unknown"}</Badge>;
    }
  };

  const getReadTimeEstimate = (htmlContent: string | null | undefined) => {
    // Return default if no content
    if (!htmlContent) return 1;

    // Check if content is TipTap JSON and convert it first
    let textContent: string;
    if (isTiptapJson(htmlContent)) {
      const html = tiptapJsonToHtml(htmlContent);
      textContent = html.replace(/<[^>]*>/g, "");
    } else {
      // Remove HTML tags and calculate reading time
      textContent = htmlContent.replace(/<[^>]*>/g, "");
    }
    const wordsPerMinute = 200;
    const wordCount = textContent.split(/\s+/).filter((word) => word.length > 0).length;
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
              <div className="flex flex-wrap items-center gap-2">
                {content.json_content &&
                typeof content.json_content === "object" &&
                "tags" in content.json_content &&
                Array.isArray((content.json_content as any).tags) &&
                (content.json_content as any).tags.length > 0 ? (
                  (content.json_content as any).tags.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-[#FF9DB0] hover:bg-pink-600 text-white border-0"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <div className="text-sm text-gray-400 italic">No tags</div>
                )}
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

            {/* Content Body */}
            <div>
              {(() => {
                if (!content.html_content) {
                  return (
                    <div className="text-gray-800 leading-relaxed">
                      <p className="mb-4">
                        {content.json_content &&
                        typeof content.json_content === "object" &&
                        "description" in content.json_content
                          ? String((content.json_content as any).description)
                          : "No content available."}
                      </p>
                    </div>
                  );
                }

                const htmlToDisplay = isTiptapJson(content.html_content)
                  ? tiptapJsonToHtml(content.html_content)
                  : content.html_content;
                return (
                  <div
                    dangerouslySetInnerHTML={{ __html: htmlToDisplay }}
                    className="ProseMirror prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-blockquote:my-2"
                  />
                );
              })()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDetailModal;
