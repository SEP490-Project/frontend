import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X, Loader2, Tag, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { Content } from "@/libs/types/content";
import { tiptapJsonToHtml, isTiptapJson } from "@/libs/helper/tiptapHelper";
import RejectReasonModal from "./RejectFeedbackModal";
import {
  marketingContentDetail,
  marketingApproveContent,
  marketingRejectContent,
} from "@/libs/stores/contentMarketingManager/thunk";
import { useContentMarketing } from "@/libs/hooks/useContentMarketing";
import { useAppDispatch } from "@/libs/stores";

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
  const { content, loading } = useContentMarketing();
  const dispatch = useAppDispatch();
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Fetch content details when modal opens
  useEffect(() => {
    if (!contentId || !isOpen) return;

    const fetchContentDetail = async () => {
      try {
        await dispatch(marketingContentDetail(contentId));
      } catch {
        toast.error("Failed to load content details");
      }
    };

    fetchContentDetail();
  }, [contentId, isOpen, dispatch]);

  // Handle approve content
  const handleApproveContent = async () => {
    if (!content) return;

    setApproving(true);
    try {
      const result = await dispatch(marketingApproveContent(content.id));

      if (marketingApproveContent.fulfilled.match(result)) {
        toast.success(`Content "${content.title}" has been approved for publication.`);
        onContentUpdated?.(content as any);

        // Close modal after a short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error("Failed to approve content. Please try again.");
      }
    } catch {
      toast.error("Failed to approve content. Please try again.");
    } finally {
      setApproving(false);
    }
  };

  // Handle reject content - show modal
  const handleRejectContent = () => {
    setShowRejectModal(true);
  };

  // Handle confirm rejection with reason
  const handleConfirmReject = async (feedback: string) => {
    if (!content) return;

    setRejecting(true);
    try {
      const result = await dispatch(
        marketingRejectContent({
          id: content.id,
          feedback,
        }),
      );

      if (marketingRejectContent.fulfilled.match(result)) {
        toast.success(`Content "${content.title}" has been rejected.`);
        onContentUpdated?.(content as any);

        // Close modals
        setShowRejectModal(false);

        // Close main modal after a short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error("Failed to reject content. Please try again.");
      }
    } catch {
      toast.error("Failed to reject content. Please try again.");
    } finally {
      setRejecting(false);
    }
  };

  // Handle cancel rejection
  const handleCancelReject = () => {
    setShowRejectModal(false);
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
                        {content.blog?.author?.username || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{getReadingTime(content as any)}</span>
                    </div>
                    <div>{getStatusBadge(content.status)}</div>
                  </div>
                </div>

                {/* Rejection Feedback */}
                {content.status === "REJECTED" && content.rejection_feedback && (
                  <div className="border border-red-200 bg-red-50 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-red-800 text-sm mb-1">Rejection Feedback</p>
                        <p className="text-red-700 text-sm">{content.rejection_feedback}</p>
                      </div>
                    </div>
                  </div>
                )}

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

      {/* Reject Reason Modal */}
      <RejectReasonModal
        isOpen={showRejectModal}
        onClose={handleCancelReject}
        onConfirm={handleConfirmReject}
        contentTitle={content?.title || ""}
        isLoading={rejecting}
      />
    </Dialog>
  );
};

export default ContentPreview;
