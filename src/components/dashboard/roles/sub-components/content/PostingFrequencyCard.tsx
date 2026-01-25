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
    <Card className="rounded-2xl shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader className="pb-3 px-5 pt-5 lg:px-6 lg:pt-6">
        <Skeleton className="h-6 w-40 mb-1" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent className="px-5 pb-5 lg:px-6 lg:pb-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-10 w-14" />
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="h-3 w-full rounded-full mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-4 w-20" />
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
      <Card className="rounded-2xl shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 h-full hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-3 px-5 pt-5 lg:px-6 lg:pt-6 border-b border-gray-50 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-100">
              <div className="flex items-center gap-2">
                Posting Frequency
                <HelpTooltip>{METRIC_HELP_TEXT.POSTING_FREQUENCY}</HelpTooltip>
              </div>
            </CardTitle>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Progress toward target</p>
        </CardHeader>
        <CardContent className="px-5 pb-5 lg:px-6 lg:pb-6 pt-4">
          <div className="flex items-center justify-between mb-4">
            <motion.span
              className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              {postingFrequency?.actual || 0}
            </motion.span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-gray-500 dark:text-gray-400 cursor-help flex items-center gap-1.5 text-sm font-medium">
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
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
            <motion.div
              className="bg-pink-500 h-3 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progressWidth}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getPostingFrequencyColor(postingFrequency?.status || "")}`}
            >
              {postingFrequency?.status?.replace("_", " ") || "N/A"}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {(ratio * 100).toFixed(0)}% complete
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostingFrequencyCard;
