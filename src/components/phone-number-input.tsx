import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneNumberInputProps {
  label?: string;
  value: string; // dạng lưu trữ trong DB, ví dụ: "+84901234567"
  onChange: (value: string) => void; // callback trả về dạng "+84..."
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

// --- Helper functions ---

// Hiển thị: +8490xxxxxxx -> 090xxxxxxx
const formatPhoneToDisplay = (phone: string): string => {
  if (!phone) return "";
  return phone.replace(/^\+84/, "0");
};

// Lưu lên server: 090xxxxxxx -> +8490xxxxxxx
const formatPhoneToServer = (phone: string): string => {
  const clean = phone.replace(/\D/g, ""); // chỉ lấy số

  if (clean.startsWith("0")) return "+84" + clean.slice(1);
  if (phone.startsWith("+84")) return "+84" + clean.slice(2);
  return "+84" + clean;
};

// Kiểm tra hợp lệ (Việt Nam)
const isValidVietnamPhone = (phone: string): boolean => {
  const regex = /^(?:0|\+84)(?:\d{9})$/;
  return regex.test(phone);
};

// --- Component ---
export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Input Phone Number (VD: 0901234567)",
  error,
  disabled = false,
  className = "",
  required = false,
}) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    // Khi có value từ DB (+84...), hiển thị lại 0xxx
    setDisplayValue(formatPhoneToDisplay(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    // Chỉ cho nhập số và dấu +
    input = input.replace(/[^\d+]/g, "");

    // Nếu người dùng nhập +84 thì giữ nguyên, còn lại thì để số 0 đứng đầu
    if (input.startsWith("+84") || input.startsWith("0") || input === "") {
      setDisplayValue(input);
    }
  };

  const handleBlur = () => {
    // Khi blur, gửi value dạng +84xxx cho parent
    const normalized = formatPhoneToServer(displayValue);
    onChange(normalized);
  };

  const showError =
    error || (displayValue && !isValidVietnamPhone(displayValue) ? "Invalid phone number" : "");

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
        onBlur={handleBlur}
        placeholder={placeholder}
        className={` ${showError ? "border-red-500" : ""} ${
          disabled ? "bg-gray-100 text-gray-700 cursor-not-allowed" : ""
        }`}
        disabled={disabled}
      />
      {showError && <p className="text-sm text-red-500">{showError}</p>}
    </div>
  );
};

export default PhoneNumberInput;
