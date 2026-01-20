import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FaEye,
  FaHeart,
  FaExternalLinkAlt,
  FaUsers,
  FaComment,
  FaShare,
  FaChartLine,
} from "react-icons/fa";
import { containerVariants, itemVariants, formatNumber, getGrowthIndicator } from "./types";
import { getChannelIcon, getGrowthIcon } from "./icons";
import type { ChannelMetrics } from "@/libs/stores/contentDashboardManager/slice";
import HelpTooltip from "@/components/ui/help-tooltip";

interface ChannelPerformanceCardsProps {
  channelMetrics: ChannelMetrics[];
  isLoading: boolean;
  onChannelClick?: (channelId: string) => void;
}

// Skeleton component
export const ChannelPerformanceCardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-4 w-28 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div>
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <Skeleton className="h-3 w-8 mb-1" />
              <Skeleton className="h-6 w-14" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const ChannelPerformanceCards: React.FC<ChannelPerformanceCardsProps> = ({
  channelMetrics,
  isLoading,
  onChannelClick,
}) => {
  if (isLoading) {
    return <ChannelPerformanceCardsSkeleton />;
  }

  if (channelMetrics.length === 0) {
    return (
      <Card className="rounded-2xl shadow-sm p-8 text-center col-span-full">
        <p className="text-gray-400">No channel metrics available</p>
      </Card>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {channelMetrics.map((channel, index) => {
        // Growth indicators
        const reachGrowth = getGrowthIndicator(
          channel.reach_growth > 0 ? "up" : channel.reach_growth < 0 ? "down" : "stable",
        );
        const engagementGrowth = getGrowthIndicator(
          channel.engagement_growth > 0 ? "up" : channel.engagement_growth < 0 ? "down" : "stable",
        );

        return (
          <motion.div
            key={channel.channel_id}
            variants={itemVariants}
            custom={index}
            onClick={() => onChannelClick?.(channel.channel_id)}
            className={onChannelClick ? "cursor-pointer" : ""}
          >
            <Card className="rounded-2xl shadow-sm h-full hover:shadow-md transition-shadow duration-200 group border-gray-100">
              {/* Header */}
              <CardHeader className="pb-4 px-6 pt-6 bg-white rounded-t-2xl">
                <CardTitle className="text-base font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-gray-50 rounded-lg">
                      {getChannelIcon(channel.channel_code)}
                    </div>
                    <span className="text-gray-900">{channel.channel_name}</span>
                    <HelpTooltip>{`Performance metrics for ${channel.channel_name}`}</HelpTooltip>
                  </div>
                  {onChannelClick && (
                    <FaExternalLinkAlt
                      className="text-gray-300 group-hover:text-blue-500 transition-colors"
                      size={12}
                    />
                  )}
                </CardTitle>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                    {formatNumber(channel.post_count)} posts
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 px-6 pb-6 pt-2">
                {/* Main KPIs Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Reach */}
                  <div className="p-3 bg-blue-50/50 rounded-xl">
                    <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                      <FaEye size={10} className="text-blue-400" /> Reach
                    </p>
                    <div className="flex items-end gap-2">
                      <motion.p
                        className="text-lg font-bold text-gray-900 leading-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        {formatNumber(channel.total_reach)}
                      </motion.p>
                      <span
                        className={`text-xs font-medium mb-0.5 ${reachGrowth.color} flex items-center`}
                      >
                        {getGrowthIcon(
                          channel.reach_growth > 0
                            ? "up"
                            : channel.reach_growth < 0
                              ? "down"
                              : "stable",
                        )}
                        {Math.abs(channel.reach_growth).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Engagement */}
                  <div className="p-3 bg-purple-50/50 rounded-xl">
                    <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                      <FaChartLine size={10} className="text-purple-400" /> Engagement
                    </p>
                    <div className="flex items-end gap-2">
                      <motion.p
                        className="text-lg font-bold text-gray-900 leading-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 + index * 0.1 }}
                      >
                        {formatNumber(channel.total_engagement)}
                      </motion.p>
                      <span
                        className={`text-xs font-medium mb-0.5 ${engagementGrowth.color} flex items-center`}
                      >
                        {getGrowthIcon(
                          channel.engagement_growth > 0
                            ? "up"
                            : channel.engagement_growth < 0
                              ? "down"
                              : "stable",
                        )}
                        {Math.abs(channel.engagement_growth).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  {/* CTR */}
                  <div>
                    <p className="text-xs text-gray-400 mb-1">CTR</p>
                    <p className="text-sm font-semibold text-gray-700">{channel.ctr.toFixed(2)}%</p>
                  </div>

                  {/* Followers */}
                  {channel.channel_code !== "WEBSITE" && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <FaUsers size={10} /> Followers
                      </p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-gray-700">
                          {formatNumber(channel.followers_count)}
                        </p>
                        {channel.followers_trend && channel.followers_trend.percentage !== 0 && (
                          <span
                            className={`text-[10px] ${
                              channel.followers_trend.value > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {channel.followers_trend.value > 0 ? "+" : ""}
                            {channel.followers_trend.percentage.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Detailed Metrics (Likes, Comments, Shares) */}
                {channel.mapped_metrics && Object.keys(channel.mapped_metrics).length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {typeof channel.mapped_metrics.LIKES === "number" &&
                      channel.mapped_metrics.LIKES > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          <FaHeart className="text-pink-500" size={10} />
                          <span className="font-medium">
                            {formatNumber(channel.mapped_metrics.LIKES)}
                          </span>
                        </div>
                      )}
                    {typeof channel.mapped_metrics.COMMENTS === "number" &&
                      channel.mapped_metrics.COMMENTS > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          <FaComment className="text-blue-500" size={10} />
                          <span className="font-medium">
                            {formatNumber(channel.mapped_metrics.COMMENTS)}
                          </span>
                        </div>
                      )}
                    {typeof channel.mapped_metrics.SHARES === "number" &&
                      channel.mapped_metrics.SHARES > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          <FaShare className="text-green-500" size={10} />
                          <span className="font-medium">
                            {formatNumber(channel.mapped_metrics.SHARES)}
                          </span>
                        </div>
                      )}
                  </div>
                )}

                {/* Top Post Preview */}
                {channel.top_post && (
                  <motion.div
                    className="pt-3 border-t border-gray-100 mt-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold">
                      Top Performing Post
                    </p>
                    <div className="flex flex-col gap-1">
                      <p
                        className="text-xs font-medium text-gray-800 line-clamp-1"
                        title={channel.top_post.title}
                      >
                        {channel.top_post.title}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
                          <FaEye size={8} /> {formatNumber(channel.top_post.views)}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
                          <FaHeart size={8} /> {formatNumber(channel.top_post.likes)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ChannelPerformanceCards;
