import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router";
import { BrandInfo, RepresentativeInfo } from "./component/create";
import type { BrandBase } from "@/libs/types/brand";
import * as yup from "yup";
import { useAppDispatch } from "@/libs/stores";
import { useBrand } from "@/libs/hooks/useBrand";
import { addBrand } from "@/libs/stores/brandManager/thunk";
import { Loader2 } from "lucide-react";

// Helper: format URL
const formatUrl = (url: string): string => {
  if (!url) return "";
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
};

// Helper: format phone to E.164
const formatPhoneToE164 = (phone: string): string => {
  if (!phone) return "";

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");

  // If starts with 0, replace with +84 (Vietnam)
  if (digitsOnly.startsWith("0")) {
    return `+84${digitsOnly.substring(1)}`;
  }

  // If starts with 84, add +
  if (digitsOnly.startsWith("84")) {
    return `+${digitsOnly}`;
  }

  // If already starts with +, return as is
  if (phone.startsWith("+")) {
    return phone;
  }

  // Default to Vietnam code
  return `+84${digitsOnly}`;
};

// Helper: validate E.164 format
const isValidE164 = (phone: string): boolean => {
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
};

// Validation schemas
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

const CreateBrandPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("brand");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { loading } = useBrand();

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

  // Show loading overlay if needed
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

  // Handlers
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

  // Chỉ cần handle URL từ AvatarUploader
  const handleLogoUpload = (uploadedUrl: string) => {
    console.log("Uploaded Logo URL:", uploadedUrl);
    setFormData((prev) => ({ ...prev, brand: { ...prev.brand, logo_url: uploadedUrl } }));
    if (errors.brand.logo_url) {
      setErrors((prev) => ({ ...prev, brand: { ...prev.brand, logo_url: "" } }));
    }
  };

  // Form validation
  const validateForm = async (): Promise<boolean> => {
    try {
      await brandSchema.validate(formData.brand, { abortEarly: false });
      await representativeSchema.validate(formData.representative, { abortEarly: false });
      setErrors({ brand: {}, representative: {} });
      return true;
    } catch (err: any) {
      const brandErrors: Partial<BrandData> = {};
      const repErrors: Partial<RepresentativeData> = {};
      err.inner?.forEach((e: any) => {
        if (e.path in formData.brand) brandErrors[e.path as keyof BrandData] = e.message;
        if (e.path in formData.representative)
          repErrors[e.path as keyof RepresentativeData] = e.message;
      });
      setErrors({ brand: brandErrors, representative: repErrors });
      return false;
    }
  };

  // Handle submit
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
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    formData.brand.name.trim() &&
    formData.brand.contact_email.trim() &&
    formData.brand.contact_phone.trim() &&
    formData.brand.address.trim() &&
    formData.brand.tax_number.trim() &&
    formData.brand.website.trim() &&
    formData.brand.logo_url.trim() &&
    formData.representative.representative_name.trim() &&
    formData.representative.representative_email.trim() &&
    formData.representative.representative_phone.trim() &&
    formData.representative.representative_role.trim() &&
    formData.representative.representative_citizen_id.trim();

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="max-w-7xl mx-auto pb-10">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Create Brand</h1>
        </div>

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

          <Card className="p-6 mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="brand" disabled={isSubmitting}>
                  Brand Information
                </TabsTrigger>
                <TabsTrigger value="representative" disabled={isSubmitting}>
                  Representative Information
                </TabsTrigger>
              </TabsList>

              <TabsContent value="brand" className="space-y-6 mt-6">
                <BrandInfo
                  brandData={formData.brand}
                  errors={errors.brand}
                  onBrandChange={handleBrandChange}
                  onLogoUpload={handleLogoUpload}
                />
              </TabsContent>

              <TabsContent value="representative" className="space-y-6 mt-6">
                <RepresentativeInfo
                  representativeData={formData.representative}
                  errors={errors.representative}
                  onRepresentativeChange={handleRepresentativeChange}
                />
              </TabsContent>
            </Tabs>
          </Card>

          <div className="px-4 py-3">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !canSubmit || loading}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Brand"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBrandPage;
