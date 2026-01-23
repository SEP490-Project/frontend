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
import { getPreOrdersForSaleStaffThunk } from "@/libs/stores/orderManager/thunk";
import { brand } from "@/libs/stores/brandManager/thunk";
import { useSelector } from "react-redux";
import type { OrderRequestQuery } from "@/libs/types/order";
import { PaginationTable } from "@/components/global";
import PreOrderDetail from "@/components/manage/sale/pre-order/PreOrderDetail";
import { SquarePen } from "lucide-react";
import type { PreOrderData } from "@/libs/types/pre-order";
import ChangePreOrderStatusModal from "@/components/manage/sale/pre-order/ChangePreOrderStatusModal";
import { convertNumberToCurrency } from "@/libs/helper/helper";
import { DatePicker } from "@/components/date-picker";
import {
  getProvincesThunk,
  getDistrictsThunk,
  getWardsThunk,
} from "@/libs/stores/locationManager/thunk";
import type { Province, District, Ward } from "@/libs/types/location";
import { useBrand } from "@/libs/hooks/useBrand";

const PreOrder: React.FC = () => {
  const dispatch = useAppDispatch();
  const { brands } = useBrand();

  const orderResponse = useSelector((state: RootState) => state?.manageOrder?.preOrderForSaleStaff);
  const isLoading = useSelector((state: RootState) => state?.manageOrder?.loading);
  const error = useSelector((state: RootState) => state?.manageOrder?.errors);
  const provinces: Province[] = useSelector(
    (state: RootState) => state?.manageLocation?.provinces || [],
  );
  const districts: District[] = useSelector(
    (state: RootState) => state?.manageLocation?.districts || [],
  );
  const wards: Ward[] = useSelector((state: RootState) => state?.manageLocation?.wards || []);

  const pagination = orderResponse?.pagination;
  const preOrders: PreOrderData[] = orderResponse?.data || [];

  const [params, setParams] = useState<OrderRequestQuery>({
    page: 1,
    limit: 5,
    search: "",
    status: "",
    created_from: "",
    created_to: "",
    province_id: undefined,
    district_id: undefined,
    ward_code: "",
    phone: "",
    full_name: "",
    brand_id: undefined,
  });
  const [selectedPreOrder, setSelectedPreOrder] = useState<PreOrderData | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Load provinces and brands on mount
  useEffect(() => {
    dispatch(getProvincesThunk());
    dispatch(brand({ limit: 100, page: 1 }));
  }, [dispatch]);

  // Load districts when province changes
  useEffect(() => {
    if (params.province_id) {
      dispatch(getDistrictsThunk(params.province_id));
      setParams((prev) => ({ ...prev, district_id: undefined, ward_code: "" }));
    }
  }, [params.province_id, dispatch]);

  // Load wards when district changes
  useEffect(() => {
    if (params.district_id) {
      dispatch(getWardsThunk(params.district_id));
      setParams((prev) => ({ ...prev, ward_code: "" }));
    }
  }, [params.district_id, dispatch]);

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

    if (params.created_from && params.created_from !== "") {
      queryParams.created_from = params.created_from;
    }

    if (params.created_to && params.created_to !== "") {
      queryParams.created_to = params.created_to;
    }

    if (params.province_id) {
      queryParams.province_id = params.province_id;
    }

    if (params.district_id) {
      queryParams.district_id = params.district_id;
    }

    if (params.ward_code && params.ward_code !== "") {
      queryParams.ward_code = params.ward_code;
    }

    if (params.phone && params.phone.trim() !== "") {
      queryParams.phone = params.phone.trim();
    }

    if (params.full_name && params.full_name.trim() !== "") {
      queryParams.full_name = params.full_name.trim();
    }

    if (params.brand_id && params.brand_id !== "") {
      queryParams.brand_id = params.brand_id;
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
      awaiting_pickup: "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200",
      confirmed: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200",
      in_transit: "bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200",
      delivered: "bg-green-200 text-green-900 border border-green-300 hover:bg-green-300",
      received: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
      refund_request: "bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200",
      compensate_request: "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200",
      compensated: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
      refunded: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
    };
    return (
      statusMap[status.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
    );
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
              placeholder="Search by pre-order ID or customer name"
              value={params.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Button
              variant="outline"
              onClick={() => {
                setParams({
                  page: 1,
                  limit: 5,
                  search: "",
                  status: "",
                  created_from: "",
                  created_to: "",
                  province_id: undefined,
                  district_id: undefined,
                  ward_code: "",
                  phone: "",
                  full_name: "",
                });
              }}
            >
              Clear All
            </Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Search by phone number"
              value={params.phone || ""}
              onChange={(e) => setParams({ ...params, phone: e.target.value, page: 1 })}
              className="w-full"
            />
          </div>
          <div>
            <Input
              placeholder="Search by customer name"
              value={params.full_name || ""}
              onChange={(e) => setParams({ ...params, full_name: e.target.value, page: 1 })}
              className="w-full"
            />
          </div>
          <div>
            <DatePicker
              value={params.created_from}
              onChange={(date) => setParams({ ...params, created_from: date, page: 1 })}
              placeholder="Select from date"
              onlyPast={true}
            />
          </div>
          <div>
            <DatePicker
              value={params.created_to}
              onChange={(date) => setParams({ ...params, created_to: date, page: 1 })}
              placeholder="Select to date"
              onlyPast={true}
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Select
              value={String(params.province_id || "")}
              onValueChange={(value) =>
                setParams({ ...params, province_id: value ? parseInt(value) : undefined, page: 1 })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Province" />
              </SelectTrigger>
              <SelectContent className="h-[50vh] overflow-y-scroll">
                {provinces.map((province) => (
                  <SelectItem key={province.ProvinceID} value={String(province.ProvinceID)}>
                    {province.ProvinceName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={String(params.district_id || "")}
              onValueChange={(value) =>
                setParams({ ...params, district_id: value ? parseInt(value) : undefined, page: 1 })
              }
              disabled={!params.province_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent className="h-[50vh] overflow-y-scroll">
                {districts.map((district) => (
                  <SelectItem key={district.DistrictID} value={String(district.DistrictID)}>
                    {district.DistrictName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={params.ward_code || ""}
              onValueChange={(value) => setParams({ ...params, ward_code: value, page: 1 })}
              disabled={!params.district_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Ward" />
              </SelectTrigger>
              <SelectContent className="h-[50vh] overflow-y-scroll">
                {wards.map((ward) => (
                  <SelectItem key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={params.brand_id || ""}
              onValueChange={(value) => setParams({ ...params, brand_id: value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={params.status || ""}
              onValueChange={(value) => handleStatusChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PRE_ORDERED">Pre-Ordered</SelectItem>
                <SelectItem value="AWAITING_RELEASE">Awaiting Release</SelectItem>
                <SelectItem value="AWAITING_PICKUP">Awaiting Pickup</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="RECEIVED">Received</SelectItem>
                <SelectItem value="REFUND_REQUEST">Refund Request</SelectItem>
                <SelectItem value="COMPENSATE_REQUEST">Compensate Request</SelectItem>
                <SelectItem value="COMPENSATED">Compensated</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
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
                <TableHead className="font-semibold">Brand</TableHead>
                <TableHead className="font-semibold">Brand Share</TableHead>
                <TableHead className="font-semibold">System Share</TableHead>
                <TableHead className="font-semibold">Total Amount</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Created At</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading pre-orders...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-red-600">
                    Error: {error?.message || "Failed to load pre-orders"}
                  </TableCell>
                </TableRow>
              ) : !preOrders || preOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
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
                      <div className="font-semibold text-gray-900">{preOrder.brand.name}</div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="font-medium text-green-700">
                        {(preOrder.company_revenue / preOrder.total_amount) * 100}%
                      </div>
                      <div className="text-sm text-green-600">
                        {convertNumberToCurrency(String(preOrder.company_revenue))}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="font-medium text-blue-700">
                        {(preOrder.kol_revenue / preOrder.total_amount) * 100}%
                      </div>
                      <div className="text-sm text-blue-600">
                        {convertNumberToCurrency(String(preOrder.kol_revenue))}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(preOrder.total_amount)}
                      </div>
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
                        {preOrder.status !== "CANCELLED" &&
                          preOrder.status !== "RECEIVED" &&
                          preOrder.status !== "REFUNDED" &&
                          preOrder.status !== "COMPENSATED" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-yellow-100"
                              title="Change Status"
                              onClick={() => {
                                setSelectedPreOrder(preOrder);
                                setShowStatusModal(true);
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
                    {preOrder.status.toUpperCase() === "SHIPPED"
                      ? "PICKED_UP"
                      : preOrder.status.toUpperCase()}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 hover:bg-yellow-100"
                    onClick={() => {
                      setSelectedPreOrder(preOrder);
                      setShowStatusModal(true);
                    }}
                    disabled={
                      preOrder.status === "CANCELLED" ||
                      preOrder.status === "RECEIVED" ||
                      preOrder.status === "REFUNDED" ||
                      preOrder.status === "COMPENSATED"
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

      {/* Pre-Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pre-Order Details</DialogTitle>
            <DialogDescription>#{selectedPreOrder?.id}</DialogDescription>
          </DialogHeader>
          {selectedPreOrder && <PreOrderDetail preOrder={selectedPreOrder} />}
        </DialogContent>
      </Dialog>

      {/* Change Status Modal */}
      {showStatusModal && selectedPreOrder && (
        <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedPreOrder?.is_self_picked_up ? "Self Picked Up Order" : "Shipping Order"}
              </DialogTitle>
              <DialogDescription>
                Change the status of the order and manage its progress.
              </DialogDescription>
            </DialogHeader>
            {selectedPreOrder && (
              <ChangePreOrderStatusModal
                preOrder={selectedPreOrder}
                onSuccess={() => setShowStatusModal(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PreOrder;
