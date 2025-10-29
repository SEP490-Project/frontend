"use client";

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
} from "@/components/ui/dialog";
import FileUploader from "@/components/global/FileUploader";
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
  Unlink,
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
  Minus,
} from "lucide-react";
import { isTiptapJson } from "@/libs/helper/tiptapHelper";

interface TiptapEditorProps {
  initialContent?: string | object;
  onChange?: (content: { html: string; json: object }) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  initialContent = "<p>Start typing...</p>",
  onChange,
}) => {
  const [showImageUploader, setShowImageUploader] = useState(false);

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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto",
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "highlight",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
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

  const getCharacterCount = () => {
    return editor.getText().length;
  };

  const handleImageUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      // Create a temporary URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setShowImageUploader(false);

      // In a real application, you would upload the file to your server
      // and then update the image src with the permanent URL
      // For now, we'll use the temporary blob URL
    }
  };

  const addImage = () => {
    setShowImageUploader(true);
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter link URL", previousUrl);

    // If url is null, user cancelled
    if (url === null) {
      return;
    }

    // If url is empty, remove link
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // Update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

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
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                      }}
                      title={`Set text color to ${color}`}
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
                    onClick={() => {
                      editor.chain().focus().unsetHighlight().run();
                    }}
                  >
                    <Minus className="w-3 h-3 mx-auto" />
                  </button>
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        editor.chain().focus().setHighlight({ color }).run();
                      }}
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

            {/* Links and Images */}
            <Button
              variant="ghost"
              size="icon"
              onClick={addLink}
              className={editor.isActive("link") ? "bg-muted" : ""}
            >
              <Link2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={!editor.isActive("link")}
            >
              <Unlink className="w-4 h-4" />
            </Button>
            <Dialog open={showImageUploader} onOpenChange={setShowImageUploader}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" onClick={addImage}>
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Image</DialogTitle>
                </DialogHeader>
                <FileUploader
                  accept="image/*"
                  multiple={false}
                  maxSize={5}
                  maxFiles={1}
                  allowedTypes={["jpg", "jpeg", "png", "gif", "webp", "mp4", "wav"]}
                  onFilesChange={handleImageUpload}
                  title="Select Image"
                  showSummary={false}
                />
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

      <CardContent>
        <EditorContent editor={editor} />
      </CardContent>
    </Card>
  );
};

export default TiptapEditor;
