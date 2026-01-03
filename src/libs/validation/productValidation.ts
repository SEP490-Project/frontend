import * as yup from "yup";
import type {
  CreateProductPayload,
  CreateLimitedProductPayload,
  ProductVariant,
} from "../types/product";

export const createStandardProductSchema: yup.ObjectSchema<CreateProductPayload> = yup.object({
  name: yup.string().required("Product name is required"),
  category_id: yup.string().required("Category is required"),
  brand_id: yup.string().required("Brand is required"),
  description: yup.string().nullable().optional(),
});

export const createLimitedProductSchema: yup.ObjectSchema<CreateLimitedProductPayload> = yup.object(
  {
    name: yup.string().required("Product name is required"),
    category_id: yup.string().required("Category is required"),
    brand_id: yup.string().required("Brand is required"),
    description: yup.string().nullable().optional(),
    task_id: yup.string().optional(),
    limited_attribute: yup
      .object({
        achievable_quantity: yup
          .number()
          .min(1, "Achievable quantity must be at least 1")
          .optional(),
        premiere_date: yup.string().required("Premiere date is required"),
        availability_start_date: yup.string().required("Start sale date is required"),
        availability_end_date: yup.string().required("End sale date is required"),
        is_free_shipping: yup.boolean().required(),
        concept_id: yup.string().nullable().optional(),
      })
      .required("Limited attributes are required"),
  },
);

export const productVariantSchema: yup.ObjectSchema<ProductVariant> = yup.object({
  id: yup.string().optional(),
  name: yup.string().required("Name is required"),
  input_stock: yup
    .number()
    .min(1, "Max stock must be at least 1")
    .test(
      "larger-than-pre-order",
      "Max stock must be larger than or equal to preorder limit",
      function (value) {
        const { pre_order_limit } = this.parent;
        if (pre_order_limit !== undefined && value !== undefined) {
          return value >= pre_order_limit;
        }
        return true;
      },
    )
    .required("Max stock is required"),
  pre_order_limit: yup.number().min(1, "Preorder limit must be at least 1").nullable().optional(),
  price: yup
    .number()
    .positive("Price must be a positive number")
    .min(1000, "Price must be at least 1000")
    .required("Price is required"),
  is_default: yup.boolean().required("Is default is required"),
  capacity: yup
    .number()
    .min(1, "Capacity must be at least 1")
    .positive("Capacity must be a positive number")
    .required("Capacity is required"),
  capacity_unit: yup.string().required("Capacity unit is required"),
  container_type: yup.string().required("Container type is required"),
  dispenser_type: yup.string().required("Dispenser type is required"),
  manufacturing_date: yup.date().nullable().default(null),
  expiry_date: yup.date().nullable().default(null),
  attributes: yup
    .array()
    .of(
      yup.object({
        attribute_id: yup.string().required("Attribute ID is required"),
        unit: yup.string().required("Unit is required"),
        value: yup
          .number()
          .typeError("Value must be a number")
          .required("Value is required")
          .min(0.1, "Value must be larger than or equal to 0.1")
          .test("if-is-percentage", "Percentage value must be between 0 and 100", function (value) {
            const { unit } = this.parent;
            if (unit === "%" && (value < 0 || value > 100)) {
              return false;
            }
            return true;
          }),
      }),
    )
    .required("Attributes are required"),
  instructions: yup.string().nullable().default(null),
  description: yup.string().nullable().optional(),
  story: yup.string().nullable().optional(),
  type: yup.string().required("Type is required"),
  uses: yup.string().nullable().default(null),
  weight: yup
    .number()
    .min(1, "Weight must be at least 1")
    .max(50000, "Weight must be at most 50000")
    .positive("Weight must be a positive number")
    .required("Weight is required"),
  height: yup
    .number()
    .min(1, "Height must be at least 1")
    .max(200, "Height must be at most 200")
    .positive("Height must be a positive number")
    .required("Height is required"),
  length: yup
    .number()
    .min(1, "Length must be at least 1")
    .max(200, "Length must be at most 200")
    .positive("Length must be a positive number")
    .required("Length is required"),
  width: yup
    .number()
    .min(1, "Width must be at least 1")
    .max(200, "Width must be at most 200")
    .positive("Width must be a positive number")
    .required("Width is required"),
  current_stock: yup.number().nullable().optional(),
});
