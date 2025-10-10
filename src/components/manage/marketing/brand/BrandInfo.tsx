import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AvatarUploader from "@/components/global/AvatarUploader";
import AddressSelector from "@/components/global/AddressSelector";

interface BrandData {
  name: string;
  description: string;
  website: string;
  logo_url: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  tax_number?: string;
}

interface BrandInfoTabProps {
  brandData: BrandData;
  logoFile: File | null;
  errors: Partial<BrandData>;
  onBrandChange: (field: keyof BrandData, value: string) => void;
  onLogoChange: (file: File | null) => void;
}

const BrandInfoTab: React.FC<BrandInfoTabProps> = ({
  brandData,
  errors,
  onBrandChange,
  onLogoChange,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Brand Information</h2>

      {/* Brand Name */}
      <div className="space-y-2">
        <Label htmlFor="brand-name" className="text-sm font-medium">
          Brand Name *
        </Label>
        <Input
          id="brand-name"
          placeholder="Enter brand name"
          value={brandData.name}
          onChange={(e) => onBrandChange("name", e.target.value)}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Website */}
      <div className="space-y-2">
        <Label htmlFor="website" className="text-sm font-medium">
          Website
        </Label>
        <Input
          id="website"
          type="url"
          placeholder="www.example.com"
          value={brandData.website}
          onChange={(e) => onBrandChange("website", e.target.value)}
          className={errors.website ? "border-red-500" : ""}
        />
        {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
        <p className="text-xs text-gray-500">
          Optional. Will be formatted as https:// if no protocol provided
        </p>
      </div>

      {/* Contact Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contact-email" className="text-sm font-medium">
            Contact Email
          </Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="contact@brand.com"
            value={brandData.contact_email || ""}
            onChange={(e) => onBrandChange("contact_email", e.target.value)}
            className={errors.contact_email ? "border-red-500" : ""}
          />
          {errors.contact_email && <p className="text-sm text-red-500">{errors.contact_email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-phone" className="text-sm font-medium">
            Contact Phone
          </Label>
          <Input
            id="contact-phone"
            type="tel"
            placeholder="0123456789"
            value={brandData.contact_phone || ""}
            onChange={(e) => onBrandChange("contact_phone", e.target.value)}
            className={errors.contact_phone ? "border-red-500" : ""}
          />
          {errors.contact_phone && <p className="text-sm text-red-500">{errors.contact_phone}</p>}
        </div>
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Logo</Label>
        <AvatarUploader initialImage={brandData.logo_url} onImageChange={onLogoChange} size="md" />
        <p className="text-xs text-gray-500">Optional. Upload a logo image for the brand</p>
      </div>

      {/* Address với AddressSelector */}
      <AddressSelector
        value={brandData.address || ""}
        onChange={(address) => onBrandChange("address", address)}
        label="Address"
        placeholder="Search for brand address..."
        error={errors.address}
      />
      <p className="text-xs text-gray-500 -mt-1">Optional. Company address with auto-suggestions</p>

      {/* Tax Number */}
      <div className="space-y-2">
        <Label htmlFor="tax-number" className="text-sm font-medium">
          Tax Number
        </Label>
        <Input
          id="tax-number"
          placeholder="Tax / VAT number"
          value={brandData.tax_number || ""}
          onChange={(e) => onBrandChange("tax_number", e.target.value)}
          className={errors.tax_number ? "border-red-500" : ""}
        />
        {errors.tax_number && <p className="text-sm text-red-500">{errors.tax_number}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Enter brand description..."
          value={brandData.description}
          onChange={(e) => onBrandChange("description", e.target.value)}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-gray-500">Optional. Brief description about the brand</p>
      </div>
    </div>
  );
};

export default BrandInfoTab;
