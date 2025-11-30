import React, { useState, useEffect, useCallback } from "react";
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
import { useContentManager } from "@/libs/hooks/useContent";
import {
  Sparkles,
  Loader2,
  Send,
  FileText,
  Zap,
  Settings,
  Brain,
  MessageSquare,
  Target,
} from "lucide-react";

interface AIGeneratedContentProps {
  onContentGenerated?: (content: string) => void;
  onStructuredContentGenerated?: (content: any) => void;
  selectedPlatform?: string;
  className?: string;
}

const AIGeneratedContent: React.FC<AIGeneratedContentProps> = ({
  onContentGenerated,
  onStructuredContentGenerated,
  selectedPlatform = "",
  className = "",
}) => {
  const {
    loading,
    aiModels,
    generatedContent,
    structuredContent,
    generateAIContentHook,
    generateStructuredContentHook,
    fetchSupportedAIModels,
    clearAIGeneratedContent,
    clearAIStructuredContent,
  } = useContentManager();

  // Form states
  const [activeTab, setActiveTab] = useState<"simple" | "structured">("simple");
  const [selectedModel, setSelectedModel] = useState<string>("");

  // Simple generation form
  const [prompt, setPrompt] = useState("");
  const [jsonMode, setJsonMode] = useState(false);
  const [streamMode, setStreamMode] = useState(false);

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
      const firstModel = aiModels[0];
      const modelValue = firstModel.provider || firstModel.name || firstModel.id || "";
      if (modelValue) setSelectedModel(modelValue);
    }
  }, [aiModels, selectedModel]);

  // Handle generated content callback
  const handleGeneratedContent = useCallback(() => {
    if (generatedContent && onContentGenerated) {
      onContentGenerated(generatedContent);
      clearAIGeneratedContent();
    }
  }, [generatedContent, onContentGenerated, clearAIGeneratedContent]);

  // Handle structured content callback
  const handleStructuredContent = useCallback(() => {
    if (structuredContent && onStructuredContentGenerated) {
      onStructuredContentGenerated(structuredContent);
      clearAIStructuredContent();
    }
  }, [structuredContent, onStructuredContentGenerated, clearAIStructuredContent]);

  // Trigger callbacks when content is generated
  useEffect(() => {
    handleGeneratedContent();
    handleStructuredContent();
  }, [handleGeneratedContent, handleStructuredContent]);

  const handleSimpleGenerate = async () => {
    if (!prompt.trim() || !selectedModel) return;

    await generateAIContentHook({
      json_mode: jsonMode,
      model: selectedModel,
      prompt: prompt.trim(),
      stream: streamMode,
    });
  };

  const handleStructuredGenerate = async () => {
    if (!context.trim() || !selectedModel || !selectedPlatform || !tone) return;

    await generateStructuredContentHook({
      context: context.trim(),
      model: selectedModel,
      platform: selectedPlatform,
      stream: streamMode,
      tone,
    });
  };

  const tones = [
    "Professional and engaging",
    "Casual and friendly",
    "Formal and informative",
    "Creative and inspiring",
    "Technical and detailed",
    "Promotional and persuasive",
  ];

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

          {/* Tab Selection */}
          <div className="flex items-center space-x-1 bg-white rounded-lg p-1 border">
            <Button
              variant={activeTab === "simple" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("simple")}
              className={activeTab === "simple" ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Simple Generate
            </Button>
            <Button
              variant={activeTab === "structured" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("structured")}
              className={activeTab === "structured" ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              <FileText className="h-4 w-4 mr-2" />
              Structured Content
            </Button>
          </div>

          {/* Model Selection */}
          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium text-gray-700 block mb-1">AI Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent>
                {aiModels && aiModels.length > 0 ? (
                  aiModels
                    .filter((model) => model.enable !== false)
                    .map((model, index) => {
                      // API returns { provider, base_url, enable, models } structure
                      const modelValue =
                        model.provider || model.name || model.id || `model-${index}`;
                      const displayName =
                        model.provider || model.name || model.id || `Model ${index + 1}`;
                      const modelCount = model.models?.length || 0;
                      return (
                        <SelectItem key={`model-${index}`} value={modelValue}>
                          <div className="flex items-center justify-between w-full">
                            <span className="capitalize">{displayName}</span>
                            {modelCount > 0 && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({modelCount} models)
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })
                ) : (
                  <SelectItem value="no-models" disabled>
                    No AI models available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2">
            <Separator />
          </div>

          {/* Simple Generation Form */}
          {activeTab === "simple" && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Prompt</label>
                <Textarea
                  placeholder="Enter your content prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="jsonMode"
                    checked={jsonMode}
                    onChange={(e) => setJsonMode(e.target.checked)}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                  />
                  <label htmlFor="jsonMode" className="text-sm text-gray-700">
                    JSON Mode
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="streamMode"
                    checked={streamMode}
                    onChange={(e) => setStreamMode(e.target.checked)}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                  />
                  <label htmlFor="streamMode" className="text-sm text-gray-700">
                    Stream Response
                  </label>
                </div>
              </div>

              <Button
                onClick={handleSimpleGenerate}
                disabled={loading || !prompt.trim() || !selectedModel}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Structured Generation Form */}
          {activeTab === "structured" && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Content Context</label>
                <Textarea
                  placeholder="Describe the context for your content (e.g., 'Promote our new AI-powered product that enhances productivity')"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="min-h-[80px] resize-none"
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
                    <SelectTrigger className="h-9">
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="streamModeStructured"
                  checked={streamMode}
                  onChange={(e) => setStreamMode(e.target.checked)}
                  className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                />
                <label htmlFor="streamModeStructured" className="text-sm text-gray-700">
                  Stream Response
                </label>
              </div>

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
                    Generating Structured Content...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Structured Content
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIGeneratedContent;
