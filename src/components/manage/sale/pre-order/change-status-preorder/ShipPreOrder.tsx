import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, CheckCircle2, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/libs/utils";
import type { PreOrderData } from "@/libs/types/pre-order";

interface ShipPreOrderProps {
  preOrder: PreOrderData;
}

const ShipPreOrder = ({ preOrder }: ShipPreOrderProps) => {
  const currentStatus = preOrder.status;

  const shippingSteps = [
    {
      status: "SHIPPED" as const,
      label: "Picked Up",
      icon: Package,
      description: "Package has been picked up by GHN",
    },
    {
      status: "IN_TRANSIT" as const,
      label: "In Transit",
      icon: Truck,
      description: "Package is being transported to destination",
    },
    {
      status: "DELIVERED" as const,
      label: "Delivered",
      icon: CheckCircle2,
      description: "Package delivered to destination",
    },
  ];

  const getStepStatus = (stepStatus: (typeof shippingSteps)[number]["status"]) => {
    if (currentStatus === "CANCEL") return "cancelled";

    const currentIndex = shippingSteps.findIndex((s) => s.status === currentStatus);
    const stepIndex = shippingSteps.findIndex((s) => s.status === stepStatus);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "current":
        return "text-blue-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-400";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 border-green-500";
      case "current":
        return "bg-blue-100 border-blue-500";
      case "cancelled":
        return "bg-red-100 border-red-500";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            GHN Shipping Status
          </CardTitle>
          <CardDescription>
            Track the delivery progress managed by GHN (Third-party shipping)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{preOrder.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">GHN Order Code</p>
              <p className="font-medium">{preOrder?.ghn_order_code || "N/A"}</p>
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
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="font-medium">
                {preOrder.street}, {preOrder.ward_name}, {preOrder.district_name},{" "}
                {preOrder.province_name}
              </p>
            </div>
          </div>

          <Separator />

          {currentStatus === "CANCEL" ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 text-lg">Delivery Cancelled</h3>
                  <p className="text-sm text-red-700 mt-1">
                    This shipment has been cancelled by GHN or the customer.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Third-Party Shipping Service</p>
                    <p className="text-sm text-blue-700 mt-1">
                      This order is being handled by GHN (Giao Hàng Nhanh). Staff cannot directly
                      modify the shipping status. Please monitor the progress below.
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Progress Steps */}
              <div className="relative">
                {shippingSteps.map((step, index) => {
                  const status = getStepStatus(step.status);
                  const Icon = step.icon;
                  const isLast = index === shippingSteps.length - 1;

                  return (
                    <div key={step.status} className="relative">
                      {/* Connection Line */}
                      {!isLast && (
                        <div
                          className={cn(
                            "absolute left-6 top-12 w-0.5 h-16 -ml-px",
                            status === "completed" ? "bg-green-500" : "bg-gray-300",
                          )}
                        />
                      )}

                      {/* Step Content */}
                      <div className="flex items-start gap-4 pb-8">
                        {/* Icon Circle */}
                        <div
                          className={cn(
                            "flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all",
                            getStatusBgColor(status),
                          )}
                        >
                          <Icon className={cn("h-6 w-6", getStatusColor(status))} />
                        </div>

                        {/* Step Details */}
                        <div className="flex-1 pt-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={cn(
                                "font-semibold text-base",
                                status === "current" ? "text-blue-900" : "text-gray-900",
                              )}
                            >
                              {step.label}
                            </h3>
                            {status === "completed" && (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                Completed
                              </Badge>
                            )}
                            {status === "current" && (
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200"
                              >
                                In Progress
                              </Badge>
                            )}
                          </div>
                          <p
                            className={cn(
                              "text-sm",
                              status === "pending" ? "text-gray-500" : "text-gray-700",
                            )}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipPreOrder;
