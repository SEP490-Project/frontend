import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FaEye, FaHeart, FaExternalLinkAlt, FaUsers, FaComment, FaShare } from "react-icons/fa";
import { containerVariants, itemVariants, formatNumber, getGrowthIndicator } from "./types";
import { getChannelIcon, getGrowthIcon } from "./icons";
import type { ChannelMetrics } from "@/libs/stores/contentDashboardManager/slice";

interface ChannelPerformanceCardsProps {
  channelMetrics: ChannelMetrics[];
  isLoading: boolean;
  onChannelClick?: (channelId: string) => void;
}

// Skeleton component
export const ChannelPerformanceCardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="pt-2 border-t border-gray-100">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center gap-3 mt-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-12" />
              </div>
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
      <Card className="rounded-2xl shadow-sm p-8 text-center">
        <p className="text-gray-400">No channel metrics available</p>
      </Card>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {channelMetrics.map((channel, index) => {
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
            <Card className="rounded-2xl shadow-sm h-full hover:shadow-md transition-shadow duration-200 group">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(channel.channel_code)}
                    {channel.channel_name}
                  </div>
                  {onChannelClick && (
                    <FaExternalLinkAlt
                      className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      size={12}
                    />
                  )}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">{channel.post_count} posts this period</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Reach</p>
                    <div className="flex items-center gap-1">
                      <motion.p
                        className="text-lg font-bold text-gray-900"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        {formatNumber(channel.total_reach)}
                      </motion.p>
                      <span className={`${reachGrowth.color}`}>
                        {getGrowthIcon(
                          channel.reach_growth > 0
                            ? "up"
                            : channel.reach_growth < 0
                              ? "down"
                              : "stable",
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Engagement</p>
                    <div className="flex items-center gap-1">
                      <motion.p
                        className="text-lg font-bold text-gray-900"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 + index * 0.1 }}
                      >
                        {formatNumber(channel.total_engagement)}
                      </motion.p>
                      <span className={`${engagementGrowth.color}`}>
                        {getGrowthIcon(
                          channel.engagement_growth > 0
                            ? "up"
                            : channel.engagement_growth < 0
                              ? "down"
                              : "stable",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">CTR</p>
                  <p className="text-lg font-semibold text-gray-900">{channel.ctr.toFixed(2)}%</p>
                </div>
                {/* Followers Count - Show for social channels (not website) */}
                {channel.channel_code !== "WEBSITE" && channel.followers_count > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <FaUsers size={10} /> Followers
                    </p>
                    <div className="flex items-center gap-1">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatNumber(channel.followers_count)}
                      </p>
                      {channel.followers_trend && (
                        <span
                          className={
                            getGrowthIndicator(
                              channel.followers_trend.direction as "up" | "down" | "stable",
                            ).color
                          }
                        >
                          {getGrowthIcon(
                            channel.followers_trend.direction as "up" | "down" | "stable",
                          )}
                        </span>
                      )}
                    </div>
                    {channel.followers_trend && channel.followers_trend.value !== 0 && (
                      <p className="text-xs text-gray-400">
                        {channel.followers_trend.value > 0 ? "+" : ""}
                        {formatNumber(channel.followers_trend.value)} (
                        {channel.followers_trend.percentage.toFixed(1)}%)
                      </p>
                    )}
                  </div>
                )}
                {/* Mapped Metrics - Show likes, comments, shares if available */}
                {channel.mapped_metrics && Object.keys(channel.mapped_metrics).length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Detailed Metrics</p>
                    <div className="flex flex-wrap gap-3">
                      {typeof channel.mapped_metrics.LIKES === "number" && (
                        <div className="flex items-center gap-1 text-sm">
                          <FaHeart className="text-pink-500" size={12} />
                          <span className="font-medium">
                            {formatNumber(channel.mapped_metrics.LIKES as number)}
                          </span>
                        </div>
                      )}
                      {typeof channel.mapped_metrics.COMMENTS === "number" && (
                        <div className="flex items-center gap-1 text-sm">
                          <FaComment className="text-blue-500" size={12} />
                          <span className="font-medium">
                            {formatNumber(channel.mapped_metrics.COMMENTS as number)}
                          </span>
                        </div>
                      )}
                      {typeof channel.mapped_metrics.SHARES === "number" && (
                        <div className="flex items-center gap-1 text-sm">
                          <FaShare className="text-green-500" size={12} />
                          <span className="font-medium">
                            {formatNumber(channel.mapped_metrics.SHARES as number)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {channel.top_post && (
                  <motion.div
                    className="pt-2 border-t border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <p className="text-xs text-gray-500 mb-1">Top Post</p>
                    <p className="text-sm text-gray-700 truncate">{channel.top_post.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaEye size={10} /> {formatNumber(channel.top_post.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaHeart size={10} /> {formatNumber(channel.top_post.likes)}
                      </span>
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
