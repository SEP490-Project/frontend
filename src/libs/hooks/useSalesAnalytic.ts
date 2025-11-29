import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useSalesAnalytic = () => {
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
  } = useSelector((state: RootState) => state.manageSalesAnalytic);
  return {
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
  };
};
