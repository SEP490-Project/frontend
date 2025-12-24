import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ContentCommentResponse, WebsiteEngagementSummary } from "@/libs/types/engagement";
import { EngagementAction, ReactionType } from "@/libs/types/engagement";
import { manageEngagement } from "@/libs/services/manageEngagement";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Send, Trash2, Edit2, X, Check } from "lucide-react";
import { useAuth } from "@/libs/hooks/useAuth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/libs/utils";
import { WarningDialog } from "../global";

interface CommentSectionProps {
  contentId: string;
  comments: ContentCommentResponse[];
  onCommentsUpdate: (summary: WebsiteEngagementSummary) => void;
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

export const CommentSection = ({ contentId, comments, onCommentsUpdate }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);

    try {
      const response = await manageEngagement.recordEngagement(contentId, {
        action: EngagementAction.ADD_COMMENT,
        comment_text: newComment,
      });

      if (response.success && response.metrics) {
        onCommentsUpdate(response.metrics);
        setNewComment("");
        toast.success("Comment posted successfully");
      }
    } catch (error) {
      toast.error("Failed to post comment");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteDialog = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;

    try {
      const response = await manageEngagement.recordEngagement(contentId, {
        action: EngagementAction.DELETE_COMMENT,
        comment_id: commentToDelete,
      });

      if (response.success && response.metrics) {
        onCommentsUpdate(response.metrics);
        toast.success("Comment deleted");
      }
    } catch {
      toast.error("Failed to delete comment");
    } finally {
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  const startEdit = (comment: ContentCommentResponse) => {
    setEditingId(comment.id);
    setEditText(comment.comment);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      const response = await manageEngagement.recordEngagement(contentId, {
        action: EngagementAction.EDIT_COMMENT,
        comment_id: commentId,
        comment_text: editText,
      });

      if (response.success && response.metrics) {
        onCommentsUpdate(response.metrics);
        setEditingId(null);
        toast.success("Comment updated");
      }
    } catch {
      toast.error("Failed to update comment");
    }
  };

  const handleReaction = async (commentId: string, type: ReactionType) => {
    setOpenPopoverId(null);
    try {
      const comment = comments.find((c) => c.id === commentId);
      const isRemoving = comment?.user_reaction === type;

      const action = isRemoving
        ? EngagementAction.REMOVE_COMMENT_REACTION
        : EngagementAction.ADD_COMMENT_REACTION;

      const response = await manageEngagement.recordEngagement(contentId, {
        action,
        comment_id: commentId,
        reaction_type: isRemoving ? undefined : type,
      });

      if (response.success && response.metrics) {
        onCommentsUpdate(response.metrics);
      }
    } catch {
      toast.error("Failed to update reaction");
    }
  };

  const handleDefaultReactionClick = (comment: ContentCommentResponse) => {
    if (comment.user_reaction) {
      handleReaction(comment.id, comment.user_reaction);
    } else {
      handleReaction(comment.id, ReactionType.LIKE);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <h3 className="text-2xl font-bold text-[#383838] mb-8">Comments ({comments.length})</h3>
      {/* Add Comment Form */}
      {user ? (
        <div className="flex gap-4 mb-10">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] resize-none focus-visible:ring-pink-500"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={submitting || !newComment.trim()}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 group">
            <Avatar className="w-10 h-10">
              <AvatarImage src={comment.avatar_url} />
              <AvatarFallback>{comment.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-2xl p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#383838]">{comment.username}</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })}
                    {comment.is_edit && " (edited)"}
                  </span>
                </div>

                {editingId === comment.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="bg-white min-h-[80px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={cancelEdit}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => saveEdit(comment.id)}
                        className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.comment}</p>
                )}

                {/* Actions for own comments */}
                {user?.id === comment.user_id && !editingId && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(comment)}
                      className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(comment.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Comment Reactions */}
              <div className="flex items-center gap-2 mt-1 ml-2">
                <Popover
                  open={openPopoverId === comment.id}
                  onOpenChange={(open) => setOpenPopoverId(open ? comment.id : null)}
                >
                  {user ? (
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-6 px-2 text-xs font-medium hover:bg-transparent hover:text-pink-600",
                          comment.user_reaction ? "text-pink-600" : "text-gray-500",
                        )}
                        onClick={() => handleDefaultReactionClick(comment)}
                        onMouseEnter={() => setOpenPopoverId(comment.id)}
                      >
                        {comment.user_reaction ? REACTION_ICONS[comment.user_reaction] : "Like"}
                      </Button>
                    </PopoverTrigger>
                  ) : (
                    ""
                  )}
                  <PopoverContent
                    className="w-auto p-1 flex gap-1 rounded-full shadow-md"
                    onMouseLeave={() => setOpenPopoverId(null)}
                    side="top"
                    align="start"
                  >
                    {Object.values(ReactionType).map((type) => (
                      <button
                        key={type}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReaction(comment.id, type);
                        }}
                        className={cn(
                          "text-lg hover:scale-125 transition-transform p-1 rounded-full hover:bg-gray-100",
                          comment.user_reaction === type && "bg-pink-100 scale-110",
                        )}
                      >
                        {REACTION_ICONS[type]}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>

                {/* Reaction Counts */}
                {Object.keys(comment.reactions).length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {Object.entries(comment.reactions)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([type]) => (
                        <span key={type}>{REACTION_ICONS[type as ReactionType]}</span>
                      ))}
                    <span className="ml-0.5 font-medium">
                      {Object.values(comment.reactions).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Delete Confirmation Dialog */}
      <WarningDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Comment"
        description="Are you sure you want to delete this comment?"
        warningMessage="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setCommentToDelete(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonVariant="destructive"
      />{" "}
    </div>
  );
};
