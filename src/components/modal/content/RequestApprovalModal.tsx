import { Send } from "lucide-react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

export const RequestApprovalModal = ({
  contentTitle,
  onConfirm,
}: {
  contentTitle: string;
  onConfirm: () => void;
}): React.ReactElement => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
          <span>
            <Send className="text-primary" />
          </span>
          Request Approval
        </DialogTitle>
        <DialogDescription>
          <p>This will submit your content for review.</p>
        </DialogDescription>
      </DialogHeader>
      <p>
        Are you sure you want to submit <span className="font-semibold">"{contentTitle}"</span> for
        approval?
      </p>
      <p className="text-sm text-gray-600 mt-2">
        Once submitted, the content will be reviewed by the appropriate team based on the selected
        channels.
      </p>
      <DialogFooter className="flex justify-end space-x-2">
        <DialogClose asChild>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
        </DialogClose>
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-[#f794a8]"
          onClick={onConfirm}
        >
          Submit for Approval
        </button>
      </DialogFooter>
    </DialogContent>
  );
};
