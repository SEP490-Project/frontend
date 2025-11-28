import React, { useState } from "react";
import { KPIWidget, LineChartWidget, PieChartWidget } from "@/components/dashboard/chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  FaUsers,
  FaHeart,
  FaEye,
  FaChartLine,
  FaFacebookF,
  FaPlay,
  FaGlobe,
  FaArrowUp,
  FaCalendarAlt,
  FaBell,
  FaDownload,
} from "react-icons/fa";

const ContentDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");

  // Main KPI Data based on instruction.ts
  const totalPosts = { value: 156, status: "up" as const, statusText: "+12 this week" };
  const totalViews = { value: 2135000, status: "up" as const, statusText: "+18% views" };
  const totalEngagement = { value: 95000, status: "up" as const, statusText: "+15%" };
  const conversionRate = { value: "3.2%", status: "up" as const, statusText: "+0.4%" };

  // Facebook Metrics
  const facebookFollowers = { value: 52800, status: "up" as const, statusText: "+1,480 this week" };
  const facebookReach = { value: 285000, status: "up" as const, statusText: "+24% this month" };

  // TikTok Metrics
  const tiktokFollowers = { value: 89200, status: "up" as const, statusText: "+2,350 this week" };
  const tiktokVideoViews = { value: 1850000, status: "up" as const, statusText: "+45% this month" };

  // Website Metrics
  const websitePageViews = { value: 125000, status: "up" as const, statusText: "+15% this month" };
  const websiteUniqueVisitors = {
    value: 85600,
    status: "up" as const,
    statusText: "+22% this month",
  };

  const platformDistribution = [
    { type: "Facebook", value: 35 },
    { type: "TikTok", value: 42 },
    { type: "Website", value: 23 },
  ];

  const weeklyCTR = [
    { month: "Facebook", value: 2.8 },
    { month: "TikTok", value: 3.6 },
    { month: "Website", value: 2.4 },
  ];

  // Top performing content
  const topContent = [
    {
      title: "Summer Beauty Tutorial",
      type: "Video",
      platform: "TikTok",
      views: 450000,
      engagement: "8.5%",
      date: "Nov 22",
      status: "trending",
    },
    {
      title: "Product Launch Campaign",
      type: "Post",
      platform: "Facebook",
      views: 380000,
      engagement: "6.2%",
      date: "Nov 20",
      status: "active",
    },
    {
      title: "Ultimate Skincare Guide",
      type: "Blog",
      platform: "Website",
      views: 125000,
      engagement: "12.3%",
      date: "Nov 18",
      status: "published",
    },
    {
      title: "Morning Routine GRWM",
      type: "Video",
      platform: "TikTok",
      views: 320000,
      engagement: "9.1%",
      date: "Nov 15",
      status: "trending",
    },
  ];

  return (
    <div className="p-6 w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Content performance overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {(["week", "month", "year"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === period
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <FaBell size={18} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaDownload size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Main Content */}
        <div className="col-span-8 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            <KPIWidget
              title="Total Posts"
              data={totalPosts}
              icon={<FaCalendarAlt size={20} />}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
            />
            <KPIWidget
              title="Total Views"
              data={totalViews}
              icon={<FaEye size={20} />}
              iconColor="text-green-600"
              iconBg="bg-green-100"
            />
            <KPIWidget
              title="Engagement"
              data={totalEngagement}
              icon={<FaHeart size={20} />}
              iconColor="text-red-600"
              iconBg="bg-red-100"
            />
            <KPIWidget
              title="Conversion"
              data={conversionRate}
              icon={<FaArrowUp size={20} />}
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
            />
          </div>

          {/* Platform Performance */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Platform Distribution</CardTitle>
                <p className="text-sm text-gray-500">Audience by platform</p>
              </CardHeader>
              <CardContent>
                <PieChartWidget title="" data={platformDistribution} />
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Weekly CTR Trends</CardTitle>
                <p className="text-sm text-gray-500">Click-through rate by channel</p>
              </CardHeader>
              <CardContent>
                <LineChartWidget title="" data={weeklyCTR} />
              </CardContent>
            </Card>
          </div>

          {/* Platform Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Facebook Card */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FaFacebookF className="text-blue-600" size={18} />
                  Facebook
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">Social media platform</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Followers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {facebookFollowers.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <FaArrowUp size={12} />
                    +1,480 this week
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Reach</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {facebookReach.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <FaArrowUp size={12} />
                    +24% this month
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Engagement Rate</p>
                  <p className="text-lg font-semibold text-blue-600">6.5%</p>
                </div>
              </CardContent>
            </Card>

            {/* TikTok Card */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FaPlay className="text-black" size={18} />
                  TikTok
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">Video platform</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Followers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tiktokFollowers.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <FaArrowUp size={12} />
                    +2,350 this week
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Video Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(tiktokVideoViews.value / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <FaArrowUp size={12} />
                    +45% this month
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Completion Rate</p>
                  <p className="text-lg font-semibold text-gray-800">78%</p>
                </div>
              </CardContent>
            </Card>

            {/* Website Card */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FaGlobe className="text-green-600" size={18} />
                  Website
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">Web analytics</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Page Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {websitePageViews.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <FaArrowUp size={12} />
                    +15% this month
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Unique Visitors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {websiteUniqueVisitors.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <FaArrowUp size={12} />
                    +22% this month
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Bounce Rate</p>
                  <p className="text-lg font-semibold text-green-600">42.3%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="col-span-4 space-y-6">
          {/* Top Content */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Top Content</CardTitle>
              <p className="text-sm text-gray-500">Best performing posts</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContent.map((content, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          content.platform === "Facebook"
                            ? "bg-blue-100 text-blue-600"
                            : content.platform === "TikTok"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-green-100 text-green-600"
                        }`}
                      >
                        {content.platform === "Facebook" ? (
                          <FaFacebookF size={16} />
                        ) : content.platform === "TikTok" ? (
                          <FaPlay size={16} />
                        ) : (
                          <FaGlobe size={16} />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{content.title}</p>
                      <p className="text-xs text-gray-500">
                        {content.platform} • {content.type} • {content.date}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-600">
                          👁 {content.views.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-600">📈 {content.engagement}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            content.status === "trending"
                              ? "bg-red-100 text-red-600"
                              : content.status === "active"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-green-100 text-green-600"
                          }`}
                        >
                          {content.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2">
                  View all content →
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FaCalendarAlt className="text-white" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Schedule Post</p>
                    <p className="text-xs text-gray-500">Create new content</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <FaChartLine className="text-white" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">View Analytics</p>
                    <p className="text-xs text-gray-500">Detailed reports</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <FaUsers className="text-white" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Team Management</p>
                    <p className="text-xs text-gray-500">Manage team roles</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentDashboard;
