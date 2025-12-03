import React from "react";
import type { PreOrderData } from "@/libs/types/pre-order";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLocationDot as FaMapMarkerAlt,
  FaCalendar as FaCalendarAlt,
  FaBox,
  FaReceipt,
  FaCreditCard,
  FaImage,
  FaNoteSticky as FaStickyNote,
} from "react-icons/fa6";

interface MobilePreOrderDetailProps {
  preOrder: PreOrderData;
}

const MobilePreOrderDetail: React.FC<MobilePreOrderDetailProps> = ({ preOrder }) => {
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
      pending: "bg-blue-100 text-blue-800 border border-blue-200",
      paid: "bg-green-100 text-green-800 border border-green-200",
      pre_ordered: "bg-purple-100 text-purple-800 border border-purple-200",
      awaiting_pickup: "bg-blue-100 text-blue-800 border border-blue-200",
      confirmed: "bg-green-100 text-green-800 border border-green-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200",
      in_transit: "bg-orange-100 text-orange-800 border border-orange-200",
      delivered: "bg-green-200 text-green-900 border border-green-300",
      received: "bg-green-100 text-green-800 border border-green-200",
      refund_request: "bg-amber-100 text-amber-800 border border-amber-200",
      compensate_request: "bg-blue-100 text-blue-800 border border-blue-200",
      compensated: "bg-green-100 text-green-800 border border-green-200",
      refunded: "bg-green-100 text-green-800 border border-green-200",
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
            <span className="font-mono">#{preOrder.id.slice(0, 8)}</span>
            <Badge className={getStatusBadgeClass(preOrder.status)}>
              {preOrder.status.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaCalendarAlt className="w-4 h-4" />
            <span>{formatDate(preOrder.created_at)}</span>
          </div>
          <Badge variant={preOrder.is_self_picked_up ? "secondary" : "outline"}>
            {preOrder.is_self_picked_up ? "Self Pickup" : "Delivery"}
          </Badge>
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
              <span className="font-medium">{preOrder.full_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="w-4 h-4 text-gray-400" />
              <span>{preOrder.phone_number}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{preOrder.email}</span>
            </div>
          </div>

          {!preOrder.is_self_picked_up && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <div className="font-medium">Delivery Address</div>
                    <div className="text-gray-600">
                      {preOrder.street}
                      {preOrder.address_line2 && `, ${preOrder.address_line2}`}
                    </div>
                    <div className="text-gray-600">
                      {preOrder.ward_name}, {preOrder.district_name}, {preOrder.province_name}
                    </div>
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
            <FaCreditCard className="w-4 h-4" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Method</span>
            <Badge className={getPaymentMethodBadgeClass(preOrder.PaymentTx.method)}>
              {preOrder.PaymentTx.method}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Status</span>
            <Badge
              className={
                preOrder.PaymentTx.status === "SUCCESS"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }
            >
              {preOrder.PaymentTx.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Transaction ID</span>
            <span className="text-sm font-mono">{preOrder.PaymentTx.gateway_ref}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Date</span>
            <span className="text-sm">{formatDate(preOrder.PaymentTx.transaction_date)}</span>
          </div>

          {preOrder.user_bank_account && (
            <>
              <Separator />
              <div className="space-y-1">
                <div className="text-sm font-medium">Bank Account</div>
                <div className="text-sm text-gray-600">
                  <div>{preOrder.user_bank_account_holder}</div>
                  <div>
                    {preOrder.user_bank_account} - {preOrder.user_bank_name}
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
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="border rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {preOrder.capacity} {preOrder.capacity_unit} - {preOrder.container_type}
                </div>
                <div className="text-xs text-gray-600">
                  {preOrder.dispenser_type} • {preOrder.uses}
                </div>
              </div>
              <Badge className="text-xs" variant="secondary">
                x{preOrder.quantity}
              </Badge>
            </div>

            <div className="text-xs text-gray-600 space-y-1">
              <div>Unit Price: {formatCurrency(preOrder.unit_price)}</div>
              <div className="font-medium">Total: {formatCurrency(preOrder.total_amount)}</div>
            </div>

            <div className="text-xs text-gray-600 space-y-1 mt-3 pt-3 border-t">
              <div>Expiry Date: {new Date(preOrder.expiry_date).toLocaleDateString()}</div>
              {preOrder.manufacturing_date && (
                <div>
                  Manufacturing Date: {new Date(preOrder.manufacturing_date).toLocaleDateString()}
                </div>
              )}
              <div>Instructions: {preOrder.instructions}</div>
              <div>
                Dimensions: {preOrder.length} × {preOrder.width} × {preOrder.height} cm
              </div>
              <div>Weight: {preOrder.weight} kg</div>
            </div>
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
              <span>Subtotal ({preOrder.quantity} items)</span>
              <span>{formatCurrency(preOrder.unit_price * preOrder.quantity)}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span className="text-green-600">{formatCurrency(preOrder.total_amount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {preOrder.action_notes && preOrder.action_notes.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FaStickyNote className="w-4 h-4" />
              Action History ({preOrder.action_notes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {preOrder.action_notes.map((note, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{note.user_name}</div>
                      <div className="text-xs text-gray-600">{note.user_email}</div>
                    </div>
                    <Badge
                      variant={note.action_type === "APPROVED" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {note.action_type}
                    </Badge>
                  </div>

                  {note.reason && (
                    <div className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                      {note.reason}
                    </div>
                  )}

                  <div className="text-xs text-gray-500">{formatDate(note.created_at)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {preOrder.confirmation_image && (
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
                src={preOrder.confirmation_image}
                alt="Pre-order confirmation"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobilePreOrderDetail;
