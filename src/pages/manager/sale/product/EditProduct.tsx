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
});

const updateLimitedProductVariantSchema = yup.object({
  capaity: yup.number().required("Capacity is required").positive("Capacity must be positive"),
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
  max_stock: yup.number().required("Max stock is required").positive("Max stock must be positive"),
  pre_order_limit: yup
    .number()
    .required("Pre order limit is required")
    .positive("Pre order limit must be positive"),
  price: yup.number().required("Price is required").min(1000, "Price must be at least 1000"),
  uses: yup.string().required("Uses is required"),
  weight: yup.number().required("Weight is required").positive("Weight must be positive"),
  width: yup.number().required("Width is required").positive("Width must be positive"),
});

const updateStandardProductVariantSchema = yup.object({
  capaity: yup.number().required("Capacity is required").positive("Capacity must be positive"),
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
  price: yup.number().required("Price is required").min(1000, "Price must be at least 1000"),
  uses: yup.string().required("Uses is required"),
  weight: yup.number().required("Weight is required").positive("Weight must be positive"),
  width: yup.number().required("Width is required").positive("Width must be positive"),
});

const EditProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = state as { id: string };
  const { brands } = useBrand();

  const { productDetail, isLoading } = useSelector((state: RootState) => state.manageProduct);
  const { categories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.manageCategory,
  );

  const [params] = useState({ page: 1, limit: 100 });

  const isLimitedProduct = productDetail?.data?.type === "LIMITED";

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
    if (id) {
      dispatch(getProductDetailThunk(id));
    }
  }, [dispatch, id]);

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
  }, [productDetail, isLimitedProduct]);

  const handleUpdateBasicInfo = async (data: any, isLimited: boolean) => {
    try {
      if (isLimited) {
        await dispatch(updateLimitedProductBasicInfoThunk({ productId: id, data })).unwrap();
      } else {
        await dispatch(updateProductBasicInfoThunk({ productId: id, data })).unwrap();
      }
      toast.success("Product basic information updated successfully!");
      // Refresh product detail
      dispatch(getProductDetailThunk(id));
    } catch (error) {
      toast.error((error as string) || "Failed to update product basic information");
    }
  };

  const handleUpdateVariant = async (variantId: string, isLimited: boolean, data: any) => {
    try {
      if (isLimited) {
        await dispatch(updateLimitedProductVariantThunk({ variantId, data })).unwrap();
      } else {
        await dispatch(updateProductVariantThunk({ variantId, data })).unwrap();
      }
      toast.success("Product variant updated successfully!");
      // Refresh product detail
      dispatch(getProductDetailThunk(id));
    } catch (error) {
      toast.error((error as string) || "Failed to update product variant");
    }
  };

  if ((isLoading && !productDetail) || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/manage/sale/product")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Edit Product</h1>
            <p className="text-sm text-gray-600 mt-1">{productDetail?.data?.name}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <UpdateBasicInfoSection
          form={isLimitedProduct ? limitedBasicInfoForm : standardBasicInfoForm}
          brands={brands}
          categories={categories?.data || []}
          onSubmit={handleUpdateBasicInfo}
        />

        <UpdateVariantSection
          form={isLimitedProduct ? limitedVariantForm : standardVariantForm}
          onSubmit={handleUpdateVariant}
        />
      </div>
    </div>
  );
};

export default EditProduct;
