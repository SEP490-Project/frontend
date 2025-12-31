import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Copy, X, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ContentDiffPreviewProps {
  currentContent: string; // HTML content
  generatedContent: string; // HTML content
  onApply: () => void;
  onDiscard: () => void;
  isVisible: boolean;
}

const ContentDiffPreview: React.FC<ContentDiffPreviewProps> = ({
  currentContent,
  generatedContent,
  onApply,
  onDiscard,
  isVisible,
}) => {
  const [copied, setCopied] = React.useState(false);

  const hasCurrentContent = useMemo(() => {
    if (!currentContent) return false;
    const stripped = currentContent
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, "")
      .trim();
    return (
      stripped.length > 0 &&
      currentContent !== "<p></p>" &&
      currentContent !== "<p>Start typing...</p>"
    );
  }, [currentContent]);

  const handleCopy = async () => {
    try {
      // Strip HTML tags for plain text copy
      const plainText = generatedContent.replace(/<[^>]*>/g, "");
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      toast.success("Content copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy content");
    }
  };

  if (!isVisible || !generatedContent) return null;

  return (
    <Card className="w-full border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            AI Generated Content
          </CardTitle>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Preview
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasCurrentContent ? (
          // Side-by-side diff view
          <div className="grid grid-cols-2 gap-4">
            {/* Current Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Current Content</span>
                <Badge variant="outline" className="text-xs">
                  Original
                </Badge>
              </div>
              <ScrollArea className="h-[200px] w-full rounded-md border bg-white p-3">
                <div
                  className="prose prose-sm max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: currentContent }}
                />
              </ScrollArea>
            </div>

            {/* Arrow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
              <ArrowRight className="h-6 w-6 text-purple-400" />
            </div>

            {/* Generated Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Generated Content</span>
                <Badge className="text-xs bg-purple-100 text-purple-700 border-0">
                  AI Generated
                </Badge>
              </div>
              <ScrollArea className="h-[200px] w-full rounded-md border border-purple-200 bg-white p-3">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: generatedContent }}
                />
              </ScrollArea>
            </div>
          </div>
        ) : (
          // Single view when no current content
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Generated Content</span>
              <Badge className="text-xs bg-purple-100 text-purple-700 border-0">AI Generated</Badge>
            </div>
            <ScrollArea className="h-[250px] w-full rounded-md border border-purple-200 bg-white p-4">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: generatedContent }}
              />
            </ScrollArea>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button onClick={onApply} className="flex-1 bg-green-600 hover:bg-green-700">
            <Check className="h-4 w-4 mr-2" />
            {hasCurrentContent ? "Replace Content" : "Use This Content"}
          </Button>
          <Button onClick={handleCopy} variant="outline" className="px-4">
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            onClick={onDiscard}
            variant="ghost"
            className="px-4 text-gray-500 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {hasCurrentContent && (
          <p className="text-xs text-gray-500 text-center">
            Click "Replace Content" to replace your current content with the AI-generated version,
            or copy the generated content to merge manually.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentDiffPreview;
