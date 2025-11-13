import React, { memo, useState } from "react";
import { FaFileLines } from "react-icons/fa6";
import { GeneralRequirements } from "./shared/SharedComponents";
import {
  AdvertisingScope,
  AffiliateScope,
  BrandAmbassadorScope,
  CoProducingScope,
} from "./scopeOfWorkScope";
import type { ScopeOfWorkShape, CONTRACT_TYPE } from "./types/scopeTypes";

interface ScopeOfWorkProps {
  formData: any;
  onUpdateScopeOfWork: (updates: any) => void;
}

const ScopeOfWork: React.FC<ScopeOfWorkProps> = ({ formData, onUpdateScopeOfWork }) => {
  const CONTRACT_TYPE: CONTRACT_TYPE | undefined = formData?.type;
  const [scope, setScope] = useState<ScopeOfWorkShape>(formData?.scope_of_work || {}); // Changed from scopeOfWork to scope_of_work

  const updateScope = (partial: Partial<ScopeOfWorkShape>) => {
    setScope((prev) => {
      const updated = {
        ...prev,
        ...partial,
        deliverables: {
          ...prev.deliverables,
          ...partial.deliverables,
        },
      };
      onUpdateScopeOfWork(updated);
      return updated;
    });
  };

  if (!CONTRACT_TYPE) {
    return (
      <div className="text-center py-20">
        <FaFileLines className="w-16 h-16 mx-auto mb-4" style={{ color: "#ff9fb2" }} />
        <h3 className="text-lg font-medium text-pink-900 mb-2">No Contract Type Selected</h3>
        <p className="text-pink-700 max-w-sm mx-auto">
          Please select a <strong>Contract Type</strong> from the previous step to configure the
          scope of work.
        </p>
      </div>
    );
  }

  const renderContractSpecificContent = () => {
    switch (CONTRACT_TYPE) {
      case "CO_PRODUCING":
        return <CoProducingScope formData={formData} onUpdateScopeOfWork={updateScope} />;
      case "ADVERTISING":
        return <AdvertisingScope formData={formData} onUpdateScopeOfWork={updateScope} />;
      case "AFFILIATE":
        return <AffiliateScope formData={formData} onUpdateScopeOfWork={updateScope} />;
      case "BRAND_AMBASSADOR":
        return <BrandAmbassadorScope formData={formData} onUpdateScopeOfWork={updateScope} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* General Requirements */}
      <GeneralRequirements
        requirements={scope.general_requirements || [""]} // Changed from general_requirements to general_requirements
        onChange={(newReqs) => updateScope({ general_requirements: newReqs })}
      />

      {renderContractSpecificContent()}
    </div>
  );
};

export default memo(ScopeOfWork);
