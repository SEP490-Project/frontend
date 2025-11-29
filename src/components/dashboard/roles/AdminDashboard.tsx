import React, { useEffect, useState } from "react";
import {
  KPIWidget,
  LineChartWidget,
  TableWidget,
  BarChartWidget,
  PieChartWidget,
} from "@/components/dashboard/chart";
import { FaUser, FaMoneyBillWave, FaFileContract, FaBullhorn } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { useAdminAnalytic } from "@/libs/hooks/useAdminAnalytic";
import { useAppDispatch } from "@/libs/stores";
import {
  adminCampaigns,
  adminContracts,
  adminHealth,
  adminRevenue,
  adminUserGrowth,
  adminUserOverview,
} from "@/libs/stores/adminAnalyticManager/thunk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    loading,
    loadingRevenue,
    loadingUserGrowth,
    loadingUserOverview,
    campaigns,
    contracts,
    health,
    revenue,
    userGrowth,
    userOverview,
  } = useAdminAnalytic();

  const [currentDate] = useState(() => {
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    return {
      now: now.toISOString(),
      sixMonthsAgo: sixMonthsAgo.toISOString(),
    };
  });

  // Revenue filter
  const [revenueFilter, setRevenueFilter] = useState({
    start_date: currentDate.sixMonthsAgo,
    end_date: currentDate.now,
    granularity: "MONTH" as "DAY" | "WEEK" | "MONTH",
  });

  // User Growth filter
  const [userGrowthFilter, setUserGrowthFilter] = useState({
    start_date: currentDate.sixMonthsAgo,
    end_date: currentDate.now,
    granularity: "MONTH" as "DAY" | "WEEK" | "MONTH",
    role: "ALL" as
      | "ALL"
      | "ADMIN"
      | "MARKETING_STAFF"
      | "SALES_STAFF"
      | "CONTENT_STAFF"
      | "BRAND_PARTNER"
      | "CUSTOMER",
  });

  // User Overview filter
  const [userOverviewFilter, setUserOverviewFilter] = useState({
    start_date: currentDate.sixMonthsAgo,
    end_date: currentDate.now,
    role: "ALL" as
      | "ALL"
      | "ADMIN"
      | "MARKETING_STAFF"
      | "SALES_STAFF"
      | "CONTENT_STAFF"
      | "BRAND_PARTNER"
      | "CUSTOMER",
  });

  const fetchBasicData = () => {
    dispatch(adminCampaigns());
    dispatch(adminContracts());
    dispatch(adminHealth());
  };

  const fetchRevenue = () => {
    const filter: any = {
      start_date: revenueFilter.start_date,
      end_date: revenueFilter.end_date,
      granularity: revenueFilter.granularity,
    };
    dispatch(adminRevenue(filter));
  };

  const fetchUserGrowth = () => {
    const filter: any = {
      start_date: userGrowthFilter.start_date,
      end_date: userGrowthFilter.end_date,
      granularity: userGrowthFilter.granularity,
    };
    if (userGrowthFilter.role && userGrowthFilter.role !== "ALL") {
      filter.role = userGrowthFilter.role;
    }
    dispatch(adminUserGrowth(filter));
  };

  const fetchUserOverview = () => {
    const filter: any = {
      start_date: userOverviewFilter.start_date,
      end_date: userOverviewFilter.end_date,
    };
    if (userOverviewFilter.role && userOverviewFilter.role !== "ALL") {
      filter.role = userOverviewFilter.role;
    }
    dispatch(adminUserOverview(filter));
  };

  useEffect(() => {
    fetchBasicData();
  }, [dispatch]);

  useEffect(() => {
    fetchRevenue();
  }, [revenueFilter]);

  useEffect(() => {
    fetchUserGrowth();
  }, [userGrowthFilter]);

  useEffect(() => {
    fetchUserOverview();
  }, [userOverviewFilter]);

  // Data transformations
  const campaignsKPIData = {
    value: campaigns?.total_campaigns || 0,
    statusText: `${campaigns?.running || 0} running`,
  };

  const contractsKPIData = {
    value: contracts?.total_contracts || 0,
    statusText: `${contracts?.active || 0} active`,
  };

  const totalUsersData = {
    value: userOverview?.total_users || 0,
    status: "up" as const,
    statusText: `${userOverview?.new_users_this_month || 0} new this month`,
  };

  const totalRevenueData = {
    value: revenue?.total_revenue || 0,
    status: "up" as const,
    statusText: "Total",
  };

  const revenueBreakdownData = revenue?.revenue_breakdown
    ? [
        { name: "Advertising", value: Math.round(revenue.revenue_breakdown.advertising_revenue) },
        { name: "Affiliate", value: Math.round(revenue.revenue_breakdown.affiliate_revenue) },
        { name: "Ambassador", value: Math.round(revenue.revenue_breakdown.ambassador_revenue) },
        { name: "Co-Produce", value: Math.round(revenue.revenue_breakdown.co_producing_revenue) },
        {
          name: "Standard Product",
          value: Math.round(revenue.revenue_breakdown.standard_product_revenue),
        },
        {
          name: "Limited Product",
          value: Math.round(revenue.revenue_breakdown.limited_product_revenue),
        },
      ].filter((item) => item.value > 0)
    : [];

  const revenueShareData =
    revenue?.revenue_breakdown && revenue.total_revenue > 0
      ? [
          {
            type: "Contract Revenue",
            value: parseFloat(
              (
                (revenue.revenue_breakdown.total_contract_revenue / revenue.total_revenue) *
                100
              ).toFixed(1),
            ),
          },
          {
            type: "Product Revenue",
            value: parseFloat(
              (
                (revenue.revenue_breakdown.total_product_revenue / revenue.total_revenue) *
                100
              ).toFixed(1),
            ),
          },
        ].filter((item) => item.value > 0)
      : [];

  const revenueTrendData =
    revenue?.revenue_trend?.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString("default", { month: "short", day: "numeric" }),
      value: Math.round(item.revenue),
    })) || [];

  const userGrowthData =
    userGrowth?.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString("default", { month: "short", day: "numeric" }),
      value: item.new_users,
    })) || [];

  const roleBreakdownData = userOverview?.role_breakdown
    ? [
        { name: "Admin", value: userOverview.role_breakdown.admin },
        { name: "Marketing", value: userOverview.role_breakdown.marketing_staff },
        { name: "Sales", value: userOverview.role_breakdown.sales_staff },
        { name: "Content", value: userOverview.role_breakdown.content_staff },
        { name: "Brand Partner", value: userOverview.role_breakdown.brand_partner },
        { name: "Customer", value: userOverview.role_breakdown.customer },
      ].filter((item) => item.value > 0)
    : [];

  const campaignsTableData = campaigns
    ? [
        { status: "Total Campaigns", count: campaigns.total_campaigns },
        { status: "Running", count: campaigns.running },
        { status: "Draft", count: campaigns.draft },
        { status: "Completed", count: campaigns.completed },
        { status: "Cancelled", count: campaigns.cancelled },
        { status: "Content Created", count: campaigns.content_created },
        { status: "Content Posted", count: campaigns.content_posted },
      ]
    : [];

  const contractsTableData = contracts
    ? [
        {
          status: "Total Contracts",
          count: contracts.total_contracts,
          value: contracts.total_value,
        },
        { status: "Active", count: contracts.active, value: null },
        { status: "Draft", count: contracts.draft, value: null },
        { status: "Pending", count: contracts.pending, value: null },
        { status: "Completed", count: contracts.completed, value: null },
        { status: "Cancelled", count: contracts.cancelled, value: null },
        { status: "Collected Amount", count: null, value: contracts.collected_amount },
        { status: "Pending Amount", count: null, value: contracts.pending_amount },
      ]
    : [];

  const systemHealthData = health
    ? [
        { metric: "Database", status: health.database_status },
        { metric: "Cache", status: health.cache_status },
        { metric: "Queue", status: health.queue_status },
        { metric: "Pending Jobs", status: health.pending_jobs },
        { metric: "Failed Jobs (24h)", status: health.failed_jobs_24h },
        { metric: "Avg Response (ms)", status: health.average_response_ms },
        { metric: "Error Rate", status: `${(health.error_rate * 100).toFixed(2)}%` },
        { metric: "Uptime", status: health.uptime },
      ]
    : [];

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
      <h1 className="text-xl sm:text-2xl font-semibold">Admin Dashboard</h1>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          )}
          <KPIWidget
            title="Total Campaigns"
            data={campaignsKPIData}
            icon={<FaBullhorn size={20} />}
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
          />
        </div>
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          )}
          <KPIWidget
            title="Total Contracts"
            data={contractsKPIData}
            icon={<FaFileContract size={20} />}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
        </div>
        <div className="relative">
          {loadingUserOverview && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          )}
          <KPIWidget
            title="Total Users"
            data={totalUsersData}
            icon={<FaUser size={20} />}
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />
        </div>
        <div className="relative">
          {loadingRevenue && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          )}
          <KPIWidget
            title="Total Revenue"
            data={totalRevenueData}
            icon={<FaMoneyBillWave size={20} />}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-100"
          />
        </div>
      </div>

      {/* Revenue Section */}
      <Card className="p-4 relative">
        {loadingRevenue && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Revenue Trend</h2>
            <div className="flex gap-2 items-center flex-wrap">
              <Input
                type="date"
                value={revenueFilter.start_date}
                onChange={(e) => setRevenueFilter({ ...revenueFilter, start_date: e.target.value })}
                className="w-[150px] h-8 text-xs"
              />
              <span className="text-sm">to</span>
              <Input
                type="date"
                value={revenueFilter.end_date}
                onChange={(e) => setRevenueFilter({ ...revenueFilter, end_date: e.target.value })}
                className="w-[150px] h-8 text-xs"
              />
              <Select
                value={revenueFilter.granularity}
                onValueChange={(value: any) =>
                  setRevenueFilter({ ...revenueFilter, granularity: value })
                }
              >
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAY">Daily</SelectItem>
                  <SelectItem value="WEEK">Weekly</SelectItem>
                  <SelectItem value="MONTH">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <LineChartWidget title="" data={revenueTrendData} />
        </div>
      </Card>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 relative">
          {loadingRevenue && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Revenue Breakdown</h2>
            <BarChartWidget title="" data={revenueBreakdownData} />
          </div>
        </Card>

        <Card className="p-4 relative">
          {loadingRevenue && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Revenue Distribution</h2>
            <PieChartWidget title="" data={revenueShareData} />
          </div>
        </Card>
      </div>

      {/* User Growth */}
      <Card className="p-4 relative">
        {loadingUserGrowth && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold">User Growth</h2>
            <div className="flex gap-2 items-center flex-wrap">
              <Input
                type="date"
                value={userGrowthFilter.start_date}
                onChange={(e) =>
                  setUserGrowthFilter({ ...userGrowthFilter, start_date: e.target.value })
                }
                className="w-[150px] h-8 text-xs"
              />
              <span className="text-sm">to</span>
              <Input
                type="date"
                value={userGrowthFilter.end_date}
                onChange={(e) =>
                  setUserGrowthFilter({ ...userGrowthFilter, end_date: e.target.value })
                }
                className="w-[150px] h-8 text-xs"
              />
              <Select
                value={userGrowthFilter.granularity}
                onValueChange={(value: any) =>
                  setUserGrowthFilter({ ...userGrowthFilter, granularity: value })
                }
              >
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAY">Daily</SelectItem>
                  <SelectItem value="WEEK">Weekly</SelectItem>
                  <SelectItem value="MONTH">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={userGrowthFilter.role}
                onValueChange={(value: any) =>
                  setUserGrowthFilter({ ...userGrowthFilter, role: value })
                }
              >
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MARKETING_STAFF">Marketing</SelectItem>
                  <SelectItem value="SALES_STAFF">Sales</SelectItem>
                  <SelectItem value="CONTENT_STAFF">Content</SelectItem>
                  <SelectItem value="BRAND_PARTNER">Brand Partner</SelectItem>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <LineChartWidget title="" data={userGrowthData} />
        </div>
      </Card>

      {/* User Overview and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 relative">
          {loadingUserOverview && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-lg font-semibold">User Roles</h2>
              <Select
                value={userOverviewFilter.role}
                onValueChange={(value: any) =>
                  setUserOverviewFilter({ ...userOverviewFilter, role: value })
                }
              >
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MARKETING_STAFF">Marketing</SelectItem>
                  <SelectItem value="SALES_STAFF">Sales</SelectItem>
                  <SelectItem value="CONTENT_STAFF">Content</SelectItem>
                  <SelectItem value="BRAND_PARTNER">Brand Partner</SelectItem>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <BarChartWidget title="" data={roleBreakdownData} />
          </div>
        </Card>

        <Card className="p-4 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">System Health</h2>
            <TableWidget title="" data={systemHealthData} />
          </div>
        </Card>
      </div>

      {/* Campaigns and Contracts Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Campaigns Summary</h2>
            <TableWidget title="" data={campaignsTableData} />
          </div>
        </Card>

        <Card className="p-4 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Contracts Summary</h2>
            <TableWidget title="" data={contractsTableData} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
