import React from "react";
import type { OrderData } from "@/libs/types/order";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLocationDot as FaMapMarkerAlt,
  FaCalendar as FaCalendarAlt,
  FaBox,
  FaTruck,
  FaReceipt,
  FaCreditCard,
  FaImage,
} from "react-icons/fa6";

interface MobileOrderDetailProps {
  order: OrderData;
}

const MobileOrderDetail: React.FC<MobileOrderDetailProps> = ({ order }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      paid: "bg-green-100 text-green-800 border border-green-200",
      pending: "bg-blue-100 text-blue-800 border border-blue-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200",
      refunded: "bg-green-100 text-green-800 border border-green-200",
      received: "bg-green-100 text-green-800 border border-green-200",
      shipped: "bg-blue-100 text-blue-800 border border-blue-200",
      delivered: "bg-green-200 text-green-900 border border-green-300",
      confirmed: "bg-green-100 text-green-800 border border-green-200",
      in_transit: "bg-orange-100 text-orange-800 border border-orange-200",
      awaiting_pickup: "bg-indigo-100 text-indigo-800 border border-indigo-200",
      compensated: "bg-green-100 text-green-800 border border-green-200",
      refund_request: "bg-blue-100 text-blue-800 border border-blue-200",
      compensate_request: "bg-blue-100 text-blue-800 border border-blue-200",
    };
    return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const getPaymentMethodBadgeClass = (method: string) => {
    const methodMap: Record<string, string> = {
      VNPAY: "bg-blue-100 text-blue-800 border border-blue-200",
      MOMO: "bg-pink-100 text-pink-800 border border-pink-200",
      BANKING: "bg-green-100 text-green-800 border border-green-200",
      COD: "bg-orange-100 text-orange-800 border border-orange-200",
    };
    return methodMap[method] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  return (
    <div className="space-y-4">
      {/* Order Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="font-mono">#{order.id.slice(0, 8)}</span>
            <Badge className={getStatusBadgeClass(order.status)}>
              {order.status.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaCalendarAlt className="w-4 h-4" />
            <span>{formatDate(order.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={
                order.order_type === "STANDARD"
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : "bg-orange-100 text-orange-800 border border-orange-200"
              }
            >
              {order.order_type}
            </Badge>
            <Badge variant={order.is_self_picked_up ? "secondary" : "outline"}>
              {order.is_self_picked_up ? "Self Pickup" : "Delivery"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Customer Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FaUser className="w-4 h-4" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaUser className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{order.full_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="w-4 h-4 text-gray-400" />
              <span>{order.phone_number}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{order.email}</span>
            </div>
          </div>

          {!order.is_self_picked_up && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <div className="font-medium">Delivery Address</div>
                    <div className="text-gray-600">
                      {order.street}
                      {order.address_line2 && `, ${order.address_line2}`}
                    </div>
                    <div className="text-gray-600">
                      {order.ward_name}, {order.district_name}, {order.province_name}
                    </div>
                  </div>
                </div>
                {order.ghn_order_code && (
                  <div className="flex items-center gap-2">
                    <FaTruck className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-mono">GHN: {order.ghn_order_code}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {order.user_note && (
            <>
              <Separator />
              <div className="text-sm">
                <span className="font-medium">Note: </span>
                <span className="text-gray-600">{order.user_note}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FaCreditCard className="w-4 h-4" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Method</span>
            <Badge className={getPaymentMethodBadgeClass(order.payment_transaction.method)}>
              {order.payment_transaction.method}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Status</span>
            <Badge
              className={
                order.payment_transaction.status === "SUCCESS"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }
            >
              {order.payment_transaction.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Transaction ID</span>
            <span className="text-sm font-mono">{order.payment_transaction.gateway_ref}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Date</span>
            <span className="text-sm">
              {formatDate(order.payment_transaction.transaction_date)}
            </span>
          </div>

          {order.user_bank_account && (
            <>
              <Separator />
              <div className="space-y-1">
                <div className="text-sm font-medium">Bank Account</div>
                <div className="text-sm text-gray-600">
                  <div>{order.user_bank_account_holder}</div>
                  <div>
                    {order.user_bank_account} - {order.user_bank_name}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FaBox className="w-4 h-4" />
            Order Items ({order.order_items?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {order.order_items?.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {item.capacity} {item.capacity_unit} - {item.container_type}
                    </div>
                    <div className="text-xs text-gray-600">
                      {item.dispenser_type} • {item.uses}
                    </div>
                  </div>
                  <Badge className="text-xs" variant="secondary">
                    x{item.quantity}
                  </Badge>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <div>Unit Price: {formatCurrency(item.unit_price)}</div>
                  <div className="font-medium">Subtotal: {formatCurrency(item.subtotal)}</div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <AccordionTrigger className="text-xs py-2">View Details</AccordionTrigger>
                    <AccordionContent className="text-xs text-gray-600 space-y-1">
                      <div>Expiry Date: {new Date(item.expiry_date).toLocaleDateString()}</div>
                      {item.manufacturing_date && (
                        <div>
                          Manufacturing Date:{" "}
                          {new Date(item.manufacturing_date).toLocaleDateString()}
                        </div>
                      )}
                      <div>Instructions: {item.instructions}</div>
                      <div>
                        Dimensions: {item.length} × {item.width} × {item.height} cm
                      </div>
                      <div>Weight: {item.weight} kg</div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FaReceipt className="w-4 h-4" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency((order.total_amount || 0) - (order.shipping_fee || 0))}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Shipping Fee</span>
              <span>{formatCurrency(order.shipping_fee || 0)}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span className="text-green-600">{formatCurrency(order.total_amount || 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Image */}
      {order.confirmation_image && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FaImage className="w-4 h-4" />
              Confirmation Image
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-lg overflow-hidden">
              <img
                src={order.confirmation_image}
                alt="Order confirmation"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staff Resource */}
      {order.staff_resource && (
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-600">
              Handled by: <span className="font-medium">{order.staff_resource}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobileOrderDetail;
