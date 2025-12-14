import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContent } from "@/libs/hooks/useContent";
import { useAppDispatch } from "@/libs/stores";
import { contentDetail, submitContent } from "@/libs/stores/contentManager/thunk";
import { clearContent } from "@/libs/stores/contentManager/slice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle, Tag, XCircle, Loader2, Clock } from "lucide-react";
import { tiptapJsonToHtml, isTiptapJson } from "@/libs/helper/tiptapHelper";
import { HlsPlyrHydrator } from "@/components/hls-video-hydrator";

// Progressive Video Loading Component
const ProgressiveVideo: React.FC<{ videoUrl: string; poster?: string }> = ({
  videoUrl,
  poster,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center text-white">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center text-white">
            <XCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
            <p className="text-sm">Failed to load video</p>
            <button
              onClick={handleRetry}
              className="mt-2 px-3 py-1 bg-white/20 rounded text-xs hover:bg-white/30 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-auto max-h-[500px]"
        controls
        poster={poster}
        preload="metadata"
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        playsInline
        controlsList="nodownload"
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

const ContentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { content, loading } = useContent();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch content on mount
  useEffect(() => {
    if (id) {
      dispatch(contentDetail(id));
    }

    return () => {
      dispatch(clearContent());
    };
  }, [id, dispatch]);

  const handleBack = () => {
    navigate("/manage/content/all-contents");
  };

  const handleRequestApproval = async () => {
    if (!content?.id || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await dispatch(submitContent(content.id));
      if (response.meta.requestStatus === "fulfilled") {
        // Refresh content to get updated status
        dispatch(contentDetail(content.id));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate video URL
  const isValidVideoUrl = (url: string | any): boolean => {
    if (!url || typeof url !== "string") return false;
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
    const lowerUrl = url.toLowerCase();
    return (
      videoExtensions.some((ext) => lowerUrl.includes(ext)) ||
      lowerUrl.includes("youtube.com") ||
      lowerUrl.includes("vimeo.com") ||
      lowerUrl.includes("cloudfront.net")
    );
  };

  // Determine if this is video content
  const isVideoContent = (() => {
    if (!content) return false;

    if (content.type === "VIDEO") return true;
    if (content.blog) return false;

    if (typeof content.body === "object" && content.body && (content.body as any).video_url) {
      return true;
    }

    if (typeof content.body === "string" && isValidVideoUrl(content.body)) return true;
    if (content.video_url && isValidVideoUrl(content.video_url)) return true;

    try {
      const parsed = typeof content.body === "string" ? JSON.parse(content.body) : content.body;
      if (parsed && (parsed.type === "video" || parsed.video_url)) {
        return true;
      }
    } catch {
      // Not JSON
    }

    return false;
  })();

  // Extract video URL from content
  const getVideoUrl = (): string | null => {
    if (!content?.body) return content?.video_url || null;

    if (typeof content.body === "object" && content.body && (content.body as any).video_url) {
      const videoUrl = (content.body as any).video_url;
      if (isValidVideoUrl(videoUrl)) return videoUrl;
    }

    if (typeof content.body === "string" && isValidVideoUrl(content.body)) {
      return content.body;
    }

    try {
      const parsed = typeof content.body === "string" ? JSON.parse(content.body) : content.body;
      if (parsed?.video_url && isValidVideoUrl(parsed.video_url)) return parsed.video_url;
      if (parsed?.body && isValidVideoUrl(parsed.body)) return parsed.body;
    } catch {
      // Not JSON
    }

    return content.video_url || null;
  };

  // Get video description
  const getVideoDescription = (): string => {
    if (!content) return "No description available";

    if (typeof content.body === "object" && content.body) {
      if ((content.body as any).description) return (content.body as any).description;
      if ((content.body as any).title) return (content.body as any).title;
    }

    try {
      const parsed = typeof content.body === "string" ? JSON.parse(content.body) : content.body;
      return (
        parsed?.description || parsed?.title || content.description || "No description available"
      );
    } catch {
      return content.description || "No description available";
    }
  };

  const formatDateTime = (dateTime: string | null | undefined) => {
    if (!dateTime) return "Unknown date";

    try {
      const isoDateTime = dateTime.replace(" ", "T");
      const date = new Date(isoDateTime);

      if (isNaN(date.getTime())) return "Unknown date";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown date";
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toUpperCase();
    const statusConfig: Record<string, { className: string; label: string }> = {
      APPROVED: { className: "bg-blue-100 text-blue-800 border-blue-200", label: "Approved" },
      DRAFT: { className: "bg-gray-100 text-gray-800 border-gray-200", label: "Draft" },
      AWAIT_STAFF: {
        className: "bg-amber-100 text-amber-800 border-amber-200",
        label: "Awaiting Review",
      },
      PENDING: {
        className: "bg-amber-100 text-amber-800 border-amber-200",
        label: "Awaiting Review",
      },
      AWAIT_BRAND: {
        className: "bg-purple-100 text-purple-800 border-purple-200",
        label: "Awaiting Brand",
      },
      REJECTED: { className: "bg-red-100 text-red-800 border-red-200", label: "Rejected" },
      POSTED: { className: "bg-green-100 text-green-800 border-green-200", label: "Posted" },
    };

    const config = statusConfig[normalizedStatus] || {
      className: "text-gray-600",
      label: status || "Unknown",
    };

    return (
      <Badge className={`${config.className} hover:${config.className}`}>{config.label}</Badge>
    );
  };

  const getReadTimeEstimate = (htmlContent: string | object | null | undefined) => {
    if (isVideoContent) return 3;
    if (!htmlContent) return 1;

    let textContent: string;

    if (typeof htmlContent === "string") {
      if (isTiptapJson(htmlContent)) {
        const html = tiptapJsonToHtml(htmlContent);
        textContent = html.replace(/<[^>]*>/g, "");
      } else {
        textContent = htmlContent.replace(/<[^>]*>/g, "");
      }
    } else if (typeof htmlContent === "object" && htmlContent !== null) {
      try {
        const html = tiptapJsonToHtml(htmlContent);
        textContent = html.replace(/<[^>]*>/g, "");
      } catch {
        textContent = "";
      }
    } else {
      textContent = String(htmlContent).replace(/<[^>]*>/g, "");
    }

    const wordsPerMinute = 200;
    const wordCount = textContent.split(/\s+/).filter((word) => word.length > 0).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime > 0 ? readTime : 1;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-fit p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Card>
            <CardContent className="p-6 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Not found state
  if (!content) {
    return (
      <div className="min-h-fit p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Content Not Found</h2>
              <p className="text-gray-500 mb-6">
                The content you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Contents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render content body
  const renderContentBody = () => {
    if (isVideoContent) {
      const videoUrl = getVideoUrl();
      const videoDescription = getVideoDescription();

      return (
        <div className="space-y-6">
          {videoUrl && <ProgressiveVideo videoUrl={videoUrl} poster={content.thumbnail_url} />}

          {videoDescription !== "No description available" && (
            <div className="text-gray-800 leading-relaxed">
              <p className="mb-4">{videoDescription}</p>
            </div>
          )}

          {!videoUrl && (
            <div className="text-gray-500 text-center p-8 bg-gray-50 rounded-lg">
              <p>Video content detected but no valid video URL found.</p>
            </div>
          )}
        </div>
      );
    }

    if (!content.body) {
      return (
        <div className="text-gray-800 leading-relaxed">
          <p className="mb-4">No content available.</p>
        </div>
      );
    }

    let htmlToDisplay: string;

    if (typeof content.body === "string") {
      htmlToDisplay = isTiptapJson(content.body) ? tiptapJsonToHtml(content.body) : content.body;
    } else if (typeof content.body === "object" && content.body !== null) {
      try {
        htmlToDisplay = tiptapJsonToHtml(content.body);
      } catch {
        htmlToDisplay = `<pre>${JSON.stringify(content.body, null, 2)}</pre>`;
      }
    } else {
      htmlToDisplay = String(content.body);
    }

    return (
      <>
        <div
          dangerouslySetInnerHTML={{ __html: htmlToDisplay }}
          className="ProseMirror prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-blockquote:my-2"
        />
        <HlsPlyrHydrator />
      </>
    );
  };

  const canRequestApproval = content.status === "DRAFT" || content.status === "REJECTED";

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              {content.blog?.tags &&
              Array.isArray(content.blog.tags) &&
              content.blog.tags.length > 0 ? (
                content.blog.tags.map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-[#FF9DB0] hover:bg-pink-600 text-white border-0"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-400 italic">No tags</span>
              )}
            </div>
          </div>
          {canRequestApproval && (
            <Button
              onClick={handleRequestApproval}
              disabled={isSubmitting}
              className="bg-[#FF9DB0] hover:bg-pink-600 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Request Approval
            </Button>
          )}
        </div>

        {/* Main Content Card */}
        <Card>
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {content.title}
            </h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500 pb-6 border-b">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatDateTime(content.updated_at)}</span>
              </div>
              {!isVideoContent && (
                <div className="flex items-center gap-2">
                  <span>{getReadTimeEstimate(content.body)} min read</span>
                </div>
              )}
              {getStatusBadge(content.status)}
            </div>

            {/* Rejection Feedback */}
            {content.status === "REJECTED" && content.rejection_feedback && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-red-800 mb-1">Rejection Reason</h3>
                    <p className="text-red-700 text-sm leading-relaxed">
                      {content.rejection_feedback}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Content Body */}
            <div className="pt-2">{renderContentBody()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentDetail;
