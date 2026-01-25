import api from "../api";
import type { ReviewQueryParams } from "../types/review";

const manageReview = {
  getReviewsForStaff: (queryParams: ReviewQueryParams) =>
    api.get("/products/staff/reviews", { params: queryParams }),
};

export default manageReview;
