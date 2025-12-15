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
    <div className="p-6 w-full flex flex-col gap-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-[180px] rounded-md" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>

          {/* Posting Frequency & Pending Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="rounded-2xl shadow-sm p-4">
                <Skeleton className="h-6 w-36 mb-2" />
                <Skeleton className="h-4 w-28 mb-4" />
                <Skeleton className="h-12 w-full mb-3" />
                <Skeleton className="h-2.5 w-full rounded-full mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="rounded-2xl shadow-sm p-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-40 mb-4" />
                <Skeleton className="h-48 w-full rounded-lg" />
              </Card>
            ))}
          </div>

          {/* Channel Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="rounded-2xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-28 mb-4" />
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <Skeleton className="h-3 w-12 mb-1" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <Skeleton className="h-3 w-8 mb-1" />
                  <Skeleton className="h-6 w-14" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="rounded-2xl shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-40 mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="p-3 bg-gray-50 rounded-lg">
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
  );
};

// Error state component
export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="p-6 w-full flex items-center justify-center min-h-[400px]">
      <motion.div variants={scaleInVariants} initial="hidden" animate="visible">
        <Card className="p-8 text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          >
            <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900">Failed to load dashboard</h3>
          <p className="text-gray-500 mt-2">{error}</p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button onClick={onRetry} className="mt-4">
              Retry
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardSkeleton;
