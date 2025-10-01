import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RepresentativeProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  errors?: any;
}

// Reusable form field component
const FormField = ({
  label,
  field,
  placeholder,
  type = "text",
  required = false,
  formData,
  onInputChange,
  errors,
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
      className="h-11"
      required={required}
    />
    {errors[field] && <p className="text-red-500 text-xs italic">{errors[field]}</p>}
  </div>
);

// Representative section component
const RepresentativeSection = ({ title, fields, formData, onInputChange, errors }: any) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map((field: any) => (
        <FormField
          key={field.field}
          {...field}
          formData={formData}
          onInputChange={onInputChange}
          errors={errors}
        />
      ))}
    </div>
  </div>
);

const Representative: React.FC<RepresentativeProps> = ({
  formData,
  onInputChange,
  errors = {},
}) => {
  // Field configurations
  const brandRepresentativeFields = [
    {
      label: "Full Name",
      field: "brandRepresentativeName",
      placeholder: "Representative full name",
      required: true,
    },
    { label: "Position", field: "brandRepresentativePosition", placeholder: "Job title/position" },
    { label: "Phone Number", field: "brandRepresentativePhone", placeholder: "+84 xxx xxx xxx" },
    {
      label: "Email Address",
      field: "brandRepresentativeEmail",
      placeholder: "email@company.com",
      type: "email",
    },
    { label: "Tax Number", field: "brandTaxNumber", placeholder: "Tax identification number" },
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
    { label: "Phone Number", field: "webRepresentativePhone", placeholder: "+84 xxx xxx xxx" },
    {
      label: "Email Address",
      field: "webRepresentativeEmail",
      placeholder: "email@example.com",
      type: "email",
    },
    {
      label: "Tax Number",
      field: "webRepresentativeTaxNumber",
      placeholder: "Personal tax identification number",
    },
  ];

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl">Representative Details</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Brand Representative (Party A) */}
        <RepresentativeSection
          title="Brand Representative (Party A)"
          fields={brandRepresentativeFields}
          formData={formData}
          onInputChange={onInputChange}
          errors={errors}
        />

        {/* Web Representative (Party B) */}
        <RepresentativeSection
          title="Web Representative (Party B - KOL/Blogger)"
          fields={webRepresentativeFields}
          formData={formData}
          onInputChange={onInputChange}
          errors={errors}
        />
      </CardContent>
    </Card>
  );
};

export default Representative;
