import { PaginationTable } from "@/components/global";
import { ReviewDetailModal } from "@/components/manage/sale/review/ReviewDetailModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { getReviewsForStaffThunk } from "@/libs/stores/reviewManager/thunk";
import type { ProductParams } from "@/libs/types/product";
import type { ReviewData } from "@/libs/types/review";
import { Trash } from "lucide-react";

import { useEffect, useState } from "react";
import { FaEye, FaFilter, FaStar } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Review = () => {
  const dispatch = useAppDispatch();

  const { reviews, loading } = useSelector((state: RootState) => state.manageReview);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [params, setParams] = useState<ProductParams>({
    page: 1,
    limit: 5,
  });

  useEffect(() => {
    dispatch(getReviewsForStaffThunk());
  }, [dispatch, params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-600">Loading Reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Reviews</h1>
      </div>

      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by name or description..."
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="min-w-[150px]">
            <Select
              value={params.category_id || " "}
              onValueChange={(value) => {
                setParams({ ...params, category_id: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[150px]">
            <Select
              value={params.type || " "}
              onValueChange={(value) => {
                setParams({ ...params, type: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Types</SelectItem>
                <SelectItem value="STANDARD">Standard</SelectItem>
                <SelectItem value="LIMITED">Limited</SelectItem>
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
                <TableHead className="font-semibold">User & Product</TableHead>
                <TableHead className="font-semibold">Rating & Reviews</TableHead>
                <TableHead className="font-semibold">Posted Date</TableHead>
                <TableHead className="font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews?.data.map((review) => (
                <TableRow key={review.review_content.comment} className="hover:bg-gray-100">
                  <TableCell className="flex">
                    <div>
                      <img
                        src={review.user_info.avatar_url}
                        alt={review.user_info.full_name}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{review.user_info.full_name}</span>
                      <span className="text-sm text-gray-500">
                        {" "}
                        Product - <span className="font-bold">{review.product.name}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="flex items-center text-lg font-bold">
                        <FaStar className="inline text-yellow-500 mr-1" size={16} />
                        {review.review_content.rating_stars.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">{review.review_content.comment}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">2023-10-01</span>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="hover:bg-red-100"
                      variant={"ghost"}
                      size="icon"
                      title="Delete Review"
                    >
                      <Trash size={24} className="text-red-600" />
                    </Button>
                    <Button
                      className="hover:bg-blue-100"
                      variant={"ghost"}
                      size="icon"
                      title="View Details"
                      onClick={() => {
                        setSelectedReview(review);
                        setShowDetails(true);
                      }}
                    >
                      <FaEye size={24} className="text-blue-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {reviews?.pagination && (
            <PaginationTable
              page={reviews?.pagination.page}
              totalItems={reviews?.pagination.total}
              pageSize={reviews?.pagination.limit}
              onPageChange={(page) => setParams({ ...params, page })}
            />
          )}
        </div>
      </div>
      <ReviewDetailModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        review={selectedReview}
      />
    </div>
  );
};

export default Review;
