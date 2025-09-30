import { CircleAlert } from "lucide-react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export const StatusModal = ({
  name,
  status = "Active",
}: {
  name: string;
  status: string;
}): React.ReactElement => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
          <span>
            <CircleAlert className="text-yellow-600" />
          </span>
          Confirm Status Change
        </DialogTitle>
        <DialogDescription>
          <p>This action will change the status to {status}.</p>
        </DialogDescription>
      </DialogHeader>
      <p>
        Are you sure you want to change the status of this{" "}
        <span className="font-semibold">{name}?</span>
      </p>
      <DialogFooter className="flex justify-end space-x-2">
        <DialogClose asChild>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">No</button>
        </DialogClose>
        <button className="px-4 py-2 bg-primary text-white rounded hover:bg-[#f794a8]">Yes</button>
      </DialogFooter>
    </DialogContent>
  );
};
