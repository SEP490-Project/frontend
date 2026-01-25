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
import { XCircle, Loader2 } from "lucide-react";

interface RejectReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (feedback: string) => void;
  contentTitle: string;
  isLoading?: boolean;
}

const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  contentTitle,
  isLoading = false,
}) => {
  const [feedback, setFeedback] = useState("");

  const handleConfirm = () => {
    if (feedback.trim()) {
      onConfirm(feedback.trim());
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFeedback("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <XCircle className="w-5 h-5 text-red-500" />
            Reject Content
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600">
            You are about to reject <span className="font-semibold">"{contentTitle}"</span>
          </p>

          <div>
            <label
              htmlFor="reject-feedback"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Rejection Feedback <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="reject-feedback"
              placeholder="Please provide feedback on why this content is being rejected..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <p className="text-sm text-gray-500">
            The content will be rejected and the author will be notified of the feedback.
          </p>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!feedback.trim() || isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 mr-2" />
                Reject Content
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectReasonModal;
