import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { FaBuilding, FaArrowLeft, FaFloppyDisk } from "react-icons/fa6";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhoneNumberInput } from "@/components/phone-number-input";
import { AvatarUploader } from "@/components/global";
import { useBrand } from "@/libs/hooks/useBrand";
import { useAppDispatch } from "@/libs/stores";
import { brandDetail, updateBrand } from "@/libs/stores/brandManager/thunk";

const EditBrandPage: React.FC = () => {
  const { id: brandId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { brand, loading } = useBrand();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    website: "",
    logo_url: "",
    tax_number: "",
    representative_name: "",
    representative_role: "",
    representative_phone: "",
    representative_email: "",
    representative_citizen_id: "",
  });

  useEffect(() => {
    if (brandId) {
      dispatch(brandDetail(brandId));
    }
  }, [dispatch, brandId]);

  useEffect(() => {
    if (brand && brand.id === brandId) {
      setFormData({
        name: brand.name || "",
        description: brand.description || "",
        contact_email: brand.contact_email || "",
        contact_phone: brand.contact_phone || "",
        address: brand.address || "",
        website: brand.website || "",
        logo_url: brand.logo_url || "",
        tax_number: brand.tax_number || "",
        representative_name: brand.representative_name || "",
        representative_role: brand.representative_role || "",
        representative_phone: brand.representative_phone || "",
        representative_email: brand.representative_email || "",
        representative_citizen_id: brand.representative_citizen_id || "",
      });
    }
  }, [brand, brandId]);

  const handleLogoUpload = (uploadedUrl: string) => {
    setFormData((prev) => ({ ...prev, logo_url: uploadedUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId) return;
    try {
      const response = await dispatch(updateBrand({ id: brandId, data: formData }));
      if (response.meta.requestStatus === "fulfilled") {
        setFormData({
          name: "",
          description: "",
          contact_email: "",
          contact_phone: "",
          address: "",
          website: "",
          logo_url: "",
          tax_number: "",
          representative_name: "",
          representative_role: "",
          representative_phone: "",
          representative_email: "",
          representative_citizen_id: "",
        });
        navigate(`/manage/marketing/brands/${brandId}`);
      }
    } catch {
      return;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin w-12 h-12 mb-4 text-primary" />
        <p className="text-gray-500">Loading brand information</p>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <FaBuilding className="w-16 h-16 mb-4 text-gray-400" />
        <p className="text-xl font-medium mb-4">Brand not found</p>
        <Button onClick={() => navigate("/manage/marketing/brands")}>
          <FaArrowLeft className="w-4 h-4 mr-2" />
          Return
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-semibold">Edit Brand Information</h1>
        <p className="text-gray-600 mt-1">
          Update all details, including brand identity, contact information, and legal
          representative data
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-8 gap-3">
        <Button
          variant="ghost"
          onClick={() => navigate("/manage/marketing/brands")}
          className="flex items-center"
        >
          <FaArrowLeft className="w-4 h-4 mr-2" />
          Return
        </Button>

        <Button type="submit" variant="default" form="edit-brand-form">
          <FaFloppyDisk className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <form id="edit-brand-form" onSubmit={handleSubmit}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Card className="shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
              <CardTitle className="text-xl font-semibold">Basic Information</CardTitle>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="shrink-0">
                  <Label className="text-sm font-medium mb-2 block">Brand Logo</Label>
                  <AvatarUploader
                    userId={brandId || ""}
                    initialImage={formData.logo_url}
                    onImageUpload={handleLogoUpload}
                    size="md"
                  />
                </div>

                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Brand Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter brand name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      placeholder="Enter brand description"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax_number">Tax Number</Label>
                    <Input
                      id="tax_number"
                      name="tax_number"
                      value={formData.tax_number}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, tax_number: e.target.value }))
                      }
                      placeholder="Enter tax number"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b">
              <CardTitle className="text-xl font-semibold">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, contact_email: e.target.value }))
                    }
                    placeholder="contact@brand.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <PhoneNumberInput
                    value={formData.contact_phone}
                    onChange={(value) => setFormData((prev) => ({ ...prev, contact_phone: value }))}
                    placeholder="0123456789"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter full address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                  placeholder="https://brand.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
              <CardTitle className="text-xl font-semibold">Representative Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="representative_name">Representative Name</Label>
                  <Input
                    id="representative_name"
                    name="representative_name"
                    value={formData.representative_name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, representative_name: e.target.value }))
                    }
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="representative_role">Role/Position</Label>
                  <Input
                    id="representative_role"
                    name="representative_role"
                    value={formData.representative_role}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, representative_role: e.target.value }))
                    }
                    placeholder="e.g. CEO, Manager"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="representative_email">Email</Label>
                  <Input
                    id="representative_email"
                    name="representative_email"
                    type="email"
                    value={formData.representative_email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, representative_email: e.target.value }))
                    }
                    placeholder="representative@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="representative_phone">Phone</Label>
                  <PhoneNumberInput
                    value={formData.representative_phone}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, representative_phone: value }))
                    }
                    placeholder="0123456789"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="representative_citizen_id">Citizen ID</Label>
                <Input
                  id="representative_citizen_id"
                  name="representative_citizen_id"
                  value={formData.representative_citizen_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      representative_citizen_id: e.target.value,
                    }))
                  }
                  placeholder="Enter citizen ID"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              className="bg-white"
              onClick={() => navigate(`/manage/marketing/brands/${brandId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" variant={"default"}>
              <FaFloppyDisk className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBrandPage;
