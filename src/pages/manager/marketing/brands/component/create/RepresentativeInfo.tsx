import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneNumberInput } from "@/components/phone-number-input";

interface RepresentativeData {
  representative_name: string;
  representative_email: string;
  representative_phone: string;
  representative_role: string;
  representative_citizen_id: string;
}

interface RepresentativeInfoTabProps {
  representativeData: RepresentativeData;
  errors: Partial<RepresentativeData>;
  onRepresentativeChange: (field: keyof RepresentativeData, value: string) => void;
}

const RepresentativeInfoTab: React.FC<RepresentativeInfoTabProps> = ({
  representativeData,
  errors,
  onRepresentativeChange,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Brand Representative Information</h2>

      {/* Representative Name */}
      <div className="space-y-2">
        <Label htmlFor="rep-name" className="text-sm font-medium">
          Representative Name *
        </Label>
        <Input
          id="rep-name"
          placeholder="Enter representative name"
          value={representativeData.representative_name}
          onChange={(e) => onRepresentativeChange("representative_name", e.target.value)}
          className={errors.representative_name ? "border-red-500" : ""}
        />
        {errors.representative_name && (
          <p className="text-sm text-red-500">{errors.representative_name}</p>
        )}
      </div>

      {/* Representative Email */}
      <div className="space-y-2">
        <Label htmlFor="rep-email" className="text-sm font-medium">
          Representative Email *
        </Label>
        <Input
          id="rep-email"
          type="email"
          placeholder="representative@example.com"
          value={representativeData.representative_email}
          onChange={(e) => onRepresentativeChange("representative_email", e.target.value)}
          className={errors.representative_email ? "border-red-500" : ""}
        />
        {errors.representative_email && (
          <p className="text-sm text-red-500">{errors.representative_email}</p>
        )}
      </div>

      {/* Representative Phone */}
      <div className="space-y-2">
        <Label htmlFor="rep-phone" className="text-sm font-medium">
          Representative Phone *
        </Label>
        <PhoneNumberInput
          value={representativeData.representative_phone}
          onChange={(val) => onRepresentativeChange("representative_phone", val)}
          placeholder="0123456789"
          error={errors.representative_phone}
          required
          className={errors.representative_phone ? "border-red-500" : ""}
        />
        {errors.representative_phone && (
          <p className="text-sm text-red-500">{errors.representative_phone}</p>
        )}
      </div>

      {/* Representative Role */}
      <div className="space-y-2">
        <Label htmlFor="rep-role" className="text-sm font-medium">
          Representative Role *
        </Label>
        <Input
          id="rep-role"
          placeholder="e.g., Marketing Manager, CEO"
          value={representativeData.representative_role}
          onChange={(e) => onRepresentativeChange("representative_role", e.target.value)}
          className={errors.representative_role ? "border-red-500" : ""}
        />
        {errors.representative_role && (
          <p className="text-sm text-red-500">{errors.representative_role}</p>
        )}
      </div>

      {/* Representative Citizen ID */}
      <div className="space-y-2">
        <Label htmlFor="rep-citizen-id" className="text-sm font-medium">
          Representative Citizen ID *
        </Label>
        <Input
          id="rep-citizen-id"
          placeholder="e.g., 012345678901"
          value={representativeData.representative_citizen_id}
          onChange={(e) => onRepresentativeChange("representative_citizen_id", e.target.value)}
          className={errors.representative_citizen_id ? "border-red-500" : ""}
        />
        {errors.representative_citizen_id && (
          <p className="text-sm text-red-500">{errors.representative_citizen_id}</p>
        )}
        <p className="text-xs text-gray-500">Enter 9–12 digits (Citizen Identification Number)</p>
      </div>
    </div>
  );
};

export default RepresentativeInfoTab;
