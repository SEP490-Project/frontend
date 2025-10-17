import TiptapEditor from "@/components/global/Editor";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { Content } from "@/libs/types/content";
import { ArrowLeft, User, Calendar, Target, FileText } from "lucide-react";
import {
  getTaskStatusDisplay,
  getTaskCampaignDisplay,
  getStatusBadgeVariant,
  getStatusBadgeClassName,
} from "@/libs/helper/taskUtils";

type ContentType = "blog" | "video";

interface BlogEditorProps {
  editingContent?: Content | null;
  selectedTask?: any;
  onSave: (content: { html: string; json: object }, contentType: ContentType) => void;
  onBack: () => void;
}

const BlogEditor = ({ editingContent, selectedTask, onSave, onBack }: BlogEditorProps) => {
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

  // Debug logging to verify task data
  React.useEffect(() => {
    if (selectedTask) {
      console.log("BlogEditor received task:", selectedTask);
      console.log("Task campaign:", selectedTask.campaign);
      console.log("Task status:", selectedTask.status);
    }
  }, [selectedTask]);

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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="default" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to List</span>
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingContent ? `Editing: ${editingContent.title}` : "Create New Blog Content"}
            </h2>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-[#FF9DB0] hover:bg-pink-600">
          {editingContent ? "Update Content" : "Save Content"}
        </Button>
      </div>

      {/* Task Details Panel */}
      {selectedTask && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Task: {selectedTask.title || "Untitled Task"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Campaign */}
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Campaign:</span>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {getTaskCampaignDisplay(selectedTask)}
                </Badge>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedTask.color || "#gray" }}
                />
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <Badge
                  variant={getStatusBadgeVariant(getTaskStatusDisplay(selectedTask))}
                  className={getStatusBadgeClassName(getTaskStatusDisplay(selectedTask))}
                >
                  {getTaskStatusDisplay(selectedTask)}
                </Badge>
              </div>

              {/* Assignee */}
              {selectedTask.details?.assignee && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Assignee:</span>
                  <span className="text-sm text-gray-600">{selectedTask.details.assignee}</span>
                </div>
              )}

              {/* Due Time */}
              {selectedTask.details?.dueTime && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Due:</span>
                  <span className="text-sm text-gray-600">{selectedTask.details.dueTime}</span>
                </div>
              )}

              {/* Priority */}
              {selectedTask.details?.priority && (
                <div className="flex items-center space-x-2 md:col-span-2">
                  <span className="text-sm font-medium text-gray-700">Priority:</span>
                  <Badge
                    variant="outline"
                    className={
                      selectedTask.details.priority === "High"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : selectedTask.details.priority === "Medium"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                    }
                  >
                    {selectedTask.details.priority}
                  </Badge>
                </div>
              )}
            </div>

            {/* Description */}
            {selectedTask.details?.description && (
              <div className="border-t pt-4">
                <span className="text-sm font-medium text-gray-700 block mb-2">Description:</span>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-md">
                  {selectedTask.details.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
