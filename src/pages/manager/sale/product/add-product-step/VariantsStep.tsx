import { useOutletContext, type NavigateFunction } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, ImageIcon, Package, Box } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productVariantSchema } from "@/libs/validation/productValidation";
import { VariationForm } from "@/components/manage/sale/product/form/VariationForm";
import type { ProductData, ProductVariant } from "@/libs/types/product";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/libs/stores";
import { createVariantProductThunk } from "@/libs/stores/productManager/thunk";
import { getItem } from "@/libs/local-storage";
import { toast } from "sonner";
import { convertNumberToCurrency } from "@/libs/helper/helper";

const VariantsStep = () => {
  const dispatch = useAppDispatch();
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setOnSubmitStep, steps, currentStep, navigate, state, setIsDisabled } = useOutletContext<{
    setOnSubmitStep: React.Dispatch<React.SetStateAction<null | (() => Promise<void>)>>;
    steps: { path: string; label: string }[];
    currentStep: number;
    navigate: NavigateFunction;
    state: any;
    setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  }>();

  const form = useForm<ProductVariant>({
    resolver: yupResolver(productVariantSchema),
    defaultValues: {
      name: "",
      price: null,
      current_stock: 0,
      capacity: null,
      capacity_unit: "ML",
      container_type: "BOTTLE",
      dispenser_type: "PUMP",
      description: "",
      story: null,
      uses: "",
      attributes: [],
      is_default: false,
      type: state?.productType,
      expiry_date: null,
      manufacture_date: null,
      instructions: "",
    },
  });

  const handleDeleteVariant = (variantName: string) => {
    setVariants(variants.filter((v) => v.name !== variantName));
  };

  const handleAddVariant = async (data: ProductVariant) => {
    const currentProduct = getItem<ProductData>("currentProduct");

    if (!currentProduct) {
      toast.error("No product found. Please create a product first.");
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(
        createVariantProductThunk({ payload: data, productId: String(currentProduct?.id) }),
      ).unwrap();

      toast.success("Product variant added successfully!");
      setVariants([...variants, data]);
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast.error((error as string) || "Failed to add product variant");
      console.error("Error adding variant:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Enable Next button if at least one variant is added, or always enable for standard products
    if (state?.productType === "STANDARD" || variants.length > 0) {
      setIsDisabled(false);
      setOnSubmitStep(() => async () => navigate(steps[currentStep]?.path));
    } else {
      setIsDisabled(true);
    }
  }, [dispatch, variants, state, setIsDisabled, setOnSubmitStep, navigate, steps, currentStep]);

  return (
    <div className="bg-white p-6 rounded-lg mt-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Product Variants</h2>
          <p className="text-sm text-gray-500 mt-1">Manage different variations of your product</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
              Add Variant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Add New Variant</DialogTitle>
            </DialogHeader>
            <VariationForm
              form={form}
              onSubmit={handleAddVariant}
              setOnSubmitStep={setOnSubmitStep}
              steps={steps}
              currentStep={currentStep}
              navigate={navigate}
              state={state}
              isDisabled={false}
              setIsDisabled={setIsDisabled}
            />
          </DialogContent>
        </Dialog>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-16 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="mb-4">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-300" />
          </div>
          <p className="text-lg font-semibold text-gray-700 mb-2">No variants created yet</p>
          <p className="text-sm text-gray-500 mb-6">
            Click "Add Variant" to create your first product variant
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center gap-2"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
            Create First Variant
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {variants.map((variant, index) => (
            <Card
              key={`${variant.name}-${index}`}
              className="border border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {variant.name}
                      </CardTitle>
                      {variant.is_default && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        Type: {variant.type}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {convertNumberToCurrency(Number(variant?.price?.toFixed(2)))}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Box className="w-4 h-4" />
                        {variant.capacity} {variant.capacity_unit}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteVariant(variant.name)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Container Type</p>
                    <p className="text-gray-900">{variant.container_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Dispenser Type</p>
                    <p className="text-gray-900">{variant.dispenser_type}</p>
                  </div>
                  {variant.current_stock !== undefined && (
                    <div>
                      <p className="text-gray-500 font-medium mb-1">Current Stock</p>
                      <p className="text-gray-900">{variant.current_stock} units</p>
                    </div>
                  )}
                  {variant.attributes.length > 0 && (
                    <div className="col-span-2">
                      <p className="text-gray-500 font-medium mb-1">Attributes</p>
                      <div className="flex flex-wrap gap-2">
                        {variant.attributes.map((attr, attrIndex) => (
                          <span
                            key={attrIndex}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                          >
                            {attr.ingredients}: {attr.value} {attr.unit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantsStep;
