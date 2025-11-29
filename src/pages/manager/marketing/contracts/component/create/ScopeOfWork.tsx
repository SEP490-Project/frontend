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
  const [scope, setScope] = useState<ScopeOfWorkShape>(formData?.scope_of_work || {});

  const updateScope = (partial: Partial<ScopeOfWorkShape>) => {
    setScope((prev) => {
      const updated = {
        ...prev,
        ...partial,
        deliverables: partial.deliverables !== undefined ? partial.deliverables : prev.deliverables,
      };
      onUpdateScopeOfWork(updated);
      return updated;
    });
  };

  if (!CONTRACT_TYPE) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <FaFileLines className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Contract Type Selected</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-gray-700">
            Please select a <strong className="text-blue-700">Contract Type</strong> from the
            previous step to configure the scope of work.
          </p>
        </div>
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
      <GeneralRequirements
        requirements={scope.general_requirements || [""]}
        onChange={(newReqs) => updateScope({ general_requirements: newReqs })}
      />

      {renderContractSpecificContent()}
    </div>
  );
};

export default memo(ScopeOfWork);
