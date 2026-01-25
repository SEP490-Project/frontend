import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FaFileAlt, FaEye, FaHeart, FaChartLine } from "react-icons/fa";
import { format } from "date-fns";
import { containerVariants, itemVariants, formatNumber } from "./types";
import { getContentTypeIcon } from "./icons";
import type { TopContentItem } from "@/libs/stores/contentDashboardManager/slice";
import HelpTooltip, { METRIC_HELP_TEXT } from "@/components/ui/help-tooltip";

interface TopContentCardProps {
  topContent: TopContentItem[];
  isLoading: boolean;
  maxItems?: number;
}

// Skeleton component
export const TopContentCardSkeleton: React.FC = () => {
  return (
    <Card className="rounded-2xl shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader className="pb-3 px-5 pt-5">
        <Skeleton className="h-6 w-44 mb-1" />
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl"
            >
              <Skeleton className="h-7 w-7 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-36 mb-2" />
                <div className="flex gap-3">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-3 w-14" />
                </div>
                <Skeleton className="h-3 w-28 mt-2" />
              </div>
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const TopContentCard: React.FC<TopContentCardProps> = ({
  topContent,
  isLoading,
  maxItems = 5,
}) => {
  if (isLoading) {
    return <TopContentCardSkeleton />;
  }

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <Card className="rounded-2xl shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <CardHeader className="pb-3 px-5 pt-5 border-b border-gray-50 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
              Top Performing Content
            </CardTitle>
            <HelpTooltip>{METRIC_HELP_TEXT.TOP_CONTENT}</HelpTooltip>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Best performance this period</p>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-4">
          {topContent.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2.5"
            >
              {topContent.slice(0, maxItems).map((content, index) => (
                <motion.div
                  key={content.content_id}
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 border border-gray-100 dark:border-gray-600"
                >
                  <motion.div
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs font-bold shadow-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 * index }}
                  >
                    {content.rank}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {content.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1 font-medium">
                      {getContentTypeIcon(content.type)}
                      <span>{content.type}</span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span>{content.channel_name}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md">
                        <FaEye size={10} className="text-gray-400" /> {formatNumber(content.views)}
                      </span>
                      <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md">
                        <FaHeart size={10} className="text-pink-400" />{" "}
                        {formatNumber(content.engagement)}
                      </span>
                      <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md">
                        <FaChartLine size={10} className="text-green-400" />{" "}
                        {content.ctr.toFixed(2)}%
                      </span>
                    </div>
                    {content.published_at && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 font-medium">
                        {format(new Date(content.published_at), "MMM dd, yyyy")}
                      </p>
                    )}
                  </div>
                  {content.thumbnail && (
                    <motion.div
                      className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + 0.1 * index }}
                    >
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-10 text-gray-400 dark:text-gray-500"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <FaFileAlt className="text-xl text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm font-medium">No content data</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TopContentCard;
