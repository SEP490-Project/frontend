import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FaEye,
  FaHeart,
  FaComment,
  FaShare,
  FaUsers,
  FaLink,
  FaClock,
  FaFileAlt,
  FaThumbsUp,
  FaExternalLinkAlt,
  FaChartLine,
  FaFilter,
  FaSync,
} from "react-icons/fa";
import { format } from "date-fns";
import { useAppDispatch } from "@/libs/stores";
import { useContentDashboard } from "@/libs/hooks/useContentDashboard";
import { fetchChannelDetails } from "@/libs/stores/contentDashboardManager/thunk";
import { clearChannelDetails } from "@/libs/stores/contentDashboardManager/slice";
import { BarChartWidget, LineChartWidget } from "@/components/dashboard/chart";
import { getChannelIcon } from "./icons";
import { formatNumber, getGrowthIndicator } from "./types";
import type { ChannelDetailsResponse } from "@/libs/stores/contentDashboardManager/slice";
import { DatePicker } from "@/components/date-picker";

interface ChannelDetailsDialogProps {
  channelId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FilterState {
  period: string;
  fromDate: string | null;
  toDate: string | null;
  trendGranularity: string;
  topContentLimit: number;
  recentContentLimit: number;
}

const PERIOD_OPTIONS = [
  "TODAY",
  "YESTERDAY",
  "THIS_WEEK",
  "LAST_WEEK",
  "THIS_MONTH",
  "LAST_MONTH",
  "THIS_QUARTER",
  "LAST_QUARTER",
  "THIS_YEAR",
  "LAST_YEAR",
  "LAST_7_DAYS",
  "LAST_30_DAYS",
  "CUSTOM",
];

const GRANULARITY_OPTIONS = ["HOUR", "DAY", "WEEK", "MONTH"];

// --- ANIMATION VARIANTS (Fixed Types) ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

const tabContentVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const loadingVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Skeleton for loading state
const ChannelDetailsSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex flex-wrap gap-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="p-4 flex-1 min-w-[200px]">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-8 w-24" />
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
  </div>
);

// Unified Metric card component
const MetricCard: React.FC<{
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: { value: number; direction: "up" | "down" | "stable" };
  subtext?: string;
  className?: string;
}> = ({ label, value, icon, trend, subtext, className }) => {
  const trendIndicator = trend ? getGrowthIndicator(trend.direction) : null;

  return (
    <Card
      className={`flex flex-col justify-between shadow-sm hover:shadow-md transition-all ${className}`}
    >
      <CardContent className="p-4 pt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-gray-500 p-2 bg-gray-50 rounded-lg">{icon}</div>
          {trendIndicator && trend && (
            <Badge
              variant={trendIndicator.color === "text-green-500" ? "default" : "secondary"}
              className={`text-xs ${trendIndicator.color === "text-green-500" ? "bg-green-100 hover:bg-green-100 text-green-700" : ""}`}
            >
              {trend.direction === "up" ? "+" : ""}
              {trend.value.toFixed(1)}%
            </Badge>
          )}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export const ChannelDetailsDialog: React.FC<ChannelDetailsDialogProps> = ({
  channelId,
  open,
  onOpenChange,
}) => {
  const dispatch = useAppDispatch();
  const {
    channelDetails,
    loadingChannelDetails,
    channelDetailsError,
    selectedPeriod,
    customStartDate,
    customEndDate,
  } = useContentDashboard();

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    period: "LAST_30_DAYS",
    fromDate: null,
    toDate: null,
    trendGranularity: "DAY",
    topContentLimit: 5,
    recentContentLimit: 10,
  });
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  const [filterOpen, setFilterOpen] = useState(false);

  // Sync with global state when dialog opens
  useEffect(() => {
    if (open) {
      const initialFilters = {
        period: selectedPeriod || "LAST_30_DAYS",
        fromDate: customStartDate || null,
        toDate: customEndDate || null,
        trendGranularity: "DAY",
        topContentLimit: 5,
        recentContentLimit: 10,
      };
      setFilters(initialFilters);
      setTempFilters(initialFilters);
    }
  }, [open, selectedPeriod, customStartDate, customEndDate]);

  useEffect(() => {
    if (open && channelId) {
      dispatch(
        fetchChannelDetails({
          channelId,
          period: filters.period,
          from_date: filters.fromDate,
          to_date: filters.toDate,
          trend_granularity: filters.trendGranularity,
          top_content_limit: filters.topContentLimit,
          recent_content_limit: filters.recentContentLimit,
        }),
      );
    }

    return () => {
      if (!open) {
        dispatch(clearChannelDetails());
      }
    };
  }, [dispatch, channelId, open, filters]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      dispatch(clearChannelDetails());
    }
  };

  const handleFilterOpenChange = (isOpen: boolean) => {
    setFilterOpen(isOpen);
    if (isOpen) {
      setTempFilters(filters);
    } else {
      setFilters(tempFilters);
    }
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setFilterOpen(false);
  };

  const details = channelDetails as ChannelDetailsResponse | null;

  // Transform trend data for charts
  const contentTrendData = useMemo(() => {
    if (!details?.content_trend) return [];
    return details.content_trend.map((point) => ({
      name: format(new Date(point.date), "MMM d"),
      value: point.posts,
    }));
  }, [details?.content_trend]);

  const engagementTrendData = useMemo(() => {
    if (!details?.engagement_trend) return [];
    const resp = details.engagement_trend.map((point) => ({
      name: format(new Date(point.date), "MMM d"),
      views: point.views,
      engagements: point.engagements,
      likes: point.likes,
      comments: point.comments,
      shares: point.shares,
    }));
    return resp;
  }, [details?.engagement_trend]);

  // Combine all metrics for the grid
  const getMetricsList = () => {
    if (!details) return [];

    const m = details.mapped_metrics || {};
    const f = details.fetched_metrics || {};
    const metrics = [
      {
        id: "followers",
        label: "Followers",
        value: details.followers_count || f.followers_count || 0,
        icon: <FaUsers className="text-indigo-500" />,
        // trend: details.followers_trend,
      },
      {
        id: "views",
        label: "Total Views",
        value: m.VIEWS || 0,
        icon: <FaEye className="text-blue-500" />,
      },
      {
        id: "engagement",
        label: "Total Engagement",
        value: m.ENGAGEMENT || 0,
        icon: <FaChartLine className="text-purple-500" />,
      },
      {
        id: "likes",
        label: "Likes/Reactions",
        value: f.total_reactions || m.LIKES || 0,
        icon: <FaThumbsUp className="text-red-500" />,
      },
      {
        id: "comments",
        label: "Comments",
        value: f.total_comments || m.COMMENTS || 0,
        icon: <FaComment className="text-green-500" />,
      },
      {
        id: "shares",
        label: "Shares",
        value: f.total_shares || m.SHARES || 0,
        icon: <FaShare className="text-orange-500" />,
      },
      {
        id: "posts",
        label: "Posts Published",
        value: f.posts_count || 0,
        icon: <FaFileAlt className="text-gray-600" />,
      },
    ];

    if (details.affiliate_stats?.has_links) {
      metrics.push(
        {
          id: "aff_links",
          label: "Affiliate Links",
          value: details.affiliate_stats.total_links,
          icon: <FaLink className="text-teal-500" />,
        },
        {
          id: "aff_clicks",
          label: "Link Clicks",
          value: details.affiliate_stats.total_clicks,
          icon: <FaLink className="text-teal-500" />,
        },
        {
          id: "aff_unique_clicks",
          label: "Unique Clicks",
          value: details.affiliate_stats.unique_users,
          icon: <FaLink className="text-teal-500" />,
        },
        {
          id: "aff_ctr",
          label: "Click-Through Rate (CTR)",
          value:
            typeof details.affiliate_stats.ctr === "number"
              ? `${details.affiliate_stats.ctr.toFixed(2)}%`
              : "0%",
          icon: <FaLink className="text-teal-500" />,
        },
      );
    }

    return metrics;
  };

  const metricsList = getMetricsList();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2 border-b shrink-0 bg-white z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <DialogTitle className="flex items-center gap-3 text-2xl">
                {details?.channel && getChannelIcon(details.channel.code)}
                <span className="font-bold">{details?.channel?.name || "Channel Details"}</span>
                {details?.channel?.is_active && (
                  <Badge variant="default" className="ml-2 bg-green-500 hover:bg-green-600">
                    Active
                  </Badge>
                )}
                {details?.channel?.home_page_url && (
                  <a
                    href={details.channel.home_page_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <FaExternalLinkAlt size={14} />
                  </a>
                )}
              </DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-2">
                {details?.channel?.token_info?.account_name && (
                  <span className="font-medium text-gray-700">
                    @{details.channel.token_info.account_name}
                  </span>
                )}
                <span className="text-gray-300">•</span>
                {details?.period ? (
                  <span>
                    Data from {format(new Date(details.period.current_start), "MMM d, yyyy")} to{" "}
                    {format(new Date(details.period.current_end), "MMM d, yyyy")}
                  </span>
                ) : (
                  "Loading..."
                )}
              </DialogDescription>
            </div>

            <div className="flex items-center gap-3">
              {details?.channel?.token_info?.last_synced_at && (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border">
                  <FaClock className="text-gray-400" />
                  Last synced: {format(new Date(details.channel.token_info.last_synced_at), "PP p")}
                </div>
              )}

              {/* ... Filters Dropdown Menu ... */}
              <DropdownMenu open={filterOpen} onOpenChange={handleFilterOpenChange}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 h-8">
                    <FaFilter className="h-3 w-3" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-4">
                  <DropdownMenuLabel>Dashboard Filters</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Time Period</Label>
                      <Select
                        value={tempFilters.period}
                        onValueChange={(val) => setTempFilters({ ...tempFilters, period: val })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          {PERIOD_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {tempFilters.period === "CUSTOM" && (
                      <div className="grid grid-cols-2 gap-2">
                        <DatePicker
                          label="From"
                          value={tempFilters.fromDate ?? undefined}
                          onChange={(date) =>
                            setTempFilters({ ...tempFilters, fromDate: date || null })
                          }
                          placeholder="Start date"
                          maxDate={tempFilters.toDate ?? undefined}
                          className="text-xs"
                        />
                        <DatePicker
                          label="To"
                          value={tempFilters.toDate ?? undefined}
                          onChange={(date) =>
                            setTempFilters({ ...tempFilters, toDate: date || null })
                          }
                          placeholder="End date"
                          minDate={tempFilters.fromDate ?? undefined}
                          className="text-xs"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Trend Granularity</Label>
                      <Select
                        value={tempFilters.trendGranularity}
                        onValueChange={(val) =>
                          setTempFilters({ ...tempFilters, trendGranularity: val })
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select granularity" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRANULARITY_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <DropdownMenuSeparator />

                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="topLimit" className="text-xs">
                        Top Limit
                      </Label>
                      <Input
                        id="topLimit"
                        type="number"
                        className="col-span-2 h-8"
                        value={tempFilters.topContentLimit}
                        onChange={(e) =>
                          setTempFilters({
                            ...tempFilters,
                            topContentLimit: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="recentLimit" className="text-xs">
                        Recent Limit
                      </Label>
                      <Input
                        id="recentLimit"
                        type="number"
                        className="col-span-2 h-8"
                        value={tempFilters.recentContentLimit}
                        onChange={(e) =>
                          setTempFilters({
                            ...tempFilters,
                            recentContentLimit: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  <Button onClick={applyFilters} className="w-full gap-2">
                    <FaSync className="h-3 w-3" />
                    Apply Filters
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <AnimatePresence mode="wait">
            {loadingChannelDetails ? (
              <motion.div
                key="loading"
                variants={loadingVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ChannelDetailsSkeleton />
              </motion.div>
            ) : channelDetailsError ? (
              <motion.div
                key="error"
                variants={loadingVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full flex flex-col items-center justify-center text-red-500"
              >
                <p className="text-lg font-medium">Failed to load channel details</p>
                <p className="text-sm text-gray-500 mt-2">{channelDetailsError}</p>
              </motion.div>
            ) : details ? (
              <motion.div
                key="content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit" // Adds exit animation when this component is removed (e.g., refreshing filters)
                className="space-y-6"
              >
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-3 text-base h-auto"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="charts"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-3 text-base h-auto"
                    >
                      Performance Charts
                    </TabsTrigger>
                    <TabsTrigger
                      value="content"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-3 text-base h-auto"
                    >
                      Content History
                    </TabsTrigger>
                  </TabsList>

                  {/* OVERVIEW TAB */}
                  <TabsContent value="overview" className="space-y-6 mt-6">
                    <motion.div
                      className="flex flex-wrap gap-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {metricsList.map((metric) => (
                        <motion.div
                          key={metric.id}
                          variants={itemVariants}
                          className="flex-1 basis-[200px] min-w-[200px]"
                          whileHover={{ y: -5 }}
                        >
                          <MetricCard
                            label={metric.label}
                            value={metric.value as string}
                            icon={metric.icon}
                            // trend={metric.trend}
                            className="h-full"
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="lg:col-span-2 space-y-4 flex flex-col">
                        <div className="flex items-center justify-between shrink-0">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FaHeart className="text-red-500" size={16} /> Top Performing Content
                          </h3>
                        </div>

                        <Card className="flex-1 h-full bg-white">
                          <CardContent className="p-4 h-full">
                            {details.top_content && details.top_content.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full content-start">
                                {details.top_content.slice(0, 4).map((content, index) => (
                                  <motion.div
                                    key={content.content_id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="border rounded-lg overflow-hidden hover:shadow-sm transition-shadow flex flex-col h-full bg-white"
                                  >
                                    <div className="flex h-full">
                                      {content.thumbnail && (
                                        <div className="w-24 h-24 shrink-0 bg-gray-100">
                                          <img
                                            src={content.thumbnail}
                                            alt={content.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src =
                                                "https://placehold.co/100?text=No+Img";
                                            }}
                                          />
                                        </div>
                                      )}
                                      <div className="p-3 flex items-col justify-between w-full flex-col">
                                        <div>
                                          <div className="flex items-start justify-between gap-1">
                                            <h4
                                              className="text-sm font-semibold line-clamp-2"
                                              title={content.title}
                                            >
                                              {content.title}
                                            </h4>
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] shrink-0"
                                            >
                                              #{index + 1}
                                            </Badge>
                                          </div>
                                          <p className="text-xs text-gray-500 mt-1">
                                            {content.published_at
                                              ? format(
                                                  new Date(content.published_at),
                                                  "MMM d, HH:mm",
                                                )
                                              : "Draft/Scheduled"}
                                          </p>
                                        </div>

                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                            <FaEye size={10} /> {formatNumber(content.views)}
                                          </span>
                                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded font-medium text-blue-600">
                                            <FaHeart size={10} /> {formatNumber(content.engagement)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-500 bg-gray-50 border-dashed border rounded-md p-6">
                                No content data available for this period.
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-4 flex flex-col">
                        <h3 className="text-lg font-semibold flex items-center gap-2 shrink-0">
                          <FaExternalLinkAlt className="text-gray-500" size={16} /> Details
                        </h3>
                        <Card className="flex-1 h-full">
                          <CardContent className="p-5 space-y-6 h-full">
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">Platform ID</p>
                              <div className="font-mono text-xs bg-gray-100 p-2 rounded truncate">
                                {details.channel.token_info?.external_id || details.channel.id}
                              </div>
                            </div>

                            <div className="pt-4 border-t">
                              <p className="text-sm font-medium text-gray-500 mb-2">Token Status</p>
                              {details.channel.token_info?.access_token_expires_at ? (
                                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded border">
                                  <div
                                    className={`w-2 h-2 rounded-full shrink-0 ${new Date(details.channel.token_info.access_token_expires_at) > new Date() ? "bg-green-500" : "bg-red-500"}`}
                                  />
                                  <span className="text-xs text-gray-700">
                                    Expires{" "}
                                    {format(
                                      new Date(details.channel.token_info.access_token_expires_at),
                                      "MMM d, yyyy",
                                    )}
                                  </span>
                                </div>
                              ) : (
                                <Badge variant="secondary">Unknown</Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  </TabsContent>

                  {/* CHARTS TAB */}
                  <TabsContent value="charts" className="space-y-6 mt-6">
                    <motion.div
                      variants={tabContentVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-6"
                    >
                      <div className="w-full max-h-[300px] min-h-[100px]">
                        {contentTrendData.length > 0 ? (
                          <BarChartWidget
                            title="Content Posting Activity"
                            data={contentTrendData}
                            unit="Posts"
                            tooltip="Posts published"
                          />
                        ) : (
                          <Card className="h-full min-h-[100px] flex items-center justify-center">
                            <p className="text-gray-400">No content trend data available</p>
                          </Card>
                        )}
                      </div>

                      <div className="w-full max-h-[300px] min-h-[100px]">
                        {engagementTrendData.length > 0 ? (
                          <LineChartWidget
                            title="Engagement Analysis"
                            data={engagementTrendData}
                            lineConfig={{
                              engagements: { label: "Total Engagement", color: "#8884d8" },
                              views: { label: "Views", color: "#82ca9d" },
                              likes: { label: "Likes", color: "#ff7300" },
                              comments: { label: "Comments", color: "#413ea0" },
                              shares: { label: "Shares", color: "#ff0000" },
                            }}
                          />
                        ) : (
                          <Card className="h-full min-h-[100px] flex items-center justify-center">
                            <p className="text-gray-400">No engagement trend data available</p>
                          </Card>
                        )}
                      </div>
                    </motion.div>
                  </TabsContent>

                  {/* CONTENT TAB */}
                  <TabsContent value="content" className="space-y-6 mt-6">
                    <motion.div variants={tabContentVariants} initial="hidden" animate="visible">
                      {details.recent_content && details.recent_content.length > 0 ? (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm font-medium">
                              Recent Content History
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Content</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Published</TableHead>
                                  <TableHead className="text-right">Views</TableHead>
                                  <TableHead className="text-right">Engagement</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {details.recent_content.map((content) => (
                                  <TableRow key={content.content_id}>
                                    <TableCell className="font-medium max-w-[300px]">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
                                          <FaFileAlt className="text-gray-400" size={14} />
                                        </div>
                                        <div className="truncate" title={content.title}>
                                          {content.title}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="text-xs">
                                        {content.type}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <span
                                        className={`text-xs px-2 py-1 rounded-full ${content.status === "POSTED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                                      >
                                        {content.status}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                      {content.published_at
                                        ? format(new Date(content.published_at), "yyyy-MM-dd HH:mm")
                                        : "-"}
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-gray-700">
                                      {formatNumber(content.views)}
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-blue-600">
                                      {formatNumber(content.engagement)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
                          <FaFileAlt className="mx-auto text-gray-300 mb-3" size={40} />
                          <p>No recent content found for this period.</p>
                        </div>
                      )}
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelDetailsDialog;
