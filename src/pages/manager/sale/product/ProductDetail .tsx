import { ProductFormMode } from "@/enums/product";
import { useLocation } from "react-router";

const ProductDetail = () => {
  const { state } = useLocation();

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

  return (
    <>
      <div className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold">{renderForm()}</h1>
      </div>
    </>
  );
};

export default ProductDetail;
