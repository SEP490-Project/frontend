import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContentManager } from "@/libs/hooks/useContent";
import { tiptapToHtml, isTipTapJson } from "@/libs/utils/tiptapConverter";
import type { TipTapDocument } from "@/libs/types/content";
import {
  Sparkles,
  Loader2,
  Zap,
  Settings,
  Brain,
  Target,
  StopCircle,
  Check,
  Copy,
} from "lucide-react";

interface AIGeneratedContentProps {
  onContentGenerated?: (content: string, tiptapJson?: TipTapDocument) => void;
  selectedPlatform?: string;
  className?: string;
}

const AIGeneratedContent: React.FC<AIGeneratedContentProps> = ({
  onContentGenerated,
  selectedPlatform = "",
  className = "",
}) => {
  const {
    loading,
    aiModels,
    isStreaming,
    streamingContent,
    streamingTipTapContent,
    tokensUsed,
    streamStructuredContentHook,
    cancelStreaming,
    fetchSupportedAIModels,
    clearStreamingContent,
  } = useContentManager();

  // Form states
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Structured generation form
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("");

  // Load AI models on mount
  useEffect(() => {
    fetchSupportedAIModels();
  }, [fetchSupportedAIModels]);

  // Set default model when models are loaded
  useEffect(() => {
    if (aiModels?.length > 0 && !selectedModel) {
      const firstProvider = aiModels.find(
        (provider) => provider.enable !== false && provider.models?.length > 0,
      );
      if (firstProvider && firstProvider.models[0]) {
        setSelectedModel(firstProvider.models[0]);
      }
    }
  }, [aiModels, selectedModel]);

  // Parse streaming content for preview
  const streamingPreviewHtml = useMemo(() => {
    if (!streamingContent) return "";

    // Try to parse as TipTap JSON and convert to HTML
    if (isTipTapJson(streamingContent)) {
      return tiptapToHtml(streamingContent);
    }

    // If it's partial JSON (still streaming), show raw content
    return `<pre class="whitespace-pre-wrap text-sm">${streamingContent}</pre>`;
  }, [streamingContent]);

  const handleStructuredGenerate = async () => {
    if (!context.trim() || !selectedModel || !selectedPlatform || !tone) return;

    await streamStructuredContentHook({
      context: context.trim(),
      model: selectedModel,
      platform: selectedPlatform,
      tone,
    });
  };

  const handleUseContent = () => {
    if (streamingContent && onContentGenerated) {
      // Check if it's TipTap JSON
      if (isTipTapJson(streamingContent)) {
        try {
          const tiptapDoc = JSON.parse(streamingContent) as TipTapDocument;
          const htmlContent = tiptapToHtml(tiptapDoc);
          onContentGenerated(htmlContent, tiptapDoc);
        } catch {
          onContentGenerated(streamingContent);
        }
      } else {
        onContentGenerated(streamingContent);
      }
      clearStreamingContent();
    } else if (streamingTipTapContent && onContentGenerated) {
      const htmlContent = tiptapToHtml(streamingTipTapContent);
      onContentGenerated(htmlContent, streamingTipTapContent);
      clearStreamingContent();
    }
  };

  const handleCopyContent = async () => {
    const textToCopy = streamingContent || "";
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleStopGeneration = () => {
    cancelStreaming();
  };

  const tones = [
    "Professional and engaging",
    "Casual and friendly",
    "Formal and informative",
    "Creative and inspiring",
    "Technical and detailed",
    "Promotional and persuasive",
  ];

  const hasStreamedContent = streamingContent.length > 0 || streamingTipTapContent !== null;

  return (
    <Card
      className={`w-full border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 ${className}`}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Content Generator</h3>
                <p className="text-sm text-gray-600">Generate content using AI models</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Brain className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block mb-1">AI Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent>
                {aiModels && aiModels.length > 0 ? (
                  aiModels
                    .filter((provider) => provider.enable !== false)
                    .flatMap((provider) =>
                      (provider.models || []).map((model: string) => (
                        <SelectItem key={model} value={model}>
                          <div className="flex items-center justify-between w-full">
                            <span>{model}</span>
                            <span className="text-xs text-gray-500 ml-2 capitalize">
                              ({provider.provider})
                            </span>
                          </div>
                        </SelectItem>
                      )),
                    )
                ) : (
                  <SelectItem value="no-models" disabled>
                    No AI models available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Structured Generation Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Content Context</label>
              <Textarea
                placeholder="Describe the context for your content (e.g., 'Promote our new AI-powered product that enhances productivity')"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-[80px] resize-none bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  <Target className="h-4 w-4 inline mr-1" />
                  Platform
                </label>
                <div className="flex items-center h-9 w-full px-3 bg-gray-100 border border-input rounded-md text-sm">
                  <span className="capitalize text-gray-700">
                    {selectedPlatform || "No platform selected"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Platform is set from the channel above</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  <Settings className="h-4 w-4 inline mr-1" />
                  Tone
                </label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="h-9 bg-white">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isStreaming ? (
              <Button onClick={handleStopGeneration} variant="destructive" className="w-full">
                <StopCircle className="h-4 w-4 mr-2" />
                Stop Generation
              </Button>
            ) : (
              <Button
                onClick={handleStructuredGenerate}
                disabled={
                  loading || !context.trim() || !selectedModel || !selectedPlatform || !tone
                }
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Streaming Content Preview */}
          {(isStreaming || hasStreamedContent) && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      {isStreaming ? "Generating..." : "Generated Content"}
                    </h4>
                    {isStreaming && <Loader2 className="h-4 w-4 animate-spin text-purple-600" />}
                  </div>
                  {tokensUsed && (
                    <Badge variant="outline" className="text-xs">
                      {tokensUsed.total_tokens} tokens
                    </Badge>
                  )}
                </div>

                <ScrollArea className="h-[200px] w-full rounded-md border bg-white p-4">
                  {streamingPreviewHtml ? (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: streamingPreviewHtml }}
                    />
                  ) : (
                    <p className="text-gray-400 text-sm">Waiting for content...</p>
                  )}
                </ScrollArea>

                {!isStreaming && hasStreamedContent && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleUseContent}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Use This Content
                    </Button>
                    <Button onClick={handleCopyContent} variant="outline" className="px-4">
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={clearStreamingContent}
                      variant="ghost"
                      className="px-4 text-gray-500"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIGeneratedContent;
