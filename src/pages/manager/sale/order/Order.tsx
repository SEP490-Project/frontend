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
import { getOrderForSaleStaffThunk } from "@/libs/stores/orderManager/thunk";
import { useSelector } from "react-redux";
import type { OrderData, OrderRequestQuery } from "@/libs/types/order";
import { PaginationTable } from "@/components/global";
import OrderDetail from "@/components/manage/sale/order/OrderDetail";
import { SquarePen } from "lucide-react";
import { convertNumberToCurrency } from "@/libs/helper/helper";
import ChangeOrderStatusModal from "@/components/manage/sale/order/ChangeOrderStatusModal";

const Order: React.FC = () => {
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
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusOptions = [
    "PENDING",
    "PAID",
    "CANCELLED",
    "AWAITING_PICKUP",
    "REFUND_REQUEST",
    "REFUNDED",
    "SHIPPED",
    "IN_TRANSIT",
    "CONFIRMED",
    "DELIVERED",
    "COMPENSATED",
    "COMPENSATE_REQUEST",
    "RECEIVED",
  ];

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200",
      paid: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
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
    return (
      statusMap[status.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
    );
  };

  const handleViewOrder = (order: OrderData) => {
    setSelectedOrder(order);
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

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Orders</h1>
      </div>

      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by order ID, name, email or phone..."
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
                <SelectItem value=" ">All Statuses</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </SelectItem>
                ))}
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
                <TableHead className="font-semibold">Order ID</TableHead>
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
                      <span className="ml-2">Loading orders...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-red-600">
                    Error: {error?.message || "Failed to load orders"}
                  </TableCell>
                </TableRow>
              ) : !orders || orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, index) => (
                  <TableRow
                    key={order.id}
                    className={`border-b hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <TableCell className="py-4">
                      <span className="font-medium text-gray-900 font-mono text-sm">
                        #{order.id.slice(0, 8)}
                      </span>
                    </TableCell>

                    <TableCell className="py-4">
                      <div>
                        <div className="font-medium text-gray-900">{order.full_name}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                        <div className="text-sm text-gray-500">{order.phone_number}</div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="font-semibold text-gray-900">
                        {convertNumberToCurrency(String(order.total_amount))}
                      </div>
                      <div className="text-xs text-gray-500">
                        Shipping: {convertNumberToCurrency(String(order.shipping_fee))}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge
                        className={
                          order.order_type === "STANDARD"
                            ? "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 "
                            : "bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200 "
                        }
                      >
                        {order.order_type}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge className={getStatusBadgeClass(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                      <span className="text-sm text-gray-600">{formatDate(order.created_at)}</span>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-blue-100"
                          title="View Details"
                          onClick={() => handleViewOrder(order)}
                        >
                          <FaEye className="text-blue-600" />
                        </Button>
                        {order.status !== "CANCELLED" &&
                          order.status !== "RECEIVED" &&
                          order.status !== "COMPENSATED" &&
                          order.status !== "REFUNDED" &&
                          !(order.status === "DELIVERED" && order.order_type === "LIMITED") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-yellow-100"
                              title="Change Status"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsChangeStatusModalOpen(true);
                              }}
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
            <div className="p-4 text-center text-gray-500">Loading orders...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">
              Error: {error?.message || "Failed to load orders"}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No orders found</div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="p-4 flex flex-col gap-3 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900 font-mono text-sm">
                      #{order.id.slice(0, 8)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{formatDate(order.created_at)}</div>
                  </div>
                  <Badge className={getStatusBadgeClass(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="font-medium text-gray-900">{order.full_name}</div>
                  <div className="text-sm text-gray-500">{order.email}</div>
                  <div className="text-sm text-gray-500">{order.phone_number}</div>
                </div>

                <div className="space-y-1">
                  <div className="font-semibold text-gray-900">
                    Total: {convertNumberToCurrency(String(order.total_amount))}
                  </div>
                  <div className="text-xs text-gray-500">
                    Shipping: {convertNumberToCurrency(String(order.shipping_fee))}
                  </div>
                </div>

                <div className="flex gap-1 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 hover:bg-blue-100"
                    onClick={() => handleViewOrder(order)}
                  >
                    <FaEye className="text-blue-600 mr-2" />
                    View Details
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 hover:bg-yellow-100"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsChangeStatusModalOpen(true);
                    }}
                    disabled={
                      order.status === "RECEIVED" ||
                      order.status === "CANCELLED" ||
                      order.status === "COMPENSATED" ||
                      order.status === "REFUNDED" ||
                      (order.status === "DELIVERED" && order.order_type === "LIMITED")
                    }
                  >
                    <SquarePen className="text-yellow-600 mr-2" />
                    Change Status
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && <OrderDetail order={selectedOrder} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isChangeStatusModalOpen} onOpenChange={setIsChangeStatusModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedOrder?.is_self_picked_up ? "Self Picked Up Order" : "Shipping Order"}
            </DialogTitle>
            <DialogDescription>
              Change the status of the order and manage its progress.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <ChangeOrderStatusModal
              order={selectedOrder}
              onSuccess={() => setIsChangeStatusModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Order;
