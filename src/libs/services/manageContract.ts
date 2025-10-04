import api from "@/libs/api";
import type { ContractParams } from "@/libs/types/contract";

export const manageContract = {
  getContractsByBrand: (params: ContractParams) =>
    api.get(`/contracts/brands/${params.brand_id}`, {
      params: {
        page: params.page,
        limit: params.limit,
        status: params.status,
        type: params.type,
      },
    }),

  approveContract: (contractId: string) => api.patch(`/contracts/${contractId}/approve`),

  rejectContract: (contractId: string) => api.patch(`/contracts/${contractId}/reject`),
};
