import { getBrandIdFromToken } from "@/libs/helper";

export const useBrandId = () => {
  const brandId = getBrandIdFromToken();

  return {
    brandId,
    isLoggedIn: !!brandId,
  };
};
