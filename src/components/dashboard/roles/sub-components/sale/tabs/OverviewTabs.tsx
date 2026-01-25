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
} from "@/libs/stores/salesAnalyticManager/thunk";
import { useSelector } from "react-redux";
import { BadgePercent, Banknote, BanknoteArrowDown, Loader2, TrendingUp } from "lucide-react";
import { convertNumberToCurrency } from "@/libs/helper/helper";

interface TabProps {
  startDate?: string;
  endDate?: string;
  periodGap?: "day" | "month" | "year";
  setOpenLimitedProductRevenueGrossModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenLimitedProductRevenueNetModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenStandardProductRevenue: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenTotalRefundModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenTotalRevenueModal: React.Dispatch<React.SetStateAction<boolean>>;
  // setOpenAverageOrderValueModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OverviewTab: React.FC<TabProps> = ({
  startDate,
  endDate,
  periodGap = "day",
  setOpenLimitedProductRevenueGrossModal,
  setOpenLimitedProductRevenueNetModal,
  setOpenStandardProductRevenue,
  setOpenTotalRefundModal,
  setOpenTotalRevenueModal,
  // setOpenAverageOrderValueModal,
}) => {
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
    limited_net_revenue: {
      value: financialsDashboard?.summary.limited_net_revenue,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <div
          className="hover:cursor-pointer"
          onClick={() => {
            setOpenTotalRevenueModal(true);
          }}
        >
          <KPIWidget
            title="Total Revenue"
            data={formatCardData.total_sold_revenue}
            mode="currency"
            icon={<Banknote size={20} />}
            iconColor="text-green-600"
            iconBg="bg-green-100"
            tooltip="Total revenue generated from all product sales including both standard and limited edition products"
          />
        </div>
        <div
          className="hover:cursor-pointer"
          onClick={() => {
            setOpenLimitedProductRevenueGrossModal(true);
          }}
        >
          <KPIWidget
            title="Limited Product Revenue (GROSS)"
            data={formatCardData.limited_revenue}
            mode="currency"
            icon={<Banknote size={20} />}
            iconColor="text-yellow-700"
            iconBg="bg-yellow-100"
            tooltip="Revenue generated specifically from limited edition and exclusive product sales with higher profit margins"
          />
        </div>
        <div
          className="hover:cursor-pointer"
          onClick={() => {
            setOpenStandardProductRevenue(true);
          }}
        >
          <KPIWidget
            title="Standard Product Revenue (NET)"
            data={formatCardData.standard_revenue}
            mode="currency"
            icon={<Banknote size={20} />}
            iconColor="text-blue-700"
            iconBg="bg-blue-100"
            tooltip="Revenue generated from regular product sales representing the core business income stream"
          />
        </div>

        <div
          className="hover:cursor-pointer"
          onClick={() => {
            setOpenTotalRefundModal(true);
          }}
        >
          <KPIWidget
            title="Total Refund"
            data={formatCardData.total_refund}
            mode="currency"
            icon={<BanknoteArrowDown size={20} />}
            iconColor="text-red-700"
            iconBg="bg-red-100"
            tooltip="Total amount refunded to customers due to returns, cancellations, or product issues"
          />
        </div>

        <div
          className="hover:cursor-pointer"
          onClick={() => {
            // setOpenAverageOrderValueModal?.(true);
          }}
        >
          <KPIWidget
            title="Average Order Value"
            data={formatCardData.average_order_value}
            mode="currency"
            icon={<BadgePercent size={20} />}
            iconColor="text-purple-700"
            iconBg="bg-purple-100"
            tooltip="Average monetary value of each customer order, indicating customer spending patterns and purchase behavior"
          />
        </div>

        <div
          className="hover:cursor-pointer"
          onClick={() => {
            setOpenLimitedProductRevenueNetModal(true);
          }}
        >
          <KPIWidget
            title="Limited Product Revenue (NET)"
            data={formatCardData.limited_net_revenue}
            mode="currency"
            icon={<TrendingUp size={20} />}
            iconColor="text-teal-700"
            iconBg="bg-teal-100"
            tooltip="Total amount refunded to customers due to returns, cancellations, or product issues"
          />
        </div>
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
