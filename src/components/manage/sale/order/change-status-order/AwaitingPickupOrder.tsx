import type { OrderData } from "@/libs/types/order";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, CheckCircle2, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { convertNumberToCurrency } from "@/libs/helper/helper";

interface AwaitingPickupOrderProps {
  order: OrderData;
  onHandle: () => void;
}

const AwaitingPickupOrder = ({ order, onHandle }: AwaitingPickupOrderProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMarkReady = async () => {
    setIsSubmitting(true);
    try {
      await onHandle();
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
            Mark Order Ready for Pickup
          </CardTitle>
          <CardDescription>
            Prepare the order and mark it as ready for customer pickup
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
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {order.status}
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
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium text-lg">
                {convertNumberToCurrency(String(order.total_amount))}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Self Pick-up Order</p>
                  <p className="text-sm text-blue-700 mt-1">
                    This order is set for self pick-up. Please prepare all items and notify the
                    customer that their order is ready for collection.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> After marking as ready, the customer will be notified to pick
                up their order.
              </p>
            </div>

            <Button
              onClick={handleMarkReady}
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              {isSubmitting ? "Processing..." : "Mark as Ready for Pickup"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AwaitingPickupOrder;
