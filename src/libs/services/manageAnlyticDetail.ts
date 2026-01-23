import api from "../api";
import type { SaleAnalyticDetailParams } from "../types/sale-analytic-detail";

export const manageAnalyticsDetail = {
  getAllRefundedOrders: (params: SaleAnalyticDetailParams) =>
    api.get("/analytics/sales/financials/refunded/orders", { params }),
  getLimitedNetRevenueDetails: (params: SaleAnalyticDetailParams) =>
    api.get("/analytics/sales/financials/revenue/limited-net/orders", { params }),
  getLimitedGrossRevenueDetails: (params: SaleAnalyticDetailParams) =>
    api.get("/analytics/sales/financials/revenue/limited/orders", { params }),
  getStandardProductRevenueDetails: (params: SaleAnalyticDetailParams) =>
    api.get("/analytics/sales/financials/revenue/standard/orders", { params }),
  getTotalRevenueDetails: (params: SaleAnalyticDetailParams) =>
    api.get("/analytics/sales/financials/revenue/total/orders", { params }),
};
