import React, { useState, useEffect } from "react";
import {
  ContractFiles,
  ContractInformation,
  FinancialTerms,
  LegalTerms,
  ScopeOfWork,
} from "./component/add";
import {
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaRotateLeft,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { validateContract, validateField } from "./validation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const INITIAL_TABS = [
  { id: "contract-info", label: "Contract Information", isRequired: true, step: 1 },
  { id: "scope-of-work", label: "Scope of Work", isRequired: true, step: 2 },
  { id: "financial-terms", label: "Financial Terms", isRequired: true, step: 3 },
  { id: "legal-terms", label: "Legal Terms", isRequired: true, step: 4 },
  { id: "contract-actions", label: "Documents & Actions", isRequired: true, step: 5 },
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
  financialTerms: {},
  scopeOfWork: {},
  legalTerms: {},
  contractFiles: [],
  proposalFiles: [],
};

// Helper functions
const getContractTypeColor = (type: string) =>
  CONTRACT_TYPE_COLORS[type as keyof typeof CONTRACT_TYPE_COLORS] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
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

const TAB_COMPONENTS: Record<string, React.FC<any>> = {
  "contract-info": ContractInformation,
  "scope-of-work": ScopeOfWork,
  "financial-terms": FinancialTerms,
  "legal-terms": LegalTerms,
  "contract-actions": ContractFiles,
};

const checkTabCompletionLogic = (tabId: string, formData: any): boolean => {
  switch (tabId) {
    case "contract-info":
      return !!(
        formData.type &&
        formData.contractNumber &&
        formData.signedDate &&
        formData.startDate && // This should now be auto-filled from signedDate
        formData.endDate &&
        formData.signedLocation &&
        formData.brandBankName &&
        formData.brandBankAccountNumber &&
        formData.brandBankAccountHolder
      );
    case "scope-of-work": {
      if (!formData.type) return false;
      const scopeOfWork = formData.scopeOfWork || {};
      console.log("Scope of Work:", scopeOfWork); // Debugging line

      if (formData.type === "ADVERTISING") {
        return !!(scopeOfWork.contents?.length > 0);
      }
      if (formData.type === "AFFILIATE") {
        return !!(scopeOfWork.contents?.length > 0);
      }
      if (formData.type === "CO_PRODUCING") {
        return !!(scopeOfWork.products?.length > 0);
      }
      if (formData.type === "BRAND_AMBASSADOR") {
        return !!(scopeOfWork.events?.length > 0);
      }
      return false;
    }
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
    case "legal-terms":
      return !!formData.legalTerms?.compensationPercent;
    case "contract-actions":
      return formData.contractFiles?.length > 0 && formData.proposalFiles?.length > 0;
    default:
      return false;
  }
};

const AddContractPage: React.FC = () => {
  const [formData, setFormData] = useState<any>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<any>({});
  const [activeTab, setActiveTab] = useState(INITIAL_TABS[0].id);
  const [currentStep, setCurrentStep] = useState(1);
  const [tabs, setTabs] = useState(INITIAL_TABS.map((tab) => ({ ...tab, isCompleted: false })));

  // Modal states
  const [showTypeChangeModal, setShowTypeChangeModal] = useState(false);
  const [pendingNewType, setPendingNewType] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);

  // Check completion status for each tab
  useEffect(() => {
    setTabs((currentTabs) =>
      currentTabs.map((tab) => ({
        ...tab,
        isCompleted: checkTabCompletionLogic(tab.id, formData),
      })),
    );
  }, [formData]);

  // Calculate progress
  const requiredTabs = tabs.filter((tab) => tab.isRequired);
  const completedRequiredTabs = requiredTabs.filter((tab) => tab.isCompleted);
  const progressPercentage = (completedRequiredTabs.length / requiredTabs.length) * 100;
  const canSubmit = progressPercentage === 100;

  // Check if contract type should be locked (after step 1 and when there's data in subsequent steps)
  const hasDataBeyondStep1 = () => {
    return (
      Object.keys(formData.scopeOfWork || {}).length > 0 ||
      Object.keys(formData.financialTerms || {}).length > 0 ||
      Object.keys(formData.legalTerms || {}).length > 0 ||
      formData.contractFiles?.length > 0 ||
      formData.proposalFiles?.length > 0
    );
  };

  const isTypeLockedMode = formData.type && hasDataBeyondStep1();

  // Navigation functions
  const getCurrentTab = () => tabs.find((tab) => tab.step === currentStep);
  const canGoNext = () => {
    const currentTab = getCurrentTab();
    return currentTab ? currentTab.isCompleted && currentStep < INITIAL_TABS.length : false;
  };
  const canGoPrevious = () => currentStep > 1;

  const handleNext = () => {
    if (canGoNext()) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const nextTab = tabs.find((tab) => tab.step === nextStep);
      if (nextTab) {
        setActiveTab(nextTab.id);
      }
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious()) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      const prevTab = tabs.find((tab) => tab.step === prevStep);
      if (prevTab) {
        setActiveTab(prevTab.id);
      }
    }
  };

  const handleTabChange = (tabId: string) => {
    const selectedTab = tabs.find((tab) => tab.id === tabId);
    if (!selectedTab) return;

    // Allow access to all completed steps + next step
    const completedSteps = tabs.filter((tab) => tab.isCompleted).length;
    const maxAllowedStep = Math.min(completedSteps + 1, INITIAL_TABS.length);

    if (selectedTab.step <= maxAllowedStep) {
      setCurrentStep(selectedTab.step);
      setActiveTab(tabId);
    }
  };

  const handleReset = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setCurrentStep(1);
    setActiveTab(INITIAL_TABS[0].id);
    setShowResetModal(false);
  };

  const cancelReset = () => {
    setShowResetModal(false);
  };

  // Contract type change handlers
  const handleTypeChangeRequest = (newType: string) => {
    if (isTypeLockedMode) {
      setPendingNewType(newType);
      setShowTypeChangeModal(true);
    } else {
      handleContractTypeChange(newType);
    }
  };

  const confirmTypeChange = () => {
    // Clear all data from step 2 onwards
    const clearedFormData = {
      ...INITIAL_FORM_DATA,
      // Keep step 1 data except type
      brandId: formData.brandId,
      parentContractId: formData.parentContractId,
      contractNumber: formData.contractNumber,
      signedDate: formData.signedDate,
      signedLocation: formData.signedLocation,
      startDate: formData.startDate,
      endDate: formData.endDate,
      brandRepresentativeName: formData.brandRepresentativeName,
      brandRepresentativePosition: formData.brandRepresentativePosition,
      brandRepresentativePhone: formData.brandRepresentativePhone,
      brandRepresentativeEmail: formData.brandRepresentativeEmail,
      brandTaxNumber: formData.brandTaxNumber,
      brandBankName: formData.brandBankName,
      brandBankAccountNumber: formData.brandBankAccountNumber,
      brandBankAccountHolder: formData.brandBankAccountHolder,
      webRepresentativeStaffId: formData.webRepresentativeStaffId,
      webRepresentativeName: formData.webRepresentativeName,
      webRepresentativePosition: formData.webRepresentativePosition,
      webRepresentativePhone: formData.webRepresentativePhone,
      webRepresentativeEmail: formData.webRepresentativeEmail,
      webRepresentativeTaxNumber: formData.webRepresentativeTaxNumber,
      currency: formData.currency,
      // Set new type and its defaults
      type: pendingNewType,
      financialTerms: getDefaultFinancialTerms(pendingNewType),
      scopeOfWork:
        pendingNewType === "CO_PRODUCING" ? { coProductionRoles: { company: "", kol: "" } } : {},
    };

    setFormData(clearedFormData);
    setErrors({});

    // Close modal
    setShowTypeChangeModal(false);
    setPendingNewType("");
  };

  const cancelTypeChange = () => {
    setShowTypeChangeModal(false);
    setPendingNewType("");
  };

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
      // Log JSON gửi backend
      console.log("JSON gửi backend:", JSON.stringify(formData, null, 2));
      alert("Contract submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      setErrors({ general: "Failed to submit contract. Please try again." });
    }
  };

  // Render tab content dynamically
  const renderTabContent = (tabId: string) => {
    const componentProps = {
      formData,
      onInputChange: handleInputChange,
      errors,
      onContractTypeChange: handleTypeChangeRequest, // Use the new handler
      onUpdateScopeOfWork: updateScopeOfWork,
      onFieldValidation: handleFieldValidation,
      contractTypeOptions: CONTRACT_TYPE_OPTIONS,
      onUpdateFinancialTerms: updateFinancialTerms,
      onContractFilesChange: handleContractFilesChange,
      onProposalFilesChange: handleProposalFilesChange,
      onContractUpload: handleContractUpload,
      onProposalUpload: handleProposalUpload,
      onSubmit: handleSubmit,
      isTypeLockedMode, // Pass the lock status to components
    };
    const TabComponent = TAB_COMPONENTS[tabId];
    return TabComponent ? <TabComponent {...componentProps} /> : null;
  };

  const contractTypeColor = getContractTypeColor(formData.type);

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="max-w-7xl mx-auto pb-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold">Add New Contract</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <FaRotateLeft className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          {formData.type && (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${contractTypeColor.bg} ${contractTypeColor.text} ${contractTypeColor.border}`}
            >
              {CONTRACT_TYPE_OPTIONS.find((option) => option.value === formData.type)?.label ||
                "Not Selected"}
            </span>
          )}
        </div>

        {/* Step Indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Step {currentStep} of {INITIAL_TABS.length}
            </span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="flex w-full">
              {tabs.map((tab) => {
                const completedSteps = tabs.filter((t) => t.isCompleted).length;
                const maxAllowedStep = Math.min(completedSteps + 1, INITIAL_TABS.length);
                const isAccessible = tab.step <= maxAllowedStep;

                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`flex-1 justify-center ${
                      !isAccessible ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!isAccessible}
                  >
                    <span className="mr-2 text-xs bg-gray-200 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center">
                      {tab.step}
                    </span>
                    {tab.label}
                    {tab.isCompleted && <FaCheck className="ml-2 h-3 w-3 text-green-500" />}
                    {tab.isRequired && !tab.isCompleted && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                {activeTab === tab.id && renderTabContent(tab.id)}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {errors.general && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{errors.general}</p>
          </div>
        )}
      </div>

      {/* Fixed Action Bar */}
      <div className="sticky bottom-0 -mx-2 bg-white/80 border-t rounded-xl border-gray-200 shadow-lg z-40">
        <div className="flex justify-between items-center px-4 py-3">
          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={!canGoPrevious()}
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            {currentStep < INITIAL_TABS.length && (
              <Button type="button" onClick={handleNext} disabled={!canGoNext()}>
                Next
                <FaArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            Create Draft Contract
          </Button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaTriangleExclamation className="h-5 w-5 text-red-500" />
              Reset All Data
            </DialogTitle>
            <DialogDescription className="text-left">
              <div className="space-y-3">
                <p>Are you sure you want to reset all data? This action cannot be undone.</p>
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm font-medium">
                    ⚠️ Warning: All the following data will be permanently deleted:
                  </p>
                  <ul className="mt-2 text-red-700 text-sm list-disc list-inside space-y-1">
                    <li>Contract Information</li>
                    <li>Scope of Work</li>
                    <li>Financial Terms</li>
                    <li>Legal Terms</li>
                    <li>Uploaded Documents</li>
                  </ul>
                  <p className="mt-2 text-red-800 text-sm">
                    You will be returned to Step 1 and need to start over.
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelReset}>
              Cancel
            </Button>
            <Button onClick={confirmReset} className="bg-red-600 hover:bg-red-700 text-white">
              Reset All Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contract Type Change Confirmation Modal */}
      <Dialog open={showTypeChangeModal} onOpenChange={setShowTypeChangeModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaTriangleExclamation className="h-5 w-5 text-amber-500" />
              Change Contract Type
            </DialogTitle>
            <DialogDescription className="text-left">
              <div className="space-y-3">
                <p>
                  Are you sure you want to change the contract type from{" "}
                  <span className="font-semibold">
                    {CONTRACT_TYPE_OPTIONS.find((opt) => opt.value === formData.type)?.label}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold">
                    {CONTRACT_TYPE_OPTIONS.find((opt) => opt.value === pendingNewType)?.label}
                  </span>{" "}
                  ?
                </p>
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm font-medium">
                    ⚠️ Warning: If you change the type, all data you have entered in the subsequent
                    steps will be deleted:
                  </p>
                  <ul className="mt-2 text-red-700 text-sm list-disc list-inside space-y-1">
                    <li>Scope of Work</li>
                    <li>Financial Terms</li>
                    <li>Legal Terms</li>
                    <li>Uploaded Documents</li>
                  </ul>
                  <p className="mt-2 text-red-800 text-sm">Step 1 data will be preserved.</p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelTypeChange}>
              Cancel
            </Button>
            <Button onClick={confirmTypeChange} className="bg-red-600 hover:bg-red-700 text-white">
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddContractPage;
