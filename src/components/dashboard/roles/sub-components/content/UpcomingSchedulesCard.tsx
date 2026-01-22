import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FaClock, FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import { containerVariants, itemVariants } from "./types";
import { getChannelIcon } from "./icons";
import type { UpcomingScheduleItem } from "@/libs/stores/contentDashboardManager/slice";
import HelpTooltip, { METRIC_HELP_TEXT } from "@/components/ui/help-tooltip";

interface UpcomingSchedulesCardProps {
  upcomingSchedule: UpcomingScheduleItem[];
  isLoading: boolean;
  maxItems?: number;
}

// Skeleton component
export const UpcomingSchedulesCardSkeleton: React.FC = () => {
  return (
    <Card className="rounded-2xl shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-4 w-44 mt-1" />
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl"
            >
              <Skeleton className="h-5 w-5 mt-0.5 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-24 mb-1" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const UpcomingSchedulesCard: React.FC<UpcomingSchedulesCardProps> = ({
  upcomingSchedule,
  isLoading,
  maxItems = 5,
}) => {
  if (isLoading) {
    return <UpcomingSchedulesCardSkeleton />;
  }

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <Card className="rounded-2xl shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <CardHeader className="pb-3 px-5 pt-5 border-b border-gray-50 dark:border-gray-700">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-pink-50 dark:bg-pink-900/30 rounded-lg">
                <FaClock className="text-pink-600 dark:text-pink-400" size={14} />
              </div>
              Upcoming Schedules
              <HelpTooltip>{METRIC_HELP_TEXT.UPCOMING_SCHEDULE}</HelpTooltip>
            </div>
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">Next scheduled publications</p>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-4">
          {upcomingSchedule.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2.5"
            >
              {upcomingSchedule.slice(0, maxItems).map((schedule, index) => (
                <motion.div
                  key={schedule.schedule_id}
                  variants={itemVariants}
                  custom={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 border border-gray-100 dark:border-gray-600"
                >
                  <div className="flex-shrink-0 mt-0.5 p-1 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    {getChannelIcon(schedule.channel_code)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {schedule.content_title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {schedule.channel_name}
                    </p>
                    <p className="text-xs text-pink-600 dark:text-pink-400 mt-1 font-semibold">
                      {format(new Date(schedule.scheduled_at), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] flex-shrink-0 font-semibold border-gray-200 dark:border-gray-600"
                  >
                    {schedule.status}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-10 text-gray-400 dark:text-gray-500"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <FaCalendarAlt className="text-xl text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm font-medium">No upcoming schedules</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UpcomingSchedulesCard;
