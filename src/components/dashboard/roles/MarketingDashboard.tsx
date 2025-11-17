import React from "react";
import {
  KPIWidget,
  BarChartWidget,
  LineChartWidget,
  PieChartWidget,
  TableWidget,
} from "@/components/dashboard/chart";
import { FaBullhorn, FaCheckCircle, FaChartLine } from "react-icons/fa";
import { MdCampaign } from "react-icons/md";

const MarketingDashboard: React.FC = () => {
  // Mock data - replace with real API calls
  const activeBrandsData = { value: 24, status: "up" as const, statusText: "+3 this month" };
  const activeCampaignsData = { value: 8, statusText: "Running" };
  const finishedCampaignsData = { value: 15, status: "up" as const, statusText: "+5 completed" };
  const monthlyRevenueData = { value: 850000000, status: "up" as const, statusText: "+12%" };

  const brandRevenueData = [
    { name: "Nike", value: 125000 },
    { name: "Adidas", value: 98000 },
    { name: "Puma", value: 76000 },
    { name: "Under Armour", value: 54000 },
  ];

  const monthlyReachData = [
    { month: "Jan", reach: 2500000, engagement: 85000 },
    { month: "Feb", reach: 2800000, engagement: 92000 },
    { month: "Mar", reach: 3100000, engagement: 98000 },
    { month: "Apr", reach: 2900000, engagement: 89000 },
    { month: "May", reach: 3300000, engagement: 105000 },
    { month: "Jun", reach: 3600000, engagement: 115000 },
  ];

  const collabRevenueShareData = [
    { type: "Influencer A", value: 35 },
    { type: "Influencer B", value: 25 },
    { type: "Influencer C", value: 20 },
    { type: "Others", value: 20 },
  ];

  const campaignTimelineData = [
    { campaign: "Summer Sale 2024", status: "Active", endDate: "2024-12-01", budget: "$50,000" },
    { campaign: "Black Friday", status: "Planning", endDate: "2024-11-29", budget: "$75,000" },
    { campaign: "Holiday Special", status: "Draft", endDate: "2024-12-25", budget: "$60,000" },
  ];

  const alertsData = [
    { type: "Budget Alert", message: "Campaign XYZ approaching 80% budget", priority: "High" },
    { type: "Performance", message: "CTR below target for Instagram ads", priority: "Medium" },
    { type: "Approval", message: "3 campaigns pending approval", priority: "Low" },
  ];

  return (
    <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Marketing Staff Dashboard</h1>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIWidget
          title="Active Brands"
          data={activeBrandsData}
          icon={<FaBullhorn size={20} />}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        <KPIWidget
          title="Active Campaigns"
          data={activeCampaignsData}
          icon={<MdCampaign size={20} />}
          iconColor="text-pink-600"
          iconBg="bg-pink-100"
        />
        <KPIWidget
          title="Finished Campaigns"
          data={finishedCampaignsData}
          icon={<FaCheckCircle size={20} />}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-100"
        />
        <KPIWidget
          title="Monthly Revenue"
          data={monthlyRevenueData}
          icon={<FaChartLine size={20} />}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-100"
        />
      </div>

      {/* Chart Section */}
      <div className="flex flex-col gap-4">
        <BarChartWidget title="Brand Revenue" data={brandRevenueData} />
        <LineChartWidget title="Monthly Reach & Engagement" data={monthlyReachData} />
        <PieChartWidget title="Collaborative Revenue Share" data={collabRevenueShareData} />
      </div>

      {/* Table Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TableWidget title="Campaign Timeline" data={campaignTimelineData} />
        <TableWidget title="Alerts" data={alertsData} />
      </div>
    </div>
  );
};

export default MarketingDashboard;
