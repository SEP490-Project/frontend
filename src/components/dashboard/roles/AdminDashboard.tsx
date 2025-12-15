import React, { useEffect, useMemo, useState } from "react";
import {
  KPIWidget,
  LineChartWidget,
  TableWidget,
  BarChartWidget,
  PieChartWidget,
} from "@/components/dashboard/chart";
import {
  FaUser,
  FaMoneyBillWave,
  FaFileContract,
  FaBullhorn,
  FaTriangleExclamation,
} from "react-icons/fa6";
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
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/date-picker";

type Granularity = "DAY" | "WEEK" | "MONTH";
type Role =
  | "ALL"
  | "ADMIN"
  | "MARKETING_STAFF"
  | "SALES_STAFF"
  | "CONTENT_STAFF"
  | "BRAND_PARTNER"
  | "CUSTOMER";

type ChartMode = "count" | "percent";

interface RangeFilter {
  start_date: string;
  end_date: string;
}

interface RevenueFilter extends RangeFilter {
  granularity: Granularity;
}

interface UserGrowthFilter extends RangeFilter {
  granularity: Granularity;
  role: Role;
}

const formatCurrency = (value: number | null | undefined) =>
  typeof value === "number" ? value.toLocaleString("vi-VN") : "-";

const formatDateInput = (value?: string) => (value ? value.substring(0, 10) : "");

const isEmptyData = (data: any[]) => {
  return (
    !data ||
    data.length === 0 ||
    data.every(
      (item) =>
        (typeof item.value === "number" && item.value === 0) ||
        (typeof item.count === "number" && item.count === 0),
    )
  );
};

const NoDataMessage: React.FC<{ message?: string }> = ({
  message = "No data available to display",
}) => (
  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
    <FaTriangleExclamation className="h-12 w-12 mb-2 text-gray-400" />
    <p className="text-sm">{message}</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [revenueChartMode, setRevenueChartMode] = useState<ChartMode>("percent");
  const [roleChartMode, setRoleChartMode] = useState<ChartMode>("percent");

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

  const [revenueFilter, setRevenueFilter] = useState<RevenueFilter>({
    start_date: "",
    end_date: "",
    granularity: "MONTH",
  });

  const [userGrowthFilter, setUserGrowthFilter] = useState<UserGrowthFilter>({
    start_date: "",
    end_date: "",
    granularity: "MONTH",
    role: "ALL",
  });

  useEffect(() => {
    dispatch(adminCampaigns());
    dispatch(adminContracts());
    dispatch(adminHealth());
  }, [dispatch]);

  useEffect(() => {
    const { start_date, end_date, granularity } = revenueFilter;
    const payload: any = {};
    if (start_date) payload.start_date = start_date;
    if (end_date) payload.end_date = end_date;
    if (granularity) payload.granularity = granularity;
    dispatch(adminRevenue(payload));
  }, [dispatch, revenueFilter]);

  useEffect(() => {
    const { start_date, end_date, granularity, role } = userGrowthFilter;
    const payload: any = {};
    if (start_date) payload.start_date = start_date;
    if (end_date) payload.end_date = end_date;
    if (granularity) payload.granularity = granularity;
    if (role && role !== "ALL") payload.role = role;
    dispatch(adminUserGrowth(payload));
  }, [dispatch, userGrowthFilter]);

  useEffect(() => {
    dispatch(adminUserOverview({}));
  }, [dispatch]);

  const campaignsKPIData = useMemo(
    () => ({
      value: campaigns?.total_campaigns || 0,
      statusText: `${campaigns?.running || 0} running`,
    }),
    [campaigns],
  );

  const contractsKPIData = useMemo(
    () => ({
      value: contracts?.total_contracts || 0,
      statusText: `${contracts?.active || 0} active`,
    }),
    [contracts],
  );

  const totalUsersData = useMemo(
    () => ({
      value: userOverview?.total_users || 0,
      status: "up" as const,
      statusText: `${userOverview?.new_users_this_month || 0} new this month`,
    }),
    [userOverview],
  );

  const totalRevenueData = useMemo(
    () => ({
      value: revenue?.total_revenue || 0,
      status: "up" as const,
      statusText: "Total",
    }),
    [revenue],
  );

  const revenueBreakdownData = useMemo(() => {
    if (!revenue?.revenue_breakdown) return [];
    const r = revenue.revenue_breakdown;
    const data = [
      { name: "Advertising", value: Math.round(r.advertising_revenue) },
      { name: "Affiliate", value: Math.round(r.affiliate_revenue) },
      { name: "Ambassador", value: Math.round(r.ambassador_revenue) },
      { name: "Co-Produce", value: Math.round(r.co_producing_revenue) },
      { name: "Standard Product", value: Math.round(r.standard_product_revenue) },
      { name: "Limited Product", value: Math.round(r.limited_product_revenue) },
    ];
    return data.filter((item) => item.value > 0);
  }, [revenue?.revenue_breakdown]);

  const rawRevenueShareData = useMemo(() => {
    if (!revenue?.revenue_breakdown || !revenue.total_revenue) return [];
    const r = revenue.revenue_breakdown;
    const data = [
      { type: "Contract Revenue", value: Number(r.total_contract_revenue) },
      { type: "Product Revenue", value: Number(r.total_product_revenue) },
    ];
    return data.filter((item) => item.value > 0);
  }, [revenue?.revenue_breakdown, revenue?.total_revenue]);

  const revenueShareData = useMemo(() => {
    if (!rawRevenueShareData.length) return [];
    if (revenueChartMode === "count") return rawRevenueShareData;

    const total = rawRevenueShareData.reduce((sum, item) => sum + item.value, 0);
    return rawRevenueShareData.map((item) => ({
      type: item.type,
      value: total ? Number(((item.value / total) * 100).toFixed(1)) : 0,
    }));
  }, [rawRevenueShareData, revenueChartMode]);

  const revenueTrendData = useMemo(
    () =>
      revenue?.revenue_trend?.map((item: any) => ({
        month: new Date(item.date).toLocaleDateString("default", {
          month: "short",
          day: "numeric",
        }),
        value: Math.round(item.revenue),
      })) || [],
    [revenue?.revenue_trend],
  );

  const userGrowthData = useMemo(
    () =>
      userGrowth?.map((item: any) => ({
        month: new Date(item.date).toLocaleDateString("default", {
          month: "short",
          day: "numeric",
        }),
        value: item.new_users,
      })) || [],
    [userGrowth],
  );

  const rawRoleData = useMemo(() => {
    if (!userOverview?.role_breakdown) return [];
    const rb = userOverview.role_breakdown;
    const data = [
      { type: "Admin", value: Number(rb.admin) },
      { type: "Marketing", value: Number(rb.marketing_staff) },
      { type: "Sales", value: Number(rb.sales_staff) },
      { type: "Content", value: Number(rb.content_staff) },
      { type: "Brand Partner", value: Number(rb.brand_partner) },
      { type: "Customer", value: Number(rb.customer) },
    ];
    return data.filter((item) => item.value > 0);
  }, [userOverview?.role_breakdown]);

  const roleBreakdownData = useMemo(() => {
    if (!rawRoleData.length) return [];
    if (roleChartMode === "count") return rawRoleData;

    const total = rawRoleData.reduce((sum, item) => sum + item.value, 0);
    return rawRoleData.map((item) => ({
      type: item.type,
      value: total ? Number(((item.value / total) * 100).toFixed(1)) : 0,
    }));
  }, [rawRoleData, roleChartMode]);

  const campaignsTableData = useMemo(
    () =>
      campaigns
        ? [
            { status: "Total Campaigns", count: campaigns.total_campaigns },
            { status: "Running", count: campaigns.running },
            { status: "Draft", count: campaigns.draft },
            { status: "Completed", count: campaigns.completed },
            { status: "Cancelled", count: campaigns.cancelled },
            { status: "Content Created", count: campaigns.content_created },
            { status: "Content Posted", count: campaigns.content_posted },
          ]
        : [],
    [campaigns],
  );

  const totalCampaigns = campaigns?.total_campaigns ?? 0;
  const runningCampaigns = campaigns?.running ?? 0;
  const completedCampaigns = campaigns?.completed ?? 0;
  const contentCreated = campaigns?.content_created ?? 0;
  const contentPosted = campaigns?.content_posted ?? 0;

  const completionRate = totalCampaigns
    ? Math.round((completedCampaigns / totalCampaigns) * 100)
    : 0;

  const contentPostRate = contentCreated ? Math.round((contentPosted / contentCreated) * 100) : 0;

  const totalContracts = contracts?.total_contracts ?? 0;
  const completedContracts = contracts?.completed ?? 0;
  const contractCompletionRate = totalContracts
    ? Math.round((completedContracts / totalContracts) * 100)
    : 0;

  const contractsStatusTableData = useMemo(
    () =>
      contracts
        ? [
            { status: "Total Contracts", count: contracts.total_contracts ?? 0 },
            { status: "Active", count: contracts.active ?? 0 },
            { status: "Draft", count: contracts.draft ?? 0 },
            { status: "Pending", count: contracts.pending ?? 0 },
            { status: "Completed", count: contracts.completed ?? 0 },
            { status: "Cancelled", count: contracts.cancelled ?? 0 },
          ]
        : [],
    [contracts],
  );

  const contractsFinanceTableData = useMemo(
    () =>
      contracts
        ? [
            {
              metric: "Total Contract Amount",
              amount: formatCurrency(contracts.total_value),
            },
            {
              metric: "Collected Contract Amount",
              amount: formatCurrency(contracts.collected_amount),
            },
            {
              metric: "Pending Contract Amount",
              amount: formatCurrency(contracts.pending_amount),
            },
          ]
        : [],
    [contracts],
  );

  const systemHealthData = useMemo(
    () =>
      health
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
        : [],
    [health],
  );

  const isAnyLoading = loading || loadingRevenue || loadingUserGrowth || loadingUserOverview;

  return (
    <div className="p-2 sm:p-6 w-full flex flex-col gap-6 relative">
      {isAnyLoading && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 text-primary animate-spin" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )}

      <h1 className="text-xl sm:text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIWidget
          title="Total Campaigns"
          data={campaignsKPIData}
          icon={<FaBullhorn size={20} />}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
          tooltip="Total number of marketing campaigns created in the system, including running, draft, completed, and cancelled campaigns"
        />
        <KPIWidget
          title="Total Contracts"
          data={contractsKPIData}
          icon={<FaFileContract size={20} />}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
          tooltip="Total number of contracts signed with brand partners, including active, pending, and completed agreements"
        />
        <KPIWidget
          title="Total Users"
          data={totalUsersData}
          icon={<FaUser size={20} />}
          iconColor="text-green-600"
          iconBg="bg-green-100"
          tooltip="Total number of registered users across all roles including admin, staff, brand partners, and customers"
        />
        <KPIWidget
          title="Total Revenue"
          data={totalRevenueData}
          icon={<FaMoneyBillWave size={20} />}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-100"
          tooltip="Total revenue generated from all sources including contracts, product sales, advertising, and affiliate commissions"
        />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Total Revenue Trend</h2>
            <div className="flex gap-2 items-center flex-wrap">
              <DatePicker
                value={formatDateInput(revenueFilter.start_date)}
                onChange={(value) =>
                  setRevenueFilter((prev) => ({
                    ...prev,
                    start_date: value ? new Date(value).toISOString() : "",
                  }))
                }
                dateFormat="dd/MM/yyyy"
                className="w-[150px]"
                placeholder="Start date"
                maxDate={new Date().toISOString()}
              />
              <span className="text-sm">to</span>
              <DatePicker
                value={formatDateInput(revenueFilter.end_date)}
                onChange={(value) =>
                  setRevenueFilter((prev) => ({
                    ...prev,
                    end_date: value ? new Date(value).toISOString() : "",
                  }))
                }
                dateFormat="dd/MM/yyyy"
                className="w-[150px]"
                placeholder="End date"
                maxDate={new Date().toISOString()}
              />
              <Select
                value={revenueFilter.granularity}
                onValueChange={(value: Granularity) =>
                  setRevenueFilter((prev) => ({ ...prev, granularity: value }))
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
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setRevenueFilter({ start_date: "", end_date: "", granularity: "MONTH" })
                }
                className="h-8 text-xs"
              >
                Reset
              </Button>
            </div>
          </div>
          {isEmptyData(revenueTrendData) ? (
            <NoDataMessage message="No revenue data available for the selected time period" />
          ) : (
            <LineChartWidget
              title=""
              data={revenueTrendData}
              unit="VND"
              lineConfig={{
                value: {
                  label: "Total Revenue",
                  color: "#6366f1",
                },
              }}
              tooltip="Revenue trend over time showing the total income generated from all business activities in the selected time period"
            />
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Contract & Order Revenue Breakdown</h2>
            {isEmptyData(revenueBreakdownData) ? (
              <NoDataMessage message="No revenue analytics data available" />
            ) : (
              <BarChartWidget title="" data={revenueBreakdownData} unit="VND" />
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-lg font-semibold">Revenue Distribution</h2>
              <Select
                value={revenueChartMode}
                onValueChange={(value: ChartMode) => setRevenueChartMode(value)}
              >
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Amount</SelectItem>
                  <SelectItem value="percent">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isEmptyData(revenueShareData) ? (
              <NoDataMessage message="No revenue distribution data available" />
            ) : (
              <PieChartWidget title="" data={revenueShareData} mode={revenueChartMode} />
            )}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Campaigns Summary</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPIWidget
              title="Total Campaigns"
              data={{
                value: totalCampaigns,
                status: "up",
                statusText: `${runningCampaigns} running`,
              }}
              icon={<FaBullhorn size={20} />}
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
              tooltip="Total count of all marketing campaigns with breakdown of currently running campaigns"
            />

            <KPIWidget
              title="Completion Rate (%)"
              data={{
                value: completionRate,
                status: "up",
                statusText: `${completedCampaigns}/${totalCampaigns} completed`,
              }}
              icon={<FaBullhorn size={20} />}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-100"
              tooltip="Percentage of campaigns that have been completed successfully out of total campaigns created"
            />

            <KPIWidget
              title="Content Posted"
              data={{
                value: contentPosted,
                status: contentPostRate >= 50 ? "up" : "down",
                statusText: `${contentPostRate}% of created`,
              }}
              icon={<FaBullhorn size={20} />}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
              tooltip="Total number of content pieces that have been posted and published, showing the percentage of created content that went live"
            />
          </div>

          {isEmptyData(campaignsTableData) ? (
            <NoDataMessage message="No campaign data available" />
          ) : (
            <TableWidget
              title="Details"
              data={campaignsTableData}
              tooltip="Detailed breakdown of campaigns by status including total, running, draft, completed, cancelled, and content creation progress"
            />
          )}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Contracts Summary</h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <KPIWidget
              title="Total Contracts"
              data={{
                value: contracts?.total_contracts ?? 0,
              }}
              icon={<FaFileContract size={20} />}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
            />
            <KPIWidget
              title="Completion Rate (%)"
              data={{
                value: contractCompletionRate,
                status: "up",
                statusText: `${completedContracts}/${totalContracts} completed`,
              }}
              icon={<FaFileContract size={20} />}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-100"
            />
            <KPIWidget
              title="Total Contract Value"
              data={{
                value: contracts?.total_value ?? 0,
              }}
              icon={<FaMoneyBillWave size={20} />}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-100"
            />
            <KPIWidget
              title="Contract Amount Collected / Pending"
              data={{
                value: contracts?.collected_amount ?? 0,
                status: "up",
                statusText: `Pending: ${formatCurrency(contracts?.pending_amount ?? 0)}`,
              }}
              icon={<FaMoneyBillWave size={20} />}
              iconColor="text-amber-600"
              iconBg="bg-amber-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isEmptyData(contractsStatusTableData) ? (
              <NoDataMessage message="No contract data available by status" />
            ) : (
              <TableWidget title="By Status" data={contractsStatusTableData} />
            )}
            {isEmptyData(contractsFinanceTableData) ? (
              <NoDataMessage message="No contract financial data available" />
            ) : (
              <TableWidget title="By Value" data={contractsFinanceTableData} />
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4 relative">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold">User Growth</h2>
            <div className="flex gap-2 items-center flex-wrap">
              <DatePicker
                value={formatDateInput(userGrowthFilter.start_date)}
                onChange={(value) =>
                  setUserGrowthFilter((prev) => ({
                    ...prev,
                    start_date: value ? new Date(value).toISOString() : prev.start_date,
                  }))
                }
                dateFormat="dd/MM/yyyy"
                className="w-[150px]"
                placeholder="Start date"
                maxDate={new Date().toISOString()}
              />
              <span className="text-sm">to</span>
              <DatePicker
                value={formatDateInput(userGrowthFilter.end_date)}
                onChange={(value) =>
                  setUserGrowthFilter((prev) => ({
                    ...prev,
                    end_date: value ? new Date(value).toISOString() : prev.end_date,
                  }))
                }
                dateFormat="dd/MM/yyyy"
                className="w-[150px]"
                placeholder="End date"
                maxDate={new Date().toISOString()}
              />
              <Select
                value={userGrowthFilter.granularity}
                onValueChange={(value: Granularity) =>
                  setUserGrowthFilter((prev) => ({ ...prev, granularity: value }))
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
                onValueChange={(value: Role) =>
                  setUserGrowthFilter((prev) => ({ ...prev, role: value }))
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
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setUserGrowthFilter({
                    start_date: "",
                    end_date: "",
                    granularity: "MONTH",
                    role: "ALL",
                  })
                }
                className="h-8 text-xs"
              >
                Reset
              </Button>
            </div>
          </div>
          {isEmptyData(userGrowthData) ? (
            <NoDataMessage message="No user growth data available for the selected time period" />
          ) : (
            <LineChartWidget
              title=""
              data={userGrowthData}
              unit="account"
              lineConfig={{
                value: {
                  label: "New Users",
                  color: "#10b981",
                },
              }}
            />
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 relative">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-lg font-semibold">User Roles</h2>
              <Select
                value={roleChartMode}
                onValueChange={(value: ChartMode) => setRoleChartMode(value)}
              >
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Quantity</SelectItem>
                  <SelectItem value="percent">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isEmptyData(roleBreakdownData) ? (
              <NoDataMessage message="No user role distribution data available" />
            ) : (
              <PieChartWidget title="" data={roleBreakdownData} mode={roleChartMode} />
            )}
          </div>
        </Card>

        <Card className="p-4 relative">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">System Health</h2>
            {isEmptyData(systemHealthData) ? (
              <NoDataMessage message="No system status data available" />
            ) : (
              <TableWidget title="" data={systemHealthData} />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
