import React, { useState } from "react";
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
  FaStore,
  FaTag,
} from "react-icons/fa6";

interface MobileOrderDetailProps {
  order: OrderData;
}

const MobileOrderDetail: React.FC<MobileOrderDetailProps> = ({ order }) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleImageError = (imageId: string) => {
    setImageErrors((prev) => new Set(prev).add(imageId));
  };

  const getPrimaryImage = (images: any[]) => {
    if (!images || images.length === 0) return null;
    return images.find((img) => img.is_primary) || images[0];
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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="font-mono text-sm">#{order.id.slice(0, 8)}...</span>
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
            <span className="text-sm font-mono text-right flex-1 ml-2 truncate">
              {order.payment_transaction.gateway_id || order.payment_transaction.gateway_ref}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Date</span>
            <span className="text-sm">
              {formatDate(order.payment_transaction.transaction_date)}
            </span>
          </div>

          {order.bank_account && (
            <>
              <Separator />
              <div className="space-y-1">
                <div className="text-sm font-medium">Bank Account</div>
                <div className="text-sm text-gray-600">
                  <div>{order.bank_account_holder}</div>
                  <div>
                    {order.bank_account} - {order.bank_name}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FaBox className="w-4 h-4" />
            Order Items ({order.order_items?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {order.order_items?.map((item, index) => {
              const primaryImage = getPrimaryImage(item.images);
              const imageKey = `item-${item.id || index}`;

              return (
                <div key={item.id || index} className="border rounded-lg overflow-hidden">
                  <div className="p-3 space-y-2">
                    <div className="flex gap-3">
                      {primaryImage && (
                        <div className="flex-shrink-0">
                          {!imageErrors.has(imageKey) ? (
                            <img
                              src={primaryImage.image_url}
                              alt={primaryImage.alt_text || item.product_name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                              onError={() => handleImageError(imageKey)}
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-lg border border-gray-200">
                              <FaBox className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">
                              {item.product_name}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {item.capacity} {item.capacity_unit} - {item.container_type}
                            </div>
                            {item.description && (
                              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {item.description}
                              </div>
                            )}
                          </div>
                          <Badge className="text-xs ml-2" variant="secondary">
                            x{item.quantity}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {item.brand && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <FaStore className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{item.brand.name}</span>
                      </div>
                    )}

                    {item.category && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <FaTag className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{item.category.name}</span>
                      </div>
                    )}

                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Unit Price: {formatCurrency(item.unit_price)}</div>
                      <div className="font-medium text-gray-900">
                        Subtotal: {formatCurrency(item.subtotal)}
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`item-${index}`} className="border-none">
                        <AccordionTrigger className="text-xs py-2">View Details</AccordionTrigger>
                        <AccordionContent className="text-xs text-gray-600 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>Expiry: {new Date(item.expiry_date).toLocaleDateString()}</div>
                            {item.manufacturing_date && (
                              <div>
                                Mfg: {new Date(item.manufacturing_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>

                          {item.dispenser_type && <div>Dispenser: {item.dispenser_type}</div>}

                          {item.uses && <div>Uses: {item.uses}</div>}

                          {item.instructions && <div>Instructions: {item.instructions}</div>}

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              Dimensions: {item.length}×{item.width}×{item.height}cm
                            </div>
                            <div>Weight: {item.weight}kg</div>
                          </div>

                          {item.attributes_description &&
                            item.attributes_description.length > 0 && (
                              <div className="mt-2">
                                <div className="font-medium mb-1">Ingredients:</div>
                                <div className="space-y-1">
                                  {item.attributes_description.map((attr, attrIndex) => (
                                    <div key={attrIndex} className="text-xs bg-gray-50 p-2 rounded">
                                      <div className="font-medium">
                                        {attr.ingredient} ({attr.value}
                                        {attr.unit})
                                      </div>
                                      <div className="text-gray-500">{attr.description}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

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

      {(order.confirmation_image || order.staff_resource) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FaImage className="w-4 h-4" />
              {order.confirmation_image ? "Confirmation Image" : "Staff Resource"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-2">
              {!imageErrors.has("confirmation") ? (
                <img
                  src={order.confirmation_image || order.staff_resource}
                  alt={order.confirmation_image ? "Order confirmation" : "Staff resource"}
                  className="w-full h-40 object-cover rounded-md"
                  onError={() => handleImageError("confirmation")}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-md">
                  <div className="text-center text-gray-500">
                    <FaImage className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Image not available</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobileOrderDetail;
