import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FaFileAlt, FaEye, FaHeart, FaChartLine } from "react-icons/fa";
import { format } from "date-fns";
import { containerVariants, itemVariants, formatNumber } from "./types";
import { getContentTypeIcon } from "./icons";
import type { TopContentItem } from "@/libs/stores/contentDashboardManager/slice";

interface TopContentCardProps {
  topContent: TopContentItem[];
  isLoading: boolean;
  maxItems?: number;
}

// Skeleton component
export const TopContentCardSkeleton: React.FC = () => {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-4 px-6 pt-6">
        <Skeleton className="h-6 w-40 mb-1" />
        <Skeleton className="h-4 w-36" />
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-32 mb-2" />
                <div className="flex gap-3">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-3 w-24 mt-2" />
              </div>
              <Skeleton className="h-12 w-12 rounded" />
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
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-4 px-6 pt-6">
          <CardTitle className="text-lg font-medium">Top Performing Content</CardTitle>
          <p className="text-sm text-gray-500">Best performance this period</p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {topContent.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {topContent.slice(0, maxItems).map((content, index) => (
                <motion.div
                  key={content.content_id}
                  variants={itemVariants}
                  custom={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <motion.div
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 * index }}
                  >
                    {content.rank}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{content.title}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      {getContentTypeIcon(content.type)}
                      <span>{content.type}</span>
                      <span>•</span>
                      <span>{content.channel_name}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaEye size={10} /> {formatNumber(content.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaHeart size={10} /> {formatNumber(content.engagement)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaChartLine size={10} /> {content.ctr.toFixed(2)}%
                      </span>
                    </div>
                    {content.published_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(content.published_at), "MMM dd, yyyy")}
                      </p>
                    )}
                  </div>
                  {content.thumbnail && (
                    <motion.div
                      className="flex-shrink-0 w-12 h-12 rounded overflow-hidden"
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
              className="text-center py-8 text-gray-400"
            >
              <FaFileAlt className="mx-auto mb-2 text-2xl" />
              <p className="text-sm">No content data</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TopContentCard;
