import React, { useState } from "react";
import {
  BrandSelection,
  ContractActions,
  ContractTypeTemplate,
  FinancialTerms,
  Representative,
} from "@/components/layout/manage/contract";
import { validateContract, validateField } from "@/libs/validation/contractValidation";
import brands from "./brands.json";

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
    webRepresentativeBankName: "",
    webRepresentativeBankAccountNumber: "",
    webRepresentativeBankAccountHolder: "",

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

  const contractTypeOptions = [
    { value: "ADVERTISING", label: "Advertising Contract" },
    { value: "AFFILIATE", label: "Affiliate Marketing" },
    { value: "BRAND_AMBASSADOR", label: "Brand Ambassador" },
    { value: "CO_PRODUCING", label: "Co-Production" },
  ];

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

    switch (type) {
      case "ADVERTISING":
      case "BRAND_AMBASSADOR":
        defaultFinancialTerms = {
          model: "fixed",
          paymentMethod: "Chuyển khoản",
          totalCost: 0,
          costBreakdown: {
            serviceFee: 0,
            otherFees: 0,
          },
          schedule: [
            {
              milestone: "Upon Signing",
              percent: 50,
              amount: 0,
              dueDate: "",
              requiredDocs: ["Valid Invoice"],
            },
            {
              milestone: "After successful posting",
              percent: 50,
              amount: 0,
              dueWithinDays: 7,
              requiredDocs: ["Liquidation Minutes"],
            },
          ],
        };
        break;

      case "AFFILIATE":
        defaultFinancialTerms = {
          model: "levels",
          basePerClick: 5000,
          levels: [
            { level: 1, minClicks: 0, multiplier: 0.1 },
            { level: 2, minClicks: 100, multiplier: 0.2 },
            { level: 3, minClicks: 1000, multiplier: 0.25 },
          ],
          paymentCycle: "MONTHLY",
          paymentDate: "5th-10th",
          taxWithholding: {
            threshold: 2000000,
            ratePercent: 10,
          },
        };
        break;

      case "CO_PRODUCING":
        defaultFinancialTerms = {
          model: "share",
          capitalContribution: {
            company: { description: "Capital and production facility", value: 500000000 },
            kol: { description: "Brand image and marketing design", value: 200000000 },
          },
          profitSplitCompanyPercent: 70,
          profitSplitKolPercent: 30,
          profitDistributionCycle: "ANNUALLY",
          profitDistributionDate: "December 31st",
        };

        defaultScopeOfWork.coProductionRoles = {
          company: "Manage manufacturing and logistics",
          kol: "Manage marketing, design, and sales recruitment",
        };
        break;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold mb-8">Add New Contract</h1>

        {errors.general && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contract Type Template */}
          <ContractTypeTemplate
            formData={formData}
            onInputChange={handleInputChange}
            onUpdateScopeOfWork={updateScopeOfWork}
            onFieldValidation={handleFieldValidation}
            errors={errors}
          />

          {/* Representative Information */}
          <Representative formData={formData} onInputChange={handleInputChange} errors={errors} />

          {/* Brand Selection */}
          <BrandSelection
            formData={formData}
            selectedBrand={selectedBrand}
            isExtension={isExtension}
            contractTypeOptions={contractTypeOptions}
            onBrandChange={handleBrandChange}
            onExtensionChange={handleExtensionChange}
            onInputChange={handleInputChange}
          />

          {/* Financial Terms */}
          <FinancialTerms
            formData={formData}
            contractTypeOptions={contractTypeOptions}
            onContractTypeChange={handleContractTypeChange}
            onUpdateFinancialTerms={updateFinancialTerms}
            errors={errors}
          />

          {/* Contract Actions */}
          <ContractActions
            formData={formData}
            onContractFilesChange={handleContractFilesChange}
            onProposalFilesChange={handleProposalFilesChange}
            onContractUpload={handleContractUpload}
            onProposalUpload={handleProposalUpload}
            onSubmit={handleSubmit}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateContractPage;
