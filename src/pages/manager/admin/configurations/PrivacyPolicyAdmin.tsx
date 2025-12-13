import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { getPrivacyPolicy } from "@/libs/stores/configManager/thunk";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FaShieldHalved, FaRotate, FaPenToSquare } from "react-icons/fa6";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import ConfigurationUpdate from "@/components/manage/admin/ConfigurationUpdate";

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

interface PrivacyPolicyProps {
  showHeader?: boolean;
}

const PrivacyPolicyAdmin = ({ showHeader = true }: PrivacyPolicyProps) => {
  const dispatch = useAppDispatch();
  const { loading, privacyPolicy } = useSelector((state: RootState) => state.manageConfig);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!privacyPolicy) {
      dispatch(getPrivacyPolicy());
    }
  }, [dispatch, privacyPolicy]);

  const handleRefresh = () => {
    dispatch(getPrivacyPolicy());
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    dispatch(getPrivacyPolicy());
  };

  // Show edit mode
  if (isEditing) {
    return (
      <ConfigurationUpdate
        configKey="privacy_policy"
        title="Edit Privacy Policy"
        description="Update information about data collection and privacy practices"
        cardTitle="Privacy Policy Editor"
        cardDescription="Use the editor below to modify the privacy policy content"
        icon={FaShieldHalved}
        iconColor="text-green-600"
        iconBg="bg-green-100"
        gradient="from-green-50 to-emerald-50"
        content={privacyPolicy}
        onCancel={() => setIsEditing(false)}
        onSuccess={handleEditSuccess}
      />
    );
  }

  const renderTiptapContent = (content: any) => {
    if (!content) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Shield className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-lg font-medium">No content available</p>
          <p className="text-sm">Privacy Policy has not been set up yet.</p>
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
    <div className="min-h-fit p-4 sm:p-6">
      {/* Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Information about data collection and privacy practices
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <FaPenToSquare className="w-4 h-4" />
              Edit
            </Button>
            <Button
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <FaRotate className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <FaShieldHalved className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Privacy & Data Protection</CardTitle>
              <CardDescription>How we collect, use, and protect your information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? <ContentSkeleton /> : renderTiptapContent(privacyPolicy)}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicyAdmin;
