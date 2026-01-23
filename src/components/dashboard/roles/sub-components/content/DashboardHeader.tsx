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
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Content Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
          {period
            ? `${period.preset_label} • ${format(new Date(period.current_start), "MMM dd, yyyy")} - ${format(new Date(period.current_end), "MMM dd, yyyy")}`
            : "Content performance overview"}
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sync Button - Triggers content metrics poller job */}
        {onSync && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onSync}
                disabled={isSyncing || isRefreshing}
                className="relative h-9 w-9 sm:h-10 sm:w-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 shadow-sm"
              >
                <FaCloudDownloadAlt
                  size={16}
                  className={
                    isSyncing ? "animate-pulse text-pink-500" : "text-gray-600 dark:text-gray-400"
                  }
                />
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
              className="relative h-9 w-9 sm:h-10 sm:w-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 shadow-sm"
            >
              <FaSync
                size={14}
                className={
                  isRefreshing ? "animate-spin text-pink-500" : "text-gray-600 dark:text-gray-400"
                }
              />
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
          <Button
            variant="outline"
            className="relative h-9 w-9 sm:h-10 sm:w-10 p-0 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 shadow-sm"
          >
            <FaBell size={14} className="text-gray-600 dark:text-gray-400" />
            <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
              {unreadAlertsCount > 99 ? "99+" : unreadAlertsCount}
            </span>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
