import React from "react";
import type { PreOrderData } from "@/libs/types/pre-order";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Package, User, MapPin, CreditCard } from "lucide-react";

interface PreOrderDetailProps {
  preOrder: PreOrderData;
}

const PreOrderDetail: React.FC<PreOrderDetailProps> = ({ preOrder }) => {
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
      pending: "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200",
      paid: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
      pre_ordered: "bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200",
      awaiting_release:
        "bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200",
      awaiting_pickup: "bg-indigo-100 text-indigo-800 border border-indigo-200 hover:bg-indigo-200",
      confirmed: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200",
      in_transit: "bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200",
      delivered: "bg-green-200 text-green-900 border border-green-300 hover:bg-green-300",
      received: "bg-teal-100 text-teal-800 border border-teal-200 hover:bg-teal-200",
      stock_ready: "bg-cyan-100 text-cyan-800 border border-cyan-200 hover:bg-cyan-200",
      stock_preparing: "bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200",
    };
    return (
      statusMap[status.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
    );
  };

  const getPaymentStatusBadge = (status: string) => {
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
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-mono mt-1">ID: {preOrder.id}</p>
        </div>
        <Badge className={getStatusBadgeClass(preOrder.status)}>
          {preOrder.status.toUpperCase()}
        </Badge>
      </div>

      <Separator />

      {/* Customer Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Full Name:</span>
              <p className="text-sm font-medium text-gray-900">{preOrder.full_name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email:</span>
              <p className="text-sm font-medium text-gray-900">{preOrder.email}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Phone Number:</span>
              <p className="text-sm font-medium text-gray-900">{preOrder.phone_number}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">User ID:</span>
              <p className="text-sm font-mono text-gray-900">{preOrder.user_id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-5 w-5" />
            Shipping Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-sm text-gray-500">Delivery Method:</span>
            <Badge
              className={`ml-2 ${preOrder.is_self_picked_up ? "bg-orange-100 text-orange-800 border border-orange-200" : "bg-blue-100 text-blue-800 border border-blue-200"}`}
            >
              {preOrder.is_self_picked_up ? "SELF PICKUP" : "DELIVERY"}
            </Badge>
          </div>
          {!preOrder.is_self_picked_up && (
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Street:</span>
                <p className="text-sm font-medium text-gray-900">{preOrder.street}</p>
              </div>
              {preOrder.address_line2 && (
                <div>
                  <span className="text-sm text-gray-500">Address Line 2:</span>
                  <p className="text-sm font-medium text-gray-900">{preOrder.address_line2}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Ward:</span>
                  <p className="text-sm font-medium text-gray-900">{preOrder.ward_name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">District:</span>
                  <p className="text-sm font-medium text-gray-900">{preOrder.district_name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Province:</span>
                  <p className="text-sm font-medium text-gray-900">{preOrder.province_name}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-5 w-5" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Variant ID:</span>
              <p className="text-sm font-mono text-gray-900">{preOrder.variant_id}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Quantity:</span>
              <p className="text-sm font-medium text-gray-900">{preOrder.quantity} units</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Unit Price:</span>
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(preOrder.unit_price)}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Total Amount:</span>
              <p className="text-sm font-semibold text-primary">
                {formatCurrency(preOrder.total_amount)}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Product Specifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Capacity:</span>
                <p className="text-sm font-medium text-gray-900">
                  {preOrder.capacity} {preOrder.capacity_unit}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Container Type:</span>
                <p className="text-sm font-medium text-gray-900">{preOrder.container_type}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Dispenser Type:</span>
                <p className="text-sm font-medium text-gray-900">{preOrder.dispenser_type}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Weight:</span>
                <p className="text-sm font-medium text-gray-900">{preOrder.weight} g</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Dimensions</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-500">Length:</span>
                <p className="text-sm font-medium text-gray-900">{preOrder.length} cm</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Width:</span>
                <p className="text-sm font-medium text-gray-900">{preOrder.width} cm</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Height:</span>
                <p className="text-sm font-medium text-gray-900">{preOrder.height} cm</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Weight:</span>
                <p className="text-sm font-medium text-gray-900">{preOrder.weight} g</p>
              </div>
            </div>
          </div>

          {preOrder.uses && (
            <>
              <Separator />
              <div>
                <span className="text-sm text-gray-500">Uses:</span>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">{preOrder.uses}</p>
              </div>
            </>
          )}

          {preOrder.instructions && (
            <>
              <Separator />
              <div>
                <span className="text-sm text-gray-500">Instructions:</span>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                  {preOrder.instructions}
                </p>
              </div>
            </>
          )}

          {preOrder.attributes_description && (
            <>
              <Separator />
              <div>
                <span className="text-sm text-gray-500">Additional Attributes:</span>
                <pre className="text-xs text-gray-700 mt-1 bg-gray-50 p-3 rounded-md overflow-auto">
                  {JSON.stringify(preOrder.attributes_description, null, 2)}
                </pre>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dates Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Manufacturing Date:</span>
              <p className="text-sm font-medium text-gray-900">
                {new Date(preOrder.manufacturing_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Expiry Date:</span>
              <p className="text-sm font-medium text-gray-900">
                {new Date(preOrder.expiry_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Created At:</span>
              <p className="text-sm font-medium text-gray-900">{formatDate(preOrder.created_at)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Updated At:</span>
              <p className="text-sm font-medium text-gray-900">{formatDate(preOrder.updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information Card */}
      {preOrder.PaymentTx && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Transaction ID:</span>
                <p className="text-sm font-mono text-gray-900">{preOrder.PaymentTx.id}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Amount:</span>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(Number(preOrder.PaymentTx.amount))}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Method:</span>
                <div className="mt-1">{getMethodBadge(preOrder.PaymentTx.method)}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status:</span>
                <div className="mt-1">{getPaymentStatusBadge(preOrder.PaymentTx.status)}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Transaction Date:</span>
                <p className="text-sm font-medium text-gray-900">
                  {preOrder.PaymentTx.transaction_date}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Updated Date:</span>
                <p className="text-sm font-medium text-gray-900">{preOrder.PaymentTx.updated_at}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Order Amount</p>
              <p className="text-3xl font-bold text-primary mt-1">
                {formatCurrency(preOrder.total_amount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Quantity</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{preOrder.quantity}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreOrderDetail;
