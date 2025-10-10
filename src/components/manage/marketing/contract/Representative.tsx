import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RepresentativeProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  errors?: any;
}

const FormField = ({
  label,
  field,
  placeholder,
  type = "text",
  required = false,
  formData,
  onInputChange,
  errors,
  disabled = false,
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
      required={required}
      disabled={disabled}
      className={`h-11 ${
        disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300" : "bg-white"
      }`}
    />
    {errors[field] && <p className="text-red-500 text-xs italic">{errors[field]}</p>}
  </div>
);

const RepresentativeSection = ({
  title,
  fields,
  formData,
  onInputChange,
  errors,
  disabled = false,
}: any) => (
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
          disabled={disabled}
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
  // ✅ Dữ liệu thật của KOL - cứng trong frontend
  const kolRepresentativeData = {
    webRepresentativeName: "Nguyễn Minh Anh",
    webRepresentativePosition: "Content Creator / KOL",
    webRepresentativePhone: "+84 912 345 678",
    webRepresentativeEmail: "minhanh.kol@example.com",
    webRepresentativeTaxNumber: "1234567890",
  };

  // ✅ Gán dữ liệu KOL mặc định khi component mount
  useEffect(() => {
    Object.entries(kolRepresentativeData).forEach(([key, value]) => {
      onInputChange(key, value);
    });
  }, []);

  // Party A fields
  const brandRepresentativeFields = [
    {
      label: "Full Name",
      field: "brandRepresentativeName",
      placeholder: "Representative full name",
      required: true,
    },
    { label: "Position", field: "brandRepresentativePosition", placeholder: "Job title/position" },
    { label: "Phone Number", field: "brandRepresentativePhone", placeholder: "0xxx xxx xxx" },
    {
      label: "Email Address",
      field: "brandRepresentativeEmail",
      placeholder: "example@company.com",
      type: "email",
    },
    { label: "Tax Number", field: "brandTaxNumber", placeholder: "Tax code" },
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

  // Party B fields
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
    { label: "Phone Number", field: "webRepresentativePhone", placeholder: "xxx xxx xxx" },
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
        <CardTitle className="text-xl">Representative Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Party A - nhập tay */}
        <RepresentativeSection
          title="Brand Representative (Party A)"
          fields={brandRepresentativeFields}
          formData={formData}
          onInputChange={onInputChange}
          errors={errors}
        />

        {/* Party B - dữ liệu cứng, disable */}
        <RepresentativeSection
          title="Web Representative (Party B - KOL/Blogger)"
          fields={webRepresentativeFields}
          formData={formData}
          onInputChange={onInputChange}
          errors={errors}
          disabled
        />
      </CardContent>
    </Card>
  );
};

export default Representative;
