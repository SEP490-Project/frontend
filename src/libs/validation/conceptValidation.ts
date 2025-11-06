import * as yup from "yup";
import type { CreateConceptPayload } from "../types/concept";

export const createConceptSchema: yup.ObjectSchema<CreateConceptPayload> = yup.object({
  name: yup.string().required("Concept name is required"),
  description: yup.string().required("Description is required"),
  banner_url: yup.string().required("Banner is required"),
  video_thumbnail: yup.string().required("Video thumbnail is required"),
});
