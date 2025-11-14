import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/libs/stores";
import {
  getOrderForSaleStaffThunk,
  markSelfDeliveryOrderAsInTransitThunk,
  markSelfDeliveryOrderAsDeliveredThunk,
} from "@/libs/stores/orderManager/thunk";
import type { OrderData } from "@/libs/types/order";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaCheckCircle, FaTruck, FaBoxOpen } from "react-icons/fa";
import { toast } from "sonner";

interface SelfDeliveryChangeStatusModalProps {
  order: OrderData;
  onSuccess?: () => void;
}

export const SelfDeliveryChangeStatusModal = ({
  order,
  onSuccess,
}: SelfDeliveryChangeStatusModalProps) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleMarkInTransit = async () => {
    setIsLoading(true);
    try {
      await dispatch(markSelfDeliveryOrderAsInTransitThunk(order.id)).unwrap();
      toast.success("Order marked as in transit!", {
        description: "The order is now on its way to the customer.",
      });
      dispatch(getOrderForSaleStaffThunk({ page: 1, limit: 10 }));
      onSuccess?.();
    } catch (error: any) {
      toast.error("Failed to mark order as in transit", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkDelivered = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Photo required", {
        description: "Please upload a photo of the customer receiving the order.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      await dispatch(
        markSelfDeliveryOrderAsDeliveredThunk({
          orderId: order.id,
          files: formData,
        }),
      ).unwrap();

      toast.success("Order marked as delivered!", {
        description: "Customer has successfully received their order.",
      });
      dispatch(getOrderForSaleStaffThunk({ page: 1, limit: 10 }));
      onSuccess?.();
    } catch (error: any) {
      toast.error("Failed to mark order as delivered", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };

  const isConfirmed = order.status === "CONFIRMED";
  const isInTransit = order.status === "IN_TRANSIT";
  const isDelivered = order.status === "DELIVERED";

  return (
    <div className="space-y-6">
      {/* Order Status Info */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FaTruck className="text-orange-600 text-xl mt-1" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-1">
                Limited Product - Self Delivery
              </h3>
              <p className="text-sm text-orange-700">
                Customer: <span className="font-medium">{order.full_name}</span>
              </p>
              <p className="text-sm text-orange-700">
                Phone: <span className="font-medium">{order.phone_number}</span>
              </p>
              <p className="text-sm text-orange-700">
                Address:{" "}
                <span className="font-medium">
                  {order.street}, {order.ward_name}, {order.district_name}, {order.province_name}
                </span>
              </p>
              <p className="text-sm text-orange-700 mt-2">
                Current Status: <span className="font-bold uppercase">{order.status}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Mark as In Transit */}
      {isConfirmed && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaTruck className="text-blue-600 text-xl" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">Step 1: Start Delivery</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Mark this order as in transit when you start delivering it to the customer. The
                  customer will be notified that their order is on the way.
                </p>
                <Button
                  onClick={handleMarkInTransit}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FaTruck className="mr-2" />
                  {isLoading ? "Processing..." : "Mark as In Transit"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Mark as Delivered (with photo) */}
      {isInTransit && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FaBoxOpen className="text-green-600 text-xl" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">Step 2: Confirm Delivery</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Take a photo of the customer receiving their order as proof of delivery. This will
                  mark the order as delivered.
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="delivery-photo" className="text-sm font-medium">
                      Upload Delivery Photo *
                    </Label>
                    <input
                      id="delivery-photo"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoading}
                    />
                    {selectedFiles.length > 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        <FaCheckCircle className="inline mr-1" />
                        {selectedFiles.length} file(s) selected
                      </p>
                    )}
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={handleMarkDelivered}
                    disabled={isLoading || selectedFiles.length === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <FaCheckCircle className="mr-2" />
                    {isLoading ? "Processing..." : "Confirm Delivery Complete"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Status Display */}
      {isDelivered && (
        <Card>
          <CardContent className="p-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700">
                <FaCheckCircle className="text-xl" />
                <div>
                  <p className="font-semibold">Order Delivered</p>
                  <p className="text-sm">Customer has received their order</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Delivery Instructions:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>1. Click "Mark as In Transit" when you start the delivery</li>
            <li>
              2. Navigate to customer address: {order.street}, {order.ward_name}
            </li>
            <li>3. Contact customer at: {order.phone_number}</li>
            <li>4. Take a photo during handover as proof of delivery</li>
            <li>5. Upload photo and confirm delivery to complete order</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
