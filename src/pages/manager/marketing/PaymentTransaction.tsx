import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaFilter, FaEye } from "react-icons/fa6";
import { useAppDispatch } from "@/libs/stores";
import {
  getOrderTransactionsForSaleStaffThunk,
  getTransactionDetailsThunk,
} from "@/libs/stores/transactionManager/thunk";
import { useSelector } from "react-redux";
import type { TransactionData, TransactionParams } from "@/libs/types/transaction";
import { PaginationTable } from "@/components/global";
import TransactionDetails from "@/pages/manager/brand/TransactionDetails";
import { format } from "date-fns";
import { getItem } from "@/libs/local-storage";
import { Loader2 } from "lucide-react";

const PaymentTransactionPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const transactionResponse = useSelector((state: any) => state?.manageTransaction?.transactions);
  const pagination = useSelector(
    (state: any) => state?.manageTransaction?.transactions?.pagination,
  );
  const transactions: TransactionData[] = transactionResponse?.data || [];
  const isLoading = useSelector((state: any) => state?.manageTransaction?.loading);
  const error = useSelector((state: any) => state?.manageTransaction?.errors);
  const transactionDetails = useSelector(
    (state: any) => state?.manageTransaction?.transactionDetails,
  );
  const detailsLoading = useSelector((state: any) => state?.manageTransaction?.detailsLoading);

  const user = getItem<{
    id: string;
  }>("user");

  const [params, setParams] = useState<TransactionParams>({
    page: 1,
    limit: 5,
    reference_types: "CONTRACT_PAYMENT,CONTRACT_VIOLATION,KOL_VIOLATION_REFUNDING",
    payer_id: user?.id,
  });

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    dispatch(getOrderTransactionsForSaleStaffThunk(params));
  }, [dispatch, params]);

  const handleViewDetails = (transactionId: string) => {
    dispatch(getTransactionDetailsThunk(transactionId));
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      COMPLETED: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
      EXPIRED: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
      REFUNDED: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    };

    return <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>;
  };

  const getMethodBadge = (method: string) => {
    const methodColors: Record<string, string> = {
      BANK_TRANSFER: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
      CREDIT_CARD: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
      E_WALLET: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
      PAYOS: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200",
    };

    return (
      <Badge className={methodColors[method] || "bg-gray-100 text-gray-800"}>
        {method?.replace(/_/g, " ")}
      </Badge>
    );
  };

  // Get amount with color
  // Inverse the amount negativity for brand side
  const getAmount = (transaction: TransactionData, amount: string | number) => {
    if (typeof amount === "string") {
      amount = parseFloat(amount);
    }
    if (
      (user?.id === transaction?.received_by_id && amount < 0) ||
      (user?.id === transaction?.payer_id && amount > 0)
    ) {
      amount = -amount;
    }

    return (
      <span className={amount >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
        {formatCurrency(amount.toString())}
      </span>
    );
  };

  const getTypeBadge = (isDeposit?: boolean) => {
    const deposit = !!isDeposit;
    return (
      <Badge
        className={
          deposit
            ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
            : "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200"
        }
      >
        {deposit ? "Deposit" : "Payment"}
      </Badge>
    );
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  const filterVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <motion.div
        className="flex justify-between items-center mb-6"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <motion.h1 className="text-xl sm:text-2xl font-semibold" variants={itemVariants}>
            Payment Transactions
          </motion.h1>
          <motion.p className="text-gray-600 mt-1" variants={itemVariants}>
            Manage and track payment transactions for brands
          </motion.p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-white rounded-lg shadow mb-4 p-4"
        variants={filterVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by reference ID..."
              value={params.reference_id || ""}
              onChange={(e) => setParams({ ...params, reference_id: e.target.value, page: 1 })}
              className="w-full"
            />
          </div>

          <div className="min-w-[150px]">
            <Select
              value={params.status || " "}
              onValueChange={(value) => {
                setParams({
                  ...params,
                  status: value === " " ? undefined : (value as any),
                  page: 1,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Status</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[150px]">
            <Select
              value={params.method || " "}
              onValueChange={(value) => {
                setParams({
                  ...params,
                  method: value === " " ? undefined : (value as any),
                  page: 1,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Methods</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                <SelectItem value="E_WALLET">E-Wallet</SelectItem>
                <SelectItem value="PAYOS">PayOS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden shadow">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="px-4">
              <TableRow className="border-b bg-gray-50">
                <TableHead className="font-semibold">Transaction ID</TableHead>
                <TableHead className="font-semibold">Reference ID</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Method</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Loading transactions...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-red-600">
                    Error: {error?.message || "Failed to load transactions"}
                  </TableCell>
                </TableRow>
              ) : !transactions || transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`border-b hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <TableCell className="py-4 font-mono text-sm">
                      {transaction.id.slice(0, 8)}...
                    </TableCell>

                    <TableCell className="py-4 font-mono text-sm">
                      <p className="text-sm font-semibold">{transaction.reference_type}</p>
                      {transaction.reference_id}
                    </TableCell>

                    <TableCell className="py-4">
                      {getAmount(transaction, transaction.amount)}
                    </TableCell>

                    <TableCell className="py-4">{getMethodBadge(transaction.method)}</TableCell>

                    <TableCell className="py-4">
                      {getTypeBadge(transaction.reference_info?.is_deposit)}
                    </TableCell>

                    <TableCell className="py-4">{getStatusBadge(transaction.status)}</TableCell>

                    <TableCell className="py-4">
                      {formatDate(transaction.transaction_date)}
                    </TableCell>

                    <TableCell className="py-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-100"
                        title="View Details"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(transaction.id);
                        }}
                      >
                        <FaEye className="text-blue-600" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
          {pagination && (
            <PaginationTable
              page={pagination.page}
              totalItems={pagination.total}
              pageSize={pagination.limit}
              onPageChange={(page) => setParams({ ...params, page })}
            />
          )}
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2">Loading transactions...</span>
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No transactions found</div>
          ) : (
            transactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                className="bg-white border rounded-lg p-4 space-y-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewDetails(transaction.id)}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.28 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500">Transaction ID</p>
                    <p className="font-mono text-sm">{transaction.id.slice(0, 8)}...</p>
                  </div>
                  {getStatusBadge(transaction.status)}
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-semibold text-primary">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Method</p>
                    {getMethodBadge(transaction.method)}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    {getTypeBadge(transaction.reference_info?.is_deposit)}
                  </div>
                  <div></div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Reference ID</p>
                  <p className="font-mono text-sm">{transaction.reference_id}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    {formatDate(transaction.transaction_date)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(transaction.id);
                    }}
                  >
                    <FaEye className="mr-2" />
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Transaction Details Dialog */}
      <TransactionDetails
        transaction={transactionDetails}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        loading={detailsLoading}
      />
    </div>
  );
};

export default PaymentTransactionPage;
