import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useProduct = () => {
  const { isLoading, products, productDetail, limitedProducts } = useSelector(
    (state: RootState) => state.manageProduct,
  );
  return { isLoading, products, productDetail, limitedProducts };
};
