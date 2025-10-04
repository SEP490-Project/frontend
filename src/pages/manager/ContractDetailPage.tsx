import { useParams, useNavigate } from "react-router-dom";
import ContractDetail from "@/components/layout/manage/brand/ContractDetail";

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/manager/contracts");
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Contract ID</h3>
              <p className="text-gray-600">Please provide a valid contract ID.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <ContractDetail contractId={id} onBack={handleBack} />;
}
