import React, { useState, useEffect, useCallback } from "react";
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
import { DatePicker } from "@/components/date-picker";
import { validateField } from "../../validation";
import { DataSelector, AddressSelector } from "@/components/global";
import { useAppDispatch } from "@/libs/stores";
import { useBrand } from "@/libs/hooks/useBrand";
import { useBank } from "@/libs/hooks/useBank";
import {
  brand as fetchBrands,
  brandDetail as fetchBrandDetail,
} from "@/libs/stores/brandManager/thunk";
import { bankList } from "@/libs/stores/bankManager/thunk";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { Mail, Phone, Globe, User, Building, FileText, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ContractInformationProps {
  formData: any;
  onContractTypeChange: (type: string) => void;
  onInputChange: (field: string, value: any) => void;
  onUpdateScopeOfWork?: (updates: any) => void;
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
} as const;

const SAMPLE_BRAND_REPRESENTATIVE = {
  brandRepresentativeName: "Nguyễn Văn A",
  brandRepresentativePosition: "Marketing Manager",
  brandRepresentativePhone: "+84 901 234 567",
  brandRepresentativeEmail: "marketing@brand.com",
  brandTaxNumber: "0123456789",
};

const SAMPLE_WEB_REPRESENTATIVE = {
  webRepresentativeName: "Nguyễn Minh Anh",
  webRepresentativePosition: "Content Creator / KOL",
  webRepresentativePhone: "+84 912 345 678",
  webRepresentativeEmail: "minhanh.kol@example.com",
  webRepresentativeTaxNumber: "1234567890",
};

// Small presentational components
const FieldError = ({ message }: { message?: string | null }) =>
  message ? <p className="text-xs text-red-500 mt-1">{message}</p> : null;

const IconText = ({ Icon, children }: any) => (
  <div className="flex items-center gap-2 text-sm text-slate-600">
    <Icon className="h-4 w-4" />
    <span>{children}</span>
  </div>
);

const BrandCard = ({ brand }: { brand: any }) => {
  if (!brand) return null;
  return (
    <div className="flex gap-4 items-start">
      {brand.logo_url ? (
        <img
          src={brand.logo_url}
          alt={brand.name}
          className="h-12 w-12 rounded-lg object-contain border"
        />
      ) : (
        <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center border">
          <FileText className="h-5 w-5 text-slate-500" />
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900">{brand.name}</h4>
        </div>
        {brand.description && <p className="text-xs text-slate-600 mt-1">{brand.description}</p>}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {brand.contact_email && <IconText Icon={Mail}>{brand.contact_email}</IconText>}
          {brand.contact_phone && <IconText Icon={Phone}>{brand.contact_phone}</IconText>}
          {brand.website && (
            <IconText Icon={Globe}>
              <a href={brand.website} target="_blank" rel="noreferrer" className="underline">
                {brand.website}
              </a>
            </IconText>
          )}
        </div>
      </div>
    </div>
  );
};

const BankCard = ({ bank }: { bank: any }) => {
  if (!bank) return null;
  return (
    <div className="flex gap-3 items-center">
      {bank.logo ? (
        <img
          src={bank.logo}
          alt={bank.name}
          className="h-12 w-12 rounded-lg object-contain border"
        />
      ) : (
        <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center border">
          <Landmark className="h-4 w-4 text-slate-500" />
        </div>
      )}
      <div className="flex-1">
        <div className="font-medium text-sm text-slate-900">{bank.name}</div>
        <div className="text-xs text-slate-500">{bank.code}</div>
      </div>
    </div>
  );
};

const ContractInformation: React.FC<ContractInformationProps> = ({
  formData,
  onContractTypeChange,
  onInputChange,
  errors = {},
  onFieldValidation,
}) => {
  const dispatch = useAppDispatch();
  const { brands, loading: brandLoading, pagination, brand } = useBrand();
  const { bank: banks, loading: bankLoading } = useBank(); // Add this line

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [allBrands, setAllBrands] = useState<any[]>([]);
  const [brandDetailsOpen, setBrandDetailsOpen] = useState(false);

  // Add bank search states
  const [bankSearch, setBankSearch] = useState("");
  const [filteredBanks, setFilteredBanks] = useState<any[]>([]);

  useEffect(() => {
    setAllBrands([]);
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    dispatch(
      fetchBrands({
        page,
        limit: 10,
        ...(debouncedSearch ? { keywords: debouncedSearch } : {}),
      }),
    );
  }, [dispatch, page, debouncedSearch]);

  useEffect(() => {
    if (page === 1) setAllBrands(brands);
    else setAllBrands((prev) => [...prev, ...brands]);
  }, [brands, page]);

  const loadMoreBrands = useCallback(() => {
    if (pagination?.has_next && !brandLoading) setPage((p) => p + 1);
  }, [pagination, brandLoading]);

  // Add useEffect to fetch banks on component mount
  useEffect(() => {
    dispatch(bankList());
  }, [dispatch]);

  // Add useEffect to filter banks based on search
  useEffect(() => {
    if (!bankSearch) {
      setFilteredBanks(banks);
    } else {
      const filtered = banks.filter(
        (bank: any) =>
          bank.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
          bank.code.toLowerCase().includes(bankSearch.toLowerCase()),
      );
      setFilteredBanks(filtered);
    }
  }, [banks, bankSearch]);

  // Handle brand selection with clear functionality
  const handleBrandSelect = (brandId: string | null) => {
    onInputChange("brandId", brandId || "");

    // If clearing brand selection, also clear brand details
    if (!brandId) {
      setBrandDetailsOpen(false);
    }
  };

  // Add handler for bank selection
  const handleBankSelect = (bankId: string | null) => {
    const selectedBank = banks.find((bank: any) => bank.id.toString() === bankId);
    onInputChange("brandBankName", selectedBank ? selectedBank.name : "");
    onInputChange("selectedBankId", bankId || ""); // Store bank ID for reference
  };

  // fetch brand detail when brandId changes
  useEffect(() => {
    if (!formData.brandId) {
      setBrandDetailsOpen(false);
      return;
    }
    dispatch(fetchBrandDetail(formData.brandId));
    setBrandDetailsOpen(true);
  }, [formData.brandId, dispatch]);

  // Autofill sample reps on mount (if empty)
  useEffect(() => {
    Object.entries(SAMPLE_BRAND_REPRESENTATIVE).forEach(([key, value]) => {
      if (!formData[key]) onInputChange(key, value);
    });
    Object.entries(SAMPLE_WEB_REPRESENTATIVE).forEach(([key, value]) => {
      if (!formData[key]) onInputChange(key, value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        const startDateValidation = await validateField("startDate", value, updatedForm);
        onFieldValidation(
          "startDate",
          startDateValidation.isValid ? null : startDateValidation.error,
        );
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

  // Representative fields (for rendering)
  const brandRepresentativeFields = [
    {
      label: "Full Name",
      field: "brandRepresentativeName",
      placeholder: "Representative full name",
      required: true,
    },
    { label: "Position", field: "brandRepresentativePosition", placeholder: "Job title/position" },
    { label: "Phone Number", field: "brandRepresentativePhone", placeholder: "0xxx xxx xxx" },
    {
      label: "Email Address",
      field: "brandRepresentativeEmail",
      placeholder: "example@company.com",
      type: "email",
      required: true,
    },
    { label: "Tax Number", field: "brandTaxNumber", placeholder: "Tax code" },
  ];

  const webRepresentativeFields = [
    {
      label: "Full Name",
      field: "webRepresentativeName",
      placeholder: "KOL/Blogger full name",
      required: true,
    },
    {
      label: "Position",
      field: "webRepresentativePosition",
      placeholder: "e.g., Content Creator, KOL, Blogger",
    },
    { label: "Phone Number", field: "webRepresentativePhone", placeholder: "xxx xxx xxx" },
    {
      label: "Email Address",
      field: "webRepresentativeEmail",
      placeholder: "email@example.com",
      type: "email",
      required: true,
    },
    {
      label: "Tax Number",
      field: "webRepresentativeTaxNumber",
      placeholder: "Personal tax identification number",
    },
  ];

  // Get contract type color
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
              <FileText className="h-5 w-5 text-slate-700" />
              <CardTitle className="text-base">Contract Type</CardTitle>
              {formData.type && (
                <Badge
                  variant="outline"
                  className={`${getContractTypeColor(formData.type).bg} ${
                    getContractTypeColor(formData.type).text
                  } ${getContractTypeColor(formData.type).border}`}
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
                <SelectTrigger className={"h-11 mt-2 bg-white"}>
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
                    renderItem={(b) => <BrandCard brand={b} />}
                    getLabel={(b) => b.name}
                    title="Brands"
                    placeholder="Search brands name..."
                    onSearch={setSearch}
                    searchValue={search}
                    onScrollEnd={pagination?.has_next ? loadMoreBrands : undefined}
                    loading={brandLoading}
                  />

                  <AnimatePresence>
                    {brandDetailsOpen && brand && formData.brandId && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 p-4 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-lg border border-sky-100">
                          <BrandCard brand={brand} />
                        </div>
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
                  <FileText className="h-5 w-5 text-slate-700" />
                  <CardTitle className="text-base">Contract Information</CardTitle>
                </div>
                <p className="text-sm text-slate-500">Dates, location and contract identifiers.</p>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <User className="h-5 w-5 text-slate-700" />
                  <CardTitle className="text-base">Representative Information</CardTitle>
                </div>
                <p className="text-sm text-slate-500">
                  Auto-filled details for both parties (editable where allowed).
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Brand Representative (disabled) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-slate-600" />
                      <h4 className="text-sm font-semibold">Brand Representative (Party A)</h4>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Auto-filled
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {brandRepresentativeFields.map((f) => (
                      <div key={f.field} className="space-y-1">
                        <Label className="text-sm">
                          {f.label}
                          {f.required ? " *" : ""}
                        </Label>
                        <Input
                          disabled
                          value={formData[f.field] || ""}
                          placeholder={f.placeholder}
                          className="h-11 bg-slate-50"
                        />
                        <FieldError message={errors[f.field]} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brand Banking (editable) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <Landmark className="h-5 w-5 text-slate-600" />
                      <h4 className="text-sm font-semibold">Brand Banking Information</h4>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Editable
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {/* Bank Selection using DataSelector */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Bank Name</Label>
                      <DataSelector
                        data={filteredBanks}
                        selectedId={formData.selectedBankId}
                        onSelect={handleBankSelect}
                        renderItem={(bank) => <BankCard bank={bank} />}
                        getLabel={(bank) => bank.name}
                        title="Banks"
                        placeholder="Search bank name..."
                        onSearch={setBankSearch}
                        searchValue={bankSearch}
                        loading={bankLoading}
                      />
                      <FieldError message={errors.brandBankName} />
                    </div>

                    {/* Other banking fields */}
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
                          <Input
                            value={formData[field.field] || ""}
                            onChange={(e) => handleFieldChange(field.field, e.target.value)}
                            placeholder={field.placeholder}
                            className="h-11"
                          />
                          <FieldError message={errors[field.field]} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Web Representative (disabled) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-slate-600" />
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
                        <Input
                          disabled
                          value={formData[f.field] || ""}
                          placeholder={f.placeholder}
                          className="h-11 bg-slate-50"
                        />
                        <FieldError message={errors[f.field]} />
                      </div>
                    ))}
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
