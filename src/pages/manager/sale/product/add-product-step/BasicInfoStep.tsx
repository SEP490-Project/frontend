import { AdditionalInfosSection } from "@/components/manage/sale/product/form/AdditionalForm";
import { BasicInfosSection } from "@/components/manage/sale/product/form/BasicInfoForm";
import { useLocation } from "react-router";

const BasicInfoStep = () => {
  const { state } = useLocation();

  return (
    <>
      <BasicInfosSection />
      {state?.productType === "LIMITED" && <AdditionalInfosSection />}
    </>
  );
};

export default BasicInfoStep;
