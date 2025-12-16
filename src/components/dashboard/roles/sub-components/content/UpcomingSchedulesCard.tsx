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

interface UpcomingSchedulesCardProps {
  upcomingSchedule: UpcomingScheduleItem[];
  isLoading: boolean;
  maxItems?: number;
}

// Skeleton component
export const UpcomingSchedulesCardSkeleton: React.FC = () => {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-4 px-6 pt-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-36" />
        </div>
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Skeleton className="h-4 w-4 mt-1" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-5 w-16 rounded" />
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
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-4 px-6 pt-6">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FaClock className="text-blue-600" />
            Upcoming Schedules
          </CardTitle>
          <p className="text-sm text-gray-500">Next scheduled publications</p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {upcomingSchedule.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {upcomingSchedule.slice(0, maxItems).map((schedule, index) => (
                <motion.div
                  key={schedule.schedule_id}
                  variants={itemVariants}
                  custom={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex-shrink-0 mt-1">{getChannelIcon(schedule.channel_code)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {schedule.content_title}
                    </p>
                    <p className="text-xs text-gray-500">{schedule.channel_name}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {format(new Date(schedule.scheduled_at), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
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
              className="text-center py-8 text-gray-400"
            >
              <FaCalendarAlt className="mx-auto mb-2 text-2xl" />
              <p className="text-sm">No upcoming schedules</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UpcomingSchedulesCard;
