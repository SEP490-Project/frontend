import React from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Tag, XCircle } from "lucide-react";
import type { Content } from "@/libs/types/content";
import { tiptapJsonToHtml, isTiptapJson } from "@/libs/helper/tiptapHelper";

interface ContentDetailModalProps {
  content: Content | null;
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
    const normalizedStatus = status?.toUpperCase();
    switch (normalizedStatus) {
      case "APPROVED":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
            Approved
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100">
            Draft
          </Badge>
        );
      case "AWAIT_STAFF":
      case "PENDING":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
            Awaiting Review
          </Badge>
        );
      case "AWAIT_BRAND":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100">
            Awaiting Brand
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
            Rejected
          </Badge>
        );
      case "POSTED":
      case "PUBLISHED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
            Published
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600">
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  const getReadTimeEstimate = (htmlContent: string | object | null | undefined) => {
    // Return default if no content
    if (!htmlContent) return 1;

    let textContent: string;

    if (typeof htmlContent === "string") {
      // Check if content is TipTap JSON and convert it first
      if (isTiptapJson(htmlContent)) {
        const html = tiptapJsonToHtml(htmlContent);
        textContent = html.replace(/<[^>]*>/g, "");
      } else {
        // Remove HTML tags and calculate reading time
        textContent = htmlContent.replace(/<[^>]*>/g, "");
      }
    } else if (typeof htmlContent === "object" && htmlContent !== null) {
      // If it's a TipTap JSON object, convert to HTML first
      try {
        const html = tiptapJsonToHtml(htmlContent);
        textContent = html.replace(/<[^>]*>/g, "");
      } catch {
        // If conversion fails, treat as empty content
        textContent = "";
      }
    } else {
      textContent = String(htmlContent).replace(/<[^>]*>/g, "");
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
                {content.blog?.tags &&
                Array.isArray(content.blog.tags) &&
                content.blog.tags.length > 0 ? (
                  content.blog.tags.map((tag: string, index: number) => (
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
            {(content.status === "DRAFT" || content.status === "REJECTED") && (
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
                    {formatDateTime(content.updated_at)} by{" "}
                    {content.blog?.author?.username || content.actor || "System"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{getReadTimeEstimate(content.body)} min to read</span>
                </div>
                <div>{getStatusBadge(content.status)}</div>
              </div>

              {/* Rejection Feedback */}
              {content.status === "REJECTED" && content.rejection_feedback && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-red-800 mb-1">Reject Reason</h3>
                      <p className="text-red-700 text-sm leading-relaxed">
                        {content.rejection_feedback}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div>
              {(() => {
                if (!content.body) {
                  return (
                    <div className="text-gray-800 leading-relaxed">
                      <p className="mb-4">No content available.</p>
                    </div>
                  );
                }

                // Handle different content body formats
                let htmlToDisplay: string;

                if (typeof content.body === "string") {
                  // If body is already a string, check if it's TipTap JSON or HTML
                  if (isTiptapJson(content.body)) {
                    htmlToDisplay = tiptapJsonToHtml(content.body);
                  } else {
                    htmlToDisplay = content.body;
                  }
                } else if (typeof content.body === "object" && content.body !== null) {
                  // If body is an object (TipTap JSON), convert it to HTML
                  try {
                    htmlToDisplay = tiptapJsonToHtml(content.body);
                  } catch {
                    // If conversion fails, show the JSON as formatted text
                    htmlToDisplay = `<pre>${JSON.stringify(content.body, null, 2)}</pre>`;
                  }
                } else {
                  htmlToDisplay = String(content.body);
                }

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
