import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { useGoong } from "@/libs/hooks/useGoong";
import { useDebounce } from "@/libs/hooks/useDebounce";

interface AddressSelectorProps {
  value: string;
  onChange: (address: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  value,
  onChange,
  label = "Address",
  placeholder = "Enter address...",
  required = false,
  error,
  className = "",
}) => {
  const { predictions, loading: goongLoading, getPredictions, clear } = useGoong();
  const [addressInput, setAddressInput] = useState(value || "");
  const debouncedAddress = useDebounce(addressInput, 500);
  const [showPredictions, setShowPredictions] = useState(false);

  // Sync với prop value khi thay đổi từ bên ngoài
  useEffect(() => {
    setAddressInput(value || "");
  }, [value]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAddressInput(newValue);
    onChange(newValue); // Update ngay lập tức để user có thể type freely
  };

  useEffect(() => {
    if (debouncedAddress && debouncedAddress.trim().length > 2) {
      getPredictions(debouncedAddress.trim());
      setShowPredictions(true);
    } else {
      clear();
      setShowPredictions(false);
    }
  }, [debouncedAddress, getPredictions, clear]);

  const handleAddressSelect = (prediction: any) => {
    const selectedAddress = prediction.description;
    setAddressInput(selectedAddress);
    onChange(selectedAddress);
    setShowPredictions(false);
    clear();
  };

  const handleAddressFocus = () => {
    if (predictions?.length && addressInput.trim().length > 2) {
      setShowPredictions(true);
    }
  };

  const handleAddressBlur = () => {
    setTimeout(() => setShowPredictions(false), 100);
  };

  return (
    <div className={`space-y-2 relative ${className}`}>
      {label && (
        <Label className="text-sm font-medium">
          {label} {required && "*"}
        </Label>
      )}

      <div className="relative">
        <Input
          value={addressInput}
          onChange={handleAddressChange}
          onFocus={handleAddressFocus}
          onBlur={handleAddressBlur}
          placeholder={placeholder}
          className={`pl-10 ${error ? "border-red-500" : ""}`}
          autoComplete="off"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {showPredictions && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 max-h-64 overflow-y-auto">
          {goongLoading ? (
            <div className="px-4 py-3 flex items-center justify-center text-sm text-slate-500">
              <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
              Searching address...
            </div>
          ) : predictions?.length ? (
            predictions.map((prediction, idx) => (
              <button
                key={prediction.place_id || idx}
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 border-b last:border-none border-slate-100 focus:bg-slate-100 focus:outline-none"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleAddressSelect(prediction);
                }}
              >
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-900 font-medium truncate">
                    {prediction.structured_formatting?.main_text || prediction.description}
                  </div>
                  {prediction.structured_formatting?.secondary_text && (
                    <div className="text-xs text-slate-500 mt-0.5 truncate">
                      {prediction.structured_formatting.secondary_text}
                    </div>
                  )}
                </div>
              </button>
            ))
          ) : (
            addressInput.trim().length > 2 && (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">
                No matching address found
              </div>
            )
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AddressSelector;
