import { useNavigate } from "react-router-dom";
import { ViolationList } from "@/components/manage/marketing/violation";
import type { ViolationListItem } from "@/libs/types/violation";

const ViolationPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectViolation = (violation: ViolationListItem) => {
    // Navigate to the contract detail page where the violation can be managed
    navigate(`/manage/marketing/contracts/${violation.contract_id}`);
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <ViolationList onSelectViolation={handleSelectViolation} />
    </div>
  );
};

export default ViolationPage;
