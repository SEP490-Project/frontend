import { Trash } from "lucide-react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

export const DeleteContentModal = ({
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
            <Trash className="text-red-600" />
          </span>
          Confirm Deletion
        </DialogTitle>
        <DialogDescription>
          <p>This action cannot be undone.</p>
        </DialogDescription>
      </DialogHeader>
      <p>
        Are you sure you want to delete <span className="font-semibold">"{contentTitle}"</span>?
      </p>
      <p className="text-sm text-gray-600 mt-2">
        This will permanently remove the content from the system.
      </p>
      <DialogFooter className="flex justify-end space-x-2">
        <DialogClose asChild>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
        </DialogClose>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={onConfirm}
        >
          Delete
        </button>
      </DialogFooter>
    </DialogContent>
  );
};
