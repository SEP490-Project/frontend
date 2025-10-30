import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X, Loader2, Tag } from "lucide-react";
import { toast } from "sonner";
import type { Content } from "@/libs/types/content";
import { manageContent } from "@/libs/services/manageContent";
import { tiptapJsonToHtml, isTiptapJson } from "@/libs/helper/tiptapHelper";

interface ContentPreviewProps {
  contentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onContentUpdated?: (content: Content) => void;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  contentId,
  isOpen,
  onClose,
  onContentUpdated,
}) => {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  // Fetch content details when modal opens
  useEffect(() => {
    const fetchContent = async () => {
      if (!contentId || !isOpen) return;

      setLoading(true);
      try {
        const response = await manageContent.contentDetail(contentId);
        if (response.data.success) {
          setContent(response.data.data);
        } else {
          toast.error("Failed to load content details");
        }
      } catch {
        toast.error("Failed to load content details");
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentId, isOpen]);

  // Handle approve content
  const handleApproveContent = async () => {
    if (!content) return;

    setApproving(true);
    try {
      await manageContent.approveContent(content.id);
      toast.success(`Content "${content.title}" has been approved for publication.`);

      // Update content status locally
      const updatedContent = { ...content, status: "APPROVED" };
      setContent(updatedContent);
      onContentUpdated?.(updatedContent);

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      toast.error("Failed to approve content. Please try again.");
    } finally {
      setApproving(false);
    }
  };

  // Handle reject content
  const handleRejectContent = async () => {
    if (!content) return;

    setRejecting(true);
    try {
      // Using a default rejection reason. In a real app, this should show a modal for reason input
      const reason = "Content requires revision to meet publication standards";
      await manageContent.rejectContent(content.id, reason);
      toast.success(`Content "${content.title}" has been rejected.`);

      // Update content status locally
      const updatedContent = { ...content, status: "REJECTED" };
      setContent(updatedContent);
      onContentUpdated?.(updatedContent);

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      toast.error("Failed to reject content. Please try again.");
    } finally {
      setRejecting(false);
    }
  };

  // Format date for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get reading time estimate
  const getReadingTime = (content: Content) => {
    try {
      let textContent = "";

      // Handle body field (TipTap JSON format)
      if (content.body && typeof content.body === "object") {
        // Convert TipTap JSON to HTML first, then extract text
        const htmlContent = tiptapJsonToHtml(JSON.stringify(content.body));
        textContent = htmlContent.replace(/<[^>]*>/g, "");
      } else if (content.html_content && typeof content.html_content === "string") {
        // Check if html_content is TipTap JSON
        if (isTiptapJson(content.html_content)) {
          const htmlContent = tiptapJsonToHtml(content.html_content);
          textContent = htmlContent.replace(/<[^>]*>/g, "");
        } else {
          textContent = content.html_content.replace(/<[^>]*>/g, "");
        }
      } else if (content.body && typeof content.body === "string") {
        textContent = content.body.replace(/<[^>]*>/g, "");
      }

      const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
      const readingTime = Math.ceil(wordCount / 200); // Average reading speed
      return `${readingTime} min read`;
    } catch {
      return "~ min read";
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AWAIT_STAFF":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
            Awaiting Review
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
            Rejected
          </Badge>
        );
      case "PUBLISHED":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
            Published
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600">
            {status}
          </Badge>
        );
    }
  };

  if (!contentId) return null;

  const isPending = content?.status === "AWAIT_STAFF";

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
              {content && (
                <div className="flex flex-wrap items-center gap-2">
                  {content.blog?.tags && content.blog.tags.length > 0 ? (
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
              )}
            </div>

            {/* Approval Actions - Only show for pending content */}
            {isPending && (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleRejectContent}
                  disabled={rejecting || approving}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                >
                  {rejecting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
                  onClick={handleApproveContent}
                  disabled={approving || rejecting}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  {approving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Approve for Publication
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pb-6 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                <span className="ml-3 text-gray-600">Loading content...</span>
              </div>
            ) : !content ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">Content not found</div>
                <div className="text-gray-400 text-sm mt-2">
                  The requested content could not be loaded.
                </div>
              </div>
            ) : (
              <>
                {/* Title */}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
                    {content.title}
                  </h1>

                  {/* Meta information */}
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <span>
                        {formatDateTime(content.created_at)} by{" "}
                        {content.blog?.author?.username || content.actor || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{getReadingTime(content)}</span>
                    </div>
                    <div>{getStatusBadge(content.status)}</div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                  {(() => {
                    try {
                      // Handle TipTap JSON format in body field
                      if (content.body && typeof content.body === "object") {
                        const htmlContent = tiptapJsonToHtml(JSON.stringify(content.body));
                        return (
                          <div
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                            className="ProseMirror prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-blockquote:my-2"
                          />
                        );
                      }

                      // Handle html_content field
                      if (content.html_content && typeof content.html_content === "string") {
                        if (isTiptapJson(content.html_content)) {
                          const htmlContent = tiptapJsonToHtml(content.html_content);
                          return (
                            <div
                              dangerouslySetInnerHTML={{ __html: htmlContent }}
                              className="ProseMirror prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-blockquote:my-2"
                            />
                          );
                        } else {
                          return <div dangerouslySetInnerHTML={{ __html: content.html_content }} />;
                        }
                      }

                      // Handle body as string
                      if (content.body && typeof content.body === "string") {
                        return <div dangerouslySetInnerHTML={{ __html: content.body }} />;
                      }

                      return <div className="text-gray-500 italic">No content available</div>;
                    } catch {
                      return <div className="text-red-500 italic">Error loading content</div>;
                    }
                  })()}
                </div>

                {/* Additional Content Info */}
                {content.blog?.excerpt && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Excerpt</h3>
                    <p className="text-gray-600 leading-relaxed">{content.blog.excerpt}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPreview;
