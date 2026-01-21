import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useContract } from "@/libs/hooks/useContract";
import { useContractPayment } from "@/libs/hooks/useContractPayment";
import {
  ContractInformation,
  FinancialTerms,
  LegalTerms,
  ScopeOfWork,
} from "@/pages/manager/marketing/contracts/component/detail";
import {
  getContractById,
  approveContract,
  rejectContract,
} from "@/libs/stores/contractManager/thunk";
import { getContractPayment } from "@/libs/stores/contractPaymentManager/thunk";
import { useAppDispatch } from "@/libs/stores";
import { ContractPreviewModal } from "@/components/manage/marketing/contract/ContractPreviewModal";
import { ContractPDF } from "@/components/manage/marketing/contract/ContractPreview";
import { PaymentDetailModal } from "@/components/manage/marketing/contract-payment";
import PaginationTable from "@/components/global/PaginationTable";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  FaEye,
  FaFileArrowDown,
  FaArrowLeft,
  FaFileContract,
  FaCheck,
  FaXmark,
  FaArrowRight,
  FaEllipsisVertical,
  FaCreditCard,
  FaCalendar,
} from "react-icons/fa6";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ContractViolationSection from "@/components/manage/brand/ContractViolationSection";
import ViolationPenaltyPayment from "@/components/manage/brand/ViolationPenaltyPayment";
import ViolationProofReview from "@/components/manage/brand/ViolationProofReview";
import ReportKOLViolation from "@/components/manage/brand/ReportKOLViolation";
import { manageViolation } from "@/libs/services/manageViolation";
import type { ContractViolation } from "@/libs/types/violation";
import type { ContractStatus } from "@/libs/types/contract";
import type { ContractPayment } from "@/libs/types/contract-payments";
import { isViolationStatus } from "@/libs/types/violation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/libs/helper/helper";
import { DialogTitle } from "@radix-ui/react-dialog";

const PAGE_SIZE = 5;

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { contractDetail, detailLoading, actionLoading } = useContract();
  const {
    contractPayments,
    loading: paymentsLoading,
    pagination: paymentsPagination,
  } = useContractPayment();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Violation State
  const [violation, setViolation] = useState<ContractViolation | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProofReviewModalOpen, setIsProofReviewModalOpen] = useState(false);

  // Contract Payments State
  const [paymentPage, setPaymentPage] = useState(1);
  const [isContractPaymentModalOpen, setIsContractPaymentModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  // Fetch violation data if contract is in violation status
  const fetchViolationData = useCallback(async () => {
    if (!id || !contractDetail) return;
    const status = contractDetail.status as ContractStatus;
    if (!isViolationStatus(status)) {
      setViolation(null);
      return;
    }

    try {
      const response = await manageViolation.getByContractId(id);
      setViolation(response.data.data);
    } catch (error: any) {
      console.error("Failed to fetch violation data:", error);
      toast.error("Failed to load violation details");
    }
  }, [id, contractDetail]);

  useEffect(() => {
    if (id) dispatch(getContractById(id));
  }, [dispatch, id]);

  // Fetch contract payments for this contract with pagination
  useEffect(() => {
    if (!id) return;

    const params = {
      page: paymentPage,
      limit: PAGE_SIZE,
      contract_id: id,
      sort_by: "created_at",
      sort_order: "desc",
    };

    dispatch(getContractPayment(params));
  }, [dispatch, id, paymentPage]);

  // Reset payment page when contract changes
  useEffect(() => {
    if (contractDetail?.id) {
      setPaymentPage(1);
    }
  }, [contractDetail?.id]);

  // Fetch contract payments for this contract with pagination
  useEffect(() => {
    if (!id) return;

    const params = {
      page: paymentPage,
      limit: PAGE_SIZE,
      contract_id: id,
      sort_by: "created_at",
      sort_order: "desc",
    };

    dispatch(getContractPayment(params));
  }, [dispatch, id, paymentPage]);

  // Reset payment page when contract changes
  useEffect(() => {
    if (contractDetail?.id) {
      setPaymentPage(1);
    }
  }, [contractDetail?.id]);

  useEffect(() => {
    if (contractDetail?.id) {
      // Check if violation is already present
      const status = contractDetail.status as ContractStatus;
      if (isViolationStatus(status) && contractDetail.violation) {
        setViolation(contractDetail.violation);
      } else {
        fetchViolationData();
      }
    }
  }, [
    contractDetail?.id,
    contractDetail?.status,
    contractDetail?.violation,
    contractDetail,
    fetchViolationData,
  ]);

  const handleViolationSuccess = (shouldReloadContract = false) => {
    fetchViolationData();
    if (shouldReloadContract && id) dispatch(getContractById(id));
  };

  const handleViewPayment = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setIsContractPaymentModalOpen(true);
  };

  const handleCloseContractPaymentModal = () => {
    setIsContractPaymentModalOpen(false);
    setSelectedPaymentId(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatAmount = (payment: ContractPayment) => {
    const isPerformanceBased =
      (payment.contract_type === "CO_PRODUCING" || payment.contract_type === "AFFILIATE") &&
      payment.amount === 0;

    if (isPerformanceBased) {
      return <span className="text-sm italic text-gray-600">To be calculated by performance</span>;
    }

    return (
      <div className="flex flex-col">
        <span className="font-medium">{formatCurrency(payment.amount)}</span>
      </div>
    );
  };

  const handleApprove = async () => {
    if (!contractDetail?.id) return;

    try {
      setIsApproving(true);
      await dispatch(approveContract(contractDetail.id)).unwrap();
      toast.success("Contract approved successfully!");
      // Refresh contract detail
      dispatch(getContractById(contractDetail.id));
    } catch (error: any) {
      toast.error(error || "Failed to approve contract");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!contractDetail?.id) return;

    try {
      setIsRejecting(true);
      await dispatch(rejectContract(contractDetail.id)).unwrap();
      toast.success("Contract rejected successfully!");
      // Refresh contract detail
      dispatch(getContractById(contractDetail.id));
    } catch (error: any) {
      toast.error(error || "Failed to reject contract");
    } finally {
      setIsRejecting(false);
    }
  };

  if (detailLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
        <span className="text-gray-500">Loading Contract Detail</span>
      </div>
    );

  if (!contractDetail)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
        <div className="rounded-full bg-gray-100 p-6">
          <FaFileContract className="w-14 h-14 text-gray-300 mb-4" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Contract Not Found</h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            The contract you are looking for does not exist or has been removed. Please check the
            URL or go back to the list.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/manage/brand/contracts")}
          className="bg-primary hover:bg-primary/90"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Contracts
        </Button>
      </div>
    );

  const { type } = contractDetail;
  const canTakeAction =
    contractDetail.status === "PENDING_APPROVAL" || contractDetail.status === "DRAFT";

  return (
    <div className="min-h-fit p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/manage/brand/contracts")}
            className="flex items-center"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Return
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaFileContract className="text-primary" />
              Contract Details
            </h1>
            <p className="text-gray-600">Contract number: {contractDetail.contract_number}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Primary Actions Group - Always visible */}
          <div className="flex items-center gap-2">
            {/* Action Buttons - Approve/Reject - Highest Priority */}
            {canTakeAction && (
              <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
                <Button
                  onClick={handleReject}
                  disabled={isRejecting || isApproving || actionLoading}
                  variant="outline"
                  className="border-red-300 text-red-700 bg-white hover:bg-red-50 flex items-center whitespace-nowrap"
                >
                  {isRejecting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FaXmark className="h-4 w-4 mr-2" />
                  )}
                  {isRejecting ? "Rejecting..." : "Reject"}
                </Button>

                <Button
                  onClick={handleApprove}
                  disabled={isApproving || isRejecting || actionLoading}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center whitespace-nowrap"
                >
                  {isApproving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FaCheck className="h-4 w-4 mr-2" />
                  )}
                  {isApproving ? "Approving..." : "Approve"}
                </Button>
              </div>
            )}

            {/* Essential Actions - Preview & Download */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsPreviewModalOpen(true)}
                variant="outline"
                className="border-blue-300 text-blue-700 bg-white hover:bg-blue-100 flex items-center whitespace-nowrap"
              >
                <FaEye className="h-4 w-4 mr-2" />
                Preview
              </Button>

              <PDFDownloadLink
                document={<ContractPDF data={contractDetail} />}
                fileName={`${contractDetail.title || "contract"}_${contractDetail.contract_number}.pdf`}
              >
                {({ loading }) => (
                  <Button
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white flex items-center whitespace-nowrap"
                  >
                    <FaFileArrowDown className="h-4 w-4 mr-2" />
                    {loading ? "Generating..." : "Download"}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          </div>

          {/* Secondary Actions - Overflow Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center justify-center w-10 h-10 p-0">
                <FaEllipsisVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* Report Issue Button - For Active Contracts */}
              {contractDetail.status === "ACTIVE" && id && (
                <ReportKOLViolation
                  contractId={id}
                  contractNumber={contractDetail.contract_number}
                  onReportSuccess={() => handleViolationSuccess(true)}
                  trigger={
                    <DropdownMenuItem className="text-orange-700 hover:bg-orange-50 cursor-pointer">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Report KOL Violation
                    </DropdownMenuItem>
                  }
                />
              )}

              {/* Campaign Navigation */}
              {contractDetail.campaign_id && (
                <DropdownMenuItem
                  onClick={() => navigate(`/manage/brand/campaigns/${contractDetail.campaign_id}`)}
                  className="text-green-700 hover:bg-green-50 cursor-pointer"
                >
                  <FaArrowRight className="mr-2 h-4 w-4" />
                  View Campaign
                </DropdownMenuItem>
              )}

              {/* Refresh Contract */}
              <DropdownMenuItem
                onClick={() => dispatch(getContractById(contractDetail.id))}
                disabled={isRejecting || isApproving || actionLoading}
                className="cursor-pointer"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Contract
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status Alert */}
      {contractDetail.status === "PENDING_APPROVAL" && (
        <Card className="p-4 mb-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <FaFileContract className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-800">Action Required</h3>
              <p className="text-yellow-700 text-sm">
                This contract is pending your approval. Please review the terms and decide whether
                to approve or reject it.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Violation Section */}
      {isViolationStatus(contractDetail.status as ContractStatus) && violation && (
        <div className="space-y-6 mb-8">
          <ContractViolationSection
            violation={violation}
            contractStatus={contractDetail.status as ContractStatus}
            userRole="brand"
            onPayPenalty={() => setIsPaymentModalOpen(true)}
            onReviewProof={() => setIsProofReviewModalOpen(true)}
          />

          {/* Penalty Payment Modal */}
          <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0">
              <DialogTitle
                hidden={true}
                aria-hidden={true}
                className="text-lg font-semibold text-gray-900"
              >
                Pay Violation Penalty
              </DialogTitle>
              <ViolationPenaltyPayment
                violation={violation}
                contractId={id!}
                onPaymentCreated={() => {
                  handleViolationSuccess(false);
                  setIsPaymentModalOpen(false); // Close modale, ContractViolationSection will show link
                }}
              />
            </DialogContent>
          </Dialog>

          {/* Proof Review Modal */}
          <Dialog open={isProofReviewModalOpen} onOpenChange={setIsProofReviewModalOpen}>
            <DialogContent className="max-w-7xl w-full p-0 overflow-hidden border-0">
              <DialogTitle
                hidden={true}
                aria-hidden={true}
                className="text-lg font-semibold text-gray-900"
              >
                Review Violation Proof
              </DialogTitle>
              <ViolationProofReview
                violation={violation}
                contractId={id!}
                onReviewComplete={() => {
                  handleViolationSuccess(true);
                  setIsProofReviewModalOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Main Content Info */}
      <Card className="overflow-hidden border-t-4 border-t-primary shadow-md">
        <div className="grid gap-8 p-6 lg:p-8">
          <ContractInformation data={contractDetail} />

          <div className="border-t border-gray-100 pt-8">
            <ScopeOfWork type={type} data={contractDetail.scope_of_work} />
          </div>

          <div className="border-t border-gray-100 pt-8">
            <FinancialTerms
              type={type}
              data={contractDetail.financial_terms}
              deposit={{
                amount: contractDetail.deposit_amount,
                isPaid: contractDetail.is_deposit_paid,
                percent: contractDetail.deposit_percent,
              }}
            />
          </div>

          {/* Deposit Proof Section */}
          {contractDetail.is_deposit_paid && contractDetail.deposit_proof_url && (
            <div className="border-t border-gray-100 pt-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FaFileContract className="w-5 h-5 text-green-600" />
                  Deposit Proof
                </h3>
                <Card className="shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Deposit Payment Proof</p>
                        <p className="text-sm text-green-600 font-medium">
                          Proof document submitted
                        </p>
                      </div>
                      <Button
                        onClick={() => window.open(contractDetail.deposit_proof_url, "_blank")}
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        <FaEye className="w-4 h-4 mr-2" />
                        View Proof
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-8">
            <LegalTerms data={contractDetail.legal_terms} />
          </div>
        </div>
      </Card>

      {/* Contract Payments Section */}
      <Card className="p-6 space-y-6 shadow-sm border border-gray-100 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaCreditCard className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Contract Payments</h2>
              <p className="text-gray-600 text-sm">
                Payment schedule and history for this contract
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {paymentsPagination?.total || contractPayments.length} payment
            {(paymentsPagination?.total || contractPayments.length) !== 1 ? "s" : ""}
          </div>
        </div>

        {paymentsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading contract payments...</span>
          </div>
        ) : contractPayments.length === 0 ? (
          <div className="text-center py-12">
            <FaCreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Contract Payments</h3>
            <p className="text-gray-500">
              No payment schedule has been created for this contract yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {contractPayments.map((payment) => {
              const STATUS_COLORS: Record<string, string> = {
                NOT_STARTED: "bg-gray-100 text-gray-800 border-gray-200",
                PAID: "bg-green-100 text-green-800 border-green-200",
                PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
                OVERDUE: "bg-orange-100 text-orange-800 border-orange-200",
              };

              const STATUS_LABELS: Record<string, string> = {
                NOT_STARTED: "Not Started",
                PENDING: "Pending",
                PAID: "Paid",
                OVERDUE: "Overdue",
              };

              return (
                <div
                  key={payment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`border text-xs font-medium px-2 py-1 ${STATUS_COLORS[payment.status] || ""}`}
                        >
                          {STATUS_LABELS[payment.status] || payment.status}
                        </Badge>
                        {payment.is_deposit && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs px-2 py-1">
                            Deposit
                          </Badge>
                        )}
                        {payment.pay_now && (
                          <span title="Pay Now" className="inline-block align-middle">
                            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPayment(payment.id)}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <FaEye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Amount:</span>
                      <div className="mt-1">{formatAmount(payment)}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Due Date:</span>
                      <div className="mt-1 flex items-center gap-2">
                        <FaCalendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(payment.due_date)}</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Payment Method:</span>
                      <div className="mt-1">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-1">
                          {payment.payment_method === "BANK_TRANSFER"
                            ? "Bank Transfer"
                            : payment.payment_method === "CASH"
                              ? "Cash"
                              : payment.payment_method === "CHECK"
                                ? "Check"
                                : payment.payment_method}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {payment.note && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="font-medium text-gray-700 text-sm">Note:</span>
                      <p className="text-sm text-gray-600 mt-1">{payment.note}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination for Contract Payments */}
        {paymentsPagination && paymentsPagination.total > 0 && (
          <div className="mt-4">
            <PaginationTable
              page={paymentsPagination.page}
              totalItems={paymentsPagination.total}
              pageSize={PAGE_SIZE}
              onPageChange={setPaymentPage}
            />
          </div>
        )}
      </Card>

      <ContractPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        contractData={contractDetail}
      />

      {/* Contract Payment Detail Modal */}
      <PaymentDetailModal
        isOpen={isContractPaymentModalOpen}
        onClose={handleCloseContractPaymentModal}
        paymentId={selectedPaymentId}
      />
    </div>
  );
}
