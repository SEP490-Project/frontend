import * as yup from "yup";
import type {
  AttributeUnit,
  CapacityUnit,
  ContainerType,
  CreateProductPayload,
  CreateLimitedProductPayload,
  DispenserType,
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
        premiere_date: yup.string().required("Premiere date is required"),
        availability_start_date: yup.string().required("Start sale date is required"),
        availability_end_date: yup.string().required("End sale date is required"),
        bought_limit: yup
          .number()
          .min(1, "Purchase limit must be at least 1")
          .required("Purchase limit is required"),
        max_stock: yup
          .number()
          .min(1, "Max stock must be at least 1")
          .required("Max stock is required"),
        is_free_shipping: yup.boolean().required(),
        concept_id: yup.string().optional(),
      })
      .required("Limited attributes are required"),
  },
);

export const productVariantSchema: yup.ObjectSchema<ProductVariant> = yup.object({
  id: yup.string().optional(),
  name: yup.string().required("Name is required"),
  current_stock: yup.number().nullable().optional().min(0, "Current stock must be at least 0"),
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
  capacity_unit: yup.mixed<CapacityUnit>().required("Capacity unit is required"),
  container_type: yup.mixed<ContainerType>().required("Container type is required"),
  dispenser_type: yup.mixed<DispenserType>().required("Dispenser type is required"),
  manufacture_date: yup.date().nullable().default(null),
  expiry_date: yup.date().nullable().default(null),
  attributes: yup
    .array()
    .of(
      yup.object({
        attribute_id: yup.string().required("Attribute ID is required"),
        unit: yup.mixed<AttributeUnit>().required("Unit is required"),
        value: yup
          .number()
          .typeError("Value must be a number")
          .required("Value is required")
          .min(0, "Value must be positive")
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
  instructions: yup.string().required("Instructions are required"),
  description: yup.string().nullable().optional(),
  story: yup.string().nullable().optional(),
  type: yup.string().required("Type is required"),
  uses: yup.string().nullable().default(null),
});
