import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RepresentativeData {
  name: string;
  email: string;
  phone: string;
  position: string;
  identificationNum?: string;
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

      {/* Representative Name and Position */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="rep-name" className="text-sm font-medium">
            Representative Name *
          </Label>
          <Input
            id="rep-name"
            placeholder="Enter representative name"
            value={representativeData.name}
            onChange={(e) => onRepresentativeChange("name", e.target.value)}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position" className="text-sm font-medium">
            Position *
          </Label>
          <Input
            id="position"
            placeholder="e.g., Marketing Manager, CEO"
            value={representativeData.position}
            onChange={(e) => onRepresentativeChange("position", e.target.value)}
            className={errors.position ? "border-red-500" : ""}
          />
          {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
        </div>
      </div>

      {/* Email and Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="rep-email" className="text-sm font-medium">
            Email Address *
          </Label>
          <Input
            id="rep-email"
            type="email"
            placeholder="representative@example.com"
            value={representativeData.email}
            onChange={(e) => onRepresentativeChange("email", e.target.value)}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rep-phone" className="text-sm font-medium">
            Phone Number *
          </Label>
          <Input
            id="rep-phone"
            type="tel"
            placeholder="0123456789"
            value={representativeData.phone}
            onChange={(e) => onRepresentativeChange("phone", e.target.value)}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>
      </div>

      {/* Citizen ID */}
      <div className="space-y-2">
        <Label htmlFor="rep-citizen-id" className="text-sm font-medium">
          Citizen ID *
        </Label>
        <Input
          id="rep-citizen-id"
          placeholder="e.g., 012345678901"
          value={representativeData.identificationNum || ""}
          onChange={(e) => onRepresentativeChange("identificationNum", e.target.value)}
          className={errors.identificationNum ? "border-red-500" : ""}
        />
        {errors.identificationNum && (
          <p className="text-sm text-red-500">{errors.identificationNum}</p>
        )}
        <p className="text-xs text-gray-500">Enter 9–12 digits (Citizen Identification Number)</p>
      </div>
    </div>
  );
};

export default RepresentativeInfoTab;
