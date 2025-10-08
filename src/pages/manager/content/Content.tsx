import TiptapEditor from "@/components/global/Editor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Content } from "@/libs/types/content";
import ContentList from "@/components/manage/content/ContentList";

const ManageContent = () => {
  const [content, setContent] = useState<{ html: string; json: object } | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const [editingContent, setEditingContent] = useState<Content | null>(null);

  const handleSave = () => {
    if (content) {
      console.log("Saving content:", content);
      // Here you would typically send the content to your API
    }
  };

  const handleCreateNew = () => {
    setEditingContent(null);
    setContent(null);
    setActiveTab("editor");
  };

  const handleEdit = (contentItem: Content) => {
    setEditingContent(contentItem);
    setContent({
      html: contentItem.html_content,
      json: contentItem.json_content,
    });
    setActiveTab("editor");
  };

  const handleView = (contentItem: Content) => {
    setEditingContent(contentItem);
    setContent({
      html: contentItem.html_content,
      json: contentItem.json_content,
    });
    setActiveTab("preview");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          {activeTab === "editor" && (
            <Button onClick={handleSave} className="bg-[#FF9DB0] hover:bg-pink-600">
              {editingContent ? "Update Content" : "Save Content"}
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">Content List</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <ContentList onCreateNew={handleCreateNew} onEdit={handleEdit} onView={handleView} />
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <TiptapEditor
              initialContent={
                editingContent
                  ? editingContent.html_content
                  : "<h1>Heading1</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis nisl cursus bibendum et nulla accumsan sodales ornare. At urna viverra non suspendisse neque, lorem. Pretium condimentum pellentesque id gravida id eiam sit sed orci euismod. Rhoncus proin orci duis scelerisque molestie cursus tincidunt aliguam.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis nisl cursus bibendum et nulla accumsan sodales ornare. At urna viverra non suspendisse neque, lorem. Pretium condimentum pellentesque id gravida id eiam sit sed orci euismod. Rhoncus proin orci duis scelerisque molestie cursus tincidunt aliguam.</p>"
              }
              onChange={(data) => setContent(data)}
            />

            {/* HTML Output Card */}
            {content && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">HTML Output</h3>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                    {content.html}
                  </pre>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            {content ? (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    {editingContent ? `Preview: ${editingContent.title}` : "Content Preview"}
                  </h3>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: content.html }}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <p>No content to preview. Please select a content item or create a new one.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageContent;
