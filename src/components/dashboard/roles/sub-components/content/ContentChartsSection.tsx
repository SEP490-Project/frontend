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
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-lg" />
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
      className="grid grid-cols-1 xl:grid-cols-2 gap-8"
    >
      {/* Channel Distribution */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl shadow-sm h-full">
          <CardHeader className="pb-4 px-6 pt-6">
            <CardTitle className="text-lg font-medium">
              Content by Channel
              <HelpTooltip>{METRIC_HELP_TEXT.CHANNEL_DISTRIBUTION}</HelpTooltip>
            </CardTitle>
            <p className="text-sm text-gray-500">Distribution of posts across channels</p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {channelData.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <PieChartWidget title="" data={channelData} />
              </motion.div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Engagement Trend */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl shadow-sm h-full">
          <CardHeader className="pb-4 px-6 pt-6">
            <CardTitle className="text-lg font-medium">
              Engagement Trend
              <HelpTooltip>{METRIC_HELP_TEXT.ENGAGEMENT_TREND}</HelpTooltip>
            </CardTitle>
            <p className="text-sm text-gray-500">Total engagement over time</p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {engagementChartData.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <LineChartWidget
                  title=""
                  data={engagementChartData}
                  lineConfig={{
                    engagements: { label: "Engagement", color: "#ef4444" },
                    likes: { label: "Likes", color: "#3b82f6" },
                    comments: { label: "Comments", color: "#10b981" },
                    shares: { label: "Shares", color: "#f59e0b" },
                    views: { label: "Views", color: "#8b5cf6" },
                  }}
                />
              </motion.div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ContentChartsSection;
