import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import AvatarUploader from "@/components/global/AvatarUploader";

interface PartnerData {
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  logo_url: string;
}

const AddPartnerPage: React.FC = () => {
  const navigate = useNavigate();
  const [partner, setPartner] = useState<PartnerData>({
    name: "",
    description: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    logo_url: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null); // NEW: for avatar uploader
  const [errors, setErrors] = useState<Partial<PartnerData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (field: keyof PartnerData, value: string) => {
    setPartner((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<PartnerData> = {};

    if (!partner.name.trim()) {
      newErrors.name = "Partner name is required";
    }

    if (!partner.contact_email.trim()) {
      newErrors.contact_email = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partner.contact_email)) {
      newErrors.contact_email = "Please enter a valid email address";
    }

    if (!partner.contact_phone.trim()) {
      newErrors.contact_phone = "Contact phone is required";
    }

    if (partner.website && !isValidUrl(partner.website)) {
      newErrors.website = "Please enter a valid website URL";
    }

    if (partner.logo_url && !isValidUrl(partner.logo_url)) {
      newErrors.logo_url = "Please enter a valid logo URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  // Handle avatar image change
  const handleLogoChange = (file: File | null) => {
    setLogoFile(file);
    setPartner((prev) => ({
      ...prev,
      logo_url: "", // Clear logo_url if using file
    }));
    if (errors.logo_url) {
      setErrors((prev) => ({ ...prev, logo_url: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Format URLs before submission
      const submissionData = {
        ...partner,
        website: formatUrl(partner.website),
        logo_url: partner.logo_url ? formatUrl(partner.logo_url) : "", // fallback if no file
        description: partner.description || null, // Convert empty string to null
      };

      // If logoFile exists, upload it and get the URL
      if (logoFile) {
        // TODO: Replace with actual upload logic
        // Example: const uploadedUrl = await uploadLogoFile(logoFile);
        // For now, simulate upload and use a fake URL
        await new Promise((resolve) => setTimeout(resolve, 1000));
        submissionData.logo_url = "https://fake-uploaded-url.com/logo.png";
      }

      console.log("Partner Data:", submissionData);

      // TODO: Replace with actual API call
      // await createPartner(submissionData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Partner created successfully!");
      navigate("/manage/marketing/partners");
    } catch (error) {
      console.error("Error creating partner:", error);
      alert("Error creating partner. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="max-w-7xl mx-auto pb-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Add Partner</h1>
        </div>

        {/* Partner Information */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-6">Partner Information</h2>

          <div className="space-y-6">
            {/* Row 1: Name and Contact Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Partner Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter partner name"
                  value={partner.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email" className="text-sm font-medium">
                  Contact Email *
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  placeholder="partner@example.com"
                  value={partner.contact_email}
                  onChange={(e) => handleChange("contact_email", e.target.value)}
                  className={errors.contact_email ? "border-red-500" : ""}
                />
                {errors.contact_email && (
                  <p className="text-sm text-red-500">{errors.contact_email}</p>
                )}
              </div>
            </div>

            {/* Row 2: Phone and Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="text-sm font-medium">
                  Contact Phone *
                </Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={partner.contact_phone}
                  onChange={(e) => handleChange("contact_phone", e.target.value)}
                  className={errors.contact_phone ? "border-red-500" : ""}
                />
                {errors.contact_phone && (
                  <p className="text-sm text-red-500">{errors.contact_phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium">
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="www.example.com"
                  value={partner.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className={errors.website ? "border-red-500" : ""}
                />
                {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
                <p className="text-xs text-gray-500">
                  Optional. Will be formatted as https:// if no protocol provided
                </p>
              </div>
            </div>

            {/* Row 3: Logo Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Logo</Label>
              <AvatarUploader
                initialImage={partner.logo_url}
                onImageChange={handleLogoChange}
                size="md"
              />
              <p className="text-xs text-gray-500">Optional. Upload a logo image for the partner</p>
            </div>

            {/* Row 4: Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter partner description..."
                value={partner.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">Optional. Brief description about the partner</p>
            </div>
          </div>
        </Card>

        <div className="px-4 py-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !partner.name.trim()}
            className="w-full"
          >
            {isSubmitting ? "Creating..." : "Create Partner"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPartnerPage;
