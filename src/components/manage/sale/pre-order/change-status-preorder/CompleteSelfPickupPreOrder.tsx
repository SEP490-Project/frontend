import type { PreOrderData } from "@/libs/types/pre-order";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Package, Upload, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { convertNumberToCurrency } from "@/libs/helper/helper";

interface CompleteSelfPickupPreOrderProps {
  preOrder: PreOrderData;
  onHandle: (file: File) => void;
}

const CompleteSelfPickupPreOrder = ({ preOrder, onHandle }: CompleteSelfPickupPreOrderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please upload a confirmation image");
      return;
    }

    setIsSubmitting(true);
    try {
      await onHandle(selectedFile);
      handleRemoveFile();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Complete Self Pick-up Pre-Order
          </CardTitle>
          <CardDescription>
            Upload confirmation image after customer receives the pre-order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Pre-Order ID</p>
              <p className="font-medium">{preOrder.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                {preOrder.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">{preOrder.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{preOrder.phone_number}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium text-lg">
                {convertNumberToCurrency(String(preOrder.total_amount))}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Confirmation Required</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Please upload a photo of the customer receiving their pre-order or a proof of
                    pickup.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmationImage">Confirmation Image *</Label>
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="confirmationImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="confirmationImage" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                  </label>
                </div>
              ) : (
                <div className="relative border rounded-lg p-4">
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded"
                    />
                  )}
                  <p className="text-sm text-gray-600 mt-2 truncate">{selectedFile.name}</p>
                </div>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedFile}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              {isSubmitting ? "Processing..." : "Complete Pickup"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteSelfPickupPreOrder;
