import React, { useEffect } from "react";
import {
  BarChartWidget,
  KPIWidget,
  LineChartWidget,
  PieChartWidget,
  TableWidget,
} from "@/components/dashboard/chart";
import { useAppDispatch, type RootState } from "@/libs/stores";
import {
  salesFinancialsDashboard,
  salesRevenueTrend,
  salesOrderDashboard,
  salesOrderTrend,
} from "@/libs/stores/salesAnalyticManager/thunk";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaBox } from "react-icons/fa6";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgePercent, Banknote, BanknoteArrowDown, Filter, Loader2, X } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { convertNumberToCurrency } from "@/libs/helper/helper";

const formatDateToRFC3339 = (dateString: string | undefined, isEndDate: boolean = false) => {
  if (!dateString) return undefined;
  try {
    const date = new Date(dateString);
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    } else {
      date.setHours(0, 0, 0, 0);
    }
    return date.toISOString();
  } catch {
    return undefined;
  }
};

const SaleDashboard: React.FC = () => {
  const currentDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setMonth(currentDate.getMonth() - 1);

  const [showFilter, setShowFilter] = React.useState(false);
  const [startDate, setStartDate] = React.useState<string | undefined>(
    formatDateToRFC3339(defaultStartDate.toISOString().split("T")[0], false),
  );
  const [endDate, setEndDate] = React.useState<string | undefined>(
    formatDateToRFC3339(currentDate.toISOString().split("T")[0], true),
  );
  const [periodGap, setPeriodGap] = React.useState<"day" | "month" | "year">("day");

  const handleClearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleSetGapPeriod = (value: "day" | "month" | "year") => {
    setPeriodGap(value);
    if (value === "day") {
      const start = new Date();
      start.setMonth(currentDate.getMonth() - 1);
      const end = new Date();
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
      return;
    } else if (value === "month") {
      const start = new Date();
      start.setFullYear(currentDate.getFullYear() - 1);
      const end = new Date();
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
      return;
    } else if (value === "year") {
      const start = new Date();
      start.setFullYear(currentDate.getFullYear() - 5);
      const end = new Date();
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
      return;
    }
  };

  // Handle scroll to hide filter
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollY = target.scrollTop;
      if (showFilter === true && scrollY > 0) {
        setShowFilter(false);
      }
    };

    // Find the scrolling container (the main element in ManageLayout)
    const scrollContainer = document.querySelector("main");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [showFilter]);

  return (
    <Tabs defaultValue="overview">
      <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between w-full sm:w-auto">
            <div className="relative">
              <Button variant="default" size="lg" onClick={() => setShowFilter(!showFilter)}>
                <Filter size={16} />
                Filter
              </Button>
              {showFilter && (
                <div className="absolute mt-2 flex items-center gap-4 bg-white shadow-lg rounded-lg p-4 right-0 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2">
                    <div className="text-gray-600 font-medium">Period Gap:</div>
                    <Select
                      value={periodGap}
                      onValueChange={(value) =>
                        handleSetGapPeriod(value as "day" | "month" | "year")
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select period gap" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Daily</SelectItem>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-gray-600 font-medium">Date Range:</div>
                    <DatePicker
                      value={startDate}
                      onChange={setStartDate}
                      maxDate={endDate}
                      placeholder="Start Date"
                    />
                    <span className="text-gray-400">-</span>
                    <DatePicker
                      value={endDate}
                      onChange={setEndDate}
                      minDate={startDate}
                      placeholder="End Date"
                    />
                    {(startDate || endDate) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearDates}
                        className="h-8 px-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="order/preorder">Order/Preorder</TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        <TabsContent value="overview">
          <OverviewTab
            startDate={formatDateToRFC3339(startDate, false)}
            endDate={formatDateToRFC3339(endDate, true)}
            periodGap={periodGap}
          />
        </TabsContent>
        <TabsContent value="order/preorder">
          <OrderTab
            startDate={formatDateToRFC3339(startDate, false)}
            endDate={formatDateToRFC3339(endDate, true)}
            periodGap={periodGap}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

interface TabProps {
  startDate?: string;
  endDate?: string;
  periodGap?: "day" | "month" | "year";
}

const OverviewTab: React.FC<TabProps> = ({ startDate, endDate, periodGap = "day" }) => {
  const dispatch = useAppDispatch();
  const {
    financialsDashboard,
    revenueGrowth,
    revenueTrend,
    loadingFinancialsDashboard,
    loadingRevenueGrowth,
    loadingRevenueTrend,
  } = useSelector((state: RootState) => state.manageSalesAnalytic);

  useEffect(() => {
    dispatch(
      salesFinancialsDashboard({
        from_date: startDate,
        to_date: endDate,
        limit: 5,
        period_gap: periodGap,
      }),
    );

    dispatch(salesRevenueTrend({ from_date: startDate, to_date: endDate, period_gap: periodGap }));
  }, [dispatch, startDate, endDate, periodGap]);

  const formatCardData = {
    total_sold_revenue: {
      value: financialsDashboard?.summary.total_sold_revenue,
    },
    standard_revenue: {
      value: financialsDashboard?.summary.standard_revenue,
    },
    limited_revenue: {
      value: financialsDashboard?.summary.limited_revenue,
    },
    total_refund: {
      value: financialsDashboard?.summary.total_refund,
    },
    revenue_growth: {
      value: revenueGrowth || 0,
    },
    average_order_value: {
      value: financialsDashboard?.summary.average_order_value.combined,
    },
    new_customer_count: {
      value: financialsDashboard?.summary.new_customer_count,
    },
    returning_customer_count: {
      value: financialsDashboard?.summary.returning_customer_count,
    },
  };

  const formatPieChartData = {
    revenue_by_product_type: financialsDashboard?.revenue_by_product_type?.map(
      (item: { product_type: string; revenue: number }) => ({
        type: item.product_type,
        value: item.revenue,
      }),
    ),
    revenue_by_category: financialsDashboard?.revenue_by_category?.map(
      (item: { category_name: string; revenue: number }) => ({
        type: item.category_name,
        value: item.revenue,
      }),
    ),
  };

  const formatTableData = {
    top_selling_products: financialsDashboard?.top_lists.top_products?.map(
      (item: { name: string; value: number }) => ({
        name: item.name,
        revenue: convertNumberToCurrency(item.value.toString()),
      }),
    ),
    top_brands: financialsDashboard?.top_lists.top_brands?.map(
      (item: { name: string; value: number }) => ({
        name: item.name,
        revenue: convertNumberToCurrency(item.value.toString()),
      }),
    ),
    top_categories: financialsDashboard?.top_lists.top_categories?.map(
      (item: { name: string; value: number }) => ({
        name: item.name,
        revenue: convertNumberToCurrency(item.value.toString()),
      }),
    ),
  };
  const formatProductTypeTrendData = () => {
    if (!revenueTrend) return [];
    const standard = revenueTrend.STANDARD || [];
    const limited = revenueTrend.LIMITED || [];
    const all = revenueTrend.ALL || [];

    const periods = new Set([
      ...standard.map((item: any) => item.time),
      ...limited.map((item: any) => item.time),
      ...all.map((item: any) => item.time),
    ]);

    return Array.from(periods)
      .sort()
      .map((time) => {
        const standardItem = standard.find((item: any) => item.time === time);
        const limitedItem = limited.find((item: any) => item.time === time);
        const allItem = all.find((item: any) => item.time === time);

        return {
          month: new Date(time).toISOString().split("T")[0],
          standard_revenue: standardItem?.value || 0,
          limited_revenue: limitedItem?.value || 0,
          all_revenue: allItem?.value || 0,
        };
      });
  };

  const formatBarChartData = {
    revenue_by_category: financialsDashboard?.revenue_by_category?.map(
      (item: { category_name: string; revenue: number }) => ({
        name: item.category_name,
        value: item.revenue,
      }),
    ),
  };

  if (loadingFinancialsDashboard || loadingRevenueGrowth || loadingRevenueTrend) {
    return (
      <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <KPIWidget
          title="Total Revenue"
          data={formatCardData.total_sold_revenue}
          mode="currency"
          icon={<Banknote size={20} />}
          iconColor="text-green-600"
          iconBg="bg-green-100"
          tooltip="Total revenue generated from all product sales including both standard and limited edition products"
        />
        <KPIWidget
          title="Limited Product Revenue"
          data={formatCardData.limited_revenue}
          mode="currency"
          icon={<Banknote size={20} />}
          iconColor="text-yellow-700"
          iconBg="bg-yellow-100"
          tooltip="Revenue generated specifically from limited edition and exclusive product sales with higher profit margins"
        />
        <KPIWidget
          title="Standard Product Revenue"
          data={formatCardData.standard_revenue}
          mode="currency"
          icon={<Banknote size={20} />}
          iconColor="text-blue-700"
          iconBg="bg-blue-100"
          tooltip="Revenue generated from regular product sales representing the core business income stream"
        />
        <KPIWidget
          title="Total Refund"
          data={formatCardData.total_refund}
          mode="currency"
          icon={<BanknoteArrowDown size={20} />}
          iconColor="text-red-700"
          iconBg="bg-red-100"
          tooltip="Total amount refunded to customers due to returns, cancellations, or product issues"
        />
        {/* <KPIWidget
          title="Revenue Growth"
          data={formatCardData.revenue_growth}
          mode="percent"
          icon={<ChartLine size={20} />}
          iconColor="text-teal-700"
          iconBg="bg-teal-100"
          tooltip="Percentage change in revenue compared to the previous period, indicating business growth or decline"
        /> */}
        <KPIWidget
          title="Average Order Value"
          data={formatCardData.average_order_value}
          mode="currency"
          icon={<BadgePercent size={20} />}
          iconColor="text-purple-700"
          iconBg="bg-purple-100"
          tooltip="Average monetary value of each customer order, indicating customer spending patterns and purchase behavior"
        />
        {/* <KPIWidget
          title="New Customers"
          data={formatCardData.new_customer_count}
          icon={<UserRound size={20} />}
          iconColor="text-orange-700"
          iconBg="bg-orange-100"
          tooltip="Number of first-time customers who made their initial purchase during the selected time period"
        />
        <KPIWidget
          title="Returning Customers"
          data={formatCardData.returning_customer_count}
          icon={<UserRoundCheck size={20} />}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-100"
          tooltip="Number of existing customers who made repeat purchases, indicating customer loyalty and satisfaction"
        /> */}
      </div>

      {/* Product Type Trend Chart */}
      <div className="flex flex-col gap-4 bg-white shadow rounded-xl p-4">
        <h3 className="text-gray-700 text-base font-semibold">Revenue by Product</h3>
        {formatProductTypeTrendData().length === 0 ? (
          <div className="h-[340px] flex items-center justify-center text-gray-400 italic">
            No data available
          </div>
        ) : (
          <LineChartWidget
            title=""
            data={formatProductTypeTrendData()}
            unit="VND"
            lineConfig={{
              standard_revenue: {
                label: "Standard Products",
                color: "#6366f1",
              },
              limited_revenue: {
                label: "Limited Products",
                color: "#ef4444",
              },
              all_revenue: {
                label: "All Products",
                color: "#10b981",
              },
            }}
          />
        )}
      </div>

      {/* Order Type Trend Chart */}
      <div className="flex flex-col gap-4 bg-white shadow rounded-xl p-4">
        <h3 className="text-gray-700 text-base font-semibold">Revenue by Category</h3>
        {formatBarChartData?.revenue_by_category?.length === 0 ? (
          <div className="h-[340px] flex items-center justify-center text-gray-400 italic">
            No data available
          </div>
        ) : (
          <BarChartWidget title="" data={formatBarChartData?.revenue_by_category} unit="VND" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        {formatPieChartData.revenue_by_product_type ? (
          <PieChartWidget
            title="Revenue by Product Type"
            mode="currency"
            data={formatPieChartData.revenue_by_product_type}
          />
        ) : (
          <PieChartWidget
            title="Revenue by Product Type"
            mode="currency"
            data={[{ type: "No data", value: 0 }]}
          />
        )}
        {formatPieChartData.revenue_by_category ? (
          <PieChartWidget
            title="Revenue by Category"
            mode="currency"
            data={formatPieChartData.revenue_by_category}
          />
        ) : (
          <PieChartWidget
            title="Revenue by Category"
            mode="currency"
            data={[{ type: "No data", value: 0 }]}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <TableWidget
          title="Top Selling Products"
          data={formatTableData.top_selling_products}
          tooltip="Ranking of products by revenue generated, showing which items are most popular and profitable"
        />
        <TableWidget
          title="Top Brands"
          data={formatTableData.top_brands}
          tooltip="Ranking of brands by total sales revenue, indicating which brand partnerships are most successful"
        />
        <TableWidget
          title="Top Categories"
          data={formatTableData.top_categories}
          tooltip="Ranking of product categories by sales performance, helping identify which product types are in highest demand"
        />
      </div>
    </div>
  );
};

const OrderTab: React.FC<TabProps> = ({ startDate, endDate, periodGap = "day" }) => {
  const dispatch = useAppDispatch();
  const { orderDashboard, loadingOrderTrend, loadingOrderDashboard } = useSelector(
    (state: RootState) => state.manageSalesAnalytic,
  );

  useEffect(() => {
    dispatch(
      salesOrderDashboard({
        from_date: startDate,
        to_date: endDate,
        limit: 5,
        period_gap: periodGap,
      }),
    );

    dispatch(
      salesOrderTrend({
        from_date: startDate,
        to_date: endDate,
        period_gap: periodGap,
      }),
    );
  }, [dispatch, startDate, endDate, periodGap]);

  if (loadingOrderDashboard || loadingOrderTrend) {
    return (
      <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  const formatOrderCardData = {
    total_orders: {
      value: orderDashboard?.summary.order.total,
    },
    pending_orders: {
      value: orderDashboard?.summary.order.pending,
    },
    completed_orders: {
      value: orderDashboard?.summary.order.completed,
    },
    cancelled_orders: {
      value: orderDashboard?.summary.order.cancelled,
    },
    refunded: {
      value: orderDashboard?.summary.order.refunded,
    },
    cancellation_rate: {
      value: orderDashboard?.summary.order.cancellation_rate,
    },
    refund_rate: {
      value: orderDashboard?.summary.order.refund_rate,
    },
  };

  const formatPreorderCardData = {
    total_orders: {
      value: orderDashboard?.summary.pre_order.total,
    },
    pending_orders: {
      value: orderDashboard?.summary.pre_order.pending,
    },
    completed_orders: {
      value: orderDashboard?.summary.pre_order.completed,
    },
    cancelled_orders: {
      value: orderDashboard?.summary.pre_order.cancelled,
    },
    refunded: {
      value: orderDashboard?.summary.pre_order.refunded,
    },
    cancellation_rate: {
      value: orderDashboard?.summary.pre_order.cancellation_rate,
    },
    refund_rate: {
      value: orderDashboard?.summary.pre_order.refund_rate,
    },
  };

  const formatPieChartData = {
    orders: Object.keys(orderDashboard?.orders_pie_chart || {}).map((key) => ({
      type: key,
      value: orderDashboard.orders_pie_chart[key],
    })),
    pre_orders: Object.keys(orderDashboard?.pre_orders_pie_chart || {}).map((key) => ({
      type: key,
      value: orderDashboard.pre_orders_pie_chart[key],
    })),
  };

  const formatTrendData = () => {
    if (!orderDashboard?.orders_trend) return [];
    const order = orderDashboard.orders_trend.orders_vs_pre_orders.ORDER || [];
    const pre_order = orderDashboard.orders_trend.orders_vs_pre_orders.PRE_ORDER || [];

    const periods = new Set([
      ...order.map((item: any) => item.time),
      ...pre_order.map((item: any) => item.time),
    ]);

    return Array.from(periods)
      .sort()
      .map((time) => {
        const orderItem = order.find((item: any) => item.time === time);
        const preOrderItem = pre_order.find((item: any) => item.time === time);

        return {
          month: new Date(time).toISOString().split("T")[0],
          order_count: orderItem?.value || 0,
          pre_order_count: preOrderItem?.value || 0,
        };
      });
  };

  const formatTableData = {
    latest_orders: orderDashboard?.latest_orders?.map((item: any) => ({
      order_id: `#${item.id.slice(0, 8).toUpperCase()}`,
      customer_name: item.customer_name,
      status: item.status,
      type: item.type,
      total_amount: convertNumberToCurrency(item.total_amount.toString()),
      order_date: new Date(item.created_at).toLocaleDateString(),
    })),
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        <KPIWidget
          title="Total Orders"
          data={formatOrderCardData.total_orders}
          icon={<FaBox size={20} />}
          iconColor="text-teal-600"
          iconBg="bg-teal-100"
          tooltip="Total number of orders received including all statuses: pending, completed, cancelled, and refunded"
        />
        <KPIWidget
          title="Completed Orders"
          data={formatOrderCardData.completed_orders}
          icon={<FaBox size={20} />}
          iconColor="text-green-700"
          iconBg="bg-green-100"
        />
        <KPIWidget
          title="Pending Orders"
          data={formatOrderCardData.pending_orders}
          icon={<FaBox size={20} />}
          iconColor="text-blue-700"
          iconBg="bg-blue-100"
        />
        <KPIWidget
          title="Cancelled Orders"
          data={formatOrderCardData.cancelled_orders}
          icon={<FaBox size={20} />}
          iconColor="text-red-700"
          iconBg="bg-red-100"
        />
        <KPIWidget
          title="Refunded Orders"
          data={formatOrderCardData.refunded}
          icon={<FaBox size={20} />}
          iconColor="text-orange-700"
          iconBg="bg-orange-100"
        />
        <KPIWidget
          title="Total Preorders"
          data={formatPreorderCardData.total_orders}
          icon={<FaBox size={20} />}
          iconColor="text-teal-700"
          iconBg="bg-teal-100"
        />
        <KPIWidget
          title="Completed Preorders"
          data={formatPreorderCardData.completed_orders}
          icon={<FaBox size={20} />}
          iconColor="text-green-700"
          iconBg="bg-green-100"
        />
        <KPIWidget
          title="Pending Preorders"
          data={formatPreorderCardData.pending_orders}
          icon={<FaBox size={20} />}
          iconColor="text-blue-700"
          iconBg="bg-blue-100"
        />
        <KPIWidget
          title="Cancelled Preorders"
          data={formatPreorderCardData.cancelled_orders}
          icon={<FaBox size={20} />}
          iconColor="text-red-700"
          iconBg="bg-red-100"
        />
        <KPIWidget
          title="Refunded Preorders"
          data={formatPreorderCardData.refunded}
          icon={<FaBox size={20} />}
          iconColor="text-orange-700"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Chart Section */}
      <div className="flex flex-col gap-4 bg-white shadow rounded-xl p-4">
        <LineChartWidget
          title="Order Trend"
          data={formatTrendData()}
          lineConfig={{
            order_count: {
              label: "Orders",
              color: "#6366f1",
            },
            pre_order_count: {
              label: "Pre-orders",
              color: "#ef4444",
            },
          }}
          tooltip="Trend analysis showing the volume of regular orders versus pre-orders over time, helping predict demand patterns"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <PieChartWidget
          title="Compare State in Orders"
          data={formatPieChartData.orders}
          tooltip="Distribution of regular orders by status showing the proportion of pending, completed, cancelled, and refunded orders"
        />
        <PieChartWidget
          title="Compare State in Preorders"
          data={formatPieChartData.pre_orders}
          tooltip="Distribution of pre-orders by status showing customer commitment and potential future revenue"
        />
      </div>
      <div className="flex flex-col gap-4">
        <TableWidget
          title="Recent Orders"
          data={formatTableData.latest_orders}
          tooltip="List of most recent orders with customer details, status, and order values for quick monitoring of current sales activity"
        />
      </div>
    </div>
  );
};

export default SaleDashboard;
