import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useContract } from "@/libs/hooks/useContract";
import { ContractInformation, FinancialTerms, LegalTerms, ScopeOfWork } from "./component/detail";
import { getContractById } from "@/libs/stores/contractManager/thunk";
import { useAppDispatch } from "@/libs/stores";
import { ContractPreviewModal } from "@/components/manage/marketing/contract/ContractPreviewModal";
import { ContractPDF } from "@/components/manage/marketing/contract/ContractPreview";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  FaEye,
  FaFileArrowDown,
  FaArrowLeft,
  FaFileContract,
  FaPencil,
  FaArrowRight,
  FaEllipsisVertical,
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
import { isViolationStatus } from "@/libs/types/violation";
import { toast } from "sonner";

const ContractDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { contractDetail, detailLoading } = useContract();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [violation, setViolation] = useState<ContractViolation | null>(null);
  const [showReportBrandViolation, setShowReportBrandViolation] = useState(false);

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
    </div>
  );
};

export default ContractDetailPage;
