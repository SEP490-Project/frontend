import * as React from "react";
import { cn } from "@/libs/utils";

interface InputProps extends React.ComponentProps<"input"> {
  enforceRange?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, enforceRange = false, onChange, min, max, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (enforceRange && type === "number") {
        const num = Number(value);

        if (!isNaN(num)) {
          if (max !== undefined && num > Number(max)) value = String(max);
          if (min !== undefined && num < Number(min)) value = String(min);
        }
      }

      const newEvent = {
        ...e,
        target: { ...e.target, value },
      };
      onChange?.(newEvent as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <input
        type={type}
        ref={ref}
        min={min}
        max={max}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        onChange={handleChange}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
