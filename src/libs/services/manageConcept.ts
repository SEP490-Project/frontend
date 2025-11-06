import api from "../api";
import type { CreateConceptPayload } from "../types/concept";

const manageConcept = {
  getAllConcepts: async () => api.get("/concepts"),
  createConcept: async (payload: CreateConceptPayload) => api.post("/concepts", payload),
  deleteConcept: async (conceptId: string) => api.delete(`/concepts/${conceptId}`),
};

export default manageConcept;
