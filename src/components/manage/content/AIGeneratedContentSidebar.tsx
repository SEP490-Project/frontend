import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useContent } from "@/libs/hooks/useContent";
import { useAppDispatch } from "@/libs/stores";
import { getSupportedAIModels } from "@/libs/stores/contentManager/thunk";
import { clearStreaming } from "@/libs/stores/contentManager/slice";
import {
  streamStructuredContentAction,
  cancelStreamingAction,
} from "@/libs/stores/contentManager/streamingActions";
import { tiptapToHtml, isTipTapJson } from "@/libs/utils/tiptapConverter";
import type { TipTapDocument } from "@/libs/types/content";
import { Sparkles, Loader2, Zap, StopCircle, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AIGeneratedContentProps {
  onContentGenerated?: (content: string, tiptapJson?: TipTapDocument) => void;
  selectedPlatform?: string;
  currentContent?: string; // Optional current content for refinement
  className?: string;
}

interface ModelProvider {
  provider: string;
  base_url: string;
  enable: boolean;
  models: string[];
}

const AIGeneratedContent: React.FC<AIGeneratedContentProps> = ({
  onContentGenerated,
  selectedPlatform = "",
  currentContent = "",
  className = "",
}) => {
  const dispatch = useAppDispatch();
  const { loading, aiModels, isStreaming, streamingContent, streamingTipTapContent, tokensUsed } =
    useContent();

  // Form states
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("");
  const [includeCurrentContent, setIncludeCurrentContent] = useState(false);

  // Load AI models on mount
  useEffect(() => {
    dispatch(getSupportedAIModels());
  }, [dispatch]);

  // Set default model when models are loaded
  useEffect(() => {
    if (aiModels?.length > 0 && !selectedModel) {
      const firstProvider = aiModels.find(
        (provider: ModelProvider) => provider.enable !== false && provider.models?.length > 0,
      );
      if (firstProvider && firstProvider.models[0]) {
        setSelectedModel(firstProvider.models[0]);
      }
    }
  }, [aiModels, selectedModel]);

  // Get provider name for a model
  const getProviderForModel = (modelId: string): string | undefined => {
    for (const provider of (aiModels as ModelProvider[]) || []) {
      if (provider.models?.includes(modelId)) {
        return provider.provider;
      }
    }
    return undefined;
  };

  // Handle content generation complete
  useEffect(() => {
    if (!isStreaming && streamingContent && onContentGenerated) {
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
      dispatch(clearStreaming());
    } else if (!isStreaming && streamingTipTapContent && onContentGenerated) {
      const htmlContent = tiptapToHtml(streamingTipTapContent);
      onContentGenerated(htmlContent, streamingTipTapContent);
      dispatch(clearStreaming());
    }
  }, [isStreaming, streamingContent, streamingTipTapContent, onContentGenerated, dispatch]);

  const handleGenerate = async () => {
    if (!context.trim() || !selectedModel || !selectedPlatform || !tone) return;

    // Build context with optional current content
    let fullContext = context.trim();
    if (includeCurrentContent && currentContent) {
      // Strip HTML tags for plain text
      const plainContent = currentContent.replace(/<[^>]*>/g, "").trim();
      if (plainContent) {
        fullContext = `Current content: ${plainContent}\n\nRequested changes: ${context.trim()}`;
      }
    }

    await dispatch(
      streamStructuredContentAction({
        context: fullContext,
        model: selectedModel,
        platform: selectedPlatform,
        tone,
      }),
    );
  };

  const handleStopGeneration = () => {
    dispatch(cancelStreamingAction());
  };

  const tones = [
    "Professional and engaging",
    "Casual and friendly",
    "Formal and informative",
    "Creative and inspiring",
    "Technical and detailed",
    "Promotional and persuasive",
  ];

  const canGenerate = context.trim() && selectedModel && selectedPlatform && tone;

  return (
    <Card
      className={`border-purple-200 bg-gradient-to-br from-purple-50/50 to-blue-50/50 ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-md">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            </div>
            AI Generator
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="text-xs">
                  Describe your content idea and AI will generate blog content for you. The
                  generated content will appear in the editor for review.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Context Textarea */}
        <div className="space-y-1.5">
          <Textarea
            placeholder={
              includeCurrentContent
                ? "Describe what changes you want to make..."
                : "Describe your content idea... (e.g., 'Write about the benefits of our new AI-powered productivity tool')"
            }
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="min-h-[80px] resize-none bg-white text-sm"
          />
          {currentContent && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="include-current"
                checked={includeCurrentContent}
                onChange={(e) => setIncludeCurrentContent(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-gray-300"
              />
              <label htmlFor="include-current" className="text-xs text-gray-600 cursor-pointer">
                Refine existing content (include current content as context)
              </label>
            </div>
          )}
        </div>

        {/* Model & Tone Selectors - Bottom of textarea area */}
        <div className="flex gap-2">
          {/* Tiered Model Selector */}
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="flex-1 h-8 text-xs bg-white">
              <SelectValue placeholder="Select model">
                {selectedModel && (
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400 capitalize">
                      {getProviderForModel(selectedModel)}:
                    </span>
                    <span>{selectedModel}</span>
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {aiModels && aiModels.length > 0 ? (
                (aiModels as ModelProvider[])
                  .filter((provider) => provider.enable !== false && provider.models?.length > 0)
                  .map((provider) => (
                    <SelectGroup key={provider.provider}>
                      <SelectLabel className="flex items-center gap-2 text-xs font-semibold text-gray-700 capitalize py-1.5">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {provider.provider}
                        </Badge>
                      </SelectLabel>
                      {provider.models.map((model: string) => (
                        <SelectItem key={model} value={model} className="pl-6 text-xs">
                          <span className="flex items-center gap-1">
                            <span className="text-gray-400">└</span>
                            {model}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))
              ) : (
                <SelectItem value="no-models" disabled>
                  No AI models available
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          {/* Tone Selector */}
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="flex-1 h-8 text-xs bg-white">
              <SelectValue placeholder="Tone" />
            </SelectTrigger>
            <SelectContent>
              {tones.map((t) => (
                <SelectItem key={t} value={t} className="text-xs">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Platform indicator */}
        {selectedPlatform && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>Platform:</span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
              {selectedPlatform}
            </Badge>
          </div>
        )}

        {/* Generate Button */}
        {isStreaming ? (
          <Button
            onClick={handleStopGeneration}
            variant="destructive"
            className="w-full h-9 text-sm"
          >
            <StopCircle className="h-4 w-4 mr-2" />
            Stop Generation
          </Button>
        ) : (
          <Button
            onClick={handleGenerate}
            disabled={loading || !canGenerate}
            className="w-full h-9 text-sm bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        )}

        {/* Streaming indicator */}
        {isStreaming && (
          <div className="flex items-center justify-center gap-2 py-2 text-xs text-purple-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>AI is generating content...</span>
          </div>
        )}

        {/* Tokens used indicator */}
        {tokensUsed && (
          <div className="text-center">
            <Badge variant="outline" className="text-[10px]">
              {tokensUsed.total_tokens} tokens used
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIGeneratedContent;
