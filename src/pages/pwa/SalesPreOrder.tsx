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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  FaBox,
  FaCheck,
  FaXmark as FaTimes,
  FaTriangleExclamation as FaExclamationTriangle,
} from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { useSelector } from "react-redux";
import {
  getPreOrdersForSaleStaffThunk,
  approvePreOrderThunk,
  receivedSelfPickupPreOrderThunk,
  deliveredSelfDeliveryPreOrderThunk,
} from "@/libs/stores/orderManager/thunk";
import type { PreOrderData } from "@/libs/types/pre-order";
import type { OrderRequestQuery } from "@/libs/types/order";
import MobilePreOrderDetail from "@/components/pwa/MobilePreOrderDetail";
import MobileFileUploader from "@/components/pwa/MobileFileUploader";
import PaginationTable from "@/components/global/PaginationTable";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SalesPreOrder: React.FC = () => {
  const dispatch = useAppDispatch();
  const preOrderResponse = useSelector(
    (state: RootState) => state?.manageOrder?.preOrderForSaleStaff,
  );
  const pagination = preOrderResponse?.pagination;
  const preOrders: PreOrderData[] = preOrderResponse?.data || [];
  const isLoading = useSelector((state: RootState) => state?.manageOrder?.loading);
  const error = useSelector((state: RootState) => state?.manageOrder?.errors);

  const [params, setParams] = useState<OrderRequestQuery>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });
  const [selectedPreOrder, setSelectedPreOrder] = useState<PreOrderData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [proofUrls, setProofUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    dispatch(getPreOrdersForSaleStaffThunk(queryParams));
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
      pending: "bg-sky-50 text-sky-700 border border-sky-200",
      paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      pre_ordered: "bg-violet-50 text-violet-700 border border-violet-200",
      awaiting_pickup: "bg-sky-50 text-sky-700 border border-sky-200",
      cancelled: "bg-rose-50 text-rose-700 border border-rose-200",
      in_transit: "bg-amber-50 text-amber-700 border border-amber-200",
      delivered: "bg-emerald-100 text-emerald-800 border border-emerald-300",
      received: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      refund_request: "bg-amber-50 text-amber-800 border border-amber-300 animate-pulse",
      compensate_request: "bg-rose-50 text-rose-800 border border-rose-300 animate-pulse",
      compensated: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      refunded: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    };
    return statusMap[status.toLowerCase()] || "bg-slate-50 text-slate-700 border border-slate-200";
  };

  const getNextStates = (currentStatus: string, iselfPickup: boolean): string[] => {
    const status = currentStatus.toUpperCase();

    if (iselfPickup) {
      switch (status) {
        case "PAID":
          return ["PRE_ORDERED"];
        case "PRE_ORDERED":
          return ["AWAITING_PICKUP"];
        case "AWAITING_PICKUP":
          return ["RECEIVED"];
        default:
          return [];
      }
    } else {
      switch (status) {
        case "PAID":
          return ["PRE_ORDERED"];
        case "PRE_ORDERED":
          return ["IN_TRANSIT"];
        case "IN_TRANSIT":
          return ["DELIVERED"];
        case "DELIVERED":
          return ["RECEIVED"];
        default:
          return [];
      }
    }
  };

  const handleViewPreOrder = (preOrder: PreOrderData) => {
    setSelectedPreOrder(preOrder);
    setIsDetailOpen(true);
  };

  const handleApprovePreOrder = (preOrder: PreOrderData) => {
    setSelectedPreOrder(preOrder);
    setIsApproveOpen(true);
  };

  const handleStatusUpdate = (preOrder: PreOrderData) => {
    setSelectedPreOrder(preOrder);
    setSelectedStatus("");
    setStatusNotes("");
    setProofFiles([]);
    setProofUrls([]);
    setIsStatusUpdateOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setParams((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleStatusChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      status: value === " " ? "" : value,
      page: 1,
    }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(getPreOrdersForSaleStaffThunk(params));
      toast.success("Pre-orders refreshed!");
    } catch {
      toast.error("Failed to refresh pre-orders");
    } finally {
      setRefreshing(false);
    }
  };

  const confirmApprove = async () => {
    if (!selectedPreOrder) return;

    setIsSubmitting(true);
    try {
      await dispatch(approvePreOrderThunk({ id: selectedPreOrder.id })).unwrap();
      toast.success("Pre-order approved successfully!");
      setIsApproveOpen(false);
      handleRefresh();
    } catch (error: any) {
      toast.error("Failed to approve pre-order", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdateSubmit = async () => {
    if (!selectedPreOrder || !selectedStatus) return;

    const isProofRequired = ["RECEIVED", "DELIVERED"].includes(selectedStatus);
    if (isProofRequired && proofUrls.length === 0) {
      toast.error("Proof image is required for this status");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("state", selectedStatus);

      if (statusNotes.trim()) {
        formData.append("notes", statusNotes.trim());
      }

      proofFiles.forEach((file) => {
        formData.append("file", file);
      });

      if (selectedStatus === "RECEIVED" && selectedPreOrder.is_self_picked_up) {
        await dispatch(
          receivedSelfPickupPreOrderThunk({ id: selectedPreOrder.id, file: formData }),
        ).unwrap();
      } else if (selectedStatus === "DELIVERED" && !selectedPreOrder.is_self_picked_up) {
        await dispatch(
          deliveredSelfDeliveryPreOrderThunk({ id: selectedPreOrder.id, file: formData }),
        ).unwrap();
      }

      toast.success("Pre-order status updated successfully!");
      setIsStatusUpdateOpen(false);
      handleRefresh();
    } catch (error: any) {
      toast.error("Failed to update pre-order status", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const canApprove = (preOrder: PreOrderData) => {
    return preOrder.status.toUpperCase() === "PAID";
  };

  const canUpdateStatus = (preOrder: PreOrderData) => {
    const status = preOrder.status.toUpperCase();
    return !["PENDING", "CANCELLED", "REFUNDED", "RECEIVED", "COMPENSATED"].includes(status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 pb-24">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="px-4 pt-3 pb-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Pre-Orders</h1>
              <p className="text-xs text-slate-500">
                Manage customer pre-orders and update their status
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
                placeholder="Search by customer, phone, email, pre-order ID..."
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
                    <SelectItem value="PRE_ORDERED">Pre-Ordered</SelectItem>
                    <SelectItem value="AWAITING_PICKUP">Awaiting Pickup</SelectItem>
                    <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
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
                    {preOrders.length}/{pagination.total}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 space-y-3">
        {isLoading && preOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14">
            <Loader2 className="mx-auto mb-4 h-10 w-10 text-primary" />
            <p className="text-sm font-medium text-slate-700">Loading pre-orders...</p>
            <p className="text-xs text-slate-500 mt-1">
              Please wait while we fetch the latest pre-orders.
            </p>
          </div>
        ) : error ? (
          <Card className="border-rose-200 bg-rose-50/60">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-rose-700">
                {error?.message || "Failed to load pre-orders"}
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
        ) : preOrders.length === 0 ? (
          <Card className="border-dashed border-slate-200 bg-white/80">
            <CardContent className="p-8 text-center text-slate-500">
              <FaBox className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="text-base font-medium mb-1 text-slate-700">No pre-orders found</p>
              <p className="text-xs">Try adjusting your search keyword or status filter.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {preOrders.map((preOrder) => (
              <Card
                key={preOrder.id}
                className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white/90 shadow-sm"
              >
                <CardContent className="p-4">
                  {(preOrder.status === "REFUND_REQUEST" ||
                    preOrder.status === "COMPENSATE_REQUEST") && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-400" />
                  )}

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-slate-700">
                          #{preOrder.id.slice(0, 8)}
                        </span>
                        <Badge
                          className={
                            getStatusBadgeClass(preOrder.status) +
                            " text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-semibold"
                          }
                        >
                          {preOrder.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant={preOrder.is_self_picked_up ? "outline" : "secondary"}
                          className="text-[10px] px-2 py-0.5 rounded-full"
                        >
                          {preOrder.is_self_picked_up ? "Pickup at store" : "Delivery"}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full">
                          {preOrder.capacity} {preOrder.capacity_unit} • {preOrder.container_type}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] text-slate-500">Total</p>
                      <p className="text-sm font-semibold text-emerald-600">
                        {formatCurrency(preOrder.total_amount)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50/80 px-3 py-2.5 mb-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <FaUser className="w-3 h-3 text-slate-400" />
                      <span className="font-medium text-slate-800">{preOrder.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <FaPhone className="w-3 h-3" />
                      <span>{preOrder.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <FaEnvelope className="w-3 h-3" />
                      <span className="truncate">{preOrder.email}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">
                        Qty: {preOrder.quantity} • {preOrder.dispenser_type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5">
                        <FaCalendarAlt className="w-3 h-3" />
                        <span>Created</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {formatDate(preOrder.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 rounded-xl border-slate-200 text-xs"
                      onClick={() => handleViewPreOrder(preOrder)}
                    >
                      <FaEye className="w-3 h-3 mr-2" />
                      View details
                    </Button>

                    {canApprove(preOrder) && (
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 h-9 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleApprovePreOrder(preOrder)}
                      >
                        <FaCheck className="w-3 h-3 mr-2" />
                        Approve
                      </Button>
                    )}

                    {canUpdateStatus(preOrder) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 rounded-xl border-slate-200 text-xs"
                        onClick={() => handleStatusUpdate(preOrder)}
                      >
                        <FaPen className="w-3 h-3 mr-2" />
                        Update
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
              Pre-Order #{selectedPreOrder?.id.slice(0, 8)}
              {selectedPreOrder && (
                <Badge
                  className={
                    getStatusBadgeClass(selectedPreOrder.status) +
                    " text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full"
                  }
                >
                  {selectedPreOrder.status.toUpperCase()}
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {selectedPreOrder && <MobilePreOrderDetail preOrder={selectedPreOrder} />}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="w-[95vw] max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <FaCheck className="w-5 h-5 text-emerald-600" />
              Approve Pre-Order
            </DialogTitle>
            <DialogDescription className="text-xs">
              Approving this pre-order will move it to{" "}
              <span className="font-semibold">PRE_ORDERED</span> status.
            </DialogDescription>
          </DialogHeader>

          {selectedPreOrder && (
            <div className="space-y-4">
              <Card className="border-slate-200">
                <CardContent className="p-3">
                  <div className="text-sm space-y-1 text-slate-700">
                    <div>
                      Pre-Order ID:{" "}
                      <span className="font-mono">#{selectedPreOrder.id.slice(0, 8)}</span>
                    </div>
                    <div>Customer: {selectedPreOrder.full_name}</div>
                    <div>
                      Product: {selectedPreOrder.capacity} {selectedPreOrder.capacity_unit} •{" "}
                      {selectedPreOrder.container_type}
                    </div>
                    <div>
                      Total:{" "}
                      <span className="font-semibold text-emerald-600">
                        {formatCurrency(selectedPreOrder.total_amount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-9 rounded-xl"
                  onClick={() => setIsApproveOpen(false)}
                  disabled={isSubmitting}
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700"
                  onClick={confirmApprove}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-4 h-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isStatusUpdateOpen} onOpenChange={setIsStatusUpdateOpen}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base">Update Pre-Order Status</DialogTitle>
            <DialogDescription className="text-xs">
              Change the status of this pre-order to the next available state.
            </DialogDescription>
          </DialogHeader>

          {selectedPreOrder && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Current Status:</span>
                    <Badge
                      className={
                        getStatusBadgeClass(selectedPreOrder.status) +
                        " text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full"
                      }
                    >
                      {selectedPreOrder.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label className="text-sm font-medium mb-2 block">Select New Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Choose next status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getNextStates(selectedPreOrder.status, selectedPreOrder.is_self_picked_up).map(
                      (status) => (
                        <SelectItem key={status} value={status}>
                          {status.replace("_", " ").toUpperCase()}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Notes (Optional)</Label>
                <Textarea
                  placeholder="Add notes about this status change..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="min-h-[60px] resize-none rounded-xl"
                />
              </div>

              {selectedStatus && ["RECEIVED", "DELIVERED"].includes(selectedStatus) && (
                <div>
                  <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <FaExclamationTriangle className="w-4 h-4 text-amber-500" />
                    Proof Required
                  </Label>
                  <MobileFileUploader
                    userId={selectedPreOrder.user_id}
                    accept="image/*,video/*"
                    multiple={true}
                    maxFiles={3}
                    maxSize={20}
                    allowedTypes={["jpg", "jpeg", "png", "webp"]}
                    title="Upload Proof"
                    onFilesChange={(files) => setProofFiles(files)}
                    onUploadComplete={(urls) => setProofUrls(urls)}
                  />
                </div>
              )}

              <Card className="border-slate-200">
                <CardContent className="p-3">
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>
                      Pre-Order ID:{" "}
                      <span className="font-mono">#{selectedPreOrder.id.slice(0, 8)}</span>
                    </div>
                    <div>Customer: {selectedPreOrder.full_name}</div>
                    <div>Phone: {selectedPreOrder.phone_number}</div>
                    <div className="text-sky-600 font-medium">
                      {selectedPreOrder.is_self_picked_up ? "Self Pickup Order" : "Delivery Order"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-9 rounded-xl"
                  onClick={() => setIsStatusUpdateOpen(false)}
                  disabled={isSubmitting}
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-9 rounded-xl"
                  onClick={handleStatusUpdateSubmit}
                  disabled={!selectedStatus || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-4 h-4 mr-2" />
                      Update Status
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesPreOrder;
