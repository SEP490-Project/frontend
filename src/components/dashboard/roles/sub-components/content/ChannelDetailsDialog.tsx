import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FaEye,
  FaHeart,
  FaComment,
  FaShare,
  FaUsers,
  FaChartLine,
  FaLink,
  FaClock,
} from "react-icons/fa";
import { format } from "date-fns";
import { useAppDispatch } from "@/libs/stores";
import { useContentDashboard } from "@/libs/hooks/useContentDashboard";
import { fetchChannelDetails } from "@/libs/stores/contentDashboardManager/thunk";
import { clearChannelDetails } from "@/libs/stores/contentDashboardManager/slice";
import { getChannelIcon } from "./icons";
import { formatNumber, getGrowthIndicator } from "./types";
import type {
  ChannelDetailsResponse,
  TrendDataPoint,
} from "@/libs/stores/contentDashboardManager/slice";

interface ChannelDetailsDialogProps {
  channelId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Skeleton for loading state
const ChannelDetailsSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-4">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-8 w-24" />
        </Card>
      ))}
    </div>
    <Card className="p-4">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-48 w-full" />
    </Card>
    <Card className="p-4">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </Card>
  </div>
);

// Metric card component
const MetricCard: React.FC<{
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: { value: number; direction: "up" | "down" | "stable" };
}> = ({ label, value, icon, trend }) => {
  const trendIndicator = trend ? getGrowthIndicator(trend.direction) : null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-gray-500">{icon}</div>
        {trendIndicator && (
          <span className={`text-xs ${trendIndicator.color}`}>
            {trend?.direction === "up" ? "+" : ""}
            {trend?.value.toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">{label}</p>
      <p className="text-xl font-bold text-gray-900">
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
    </Card>
  );
};

// Simple sparkline chart
const MiniTrendChart: React.FC<{ data: TrendDataPoint[]; dataKey: keyof TrendDataPoint }> = ({
  data,
  dataKey,
}) => {
  if (!data || data.length === 0) return null;

  const values = data.map((d) => Number(d[dataKey]) || 0);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-0.5 h-12">
      {values.map((value, i) => (
        <div
          key={i}
          className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t"
          style={{ height: `${((value - min) / range) * 100}%`, minHeight: "2px" }}
          title={`${data[i].date}: ${formatNumber(value)}`}
        />
      ))}
    </div>
  );
};

export const ChannelDetailsDialog: React.FC<ChannelDetailsDialogProps> = ({
  channelId,
  open,
  onOpenChange,
}) => {
  const dispatch = useAppDispatch();
  const { channelDetails, loadingChannelDetails, channelDetailsError, selectedPeriod } =
    useContentDashboard();

  useEffect(() => {
    if (open && channelId) {
      dispatch(fetchChannelDetails({ channelId, period: selectedPeriod }));
    }

    return () => {
      if (!open) {
        dispatch(clearChannelDetails());
      }
    };
  }, [dispatch, channelId, open, selectedPeriod]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      dispatch(clearChannelDetails());
    }
  };

  const details = channelDetails as ChannelDetailsResponse | null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {details?.channel && getChannelIcon(details.channel.code)}
            {details?.channel?.name || "Channel Details"}
            {details?.channel?.is_active && (
              <Badge variant="secondary" className="ml-2">
                Active
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {details?.period ? (
              <>
                Performance from {format(new Date(details.period.current_start), "MMM d")} to{" "}
                {format(new Date(details.period.current_end), "MMM d, yyyy")}
              </>
            ) : (
              "Loading channel performance data..."
            )}
          </DialogDescription>
        </DialogHeader>

        {loadingChannelDetails ? (
          <ChannelDetailsSkeleton />
        ) : channelDetailsError ? (
          <div className="text-center py-8 text-red-500">
            <p>Failed to load channel details</p>
            <p className="text-sm text-gray-500 mt-1">{channelDetailsError}</p>
          </div>
        ) : details ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label="Total Views"
                value={details.mapped_metrics?.VIEWS || 0}
                icon={<FaEye className="text-blue-500" />}
              />
              <MetricCard
                label="Total Likes"
                value={details.mapped_metrics?.LIKES || 0}
                icon={<FaHeart className="text-red-500" />}
              />
              <MetricCard
                label="Comments"
                value={details.mapped_metrics?.COMMENTS || 0}
                icon={<FaComment className="text-green-500" />}
              />
              <MetricCard
                label="Shares"
                value={details.mapped_metrics?.SHARES || 0}
                icon={<FaShare className="text-purple-500" />}
              />
            </div>

            {/* Followers Section (for social channels) */}
            {details.followers_count > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FaUsers className="text-indigo-500" />
                    Followers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold">{formatNumber(details.followers_count)}</p>
                    {details.followers_trend && (
                      <Badge
                        variant={
                          details.followers_trend.direction === "up" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {details.followers_trend.direction === "up" ? "+" : ""}
                        {details.followers_trend.percentage.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Engagement Trend Chart */}
            {details.engagement_trend && details.engagement_trend.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FaChartLine className="text-orange-500" />
                    Engagement Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MiniTrendChart data={details.engagement_trend} dataKey="engagements" />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Last {details.engagement_trend.length} data points
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Top Content List */}
            {details.top_content && details.top_content.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Top Performing Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {details.top_content.slice(0, 5).map((content, index) => (
                    <div
                      key={content.content_id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-400 w-6">#{index + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{content.title}</p>
                          <p className="text-xs text-gray-500">
                            {content.published_at
                              ? format(new Date(content.published_at), "MMM d, yyyy")
                              : "Not published"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <FaEye size={10} /> {formatNumber(content.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaHeart size={10} /> {formatNumber(content.engagement)}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Affiliate Stats (if applicable) */}
            {details.affiliate_stats?.has_links && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FaLink className="text-teal-500" />
                    Affiliate Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Links</p>
                      <p className="text-lg font-bold">{details.affiliate_stats.total_links}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Clicks</p>
                      <p className="text-lg font-bold">
                        {formatNumber(details.affiliate_stats.total_clicks)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">CTR</p>
                      <p className="text-lg font-bold">
                        {typeof details.affiliate_stats.ctr === "number"
                          ? `${details.affiliate_stats.ctr.toFixed(2)}%`
                          : details.affiliate_stats.ctr}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Token Info (for connected accounts) */}
            {details.channel?.token_info?.last_synced_at && (
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <FaClock size={10} />
                Last synced: {format(new Date(details.channel.token_info.last_synced_at), "PPpp")}
              </div>
            )}
          </motion.div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ChannelDetailsDialog;
