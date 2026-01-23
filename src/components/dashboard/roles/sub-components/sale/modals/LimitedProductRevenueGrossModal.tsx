import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/libs/stores";
import { getLimitedGrossRevenueDetailsThunk } from "@/libs/stores/analyticDetailManager/thunk";
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

interface LimitedProductRevenueGrossModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate?: string;
  endDate?: string;
}

export const LimitedProductRevenueGrossModal: React.FC<LimitedProductRevenueGrossModalProps> = ({
  isOpen,
  onClose,
  startDate,
  endDate,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { limitedGrossRevenueDetails, loading } = useSelector(
    (state: RootState) => state.manageAnalyticDetail,
  );

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

    dispatch(getLimitedGrossRevenueDetailsThunk(params));
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
          <DialogTitle>Limited Product Revenue (Gross)</DialogTitle>
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
          ) : limitedGrossRevenueDetails?.data && limitedGrossRevenueDetails.data.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Customer</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-right p-2">Total Amount</th>
                      {/* <th className="text-right p-2">Net Amount</th> */}
                      <th className="text-right p-2">Shipping</th>
                      <th className="text-right p-2">Type</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {limitedGrossRevenueDetails.data.map((item) => (
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
                        <td className="text-right p-2 font-semibold">
                          {convertNumberToCurrency(item.total_amount.toFixed(2))}
                        </td>
                        {/* <td className="text-right p-2">
                          {convertNumberToCurrency(item.net_amount.toFixed(2))}
                        </td> */}

                        <td className="text-right p-2">
                          {convertNumberToCurrency(item.shipping_fee.toFixed(2))}
                        </td>
                        <td className="p-2">
                          <span
                            className={`text-xs px-2 py-1 ${item.source === "ORDER" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"} rounded`}
                          >
                            {item.source}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded">
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
              {limitedGrossRevenueDetails.pagination && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    Total: {limitedGrossRevenueDetails.pagination.total} items | Revenue:{" "}
                    <span className="font-bold">
                      {convertNumberToCurrency(String(limitedGrossRevenueDetails.total_revenue))}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={!limitedGrossRevenueDetails.pagination.has_prev}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm">
                      Page {page} of {limitedGrossRevenueDetails.pagination.total_pages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={!limitedGrossRevenueDetails.pagination.has_next}
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

export default LimitedProductRevenueGrossModal;
