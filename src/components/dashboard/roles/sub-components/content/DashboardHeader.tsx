import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FaBell, FaSync, FaCloudDownloadAlt } from "react-icons/fa";
import { format } from "date-fns";
import { fadeInVariants } from "./types";
import { LayeredPeriodSelect, type PeriodFilter } from "@/components/ui/layered-period-select";
import type { PeriodInfo } from "@/libs/stores/contentDashboardManager/slice";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  period: PeriodInfo | undefined;
  selectedPeriod: string;
  customStartDate?: string;
  customEndDate?: string;
  unreadAlertsCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  isSyncing?: boolean;
  onPeriodChange: (filter: PeriodFilter) => void;
  onRefresh: () => void;
  onSync?: () => void;
}

// Skeleton component for header
export const DashboardHeaderSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-[180px] rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>
    </div>
  );
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  period,
  selectedPeriod,
  customStartDate,
  customEndDate,
  unreadAlertsCount,
  isLoading,
  isRefreshing,
  isSyncing,
  onPeriodChange,
  onRefresh,
  onSync,
}) => {
  if (isLoading) {
    return <DashboardHeaderSkeleton />;
  }

  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Content Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          {period
            ? `${period.preset_label} • ${format(new Date(period.current_start), "MMM dd, yyyy")} - ${format(new Date(period.current_end), "MMM dd, yyyy")}`
            : "Content performance overview"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {/* Sync Button - Triggers content metrics poller job */}
        {onSync && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onSync}
                disabled={isSyncing || isRefreshing}
                className="relative"
              >
                <FaCloudDownloadAlt size={16} className={isSyncing ? "animate-pulse" : ""} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sync metrics from Facebook & TikTok</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Refresh Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="relative"
            >
              <FaSync size={16} className={isRefreshing ? "animate-spin" : ""} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Refresh dashboard data</p>
          </TooltipContent>
        </Tooltip>

        {/* Period Selector - Layered with Custom Date Range */}
        <LayeredPeriodSelect
          value={selectedPeriod}
          startDate={customStartDate}
          endDate={customEndDate}
          onChange={onPeriodChange}
          disabled={isRefreshing}
        />

        {/* Alerts Button */}
        {unreadAlertsCount > 0 && (
          <Button variant="outline" className="relative">
            <FaBell size={16} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadAlertsCount}
            </span>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
