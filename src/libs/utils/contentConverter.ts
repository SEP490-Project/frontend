import type { Content } from "@/libs/types/content";

// Legacy content interface for backward compatibility
export interface LegacyContent {
  id: string;
  title: string;
  actor: string;
  date_time: string;
  status: string;
  content_type: "blog" | "video";
  html_content: string;
  json_content: object;
  created_at: string;
  updated_at: string;
  publish_date?: string;
  rejection_feedback?: string;
}

/**
 * Converts new API content format to legacy format for backward compatibility
 */
export const convertApiContentToLegacy = (apiContent: Content): LegacyContent => {
  // Determine content type based on whether blog field exists
  const contentType: "blog" | "video" = apiContent.blog ? "blog" : "video";

  // Map new status values to legacy status values
  const mapApiStatusToLegacy = (status: string): string => {
    switch (status) {
      case "DRAFT":
        return "draft";
      case "PENDING":
        return "pending";
      case "APPROVED":
        return "approved";
      case "REJECTED":
        return "rejected";
      case "PUBLISHED":
        return "posted";
      default:
        return status.toLowerCase();
    }
  };

  // Create legacy-compatible json_content
  const jsonContent = {
    title: apiContent.title,
    body: apiContent.body,
    type: apiContent.type,
    task_id: apiContent.task_id,
    channels: apiContent.content_channels?.map((ch) => ch.channel_name) || [],
    ...(apiContent.blog && {
      author: apiContent.blog.author,
      excerpt: apiContent.blog.excerpt,
      read_time: apiContent.blog.read_time,
      tags: apiContent.blog.tags,
    }),
    ...(apiContent.affiliate_link && { affiliate_link: apiContent.affiliate_link }),
    ...(apiContent.ai_generated_text && { ai_generated_text: apiContent.ai_generated_text }),
  };

  return {
    id: apiContent.id,
    title: apiContent.title,
    actor: apiContent.blog?.author?.username || "System",
    date_time: apiContent.updated_at,
    status: mapApiStatusToLegacy(apiContent.status),
    content_type: contentType,
    html_content: apiContent.body,
    json_content: jsonContent,
    created_at: apiContent.created_at,
    updated_at: apiContent.updated_at,
    publish_date: apiContent.publish_date,
    rejection_feedback: apiContent.rejection_feedback,
  };
};

/**
 * Converts an array of API content items to legacy format
 */
export const convertApiContentArrayToLegacy = (apiContents: Content[]): LegacyContent[] => {
  return apiContents.map(convertApiContentToLegacy);
};

/**
 * Converts legacy content format back to API format for updates
 */
export const convertLegacyContentToApi = (legacyContent: LegacyContent): Partial<Content> => {
  const jsonContent = legacyContent.json_content as any;

  return {
    id: legacyContent.id,
    title: legacyContent.title,
    body: legacyContent.html_content,
    type: "POST",
    status: legacyContent.status.toUpperCase() as any,
    task_id: jsonContent?.task_id || "",
    affiliate_link: jsonContent?.affiliate_link || null,
    ai_generated_text: jsonContent?.ai_generated_text || null,
    ...(legacyContent.content_type === "blog" &&
      jsonContent?.author && {
        blog: {
          author: jsonContent.author,
          author_id: jsonContent.author?.id || "",
          content_id: legacyContent.id,
          excerpt: jsonContent.excerpt || "",
          read_time: jsonContent.read_time || 0,
          tags: jsonContent.tags || [],
          created_at: legacyContent.created_at,
          updated_at: legacyContent.updated_at,
        },
      }),
  };
};
