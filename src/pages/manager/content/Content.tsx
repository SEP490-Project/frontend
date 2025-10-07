import TiptapEditor from "@/components/global/Editor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ManageContent = () => {
  const [content, setContent] = useState<{ html: string; json: object } | null>(null);

  const handleSave = () => {
    if (content) {
      console.log("Saving content:", content);
      // Here you would typically send the content to your API
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <Button onClick={handleSave} className="bg-[#FF9DB0] hover:bg-pink-600">
            Save Content
          </Button>
        </div>

        {/* Editor */}
        <TiptapEditor
          initialContent="<h1>Heading1</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis nisl cursus bibendum et nulla accumsan sodales ornare. At urna viverra non suspendisse neque, lorem. Pretium condimentum pellentesque id gravida id eiam sit sed orci euismod. Rhoncus proin orci duis scelerisque molestie cursus tincidunt aliguam.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis nisl cursus bibendum et nulla accumsan sodales ornare. At urna viverra non suspendisse neque, lorem. Pretium condimentum pellentesque id gravida id eiam sit sed orci euismod. Rhoncus proin orci duis scelerisque molestie cursus tincidunt aliguam.</p>"
          onChange={(data) => setContent(data)}
        />

        {/* Preview Section */}
        {content && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Preview</h3>
              </CardHeader>
              <CardContent>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: content.html }}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageContent;
