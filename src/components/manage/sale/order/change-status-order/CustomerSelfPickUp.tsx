import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/libs/stores";
import {
  getOrderForSaleStaffThunk,
  markOrderIsReadyToPickedUpThunk,
  markOrderIsReceivedAfterPickedUpThunk,
} from "@/libs/stores/orderManager/thunk";
import type { OrderData } from "@/libs/types/order";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaCheckCircle, FaStore, FaCamera, FaClock } from "react-icons/fa";
import { toast } from "sonner";

interface SelfPickUpChangeStatusModalProps {
  order: OrderData;
  onSuccess?: () => void;
}

export const SelfPickUpChangeStatusModal = ({
  order,
  onSuccess,
}: SelfPickUpChangeStatusModalProps) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleMarkReadyToPickup = async () => {
    setIsLoading(true);
    try {
      await dispatch(markOrderIsReadyToPickedUpThunk(order.id)).unwrap();
      toast.success("Order marked as ready for pickup!", {
        description: "Customer will be notified to pick up their order.",
      });
      dispatch(getOrderForSaleStaffThunk({ page: 1, limit: 10 }));
      onSuccess?.();
    } catch (error: any) {
      toast.error("Failed to mark order as ready", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkReceived = async () => {
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
        markOrderIsReceivedAfterPickedUpThunk({
          orderId: order.id,
          files: formData,
        }),
      ).unwrap();

      toast.success("Order marked as received!", {
        description: "Customer has successfully picked up their order.",
      });
      dispatch(getOrderForSaleStaffThunk({ page: 1, limit: 10 }));
      onSuccess?.();
    } catch (error: any) {
      toast.error("Failed to mark order as received", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log(files);
    console.log(selectedFiles);
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };

  // Check if order is already marked as ready to pick up
  const isReadyForPickup = order.status === "CONFIRMED";
  const isReceived = order.status === "RECEIVED";

  return (
    <div className="space-y-6">
      {/* Order Status Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FaStore className="text-blue-600 text-xl mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Self Pickup Order</h3>
              <p className="text-sm text-blue-700">
                Customer: <span className="font-medium">{order.full_name}</span>
              </p>
              <p className="text-sm text-blue-700">
                Phone: <span className="font-medium">{order.phone_number}</span>
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Current Status: <span className="font-bold uppercase">{order.status}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Mark as Ready to Pick Up */}
      {isReadyForPickup && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FaClock className="text-green-600 text-xl" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">Step 1: Notify Customer</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Mark this order as ready for pickup. The customer will receive a notification that
                  their order is ready to be collected from the store.
                </p>
                <Button
                  onClick={handleMarkReadyToPickup}
                  disabled={isLoading || !isReadyForPickup}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FaCheckCircle className="mr-2" />
                  {isLoading ? "Processing..." : "Mark as Ready for Pickup"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Mark as Received (with photo) */}
      {!isReadyForPickup && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <FaCamera className="text-purple-600 text-xl" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Step 2: Confirm Customer Pickup
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Take a photo of the customer receiving their order as proof of handover. This will
                  mark the order as completed.
                </p>

                {isReceived ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <FaCheckCircle className="text-xl" />
                      <div>
                        <p className="font-semibold">Order Completed</p>
                        <p className="text-sm">Customer has received their order</p>
                      </div>
                    </div>
                    {order.confirmation_image && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium text-gray-700">Pickup Photo:</Label>
                        <img
                          src={order.confirmation_image}
                          alt="Customer pickup"
                          className="mt-2 ml-2 rounded-lg border max-w-md w-full"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pickup-photo" className="text-sm font-medium">
                        Upload Pickup Photo *
                      </Label>
                      <input
                        id="pickup-photo"
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
                      onClick={handleMarkReceived}
                      disabled={isLoading || selectedFiles.length === 0}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <FaCheckCircle className="mr-2" />
                      {isLoading ? "Processing..." : "Confirm Customer Received Order"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Instructions:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>1. Click "Mark as Ready for Pickup" when order is prepared</li>
            <li>2. Customer will receive notification to come to store</li>
            <li>3. When customer arrives, take a photo during handover</li>
            <li>4. Upload photo and confirm receipt to complete order</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
