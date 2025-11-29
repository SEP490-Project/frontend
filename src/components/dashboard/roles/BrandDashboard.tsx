import React, { useEffect, useState } from "react";
import {
  KPIWidget,
  TableWidget,
  BarChartWidget,
  LineChartWidget,
} from "@/components/dashboard/chart";
import { FaLink, FaFile, FaChartLine } from "react-icons/fa6";
import { useAppDispatch } from "@/libs/stores";
import {
  brandAffiliates,
  brandCampaigns,
  brandContent,
  brandContracts,
  brandTopProduct,
  brandRevenueTrend,
} from "@/libs/stores/brandAnalyticManager/thunk";
import { useBrandAnalytic } from "@/libs/hooks/useBrandAnalytic";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const BrandDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    loadingAffiliates,
    loadingCampaigns,
    loadingContent,
    loadingContracts,
    loadingRevenueTrend,
    loadingTopProducts,
    affiliates,
    campaigns,
    content,
    contracts,
    revenueTrend,
    topProducts,
  } = useBrandAnalytic();

  const [currentDate] = useState(() => {
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    return {
      now: now.toISOString(),
      sixMonthsAgo: sixMonthsAgo.toISOString(),
    };
  });

  // Affiliate filter
  const [affiliateFilter, setAffiliateFilter] = useState({
    start_date: currentDate.sixMonthsAgo,
    end_date: currentDate.now,
  });

  // Content filter
  const [contentFilter, setContentFilter] = useState({
    start_date: currentDate.sixMonthsAgo,
    end_date: currentDate.now,
  });

  // Campaign filter
  const [campaignFilter, setCampaignFilter] = useState({
    start_date: currentDate.sixMonthsAgo,
    end_date: currentDate.now,
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

  // Contract filter
  const [contractFilter, setContractFilter] = useState({
    status: "ALL" as "ALL" | "DRAFT" | "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED",
    limit: 10,
  });

  // Top Product filter
  const [topProductFilter, setTopProductFilter] = useState({
    start_date: currentDate.sixMonthsAgo,
    end_date: currentDate.now,
    limit: 10,
  });

  // Revenue Trend filter
  const [revenueTrendFilter, setRevenueTrendFilter] = useState({
    start_date: currentDate.sixMonthsAgo,
    end_date: currentDate.now,
    granularity: "MONTH" as "DAY" | "WEEK" | "MONTH",
  });

  const fetchAffiliates = () => {
    const filter = {
      start_date: affiliateFilter.start_date,
      end_date: affiliateFilter.end_date,
    };
    dispatch(brandAffiliates(filter));
  };

  const fetchContent = () => {
    const filter = {
      start_date: contentFilter.start_date,
      end_date: contentFilter.end_date,
    };
    dispatch(brandContent(filter));
  };

  const fetchCampaigns = () => {
    const filter: any = {
      start_date: campaignFilter.start_date,
      end_date: campaignFilter.end_date,
      limit: campaignFilter.limit,
    };
    if (campaignFilter.status && campaignFilter.status !== "ALL") {
      filter.status = campaignFilter.status;
    }
    dispatch(brandCampaigns(filter));
  };

  const fetchContracts = () => {
    const filter: any = {
      limit: contractFilter.limit,
    };
    if (contractFilter.status && contractFilter.status !== "ALL") {
      filter.status = contractFilter.status;
    }
    dispatch(brandContracts(filter));
  };

  const fetchTopProducts = () => {
    const filter = {
      start_date: topProductFilter.start_date,
      end_date: topProductFilter.end_date,
      limit: topProductFilter.limit,
    };
    dispatch(brandTopProduct(filter));
  };

  const fetchRevenueTrend = () => {
    const filter = {
      start_date: revenueTrendFilter.start_date,
      end_date: revenueTrendFilter.end_date,
      granularity: revenueTrendFilter.granularity,
    };
    dispatch(brandRevenueTrend(filter));
  };

  useEffect(() => {
    fetchAffiliates();
  }, [affiliateFilter]);

  useEffect(() => {
    fetchContent();
  }, [contentFilter]);

  useEffect(() => {
    fetchCampaigns();
  }, [campaignFilter]);

  useEffect(() => {
    fetchContracts();
  }, [contractFilter]);

  useEffect(() => {
    fetchTopProducts();
  }, [topProductFilter]);

  useEffect(() => {
    fetchRevenueTrend();
  }, [revenueTrendFilter]);

  // Data transformations
  const affiliatesKPIData = {
    value: affiliates?.total_links || 0,
    statusText: `${affiliates?.active_links || 0} active`,
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
        name: c.campaign_name,
        status: c.status,
        "start date": new Date(c.start_date).toLocaleDateString(),
        "end date": new Date(c.end_date).toLocaleDateString(),
        tasks: `${c.completed_tasks}/${c.task_count}`,
        content: c.content_count,
        views: c.total_views,
        engagements: c.total_engagements,
      }))
    : [];

  const contractsTableData = Array.isArray(contracts)
    ? contracts.map((c: any) => ({
        number: c.contract_number,
        type: c.type,
        status: c.status,
        value: new Intl.NumberFormat("vi-VN").format(c.total_value),
        paid: new Intl.NumberFormat("vi-VN").format(c.paid_amount),
        pending: new Intl.NumberFormat("vi-VN").format(c.pending_amount),
        "start date": new Date(c.start_date).toLocaleDateString(),
        "end date": new Date(c.end_date).toLocaleDateString(),
        campaigns: c.campaign_count,
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

  return (
    <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Brand Partner Dashboard</h1>

      {/* Affiliate & Content KPIs with Filter */}
      <Card className="p-4 relative">
        <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
          <h3 className="text-lg font-semibold">Affiliate & Content Metrics</h3>
          <div className="flex gap-2 flex-wrap">
            <Input
              type="date"
              value={affiliateFilter.start_date.split("T")[0]}
              onChange={(e) => {
                const newDate = new Date(e.target.value).toISOString();
                setAffiliateFilter({ ...affiliateFilter, start_date: newDate });
                setContentFilter({ ...contentFilter, start_date: newDate });
              }}
              className="w-40"
            />
            <Input
              type="date"
              value={affiliateFilter.end_date.split("T")[0]}
              onChange={(e) => {
                const newDate = new Date(e.target.value).toISOString();
                setAffiliateFilter({ ...affiliateFilter, end_date: newDate });
                setContentFilter({ ...contentFilter, end_date: newDate });
              }}
              className="w-40"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            {loadingAffiliates && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}
            <KPIWidget
              title="Affiliate Links"
              data={affiliatesKPIData}
              icon={<FaLink size={20} />}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
            />
          </div>
          <div className="relative">
            {loadingAffiliates && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}
            <KPIWidget
              title="Total Clicks"
              data={clicksKPIData}
              icon={<FaChartLine size={20} />}
              iconColor="text-green-600"
              iconBg="bg-green-100"
            />
          </div>
          <div className="relative">
            {loadingContent && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}
            <KPIWidget
              title="Content Created"
              data={contentKPIData}
              icon={<FaFile size={20} />}
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
            />
          </div>
          <div className="relative">
            {loadingContent && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}
            <KPIWidget
              title="Engagement Rate"
              data={engagementKPIData}
              icon={<FaChartLine size={20} />}
              iconColor="text-amber-600"
              iconBg="bg-amber-100"
            />
          </div>
        </div>
      </Card>

      {/* Revenue Trend */}
      <Card className="p-4 relative">
        {loadingRevenueTrend && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-lg font-semibold">Revenue Trend</h3>
            <div className="flex gap-2 flex-wrap">
              <Input
                type="date"
                value={revenueTrendFilter.start_date.split("T")[0]}
                onChange={(e) =>
                  setRevenueTrendFilter({
                    ...revenueTrendFilter,
                    start_date: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-40"
              />
              <Input
                type="date"
                value={revenueTrendFilter.end_date.split("T")[0]}
                onChange={(e) =>
                  setRevenueTrendFilter({
                    ...revenueTrendFilter,
                    end_date: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-40"
              />
              <Select
                value={revenueTrendFilter.granularity}
                onValueChange={(value: any) =>
                  setRevenueTrendFilter({ ...revenueTrendFilter, granularity: value })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAY">Day</SelectItem>
                  <SelectItem value="WEEK">Week</SelectItem>
                  <SelectItem value="MONTH">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <LineChartWidget title="" data={revenueTrendData} />
        </div>
      </Card>

      {/* Top Products */}
      <Card className="p-4 relative">
        {loadingTopProducts && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-lg font-semibold">Top Products</h3>
            <div className="flex gap-2 flex-wrap">
              <Input
                type="date"
                value={topProductFilter.start_date.split("T")[0]}
                onChange={(e) =>
                  setTopProductFilter({
                    ...topProductFilter,
                    start_date: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-40"
              />
              <Input
                type="date"
                value={topProductFilter.end_date.split("T")[0]}
                onChange={(e) =>
                  setTopProductFilter({
                    ...topProductFilter,
                    end_date: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-40"
              />
              <Input
                type="number"
                value={topProductFilter.limit}
                onChange={(e) =>
                  setTopProductFilter({
                    ...topProductFilter,
                    limit: parseInt(e.target.value) || 10,
                  })
                }
                className="w-24"
                min={1}
                max={50}
                placeholder="Limit"
              />
            </div>
          </div>
          <BarChartWidget title="" data={topProductsData} />
        </div>
      </Card>

      {/* Campaigns and Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 relative">
          {loadingCampaigns && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="text-lg font-semibold">Campaigns</h3>
              <div className="flex gap-2 flex-wrap">
                <Input
                  type="date"
                  value={campaignFilter.start_date.split("T")[0]}
                  onChange={(e) =>
                    setCampaignFilter({
                      ...campaignFilter,
                      start_date: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="w-40"
                />
                <Input
                  type="date"
                  value={campaignFilter.end_date.split("T")[0]}
                  onChange={(e) =>
                    setCampaignFilter({
                      ...campaignFilter,
                      end_date: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="w-40"
                />
                <Select
                  value={campaignFilter.status}
                  onValueChange={(value: any) =>
                    setCampaignFilter({ ...campaignFilter, status: value })
                  }
                >
                  <SelectTrigger className="w-32">
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
              </div>
            </div>
            <TableWidget title="" data={campaignsTableData} />
          </div>
        </Card>

        <Card className="p-4 relative">
          {loadingContracts && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="text-lg font-semibold">Contracts</h3>
              <div className="flex gap-2 flex-wrap">
                <Select
                  value={contractFilter.status}
                  onValueChange={(value: any) =>
                    setContractFilter({ ...contractFilter, status: value })
                  }
                >
                  <SelectTrigger className="w-32">
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
                    setContractFilter({ ...contractFilter, limit: parseInt(e.target.value) || 10 })
                  }
                  className="w-24"
                  min={1}
                  max={50}
                  placeholder="Limit"
                />
              </div>
            </div>
            <TableWidget title="" data={contractsTableData} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BrandDashboard;
