import { useEffect } from "react";
import { usePostedContent } from "@/libs/hooks/useContentPosted";
import { useAppDispatch } from "@/libs/stores";
import { postedContentDetail } from "@/libs/stores/contentPostedManager/thunk";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Tag, Calendar, User, Clock } from "lucide-react";
import { tiptapJsonToHtml } from "@/libs/helper/tiptapHelper";
import type { ListContent } from "@/libs/types/content";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { postedContent: content, loading } = usePostedContent();

  useEffect(() => {
    if (id) {
      dispatch(postedContentDetail(id));
    }
  }, [id, dispatch]);

  // Format date for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get reading time estimate
  const getReadingTime = (content: ListContent) => {
    try {
      let textContent = "";

      // Handle body field (TipTap JSON format)
      if (content.body && typeof content.body === "object") {
        // Convert TipTap JSON to HTML first, then extract text
        const htmlContent = tiptapJsonToHtml(JSON.stringify(content.body));
        textContent = htmlContent.replace(/<[^>]*>/g, "");
      }

      const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
      const readingTime = Math.ceil(wordCount / 200); // Average reading speed
      return `${readingTime} min read`;
    } catch {
      return "~ min read";
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg">Invalid blog post ID</div>
          <Button onClick={() => navigate("/blog")} className="mt-4">
            Go Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Button variant="ghost" size="lg" onClick={() => navigate("/blog")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
              <span className="ml-3 text-gray-600">Loading blog post...</span>
            </div>
          ) : !content ? (
            <div className="text-center py-20">
              <div className="text-gray-500 text-lg mb-4">Blog post not found</div>
              <div className="text-gray-400 text-sm mb-6">
                The requested blog post could not be loaded.
              </div>
              <Button onClick={() => navigate("/blog")}>Go Back to Blog</Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Tags */}
              {content.blog?.tags && content.blog.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {content.blog.tags.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-[#fec6d4] hover:bg-pink-500 text-[#383838] border-0"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Title */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#383838] leading-tight mb-6">
                  {content.title}
                </h1>

                {/* Meta information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{content.blog?.author?.username || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateTime(content.publish_date || content.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{getReadingTime(content)}</span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {content.thumbnail_url && (
                <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden">
                  <img
                    src={content.thumbnail_url}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content Body */}
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {(() => {
                  try {
                    // Handle TipTap JSON format in body field
                    if (content.body && typeof content.body === "object") {
                      const htmlContent = tiptapJsonToHtml(JSON.stringify(content.body));
                      return (
                        <div
                          dangerouslySetInnerHTML={{ __html: htmlContent }}
                          className="ProseMirror prose prose-lg max-w-none prose-headings:mt-6 prose-headings:mb-4 prose-p:my-4 prose-ul:my-4 prose-ol:my-4 prose-blockquote:my-4 prose-img:rounded-lg prose-img:shadow-md"
                        />
                      );
                    }

                    // Handle body as string
                    if (content.body && typeof content.body === "string") {
                      return <div dangerouslySetInnerHTML={{ __html: content.body }} />;
                    }

                    return <div className="text-gray-500 italic">No content available</div>;
                  } catch (error) {
                    console.error("Error rendering content:", error);
                    return <div className="text-red-500 italic">Error loading content</div>;
                  }
                })()}
              </div>

              {/* Additional Content Info */}
              {content.blog?.excerpt && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h3 className="text-xl font-semibold text-[#383838] mb-4">About this article</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{content.blog.excerpt}</p>
                </div>
              )}

              {/* Author Info */}
              {content.blog?.author && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#fec6d4] to-[#feb2c5] rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#383838]">
                        {content.blog.author.username}
                      </h3>
                      <p className="text-gray-500">{content.blog.author.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Back to Blog CTA */}
              <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                <h3 className="text-2xl font-bold text-[#383838] mb-4">
                  Explore more beauty insights
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Discover more beauty tips, skincare routines, and lifestyle advice on our blog
                </p>
                <Button
                  onClick={() => navigate("/blog")}
                  className="bg-[#fec6d4] hover:bg-[#feb2c5] text-[#383838] px-8 py-3 rounded-full text-lg font-semibold"
                >
                  View All Posts
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogDetail;
