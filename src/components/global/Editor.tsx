import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { VideoExtension } from "./tiptap-extensions/VideoExtension";
import { YoutubeExtension } from "./tiptap-extensions/YoutubeExtension";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import FileUploader from "@/components/global/FileUploader";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Highlighter,
  Undo,
  Redo,
  Quote,
  Video,
  UploadCloud,
  Link as LinkIcon,
  Unlink,
  Check,
  Copy,
  X,
  Sparkles,
  Minus,
} from "lucide-react";
import { isTiptapJson } from "@/libs/helper/tiptapHelper";
import { useAuth } from "@/libs/hooks/useAuth";

interface TiptapEditorProps {
  initialContent?: string | object;
  onChange?: (content: { html: string; json: object }) => void;
  // Diff mode props
  diffMode?: boolean;
  diffContent?: string; // HTML content to compare against
  onDiffAccept?: () => void;
  onDiffReject?: () => void;
  onDiffCopy?: () => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  initialContent = "<p>Start typing...</p>",
  onChange,
  diffMode = false,
  diffContent,
  onDiffAccept,
  onDiffReject,
  onDiffCopy,
}) => {
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTab, setVideoTab] = useState<"upload" | "url">("upload");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageTab, setImageTab] = useState<"upload" | "url">("upload");
  const [copied, setCopied] = useState(false);

  // Convert initial content to proper format
  const getInitialContent = () => {
    if (!initialContent) return "<p>Start typing...</p>";

    // If it's a string, check if it's JSON
    if (typeof initialContent === "string") {
      if (isTiptapJson(initialContent)) {
        // Parse and return JSON object
        try {
          return JSON.parse(initialContent);
        } catch {
          return initialContent;
        }
      }
      return initialContent;
    }

    // If it's already an object, return it
    return initialContent;
  };

  const { user } = useAuth();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({
        HTMLAttributes: { class: "max-w-full h-auto rounded-lg border" },
      }),
      VideoExtension, // Register Custom Video Extension
      YoutubeExtension, // Register YouTube Extension for AI-generated content
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: { class: "highlight" },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph", "image", "video"],
      }),
    ],
    content: getInitialContent(),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base focus:outline-none min-h-[300px] p-4 dark:prose-invert border rounded-md max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-blockquote:my-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.({
        html: editor.getHTML(),
        json: editor.getJSON(),
      });
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) return null;

  // Word count function
  const getWordCount = () => {
    const text = editor.getText();
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return words.length;
  };

  const getCharacterCount = () => editor.getText().length;

  // --- Image Handlers ---
  const handleImageUploadComplete = (urls: string[]) => {
    if (urls.length > 0) {
      editor?.chain().focus().setImage({ src: urls[0] }).run();
      setShowImageUploader(false);
    }
  };

  // --- Video Handlers ---
  const handleVideoUploadComplete = (urls: string[]) => {
    if (urls.length > 0) {
      editor?.chain().focus().setVideo({ src: urls[0] }).run();
      setShowVideoDialog(false);
      setVideoTab("upload");
    }
  };

  const handleVideoUrlSubmit = () => {
    if (videoUrl) {
      editor?.chain().focus().setVideo({ src: videoUrl }).run();
      setShowVideoDialog(false);
      setVideoUrl("");
      setVideoTab("upload");
    }
  };

  // --- Diff Mode Copy Handler ---
  const handleDiffCopy = async () => {
    if (diffContent) {
      try {
        const plainText = diffContent.replace(/<[^>]*>/g, "");
        await navigator.clipboard.writeText(plainText);
        setCopied(true);
        toast.success("Content copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
        onDiffCopy?.();
      } catch (err) {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy content");
      }
    }
  };

  // --- Link Handlers ---
  const openLinkDialog = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setShowLinkDialog(true);
  };

  const handleLinkSubmit = () => {
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    }
    setShowLinkDialog(false);
    setLinkUrl("");
  };

  // --- Image URL Handler ---
  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      setShowImageUploader(false);
      setImageUrl("");
      setImageTab("upload");
    }
  };

  // Color Palette
  const colors = [
    "#000000",
    "#434343",
    "#666666",
    "#999999",
    "#b7b7b7",
    "#cccccc",
    "#d9d9d9",
    "#efefef",
    "#f3f3f3",
    "#ffffff",
    "#980000",
    "#ff0000",
    "#ff9900",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#4a86e8",
    "#0000ff",
    "#9900ff",
    "#ff00ff",
    "#e6b8af",
    "#f4cccc",
    "#fce5cd",
    "#fff2cc",
    "#d9ead3",
    "#d0e0e3",
    "#c9daf8",
    "#cfe2f3",
    "#d9d2e9",
    "#ead1dc",
    "#dd7e6b",
    "#ea9999",
    "#f9cb9c",
    "#ffe599",
    "#b6d7a8",
    "#a2c4c9",
    "#a4c2f4",
    "#9fc5e8",
    "#b4a7d6",
    "#d5a6bd",
    "#cc4125",
    "#e06666",
    "#f6b26b",
    "#ffd966",
    "#93c47d",
    "#76a5af",
    "#6d9eeb",
    "#6fa8dc",
    "#8e7cc3",
    "#c27ba0",
    "#a61e4d",
    "#cc0000",
    "#e69138",
    "#f1c232",
    "#6aa84f",
    "#45818e",
    "#3c78d8",
    "#3d85c6",
    "#674ea7",
    "#a64d79",
    "#85200c",
    "#990000",
    "#b45f06",
    "#bf9000",
    "#38761d",
    "#134f5c",
    "#1155cc",
    "#0b5394",
    "#351c75",
    "#741b47",
    "#5b0f00",
    "#660000",
    "#783f04",
    "#7f6000",
    "#274e13",
    "#0c343d",
    "#1c4587",
    "#073763",
    "#20124d",
    "#4c1130",
  ];

  return (
    <Card className="w-full mx-auto shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <div className="flex flex-wrap items-center gap-1">
            {/* Undo/Redo */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-5" />

            {/* Text Formatting */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-muted" : ""}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-muted" : ""}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "bg-muted" : ""}
            >
              <UnderlineIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "bg-muted" : ""}
            >
              <Strikethrough className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-5" />

            {/* Text Color */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Palette className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-10 gap-1 p-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => editor.chain().focus().setColor(color).run()}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Highlight Color */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Highlighter className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-10 gap-1 p-2">
                  <button
                    className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform bg-transparent"
                    onClick={() => editor.chain().focus().unsetHighlight().run()}
                  >
                    <Minus className="w-3 h-3 mx-auto" />
                  </button>
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => editor.chain().focus().setHighlight({ color }).run()}
                      title={`Set highlight color to ${color}`}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className="mx-1 h-5" />

            {/* Headings */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
            >
              <Heading1 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
            >
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
            >
              <Heading3 className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-5" />

            {/* Lists */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-muted" : ""}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-muted" : ""}
            >
              <ListOrdered className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-5" />

            {/* Text Alignment */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={editor.isActive({ textAlign: "left" }) ? "bg-muted" : ""}
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              className={editor.isActive({ textAlign: "center" }) ? "bg-muted" : ""}
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={editor.isActive({ textAlign: "right" }) ? "bg-muted" : ""}
            >
              <AlignRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              className={editor.isActive({ textAlign: "justify" }) ? "bg-muted" : ""}
            >
              <AlignJustify className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-5" />

            {/* Quote */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive("blockquote") ? "bg-muted" : ""}
            >
              <Quote className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-5" />

            {/* Media Group */}
            <Button
              variant="ghost"
              size="icon"
              onClick={openLinkDialog}
              className={editor.isActive("link") ? "bg-muted" : ""}
            >
              <Link2 className="w-4 h-4" />
            </Button>
            {/* Link Removal */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={!editor.isActive("link")}
            >
              <Unlink className="w-4 h-4" />
            </Button>

            {/* Image Dialog with Tabs */}
            <Dialog
              open={showImageUploader}
              onOpenChange={(open) => {
                setShowImageUploader(open);
                if (!open) {
                  setImageUrl("");
                  setImageTab("upload");
                }
              }}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setShowImageUploader(true)}>
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Insert Image</DialogTitle>
                </DialogHeader>
                <Tabs
                  value={imageTab}
                  onValueChange={(v) => setImageTab(v as "upload" | "url")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                      <UploadCloud className="w-4 h-4" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger value="url" className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      URL
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="mt-4">
                    <FileUploader
                      userId={user?.id || ""}
                      accept="image/*"
                      multiple={false}
                      maxSize={5}
                      maxFiles={1}
                      allowedTypes={["jpg", "jpeg", "png", "gif", "webp"]}
                      onUploadComplete={handleImageUploadComplete}
                      title="Select Image"
                    />
                  </TabsContent>
                  <TabsContent value="url" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-url">Image URL</Label>
                      <Input
                        id="image-url"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleImageUrlSubmit();
                          }
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter a direct link to an image (jpg, png, gif, webp)
                      </p>
                    </div>
                    <Button onClick={handleImageUrlSubmit} disabled={!imageUrl} className="w-full">
                      Insert Image
                    </Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {/* Video Dialog with Tabs (No Popover) */}
            <Dialog
              open={showVideoDialog}
              onOpenChange={(open) => {
                setShowVideoDialog(open);
                if (!open) {
                  setVideoUrl("");
                  setVideoTab("upload");
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={editor.isActive("video") ? "bg-muted" : ""}
                  onClick={() => setShowVideoDialog(true)}
                >
                  <Video className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Insert Video</DialogTitle>
                </DialogHeader>
                <Tabs value={videoTab} onValueChange={(v) => setVideoTab(v as "upload" | "url")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">
                      <UploadCloud className="w-4 h-4 mr-2" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger value="url">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      URL
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="mt-4">
                    <FileUploader
                      userId={user?.id || ""}
                      accept="video/*"
                      multiple={false}
                      maxSize={50}
                      maxFiles={1}
                      allowedTypes={["mp4", "webm", "ogg"]}
                      onUploadComplete={handleVideoUploadComplete}
                      title="Select Video"
                    />
                  </TabsContent>
                  <TabsContent value="url" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="video-url">Video URL</Label>
                      <Input
                        id="video-url"
                        type="url"
                        placeholder="https://example.com/video.mp4"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleVideoUrlSubmit();
                          }
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter a direct link to a video (mp4, webm, ogg) or YouTube URL
                      </p>
                    </div>
                    <Button onClick={handleVideoUrlSubmit} disabled={!videoUrl} className="w-full">
                      Insert Video
                    </Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {/* Link Dialog */}
            <Dialog
              open={showLinkDialog}
              onOpenChange={(open) => {
                setShowLinkDialog(open);
                if (!open) setLinkUrl("");
              }}
            >
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Insert Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="link-url">URL</Label>
                    <Input
                      id="link-url"
                      type="url"
                      placeholder="https://example.com"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleLinkSubmit();
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter a URL to link the selected text. Leave empty to remove link.
                    </p>
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleLinkSubmit}>
                    {linkUrl ? "Apply Link" : "Remove Link"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Word Count Section */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-md">
            <span>{getWordCount()} words</span>
            <Separator orientation="vertical" className="h-4" />
            <span>{getCharacterCount()} characters</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="p-6">
            {diffMode && diffContent ? (
              // Diff Mode: Side-by-side comparison like IDE
              <div className="space-y-4">
                {/* Diff Header */}
                <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">
                      AI Generated Content Preview
                    </span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                      Review Changes
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={handleDiffCopy} className="h-8 px-2">
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onDiffReject}
                      className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Discard
                    </Button>
                    <Button
                      size="sm"
                      onClick={onDiffAccept}
                      className="h-8 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                  </div>
                </div>

                {/* Side-by-side Diff View */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Current Content - Left Panel */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Current Content
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Original
                      </Badge>
                    </div>
                    <div className="border rounded-lg bg-gray-50/50 overflow-hidden">
                      <ScrollArea className="h-[400px]">
                        <div className="p-4">
                          <EditorContent editor={editor} />
                        </div>
                      </ScrollArea>
                    </div>
                  </div>

                  {/* Generated Content - Right Panel */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                        AI Generated
                      </span>
                      <Badge className="text-xs bg-purple-100 text-purple-700 border-0">New</Badge>
                    </div>
                    <div className="border border-purple-200 rounded-lg bg-purple-50/30 overflow-hidden">
                      <ScrollArea className="h-[400px]">
                        <div
                          className="p-4 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: diffContent }}
                        />
                      </ScrollArea>
                    </div>
                  </div>
                </div>

                {/* Diff Instructions */}
                <p className="text-xs text-gray-500 text-center">
                  Compare the current content with the AI-generated version. Click "Accept" to
                  replace, or "Discard" to keep the original.
                </p>
              </div>
            ) : (
              // Normal Mode: Standard editor
              <EditorContent editor={editor} />
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TiptapEditor;
