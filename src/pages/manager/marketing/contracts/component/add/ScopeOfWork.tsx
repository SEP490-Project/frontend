import React, { memo, useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [scope, setScope] = useState<ScopeOfWorkShape>(formData?.scopeOfWork || {});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{
    isValid: boolean;
    issues: string[];
  }>({ isValid: false, issues: [] });

  // Validation logic
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

        // Check general requirements
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

      // Add other contract types validation here...
      default:
        issues.push("Unknown contract type");
    }

    return { isValid, issues };
  };

  // Update validation when scope changes
  useEffect(() => {
    const status = validateScope(scope, CONTRACT_TYPE || "");
    setValidationStatus(status);
  }, [scope, CONTRACT_TYPE]);

  // Cập nhật scope + gọi callback cha
  const updateScope = (partial: Partial<ScopeOfWorkShape>) => {
    const updated = { ...scope, ...partial };
    setScope(updated);
    onUpdateScopeOfWork(updated);
  };

  if (!CONTRACT_TYPE) {
    return (
      <div className="text-center py-20">
        <FaFileLines className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Contract Type Selected</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Please select a <strong>Contract Type</strong> from the previous step to configure the
          scope of work.
        </p>
      </div>
    );
  }

  const renderContractSpecificContent = () => {
    switch (CONTRACT_TYPE) {
      case "CO_PRODUCING":
        return <CoProducingScope formData={formData} onUpdateScopeOfWork={onUpdateScopeOfWork} />;
      case "ADVERTISING":
        return <AdvertisingScope formData={formData} onUpdateScopeOfWork={onUpdateScopeOfWork} />;
      case "AFFILIATE":
        return <AffiliateScope formData={formData} onUpdateScopeOfWork={onUpdateScopeOfWork} />;
      case "BRAND_AMBASSADOR":
        return (
          <BrandAmbassadorScope formData={formData} onUpdateScopeOfWork={onUpdateScopeOfWork} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* General Requirements */}
      <GeneralRequirements
        requirements={scope.general_requirements || []}
        onChange={(newReqs) => updateScope({ general_requirements: newReqs })}
      />

      {/* Contract-Specific Content */}
      {renderContractSpecificContent()}

      {/* Preview Section */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => setPreviewOpen(!previewOpen)}
          className="flex items-center gap-2"
        >
          {previewOpen ? "Hide Preview" : "Preview JSON"}
        </Button>

        <Button
          variant="default"
          onClick={() => {
            const normalized = {
              ...scope,
              CONTRACT_TYPE,
              deliverables: scope.deliverables || {},
            };
            onUpdateScopeOfWork(normalized);
            setPreviewOpen(true);
          }}
          className="flex items-center gap-2"
        >
          Save & Preview
        </Button>
      </div>

      {previewOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Scope of Work JSON Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs max-h-96 overflow-auto bg-gray-900 text-green-400 p-4 rounded-lg font-mono">
              {JSON.stringify({ ...scope, CONTRACT_TYPE, validation: validationStatus }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default memo(ScopeOfWork);
