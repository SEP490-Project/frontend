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

// map config keys (snake_case) to form fields (snake_case)
const REP_CONFIG_TO_FORM_MAP: Record<string, string> = {
  representative_name: "representative_name",
  representative_role: "representative_role",
  representative_phone: "representative_phone",
  representative_email: "representative_email",
  representative_tax_number: "representative_tax_number",
  representative_bank_name: "representative_bank_name",
  representative_bank_account_number: "representative_bank_account_number",
  representative_bank_account_holder: "representative_bank_account_holder",
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
    onInputChange("brand_id", brandId || "");
    // Sửa logic này - chỉ đóng khi không có brandId
    if (!brandId) {
      setBrandDetailsOpen(false);
    }
    // Không cần set true ở đây vì useEffect sẽ handle
  };

  const handleBankSelect = (bankId: string | null) => {
    const selectedBank = banks.find((bank) => String(bank.id) === String(bankId));
    onInputChange("brand_bank_name", selectedBank ? selectedBank.name : "");
  };

  // Effect để auto-fetch brand detail nếu brand_id đã có sẵn
  useEffect(() => {
    if (formData.brand_id) {
      // Nếu có brand_id nhưng chưa có brand data hoặc brand data không khớp
      if (!brand || formData.brand_id !== brand.id) {
        console.log("Fetching brand detail for ID:", formData.brand_id); // Debug log
        dispatch(fetchBrandDetail(formData.brand_id));
      }
      // Luôn mở brand details khi có brand_id
      setBrandDetailsOpen(true);
    } else {
      // Đóng brand details khi không có brand_id
      setBrandDetailsOpen(false);
    }
  }, [formData.brand_id, brand?.id, dispatch]);

  // Thêm useEffect để debug
  useEffect(() => {
    console.log("Brand details state:", {
      brandDetailsOpen,
      hasBrandId: !!formData.brand_id,
      brandData: !!brand,
      brandId: formData.brand_id,
      currentBrandId: brand?.id,
    });
  }, [brandDetailsOpen, formData.brand_id, brand]);

  useEffect(() => {
    if (brand && formData.brand_id) {
      const brandRepData = {
        brand_representative_name: brand.representative_name || "",
        brand_representative_role: brand.representative_role || "",
        brand_representative_phone: brand.contact_phone || "",
        brand_representative_email: brand.contact_email || "",
        brand_tax_number: brand.tax_number || "",
        brand_name: brand.name || "",
        brand_address: brand.address || "",
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

    if (field === "signed_date") {
      onInputChange("start_date", value);
      updatedForm.start_date = value;
    }

    if (onFieldValidation) {
      const validation = await validateField(field, value, updatedForm);
      onFieldValidation(field, validation.isValid ? null : validation.error);

      if (field === "signed_date") {
        const createdAt = new Date();
        const signedDate = new Date(value);
        if (signedDate < createdAt) {
          onFieldValidation("signed_date", "Signed Date cannot be earlier than today.");
        } else {
          onFieldValidation("signed_date", null);
        }
      }

      if (
        (field === "signed_date" && updatedForm.end_date) ||
        (field === "end_date" && updatedForm.signed_date)
      ) {
        const signedDate = new Date(updatedForm.signed_date);
        const endDate = new Date(updatedForm.end_date);
        if (endDate < signedDate) {
          onFieldValidation("end_date", "End date must be later than or equal to signed date.");
        } else {
          onFieldValidation("end_date", null);
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
    handleFieldChange("brand_bank_account_holder", normalized);
    e.target.value = normalized;
  };

  const brandRepresentativeFields = [
    { label: "Company Name", field: "brand_name", placeholder: "Company name", disabled: true },
    {
      label: "Company Address",
      field: "brand_address",
      placeholder: "Company address",
      disabled: true,
    },
    {
      label: "Representative Name",
      field: "brand_representative_name",
      placeholder: "Representative full name",
      required: true,
      disabled: true,
    },
    {
      label: "Representative Role",
      field: "brand_representative_role",
      placeholder: "Job title/role",
      disabled: true,
    },
    {
      label: "Phone Number",
      field: "brand_representative_phone",
      placeholder: "0xxx xxx xxx",
      disabled: true,
    },
    {
      label: "Email Address",
      field: "brand_representative_email",
      placeholder: "example@company.com",
      type: "email",
      required: true,
      disabled: true,
    },
    { label: "Tax Number", field: "brand_tax_number", placeholder: "Tax code", disabled: true },
  ];

  const webRepresentativeFields = [
    {
      label: "Full Name",
      field: "representative_name",
      placeholder: "KOL/Blogger full name",
      required: true,
    },
    {
      label: "Role",
      field: "representative_role",
      placeholder: "e.g., Content Creator, KOL, Blogger",
    },
    { label: "Phone Number", field: "representative_phone", placeholder: "xxx xxx xxx" },
    {
      label: "Email Address",
      field: "representative_email",
      placeholder: "email@example.com",
      type: "email",
      required: true,
    },
    {
      label: "Tax Number",
      field: "representative_tax_number",
      placeholder: "Personal tax identification number",
    },
  ];

  const webBankingFields = [
    { label: "Bank Name", field: "representative_bank_name", placeholder: "Select bank" },
    {
      label: "Account Number",
      field: "representative_bank_account_number",
      placeholder: "Account number",
    },
    {
      label: "Account Holder",
      field: "representative_bank_account_holder",
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
                <p className="text-sm text-slate-500">
                  {formData.brand_id
                    ? "Selected brand (you can change if needed)"
                    : "Search and pick the partner brand."}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <DataSelector
                    data={allBrands}
                    selectedId={formData.brand_id}
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
                    {brandDetailsOpen && formData.brand_id && (
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

                        {/* Hiển thị loading state nếu đang fetch brand */}
                        {brandLoading && !brand ? (
                          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-sm text-gray-600">
                              Loading brand information...
                            </span>
                          </div>
                        ) : brand ? (
                          <MemoBrandCard brand={brand} isSelection={false} />
                        ) : (
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              Brand information not found. Please select another brand.
                            </p>
                          </div>
                        )}
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
                    value={formData.signed_location || ""}
                    onChange={(address) => handleFieldChange("signed_location", address)}
                    label="Signed Location"
                    placeholder="Search for contract signing location..."
                    required
                    error={errors.signed_location}
                  />
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Contract Number *</Label>
                    <Input
                      value={formData.contract_number || ""}
                      onChange={(e) => handleFieldChange("contract_number", e.target.value)}
                      placeholder="Contract number e.g. CT-2025-001"
                      className={`h-11 ${errors.contract_number ? "border-red-500" : ""}`}
                    />
                    <FieldError message={errors.contract_number} />
                  </div>
                  <DatePicker
                    label="Signed Date"
                    value={formData.signed_date || ""}
                    onChange={(value: string) => {
                      handleFieldChange("signed_date", value);
                      handleFieldChange("start_date", value);
                    }}
                    placeholder="Select signed date"
                    error={errors.signed_date}
                    required
                    minDate={new Date().toISOString().split("T")[0]}
                  />
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Contract Duration</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Start Date</Label>
                        <DatePicker
                          value={formData.start_date || ""}
                          onChange={(value: string) => handleFieldChange("start_date", value)}
                          placeholder="Auto-filled from Signed Date"
                          disabled
                        />
                        <p className="text-xs text-slate-500 mt-1">Auto-filled from Signed Date</p>
                      </div>
                      <div>
                        <Label className="text-xs">End Date *</Label>
                        <DatePicker
                          value={formData.end_date || ""}
                          onChange={(value: string) => handleFieldChange("end_date", value)}
                          placeholder="Select end date"
                          error={errors.end_date}
                          required
                          minDate={formData.start_date || formData.signed_date || undefined}
                        />
                        <FieldError message={errors.end_date} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Representatives - Update với snake_case fields */}
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
                      {formData.brand_id ? "From Brand Data" : "Auto-filled"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {brandRepresentativeFields.map((f) => (
                      <div
                        key={f.field}
                        className={f.field === "brand_address" ? "md:col-span-2" : ""}
                      >
                        <div className="space-y-1">
                          <Label className="text-sm">
                            {f.label}
                            {f.required ? " *" : ""}
                          </Label>
                          {f.field === "brand_representative_phone" ? (
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
                        {f.field === "representative_phone" ? (
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
