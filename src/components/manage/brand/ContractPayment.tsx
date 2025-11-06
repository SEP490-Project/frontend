"use client";

import {
  CreditCard,
  Eye,
  ExternalLink,
  Filter,
  Search,
  RefreshCw,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useMemo } from "react";
import { usePayment } from "@/libs/hooks/usePayment";
import { toast } from "sonner";
import type { ContractPayment as ContractPaymentType } from "@/libs/types/payment";

// Custom hook for number animation
const useCountAnimation = (targetValue: number, duration = 1000) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (targetValue === 0) {
      setCurrentValue(0);
      return;
    }

    let startTime: number | null = null;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smoother animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const newValue = Math.floor(targetValue * easeOutCubic);

      setCurrentValue(newValue);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [targetValue, duration]);

  return currentValue;
};

// Animated Number Component
const AnimatedNumber: React.FC<{
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}> = ({ value, className = "", prefix = "", suffix = "" }) => {
  const animatedValue = useCountAnimation(value, 1200);

  return (
    <span className={className}>
      {prefix}
      {animatedValue.toLocaleString("vi-VN")}
      {suffix}
    </span>
  );
};

// Animated Currency Component
const AnimatedCurrency: React.FC<{
  value: number;
  currency: string;
  className?: string;
}> = ({ value, currency, className = "" }) => {
  const animatedValue = useCountAnimation(value, 1200);

  const formatAnimatedCurrency = (amount: number, curr: string) => {
    const validCurrency = curr && curr.length === 3 ? curr : "VND";
    try {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: validCurrency,
      }).format(amount);
    } catch {
      return `${amount.toLocaleString("vi-VN")} ${validCurrency}`;
    }
  };

  return <span className={className}>{formatAnimatedCurrency(animatedValue, currency)}</span>;
};

const ContractPayment = () => {
  const {
    loading,
    payments,
    paymentProfile,
    pagination,
    detailLoading,
    paymentDetail,
    linkLoading,
    paymentLink,
    fetchPaymentsProfile,
    fetchPaymentDetail,
    generatePaymentLink,
    clearPaymentDetail,
    clearPaymentLink,
    refreshPayments,
  } = usePayment();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState<ContractPaymentType | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showPaymentLinkDialog, setShowPaymentLinkDialog] = useState(false);

  // Load payments on component mount and when filters change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: pageSize,
      ...(statusFilter !== "ALL" && { status: statusFilter as any }),
    };
    fetchPaymentsProfile(params);
  }, [currentPage, pageSize, statusFilter]);

  // Filter payments based on search term
  const filteredPayments = useMemo(() => {
    if (!searchTerm) return payments;
    return payments.filter(
      (payment) =>
        payment.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.contract_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.note?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [payments, searchTerm]);

  // Handle refresh
  const handleRefresh = () => {
    refreshPayments();
  };

  // Handle view payment detail
  const handleViewDetail = async (payment: ContractPaymentType) => {
    setSelectedPayment(payment);
    setShowDetailDialog(true);
    await fetchPaymentDetail(payment.id);
  };

  // Handle generate payment link
  const handleGeneratePaymentLink = async (payment: ContractPaymentType) => {
    setSelectedPayment(payment);

    try {
      await generatePaymentLink(payment.id, {
        description: `Payment for ${payment.contract_number}`,
        return_url: `${window.location.origin}/payments`,
        cancel_url: `${window.location.origin}/payments`,
      });

      setShowPaymentLinkDialog(true);
      toast.success("Payment link generated successfully!");
    } catch {
      toast.error("Failed to generate payment link");
    }
  };

  // Handle copy payment link
  const handleCopyPaymentLink = () => {
    if (paymentLink?.payment_link) {
      navigator.clipboard.writeText(paymentLink.payment_link);
      toast.success("Payment link copied to clipboard!");
    }
  };

  // Handle close dialogs
  const handleCloseDetailDialog = () => {
    setShowDetailDialog(false);
    setSelectedPayment(null);
    clearPaymentDetail();
  };

  const handleClosePaymentLinkDialog = () => {
    setShowPaymentLinkDialog(false);
    setSelectedPayment(null);
    clearPaymentLink();
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    // Fallback to VND if currency is not provided or invalid
    const validCurrency = currency && currency.length === 3 ? currency : "VND";

    try {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: validCurrency,
      }).format(amount);
    } catch {
      // Fallback to simple number formatting if currency is still invalid
      return `${amount.toLocaleString("vi-VN")} ${validCurrency}`;
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PAID":
        return "default";
      case "PENDING":
        return "secondary";
      case "OVERDUE":
        return "destructive";
      case "CANCELLED":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "OVERDUE":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contract Payments</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and track your contract payment schedules
              </p>
            </div>
            <Button onClick={handleRefresh} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Payment Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <div className="text-2xl font-bold">
                  <AnimatedNumber value={paymentProfile?.total_payments || 0} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <div className="text-2xl font-bold">
                  <AnimatedCurrency
                    value={paymentProfile?.total_amount || 0}
                    currency={paymentProfile?.currency || "VND"}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <div className="text-2xl font-bold text-green-600">
                  <AnimatedCurrency
                    value={paymentProfile?.paid_amount || 0}
                    currency={paymentProfile?.currency || "VND"}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <div className="text-2xl font-bold text-yellow-600">
                  <AnimatedCurrency
                    value={paymentProfile?.pending_amount || 0}
                    currency={paymentProfile?.currency || "VND"}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <div className="text-2xl font-bold text-red-600">
                  <AnimatedCurrency
                    value={paymentProfile?.overdue_amount || 0}
                    currency={paymentProfile?.currency || "VND"}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by contract number, title, or note..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Records</CardTitle>
            <CardDescription>
              {filteredPayments.length} of {payments.length} payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="text-gray-600">Loading payments...</span>
                </div>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-base font-medium text-gray-900 mb-1">No Payments Found</h3>
                  <p className="text-sm text-gray-600">
                    {searchTerm || statusFilter !== "ALL"
                      ? "Try adjusting your search filters"
                      : "No contract payments available"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{payment.contract_title}</div>
                            <div className="text-sm text-gray-500">{payment.contract_number}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{payment.brand_name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">
                            {formatCurrency(payment.amount, "VND")}
                          </div>
                          {payment.installment_percentage > 0 && (
                            <div className="text-xs text-gray-500">
                              {payment.installment_percentage}% installment
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payment.status)}
                            <Badge variant={getStatusBadgeVariant(payment.status)}>
                              {payment.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(payment.due_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{payment.note || "-"}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetail(payment)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                            {payment.status === "PENDING" && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleGeneratePaymentLink(payment)}
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Pay
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.has_prev}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {pagination.total_pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.has_next}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={handleCloseDetailDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </DialogTitle>
            <DialogDescription>{selectedPayment?.contract_number}</DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="text-gray-600">Loading payment details...</span>
              </div>
            </div>
          ) : paymentDetail ? (
            <div className="space-y-4">
              <Tabs defaultValue="payment" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="payment">Payment Details</TabsTrigger>
                  <TabsTrigger value="contract">Contract Info</TabsTrigger>
                </TabsList>

                <TabsContent value="payment" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payment Number</label>
                      <p className="text-sm text-gray-900 mt-1">{paymentDetail.payment_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="mt-1 flex items-center gap-2">
                        {getStatusIcon(paymentDetail.status)}
                        <Badge variant={getStatusBadgeVariant(paymentDetail.status)}>
                          {paymentDetail.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Amount</label>
                      <p className="text-sm text-gray-900 mt-1 font-semibold">
                        {formatCurrency(paymentDetail.amount, paymentDetail.currency)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Due Date</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(paymentDetail.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    {paymentDetail.paid_date && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Paid Date</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {new Date(paymentDetail.paid_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {paymentDetail.payment_method && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Payment Method</label>
                        <p className="text-sm text-gray-900 mt-1">{paymentDetail.payment_method}</p>
                      </div>
                    )}
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">
                        Installment Percentage
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {paymentDetail.installment_percentage}%
                      </p>
                    </div>
                    {paymentDetail.description && (
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-500">Description</label>
                        <p className="text-sm text-gray-900 mt-1">{paymentDetail.description}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="contract" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contract ID</label>
                      <p className="text-sm text-gray-900 mt-1">{paymentDetail.contract.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contract Number</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {paymentDetail.contract.contract_number}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">Contract Title</label>
                      <p className="text-sm text-gray-900 mt-1">{paymentDetail.contract.title}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">Brand Name</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {paymentDetail.contract.brand_name}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center text-gray-500">No payment details available</div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDetailDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Link Dialog */}
      <Dialog open={showPaymentLinkDialog} onOpenChange={handleClosePaymentLinkDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Payment Link Generated
            </DialogTitle>
            <DialogDescription>
              Payment link for {selectedPayment?.contract_number}
            </DialogDescription>
          </DialogHeader>

          {linkLoading ? (
            <div className="flex items-center justify-center h-20">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="text-gray-600">Generating payment link...</span>
              </div>
            </div>
          ) : paymentLink ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Payment ID</label>
                <p className="text-sm text-gray-900 mt-1">{paymentLink.payment_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Expires At</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(paymentLink.expires_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(paymentLink.payment_link, "_blank")}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Payment Page
                </Button>
                <Button variant="outline" onClick={handleCopyPaymentLink}>
                  Copy Link
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">Failed to generate payment link</div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleClosePaymentLinkDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractPayment;
