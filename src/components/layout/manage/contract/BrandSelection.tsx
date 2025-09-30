import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DataSelector } from "@/components/global";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Building2, User, Mail, Phone, Globe, MapPin } from "lucide-react";
import brands from "./brands.json";
import contracts from "./contracts.json";

interface BrandSelectionProps {
  formData: any;
  selectedBrand: any;
  isExtension: boolean;
  contractTypeOptions: { value: string; label: string }[];
  onBrandChange: (id: string | null) => void;
  onExtensionChange: (checked: boolean) => void;
  onInputChange: (field: string, value: any) => void;
}

const BrandSelection: React.FC<BrandSelectionProps> = ({
  formData,
  selectedBrand,
  isExtension,
  contractTypeOptions,
  onBrandChange,
  onExtensionChange,
  onInputChange,
}) => {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-xl">Brand Selection</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="gap-6">
          {/* Select Brand */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="h-4 w-4" />
              Select Brand *
            </Label>
            <DataSelector
              data={brands}
              selectedId={formData.brandId}
              onSelect={onBrandChange}
              renderItem={(brand) => (
                <div className="flex items-center gap-3 p-2">
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="h-8 w-8 rounded-lg object-cover border"
                  />
                  <div>
                    <span className="font-medium">{brand.name}</span>
                    <p className="text-xs text-slate-500">{brand.contact_email}</p>
                  </div>
                </div>
              )}
              getLabel={(brand) => brand.name}
              title="Brands"
              placeholder="Choose a brand to work with"
            />
          </div>

          {/* Contract Extension */}
          {selectedBrand && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isExtension"
                  checked={isExtension}
                  onCheckedChange={(checked) => {
                    onExtensionChange(!!checked);
                    if (!checked) onInputChange("parentContractId", "");
                  }}
                />
                <Label htmlFor="isExtension" className="text-sm font-medium">
                  Contract Extension
                </Label>
              </div>

              {isExtension && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Parent Contract</Label>
                  <DataSelector
                    data={contracts.filter((c) => c.brandId === formData.brandId)}
                    selectedId={formData.parentContractId}
                    onSelect={(id) => onInputChange("parentContractId", id || "")}
                    renderItem={(contract) => (
                      <div className="flex items-start gap-3 p-2">
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              contract.status === "ACTIVE"
                                ? "bg-green-500"
                                : contract.status === "EXPIRED"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{contract.title}</div>
                          <div className="text-xs text-slate-500 space-y-1">
                            <div>
                              Type:{" "}
                              {
                                contractTypeOptions.find(
                                  (opt) => opt.value === contract.contractType,
                                )?.label
                              }
                            </div>
                            <div className="flex gap-4">
                              <span>
                                Start: {format(new Date(contract.startDate), "dd/MM/yyyy")}
                              </span>
                              <span>End: {format(new Date(contract.endDate), "dd/MM/yyyy")}</span>
                            </div>
                            {contract.compensationAmount && (
                              <div>Amount: ${contract.compensationAmount.toLocaleString()}</div>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={contract.status === "ACTIVE" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {contract.status}
                        </Badge>
                      </div>
                    )}
                    getLabel={(contract) => `${contract.title} (${contract.contractType})`}
                    title="Existing Contracts"
                    placeholder="Select a parent contract to extend"
                  />
                  {formData.parentContractId && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-800">
                        <div className="font-medium mb-1">Selected Parent Contract:</div>
                        {(() => {
                          const parentContract = contracts.find(
                            (c) => c.id === formData.parentContractId,
                          );
                          return parentContract ? (
                            <div className="space-y-1">
                              <div>{parentContract.title}</div>
                              <div className="text-xs text-blue-600">
                                {format(new Date(parentContract.startDate), "dd/MM/yyyy")} -{" "}
                                {format(new Date(parentContract.endDate), "dd/MM/yyyy")}
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {selectedBrand && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Brand Info */}
              <div className="xl:col-span-2 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedBrand.logo_url}
                      alt={`${selectedBrand.name} logo`}
                      className="h-12 w-12 rounded-xl object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{selectedBrand.name}</h3>
                      <Badge
                        variant={selectedBrand.status === "ACTIVE" ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {selectedBrand.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span>{selectedBrand.contact_email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>{selectedBrand.contact_phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Globe className="h-4 w-4" />
                    <a
                      href={selectedBrand.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedBrand.website_url}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{selectedBrand.address}</span>
                  </div>
                </div>
              </div>

              {/* Representative */}
              <div className="bg-white/80 rounded-lg p-4 border border-white/50">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Representative</span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedBrand.representative_ava}
                    alt={selectedBrand.representative}
                    className="w-12 h-12 rounded-full border-2 border-blue-200 object-cover"
                  />
                  <div>
                    <p className="font-medium text-slate-900">{selectedBrand.representative}</p>
                    <p className="text-xs text-slate-500">{selectedBrand.representative_email}</p>
                    <p className="text-xs text-slate-500">{selectedBrand.representative_phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandSelection;
