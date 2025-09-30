import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Building2, User } from "lucide-react";

interface RepresentativeProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  errors?: any;
}

const Representative: React.FC<RepresentativeProps> = ({
  formData,
  onInputChange,
  errors = {},
}) => {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-xl">Representative Details</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Brand Representative (Party A) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-800">Brand Representative (Party A)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Full Name *</Label>
              <Input
                value={formData.brandRepresentativeName}
                onChange={(e) => onInputChange("brandRepresentativeName", e.target.value)}
                placeholder="Representative full name"
                className="h-11"
                required
              />
              {errors.brandRepresentativeName && (
                <p className="text-red-500 text-xs italic">{errors.brandRepresentativeName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Position</Label>
              <Input
                value={formData.brandRepresentativePosition}
                onChange={(e) => onInputChange("brandRepresentativePosition", e.target.value)}
                placeholder="Job title/position"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Phone Number</Label>
              <Input
                value={formData.brandRepresentativePhone}
                onChange={(e) => onInputChange("brandRepresentativePhone", e.target.value)}
                placeholder="+84 xxx xxx xxx"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Email Address</Label>
              <Input
                type="email"
                value={formData.brandRepresentativeEmail}
                onChange={(e) => onInputChange("brandRepresentativeEmail", e.target.value)}
                placeholder="email@company.com"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tax Number</Label>
              <Input
                value={formData.brandTaxNumber}
                onChange={(e) => onInputChange("brandTaxNumber", e.target.value)}
                placeholder="Tax identification number"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Bank Name</Label>
              <Input
                value={formData.brandBankName}
                onChange={(e) => onInputChange("brandBankName", e.target.value)}
                placeholder="Bank name"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Account Number</Label>
              <Input
                value={formData.brandBankAccountNumber}
                onChange={(e) => onInputChange("brandBankAccountNumber", e.target.value)}
                placeholder="Bank account number"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Account Holder Name</Label>
              <Input
                value={formData.brandBankAccountHolder}
                onChange={(e) => onInputChange("brandBankAccountHolder", e.target.value)}
                placeholder="Account holder full name"
                className="h-11"
              />
            </div>
          </div>
        </div>

        {/* Web Representative (Party B) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <User className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-slate-800">
              Web Representative (Party B - KOL/Blogger)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Full Name *</Label>
              <Input
                value={formData.webRepresentativeName}
                onChange={(e) => onInputChange("webRepresentativeName", e.target.value)}
                placeholder="KOL/Blogger full name"
                className="h-11"
                required
              />
              {errors.webRepresentativeName && (
                <p className="text-red-500 text-xs italic">{errors.webRepresentativeName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Position</Label>
              <Input
                value={formData.webRepresentativePosition}
                onChange={(e) => onInputChange("webRepresentativePosition", e.target.value)}
                placeholder="e.g., Content Creator, KOL, Blogger"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Phone Number</Label>
              <Input
                value={formData.webRepresentativePhone}
                onChange={(e) => onInputChange("webRepresentativePhone", e.target.value)}
                placeholder="+84 xxx xxx xxx"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Email Address</Label>
              <Input
                type="email"
                value={formData.webRepresentativeEmail}
                onChange={(e) => onInputChange("webRepresentativeEmail", e.target.value)}
                placeholder="email@example.com"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tax Number</Label>
              <Input
                value={formData.webRepresentativeTaxNumber}
                onChange={(e) => onInputChange("webRepresentativeTaxNumber", e.target.value)}
                placeholder="Personal tax identification number"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Bank Name</Label>
              <Input
                value={formData.webRepresentativeBankName}
                onChange={(e) => onInputChange("webRepresentativeBankName", e.target.value)}
                placeholder="Bank name"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Account Number</Label>
              <Input
                value={formData.webRepresentativeBankAccountNumber}
                onChange={(e) =>
                  onInputChange("webRepresentativeBankAccountNumber", e.target.value)
                }
                placeholder="Bank account number"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Account Holder Name</Label>
              <Input
                value={formData.webRepresentativeBankAccountHolder}
                onChange={(e) =>
                  onInputChange("webRepresentativeBankAccountHolder", e.target.value)
                }
                placeholder="Account holder full name"
                className="h-11"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Representative;
