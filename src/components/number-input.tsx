import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumberInputProps {
  label?: string;
  value: string | number;
  onChange: (value: number) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  currency?: string;
  required?: boolean;
}

// Helper functions
const formatNumber = (value: number | string): string => {
  if (!value) return "";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(numValue) ? "" : numValue.toLocaleString("vi-VN");
};

const parseNumber = (formattedValue: string): number => {
  if (!formattedValue) return 0;
  return parseFloat(formattedValue.replace(/\./g, "")) || 0;
};

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "0",
  error,
  disabled = false,
  className = "",
  currency = "VND",
  required = false,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {currency && <span className="text-gray-500 ml-1">({currency})</span>}
        </Label>
      )}
      <Input
        type="text"
        value={formatNumber(value || "")}
        onChange={(e) => onChange(parseNumber(e.target.value))}
        placeholder={placeholder}
        className={`h-11 ${error ? "border-red-500" : ""} ${
          disabled ? "bg-gray-100 text-gray-700 cursor-not-allowed" : ""
        }`}
        disabled={disabled}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default NumberInput;
