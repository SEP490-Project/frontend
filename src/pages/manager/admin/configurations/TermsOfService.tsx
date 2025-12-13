import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { getTermsOfService } from "@/libs/stores/configManager/thunk";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FaFileContract } from "react-icons/fa6";
import { FileText } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";

// TipTap Content Viewer Component
const TiptapContentViewer = ({ content }: { content: any }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Highlight,
    ],
    content: content,
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-pink-600 prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal",
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};

// Content Loading Skeleton
const ContentSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-6 w-1/2 mt-4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

interface TermsOfServiceProps {
  showHeader?: boolean;
}

const TermsOfService = ({ showHeader = true }: TermsOfServiceProps) => {
  const dispatch = useAppDispatch();
  const { loading, termsOfService } = useSelector((state: RootState) => state.manageConfig);

  useEffect(() => {
    if (!termsOfService) {
      dispatch(getTermsOfService());
    }
  }, [dispatch, termsOfService]);

  const renderTiptapContent = (content: any) => {
    if (!content) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-lg font-medium">No content available</p>
          <p className="text-sm">Terms of Service has not been set up yet.</p>
        </div>
      );
    }

    if (typeof content === "object" && content.type === "doc" && Array.isArray(content.content)) {
      return <TiptapContentViewer content={content} />;
    }

    if (typeof content === "object" && content.content && typeof content.content === "object") {
      return <TiptapContentViewer content={content.content} />;
    }

    const htmlContent = typeof content === "string" ? content : JSON.stringify(content);
    return (
      <div
        className="prose prose-pink max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-pink-600 prose-strong:text-gray-900"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  return (
    <Card>
      {showHeader && (
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FaFileContract className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Terms of Service</CardTitle>
              <CardDescription>Legal terms and conditions for using the platform</CardDescription>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className={showHeader ? "pt-6" : "pt-0"}>
        {loading ? <ContentSkeleton /> : renderTiptapContent(termsOfService)}
      </CardContent>
    </Card>
  );
};

export default TermsOfService;
