import { tiptapJsonToHtml } from "@/libs/helper/tiptapHelper";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { getTermsOfService } from "@/libs/stores/configManager/thunk";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { HlsPlyrHydrator } from "@/components/hls-video-hydrator";

export const TermsOfUses = () => {
  const dispatch = useAppDispatch();
  const { termsOfService: content, loading } = useSelector(
    (state: RootState) => state.manageConfig,
  );

  useEffect(() => {
    dispatch(getTermsOfService());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-600">Loading Terms of Service...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg">No Terms of Service available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-4 px-6 pt-2 pb-6 bg-white rounded-lg">
      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
        {(() => {
          try {
            // Handle TipTap JSON format in body field
            if (content && typeof content === "object") {
              const htmlContent = tiptapJsonToHtml(JSON.stringify(content));
              return (
                <div
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  className="ProseMirror prose prose-lg max-w-none prose-headings:mt-6 prose-headings:mb-4 prose-p:my-4 prose-ul:my-4 prose-ol:my-4 prose-blockquote:my-4 prose-img:rounded-lg prose-img:shadow-md"
                />
              );
            }

            // Handle content as string
            if (content && typeof content === "string") {
              return <div dangerouslySetInnerHTML={{ __html: content }} />;
            }

            return <div className="text-gray-500 italic">No content available</div>;
          } catch (error) {
            console.error("Error rendering content:", error);
            return <div className="text-red-500 italic">Error loading content</div>;
          }
        })()}
        <HlsPlyrHydrator />
      </div>
    </div>
  );
};
