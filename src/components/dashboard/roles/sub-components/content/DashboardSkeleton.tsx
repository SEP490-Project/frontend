import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FaExclamationTriangle } from "react-icons/fa";
import { scaleInVariants } from "./types";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

// Full page skeleton for initial loading
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full">
      <div className="p-6 sm:p-8 lg:p-10 w-full max-w-[1920px] mx-auto flex flex-col gap-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div>
            <Skeleton className="h-9 w-52 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg" />
            <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg" />
            <Skeleton className="h-10 w-[180px] rounded-lg" />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-5 lg:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>

        {/* Posting Frequency & Pending Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card
              key={i}
              className="rounded-2xl shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 lg:p-6"
            >
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-32 mb-5" />
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-10 w-14" />
                <Skeleton className="h-5 w-28" />
              </div>
              <Skeleton className="h-3 w-full rounded-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="xl:col-span-8 space-y-6 lg:space-y-8">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {[...Array(2)].map((_, i) => (
                <Card
                  key={i}
                  className="rounded-2xl shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
                >
                  <div className="px-5 pt-5 lg:px-6 lg:pt-6 pb-3 border-b border-gray-50 dark:border-gray-700">
                    <Skeleton className="h-6 w-36 mb-2" />
                    <Skeleton className="h-4 w-44" />
                  </div>
                  <div className="px-5 pb-5 lg:px-6 lg:pb-6 pt-4">
                    <Skeleton className="h-[280px] w-full rounded-xl" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Channel Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {[...Array(3)].map((_, i) => (
                <Card
                  key={i}
                  className="rounded-2xl shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <div className="px-5 pt-5 pb-3 border-b border-gray-50 dark:border-gray-700">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Skeleton className="h-8 w-8 rounded-xl" />
                      <Skeleton className="h-5 w-28" />
                    </div>
                    <Skeleton className="h-5 w-20 rounded-md" />
                  </div>
                  <div className="px-5 pb-5 pt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                        <Skeleton className="h-3 w-10 mb-2" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                        <Skeleton className="h-3 w-16 mb-2" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                      <Skeleton className="h-3 w-8 mb-2" />
                      <Skeleton className="h-5 w-14" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="xl:col-span-4 space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="rounded-2xl shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="px-5 pt-5 pb-3 border-b border-gray-50 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-6 w-36" />
                  </div>
                  <Skeleton className="h-4 w-44" />
                </div>
                <div className="px-5 pb-5 pt-4 space-y-2.5">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-600"
                    >
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Error state component
export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="w-full p-6 flex items-center justify-center">
      <motion.div variants={scaleInVariants} initial="hidden" animate="visible">
        <Card className="p-8 text-center max-w-md rounded-2xl shadow-lg border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center"
          >
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </motion.div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Failed to load dashboard
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">{error}</p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button onClick={onRetry} className="mt-6 font-semibold">
              Retry
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardSkeleton;
