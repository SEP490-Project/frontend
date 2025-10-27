import React from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface WarningDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  warningMessage?: string;
  warningItems?: string[];
  additionalInfo?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonVariant?: "destructive" | "default";
}

const WarningDialog: React.FC<WarningDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  warningMessage,
  warningItems = [],
  additionalInfo,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonVariant = "destructive",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FaTriangleExclamation className="h-5 w-5 text-red-500" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-left">
            <div className="space-y-3">
              <p>{description}</p>
              {(warningMessage || warningItems.length > 0 || additionalInfo) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  {warningMessage && (
                    <p className="text-red-800 text-sm font-medium">{warningMessage}</p>
                  )}
                  {warningItems.length > 0 && (
                    <ul className="mt-2 text-red-700 text-sm list-disc list-inside space-y-1">
                      {warningItems.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {additionalInfo && <p className="mt-2 text-red-800 text-sm">{additionalInfo}</p>}
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={
              confirmButtonVariant === "destructive" ? "bg-red-600 hover:bg-red-700 text-white" : ""
            }
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarningDialog;
