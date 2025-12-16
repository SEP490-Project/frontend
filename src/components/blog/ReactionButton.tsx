import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share2, ThumbsUp } from "lucide-react";
import type { UserEngagementStatus, WebsiteEngagementSummary } from "@/libs/types/engagement";
import { ReactionType, EngagementAction } from "@/libs/types/engagement";
import { manageEngagement } from "@/libs/services/manageEngagement";
import { toast } from "sonner";
import { cn } from "@/libs/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ReactionButtonProps {
  contentId: string;
  initialSummary?: WebsiteEngagementSummary;
  onSummaryUpdate?: (summary: WebsiteEngagementSummary) => void;
}

const REACTION_ICONS: Record<ReactionType, string> = {
  [ReactionType.LIKE]: "👍",
  [ReactionType.LOVE]: "❤️",
  [ReactionType.HAHA]: "😂",
  [ReactionType.WOW]: "😮",
  [ReactionType.SAD]: "😢",
  [ReactionType.ANGRY]: "😡",
  [ReactionType.THANKFUL]: "🙏",
};

const REACTION_LABELS: Record<ReactionType, string> = {
  [ReactionType.LIKE]: "Like",
  [ReactionType.LOVE]: "Love",
  [ReactionType.HAHA]: "Haha",
  [ReactionType.WOW]: "Wow",
  [ReactionType.SAD]: "Sad",
  [ReactionType.ANGRY]: "Angry",
  [ReactionType.THANKFUL]: "Thankful",
};

export const ReactionButton = ({
  contentId,
  initialSummary,
  onSummaryUpdate,
}: ReactionButtonProps) => {
  const [status, setStatus] = useState<UserEngagementStatus | null>(null);
  const [summary, setSummary] = useState<WebsiteEngagementSummary | undefined>(initialSummary);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (initialSummary) {
      setSummary(initialSummary);
    }
  }, [initialSummary]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await manageEngagement.getUserEngagementStatus(contentId);
        setStatus(data);
      } catch (error) {
        console.error("Failed to fetch engagement status", error);
      }
    };

    if (contentId) {
      fetchStatus();
    }
  }, [contentId]);

  const handleReaction = async (type: ReactionType) => {
    if (loading) return;
    setLoading(true);
    setIsOpen(false);

    try {
      // If clicking the same reaction, remove it
      const isRemoving = status?.has_reacted && status.like_type === type;
      const action = isRemoving ? EngagementAction.REMOVE_REACTION : EngagementAction.ADD_REACTION;

      const response = await manageEngagement.recordEngagement(contentId, {
        action,
        reaction_type: isRemoving ? undefined : type,
      });

      if (response.success && response.metrics) {
        setSummary(response.metrics);
        onSummaryUpdate?.(response.metrics);
        setStatus((prev) => ({
          ...prev!,
          has_reacted: !isRemoving,
          like_type: !isRemoving ? type : undefined,
        }));
      }
    } catch (error) {
      toast.error("Failed to update reaction");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Default click handler (toggle LIKE if not reacted, or remove current reaction)
  const handleDefaultClick = () => {
    if (status?.has_reacted) {
      handleReaction(status.like_type || ReactionType.LIKE);
    } else {
      handleReaction(ReactionType.LIKE);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");

      // Record share
      await manageEngagement.recordEngagement(contentId, {
        action: EngagementAction.SHARE,
      });
    } catch {
      toast.error("Failed to share");
    }
  };

  return (
    <div className="flex items-center gap-4 py-4 border-y border-gray-100 my-6">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative group">
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-2 hover:bg-pink-50 transition-colors",
                status?.has_reacted && "text-pink-600 bg-pink-50",
              )}
              onMouseEnter={() => setIsOpen(true)}
              onClick={handleDefaultClick}
            >
              {status?.has_reacted && status.like_type ? (
                <span className="text-xl">{REACTION_ICONS[status.like_type]}</span>
              ) : (
                <ThumbsUp className="w-5 h-5" />
              )}
              <span className="font-medium">
                {status?.has_reacted && status.like_type
                  ? REACTION_LABELS[status.like_type]
                  : "Like"}{" "}
                ({summary?.total_reactions || 0})
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-2 flex gap-2 rounded-full shadow-lg"
            onMouseLeave={() => setIsOpen(false)}
            side="top"
            align="start"
          >
            {Object.values(ReactionType).map((type) => (
              <button
                key={type}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReaction(type);
                }}
                className={cn(
                  "text-2xl hover:scale-125 transition-transform p-1 rounded-full hover:bg-gray-100",
                  status?.like_type === type && "bg-pink-100 scale-110",
                )}
                title={REACTION_LABELS[type]}
              >
                {REACTION_ICONS[type]}
              </button>
            ))}
          </PopoverContent>
        </div>
      </Popover>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
      >
        <Share2 className="w-5 h-5" />
        <span className="font-medium">Share</span>
      </Button>
    </div>
  );
};
