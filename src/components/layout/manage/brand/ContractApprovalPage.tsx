import { useParams } from "react-router-dom";
import ContractApproval from "./ContractApproval";
import { getBrandIdFromToken } from "@/libs/helper";

// Wrapper component that gets brand ID from router params or JWT token
export default function ContractApprovalPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const tokenBrandId = getBrandIdFromToken();

  // Use URL param if available, otherwise use JWT token, otherwise show error
  if (!brandId && !tokenBrandId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Brand ID Required</h2>
          <p className="text-gray-600">Please log in to view contracts.</p>
        </div>
      </div>
    );
  }

  return <ContractApproval brandId={brandId || tokenBrandId || undefined} />;
}
