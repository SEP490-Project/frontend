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
import { Mail, Phone, Globe } from "lucide-react";
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

  /** FIELD CHANGE WITH VALIDATION */
  const handleFieldChange = async (field: string, value: any) => {
    onInputChange(field, value);
    if (onFieldValidation) {
      const validation = await validateField(field, value, { ...formData, [field]: value });
      onFieldValidation(field, validation.isValid ? null : validation.error);
    }
  };

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
              />

              {/* Contract Duration */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Contract Duration *</Label>
                <div className="grid grid-cols-2 gap-2">
                  <DatePicker
                    label=""
                    value={formData.startDate || ""}
                    onChange={(value: string) => handleFieldChange("startDate", value)}
                    placeholder="Start date"
                    error={errors.startDate}
                    required
                  />
                  <DatePicker
                    label=""
                    value={formData.endDate || ""}
                    onChange={(value: string) => handleFieldChange("endDate", value)}
                    placeholder="End date"
                    error={errors.endDate}
                    required
                  />
                </div>
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Currency</Label>
                <Input
                  value="VND (₫)"
                  disabled
                  className="h-11 bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractInformation;
