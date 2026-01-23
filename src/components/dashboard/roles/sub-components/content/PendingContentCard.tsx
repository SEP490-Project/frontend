import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { itemVariants } from "./types";
import HelpTooltip, { METRIC_HELP_TEXT } from "@/components/ui/help-tooltip";

interface PendingContentCardProps {
  pendingCount: number;
  compareLabel: string;
  isLoading: boolean;
}

// Skeleton component
export const PendingContentCardSkeleton: React.FC = () => {
  return (
    <Card className="rounded-2xl shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader className="pb-3 px-5 pt-5 lg:px-6 lg:pt-6">
        <Skeleton className="h-6 w-36 mb-1" />
        <Skeleton className="h-4 w-44" />
      </CardHeader>
      <CardContent className="px-5 pb-5 lg:px-6 lg:pb-6">
        <div className="flex items-center gap-5">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <div className="flex-1">
            <Skeleton className="h-4 w-36 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PendingContentCard: React.FC<PendingContentCardProps> = ({
  pendingCount,
  compareLabel,
  isLoading,
}) => {
  if (isLoading) {
    return <PendingContentCardSkeleton />;
  }

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <Card className="rounded-2xl shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 h-full hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-3 px-5 pt-5 lg:px-6 lg:pt-6 border-b border-gray-50 dark:border-gray-700">
          <CardTitle className="text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-100">
            <div className="flex items-center gap-2">
              Pending Content
              <HelpTooltip>{METRIC_HELP_TEXT.PENDING_CONTENT}</HelpTooltip>
            </div>
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">Awaiting review or publishing</p>
        </CardHeader>
        <CardContent className="px-5 pb-5 lg:px-6 lg:pb-6 pt-4">
          <div className="flex items-center gap-5">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center shadow-sm border border-pink-100 dark:border-pink-800/30"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {pendingCount}
              </span>
            </motion.div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Items need attention
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{compareLabel}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PendingContentCard;
