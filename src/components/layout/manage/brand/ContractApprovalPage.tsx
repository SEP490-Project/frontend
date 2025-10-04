import { useParams } from "react-router-dom";
import ContractApproval from "./ContractApproval";

// Example wrapper component that would get the brand ID from router params
export default function ContractApprovalPage() {
  const { brandId } = useParams<{ brandId: string }>();

  if (!brandId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Brand ID Required</h2>
          <p className="text-gray-600">Please select a brand to view contracts.</p>
        </div>
      </div>
    );
  }

  return <ContractApproval brandId={brandId} />;
}
