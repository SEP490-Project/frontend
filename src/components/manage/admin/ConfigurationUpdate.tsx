import { useState, useEffect } from "react";
import { useAppDispatch } from "@/libs/stores";
import { updateConfig } from "@/libs/stores/configManager/thunk";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaFloppyDisk, FaXmark } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import TiptapEditor from "@/components/global/Editor";
import { useConfig } from "@/libs/hooks/useConfig";
import { toast } from "sonner";

interface ConfigurationUpdateProps {
  configKey: string;
  title: string;
  description: string;
  cardTitle: string;
  cardDescription: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  gradient: string;
  content: any;
  onCancel: () => void;
  onSuccess?: () => void;
}

const ConfigurationUpdate = ({
  configKey,
  title,
  description,
  cardTitle,
  cardDescription,
  icon: Icon,
  iconColor,
  iconBg,
  gradient,
  content,
  onCancel,
  onSuccess,
}: ConfigurationUpdateProps) => {
  const dispatch = useAppDispatch();
  const { updating } = useConfig();
  const [editorContent, setEditorContent] = useState<{ html: string; json: object } | null>(null);

  useEffect(() => {
    // Initialize editor content from props
    if (content) {
      if (typeof content === "object" && content.type === "doc") {
        setEditorContent({ html: "", json: content });
      } else if (typeof content === "object" && content.content) {
        setEditorContent({ html: "", json: content.content });
      }
    }
  }, [content]);

  const handleEditorChange = (newContent: { html: string; json: object }) => {
    setEditorContent(newContent);
  };

  const handleSave = async () => {
    if (!editorContent) {
      toast.error("No content to save");
      return;
    }

    try {
      const result = await dispatch(
        updateConfig({
          key: configKey,
          value: JSON.stringify(editorContent.json),
        }),
      ).unwrap();

      if (result) {
        toast.success(`${title.replace("Edit ", "")} updated successfully`);
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error || "Failed to update configuration");
    }
  };

  const getInitialContent = () => {
    if (!content) return undefined;

    if (typeof content === "object" && content.type === "doc") {
      return content;
    }

    if (typeof content === "object" && content.content) {
      return content.content;
    }

    return content;
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
            {title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline2"
            size="sm"
            onClick={onCancel}
            disabled={updating}
            className="flex items-center gap-2"
          >
            <FaXmark className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updating}
            className="flex items-center gap-2"
          >
            {updating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FaFloppyDisk className="w-4 h-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader className={`bg-gradient-to-r ${gradient} rounded-t-xl`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{cardTitle}</CardTitle>
              <CardDescription>{cardDescription}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <TiptapEditor initialContent={getInitialContent()} onChange={handleEditorChange} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigurationUpdate;
