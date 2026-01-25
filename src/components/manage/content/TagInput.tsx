import React, { useState, useRef, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus, Check, Tag } from "lucide-react";
import { cn } from "@/libs/utils";

export interface TagOption {
  id: string;
  name: string;
}

interface TagInputProps {
  availableTags: TagOption[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onCreateTag?: (tagName: string) => Promise<TagOption | null>;
  placeholder?: string;
  allowCreate?: boolean;
  maxTags?: number;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  availableTags,
  selectedTags,
  onTagsChange,
  onCreateTag,
  placeholder = "Search or create tags...",
  allowCreate = true,
  maxTags,
  className,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter available tags based on input
  const filteredTags = useMemo(() => {
    const searchTerm = inputValue.toLowerCase().trim();
    if (!searchTerm) return availableTags;

    return availableTags.filter((tag) => tag.name.toLowerCase().includes(searchTerm));
  }, [availableTags, inputValue]);

  // Check if exact match exists
  const exactMatchExists = useMemo(() => {
    const searchTerm = inputValue.toLowerCase().trim();
    return availableTags.some((tag) => tag.name.toLowerCase() === searchTerm);
  }, [availableTags, inputValue]);

  // Check if tag is already selected
  const isTagSelected = (tagId: string) => selectedTags.includes(tagId);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle tag selection
  const toggleTag = (tagId: string) => {
    if (isTagSelected(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId));
    } else {
      if (maxTags && selectedTags.length >= maxTags) return;
      onTagsChange([...selectedTags, tagId]);
    }
  };

  // Remove a selected tag
  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((id) => id !== tagId));
  };

  // Create new tag
  const handleCreateTag = async () => {
    if (!onCreateTag || !inputValue.trim() || exactMatchExists) return;

    setIsCreating(true);
    try {
      const newTag = await onCreateTag(inputValue.trim());
      if (newTag) {
        onTagsChange([...selectedTags, newTag.id]);
        setInputValue("");
      }
    } catch (error) {
      console.error("Failed to create tag:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (allowCreate && inputValue.trim() && !exactMatchExists && onCreateTag) {
        handleCreateTag();
      } else if (filteredTags.length === 1) {
        toggleTag(filteredTags[0].id);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Get tag name by ID
  const getTagName = (tagId: string) => {
    const tag = availableTags.find((t) => t.id === tagId);
    return tag?.name || tagId;
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Selected Tags Display */}
      <div
        className={cn(
          "flex flex-wrap gap-1.5 p-2 border rounded-lg bg-background min-h-[42px] cursor-text",
          isOpen && "ring-2 ring-ring ring-offset-1",
        )}
        onClick={() => {
          inputRef.current?.focus();
          setIsOpen(true);
        }}
      >
        {selectedTags.map((tagId) => (
          <Badge
            key={tagId}
            className="flex items-center gap-1 px-2 py-0.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Tag className="h-3 w-3" />
            {getTagName(tagId)}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tagId);
              }}
              className="ml-1 rounded-full hover:bg-primary-foreground/20 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] border-0 bg-transparent p-0 h-6 text-sm outline-none"
          disabled={maxTags ? selectedTags.length >= maxTags : false}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 border rounded-lg bg-popover shadow-xl animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
          <ScrollArea className="max-h-[240px] w-full flex flex-col">
            <div className="p-1">
              {filteredTags.length === 0 && !inputValue.trim() && (
                <div className="px-3 py-4 text-sm text-muted-foreground text-center italic">
                  No tags available
                </div>
              )}

              {filteredTags.map((tag) => {
                const selected = isTagSelected(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      toggleTag(tag.id);
                      setInputValue("");
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground text-left transition-colors",
                      selected && "bg-accent/50 font-medium",
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 border rounded flex items-center justify-center transition-colors",
                        selected ? "bg-primary border-primary" : "border-input",
                      )}
                    >
                      {selected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{tag.name}</span>
                  </button>
                );
              })}

              {/* Create New Tag Option */}
              {allowCreate && inputValue.trim() && !exactMatchExists && onCreateTag && (
                <>
                  {filteredTags.length > 0 && <div className="border-t my-1" />}
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    disabled={isCreating}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-md hover:bg-primary/10 text-left text-primary font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isCreating ? "Creating..." : `Add "${inputValue.trim()}"`}</span>
                  </button>
                </>
              )}
            </div>
          </ScrollArea>

          {maxTags && (
            <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground border-t bg-muted/30 uppercase tracking-tight">
              {selectedTags.length} of {maxTags} selected
            </div>
          )}
          {!maxTags && selectedTags.length > 0 && (
            <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground border-t bg-muted/30 uppercase tracking-tight">
              {selectedTags.length} selected
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagInput;
