import api from "@/libs/api";
import type { ContractParams } from "@/libs/types/contract";

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

  getContractsByBrand: (params: ContractParams) =>
    api.get("/contracts/brands/profile", {
      params: {
        page: params.page,
        limit: params.limit,
        status: params.status,
        type: params.type,
      },
    }),

  getContractById: (contractId: string) => api.get(`/contracts/${contractId}`),

  approveContract: (contractId: string) => api.patch(`/contracts/${contractId}/state`),

  rejectContract: (contractId: string) => api.patch(`/contracts/${contractId}/reject`),
};
