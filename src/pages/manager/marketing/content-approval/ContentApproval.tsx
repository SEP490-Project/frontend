import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import ContentsList from "@/components/manage/marketing/content-approval/ContentsList";
import ContentPreviewModal from "@/components/manage/marketing/content-approval/ContentPreviewModal";
import type { Content } from "@/libs/types/content";
import { manageContent } from "@/libs/services/manageContent";

const ContentApproval: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Trigger refresh of content list
  const refreshContentList = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // Handle viewing content
  const handleViewContent = (content: Content) => {
    setSelectedContent(content);
    setPreviewModalOpen(true);
  };

  // Handle approving content
  const handleApproveContent = async (content: Content) => {
    if (actionLoading) return;

    setActionLoading(`approve-${content.id}`);
    try {
      // Use the approve service method
      await manageContent.approveContent(content.id);

      toast.success(`Content "${content.title}" has been approved and published.`);

      // Close modal and refresh list
      setPreviewModalOpen(false);
      refreshContentList();
    } catch (error) {
      console.error("Error approving content:", error);
      toast.error("Failed to approve content. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle rejecting content
  const handleRejectContent = async (content: Content) => {
    if (actionLoading) return;

    setActionLoading(`reject-${content.id}`);
    try {
      // Use the reject service method
      await manageContent.rejectContent(content.id);

      toast.success(`Content "${content.title}" has been rejected and moved to draft.`);

      // Close modal and refresh list
      setPreviewModalOpen(false);
      refreshContentList();
    } catch (error) {
      console.error("Error rejecting content:", error);
      toast.error("Failed to reject content. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <ContentsList
        key={refreshKey}
        onViewContent={handleViewContent}
        onApproveContent={handleApproveContent}
        onRejectContent={handleRejectContent}
      />

      {/* Content Preview Modal */}
      <ContentPreviewModal
        open={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
        content={selectedContent}
        onApprove={handleApproveContent}
        onReject={handleRejectContent}
        loading={actionLoading}
      />
    </div>
  );
};

export default ContentApproval;
