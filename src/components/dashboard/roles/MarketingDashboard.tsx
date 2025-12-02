import React, { useEffect, useState } from "react";
import {
  KPIWidget,
  BarChartWidget,
  PieChartWidget,
  TableWidget,
} from "@/components/dashboard/chart";
import {
  FaBullhorn,
  FaRegCircleCheck,
  FaMoneyBillWave,
  FaTriangleExclamation,
} from "react-icons/fa6";
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
import { Button } from "@/components/ui/button";

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

  const [revenueFilter, setRevenueFilter] = useState({
    filter_type: "MONTH" as "MONTH" | "QUARTER" | "YEAR",
    year: currentDate.year,
    month: currentDate.month,
    quarter: currentDate.quarter,
  });

  const [topBrandsFilter, setTopBrandsFilter] = useState({
    filter_type: "MONTH" as "MONTH" | "QUARTER" | "YEAR",
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
    dispatch(marketingActiveBrand());

    dispatch(marketingActiveCampaign());

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
      filter_type: revenueFilter.filter_type,
      year: revenueFilter.year,
    };

    if (revenueFilter.filter_type === "MONTH") {
      filter.month = revenueFilter.month;
    } else if (revenueFilter.filter_type === "QUARTER") {
      filter.quarter = revenueFilter.quarter;
    }

    dispatch(marketingRevenueType(filter));
  };

  const fetchTopBrands = () => {
    const filter: any = {
      filter_type: topBrandsFilter.filter_type,
      year: topBrandsFilter.year,
    };

    if (topBrandsFilter.filter_type === "MONTH") {
      filter.month = topBrandsFilter.month;
    } else if (topBrandsFilter.filter_type === "QUARTER") {
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

  const alertsData = [
    ...(Array.isArray(upcomingDeadlines)
      ? upcomingDeadlines
          .filter((d: any) => d.days_remaining <= 7)
          .map((deadline: any) => ({
            type: "Deadline Alert",
            message: `Campaign "${deadline.name}" ending in ${deadline.days_remaining} days`,
            priority: deadline.days_remaining <= 3 ? "High" : "Medium",
          }))
      : []),
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

  const totalAlerts = alertsData.length;
  const highPriorityAlerts = alertsData.filter((alert) => alert.priority === "High").length;

  const isAnyLoading =
    loading || loadingKPI || loadingRevenue || loadingTopBrands || loadingDeadlines;

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
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <KPIWidget
          title="Draft Campaigns"
          data={draftCampaignsData}
          icon={<FaRegCircleCheck size={20} />}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
        />
        <KPIWidget
          title="Total Alerts"
          data={{
            value: totalAlerts,
            statusText: `${highPriorityAlerts} high priority`,
          }}
          icon={<FaTriangleExclamation size={20} />}
          iconColor="text-red-600"
          iconBg="bg-red-100"
        />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Monthly Revenue</h2>
            <div className="flex gap-2 items-center flex-wrap">
              <Select
                value={monthlyRevenueFilter.year.toString()}
                onValueChange={(value) =>
                  setMonthlyRevenueFilter((prev) => ({ ...prev, year: Number(value) }))
                }
              >
                <SelectTrigger className="w-[80px] h-8 text-xs">
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
                  setMonthlyRevenueFilter((prev) => ({ ...prev, month: Number(value) }))
                }
              >
                <SelectTrigger className="w-[90px] h-8 text-xs">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setMonthlyRevenueFilter({ year: currentDate.year, month: currentDate.month })
                }
                className="h-8 text-xs"
              >
                Reset
              </Button>
            </div>
          </div>
          <KPIWidget
            title=""
            data={monthlyRevenueData}
            icon={<FaMoneyBillWave size={20} />}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-100"
          />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Top Brands by Revenue</h2>
            <div className="flex gap-2 items-center flex-wrap">
              <Select
                value={topBrandsFilter.filter_type}
                onValueChange={(value: "MONTH" | "QUARTER" | "YEAR") =>
                  setTopBrandsFilter((prev) => ({ ...prev, filter_type: value }))
                }
              >
                <SelectTrigger className="w-[100px] h-8 text-xs">
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
                  setTopBrandsFilter((prev) => ({ ...prev, year: Number(value) }))
                }
              >
                <SelectTrigger className="w-[80px] h-8 text-xs">
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

              {topBrandsFilter.filter_type === "MONTH" && (
                <Select
                  value={topBrandsFilter.month.toString()}
                  onValueChange={(value) =>
                    setTopBrandsFilter((prev) => ({ ...prev, month: Number(value) }))
                  }
                >
                  <SelectTrigger className="w-[90px] h-8 text-xs">
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
              )}

              {topBrandsFilter.filter_type === "QUARTER" && (
                <Select
                  value={topBrandsFilter.quarter.toString()}
                  onValueChange={(value) =>
                    setTopBrandsFilter((prev) => ({ ...prev, quarter: Number(value) }))
                  }
                >
                  <SelectTrigger className="w-[100px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Q1</SelectItem>
                    <SelectItem value="2">Q2</SelectItem>
                    <SelectItem value="3">Q3</SelectItem>
                    <SelectItem value="4">Q4</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setTopBrandsFilter({
                    filter_type: "MONTH",
                    year: currentDate.year,
                    month: currentDate.month,
                    quarter: currentDate.quarter,
                  })
                }
                className="h-8 text-xs"
              >
                Reset
              </Button>
            </div>
          </div>
          {isEmptyData(brandRevenueData) ? (
            <NoDataMessage message="No brand revenue data available for the selected period" />
          ) : (
            <BarChartWidget title="" data={brandRevenueData} />
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-lg font-semibold">Revenue by Type</h2>
              <div className="flex gap-2 items-center flex-wrap">
                <Select
                  value={revenueFilter.filter_type}
                  onValueChange={(value: "MONTH" | "QUARTER" | "YEAR") =>
                    setRevenueFilter((prev) => ({ ...prev, filter_type: value }))
                  }
                >
                  <SelectTrigger className="w-[100px] h-8 text-xs">
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
                    setRevenueFilter((prev) => ({ ...prev, year: Number(value) }))
                  }
                >
                  <SelectTrigger className="w-[80px] h-8 text-xs">
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

                {revenueFilter.filter_type === "MONTH" && (
                  <Select
                    value={revenueFilter.month.toString()}
                    onValueChange={(value) =>
                      setRevenueFilter((prev) => ({ ...prev, month: Number(value) }))
                    }
                  >
                    <SelectTrigger className="w-[90px] h-8 text-xs">
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
                )}

                {revenueFilter.filter_type === "QUARTER" && (
                  <Select
                    value={revenueFilter.quarter.toString()}
                    onValueChange={(value) =>
                      setRevenueFilter((prev) => ({ ...prev, quarter: Number(value) }))
                    }
                  >
                    <SelectTrigger className="w-[100px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Q1</SelectItem>
                      <SelectItem value="2">Q2</SelectItem>
                      <SelectItem value="3">Q3</SelectItem>
                      <SelectItem value="4">Q4</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            {isEmptyData(revenueByTypeData) ? (
              <NoDataMessage message="No revenue breakdown data available for the selected period" />
            ) : (
              <BarChartWidget title="" data={revenueByTypeData} />
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Revenue Distribution</h2>
            {isEmptyData(revenueShareData) ? (
              <NoDataMessage message="No revenue distribution data available" />
            ) : (
              <PieChartWidget title="" data={revenueShareData} mode="percent" />
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
              <div className="flex gap-2 items-center flex-wrap">
                <label className="text-sm font-medium">Days:</label>
                <Select
                  value={deadlineFilter.days.toString()}
                  onValueChange={(value) => setDeadlineFilter({ days: Number(value) })}
                >
                  <SelectTrigger className="w-[120px] h-8 text-xs">
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeadlineFilter({ days: 30 })}
                  className="h-8 text-xs"
                >
                  Reset
                </Button>
              </div>
            </div>
            {isEmptyData(upcomingDeadlinesData) ? (
              <NoDataMessage message="No upcoming deadlines found" />
            ) : (
              <TableWidget title="" data={upcomingDeadlinesData} />
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Alerts & Notifications</h2>
            {isEmptyData(alertsData) ? (
              <NoDataMessage message="No alerts at this time" />
            ) : (
              <TableWidget title="" data={alertsData} />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MarketingDashboard;
