import React, { useCallback, useEffect } from "react";
import {
  KPIWidget,
  TableWidget,
  BarChartWidget,
  // LineChartWidget,
  PieChartWidget,
} from "@/components/dashboard/chart";
import {
  FaLink,
  FaFile,
  FaChartLine,
  FaTriangleExclamation,
  FaMoneyBillWave,
  FaStar,
  // FaReceipt,
} from "react-icons/fa6";
import {
  brandAffiliates,
  brandCampaigns,
  brandContent,
  brandContracts,
  brandTopProduct,
  brandTopRatingProducts,
  brandGrossIncome,
  brandNetIncome,
  brandContractStatusDistribution,
  brandTaskStatusDistribution,
  brandRevenueOverTime,
  brandRefundViolationStats,
} from "@/libs/stores/brandAnalyticManager/thunk";
import {
  setPeriod,
  setCustomDateRange,
  setTrendGranularity,
} from "@/libs/stores/brandAnalyticManager/slice";
import { useBrandAnalytic } from "@/libs/hooks/useBrandAnalytic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, RefreshCw } from "lucide-react";
import { useAppDispatch } from "@/libs/stores";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@/components/date-picker";

/* Helper Functions */
const formatCurrency = (value: number | null | undefined) =>
  typeof value === "number" ? value.toLocaleString("vi-VN") + " ₫" : "-";

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

const BrandDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    loadingAffiliates,
    loadingCampaigns,
    loadingContent,
    loadingContracts,
    loadingTopProducts,
    loadingTopRatingProducts,
    loadingContractStatus,
    loadingTaskStatus,
    loadingRevenueOverTime,
    loadingRefundViolation,
    loadingGrossIncome,
    loadingNetIncome,
    affiliates,
    campaigns,
    content,
    contracts,
    topProducts,
    topRatingProducts,
    contractStatusDistribution,
    taskStatusDistribution,
    // revenueOverTime,
    // refundViolationStats,
    grossIncome,
    netIncome,
    selectedPeriod,
    customStartDate,
    customEndDate,
    trendGranularity,
  } = useBrandAnalytic();

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

  const fetchAllAnalytics = useCallback(() => {
    const filter = {
      period: selectedPeriod,
      from_date: customStartDate,
      to_date: customEndDate,
      trend_granularity: trendGranularity,
    };

    // Dispatch all actions
    dispatch(brandAffiliates(filter));
    dispatch(brandCampaigns({ ...filter, limit: 10 })); // Show top 10 recent
    dispatch(brandContent(filter));
    dispatch(brandContracts({ ...filter, limit: 10 })); // Show top 10 recent
    dispatch(brandTopProduct({ ...filter, limit: 5 })); // Top 5 products by revenue
    dispatch(brandTopRatingProducts({ ...filter, limit: 5 })); // Top 5 rated products
    dispatch(brandGrossIncome(filter));
    dispatch(brandNetIncome(filter));
    dispatch(brandContractStatusDistribution(filter));
    dispatch(brandTaskStatusDistribution(filter));
    dispatch(brandRevenueOverTime(filter));
    dispatch(brandRefundViolationStats(filter));
  }, [dispatch, selectedPeriod, customStartDate, customEndDate, trendGranularity]);

  useEffect(() => {
    fetchAllAnalytics();
  }, [dispatch, fetchAllAnalytics]);

  /* Data Preparation */

  const affiliatesKPIData = {
    value: affiliates?.total_links || 0,
    statusText: `${affiliates?.active_links || 0} active links`,
  };

  const contentKPIData = {
    value: content?.total_content || 0,
    statusText: `${content?.posted_content || 0} posted`,
  };

  const grossIncomeData = {
    value: grossIncome?.gross_income || 0,
    statusText: grossIncome?.percentage_change
      ? `${grossIncome.percentage_change > 0 ? "+" : ""}${grossIncome.percentage_change.toFixed(1)}% vs previous`
      : "Total Revenue",
  };

  // Net Revenue display logic: positive = green, negative = red (show as positive number)
  const originalNetRevenue = netIncome?.net_income || 0;
  const isNetRevenueNegative = originalNetRevenue < 0;

  const netIncomeData = {
    value: Math.abs(originalNetRevenue), // Always show positive number
    statusText: `Deductions: ${formatCurrency(netIncome?.total_contract_payments || 0)}`,
  };

  // const revenueOverTimeData = Array.isArray(revenueOverTime)
  //   ? revenueOverTime.map((r: any) => ({
  //       name: new Date(r.date).toLocaleDateString("default", { month: "short", day: "numeric" }),
  //       Revenue: r.revenue,
  //     }))
  //   : [];

  const topProductsData = Array.isArray(topProducts)
    ? topProducts.map((p: any) => ({
        name: p.product_name, // BarChartWidget expects 'name'
        value: p.revenue, // BarChartWidget expects 'value'
      }))
    : [];

  // Top Rating Products Table Data
  const topRatingProductsData = Array.isArray(topRatingProducts)
    ? topRatingProducts.map((p: any, idx: number) => ({
        id: p.product_id,
        rank: idx + 1,
        name: p.product_name,
        type: {
          type: "badge" as const,
          value: p.type,
          variant: "productType" as const,
        },
        rating: `⭐ ${(p.average_rating || 0).toFixed(1)}`,
        action: {
          type: "action" as const,
          label: "View",
          href: `/manage/brand/products/${p.product_id}`,
        },
      }))
    : [];

  // Refund/Violation Stats Data for display
  // const refundViolationData = refundViolationStats
  //   ? {
  //       totalRefunds: refundViolationStats.total_refunds || 0,
  //       refundCount: refundViolationStats.refund_count || 0,
  //       brandViolations: refundViolationStats.brand_violations || 0,
  //       kolViolations: refundViolationStats.kol_violations || 0,
  //       violationPenalties: refundViolationStats.violation_penalties || 0,
  //     }
  //   : null;

  // Contract Status Distribution for Pie Chart
  const contractStatusData = contractStatusDistribution
    ? [
        { type: "Draft", value: contractStatusDistribution.draft || 0 },
        { type: "Active", value: contractStatusDistribution.active || 0 },
        { type: "Completed", value: contractStatusDistribution.completed || 0 },
        { type: "Terminated", value: contractStatusDistribution.terminated || 0 },
        {
          type: "Violations",
          value:
            (contractStatusDistribution.brand_violations || 0) +
            (contractStatusDistribution.kol_violations || 0),
        },
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

  const campaignsTableData = Array.isArray(campaigns)
    ? campaigns.map((c: any) => ({
        id: c.campaign_id,
        name: c.campaign_name,
        status: {
          type: "badge" as const,
          value: c.status,
          variant: "campaignStatus" as const,
        },
        duration: `${new Date(c.start_date).toLocaleDateString()} → ${new Date(
          c.end_date,
        ).toLocaleDateString()}`,
        progress: `${c.completed_tasks}/${c.task_count}`,
        action: {
          type: "action" as const,
          label: "View",
          href: `/manage/brand/campaigns/${c.campaign_id}`,
        },
      }))
    : [];

  const contractsTableData = Array.isArray(contracts)
    ? contracts.map((c: any) => ({
        id: c.contract_id,
        number: c.contract_number,
        type: {
          type: "badge" as const,
          value: c.type,
          variant: "contractType" as const,
        },
        status: {
          type: "badge" as const,
          value: c.status,
          variant: "contractStatus" as const,
        },
        value: formatCurrency(c.total_value),
        action: {
          type: "action" as const,
          label: "View",
          href: `/manage/brand/contracts/${c.contract_id}`,
        },
      }))
    : [];

  const isAnyLoading =
    loadingAffiliates ||
    loadingCampaigns ||
    loadingContent ||
    loadingContracts ||
    loadingTopProducts ||
    loadingTopRatingProducts ||
    loadingContractStatus ||
    loadingTaskStatus ||
    loadingRevenueOverTime ||
    loadingRefundViolation ||
    loadingGrossIncome ||
    loadingNetIncome;

  return (
    <div className="p-2 sm:p-6 w-full flex flex-col gap-6 relative">
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
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Brand Partner Dashboard
          </h1>
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
              <DatePicker
                value={customStartDate || undefined}
                onChange={(date) =>
                  dispatch(setCustomDateRange({ startDate: date, endDate: customEndDate }))
                }
                placeholder="Start Date"
                className="w-[140px]"
              />
              <span className="text-gray-400">-</span>
              <DatePicker
                value={customEndDate || undefined}
                onChange={(date) =>
                  dispatch(setCustomDateRange({ startDate: customStartDate, endDate: date }))
                }
                placeholder="End Date"
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

      {/* KPI Widgets Row 1: Financials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIWidget
          title="Gross Revenue"
          data={grossIncomeData}
          mode="currency"
          icon={<FaMoneyBillWave size={20} />}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-100"
          tooltip="Total revenue generated from contracts and sales"
        />
        <KPIWidget
          title="Net Revenue"
          data={netIncomeData}
          mode="currency"
          icon={<FaChartLine size={20} />}
          iconColor={isNetRevenueNegative ? "text-red-600" : "text-green-600"}
          iconBg={isNetRevenueNegative ? "bg-red-100" : "bg-green-100"}
          tooltip="Net revenue after refunds and violation penalties"
          valueColor={isNetRevenueNegative ? "text-red-600" : "text-green-600"}
        />
        <KPIWidget
          title="Affiliate Links"
          data={affiliatesKPIData}
          icon={<FaLink size={20} />}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
          tooltip="Total number of affiliate tracking links generated"
        />
        <KPIWidget
          title="Content Posted"
          data={contentKPIData}
          icon={<FaFile size={20} />}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
          tooltip="Total content pieces created and posted by KOLs"
        />
      </div>

      {/* Income Breakdown Card */}
      {netIncome && (
        <Card className="p-4 border-none shadow-sm bg-white">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Income Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Gross Income</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(netIncome.gross_income || 0)}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Order Revenue</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(netIncome.order_revenue || 0)}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Pre-order Revenue</p>
                <p className="text-lg font-bold text-purple-600">
                  {formatCurrency(netIncome.preorder_revenue || 0)}
                </p>
              </div>
              <div className="bg-teal-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">KOL Payment Refunds</p>
                <p className="text-lg font-bold text-teal-600">
                  +{formatCurrency(netIncome.payment_refunds || 0)}
                </p>
              </div>
              <div className="bg-cyan-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">KOL Violation Refunds</p>
                <p className="text-lg font-bold text-cyan-600">
                  +{formatCurrency(netIncome.violation_refunds || 0)}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Contract Payments</p>
                <p className="text-lg font-bold text-orange-600">
                  -{formatCurrency(netIncome.total_contract_payments || 0)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Revenue Trend Chart */}
      {/* <Card className="p-4 border-none shadow-sm bg-white"> */}
      {/*   <div className="flex flex-col gap-4"> */}
      {/*     <h2 className="text-lg font-semibold text-gray-800">Revenue Trend</h2> */}
      {/*     {isEmptyData(revenueOverTimeData) ? ( */}
      {/*       <NoDataMessage message="No revenue data available for selected period" /> */}
      {/*     ) : ( */}
      {/*       <LineChartWidget */}
      {/*         title="" */}
      {/*         data={revenueOverTimeData} */}
      {/*         lineConfig={{ Revenue: { label: "Revenue", color: "#6366f1" } }} */}
      {/*         tooltip="Revenue performance over time" */}
      {/*       /> */}
      {/*     )} */}
      {/*   </div> */}
      {/* </Card> */}

      {/* Status Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 border-none shadow-sm bg-white">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Contract Status</h2>
            {isEmptyData(contractStatusData) ? (
              <NoDataMessage message="No contract status data" />
            ) : (
              <PieChartWidget
                title=""
                data={contractStatusData}
                tooltip="Distribution of contracts by current status"
              />
            )}
          </div>
        </Card>
        <Card className="p-4 border-none shadow-sm bg-white">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Task Status</h2>
            {isEmptyData(taskStatusData) ? (
              <NoDataMessage message="No task status data" />
            ) : (
              <PieChartWidget
                title=""
                data={taskStatusData}
                tooltip="Distribution of tasks by current progress status"
              />
            )}
          </div>
        </Card>
      </div>

      {/* Top Rating Products & Refund/Violation Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 border-none shadow-sm bg-white">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <FaStar className="h-5 w-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-800">Top Rated Products</h2>
            </div>
            {isEmptyData(topRatingProductsData) ? (
              <NoDataMessage message="No product rating data" />
            ) : (
              <TableWidget title="" data={topRatingProductsData} navigate={navigate} />
            )}
          </div>
        </Card>

        {/* Top Products */}
        <Card className="p-4 border-none shadow-sm bg-white">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Top Products by Revenue</h2>
            {isEmptyData(topProductsData) ? (
              <NoDataMessage message="No product revenue data" />
            ) : (
              <BarChartWidget
                title=""
                data={topProductsData}
                unit="VND"
                tooltip="Best selling or highest revenue generating products"
              />
            )}
          </div>
        </Card>

        {/* <Card className="p-4 border-none shadow-sm bg-white"> */}
        {/*   <div className="flex flex-col gap-4"> */}
        {/*     <div className="flex items-center gap-2"> */}
        {/*       <FaReceipt className="h-5 w-5 text-orange-500" /> */}
        {/*       <h2 className="text-lg font-semibold text-gray-800">Refunds & Violations</h2> */}
        {/*     </div> */}
        {/*     {refundViolationData ? ( */}
        {/*       <div className="grid grid-cols-2 gap-4"> */}
        {/*         <div className="bg-red-50 rounded-lg p-4"> */}
        {/*           <p className="text-sm text-gray-600">Total Refunds</p> */}
        {/*           <p className="text-xl font-bold text-red-600"> */}
        {/*             {formatCurrency(refundViolationData.totalRefunds)} */}
        {/*           </p> */}
        {/*           <p className="text-xs text-gray-500">{refundViolationData.refundCount} orders</p> */}
        {/*         </div> */}
        {/*         <div className="bg-orange-50 rounded-lg p-4"> */}
        {/*           <p className="text-sm text-gray-600">Violation Penalties</p> */}
        {/*           <p className="text-xl font-bold text-orange-600"> */}
        {/*             {formatCurrency(refundViolationData.violationPenalties)} */}
        {/*           </p> */}
        {/*           <p className="text-xs text-gray-500"> */}
        {/*             {refundViolationData.brandViolations + refundViolationData.kolViolations}{" "} */}
        {/*             violations */}
        {/*           </p> */}
        {/*         </div> */}
        {/*         <div className="bg-yellow-50 rounded-lg p-4"> */}
        {/*           <p className="text-sm text-gray-600">Brand Violations</p> */}
        {/*           <p className="text-xl font-bold text-yellow-600"> */}
        {/*             {refundViolationData.brandViolations} */}
        {/*           </p> */}
        {/*           <p className="text-xs text-gray-500">contracts breached by brand</p> */}
        {/*         </div> */}
        {/*         <div className="bg-purple-50 rounded-lg p-4"> */}
        {/*           <p className="text-sm text-gray-600">KOL Violations</p> */}
        {/*           <p className="text-xl font-bold text-purple-600"> */}
        {/*             {refundViolationData.kolViolations} */}
        {/*           </p> */}
        {/*           <p className="text-xs text-gray-500">contracts breached by KOL</p> */}
        {/*         </div> */}
        {/*       </div> */}
        {/*     ) : ( */}
        {/*       <NoDataMessage message="No refund/violation data" /> */}
        {/*     )} */}
        {/*   </div> */}
        {/* </Card> */}
      </div>

      {/* Recent Campaigns and Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 border-none shadow-sm bg-white">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Campaigns</h2>
            {isEmptyData(campaignsTableData) ? (
              <NoDataMessage message="No campaigns found" />
            ) : (
              <TableWidget title="" data={campaignsTableData} navigate={navigate} />
            )}
          </div>
        </Card>
        <Card className="p-4 border-none shadow-sm bg-white">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Contracts</h2>
            {isEmptyData(contractsTableData) ? (
              <NoDataMessage message="No contracts found" />
            ) : (
              <TableWidget title="" data={contractsTableData} navigate={navigate} />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BrandDashboard;
