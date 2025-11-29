import React, { useEffect, useState } from "react";
import {
  KPIWidget,
  LineChartWidget,
  BarChartWidget,
  PieChartWidget,
  TableWidget,
} from "@/components/dashboard/chart";
import { FaBoxOpen, FaMoneyBillWave, FaFileInvoiceDollar, FaCartShopping } from "react-icons/fa6";
import { useAppDispatch } from "@/libs/stores";
import {
  salesBrands,
  salesOrders,
  salesPayment,
  salesPreOrder,
  salesProducts,
  salesRevenue,
  salesTrend,
} from "@/libs/stores/salesAnalyticManager/thunk";
import { useSalesAnalytic } from "@/libs/hooks/useSalesAnalytic";
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

const SaleDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    loadingBrands,
    loadingOrders,
    loadingPayments,
    loadingPreOrders,
    loadingProducts,
    loadingRevenue,
    loadingTrend,
    brands,
    orders,
    payments,
    preOrders,
    products,
    revenue,
    trend,
  } = useSalesAnalytic();

  const [currentDate] = useState(() => {
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    return {
      now: now.toISOString(),
      sixMonthsAgo: sixMonthsAgo.toISOString(),
    };
  });

  // Revenue & PreOrder filter (shared date range)
  const [generalFilter, setGeneralFilter] = useState({
    start_date: currentDate.sixMonthsAgo,
    end_date: currentDate.now,
  });

  // Sales Trend filter
  const [trendFilter, setTrendFilter] = useState({
    start_date: currentDate.sixMonthsAgo,
    end_date: currentDate.now,
    granularity: "MONTH" as "DAY" | "WEEK" | "MONTH",
  });

  // Brands filter
  const [brandsFilter, setBrandsFilter] = useState({
    start_date: currentDate.sixMonthsAgo,
    end_date: currentDate.now,
    limit: 10,
  });

  // Products filter
  const [productsFilter, setProductsFilter] = useState({
    start_date: currentDate.sixMonthsAgo,
    end_date: currentDate.now,
    limit: 10,
    product_type: "ALL" as "ALL" | "STANDARD" | "LIMITED",
  });

  // Orders filter
  const [ordersFilter, setOrdersFilter] = useState({
    start_date: currentDate.sixMonthsAgo,
    end_date: currentDate.now,
    order_type: "ALL" as "ALL" | "STANDARD" | "LIMITED",
  });

  // Payments filter
  const [paymentsFilter, setPaymentsFilter] = useState({
    start_date: currentDate.sixMonthsAgo,
    end_date: currentDate.now,
    contract_id: "",
  });

  const fetchRevenue = () => {
    const filter = {
      start_date: generalFilter.start_date,
      end_date: generalFilter.end_date,
    };
    dispatch(salesRevenue(filter));
  };

  const fetchPreOrders = () => {
    const filter = {
      start_date: generalFilter.start_date,
      end_date: generalFilter.end_date,
    };
    dispatch(salesPreOrder(filter));
  };

  const fetchTrend = () => {
    const filter = {
      start_date: trendFilter.start_date,
      end_date: trendFilter.end_date,
      granularity: trendFilter.granularity,
    };
    dispatch(salesTrend(filter));
  };

  const fetchBrands = () => {
    const filter = {
      start_date: brandsFilter.start_date,
      end_date: brandsFilter.end_date,
      limit: brandsFilter.limit,
    };
    dispatch(salesBrands(filter));
  };

  const fetchProducts = () => {
    const filter: any = {
      start_date: productsFilter.start_date,
      end_date: productsFilter.end_date,
      limit: productsFilter.limit,
    };
    if (productsFilter.product_type && productsFilter.product_type !== "ALL") {
      filter.product_type = productsFilter.product_type;
    }
    dispatch(salesProducts(filter));
  };

  const fetchOrders = () => {
    const filter: any = {
      start_date: ordersFilter.start_date,
      end_date: ordersFilter.end_date,
    };
    if (ordersFilter.order_type && ordersFilter.order_type !== "ALL") {
      filter.order_type = ordersFilter.order_type;
    }
    dispatch(salesOrders(filter));
  };

  const fetchPayments = () => {
    const filter: any = {
      start_date: paymentsFilter.start_date,
      end_date: paymentsFilter.end_date,
    };
    if (paymentsFilter.contract_id) {
      filter.contract_id = paymentsFilter.contract_id;
    }
    dispatch(salesPayment(filter));
  };

  useEffect(() => {
    fetchRevenue();
    fetchPreOrders();
  }, [generalFilter]);

  useEffect(() => {
    fetchTrend();
  }, [trendFilter]);

  useEffect(() => {
    fetchBrands();
  }, [brandsFilter]);

  useEffect(() => {
    fetchProducts();
  }, [productsFilter]);

  useEffect(() => {
    fetchOrders();
  }, [ordersFilter]);

  useEffect(() => {
    fetchPayments();
  }, [paymentsFilter]);

  // Data transformations
  const totalOrdersData = {
    value:
      (orders?.standard_orders?.total_count || 0) +
      (orders?.limited_orders?.total_count || 0) +
      (orders?.pre_orders?.total_count || 0),
    status: "up" as const,
    statusText: `${orders?.standard_orders?.completed_count || 0} completed`,
  };

  const totalRevenueData = {
    value: revenue?.total_revenue || 0,
    status: "up" as const,
    statusText: "Total",
  };

  const paymentsKPIData = {
    value: payments?.total_payments || 0,
    statusText: `${payments?.paid_payments || 0} paid`,
  };

  const preOrdersKPIData = {
    value: preOrders?.total_count || 0,
    statusText: `${preOrders?.received_count || 0} received`,
  };

  const revenueTrendData = Array.isArray(trend)
    ? trend.map((t: any) => ({
        month: new Date(t.date).toLocaleDateString("default", { month: "short", day: "numeric" }),
        value: t.revenue,
      }))
    : [];

  const topBrandsData = Array.isArray(brands)
    ? brands
        .filter((b: any) => b.total_revenue > 0)
        .map((b: any) => ({
          name: b.brand_name,
          value: b.total_revenue,
        }))
    : [];

  const topProductsData = Array.isArray(products)
    ? products.map((p: any) => ({
        name: p.product_name,
        brand: p.brand_name,
        type: p.product_type,
        revenue: new Intl.NumberFormat("vi-VN").format(p.total_revenue),
        "units sold": p.units_sold,
      }))
    : [];

  const revenueBreakdownData = revenue
    ? [
        { name: "Standard Product", value: Math.round(revenue.standard_product_revenue) },
        { name: "Limited Product", value: Math.round(revenue.limited_product_revenue) },
        { name: "Advertising", value: Math.round(revenue.advertising_revenue) },
        { name: "Affiliate", value: Math.round(revenue.affiliate_revenue) },
        { name: "Ambassador", value: Math.round(revenue.ambassador_revenue) },
        { name: "Co-Producing", value: Math.round(revenue.co_producing_revenue) },
      ].filter((item) => item.value > 0)
    : [];

  const revenueShareData =
    revenue && revenue.total_revenue > 0
      ? [
          {
            type: "Product Revenue",
            value: parseFloat(
              (
                ((revenue.standard_product_revenue + revenue.limited_product_revenue) /
                  revenue.total_revenue) *
                100
              ).toFixed(1),
            ),
          },
          {
            type: "Contract Revenue",
            value: parseFloat(
              (
                ((revenue.advertising_revenue +
                  revenue.affiliate_revenue +
                  revenue.ambassador_revenue +
                  revenue.co_producing_revenue) /
                  revenue.total_revenue) *
                100
              ).toFixed(1),
            ),
          },
        ].filter((item) => item.value > 0)
      : [];

  const ordersTableData = orders
    ? [
        {
          type: "Standard Orders",
          total: orders.standard_orders?.total_count || 0,
          completed: orders.standard_orders?.completed_count || 0,
          pending: orders.standard_orders?.pending_count || 0,
          cancelled: orders.standard_orders?.cancelled_count || 0,
          revenue: new Intl.NumberFormat("vi-VN").format(
            orders.standard_orders?.total_revenue || 0,
          ),
        },
        {
          type: "Limited Orders",
          total: orders.limited_orders?.total_count || 0,
          completed: orders.limited_orders?.completed_count || 0,
          pending: orders.limited_orders?.pending_count || 0,
          cancelled: orders.limited_orders?.cancelled_count || 0,
          revenue: new Intl.NumberFormat("vi-VN").format(orders.limited_orders?.total_revenue || 0),
        },
        {
          type: "Pre Orders",
          total: orders.pre_orders?.total_count || 0,
          completed: orders.pre_orders?.received_count || 0,
          pending: orders.pre_orders?.pending_count || 0,
          cancelled: orders.pre_orders?.cancelled_count || 0,
          revenue: new Intl.NumberFormat("vi-VN").format(orders.pre_orders?.total_revenue || 0),
        },
      ]
    : [];

  const paymentsTableData = payments
    ? [
        { status: "Total Payments", count: payments.total_payments, amount: payments.total_amount },
        { status: "Paid", count: payments.paid_payments, amount: payments.paid_amount },
        { status: "Pending", count: payments.pending_payments, amount: payments.pending_amount },
        { status: "Overdue", count: payments.overdue_payments, amount: payments.overdue_amount },
      ].map((item) => ({
        status: item.status,
        count: item.count,
        amount: new Intl.NumberFormat("vi-VN").format(item.amount),
      }))
    : [];

  return (
    <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Sales Staff Dashboard</h1>

      {/* Global Date Filter */}
      <Card className="p-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h3 className="text-lg font-semibold">General Filters</h3>
          <div className="flex gap-2 flex-wrap">
            <Input
              type="date"
              value={generalFilter.start_date.split("T")[0]}
              onChange={(e) =>
                setGeneralFilter({
                  ...generalFilter,
                  start_date: new Date(e.target.value).toISOString(),
                })
              }
              className="w-40"
            />
            <Input
              type="date"
              value={generalFilter.end_date.split("T")[0]}
              onChange={(e) =>
                setGeneralFilter({
                  ...generalFilter,
                  end_date: new Date(e.target.value).toISOString(),
                })
              }
              className="w-40"
            />
          </div>
        </div>
      </Card>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          {loadingOrders && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <KPIWidget
            title="Total Orders"
            data={totalOrdersData}
            icon={<FaBoxOpen size={20} />}
            iconColor="text-teal-600"
            iconBg="bg-teal-100"
          />
        </div>
        <div className="relative">
          {loadingRevenue && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <KPIWidget
            title="Total Revenue"
            data={totalRevenueData}
            icon={<FaMoneyBillWave size={20} />}
            iconColor="text-green-700"
            iconBg="bg-green-100"
          />
        </div>
        <div className="relative">
          {loadingPayments && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <KPIWidget
            title="Payments"
            data={paymentsKPIData}
            icon={<FaFileInvoiceDollar size={20} />}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
        </div>
        <div className="relative">
          {loadingPreOrders && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <KPIWidget
            title="Pre-Orders"
            data={preOrdersKPIData}
            icon={<FaCartShopping size={20} />}
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
          />
        </div>
      </div>

      {/* Sales Trend */}
      <Card className="p-4 relative">
        {loadingTrend && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-lg font-semibold">Sales Trend</h3>
            <div className="flex gap-2 flex-wrap">
              <Input
                type="date"
                value={trendFilter.start_date.split("T")[0]}
                onChange={(e) =>
                  setTrendFilter({
                    ...trendFilter,
                    start_date: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-40"
              />
              <Input
                type="date"
                value={trendFilter.end_date.split("T")[0]}
                onChange={(e) =>
                  setTrendFilter({
                    ...trendFilter,
                    end_date: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-40"
              />
              <Select
                value={trendFilter.granularity}
                onValueChange={(value: any) =>
                  setTrendFilter({ ...trendFilter, granularity: value })
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

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 relative">
          {loadingRevenue && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Revenue Breakdown</h3>
            <BarChartWidget title="" data={revenueBreakdownData} />
          </div>
        </Card>

        <Card className="p-4 relative">
          {loadingRevenue && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Revenue Distribution</h3>
            <PieChartWidget title="" data={revenueShareData} />
          </div>
        </Card>
      </div>

      {/* Top Brands */}
      <Card className="p-4 relative">
        {loadingBrands && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-lg font-semibold">Top Brands</h3>
            <div className="flex gap-2 flex-wrap">
              <Input
                type="date"
                value={brandsFilter.start_date.split("T")[0]}
                onChange={(e) =>
                  setBrandsFilter({
                    ...brandsFilter,
                    start_date: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-40"
              />
              <Input
                type="date"
                value={brandsFilter.end_date.split("T")[0]}
                onChange={(e) =>
                  setBrandsFilter({
                    ...brandsFilter,
                    end_date: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-40"
              />
              <Input
                type="number"
                value={brandsFilter.limit}
                onChange={(e) =>
                  setBrandsFilter({ ...brandsFilter, limit: parseInt(e.target.value) || 10 })
                }
                className="w-24"
                min={1}
                max={50}
                placeholder="Limit"
              />
            </div>
          </div>
          <BarChartWidget title="" data={topBrandsData} />
        </div>
      </Card>

      {/* Top Products */}
      <Card className="p-4 relative">
        {loadingProducts && (
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
                value={productsFilter.start_date.split("T")[0]}
                onChange={(e) =>
                  setProductsFilter({
                    ...productsFilter,
                    start_date: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-40"
              />
              <Input
                type="date"
                value={productsFilter.end_date.split("T")[0]}
                onChange={(e) =>
                  setProductsFilter({
                    ...productsFilter,
                    end_date: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-40"
              />
              <Select
                value={productsFilter.product_type}
                onValueChange={(value: any) =>
                  setProductsFilter({ ...productsFilter, product_type: value })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="LIMITED">Limited</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={productsFilter.limit}
                onChange={(e) =>
                  setProductsFilter({ ...productsFilter, limit: parseInt(e.target.value) || 10 })
                }
                className="w-24"
                min={1}
                max={50}
                placeholder="Limit"
              />
            </div>
          </div>
          <TableWidget title="" data={topProductsData} />
        </div>
      </Card>

      {/* Orders and Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 relative">
          {loadingOrders && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="text-lg font-semibold">Orders Overview</h3>
              <div className="flex gap-2 flex-wrap">
                <Input
                  type="date"
                  value={ordersFilter.start_date.split("T")[0]}
                  onChange={(e) =>
                    setOrdersFilter({
                      ...ordersFilter,
                      start_date: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="w-40"
                />
                <Input
                  type="date"
                  value={ordersFilter.end_date.split("T")[0]}
                  onChange={(e) =>
                    setOrdersFilter({
                      ...ordersFilter,
                      end_date: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="w-40"
                />
                <Select
                  value={ordersFilter.order_type}
                  onValueChange={(value: any) =>
                    setOrdersFilter({ ...ordersFilter, order_type: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="LIMITED">Limited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <TableWidget title="" data={ordersTableData} />
          </div>
        </Card>

        <Card className="p-4 relative">
          {loadingPayments && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="text-lg font-semibold">Payments Overview</h3>
              <div className="flex gap-2 flex-wrap">
                <Input
                  type="date"
                  value={paymentsFilter.start_date.split("T")[0]}
                  onChange={(e) =>
                    setPaymentsFilter({
                      ...paymentsFilter,
                      start_date: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="w-40"
                />
                <Input
                  type="date"
                  value={paymentsFilter.end_date.split("T")[0]}
                  onChange={(e) =>
                    setPaymentsFilter({
                      ...paymentsFilter,
                      end_date: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="w-40"
                />
                <Input
                  type="text"
                  value={paymentsFilter.contract_id}
                  onChange={(e) =>
                    setPaymentsFilter({ ...paymentsFilter, contract_id: e.target.value })
                  }
                  className="w-48"
                  placeholder="Contract ID (optional)"
                />
              </div>
            </div>
            <TableWidget title="" data={paymentsTableData} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SaleDashboard;
