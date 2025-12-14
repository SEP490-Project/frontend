import api from "../api";

const manageReview = {
  getReviewsForStaff: () => api.get("/products/staff/reviews"),
};

export default manageReview;
