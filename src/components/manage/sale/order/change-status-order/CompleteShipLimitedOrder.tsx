import type { OrderData } from "@/libs/types/order";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Upload, AlertCircle, X, Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { convertNumberToCurrency } from "@/libs/helper/helper";

interface CompleteShipLimitedOrderProps {
  order: OrderData;
  onHandle: (file: File) => void;
}

const CompleteShipLimitedOrder = ({ order, onHandle }: CompleteShipLimitedOrderProps) => {
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
      alert("Please upload a delivery proof image");
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
            <CheckCircle2 className="h-5 w-5" />
            Complete Limited Order Delivery
          </CardTitle>
          <CardDescription>
            Upload delivery proof after the limited order has been successfully delivered
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {order.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Type</p>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {order.order_type}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">{order.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{order.phone_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium text-lg">
                {convertNumberToCurrency(String(order.total_amount))}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="font-medium">
                {order.street}, {order.ward_name}, {order.district_name}, {order.province_name}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Delivery Confirmation Required</p>
                  <p className="text-sm text-green-700 mt-1">
                    Please upload a clear photo showing the delivery proof. This can include:
                  </p>
                  <ul className="list-disc list-inside text-sm text-green-700 mt-2 space-y-1">
                    <li>Photo of delivered package at customer location</li>
                    <li>Customer signature or confirmation</li>
                    <li>Receipt or delivery note</li>
                    <li>Photo with customer (if they agree)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  <strong>Important:</strong> Ensure the photo is clear and shows evidence of
                  successful delivery. This serves as proof for both the customer and the company.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryProof">Delivery Proof Image *</Label>
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="deliveryProof"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="deliveryProof" className="cursor-pointer">
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
                      className="w-full h-64 object-cover rounded"
                    />
                  )}
                  <p className="text-sm text-gray-600 mt-2 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
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
              {isSubmitting ? "Processing..." : "Confirm Delivery"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteShipLimitedOrder;
