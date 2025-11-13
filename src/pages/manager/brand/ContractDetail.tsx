import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useContract } from "@/libs/hooks/useContract";
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
import { useAppDispatch } from "@/libs/stores";
import { ContractPreviewModal } from "@/components/manage/marketing/contract/ContractPreviewModal";
import { ContractPDF } from "@/components/manage/marketing/contract/ContractPreview";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  FaEye,
  FaFileArrowDown,
  FaArrowLeft,
  FaFileContract,
  FaCheck,
  FaXmark,
} from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { contractDetail, detailLoading, actionLoading } = useContract();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    if (id) dispatch(getContractById(id));
  }, [dispatch, id]);

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
        <FaFileContract className="w-14 h-14 text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-700 mb-1">No Contract Found</h2>
        <p className="text-gray-500 mb-4">
          The contract you are looking for does not exist or has been removed.
        </p>
        <Button
          variant="outline"
          onClick={() => navigate("/manage/brand/contracts")}
          className="border-gray-300 flex items-center gap-2"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Contracts
        </Button>
      </div>
    );

  const { type } = contractDetail;
  const canTakeAction =
    contractDetail.status === "PENDING_APPROVAL" || contractDetail.status === "DRAFT";

  return (
    <div className="min-h-fit p-4 sm:p-6">
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

        <div className="flex gap-3 flex-wrap">
          {/* Action Buttons - Approve/Reject */}
          {canTakeAction && (
            <>
              <Button
                onClick={handleReject}
                disabled={isRejecting || isApproving || actionLoading}
                variant="outline"
                className="border-red-300 text-red-700 bg-white hover:bg-red-50 flex items-center"
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
                className="bg-green-600 hover:bg-green-700 text-white flex items-center"
              >
                {isApproving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FaCheck className="h-4 w-4 mr-2" />
                )}
                {isApproving ? "Approving..." : "Approve"}
              </Button>
            </>
          )}

          {/* Preview & Download */}
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
    </div>
  );
}
