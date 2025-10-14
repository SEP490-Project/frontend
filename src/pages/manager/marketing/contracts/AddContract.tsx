import React, { useState, useEffect } from "react";
import {
  ContractFiles,
  ContractInformation,
  FinancialTerms,
  LegalTerms,
  ScopeOfWork,
} from "./component/add";
import { FaCheck, FaArrowLeft, FaArrowRight, FaRotateLeft } from "react-icons/fa6";
import { validateField } from "./validation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WarningDialog } from "@/components/global";

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
        formData.startDate &&
        formData.endDate &&
        formData.signedLocation &&
        formData.brandBankName &&
        formData.brandBankAccountNumber &&
        formData.brandBankAccountHolder
      );
    case "scope-of-work": {
      if (!formData.type) return false;

      const scopeOfWork = formData.scopeOfWork || {};
      const deliverables = scopeOfWork.deliverables || {};

      console.log("Checking scope completion:", {
        type: formData.type,
        scopeOfWork,
        deliverables,
      });

      if (formData.type === "ADVERTISING") {
        const advertisingItems = deliverables.advertising_items || [];
        const hasValidItems =
          advertisingItems.length > 0 &&
          advertisingItems.every((item: any) => {
            return !!(
              item.name?.trim() &&
              item.description?.trim() &&
              item.platform?.trim() &&
              item.tagline?.trim()
            );
          });

        const hasGeneralReqs =
          !scopeOfWork.general_requirements ||
          scopeOfWork.general_requirements.length === 0 ||
          scopeOfWork.general_requirements.every((req: any) => req.trim());

        return hasValidItems && hasGeneralReqs;
      }

      if (formData.type === "AFFILIATE") {
        const affiliateItems = deliverables.affiliate_items || [];
        const hasValidItems =
          affiliateItems.length > 0 &&
          affiliateItems.every((item: any) => {
            return !!(item.name?.trim() && item.description?.trim() && item.commission_rate > 0);
          });

        const hasGeneralReqs =
          !scopeOfWork.general_requirements ||
          scopeOfWork.general_requirements.length === 0 ||
          scopeOfWork.general_requirements.every((req: any) => req.trim());

        return hasValidItems && hasGeneralReqs;
      }

      if (formData.type === "BRAND_AMBASSADOR") {
        const ambassadorItems = deliverables.ambassador_items || [];
        const hasValidItems =
          ambassadorItems.length > 0 &&
          ambassadorItems.every((item: any) => {
            return !!(item.name?.trim() && item.description?.trim() && item.duration?.trim());
          });

        const hasGeneralReqs =
          !scopeOfWork.general_requirements ||
          scopeOfWork.general_requirements.length === 0 ||
          scopeOfWork.general_requirements.every((req: any) => req.trim());

        return hasValidItems && hasGeneralReqs;
      }

      if (formData.type === "CO_PRODUCING") {
        const coProducingItems = deliverables.coproducing_items || [];
        const hasValidItems =
          coProducingItems.length > 0 &&
          coProducingItems.every((item: any) => {
            return !!(item.name?.trim() && item.description?.trim() && item.timeline?.trim());
          });

        const hasRoles =
          scopeOfWork.coProductionRoles &&
          scopeOfWork.coProductionRoles.company?.trim() &&
          scopeOfWork.coProductionRoles.kol?.trim();

        const hasGeneralReqs =
          !scopeOfWork.general_requirements ||
          scopeOfWork.general_requirements.length === 0 ||
          scopeOfWork.general_requirements.every((req: any) => req.trim());

        return hasValidItems && hasRoles && hasGeneralReqs;
      }

      return false;
    }
    case "financial-terms": {
      if (!formData.type) return false;

      const financialTerms = formData.financialTerms || {};

      console.log("Checking financial terms completion:", {
        type: formData.type,
        financialTerms,
      });

      // Kiểm tra payment schedule - bắt buộc cho tất cả loại hợp đồng
      const hasValidSchedule =
        financialTerms.schedule?.length > 0 &&
        financialTerms.schedule.every(
          (item: any) => item.milestone?.trim() && item.amount > 0 && item.due_date,
        );

      if (formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR") {
        // Kiểm tra các field bắt buộc cho ADVERTISING/BRAND_AMBASSADOR
        const hasBasicInfo = !!(financialTerms.payment_method && financialTerms.total_cost > 0);

        // Kiểm tra payment schedule có tổng bằng total cost
        const scheduleTotal = (financialTerms.schedule || []).reduce(
          (sum: number, item: any) => sum + (item.amount || 0),
          0,
        );

        const isScheduleBalanced =
          Math.abs((financialTerms.total_cost || 0) - scheduleTotal) < 0.01;

        return hasBasicInfo && hasValidSchedule && isScheduleBalanced;
      }

      if (formData.type === "AFFILIATE") {
        // Kiểm tra các field bắt buộc cho AFFILIATE
        const hasBasicInfo = !!(
          financialTerms.payment_method &&
          financialTerms.base_per_click > 0 &&
          financialTerms.payment_cycle &&
          financialTerms.payment_date
        );

        // Kiểm tra commission levels
        const hasValidLevels =
          financialTerms.commission_levels?.length > 0 &&
          financialTerms.commission_levels.every(
            (level: any) => level.min_clicks > 0 && level.rate_per_click > 0,
          );

        return hasBasicInfo && hasValidLevels && hasValidSchedule;
      }

      if (formData.type === "CO_PRODUCING") {
        // Kiểm tra các field bắt buộc cho CO_PRODUCING
        const hasBasicInfo = !!(
          financialTerms.payment_method &&
          financialTerms.profit_distribution_cycle &&
          financialTerms.profit_distribution_date
        );

        // Kiểm tra profit split (phải tổng = 100%)
        const validProfitSplit =
          financialTerms.profit_split_company_percent > 0 &&
          financialTerms.profit_split_kol_percent > 0 &&
          financialTerms.profit_split_company_percent + financialTerms.profit_split_kol_percent ===
            100;

        // Kiểm tra capital contribution
        const validCapital =
          financialTerms.capital_contribution?.company?.value > 0 &&
          financialTerms.capital_contribution?.kol?.value > 0 &&
          financialTerms.capital_contribution?.company?.description?.trim() &&
          financialTerms.capital_contribution?.kol?.description?.trim();

        return hasBasicInfo && validProfitSplit && validCapital && hasValidSchedule;
      }

      return false;
    }
    case "legal-terms": {
      // Kiểm tra compensationPercent không được rỗng và phải là số hợp lệ (0-100)
      const compensationPercent = formData.legalTerms?.compensationPercent;

      console.log("Checking legal terms completion:", {
        compensationPercent,
        legalTerms: formData.legalTerms,
      });

      // Kiểm tra:
      // 1. Không được undefined/null/empty string
      // 2. Phải là số >= 0 và <= 100
      return !!(
        compensationPercent !== undefined &&
        compensationPercent !== null &&
        compensationPercent !== "" &&
        !isNaN(Number(compensationPercent)) &&
        Number(compensationPercent) >= 0 &&
        Number(compensationPercent) <= 100
      );
    }
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

    try {
      console.log("Starting submission process...");
      console.log("Current form data:", formData);

      // BỎ QUA TẤT CẢ VALIDATION - CHỈ TẠO JSON
      console.log("Skipping all validation, creating payload directly...");

      // Tạo JSON payload hoàn chỉnh để gửi backend
      const contractPayload = {
        // Contract Basic Information
        contract_info: {
          contract_number: formData.contractNumber,
          type: formData.type,
          signed_date: formData.signedDate,
          signed_location: formData.signedLocation,
          start_date: formData.startDate,
          end_date: formData.endDate,
          status: "DRAFT",
        },

        // Brand Information
        brand_info: {
          brand_id: formData.brandId,
          representative: {
            name: formData.brandRepresentativeName,
            position: formData.brandRepresentativePosition,
            phone: formData.brandRepresentativePhone,
            email: formData.brandRepresentativeEmail,
            tax_number: formData.brandTaxNumber,
          },
          banking: {
            bank_name: formData.brandBankName,
            account_number: formData.brandBankAccountNumber,
            account_holder: formData.brandBankAccountHolder,
          },
        },

        // Web Representative (KOL/Content Creator)
        web_representative: {
          staff_id: formData.webRepresentativeStaffId,
          name: formData.webRepresentativeName,
          position: formData.webRepresentativePosition,
          phone: formData.webRepresentativePhone,
          email: formData.webRepresentativeEmail,
          tax_number: formData.webRepresentativeTaxNumber,
        },

        // Scope of Work
        scope_of_work: {
          general_requirements: formData.scopeOfWork?.general_requirements || [],
          deliverables: formData.scopeOfWork?.deliverables || {},
          ...(formData.type === "CO_PRODUCING" && {
            co_production_roles: formData.scopeOfWork?.coProductionRoles || {},
          }),
        },

        // Financial Terms
        financial_terms: {
          payment_method: formData.financialTerms?.payment_method || "BANK_TRANSFER",
          deposit_info: {
            deposit_paid: formData.financialTerms?.deposit_paid || false,
            deposit_amount: formData.financialTerms?.deposit_amount || 0,
          },
          schedule: formData.financialTerms?.schedule || [],

          // Contract type specific terms
          ...(formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR"
            ? {
                total_cost: formData.financialTerms?.total_cost || 0,
                cost_breakdown: formData.financialTerms?.cost_breakdown || {},
              }
            : {}),

          ...(formData.type === "AFFILIATE"
            ? {
                base_per_click: formData.financialTerms?.base_per_click || 0,
                commission_levels: formData.financialTerms?.commission_levels || [],
                payment_cycle: formData.financialTerms?.payment_cycle,
                payment_date: formData.financialTerms?.payment_date,
                tax_withholding: formData.financialTerms?.tax_withholding || {},
              }
            : {}),

          ...(formData.type === "CO_PRODUCING"
            ? {
                capital_contribution: formData.financialTerms?.capital_contribution || {},
                profit_split_company_percent:
                  formData.financialTerms?.profit_split_company_percent || 0,
                profit_split_kol_percent: formData.financialTerms?.profit_split_kol_percent || 0,
                profit_distribution_cycle: formData.financialTerms?.profit_distribution_cycle,
                profit_distribution_date: formData.financialTerms?.profit_distribution_date,
              }
            : {}),
        },

        // Legal Terms
        legal_terms: {
          compensation_percent: formData.legalTerms?.compensationPercent || 0,
          breach_conditions: {
            brand_breach: {
              consequences: ["immediate_termination", "forfeit_deposit"],
            },
            service_provider_breach: {
              consequences: ["immediate_termination", "refund_deposit", "pay_compensation"],
              compensation_percent: formData.legalTerms?.compensationPercent || 0,
            },
            mutual_termination: {
              consequences: ["no_penalty"],
            },
          },
          standard_terms: {
            confidentiality: true,
            dispute_resolution: "court_jurisdiction",
            contract_effectiveness: "signature_to_completion",
            force_majeure: true,
          },
        },

        // File References
        documents: {
          contract_files:
            formData.contractFiles?.map((file: File) => ({
              name: file.name,
              size: file.size,
              type: file.type,
            })) || [],
          proposal_files:
            formData.proposalFiles?.map((file: File) => ({
              name: file.name,
              size: file.size,
              type: file.type,
            })) || [],
        },

        // Metadata
        metadata: {
          created_at: new Date().toISOString(),
          created_by: "current_user_id",
          version: "1.0",
          last_modified: new Date().toISOString(),
        },
      };

      console.log("Payload created successfully!");
      console.log("=== CONTRACT PAYLOAD FOR BACKEND ===");
      console.log(JSON.stringify(contractPayload, null, 2));

      // Hiển thị JSON trong modal
      const jsonString = JSON.stringify(contractPayload, null, 2);

      const modal = document.createElement("div");
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
      `;

      modal.innerHTML = `
        <div style="
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 90%;
          max-height: 90%;
          overflow: auto;
        ">
          <h3 style="margin-bottom: 15px; font-size: 18px; font-weight: bold;">
            Contract JSON Payload (No Validation)
          </h3>
          <div style="margin-bottom: 15px; padding: 10px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 4px;">
            <p style="color: #92400e; font-size: 14px; margin: 0;">
              ⚠️ Validation was skipped. This is the raw JSON data from your form.
            </p>
          </div>
          <pre style="
            background: #f5f5f5;
            padding: 15px;
            border-radius: 4px;
            overflow: auto;
            font-size: 12px;
            white-space: pre-wrap;
            word-wrap: break-word;
            max-height: 500px;
          ">${jsonString}</pre>
          <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end;">
            <button id="copyJson" style="
              background: #3b82f6;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
            ">Copy JSON</button>
            <button id="closeModal" style="
              background: #6b7280;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
            ">Close</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Copy function
      document.getElementById("copyJson")?.addEventListener("click", () => {
        navigator.clipboard
          .writeText(jsonString)
          .then(() => {
            alert("JSON copied to clipboard!");
          })
          .catch(() => {
            const textarea = document.createElement("textarea");
            textarea.value = jsonString;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            alert("JSON copied to clipboard (fallback method)!");
          });
      });

      // Close modal
      const closeModal = () => {
        if (modal.parentNode) {
          document.body.removeChild(modal);
        }
      };
      document.getElementById("closeModal")?.addEventListener("click", closeModal);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });

      console.log("Modal displayed successfully!");
    } catch (error) {
      console.error("Draft creation failed:", error);
      if (typeof error === "object" && error !== null && "message" in error) {
        alert(`Error: ${(error as { message?: string }).message}`);
      } else {
        alert(`Error: ${String(error)}`);
      }
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
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">Add New Contract</h1>
              <p className="text-gray-600 mt-1">
                Add a new contract with defined terms and details.
              </p>
            </div>
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
      <WarningDialog
        isOpen={showResetModal}
        onOpenChange={setShowResetModal}
        title="Reset All Data"
        description="Are you sure you want to reset all data? This action cannot be undone."
        warningMessage="Warning: All the following data will be permanently deleted:"
        warningItems={[
          "Contract Information",
          "Scope of Work",
          "Financial Terms",
          "Legal Terms",
          "Uploaded Documents",
        ]}
        additionalInfo="You will be returned to Step 1 and need to start over."
        onConfirm={confirmReset}
        onCancel={cancelReset}
        confirmText="Reset All Data"
        cancelText="Cancel"
      />

      {/* Contract Type Change Confirmation Modal */}
      <WarningDialog
        isOpen={showTypeChangeModal}
        onOpenChange={setShowTypeChangeModal}
        title="Change Contract Type"
        description={`Are you sure you want to change the contract type from ${
          CONTRACT_TYPE_OPTIONS.find((opt) => opt.value === formData.type)?.label
        } to ${CONTRACT_TYPE_OPTIONS.find((opt) => opt.value === pendingNewType)?.label}?`}
        warningMessage="Warning: If you change the type, all data you have entered in the subsequent steps will be deleted:"
        warningItems={["Scope of Work", "Financial Terms", "Legal Terms", "Uploaded Documents"]}
        additionalInfo="Step 1 data will be preserved."
        onConfirm={confirmTypeChange}
        onCancel={cancelTypeChange}
        confirmText="Confirm Change"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AddContractPage;
