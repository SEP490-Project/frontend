import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/libs/stores";
import { getAllRefundedOrdersThunk } from "@/libs/stores/analyticDetailManager/thunk";
import type {
  SaleAnalyticDetailData,
  SaleAnalyticDetailParams,
} from "@/libs/types/sale-analytic-detail";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertNumberToCurrency, formatDate } from "@/libs/helper/helper";
import DetailModal from "./DetailModal";

interface TotalRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate?: string;
  endDate?: string;
}

export const TotalRefundModal: React.FC<TotalRefundModalProps> = ({
  isOpen,
  onClose,
  startDate,
  endDate,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { refundedOrders, loading } = useSelector((state: RootState) => state.manageAnalyticDetail);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"total_amount" | "created_at">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedItem, setSelectedItem] = useState<SaleAnalyticDetailData | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const params: SaleAnalyticDetailParams = {
      page,
      limit,
      from_date: startDate?.split("T")[0],
      to_date: endDate?.split("T")[0],
      search: search || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    };

    dispatch(getAllRefundedOrdersThunk(params));
  }, [isOpen, page, limit, search, sortBy, sortOrder, startDate, endDate, dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortByChange = (value: "total_amount" | "created_at") => {
    setSortBy(value);
    setPage(1);
  };

  const handleSortOrderChange = (value: "asc" | "desc") => {
    setSortOrder(value);
    setPage(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Refunded Orders</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search by customer name or email..."
              value={search}
              onChange={handleSearchChange}
              className="col-span-2"
            />
            <Select value={sortBy} onValueChange={handleSortByChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="total_amount">Amount</SelectItem>
                <SelectItem value="created_at">Date</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={handleSortOrderChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest</SelectItem>
                <SelectItem value="asc">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Table */}
          {loading ? (
            <div className="flex justify-center items-center h-40">Loading...</div>
          ) : refundedOrders?.data && refundedOrders.data.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Customer</th>
                      <th className="text-left p-2">Email</th>
                      {/* <th className="text-right p-2">Total Amount</th> */}
                      <th className="text-right p-2">Refund Amount</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refundedOrders.data.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowDetail(true);
                        }}
                      >
                        <td className="p-2">{item.customer_name}</td>
                        <td className="p-2 text-sm">{item.customer_email}</td>
                        {/* <td className="text-right p-2 font-semibold">
                          {convertNumberToCurrency(String(item.total_amount))}
                        </td> */}
                        <td className="text-right p-2 text-red-600 font-semibold">
                          -{convertNumberToCurrency(String(item.total_amount))}
                        </td>
                        <td className="p-2">
                          <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                            {item.status}
                          </span>
                        </td>
                        <td className="p-2 text-sm">
                          {formatDate(new Date(item.created_at).toLocaleDateString())}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {refundedOrders.pagination && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    Total: {refundedOrders.pagination.total} items
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={!refundedOrders.pagination.has_prev}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm">
                      Page {page} of {refundedOrders.pagination.total_pages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={!refundedOrders.pagination.has_next}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center h-40 text-gray-500">
              No data available
            </div>
          )}
        </div>
      </DialogContent>
      <DetailModal isOpen={showDetail} onClose={() => setShowDetail(false)} data={selectedItem} />
    </Dialog>
  );
};

export default TotalRefundModal;
