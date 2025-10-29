import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2, X } from "lucide-react";
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
  const [hasSelected, setHasSelected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Đồng bộ value bên ngoài
  useEffect(() => {
    setAddressInput(value || "");
  }, [value]);

  // Lấy gợi ý khi người dùng nhập
  useEffect(() => {
    if (debouncedAddress && debouncedAddress.trim().length > 2 && !hasSelected) {
      getPredictions(debouncedAddress.trim());
      setShowPredictions(true);
    } else {
      clear();
      setShowPredictions(false);
    }
  }, [debouncedAddress, getPredictions, clear, hasSelected]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHasSelected(false); // người dùng đang nhập lại, bỏ trạng thái "đã chọn"
    setAddressInput(newValue);
    onChange(newValue);
  };

  const handleAddressSelect = (prediction: any) => {
    const selectedAddress = prediction.description;
    setAddressInput(selectedAddress);
    onChange(selectedAddress);
    setHasSelected(true);
    setShowPredictions(false);
    clear();
  };

  const handleClearInput = () => {
    setAddressInput("");
    setHasSelected(false);
    setShowPredictions(false);
    clear();
    onChange("");
  };

  // Ẩn danh sách khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPredictions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`space-y-2 relative ${className}`}>
      {label && (
        <Label className="text-sm font-medium">
          {label} {required && "*"}
        </Label>
      )}

      <div className="relative">
        <Input
          value={addressInput}
          onChange={handleAddressChange}
          placeholder={placeholder}
          className={`h-11 pl-10 pr-9 text-sm ${error ? "border-red-500" : ""}`}
          autoComplete="off"
          onFocus={() => {
            if (!hasSelected && predictions?.length) setShowPredictions(true);
          }}
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

        {/* Nút X để xóa */}
        {addressInput && (
          <button
            type="button"
            onClick={handleClearInput}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
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
            debouncedAddress.trim().length > 2 && (
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
