import React from "react";
import { KPIWidget, BarChartWidget } from "@/components/dashboard/chart";
import { FaClipboardList, FaChartLine, FaTasks } from "react-icons/fa";

const ContentDashboard: React.FC = () => {
  // Mock data - replace with real API calls
  const totalPostsData = { value: 156, status: "up" as const, statusText: "+12 this week" };
  const totalViewsData = { value: 2500000, status: "up" as const, statusText: "+15%" };
  const totalEngagementData = { value: 95000, status: "up" as const, statusText: "+8%" };
  const avgCTRData = { value: "3.2%", status: "down" as const, statusText: "-0.1%" };

  const channelPerformanceData = [
    { name: "Facebook", value: 850000 },
    { name: "Instagram", value: 920000 },
    { name: "TikTok", value: 1200000 },
    { name: "YouTube", value: 680000 },
  ];

  return (
    <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Content Staff Dashboard</h1>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIWidget
          title="Total Posts"
          data={totalPostsData}
          icon={<FaClipboardList size={20} />}
          iconColor="text-cyan-600"
          iconBg="bg-cyan-100"
        />
        <KPIWidget
          title="Total Views"
          data={totalViewsData}
          icon={<FaChartLine size={20} />}
          iconColor="text-yellow-600"
          iconBg="bg-yellow-100"
        />
        <KPIWidget
          title="Total Engagement"
          data={totalEngagementData}
          icon={<FaTasks size={20} />}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
        />
        <KPIWidget
          title="Average CTR"
          data={avgCTRData}
          icon={<FaChartLine size={20} />}
          iconColor="text-rose-600"
          iconBg="bg-rose-100"
        />
      </div>

      {/* Chart Section */}
      <div className="flex flex-col gap-4">
        <BarChartWidget title="Channel Performance" data={channelPerformanceData} />
      </div>
    </div>
  );
};

export default ContentDashboard;
