import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChartWidget, LineChartWidget } from "@/components/dashboard/chart";
import { containerVariants, itemVariants } from "./types";
import { format } from "date-fns";
import type {
  ChannelDistribution,
  TrendDataPoint,
} from "@/libs/stores/contentDashboardManager/slice";
import HelpTooltip, { METRIC_HELP_TEXT } from "@/components/ui/help-tooltip";

interface ContentChartsSectionProps {
  channelDistribution: ChannelDistribution[];
  trendData: TrendDataPoint[];
  isLoading: boolean;
}

// Skeleton component
export const ContentChartsSectionSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {[...Array(2)].map((_, i) => (
        <Card
          key={i}
          className="rounded-2xl shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
        >
          <CardHeader className="pb-3 px-5 pt-5 lg:px-6 lg:pt-6">
            <Skeleton className="h-6 w-36 mb-2" />
            <Skeleton className="h-4 w-44" />
          </CardHeader>
          <CardContent className="px-5 pb-5 lg:px-6 lg:pb-6">
            <Skeleton className="h-[280px] w-full rounded-xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const ContentChartsSection: React.FC<ContentChartsSectionProps> = ({
  channelDistribution,
  trendData,
  isLoading,
}) => {
  if (isLoading) {
    return <ContentChartsSectionSkeleton />;
  }

  // Prepare chart data for channel distribution (pie chart)
  const channelData = channelDistribution.map((item) => ({
    type: item.label,
    value: item.value,
  }));

  // Prepare chart data for engagement trend (line chart)
  const engagementChartData = trendData.map((point) => ({
    month: format(new Date(point.date), "MMM dd"),
    engagements: point.engagements,
    likes: point.likes,
    comments: point.comments,
    shares: point.shares,
    views: point.views,
  }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
    >
      {/* Channel Distribution */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-3 px-5 pt-5 lg:px-6 lg:pt-6 border-b border-gray-50 dark:border-gray-700">
            <CardTitle className="text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-100">
              <div className="flex items-center gap-2">
                Content by Channel
                <HelpTooltip>{METRIC_HELP_TEXT.CHANNEL_DISTRIBUTION}</HelpTooltip>
              </div>
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Distribution of posts across channels
            </p>
          </CardHeader>
          <CardContent className="px-5 pb-5 lg:px-6 lg:pb-6 pt-4">
            {channelData.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4"
              >
                <PieChartWidget title="" data={channelData} />
              </motion.div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                <p className="text-sm font-medium">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Engagement Trend */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-3 px-5 pt-5 lg:px-6 lg:pt-6 border-b border-gray-50 dark:border-gray-700">
            <CardTitle className="text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-100">
              <div className="flex items-center gap-2">
                Engagement Trend
                <HelpTooltip>{METRIC_HELP_TEXT.ENGAGEMENT_TREND}</HelpTooltip>
              </div>
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total engagement over time</p>
          </CardHeader>
          <CardContent className="px-5 pb-5 lg:px-6 lg:pb-6 pt-4">
            {engagementChartData.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4"
              >
                <LineChartWidget
                  title=""
                  data={engagementChartData}
                  lineConfig={{
                    engagements: { label: "Engagement", color: "#ec4899" },
                    likes: { label: "Likes", color: "#f472b6" },
                    comments: { label: "Comments", color: "#10b981" },
                    shares: { label: "Shares", color: "#f59e0b" },
                    views: { label: "Views", color: "#8b5cf6" },
                  }}
                />
              </motion.div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                <p className="text-sm font-medium">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ContentChartsSection;
