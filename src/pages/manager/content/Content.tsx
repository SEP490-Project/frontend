import { useState } from "react";
import type { Content, CreateContentRequest } from "@/libs/types/content";
import { useContentManager } from "@/libs/hooks/useContent";
import ContentList from "@/components/manage/content/ContentList";
import BlogEditor from "@/components/manage/content/BlogEditor";
import VideoEditor from "@/components/manage/content/VideoEditor";
import { Dialog } from "@/components/ui/dialog";
import { SaveConfirmModal } from "@/components/modal/content/SaveConfirmModal";
import { TaskProvider } from "@/libs/contexts/TaskContext";

type ViewMode = "list" | "editor";
type ContentType = "blog" | "video";

const ManageContent = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [currentContentType, setCurrentContentType] = useState<ContentType>("blog");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSaveData, setPendingSaveData] = useState<{
    content: CreateContentRequest | { html: string; json: object };
    contentType: "blog" | "video";
  } | null>(null);

  const { createNewContent, updateExistingContent, fetchContents } = useContentManager();

  const handleSave = async (
    content: CreateContentRequest | { html: string; json: object },
    contentType: "blog" | "video",
  ) => {
    // Store the pending save data and show confirmation modal
    setPendingSaveData({ content, contentType });
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingSaveData) return;

    const { content } = pendingSaveData;

    try {
      let apiData: CreateContentRequest;

      // Check if content is in new API format (CreateContentRequest) or old format
      if ("title" in content && "body" in content && "type" in content) {
        // New API format from BlogEditor
        apiData = content as CreateContentRequest;
      } else {
        // Old format from VideoEditor - convert to new API format
        const oldContent = content as { html: string; json: object };

        apiData = {
          title: (oldContent.json as any)?.title || "Untitled Video",
          body: oldContent.html,
          type: "POST",
          channels: [(oldContent.json as any)?.platform || "facebook"], // Video content defaults to selected platform
          task_id: selectedTask?.id?.toString() || null,
          affiliate_link: null,
          ai_generated_text: null,
          // Note: blog_fields is optional and not needed for video content
        };
      }

      let isSuccess = false;

      if (editingContent) {
        // Update existing content - add ID to the API data
        const updateData = {
          id: editingContent.id,
          ...apiData,
        };
        const updateResponse = await updateExistingContent(updateData);

        // Check if update was successful or failed
        if (updateResponse.meta.requestStatus === "fulfilled") {
          isSuccess = true;
        }
      } else {
        // Create new content
        const createResponse = await createNewContent(apiData);

        // Check if creation was successful or failed
        if (createResponse.meta.requestStatus === "fulfilled") {
          isSuccess = true;
        }
      }

      // Refresh the content list and go back to list view (only if successful)
      if (isSuccess) {
        await fetchContents({ page: 1, limit: 10 });
        handleBackToList();
      }

      // Close modal and clear pending data
      setShowConfirmModal(false);
      setPendingSaveData(null);
    } catch (error) {
      console.error("Error saving content:", error);

      // Close modal and clear pending data even on error
      setShowConfirmModal(false);
      setPendingSaveData(null);
    }
  };

  const handleCreateNew = (contentType: ContentType = "blog", task?: any) => {
    setEditingContent(null);
    setCurrentContentType(contentType);
    setSelectedTask(task);
    setViewMode("editor");
  };

  const handleEdit = (contentItem: Content) => {
    setEditingContent(contentItem);
    // Determine content type based on the json_content
    const contentType = (contentItem.json_content as any)?.type === "video" ? "video" : "blog";
    setCurrentContentType(contentType);
    setViewMode("editor");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setEditingContent(null);
    setSelectedTask(null);
  };

  return (
    <TaskProvider>
      <div className="min-h-screen p-5">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Main Content */}
          {viewMode === "list" ? (
            /* Content List View */
            <ContentList onCreateNew={handleCreateNew} onEdit={handleEdit} />
          ) : /* Editor View */
          currentContentType === "blog" ? (
            <BlogEditor
              editingContent={editingContent}
              selectedTask={selectedTask}
              onSave={handleSave}
              onBack={handleBackToList}
            />
          ) : (
            <VideoEditor
              editingContent={editingContent}
              selectedTask={selectedTask}
              onSave={handleSave}
              onBack={handleBackToList}
            />
          )}
        </div>

        {/* Save Confirmation Modal */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          {pendingSaveData && (
            <SaveConfirmModal
              contentTitle={(() => {
                if ("title" in pendingSaveData.content && "body" in pendingSaveData.content) {
                  return pendingSaveData.content.title;
                } else {
                  const oldContent = pendingSaveData.content as { html: string; json: object };
                  return (
                    (oldContent.json as any)?.title || `Untitled ${pendingSaveData.contentType}`
                  );
                }
              })()}
              contentType={pendingSaveData.contentType}
              isUpdate={!!editingContent}
              onConfirm={handleConfirmSave}
            />
          )}
        </Dialog>
      </div>
    </TaskProvider>
  );
};

export default ManageContent;
