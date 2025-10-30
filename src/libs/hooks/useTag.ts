import { useState, useEffect } from "react";
import { manageTag } from "@/libs/services/manageTag";
import type { Tag, TagListParams, TagResponse } from "@/libs/types/tag";

interface UseTagReturn {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  fetchTags: (params?: TagListParams) => Promise<void>;
  refreshTags: () => Promise<void>;
}

export const useTag = (): UseTagReturn => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = async (params: TagListParams = { page: 1, limit: 100 }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await manageTag.tags(params);
      const tagResponse = response.data as TagResponse;

      if (tagResponse.success) {
        // Filter out deleted tags
        const activeTags = tagResponse.data.filter((tag) => !tag.deleted_at);
        setTags(activeTags);
      } else {
        setError("Failed to fetch tags");
      }
    } catch (err) {
      console.error("Error fetching tags:", err);
      setError("Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  };

  const refreshTags = async () => {
    await fetchTags();
  };

  // Fetch tags on mount
  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    loading,
    error,
    fetchTags,
    refreshTags,
  };
};
