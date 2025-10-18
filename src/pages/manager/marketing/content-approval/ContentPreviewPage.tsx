import React, { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContentPreview from "@/components/manage/marketing/content-approval/ContentPreview";
import type { Content } from "@/libs/types/content";
import { manageContent } from "@/libs/services/manageContent";

const ContentPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate("/manage/marketing/content-approval");
  }, [navigate]);

  // Handle approving content
  const handleApproveContent = async (content: Content) => {
    try {
      await manageContent.approveContent(content.id);
      toast.success(`Content "${content.title}" has been approved and published.`);
      handleBack();
    } catch (error) {
      console.error("Error approving content:", error);
      toast.error("Failed to approve content. Please try again.");
    }
  };

  // Handle rejecting content
  const handleRejectContent = async (content: Content) => {
    try {
      await manageContent.rejectContent(content.id);
      toast.success(`Content "${content.title}" has been rejected and moved to draft.`);
      handleBack();
    } catch (error) {
      console.error("Error rejecting content:", error);
      toast.error("Failed to reject content. Please try again.");
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Invalid content ID</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <ContentPreview
        contentId={id}
        onBack={handleBack}
        onApproveContent={handleApproveContent}
        onRejectContent={handleRejectContent}
      />
    </div>
  );
};

export default ContentPreviewPage;
