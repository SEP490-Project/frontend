import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
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
import { FaFilter, FaEye } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, type RootState } from "@/libs/stores";
import {
  getPreOrdersForSaleStaffThunk,
  censorAnPreOrderThunk,
} from "@/libs/stores/orderManager/thunk";
import { useSelector } from "react-redux";
import type { OrderRequestQuery } from "@/libs/types/order";
import { PaginationTable } from "@/components/global";
import PreOrderDetail from "@/components/manage/sale/order/PreOrderDetail";
import { SquarePen } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { updatePreOrderStateThunk } from "@/libs/stores/stateManager/thunk";
import type { PreOrderData } from "@/libs/types/pre-order";

const PreOrder: React.FC = () => {
  const dispatch = useAppDispatch();
  const orderResponse = useSelector((state: RootState) => state?.manageOrder?.preOrderForSaleStaff);
  const pagination = orderResponse?.pagination;
  const preOrders: PreOrderData[] = orderResponse?.data || [];
  const isLoading = useSelector((state: RootState) => state?.manageOrder?.loading);
  const error = useSelector((state: RootState) => state?.manageOrder?.errors);

  const [params, setParams] = useState<OrderRequestQuery>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });
  const [selectedPreOrder, setSelectedPreOrder] = useState<PreOrderData | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isCensorDialogOpen, setIsCensorDialogOpen] = useState(false);
  const [isChangeStatusDialogOpen, setIsChangeStatusDialogOpen] = useState(false);
  const [censorAction, setCensorAction] = useState<"CONFIRM" | "CANCEL">("CONFIRM");
  const [censorReason, setCensorReason] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);

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
    };
    return (
      statusMap[status.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
    );
  };

  const getNextStates = (currentStatus: string): string[] => {
    const stateTransitions: Record<string, string[]> = {
      PAID: ["AWAITING_RELEASE"],
      PENDING: ["CANCELLED, PAID"],
      PRE_ORDERED: ["STOCK_READY", "STOCK_PREPARING"],
      STOCK_READY: ["AWAITING_PICKUP"],
      STOCK_PREPARING: ["IN_TRANSIT", "AWAITING_PICKUP"],
      AWAITING_PICKUP: ["RECEIVED"],
      IN_TRANSIT: ["DELIVERED"],
      DELIVERED: ["RECEIVED"],
      CANCELLED: [],
      RECEIVED: [],
    };
    return stateTransitions[currentStatus] || [];
  };

  const handleViewPreOrder = (preOrder: PreOrderData) => {
    setSelectedPreOrder(preOrder);
    setIsDetailDialogOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setParams({ ...params, search: value, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    setParams({ ...params, status: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  const handleCensorPreOrder = async () => {
    if (!selectedPreOrder) return;

    try {
      await dispatch(
        censorAnPreOrderThunk({
          id: selectedPreOrder.id,
          action: censorAction,
          reason: censorAction === "CANCEL" ? { reason: censorReason } : {},
        }),
      ).unwrap();

      toast.success(
        `Pre-order ${censorAction === "CONFIRM" ? "confirmed" : "cancelled"} successfully!`,
      );
      dispatch(getPreOrdersForSaleStaffThunk(params));
      setIsCensorDialogOpen(false);
      setCensorReason("");
    } catch (error: any) {
      toast.error("Failed to censor pre-order", {
        description: error?.message || "Please try again.",
      });
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedPreOrder || !selectedStatus) return;
    if (
      (selectedStatus === "RECEIVED" && selectedPreOrder?.is_self_picked_up === true) ||
      (selectedStatus === "DELIVERED" && selectedPreOrder?.is_self_picked_up === false)
    ) {
      toast.error("Proof required", {
        description: "Please upload a proof photo for this status change.",
      });
      return;
    }

    const files = new FormData();
    files.append("state", selectedStatus);

    // Append proof files if available
    if (proofFiles.length > 0) {
      proofFiles.forEach((file) => {
        files.append("files", file);
      });
    }

    try {
      await dispatch(
        updatePreOrderStateThunk({
          id: selectedPreOrder.id,
          files,
        }),
      ).unwrap();

      toast.success("Pre-order status updated successfully!");
      dispatch(getPreOrdersForSaleStaffThunk(params));
      setIsChangeStatusDialogOpen(false);
      setSelectedStatus("");
      setProofFiles([]);
    } catch (error: any) {
      toast.error("Failed to update pre-order status", {
        description: error?.message || "Please try again.",
      });
    }
  };

  const openCensorDialog = (preOrder: PreOrderData, action: "CONFIRM" | "CANCEL") => {
    setSelectedPreOrder(preOrder);
    setCensorAction(action);
    setIsCensorDialogOpen(true);
  };

  const openChangeStatusDialog = (preOrder: PreOrderData) => {
    setSelectedPreOrder(preOrder);
    setSelectedStatus("");
    setProofFiles([]);
    setIsChangeStatusDialogOpen(true);
  };

  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setProofFiles(Array.from(files));
    }
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Pre-Orders</h1>
      </div>

      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by pre-order ID, name, email or phone..."
              value={params.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="min-w-[150px]">
            <Select
              value={params.status || " "}
              onValueChange={(value) => handleStatusChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PRE_ORDERED">Pre-Ordered</SelectItem>
                <SelectItem value="AWAITING_RELEASE">Awaiting Release</SelectItem>
                <SelectItem value="AWAITING_PICKUP">Awaiting Pickup</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="RECEIVED">Received</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="px-4">
              <TableRow className="border-b bg-gray-50">
                <TableHead className="font-semibold">Pre-Order ID</TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Total Amount</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Created At</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading pre-orders...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-red-600">
                    Error: {error?.message || "Failed to load pre-orders"}
                  </TableCell>
                </TableRow>
              ) : !preOrders || preOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No pre-orders found
                  </TableCell>
                </TableRow>
              ) : (
                preOrders.map((preOrder, index) => (
                  <TableRow
                    key={preOrder.id}
                    className={`border-b hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <TableCell className="py-4">
                      <span className="font-medium text-gray-900 font-mono text-sm">
                        #{preOrder.id.slice(0, 8)}
                      </span>
                    </TableCell>

                    <TableCell className="py-4">
                      <div>
                        <div className="font-medium text-gray-900">{preOrder.full_name}</div>
                        <div className="text-sm text-gray-500">{preOrder.email}</div>
                        <div className="text-sm text-gray-500">{preOrder.phone_number}</div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(preOrder.total_amount)}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge className="bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200">
                        PRE-ORDER
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge className={getStatusBadgeClass(preOrder.status)}>
                        {preOrder.status.toUpperCase()}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                      <span className="text-sm text-gray-600">
                        {formatDate(preOrder.created_at)}
                      </span>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-blue-100"
                          title="View Details"
                          onClick={() => handleViewPreOrder(preOrder)}
                        >
                          <FaEye className="text-blue-600" />
                        </Button>
                        {preOrder.status === "PAID" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-green-100"
                              title="Confirm Pre-Order"
                              onClick={() => openCensorDialog(preOrder, "CONFIRM")}
                            >
                              <SquarePen className="text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-red-100"
                              title="Cancel Pre-Order"
                              onClick={() => openCensorDialog(preOrder, "CANCEL")}
                            >
                              <SquarePen className="text-red-600" />
                            </Button>
                          </>
                        )}
                        {preOrder.status !== "PAID" &&
                          preOrder.status !== "CANCELLED" &&
                          preOrder.status !== "RECEIVED" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-yellow-100"
                              title="Change Status"
                              onClick={() => openChangeStatusDialog(preOrder)}
                            >
                              <SquarePen className="text-yellow-600" />
                            </Button>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {pagination && (
            <PaginationTable
              page={pagination.page}
              totalItems={pagination.total}
              pageSize={pagination.limit}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading pre-orders...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">
              Error: {error?.message || "Failed to load pre-orders"}
            </div>
          ) : preOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No pre-orders found</div>
          ) : (
            preOrders.map((preOrder) => (
              <div key={preOrder.id} className="p-4 flex flex-col gap-3 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900 font-mono text-sm">
                      #{preOrder.id.slice(0, 8)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDate(preOrder.created_at)}
                    </div>
                  </div>
                  <Badge className={getStatusBadgeClass(preOrder.status)}>
                    {preOrder.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="font-medium text-gray-900">{preOrder.full_name}</div>
                  <div className="text-sm text-gray-500">{preOrder.email}</div>
                  <div className="text-sm text-gray-500">{preOrder.phone_number}</div>
                </div>

                <div className="space-y-1">
                  <div className="font-semibold text-gray-900">
                    Total: {formatCurrency(preOrder.total_amount)}
                  </div>
                </div>

                <div className="flex gap-1 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 hover:bg-blue-100"
                    onClick={() => handleViewPreOrder(preOrder)}
                  >
                    <FaEye className="text-blue-600 mr-2" />
                    View Details
                  </Button>

                  {preOrder.status === "PRE_ORDERED" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-green-100"
                        onClick={() => openCensorDialog(preOrder, "CONFIRM")}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-100"
                        onClick={() => openCensorDialog(preOrder, "CANCEL")}
                      >
                        Cancel
                      </Button>
                    </>
                  )}

                  {preOrder.status !== "PAID" &&
                    preOrder.status !== "CANCELLED" &&
                    preOrder.status !== "RECEIVED" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 hover:bg-yellow-100"
                        onClick={() => openChangeStatusDialog(preOrder)}
                      >
                        <SquarePen className="text-yellow-600 mr-2" />
                        Change Status
                      </Button>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pre-Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pre-Order Details</DialogTitle>
          </DialogHeader>
          {selectedPreOrder && <PreOrderDetail preOrder={selectedPreOrder} />}
        </DialogContent>
      </Dialog>

      {/* Censor Pre-Order Dialog */}
      <Dialog open={isCensorDialogOpen} onOpenChange={setIsCensorDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {censorAction === "CONFIRM" ? "Confirm Pre-Order" : "Cancel Pre-Order"}
            </DialogTitle>
            <DialogDescription>
              {censorAction === "CONFIRM"
                ? "Are you sure you want to confirm this pre-order?"
                : "Are you sure you want to cancel this pre-order? Please provide a reason."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {censorAction === "CANCEL" && (
              <div>
                <Label htmlFor="reason">Cancellation Reason</Label>
                <Input
                  id="reason"
                  placeholder="Enter reason for cancellation"
                  value={censorReason}
                  onChange={(e) => setCensorReason(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCensorDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCensorPreOrder}
                disabled={censorAction === "CANCEL" && !censorReason.trim()}
                variant={censorAction === "CONFIRM" ? "default" : "destructive"}
              >
                {censorAction === "CONFIRM" ? "Confirm" : "Cancel Pre-Order"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={isChangeStatusDialogOpen} onOpenChange={setIsChangeStatusDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Pre-Order Status</DialogTitle>
            <DialogDescription>
              Update the status of this pre-order to the next available state.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {getNextStates(selectedPreOrder?.status || "").map((state) => (
                    <SelectItem key={state} value={state}>
                      {state.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {((selectedStatus === "RECEIVED" && selectedPreOrder?.is_self_picked_up === true) ||
              (selectedStatus === "DELIVERED" &&
                selectedPreOrder?.is_self_picked_up === false)) && (
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 text-sm mb-1">
                      Proof Photo Required
                    </h4>
                    <p className="text-xs text-blue-700">
                      {selectedStatus === "RECEIVED"
                        ? "Please upload a photo showing the order is ready for customer pickup."
                        : "Please upload a photo as proof that the order has been delivered to the customer."}
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="proof-photo" className="text-sm font-medium text-blue-900">
                    Upload Proof Photo *
                  </Label>
                  <div className="mt-2 relative">
                    <input
                      id="proof-photo"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      onChange={handleProofFileChange}
                      className="flex h-10 w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-blue-700 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-blue-400 transition-colors"
                    />
                  </div>

                  {proofFiles.length > 0 ? (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <p className="text-sm font-medium text-green-700">
                          {proofFiles.length} photo(s) selected
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {proofFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-green-200 shadow-sm"
                            />
                            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-blue-600 mt-2 italic">
                      No photo selected yet. Please upload at least one photo.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsChangeStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus} disabled={!selectedStatus}>
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreOrder;
