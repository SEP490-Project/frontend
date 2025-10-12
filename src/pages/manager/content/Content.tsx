import TiptapEditor from "@/components/global/Editor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Content } from "@/libs/types/content";
import ContentList from "@/components/manage/content/ContentList";
import { ArrowLeft } from "lucide-react";

type ContentType = "blog" | "video";
type ViewMode = "list" | "editor";

const ManageContent = () => {
  const [content, setContent] = useState<{ html: string; json: object } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [contentType, setContentType] = useState<ContentType>("blog");
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    if (content) {
      console.log("Saving content:", content);
      console.log("Content type:", contentType);
      // Here you would typically send the content to your API
    }
  };

  const handleCreateNew = () => {
    setEditingContent(null);
    setContent(null);
    setViewMode("editor");
    setShowPreview(false);
  };

  const handleEdit = (contentItem: Content) => {
    setEditingContent(contentItem);
    setContent({
      html: contentItem.html_content,
      json: contentItem.json_content,
    });
    setViewMode("editor");
    setShowPreview(false);
  };

  const handleView = (contentItem: Content) => {
    setEditingContent(contentItem);
    setContent({
      html: contentItem.html_content,
      json: contentItem.json_content,
    });
    setViewMode("editor");
    setShowPreview(true);
  };

  const handleBackToList = () => {
    setViewMode("list");
    setEditingContent(null);
    setContent(null);
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          {viewMode === "editor" && (
            <div className="flex items-center space-x-3">
              <Button
                variant="default"
                onClick={handleBackToList}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to List</span>
              </Button>
              <Select
                value={contentType}
                onValueChange={(value) => setContentType(value as ContentType)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSave} className="bg-[#FF9DB0] hover:bg-pink-600">
                {editingContent ? "Update Content" : "Save Content"}
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        {viewMode === "list" ? (
          /* Content List View */
          <ContentList onCreateNew={handleCreateNew} onEdit={handleEdit} onView={handleView} />
        ) : (
          /* Editor View */
          <div className="space-y-6">
            {/* Editor */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  {editingContent
                    ? `Editing: ${editingContent.title}`
                    : `Create New ${contentType}`}
                </h3>
              </CardHeader>
              <CardContent>
                <TiptapEditor
                  initialContent={
                    editingContent
                      ? editingContent.html_content
                      : "<h1>Heading1</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis nisl cursus bibendum et nulla accumsan sodales ornare. At urna viverra non suspendisse neque, lorem. Pretium condimentum pellentesque id gravida id eiam sit sed orci euismod. Rhoncus proin orci duis scelerisque molestie cursus tincidunt aliguam.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis nisl cursus bibendum et nulla accumsan sodales ornare. At urna viverra non suspendisse neque, lorem. Pretium condimentum pellentesque id gravida id eiam sit sed orci euismod. Rhoncus proin orci duis scelerisque molestie cursus tincidunt aliguam.</p>"
                  }
                  onChange={(data) => setContent(data)}
                />
              </CardContent>
            </Card>

            {/* Preview Toggle Button */}
            <div className="flex justify-center">
              <Button
                variant="default"
                onClick={() => setShowPreview(!showPreview)}
                className="w-[200px]"
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>

            {/* Preview Section */}
            {showPreview && content && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    {editingContent ? `Preview: ${editingContent.title}` : "Content Preview"}
                  </h3>
                </CardHeader>
                <CardContent>
                  <div
                    className="ProseMirror prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-blockquote:my-2 p-4 border rounded-md focus:outline-none"
                    dangerouslySetInnerHTML={{ __html: content.html }}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageContent;
