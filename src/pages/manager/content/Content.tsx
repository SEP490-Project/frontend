import { useState } from "react";
import type { Content } from "@/libs/types/content";
import ContentList from "@/components/manage/content/ContentList";
import BlogEditor from "@/components/manage/content/BlogEditor";
import VideoEditor from "@/components/manage/content/VideoEditor";

type ViewMode = "list" | "editor";
type ContentType = "blog" | "video";

const ManageContent = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [currentContentType, setCurrentContentType] = useState<ContentType>("blog");

  const handleSave = (content: { html: string; json: object }, contentType: "blog" | "video") => {
    console.log("Saving content:", content);
    console.log("Content type:", contentType);
    // Here you would typically send the content to your API
  };

  const handleCreateNew = (contentType: ContentType = "blog") => {
    setEditingContent(null);
    setCurrentContentType(contentType);
    setViewMode("editor");
  };

  const handleEdit = (contentItem: Content) => {
    setEditingContent(contentItem);
    // Determine content type based on the json_content
    const contentType = (contentItem.json_content as any)?.type === "video" ? "video" : "blog";
    setCurrentContentType(contentType);
    setViewMode("editor");
  };

  const handleView = (contentItem: Content) => {
    setEditingContent(contentItem);
    // Determine content type based on the json_content
    const contentType = (contentItem.json_content as any)?.type === "video" ? "video" : "blog";
    setCurrentContentType(contentType);
    setViewMode("editor");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setEditingContent(null);
  };

  const handleContentTypeChange = (contentType: ContentType) => {
    setCurrentContentType(contentType);
  };

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Content */}
        {viewMode === "list" ? (
          /* Content List View */
          <ContentList onCreateNew={handleCreateNew} onEdit={handleEdit} onView={handleView} />
        ) : /* Editor View */
        currentContentType === "blog" ? (
          <BlogEditor
            editingContent={editingContent}
            onSave={handleSave}
            onBack={handleBackToList}
            onContentTypeChange={handleContentTypeChange}
          />
        ) : (
          <VideoEditor
            editingContent={editingContent}
            onSave={handleSave}
            onBack={handleBackToList}
            onContentTypeChange={handleContentTypeChange}
          />
        )}
      </div>
    </div>
  );
};

export default ManageContent;
