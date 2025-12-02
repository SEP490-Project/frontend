import { useAppDispatch } from "@/libs/stores";
import {
  compensateAPreOrderThunk,
  getPreOrdersForSaleStaffThunk,
} from "@/libs/stores/orderManager/thunk";
import type { PreOrderData } from "@/libs/types/pre-order";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, X, CheckCircle, Image as ImageIcon } from "lucide-react";

export const CompensateRequestPreOrder = ({
  preOrder,
  onSuccess,
}: {
  preOrder: PreOrderData;
  onSuccess?: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCompensatePreOrder = async () => {
    if (!preOrder) return;

    if (!selectedFile) {
      toast.error("Please upload proof image");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("isApproved", "true");
      formData.append("reason", reason.trim());

      await dispatch(
        compensateAPreOrderThunk({
          id: preOrder.id,
          file: formData,
        }),
      ).unwrap();

      toast.success("Compensation request approved successfully!");
      dispatch(getPreOrdersForSaleStaffThunk({ page: 1, limit: 10 }));
      onSuccess?.();
    } catch (error: any) {
      toast.error("Failed to process compensation request", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Pre-Order Information */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="space-y-2">
          <h3 className="font-semibold text-blue-900">Compensation Request Details</h3>
          <div className="text-sm text-blue-800">
            <p>
              <span className="font-medium">Pre-Order ID:</span> #{preOrder.id.slice(0, 8)}
            </p>
            <p>
              <span className="font-medium">Customer:</span> {preOrder.full_name}
            </p>
            <p>
              <span className="font-medium">Total Amount:</span>{" "}
              {preOrder.total_amount?.toLocaleString("vi-VN")} VNĐ
            </p>
          </div>
        </div>
      </Card>

      {/* File Upload Section */}
      <div className="space-y-2">
        <Label htmlFor="proof-upload" className="text-base font-semibold">
          Upload Proof Image <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          Please upload an image as proof for the compensation request (Max 5MB)
        </p>

        <input
          ref={fileInputRef}
          type="file"
          id="proof-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {!previewUrl ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100"
          >
            <Upload className="w-12 h-12 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Click to upload image</span>
            <span className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</span>
          </button>
        ) : (
          <Card className="relative p-4">
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="relative w-32 h-32 flex-shrink-0 border rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={previewUrl}
                  alt="Proof preview"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-sm">{selectedFile?.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Size: {((selectedFile?.size || 0) / 1024).toFixed(2)} KB
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                  <CheckCircle className="w-3 h-3" />
                  Image uploaded successfully
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Reason/Notes Section */}
      <div className="space-y-2">
        <Label htmlFor="reason">Reason/Notes</Label>
        <p className="text-sm text-muted-foreground">
          Provide details about the compensation decision
        </p>
        <Textarea
          id="reason"
          placeholder="Enter reason or notes about this compensation request..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleCompensatePreOrder}
          disabled={!selectedFile || isSubmitting}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {isSubmitting ? "Processing..." : "Approve Compensation"}
        </Button>
      </div>
    </div>
  );
};
