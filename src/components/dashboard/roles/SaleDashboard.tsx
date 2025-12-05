import React, { useEffect } from "react";
import {
  KPIWidget,
  LineChartWidget,
  PieChartWidget,
  TableWidget,
} from "@/components/dashboard/chart";
import { useAppDispatch, type RootState } from "@/libs/stores";
import {
  salesFinancialsDashboard,
  salesRevenueGrowth,
  salesRevenueTrend,
  salesOrderDashboard,
  salesOrderTrend,
} from "@/libs/stores/salesAnalyticManager/thunk";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { convertNumberToCurrency } from "@/libs/helper/helper";
import { FaBox, FaDollarSign } from "react-icons/fa6";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { convertNumberToCurrency } from "@/libs/helper/helper";

const SaleDashboard: React.FC = () => {
  const [startDate, setStartDate] = React.useState<string | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<string | undefined>(undefined);

  const formatDateToRFC3339 = (dateString: string | undefined) => {
    if (!dateString) return undefined;
    try {
      const date = new Date(dateString);
      return date.toISOString();
    } catch {
      return undefined;
    }
  };

  const handleClearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <Tabs defaultValue="overview">
      <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white shadow rounded-lg p-2">
              <DatePicker value={startDate} onChange={setStartDate} placeholder="Start Date" />
              <span className="text-gray-400">-</span>
              <DatePicker value={endDate} onChange={setEndDate} placeholder="End Date" />
              {(startDate || endDate) && (
                <Button variant="ghost" size="sm" onClick={handleClearDates} className="h-8 px-2">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="order">Order</TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        <TabsContent value="overview">
          <OverviewTab
            startDate={formatDateToRFC3339(startDate)}
            endDate={formatDateToRFC3339(endDate)}
          />
        </TabsContent>
        <TabsContent value="order">
          <OrderTab
            startDate={formatDateToRFC3339(startDate)}
            endDate={formatDateToRFC3339(endDate)}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

interface TabProps {
  startDate?: string;
  endDate?: string;
}

const OverviewTab: React.FC<TabProps> = ({ startDate, endDate }) => {
  const dispatch = useAppDispatch();
  const {
    financialsDashboard,
    // revenueGrowth,
    revenueTrend,
    loadingFinancialsDashboard,
    loadingRevenueGrowth,
    loadingRevenueTrend,
  } = useSelector((state: RootState) => state.manageSalesAnalytic);

  const [periodGap] = React.useState<"day" | "week" | "month" | "quarter" | "year">("day");

  useEffect(() => {
    dispatch(
      salesFinancialsDashboard({
        from_date: startDate,
        to_date: endDate,
        //   limit: 5,
        period_gap: "week",
        //   compare_with: "day",
      }),
    );

    dispatch(salesRevenueGrowth({ compare_with: "day" }));

    dispatch(salesRevenueTrend({ from_date: startDate, to_date: endDate, period_gap: "week" }));
  }, [dispatch, startDate, endDate, periodGap]);

  const formatCardData = {
    total_sold_revenue: {
      value: financialsDashboard?.summary.total_sold_revenue,
    },
    revenue_growth: {
      value: financialsDashboard?.summary.revenue_growth,
    },
    average_order_value: {
      value: financialsDashboard?.summary.average_order_value.combined,
    },
    limited_product_conversion_rate: {
      value: financialsDashboard?.summary.limited_product_conversion_rate * 100,
    },
    returning_customer_count: {
      value: financialsDashboard?.summary.returning_customer_count,
    },
  };

  const formatPieChartData = {
    revenue_by_product_type: financialsDashboard?.revenue_by_product_type.map(
      (item: { product_type: string; revenue: number }) => ({
        type: item.product_type,
        value: item.revenue,
      }),
    ),
    revenue_by_category: financialsDashboard?.revenue_by_category.map(
      (item: { category_name: string; revenue: number }) => ({
        type: item.category_name,
        value: item.revenue,
      }),
    ),
  };

  const formatTableData = {
    top_selling_products: financialsDashboard?.top_lists.top_products.map(
      (item: { name: string; value: number }) => ({
        name: item.name,
        revenue: convertNumberToCurrency(item.value.toString()),
      }),
    ),
    top_brands: financialsDashboard?.top_lists.top_brands.map(
      (item: { name: string; value: number }) => ({
        name: item.name,
        revenue: convertNumberToCurrency(item.value.toString()),
      }),
    ),
    top_categories: financialsDashboard?.top_lists.top_categories.map(
      (item: { name: string; value: number }) => ({
        name: item.name,
        revenue: convertNumberToCurrency(item.value.toString()),
      }),
    ),
  };
  const formatProductTypeTrendData = () => {
    if (!revenueTrend?.standard_vs_limited) return [];
    const standard = revenueTrend.standard_vs_limited.STANDARD || [];
    const limited = revenueTrend.standard_vs_limited.LIMITED || [];

    const periods = new Set([
      ...standard.map((item: any) => item.time),
      ...limited.map((item: any) => item.time),
    ]);

    return Array.from(periods)
      .sort()
      .map((time) => {
        const standardItem = standard.find((item: any) => item.time === time);
        const limitedItem = limited.find((item: any) => item.time === time);

        return {
          month: new Date(time).toISOString().split("T")[0],
          standard_revenue: standardItem?.value || 0,
          limited_revenue: limitedItem?.value || 0,
        };
      });
  };

  const formatOrderTypeTrendData = () => {
    if (!revenueTrend?.orders_vs_pre_orders) return [];
    const orders = revenueTrend.orders_vs_pre_orders.ORDER || [];
    const preOrders = revenueTrend.orders_vs_pre_orders.PRE_ORDER || [];

    const periods = new Set([
      ...orders.map((item: any) => item.time),
      ...preOrders.map((item: any) => item.time),
    ]);

    return Array.from(periods)
      .sort()
      .map((time) => {
        const orderItem = orders.find((item: any) => item.time === time);
        const preOrderItem = preOrders.find((item: any) => item.time === time);

        return {
          month: new Date(time).toISOString().split("T")[0],
          order_revenue: orderItem?.value || 0,
          pre_order_revenue: preOrderItem?.value || 0,
        };
      });
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
          title="Total Sold Revenue"
          data={formatCardData.total_sold_revenue}
          mode="currency"
          icon={<FaDollarSign size={20} />}
          iconColor="text-teal-600"
          iconBg="bg-teal-100"
        />
        <KPIWidget
          title="Average Order Value"
          data={formatCardData.average_order_value}
          mode="currency"
          icon={<FaDollarSign size={20} />}
          iconColor="text-yellow-700"
          iconBg="bg-yellow-100"
        />
        <KPIWidget
          title="Limited Product Conversion Rate"
          data={formatCardData.limited_product_conversion_rate}
          mode="percent"
          icon={<FaDollarSign size={20} />}
          iconColor="text-purple-700"
          iconBg="bg-purple-100"
        />
        <KPIWidget
          title="Returning Customer Count"
          data={formatCardData.returning_customer_count}
          icon={<FaDollarSign size={20} />}
          iconColor="text-purple-700"
          iconBg="bg-purple-100"
        />
        <KPIWidget
          title="Revenue Growth"
          data={formatCardData.revenue_growth}
          icon={<FaDollarSign size={20} />}
          iconColor="text-green-700"
          iconBg="bg-green-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <PieChartWidget
          title="Revenue by Product Type"
          mode="currency"
          data={formatPieChartData.revenue_by_product_type}
        />
        <PieChartWidget
          title="Revenue by Category"
          mode="currency"
          data={formatPieChartData.revenue_by_category}
        />
      </div>

      {/* Product Type Trend Chart */}
      <div className="flex flex-col gap-4 bg-white shadow rounded-xl p-4">
        <h3 className="text-gray-700 text-base font-semibold">
          Revenue by Product Type (Standard vs Limited)
        </h3>
        {formatProductTypeTrendData().length === 0 ? (
          <div className="h-[340px] flex items-center justify-center text-gray-400 italic">
            No data available
          </div>
        ) : (
          <LineChartWidget title="" data={formatProductTypeTrendData()} />
        )}
      </div>

      {/* Order Type Trend Chart */}
      <div className="flex flex-col gap-4 bg-white shadow rounded-xl p-4">
        <h3 className="text-gray-700 text-base font-semibold">
          Revenue by Order Type (Order vs Pre-Order)
        </h3>
        {formatOrderTypeTrendData().length === 0 ? (
          <div className="h-[340px] flex items-center justify-center text-gray-400 italic">
            No data available
          </div>
        ) : (
          <LineChartWidget title="" data={formatOrderTypeTrendData()} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <TableWidget title="Top Selling Products" data={formatTableData.top_selling_products} />
        <TableWidget title="Top Brands" data={formatTableData.top_brands} />
        <TableWidget title="Top Categories" data={formatTableData.top_categories} />
      </div>
    </div>
  );
};

const OrderTab: React.FC<TabProps> = ({ startDate, endDate }) => {
  const dispatch = useAppDispatch();
  const { orderDashboard, loadingOrderTrend, loadingOrderDashboard } = useSelector(
    (state: RootState) => state.manageSalesAnalytic,
  );

  useEffect(() => {
    dispatch(
      salesOrderDashboard({
        from_date: startDate,
        to_date: endDate,
        // limit: 5,
        // period_gap: "day",
      }),
    );

    dispatch(
      salesOrderTrend({
        from_date: startDate,
        to_date: endDate,
        period_gap: "day",
      }),
    );
  }, [dispatch, startDate, endDate]);

  if (loadingOrderDashboard || loadingOrderTrend) {
    return (
      <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  const formatCardData = {
    total_orders: {
      value: orderDashboard?.summary.total_orders,
    },
    total_pre_orders: {
      value: orderDashboard?.summary.total_pre_orders,
    },
    cancellation_rate: {
      value: orderDashboard?.summary.cancellation_rate,
    },
    refund_rate: {
      value: orderDashboard?.summary.refund_rate,
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

  const formatTableData = {
    top_products: orderDashboard?.top_lists.top_products.map((item: any) => ({
      name: item.name,
      amount: item.value,
    })),
    top_categories: orderDashboard?.top_lists.top_categories.map((item: any) => ({
      name: item.name,
      amount: item.value,
    })),
    top_brands: orderDashboard?.top_lists.top_brands.map((item: any) => ({
      name: item.name,
      amount: item.value,
    })),
    latest_orders: orderDashboard?.latest_orders.map((item: any) => ({
      order_id: item.id.slice(0, 8).toUpperCase(),
      customer_name: item.customer_name,
      status: item.status,
      type: item.type,
      // total_amount: convertNumberToCurrency(item.total_amount.toString()),
      order_date: new Date(item.created_at).toLocaleDateString(),
    })),
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <KPIWidget
          title="Total Order"
          data={formatCardData.total_orders}
          icon={<FaBox size={20} />}
          iconColor="text-teal-600"
          iconBg="bg-teal-100"
        />
        <KPIWidget
          title="Total Pre-Order"
          data={formatCardData.total_pre_orders}
          icon={<FaBox size={20} />}
          iconColor="text-yellow-700"
          iconBg="bg-yellow-100"
        />
        <KPIWidget
          title="Cancellation Orders Rate"
          data={formatCardData.cancellation_rate}
          icon={<FaBox size={20} />}
          iconColor="text-red-700"
          iconBg="bg-red-100"
        />
        <KPIWidget
          title="Refund Orders Rate"
          data={formatCardData.refund_rate}
          icon={<FaBox size={20} />}
          iconColor="text-green-700"
          iconBg="bg-green-100"
        />
      </div>

      {/* Chart Section */}
      {/* <div className="flex flex-col gap-4 bg-white shadow rounded-xl p-4">
        <div className="flex justify-between">
          <h3 className="text-gray-700 text-base font-semibold">Revenue Trend</h3>
          <div>
            <Select value={granularity} onValueChange={setGranularity}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select granularity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAY">Daily</SelectItem>
                <SelectItem value="WEEK">Weekly</SelectItem>
                <SelectItem value="MONTH">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <LineChartWidget title="" data={formatTrendData()} />
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <PieChartWidget title="Standard Orders" data={formatPieChartData.orders} />
        <PieChartWidget title="Limited Orders" data={formatPieChartData.pre_orders} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <TableWidget title="Top Products" data={formatTableData.top_products} />
          <TableWidget title="Top Categories" data={formatTableData.top_categories} />
          <TableWidget title="Top Brands" data={formatTableData.top_brands} />
        </div>
        <TableWidget title="Recent Orders" data={formatTableData.latest_orders} />
      </div>
    </div>
  );
};

export default SaleDashboard;
