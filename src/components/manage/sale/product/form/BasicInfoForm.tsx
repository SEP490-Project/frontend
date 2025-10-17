import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useBrand } from "@/libs/hooks/useBrand";
import { useAppDispatch } from "@/libs/stores";
import { brand } from "@/libs/stores/brandManager/thunk";
import { useEffect, useState } from "react";

export const BasicInfosSection = () => {
  const dispatch = useAppDispatch();
  const { brands } = useBrand();
  const [params] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    dispatch(brand(params));
  }, [dispatch, params]);

  return (
    <div className="bg-white p-6 rounded-lg mt-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
      <form>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label
            htmlFor="productName"
            className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
          >
            <span className="text-red-600">*</span>
            Product Name
          </label>
          <Input id="productName" placeholder="Input" className="col-span-3" autoComplete="off" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label
            htmlFor="productCategory"
            className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
          >
            <span className="text-red-600">*</span>
            Category
          </label>
          <Input
            id="productCategory"
            placeholder="Input"
            className="col-span-3"
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label
            htmlFor="productSubCategory"
            className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
          >
            Sub Category
          </label>
          <Input
            id="productSubCategory"
            placeholder="Input"
            className="col-span-3"
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label
            htmlFor="productBrand"
            className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
          >
            <span className="text-red-600">*</span>
            Brand
          </label>
          <Select>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>
            <SelectContent>
              {brands?.map((brand) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label
            htmlFor="productPrice"
            className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
          >
            <span className="text-red-600">*</span>
            Price
          </label>
          <Input
            id="productPrice"
            type="number"
            min={0}
            placeholder="Input"
            className="col-span-3"
            autoComplete="off"
          />
        </div>
      </form>
    </div>
  );
};
