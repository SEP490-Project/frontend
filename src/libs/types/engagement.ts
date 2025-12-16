export enum ReactionType {
  LIKE = "LIKE",
  LOVE = "LOVE",
  WOW = "WOW",
  HAHA = "HAHA",
  SAD = "SAD",
  ANGRY = "ANGRY",
  THANKFUL = "THANKFUL",
}

export enum EngagementAction {
  ADD_REACTION = "add_reaction",
  REMOVE_REACTION = "remove_reaction",
  SHARE = "share",
  ADD_COMMENT = "add_comment",
  EDIT_COMMENT = "edit_comment",
  DELETE_COMMENT = "delete_comment",
  ADD_COMMENT_REACTION = "add_comment_reaction",
  REMOVE_COMMENT_REACTION = "remove_comment_reaction",
}

export interface ContentEngagementRequest {
  action: EngagementAction;
  reaction_type?: ReactionType;
  comment_id?: string;
  comment_text?: string;
}

export interface ContentCommentResponse {
  id: string;
  comment: string;
  reactions: Record<string, number>;
  created_at: string;
  is_edit: boolean;
  is_censored?: boolean;
  censor_reason?: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  user_reaction?: ReactionType;
}

export interface WebsiteEngagementSummary {
  total_reactions: number;
  reactions_by_type: Record<string, number>;
  total_comments: number;
  comments: ContentCommentResponse[];
  total_shares: number;
  user_reaction?: string;
}

export interface UserEngagementStatus {
  has_reacted: boolean;
  has_shared: boolean;
  has_commented: boolean;
  like_type?: ReactionType;
  shared_at?: string;
}

export interface ContentEngagementResponse {
  success: boolean;
  message: string;
  metrics?: WebsiteEngagementSummary;
  comment_id?: string;
}
