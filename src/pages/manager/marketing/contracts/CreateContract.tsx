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

// Constants
const CONTRACT_TYPE_OPTIONS = [
  { value: "ADVERTISING", label: "Advertising Contract" },
  { value: "AFFILIATE", label: "Affiliate Marketing" },
  { value: "BRAND_AMBASSADOR", label: "Brand Ambassador" },
  { value: "CO_PRODUCING", label: "Co-Production" },
];

const CONTRACT_TYPE_COLORS = {
  ADVERTISING: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
  AFFILIATE: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
  BRAND_AMBASSADOR: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
  CO_PRODUCING: { bg: "bg-violet-100", text: "text-violet-800", border: "border-violet-200" },
} as const;

const INITIAL_TABS: TabConfig[] = [
  { id: "contract-info", label: "Contract Information", isCompleted: false, isRequired: true },
  { id: "brand-selection", label: "Brand Selection", isCompleted: false, isRequired: true },
  { id: "representative", label: "Representative Info", isCompleted: false, isRequired: true },
  { id: "financial-terms", label: "Financial Terms", isCompleted: false, isRequired: true },
  { id: "contract-actions", label: "Documents & Actions", isCompleted: false, isRequired: true },
];

const INITIAL_FORM_DATA = {
  brandId: "",
  parentContractId: "",
  contractNumber: "",
  type: "",
  signedDate: "",
  signedLocation: "",
  startDate: "",
  endDate: "",
  brandRepresentativeName: "",
  brandRepresentativePosition: "",
  brandRepresentativePhone: "",
  brandRepresentativeEmail: "",
  brandTaxNumber: "",
  brandBankName: "",
  brandBankAccountNumber: "",
  brandBankAccountHolder: "",
  webRepresentativeStaffId: "",
  webRepresentativeName: "",
  webRepresentativePosition: "",
  webRepresentativePhone: "",
  webRepresentativeEmail: "",
  webRepresentativeTaxNumber: "",
  currency: "VND",
  financialTerms: {},
  scopeOfWork: {},
  legalTerms: {},
  contractFiles: [],
  proposalFiles: [],
};

// Helper functions
const getContractTypeColor = (type: string) => {
  return (
    CONTRACT_TYPE_COLORS[type as keyof typeof CONTRACT_TYPE_COLORS] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
    }
  );
};

const getDefaultFinancialTerms = (type: string) => {
  const baseTerms = { paymentMethod: "Chuyển khoản", schedule: [] };

  switch (type) {
    case "ADVERTISING":
    case "BRAND_AMBASSADOR":
      return {
        ...baseTerms,
        model: "fixed",
        totalCost: 0,
        costBreakdown: { serviceFee: 0, otherFees: 0 },
      };

    case "AFFILIATE":
      return {
        ...baseTerms,
        model: "levels",
        basePerClick: 0,
        levels: [],
        paymentCycle: "",
        paymentDate: "",
        taxWithholding: { threshold: 2000000, ratePercent: 10 },
      };

    case "CO_PRODUCING":
      return {
        ...baseTerms,
        model: "share",
        capitalContribution: {
          company: { description: "", value: 0 },
          kol: { description: "", value: 0 },
        },
        profitSplitCompanyPercent: 0,
        profitSplitKolPercent: 0,
        profitDistributionCycle: "",
        profitDistributionDate: "",
      };

    default:
      return baseTerms;
  }
};

const checkTabCompletionLogic = (tabId: string, formData: any): boolean => {
  switch (tabId) {
    case "contract-info":
      return !!(
        formData.type &&
        formData.contractNumber &&
        formData.signedDate &&
        formData.startDate &&
        formData.endDate &&
        formData.signedLocation &&
        formData.scopeOfWork?.description
      );

    case "brand-selection":
      return !!formData.brandId;

    case "representative":
      return !!(
        formData.brandRepresentativeName &&
        formData.brandRepresentativeEmail &&
        formData.webRepresentativeName &&
        formData.webRepresentativeEmail
      );

    case "financial-terms": {
      if (!formData.type) return false;

      const hasSchedule =
        formData.financialTerms?.schedule?.length > 0 &&
        formData.financialTerms.schedule.every((item: any) => item.milestone && item.amount > 0);

      if (formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR") {
        const totalCost = formData.financialTerms?.totalCost || 0;
        const scheduleTotal = (formData.financialTerms?.schedule || []).reduce(
          (sum: number, item: any) => sum + (item.amount || 0),
          0,
        );
        return totalCost > 0 && hasSchedule && Math.abs(totalCost - scheduleTotal) < 0.01;
      }

      if (formData.type === "AFFILIATE") {
        return !!(
          formData.financialTerms?.basePerClick > 0 &&
          formData.financialTerms?.paymentCycle &&
          formData.financialTerms?.levels?.length > 0 &&
          hasSchedule
        );
      }

      if (formData.type === "CO_PRODUCING") {
        const validProfitSplit =
          formData.financialTerms?.profitSplitCompanyPercent > 0 &&
          formData.financialTerms?.profitSplitKolPercent > 0 &&
          formData.financialTerms.profitSplitCompanyPercent +
            formData.financialTerms.profitSplitKolPercent ===
            100;
        const validCapital =
          formData.financialTerms?.capitalContribution?.company?.value > 0 &&
          formData.financialTerms?.capitalContribution?.kol?.value > 0;
        return validProfitSplit && validCapital && hasSchedule;
      }
      return false;
    }

    case "contract-actions":
      return formData.contractFiles?.length > 0 && formData.proposalFiles?.length > 0;

    default:
      return false;
  }
};

const CreateContractPage: React.FC = () => {
  const [formData, setFormData] = useState<any>(INITIAL_FORM_DATA);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [isExtension, setIsExtension] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [activeTab, setActiveTab] = useState("contract-info");
  const [tabs, setTabs] = useState<TabConfig[]>(INITIAL_TABS);

  // Check completion status for each tab
  const checkTabCompletion = useCallback(() => {
    setTabs((currentTabs) =>
      currentTabs.map((tab) => ({
        ...tab,
        isCompleted: checkTabCompletionLogic(tab.id, formData),
      })),
    );
  }, [formData]);

  useEffect(() => {
    checkTabCompletion();
  }, [checkTabCompletion]);

  // Calculate progress
  const requiredTabs = tabs.filter((tab) => tab.isRequired);
  const completedRequiredTabs = requiredTabs.filter((tab) => tab.isCompleted);
  const progressPercentage = (completedRequiredTabs.length / requiredTabs.length) * 100;
  const canSubmit = progressPercentage === 100;

  // Handlers
  const handleFieldValidation = (fieldPath: string, error: string | null) => {
    setErrors((prev: any) => {
      const newErrors = { ...prev };

      if (fieldPath.includes(".")) {
        const [parent, child] = fieldPath.split(".");
        if (!newErrors[parent]) newErrors[parent] = {};

        if (error) {
          newErrors[parent][child] = error;
        } else {
          delete newErrors[parent][child];
          if (Object.keys(newErrors[parent]).length === 0) delete newErrors[parent];
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

  const updateFinancialTerms = async (updates: any) => {
    const newFinancialTerms = { ...formData.financialTerms, ...updates };
    setFormData((prev: typeof INITIAL_FORM_DATA) => ({
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
    setFormData((prev: typeof INITIAL_FORM_DATA) => ({
      ...prev,
      scopeOfWork: { ...prev.scopeOfWork, ...updates },
    }));
  };

  const handleBrandChange = (id: string | null) => {
    handleInputChange("brandId", id || "");
    const brand = brands.find((b) => b.id === id) || null;
    setSelectedBrand(brand);

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

  const handleContractTypeChange = async (type: string) => {
    handleInputChange("type", type);

    const validation = await validateField("type", type, { ...formData, type });
    handleFieldValidation("type", validation.isValid ? null : validation.error);

    const defaultFinancialTerms = getDefaultFinancialTerms(type);
    const defaultScopeOfWork = { ...formData.scopeOfWork };

    if (type === "CO_PRODUCING") {
      defaultScopeOfWork.coProductionRoles = { company: "", kol: "" };
    }

    setFormData((prev: typeof INITIAL_FORM_DATA) => ({
      ...prev,
      type,
      financialTerms: defaultFinancialTerms,
      scopeOfWork: defaultScopeOfWork,
    }));
  };

  // File handlers (simplified)
  const handleContractFilesChange = (files: File[]) => handleInputChange("contractFiles", files);
  const handleProposalFilesChange = (files: File[]) => handleInputChange("proposalFiles", files);

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
      const validation = await validateContract(formData);

      if (!validation.isValid) {
        setErrors(validation.errors);
        document.querySelector(".border-red-500")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }

      console.log("Final form data:", formData);
      alert("Contract submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      setErrors({ general: "Failed to submit contract. Please try again." });
    }
  };

  const getSelectedContractTypeLabel = () => {
    return (
      CONTRACT_TYPE_OPTIONS.find((option) => option.value === formData.type)?.label ||
      "Not Selected"
    );
  };

  const renderTabContent = () => {
    const componentProps = {
      formData,
      onInputChange: handleInputChange,
      errors,
    };

    switch (activeTab) {
      case "contract-info":
        return (
          <ContractTypeTemplate
            {...componentProps}
            onContractTypeChange={handleContractTypeChange}
            onUpdateScopeOfWork={updateScopeOfWork}
            onFieldValidation={handleFieldValidation}
          />
        );
      case "brand-selection":
        return (
          <BrandSelection
            {...componentProps}
            selectedBrand={selectedBrand}
            isExtension={isExtension}
            contractTypeOptions={CONTRACT_TYPE_OPTIONS}
            onBrandChange={handleBrandChange}
            onExtensionChange={handleExtensionChange}
          />
        );
      case "representative":
        return <Representative {...componentProps} />;
      case "financial-terms":
        return (
          <FinancialTerms
            {...componentProps}
            contractTypeOptions={CONTRACT_TYPE_OPTIONS}
            onContractTypeChange={handleContractTypeChange}
            onUpdateFinancialTerms={updateFinancialTerms}
          />
        );
      case "contract-actions":
        return (
          <ContractActions
            {...componentProps}
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

  const contractTypeColor = getContractTypeColor(formData.type);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto pb-28">
        {" "}
        {/* Thêm pb-28 ở đây */}
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Add New Contract</h1>
            {formData.type && (
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${contractTypeColor.bg} ${contractTypeColor.text} ${contractTypeColor.border}`}
                >
                  {getSelectedContractTypeLabel()}
                </span>
              </div>
            )}
          </div>
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
            />
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
        </form>
        {/* Fixed Action Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-white/90 border-t border-gray-200 z-50 px-4 py-3 flex justify-end gap-4 shadow-lg">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={`px-6 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              canSubmit
                ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Request Contract Approval
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateContractPage;
