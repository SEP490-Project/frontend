import { useAppDispatch } from "@/libs/stores";
import { approveRefundAnOrderThunk } from "@/libs/stores/orderManager/thunk";
import type { OrderData } from "@/libs/types/order";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, X, CheckCircle, Image as ImageIcon } from "lucide-react";

export const RefundRequestModal = ({
  order,
  onSuccess,
}: {
  order: OrderData;
  onSuccess?: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

  const handleRefundOrder = async (action: "APPROVE" | "OBLIGATE") => {
    if (!order) return;

    if (!selectedFile) {
      toast.error("Please upload proof image");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await dispatch(
        approveRefundAnOrderThunk({
          orderId: order.id,
          file: formData,
        }),
      ).unwrap();

      toast.success(`Refund ${action === "APPROVE" ? "approved" : "rejected"} successfully!`);
      onSuccess?.();
    } catch (error: any) {
      toast.error("Failed to process refund request", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Order Information */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="space-y-2">
          <h3 className="font-semibold text-amber-900">Refund Request Details</h3>
          <div className="text-sm text-amber-800">
            <p>
              <span className="font-medium">Order ID:</span> #{order.id}
            </p>
            <p>
              <span className="font-medium">Customer:</span> {order.full_name}
            </p>
            <p>
              <span className="font-medium">Total Amount:</span>{" "}
              {order.total_amount?.toLocaleString("vi-VN")} VNĐ
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
          Please upload an image as proof for the refund request (Max 5MB)
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

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={() => handleRefundOrder("APPROVE")}
          disabled={!selectedFile || isSubmitting}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {isSubmitting ? "Processing..." : "Approve Refund"}
        </Button>

        {/* <Button
          onClick={() => handleRefundOrder("OBLIGATE")}
          disabled={!selectedFile || isSubmitting}
          variant="destructive"
          className="flex-1"
        >
          <XCircle className="w-4 h-4 mr-2" />
          {isSubmitting ? "Processing..." : "Reject Refund"}
        </Button> */}
      </div>
    </div>
  );
};
