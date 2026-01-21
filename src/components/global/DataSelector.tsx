import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";

interface DataSelectorProps<T> {
  data: T[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  renderItem: (item: T) => React.ReactNode;
  getLabel: (item: T) => string;
  title: string;
  placeholder: string;
  onSearch?: (value: string) => void;
  searchValue?: string;
  onScrollEnd?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const DataSelector = <T extends { id: string }>({
  data,
  selectedId,
  onSelect,
  renderItem,
  getLabel,
  title,
  placeholder,
  onSearch,
  searchValue,
  onScrollEnd,
  loading,
  disabled = false,
}: DataSelectorProps<T>) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const selectedItem = data.find((item) => String(item.id) === String(selectedId)) || null;
  const listRef = useRef<HTMLDivElement>(null);

  // Infinite scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (onScrollEnd && el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      onScrollEnd();
    }
  };

  return (
    <Dialog open={isDialogOpen && !disabled} onOpenChange={disabled ? () => {} : setIsDialogOpen}>
      <DialogTrigger asChild disabled={disabled}>
        <div className="w-full relative">
          {/* Icon search */}
          <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

          {/* Input hiển thị lựa chọn */}
          <Input
            readOnly
            disabled={disabled}
            value={selectedItem ? getLabel(selectedItem) : ""}
            placeholder={placeholder}
            className={`cursor-pointer pl-9 pr-9 ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />

          {/* Nút clear */}
          {selectedItem && !disabled && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation(); // không mở dialog khi bấm clear
                onSelect(null);
              }}
            >
              <FaXmark className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchValue}
            onValueChange={onSearch}
          />
          <CommandList
            className="max-h-[50vh] overflow-y-auto"
            ref={listRef}
            onScroll={handleScroll}
          >
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup heading={title}>
              {data.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${getLabel(item)}`}
                  onSelect={() => {
                    onSelect(item.id);
                    setIsDialogOpen(false);
                  }}
                >
                  {renderItem(item)}
                </CommandItem>
              ))}
              {loading && <div className="text-center py-2 text-xs text-gray-400">Loading...</div>}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default DataSelector;
