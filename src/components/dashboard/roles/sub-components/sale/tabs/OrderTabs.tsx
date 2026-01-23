import React, { useEffect } from "react";
import {
  KPIWidget,
  LineChartWidget,
  PieChartWidget,
  TableWidget,
} from "@/components/dashboard/chart";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { salesOrderDashboard, salesOrderTrend } from "@/libs/stores/salesAnalyticManager/thunk";
import { useSelector } from "react-redux";
import { FaBox } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { convertNumberToCurrency } from "@/libs/helper/helper";

interface TabProps {
  startDate?: string;
  endDate?: string;
  periodGap?: "day" | "month" | "year";
}

export const OrderTab: React.FC<TabProps> = ({ startDate, endDate, periodGap = "day" }) => {
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
