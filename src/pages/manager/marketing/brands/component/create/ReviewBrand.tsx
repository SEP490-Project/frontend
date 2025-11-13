import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatPhoneNumber } from "@/libs/helper/helper";

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

interface ReviewBrandProps {
  brandData: BrandData;
  representativeData: RepresentativeData;
  canSubmit: boolean;
}

const ReviewBrand: React.FC<ReviewBrandProps> = ({ brandData, representativeData, canSubmit }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const logoVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Review & Submit
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Please review all information carefully before submitting.
        </p>
      </motion.div>

      {/* Brand Information Review */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-blue-900 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Brand Information
            </h3>
            <Badge variant="outline" className="text-blue-700 border-blue-200">
              Step 1 Complete
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="md:col-span-2 space-y-1">
              {brandData.logo_url ? (
                <motion.div variants={logoVariants} className="flex items-center justify-center">
                  <div className="relative">
                    <img
                      src={brandData.logo_url}
                      alt="Brand logo preview"
                      className="h-24 w-24 rounded-full object-cover border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200"
                    />
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center py-4">
                  <div className="h-24 w-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400 text-sm">No Logo</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="font-medium text-gray-700">Brand Name:</span>
              <p className="text-gray-900 bg-white px-3 py-1.5 rounded border">
                {brandData.name || <span className="text-gray-400 italic">Not provided</span>}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-medium text-gray-700">Contact Email:</span>
              <p className="text-gray-900 bg-white px-3 py-1.5 rounded border">
                {brandData.contact_email || (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-medium text-gray-700">Contact Phone:</span>
              <p className="text-gray-900 bg-white px-3 py-1.5 rounded border">
                {brandData.contact_phone ? (
                  formatPhoneNumber(brandData.contact_phone)
                ) : (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-medium text-gray-700">Website:</span>
              <p className="text-gray-900 bg-white px-3 py-1.5 rounded border">
                {brandData.website || <span className="text-gray-400 italic">Not provided</span>}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-medium text-gray-700">Tax Number:</span>
              <p className="text-gray-900 bg-white px-3 py-1.5 rounded border">
                {brandData.tax_number || <span className="text-gray-400 italic">Not provided</span>}
              </p>
            </div>

            <div className="md:col-span-2 space-y-1">
              <span className="font-medium text-gray-700">Address:</span>
              <p className="text-gray-900 bg-white px-3 py-2 rounded border">
                {brandData.address || <span className="text-gray-400 italic">Not provided</span>}
              </p>
            </div>

            {brandData.description && (
              <div className="md:col-span-2 space-y-1">
                <span className="font-medium text-gray-700">Description:</span>
                <p className="text-gray-900 bg-white px-3 py-2 rounded border">
                  {brandData.description}
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Representative Information Review */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-green-900 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Representative Information
            </h3>
            <Badge variant="outline" className="text-green-700 border-green-200">
              Step 2 Complete
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="font-medium text-gray-700">Full Name:</span>
              <p className="text-gray-900 bg-white px-3 py-1.5 rounded border">
                {representativeData.representative_name || (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-medium text-gray-700">Email:</span>
              <p className="text-gray-900 bg-white px-3 py-1.5 rounded border">
                {representativeData.representative_email || (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-medium text-gray-700">Phone:</span>
              <p className="text-gray-900 bg-white px-3 py-1.5 rounded border">
                {representativeData.representative_phone ? (
                  formatPhoneNumber(representativeData.representative_phone)
                ) : (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-medium text-gray-700">Role/Position:</span>
              <p className="text-gray-900 bg-white px-3 py-1.5 rounded border">
                {representativeData.representative_role || (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
              </p>
            </div>

            <div className="md:col-span-2 space-y-1">
              <span className="font-medium text-gray-700">Citizen ID:</span>
              <p className="text-gray-900 bg-white px-3 py-1.5 rounded border font-mono">
                {representativeData.representative_citizen_id || (
                  <span className="text-gray-400 italic font-sans">Not provided</span>
                )}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Validation Status */}
      <motion.div variants={itemVariants}>
        {!canSubmit ? (
          <Card className="p-6 border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-900 mb-2">Incomplete Information</h3>
                <p className="text-sm text-red-700 mb-3">
                  Please complete all required fields before submitting the brand information.
                </p>
                <div className="text-xs text-red-600 space-y-1">
                  <p>• All brand information fields are required</p>
                  <p>• All representative information fields are required</p>
                  <p>• Logo upload is required</p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">Ready to Submit</h3>
                <p className="text-sm text-green-700 mt-1">
                  All required information has been provided. You can now submit the brand.
                </p>
              </div>
            </div>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ReviewBrand;
