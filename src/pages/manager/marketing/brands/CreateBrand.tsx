import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";
import BrandInfo from "./component/create/BrandInfo";
import RepresentativeInfo from "./component/create/RepresentativeInfo";
import ReviewBrand from "./component/create/ReviewBrand";
import type { BrandBase } from "@/libs/types/brand";
import * as yup from "yup";
import { useAppDispatch } from "@/libs/stores";
import { useBrand } from "@/libs/hooks/useBrand";
import { addBrand } from "@/libs/stores/brandManager/thunk";
import { FaArrowLeft, FaArrowRight, FaRegCircle, FaRegCircleCheck } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formatUrl = (url: string): string => {
  if (!url) return "";
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
};

const formatPhoneToE164 = (phone: string): string => {
  if (!phone) return "";
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.startsWith("0")) {
    return `+84${digitsOnly.substring(1)}`;
  }
  if (digitsOnly.startsWith("84")) {
    return `+${digitsOnly}`;
  }
  if (phone.startsWith("+")) {
    return phone;
  }
  return `+84${digitsOnly}`;
};

const isValidE164 = (phone: string): boolean => {
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
};

const brandSchema = yup.object().shape({
  name: yup
    .string()
    .required("Brand name is required")
    .min(2, "Brand name must be at least 2 characters"),
  description: yup.string(),
  website: yup
    .string()
    .required("Website is required")
    .test("valid-url", "Please enter a valid website URL", (value) => {
      if (!value) return false;
      try {
        new URL(formatUrl(value));
        return true;
      } catch {
        return false;
      }
    }),
  logo_url: yup
    .string()
    .required("Logo URL is required")
    .test("valid-url", "Please enter a valid logo URL", (value) => {
      if (!value) return false;
      try {
        new URL(formatUrl(value));
        return true;
      } catch {
        return false;
      }
    }),
  contact_email: yup
    .string()
    .email("Please enter a valid email")
    .required("Contact email is required"),
  contact_phone: yup
    .string()
    .required("Contact phone is required")
    .test("valid-phone", "Please enter a valid phone number (e.g., 0123456789)", (value) => {
      if (!value) return false;
      const formatted = formatPhoneToE164(value);
      return isValidE164(formatted);
    }),
  address: yup.string().required("Address is required"),
  tax_number: yup
    .string()
    .required("Tax number is required")
    .matches(/^[\dA-Za-z-]{3,20}$/, "Please enter a valid tax number"),
});

const representativeSchema = yup.object().shape({
  representative_name: yup.string().required("Representative name is required"),
  representative_email: yup
    .string()
    .email("Please enter a valid email")
    .required("Representative email is required"),
  representative_phone: yup
    .string()
    .required("Representative phone is required")
    .test("valid-phone", "Please enter a valid phone number (e.g., 0123456789)", (value) => {
      if (!value) return false;
      const formatted = formatPhoneToE164(value);
      return isValidE164(formatted);
    }),
  representative_role: yup.string().required("Representative role is required"),
  representative_citizen_id: yup
    .string()
    .required("Citizen ID is required")
    .matches(/^\d{9,12}$/, "Citizen ID must be 9-12 digits"),
});

interface BrandData {
  name: string;
  description: string;
  website: string;
  logo_url: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  tax_number: string;
}

interface RepresentativeData {
  representative_name: string;
  representative_email: string;
  representative_phone: string;
  representative_role: string;
  representative_citizen_id: string;
}

interface FormData {
  brand: BrandData;
  representative: RepresentativeData;
}

const STEPS = [
  { key: "brand", label: "Brand Information", description: "Basic brand details" },
  { key: "representative", label: "Representative", description: "Representative information" },
  { key: "review", label: "Review & Submit", description: "Review all information" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

const CreateBrandPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useBrand();

  const [activeTab, setActiveTab] = useState<StepKey>("brand");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    brand: {
      name: "",
      description: "",
      website: "",
      logo_url: "",
      contact_email: "",
      contact_phone: "",
      address: "",
      tax_number: "",
    },
    representative: {
      representative_name: "",
      representative_email: "",
      representative_phone: "",
      representative_role: "",
      representative_citizen_id: "",
    },
  });

  const [errors, setErrors] = useState<{
    brand: Partial<BrandData>;
    representative: Partial<RepresentativeData>;
  }>({
    brand: {},
    representative: {},
  });

  const [maxStepReached, setMaxStepReached] = useState(0);
  const currentStepIndex = STEPS.findIndex((step) => step.key === activeTab);

  useEffect(() => {
    const effectiveIndex = Math.min(currentStepIndex, 2 - 1); // STEPS_COUNT = 2
    setMaxStepReached((prev) => Math.max(prev, effectiveIndex));
  }, [currentStepIndex]);

  // Early return for loading state (AFTER all hooks)
  if (loading) {
    return (
      <div className="min-h-fit p-4 sm:p-6">
        <div className="max-w-7xl mx-auto pb-10">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleBrandChange = (field: keyof BrandData, value: string) => {
    setFormData((prev) => ({ ...prev, brand: { ...prev.brand, [field]: value } }));
    if ((errors.brand as any)[field]) {
      setErrors((prev) => ({ ...prev, brand: { ...prev.brand, [field]: "" } }));
    }
  };

  const handleRepresentativeChange = (field: keyof RepresentativeData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      representative: { ...prev.representative, [field]: value },
    }));
    if ((errors.representative as any)[field]) {
      setErrors((prev) => ({ ...prev, representative: { ...prev.representative, [field]: "" } }));
    }
  };

  const handleLogoUpload = (uploadedUrl: string) => {
    console.log("Uploaded Logo URL:", uploadedUrl);
    setFormData((prev) => ({ ...prev, brand: { ...prev.brand, logo_url: uploadedUrl } }));
    if (errors.brand.logo_url) {
      setErrors((prev) => ({ ...prev, brand: { ...prev.brand, logo_url: "" } }));
    }
  };

  const validateBrandInfo = async (): Promise<boolean> => {
    try {
      await brandSchema.validate(formData.brand, { abortEarly: false });
      setErrors((prev) => ({ ...prev, brand: {} }));
      return true;
    } catch (err: any) {
      const brandErrors: Partial<BrandData> = {};
      err.inner?.forEach((e: any) => {
        if (e.path in formData.brand) brandErrors[e.path as keyof BrandData] = e.message;
      });
      setErrors((prev) => ({ ...prev, brand: brandErrors }));
      return false;
    }
  };

  const validateRepresentativeInfo = async (): Promise<boolean> => {
    try {
      await representativeSchema.validate(formData.representative, { abortEarly: false });
      setErrors((prev) => ({ ...prev, representative: {} }));
      return true;
    } catch (err: any) {
      const repErrors: Partial<RepresentativeData> = {};
      err.inner?.forEach((e: any) => {
        if (e.path in formData.representative)
          repErrors[e.path as keyof RepresentativeData] = e.message;
      });
      setErrors((prev) => ({ ...prev, representative: repErrors }));
      return false;
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const brandValid = await validateBrandInfo();
    const repValid = await validateRepresentativeInfo();
    return brandValid && repValid;
  };

  const isStepCompleted = (step: StepKey): boolean => {
    switch (step) {
      case "brand":
        return !!(
          formData.brand.name.trim() &&
          formData.brand.description.trim() &&
          formData.brand.contact_email.trim() &&
          formData.brand.contact_phone.trim() &&
          formData.brand.address.trim() &&
          formData.brand.tax_number.trim() &&
          formData.brand.website.trim() &&
          formData.brand.logo_url.trim()
        );
      case "representative":
        return !!(
          formData.representative.representative_name.trim() &&
          formData.representative.representative_email.trim() &&
          formData.representative.representative_phone.trim() &&
          formData.representative.representative_role.trim() &&
          formData.representative.representative_citizen_id.trim()
        );
      case "review":
        return isStepCompleted("brand") && isStepCompleted("representative");
      default:
        return false;
    }
  };

  const handleNextStep = async () => {
    const currentIndex = STEPS.findIndex((step) => step.key === activeTab);

    if (activeTab === "brand") {
      const isValid = await validateBrandInfo();
      if (!isValid) return;
    } else if (activeTab === "representative") {
      const isValid = await validateRepresentativeInfo();
      if (!isValid) return;
    }

    if (currentIndex < STEPS.length - 1) {
      setActiveTab(STEPS[currentIndex + 1].key);
    }
  };

  const handlePreviousStep = () => {
    const currentIndex = STEPS.findIndex((step) => step.key === activeTab);
    if (currentIndex > 0) {
      setActiveTab(STEPS[currentIndex - 1].key);
    }
  };

  const handleTabChange = (tabKey: string) => {
    const step = tabKey as StepKey;
    const currentIndex = STEPS.findIndex((s) => s.key === activeTab);
    const targetIndex = STEPS.findIndex((s) => s.key === step);

    if (targetIndex <= currentIndex || isStepCompleted(STEPS[targetIndex - 1]?.key)) {
      setActiveTab(step);
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (!isValid) {
      if (Object.keys(errors.brand).length) setActiveTab("brand");
      else if (Object.keys(errors.representative).length) setActiveTab("representative");
      return;
    }

    setIsSubmitting(true);
    try {
      const brandData: BrandBase = {
        name: formData.brand.name,
        description: formData.brand.description || undefined,
        contact_email: formData.brand.contact_email,
        contact_phone: formatPhoneToE164(formData.brand.contact_phone),
        address: formData.brand.address,
        website: formatUrl(formData.brand.website),
        logo_url: formatUrl(formData.brand.logo_url),
        representative_citizen_id: formData.representative.representative_citizen_id,
        representative_email: formData.representative.representative_email,
        representative_name: formData.representative.representative_name,
        representative_phone: formatPhoneToE164(formData.representative.representative_phone),
        representative_role: formData.representative.representative_role,
        tax_number: formData.brand.tax_number,
      };

      await dispatch(addBrand(brandData));
      setTimeout(() => {
        navigate("/manage/marketing/brands");
      }, 1000);
    } catch {
      // Handle error if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = isStepCompleted("brand") && isStepCompleted("representative");
  const STEPS_COUNT = 2;
  const completedSteps =
    Number(isStepCompleted("brand")) + Number(isStepCompleted("representative"));
  const progress = ((maxStepReached + 1) / STEPS_COUNT) * 100;

  const ReviewStep = () => (
    <motion.div
      key="review"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <ReviewBrand
        brandData={formData.brand}
        representativeData={formData.representative}
        canSubmit={canSubmit}
      />
    </motion.div>
  );

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="max-w-7xl mx-auto pb-10">
        {/* Back button and page description */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <motion.h1
            className="text-xl sm:text-2xl font-semibold"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.03 }}
          >
            Create Brand
          </motion.h1>
          <motion.p
            className="text-gray-600 mt-1 mb-4"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.06 }}
          >
            Please fill in all required information to create a new brand. You can review before
            submitting.
          </motion.p>
          <div className="flex flex-wrap items-center justify-between mb-8 gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/manage/marketing/brands")}
              className="flex items-center"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Return
            </Button>
            <Badge variant="outline" className="text-xs">
              Step {currentStepIndex + 1} of {STEPS.length}
            </Badge>
          </div>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{STEPS[currentStepIndex].label}</span>
              <span>
                {completedSteps} of {STEPS_COUNT} steps completed ({Math.round(progress)}%)
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </motion.div>

        {/* Loading overlay for form submission */}
        <div className="relative">
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-gray-600">Submitting brand...</p>
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 mb-6">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="brand"
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isStepCompleted("brand") ? (
                      <FaRegCircleCheck className="h-4 w-4" />
                    ) : (
                      <FaRegCircle className="h-4 w-4" />
                    )}
                    Brand Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="representative"
                    disabled={isSubmitting || !isStepCompleted("brand")}
                    className="flex items-center gap-2"
                  >
                    {isStepCompleted("representative") ? (
                      <FaRegCircleCheck className="h-4 w-4" />
                    ) : (
                      <FaRegCircle className="h-4 w-4" />
                    )}
                    Representative
                  </TabsTrigger>
                  <TabsTrigger
                    value="review"
                    disabled={isSubmitting || !isStepCompleted("representative")}
                    className="flex items-center gap-2"
                  >
                    {canSubmit ? (
                      <FaRegCircleCheck className="h-4 w-4" />
                    ) : (
                      <FaRegCircle className="h-4 w-4" />
                    )}
                    Review
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent value="brand" className="space-y-6 mt-6">
                    <motion.div
                      key="brand"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BrandInfo
                        brandData={formData.brand}
                        errors={errors.brand}
                        onBrandChange={handleBrandChange}
                        onLogoUpload={handleLogoUpload}
                      />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="representative" className="space-y-6 mt-6">
                    <motion.div
                      key="representative"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <RepresentativeInfo
                        representativeData={formData.representative}
                        errors={errors.representative}
                        onRepresentativeChange={handleRepresentativeChange}
                      />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="review" className="space-y-6 mt-6">
                    <ReviewStep />
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            </Card>
          </motion.div>

          {/* Step Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center px-4 py-3"
          >
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={isSubmitting || currentStepIndex === 0}
              className="flex items-center gap-2 bg-white"
            >
              <FaArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {activeTab === "review" ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canSubmit}
                  className="flex items-center gap-2 min-w-32"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaRegCircleCheck className="h-4 w-4" />
                      Submit Brand
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNextStep}
                  disabled={isSubmitting || !isStepCompleted(activeTab)}
                  className="flex items-center gap-2"
                >
                  Next
                  <FaArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateBrandPage;
