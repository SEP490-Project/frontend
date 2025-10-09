import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { validateField } from "@/libs/validation/contractValidation";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

// Brand selection imports
import { DataSelector } from "@/components/global";
import { useAppDispatch } from "@/libs/stores";
import { useBrand } from "@/libs/hooks/useBrand";
import {
  brand as fetchBrands,
  brandDetail as fetchBrandDetail,
} from "@/libs/stores/brandManager/thunk";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { Mail, Phone, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ContractTypeTemplateProps {
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

const CHANNEL_OPTIONS = [
  { value: "web", label: "Website" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
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

// DatePicker (existing)
const DatePicker = ({
  field,
  value,
  placeholder,
  onChange,
  error,
  openPopovers,
  setOpenPopovers,
}: any) => {
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <Popover
        open={openPopovers[field]}
        onOpenChange={(open) => setOpenPopovers((prev: any) => ({ ...prev, [field]: open }))}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline2"
            className={`h-11 w-full justify-start text-left font-normal ${
              !value ? "text-muted-foreground" : ""
            } ${error ? "border-red-500" : ""}`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(parseDate(value) || new Date(), "dd/MM/yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={parseDate(value)}
            onSelect={(date) => {
              const dateValue = date ? formatDateForInput(date) : "";
              onChange(dateValue);
              setOpenPopovers((prev: any) => ({ ...prev, [field]: false }));
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

const ContractTypeTemplate: React.FC<ContractTypeTemplateProps> = ({
  formData,
  onContractTypeChange,
  onInputChange,
  onUpdateScopeOfWork,
  errors = {},
  onFieldValidation,
}) => {
  // Date popovers
  const [openPopovers, setOpenPopovers] = useState({
    startDate: false,
    endDate: false,
    signedDate: false,
  });

  // Brand selection state & hooks
  const dispatch = useAppDispatch();
  const { brands, loading, pagination } = useBrand();
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

  const loadMore = useCallback(() => {
    if (pagination?.has_next && !loading) setPage((p) => p + 1);
  }, [pagination, loading]);

  // Field change handlers with validation
  const handleFieldChange = async (field: string, value: any) => {
    onInputChange(field, value);
    if (onFieldValidation) {
      const validation = await validateField(field, value, { ...formData, [field]: value });
      onFieldValidation(field, validation.isValid ? null : validation.error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Contract Type Selection */}
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

      {/* Brand Selection - Only show after contract type is selected */}
      {formData.type && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">Brand Selection</CardTitle>
            </div>
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
                onScrollEnd={pagination?.has_next ? loadMore : undefined}
                loading={loading}
              />
            </div>

            {formData.brandId && <BrandDetails brandId={formData.brandId} />}
          </CardContent>
        </Card>
      )}

      {/* Basic Information - Only show if contract type is selected */}
      {formData.type && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">Contract Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Contract Number *</Label>
                <Input
                  value={formData.contractNumber}
                  onChange={(e) => handleFieldChange("contractNumber", e.target.value)}
                  placeholder="Contract number from the signed document"
                  className={`h-11 ${errors.contractNumber ? "border-red-500" : ""}`}
                />
                {errors.contractNumber && (
                  <p className="text-sm text-red-500">{errors.contractNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Signed Location *</Label>
                <Input
                  value={formData.signedLocation}
                  onChange={(e) => handleFieldChange("signedLocation", e.target.value)}
                  placeholder="Location where contract is signed"
                  className={`h-11 ${errors.signedLocation ? "border-red-500" : ""}`}
                />
                {errors.signedLocation && (
                  <p className="text-sm text-red-500">{errors.signedLocation}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Currency</Label>
                <Input
                  value="VND (₫)"
                  disabled
                  className="h-11 bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Contract Duration *</Label>
                <div className="grid grid-cols-2 gap-2">
                  <DatePicker
                    field="startDate"
                    value={formData.startDate}
                    placeholder="Start"
                    onChange={(value: string) => handleFieldChange("startDate", value)}
                    error={errors.startDate}
                    openPopovers={openPopovers}
                    setOpenPopovers={setOpenPopovers}
                  />
                  <DatePicker
                    field="endDate"
                    value={formData.endDate}
                    placeholder="End"
                    onChange={(value: string) => handleFieldChange("endDate", value)}
                    error={errors.endDate}
                    openPopovers={openPopovers}
                    setOpenPopovers={setOpenPopovers}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Signed Date</Label>
                <DatePicker
                  field="signedDate"
                  value={formData.signedDate}
                  placeholder="Select date"
                  onChange={(value: string) => handleFieldChange("signedDate", value)}
                  error={errors.signedDate}
                  openPopovers={openPopovers}
                  setOpenPopovers={setOpenPopovers}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scope of Work - Only show if contract type is selected */}
      {/* Scope of Work - Digitalized by Contract Type */}
      {formData.type && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Scope of Work</CardTitle>
            <p className="text-sm text-slate-600">
              Tasks and deliverables are automatically structured based on contract type.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ADVERTISING – Content + Product */}
            {formData.type === "ADVERTISING" && (
              <>
                {/* Content Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Content Tasks</Label>
                    <Button
                      type="button"
                      onClick={() =>
                        onUpdateScopeOfWork({
                          contents: [
                            ...(formData.scopeOfWork.contents || []),
                            { title: "", platform: "", deadline: "" },
                          ],
                        })
                      }
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Content
                    </Button>
                  </div>
                  {(formData.scopeOfWork.contents || []).map((content: any, index: number) => (
                    <Card key={index} className="p-4 bg-slate-50/50 border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                          placeholder="Title"
                          value={content.title}
                          onChange={(e) => {
                            const updated = [...formData.scopeOfWork.contents];
                            updated[index].title = e.target.value;
                            onUpdateScopeOfWork({ contents: updated });
                          }}
                          className="h-10"
                        />
                        <Select
                          value={content.platform}
                          onValueChange={(v) => {
                            const updated = [...formData.scopeOfWork.contents];
                            updated[index].platform = v;
                            onUpdateScopeOfWork({ contents: updated });
                          }}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {CHANNEL_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <DatePicker
                          field={`content-deadline-${index}`}
                          value={content.deadline}
                          placeholder="Deadline"
                          onChange={(v: string) => {
                            const updated = [...formData.scopeOfWork.contents];
                            updated[index].deadline = v;
                            onUpdateScopeOfWork({ contents: updated });
                          }}
                          error={undefined}
                          openPopovers={openPopovers}
                          setOpenPopovers={setOpenPopovers}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = formData.scopeOfWork.contents.filter(
                              (_: any, i: number) => i !== index,
                            );
                            onUpdateScopeOfWork({ contents: updated });
                          }}
                          className="h-10 gap-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Product Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Product Delivery</Label>
                    <Button
                      type="button"
                      onClick={() =>
                        onUpdateScopeOfWork({
                          products: [
                            ...(formData.scopeOfWork.products || []),
                            { name: "", quantity: 1, delivery_date: "" },
                          ],
                        })
                      }
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Product
                    </Button>
                  </div>
                  {(formData.scopeOfWork.products || []).map((product: any, index: number) => (
                    <Card key={index} className="p-4 bg-slate-50/50 border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                          placeholder="Product Name"
                          value={product.name}
                          onChange={(e) => {
                            const updated = [...formData.scopeOfWork.products];
                            updated[index].name = e.target.value;
                            onUpdateScopeOfWork({ products: updated });
                          }}
                          className="h-10"
                        />
                        <Input
                          type="number"
                          min="1"
                          placeholder="Quantity"
                          value={product.quantity}
                          onChange={(e) => {
                            const updated = [...formData.scopeOfWork.products];
                            updated[index].quantity = parseInt(e.target.value);
                            onUpdateScopeOfWork({ products: updated });
                          }}
                          className="h-10"
                        />
                        <DatePicker
                          field={`product-date-${index}`}
                          value={product.delivery_date}
                          placeholder="Delivery Date"
                          onChange={(v: string) => {
                            const updated = [...formData.scopeOfWork.products];
                            updated[index].delivery_date = v;
                            onUpdateScopeOfWork({ products: updated });
                          }}
                          error={undefined}
                          openPopovers={openPopovers}
                          setOpenPopovers={setOpenPopovers}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = formData.scopeOfWork.products.filter(
                              (_: any, i: number) => i !== index,
                            );
                            onUpdateScopeOfWork({ products: updated });
                          }}
                          className="h-10 gap-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* AFFILIATE – Content only */}
            {formData.type === "AFFILIATE" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Affiliate Content</Label>
                  <Button
                    type="button"
                    onClick={() =>
                      onUpdateScopeOfWork({
                        contents: [
                          ...(formData.scopeOfWork.contents || []),
                          {
                            title: "",
                            platform: "",
                            tracking_link: "",
                            coupon_code: "",
                            deadline: "",
                          },
                        ],
                      })
                    }
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Content
                  </Button>
                </div>
                {(formData.scopeOfWork.contents || []).map((c: any, index: number) => (
                  <Card key={index} className="p-4 bg-slate-50/50 border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <Input
                        placeholder="Title"
                        value={c.title}
                        onChange={(e) => {
                          const updated = [...formData.scopeOfWork.contents];
                          updated[index].title = e.target.value;
                          onUpdateScopeOfWork({ contents: updated });
                        }}
                        className="h-10"
                      />
                      <Select
                        value={c.platform}
                        onValueChange={(v) => {
                          const updated = [...formData.scopeOfWork.contents];
                          updated[index].platform = v;
                          onUpdateScopeOfWork({ contents: updated });
                        }}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {CHANNEL_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Tracking Link"
                        value={c.tracking_link}
                        onChange={(e) => {
                          const updated = [...formData.scopeOfWork.contents];
                          updated[index].tracking_link = e.target.value;
                          onUpdateScopeOfWork({ contents: updated });
                        }}
                        className="h-10"
                      />
                      <Input
                        placeholder="Coupon Code"
                        value={c.coupon_code}
                        onChange={(e) => {
                          const updated = [...formData.scopeOfWork.contents];
                          updated[index].coupon_code = e.target.value;
                          onUpdateScopeOfWork({ contents: updated });
                        }}
                        className="h-10"
                      />
                      <DatePicker
                        field={`affiliate-deadline-${index}`}
                        value={c.deadline}
                        placeholder="Deadline"
                        onChange={(v: string) => {
                          const updated = [...formData.scopeOfWork.contents];
                          updated[index].deadline = v;
                          onUpdateScopeOfWork({ contents: updated });
                        }}
                        error={undefined}
                        openPopovers={openPopovers}
                        setOpenPopovers={setOpenPopovers}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* CO_PRODUCING – Product only */}
            {formData.type === "CO_PRODUCING" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Co-Produced Products</Label>
                  <Button
                    type="button"
                    onClick={() =>
                      onUpdateScopeOfWork({
                        products: [
                          ...(formData.scopeOfWork.products || []),
                          { name: "", role: "", quantity: 1, delivery_date: "" },
                        ],
                      })
                    }
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </div>
                {(formData.scopeOfWork.products || []).map((p: any, index: number) => (
                  <Card key={index} className="p-4 bg-slate-50/50 border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input
                        placeholder="Product Name"
                        value={p.name}
                        onChange={(e) => {
                          const updated = [...formData.scopeOfWork.products];
                          updated[index].name = e.target.value;
                          onUpdateScopeOfWork({ products: updated });
                        }}
                        className="h-10"
                      />
                      <Input
                        placeholder="Role"
                        value={p.role}
                        onChange={(e) => {
                          const updated = [...formData.scopeOfWork.products];
                          updated[index].role = e.target.value;
                          onUpdateScopeOfWork({ products: updated });
                        }}
                        className="h-10"
                      />
                      <Input
                        type="number"
                        min="1"
                        value={p.quantity}
                        onChange={(e) => {
                          const updated = [...formData.scopeOfWork.products];
                          updated[index].quantity = parseInt(e.target.value);
                          onUpdateScopeOfWork({ products: updated });
                        }}
                        className="h-10"
                      />
                      <DatePicker
                        field={`copro-date-${index}`}
                        value={p.delivery_date}
                        placeholder="Delivery Date"
                        onChange={(v: string) => {
                          const updated = [...formData.scopeOfWork.products];
                          updated[index].delivery_date = v;
                          onUpdateScopeOfWork({ products: updated });
                        }}
                        error={undefined}
                        openPopovers={openPopovers}
                        setOpenPopovers={setOpenPopovers}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* BRAND_AMBASSADOR – Event only */}
            {formData.type === "BRAND_AMBASSADOR" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Events</Label>
                  <Button
                    type="button"
                    onClick={() =>
                      onUpdateScopeOfWork({
                        events: [
                          ...(formData.scopeOfWork.events || []),
                          { event_name: "", date: "", location: "", note: "" },
                        ],
                      })
                    }
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Event
                  </Button>
                </div>
                {(formData.scopeOfWork.events || []).map((e: any, index: number) => (
                  <Card key={index} className="p-4 bg-slate-50/50 border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <Input
                        placeholder="Event Name"
                        value={e.event_name}
                        onChange={(ev) => {
                          const updated = [...formData.scopeOfWork.events];
                          updated[index].event_name = ev.target.value;
                          onUpdateScopeOfWork({ events: updated });
                        }}
                        className="h-10"
                      />
                      <DatePicker
                        field={`event-date-${index}`}
                        value={e.date}
                        placeholder="Date"
                        onChange={(v: string) => {
                          const updated = [...formData.scopeOfWork.events];
                          updated[index].date = v;
                          onUpdateScopeOfWork({ events: updated });
                        }}
                        error={undefined}
                        openPopovers={openPopovers}
                        setOpenPopovers={setOpenPopovers}
                      />
                      <Input
                        placeholder="Location"
                        value={e.location}
                        onChange={(ev) => {
                          const updated = [...formData.scopeOfWork.events];
                          updated[index].location = ev.target.value;
                          onUpdateScopeOfWork({ events: updated });
                        }}
                        className="h-10"
                      />
                      <Input
                        placeholder="Note"
                        value={e.note}
                        onChange={(ev) => {
                          const updated = [...formData.scopeOfWork.events];
                          updated[index].note = ev.target.value;
                          onUpdateScopeOfWork({ events: updated });
                        }}
                        className="h-10"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = formData.scopeOfWork.events.filter(
                            (_: any, i: number) => i !== index,
                          );
                          onUpdateScopeOfWork({ events: updated });
                        }}
                        className="h-10 gap-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legal Terms */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Legal Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Breach of Contract */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-primary">Breach of Contract</Label>
            <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
              <li>
                <span className="font-semibold text-gray-900">
                  If Party A (the Brand) breaches the contract:
                </span>
                <ul className="list-disc pl-5">
                  <li>The contract shall be terminated immediately.</li>
                  <li>Party A forfeits the entire deposit paid.</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold text-gray-900">
                  If Party B (the Service Provider) breaches the contract:
                </span>
                <ul className="list-disc pl-5">
                  <li>The contract shall be terminated immediately.</li>
                  <li className="flex items-center gap-2">
                    Party B must refund the entire deposit to Party A and compensate an additional
                    <div className="relative flex items-center">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={formData.legalTerms?.compensationPercent ?? ""}
                        onChange={(e) =>
                          onInputChange("legalTerms", {
                            ...formData.legalTerms,
                            compensationPercent: e.target.value,
                          })
                        }
                        className="w-20 h-8 pr-7"
                        placeholder="0"
                      />
                      <span className="absolute right-2 text-gray-500 text-sm">%</span>
                    </div>
                    of the deposit amount to Party A.
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-semibold text-gray-900">
                  If both parties mutually agree to terminate the contract:
                </span>
                <ul className="list-disc pl-5">
                  <li>Neither party shall bear any liability or compensation obligations.</li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Additional Standard Terms */}
          <div className="space-y-2 text-sm text-gray-700">
            <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded">
              <span className="font-semibold">Confidentiality:</span> Both parties agree to keep all
              information related to this contract strictly confidential and not disclose it to any
              third party without prior written consent from the other party.
            </div>
            <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded">
              <span className="font-semibold">Dispute Resolution:</span> Any disputes arising from
              or relating to this contract shall be resolved amicably through negotiation. If no
              agreement is reached, the dispute shall be settled at a competent court as prescribed
              by law.
            </div>
            <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded">
              <span className="font-semibold">Contract Effectiveness:</span> This contract becomes
              effective from the date of signing and shall terminate upon full completion of
              obligations by both parties.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractTypeTemplate;
