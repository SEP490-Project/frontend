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
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-4 px-6 pt-6">
        <Skeleton className="h-6 w-32 mb-1" />
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
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
      <Card className="rounded-2xl shadow-sm h-full">
        <CardHeader className="pb-4 px-6 pt-6">
          <CardTitle className="text-lg font-medium">
            Pending Content
            <HelpTooltip>{METRIC_HELP_TEXT.PENDING_CONTENT}</HelpTooltip>
          </CardTitle>
          <p className="text-sm text-gray-500">Awaiting review or publishing</p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <span className="text-2xl font-bold text-yellow-600">{pendingCount}</span>
            </motion.div>
            <div>
              <p className="text-sm text-gray-500">Items need attention</p>
              <p className="text-xs text-gray-400 mt-1">{compareLabel}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PendingContentCard;
