import React, { useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/libs/stores";
import { useContentDashboard } from "@/libs/hooks/useContentDashboard";
import { fetchContentDashboard } from "@/libs/stores/contentDashboardManager/thunk";
import { setPeriod, setCustomDateRange } from "@/libs/stores/contentDashboardManager/slice";
import { toast } from "sonner";
import type { PeriodFilter } from "@/components/ui/layered-period-select";
import { manageSocialMediaSync } from "@/libs/services/manageAnalytic";

// Import sub-components
import {
  DashboardHeader,
  KPICards,
  PostingFrequencyCard,
  PendingContentCard,
  ContentChartsSection,
  ChannelPerformanceCards,
  ChannelDetailsDialog,
  UpcomingSchedulesCard,
  RecentAlertsCard,
  TopContentCard,
  DashboardSkeleton,
  ErrorState,
  containerVariants,
  slideInLeftVariants,
  slideInRightVariants,
} from "./sub-components/content";

const ContentDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Channel details dialog state
  const [channelDialogOpen, setChannelDialogOpen] = useState(false);
  const [selectedChannelForDialog, setSelectedChannelForDialog] = useState<string | null>(null);

  const {
    dashboard,
    loadingDashboard,
    dashboardError,
    period,
    quickStats,
    channelMetrics,
    trendData,
    channelDistribution,
    topContent,
    upcomingSchedule,
    alerts,
    selectedPeriod,
    customStartDate,
    customEndDate,
  } = useContentDashboard();

  // Local state for manual refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch dashboard on mount and when period changes
  useEffect(() => {
    dispatch(
      fetchContentDashboard({
        period: selectedPeriod,
        from_date: customStartDate ?? undefined,
        to_date: customEndDate ?? undefined,
      }),
    );
  }, [dispatch, selectedPeriod, customStartDate, customEndDate]);

  // Handle period change with support for custom date range
  const handlePeriodChange = useCallback(
    (filter: PeriodFilter) => {
      dispatch(setPeriod(filter.period));
      if (filter.period === "CUSTOM" && filter.startDate && filter.endDate) {
        dispatch(
          setCustomDateRange({
            startDate: filter.startDate,
            endDate: filter.endDate,
          }),
        );
      } else {
        dispatch(setCustomDateRange({ startDate: null, endDate: null }));
      }
    },
    [dispatch],
  );

  // Handle manual refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await dispatch(
        fetchContentDashboard({
          period: selectedPeriod,
          from_date: customStartDate ?? undefined,
          to_date: customEndDate ?? undefined,
        }),
      ).unwrap();
      toast.success("Dashboard refreshed successfully");
    } catch {
      toast.error("Failed to refresh dashboard");
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch, selectedPeriod, customStartDate, customEndDate]);

  // Handle sync - triggers content metrics poller job
  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      await manageSocialMediaSync.triggerContentMetricsPoller(false);
      toast.success("Metrics sync completed! Refreshing dashboard...");
      // Refresh dashboard after sync
      await dispatch(
        fetchContentDashboard({
          period: selectedPeriod,
          from_date: customStartDate ?? undefined,
          to_date: customEndDate ?? undefined,
        }),
      ).unwrap();
    } catch {
      toast.error("Failed to sync metrics from social media");
    } finally {
      setIsSyncing(false);
    }
  }, [dispatch, selectedPeriod, customStartDate, customEndDate]);

  // Handle channel click to open details dialog
  const handleChannelClick = useCallback((channelId: string) => {
    setSelectedChannelForDialog(channelId);
    setChannelDialogOpen(true);
  }, []);

  // Handle view alert details
  const handleViewAlertDetails = useCallback(
    (alertId: string) => {
      if (alertId) {
        navigate(`/manage/alerts/${alertId}`);
      } else {
        // View all alerts
        navigate("/manage/alerts");
      }
    },
    [navigate],
  );

  // Handle view reference (navigate to related content/campaign/etc.)
  const handleViewReference = useCallback(
    (referenceType: string, referenceId: string) => {
      const routes: Record<string, string> = {
        CONTENT: `/manage/content/${referenceId}`,
        CAMPAIGN: `/manage/campaigns/${referenceId}`,
        MILESTONE: `/manage/milestones/${referenceId}`,
        SCHEDULE: `/manage/schedules/${referenceId}`,
      };
      const route =
        routes[referenceType.toUpperCase()] ||
        `/manage/${referenceType.toLowerCase()}s/${referenceId}`;
      navigate(route);
    },
    [navigate],
  );

  // Calculate unread alerts count
  const unreadAlertsCount = alerts.filter((a) => !a.is_read).length;

  // Initial loading state - show full skeleton
  if (loadingDashboard && !dashboard) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (dashboardError) {
    return (
      <ErrorState
        error={dashboardError}
        onRetry={() =>
          dispatch(
            fetchContentDashboard({
              period: selectedPeriod,
              from_date: customStartDate ?? undefined,
              to_date: customEndDate ?? undefined,
            }),
          )
        }
      />
    );
  }

  // Determine if we're in a loading state (for skeleton display in components)
  const isLoading = loadingDashboard && !dashboard;

  return (
    <motion.div className="w-full" variants={containerVariants} initial="hidden" animate="visible">
      <div className="p-6 sm:p-8 lg:p-10 w-full max-w-[1920px] mx-auto flex flex-col gap-8">
        {/* Header with refresh and sync buttons */}
        <DashboardHeader
          period={period}
          selectedPeriod={selectedPeriod}
          customStartDate={customStartDate ?? undefined}
          customEndDate={customEndDate ?? undefined}
          unreadAlertsCount={unreadAlertsCount}
          isLoading={isLoading}
          isRefreshing={isRefreshing || (loadingDashboard && !!dashboard)}
          isSyncing={isSyncing}
          onPeriodChange={handlePeriodChange}
          onRefresh={handleRefresh}
          onSync={handleSync}
        />

        {/* KPI Cards Section - Full Width */}
        <motion.section variants={slideInLeftVariants} initial="hidden" animate="visible">
          <KPICards quickStats={quickStats} period={period} isLoading={isLoading} />
        </motion.section>

        {/* Quick Stats Row - Posting Frequency & Pending Content */}
        <motion.section
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={slideInLeftVariants}
          initial="hidden"
          animate="visible"
        >
          <PostingFrequencyCard
            postingFrequency={quickStats?.posting_frequency}
            isLoading={isLoading}
          />
          <PendingContentCard
            pendingCount={quickStats?.pending_content || 0}
            compareLabel={period?.compare_label || ""}
            isLoading={isLoading}
          />
        </motion.section>

        {/* Charts Section - Full Width */}
        <motion.section variants={slideInLeftVariants} initial="hidden" animate="visible">
          <ContentChartsSection
            channelDistribution={channelDistribution}
            trendData={trendData}
            isLoading={isLoading}
          />
        </motion.section>

        {/* Channel Performance Cards - Full Width */}
        <motion.section variants={slideInLeftVariants} initial="hidden" animate="visible">
          <ChannelPerformanceCards
            channelMetrics={channelMetrics}
            isLoading={isLoading}
            onChannelClick={handleChannelClick}
          />
        </motion.section>

        {/* Bottom Section: Top Content + Schedules & Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Top Performing Content */}
          <motion.div
            className="xl:col-span-7 lg:col-span-8"
            variants={slideInLeftVariants}
            initial="hidden"
            animate="visible"
          >
            <TopContentCard topContent={topContent} isLoading={isLoading} />
          </motion.div>

          {/* Right Column - Upcoming Schedules & Recent Alerts */}
          <motion.div
            className="xl:col-span-5 lg:col-span-4 space-y-6"
            variants={slideInRightVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Upcoming Schedules */}
            <UpcomingSchedulesCard upcomingSchedule={upcomingSchedule} isLoading={isLoading} />

            {/* Recent Alerts */}
            <RecentAlertsCard
              alerts={alerts}
              unreadCount={unreadAlertsCount}
              isLoading={isLoading}
              onViewDetails={handleViewAlertDetails}
              onViewReference={handleViewReference}
            />
          </motion.div>
        </div>

        {/* Channel Details Dialog */}
        <ChannelDetailsDialog
          channelId={selectedChannelForDialog}
          open={channelDialogOpen}
          onOpenChange={setChannelDialogOpen}
        />
      </div>
    </motion.div>
  );
};

export default ContentDashboard;
