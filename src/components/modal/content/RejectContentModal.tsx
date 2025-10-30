import { useState } from "react";
import { XCircle, Loader2 } from "lucide-react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Textarea } from "../../ui/textarea";

export const RejectContentModal = ({
  contentTitle,
  onConfirm,
  isLoading = false,
}: {
  contentTitle: string;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}): React.ReactElement => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
          <span>
            <XCircle className="text-pink-600" />
          </span>
          Reject Content
        </DialogTitle>
        <DialogDescription>
          <p>Please provide a reason for rejecting this content.</p>
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <p>
          You are about to reject <span className="font-semibold">"{contentTitle}"</span>
        </p>
        <div>
          <label htmlFor="reject-reason" className="block text-sm font-medium text-gray-700 mb-2">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="reject-reason"
            placeholder="Please explain why this content is being rejected..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full"
          />
        </div>
        <p className="text-sm text-gray-600">
          The content will be sent back to draft status and the author will be notified of the
          rejection reason.
        </p>
      </div>
      <DialogFooter className="flex justify-end space-x-2">
        <DialogClose asChild>
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Cancel
          </button>
        </DialogClose>
        <button
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          onClick={handleConfirm}
          disabled={!reason.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Rejecting...
            </>
          ) : (
            <>Reject Content</>
          )}
        </button>
      </DialogFooter>
    </DialogContent>
  );
};
