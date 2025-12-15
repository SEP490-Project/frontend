import React, { useEffect, useState, useMemo, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaEye, FaListCheck, FaImage } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PaginationTable from "@/components/global/PaginationTable";
import DataSelector from "@/components/global/DataSelector";
import { useContractPayment } from "@/libs/hooks/useContractPayment";
import { useBrand } from "@/libs/hooks/useBrand";
import { useAppDispatch } from "@/libs/stores";
import {
  getContractPaymentBrand,
  createPaymentLink,
} from "@/libs/stores/contractPaymentManager/thunk";
import { brand as fetchBrands } from "@/libs/stores/brandManager/thunk";
import type { ContractPayment } from "@/libs/types/contract-payments";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { DatePicker } from "@/components/date-picker";
import { formatDate } from "@/libs/helper/helper";
import { motion } from "framer-motion";
import { PaymentDetailModal, PaymentModal } from "@/components/manage/marketing/contract-payment";
import { toast } from "sonner";

const PAGE_SIZE = 5;

const CONTRACT_PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  OVERDUE: "Overdue",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BANK_TRANSFER: "Bank Transfer",
  CASH: "Cash",
  CHECK: "Check",
};

const STATUS_COLORS: Record<string, string> = {
  PAID: "bg-green-100 text-green-800 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  OVERDUE: "bg-orange-100 text-orange-800 border-orange-200",
};

const PAYMENT_METHOD_COLORS: Record<string, string> = {
  BANK_TRANSFER: "bg-blue-100 text-blue-800 border-blue-200",
  CASH: "bg-green-100 text-green-800 border-green-200",
  CREDIT_CARD: "bg-purple-100 text-purple-800 border-purple-200",
};

const ContractPaymentBrandPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("ALL");
  const [dueDateFrom, setDueDateFrom] = useState<string>("");
  const [dueDateTo, setDueDateTo] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [loadingPaymentId, setLoadingPaymentId] = useState<string | null>(null);
  const [modalPaymentLoading, setModalPaymentLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePayNow = async (
    contract_payment_id: string,
    amount?: number,
    contractNumber?: string,
  ) => {
    try {
      setLoadingPaymentId(contract_payment_id);
      try {
        if (amount !== undefined && amount !== null) {
          sessionStorage.setItem(`payment_amount_${contract_payment_id}`, String(amount));
        }
        if (contractNumber) {
          sessionStorage.setItem(
            `payment_contractNumber_${contract_payment_id}`,
            String(contractNumber),
          );
        }
      } catch {
        // intentionally left blank
      }
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
      const returnUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-cancel`;

      const result = await dispatch(
        createPaymentLink({
          contract_payment_id,
          return_url: returnUrl,
          cancel_url: cancelUrl,
        }),
      );
      if (result?.payload) {
        setIsPaymentModalOpen(true);
      } else {
        toast.error("Could not get payment information. Please try again.");
      }
    } catch {
      toast.error("An error occurred while creating payment link.");
    } finally {
      setLoadingPaymentId(null);
    }
  };

  const handlePayNowFromModal = async (contract_payment_id: string) => {
    try {
      setModalPaymentLoading(true);
      try {
        const found = contractPayments.find((p: any) => p.id === contract_payment_id);
        if (found) {
          sessionStorage.setItem(`payment_amount_${contract_payment_id}`, String(found.amount));
          sessionStorage.setItem(
            `payment_contractNumber_${contract_payment_id}`,
            String(found.contract_number || ""),
          );
        }
      } catch {
        // intentionally left blank
      }
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
      const returnUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-cancel`;

      const result = await dispatch(
        createPaymentLink({
          contract_payment_id,
          return_url: returnUrl,
          cancel_url: cancelUrl,
        }),
      );
      if (result?.payload) {
        setIsModalOpen(false);
        setIsPaymentModalOpen(true);
      } else {
        toast.error("Could not get payment information. Please try again.");
      }
    } catch {
      toast.error("An error occurred while creating payment link.");
    } finally {
      setModalPaymentLoading(false);
    }
  };

  const [brandSearch, setBrandSearch] = useState("");
  const [brandPage, setBrandPage] = useState(1);
  const [allBrands, setAllBrands] = useState<any[]>([]);
  const debouncedBrandSearch = useDebounce(brandSearch, 400);

  const dispatch = useAppDispatch();
  const {
    contractPaymentBrand: contractPayments,
    loading,
    pagination,
    paymentLink,
  } = useContractPayment();
  const { brands, loading: brandLoading, pagination: brandPagination } = useBrand();

  useEffect(() => {
    setAllBrands([]);
    setBrandPage(1);
  }, [debouncedBrandSearch]);

  useEffect(() => {
    dispatch(
      fetchBrands({
        page: brandPage,
        limit: 5,
        status: "ACTIVE",
        ...(debouncedBrandSearch ? { keywords: debouncedBrandSearch } : {}),
      }),
    );
  }, [dispatch, brandPage, debouncedBrandSearch]);

  useEffect(() => {
    if (brandPage === 1) {
      setAllBrands(brands);
    } else {
      setAllBrands((prev) => [...prev, ...brands]);
    }
  }, [brands, brandPage]);

  useEffect(() => {
    const params: Record<string, any> = {
      page,
      limit: PAGE_SIZE,
      ...(selectedBrandId && { brand_id: selectedBrandId }),
      ...(selectedContractId && { contract_id: selectedContractId }),
      ...(statusFilter !== "ALL" && { status: statusFilter }),
      ...(paymentMethodFilter !== "ALL" && { payment_method: paymentMethodFilter }),
      ...(dueDateFrom && { due_date_from: toISOStringDate(dueDateFrom) }),
      ...(dueDateTo && { due_date_to: toISOStringDate(dueDateTo) }),
      sort_by: sortBy,
      sort_order: sortOrder,
    };

    dispatch(getContractPaymentBrand(params as any));
  }, [
    dispatch,
    page,
    selectedBrandId,
    selectedContractId,
    statusFilter,
    paymentMethodFilter,
    dueDateFrom,
    dueDateTo,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    selectedBrandId,
    selectedContractId,
    statusFilter,
    paymentMethodFilter,
    dueDateFrom,
    dueDateTo,
  ]);

  const loadMoreBrands = useCallback(() => {
    if (brandPagination?.has_next && !brandLoading) {
      setBrandPage((p) => p + 1);
    }
  }, [brandPagination?.has_next, brandLoading]);

  const handleBrandSelect = (brandId: string | null) => {
    setSelectedBrandId(brandId);
    if (selectedContractId) {
      setSelectedContractId(null);
    }
  };

  const handleResetFilters = () => {
    setSelectedBrandId(null);
    setSelectedContractId(null);
    setStatusFilter("ALL");
    setPaymentMethodFilter("ALL");
    setDueDateFrom("");
    setDueDateTo("");
    setSortBy("created_at");
    setSortOrder("desc");
    setBrandSearch("");
  };

  const toISOStringDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return "";
    return `${dateStr}T00:00:00Z`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const isWithinTenDaysBeforeDue = (dueDate: string) => {
    if (!dueDate) return false;

    const now = new Date();
    const due = new Date(dueDate);

    if (isNaN(due.getTime())) return false;

    const diffMs = due.getTime() - now.getTime();
    const tenDaysMs = 10 * 24 * 60 * 60 * 1000;

    return diffMs >= 0 && diffMs <= tenDaysMs;
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;

    const now = new Date();
    const due = new Date(dueDate);

    if (isNaN(due.getTime())) return false;

    return due.getTime() < now.getTime();
  };

  const handleViewPayment = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPaymentId(null);
  };

  const BrandCard = useMemo(
    () =>
      React.memo(({ brand }: { brand: any }) => {
        if (!brand) return null;
        return (
          <div className="flex items-center gap-3 p-2">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg border border-slate-100 bg-white shadow-sm flex items-center justify-center">
              {brand.logo_url ? (
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="object-contain h-full w-full rounded-lg"
                  loading="lazy"
                />
              ) : (
                <FaImage className="text-slate-400 h-4 w-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-slate-900 truncate">{brand.name}</div>
              {brand.industry && (
                <div className="text-xs text-slate-500 truncate">{brand.industry}</div>
              )}
            </div>
          </div>
        );
      }),
    [],
  );

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const filterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
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
            Brand Contract Payments
          </motion.h1>
          <motion.p className="text-gray-600 mt-1" variants={itemVariants}>
            Manage and track contract payment schedules for brands
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="bg-white rounded-lg shadow mb-4 p-4"
        variants={filterVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="
          grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-2 mb-1
          items-end
        "
        >
          <motion.div variants={itemVariants}>
            <DataSelector
              data={allBrands}
              selectedId={selectedBrandId}
              onSelect={handleBrandSelect}
              renderItem={(brand) => <BrandCard brand={brand} />}
              getLabel={(brand) => brand.name}
              title="Brands"
              placeholder="Select brand..."
              onSearch={setBrandSearch}
              searchValue={brandSearch}
              onScrollEnd={loadMoreBrands}
              loading={brandLoading}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Methods</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              variant="secondary"
              className="border-gray-300 px-3 w-full"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          </motion.div>
        </div>
        <div
          className="
          grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2
          items-end
        "
        >
          <motion.div variants={itemVariants}>
            <DatePicker
              value={dueDateFrom}
              onChange={(date) => {
                setDueDateFrom(date);
                if (dueDateTo && date && dueDateTo < date) setDueDateTo("");
              }}
              placeholder="Due Date From"
              dateFormat="dd/MM/yyyy"
              className="w-full"
              maxDate={dueDateTo || undefined}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DatePicker
              value={dueDateTo}
              onChange={setDueDateTo}
              placeholder="Due Date To"
              dateFormat="dd/MM/yyyy"
              className="w-full"
              minDate={dueDateFrom || undefined}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Created At</SelectItem>
                <SelectItem value="due_date">Due Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>
      </motion.div>

      <div className="bg-white rounded-lg overflow-hidden shadow">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading contract payments...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-gray-50">
                    <TableHead className="font-semibold">Contract</TableHead>
                    <TableHead className="font-semibold">Brand</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Due Date</TableHead>
                    <TableHead className="font-semibold">Payment Method</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contractPayments.map((payment: ContractPayment, index) => (
                    <motion.tr
                      key={payment.id}
                      layout="position"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <TableCell className="py-4">
                        <div>
                          <div className="font-medium text-gray-900">{payment.contract_number}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            {payment.contract_title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm font-medium">{payment.brand_name}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-medium">{formatCurrency(payment.amount)}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={`border ${STATUS_COLORS[payment.status] || ""} text-xs font-medium px-2 py-1`}
                        >
                          {CONTRACT_PAYMENT_STATUS_LABELS[payment.status] || payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm">{formatDate(payment.due_date)}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={`border text-xs font-medium px-2 py-1 ${PAYMENT_METHOD_COLORS[payment.payment_method] || ""}`}
                        >
                          {PAYMENT_METHOD_LABELS[payment.payment_method] || payment.payment_method}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-sm">
                        {formatDate(payment.created_at)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                                onClick={() => handleViewPayment(payment.id)}
                              >
                                <FaEye className="h-4 w-4 text-blue-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Details</p>
                            </TooltipContent>
                          </Tooltip>
                          {payment.status === "PENDING" &&
                            (isWithinTenDaysBeforeDue(payment.due_date) ||
                              isOverdue(payment.due_date)) && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className={`h-8 px-3 text-xs font-semibold text-white ${
                                      isOverdue(payment.due_date)
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-primary"
                                    }`}
                                    onClick={() =>
                                      handlePayNow(
                                        payment.id,
                                        payment.amount,
                                        payment.contract_number,
                                      )
                                    }
                                  >
                                    {loadingPaymentId === payment.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : isOverdue(payment.due_date) ? (
                                      "Pay Overdue"
                                    ) : (
                                      "Pay Now"
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {isOverdue(payment.due_date)
                                      ? "This payment is overdue"
                                      : "Pay this contract payment"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card List */}
            <div className="lg:hidden divide-y">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.05 },
                  },
                }}
              >
                {contractPayments.map((payment: ContractPayment) => (
                  <motion.div
                    key={payment.id}
                    className="p-4 flex flex-col gap-3 bg-white"
                    variants={itemVariants}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{payment.contract_number}</div>
                        <div className="flex gap-2 mt-2">
                          <Badge
                            className={`border ${STATUS_COLORS[payment.status] || ""} text-xs font-medium px-2 py-1`}
                          >
                            {CONTRACT_PAYMENT_STATUS_LABELS[payment.status] || payment.status}
                          </Badge>
                          <Badge
                            className={`border text-xs font-medium px-2 py-1 ${PAYMENT_METHOD_COLORS[payment.payment_method] || ""}`}
                          >
                            {PAYMENT_METHOD_LABELS[payment.payment_method] ||
                              payment.payment_method}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Amount</div>
                        <div className="text-sm font-medium">{formatCurrency(payment.amount)}</div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 truncate">{payment.contract_title}</div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Brand:</span> {payment.brand_name}
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>{" "}
                        {formatDate(payment.due_date)}
                      </div>
                      {payment.note && (
                        <div>
                          <span className="font-medium">Note:</span> {payment.note}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1 pt-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                            onClick={() => handleViewPayment(payment.id)}
                          >
                            <FaEye className="h-4 w-4 text-blue-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Details</p>
                        </TooltipContent>
                      </Tooltip>
                      {payment.status === "PENDING" &&
                        (isWithinTenDaysBeforeDue(payment.due_date) ||
                          isOverdue(payment.due_date)) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                className={`h-8 px-3 text-xs font-semibold text-white ${
                                  isOverdue(payment.due_date)
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-primary"
                                }`}
                                onClick={() =>
                                  handlePayNow(payment.id, payment.amount, payment.contract_number)
                                }
                              >
                                {loadingPaymentId === payment.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : isOverdue(payment.due_date) ? (
                                  "Pay Overdue"
                                ) : (
                                  "Pay Now"
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {isOverdue(payment.due_date)
                                  ? "This payment is overdue"
                                  : "Pay this contract payment"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* No results message */}
            {(!contractPayments || contractPayments.length === 0) && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FaListCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No contract payments found
                </h3>
                <p className="text-gray-500 mb-4">
                  {selectedBrandId ||
                  selectedContractId ||
                  statusFilter !== "ALL" ||
                  paymentMethodFilter !== "ALL"
                    ? "No contract payments match your current filters."
                    : "No contract payments available for your brand."}
                </p>
              </motion.div>
            )}

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: contractPayments.length * 0.05 + 0.2 }}
              >
                <PaginationTable
                  page={pagination.page}
                  totalItems={pagination.total}
                  pageSize={PAGE_SIZE}
                  onPageChange={setPage}
                />
              </motion.div>
            )}
          </>
        )}
      </div>
      <PaymentDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        paymentId={selectedPaymentId}
        showPayNowButton={true}
        onPayNow={handlePayNowFromModal}
        isPaymentLoading={modalPaymentLoading}
      />
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentData={paymentLink}
      />
    </div>
  );
};

export default ContractPaymentBrandPage;
