import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/libs/hooks/useAuth";
import AvatarUploader from "@/components/global/AvatarUploader";
import AddressSelector from "@/components/global/AddressSelector";
import { PhoneNumberInput } from "@/components/phone-number-input";
import { motion } from "framer-motion";

interface BrandData {
  name: string;
  description: string;
  website: string;
  logo_url: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  tax_number: string;
}

interface BrandInfoTabProps {
  brandData: BrandData;
  errors: Partial<BrandData>;
  onBrandChange: (field: keyof BrandData, value: string) => void;
  onLogoUpload: (uploadedUrl: string) => void; // Chỉ cần callback cho URL
}

const BrandInfoTab: React.FC<BrandInfoTabProps> = ({
  brandData,
  errors,
  onBrandChange,
  onLogoUpload,
}) => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold">Brand Information</h2>
      </motion.div>

      {/* Brand Name */}
      <motion.div className="space-y-2" variants={itemVariants}>
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
      </motion.div>

      {/* Description */}
      <motion.div className="space-y-2" variants={itemVariants}>
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
      </motion.div>

      {/* Contact Email & Phone */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
        <div className="space-y-2">
          <Label htmlFor="contact-email" className="text-sm font-medium">
            Contact Email *
          </Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="contact@brand.com"
            value={brandData.contact_email}
            onChange={(e) => onBrandChange("contact_email", e.target.value)}
            className={errors.contact_email ? "border-red-500" : ""}
          />
          {errors.contact_email && <p className="text-sm text-red-500">{errors.contact_email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-phone" className="text-sm font-medium">
            Contact Phone *
          </Label>
          <PhoneNumberInput
            value={brandData.contact_phone}
            onChange={(val) => onBrandChange("contact_phone", val)}
            placeholder="0123456789"
            error={errors.contact_phone}
            required
            className={errors.contact_phone ? "border-red-500" : ""}
          />
          {errors.contact_phone && <p className="text-sm text-red-500">{errors.contact_phone}</p>}
        </div>
      </motion.div>

      {/* Address */}
      <motion.div variants={itemVariants}>
        <AddressSelector
          value={brandData.address}
          onChange={(address) => onBrandChange("address", address)}
          label="Address *"
          placeholder="Search for brand address..."
          error={errors.address}
        />
        <p className="text-xs text-gray-500 mt-1">Company address with auto-suggestions</p>
      </motion.div>

      {/* Website */}
      <motion.div className="space-y-2" variants={itemVariants}>
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
          Will be formatted as https:// if no protocol provided
        </p>
      </motion.div>

      {/* Logo Upload */}
      <motion.div className="space-y-2" variants={itemVariants}>
        <Label className="text-sm font-medium">Logo</Label>
        <AvatarUploader
          userId={user?.id ?? ""}
          initialImage={brandData.logo_url}
          onImageUpload={onLogoUpload}
          size="md"
        />
        {errors.logo_url && <p className="text-sm text-red-500">{errors.logo_url}</p>}
      </motion.div>

      {/* Tax Number */}
      <motion.div className="space-y-2" variants={itemVariants}>
        <Label htmlFor="tax-number" className="text-sm font-medium">
          Tax Number *
        </Label>
        <Input
          id="tax-number"
          placeholder="Tax / VAT number"
          value={brandData.tax_number}
          onChange={(e) => onBrandChange("tax_number", e.target.value)}
          className={errors.tax_number ? "border-red-500" : ""}
        />
        {errors.tax_number && <p className="text-sm text-red-500">{errors.tax_number}</p>}
      </motion.div>
    </motion.div>
  );
};

export default BrandInfoTab;
