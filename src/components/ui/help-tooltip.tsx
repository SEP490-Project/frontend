import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { cn } from "@/libs/utils";

interface HelpTooltipProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
  iconClassName?: string;
  variant?: "default" | "info" | "muted";
  asChild?: boolean;
  delayDuration?: number;
}

/**
 * HelpTooltip - A consistent help icon with tooltip for explaining metrics
 *
 * Usage:
 * <HelpTooltip>Total number of posts published in the period</HelpTooltip>
 * <HelpTooltip variant="info" side="right">Engagement rate explanation</HelpTooltip>
 */
const HelpTooltip: React.FC<HelpTooltipProps> = ({
  children,
  side = "top",
  align = "center",
  className,
  iconClassName,
  variant = "default",
  asChild = false,
  delayDuration = 200,
}) => {
  const iconVariants = {
    default: "text-muted-foreground hover:text-foreground",
    info: "text-blue-500 hover:text-blue-600",
    muted: "text-muted-foreground/60 hover:text-muted-foreground",
  };

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild={asChild} className="cursor-help">
          <span className={cn("inline-flex items-center", className)}>
            <HelpCircle
              className={cn(
                "h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors",
                iconVariants[variant],
                iconClassName,
              )}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent side={side} align={align} className="max-w-xs">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/**
 * Metric help text constants for consistency across dashboard
 */
export const METRIC_HELP_TEXT = {
  // KPI Cards
  POSTS: "Total content pieces published in the selected period across all channels.",
  TOTAL_VIEWS:
    "Total reach/impressions. For website: page views. For social: platform-reported reach.",
  TOTAL_ENGAGEMENT: "Sum of all interactions: likes, comments, and shares across all channels.",
  CTR: "Click-Through Rate based on affiliate link clicks. Formula: (Total Clicks ÷ Total Views) × 100%. Shows 'N/A' when no affiliate links exist.",

  // Posting Frequency
  POSTING_FREQUENCY:
    "Actual posts vs expected. Expected is calculated from: 1) Scheduled content, 2) Milestone deliverables, or 3) Historical average.",

  // Pending Content
  PENDING_CONTENT: "Content awaiting review or approval before publishing.",

  // Channel Performance
  CHANNEL_REACH: "Total number of unique users who saw your content on this channel.",
  CHANNEL_ENGAGEMENT: "Total interactions (likes, comments, shares) on this channel.",
  CHANNEL_CTR: "Click-through rate for affiliate links on this channel.",
  CHANNEL_TOP_POST: "Best performing post based on engagement score.",

  // Top Content
  TOP_CONTENT:
    "Content ranked by performance score. Score = Views × 0.3 + Engagement × 0.5 + CTR × 0.2",
  LOW_PERFORMING: "Content with lowest performance scores. Consider optimizing or repurposing.",

  // Schedule
  UPCOMING_SCHEDULE: "Content scheduled for publishing. Click to view or edit schedule.",

  // Alerts
  ALERTS: "System notifications about content issues, deadlines, or performance anomalies.",

  // Charts
  CHANNEL_DISTRIBUTION:
    "Distribution of published content across channels (Website, Facebook, TikTok).",
  ENGAGEMENT_TREND: "Daily/weekly engagement metrics over the selected period.",
  REACH_BY_CHANNEL: "Comparison of reach across different publishing channels.",
};

export { HelpTooltip };
export default HelpTooltip;
