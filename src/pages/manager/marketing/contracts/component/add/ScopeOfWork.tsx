import React, { memo, useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FaFileLines,
  FaEye,
  FaEyeSlash,
  FaFloppyDisk,
  FaTriangleExclamation,
  FaCircleCheck,
} from "react-icons/fa6";
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
      {/* Validation Status Bar */}
      {validationStatus.issues.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <FaTriangleExclamation className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 mb-2">Validation Issues</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  {validationStatus.issues.map((issue, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Action Bar */}
      <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h4 className="font-medium text-pink-900 flex items-center gap-2">
                  <FaFileLines className="w-4 h-4" />
                  Scope of Work Status
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={validationStatus.isValid ? "default" : "secondary"}
                    className={
                      validationStatus.isValid
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }
                  >
                    {validationStatus.isValid
                      ? "Complete"
                      : `${validationStatus.issues.length} Issue${validationStatus.issues.length > 1 ? "s" : ""}`}
                  </Badge>
                  <span className="text-sm text-pink-700">
                    Contract Type: {CONTRACT_TYPE.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setPreviewOpen(!previewOpen)}
                className="flex items-center gap-2 border-pink-200 text-pink-700 hover:bg-pink-50"
              >
                {previewOpen ? (
                  <>
                    <FaEyeSlash className="w-4 h-4" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <FaEye className="w-4 h-4" />
                    Preview JSON
                  </>
                )}
              </Button>

              <Button
                onClick={() => {
                  const normalized = {
                    ...scope,
                    CONTRACT_TYPE,
                    deliverables: scope.deliverables || {},
                  };
                  onUpdateScopeOfWork(normalized);
                  setPreviewOpen(true);
                }}
                className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white"
                style={{ backgroundColor: "#ff9fb2" }}
              >
                <FaFloppyDisk className="w-4 h-4" />
                Save & Preview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {previewOpen && (
        <Card className="border-pink-200">
          <CardHeader className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100">
            <CardTitle className="flex items-center gap-2 text-pink-900">
              <FaFileLines className="w-5 h-5" style={{ color: "#ff9fb2" }} />
              Scope of Work JSON Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre
                className="text-xs max-h-96 overflow-auto bg-gray-900 text-green-400 p-4 rounded-lg font-mono border-2"
                style={{ borderColor: "#ff9fb2" }}
              >
                {JSON.stringify({ ...scope, CONTRACT_TYPE, validation: validationStatus }, null, 2)}
              </pre>
              <div className="absolute top-2 right-2">
                <Badge className="bg-pink-100 text-pink-800 border border-pink-200">
                  {validationStatus.isValid ? "Valid" : "Invalid"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default memo(ScopeOfWork);
