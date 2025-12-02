import React, { useEffect, useState } from "react";
import {
  KPIWidget,
  LineChartWidget,
  PieChartWidget,
  TableWidget,
  BarChartWidget,
} from "@/components/dashboard/chart";
import { useAppDispatch } from "@/libs/stores";
import {
  salesBrands,
  salesOrders,
  salesProducts,
  salesTrend,
  salesRevenue,
  salesPayment,
  salesPreOrder,
} from "@/libs/stores/salesAnalyticManager/thunk";
import {
  FaBox,
  FaDollarSign,
  FaMoneyBillWave,
  FaTriangleExclamation,
  FaCartShopping,
} from "react-icons/fa6";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import DatePicker from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSalesAnalytic } from "@/libs/hooks/useSalesAnalytic";

type Granularity = "DAY" | "WEEK" | "MONTH";
type ProductType = "STANDARD" | "LIMITED";

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
        (typeof item.total_revenue === "number" && item.total_revenue === 0),
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

const SaleDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    loadingTrend,
    loadingBrands,
    loadingOrders,
    loadingProducts,
    loadingRevenue,
    loadingPayments,
    loadingPreOrders,
    trend,
    brands,
    orders,
    products,
    revenue,
    payments,
    preOrders,
  } = useSalesAnalytic();

  const [filter, setFilter] = useState({
    start_date: "",
    end_date: "",
    granularity: "MONTH" as Granularity,
    product_type: "ALL" as ProductType | "ALL",
  });

  const isAnyLoading =
    loadingTrend ||
    loadingBrands ||
    loadingOrders ||
    loadingProducts ||
    loadingRevenue ||
    loadingPayments ||
    loadingPreOrders;

  const formatTrendData = () => {
    if (!trend || !Array.isArray(trend)) return [];
    return trend.map((item) => ({
      month: new Date(item.date).toLocaleDateString("default", {
        month: "short",
        day: "numeric",
      }),
      value: item.revenue,
    }));
  };

  const formatOrderTrendData = () => {
    if (!trend || !Array.isArray(trend)) return [];
    return trend.map((item) => ({
      month: new Date(item.date).toLocaleDateString("default", {
        month: "short",
        day: "numeric",
      }),
      value: item.order_count,
    }));
  };

  const formatProductData = () => {
    if (!products || !Array.isArray(products)) return [];
    return products.map((item) => ({
      rank: item.rank,
      product_name: item.product_name,
      brand_name: item.brand_name,
      product_type: item.product_type,
      units_sold: item.units_sold,
      total_revenue: formatCurrency(item.total_revenue),
    }));
  };

  const formatBrandData = () => {
    if (!brands || !Array.isArray(brands)) return [];
    return brands.map((item) => ({
      rank: item.rank,
      brand_name: item.brand_name,
      order_count: item.order_count,
      product_count: item.product_count,
      total_revenue: formatCurrency(item.total_revenue),
    }));
  };

  const revenueBreakdownData = React.useMemo(() => {
    if (!revenue) return [];
    const data = [
      { name: "Standard Products", value: Math.round(revenue.standard_product_revenue || 0) },
      { name: "Limited Products", value: Math.round(revenue.limited_product_revenue || 0) },
      { name: "Advertising", value: Math.round(revenue.advertising_revenue || 0) },
      { name: "Affiliate", value: Math.round(revenue.affiliate_revenue || 0) },
      { name: "Ambassador", value: Math.round(revenue.ambassador_revenue || 0) },
      { name: "Co-Producing", value: Math.round(revenue.co_producing_revenue || 0) },
    ];
    return data.filter((item) => item.value > 0);
  }, [revenue]);

  const orderStatusData = React.useMemo(() => {
    if (!orders) return [];
    return [
      {
        type: "Completed",
        value:
          (orders.standard_orders?.completed_count || 0) +
          (orders.limited_orders?.completed_count || 0) +
          (orders.pre_orders?.received_count || 0),
      },
      {
        type: "Pending",
        value:
          (orders.standard_orders?.pending_count || 0) +
          (orders.limited_orders?.pending_count || 0) +
          (orders.pre_orders?.pending_count || 0),
      },
      {
        type: "Cancelled",
        value:
          (orders.standard_orders?.cancelled_count || 0) +
          (orders.limited_orders?.cancelled_count || 0) +
          (orders.pre_orders?.cancelled_count || 0),
      },
    ].filter((item) => item.value > 0);
  }, [orders]);

  useEffect(() => {
    const { start_date, end_date, granularity } = filter;
    const payload: any = {};
    if (start_date) payload.start_date = start_date;
    if (end_date) payload.end_date = end_date;
    if (granularity) payload.granularity = granularity;

    dispatch(salesTrend(payload));
    dispatch(salesRevenue(payload));
    dispatch(salesOrders(payload));
    dispatch(salesPayment(payload));
    dispatch(salesPreOrder(payload));
  }, [dispatch, filter]);

  useEffect(() => {
    const { start_date, end_date, product_type } = filter;
    const payload: any = { limit: 10 };
    if (start_date) payload.start_date = start_date;
    if (end_date) payload.end_date = end_date;
    if (product_type && product_type !== "ALL") payload.product_type = product_type;

    dispatch(salesProducts(payload));
  }, [dispatch, filter]);

  useEffect(() => {
    const { start_date, end_date } = filter;
    const payload: any = { limit: 10 };
    if (start_date) payload.start_date = start_date;
    if (end_date) payload.end_date = end_date;

    dispatch(salesBrands(payload));
  }, [dispatch, filter]);

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

      <h1 className="text-xl sm:text-2xl font-semibold">Sales Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIWidget
          title="Total Revenue"
          data={{
            value: revenue?.total_revenue || 0,
            status: "up",
            statusText: "Total",
          }}
          icon={<FaMoneyBillWave size={20} />}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-100"
        />
        <KPIWidget
          title="Total Orders"
          data={{
            value:
              (orders?.standard_orders?.total_count || 0) +
              (orders?.limited_orders?.total_count || 0) +
              (orders?.pre_orders?.total_count || 0),
            statusText: `${(orders?.standard_orders?.pending_count || 0) + (orders?.limited_orders?.pending_count || 0) + (orders?.pre_orders?.pending_count || 0)} pending`,
          }}
          icon={<FaCartShopping size={20} />}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <KPIWidget
          title="Standard Products"
          data={{
            value: revenue?.standard_product_revenue || 0,
            statusText: `${orders?.standard_orders?.total_count || 0} orders`,
          }}
          icon={<FaBox size={20} />}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <KPIWidget
          title="Limited Products"
          data={{
            value: revenue?.limited_product_revenue || 0,
            statusText: `${orders?.limited_orders?.total_count || 0} orders`,
          }}
          icon={<FaBox size={20} />}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Revenue Trend</h2>
            <div className="flex gap-2 items-center flex-wrap">
              <DatePicker
                value={formatDateInput(filter.start_date)}
                onChange={(value) =>
                  setFilter((prev) => ({
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
                value={formatDateInput(filter.end_date)}
                onChange={(value) =>
                  setFilter((prev) => ({
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
                value={filter.granularity}
                onValueChange={(value: Granularity) =>
                  setFilter((prev) => ({ ...prev, granularity: value }))
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
                  setFilter({
                    start_date: "",
                    end_date: "",
                    granularity: "MONTH",
                    product_type: "ALL",
                  })
                }
                className="h-8 text-xs"
              >
                Reset
              </Button>
            </div>
          </div>
          {isEmptyData(formatTrendData()) ? (
            <NoDataMessage message="No revenue data available for the selected time period" />
          ) : (
            <LineChartWidget title="" data={formatTrendData()} />
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Revenue Breakdown</h2>
            {isEmptyData(revenueBreakdownData) ? (
              <NoDataMessage message="No revenue breakdown data available" />
            ) : (
              <BarChartWidget title="" data={revenueBreakdownData} />
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Order Status Distribution</h2>
            {isEmptyData(orderStatusData) ? (
              <NoDataMessage message="No order status data available" />
            ) : (
              <PieChartWidget title="" data={orderStatusData} />
            )}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Product Performance</h2>
            <Select
              value={filter.product_type}
              onValueChange={(value: ProductType | "ALL") =>
                setFilter((prev) => ({ ...prev, product_type: value }))
              }
            >
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Products</SelectItem>
                <SelectItem value="STANDARD">Standard</SelectItem>
                <SelectItem value="LIMITED">Limited</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isEmptyData(formatProductData()) ? (
            <NoDataMessage message="No product performance data available" />
          ) : (
            <TableWidget title="" data={formatProductData()} />
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Brand Performance</h2>
            {isEmptyData(formatBrandData()) ? (
              <NoDataMessage message="No brand performance data available" />
            ) : (
              <TableWidget title="" data={formatBrandData()} />
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Order Trends</h2>
            {isEmptyData(formatOrderTrendData()) ? (
              <NoDataMessage message="No order trend data available" />
            ) : (
              <LineChartWidget title="" data={formatOrderTrendData()} />
            )}
          </div>
        </Card>
      </div>

      {payments && (
        <Card className="p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Payment Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPIWidget
                title="Total Payments"
                data={{
                  value: payments.total_payments || 0,
                  statusText: `${payments.paid_payments || 0} paid`,
                }}
                icon={<FaMoneyBillWave size={20} />}
                iconColor="text-blue-600"
                iconBg="bg-blue-100"
              />
              <KPIWidget
                title="Paid Amount"
                data={{
                  value: payments.paid_amount || 0,
                }}
                icon={<FaDollarSign size={20} />}
                iconColor="text-green-600"
                iconBg="bg-green-100"
              />
              <KPIWidget
                title="Pending Amount"
                data={{
                  value: payments.pending_amount || 0,
                  statusText: `${payments.pending_payments || 0} pending`,
                }}
                icon={<FaDollarSign size={20} />}
                iconColor="text-yellow-600"
                iconBg="bg-yellow-100"
              />
              <KPIWidget
                title="Overdue Amount"
                data={{
                  value: payments.overdue_amount || 0,
                  statusText: `${payments.overdue_payments || 0} overdue`,
                }}
                icon={<FaDollarSign size={20} />}
                iconColor="text-red-600"
                iconBg="bg-red-100"
              />
            </div>
          </div>
        </Card>
      )}

      {preOrders && (
        <Card className="p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Pre-Orders Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPIWidget
                title="Total Pre-Orders"
                data={{
                  value: preOrders.total_count || 0,
                  statusText: `${preOrders.pending_count || 0} pending`,
                }}
                icon={<FaCartShopping size={20} />}
                iconColor="text-purple-600"
                iconBg="bg-purple-100"
              />
              <KPIWidget
                title="Pre-Order Revenue"
                data={{
                  value: preOrders.total_revenue || 0,
                }}
                icon={<FaDollarSign size={20} />}
                iconColor="text-indigo-600"
                iconBg="bg-indigo-100"
              />
              <KPIWidget
                title="Received Orders"
                data={{
                  value: preOrders.received_count || 0,
                }}
                icon={<FaBox size={20} />}
                iconColor="text-green-600"
                iconBg="bg-green-100"
              />
              <KPIWidget
                title="Cancelled Orders"
                data={{
                  value: preOrders.cancelled_count || 0,
                }}
                icon={<FaBox size={20} />}
                iconColor="text-red-600"
                iconBg="bg-red-100"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SaleDashboard;
