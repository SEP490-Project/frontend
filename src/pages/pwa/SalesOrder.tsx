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
  FaTruck,
  FaBox,
} from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { useSelector } from "react-redux";
import { getOrderForSaleStaffThunk } from "@/libs/stores/orderManager/thunk";
import type { OrderData, OrderRequestQuery } from "@/libs/types/order";
import MobileOrderDetail from "@/components/pwa/MobileOrderDetail";
import MobileChangeStatusModal from "@/components/pwa/MobileChangeStatusModal";
import PaginationTable from "@/components/global/PaginationTable";
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
    limit: 10,
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
      paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      pending: "bg-sky-50 text-sky-700 border border-sky-200",
      cancelled: "bg-rose-50 text-rose-700 border border-rose-200",
      refunded: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      received: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      shipped: "bg-sky-50 text-sky-700 border border-sky-200",
      delivered: "bg-emerald-100 text-emerald-800 border border-emerald-300",
      confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      in_transit: "bg-amber-50 text-amber-700 border border-amber-200",
      awaiting_pickup: "bg-indigo-50 text-indigo-700 border border-indigo-200",
      compensated: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      refund_request: "bg-amber-50 text-amber-800 border border-amber-300 animate-pulse",
      compensate_request: "bg-rose-50 text-rose-800 border border-rose-300 animate-pulse",
    };
    return statusMap[status.toLowerCase()] || "bg-slate-50 text-slate-700 border border-slate-200";
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
    setParams((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleStatusChange = (value: string) => {
    setParams((prev) => ({ ...prev, status: value === " " ? "" : value, page: 1 }));
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

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const canChangeStatus = (order: OrderData) => {
    const status = order.status.toUpperCase();

    if (["CANCELLED", "REFUNDED", "RECEIVED", "COMPENSATED", "DELIVERED"].includes(status)) {
      return false;
    }

    if (["SHIPPED", "IN_TRANSIT"].includes(status) && order.order_type === "STANDARD") {
      return order.is_self_picked_up;
    }

    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 pb-24">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="px-4 pt-3 pb-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Sales Orders</h1>
              <p className="text-xs text-slate-500">
                Manage and track customer orders in real time
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-9 w-9 rounded-full border-slate-200"
            >
              <FaRefresh
                className={`w-4 h-4 ${
                  refreshing ? "animate-spin text-slate-500" : "text-slate-600"
                }`}
              />
            </Button>
          </div>

          <div className="space-y-2 pb-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by name, phone, email, order ID..."
                value={params.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 pr-3 h-10 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-slate-200"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                  <FaFilter className="w-3 h-3" />
                  Status
                </span>
                <Select value={params.status || " "} onValueChange={handleStatusChange}>
                  <SelectTrigger className="h-9 flex-1 rounded-xl border-slate-200 bg-white text-xs">
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
                    <SelectItem value="AWAITING_PICKUP">Awaiting Pickup</SelectItem>
                    <SelectItem value="RECEIVED">Received</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                    <SelectItem value="COMPENSATED">Compensated</SelectItem>
                    <SelectItem value="REFUND_REQUEST">Refund Request</SelectItem>
                    <SelectItem value="COMPENSATE_REQUEST">Compensate Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {pagination && (
                <div className="text-[11px] text-right text-slate-500 min-w-[80px]">
                  <div>Showing</div>
                  <div className="font-medium text-slate-700">
                    {orders.length}/{pagination.total}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 space-y-3">
        {isLoading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14">
            <Loader2 className="mx-auto mb-4 h-10 w-10 text-primary" />
            <p className="text-sm font-medium text-slate-700">Loading orders...</p>
            <p className="text-xs text-slate-500 mt-1">
              Please wait while we fetch the latest orders.
            </p>
          </div>
        ) : error ? (
          <Card className="border-rose-200 bg-rose-50/60">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-rose-700">
                {error?.message || "Failed to load orders"}
              </p>
              <p className="text-xs text-rose-500 mt-1">
                Please check your connection and try again.
              </p>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="mt-3 h-9 text-xs rounded-xl border-rose-200"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="border-dashed border-slate-200 bg-white/80">
            <CardContent className="p-8 text-center text-slate-500">
              <FaBox className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="text-base font-medium mb-1 text-slate-700">No orders found</p>
              <p className="text-xs">Try adjusting your search keyword or status filter.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {orders.map((order) => (
              <Card
                key={order.id}
                className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white/90 shadow-sm"
              >
                <CardContent className="p-4">
                  {(order.status === "REFUND_REQUEST" || order.status === "COMPENSATE_REQUEST") && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-400" />
                  )}

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-slate-700">
                          #{order.id.slice(0, 8)}
                        </span>
                        <Badge
                          className={
                            getStatusBadgeClass(order.status) +
                            " text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-semibold"
                          }
                        >
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant={order.order_type === "STANDARD" ? "secondary" : "outline"}
                          className="text-[10px] px-2 py-0.5 rounded-full"
                        >
                          {order.order_type}
                        </Badge>
                        <Badge
                          variant={order.is_self_picked_up ? "outline" : "secondary"}
                          className="text-[10px] px-2 py-0.5 rounded-full"
                        >
                          {order.is_self_picked_up ? "Pickup at store" : "Delivery"}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] text-slate-500">Total</p>
                      <p className="text-sm font-semibold text-emerald-600">
                        {formatCurrency(order.total_amount)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50/80 px-3 py-2.5 mb-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <FaUser className="w-3 h-3 text-slate-400" />
                      <span className="font-medium text-slate-800">{order.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <FaPhone className="w-3 h-3" />
                      <span>{order.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <FaEnvelope className="w-3 h-3" />
                      <span className="truncate">{order.email}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5">
                        <FaCalendarAlt className="w-3 h-3" />
                        <span>Created</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {formatDate(order.created_at)}
                      </span>
                    </div>

                    {!order.is_self_picked_up && order.shipping_fee && (
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5">
                          <FaTruck className="w-3 h-3" />
                          <span>Shipping fee</span>
                        </div>
                        <span className="font-medium text-slate-700">
                          {formatCurrency(order.shipping_fee)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 rounded-xl border-slate-200 text-xs"
                      onClick={() => handleViewOrder(order)}
                    >
                      <FaEye className="w-3 h-3 mr-2" />
                      View details
                    </Button>

                    {canChangeStatus(order) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 rounded-xl border-slate-200 text-xs"
                        onClick={() => handleChangeStatus(order)}
                      >
                        <FaPen className="w-3 h-3 mr-2" />
                        Update status
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {pagination && pagination.total > 0 && (
              <div className="mt-4">
                <PaginationTable
                  page={pagination.page}
                  totalItems={pagination.total}
                  pageSize={params.limit || 20}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-base">
              Order #{selectedOrder?.id.slice(0, 8)}
              {selectedOrder && (
                <Badge
                  className={
                    getStatusBadgeClass(selectedOrder.status) +
                    " text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full"
                  }
                >
                  {selectedOrder.status.toUpperCase()}
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">{selectedOrder && <MobileOrderDetail order={selectedOrder} />}</div>
        </SheetContent>
      </Sheet>

      <Dialog open={isChangeStatusOpen} onOpenChange={setIsChangeStatusOpen}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Update Order Status</DialogTitle>
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
    </div>
  );
};

export default SalesOrder;
