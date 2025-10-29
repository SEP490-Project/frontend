import React from "react";
import { Input } from "./ui/input";
import { Eye, EyeClosed } from "lucide-react";

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ value, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        value={value}
        ref={ref}
        {...props}
        className="pr-10"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-2 flex items-center p-2 text-gray-400 hover:text-gray-600 transition-colors"
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <Eye className="h-5 w-5" aria-hidden="true" />
        ) : (
          <EyeClosed className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
