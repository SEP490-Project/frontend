import React from "react";
import ContentsList from "@/components/manage/marketing/content-approval/ContentsList";
import type { Content } from "@/libs/types/content";

const ContentApproval: React.FC = () => {
  // Handle viewing content (now handled internally by ContentsList)
  const handleViewContent = (content: Content) => {
    // This is now handled internally by ContentsList
    console.log("Viewing content:", content.title);
  };

  return (
    <div className="min-h-screen p-6">
      <ContentsList onViewContent={handleViewContent} />
    </div>
  );
};

export default ContentApproval;
