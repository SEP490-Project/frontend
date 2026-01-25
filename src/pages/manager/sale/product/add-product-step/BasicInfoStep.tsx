import { AdditionalInfoForm } from "@/components/manage/sale/product/form/AdditionalForm";
import { BasicInfoForm } from "@/components/manage/sale/product/form/BasicInfoForm";
import {
  type CreateLimitedProductPayload,
  type ProductData,
  type ProductResponse,
  type CreateStandardProductPayload,
} from "@/libs/types/product";
import {
  createStandardProductSchema,
  createLimitedProductSchema,
} from "@/libs/validation/productValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext, type NavigateFunction } from "react-router";
import { getItem } from "@/libs/local-storage";
import TaskDisplayForm from "@/components/manage/sale/product/form/TaskDisplayForm";
import { Loader2 } from "lucide-react";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { useSelector } from "react-redux";
import { getTaskDetailById } from "@/libs/stores/taskManager/thunk";

const BasicInfoStep = () => {
  const { setOnSubmitStep, steps, currentStep, navigate, state, setIsDisabled, isDisabled } =
    useOutletContext<{
      setOnSubmitStep: React.Dispatch<React.SetStateAction<null | (() => Promise<void>)>>;
      steps: { path: string; label: string }[];
      currentStep: number;
      navigate: NavigateFunction;
      state: any;
      isDisabled: boolean;
      setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    }>();

  const dispatch = useAppDispatch();
  const taskId = state?.task?.id;
  const { taskDetailById, detailLoading } = useSelector((state: RootState) => state.manageTask);

  const [isCreating, setIsCreating] = useState(false);
  const isLimitedProduct = state?.productType === "LIMITED";

  const standardForm = useForm<CreateStandardProductPayload>({
    resolver: yupResolver(createStandardProductSchema),
    defaultValues: {
      brand_id: null,
      category_id: "",
      brand_place_holder: "",
      description: null,
      name: "",
    },
  });

  const limitedForm = useForm<CreateLimitedProductPayload>({
    resolver: yupResolver(createLimitedProductSchema),
    defaultValues: {
      brand_id: "",
      category_id: "",
      description: null,
      name: "",
      task_id: state?.task?.id || "",
      limited_attribute: {
        achievable_quantity: 1,
        premiere_date: "",
        availability_start_date: "",
        availability_end_date: "",
        is_free_shipping: true,
        concept_id: undefined,
      },
    },
  });

  const form = isLimitedProduct ? limitedForm : standardForm;

  // Fetch task details if taskId exists
  useEffect(() => {
    if (!taskId) return;
    dispatch(getTaskDetailById(taskId)).unwrap();
  }, [dispatch, taskId]);

  // Load task data into form after it's fetched
  useEffect(() => {
    if (!taskDetailById?.data || !isLimitedProduct) return;

    const existingProduct = getItem<ProductResponse<ProductData>>("currentProduct");
    // Only set task data if there's no existing product
    if (existingProduct?.data?.id) return;

    const taskData = taskDetailById.data;

    limitedForm.reset({
      brand_id: taskData.brand_info?.id || "",
      category_id: "",
      description: taskData.description?.product_description || null,
      name: taskData.description?.product_name || "",
      task_id: taskData.id || "",
      limited_attribute: {
        achievable_quantity: 1,
        premiere_date: "",
        availability_start_date: "",
        availability_end_date: taskData.campaign_details.end_date,
        is_free_shipping: true,
        concept_id: undefined,
      },
    });
  }, [taskDetailById, isLimitedProduct, limitedForm]);

  // Load existing product data from localStorage
  useEffect(() => {
    const existingProduct = getItem<ProductResponse<ProductData>>("currentProduct");
    if (existingProduct?.data?.id) {
      const productData = existingProduct.data;
      if (isLimitedProduct) {
        limitedForm.reset({
          name: productData.name,
          category_id: productData.category?.id?.toString() || "",
          brand_id: productData.brand_id?.toString() || "",
          description: productData.description || null,
          task_id: (productData as any).task_id || "",
          limited_attribute: {
            achievable_quantity: (productData as any).limited_product?.achievable_quantity || 1,
            premiere_date: (productData as any).limited_product?.premiere_date || "",
            availability_start_date:
              (productData as any).limited_product?.availability_start_date || "",
            availability_end_date:
              (productData as any).limited_product?.availability_end_date || "",
            is_free_shipping: (productData as any).limited_product?.is_free_shipping ?? true,
            concept_id: (productData as any).limited_product?.concept_id || undefined,
          },
        });
      } else {
        standardForm.reset({
          name: productData.name,
          category_id: productData.category?.id?.toString() || "",
          brand_place_holder: productData.brand_place_holder || "",
          brand_id: productData.brand_id?.toString() || "",
          description: productData.description || null,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-lg font-semibold">Creating product...</p>
            <p className="text-sm text-gray-500">Please wait while we process your request</p>
          </div>
        </div>
      )}
      {state?.productType === "LIMITED" && (
        <TaskDisplayForm taskDetailById={taskDetailById} detailLoading={detailLoading} />
      )}
      <BasicInfoForm
        form={form as any}
        setOnSubmitStep={setOnSubmitStep}
        steps={steps}
        currentStep={currentStep}
        navigate={navigate}
        state={state}
        setIsDisabled={setIsDisabled}
        isDisabled={isDisabled}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        taskDetailById={taskDetailById}
        detailLoading={detailLoading}
      />
      {isLimitedProduct && <AdditionalInfoForm form={limitedForm} />}
    </>
  );
};

export default BasicInfoStep;
