import TiptapEditor from "@/components/global/Editor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import type { Content } from "@/libs/types/content";
import { ArrowLeft } from "lucide-react";

type ContentType = "blog" | "video";

interface BlogEditorProps {
  editingContent?: Content | null;
  onSave: (content: { html: string; json: object }, contentType: ContentType) => void;
  onBack: () => void;
}

const BlogEditor = ({ editingContent, onSave, onBack }: BlogEditorProps) => {
  const [content, setContent] = useState<{ html: string; json: object } | null>(
    editingContent
      ? {
          html: editingContent.html_content,
          json: editingContent.json_content,
        }
      : null,
  );
  const contentType = "blog";
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    if (content) {
      onSave(content, contentType);
    }
  };

  const defaultContent =
    "<h1>Heading1</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis nisl cursus bibendum et nulla accumsan sodales ornare. At urna viverra non suspendisse neque, lorem. Pretium condimentum pellentesque id gravida id eiam sit sed orci euismod. Rhoncus proin orci duis scelerisque molestie cursus tincidunt aliguam.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis nisl cursus bibendum et nulla accumsan sodales ornare. At urna viverra non suspendisse neque, lorem. Pretium condimentum pellentesque id gravida id eiam sit sed orci euismod. Rhoncus proin orci duis scelerisque molestie cursus tincidunt aliguam.</p>";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="default" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to List</span>
        </Button>
        <Button onClick={handleSave} className="bg-[#FF9DB0] hover:bg-pink-600">
          {editingContent ? "Update Content" : "Save Content"}
        </Button>
      </div>

      {/* Editor */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {editingContent ? `Editing: ${editingContent.title}` : `Create New ${contentType}`}
          </h3>
        </CardHeader>
        <CardContent>
          <TiptapEditor
            initialContent={editingContent ? editingContent.html_content : defaultContent}
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
  );
};

export default BlogEditor;
