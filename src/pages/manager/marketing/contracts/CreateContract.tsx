import React, { useState, useEffect, useCallback } from "react";
import {
  BrandSelection,
  ContractActions,
  ContractTypeTemplate,
  FinancialTerms,
  Representative,
} from "@/components/layout/manage/contract";
import { validateContract, validateField } from "@/libs/validation/contractValidation";
import brands from "./brands.json";

interface TabConfig {
  id: string;
  label: string;
  isCompleted: boolean;
  isRequired: boolean;
}

const CreateContractPage: React.FC = () => {
  const [formData, setFormData] = useState<any>({
    // Basic contract info
    brandId: "",
    parentContractId: "",
    contractNumber: "",
    type: "",

    // Dates
    signedDate: "",
    signedLocation: "",
    startDate: "",
    endDate: "",

    // Brand Representative details
    brandRepresentativeName: "",
    brandRepresentativePosition: "",
    brandRepresentativePhone: "",
    brandRepresentativeEmail: "",
    brandTaxNumber: "",
    brandBankName: "",
    brandBankAccountNumber: "",
    brandBankAccountHolder: "",

    // Web Representative details (KOL/Blogger side)
    webRepresentativeStaffId: "",
    webRepresentativeName: "",
    webRepresentativePosition: "",
    webRepresentativePhone: "",
    webRepresentativeEmail: "",
    webRepresentativeTaxNumber: "",

    // Currency
    currency: "VND",

    // JSONB fields
    financialTerms: {},
    scopeOfWork: {
      description: "",
      products: [],
      technicalRequirements: "",
      deliverables: [],
      brandingRestrictions: [],
      coProductionRoles: {},
    },
    legalTerms: {},

    // UI helper fields
    contractFiles: [],
    proposalFiles: [],
  });

  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [isExtension, setIsExtension] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [activeTab, setActiveTab] = useState("contract-info");

  const contractTypeOptions = [
    { value: "ADVERTISING", label: "Advertising Contract" },
    { value: "AFFILIATE", label: "Affiliate Marketing" },
    { value: "BRAND_AMBASSADOR", label: "Brand Ambassador" },
    { value: "CO_PRODUCING", label: "Co-Production" },
  ];

  // Contract type color mapping
  type ContractType = "ADVERTISING" | "AFFILIATE" | "BRAND_AMBASSADOR" | "CO_PRODUCING";

  const getContractTypeColor = (type: string) => {
    const colorMap: Record<ContractType, { bg: string; text: string; border: string }> = {
      ADVERTISING: {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-200",
      },

      // Affiliate -> xanh dương (mạng lưới, tin cậy)
      AFFILIATE: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
      },

      // Đại sứ -> xanh lá (tin tưởng, bền vững)
      BRAND_AMBASSADOR: {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        border: "border-emerald-200",
      },

      // Đồng sản xuất -> tím (sáng tạo, hợp tác)
      CO_PRODUCING: {
        bg: "bg-violet-100",
        text: "text-violet-800",
        border: "border-violet-200",
      },
    };

    if (type in colorMap) {
      return colorMap[type as ContractType];
    }
    return {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
    };
  };

  // Tab configuration
  const [tabs, setTabs] = useState<TabConfig[]>([
    { id: "contract-info", label: "Contract Information", isCompleted: false, isRequired: true },
    { id: "brand-selection", label: "Brand Selection", isCompleted: false, isRequired: true },
    { id: "representative", label: "Representative Info", isCompleted: false, isRequired: true },
    { id: "financial-terms", label: "Financial Terms", isCompleted: false, isRequired: true },
    { id: "contract-actions", label: "Documents & Actions", isCompleted: false, isRequired: true },
  ]);

  // Check completion status for each tab
  const checkTabCompletion = useCallback(() => {
    const newTabs = tabs.map((tab) => {
      let isCompleted = false;

      switch (tab.id) {
        case "contract-info": {
          isCompleted = !!(
            formData.type &&
            formData.contractNumber &&
            formData.signedDate &&
            formData.startDate &&
            formData.endDate &&
            formData.signedLocation &&
            formData.scopeOfWork?.description
          );
          break;
        }
        case "brand-selection": {
          isCompleted = !!formData.brandId;
          break;
        }
        case "representative": {
          isCompleted = !!(
            formData.brandRepresentativeName &&
            formData.brandRepresentativeEmail &&
            formData.webRepresentativeName &&
            formData.webRepresentativeEmail
          );
          break;
        }
        case "financial-terms": {
          if (!formData.type) {
            isCompleted = false;
          } else {
            // Common requirement: must have at least one schedule item
            const hasSchedule =
              formData.financialTerms?.schedule &&
              formData.financialTerms.schedule.length > 0 &&
              formData.financialTerms.schedule.every(
                (item: any) => item.milestone && item.amount > 0,
              );

            if (formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR") {
              // Must have total cost and schedule total must match
              const totalCost = formData.financialTerms?.totalCost || 0;
              const scheduleTotal = (formData.financialTerms?.schedule || []).reduce(
                (sum: number, item: any) => sum + (item.amount || 0),
                0,
              );

              isCompleted =
                totalCost > 0 && hasSchedule && Math.abs(totalCost - scheduleTotal) < 0.01;
            } else if (formData.type === "AFFILIATE") {
              isCompleted = !!(
                formData.financialTerms?.basePerClick > 0 &&
                formData.financialTerms?.paymentCycle &&
                formData.financialTerms?.levels &&
                formData.financialTerms.levels.length > 0 &&
                hasSchedule
              );
            } else if (formData.type === "CO_PRODUCING") {
              const validProfitSplit =
                formData.financialTerms?.profitSplitCompanyPercent > 0 &&
                formData.financialTerms?.profitSplitKolPercent > 0 &&
                formData.financialTerms.profitSplitCompanyPercent +
                  formData.financialTerms.profitSplitKolPercent ===
                  100;

              const validCapital =
                formData.financialTerms?.capitalContribution?.company?.value > 0 &&
                formData.financialTerms?.capitalContribution?.kol?.value > 0;

              isCompleted = validProfitSplit && validCapital && hasSchedule;
            }
          }
          break;
        }
        case "contract-actions": {
          const hasContractFiles = formData.contractFiles && formData.contractFiles.length > 0;
          const hasProposalFiles = formData.proposalFiles && formData.proposalFiles.length > 0;
          isCompleted = hasContractFiles && hasProposalFiles;
          break;
        }
      }

      return { ...tab, isCompleted };
    });

    setTabs(newTabs);
  }, [formData, tabs]);

  useEffect(() => {
    checkTabCompletion();
  }, [formData, checkTabCompletion]);

  // Calculate progress
  const requiredTabs = tabs.filter((tab) => tab.isRequired);
  const completedRequiredTabs = requiredTabs.filter((tab) => tab.isCompleted);
  const progressPercentage = (completedRequiredTabs.length / requiredTabs.length) * 100;
  const canSubmit = progressPercentage === 100;

  // Real-time field validation
  const handleFieldValidation = (fieldPath: string, error: string | null) => {
    setErrors((prev: any) => {
      const newErrors = { ...prev };

      // Handle nested paths
      if (fieldPath.includes(".")) {
        const [parent, child] = fieldPath.split(".");
        if (!newErrors[parent]) newErrors[parent] = {};

        if (error) {
          newErrors[parent][child] = error;
        } else {
          delete newErrors[parent][child];
          if (Object.keys(newErrors[parent]).length === 0) {
            delete newErrors[parent];
          }
        }
      } else {
        if (error) {
          newErrors[fieldPath] = error;
        } else {
          delete newErrors[fieldPath];
        }
      }

      return newErrors;
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Handle nested JSONB field updates
  const updateFinancialTerms = async (updates: any) => {
    const newFinancialTerms = { ...formData.financialTerms, ...updates };
    setFormData((prev: any) => ({
      ...prev,
      financialTerms: newFinancialTerms,
    }));

    // Validate financial terms fields
    for (const [key, value] of Object.entries(updates)) {
      const validation = await validateField(`financialTerms.${key}`, value, {
        ...formData,
        financialTerms: newFinancialTerms,
      });
      handleFieldValidation(`financialTerms.${key}`, validation.isValid ? null : validation.error);
    }
  };

  const updateScopeOfWork = (updates: any) => {
    setFormData((prev: any) => ({
      ...prev,
      scopeOfWork: { ...prev.scopeOfWork, ...updates },
    }));
  };

  const handleBrandChange = (id: string | null) => {
    handleInputChange("brandId", id || "");
    const brand = brands.find((b) => b.id === id) || null;
    setSelectedBrand(brand);

    // Auto-fill brand representative info if available
    if (brand) {
      handleInputChange("brandRepresentativeName", brand.representative);
      handleInputChange("brandRepresentativeEmail", brand.representative_email);
      handleInputChange("brandRepresentativePhone", brand.representative_phone);
    }
  };

  const handleExtensionChange = (checked: boolean) => {
    setIsExtension(checked);
    if (!checked) handleInputChange("parentContractId", "");
  };

  // Initialize financial terms based on contract type
  const handleContractTypeChange = async (type: string) => {
    handleInputChange("type", type);

    // Validate contract type
    const validation = await validateField("type", type, { ...formData, type });
    handleFieldValidation("type", validation.isValid ? null : validation.error);

    let defaultFinancialTerms = {};
    const defaultScopeOfWork = { ...formData.scopeOfWork };

    // Set empty defaults for all types - user must fill in
    switch (type) {
      case "ADVERTISING":
      case "BRAND_AMBASSADOR": {
        defaultFinancialTerms = {
          model: "fixed",
          paymentMethod: "Chuyển khoản",
          totalCost: 0,
          costBreakdown: {
            serviceFee: 0,
            otherFees: 0,
          },
          schedule: [],
        };
        break;
      }

      case "AFFILIATE": {
        defaultFinancialTerms = {
          model: "levels",
          paymentMethod: "Chuyển khoản",
          basePerClick: 0,
          levels: [],
          paymentCycle: "",
          paymentDate: "",
          taxWithholding: {
            threshold: 2000000,
            ratePercent: 10,
          },
          schedule: [],
        };
        break;
      }

      case "CO_PRODUCING": {
        defaultFinancialTerms = {
          model: "share",
          paymentMethod: "Chuyển khoản",
          capitalContribution: {
            company: { description: "", value: 0 },
            kol: { description: "", value: 0 },
          },
          profitSplitCompanyPercent: 0,
          profitSplitKolPercent: 0,
          profitDistributionCycle: "",
          profitDistributionDate: "",
          schedule: [],
        };

        defaultScopeOfWork.coProductionRoles = {
          company: "",
          kol: "",
        };
        break;
      }
    }

    setFormData((prev: any) => ({
      ...prev,
      type,
      financialTerms: defaultFinancialTerms,
      scopeOfWork: defaultScopeOfWork,
    }));
  };

  // File handlers
  const handleContractFilesChange = (files: File[]) => {
    handleInputChange("contractFiles", files);
  };

  const handleProposalFilesChange = (files: File[]) => {
    handleInputChange("proposalFiles", files);
  };

  const handleContractUpload = async (files: File[]) => {
    try {
      console.log("Uploading contract files:", files);
    } catch (error) {
      console.error("Contract upload failed:", error);
      throw error;
    }
  };

  const handleProposalUpload = async (files: File[]) => {
    try {
      console.log("Uploading proposal files:", files);
    } catch (error) {
      console.error("Proposal upload failed:", error);
      throw error;
    }
  };

  const handleSaveDraft = async () => {
    try {
      console.log("Saving draft:", formData);
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Save draft failed:", error);
      alert("Failed to save draft. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      alert("Please complete all required sections before submitting.");
      return;
    }

    try {
      // Final validation
      const validation = await validateContract(formData);

      if (!validation.isValid) {
        setErrors(validation.errors);

        // Scroll to first error
        const firstErrorElement = document.querySelector(".border-red-500");
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        return;
      }

      // Submit form data
      console.log("Final form data:", formData);

      // Here you would typically make an API call
      // await submitContract(formData);

      // Show success message or redirect
      alert("Contract submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      setErrors({ general: "Failed to submit contract. Please try again." });
    }
  };

  const getSelectedContractTypeLabel = () => {
    const selectedType = contractTypeOptions.find((option) => option.value === formData.type);
    return selectedType ? selectedType.label : "Not Selected";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "contract-info":
        return (
          <ContractTypeTemplate
            formData={formData}
            onContractTypeChange={handleContractTypeChange}
            onInputChange={handleInputChange}
            onUpdateScopeOfWork={updateScopeOfWork}
            onFieldValidation={handleFieldValidation}
            errors={errors}
          />
        );
      case "brand-selection":
        return (
          <BrandSelection
            formData={formData}
            selectedBrand={selectedBrand}
            isExtension={isExtension}
            contractTypeOptions={contractTypeOptions}
            onBrandChange={handleBrandChange}
            onExtensionChange={handleExtensionChange}
            onInputChange={handleInputChange}
          />
        );
      case "representative":
        return (
          <Representative formData={formData} onInputChange={handleInputChange} errors={errors} />
        );
      case "financial-terms":
        return (
          <FinancialTerms
            formData={formData}
            contractTypeOptions={contractTypeOptions}
            onContractTypeChange={handleContractTypeChange}
            onUpdateFinancialTerms={updateFinancialTerms}
            errors={errors}
          />
        );
      case "contract-actions":
        return (
          <ContractActions
            formData={formData}
            onContractFilesChange={handleContractFilesChange}
            onProposalFilesChange={handleProposalFilesChange}
            onContractUpload={handleContractUpload}
            onProposalUpload={handleProposalUpload}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Contract Type Display */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Add New Contract</h1>
            {formData.type && (
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                    getContractTypeColor(formData.type).bg
                  } ${getContractTypeColor(formData.type).text} ${
                    getContractTypeColor(formData.type).border
                  }`}
                >
                  {getSelectedContractTypeLabel()}
                </span>
              </div>
            )}
          </div>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Draft
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                  activeTab === tab.id
                    ? "border-primary/90 text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.isCompleted && (
                  <svg
                    className="ml-2 h-4 w-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {tab.isRequired && !tab.isCompleted && <span className="ml-1 text-red-500">*</span>}
              </button>
            ))}
          </nav>
        </div>

        {errors.general && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Tab Content */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {renderTabContent()}

          {/* Submit Button - Only show in the last tab or when all required tabs are complete */}
          {(activeTab === "contract-actions" || canSubmit) && (
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Draft
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className={`px-6 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  canSubmit
                    ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {canSubmit
                  ? "Submit Contract"
                  : `Complete Required Sections (${Math.round(progressPercentage)}%)`}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateContractPage;
