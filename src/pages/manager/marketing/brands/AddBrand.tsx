import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router";
import { BrandInfo, RepresentativeInfo } from "@/components/manage/marketing/brand";

interface BrandData {
  name: string;
  description: string;
  website: string;
  logo_url: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  tax_number?: string;
}

interface RepresentativeData {
  name: string;
  email: string;
  phone: string;
  position: string;
  identificationNum?: string;
}

interface FormData {
  brand: BrandData;
  representative: RepresentativeData;
}

const AddBrandPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("brand");
  const [logoFile, setLogoFile] = useState<File | null>(null);
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
      name: "",
      email: "",
      phone: "",
      position: "",
      identificationNum: "",
    },
  });

  const [errors, setErrors] = useState<{
    brand: Partial<BrandData>;
    representative: Partial<RepresentativeData>;
  }>({
    brand: {},
    representative: {},
  });

  // Handle brand data changes
  const handleBrandChange = (field: keyof BrandData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      brand: { ...prev.brand, [field]: value },
    }));
    // Clear error when user starts typing
    if ((errors.brand as any)[field]) {
      setErrors((prev) => ({
        ...prev,
        brand: { ...prev.brand, [field]: "" },
      }));
    }
  };

  // Handle representative data changes
  const handleRepresentativeChange = (field: keyof RepresentativeData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      representative: { ...prev.representative, [field]: value },
    }));
    // Clear error when user starts typing
    if ((errors.representative as any)[field]) {
      setErrors((prev) => ({
        ...prev,
        representative: { ...prev.representative, [field]: "" },
      }));
    }
  };

  // Handle logo changes
  const handleLogoChange = (file: File | null) => {
    setLogoFile(file);
    setFormData((prev) => ({
      ...prev,
      brand: { ...prev.brand, logo_url: "" },
    }));
    if (errors.brand.logo_url) {
      setErrors((prev) => ({
        ...prev,
        brand: { ...prev.brand, logo_url: "" },
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const brandErrors: Partial<BrandData> = {};
    const representativeErrors: Partial<RepresentativeData> = {};

    // Validate brand data
    if (!formData.brand.name.trim()) {
      brandErrors.name = "Brand name is required";
    }

    if (formData.brand.website && !isValidUrl(formData.brand.website)) {
      brandErrors.website = "Please enter a valid website URL";
    }

    if (formData.brand.logo_url && !isValidUrl(formData.brand.logo_url)) {
      brandErrors.logo_url = "Please enter a valid logo URL";
    }

    if (
      formData.brand.contact_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.brand.contact_email)
    ) {
      brandErrors.contact_email = "Please enter a valid contact email";
    }

    if (formData.brand.contact_phone && !/^[+\d\-\s()]{6,20}$/.test(formData.brand.contact_phone)) {
      brandErrors.contact_phone = "Please enter a valid contact phone";
    }

    if (formData.brand.tax_number && !/^[\dA-Za-z-]{3,20}$/.test(formData.brand.tax_number)) {
      brandErrors.tax_number = "Please enter a valid tax number";
    }

    // Validate representative data
    if (!formData.representative.name.trim()) {
      representativeErrors.name = "Representative name is required";
    }

    if (!formData.representative.email.trim()) {
      representativeErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.representative.email)) {
      representativeErrors.email = "Please enter a valid email address";
    }

    if (!formData.representative.phone.trim()) {
      representativeErrors.phone = "Phone number is required";
    }

    if (!formData.representative.position.trim()) {
      representativeErrors.position = "Position is required";
    }

    if (
      !formData.representative.identificationNum ||
      !/^\d{9,12}$/.test(formData.representative.identificationNum)
    ) {
      representativeErrors.identificationNum = "Identification Number must be 9-12 digits";
    }

    setErrors({
      brand: brandErrors,
      representative: representativeErrors,
    });

    return Object.keys(brandErrors).length === 0 && Object.keys(representativeErrors).length === 0;
  };

  // Validate URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  // Format URL to include protocol
  const formatUrl = (url: string): string => {
    if (!url) return url;
    return url.startsWith("http") ? url : `https://${url}`;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log("Validation errors:", errors);
      // Check which tab has errors and switch to it
      if (Object.keys(errors.brand).length > 0) {
        setActiveTab("brand");
      } else if (Object.keys(errors.representative).length > 0) {
        setActiveTab("representative");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Format URLs before submission
      const submissionData = {
        brand: {
          ...formData.brand,
          website: formatUrl(formData.brand.website),
          logo_url: formData.brand.logo_url ? formatUrl(formData.brand.logo_url) : "",
          description: formData.brand.description || null,
          contact_email: formData.brand.contact_email || null,
          contact_phone: formData.brand.contact_phone || null,
          address: formData.brand.address || null,
          tax_number: formData.brand.tax_number || null,
        },
        representative: formData.representative,
      };

      console.log("Submission Data:", submissionData);

      // If logoFile exists, upload it and get the URL
      if (logoFile) {
        // TODO: Replace with actual upload logic
        await new Promise((resolve) => setTimeout(resolve, 1000));
        submissionData.brand.logo_url = "https://fake-uploaded-url.com/logo.png";
      }

      console.log("Brand Data:", submissionData);

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Brand created successfully!");
      navigate("/manage/marketing/brands");
    } catch (error) {
      console.error("Error creating brand:", error);
      alert("Error creating brand. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = formData.brand.name.trim() && formData.representative.name.trim();

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="max-w-7xl mx-auto pb-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Add Brand</h1>
        </div>

        {/* Form Card */}
        <Card className="p-6 mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="brand">Brand Information</TabsTrigger>
              <TabsTrigger value="representative">Representative Information</TabsTrigger>
            </TabsList>

            <TabsContent value="brand" className="space-y-6 mt-6">
              <BrandInfo
                brandData={formData.brand}
                logoFile={logoFile}
                errors={errors.brand}
                onBrandChange={handleBrandChange}
                onLogoChange={handleLogoChange}
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
          <Button onClick={handleSubmit} disabled={isSubmitting || !canSubmit} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Brand"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddBrandPage;
