import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaMoneyBill, FaExpand, FaFileAlt } from "react-icons/fa";
import { Loader2, X, ExternalLink, ImageOff } from "lucide-react";
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
import type { ContractPayment, ReviewRefundProofRequest } from "@/libs/types/contract-payments";

// ============== Review Refund Proof Modal (For Brand) ==============
interface ReviewRefundProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: ContractPayment | null;
  onReview: (data: ReviewRefundProofRequest) => Promise<void>;
  isReviewing: boolean;
}

export function ReviewRefundProofModal({
  isOpen,
  onClose,
  payment,
  onReview,
  isReviewing,
}: ReviewRefundProofModalProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset image error state when payment changes
  useEffect(() => {
    if (isOpen) {
      setImageError(false);
      setShowRejectForm(false);
      setRejectReason("");
    }
  }, [isOpen, payment]);

  // Robust check for image URLs including SVGs and handling query params
  const isImageUrl = (url?: string) => {
    if (!url) return false;
    try {
      // Remove query parameters to check extension cleanly
      const cleanUrl = url.split("?")[0].toLowerCase();
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".bmp",
        ".svg",
        ".ico",
        ".tiff",
      ];
      return imageExtensions.some((ext) => cleanUrl.endsWith(ext));
    } catch {
      return false;
    }
  };

  const handleApprove = async () => {
    try {
      await onReview({ approved: true });
      onClose();
    } catch {
      // Error handled by parent
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      await onReview({ approved: false, reject_reason: rejectReason.trim() });
      onClose();
    } catch {
      // Error handled by parent
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (!payment) return null;

  const isImage = isImageUrl(payment.refund_proof_url);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[60vw] min-w-[40vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaCheck className="h-5 w-5 text-green-600" />
              Review Refund Proof
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
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Submitted At</span>
                <span className="text-sm">{formatDate(payment.refund_submitted_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Attempt</span>
                <span className="text-sm font-medium">#{payment.refund_attempts || 1}</span>
              </div>
            </div>

            {/* Proof Image/URL Display */}
            {payment.refund_proof_url && (
              <div className="space-y-2">
                <Label>Refund Proof</Label>

                {/* If it detects as an image and hasn't errored out */}
                {isImage && !imageError ? (
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
                    <div
                      className="relative aspect-video group cursor-pointer bg-[url('https://transparenttextures.com/patterns/stardust.png')] bg-gray-50"
                      onClick={() => setShowImageZoom(true)}
                    >
                      <img
                        src={payment.refund_proof_url}
                        alt="Refund proof"
                        className="w-full h-full object-contain"
                        onError={() => setImageError(true)} // Fallback if SVG fails to load
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-white">
                          <FaExpand className="h-5 w-5" />
                          <span className="text-sm font-medium">Click to enlarge</span>
                        </div>
                      </div>
                    </div>
                    {/* External Link Footer */}
                    <div className="flex items-center justify-between px-3 py-2 bg-white border-t border-gray-200">
                      <span className="text-xs text-gray-500 truncate max-w-[200px]">
                        {payment.refund_proof_url.split("/").pop()}
                      </span>
                      <a
                        href={payment.refund_proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Open original
                      </a>
                    </div>
                  </div>
                ) : (
                  // Fallback for non-images OR broken images
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="p-2 bg-white rounded-md border border-gray-100">
                      {imageError ? (
                        <ImageOff className="h-6 w-6 text-gray-400" />
                      ) : (
                        <FaFileAlt className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {payment.refund_proof_url.split("/").pop() || "Proof Document"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {imageError ? "Image failed to load" : "Document file"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={payment.refund_proof_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Proof Note */}
            {payment.refund_proof_note && (
              <div className="space-y-2">
                <Label>Note from Staff</Label>
                <div className="p-3 bg-gray-100 rounded-lg text-sm">
                  {payment.refund_proof_note}
                </div>
              </div>
            )}

            {/* Reject Form */}
            {showRejectForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                <Label htmlFor="rejectReason">Rejection Reason *</Label>
                <Textarea
                  id="rejectReason"
                  placeholder="Explain why the refund proof is being rejected..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  disabled={isReviewing}
                  rows={3}
                />
              </motion.div>
            )}
          </motion.div>

          <DialogFooter className="gap-2">
            {!showRejectForm ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(true)}
                  disabled={isReviewing}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <FaTimes className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isReviewing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isReviewing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2 h-4 w-4" />
                      Approve Refund
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(false)}
                  disabled={isReviewing}
                >
                  Back
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isReviewing || !rejectReason.trim()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isReviewing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <FaTimes className="mr-2 h-4 w-4" />
                      Confirm Rejection
                    </>
                  )}
                </Button>
              </>
            )}
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
            {/* Added bg-white to the container to ensure transparent SVGs are visible */}
            {payment?.refund_proof_url && (
              <div className="max-w-full max-h-full bg-white rounded-md overflow-hidden">
                <img
                  src={payment.refund_proof_url}
                  alt="Refund proof full size"
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
