import React, { useEffect, useState } from "react";
import {
  KPIWidget,
  BarChartWidget,
  PieChartWidget,
  TableWidget,
} from "@/components/dashboard/chart";
import { FaBullhorn, FaRegCircleCheck, FaChartLine } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/libs/stores";
import {
  marketingActiveBrand,
  marketingActiveCampaign,
  marketingDraftCampaign,
  marketingMonthlyRevenue,
  marketingRevenueType,
  marketingTopBrand,
  marketingUpcomingDeadline,
} from "@/libs/stores/marketingAnalyticManager/thunk";
import { useMarketingAnalytic } from "@/libs/hooks/useMarketingAnalytic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const MarketingDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    loading,
    loadingKPI,
    loadingRevenue,
    loadingTopBrands,
    loadingDeadlines,
    activeBrands,
    activeCampaigns,
    draftCampaigns,
    monthlyRevenue,
    revenueByType,
    topBrands,
    upcomingDeadlines,
  } = useMarketingAnalytic();

  const [currentDate] = useState(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      quarter: Math.ceil((now.getMonth() + 1) / 3),
    };
  });

  // Separate filters for each chart
  const [revenueFilter, setRevenueFilter] = useState({
    type: "MONTH" as "MONTH" | "QUARTER" | "YEAR",
    year: currentDate.year,
    month: currentDate.month,
    quarter: currentDate.quarter,
  });

  const [topBrandsFilter, setTopBrandsFilter] = useState({
    type: "MONTH" as "MONTH" | "QUARTER" | "YEAR",
    year: currentDate.year,
    month: currentDate.month,
    quarter: currentDate.quarter,
  });

  const [deadlineFilter, setDeadlineFilter] = useState({
    days: 30,
  });

  const [monthlyRevenueFilter, setMonthlyRevenueFilter] = useState({
    year: currentDate.year,
    month: currentDate.month,
  });

  const fetchData = () => {
    // Fetch active brands count
    dispatch(marketingActiveBrand());

    // Fetch active campaigns count
    dispatch(marketingActiveCampaign());

    // Fetch draft campaigns count
    dispatch(marketingDraftCampaign());
  };

  const fetchMonthlyRevenue = () => {
    dispatch(
      marketingMonthlyRevenue({
        year: monthlyRevenueFilter.year,
        month: monthlyRevenueFilter.month,
      }),
    );
  };

  const fetchRevenueByType = () => {
    const filter: any = {
      filter_type: revenueFilter.type,
      year: revenueFilter.year,
    };

    if (revenueFilter.type === "MONTH") {
      filter.month = revenueFilter.month;
    } else if (revenueFilter.type === "QUARTER") {
      filter.quarter = revenueFilter.quarter;
    }

    dispatch(marketingRevenueType(filter));
  };

  const fetchTopBrands = () => {
    const filter: any = {
      filter_type: topBrandsFilter.type,
      year: topBrandsFilter.year,
    };

    if (topBrandsFilter.type === "MONTH") {
      filter.month = topBrandsFilter.month;
    } else if (topBrandsFilter.type === "QUARTER") {
      filter.quarter = topBrandsFilter.quarter;
    }

    dispatch(marketingTopBrand(filter));
  };

  const fetchUpcomingDeadlines = () => {
    dispatch(
      marketingUpcomingDeadline({
        days: deadlineFilter.days,
      }),
    );
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    fetchRevenueByType();
  }, [revenueFilter]);

  useEffect(() => {
    fetchTopBrands();
  }, [topBrandsFilter]);

  useEffect(() => {
    fetchUpcomingDeadlines();
  }, [deadlineFilter]);

  useEffect(() => {
    fetchMonthlyRevenue();
  }, [monthlyRevenueFilter]);

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
  const monthlyRevenueData = {
    value: monthlyRevenue || 0,
    status: "up" as const,
    statusText: `${monthlyRevenueFilter.month}/${monthlyRevenueFilter.year}`,
  };

  const brandRevenueData =
    topBrands?.map((brand: any) => ({
      name: brand.brand_name,
      value: Math.round(brand.revenue),
    })) || [];

  const revenueByTypeData = revenueByType
    ? [
        { name: "Advertising", value: Math.round(revenueByType.advertising) },
        { name: "Affiliate", value: Math.round(revenueByType.affiliate) },
        { name: "Co-produce", value: Math.round(revenueByType.co_produce) },
        { name: "Brand Ambassador", value: Math.round(revenueByType.brand_ambassador) },
        { name: "Standard Product", value: Math.round(revenueByType.standard_product) },
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
            type: "Co-produce",
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

  const upcomingDeadlinesData =
    upcomingDeadlines?.map((deadline: any) => ({
      campaign: deadline.name,
      brand: deadline.brand_name,
      endDate: new Date(deadline.end_date).toLocaleDateString(),
      daysRemaining: `${deadline.days_remaining} days`,
    })) || [];

  const alertsData = [
    ...(upcomingDeadlines
      ?.filter((d: any) => d.days_remaining <= 7)
      .map((deadline: any) => ({
        type: "Deadline Alert",
        message: `Campaign "${deadline.name}" ending in ${deadline.days_remaining} days`,
        priority: deadline.days_remaining <= 3 ? "High" : "Medium",
      })) || []),
    ...(draftCampaigns && draftCampaigns > 0
      ? [
          {
            type: "Draft Campaigns",
            message: `${draftCampaigns} campaigns in draft status`,
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

      {/* KPI Widgets with individual loading */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          {loadingKPI && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          )}
          <KPIWidget
            title="Active Brands"
            data={activeBrandsData}
            icon={<FaBullhorn size={20} />}
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
          />
        </div>
        <div className="relative">
          {loadingKPI && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          )}
          <KPIWidget
            title="Active Campaigns"
            data={activeCampaignsData}
            icon={<FaBullhorn size={20} />}
            iconColor="text-pink-600"
            iconBg="bg-pink-100"
          />
        </div>
        <div className="relative">
          {loadingKPI && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          )}
          <KPIWidget
            title="Draft Campaigns"
            data={draftCampaignsData}
            icon={<FaRegCircleCheck size={20} />}
            iconColor="text-orange-600"
            iconBg="bg-orange-100"
          />
        </div>
        <Card className="relative">
          {loadingKPI && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          )}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-600">Monthly Revenue</h3>
              </div>
              <div className="flex gap-2">
                <Select
                  value={monthlyRevenueFilter.year.toString()}
                  onValueChange={(value) =>
                    setMonthlyRevenueFilter({ ...monthlyRevenueFilter, year: Number(value) })
                  }
                >
                  <SelectTrigger className="w-[80px] h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => currentDate.year - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={monthlyRevenueFilter.month.toString()}
                  onValueChange={(value) =>
                    setMonthlyRevenueFilter({ ...monthlyRevenueFilter, month: Number(value) })
                  }
                >
                  <SelectTrigger className="w-[90px] h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {new Date(2000, month - 1).toLocaleString("default", {
                          month: "short",
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <KPIWidget
              title=""
              data={monthlyRevenueData}
              icon={<FaChartLine size={20} />}
              iconColor="text-indigo-600"
              iconBg="bg-indigo-100"
            />
          </div>
        </Card>
      </div>

      {/* Top Brands Chart with Filter */}
      <Card className="p-4 relative">
        {loadingTopBrands && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Top Brands by Revenue</h2>
            <div className="flex gap-2 items-center">
              <Select
                value={topBrandsFilter.type}
                onValueChange={(value: any) =>
                  setTopBrandsFilter({ ...topBrandsFilter, type: value })
                }
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTH">Monthly</SelectItem>
                  <SelectItem value="QUARTER">Quarterly</SelectItem>
                  <SelectItem value="YEAR">Yearly</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={topBrandsFilter.year.toString()}
                onValueChange={(value) =>
                  setTopBrandsFilter({ ...topBrandsFilter, year: Number(value) })
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => currentDate.year - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {topBrandsFilter.type === "MONTH" && (
                <Select
                  value={topBrandsFilter.month.toString()}
                  onValueChange={(value) =>
                    setTopBrandsFilter({ ...topBrandsFilter, month: Number(value) })
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {new Date(2000, month - 1).toLocaleString("default", {
                          month: "long",
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {topBrandsFilter.type === "QUARTER" && (
                <Select
                  value={topBrandsFilter.quarter.toString()}
                  onValueChange={(value) =>
                    setTopBrandsFilter({ ...topBrandsFilter, quarter: Number(value) })
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Q1 (Jan-Mar)</SelectItem>
                    <SelectItem value="2">Q2 (Apr-Jun)</SelectItem>
                    <SelectItem value="3">Q3 (Jul-Sep)</SelectItem>
                    <SelectItem value="4">Q4 (Oct-Dec)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <BarChartWidget title="" data={brandRevenueData} />
        </div>
      </Card>

      {/* Revenue by Type Chart with Filter */}
      <Card className="p-4 relative">
        {loadingRevenue && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Revenue by Type</h2>
            <div className="flex gap-2 items-center">
              <Select
                value={revenueFilter.type}
                onValueChange={(value: any) => setRevenueFilter({ ...revenueFilter, type: value })}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTH">Monthly</SelectItem>
                  <SelectItem value="QUARTER">Quarterly</SelectItem>
                  <SelectItem value="YEAR">Yearly</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={revenueFilter.year.toString()}
                onValueChange={(value) =>
                  setRevenueFilter({ ...revenueFilter, year: Number(value) })
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => currentDate.year - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {revenueFilter.type === "MONTH" && (
                <Select
                  value={revenueFilter.month.toString()}
                  onValueChange={(value) =>
                    setRevenueFilter({ ...revenueFilter, month: Number(value) })
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {new Date(2000, month - 1).toLocaleString("default", {
                          month: "long",
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {revenueFilter.type === "QUARTER" && (
                <Select
                  value={revenueFilter.quarter.toString()}
                  onValueChange={(value) =>
                    setRevenueFilter({ ...revenueFilter, quarter: Number(value) })
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Q1 (Jan-Mar)</SelectItem>
                    <SelectItem value="2">Q2 (Apr-Jun)</SelectItem>
                    <SelectItem value="3">Q3 (Jul-Sep)</SelectItem>
                    <SelectItem value="4">Q4 (Oct-Dec)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <BarChartWidget title="" data={revenueByTypeData} />
        </div>
      </Card>

      {/* Revenue Distribution Pie Chart */}
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

      {/* Upcoming Deadlines with Filter */}
      <Card className="p-4 relative">
        {loadingDeadlines && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
            <div className="flex gap-2 items-center">
              <label className="text-sm font-medium">Days:</label>
              <Select
                value={deadlineFilter.days.toString()}
                onValueChange={(value) => setDeadlineFilter({ days: Number(value) })}
              >
                <SelectTrigger className="w-[120px]">
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
          <TableWidget title="" data={upcomingDeadlinesData} />
        </div>
      </Card>

      {/* Alerts Table */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Alerts</h2>
          <TableWidget title="" data={alertsData} />
        </div>
      </Card>
    </div>
  );
};

export default MarketingDashboard;
