import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Thêm useLocation
import {
  ContractFiles,
  ContractInformation,
  FinancialTerms,
  LegalTerms,
  ScopeOfWork,
} from "./component/create";
import { FaCheck, FaArrowLeft, FaArrowRight, FaRotateLeft, FaEye } from "react-icons/fa6";
import { validateField } from "./validation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WarningDialog } from "@/components/global";
import { ContractPreviewModal } from "@/components/manage/marketing/contract/ContractPreviewModal";
import { useAppDispatch } from "@/libs/stores";
import { useContract } from "@/libs/hooks/useContract";
import { createContract } from "@/libs/stores/contractManager/thunk";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  { id: "contract-actions", label: "Documents", isRequired: true, step: 5 },
];

const INITIAL_FORM_DATA = {
  brand_id: "",
  parent_contract_id: "",
  contract_number: "",
  title: "",
  type: "",
  signed_date: "",
  signed_location: "",
  start_date: "",
  end_date: "",
  // Brand representative (from brand data -readonly)
  brand_representative_name: "",
  brand_representative_role: "",
  brand_representative_phone: "",
  brand_representative_email: "",
  brand_tax_number: "",
  // Brand banking (editable)
  brand_bank_name: "",
  brand_bank_account_number: "",
  brand_bank_account_holder: "",
  // Web representative (editable) - field names khớp với payload
  representative_name: "",
  representative_role: "",
  representative_phone: "",
  representative_email: "",
  representative_tax_number: "",
  representative_bank_name: "",
  representative_bank_account_number: "",
  representative_bank_account_holder: "",
  deposit_amount: 0,
  deposit_percent: 0,
  // Add missing scope_of_work property
  scope_of_work: {},
  // Add missing financial_terms property if needed by other code
  financial_terms: {},
  // Add missing legal_terms property if needed by other code
  legal_terms: {},
  // Add missing contract_file_url and proposal_file_url if needed by other code
  contract_file_url: "",
  proposal_file_url: "",
};

// Helper functions
const getContractTypeColor = (type: string) =>
  CONTRACT_TYPE_COLORS[type as keyof typeof CONTRACT_TYPE_COLORS] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
  };

const getDefaultFinancialTerms = (type: string) => {
  const baseTerms = {
    payment_method: "BANK_TRANSFER",
  };

  switch (type) {
    case "ADVERTISING":
      return {
        ...baseTerms,
        model: "FIXED",
        total_cost: 0,
        cost_breakdown: {},
        schedule: [],
      };

    case "BRAND_AMBASSADOR":
      return {
        ...baseTerms,
        model: "FIXED",
        total_cost: 0,
        cost_breakdown: [],
        schedule: [],
      };

    case "AFFILIATE":
      return {
        ...baseTerms,
        model: "LEVELS",
        base_per_click: 0,
        levels: [],
        payment_cycle: "",
        payment_date: "",
        tax_withholding: { threshold: 0, rate_percent: 0 },
      };

    case "CO_PRODUCING":
      return {
        ...baseTerms,
        model: "SHARE",
        profit_split_company_percent: 0,
        profit_split_kol_percent: 0,
        profit_distribution_cycle: "",
        profit_distribution_date: [],
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
        formData.brand_id &&
        formData.contract_number &&
        formData.title &&
        formData.signed_date &&
        formData.start_date &&
        formData.end_date &&
        formData.signed_location &&
        formData.brand_bank_name &&
        formData.brand_bank_account_number &&
        formData.brand_bank_account_holder
      );
    case "scope-of-work": {
      if (!formData.type) return false;

      const scope_of_work = formData.scope_of_work || {};
      const deliverables = scope_of_work.deliverables || {};

      if (formData.type === "ADVERTISING") {
        const advertised_items = deliverables.advertised_items || [];

        const hasValidItems =
          advertised_items.length > 0 &&
          advertised_items.every((item: any) => {
            const hasBasicInfo =
              item.name?.trim() &&
              item.description?.trim() &&
              item.platform?.trim() &&
              item.tagline?.trim();

            const hasHashtags =
              Array.isArray(item.hash_tag) &&
              item.hash_tag.length > 0 &&
              item.hash_tag.every((t: any) => t.trim() && t.trim() !== "#");

            const hasMaterial = Array.isArray(item.material_url) && item.material_url.length > 0;

            const hasKPIs =
              Array.isArray(item.kpis) &&
              item.kpis.length > 0 &&
              item.kpis.every((k: any) => k.metric?.trim() && k.target?.trim());

            return hasBasicInfo && hasHashtags && hasMaterial && hasKPIs;
          });

        const general_reqs = scope_of_work.general_requirements || [];
        const hasValidGeneralReqs =
          general_reqs.length > 0 && general_reqs.every((req: any) => req.trim());

        return hasValidItems && hasValidGeneralReqs;
      }

      if (formData.type === "AFFILIATE") {
        const affiliateItems = deliverables.advertised_items || [];
        const trackingLink = deliverables.tracking_link;
        const targetPlatforms = deliverables.platform || [];

        const hasTrackingLink = !!trackingLink?.trim();
        const hasTargetPlatforms = Array.isArray(targetPlatforms) && targetPlatforms.length > 0;

        const hasValidItems =
          affiliateItems.length > 0 &&
          affiliateItems.every((item: any) => {
            const hasBasicInfo =
              item.name?.trim() &&
              item.description?.trim() &&
              item.platform?.trim() &&
              item.tagline?.trim();

            const hasHashtags =
              Array.isArray(item.hash_tag) &&
              item.hash_tag.length > 0 &&
              item.hash_tag.every((t: any) => t.trim() && t.trim() !== "#");

            const hasValidContentReqs =
              Array.isArray(item.content_requirements) &&
              item.content_requirements.length > 0 &&
              item.content_requirements.every((r: any) => r.trim());

            const hasCreativeNotes = !!item.creative_notes?.trim();

            const hasKPIs =
              Array.isArray(item.kpis) &&
              item.kpis.length > 0 &&
              item.kpis.some((k: any) => k.metric?.trim() && k.target?.trim());

            const hasMaterial = Array.isArray(item.material_url) && item.material_url.length > 0;

            return (
              hasBasicInfo &&
              hasHashtags &&
              hasValidContentReqs &&
              hasCreativeNotes &&
              hasKPIs &&
              hasMaterial
            );
          });

        const general_reqs = scope_of_work.general_requirements || [];
        const hasValidGeneralReqs =
          general_reqs.length > 0 && general_reqs.every((req: any) => req.trim());

        return hasTrackingLink && hasTargetPlatforms && hasValidItems && hasValidGeneralReqs;
      }

      if (formData.type === "BRAND_AMBASSADOR") {
        const events = deliverables.events || [];
        const hasValidItems =
          events.length > 0 &&
          events.every((event: any) => {
            const hasBasicInfo = event.name?.trim() && event.location?.trim() && event.date?.trim();

            const hasValidActivities =
              Array.isArray(event.activities) &&
              event.activities.length > 0 &&
              event.activities.every((a: any) => a.trim());

            const hasValidRules =
              Array.isArray(event.representation_rules) &&
              event.representation_rules.length > 0 &&
              event.representation_rules.every((r: any) => r.trim());

            const hasKPIs =
              Array.isArray(event.kpis) &&
              event.kpis.length > 0 &&
              event.kpis.every((k: any) => k.metric?.trim() && k.target?.trim());

            return hasBasicInfo && hasValidActivities && hasValidRules && hasKPIs;
          });

        const general_reqs = scope_of_work.general_requirements || [];
        const hasValidGeneralReqs =
          general_reqs.length > 0 && general_reqs.every((req: any) => req.trim());

        return hasValidItems && hasValidGeneralReqs;
      }

      if (formData.type === "CO_PRODUCING") {
        const products = deliverables.products || [];

        const hasValidProducts =
          products.length > 0 &&
          products.every((product: any) => {
            const hasProductBasicInfo = product.name?.trim() && product.description?.trim();
            const hasProductKPIs =
              Array.isArray(product.kpis) &&
              product.kpis.length > 0 &&
              product.kpis.some((k: any) => k.metric?.trim() && k.target?.trim());
            const hasProductMaterial =
              Array.isArray(product.material_url) && product.material_url.length > 0;
            const concepts = product.concepts || [];
            const hasValidConcepts =
              concepts.length > 0 &&
              concepts.every((concept: any) => {
                const hasConceptBasicInfo =
                  concept.name?.trim() &&
                  concept.platform?.trim() &&
                  concept.tagline?.trim() &&
                  concept.description?.trim();
                const hasCreativeNotes = !!concept.creative_notes?.trim();
                const hasHashtags =
                  Array.isArray(concept.hash_tag) &&
                  concept.hash_tag.length > 0 &&
                  concept.hash_tag.every((t: any) => t.trim() && t.trim() !== "#");
                const hasValidContentReqs =
                  Array.isArray(concept.content_requirements) &&
                  concept.content_requirements.length > 0 &&
                  concept.content_requirements.every((r: any) => r.trim());
                const hasConceptKPIs =
                  Array.isArray(concept.kpis) &&
                  concept.kpis.length > 0 &&
                  concept.kpis.some((k: any) => k.metric?.trim() && k.target?.trim());
                const hasConceptMaterial =
                  Array.isArray(concept.material_url) && concept.material_url.length > 0;
                return (
                  hasConceptBasicInfo &&
                  hasCreativeNotes &&
                  hasHashtags &&
                  hasValidContentReqs &&
                  hasConceptKPIs &&
                  hasProductMaterial &&
                  hasConceptMaterial
                );
              });
            return hasProductBasicInfo && hasProductKPIs && hasValidConcepts;
          });
        const general_reqs = scope_of_work.general_requirements || [];
        const hasValidGeneralReqs =
          general_reqs.length === 0 || general_reqs.every((req: any) => req.trim());

        return hasValidProducts && hasValidGeneralReqs;
      }

      return false;
    }
    case "financial-terms": {
      if (!formData.type) return false;

      const financial_terms = formData.financial_terms || {};

      const hasPaymentMethod = financial_terms.payment_method?.trim();

      if (formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR") {
        const hasBasicInfo = !!(hasPaymentMethod && financial_terms.total_cost > 0);

        const schedule = financial_terms.schedule || [];
        const allItemsValid = schedule.every(
          (item: any) => item.milestone?.trim() && item.amount > 0 && item.due_date,
        );
        const scheduleTotal = schedule.reduce(
          (sum: number, item: any) => sum + (item.amount || 0),
          0,
        );
        const isScheduleBalanced =
          Math.abs((financial_terms.total_cost || 0) - scheduleTotal) < 0.01;

        const breakdown_array = financial_terms.cost_breakdown_array || [];
        const breakdownTotal = breakdown_array.reduce(
          (sum: number, item: any) => sum + (item.value || 0),
          0,
        );
        const isBreakdownBalanced =
          Math.abs((financial_terms.total_cost || 0) - breakdownTotal) < 0.01;

        return hasBasicInfo && allItemsValid && isScheduleBalanced && isBreakdownBalanced;
      }

      if (formData.type === "AFFILIATE") {
        // Kiểm tra các field bắt buộc cho AFFILIATE - KHÔNG cần schedule
        const hasBasicInfo = !!(
          hasPaymentMethod &&
          financial_terms.base_per_click > 0 &&
          financial_terms.payment_cycle
        );

        // Kiểm tra levels - SỬA LẠI LOGIC VALIDATION
        const hasValidLevels =
          financial_terms.levels?.length > 0 &&
          financial_terms.levels.every((level: any) => {
            // Kiểm tra các field thực tế có trong data
            const hasLevel = level.level > 0;
            const hasMaxClicks = level.max_clicks > 0;
            const hasMultiplier = level.multiplier > 0;

            return hasLevel && hasMaxClicks && hasMultiplier;
          });

        // Kiểm tra payment_date - có thể là string, number, hoặc array
        const hasPaymentDate = !!(
          financial_terms.payment_date !== undefined &&
          financial_terms.payment_date !== null &&
          financial_terms.payment_date !== ""
        );

        return hasBasicInfo && hasValidLevels && hasPaymentDate;
      }

      if (formData.type === "CO_PRODUCING") {
        // Kiểm tra các field bắt buộc cho CO_PRODUCING - KHÔNG cần schedule
        // const hasBasicInfo = !!(
        //   hasPaymentMethod &&
        //   financialTerms.profit_distribution_cycle &&
        //   financialTerms.profit_distribution_date?.length > 0
        // );

        // Kiểm tra profit split (phải tổng = 100%)
        const validProfitSplit = !!(
          financial_terms.profit_split_company_percent > 0 &&
          financial_terms.profit_split_kol_percent > 0 &&
          Math.abs(
            (financial_terms.profit_split_company_percent || 0) +
              (financial_terms.profit_split_kol_percent || 0) -
              100,
          ) < 0.01
        );

        return validProfitSplit;
      }

      return false;
    }
    case "legal-terms": {
      const compensation_percent = formData.legal_terms?.compensation_percent;
      const isValid = !!(
        compensation_percent !== undefined &&
        compensation_percent !== null &&
        compensation_percent !== "" &&
        !isNaN(Number(compensation_percent)) &&
        Number(compensation_percent) >= 0 &&
        Number(compensation_percent) <= 100
      );

      return isValid;
    }
    case "contract-actions": {
      // Kiểm tra cả files và URLs
      const hasContractFile = formData.contract_files?.length > 0 || formData.contract_file_url;
      const hasProposalFile = formData.proposal_files?.length > 0 || formData.proposal_file_url;

      return hasContractFile && hasProposalFile;
    }
    default:
      return false;
  }
};

const AddContractPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<any>({});
  const [activeTab, setActiveTab] = useState(INITIAL_TABS[0].id);
  const [currentStep, setCurrentStep] = useState(1);
  const [tabs, setTabs] = useState(INITIAL_TABS.map((tab) => ({ ...tab, isCompleted: false })));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ADD PREVIEW MODAL STATE
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const dispatch = useAppDispatch();
  const { loading } = useContract();

  // Modal states
  const [showTypeChangeModal, setShowTypeChangeModal] = useState(false);
  const [pendingNewType, setPendingNewType] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);

  // Lấy preselected brand ID từ navigation state
  const preselectedBrandId = location.state?.preselectedBrandId;
  const preselectedBrandData = location.state?.brandData;

  // Khởi tạo formData với brand ID nếu có
  const [formData, setFormData] = useState<any>(() => ({
    ...INITIAL_FORM_DATA,
    ...(preselectedBrandId ? { brand_id: preselectedBrandId } : {}),
  }));

  // Effect để xử lý preselected brand
  useEffect(() => {
    if (preselectedBrandId && !formData.brand_id) {
      // Set brand_id vào formData
      setFormData((prev: typeof INITIAL_FORM_DATA) => ({
        ...prev,
        brand_id: preselectedBrandId,
      }));

      // Nếu có brand data sẵn, fill luôn thông tin brand
      if (preselectedBrandData) {
        const brandRepData = {
          brand_representative_name: preselectedBrandData.representative_name || "",
          brand_representative_role: preselectedBrandData.representative_role || "",
          brand_representative_phone: preselectedBrandData.contact_phone || "",
          brand_representative_email: preselectedBrandData.contact_email || "",
          brand_tax_number: preselectedBrandData.tax_number || "",
          brand_name: preselectedBrandData.name || "",
          brand_address: preselectedBrandData.address || "",
        };

        setFormData((prev: typeof INITIAL_FORM_DATA) => ({
          ...prev,
          ...brandRepData,
        }));
      }

      // Clear state để tránh conflict khi navigate lại trang này
      window.history.replaceState({}, document.title);
    }
  }, [preselectedBrandId, preselectedBrandData, formData.brand_id]);

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
      Object.keys(formData.scope_of_work || {}).length > 0 ||
      Object.keys(formData.financial_terms || {}).length > 0 ||
      Object.keys(formData.legal_terms || {}).length > 0 ||
      formData.contract_files?.length > 0 ||
      formData.proposal_files?.length > 0
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
      brand_id: formData.brand_id,
      parent_contract_id: formData.parent_contract_id,
      contract_number: formData.contract_number,
      title: formData.title,
      signed_date: formData.signed_date,
      signed_location: formData.signed_location,
      start_date: formData.start_date,
      end_date: formData.end_date,
      brand_representative_name: formData.brand_representative_name,
      brand_representative_role: formData.brand_representative_role,
      brand_representative_phone: formData.brand_representative_phone,
      brand_representative_email: formData.brand_representative_email,
      brand_tax_number: formData.brand_tax_number,
      brand_bank_name: formData.brand_bank_name,
      brand_bank_account_number: formData.brand_bank_account_number,
      brand_bank_account_holder: formData.brand_bank_account_holder,
      // GIỮ LẠI WEB REPRESENTATIVE DATA
      representative_name: formData.representative_name,
      representative_role: formData.representative_role,
      representative_phone: formData.representative_phone,
      representative_email: formData.representative_email,
      representative_tax_number: formData.representative_tax_number,
      representative_bank_name: formData.representative_bank_name,
      representative_bank_account_number: formData.representative_bank_account_number,
      representative_bank_account_holder: formData.representative_bank_account_holder,
      currency: formData.currency,
      // Set new type and its defaults
      type: pendingNewType,
      financial_terms: getDefaultFinancialTerms(pendingNewType),
      scope_of_work: {},
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

  // Modify updateFinancialTerms để xử lý cả formData updates
  const update_financial_terms = async (updates: any) => {
    // Tách formData updates và financial_terms updates
    const { _form_data_updates, ...financial_updates } = updates;

    // Cập nhật formData nếu có _form_data_updates
    if (_form_data_updates) {
      setFormData((prev: any) => ({
        ...prev,
        ..._form_data_updates,
      }));
    }

    // Cập nhật financial_terms
    const new_financial_terms = { ...formData.financial_terms, ...financial_updates };
    setFormData((prev: typeof INITIAL_FORM_DATA) => ({
      ...prev,
      financial_terms: new_financial_terms,
    }));

    // Validation
    for (const [key, value] of Object.entries(financial_updates)) {
      const validation = await validateField(`financial_terms.${key}`, value, {
        ...formData,
        financial_terms: new_financial_terms,
      });
      handleFieldValidation(`financial_terms.${key}`, validation.isValid ? null : validation.error);
    }
  };

  const update_scope_of_work = (updates: any) => {
    setFormData((prev: typeof INITIAL_FORM_DATA) => ({
      ...prev,
      scope_of_work: { ...prev.scope_of_work, ...updates },
    }));
  };

  const handleContractTypeChange = async (type: string) => {
    handleInputChange("type", type);
    const validation = await validateField("type", type, { ...formData, type });
    handleFieldValidation("type", validation.isValid ? null : validation.error);
    const defaultFinancialTerms = getDefaultFinancialTerms(type);
    const defaultScopeOfWork = { ...formData.scopeOfWork };
    setFormData((prev: typeof INITIAL_FORM_DATA) => ({
      ...prev,
      type,
      financial_terms: defaultFinancialTerms,
      scope_of_work: defaultScopeOfWork,
    }));
  };

  // Handlers cho file URLs
  const handleContractUrlsChange = (urls: string[]) => {
    // Chỉ lấy URL đầu tiên vì chỉ cho phép 1 file
    const url = urls.length > 0 ? urls[0] : "";
    handleInputChange("contract_file_url", url);
  };

  const handleProposalUrlsChange = (urls: string[]) => {
    // Chỉ lấy URL đầu tiên vì chỉ cho phép 1 file
    const url = urls.length > 0 ? urls[0] : "";
    handleInputChange("proposal_file_url", url);
  };

  // File handlers (simplified)
  const handle_contract_files_change = (files: File[]) => {
    handleInputChange("contract_files", files);
  };

  const handle_proposal_files_change = (files: File[]) => {
    handleInputChange("proposal_files", files);
  };

  // MODIFY: Chỉ cần 1 handler để mở modal
  const handleCreateContract = () => {
    if (!canSubmit) {
      toast.error("Please complete all required sections before creating the contract.");
      return;
    }
    setShowPreviewModal(true);
  };

  // KEEP handleSubmit nhưng chỉ được gọi từ modal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Helper function để convert date string sang ISO format với timezone
      const formatDateForBackend = (dateString: string): string => {
        if (!dateString) return "";
        if (dateString.includes("T")) return dateString;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return date.toISOString();
      };

      // Tạo JSON payload hoàn chỉnh để gửi backend
      const contractPayload = {
        // Contract Basic Information
        parent_contract_id: null,
        contract_number: formData.contractNumber,
        title: formData.title,
        type: formData.type,
        status: "DRAFT",

        // Brand Information
        brand_id: formData.brandId,
        brand_bank_name: formData.brandBankName,
        brand_bank_account_number: formData.brandBankAccountNumber,
        brand_bank_account_holder: formData.brandBankAccountHolder,

        // Web Representative - field names chính xác
        representative_name: formData.representativeName,
        representative_role: formData.representativeRole,
        representative_phone: formData.representativePhone,
        representative_email: formData.representativeEmail,
        representative_tax_number: formData.representativeTaxNumber,
        representative_bank_name: formData.representativeBankName,
        representative_bank_account_number: formData.representativeBankAccountNumber,
        representative_bank_account_holder: formData.representativeBankAccountHolder,

        // Contract dates and location - FORMAT DATES PROPERLY
        signed_date: formatDateForBackend(formData.signedDate),
        signed_location: formData.signedLocation,
        start_date: formatDateForBackend(formData.startDate),
        end_date: formatDateForBackend(formData.endDate),
        currency: "VND",

        ...(formData.deposit_percent && formData.deposit_percent > 0
          ? { deposit_percent: formData.deposit_percent }
          : formData.deposit_amount && formData.deposit_amount > 0
            ? { deposit_amount: formData.deposit_amount }
            : {}),
        is_deposit_paid: formData.is_deposit_paid,

        // Scope of Work
        scope_of_work: {
          general_requirements: formData.scopeOfWork?.general_requirements || [],
          deliverables: formData.scopeOfWork?.deliverables || {},
        },

        // Financial Terms
        financial_terms: {
          model:
            formData.type === "ADVERTISING"
              ? "FIXED"
              : formData.type === "AFFILIATE"
                ? "LEVELS"
                : formData.type === "CO_PRODUCING"
                  ? "SHARE"
                  : "FIXED",
          payment_method: formData.financialTerms?.payment_method || "BANK_TRANSFER",
          total_cost: formData.financialTerms?.total_cost || 0,

          // Contract type specific terms
          ...(formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR"
            ? {
                // cost_breakdown is already in correct format from handleUpdate conversion
                cost_breakdown: formData.financialTerms?.cost_breakdown || {},
                schedule: formData.financialTerms?.schedule || {},
              }
            : {}),

          ...(formData.type === "AFFILIATE"
            ? {
                base_per_click: formData.financialTerms?.base_per_click || 0,
                levels: formData.financialTerms?.levels || [],
                payment_cycle: formData.financialTerms?.payment_cycle,
                payment_date: formData.financialTerms?.payment_date,
                tax_withholding: formData.financialTerms?.tax_withholding || {},
              }
            : {}),

          ...(formData.type === "CO_PRODUCING"
            ? {
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
          breach_of_contract: {
            label: formData.legalTerms?.breach_of_contract?.label || "Breach of Contract",
            items: [
              {
                title: "Party A (Brand) breaks the rules",
                details: ["Contract terminates immediately", "Party A forfeits the deposit"],
              },
              {
                title: "Party B (Service Provider) breaks the rules",
                details: [
                  "Contract terminates immediately",
                  "Party B must refund the deposit",
                  `Party B pays additional ${formData.legalTerms?.compensationPercent}% compensation`,
                ],
                compensation_percent: formData.legalTerms?.compensationPercent,
              },
              {
                title: "Mutual agreement to terminate",
                details: [
                  "Contract stops with no penalties",
                  "No compensation required from either party",
                ],
              },
            ],
          },
          standard_terms: {
            label: formData.legalTerms?.standard_terms?.label || "Standard Terms",
            items: [
              {
                title: "Confidentiality",
                description:
                  "Both parties must keep all contract information confidential and cannot disclose to third parties without written consent",
              },
              {
                title: "Dispute Resolution",
                description:
                  "Disputes will be resolved through negotiation first, then legal proceedings if necessary",
              },
              {
                title: "Contract Effectiveness",
                description:
                  "Contract is effective from signature date until all obligations are fulfilled",
              },
              {
                title: "Force Majeure",
                description:
                  "Neither party is liable for failure to perform due to circumstances beyond their control, including natural disasters or government actions",
              },
            ],
          },
        },
        contract_file_url: formData.contract_file_url || "",
        proposal_file_url: formData.proposal_file_url || "",
      };

      const result = await dispatch(createContract(contractPayload));

      if (createContract.fulfilled.match(result)) {
        toast.success("Contract draft created successfully!");
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
        setCurrentStep(1);
        setActiveTab(INITIAL_TABS[0].id);
        setShowPreviewModal(false); // Đóng modal sau khi thành công
        navigate("/manage/marketing/contracts");
      } else {
        throw new Error((result.payload as string) || "Failed to create contract");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to create contract: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render tab content dynamically
  const renderTabContent = (tabId: string) => {
    const componentProps = {
      formData,
      onInputChange: handleInputChange,
      errors,
      onContractTypeChange: handleTypeChangeRequest,
      onUpdateScopeOfWork: update_scope_of_work,
      onFieldValidation: handleFieldValidation,
      contractTypeOptions: CONTRACT_TYPE_OPTIONS,
      onUpdateFinancialTerms: update_financial_terms,
      onContractFilesChange: handle_contract_files_change,
      onProposalFilesChange: handle_proposal_files_change,
      onContractUrlsChange: handleContractUrlsChange,
      onProposalUrlsChange: handleProposalUrlsChange,
      onSubmit: handleSubmit,
      isTypeLockedMode,
    };
    const TabComponent = TAB_COMPONENTS[tabId];
    return TabComponent ? <TabComponent {...componentProps} /> : null;
  };

  const contractTypeColor = getContractTypeColor(formData.type);

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="max-w-7xl mx-auto pb-10">
        {/* Header - Thêm thông tin về preselected brand */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">Create New Contract</h1>
              <p className="text-gray-600 mt-1">
                {preselectedBrandId
                  ? `Create a new contract for ${preselectedBrandData?.name || "selected brand"}`
                  : "Create a new contract with defined terms and details."}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={isSubmitting}
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
                    className={`flex-1 justify-center ${!isAccessible ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isAccessible || isSubmitting}
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
      <div className="sticky bottom-0 -mx-2 bg-white/90 border-t rounded-xl border-gray-200 shadow-lg z-40">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={!canGoPrevious() || isSubmitting}
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            {currentStep < INITIAL_TABS.length && (
              <Button type="button" onClick={handleNext} disabled={!canGoNext() || isSubmitting}>
                Next
                <FaArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              disabled={!canSubmit || isSubmitting}
              onClick={handleCreateContract}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FaEye className="h-4 w-4 mr-2" />
                  Create Draft Contract
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {showPreviewModal && (
        <ContractPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          contractData={formData}
          onConfirmCreate={handleSubmit}
        />
      )}

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
