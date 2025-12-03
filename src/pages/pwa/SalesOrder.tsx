import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  FaMagnifyingGlass as FaSearch,
  FaFilter,
  FaEye,
  FaPen,
  FaArrowsRotate as FaRefresh,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendar as FaCalendarAlt,
  FaDollarSign as FaMoneyBill,
  FaTruck,
  FaBox,
} from "react-icons/fa6";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { useSelector } from "react-redux";
import { getOrderForSaleStaffThunk } from "@/libs/stores/orderManager/thunk";
import type { OrderData, OrderRequestQuery } from "@/libs/types/order";
import MobileOrderDetail from "@/components/pwa/MobileOrderDetail";
import MobileChangeStatusModal from "@/components/pwa/MobileChangeStatusModal";
import PWANavigation from "@/components/pwa/PWANavigation";
import { toast } from "sonner";

const SalesOrder: React.FC = () => {
  const dispatch = useAppDispatch();
  const orderResponse = useSelector((state: RootState) => state?.manageOrder?.ordersForSaleStaff);
  const pagination = orderResponse?.pagination;
  const orders: OrderData[] = orderResponse?.data || [];
  const isLoading = useSelector((state: RootState) => state?.manageOrder?.loading);
  const error = useSelector((state: RootState) => state?.manageOrder?.errors);

  const [params, setParams] = useState<OrderRequestQuery>({
    page: 1,
    limit: 20,
    search: "",
    status: "",
  });
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const queryParams: OrderRequestQuery = {
      page: params.page,
      limit: params.limit,
    };

    if (params.search && params.search.trim() !== "") {
      queryParams.search = params.search.trim();
    }

    if (params.status && params.status !== "") {
      queryParams.status = params.status;
    }

    dispatch(getOrderForSaleStaffThunk(queryParams));
  }, [dispatch, params]);

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
      refund_request: "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse",
      compensate_request: "bg-red-100 text-red-800 border border-red-300 animate-pulse",
    };
    return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const handleViewOrder = (order: OrderData) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleChangeStatus = (order: OrderData) => {
    setSelectedOrder(order);
    setIsChangeStatusOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setParams({ ...params, search: value, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    setParams({ ...params, status: value, page: 1 });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(getOrderForSaleStaffThunk(params));
      toast.success("Orders refreshed!");
    } catch {
      toast.error("Failed to refresh orders");
    } finally {
      setRefreshing(false);
    }
  };

  const loadMore = () => {
    if (pagination && pagination.has_next && !isLoading) {
      setParams((prev) => ({ ...prev, page: prev.page! + 1 }));
    }
  };

  const canChangeStatus = (order: OrderData) => {
    return !["CANCELLED", "REFUNDED", "RECEIVED", "COMPENSATED"].includes(
      order.status.toUpperCase(),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2"
            >
              <FaRefresh className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search orders..."
              value={params.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400 w-4 h-4" />
            <Select
              value={params.status || " "}
              onValueChange={(value) => handleStatusChange(value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="RECEIVED">Received</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
                <SelectItem value="REFUND_REQUEST">🔔 Refund Request</SelectItem>
                <SelectItem value="COMPENSATE_REQUEST">🔔 Compensate Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3">
        {isLoading && orders.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-gray-500">Loading orders...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 text-center text-red-600">
              <p>Error: {error?.message || "Failed to load orders"}</p>
              <Button variant="outline" onClick={handleRefresh} className="mt-3">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <FaBox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium mb-2">No orders found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="border hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {/* Order Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-medium">#{order.id.slice(0, 8)}</span>
                      <Badge className={getStatusBadgeClass(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={order.order_type === "STANDARD" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {order.order_type}
                      </Badge>
                      <Badge
                        variant={order.is_self_picked_up ? "outline" : "secondary"}
                        className="text-xs"
                      >
                        {order.is_self_picked_up ? "Pickup" : "Delivery"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FaUser className="w-3 h-3 text-gray-400" />
                    <span className="font-medium">{order.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaPhone className="w-3 h-3" />
                    <span>{order.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaEnvelope className="w-3 h-3" />
                    <span className="truncate">{order.email}</span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMoneyBill className="w-3 h-3" />
                      <span>Total</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendarAlt className="w-3 h-3" />
                      <span>Created</span>
                    </div>
                    <span className="text-gray-600">{formatDate(order.created_at)}</span>
                  </div>

                  {!order.is_self_picked_up && order.shipping_fee && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaTruck className="w-3 h-3" />
                        <span>Shipping</span>
                      </div>
                      <span className="text-gray-600">{formatCurrency(order.shipping_fee)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewOrder(order)}
                  >
                    <FaEye className="w-3 h-3 mr-2" />
                    View
                  </Button>

                  {canChangeStatus(order) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleChangeStatus(order)}
                    >
                      <FaPen className="w-3 h-3 mr-2" />
                      Update Status
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* Load More */}
        {pagination && pagination.has_next && (
          <div className="text-center py-4">
            <Button variant="outline" onClick={loadMore} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                `Load More (${pagination.page} of ${pagination.total_pages})`
              )}
            </Button>
          </div>
        )}

        {/* Pagination Info */}
        {pagination && (
          <div className="text-center text-sm text-gray-500 py-2">
            Showing {orders.length} of {pagination.total} orders
          </div>
        )}
      </div>

      {/* Order Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              Order #{selectedOrder?.id.slice(0, 8)}
              {selectedOrder && (
                <Badge className={getStatusBadgeClass(selectedOrder.status)}>
                  {selectedOrder.status.toUpperCase()}
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">{selectedOrder && <MobileOrderDetail order={selectedOrder} />}</div>
        </SheetContent>
      </Sheet>

      {/* Change Status Dialog */}
      <Dialog open={isChangeStatusOpen} onOpenChange={setIsChangeStatusOpen}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <MobileChangeStatusModal
              order={selectedOrder}
              onSuccess={() => {
                setIsChangeStatusOpen(false);
                handleRefresh();
              }}
              onCancel={() => setIsChangeStatusOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* PWA Navigation */}
      <PWANavigation className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
};

export default SalesOrder;
