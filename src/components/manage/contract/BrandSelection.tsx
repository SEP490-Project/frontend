import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DataSelector } from "@/components/global";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Mail, Phone, Globe } from "lucide-react";
import { useAppDispatch } from "@/libs/stores";
import { useBrand } from "@/libs/hooks/useBrand";
import { brand, brandDetail } from "@/libs/stores/brandManager/thunk";
import contracts from "./contracts.json";
import { useDebounce } from "@/libs/hooks/useDebounce";

interface BrandSelectionProps {
  formData: any;
  selectedBrand: any;
  isExtension: boolean;
  contractTypeOptions: { value: string; label: string }[];
  onBrandChange: (id: string | null) => void;
  onExtensionChange: (checked: boolean) => void;
  onInputChange: (field: string, value: any) => void;
}

// Helper Components
const BrandItem = ({ brand }: { brand: any }) => (
  <div className="flex items-center gap-3 p-2">
    <img src={brand.logo_url} alt={brand.name} className="h-8 w-8 rounded-lg object-cover border" />
    <div>
      <span className="font-medium">{brand.name}</span>
      <p className="text-xs text-slate-500">{brand.contact_email}</p>
    </div>
  </div>
);

const ContractItem = ({
  contract,
  contractTypeOptions,
}: {
  contract: any;
  contractTypeOptions: any[];
}) => {
  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-500",
    EXPIRED: "bg-red-500",
    default: "bg-yellow-500",
  };

  const statusColor = statusColors[contract.status as string] || statusColors.default;

  return (
    <div className="flex items-start gap-3 p-2">
      <div className="flex-shrink-0 mt-1">
        <div className={`w-3 h-3 rounded-full ${statusColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{contract.title}</div>
        <div className="text-xs text-slate-500 space-y-1">
          <div>
            Type: {contractTypeOptions.find((opt) => opt.value === contract.contractType)?.label}
          </div>
          <div className="flex gap-4">
            <span>Start: {format(new Date(contract.startDate), "dd/MM/yyyy")}</span>
            <span>End: {format(new Date(contract.endDate), "dd/MM/yyyy")}</span>
          </div>
          {contract.compensationAmount && (
            <div>Amount: ${contract.compensationAmount.toLocaleString()}</div>
          )}
        </div>
      </div>
      <Badge variant={contract.status === "ACTIVE" ? "default" : "secondary"} className="text-xs">
        {contract.status}
      </Badge>
    </div>
  );
};

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
    dispatch(brandDetail(brandId));
  }, [brandId, dispatch]);

  if (!brand) return null;

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Brand Info */}
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
            {/* Nếu sau này có address */}
            {/* {brand.address && (
              <ContactInfo icon={MapPin}>
                <span className="truncate">{brand.address}</span>
              </ContactInfo>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

const ParentContractInfo = ({ formData }: { formData: any }) => {
  const parentContract = contracts.find((c) => c.id === formData.parentContractId);

  if (!parentContract) return null;

  return (
    <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="text-sm text-blue-800">
        <div className="font-medium mb-1">Selected Parent Contract:</div>
        <div className="space-y-1">
          <div>{parentContract.title}</div>
          <div className="text-xs text-blue-600">
            {format(new Date(parentContract.startDate), "dd/MM/yyyy")} -{" "}
            {format(new Date(parentContract.endDate), "dd/MM/yyyy")}
          </div>
        </div>
      </div>
    </div>
  );
};

const BrandSelection: React.FC<BrandSelectionProps> = ({
  formData,
  isExtension,
  contractTypeOptions,
  onBrandChange,
  onExtensionChange,
  onInputChange,
}) => {
  const dispatch = useAppDispatch();
  const { brands, loading, pagination } = useBrand();

  // Infinite scroll & search state
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [allBrands, setAllBrands] = useState<any[]>([]);

  // Reset brands and page when search changes
  useEffect(() => {
    setAllBrands([]);
    setPage(1);
  }, [debouncedSearch]);

  // Fetch brands from thunk (API only, no local search)
  useEffect(() => {
    dispatch(
      brand({
        page,
        limit: 10,
        ...(debouncedSearch ? { keywords: debouncedSearch } : {}),
      }),
    );
  }, [dispatch, page, debouncedSearch]);

  // Append new brands from API only
  useEffect(() => {
    if (page === 1) setAllBrands(brands);
    else setAllBrands((prev) => [...prev, ...brands]);
  }, [brands, page]);

  // Load more handler
  const loadMore = useCallback(() => {
    if (pagination?.has_next && !loading) setPage((p) => p + 1);
  }, [pagination, loading]);

  const handleExtensionChange = (checked: boolean) => {
    onExtensionChange(checked);
    if (!checked) onInputChange("parentContractId", "");
  };

  const filteredContracts = contracts.filter((c) => c.brandId === formData.brandId);

  // Always get selectedBrand from allBrands (API), not from local/filter
  const currentBrandId = formData.brandId;

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl">Brand Selection</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Select Brand */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">Select Brand *</Label>
          <DataSelector
            data={allBrands}
            selectedId={formData.brandId}
            onSelect={onBrandChange}
            renderItem={(brand) => <BrandItem brand={brand} />}
            getLabel={(brand) => brand.name}
            title="Brands"
            placeholder="Choose a brand to work with"
            onSearch={setSearch}
            searchValue={search}
            onScrollEnd={pagination?.has_next ? loadMore : undefined}
            loading={loading}
          />
        </div>

        {/* Contract Extension */}
        {currentBrandId && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isExtension"
                checked={isExtension}
                onCheckedChange={handleExtensionChange}
              />
              <Label htmlFor="isExtension" className="text-sm font-medium">
                Contract Extension
              </Label>
            </div>

            {isExtension && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Parent Contract</Label>
                <DataSelector
                  data={filteredContracts}
                  selectedId={formData.parentContractId}
                  onSelect={(id) => onInputChange("parentContractId", id || "")}
                  renderItem={(contract) => (
                    <ContractItem contract={contract} contractTypeOptions={contractTypeOptions} />
                  )}
                  getLabel={(contract) => `${contract.title} (${contract.contractType})`}
                  title="Existing Contracts"
                  placeholder="Select a parent contract to extend"
                />
                <ParentContractInfo formData={formData} />
              </div>
            )}
          </div>
        )}

        {/* Show brand details if selected */}
        {currentBrandId && <BrandDetails brandId={currentBrandId} />}
      </CardContent>
    </Card>
  );
};

export default BrandSelection;
