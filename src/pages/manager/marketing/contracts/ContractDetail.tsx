import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useContract } from "@/libs/hooks/useContract";
import { useContractPayment } from "@/libs/hooks/useContractPayment";
import { ContractInformation, FinancialTerms, LegalTerms, ScopeOfWork } from "./component/detail";
import { getContractById } from "@/libs/stores/contractManager/thunk";
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
  FaPencil,
  FaArrowRight,
  FaEllipsisVertical,
  FaCreditCard,
  FaCalendar,
} from "react-icons/fa6";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ContractViolationSection from "@/components/manage/brand/ContractViolationSection";
import { ReportBrandViolation } from "@/components/manage/marketing/violation";
import { manageViolation } from "@/libs/services/manageViolation";
import type { ContractViolation } from "@/libs/types/violation";
import type { ContractStatus } from "@/libs/types/contract";
import type { ContractPayment } from "@/libs/types/contract-payments";
import { isViolationStatus } from "@/libs/types/violation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/libs/helper/helper";
import { toast } from "sonner";

const PAGE_SIZE = 5;

const ContractDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { contractDetail, detailLoading } = useContract();
  const {
    contractPayments,
    loading: paymentsLoading,
    pagination: paymentsPagination,
  } = useContractPayment();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [violation, setViolation] = useState<ContractViolation | null>(null);
  const [showReportBrandViolation, setShowReportBrandViolation] = useState(false);
  const [paymentPage, setPaymentPage] = useState(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  const status = useMemo(() => contractDetail?.status as ContractStatus, [contractDetail?.status]);
  const isViolation = useMemo(() => {
    console.log("Checking violation status for:", status, isViolationStatus(status));

    return isViolationStatus(status);
  }, [status]);

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
  }, [contractDetail?.id, contractDetail?.status, contractDetail?.violation, fetchViolationData]);

  const handleViolationSuccess = (shouldReloadContract = false) => {
    // Refresh contract and violation data
    if (id) {
      fetchViolationData();
      if (shouldReloadContract) dispatch(getContractById(id));
    }
  };

  const handleViewPayment = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
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
        <FaFileContract className="w-14 h-14 text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-700 mb-1">No Contract Found</h2>
        <p className="text-gray-500 mb-4">
          The contract you are looking for does not exist or has been removed.
        </p>
        <Button
          variant="outline"
          onClick={() => navigate("/manage/marketing/contracts")}
          className="border-gray-300 flex items-center gap-2"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Contracts
        </Button>
      </div>
    );

  const { type } = contractDetail;

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/manage/marketing/contracts")}
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
            {/* Edit Button for Draft Contracts - Highest Priority */}
            {contractDetail.status === "DRAFT" && (
              <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
                <Button
                  onClick={() => navigate(`/manage/marketing/contracts/edit/${id}`)}
                  variant="outline"
                  className="flex items-center whitespace-nowrap"
                >
                  <FaPencil className="h-4 w-4 mr-2" />
                  Edit Contract
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
              {/* Report Brand Violation - only for ACTIVE contracts */}
              {contractDetail.status === "ACTIVE" && (
                <DropdownMenuItem
                  onClick={() => setShowReportBrandViolation(true)}
                  className="text-orange-700 hover:bg-orange-50 cursor-pointer"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Report Brand Violation
                </DropdownMenuItem>
              )}

              {/* Campaign Navigation */}
              {contractDetail.campaign_id && (
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/manage/marketing/campaigns/${contractDetail.campaign_id}`)
                  }
                  className="text-green-700 hover:bg-green-50 cursor-pointer"
                >
                  <FaArrowRight className="mr-2 h-4 w-4" />
                  View Campaign
                </DropdownMenuItem>
              )}

              {/* Refresh Contract */}
              <DropdownMenuItem
                onClick={() => dispatch(getContractById(contractDetail.id))}
                disabled={detailLoading}
                className="cursor-pointer"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Contract
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Contract Violation Section */}
      {isViolation && violation && (
        <div className="space-y-6 mb-8">
          <ContractViolationSection
            violation={violation}
            contractStatus={status}
            userRole="marketing"
            onPayPenalty={() => {}} // Marketing staff doesn't pay, handled differently
            onReviewProof={() => {}} // Marketing staff doesn't review, brand does
            onSubmitProof={() => handleViolationSuccess(false)}
          />
        </div>
      )}

      <Card className="p-6 space-y-6 shadow-sm border border-gray-100">
        <ContractInformation data={contractDetail} />
        <ScopeOfWork type={type} data={contractDetail.scope_of_work} />
        <FinancialTerms
          type={type}
          data={contractDetail.financial_terms}
          deposit={{
            amount: contractDetail.deposit_amount,
            isPaid: contractDetail.is_deposit_paid,
            percent: contractDetail.deposit_percent,
          }}
        />

        {/* Deposit Proof Section */}
        {contractDetail.is_deposit_paid && contractDetail.deposit_proof_url && (
          <div className="border-t border-gray-100 pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaFileContract className="w-5 h-5 text-green-600" />
                Deposit Proof
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700 mb-1">Deposit Payment Proof</p>
                    <p className="text-sm text-green-600 font-medium">Proof document submitted</p>
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
            </div>
          </div>
        )}

        <LegalTerms data={contractDetail.legal_terms} />
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

      {/* Report Brand Violation Modal */}
      {id && (
        <ReportBrandViolation
          contractId={id}
          contractNumber={contractDetail.contract_number}
          brandName={contractDetail.brand?.name || "Unknown Brand"}
          open={showReportBrandViolation}
          onOpenChange={setShowReportBrandViolation}
          onSuccess={() => handleViolationSuccess(true)}
        />
      )}

      {/* Payment Detail Modal */}
      <PaymentDetailModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        paymentId={selectedPaymentId}
      />
    </div>
  );
};

export default ContractDetailPage;
