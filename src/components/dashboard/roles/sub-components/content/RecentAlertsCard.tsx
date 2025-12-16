import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaBell, FaCheckCircle, FaEllipsisV, FaEye, FaExternalLinkAlt } from "react-icons/fa";
import { format, formatDistanceToNow } from "date-fns";
import { containerVariants, itemVariants, getAlertSeverityColor } from "./types";
import type { AlertItem } from "@/libs/stores/contentDashboardManager/slice";
import { getAlertTypeIcon, getCategoryIcon } from "./icons";

interface RecentAlertsCardProps {
  alerts: AlertItem[];
  unreadCount: number;
  isLoading: boolean;
  maxItems?: number;
  onViewDetails?: (alertId: string) => void;
  onViewReference?: (referenceType: string, referenceId: string) => void;
}

// Format category for display
const formatCategory = (category: string) => {
  return category
    ?.replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

// Get severity badge variant
const getSeverityVariant = (
  severity: string,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (severity?.toUpperCase()) {
    case "CRITICAL":
      return "destructive";
    case "HIGH":
      return "destructive";
    case "MEDIUM":
      return "secondary";
    case "LOW":
      return "outline";
    default:
      return "outline";
  }
};

// Skeleton component
export const RecentAlertsCardSkeleton: React.FC = () => {
  return (
    <Card className="rounded-2xl shadow-sm h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 rounded-lg border bg-gray-50">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-6 w-6 rounded" />
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Individual Alert Item Component
interface AlertItemComponentProps {
  alert: AlertItem;
  index: number;
  onViewDetails?: (alertId: string) => void;
  onViewReference?: (referenceType: string, referenceId: string) => void;
}

const AlertItemComponent: React.FC<AlertItemComponentProps> = ({
  alert,
  index,
  onViewDetails,
  onViewReference,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleViewDetails = () => {
    onViewDetails?.(alert.id);
    setIsOpen(false);
  };

  const handleViewReference = () => {
    if (alert.reference_type && alert.reference_id) {
      onViewReference?.(alert.reference_type, alert.reference_id);
    } else if (alert.action_url) {
      window.open(alert.action_url, "_blank");
    }
    setIsOpen(false);
  };

  const hasReferenceLink = (alert.reference_type && alert.reference_id) || alert.action_url;

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      className={`p-3 rounded-lg border ${getAlertSeverityColor(alert.severity)} ${
        alert.is_read ? "opacity-70" : ""
      } hover:shadow-sm transition-all duration-200 group`}
    >
      {/* Header Row: Type Icon + Title + Actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {/* Type Icon */}
          <div className="mt-0.5 flex-shrink-0">{getAlertTypeIcon(alert.type)}</div>

          {/* Title & Description */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-tight line-clamp-2 break-words">
              {alert.title}
            </p>
            {alert.description && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2 break-words">
                {alert.description}
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions Dropdown */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {alert.is_read && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              title="Read"
            >
              <FaCheckCircle className="text-green-500" size={14} />
            </motion.div>
          )}

          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaEllipsisV className="h-3 w-3 text-gray-500" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleViewDetails}>
                <FaEye className="mr-2 h-3.5 w-3.5" />
                View Details
              </DropdownMenuItem>

              {hasReferenceLink && (
                <DropdownMenuItem onClick={handleViewReference}>
                  <FaExternalLinkAlt className="mr-2 h-3.5 w-3.5" />
                  Go to {alert.reference_type ? formatCategory(alert.reference_type) : "Link"}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Metadata Row: Category + Severity + Time */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        {/* Category Badge */}
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 gap-1 font-normal">
          {getCategoryIcon(alert.category)}
          <span className="hidden sm:inline">{formatCategory(alert.category)}</span>
        </Badge>

        {/* Severity Badge */}
        <Badge variant={getSeverityVariant(alert.severity)} className="text-[10px] px-1.5 py-0 h-5">
          {alert.severity}
        </Badge>

        {/* Reference Type (if exists) */}
        {alert.reference_type && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 hidden md:flex">
            {formatCategory(alert.reference_type)}
          </Badge>
        )}

        {/* Timestamp */}
        <span
          className="text-[10px] text-gray-500 ml-auto"
          title={format(new Date(alert.created_at), "PPpp")}
        >
          {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
        </span>
      </div>
    </motion.div>
  );
};

export const RecentAlertsCard: React.FC<RecentAlertsCardProps> = ({
  alerts,
  unreadCount,
  isLoading,
  maxItems = 5,
  onViewDetails,
  onViewReference,
}) => {
  if (isLoading) {
    return <RecentAlertsCardSkeleton />;
  }

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <Card className="rounded-2xl shadow-sm h-full flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2 flex-wrap">
            <FaBell className="text-yellow-600 flex-shrink-0" />
            <span>Recent Alerts</span>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Badge variant="destructive" className="text-xs text-white">
                  {unreadCount} new
                </Badge>
              </motion.div>
            )}
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">System notifications and warnings</p>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden">
          {alerts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2 sm:space-y-3 overflow-y-auto max-h-[400px] pr-1"
            >
              {alerts.slice(0, maxItems).map((alert, index) => (
                <AlertItemComponent
                  key={alert.id}
                  alert={alert}
                  index={index}
                  onViewDetails={onViewDetails}
                  onViewReference={onViewReference}
                />
              ))}

              {alerts.length > maxItems && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center pt-2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary hover:text-primary/80"
                    onClick={() => onViewDetails?.("")}
                  >
                    View all {alerts.length} alerts
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center py-8 text-gray-400"
            >
              <FaCheckCircle className="mb-2 text-2xl sm:text-3xl text-green-500" />
              <p className="text-sm font-medium text-gray-600">All Clear!</p>
              <p className="text-xs text-gray-400 mt-1">No active alerts</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentAlertsCard;
