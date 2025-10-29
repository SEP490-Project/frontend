import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BankAccountInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

// --- Helper functions ---
const formatBankAccountDisplay = (value: string): string => {
  if (!value) return "";
  const clean = value.replace(/\D/g, ""); // chỉ giữ số
  // nhóm theo 4 số
  return clean.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

// --- Component ---
export const BankAccountInput: React.FC<BankAccountInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Nhập số tài khoản ngân hàng",
  error,
  disabled = false,
  className = "",
  required = false,
}) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    setDisplayValue(formatBankAccountDisplay(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, ""); // chỉ cho nhập số
    const formatted = formatBankAccountDisplay(raw);
    setDisplayValue(formatted);
    onChange(formatted);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Input
        type="tel"
        value={displayValue}
        onChange={handleChange}
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

export default BankAccountInput;
