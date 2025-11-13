import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FaXmark, FaTriangleExclamation } from "react-icons/fa6";
import { motion } from "framer-motion";

interface RejectCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  campaignName: string;
  isSubmitting?: boolean;
}

const RejectCampaignModal: React.FC<RejectCampaignModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  campaignName,
  isSubmitting = false,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }
    if (reason.trim().length < 10) {
      setError("Reason must be at least 10 characters long");
      return;
    }
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReason("");
      setError("");
      onClose();
    }
  };

  const handleReasonChange = (value: string) => {
    setReason(value);
    if (error) {
      setError("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-full">
              <FaTriangleExclamation className="h-5 w-5 text-red-600" />
            </div>
            Reject Campaign
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="text-sm text-gray-600">
            You are about to reject the campaign: <strong>{campaignName}</strong>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rejection-reason">
              Rejection Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rejection-reason"
              placeholder="Please provide a detailed reason for rejecting this campaign..."
              value={reason}
              onChange={(e) => handleReasonChange(e.target.value)}
              className={`min-h-[100px] resize-none ${error ? "border-red-500" : ""}`}
              disabled={isSubmitting}
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="text-xs text-gray-500 ml-auto">{reason.length}/500 characters</div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex">
              <FaTriangleExclamation className="h-5 w-5 text-yellow-600 shrink-0" />
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. The campaign will be
                  marked as rejected and the marketing team will be notified.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <FaXmark className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim()}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <FaTriangleExclamation className="h-4 w-4" />
            )}
            {isSubmitting ? "Rejecting..." : "Reject Campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectCampaignModal;
