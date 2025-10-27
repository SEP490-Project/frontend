import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneNumberInput } from "@/components/phone-number-input";
import { BankAccountInput } from "@/components/bank-number-input";
import { DatePicker } from "@/components/date-picker";
import { validateField } from "../../validation";
import { DataSelector, AddressSelector } from "@/components/global";
import { useAppDispatch } from "@/libs/stores";
import { useBrand } from "@/libs/hooks/useBrand";
import { useBank } from "@/libs/hooks/useBank";
import { useConfig } from "@/libs/hooks/useConfig";
import {
  brand as fetchBrands,
  brandDetail as fetchBrandDetail,
} from "@/libs/stores/brandManager/thunk";
import { bankList } from "@/libs/stores/bankManager/thunk";
import { getRepresentativeConfig } from "@/libs/stores/configManager/thunk";
import { useDebounce } from "@/libs/hooks/useDebounce";
import {
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaUser,
  FaBuilding,
  FaFileLines,
  FaLandmark,
  FaImage,
} from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";

interface ContractInformationProps {
  formData: any;
  onContractTypeChange: (type: string) => void;
  onInputChange: (field: string, value: any) => void;
  errors?: any;
  onFieldValidation?: (field: string, error: string | null) => void;
}

const CONTRACT_TYPE_OPTIONS = [
  { value: "ADVERTISING", label: "Advertising" },
  { value: "AFFILIATE", label: "Affiliate" },
  { value: "BRAND_AMBASSADOR", label: "Brand Ambassador" },
  { value: "CO_PRODUCING", label: "Co-Producing" },
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
};

// map config keys (snake_case) to form fields (camelCase)
const REP_CONFIG_TO_FORM_MAP: Record<string, string> = {
  representative_name: "representativeName",
  representative_role: "representativeRole",
  representative_phone: "representativePhone",
  representative_email: "representativeEmail",
  representative_tax_number: "representativeTaxNumber",
  representative_bank_name: "representativeBankName",
  representative_bank_account_number: "representativeBankAccountNumber",
  representative_bank_account_holder: "representativeBankAccountHolder",
};

// Small presentational components
const FieldError = ({ message }: { message?: string | null }) =>
  message ? <p className="text-xs text-red-500 mt-1">{message}</p> : null;

const MemoBrandCard = React.memo(({ brand, isSelection }: { brand: any; isSelection: boolean }) => {
  if (!brand) return null;
  return (
    <div
      className={`flex ${
        isSelection ? "items-center p-2 sm:p-4" : "flex-col sm:flex-row sm:items-start p-4 sm:p-6"
      } gap-4 sm:gap-6 rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md w-full`}
    >
      <div
        className={`flex-shrink-0 ${
          isSelection ? "h-12 w-12" : "h-20 w-20"
        } rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-center`}
      >
        {brand.logo_url ? (
          <img
            src={brand.logo_url}
            alt={brand.name}
            className="object-contain h-full w-full rounded-xl"
            loading="lazy"
          />
        ) : (
          <FaImage className="text-slate-400 h-6 w-6 sm:h-8 sm:w-8" />
        )}
      </div>

      <div className={`flex-1 min-w-0 ${isSelection ? "overflow-hidden" : ""}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 min-w-0">
          <div className="min-w-0">
            <h3
              className={`font-semibold text-slate-900 truncate ${
                isSelection ? "text-sm sm:text-base" : "text-lg"
              }`}
            >
              {brand.name}
            </h3>
            {brand.industry && <p className="text-sm text-slate-500 truncate">{brand.industry}</p>}
          </div>
        </div>

        {!isSelection && brand.description && (
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">{brand.description}</p>
        )}

        {!isSelection && (
          <div className="mt-5 space-y-3 text-sm">
            {brand.contact_email && (
              <div className="flex items-center gap-2 text-slate-700">
                <FaEnvelope className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span className="truncate">{brand.contact_email}</span>
              </div>
            )}
            {brand.contact_phone && (
              <div className="flex items-center gap-2 text-slate-700">
                <FaPhone className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span>{brand.contact_phone}</span>
              </div>
            )}
            {brand.website && (
              <div className="flex items-center gap-2 text-slate-700">
                <FaGlobe className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-slate-900 truncate"
                >
                  {brand.website}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

const MemoBankCard = React.memo(({ bank }: { bank: any }) => {
  if (!bank) return null;
  return (
    <div className="flex gap-3 items-center">
      {bank.logo ? (
        <img
          src={bank.logo}
          alt={bank.name}
          className="h-12 w-12 rounded-lg object-contain border"
          loading="lazy"
        />
      ) : (
        <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center border">
          <FaLandmark className="h-4 w-4 text-slate-500" />
        </div>
      )}
      <div className="flex-1">
        <div className="font-medium text-sm text-slate-900">{bank.name}</div>
        <div className="text-xs text-slate-500">{bank.code}</div>
      </div>
    </div>
  );
});

const ContractInformation: React.FC<ContractInformationProps> = ({
  formData,
  onContractTypeChange,
  onInputChange,
  errors = {},
  onFieldValidation,
}) => {
  const dispatch = useAppDispatch();
  const { brands, loading: brandLoading, pagination, brand } = useBrand();
  const { bank: banks, loading: bankLoading } = useBank();
  const { representativeConfig } = useConfig();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [allBrands, setAllBrands] = useState<any[]>([]);
  const [brandDetailsOpen, setBrandDetailsOpen] = useState(false);

  const [bankSearch, setBankSearch] = useState("");
  const debouncedBankSearch = useDebounce(bankSearch, 400);

  const filteredBanks = useMemo(() => {
    const search = debouncedBankSearch.toLowerCase();
    if (!search) return banks.map((b) => ({ ...b, id: String(b.id) }));

    return banks
      .filter(
        (bank) =>
          bank.name.toLowerCase().includes(search) || bank.shortName.toLowerCase().includes(search),
      )
      .map((b) => ({ ...b, id: String(b.id) }));
  }, [banks, debouncedBankSearch]);

  useEffect(() => {
    dispatch(bankList());
    dispatch(getRepresentativeConfig());
  }, [dispatch]);

  useEffect(() => {
    setAllBrands([]);
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    dispatch(
      fetchBrands({
        page,
        limit: 10,
        status: "ACTIVE",
        ...(debouncedSearch ? { keywords: debouncedSearch } : {}),
      }),
    );
  }, [dispatch, page, debouncedSearch]);

  useEffect(() => {
    if (page === 1) {
      setAllBrands(brands);
    } else {
      setAllBrands((prev) => [...prev, ...brands]);
    }
  }, [brands, page]);

  const loadMoreBrands = useCallback(() => {
    if (pagination?.has_next && !brandLoading) setPage((p) => p + 1);
  }, [pagination?.has_next, brandLoading]);

  const handleBrandSelect = (brandId: string | null) => {
    onInputChange("brandId", brandId || "");
    if (!brandId) {
      setBrandDetailsOpen(false);
    }
  };

  const handleBankSelect = (bankId: string | null) => {
    const selectedBank = banks.find((bank) => String(bank.id) === String(bankId));
    onInputChange("brandBankName", selectedBank ? selectedBank.name : "");
  };

  useEffect(() => {
    if (formData.brandId && formData.brandId !== brand?.id) {
      dispatch(fetchBrandDetail(formData.brandId));
      setBrandDetailsOpen(true);
    } else if (!formData.brandId) {
      setBrandDetailsOpen(false);
    }
  }, [formData.brandId, brand?.id, dispatch]);

  useEffect(() => {
    if (brand && formData.brandId) {
      const brandRepData = {
        brandRepresentativeName: brand.representative_name || "",
        brandRepresentativeRole: brand.representative_role || "",
        brandRepresentativePhone: brand.contact_phone || "",
        brandRepresentativeEmail: brand.contact_email || "",
        brandTaxNumber: brand.tax_number || "",
        brandName: brand.name || "",
        brandAddress: brand.address || "",
      };

      let hasChanges = false;
      const updates: Record<string, string> = {};

      Object.entries(brandRepData).forEach(([key, value]) => {
        if (value && !formData[key]) {
          updates[key] = value;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        Object.entries(updates).forEach(([key, value]) => {
          onInputChange(key, value);
        });
      }
    }
  }, [brand, formData, onInputChange]);

  useEffect(() => {
    if (representativeConfig) {
      Object.entries(REP_CONFIG_TO_FORM_MAP).forEach(([cfgKey, formKey]) => {
        // @ts-expect-error representativeConfig keys are dynamic (snake_case from backend)
        const value = representativeConfig[cfgKey];
        if (value && !formData[formKey]) {
          onInputChange(formKey, value);
        }
      });
    }
  }, [representativeConfig, onInputChange]);

  const handleFieldChange = async (field: string, value: any) => {
    const updatedForm = { ...formData, [field]: value };
    onInputChange(field, value);

    if (field === "signedDate") {
      onInputChange("startDate", value);
      updatedForm.startDate = value;
    }

    if (onFieldValidation) {
      const validation = await validateField(field, value, updatedForm);
      onFieldValidation(field, validation.isValid ? null : validation.error);

      if (field === "signedDate") {
        const createdAt = new Date(); // thời điểm hiện tại
        const signedDate = new Date(value);
        if (signedDate < createdAt) {
          onFieldValidation("signedDate", "Signed Date cannot be earlier than today.");
        } else {
          onFieldValidation("signedDate", null);
        }
      }

      if (
        (field === "signedDate" && updatedForm.endDate) ||
        (field === "endDate" && updatedForm.signedDate)
      ) {
        const signedDate = new Date(updatedForm.signedDate);
        const endDate = new Date(updatedForm.endDate);
        if (endDate < signedDate) {
          onFieldValidation("endDate", "End Date must be later than or equal to Signed Date.");
        } else {
          onFieldValidation("endDate", null);
        }
      }
    }
  };

  const handleAccountHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const normalized = val
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Z\s]/g, "");
    handleFieldChange("brandBankAccountHolder", normalized);
    e.target.value = normalized;
  };

  const brandRepresentativeFields = [
    { label: "Company Name", field: "brandName", placeholder: "Company name", disabled: true },
    {
      label: "Company Address",
      field: "brandAddress",
      placeholder: "Company address",
      disabled: true,
    },
    {
      label: "Representative Name",
      field: "brandRepresentativeName",
      placeholder: "Representative full name",
      required: true,
      disabled: true,
    },
    {
      label: "Representative Role",
      field: "brandRepresentativeRole",
      placeholder: "Job title/role",
      disabled: true,
    },
    {
      label: "Phone Number",
      field: "brandRepresentativePhone",
      placeholder: "0xxx xxx xxx",
      disabled: true,
    },
    {
      label: "Email Address",
      field: "brandRepresentativeEmail",
      placeholder: "example@company.com",
      type: "email",
      required: true,
      disabled: true,
    },
    { label: "Tax Number", field: "brandTaxNumber", placeholder: "Tax code", disabled: true },
  ];

  const webRepresentativeFields = [
    {
      label: "Full Name",
      field: "representativeName",
      placeholder: "KOL/Blogger full name",
      required: true,
    },
    {
      label: "Role",
      field: "representativeRole",
      placeholder: "e.g., Content Creator, KOL, Blogger",
    },
    { label: "Phone Number", field: "representativePhone", placeholder: "xxx xxx xxx" },
    {
      label: "Email Address",
      field: "representativeEmail",
      placeholder: "email@example.com",
      type: "email",
      required: true,
    },
    {
      label: "Tax Number",
      field: "representativeTaxNumber",
      placeholder: "Personal tax identification number",
    },
  ];

  const webBankingFields = [
    { label: "Bank Name", field: "representativeBankName", placeholder: "Select bank" },
    {
      label: "Account Number",
      field: "representativeBankAccountNumber",
      placeholder: "Account number",
    },
    {
      label: "Account Holder",
      field: "representativeBankAccountHolder",
      placeholder: "Account holder full name",
    },
  ];

  const getContractTypeColor = (type: string) => {
    return (
      CONTRACT_TYPE_COLORS[type as keyof typeof CONTRACT_TYPE_COLORS] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-200",
      }
    );
  };

  return (
    <div className="space-y-8">
      {/* Contract Type */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="rounded-2xl shadow-md border border-slate-200">
          <CardHeader className="flex pb-2">
            <div className="flex items-center gap-3">
              <FaFileLines className="h-5 w-5 text-slate-700" />
              <CardTitle className="text-base">Contract Type</CardTitle>
              {formData.type && (
                <Badge
                  variant="outline"
                  className={`${getContractTypeColor(formData.type).bg} ${getContractTypeColor(formData.type).text} ${getContractTypeColor(formData.type).border}`}
                >
                  {CONTRACT_TYPE_OPTIONS.find((opt) => opt.value === formData.type)?.label ||
                    formData.type}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="gap-4 items-center">
              <Label className="text-sm font-medium">Choose contract type *</Label>
              <div className="text-sm text-slate-500">
                Tip: choose the type to show relevant fields.
              </div>
              <Select value={formData.type} onValueChange={onContractTypeChange}>
                <SelectTrigger className="h-11 mt-2 bg-white">
                  <SelectValue placeholder="Select contract type..." />
                </SelectTrigger>
                <SelectContent>
                  {CONTRACT_TYPE_OPTIONS.map((o) => {
                    const colors = getContractTypeColor(o.value);
                    return (
                      <SelectItem key={o.value} value={o.value} className="py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${colors.bg} ${colors.border} border`}
                          />
                          {o.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FieldError message={errors.type} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Brand Selection */}
      <AnimatePresence>
        {formData.type && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
          >
            <Card className="rounded-2xl shadow-md border border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Brand Selection</CardTitle>
                <p className="text-sm text-slate-500">Search and pick the partner brand.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <DataSelector
                    data={allBrands}
                    selectedId={formData.brandId}
                    onSelect={handleBrandSelect}
                    renderItem={(b) => <MemoBrandCard brand={b} isSelection={true} />}
                    getLabel={(b) => b.name}
                    title="Brands"
                    placeholder="Search brands name..."
                    onSearch={setSearch}
                    searchValue={search}
                    onScrollEnd={loadMoreBrands}
                    loading={brandLoading}
                  />
                  <AnimatePresence>
                    {brandDetailsOpen && brand && formData.brandId && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                            Brand Information
                          </h2>
                        </div>
                        <MemoBrandCard brand={brand} isSelection={false} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contract Information */}
      <AnimatePresence>
        {formData.type && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
          >
            <Card className="rounded-2xl shadow-md border border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FaFileLines className="h-5 w-5 text-slate-700" />
                  <CardTitle className="text-base">Contract Information</CardTitle>
                </div>
                <p className="text-sm text-slate-500">Dates, location and contract identifiers.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium">Contract Title *</Label>
                    <Input
                      value={formData.title || ""}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      placeholder="Enter contract title (e.g. 'Brand Partnership Agreement for Digital Marketing Campaign')"
                      className={`h-11 ${errors.title ? "border-red-500" : ""}`}
                    />
                    <p className="text-xs text-slate-500">
                      A descriptive title that summarizes the purpose of this contract
                    </p>
                    <FieldError message={errors.title} />
                  </div>
                  <AddressSelector
                    value={formData.signedLocation || ""}
                    onChange={(address) => handleFieldChange("signedLocation", address)}
                    label="Signed Location"
                    placeholder="Search for contract signing location..."
                    required
                    error={errors.signedLocation}
                  />
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Contract Number *</Label>
                    <Input
                      value={formData.contractNumber || ""}
                      onChange={(e) => handleFieldChange("contractNumber", e.target.value)}
                      placeholder="Contract number e.g. CT-2025-001"
                      className={`h-11 ${errors.contractNumber ? "border-red-500" : ""}`}
                    />
                    <FieldError message={errors.contractNumber} />
                  </div>
                  <DatePicker
                    label="Signed Date"
                    value={formData.signedDate || ""}
                    onChange={(value: string) => {
                      handleFieldChange("signedDate", value);
                      handleFieldChange("startDate", value);
                    }}
                    placeholder="Select signed date"
                    error={errors.signedDate}
                    required
                    minDate={new Date().toISOString().split("T")[0]}
                  />
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Contract Duration</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Start Date</Label>
                        <DatePicker
                          value={formData.startDate || ""}
                          onChange={(value: string) => handleFieldChange("startDate", value)}
                          placeholder="Auto-filled from Signed Date"
                          disabled
                        />
                        <p className="text-xs text-slate-500 mt-1">Auto-filled from Signed Date</p>
                      </div>
                      <div>
                        <Label className="text-xs">End Date *</Label>
                        <DatePicker
                          value={formData.endDate || ""}
                          onChange={(value: string) => handleFieldChange("endDate", value)}
                          placeholder="Select end date"
                          error={errors.endDate}
                          required
                          minDate={formData.startDate || formData.signedDate || undefined}
                        />
                        <FieldError message={errors.endDate} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Representatives */}
      <AnimatePresence>
        {formData.type && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
          >
            <Card className="rounded-2xl shadow-md border border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FaUser className="h-5 w-5 text-slate-700" />
                  <CardTitle className="text-base">Representative Information</CardTitle>
                </div>
                <p className="text-sm text-slate-500">
                  Auto-filled details for both parties (editable where allowed).
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Brand Representative */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <FaBuilding className="h-5 w-5 text-slate-600" />
                      <h4 className="text-sm font-semibold">Brand Representative (Party A)</h4>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {formData.brandId ? "From Brand Data" : "Auto-filled"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {brandRepresentativeFields.map((f) => (
                      <div
                        key={f.field}
                        className={f.field === "brandAddress" ? "md:col-span-2" : ""}
                      >
                        <div className="space-y-1">
                          <Label className="text-sm">
                            {f.label}
                            {f.required ? " *" : ""}
                          </Label>
                          {f.field === "brandRepresentativePhone" ? (
                            <PhoneNumberInput
                              value={formData[f.field] || ""}
                              onChange={(val) => handleFieldChange(f.field, val)}
                              disabled={f.disabled}
                              placeholder={f.placeholder}
                              error={errors[f.field]}
                            />
                          ) : (
                            <Input
                              disabled={f.disabled}
                              value={formData[f.field] || ""}
                              onChange={(e) => handleFieldChange(f.field, e.target.value)}
                              placeholder={f.placeholder}
                              className={`h-11 ${f.disabled ? "bg-slate-50" : ""}`}
                            />
                          )}
                          <FieldError message={errors[f.field]} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brand Banking */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <FaLandmark className="h-5 w-5 text-slate-600" />
                      <h4 className="text-sm font-semibold">Brand Banking Information</h4>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Editable
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Bank Name</Label>
                      <DataSelector
                        data={filteredBanks}
                        selectedId={
                          banks
                            .find((bank: any) => bank.name === formData.brandBankName)
                            ?.id?.toString() || ""
                        }
                        onSelect={handleBankSelect}
                        renderItem={(bank) => <MemoBankCard bank={bank} />}
                        getLabel={(bank) => `${bank.name} - ${bank.shortName}`}
                        title="Banks"
                        placeholder="Search bank name..."
                        onSearch={setBankSearch}
                        searchValue={bankSearch}
                        loading={bankLoading}
                      />
                      <FieldError message={errors.brandBankName} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          label: "Account Number",
                          field: "brandBankAccountNumber",
                          placeholder: "Account number",
                        },
                        {
                          label: "Account Holder",
                          field: "brandBankAccountHolder",
                          placeholder: "Account holder full name",
                        },
                      ].map((field) => (
                        <div key={field.field} className="space-y-1">
                          <Label className="text-sm">{field.label}</Label>
                          {field.field === "brandBankAccountHolder" ? (
                            <Input
                              value={formData.brandBankAccountHolder || ""}
                              onChange={handleAccountHolderChange}
                              placeholder={field.placeholder}
                              className={`h-11 ${errors.brandBankAccountHolder ? "border-red-500" : ""}`}
                            />
                          ) : (
                            <BankAccountInput
                              value={formData.brandBankAccountNumber || ""}
                              onChange={(val) => handleFieldChange("brandBankAccountNumber", val)}
                              placeholder={field.placeholder}
                              error={errors.brandBankAccountNumber}
                            />
                          )}
                          <FieldError message={errors[field.field]} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Web Representative */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <FaUser className="h-5 w-5 text-slate-600" />
                      <h4 className="text-sm font-semibold">Web Representative (Party B)</h4>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Auto-filled
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {webRepresentativeFields.map((f) => (
                      <div key={f.field} className="space-y-1">
                        <Label className="text-sm">
                          {f.label}
                          {f.required ? " *" : ""}
                        </Label>
                        {f.field === "representativePhone" ? (
                          <PhoneNumberInput
                            value={formData[f.field] || ""}
                            onChange={(val) => handleFieldChange(f.field, val)}
                            disabled
                            placeholder={f.placeholder}
                            error={errors[f.field]}
                          />
                        ) : (
                          <Input
                            disabled
                            value={formData[f.field] || ""}
                            onChange={(e) => handleFieldChange(f.field, e.target.value)}
                            placeholder={f.placeholder}
                            className="h-11 bg-slate-50"
                          />
                        )}
                        <FieldError message={errors[f.field]} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-slate-700">Banking Information</h5>
                      <Badge variant="secondary" className="text-xs">
                        Auto-filled
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Bank Name</Label>
                        <Input
                          disabled
                          value={formData.representativeBankName || ""}
                          onChange={(e) =>
                            handleFieldChange("representativeBankName", e.target.value)
                          }
                          placeholder="Bank name"
                          className="h-11 bg-slate-50"
                        />
                        <FieldError message={errors.representativeBankName} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {webBankingFields.slice(1).map((field) => (
                          <div key={field.field} className="space-y-1">
                            <Label className="text-sm">{field.label}</Label>
                            <Input
                              disabled
                              value={formData[field.field] || ""}
                              onChange={(e) => handleFieldChange(field.field, e.target.value)}
                              placeholder={field.placeholder}
                              className="h-11 bg-slate-50"
                            />
                            <FieldError message={errors[field.field]} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContractInformation;
