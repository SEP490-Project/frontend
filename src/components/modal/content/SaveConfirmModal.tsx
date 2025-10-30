import { Save, Loader2 } from "lucide-react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

export interface SaveConfirmModalProps {
  contentTitle: string;
  contentType: "blog" | "video";
  isUpdate: boolean;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const SaveConfirmModal = ({
  contentTitle,
  contentType,
  isUpdate,
  onConfirm,
  isLoading = false,
}: SaveConfirmModalProps): React.ReactElement => {
  const action = isUpdate ? "Update" : "Save";
  const actionLower = isUpdate ? "update" : "save";

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
          <span>
            <Save className="text-primary" />
          </span>
          Confirm {action}
        </DialogTitle>
        <DialogDescription>
          <p>
            Are you sure you want to {actionLower} this {contentType} content?
          </p>
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Title:</span>
          </p>
          <p className="font-semibold text-gray-900">{contentTitle}</p>
        </div>
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
          className="px-4 py-2 bg-primary text-white rounded hover:bg-[#f794a8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>{action} Content</>
          )}
        </button>
      </DialogFooter>
    </DialogContent>
  );
};
