import { Dialog, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Star, Calendar, Package, Tag } from "lucide-react";
import type { ReviewData } from "@/libs/types/review";

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: ReviewData | null;
}

export const ReviewDetailModal = ({ isOpen, onClose, review }: ReviewDetailModalProps) => {
  if (!review) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Review Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={review.user_info.avatar_url}
              alt={review.user_info.full_name}
              className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <p className="text-lg font-semibold">{review.user_info.full_name}</p>
              <p className="text-sm text-gray-600">@{review.user_info.user_name}</p>
            </div>
          </div>

          {/* Rating and Date */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= review.review_content.rating_stars
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">{review.review_content.rating_stars}/5</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{formatDate(review.review_content.created_at)}</span>
            </div>
          </div>

          {/* Review Comment */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Review Comment</h3>
            <p className="text-gray-700 whitespace-pre-wrap p-4 bg-gray-50 rounded-lg">
              {review.review_content.comment}
            </p>
          </div>

          {/* Review Assets */}
          {review.review_content.assets_url && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Attachments</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {review.review_content.assets_url.split(",").map((url, index) => (
                  <img
                    key={index}
                    src={url.trim()}
                    alt={`Review attachment ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Product Information */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Product Name</p>
                <p className="font-medium">{review.product.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium">{review.product.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {review.product.category.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Brand</p>
                <p className="font-medium">
                  {review.product.brand?.name ? review.product.brand.name : "-"}
                </p>
              </div>
              {review.product.capacity_unit && (
                <div>
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="font-medium">{review.product.capacity_unit}</p>
                </div>
              )}
              {review.product.container_type && (
                <div>
                  <p className="text-sm text-gray-600">Container Type</p>
                  <p className="font-medium">{review.product.container_type}</p>
                </div>
              )}
            </div>

            {/* Brand Details */}
            {review.product.brand?.logo_url && (
              <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                <img
                  src={review.product.brand.logo_url}
                  alt={review.product.brand.name}
                  className="h-12 w-12 object-contain"
                />
                <div>
                  <p className="font-medium">{review.product.brand.name}</p>
                  {review.product.brand.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {review.product.brand.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
