import type { OrderData } from "@/libs/types/order";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, AlertCircle, Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { convertNumberToCurrency } from "@/libs/helper/helper";

interface ShipLimitedOrderProps {
  order: OrderData;
  onHandle: () => void;
}

const ShipLimitedOrder = ({ order, onHandle }: ShipLimitedOrderProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMarkInTransit = async () => {
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
            <Truck className="h-5 w-5" />
            Ship Limited Order
          </CardTitle>
          <CardDescription>
            Mark this limited order as shipped and in transit for self-delivery
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
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium text-purple-900">Limited Order - Self Delivery</p>
                  <p className="text-sm text-purple-700 mt-1">
                    This is a limited order that will be delivered by your own delivery service.
                    Mark as in transit when the package has been dispatched for delivery.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-900">Important Notice</p>
                  <p className="text-sm text-orange-700 mt-1">
                    After marking as in transit, you will need to upload delivery proof once the
                    order is delivered.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Delivery Instructions:</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
                <li>Verify package contents before dispatch</li>
                <li>Contact customer to confirm delivery time</li>
                <li>Take photos during delivery for proof</li>
                <li>Get customer signature or confirmation upon delivery</li>
              </ul>
            </div>

            <Button
              onClick={handleMarkInTransit}
              disabled={isSubmitting}
              className="w-full bg-orange-600 hover:bg-orange-700"
              size="lg"
            >
              <Truck className="h-5 w-5 mr-2" />
              {isSubmitting ? "Processing..." : "Mark as In Transit"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipLimitedOrder;
