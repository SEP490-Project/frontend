import React, { useEffect } from "react";
import {
  KPIWidget,
  LineChartWidget,
  PieChartWidget,
  TableWidget,
} from "@/components/dashboard/chart";
import { useAppDispatch, type RootState } from "@/libs/stores";
import {
  salesBrands,
  salesDashboard,
  salesOrders,
  salesProducts,
  salesTrend,
} from "@/libs/stores/salesAnalyticManager/thunk";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { convertNumberToCurrency } from "@/libs/helper/helper";
import { FaBox, FaDollarSign } from "react-icons/fa6";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";

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
    trend,
    brands,
    orders,
    products,
    loadingTrend,
    loadingBrands,
    loadingOrders,
    loadingProducts,
  } = useSelector((state: RootState) => state.manageSalesAnalytic);

  const [granularity, setGranularity] = React.useState("DAY");

  const formatTrendData = () => {
    if (!trend || !Array.isArray(trend)) return [];
    return trend.map((item) => ({
      month: new Date(item.date).toLocaleDateString(),
      value: item.revenue,
    }));
  };

  const formatProductData = () => {
    if (!products || !Array.isArray(products)) return [];
    return products.map((item) => ({
      top: item.rank,
      product_name: item.product_name,
      total_sold: item.units_sold,
      total_revenue: convertNumberToCurrency(item.total_revenue),
    }));
  };

  const formatBrandData = () => {
    if (!brands || !Array.isArray(brands)) return [];
    return brands.map((item) => ({
      top: item.rank,
      brand_name: item.brand_name,
      total_sold: item.units_sold,
      total_revenue: convertNumberToCurrency(item.total_revenue),
    }));
  };

  const formatData = {
    standard_orders: {
      value: orders?.standard_orders.total_revenue || 0,
    },
    limited_orders: {
      value: orders?.limited_orders.total_revenue || 0,
    },
    pre_orders: {
      value: orders?.pre_orders.total_revenue || 0,
    },
    total_revenue: {
      value:
        orders?.standard_orders.total_revenue +
          orders?.limited_orders.total_revenue +
          orders?.pre_orders.total_revenue || 0,
    },
  };

  useEffect(() => {
    dispatch(salesTrend({ granularity: granularity, start_date: startDate, end_date: endDate }));

    dispatch(salesOrders({ start_date: startDate, end_date: endDate }));

    dispatch(salesProducts({ start_date: startDate, end_date: endDate }));

    dispatch(salesBrands({ limit: 3, start_date: startDate, end_date: endDate }));
  }, [dispatch, granularity, startDate, endDate]);

  if (loadingTrend || loadingBrands || loadingOrders || loadingProducts) {
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
          data={formatData.total_revenue}
          icon={<FaDollarSign size={20} />}
          iconColor="text-teal-600"
          iconBg="bg-teal-100"
        />
        <KPIWidget
          title="Total Standard Order Revenue"
          data={formatData.standard_orders}
          icon={<FaDollarSign size={20} />}
          iconColor="text-green-700"
          iconBg="bg-green-100"
        />
        <KPIWidget
          title="Total Limited Order Revenue"
          data={formatData.limited_orders}
          icon={<FaDollarSign size={20} />}
          iconColor="text-yellow-700"
          iconBg="bg-yellow-100"
        />
        <KPIWidget
          title="Total Pre-Orders Revenue"
          data={formatData.pre_orders}
          icon={<FaDollarSign size={20} />}
          iconColor="text-purple-700"
          iconBg="bg-purple-100"
        />
      </div>

      {/* Chart Section */}
      <div className="flex flex-col gap-4 bg-white shadow rounded-xl p-4">
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
        {formatTrendData().length === 0 ? (
          <div className="h-[340px] flex items-center justify-center text-gray-400 italic">
            No data available
          </div>
        ) : (
          <LineChartWidget title="" data={formatTrendData()} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <TableWidget title="Top Selling Products" data={formatProductData()} />
        <TableWidget title="Top Brands" data={formatBrandData()} />
      </div>
    </div>
  );
};

const OrderTab: React.FC<TabProps> = ({ startDate, endDate }) => {
  const dispatch = useAppDispatch();
  const { trend, orders, dashboard, loadingTrend, loadingOrders, loadingDashboard } = useSelector(
    (state: RootState) => state.manageSalesAnalytic,
  );
  const [granularity, setGranularity] = React.useState("DAY");

  useEffect(() => {
    dispatch(salesTrend({ granularity: granularity, start_date: startDate, end_date: endDate }));

    dispatch(salesOrders({ start_date: startDate, end_date: endDate }));

    dispatch(salesProducts({ start_date: startDate, end_date: endDate }));

    dispatch(salesBrands({ limit: 3, start_date: startDate, end_date: endDate }));

    dispatch(salesDashboard({ start_date: startDate, end_date: endDate }));
  }, [dispatch, granularity, startDate, endDate]);

  const formatTrendData = () => {
    if (!trend || !Array.isArray(trend)) return [];
    return trend.map((item) => ({
      month: new Date(item.date).toLocaleDateString(),
      value: item.order_count,
    }));
  };

  const formatRecentOrdersData = () => {
    if (!dashboard?.recent_orders || !Array.isArray(dashboard.recent_orders)) return [];
    return dashboard.recent_orders.map((item: any) => ({
      order_id: item.order_id,
      customer_name: item.customer_name,
      order_type: item.order_type,
      status: item.status,
      total_amount: convertNumberToCurrency(item.total_amount),
    }));
  };

  const formatData = {
    standard_orders: {
      value: orders?.standard_orders.total_count || 0,
    },
    limited_orders: {
      value: orders?.limited_orders.total_count || 0,
    },
    pre_orders: {
      value: orders?.pre_orders.total_count || 0,
    },
    total_active_orders: {
      value:
        orders?.standard_orders.pending_count +
          orders?.limited_orders.pending_count +
          orders?.pre_orders.pending_count || 0,
    },
    total_completed_orders: {
      value:
        orders?.standard_orders.completed_count +
          orders?.limited_orders.completed_count +
          orders?.pre_orders.received_count || 0,
    },
    total_canceled_orders: {
      value:
        orders?.standard_orders.cancelled_count +
          orders?.limited_orders.cancelled_count +
          orders?.pre_orders.cancelled_count || 0,
    },
    total_orders: {
      value:
        orders?.standard_orders.total_count +
          orders?.limited_orders.total_count +
          orders?.pre_orders.total_count || 0,
    },
  };

  const standardOrderType = [
    { type: "Active", value: orders?.standard_orders.pending_count || 0 },
    { type: "Completed", value: orders?.standard_orders.completed_count || 0 },
    { type: "Cancelled", value: orders?.standard_orders.cancelled_count || 0 },
  ];

  const limitedOrderType = [
    {
      type: "Active",
      value: orders?.limited_orders.pending_count + orders?.pre_orders.pending_count || 0,
    },
    {
      type: "Completed",
      value: orders?.limited_orders.completed_count + orders?.pre_orders.received_count || 0,
    },
    {
      type: "Cancelled",
      value: orders?.limited_orders.cancelled_count + orders?.pre_orders.cancelled_count || 0,
    },
  ];

  if (loadingTrend || loadingOrders || loadingDashboard) {
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
          title="Total Order"
          data={formatData.total_orders}
          icon={<FaBox size={20} />}
          iconColor="text-teal-600"
          iconBg="bg-teal-100"
        />
        <KPIWidget
          title="Active Orders"
          data={formatData.total_active_orders}
          icon={<FaBox size={20} />}
          iconColor="text-yellow-700"
          iconBg="bg-yellow-100"
        />
        <KPIWidget
          title="Canceled Orders"
          data={formatData.total_canceled_orders}
          icon={<FaBox size={20} />}
          iconColor="text-red-700"
          iconBg="bg-red-100"
        />
        <KPIWidget
          title="Completed Orders"
          data={formatData.total_completed_orders}
          icon={<FaBox size={20} />}
          iconColor="text-green-700"
          iconBg="bg-green-100"
        />
      </div>

      {/* Chart Section */}
      <div className="flex flex-col gap-4 bg-white shadow rounded-xl p-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <PieChartWidget title="Standard Orders" data={standardOrderType} />
        <PieChartWidget title="Limited Orders" data={limitedOrderType} />
      </div>
      <div>
        <TableWidget title="Recent Orders" data={formatRecentOrdersData()} />
      </div>
    </div>
  );
};

export default SaleDashboard;
