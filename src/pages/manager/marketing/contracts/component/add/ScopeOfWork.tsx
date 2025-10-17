import React, { memo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaFileLines, FaCircleCheck } from "react-icons/fa6";
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
  const [scope, setScope] = useState<ScopeOfWorkShape>(formData?.scopeOfWork || {});
  const [validationStatus, setValidationStatus] = useState<{
    isValid: boolean;
    issues: string[];
  }>({ isValid: false, issues: [] });

  // Validation logic (giữ nguyên)
  const validateScope = (currentScope: any, contractType: string) => {
    const issues: string[] = [];
    let isValid = false;

    if (!contractType) {
      issues.push("Contract type is required");
      return { isValid: false, issues };
    }

    const deliverables = currentScope.deliverables || {};

    switch (contractType) {
      case "ADVERTISING": {
        const advertisingItems = deliverables.advertising_items || [];
        if (advertisingItems.length === 0) {
          issues.push("At least one advertising item is required");
        } else {
          advertisingItems.forEach((item: any, index: number) => {
            if (!item.name?.trim()) issues.push(`Ad #${index + 1}: Name is required`);
            if (!item.description?.trim()) issues.push(`Ad #${index + 1}: Description is required`);
            if (!item.platform?.trim()) issues.push(`Ad #${index + 1}: Platform is required`);
            if (!item.tagline?.trim()) issues.push(`Ad #${index + 1}: Tagline is required`);
          });
        }

        const generalReqs = currentScope.general_requirements || [];
        if (generalReqs.some((req: string) => !req.trim())) {
          issues.push("Empty general requirements should be removed");
        }

        isValid =
          advertisingItems.length > 0 &&
          advertisingItems.every(
            (item: any) =>
              item.name?.trim() &&
              item.description?.trim() &&
              item.platform?.trim() &&
              item.tagline?.trim(),
          ) &&
          (generalReqs.length === 0 || generalReqs.every((req: string) => req.trim()));
        break;
      }

      case "AFFILIATE": {
        const affiliateItems = deliverables.advertised_items || [];
        const trackingLink = deliverables.tracking_link;

        if (!trackingLink?.trim()) {
          issues.push("Tracking link is required for affiliate contracts");
        }

        if (affiliateItems.length === 0) {
          issues.push("At least one affiliate content item is required");
        } else {
          affiliateItems.forEach((item: any, index: number) => {
            if (!item.name?.trim()) issues.push(`Content #${index + 1}: Name is required`);
            if (!item.description?.trim())
              issues.push(`Content #${index + 1}: Description is required`);
          });
        }

        isValid =
          trackingLink?.trim() &&
          affiliateItems.length > 0 &&
          affiliateItems.every((item: any) => item.name?.trim() && item.description?.trim());
        break;
      }

      case "BRAND_AMBASSADOR": {
        const events = deliverables.events || [];

        if (events.length === 0) {
          issues.push("At least one event is required for brand ambassador contracts");
        } else {
          events.forEach((event: any, index: number) => {
            if (!event.name?.trim()) issues.push(`Event #${index + 1}: Name is required`);
            if (!event.location?.trim()) issues.push(`Event #${index + 1}: Location is required`);
            if (!event.date?.trim()) issues.push(`Event #${index + 1}: Date is required`);
          });
        }

        isValid =
          events.length > 0 &&
          events.every(
            (event: any) => event.name?.trim() && event.location?.trim() && event.date?.trim(),
          );
        break;
      }

      case "CO_PRODUCING": {
        const products = deliverables.products || [];

        if (products.length === 0) {
          issues.push("At least one product is required for co-producing contracts");
        } else {
          products.forEach((product: any, index: number) => {
            if (!product.name?.trim()) issues.push(`Product #${index + 1}: Name is required`);
            if (!product.description?.trim())
              issues.push(`Product #${index + 1}: Description is required`);
          });
        }

        isValid =
          products.length > 0 &&
          products.every((product: any) => product.name?.trim() && product.description?.trim());
        break;
      }

      default:
        issues.push("Unknown contract type");
    }

    return { isValid, issues };
  };

  useEffect(() => {
    const status = validateScope(scope, CONTRACT_TYPE || "");
    setValidationStatus(status);
  }, [scope, CONTRACT_TYPE]);

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
      {/* Success Status */}
      {validationStatus.isValid && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FaCircleCheck className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800">Scope of Work Complete</h4>
                <p className="text-sm text-green-700">
                  All required fields have been filled out correctly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* General Requirements */}
      <GeneralRequirements
        requirements={scope.general_requirements || []}
        onChange={(newReqs) => updateScope({ general_requirements: newReqs })}
      />

      {/* Contract-Specific Content */}
      {renderContractSpecificContent()}
    </div>
  );
};

export default memo(ScopeOfWork);
