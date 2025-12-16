import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { KPIWidget } from "@/components/dashboard/chart";
import { FaFileAlt, FaEye, FaHeart, FaChartLine } from "react-icons/fa";
import { containerVariants, itemVariants, formatNumber } from "./types";
import type { QuickStats, PeriodInfo } from "@/libs/stores/contentDashboardManager/slice";
import { METRIC_HELP_TEXT } from "@/components/ui/help-tooltip";

interface KPICardsProps {
  quickStats: QuickStats | undefined;
  period?: PeriodInfo;
  isLoading: boolean;
}

// Skeleton component for KPI cards
export const KPICardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
};

export const KPICards: React.FC<KPICardsProps> = ({ quickStats, period, isLoading }) => {
  if (isLoading) {
    return <KPICardsSkeleton />;
  }

  // Use period label from backend, fallback to generic label
  const periodLabel = period?.preset_label || "This Period";
  const compareLabel = period?.compare_label || "vs previous period";

  const kpiData = [
    {
      title: `Posts ${periodLabel}`,
      value: quickStats?.posts_this_week?.value || 0,
      status: quickStats?.posts_this_week?.growth_status || "stable",
      growth: quickStats?.posts_this_week?.growth || 0,
      compareLabel: quickStats?.posts_this_week?.compare_label || compareLabel,
      icon: <FaFileAlt size={20} />,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      tooltip: METRIC_HELP_TEXT.POSTS,
    },
    {
      title: "Total Views",
      value: formatNumber(quickStats?.total_views?.value || 0),
      status: quickStats?.total_views?.growth_status || "stable",
      growth: quickStats?.total_views?.growth || 0,
      compareLabel: quickStats?.total_views?.compare_label || compareLabel,
      icon: <FaEye size={20} />,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      tooltip: METRIC_HELP_TEXT.TOTAL_VIEWS,
    },
    {
      title: "Engagement",
      value: formatNumber(quickStats?.total_engagement?.value || 0),
      status: quickStats?.total_engagement?.growth_status || "stable",
      growth: quickStats?.total_engagement?.growth || 0,
      compareLabel: quickStats?.total_engagement?.compare_label || compareLabel,
      icon: <FaHeart size={20} />,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      tooltip: METRIC_HELP_TEXT.TOTAL_ENGAGEMENT,
    },
    {
      title: "Avg. CTR",
      value: `${(quickStats?.average_ctr?.value || 0).toFixed(2)}%`,
      status: quickStats?.average_ctr?.growth_status || "stable",
      growth: quickStats?.average_ctr?.growth || 0,
      compareLabel: quickStats?.average_ctr?.compare_label || compareLabel,
      icon: <FaChartLine size={20} />,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      tooltip: METRIC_HELP_TEXT.CTR,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {kpiData.map((kpi, index) => (
        <motion.div key={index} variants={itemVariants}>
          <KPIWidget
            title={kpi.title}
            data={{
              value: kpi.value,
              status: kpi.status as "up" | "down" | "stable",
              statusText: `${kpi.growth?.toFixed(1) || 0}%`,
              compareLabel: kpi.compareLabel,
            }}
            icon={kpi.icon}
            iconColor={kpi.iconColor}
            iconBg={kpi.iconBg}
            tooltip={kpi.tooltip}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default KPICards;
