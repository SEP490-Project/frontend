import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useContract } from "@/libs/hooks/useContract";
import { ContractInformation, FinancialTerms, LegalTerms, ScopeOfWork } from "./component/detail";
import { getContractById } from "@/libs/stores/contractManager/thunk";
import { useAppDispatch } from "@/libs/stores";
import { ContractPreviewModal } from "@/components/manage/marketing/contract/ContractPreviewModal";
import { ContractPDF } from "@/components/manage/marketing/contract/ContractPreview";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaEye, FaFileArrowDown } from "react-icons/fa6";

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { contractDetail, detailLoading } = useContract();
  const dispatch = useAppDispatch();
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    if (id) dispatch(getContractById(id));
  }, [dispatch, id]);

  if (detailLoading) return <div className="text-center p-8">Loading...</div>;
  if (!contractDetail) return <div className="text-center p-8">No contract found</div>;

  const { type } = contractDetail;

  return (
    <div className="min-h-screen p-8 space-y-6 bg-gray-50">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contract Details</h1>
          <p className="text-gray-600">Contract #{contractDetail.contract_number}</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsPreviewModalOpen(true)}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <FaEye className="h-4 w-4 mr-2" />
            Preview Contract
          </Button>

          <PDFDownloadLink
            document={<ContractPDF data={contractDetail} />}
            fileName={`${contractDetail.title || "contract"}_${contractDetail.contract_number}.pdf`}
          >
            {({ loading }) => (
              <Button disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
                <FaFileArrowDown className="h-4 w-4 mr-2" />
                {loading ? "Generating..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <ContractInformation data={contractDetail} />
        <FinancialTerms type={type} data={contractDetail.financial_terms} />
        <ScopeOfWork type={type} data={contractDetail.scope_of_work} />
        <LegalTerms data={contractDetail.legal_terms} />
      </Card>

      {/* Preview Modal */}
      <ContractPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        contractData={contractDetail}
      />
    </div>
  );
}
