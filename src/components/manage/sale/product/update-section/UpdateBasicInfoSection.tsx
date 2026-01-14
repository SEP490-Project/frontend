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
    <Card className="overflow-hidden border-0 shadow-lg shadow-slate-200/50 bg-white">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Basic Information</CardTitle>
            <p className="text-sm text-slate-500 mt-0.5">
              {isLimitedProduct ? "Limited Edition Product Details" : "Standard Product Details"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Product Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 items-start">
            <Label
              htmlFor="name"
              className="text-sm font-semibold text-slate-700 sm:text-right flex items-center gap-1 sm:justify-end pt-2.5"
            >
              <span className="text-red-500">*</span>
              Product Name
            </Label>
            <div className="col-span-3">
              <Input
                id="name"
                placeholder="Enter product name"
                {...register("name")}
                className={`h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors ${errors.name ? "border-red-500 focus:ring-red-500" : "focus:border-primary focus:ring-primary"}`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.name.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 items-start">
            <Label
              htmlFor="category_id"
              className="text-sm font-semibold text-slate-700 sm:text-right flex items-center gap-1 sm:justify-end pt-2.5"
            >
              <span className="text-red-500">*</span>
              Category
            </Label>
            <div className="col-span-3">
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`h-11 bg-slate-50/50 border-slate-200 ${errors.category_id ? "border-red-500" : "focus:border-primary"}`}
                    >
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
                <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.category_id.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Brand */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 items-start">
            <Label
              htmlFor="brand_id"
              className="text-sm font-semibold text-slate-700 sm:text-right flex items-center gap-1 sm:justify-end pt-2.5"
            >
              <span className="text-red-500">*</span>
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
                      className={`h-11 bg-slate-100 border-slate-200 ${errors.brand_id ? "border-red-500" : ""}`}
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
                <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.brand_id.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 items-start">
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-slate-700 sm:text-right pt-2.5"
            >
              Description
            </Label>
            <div className="col-span-3">
              <Textarea
                id="description"
                placeholder="Enter product description"
                rows={4}
                {...register("description")}
                className="bg-slate-50/50 border-slate-200 focus:bg-white focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          {/* Limited Product Fields */}
          {isLimitedProduct && (
            <>
              <div className="relative pt-8 mt-6">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                    <svg
                      className="w-5 h-5 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Limited Edition Information
                  </h3>
                </div>
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
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={!isDirty}
              className="px-6 border-slate-200 hover:bg-slate-50"
            >
              Reset Changes
            </Button>
            <Button
              type="submit"
              className="px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
              disabled={!isDirty}
            >
              Update Information
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
