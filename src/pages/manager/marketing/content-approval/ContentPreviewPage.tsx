import React, { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContentPreview from "@/components/manage/marketing/content-approval/ContentPreview";
import type { Content } from "@/libs/types/content";

const ContentPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate("/manage/marketing/content-approval");
  }, [navigate]);

  // Handle content updated
  const handleContentUpdated = (updatedContent: Content) => {
    // Handle content update if needed
    console.log("Content updated:", updatedContent);
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
    <>
      <ContentPreview
        contentId={id}
        isOpen={true}
        onClose={handleBack}
        onContentUpdated={handleContentUpdated}
      />
    </>
  );
};

export default ContentPreviewPage;
