import React, { useCallback, useEffect, useState } from "react";
import { useMarketingAnalytic } from "@/libs/hooks/useMarketingAnalytic";
import {
  marketingActiveBrand,
  marketingActiveCampaign,
  marketingDraftCampaign,
  marketingContractStatusDistribution,
  marketingTaskStatusDistribution,
  marketingRefundViolationStats,
  marketingGrossRevenue,
  marketingNetRevenue,
  marketingContractRevenueBreakdown,
  marketingUpcomingDeadline,
  marketingTopBrand,
  marketingRevenueType,
} from "@/libs/stores/marketingAnalyticManager/thunk";
import {
  setPeriod,
  setCustomDateRange,
  setTrendGranularity,
} from "@/libs/stores/marketingAnalyticManager/slice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FaBullhorn,
  FaRegCircleCheck,
  FaTriangleExclamation,
  FaMoneyBillWave,
  FaChartLine,
} from "react-icons/fa6";
import { Loader2, RefreshCw } from "lucide-react";
import {
  ComposedChartWidget,
  PieChartWidget,
  KPIWidget,
  BarChartWidget,
  TableWidget,
} from "@/components/dashboard/chart";
import { useAppDispatch } from "@/libs/stores";

const isEmptyData = (data: any[]) => {
  return (
    !data ||
    data.length === 0 ||
    data.every(
      (item) =>
        (typeof item.value === "number" && item.value === 0) ||
        (typeof item.count === "number" && item.count === 0) ||
        (typeof item.revenue === "number" && item.revenue === 0),
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

const MarketingDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    loading,
    loadingKPI,
    loadingRevenue,
    loadingTopBrands,
    loadingDeadlines,
    loadingContractStatus,
    loadingTaskStatus,
    loadingRefundViolation,
    loadingGrossRevenue,
    loadingNetRevenue,
    loadingContractRevenueBreakdown,
    activeBrands,
    activeCampaigns,
    draftCampaigns,
    revenueByType,
    topBrands,
    upcomingDeadlines,
    contractStatusDistribution,
    contractRevenueBreakdown,
    taskStatusDistribution,
    refundViolationStats,
    grossRevenue,
    netRevenue,
    selectedPeriod,
    customStartDate,
    customEndDate,
    trendGranularity,
  } = useMarketingAnalytic();

  // Local state for deadline filter days (specific to that widget, but can be global if needed)
  const [deadlineDays, setDeadlineDays] = useState(30);

  // Handle period change
  const handlePeriodChange = useCallback(
    (value: string) => {
      dispatch(setPeriod(value));
      // Reset custom dates if not custom
      if (value !== "CUSTOM") {
        dispatch(setCustomDateRange({ startDate: null, endDate: null }));
      }
    },
    [dispatch],
  );

  const fetchData = useCallback(() => {
    dispatch(marketingActiveBrand());
    dispatch(marketingActiveCampaign());
    dispatch(marketingDraftCampaign());
  }, [dispatch]);

  const fetchAllAnalytics = useCallback(() => {
    const filter = {
      period: selectedPeriod,
      from_date: customStartDate,
      to_date: customEndDate,
      trend_granularity: trendGranularity,
    };

    // Dispatch all analytical actions with the same filter
    dispatch(marketingContractStatusDistribution(filter));
    dispatch(marketingTaskStatusDistribution(filter));
    dispatch(marketingRefundViolationStats(filter));
    dispatch(marketingGrossRevenue(filter));
    dispatch(marketingNetRevenue(filter));
    dispatch(marketingContractRevenueBreakdown(filter));
    dispatch(marketingTopBrand(filter));
    dispatch(marketingRevenueType(filter));
  }, [dispatch, selectedPeriod, customStartDate, customEndDate, trendGranularity]);

  // Fetch upcoming deadlines when days change
  useEffect(() => {
    dispatch(marketingUpcomingDeadline({ days: deadlineDays }));
  }, [dispatch, deadlineDays]);

  useEffect(() => {
    fetchData();
  }, [dispatch, fetchData]);

  useEffect(() => {
    fetchAllAnalytics();
  }, [dispatch, fetchAllAnalytics]);

  const activeBrandsData = {
    value: activeBrands || 0,
    statusText: `${activeBrands || 0} brands`,
  };
  const activeCampaignsData = {
    value: activeCampaigns || 0,
    statusText: "Running",
  };
  const draftCampaignsData = {
    value: draftCampaigns || 0,
    statusText: "Draft status",
  };

  // Gross/Net Revenue KPI data
  const grossRevenueData = {
    value: grossRevenue || 0,
    status: "up" as const,
    statusText: selectedPeriod.replace("_", " ").toLowerCase(),
  };

  const originalNetRevenue = netRevenue?.net_revenue || 0;
  const isNetRevenueNegative = originalNetRevenue < 0;

  const netRevenueData = {
    value: Math.abs(originalNetRevenue), // Always show positive number
    status: "up" as const,
    statusText: `Refunds: ${(netRevenue?.total_refunds || 0).toLocaleString()} ₫`,
  };

  // Contract Revenue Breakdown chart data
  const breakdownChartData =
    contractRevenueBreakdown?.data?.map((point: any) => ({
      name: point.date,
      total: point.total_contract_revenue || 0,
      baseCost: point.contract_base_cost || 0,
      affiliate: point.affiliate_revenue || 0,
      brandShare: point.limited_product_brand_share || 0,
      systemShare: point.limited_product_system_share || 0,
    })) || [];

  const brandRevenueData = Array.isArray(topBrands)
    ? topBrands.map((brand: any) => ({
        name: brand.brand_name,
        value: brand.revenue,
      }))
    : [];

  const revenueByTypeData = revenueByType
    ? [
        { name: "Advertising", value: Math.round(revenueByType.advertising || 0) },
        { name: "Affiliate", value: Math.round(revenueByType.affiliate || 0) },
        { name: "Co-Produce", value: Math.round(revenueByType.co_produce || 0) },
        { name: "Brand Ambassador", value: Math.round(revenueByType.brand_ambassador || 0) },
        { name: "Standard Product", value: Math.round(revenueByType.standard_product || 0) },
      ].filter((item) => item.value > 0)
    : [];

  const revenueShareData =
    revenueByType && revenueByType.total_revenue > 0
      ? [
          {
            type: "Advertising",
            value: parseFloat(
              ((revenueByType.advertising / revenueByType.total_revenue) * 100).toFixed(1),
            ),
          },
          {
            type: "Affiliate",
            value: parseFloat(
              ((revenueByType.affiliate / revenueByType.total_revenue) * 100).toFixed(1),
            ),
          },
          {
            type: "Co-Produce",
            value: parseFloat(
              ((revenueByType.co_produce / revenueByType.total_revenue) * 100).toFixed(1),
            ),
          },
          {
            type: "Brand Ambassador",
            value: parseFloat(
              ((revenueByType.brand_ambassador / revenueByType.total_revenue) * 100).toFixed(1),
            ),
          },
          {
            type: "Standard Product",
            value: parseFloat(
              ((revenueByType.standard_product / revenueByType.total_revenue) * 100).toFixed(1),
            ),
          },
        ].filter((item) => item.value > 0)
      : [];

  const upcomingDeadlinesData = Array.isArray(upcomingDeadlines)
    ? upcomingDeadlines.map((deadline: any) => ({
        campaign: deadline.name,
        brand: deadline.brand_name,
        "end date": new Date(deadline.end_date).toLocaleDateString(),
        "days remaining": `${deadline.days_remaining} days`,
        priority:
          deadline.days_remaining <= 3 ? "High" : deadline.days_remaining <= 7 ? "Medium" : "Low",
      }))
    : [];

  // Contract Status Distribution for Pie Chart
  const contractStatusData = contractStatusDistribution
    ? [
        { type: "Draft", value: contractStatusDistribution.draft || 0 },
        { type: "Active", value: contractStatusDistribution.active || 0 },
        { type: "Completed", value: contractStatusDistribution.completed || 0 },
        { type: "Terminated", value: contractStatusDistribution.terminated || 0 },
        { type: "Brand Violations", value: contractStatusDistribution.brand_violations || 0 },
        { type: "KOL Violations", value: contractStatusDistribution.kol_violations || 0 },
      ].filter((item) => item.value > 0)
    : [];

  // Task Status Distribution for Pie Chart
  const taskStatusData = taskStatusDistribution
    ? [
        { type: "To Do", value: taskStatusDistribution.todo || 0 },
        { type: "In Progress", value: taskStatusDistribution.in_progress || 0 },
        { type: "Done", value: taskStatusDistribution.done || 0 },
        { type: "Cancelled", value: taskStatusDistribution.cancelled || 0 },
      ].filter((item) => item.value > 0)
    : [];

  // Refund/Violation Stats KPIs
  const brandViolationsPending = refundViolationStats?.brand_violations_pending || 0;
  const brandViolationsPaid = refundViolationStats?.brand_violations_paid || 0;
  const kolViolationsPending = refundViolationStats?.kol_violations_pending || 0;
  const kolViolationsApproved = refundViolationStats?.kol_violations_resolved || 0;

  const isAnyLoading =
    loading ||
    loadingKPI ||
    loadingRevenue ||
    loadingTopBrands ||
    loadingDeadlines ||
    loadingContractStatus ||
    loadingTaskStatus ||
    loadingRefundViolation ||
    loadingGrossRevenue ||
    loadingNetRevenue ||
    loadingContractRevenueBreakdown;

  return (
    <div className="p-3 sm:p-6 w-full flex flex-col gap-6 relative">
      {isAnyLoading && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50 rounded-lg">
          <div className="text-center bg-white p-6 rounded-lg shadow-lg">
            <Loader2 className="mx-auto mb-4 h-12 w-12 text-primary animate-spin" />
            <p className="text-gray-600 font-medium">Updating analytics...</p>
          </div>
        </div>
      )}

      {/* Header and Global Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Marketing Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Performance overview for {selectedPeriod.replace(/_/g, " ").toLowerCase()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Period Selector */}
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[160px] bg-white">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODAY">Today</SelectItem>
              <SelectItem value="YESTERDAY">Yesterday</SelectItem>
              <SelectItem value="THIS_WEEK">This Week</SelectItem>
              <SelectItem value="LAST_WEEK">Last Week</SelectItem>
              <SelectItem value="THIS_MONTH">This Month</SelectItem>
              <SelectItem value="LAST_MONTH">Last Month</SelectItem>
              <SelectItem value="THIS_QUARTER">This Quarter</SelectItem>
              <SelectItem value="LAST_QUARTER">Last Quarter</SelectItem>
              <SelectItem value="THIS_YEAR">This Year</SelectItem>
              <SelectItem value="LAST_YEAR">Last Year</SelectItem>
              <SelectItem value="LAST_7_DAYS">Last 7 Days</SelectItem>
              <SelectItem value="LAST_30_DAYS">Last 30 Days</SelectItem>
              <SelectItem value="CUSTOM">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {/* Custom Date Inputs */}
          {selectedPeriod === "CUSTOM" && (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={customStartDate || ""}
                onChange={(e) =>
                  dispatch(
                    setCustomDateRange({ startDate: e.target.value, endDate: customEndDate }),
                  )
                }
                className="w-[140px]"
              />
              <span className="text-gray-400">-</span>
              <Input
                type="date"
                value={customEndDate || ""}
                onChange={(e) =>
                  dispatch(
                    setCustomDateRange({ startDate: customStartDate, endDate: e.target.value }),
                  )
                }
                className="w-[140px]"
              />
            </div>
          )}

          {/* Granularity Selector */}
          <Select
            value={trendGranularity}
            onValueChange={(val) => dispatch(setTrendGranularity(val))}
          >
            <SelectTrigger className="w-[130px] bg-white">
              <SelectValue placeholder="Granularity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAY">Daily</SelectItem>
              <SelectItem value="WEEK">Weekly</SelectItem>
              <SelectItem value="MONTH">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={fetchAllAnalytics}
            title="Refresh Data"
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KPIWidget
          title="Active Brands"
          data={activeBrandsData}
          icon={<FaBullhorn size={20} />}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
          tooltip="Number of brand partners currently active in campaigns and collaborations"
        />
        <KPIWidget
          title="Active Campaigns"
          data={activeCampaignsData}
          icon={<FaBullhorn size={20} />}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
          tooltip="Number of marketing campaigns currently running"
        />
        <KPIWidget
          title="Draft Campaigns"
          data={draftCampaignsData}
          icon={<FaRegCircleCheck size={20} />}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
          tooltip="Number of campaigns in draft status awaiting approval"
        />
        <KPIWidget
          title="Gross Contract Revenue"
          data={grossRevenueData}
          mode="currency"
          icon={<FaMoneyBillWave size={20} />}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-100"
          tooltip="Total contract revenue before refunds"
        />
        <KPIWidget
          title="Net Contract Revenue"
          data={netRevenueData}
          mode="currency"
          icon={<FaChartLine size={20} />}
          iconColor={isNetRevenueNegative ? "text-red-600" : "text-green-600"}
          iconBg={isNetRevenueNegative ? "bg-red-100" : "bg-green-100"}
          tooltip="Net contract revenue after subtracting refunds"
          valueColor={isNetRevenueNegative ? "text-red-600" : "text-green-600"}
        />
      </div>

      {/* Violations & Refunds Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIWidget
          title="Brand Violations (Pending)"
          data={{
            value: brandViolationsPending,
            statusText: "Awaiting payment",
          }}
          // mode="currency"
          icon={<FaTriangleExclamation size={20} />}
          iconColor="text-amber-600"
          iconBg="bg-amber-100"
          tooltip="Pending penalty amounts from brand contract violations"
        />
        <KPIWidget
          title="Brand Violations (Paid)"
          data={{
            value: brandViolationsPaid,
            statusText: "Collected",
          }}
          // mode="currency"
          icon={<FaRegCircleCheck size={20} />}
          iconColor="text-green-600"
          iconBg="bg-green-100"
          tooltip="Penalty amounts collected from brand contract violations"
        />
        <KPIWidget
          title="KOL Refunds (Pending)"
          data={{
            value: kolViolationsPending,
            statusText: "To be refunded",
          }}
          // mode="currency"
          icon={<FaTriangleExclamation size={20} />}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
          tooltip="Pending refund amounts for KOL contract violations"
        />
        <KPIWidget
          title="KOL Refunds (Approved)"
          data={{
            value: kolViolationsApproved,
            statusText: "Approved",
          }}
          // mode="currency"
          icon={<FaRegCircleCheck size={20} />}
          iconColor="text-teal-600"
          iconBg="bg-teal-100"
          tooltip="Approved refund amounts for KOL contract violations"
        />
      </div>

      {/* Contract & Task Status Distribution Section */}
      <Card className="p-4 border-none shadow-sm bg-white">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-gray-800">Status Overview</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3 text-gray-600">
                Contract Status Distribution
              </h3>
              {isEmptyData(contractStatusData) ? (
                <NoDataMessage message="No contract data available" />
              ) : (
                <PieChartWidget
                  title=""
                  data={contractStatusData}
                  tooltip="Distribution of contracts by status"
                />
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3 text-gray-600">Task Status Distribution</h3>
              {isEmptyData(taskStatusData) ? (
                <NoDataMessage message="No task data available" />
              ) : (
                <PieChartWidget
                  title=""
                  data={taskStatusData}
                  tooltip="Distribution of tasks by status"
                />
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 border-none shadow-sm bg-white">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-gray-800">Revenue Analysis</h2>
          </div>
          <div className="mt-2">
            {breakdownChartData.length > 0 && (
              <ComposedChartWidget
                title="Contract Revenue Breakdown Over Time"
                data={breakdownChartData}
                barConfig={{
                  dataKey: "total",
                  label: "Total Revenue",
                  color: "#63aaf1",
                }}
                lineConfigs={[
                  { dataKey: "baseCost", label: "Base Contract", color: "#22c55e" },
                  { dataKey: "affiliate", label: "Affiliate", color: "#f59e0b" },
                  { dataKey: "brandShare", label: "Brand Share", color: "#3b82f6" },
                  { dataKey: "systemShare", label: "System Share", color: "#ef4444" },
                ]}
                unit="₫"
                tooltip="Breakdown of contract revenue components over time"
                height={350}
                formatXAxis={(value) => {
                  if (!value) return "";
                  const date = new Date(value);
                  return isNaN(date.getTime())
                    ? value
                    : date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
                }}
              />
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4 border-none shadow-sm bg-white">
        <div className="flex flex-col gap-4">
          {/* Top Brands Section - Uses Global Filter now */}
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-gray-800">Top Brands by Revenue</h2>
          </div>
          {isEmptyData(brandRevenueData) ? (
            <NoDataMessage message="No brand revenue data available for the selected period" />
          ) : (
            <BarChartWidget
              title=""
              data={brandRevenueData}
              unit="VND"
              tooltip="Ranking of brand partners by revenue generated"
            />
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 border-none shadow-sm bg-white">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Revenue by Type</h2>
            {isEmptyData(revenueByTypeData) ? (
              <NoDataMessage message="No revenue breakdown data available" />
            ) : (
              <BarChartWidget
                title=""
                data={revenueByTypeData}
                unit="VND"
                tooltip="Revenue generated by each contract type"
              />
            )}
          </div>
        </Card>

        <Card className="p-4 border-none shadow-sm bg-white">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Revenue Distribution</h2>
            {isEmptyData(revenueShareData) ? (
              <NoDataMessage message="No revenue distribution data available" />
            ) : (
              <PieChartWidget
                title=""
                data={revenueShareData}
                mode="percent"
                tooltip="Percentage distribution of revenue"
              />
            )}
          </div>
        </Card>
      </div>

      <Card className="p-4 border-none shadow-sm bg-white">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h2>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-500">Next</span>
              <Select
                value={deadlineDays.toString()}
                onValueChange={(value) => setDeadlineDays(Number(value))}
              >
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isEmptyData(upcomingDeadlinesData) ? (
            <NoDataMessage message="No upcoming deadlines found" />
          ) : (
            <TableWidget title="" data={upcomingDeadlinesData} />
          )}
        </div>
      </Card>
    </div>
  );
};

export default MarketingDashboard;
