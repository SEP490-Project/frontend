import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Eye, EyeClosed } from "lucide-react";

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ value, ...props }, ref) => {
  console.log(value);
  const [showPassword, setShowPassword] = React.useState(false);
  const isEmpty = value === "" || value === undefined || value === null || props.disabled;

  return (
    <div className="relative">
      <Input type={showPassword ? "text" : "password"} value={value} ref={ref} {...props} />
      {!isEmpty && (
        <Button
          variant={"ghost"}
          size="icon"
          className="absolute right-1 top-1"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Eye aria-hidden="true" /> : <EyeClosed aria-hidden="true" />}
        </Button>
      )}
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";
