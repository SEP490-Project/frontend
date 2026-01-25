import { PaginationTable } from "@/components/global";
import { ReviewDetailModal } from "@/components/manage/sale/review/ReviewDetailModal";
import { Button } from "@/components/ui/button";
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
import { formatDate } from "@/libs/helper/helper";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { getReviewsForStaffThunk } from "@/libs/stores/reviewManager/thunk";
import type { ReviewData, ReviewQueryParams } from "@/libs/types/review";
import { Trash } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { brand } from "@/libs/stores/brandManager/thunk";

import { useEffect, useState } from "react";
import { FaEye, FaFilter, FaStar } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useBrand } from "@/libs/hooks/useBrand";
import { Input } from "@/components/ui/input";

const Review = () => {
  const dispatch = useAppDispatch();

  const { reviews, loading } = useSelector((state: RootState) => state.manageReview);
  const { brands } = useBrand();

  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [params, setParams] = useState<ReviewQueryParams>({
    page: 1,
    limit: 5,
    brand_id: "",
    from_date: "",
    to_date: "",
    rating_stars_min: undefined,
    rating_stars_max: undefined,
    order_by: "created_at",
    order_direction: "desc",
  });

  // Load brands on mount
  useEffect(() => {
    dispatch(brand({ limit: 100, page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    const queryParams: ReviewQueryParams = {
      page: params.page,
      limit: params.limit,
    };

    if (params.brand_id && params.brand_id !== "") {
      queryParams.brand_id = params.brand_id;
    }

    if (params.from_date && params.from_date !== "") {
      queryParams.from_date = params.from_date;
    }

    if (params.to_date && params.to_date !== "") {
      queryParams.to_date = params.to_date;
    }

    if (params.rating_stars_min !== undefined) {
      queryParams.rating_stars_min = params.rating_stars_min;
    }

    if (params.rating_stars_max !== undefined) {
      queryParams.rating_stars_max = params.rating_stars_max;
    }

    if (params.order_by) {
      queryParams.order_by = params.order_by;
    }

    if (params.order_direction) {
      queryParams.order_direction = params.order_direction;
    }

    dispatch(getReviewsForStaffThunk(queryParams));
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
              placeholder="Search by product name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  brand_id: "",
                  from_date: "",
                  to_date: "",
                  rating_stars_min: undefined,
                  rating_stars_max: undefined,
                  order_by: "created_at",
                  order_direction: "desc",
                });
              }}
            >
              Clear All
            </Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Select
              value={params.brand_id || ""}
              onValueChange={(value) => setParams({ ...params, brand_id: value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent className="h-[50vh] overflow-y-scroll">
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <DatePicker
              value={params.from_date}
              onChange={(date) => setParams({ ...params, from_date: date, page: 1 })}
              placeholder="Select from date"
              onlyPast={true}
            />
          </div>
          <div>
            <DatePicker
              value={params.to_date}
              onChange={(date) => setParams({ ...params, to_date: date, page: 1 })}
              placeholder="Select to date"
              onlyPast={true}
            />
          </div>
          <div>
            <Select
              value={params.rating_stars_min?.toString() || ""}
              onValueChange={(value) =>
                setParams({
                  ...params,
                  rating_stars_min: value ? parseInt(value) : undefined,
                  page: 1,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Min Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 star</SelectItem>
                <SelectItem value="2">2 stars</SelectItem>
                <SelectItem value="3">3 stars</SelectItem>
                <SelectItem value="4">4 stars</SelectItem>
                <SelectItem value="5">5 stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Select
              value={params.rating_stars_max?.toString() || ""}
              onValueChange={(value) =>
                setParams({
                  ...params,
                  rating_stars_max: value ? parseInt(value) : undefined,
                  page: 1,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Max Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 star</SelectItem>
                <SelectItem value="2">2 stars</SelectItem>
                <SelectItem value="3">3 stars</SelectItem>
                <SelectItem value="4">4 stars</SelectItem>
                <SelectItem value="5">5 stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={params.order_by || ""}
              onValueChange={(value) =>
                setParams({ ...params, order_by: value as "created_at" | "rating_stars", page: 1 })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date</SelectItem>
                <SelectItem value="rating_stars">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={params.order_direction || ""}
              onValueChange={(value) =>
                setParams({ ...params, order_direction: value as "asc" | "desc", page: 1 })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
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
                <TableHead className="font-semibold">Brand</TableHead>
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
                        Product - <span className="font-medium">{review.product.name}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="flex items-center text-lg font-medium">
                        <FaStar className="inline text-yellow-500 mr-1" size={16} />
                        {review.review_content.rating_stars.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">{review.review_content.comment}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {review.product.brand?.name ? review.product.brand.name : "-"}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.review_content.created_at)}
                    </span>
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
