import { ProductFormMode } from "@/enums/product";
import { useLocation } from "react-router";
import {
  AdditionalInfosSection,
  BasicInfosSection,
  ImportProductForm,
  VariationsSection,
} from "./ProductForm";
// import type { Product } from "../mock-data/sale-mock-data";
import React from "react";
import { Button } from "@/components/ui/button";

const ProductDetail = () => {
  const { state } = useLocation();
  // const [basicDatas, setBasicDatas] = React.useState<Product[]>([]);

  const renderForm = () => {
    switch (state?.type) {
      case ProductFormMode.CREATE:
        return "Create Product";
      case ProductFormMode.EDIT:
        return "Edit Product";
      case ProductFormMode.VIEW:
        return "View Product";
      default:
        return null;
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-semibold">{renderForm()}</h1>
          {state?.type === ProductFormMode.CREATE && (
            <ImportProductForm onImportData={handleImportData} />
          )}

          <BasicInfosSection />
          <AdditionalInfosSection />
          <VariationsSection />
        </div>
      </div>

      <div className="border-gray-200 sticky bottom-0 bg-white min-h-fit border-t flex justify-end items-center px-4 py-2 gap-2">
        <Button size={"sm"}>Next</Button>
      </div>
    </>
  );
};

export default ProductDetail;
