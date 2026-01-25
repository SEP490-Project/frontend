import api from "../api";
import type { TransactionParams } from "../types/transaction";

const manageTransaction = {
  getTransactions: (params: TransactionParams) => api.get("/payments", { params }),
  getOrderTransactionsForSaleStaff: (params: TransactionParams) =>
    api.get("/payments", { params: { ...params, sort_order: "desc" } }),
  getTransactionById: (transactionId: string) => api.get(`/payments/id/${transactionId}`),
  getTransactionByOrderCode: (orderCode: string) => api.get(`/payments/order/${orderCode}`),
};

export default manageTransaction;
