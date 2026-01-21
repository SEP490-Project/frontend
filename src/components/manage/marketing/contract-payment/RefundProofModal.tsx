import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUpload, FaTimes, FaMoneyBill, FaExpand, FaTrash } from "react-icons/fa";
import { FaBuildingColumns } from "react-icons/fa6";
import { Loader2, X, Upload, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAppDispatch } from "@/libs/stores";
import { useAuth } from "@/libs/hooks/useAuth";
import { uploadFilesThunk } from "@/libs/stores/fileManager/thunk";
import type { ContractPayment, SubmitRefundProofRequest } from "@/libs/types/contract-payments";

const MAX_FILE_SIZE_MB = 10;

// ============== Submit Refund Proof Modal (For Marketing Staff) ==============
interface SubmitRefundProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: ContractPayment | null;
  onSubmit: (data: SubmitRefundProofRequest) => Promise<void>;
  isSubmitting: boolean;
}

export function SubmitRefundProofModal({
  isOpen,
  onClose,
  payment,
  onSubmit,
  isSubmitting,
}: SubmitRefundProofModalProps) {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  // Form state
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [proofNote, setProofNote] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleRemoveFile = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setProofFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      handleRemoveFile();
      setProofNote("");
    }
  }, [isOpen, handleRemoveFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, etc.)");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    // Cleanup previous preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setProofFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, etc.)");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    // Cleanup previous preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setProofFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!proofFile) {
      toast.error("Please upload a refund proof image");
      return;
    }

    if (!user?.id) {
      toast.error("User session is invalid. Please log in again.");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload the file first
      const uploadResult = await dispatch(
        uploadFilesThunk({ userId: user.id, files: [proofFile] }),
      ).unwrap();

      const uploadedUrl = Array.isArray(uploadResult)
        ? uploadResult[0]
        : (uploadResult as any).url || uploadResult;

      if (!uploadedUrl) {
        throw new Error("Failed to get uploaded file URL");
      }

      // 2. Submit the refund proof with the uploaded URL
      await onSubmit({
        refund_proof_url: uploadedUrl as string,
        refund_proof_note: proofNote.trim() || undefined,
      });

      // Reset form on success
      handleRemoveFile();
      setProofNote("");
    } catch (error: any) {
      console.error("Upload/submit error:", error);
      toast.error(error?.message || "Failed to submit refund proof");
    } finally {
      setIsUploading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const isProcessing = isSubmitting || isUploading;

  if (!payment) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[60vw] min-w-[40vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaUpload className="h-5 w-5 text-blue-600" />
              Submit Refund Proof
            </DialogTitle>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Payment Info Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Contract</span>
                <span className="font-medium">{payment.contract_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Refund Amount</span>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                  <FaMoneyBill className="mr-1 h-3 w-3" />
                  {formatCurrency(payment.refund_amount || 0)}
                </Badge>
              </div>
              {/* {payment.refund_attempts !== undefined && payment.refund_attempts > 0 && ( */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Attempt</span>
                <span className="text-sm font-medium">
                  #
                  {payment.refund_attempts && payment.refund_attempts > 0
                    ? payment.refund_attempts + 1
                    : 1}
                </span>
              </div>
              {/* )} */}
            </div>

            {/* Brand Bank Info */}
            {(payment.brand_bank_name || payment.brand_bank_account_number) && (
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                  <FaBuildingColumns className="h-4 w-4" />
                  Brand Bank Details (Recipient)
                </div>
                {payment.brand_bank_name && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-600">Bank Name</span>
                    <span className="font-medium text-blue-900">{payment.brand_bank_name}</span>
                  </div>
                )}
                {payment.brand_bank_account_number && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-600">Account Number</span>
                    <span className="font-medium text-blue-900">
                      {payment.brand_bank_account_number}
                    </span>
                  </div>
                )}
                {payment.brand_bank_account_holder && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-600">Account Holder</span>
                    <span className="font-medium text-blue-900">
                      {payment.brand_bank_account_holder}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Previous Rejection Reason */}
            {payment.status === "KOL_PROOF_REJECTED" && payment.refund_reject_reason && (
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 font-medium mb-1">
                  <FaTimes className="h-4 w-4" />
                  Previous Rejection Reason
                </div>
                <p className="text-sm text-red-700">{payment.refund_reject_reason}</p>
              </div>
            )}

            {/* File Upload Section */}
            <div className="space-y-2">
              <Label>Refund Proof Image *</Label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isProcessing}
              />

              <AnimatePresence mode="wait">
                {!proofFile ? (
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 bg-gray-100 rounded-full">
                        <Upload className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Drop your image here or click to browse
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to {MAX_FILE_SIZE_MB}MB
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                  >
                    {/* Preview Image */}
                    <div
                      className="relative aspect-video group cursor-pointer"
                      onClick={() => setShowImageZoom(true)}
                    >
                      <img
                        src={previewUrl || ""}
                        alt="Refund proof preview"
                        className="w-full h-full object-contain"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-white">
                          <FaExpand className="h-5 w-5" />
                          <span className="text-sm font-medium">Click to enlarge</span>
                        </div>
                      </div>
                    </div>

                    {/* File info bar */}
                    <div className="flex items-center justify-between px-3 py-2 bg-white border-t border-gray-200">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileImage className="h-4 w-4 text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{proofFile.name}</span>
                        <span className="text-xs text-gray-400 shrink-0">
                          ({(proofFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        disabled={isProcessing}
                      >
                        <FaTrash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Note Input */}
            <div className="space-y-2">
              <Label htmlFor="proofNote">Note (Optional)</Label>
              <Textarea
                id="proofNote"
                placeholder="Add any additional notes about the refund..."
                value={proofNote}
                onChange={(e) => setProofNote(e.target.value)}
                disabled={isProcessing}
                rows={3}
              />
            </div>
          </motion.div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isProcessing || !proofFile}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploading ? "Uploading..." : "Submitting..."}
                </>
              ) : (
                <>
                  <FaUpload className="mr-2 h-4 w-4" />
                  Submit Proof
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Zoom Dialog */}
      <Dialog open={showImageZoom} onOpenChange={setShowImageZoom}>
        <DialogContent className="max-w-screen-xl w-full p-0 overflow-hidden bg-black/95 border-none">
          <div className="relative w-full h-[80vh] flex items-center justify-center">
            <button
              onClick={() => setShowImageZoom(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
            >
              <X className="w-5 h-5" />
            </button>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Refund proof full size"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
