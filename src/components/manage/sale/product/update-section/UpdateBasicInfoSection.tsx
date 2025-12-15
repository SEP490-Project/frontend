import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductCategory } from "@/libs/types/category";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";
import DatePicker from "@/components/date-picker";

interface UpdateBasicInfoSectionProps {
  form: UseFormReturn<any>;
  brands: any[];
  categories: ProductCategory[];
  onSubmit: (data: any, isLimited: boolean) => void;
}

export const UpdateBasicInfoSection = ({
  form,
  brands,
  categories,
  onSubmit,
}: UpdateBasicInfoSectionProps) => {
  const { productDetail } = useSelector((state: RootState) => state.manageProduct);
  const isLimitedProduct = productDetail?.data?.type === "LIMITED";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = form;

  // Get current datetime in ISO format for min attribute
  const today = new Date().toISOString().split("T")[0];

  const handleFormSubmit = (data: any) => {
    onSubmit(data, isLimitedProduct);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Basic Information - {isLimitedProduct ? "Limited Edition" : "Standard Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Product Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
            >
              <span className="text-red-600">*</span>
              Product Name
            </Label>
            <div className="col-span-3">
              <Input
                id="name"
                placeholder="Enter product name"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message as string}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Label
              htmlFor="category_id"
              className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
            >
              <span className="text-red-600">*</span>
              Category
            </Label>
            <div className="col-span-3">
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={errors.category_id ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-70">
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category_id && (
                <p className="text-sm text-red-500 mt-1">{errors.category_id.message as string}</p>
              )}
            </div>
          </div>

          {/* Brand */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Label
              htmlFor="brand_id"
              className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
            >
              <span className="text-red-600">*</span>
              Brand
            </Label>
            <div className="col-span-3">
              <Controller
                name="brand_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      disabled={true}
                      className={errors.brand_id ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                    <SelectContent className="max-h-70">
                      {brands?.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.brand_id && (
                <p className="text-sm text-red-500 mt-1">{errors.brand_id.message as string}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
            >
              Description
            </Label>
            <div className="col-span-3">
              <Textarea
                id="description"
                placeholder="Enter product description"
                rows={4}
                {...register("description")}
              />
            </div>
          </div>

          {/* Limited Product Fields */}
          {isLimitedProduct && (
            <>
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 text-yellow-900">
                  Limited Edition Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Label
                  htmlFor="premiere_date"
                  className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
                >
                  <span className="text-red-600">*</span>
                  Achievable Quantity
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="achievable_quantity"
                    control={control}
                    render={({ field }) => (
                      <Input id="achievable_quantity" type="number" min={1} {...field} />
                    )}
                  />
                  {errors.achievable_quantity && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.achievable_quantity.message as string}
                    </p>
                  )}
                </div>
              </div>

              {/* Premiere Date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Label
                  htmlFor="premiere_date"
                  className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
                >
                  <span className="text-red-600">*</span>
                  Premiere Date
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="premiere_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        dateFormat="dd/MM/yyyy hh:mm"
                        minDate={today}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Availability Start Date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Label
                  htmlFor="availability_start_date"
                  className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
                >
                  <span className="text-red-600">*</span>
                  Start Sale Date
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="availability_start_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        dateFormat="dd/MM/yyyy hh:mm"
                        minDate={today}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Availability End Date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Label
                  htmlFor="availability_end_date"
                  className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
                >
                  <span className="text-red-600">*</span>
                  End Sale Date
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="availability_end_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        dateFormat="dd/MM/yyyy hh:mm"
                        minDate={today}
                      />
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={!isDirty}
            >
              Reset Changes
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={!isDirty}>
              Update Information
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
