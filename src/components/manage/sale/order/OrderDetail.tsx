import React from "react";
import type { OrderData } from "@/libs/types/order";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface OrderDetailProps {
  order: OrderData;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      paid: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
      pending: "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200",
      refunded: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
      received: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
      shipped: "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200",
      delivered: "bg-green-200 text-green-900 border border-green-300 hover:bg-green-300",
      confirmed: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
      in_transit: "bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200",
      awaiting_pickup: "bg-indigo-100 text-indigo-800 border border-indigo-200 hover:bg-indigo-200",
      compensated: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
      refund_request: "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200",
      compensate_request: "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200",
    };
    return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      COMPLETED: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
      EXPIRED: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
    };

    return <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>;
  };

  const getMethodBadge = (method: string) => {
    const methodColors: Record<string, string> = {
      BANK_TRANSFER: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
      CREDIT_CARD: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
      E_WALLET: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
      PAYOS: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200",
    };

    return (
      <Badge className={methodColors[method] || "bg-gray-100 text-gray-800"}>
        {method?.replace(/_/g, " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Order Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-r-1 pr-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">Order ID:</span>
              <span className="ml-2 font-mono text-sm font-medium">#{order.id}</span>
            </div>
            {order.ghn_order_code && (
              <div>
                <span className="text-sm text-gray-500">Order Code:</span>
                <span className="ml-2 text-sm">{order.ghn_order_code}</span>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-500">Order Type:</span>
              <Badge
                className={
                  order.order_type === "STANDARD"
                    ? "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 ml-2"
                    : "bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200 ml-2"
                }
              >
                {order.order_type.toUpperCase()}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-gray-500">Status:</span>
              <Badge className={`ml-2 ${getStatusBadgeClass(order.status)}`}>
                {order.status.toUpperCase()}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-gray-500">Created:</span>
              <span className="ml-2 text-sm">{formatDate(order.created_at)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">Name:</span>
              <span className="ml-2 text-sm font-medium">{order.full_name}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email:</span>
              <span className="ml-2 text-sm">{order.email}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Phone:</span>
              <span className="ml-2 text-sm">{order.phone_number}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Shipping Address Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Information</h3>
        <div className="space-y-2">
          <div>
            <span className="text-sm text-gray-500">Delivery Method:</span>
            <Badge
              className={`ml-2 ${order.is_self_picked_up ? "bg-orange-100 text-orange-800 border border-orange-200" : "bg-blue-100 text-blue-800 border border-blue-200"}`}
            >
              {order.is_self_picked_up ? "AT PLACE" : "SHIPPING TO ADDRESS"}
            </Badge>
          </div>
          {!order.is_self_picked_up && (
            <>
              <div>
                <span className="text-sm text-gray-500">Street:</span>
                <span className="ml-2 text-sm">{order.street}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Ward:</span>
                <span className="ml-2 text-sm">{order.ward_name}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">District:</span>
                <span className="ml-2 text-sm">{order.district_name}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Province:</span>
                <span className="ml-2 text-sm">{order.province_name}</span>
              </div>
            </>
          )}
          {order.user_note && (
            <div>
              <span className="text-sm text-gray-500">Customer Note:</span>
              <div className="mt-1 text-sm bg-yellow-50 border border-yellow-200 rounded-md p-2">
                {order.user_note}
              </div>
            </div>
          )}
          {order.status === "RECEIVED" && order.confirmation_image && (
            <div>
              <span className="text-sm text-gray-500">Proof:</span>
              <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-2">
                <img
                  src={order.confirmation_image}
                  alt="Customer pickup proof"
                  className="w-full max-w-md rounded-md"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Photo taken when customer picked up the order
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Order Items Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">
          Order Items ({order.order_items?.length || 0})
        </h3>
        {order.order_items && order.order_items.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {order.order_items.map((item, index) => (
              <AccordionItem
                key={item.id || index}
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg bg-white overflow-hidden"
              >
                <AccordionTrigger className="px-4 hover:bg-gray-50 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-base text-gray-900">
                        Item #{index + 1}
                      </span>
                      <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-base text-primary">
                        {formatCurrency(item.subtotal)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(item.unit_price)} each
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="pt-3 space-y-4">
                    {/* Variant ID */}
                    <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded inline-block">
                      Variant ID: {item.variant_id}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Product Details */}
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Product Details
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Capacity:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {item.capacity} {item.capacity_unit}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Container:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {item.container_type}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Dispenser:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {item.dispenser_type}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dimensions & Dates */}
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Dimensions & Dates
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Dimensions:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {item.length} × {item.width} × {item.height} cm
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Weight:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {item.weight} g
                            </span>
                          </div>
                          {item.manufacturing_date && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Mfg Date:</span>
                              <span className="text-sm font-medium text-gray-900">
                                {new Date(item.manufacturing_date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Expiry Date:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {new Date(item.expiry_date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Uses & Instructions */}
                    {(item.uses || item.instructions) && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          {item.uses && (
                            <div>
                              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                Uses
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">{item.uses}</p>
                            </div>
                          )}
                          {item.instructions && (
                            <div>
                              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                Instructions
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {item.instructions}
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Attributes */}
                    {item.attributes_description && item.attributes_description.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                            Attributes
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {item.attributes_description.map((attr, attrIndex) => (
                              <div
                                key={attrIndex}
                                className="bg-gray-50 rounded-md px-3 py-2 text-xs border border-gray-200"
                              >
                                <span className="text-gray-600">
                                  {attr.ingredient || "Attribute"}:
                                </span>{" "}
                                <span className="font-medium text-gray-900">
                                  {attr.value}
                                  {attr.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            No items in this order
          </div>
        )}
      </div>

      <Separator />

      {/* Payment Section */}
      {order.payment_transaction?.id && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Information </h3>

          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">Payment ID:</span>
              <span className="mx-2 text-sm font-mono">{order.payment_transaction.id}</span>
            </div>

            <div>
              <span className="text-sm text-gray-500">Payment Status:</span>
              <span className="ml-2 text-sm font-mono">
                {getStatusBadge(order.payment_transaction.status)}
              </span>
            </div>

            <div>
              <span className="text-sm text-gray-500">Payment Method:</span>
              <span className="ml-2 text-sm font-mono">
                {getMethodBadge(order.payment_transaction.method)}
              </span>
            </div>

            <div>
              <span className="text-sm text-gray-500">Transaction Date:</span>
              <span className="ml-2 text-sm font-mono">
                {order.payment_transaction.transaction_date}
              </span>
            </div>

            <div>
              <span className="text-sm text-gray-500">Updated Date:</span>
              <span className="ml-2 text-sm font-mono">{order.payment_transaction.updated_at}</span>
            </div>
          </div>
        </div>
      )}

      <Separator />

      {/* Order Summary Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
          Order Summary
        </h3>
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(
                order.order_items?.reduce((sum, item) => sum + item.subtotal, 0) || 0,
              )}
            </span>
          </div>

          {/* Shipping Fee */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping Fee:</span>
            <span className="font-medium text-gray-900">{formatCurrency(order.shipping_fee)}</span>
          </div>

          <Separator className="bg-gray-400" />

          {/* Total */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold text-gray-900">Total Amount:</span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(order.total_amount + order.shipping_fee)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
