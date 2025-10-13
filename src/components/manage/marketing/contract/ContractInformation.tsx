import React, { useState, useEffect, useCallback } from "react";
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
import { validateField } from "@/libs/validation/contractValidation";
import { DataSelector } from "@/components/global";
import AddressSelector from "@/components/global/AddressSelector";
import { useAppDispatch } from "@/libs/stores";
import { useBrand } from "@/libs/hooks/useBrand";
import {
  brand as fetchBrands,
  brandDetail as fetchBrandDetail,
} from "@/libs/stores/brandManager/thunk";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { Mail, Phone, Globe, User, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ContractInformationProps {
  formData: any;
  onContractTypeChange: (type: string) => void;
  onInputChange: (field: string, value: any) => void;
  onUpdateScopeOfWork: (updates: any) => void;
  errors?: any;
  onFieldValidation?: (field: string, error: string | null) => void;
}

// Constants
const CONTRACT_TYPE_OPTIONS = [
  { value: "ADVERTISING", label: "Advertising Contract" },
  { value: "AFFILIATE", label: "Affiliate Marketing" },
  { value: "BRAND_AMBASSADOR", label: "Brand Ambassador" },
  { value: "CO_PRODUCING", label: "Co-Production" },
];

// Sample data for representatives
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

// Helper Components (Brand)
const BrandItem = ({ brand }: { brand: any }) => (
  <div className="flex items-center gap-3 p-2">
    {brand.logo_url && (
      <img
        src={brand.logo_url}
        alt={brand.name}
        className="h-8 w-8 rounded-lg object-cover border"
      />
    )}
    <div>
      <span className="font-medium">{brand.name}</span>
      <p className="text-xs text-slate-500">{brand.contact_email}</p>
    </div>
  </div>
);

const ContactInfo = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 text-slate-600">
    <Icon className="h-4 w-4" />
    {children}
  </div>
);

const BrandDetails = ({ brandId }: { brandId: string }) => {
  const dispatch = useAppDispatch();
  const { brand } = useBrand();

  useEffect(() => {
    if (!brandId) return;
    dispatch(fetchBrandDetail(brandId));
  }, [brandId, dispatch]);

  if (!brand) return null;

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {brand.logo_url && (
                <img
                  src={brand.logo_url}
                  alt={`${brand.name} logo`}
                  className="h-12 w-12 rounded-xl object-cover border-2 border-white shadow-sm"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{brand.name}</h3>
                {brand.status && (
                  <Badge
                    variant={brand.status === "ACTIVE" ? "default" : "secondary"}
                    className="mt-1"
                  >
                    {brand.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {brand.description && <p className="mt-3 text-sm text-slate-600">{brand.description}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {brand.contact_email && (
              <ContactInfo icon={Mail}>
                <span>{brand.contact_email}</span>
              </ContactInfo>
            )}
            {brand.contact_phone && (
              <ContactInfo icon={Phone}>
                <span>{brand.contact_phone}</span>
              </ContactInfo>
            )}
            {brand.website && (
              <ContactInfo icon={Globe}>
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {brand.website}
                </a>
              </ContactInfo>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Form Field Component
const FormField = ({
  label,
  field,
  placeholder,
  type = "text",
  required = false,
  formData,
  onInputChange,
  errors,
  disabled = false,
}: any) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">
      {label} {required && "*"}
    </Label>
    <Input
      type={type}
      value={formData[field] || ""}
      onChange={(e) => onInputChange(field, e.target.value)}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`h-11 ${
        disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300" : "bg-white"
      } ${errors[field] ? "border-red-500" : ""}`}
    />
    {errors[field] && <p className="text-red-500 text-xs italic">{errors[field]}</p>}
  </div>
);

const RepresentativeSection = ({
  title,
  icon: Icon,
  fields,
  formData,
  onInputChange,
  errors,
  disabled = false,
}: any) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
      <Icon className="h-5 w-5 text-slate-600" />
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {disabled && (
        <Badge variant="secondary" className="text-xs">
          Auto-filled
        </Badge>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map((field: any) => (
        <FormField
          key={field.field}
          {...field}
          formData={formData}
          onInputChange={onInputChange}
          errors={errors}
          disabled={disabled}
        />
      ))}
    </div>
  </div>
);

const ContractInformation: React.FC<ContractInformationProps> = ({
  formData,
  onContractTypeChange,
  onInputChange,
  errors = {},
  onFieldValidation,
}) => {
  const dispatch = useAppDispatch();

  /** BRAND SELECTION */
  const { brands, loading: brandLoading, pagination } = useBrand();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [allBrands, setAllBrands] = useState<any[]>([]);

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

  // Auto-fill representative data on component mount
  useEffect(() => {
    // Fill brand representative data
    Object.entries(SAMPLE_BRAND_REPRESENTATIVE).forEach(([key, value]) => {
      if (!formData[key]) {
        onInputChange(key, value);
      }
    });

    // Fill web representative data
    Object.entries(SAMPLE_WEB_REPRESENTATIVE).forEach(([key, value]) => {
      if (!formData[key]) {
        onInputChange(key, value);
      }
    });
  }, []);

  /** FIELD CHANGE WITH VALIDATION */
  const handleFieldChange = async (field: string, value: any) => {
    const updatedForm = { ...formData, [field]: value };
    onInputChange(field, value);

    // Auto-sync startDate with signedDate
    if (field === "signedDate") {
      onInputChange("startDate", value);
      updatedForm.startDate = value;
    }

    if (onFieldValidation) {
      const validation = await validateField(field, value, updatedForm);
      onFieldValidation(field, validation.isValid ? null : validation.error);

      // Also validate startDate when signedDate changes
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

  // Representative field definitions
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

  const brandBankFields = [
    { label: "Bank Name", field: "brandBankName", placeholder: "Bank name" },
    {
      label: "Account Number",
      field: "brandBankAccountNumber",
      placeholder: "Bank account number",
    },
    {
      label: "Account Holder Name",
      field: "brandBankAccountHolder",
      placeholder: "Account holder full name",
    },
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

  /** RENDER UI */
  return (
    <div className="space-y-8">
      {/* CONTRACT TYPE */}
      <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-br from-primary/90 to-primary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
        <CardHeader className="relative pb-4">
          <CardTitle className="text-xl font-semibold text-white drop-shadow">
            Contract Type Selection
          </CardTitle>
          <p className="text-sm text-pink-50 drop-shadow-sm">
            Choose the type of contract you want to create
          </p>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-2">
            <Label htmlFor="contractType" className="text-sm font-medium text-white/90">
              Contract Type *
            </Label>
            <Select value={formData.type} onValueChange={onContractTypeChange}>
              <SelectTrigger
                className={`h-12 text-base bg-white/90 backdrop-blur-sm rounded-lg ${
                  errors.type ? "border-red-500" : "border-pink-200"
                } focus:border-pink-400`}
              >
                <SelectValue placeholder="Select contract type to get started..." />
              </SelectTrigger>
              <SelectContent>
                {CONTRACT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-base py-3">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-200">{errors.type}</p>}
          </div>
        </CardContent>
      </Card>

      {/* BRAND SELECTION */}
      {formData.type && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Brand Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">Select Brand *</Label>
              <DataSelector
                data={allBrands}
                selectedId={formData.brandId}
                onSelect={(id) => onInputChange("brandId", id || "")}
                renderItem={(b) => <BrandItem brand={b} />}
                getLabel={(b) => b.name}
                title="Brands"
                placeholder="Choose a brand to work with"
                onSearch={setSearch}
                searchValue={search}
                onScrollEnd={pagination?.has_next ? loadMoreBrands : undefined}
                loading={brandLoading}
              />
            </div>
            {formData.brandId && <BrandDetails brandId={formData.brandId} />}
          </CardContent>
        </Card>
      )}

      {/* CONTRACT INFORMATION */}
      {formData.type && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Contract Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Signed Location với AddressSelector */}
              <AddressSelector
                value={formData.signedLocation || ""}
                onChange={(address) => handleFieldChange("signedLocation", address)}
                label="Signed Location"
                placeholder="Search for contract signing location..."
                required
                error={errors.signedLocation}
              />

              {/* Contract Number */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Contract Number *</Label>
                <Input
                  value={formData.contractNumber || ""}
                  onChange={(e) => handleFieldChange("contractNumber", e.target.value)}
                  placeholder="Contract number from the signed document"
                  className={`h-11 ${errors.contractNumber ? "border-red-500" : ""}`}
                />
                {errors.contractNumber && (
                  <p className="text-sm text-red-500">{errors.contractNumber}</p>
                )}
              </div>

              {/* Signed Date */}
              <DatePicker
                label="Signed Date"
                value={formData.signedDate || ""}
                onChange={(value: string) => handleFieldChange("signedDate", value)}
                placeholder="Select signed date"
                error={errors.signedDate}
                required
              />

              {/* Contract Duration */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Start Date *</Label>
                    <DatePicker
                      value={formData.startDate || formData.signedDate || ""}
                      onChange={() => {
                        console.log("OK");
                      }}
                      placeholder="Start date (Auto-filled)"
                      error={errors.startDate}
                      required
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Automatically set to the <span className="font-medium">Signed Date</span>.
                    </p>
                  </div>

                  {/* End Date - Cho phép chọn */}
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">End Date *</Label>
                    <DatePicker
                      value={formData.endDate || ""}
                      onChange={(value: string) => handleFieldChange("endDate", value)}
                      placeholder="Select end date"
                      error={errors.endDate}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* REPRESENTATIVE INFORMATION */}
      {formData.type && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Representative Information</CardTitle>
            <p className="text-sm text-slate-600">
              Contract representative details (auto-filled from system)
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Brand Representative - Disabled */}
            <RepresentativeSection
              title="Brand Representative (Party A)"
              icon={Building}
              fields={brandRepresentativeFields}
              formData={formData}
              onInputChange={onInputChange}
              errors={errors}
              disabled={true}
            />

            {/* Brand Bank Information - Editable */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <Building className="h-5 w-5 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-800">Brand Banking Information</h3>
                <Badge variant="outline" className="text-xs">
                  Editable
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {brandBankFields.map((field: any) => (
                  <FormField
                    key={field.field}
                    {...field}
                    formData={formData}
                    onInputChange={handleFieldChange}
                    errors={errors}
                    disabled={false}
                  />
                ))}
              </div>
            </div>

            {/* Web Representative - Disabled */}
            <RepresentativeSection
              title="Web Representative (Party B - KOL/Blogger)"
              icon={User}
              fields={webRepresentativeFields}
              formData={formData}
              onInputChange={onInputChange}
              errors={errors}
              disabled={true}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractInformation;
