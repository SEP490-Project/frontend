import React, { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch } from "@/libs/stores";
import { getContractById } from "@/libs/stores/contractManager/thunk";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaArrowLeft, FaSave, FaEye } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useContract } from "@/libs/hooks/useContract";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { ContractPreviewModal } from "@/components/manage/marketing/contract/ContractPreviewModal";
import {
  ContractInformation,
  ScopeOfWork,
  FinancialTerms,
  LegalTerms,
  ContractFiles,
} from "./component/create";
import { validateField } from "./validation";
import { updateContract } from "@/libs/stores/contractManager/thunk";

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

const EDIT_TABS = [
  { id: "contract-info", label: "Contract Information", isRequired: true, step: 1 },
  { id: "scope-of-work", label: "Scope of Work", isRequired: true, step: 2 },
  { id: "financial-terms", label: "Financial Terms", isRequired: true, step: 3 },
  { id: "legal-terms", label: "Legal Terms", isRequired: true, step: 4 },
  { id: "contract-actions", label: "Documents", isRequired: true, step: 5 },
];

const TAB_COMPONENTS: Record<string, React.FC<any>> = {
  "contract-info": ContractInformation,
  "scope-of-work": ScopeOfWork,
  "financial-terms": FinancialTerms,
  "legal-terms": LegalTerms,
  "contract-actions": ContractFiles,
};

const getContractTypeColor = (type: string) =>
  CONTRACT_TYPE_COLORS[type as keyof typeof CONTRACT_TYPE_COLORS] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
  };

const checkTabCompletionLogic = (tabId: string, formData: any): boolean => {
  switch (tabId) {
    case "contract-info":
      return !!(
        formData.type &&
        formData.brand_id &&
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
      const general_reqs = scope_of_work.general_requirements || [];
      const hasValidGeneralReqs =
        general_reqs.length > 0 && general_reqs.every((req: any) => req.trim());
      return hasValidGeneralReqs;
    }
    case "financial-terms": {
      if (!formData.type) return false;
      const financial_terms = formData.financial_terms || {};
      const hasPaymentMethod = financial_terms.payment_method?.trim();
      return !!hasPaymentMethod;
    }
    case "legal-terms": {
      const compensation_percent = formData.compensation_percent;
      return !!(
        compensation_percent !== undefined &&
        compensation_percent !== null &&
        compensation_percent !== "" &&
        !isNaN(Number(compensation_percent)) &&
        Number(compensation_percent) >= 0 &&
        Number(compensation_percent) <= 100
      );
    }
    case "contract-actions": {
      const hasContractFile = formData.contract_files?.length > 0 || formData.contract_file_url;
      const hasProposalFile = formData.proposal_files?.length > 0 || formData.proposal_file_url;
      return hasContractFile && hasProposalFile;
    }
    default:
      return false;
  }
};

const EditContractPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { contractDetail, detailLoading } = useContract();

  const [errors, setErrors] = useState<any>({});
  const [activeTab, setActiveTab] = useState(EDIT_TABS[0].id);
  const [currentStep, setCurrentStep] = useState(1);
  const [tabs, setTabs] = useState(EDIT_TABS.map((tab) => ({ ...tab, isCompleted: false })));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<any>({});

  // Load contract data
  useEffect(() => {
    if (id) {
      dispatch(getContractById(id));
    }
  }, [dispatch, id]);

  // Populate form when contract data loads
  useEffect(() => {
    if (contractDetail && !detailLoading) {
      // Map contract detail to form data structure
      const mappedData = {
        brand_id: contractDetail.brand?.id || "",
        parent_contract_id: contractDetail.parent_contract_id || "",
        title: contractDetail.title || "",
        type: contractDetail.type || "",
        signed_date: contractDetail.signed_date || "",
        signed_location: contractDetail.signed_location || "",
        start_date: contractDetail.start_date || "",
        end_date: contractDetail.end_date || "",

        // Brand representative info (read-only from brand)
        brand_representative_name: contractDetail.brand?.representative_name || "",
        brand_representative_role: contractDetail.brand?.representative_role || "",
        brand_representative_phone: contractDetail.brand?.contact_phone || "",
        brand_representative_email: contractDetail.brand?.contact_email || "",
        brand_tax_number: contractDetail.brand?.tax_number || "",
        brand_bank_name: contractDetail.brand?.bank_name || "",
        brand_bank_account_number: contractDetail.brand?.bank_account_number || "",
        brand_bank_account_holder: contractDetail.brand?.bank_account_holder || "",

        // KOL/Company representative info (editable)
        representative_name: contractDetail.representative_name || "",
        representative_role: contractDetail.representative_role || "",
        representative_phone: contractDetail.representative_phone || "",
        representative_email: contractDetail.representative_email || "",
        representative_tax_number: contractDetail.representative_tax_number || "",
        representative_bank_name: contractDetail.representative_bank_name || "",
        representative_bank_account_number: contractDetail.representative_bank_account_number || "",
        representative_bank_account_holder: contractDetail.representative_bank_account_holder || "",

        // Deposit info
        deposit_amount: contractDetail.deposit_amount || 0,
        deposit_percent: contractDetail.deposit_percent || 0,
        is_deposit_paid: contractDetail.is_deposit_paid || false,

        // Scope of work
        scope_of_work: contractDetail.scope_of_work || {},

        // Financial terms
        financial_terms: contractDetail.financial_terms || {},

        // Legal terms
        legal_terms: contractDetail.legal_terms || {},

        // Extract compensation_percent from nested structure for easier access
        compensation_percent:
          contractDetail.legal_terms?.breach_of_contract?.items?.find(
            (item: any) => item.title === "Party B (Service Provider) breaks the rules",
          )?.compensation_percent || 0,

        // File URLs
        contract_file_url: contractDetail.contract_file_url || "",
        proposal_file_url: contractDetail.proposal_file_url || "",

        // Additional fields
        currency: contractDetail.currency || "VND",

        // For displaying brand info (read-only)
        brandData: contractDetail.brand || null,
      };

      setFormData(mappedData);
      setIsLoading(false);
    }
  }, [contractDetail, detailLoading]);

  // Update tab completion status
  useEffect(() => {
    setTabs((currentTabs) =>
      currentTabs.map((tab) => ({
        ...tab,
        isCompleted: checkTabCompletionLogic(tab.id, formData),
      })),
    );
  }, [formData]);

  const requiredTabs = tabs.filter((tab) => tab.isRequired);
  const completedRequiredTabs = requiredTabs.filter((tab) => tab.isCompleted);
  const progressPercentage = (completedRequiredTabs.length / requiredTabs.length) * 100;
  const canSubmit = progressPercentage === 100;

  const getCurrentTab = () => tabs.find((tab) => tab.step === currentStep);
  const canGoNext = () => {
    const currentTab = getCurrentTab();
    return currentTab ? currentTab.isCompleted && currentStep < EDIT_TABS.length : false;
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

    const completedSteps = tabs.filter((tab) => tab.isCompleted).length;
    const maxAllowedStep = Math.min(completedSteps + 1, EDIT_TABS.length);

    if (selectedTab.step <= maxAllowedStep) {
      setCurrentStep(selectedTab.step);
      setActiveTab(tabId);
    }
  };

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

  const update_financial_terms = async (updates: any) => {
    const { _form_data_updates, ...financial_updates } = updates;

    if (_form_data_updates) {
      setFormData((prev: any) => ({
        ...prev,
        ..._form_data_updates,
      }));
    }

    const new_financial_terms = { ...formData.financial_terms, ...financial_updates };

    setFormData((prev: any) => {
      const updated = {
        ...prev,
        financial_terms: new_financial_terms,
      };
      return updated;
    });

    for (const [key, value] of Object.entries(financial_updates)) {
      const validation = await validateField(`financial_terms.${key}`, value, {
        ...formData,
        financial_terms: new_financial_terms,
      });
      handleFieldValidation(`financial_terms.${key}`, validation.isValid ? null : validation.error);
    }
  };

  const update_scope_of_work = (updates: any) => {
    setFormData((prev: any) => {
      const prevDeliverables = prev.scope_of_work?.deliverables;
      const updatedScope = {
        ...prev.scope_of_work,
        ...updates,
        deliverables: updates.deliverables !== undefined ? updates.deliverables : prevDeliverables,
      };

      return {
        ...prev,
        scope_of_work: updatedScope,
      };
    });
  };

  const prepareContractDataForPreview = (formData: any) => {
    // Prepare contract data that works for both create and edit modes
    // Always ensure compensation_percent is available at legal_terms level for preview consistency
    const compensation_percent =
      formData.compensation_percent !== undefined
        ? formData.compensation_percent
        : formData.legal_terms?.compensation_percent || 0;

    return {
      ...formData,
      legal_terms: {
        ...formData.legal_terms,
        compensation_percent: Number(compensation_percent),
      },
    };
  };

  const handleContractTypeChange = async () => {
    // Contract type is locked in edit mode
    toast.warning("Contract type cannot be changed after creation");
  };

  const handleBrandChange = async () => {
    // Brand is locked in edit mode
    toast.warning("Brand cannot be changed after contract creation");
  };

  const handleContractUrlsChange = (urls: string[]) => {
    const url = urls.length > 0 ? urls[0] : "";
    handleInputChange("contract_file_url", url);
  };

  const handleProposalUrlsChange = (urls: string[]) => {
    const url = urls.length > 0 ? urls[0] : "";
    handleInputChange("proposal_file_url", url);
  };

  const handle_contract_files_change = (files: File[]) => {
    handleInputChange("contract_files", files);
  };

  const handle_proposal_files_change = (files: File[]) => {
    handleInputChange("proposal_files", files);
  };

  const handleUpdateContract = () => {
    if (!canSubmit) {
      toast.error("Please complete all required sections before updating the contract.");
      return;
    }
    setShowPreviewModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formatDateForBackend = (dateString: string): string => {
        if (!dateString) return "";
        if (dateString.includes("T")) return dateString;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return date.toISOString();
      };

      const contractPayload = {
        title: formData.title,
        type: formData.type,

        representative_name: formData.representative_name,
        representative_role: formData.representative_role,
        representative_phone: formData.representative_phone,
        representative_email: formData.representative_email,
        representative_tax_number: formData.representative_tax_number,
        representative_bank_name: formData.representative_bank_name,
        representative_bank_account_number: formData.representative_bank_account_number,
        representative_bank_account_holder: formData.representative_bank_account_holder,

        signed_date: formatDateForBackend(formData.signed_date),
        signed_location: formData.signed_location,
        start_date: formatDateForBackend(formData.start_date),
        end_date: formatDateForBackend(formData.end_date),
        currency: formData.currency || "VND",

        ...(formData.deposit_percent && formData.deposit_percent > 0
          ? {
              deposit_percent: formData.deposit_percent,
              deposit_amount: formData.deposit_amount || 0,
            }
          : {}),
        is_deposit_paid: formData.is_deposit_paid,

        scope_of_work: {
          general_requirements: formData.scope_of_work?.general_requirements || [],
          deliverables: formData.scope_of_work?.deliverables || {},
        },

        financial_terms: formData.financial_terms || {},

        legal_terms: {
          ...formData.legal_terms,
          breach_of_contract: {
            label: formData.legal_terms?.breach_of_contract?.label || "Breach of Contract",
            items: [
              {
                title: "Party A (Brand) breaks the rules",
                details: [
                  "Contract terminates immediately",
                  "Party A forfeits the deposit and must pay for the current milestone",
                ],
              },
              {
                title: "Party B (Service Provider) breaks the rules",
                details: [
                  "Contract terminates immediately",
                  "Party B must refund the deposit",
                  `Party B pays additional ${formData.compensation_percent || formData.legal_terms?.compensation_percent || 0}% compensation`,
                ],
                compensation_percent:
                  formData.compensation_percent || formData.legal_terms?.compensation_percent || 0,
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
          standard_terms: formData.legal_terms?.standard_terms || {
            label: "Standard Terms",
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

      // Call updateContract API
      const result = await dispatch(updateContract({ id: id!, req: contractPayload }));

      if (updateContract.fulfilled.match(result)) {
        toast.success("Contract updated successfully!");
        setShowPreviewModal(false);

        // Refresh contract data
        dispatch(getContractById(id!));

        setTimeout(() => {
          navigate(`/manage/marketing/contracts/${id}`);
        }, 1000);
      } else {
        throw new Error((result.payload as string) || "Failed to update contract");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to update contract: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/manage/marketing/contracts/${id}`);
  };

  const renderTabContent = (tabId: string) => {
    const componentProps = {
      formData,
      onInputChange: handleInputChange,
      errors,
      onContractTypeChange: handleContractTypeChange, // Locked in edit mode
      onBrandChange: handleBrandChange, // Locked in edit mode
      onUpdateScopeOfWork: update_scope_of_work,
      onFieldValidation: handleFieldValidation,
      contractTypeOptions: CONTRACT_TYPE_OPTIONS,
      onUpdateFinancialTerms: update_financial_terms,
      onContractFilesChange: handle_contract_files_change,
      onProposalFilesChange: handle_proposal_files_change,
      onContractUrlsChange: handleContractUrlsChange,
      onProposalUrlsChange: handleProposalUrlsChange,
      onSubmit: handleSubmit,
      isTypeLockedMode: true, // Always locked in edit mode
      isBrandLockedMode: true, // Always locked in edit mode
    };
    const TabComponent = TAB_COMPONENTS[tabId];
    return TabComponent ? <TabComponent {...componentProps} /> : null;
  };

  const contractTypeColor = getContractTypeColor(formData.type);

  // Loading state
  if (isLoading || detailLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-600">Loading contract details...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!contractDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Contract not found</h2>
          <p className="text-gray-600 mb-4">The contract you're trying to edit doesn't exist.</p>
          <Button onClick={() => navigate("/manage/marketing/contracts")}>Go to Contracts</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="max-w-7xl mx-auto pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleGoBack} className="flex items-center">
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Return
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Edit Contract
              </h1>
              <p className="text-gray-600">
                Update contract information and terms - Contract #{contractDetail.contract_number}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              className={`${contractTypeColor.bg} ${contractTypeColor.text} border ${contractTypeColor.border} px-3 py-1.5`}
            >
              {CONTRACT_TYPE_OPTIONS.find((opt) => opt.value === formData.type)?.label ||
                formData.type}
            </Badge>
            <Badge variant={contractDetail.status === "ACTIVE" ? "default" : "secondary"}>
              {contractDetail.status}
            </Badge>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Progress: {completedRequiredTabs.length}/{requiredTabs.length} sections completed
            </span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Tabs navigation */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const isClickable =
                tab.step <=
                Math.min(tabs.filter((t) => t.isCompleted).length + 1, EDIT_TABS.length);

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => isClickable && handleTabChange(tab.id)}
                  disabled={!isClickable}
                  whileHover={isClickable ? { y: -2 } : {}}
                  className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors
                    ${
                      isActive
                        ? "text-primary border-b-2 border-primary"
                        : isClickable
                          ? "text-gray-600 hover:text-gray-900 border-b-2 border-transparent"
                          : "text-gray-400 cursor-not-allowed border-b-2 border-transparent"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                      ${
                        tab.isCompleted
                          ? "bg-green-100 text-green-700"
                          : isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-gray-100 text-gray-500"
                      }
                    `}
                    >
                      {tab.isCompleted ? "✓" : index + 1}
                    </span>
                    {tab.label}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent(activeTab)}
        </motion.div>

        {errors.general && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="sticky bottom-0 -mx-2 bg-white/90 border-t rounded-xl border-gray-200 shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleGoBack}>
              Cancel
            </Button>
            {canGoPrevious() && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowPreviewModal(true)}>
              <FaEye className="mr-2" />
              Preview Changes
            </Button>
            {canGoNext() ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleUpdateContract} disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Update Contract
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <ContractPreviewModal
          key={JSON.stringify(formData)} // Force re-render when formData changes
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          contractData={prepareContractDataForPreview(formData)}
          onConfirmCreate={handleSubmit}
        />
      )}
    </div>
  );
};

export default EditContractPage;
