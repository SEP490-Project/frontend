import api from "@/libs/api";

export const manageContract = {
  brand: (params: {
    brand_id?: string;
    type?: string;
    status?: string;
    keyword?: string;
    no_campaign?: boolean;
    start_date?: string;
    end_date?: string;
    page: number;
    limit: number;
    sort_by: string;
    sort_order: string;
  }) => api.get("/contracts", { params }),

  getContractsByBrand: (params: {
    page: number;
    limit: number;
    sort_by: string;
    sort_order: string;
    type?: string;
    status?: string;
    keyword?: string;
    start_date?: string;
    end_date?: string;
  }) => api.get("/contracts/brands/profile", { params }),

  getContractsByBrandId: (brandId: string, params: { page: number; limit: number }) =>
    api.get(`/contracts/brands/${brandId}`, {
      params: {
        page: params.page,
        limit: params.limit,
      },
    }),
  getContractById: (contractId: string) => api.get(`/contracts/${contractId}`),

  approveContract: (contractId: string) =>
    api.patch(`/contracts/${contractId}/state`, {
      state: "APPROVED",
    }),

  rejectContract: (contractId: string) => api.patch(`/contracts/${contractId}/reject`),

  createContract: (req: any) => api.post("/contracts/async", req),
};
