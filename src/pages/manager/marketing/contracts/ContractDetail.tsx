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
} from "react-icons/fa6";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
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

        <div className="flex gap-3 flex-wrap">
          {/* Report Brand Violation - only for ACTIVE contracts */}
          {contractDetail.status === "ACTIVE" && (
            <Button
              onClick={() => setShowReportBrandViolation(true)}
              variant="outline"
              className="border-orange-300 text-orange-700 bg-white hover:bg-orange-50 flex items-center"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Brand Violation
            </Button>
          )}

          {contractDetail.status === "DRAFT" && (
            <Button
              onClick={() => navigate(`/manage/marketing/contracts/edit/${id}`)}
              variant="outline"
              className="flex items-center"
            >
              <FaPencil className="h-4 w-4 mr-2" />
              Edit Contract
            </Button>
          )}

          {contractDetail.campaign_id && (
            <Button
              onClick={() => navigate(`/manage/marketing/campaigns/${contractDetail.campaign_id}`)}
              variant="outline"
              className="border-green-300 text-green-700 bg-white hover:bg-green-50 flex items-center"
            >
              <FaArrowRight className="h-4 w-4 mr-2" />
              View Campaign: {contractDetail.campaign_name || "Campaign"}
            </Button>
          )}

          <Button
            onClick={() => setIsPreviewModalOpen(true)}
            variant="outline"
            className="border-blue-300 text-blue-700 bg-white hover:bg-blue-100 flex items-center"
          >
            <FaEye className="h-4 w-4 mr-2" />
            Preview Contract
          </Button>

          <PDFDownloadLink
            document={<ContractPDF data={contractDetail} />}
            fileName={`${contractDetail.title || "contract"}_${contractDetail.contract_number}.pdf`}
          >
            {({ loading }) => (
              <Button
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center"
              >
                <FaFileArrowDown className="h-4 w-4 mr-2" />
                {loading ? "Generating..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>

          {/* Refresh Contract */}
          <Button
            onClick={() => dispatch(getContractById(contractDetail.id))}
            disabled={detailLoading}
            variant="outline"
            className="items-center"
          >
            <RefreshCw className={"h-4 w-4"} />
          </Button>
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
