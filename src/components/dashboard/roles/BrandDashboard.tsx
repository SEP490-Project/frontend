import React, { useEffect, useState } from "react";
import {
  KPIWidget,
  TableWidget,
  BarChartWidget,
  LineChartWidget,
} from "@/components/dashboard/chart";
import {
  FaLink,
  FaFile,
  FaChartLine,
  FaMoneyBillWave,
  FaBullhorn,
  FaFileContract,
  FaTriangleExclamation,
  FaBox,
} from "react-icons/fa6";
import { useAppDispatch } from "@/libs/stores";
import {
  brandAffiliates,
  brandCampaigns,
  brandContent,
  brandContracts,
  brandTopProduct,
  brandRevenueTrend,
  brandDashboard,
} from "@/libs/stores/brandAnalyticManager/thunk";
import { useBrandAnalytic } from "@/libs/hooks/useBrandAnalytic";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ShoppingCart, CreditCard } from "lucide-react";
import DatePicker from "@/components/date-picker";

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
  const {
    loadingAffiliates,
    loadingCampaigns,
    loadingContent,
    loadingContracts,
    loadingRevenueTrend,
    loadingTopProducts,
    loadingDashboard,
    affiliates,
    campaigns,
    content,
    contracts,
    revenueTrend,
    topProducts,
    dashboard,
  } = useBrandAnalytic();

  const [dashboardFilter, setDashboardFilter] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const [affiliateContentFilter, setAffiliateContentFilter] = useState({
    start_date: "",
    end_date: "",
  });

  const [campaignFilter, setCampaignFilter] = useState({
    start_date: "",
    end_date: "",
    status: "ALL" as
      | "ALL"
      | "DRAFT"
      | "ACTIVE"
      | "IN_PROGRESS"
      | "PENDING"
      | "FINISHED"
      | "CANCELLED",
    limit: 10,
  });

  const [contractFilter, setContractFilter] = useState({
    status: "ALL" as "ALL" | "DRAFT" | "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED",
    limit: 10,
  });

  const [topProductFilter, setTopProductFilter] = useState({
    start_date: "",
    end_date: "",
    limit: 10,
  });

  const [revenueTrendFilter, setRevenueTrendFilter] = useState({
    start_date: "",
    end_date: "",
    granularity: "MONTH" as "DAY" | "WEEK" | "MONTH",
  });

  const fetchDashboard = () => {
    dispatch(brandDashboard(dashboardFilter));
  };

  const fetchAffiliatesAndContent = () => {
    const filter: any = {};
    if (affiliateContentFilter.start_date) filter.start_date = affiliateContentFilter.start_date;
    if (affiliateContentFilter.end_date) filter.end_date = affiliateContentFilter.end_date;
    dispatch(brandAffiliates(filter));
    dispatch(brandContent(filter));
  };

  const fetchCampaigns = () => {
    const filter: any = { limit: campaignFilter.limit };
    if (campaignFilter.start_date) filter.start_date = campaignFilter.start_date;
    if (campaignFilter.end_date) filter.end_date = campaignFilter.end_date;
    if (campaignFilter.status && campaignFilter.status !== "ALL") {
      filter.status = campaignFilter.status;
    }
    dispatch(brandCampaigns(filter));
  };

  const fetchContracts = () => {
    const filter: any = { limit: contractFilter.limit };
    if (contractFilter.status && contractFilter.status !== "ALL") {
      filter.status = contractFilter.status;
    }
    dispatch(brandContracts(filter));
  };

  const fetchTopProducts = () => {
    const filter: any = { limit: topProductFilter.limit };
    if (topProductFilter.start_date) filter.start_date = topProductFilter.start_date;
    if (topProductFilter.end_date) filter.end_date = topProductFilter.end_date;
    dispatch(brandTopProduct(filter));
  };

  const fetchRevenueTrend = () => {
    const filter: any = { granularity: revenueTrendFilter.granularity };
    if (revenueTrendFilter.start_date) filter.start_date = revenueTrendFilter.start_date;
    if (revenueTrendFilter.end_date) filter.end_date = revenueTrendFilter.end_date;
    dispatch(brandRevenueTrend(filter));
  };

  useEffect(() => {
    fetchDashboard();
  }, [dispatch, dashboardFilter]);

  useEffect(() => {
    fetchAffiliatesAndContent();
  }, [dispatch, affiliateContentFilter]);

  useEffect(() => {
    fetchCampaigns();
  }, [dispatch, campaignFilter]);

  useEffect(() => {
    fetchContracts();
  }, [dispatch, contractFilter]);

  useEffect(() => {
    fetchTopProducts();
  }, [dispatch, topProductFilter]);

  useEffect(() => {
    fetchRevenueTrend();
  }, [dispatch, revenueTrendFilter]);

  const affiliatesKPIData = {
    value: affiliates?.total_links || 0,
    statusText: `${affiliates?.active_links || 0} active links`,
  };

  const clicksKPIData = {
    value: affiliates?.total_clicks || 0,
    statusText: "Total clicks",
  };

  const contentKPIData = {
    value: content?.total_content || 0,
    statusText: `${content?.posted_content || 0} posted`,
  };

  const engagementKPIData = {
    value: content?.engagement_rate ? `${(content.engagement_rate * 100).toFixed(1)}%` : "0%",
    statusText: "Engagement rate",
  };

  const campaignsTableData = Array.isArray(campaigns)
    ? campaigns.map((c: any) => ({
        id: c.campaign_id,
        name: c.campaign_name,
        status: {
          type: "badge",
          value: c.status,
          variant: "campaignStatus",
        },
        duration: `${new Date(c.start_date).toLocaleDateString()} → ${new Date(
          c.end_date,
        ).toLocaleDateString()}`,
        progress: `${c.completed_tasks}/${c.task_count} (${c.completion_rate}%)`,
        action: {
          type: "action",
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
          type: "badge",
          value: c.type,
          variant: "contractType",
        },
        status: {
          type: "badge",
          value: c.status,
          variant: "contractStatus",
        },
        value: formatCurrency(c.total_value),
        paid: formatCurrency(c.paid_amount),
        pending: formatCurrency(c.pending_amount),
        duration: `${new Date(c.start_date).toLocaleDateString()} → ${new Date(
          c.end_date,
        ).toLocaleDateString()}`,
        action: {
          type: "action",
          label: "View",
          href: `/manage/brand/contracts/${c.contract_id}`,
        },
      }))
    : [];

  const topProductsData = Array.isArray(topProducts)
    ? topProducts.map((p: any) => ({
        name: p.product_name,
        value: p.revenue,
      }))
    : [];

  const revenueTrendData = Array.isArray(revenueTrend)
    ? revenueTrend.map((r: any) => ({
        month: new Date(r.date).toLocaleDateString("default", { month: "short", day: "numeric" }),
        value: r.revenue,
      }))
    : [];

  const isAnyLoading =
    loadingDashboard ||
    loadingAffiliates ||
    loadingCampaigns ||
    loadingContent ||
    loadingContracts ||
    loadingRevenueTrend ||
    loadingTopProducts;

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
      years.push(year);
    }
    return years;
  };

  const generateMonthOptions = () => {
    return [
      { value: 1, label: "January" },
      { value: 2, label: "February" },
      { value: 3, label: "March" },
      { value: 4, label: "April" },
      { value: 5, label: "May" },
      { value: 6, label: "June" },
      { value: 7, label: "July" },
      { value: 8, label: "August" },
      { value: 9, label: "September" },
      { value: 10, label: "October" },
      { value: 11, label: "November" },
      { value: 12, label: "December" },
    ];
  };

  const overviewData = dashboard?.overview || {};
  const topSoldProducts = dashboard?.top_sold_products || [];
  const topRatingProducts = dashboard?.top_rating_products || [];

  const topSoldProductsChartData = topSoldProducts.map((p: any) => ({
    name: p.product_name,
    value: p.total_revenue,
  }));

  const topRatingProductsChartData = topRatingProducts.map((p: any) => ({
    name: p.product_name,
    value: p.average_rating,
  }));

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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold">Brand Partner Dashboard</h1>
        <div className="flex gap-2 items-center">
          <Select
            value={dashboardFilter.year.toString()}
            onValueChange={(value) =>
              setDashboardFilter((prev) => ({ ...prev, year: parseInt(value) }))
            }
          >
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {generateYearOptions().map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={dashboardFilter.month.toString()}
            onValueChange={(value) =>
              setDashboardFilter((prev) => ({ ...prev, month: parseInt(value) }))
            }
          >
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {generateMonthOptions().map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setDashboardFilter({
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
              })
            }
            className="h-8 text-xs"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIWidget
          title="Total Campaigns"
          data={{
            value: overviewData.total_campaigns || 0,
            statusText: `${overviewData.active_campaigns || 0} active`,
          }}
          icon={<FaBullhorn size={20} />}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
          tooltip="Total number of marketing campaigns your brand is involved in, including active and completed campaigns"
        />
        <KPIWidget
          title="Total Contracts"
          data={{
            value: overviewData.total_contracts || 0,
            statusText: `${overviewData.active_contracts || 0} active`,
          }}
          icon={<FaFileContract size={20} />}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
          tooltip="Total number of contracts your brand has signed, showing how many are currently active and generating business"
        />
        <KPIWidget
          title="Total Products"
          data={{
            value: overviewData.total_products || 0,
            statusText: "Products",
          }}
          icon={<FaBox size={20} />}
          iconColor="text-green-600"
          iconBg="bg-green-100"
          tooltip="Total number of products in your brand portfolio available for sale and promotion"
        />
        <KPIWidget
          title="Total Orders"
          data={{
            value: overviewData.total_orders || 0,
            statusText: "Orders",
          }}
          icon={<ShoppingCart size={20} />}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
          tooltip="Total number of orders received for your products across all sales channels"
        />
        <KPIWidget
          title="Total Revenue"
          data={{
            value: overviewData.total_revenue || 0,
            statusText: "Total earned",
          }}
          mode="currency"
          icon={<FaMoneyBillWave size={20} />}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-100"
          tooltip="Total revenue generated from your brand partnerships, product sales, and marketing activities"
        />
        <KPIWidget
          title="Pending Payments"
          data={{
            value: overviewData.pending_payments || 0,
            statusText: "Pending",
          }}
          mode="currency"
          icon={<CreditCard size={20} />}
          iconColor="text-red-600"
          iconBg="bg-red-100"
          tooltip="Total amount of payments pending to be received from completed transactions and contracts"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          {isEmptyData(topSoldProductsChartData) ? (
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Top Sold Products</h2>
              <NoDataMessage message="No sold products data available" />
            </div>
          ) : (
            <BarChartWidget
              title="Top Sold Products"
              data={topSoldProductsChartData}
              unit="VND"
              tooltip="Top performing products by total revenue generated, showing which products contribute most to your business income"
            />
          )}
        </Card>

        <Card className="p-4">
          {isEmptyData(topRatingProductsChartData) ? (
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Top Rating Products</h2>
              <NoDataMessage message="No rating products data available" />
            </div>
          ) : (
            <BarChartWidget
              title="Top Rating Products"
              data={topRatingProductsChartData}
              unit="★"
              tooltip="Products with the highest customer ratings, indicating customer satisfaction and product quality"
            />
          )}
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Affiliate & Content Metrics</h2>
            <div className="flex gap-2 items-center flex-wrap">
              <DatePicker
                value={formatDateInput(affiliateContentFilter.start_date)}
                onChange={(date) =>
                  setAffiliateContentFilter((prev) => ({
                    ...prev,
                    start_date: date ? new Date(date).toISOString() : "",
                  }))
                }
                dateFormat="dd/MM/yyyy"
                className="w-[150px]"
                placeholder="Start date"
                maxDate={new Date().toISOString()}
              />
              <span className="text-sm">to</span>
              <DatePicker
                value={formatDateInput(affiliateContentFilter.end_date)}
                onChange={(date) =>
                  setAffiliateContentFilter((prev) => ({
                    ...prev,
                    end_date: date ? new Date(date).toISOString() : "",
                  }))
                }
                dateFormat="dd/MM/yyyy"
                className="w-[150px]"
                placeholder="End date"
                maxDate={new Date().toISOString()}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAffiliateContentFilter({ start_date: "", end_date: "" })}
                className="h-8 text-xs"
              >
                Reset
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPIWidget
              title="Affiliate Links"
              data={affiliatesKPIData}
              icon={<FaLink size={20} />}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
              tooltip="Total number of affiliate links created for your brand, showing how many are currently active and driving traffic"
            />
            <KPIWidget
              title="Total Clicks"
              data={clicksKPIData}
              icon={<FaChartLine size={20} />}
              iconColor="text-green-600"
              iconBg="bg-green-100"
              tooltip="Total number of clicks received on all your affiliate links, indicating customer engagement and interest"
            />
            <KPIWidget
              title="Content Created"
              data={contentKPIData}
              icon={<FaFile size={20} />}
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
              tooltip="Total content pieces created for your brand including posts, articles, videos, and other marketing materials"
            />
            <KPIWidget
              title="Engagement Rate"
              data={engagementKPIData}
              icon={<FaChartLine size={20} />}
              iconColor="text-amber-600"
              iconBg="bg-amber-100"
              tooltip="Average engagement rate across all your content showing likes, comments, shares, and other interactions as a percentage"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Revenue Trend</h2>
            <div className="flex gap-2 items-center flex-wrap">
              <DatePicker
                value={formatDateInput(revenueTrendFilter.start_date)}
                onChange={(date) =>
                  setRevenueTrendFilter((prev) => ({
                    ...prev,
                    start_date: date ? new Date(date).toISOString() : "",
                  }))
                }
                dateFormat="dd/MM/yyyy"
                className="w-[150px]"
                placeholder="Start date"
                maxDate={new Date().toISOString()}
              />
              <span className="text-sm">to</span>
              <DatePicker
                value={formatDateInput(revenueTrendFilter.end_date)}
                onChange={(date) =>
                  setRevenueTrendFilter((prev) => ({
                    ...prev,
                    end_date: date ? new Date(date).toISOString() : "",
                  }))
                }
                dateFormat="dd/MM/yyyy"
                className="w-[150px]"
                placeholder="End date"
                maxDate={new Date().toISOString()}
              />
              <Select
                value={revenueTrendFilter.granularity}
                onValueChange={(value: "DAY" | "WEEK" | "MONTH") =>
                  setRevenueTrendFilter((prev) => ({ ...prev, granularity: value }))
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
                  setRevenueTrendFilter({ start_date: "", end_date: "", granularity: "MONTH" })
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
              tooltip="Revenue trend showing how your brand's earnings have changed over the selected time period from all partnership activities"
              xAxisKey="month"
              lines={[{ dataKey: "revenue", color: "#6366f1", name: "Brand Revenue" }]}
            />
          )}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Top Products by Revenue</h2>
            <div className="flex gap-2 items-center flex-wrap">
              <DatePicker
                value={formatDateInput(topProductFilter.start_date)}
                onChange={(date) =>
                  setTopProductFilter((prev) => ({
                    ...prev,
                    start_date: date ? new Date(date).toISOString() : "",
                  }))
                }
                dateFormat="dd/MM/yyyy"
                className="w-[150px]"
                placeholder="Start date"
                maxDate={new Date().toISOString()}
              />
              <span className="text-sm">to</span>
              <DatePicker
                value={formatDateInput(topProductFilter.end_date)}
                onChange={(date) =>
                  setTopProductFilter((prev) => ({
                    ...prev,
                    end_date: date ? new Date(date).toISOString() : "",
                  }))
                }
                dateFormat="dd/MM/yyyy"
                className="w-[150px]"
                placeholder="End date"
                maxDate={new Date().toISOString()}
              />
              <Input
                type="number"
                value={topProductFilter.limit}
                onChange={(e) =>
                  setTopProductFilter((prev) => ({
                    ...prev,
                    limit: parseInt(e.target.value) || 10,
                  }))
                }
                className="w-20 h-8 text-xs"
                min={1}
                max={50}
                placeholder="10"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTopProductFilter({ start_date: "", end_date: "", limit: 10 })}
                className="h-8 text-xs"
              >
                Reset
              </Button>
            </div>
          </div>
          {isEmptyData(topProductsData) ? (
            <NoDataMessage message="No product revenue data available for the selected period" />
          ) : (
            <BarChartWidget
              title=""
              data={topProductsData}
              unit="VND"
              tooltip="Ranking of your products by revenue generated, helping identify which products are performing best in the market"
            />
          )}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Campaigns</h2>
            <div className="flex gap-2 items-center flex-wrap">
              <DatePicker
                value={formatDateInput(campaignFilter.start_date)}
                onChange={(date) =>
                  setCampaignFilter((prev) => ({
                    ...prev,
                    start_date: date ? new Date(date).toISOString() : "",
                  }))
                }
                dateFormat="dd/MM/yyyy"
                className="w-[120px]"
                placeholder="Start date"
                maxDate={new Date().toISOString()}
              />
              <DatePicker
                value={formatDateInput(campaignFilter.end_date)}
                onChange={(date) =>
                  setCampaignFilter((prev) => ({
                    ...prev,
                    end_date: date ? new Date(date).toISOString() : "",
                  }))
                }
                dateFormat="dd/MM/yyyy"
                className="w-[120px]"
                placeholder="End date"
                maxDate={new Date().toISOString()}
              />
              <Select
                value={campaignFilter.status}
                onValueChange={(
                  value:
                    | "ALL"
                    | "DRAFT"
                    | "ACTIVE"
                    | "IN_PROGRESS"
                    | "PENDING"
                    | "FINISHED"
                    | "CANCELLED",
                ) => setCampaignFilter((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FINISHED">Finished</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={campaignFilter.limit}
                onChange={(e) =>
                  setCampaignFilter((prev) => ({
                    ...prev,
                    limit: parseInt(e.target.value) || 10,
                  }))
                }
                className="w-16 h-8 text-xs"
                min={1}
                max={50}
                placeholder="10"
              />
            </div>
          </div>
          {isEmptyData(campaignsTableData) ? (
            <NoDataMessage message="No campaign data available" />
          ) : (
            <TableWidget title="" data={campaignsTableData as any} />
          )}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Contracts</h2>
            <div className="flex gap-2 items-center flex-wrap">
              <Select
                value={contractFilter.status}
                onValueChange={(
                  value: "ALL" | "DRAFT" | "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED",
                ) => setContractFilter((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={contractFilter.limit}
                onChange={(e) =>
                  setContractFilter((prev) => ({
                    ...prev,
                    limit: parseInt(e.target.value) || 10,
                  }))
                }
                className="w-16 h-8 text-xs"
                min={1}
                max={50}
                placeholder="10"
              />
            </div>
          </div>
          {isEmptyData(contractsTableData) ? (
            <NoDataMessage message="No contract data available" />
          ) : (
            <TableWidget title="" data={contractsTableData as any} />
          )}
        </div>
      </Card>
    </div>
  );
};

export default BrandDashboard;
