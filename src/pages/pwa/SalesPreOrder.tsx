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
  FaDollarSign as FaMoneyBill,
  FaBox,
  FaCheck,
  FaXmark as FaTimes,
  FaTriangleExclamation as FaExclamationTriangle,
} from "react-icons/fa6";
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
import PWANavigation from "@/components/pwa/PWANavigation";
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
    limit: 20,
    search: "",
    status: "",
  });
  const [selectedPreOrder, setSelectedPreOrder] = useState<PreOrderData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Status update state
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
      pending: "bg-blue-100 text-blue-800 border border-blue-200",
      paid: "bg-green-100 text-green-800 border border-green-200",
      pre_ordered: "bg-purple-100 text-purple-800 border border-purple-200",
      awaiting_pickup: "bg-blue-100 text-blue-800 border border-blue-200",
      confirmed: "bg-green-100 text-green-800 border border-green-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200",
      in_transit: "bg-orange-100 text-orange-800 border border-orange-200",
      delivered: "bg-green-200 text-green-900 border border-green-300",
      received: "bg-green-100 text-green-800 border border-green-200",
      refund_request: "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse",
      compensate_request: "bg-red-100 text-red-800 border border-red-300 animate-pulse",
      compensated: "bg-green-100 text-green-800 border border-green-200",
      refunded: "bg-green-100 text-green-800 border border-green-200",
    };
    return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const getNextStates = (currentStatus: string, iselfPickup: boolean): string[] => {
    const status = currentStatus.toUpperCase();

    if (iselfPickup) {
      // Self pickup flow
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
      // Delivery flow
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
    setParams({ ...params, search: value, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    setParams({ ...params, status: value, page: 1 });
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
      toast.error("Proof image/video is required for this status");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("state", selectedStatus);

      if (statusNotes.trim()) {
        formData.append("notes", statusNotes.trim());
      }

      // Add proof files
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

  const loadMore = () => {
    if (pagination && pagination.has_next && !isLoading) {
      setParams((prev: OrderRequestQuery) => ({ ...prev, page: (prev.page || 1) + 1 }));
    }
  };

  const canApprove = (preOrder: PreOrderData) => {
    return preOrder.status.toUpperCase() === "PAID";
  };

  const canUpdateStatus = (preOrder: PreOrderData) => {
    const status = preOrder.status.toUpperCase();
    return !["PENDING", "CANCELLED", "REFUNDED", "RECEIVED", "COMPENSATED"].includes(status);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Pre-Orders</h1>
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
              placeholder="Search pre-orders..."
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
                <SelectItem value="PRE_ORDERED">Pre-Ordered</SelectItem>
                <SelectItem value="AWAITING_PICKUP">Awaiting Pickup</SelectItem>
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

      {/* Pre-Orders List */}
      <div className="p-4 space-y-3">
        {isLoading && preOrders.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-gray-500">Loading pre-orders...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 text-center text-red-600">
              <p>Error: {error?.message || "Failed to load pre-orders"}</p>
              <Button variant="outline" onClick={handleRefresh} className="mt-3">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : preOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <FaBox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium mb-2">No pre-orders found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          preOrders.map((preOrder) => (
            <Card key={preOrder.id} className="border hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {/* PreOrder Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-medium">
                        #{preOrder.id.slice(0, 8)}
                      </span>
                      <Badge className={getStatusBadgeClass(preOrder.status)}>
                        {preOrder.status.toUpperCase()}
                      </Badge>
                    </div>
                    <Badge
                      variant={preOrder.is_self_picked_up ? "outline" : "secondary"}
                      className="text-xs"
                    >
                      {preOrder.is_self_picked_up ? "Pickup" : "Delivery"}
                    </Badge>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FaUser className="w-3 h-3 text-gray-400" />
                    <span className="font-medium">{preOrder.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaPhone className="w-3 h-3" />
                    <span>{preOrder.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaEnvelope className="w-3 h-3" />
                    <span className="truncate">{preOrder.email}</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="border-t pt-3 space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">
                      {preOrder.capacity} {preOrder.capacity_unit} - {preOrder.container_type}
                    </span>
                    <div className="text-xs text-gray-600">
                      Qty: {preOrder.quantity} • {preOrder.dispenser_type}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMoneyBill className="w-3 h-3" />
                      <span>Total</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(preOrder.total_amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendarAlt className="w-3 h-3" />
                      <span>Created</span>
                    </div>
                    <span className="text-gray-600">{formatDate(preOrder.created_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewPreOrder(preOrder)}
                  >
                    <FaEye className="w-3 h-3 mr-2" />
                    View
                  </Button>

                  {canApprove(preOrder) && (
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
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
                      className="flex-1"
                      onClick={() => handleStatusUpdate(preOrder)}
                    >
                      <FaPen className="w-3 h-3 mr-2" />
                      Update
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
            Showing {preOrders.length} of {pagination.total} pre-orders
          </div>
        )}
      </div>

      {/* Pre-Order Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              Pre-Order #{selectedPreOrder?.id.slice(0, 8)}
              {selectedPreOrder && (
                <Badge className={getStatusBadgeClass(selectedPreOrder.status)}>
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

      {/* Approve Pre-Order Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaCheck className="w-5 h-5 text-green-600" />
              Approve Pre-Order
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this pre-order? This action will move it to
              PRE_ORDERED status.
            </DialogDescription>
          </DialogHeader>

          {selectedPreOrder && (
            <div className="space-y-4">
              <Card className="border-gray-200">
                <CardContent className="p-3">
                  <div className="text-sm space-y-1">
                    <div>
                      Pre-Order ID:{" "}
                      <span className="font-mono">#{selectedPreOrder.id.slice(0, 8)}</span>
                    </div>
                    <div>Customer: {selectedPreOrder.full_name}</div>
                    <div>
                      Product: {selectedPreOrder.capacity} {selectedPreOrder.capacity_unit}
                    </div>
                    <div>
                      Total:{" "}
                      <span className="font-semibold text-green-600">
                        {formatCurrency(selectedPreOrder.total_amount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsApproveOpen(false)}
                  disabled={isSubmitting}
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
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

      {/* Status Update Dialog */}
      <Dialog open={isStatusUpdateOpen} onOpenChange={setIsStatusUpdateOpen}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Pre-Order Status</DialogTitle>
            <DialogDescription>
              Change the status of this pre-order to the next available state.
            </DialogDescription>
          </DialogHeader>

          {selectedPreOrder && (
            <div className="space-y-4">
              {/* Current Status */}
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Current Status:</span>
                    <Badge className={getStatusBadgeClass(selectedPreOrder.status)}>
                      {selectedPreOrder.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Status Selection */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Select New Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
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

              {/* Notes */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Notes (Optional)</Label>
                <Textarea
                  placeholder="Add notes about this status change..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="min-h-[60px] resize-none"
                />
              </div>

              {/* Proof Upload */}
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
                    allowedTypes={["jpg", "jpeg", "png", "webp", "mp4", "webm", "mov"]}
                    title="Upload Proof"
                    onFilesChange={(files) => setProofFiles(files)}
                    onUploadComplete={(urls) => setProofUrls(urls)}
                    showCamera={true}
                  />
                </div>
              )}

              {/* Pre-Order Info */}
              <Card className="border-gray-200">
                <CardContent className="p-3">
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>
                      Pre-Order ID:{" "}
                      <span className="font-mono">#{selectedPreOrder.id.slice(0, 8)}</span>
                    </div>
                    <div>Customer: {selectedPreOrder.full_name}</div>
                    <div>Phone: {selectedPreOrder.phone_number}</div>
                    <div className="text-blue-600 font-medium">
                      {selectedPreOrder.is_self_picked_up ? "Self Pickup" : "Delivery"} Order
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsStatusUpdateOpen(false)}
                  disabled={isSubmitting}
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  className="flex-1"
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

      {/* PWA Navigation */}
      <PWANavigation className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
};

export default SalesPreOrder;
