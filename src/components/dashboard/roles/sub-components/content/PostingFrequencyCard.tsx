import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { itemVariants, getPostingFrequencyColor } from "./types";
import type { PostingFrequency } from "@/libs/stores/contentDashboardManager/slice";
import HelpTooltip, { METRIC_HELP_TEXT } from "@/components/ui/help-tooltip";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FaCalendarCheck, FaTasks, FaChartLine } from "react-icons/fa";

// Map source to display label and icon
const SOURCE_LABELS: Record<string, { label: string; description: string; icon: React.ReactNode }> =
  {
    schedule: {
      label: "Scheduled",
      description: "Expected based on scheduled content",
      icon: <FaCalendarCheck className="text-blue-500" size={12} />,
    },
    tasks: {
      label: "Tasks",
      description: "Expected based on task deliverables",
      icon: <FaTasks className="text-purple-500" size={12} />,
    },
    average: {
      label: "Average",
      description: "Expected based on daily average (1 post/day)",
      icon: <FaChartLine className="text-gray-500" size={12} />,
    },
  };

interface PostingFrequencyCardProps {
  postingFrequency: PostingFrequency | undefined;
  isLoading: boolean;
}

// Skeleton component
export const PostingFrequencyCardSkeleton: React.FC = () => {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-4 px-6 pt-6">
        <Skeleton className="h-6 w-36 mb-1" />
        <Skeleton className="h-4 w-28" />
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-9 w-12" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-2.5 w-full rounded-full mb-3" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

export const PostingFrequencyCard: React.FC<PostingFrequencyCardProps> = ({
  postingFrequency,
  isLoading,
}) => {
  if (isLoading) {
    return <PostingFrequencyCardSkeleton />;
  }

  const ratio = postingFrequency?.ratio || 0;
  const progressWidth = Math.min(ratio * 100, 100);
  const source = postingFrequency?.source || "average";
  const sourceInfo = SOURCE_LABELS[source] || SOURCE_LABELS.average;

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <Card className="rounded-2xl shadow-sm h-full">
        <CardHeader className="pb-4 px-6 pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                Posting Frequency
                <HelpTooltip>{METRIC_HELP_TEXT.POSTING_FREQUENCY}</HelpTooltip>
              </div>
            </CardTitle>
          </div>
          <p className="text-sm text-gray-500">Progress toward target</p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="flex items-center justify-between mb-3">
            <motion.span
              className="text-3xl font-bold text-gray-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              {postingFrequency?.actual || 0}
            </motion.span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-gray-500 cursor-help flex items-center gap-1.5">
                    {sourceInfo.icon}/ {postingFrequency?.expected || 0} expected
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{sourceInfo.label}</p>
                  <p className="text-xs text-muted-foreground">{sourceInfo.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3 overflow-hidden">
            <motion.div
              className="bg-blue-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressWidth}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span
              className={`text-sm px-2 py-1 rounded-full ${getPostingFrequencyColor(postingFrequency?.status || "")}`}
            >
              {postingFrequency?.status?.replace("_", " ") || "N/A"}
            </span>
            <span className="text-sm text-gray-500">{(ratio * 100).toFixed(0)}% complete</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostingFrequencyCard;
