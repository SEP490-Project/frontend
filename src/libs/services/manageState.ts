import api from "../api";

const manageState = {
  updateTaskState: (
    task_id: string,
    newState: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED" | "RECAP",
  ) => api.patch(`/tasks/${task_id}/state`, { state: newState }),
  updateProductState: (
    product_id: string,
    newState: "DRAFT" | "SUBMITTED" | "REVISION" | "APPROVED" | "ACTIVED" | "INACTIVED",
  ) => api.patch(`/products/${product_id}/state`, { state: newState }),
};

export default manageState;
