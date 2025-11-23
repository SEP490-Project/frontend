import React, { useEffect } from "react";
import {
  KPIWidget,
  BarChartWidget,
  PieChartWidget,
  TableWidget,
} from "@/components/dashboard/chart";
import { FaBullhorn, FaRegCircleCheck, FaChartLine } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/libs/stores";
import { dashboard as marketingDashboard } from "@/libs/stores/marketingAnalyticManager/thunk";
import { useMarketingAnalytic } from "@/libs/hooks/useMarketingAnalytic";

const MarketingDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, dashboard } = useMarketingAnalytic();

  useEffect(() => {
    dispatch(marketingDashboard());
  }, [dispatch]);

  const activeBrandsData = {
    value: dashboard?.active_brands || 0,
    statusText: `${dashboard?.active_brands || 0} brands`,
  };
  const activeCampaignsData = {
    value: dashboard?.active_campaigns || 0,
    statusText: "Running",
  };
  const draftCampaignsData = {
    value: dashboard?.draft_campaigns || 0,
    statusText: "Draft status",
  };
  const monthlyRevenueData = {
    value: dashboard?.monthly_revenue || 0,
    status: "up" as const,
    statusText: `${dashboard?.revenue_month}/${dashboard?.revenue_year}`,
  };

  const brandRevenueData =
    dashboard?.top_brands?.map((brand: any) => ({
      name: brand.brand_name,
      value: Math.round(brand.revenue),
    })) || [];

  const revenueByTypeData = dashboard?.revenue_by_type
    ? [
        { name: "Advertising", value: Math.round(dashboard.revenue_by_type.advertising) },
        { name: "Affiliate", value: Math.round(dashboard.revenue_by_type.affiliate) },
        { name: "Co-produce", value: Math.round(dashboard.revenue_by_type.co_produce) },
        { name: "Brand Ambassador", value: Math.round(dashboard.revenue_by_type.brand_ambassador) },
        { name: "Standard Product", value: Math.round(dashboard.revenue_by_type.standard_product) },
      ].filter((item) => item.value > 0)
    : [];

  const revenueShareData = dashboard?.revenue_by_type
    ? [
        {
          type: "Advertising",
          value: parseFloat(
            (
              (dashboard.revenue_by_type.advertising / dashboard.revenue_by_type.total_revenue) *
              100
            ).toFixed(1),
          ),
        },
        {
          type: "Affiliate",
          value: parseFloat(
            (
              (dashboard.revenue_by_type.affiliate / dashboard.revenue_by_type.total_revenue) *
              100
            ).toFixed(1),
          ),
        },
        {
          type: "Co-produce",
          value: parseFloat(
            (
              (dashboard.revenue_by_type.co_produce / dashboard.revenue_by_type.total_revenue) *
              100
            ).toFixed(1),
          ),
        },
        {
          type: "Brand Ambassador",
          value: parseFloat(
            (
              (dashboard.revenue_by_type.brand_ambassador /
                dashboard.revenue_by_type.total_revenue) *
              100
            ).toFixed(1),
          ),
        },
        {
          type: "Standard Product",
          value: parseFloat(
            (
              (dashboard.revenue_by_type.standard_product /
                dashboard.revenue_by_type.total_revenue) *
              100
            ).toFixed(1),
          ),
        },
      ].filter((item) => item.value > 0)
    : [];

  const upcomingDeadlinesData =
    dashboard?.upcoming_deadlines?.map((deadline: any) => ({
      campaign: deadline.name,
      brand: deadline.brand_name,
      endDate: new Date(deadline.end_date).toLocaleDateString(),
      daysRemaining: `${deadline.days_remaining} days`,
    })) || [];

  const alertsData = [
    ...(dashboard?.upcoming_deadlines
      ?.filter((d: any) => d.days_remaining <= 7)
      .map((deadline: any) => ({
        type: "Deadline Alert",
        message: `Campaign "${deadline.name}" ending in ${deadline.days_remaining} days`,
        priority: deadline.days_remaining <= 3 ? "High" : "Medium",
      })) || []),
    ...(dashboard?.draft_campaigns && dashboard.draft_campaigns > 0
      ? [
          {
            type: "Draft Campaigns",
            message: `${dashboard.draft_campaigns} campaigns in draft status`,
            priority: "Low" as const,
          },
        ]
      : []),
  ];

  if (loading) {
    return (
      <div className="p-2 sm:p-6 w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 text-primary animate-spin" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Marketing Staff Dashboard</h1>

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
          icon={<FaBullhorn size={20} />}
          iconColor="text-pink-600"
          iconBg="bg-pink-100"
        />
        <KPIWidget
          title="Draft Campaigns"
          data={draftCampaignsData}
          icon={<FaRegCircleCheck size={20} />}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
        />
        <KPIWidget
          title="Monthly Revenue"
          data={monthlyRevenueData}
          icon={<FaChartLine size={20} />}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-100"
        />
      </div>

      <div className="flex flex-col gap-4">
        <BarChartWidget title="Top Brands by Revenue" data={brandRevenueData} />
        <BarChartWidget title="Revenue by Type" data={revenueByTypeData} />
        <PieChartWidget title="Revenue Distribution" data={revenueShareData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TableWidget title="Upcoming Deadlines" data={upcomingDeadlinesData} />
        <TableWidget title="Alerts" data={alertsData} />
      </div>
    </div>
  );
};

export default MarketingDashboard;
