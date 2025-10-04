import api from "@/libs/api";

export const manageContract = {
  brand: (params: {
    brand_id?: string;
    type?: string;
    status?: string;
    keyword?: string;
    start_date?: string;
    end_date?: string;
    page: number;
    limit: number;
    sort_by: string;
    order: "asc" | "desc";
  }) => api.get("/contracts", { params }),
};
