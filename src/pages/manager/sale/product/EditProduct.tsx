import { useState } from "react";
import { UpdateBasicInfoSection } from "@/components/manage/sale/product/update-section/UpdateBasicInfoSection";
import { UpdateVariantSection } from "@/components/manage/sale/product/update-section/UpdateVariantSection";
import { useBrand } from "@/libs/hooks/useBrand";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { brand } from "@/libs/stores/brandManager/thunk";
import {
  getProductDetailThunk,
  updateProductBasicInfoThunk,
  updateLimitedProductBasicInfoThunk,
  updateProductVariantThunk,
  updateLimitedProductVariantThunk,
  createVariantProductThunk,
} from "@/libs/stores/productManager/thunk";
import { getAllCategoriesThunk } from "@/libs/stores/categoryManager/thunk";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Task } from "@/libs/types/task";
import type { ProductVariant } from "@/libs/types/product";
import { updateProductStateThunk } from "@/libs/stores/stateManager/thunk";
import UpdateConceptSection from "@/components/manage/sale/product/update-section/UpdateConceptSection";

const updateProductBasicInfoSchema = yup.object({
  brand_id: yup.string().required("Brand is required"),
  category_id: yup.string().required("Category is required"),
  name: yup.string().required("Product name is required"),
  description: yup.string().nullable(),
});

const updateLimitedProductBasicInfoSchema = yup.object({
  brand_id: yup.string().required("Brand is required"),
  category_id: yup.string().required("Category is required"),
  concept_id: yup.string().nullable(),
  name: yup.string().required("Product name is required"),
  description: yup.string().nullable(),
  premiere_date: yup.string().required("Premiere date is required"),
  availability_end_date: yup.string().required("Availability end date is required"),
  availability_start_date: yup.string().required("Availability start date is required"),
  achievable_quantity: yup
    .number()
    .min(1, "Achievable quantity cannot be negative")
    .required("Achievable quantity is required"),
});

const updateLimitedProductVariantSchema = yup.object({
  capacity: yup.number().required("Capacity is required").positive("Capacity must be positive"),
  capacity_unit: yup.string().required("Capacity unit is required"),
  container_type: yup.string().required("Container type is required"),
  dispenser_type: yup.string().required("Dispenser type is required"),
  expiry_date: yup.string().required("Expiry date is required"),
  height: yup.number().required("Height is required").positive("Height must be positive"),
  input_stock: yup.number().required("Input stock is required").min(0, "Stock cannot be negative"),
  instrucstions: yup.string().nullable(),
  is_default: yup.boolean().required("Is default is required"),
  length: yup.number().required("Length is required").positive("Length must be positive"),
  manufacturing_date: yup.string().required("Manufacturing date is required"),
  // max_stock: yup.number().required("Max stock is required").positive("Max stock must be positive"),
  pre_order_limit: yup
    .number()
    .required("Pre order limit is required")
    .positive("Pre order limit must be positive"),
  price: yup.number().required("Price is required").min(1000, "Price must be at least 1000"),
  uses: yup.string().nullable(),
  weight: yup.number().required("Weight is required").positive("Weight must be positive"),
  width: yup.number().required("Width is required").positive("Width must be positive"),
});

const updateStandardProductVariantSchema = yup.object({
  capacity: yup.number().required("Capacity is required").positive("Capacity must be positive"),
  capacity_unit: yup.string().required("Capacity unit is required"),
  container_type: yup.string().required("Container type is required"),
  dispenser_type: yup.string().required("Dispenser type is required"),
  expiry_date: yup.date().required("Expiry date is required"),
  height: yup.number().required("Height is required").positive("Height must be positive"),
  // input_stock: yup.number().required("Input stock is required").min(0, "Stock cannot be negative"),
  instrucstions: yup.string().nullable(),
  is_default: yup.boolean().required("Is default is required"),
  length: yup.number().required("Length is required").positive("Length must be positive"),
  manufacturing_date: yup.date().required("Manufacturing date is required"),
  price: yup.number().required("Price is required").min(1000, "Price must be at least 1000"),
  uses: yup.string().nullable(),
  weight: yup.number().required("Weight is required").positive("Weight must be positive"),
  width: yup.number().required("Width is required").positive("Width must be positive"),
});

const EditProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id, task } = state as {
    id: string;
    task: Task;
    formType: string;
    productType: string;
  };
  const { brands, loading: brandsLoading } = useBrand();

  const { productDetail, isLoading } = useSelector((state: RootState) => state.manageProduct);
  const { categories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.manageCategory,
  );

  const [params] = useState({ page: 1, limit: 100 });

  const isLimitedProduct = productDetail?.data?.type === "LIMITED";
  const productId = id || task?.product_id || null;

  const standardBasicInfoForm = useForm({
    resolver: yupResolver(updateProductBasicInfoSchema),
  });
  const limitedBasicInfoForm = useForm({
    resolver: yupResolver(updateLimitedProductBasicInfoSchema),
  });
  const limitedVariantForm = useForm({
    resolver: yupResolver(updateLimitedProductVariantSchema),
  });
  const standardVariantForm = useForm({
    resolver: yupResolver(updateStandardProductVariantSchema),
  });

  useEffect(() => {
    if (productId) {
      dispatch(getProductDetailThunk(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await dispatch(getAllCategoriesThunk(params)).unwrap();
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, [dispatch, params]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        await dispatch(brand(params)).unwrap();
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        toast.error("Failed to load brands");
      }
    };

    fetchBrands();
  }, [dispatch, params]);

  useEffect(() => {
    if (productDetail?.data) {
      const data = productDetail.data;

      if (isLimitedProduct) {
        limitedBasicInfoForm.reset({
          brand_id: data.brand_id || "",
          category_id: data.category?.id || "",
          concept_id: (data as any).concept?.id || "",
          name: data.name || "",
          description: data.description || "",
          premiere_date: (data as any).limited_product?.premiere_date?.split("T")[0] || "",
          availability_start_date:
            (data as any).limited_product?.availability_start_date?.split("T")[0] || "",
          availability_end_date:
            (data as any).limited_product?.availability_end_date?.split("T")[0] || "",
          achievable_quantity: (data as any).limited_product?.achievable_quantity || "",
        });
      } else {
        standardBasicInfoForm.reset({
          brand_id: data.brand_id || "",
          category_id: data.category?.id || "",
          name: data.name || "",
          description: data.description || "",
        });
      }
    }
  }, [productDetail, isLimitedProduct, limitedBasicInfoForm, standardBasicInfoForm]);

  const handleUpdateBasicInfo = async (data: any, isLimited: boolean) => {
    if (!productId) return;
    try {
      if (isLimited) {
        await dispatch(updateLimitedProductBasicInfoThunk({ productId: id, data })).unwrap();
      } else {
        await dispatch(updateProductBasicInfoThunk({ productId: id, data })).unwrap();
      }

      dispatch(getProductDetailThunk(productId));
    } catch (error) {
      toast.error((error as string) || "Failed to update product basic information");
    }
  };

  const handleUpdateVariant = async (variantId: string, isLimited: boolean, data: any) => {
    if (!productId) return;
    try {
      if (isLimited) {
        await dispatch(updateLimitedProductVariantThunk({ variantId, data })).unwrap();
      } else {
        await dispatch(updateProductVariantThunk({ variantId, data })).unwrap();
      }
      dispatch(getProductDetailThunk(productId));
    } catch (error) {
      toast.error((error as string) || "Failed to update product variant");
    }
  };

  const handleCreateVariant = async (data: ProductVariant) => {
    if (!productId) return;
    try {
      await dispatch(
        createVariantProductThunk({
          payload: data,
          productId: productId!,
        }),
      ).unwrap();
      toast.success("Variant created successfully");
      dispatch(getProductDetailThunk(productId));
    } catch (error) {
      toast.error((error as string) || "Failed to create product variant");
    }
  };

  const handleConceptUpdated = async () => {
    if (productId) {
      dispatch(getProductDetailThunk(productId));
    }
  };

  const handleReSubmitToBrand = async () => {
    if (!productId) return;
    const result = await dispatch(
      updateProductStateThunk({ productId: productId, newState: "SUBMITTED" }),
    );
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Product submitted for review successfully");
    } else {
      toast.error("Failed to submit product for review");
    }
    navigate("/manage/sale/product");
  };

  if ((isLoading && !productDetail) || categoriesLoading || brandsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  const handleSaveDraft = async () => {
    if (!productId) return;
    const result = await dispatch(
      updateProductStateThunk({ productId: productId, newState: "DRAFT" }),
    );
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Product saved as draft successfully");
    } else {
      toast.error("Failed to save product as draft");
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="bg-white"
            size="sm"
            onClick={() =>
              productDetail?.data.type === "STANDARD"
                ? navigate("/manage/sale/product")
                : navigate("/manage/sale/product/limited")
            }
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Edit Product</h1>
            <p className="text-sm text-gray-600 mt-1">{productDetail?.data?.name}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <UpdateBasicInfoSection
          form={isLimitedProduct ? limitedBasicInfoForm : standardBasicInfoForm}
          brands={brands}
          categories={categories?.data || []}
          onSubmit={handleUpdateBasicInfo}
        />

        {productDetail?.data?.type === "LIMITED" && (
          <UpdateConceptSection
            conceptId={(productDetail?.data as any)?.concept?.id || null}
            productId={productId || ""}
            onConceptUpdated={handleConceptUpdated}
          />
        )}
        <UpdateVariantSection
          form={isLimitedProduct ? limitedVariantForm : standardVariantForm}
          onSubmit={handleUpdateVariant}
          onCreateVariant={handleCreateVariant}
        />
        {productDetail?.data.type === "LIMITED" &&
          ["REVISION", "DRAFT"].includes(productDetail?.data?.status || "") && (
            <div className="bg-white p-3 flex justify-end absolute bottom-0 right-0 w-full border-t">
              {productDetail?.data?.status === "DRAFT" ? (
                <Button variant="default" onClick={handleReSubmitToBrand}>
                  Submit for Approval
                </Button>
              ) : (
                <Button variant="default" onClick={handleSaveDraft}>
                  Save Draft
                </Button>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default EditProduct;
