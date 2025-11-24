import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Tag, XCircle, Play, Loader2 } from "lucide-react";
import type { Content } from "@/libs/types/content";
import { tiptapJsonToHtml, isTiptapJson } from "@/libs/helper/tiptapHelper";
import { HlsPlyrHydrator } from "@/components/hls-video-hydrator";

interface ContentDetailModalProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestApproval?: (contentId: string) => void;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({
  content,
  isOpen,
  onClose,
  onRequestApproval,
}) => {
  if (!content) return null;

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
    // Check if type is VIDEO
    if (content.type === "VIDEO") return true;

    // Check if blog field is missing (indicates video content)
    if (content.blog) return false;

    // Check if body is an object with video_url
    if (typeof content.body === "object" && content.body && (content.body as any).video_url) {
      return true;
    }

    // Check if body contains video URL as string
    if (typeof content.body === "string" && isValidVideoUrl(content.body)) return true;

    // Check if video_url field exists
    if (content.video_url && isValidVideoUrl(content.video_url)) return true;

    // Check if body contains JSON with video data
    try {
      const parsed = typeof content.body === "string" ? JSON.parse(content.body) : content.body;
      if (parsed && (parsed.type === "video" || parsed.video_url)) {
        return true;
      }
    } catch {
      // Not JSON, continue
    }

    return false;
  })();

  // Progressive Video Loading Component
  const ProgressiveVideo: React.FC<{ videoUrl: string; poster?: string }> = ({
    videoUrl,
    poster,
  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
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

    const handlePlayClick = () => {
      setShowVideo(true);
      // Small delay to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
        }
      }, 100);
    };

    if (!showVideo) {
      return (
        <div
          className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video max-h-[500px] flex items-center justify-center group cursor-pointer"
          onClick={handlePlayClick}
        >
          {/* Poster/Thumbnail */}
          {poster ? (
            <img
              src={poster}
              alt="Video thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900"></div>
          )}

          {/* Play Button Overlay */}
          <div className="relative z-10 bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
            <Play className="h-12 w-12 text-white fill-white" />
          </div>

          {/* Video Info Overlay */}
          <div className="absolute bottom-4 left-4 text-white">
            <div className="text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
              Click to load video
            </div>
          </div>
        </div>
      );
    }

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
                onClick={handlePlayClick}
                className="mt-2 px-3 py-1 bg-white/20 rounded text-xs hover:bg-white/30"
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
          preload="none" // Don't preload any data
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onError={handleError}
          playsInline // Better mobile experience
          controlsList="nodownload" // Prevent download if needed
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  // Extract video URL from content
  const getVideoUrl = (): string | null => {
    if (!content.body) return content.video_url || null;

    // Check if body is an object with video_url
    if (typeof content.body === "object" && content.body && (content.body as any).video_url) {
      const videoUrl = (content.body as any).video_url;
      if (isValidVideoUrl(videoUrl)) {
        return videoUrl;
      }
    }

    // Check if body is a direct URL string
    if (typeof content.body === "string" && isValidVideoUrl(content.body)) {
      return content.body;
    }

    // Check if body contains JSON with video URL
    try {
      const parsed = typeof content.body === "string" ? JSON.parse(content.body) : content.body;
      if (parsed && parsed.video_url && isValidVideoUrl(parsed.video_url)) {
        return parsed.video_url;
      }
      if (parsed && parsed.body && isValidVideoUrl(parsed.body)) {
        return parsed.body;
      }
    } catch {
      // Not JSON, continue
    }

    return content.video_url || null;
  };

  // Get video description
  const getVideoDescription = (): string => {
    // Check if body is an object with description
    if (typeof content.body === "object" && content.body && (content.body as any).description) {
      return (content.body as any).description;
    }

    // Check if body is an object with title
    if (typeof content.body === "object" && content.body && (content.body as any).title) {
      return (content.body as any).title;
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
      // Handle MySQL datetime format: "YYYY-MM-DD HH:MM:SS"
      // Replace space with 'T' to make it ISO 8601 compliant
      const isoDateTime = dateTime.replace(" ", "T");
      const date = new Date(isoDateTime);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateTime, "parsed as:", date);
        return "Unknown date";
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      console.error("Error parsing date:", dateTime, err);
      return "Unknown date";
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toUpperCase();
    switch (normalizedStatus) {
      case "APPROVED":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
            Approved
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100">
            Draft
          </Badge>
        );
      case "AWAIT_STAFF":
      case "PENDING":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
            Awaiting Review
          </Badge>
        );
      case "AWAIT_BRAND":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100">
            Awaiting Brand
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
            Rejected
          </Badge>
        );
      case "POSTED":
      case "PUBLISHED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
            Published
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600">
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  const getReadTimeEstimate = (htmlContent: string | object | null | undefined) => {
    // Return fixed time for video content
    if (isVideoContent) {
      return 3; // Assume 3 minutes for video content
    }

    // Return default if no content
    if (!htmlContent) return 1;

    let textContent: string;

    if (typeof htmlContent === "string") {
      // Check if content is TipTap JSON and convert it first
      if (isTiptapJson(htmlContent)) {
        const html = tiptapJsonToHtml(htmlContent);
        textContent = html.replace(/<[^>]*>/g, "");
      } else {
        // Remove HTML tags and calculate reading time
        textContent = htmlContent.replace(/<[^>]*>/g, "");
      }
    } else if (typeof htmlContent === "object" && htmlContent !== null) {
      // If it's a TipTap JSON object, convert to HTML first
      try {
        const html = tiptapJsonToHtml(htmlContent);
        textContent = html.replace(/<[^>]*>/g, "");
      } catch {
        // If conversion fails, treat as empty content
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

  const handleRequestApproval = () => {
    if (onRequestApproval) {
      onRequestApproval(content.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="sr-only">{content.title}</DialogTitle>
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="w-4 h-4" />
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
                  <div className="text-sm text-gray-400 italic">No tags</div>
                )}
              </div>
            </div>
            {(content.status === "DRAFT" || content.status === "REJECTED") && (
              <Button
                onClick={handleRequestApproval}
                className="bg-[#FF9DB0] hover:bg-pink-600 text-white mr-2"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Request Approval
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pb-6 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
                {content.title}
              </h1>

              {/* Meta information */}
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <span>
                    {formatDateTime(content.updated_at)} by{" "}
                    {content.blog?.author?.username || content.actor || "System"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>
                    {getReadTimeEstimate(content.body)} min to {isVideoContent ? "watch" : "read"}
                  </span>
                </div>
                <div>{getStatusBadge(content.status)}</div>
              </div>

              {/* Rejection Feedback */}
              {content.status === "REJECTED" && content.rejection_feedback && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-red-800 mb-1">Reject Reason</h3>
                      <p className="text-red-700 text-sm leading-relaxed">
                        {content.rejection_feedback}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div>
              {(() => {
                // Handle video content
                if (isVideoContent) {
                  const videoUrl = getVideoUrl();
                  const videoDescription = getVideoDescription();

                  return (
                    <div className="space-y-6">
                      {videoUrl && (
                        <ProgressiveVideo videoUrl={videoUrl} poster={content.thumbnail_url} />
                      )}

                      {videoDescription !== "No description available" && (
                        <div className="text-gray-800 leading-relaxed">
                          <p className="mb-4">{videoDescription}</p>
                        </div>
                      )}

                      {!videoUrl && (
                        <div className="text-gray-500 text-center p-8 bg-gray-50 rounded-lg">
                          <p>Video content detected but no valid video URL found.</p>
                          <div className="text-sm mt-4 space-y-2">
                            <p>
                              <strong>Content body:</strong>{" "}
                              {typeof content.body === "string"
                                ? content.body.substring(0, 200)
                                : JSON.stringify(content.body)?.substring(0, 200)}
                              ...
                            </p>
                            <p>
                              <strong>Video URL field:</strong> {content.video_url || "Not found"}
                            </p>
                            <p>
                              <strong>Has blog field:</strong> {content.blog ? "Yes" : "No"}
                            </p>
                            <p>
                              <strong>Body type:</strong> {typeof content.body}
                            </p>
                            <p>
                              <strong>Content type:</strong> {content.type}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Handle blog/text content
                if (!content.body) {
                  return (
                    <div className="text-gray-800 leading-relaxed">
                      <p className="mb-4">No content available.</p>
                    </div>
                  );
                }

                // Handle different content body formats for text content
                let htmlToDisplay: string;

                if (typeof content.body === "string") {
                  // If body is already a string, check if it's TipTap JSON or HTML
                  if (isTiptapJson(content.body)) {
                    htmlToDisplay = tiptapJsonToHtml(content.body);
                  } else {
                    htmlToDisplay = content.body;
                  }
                } else if (typeof content.body === "object" && content.body !== null) {
                  // If body is an object (TipTap JSON), convert it to HTML
                  try {
                    htmlToDisplay = tiptapJsonToHtml(content.body);
                  } catch {
                    // If conversion fails, show the JSON as formatted text
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
              })()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDetailModal;
