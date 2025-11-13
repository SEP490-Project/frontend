import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  FaBuilding,
  FaFileLines,
  FaPlus,
  FaEye,
  FaArrowLeft,
  FaPenToSquare,
} from "react-icons/fa6";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBrand } from "@/libs/hooks/useBrand";
import { useContract } from "@/libs/hooks/useContract";
import { useAppDispatch } from "@/libs/stores";
import { brandDetail } from "@/libs/stores/brandManager/thunk";
import { getContractsByBrandId } from "@/libs/stores/contractManager/thunk";
import { formatDate, formatPhoneNumber } from "@/libs/helper/helper";

const BrandDetailPage: React.FC = () => {
  const { id: brandId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { brand, loading: brandLoading } = useBrand();
  const { contracts, loading: contractLoading } = useContract();

  useEffect(() => {
    if (brandId) {
      dispatch(brandDetail(brandId));
      dispatch(getContractsByBrandId({ brand_id: brandId, page: 1, limit: 10 }));
    }
  }, [dispatch, brandId]);

  const isLoading = brandLoading || contractLoading;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      BRAND_AMBASSADOR: "bg-purple-100 text-purple-800",
      ADVERTISING: "bg-blue-100 text-blue-800",
      CO_PRODUCING: "bg-indigo-100 text-indigo-800",
      AFFILIATE: "bg-pink-100 text-pink-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin w-12 h-12 mb-4 text-primary" />
        <p className="text-gray-500">Loading Brand Information</p>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <FaBuilding className="w-16 h-16 mb-4 text-gray-400" />
        <p className="text-xl font-medium mb-4">Brand information not found</p>
        <Button
          variant="ghost"
          onClick={() => navigate("/manage/marketing/brands")}
          className="flex items-center"
        >
          <FaArrowLeft className="w-4 h-4 mr-2" />
          Return
        </Button>
      </div>
    );
  }

  // Thêm function để handle create contract với brand ID
  const handleCreateContractWithBrand = () => {
    navigate("/manage/marketing/contracts/create", {
      state: {
        preselectedBrandId: brandId,
        brandData: brand, // Optional: truyền cả brand data để tránh fetch lại
      },
    });
  };

  return (
    <motion.div
      className="min-h-fit p-4 sm:p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-4">
        <motion.h1
          className="text-xl sm:text-2xl font-semibold"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          Brand Information
        </motion.h1>
        <motion.p
          className="text-gray-600 mt-1"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
        >
          All details, including brand identity, contact information, and legal representative data
        </motion.p>
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

        <Button
          variant="default"
          onClick={() => navigate(`/manage/marketing/brands/${brandId}/edit`)}
        >
          <FaPenToSquare className="w-4 h-4 mr-2" />
          Update Information
        </Button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="shadow-lg border-t-4 border-t-blue-600">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <motion.img
                  src={brand.logo_url || "https://placehold.co/400"}
                  alt={brand.name || "Brand logo"}
                  className="w-40 h-40 object-cover rounded-full"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.45 }}
                />
                <motion.div
                  className={"absolute -bottom-2 -right-2 bg-transparent"}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.12 }}
                >
                  <Badge className={`${getStatusColor(brand.status)}`}>{brand.status}</Badge>
                </motion.div>
              </div>
              <div className="flex-1 space-y-3 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.12 }}
                >
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                    {brand.name}
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed">
                    {brand.description || "No description provided."}
                  </p>
                </motion.div>
                <motion.div
                  className="flex flex-wrap gap-3 justify-center md:justify-start text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.16 }}
                >
                  <div className="flex items-center">
                    <span>
                      Created: {brand.created_at ? formatDate(brand.created_at) : "Unknown"}
                    </span>
                  </div>
                  {brand.tax_number && (
                    <div className="flex items-center">
                      <span>Tax: {brand.tax_number}</span>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b">
              <CardTitle className="text-xl font-semibold flex items-center text-gray-900">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start">
                <div>
                  <span className="text-sm text-gray-500 block">Email</span>
                  <a
                    href={`mailto:${brand.contact_email}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {brand.contact_email || "N/A"}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <div>
                  <span className="text-sm text-gray-500 block">Phone</span>
                  <p className="font-medium text-gray-900">
                    {formatPhoneNumber(brand.contact_phone)}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div>
                  <span className="text-sm text-gray-500 block">Address</span>
                  <p className="font-medium text-gray-900">{brand.address || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div>
                  <span className="text-sm text-gray-500 block">Website</span>
                  {brand.website ? (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium break-all"
                    >
                      {brand.website}
                    </a>
                  ) : (
                    <p className="text-gray-400">N/A</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
              <CardTitle className="text-xl font-semibold flex items-center text-gray-900">
                Representative
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start">
                <div>
                  <span className="text-sm text-gray-500 block">Name</span>
                  <p className="font-medium text-gray-900">{brand.representative_name || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div>
                  <span className="text-sm text-gray-500 block">Role</span>
                  <p className="font-medium text-gray-900">{brand.representative_role || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div>
                  <span className="text-sm text-gray-500 block">Email</span>
                  <a
                    href={`mailto:${brand.representative_email}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {brand.representative_email || "N/A"}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <div>
                  <span className="text-sm text-gray-500 block">Phone</span>
                  <p className="font-medium text-gray-900">
                    {formatPhoneNumber(brand.representative_phone)}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div>
                  <span className="text-sm text-gray-500 block">Citizen ID</span>
                  <p className="font-medium text-gray-900">
                    {brand.representative_citizen_id || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="shadow-md rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold flex items-center text-gray-900">
                Contracts ({contracts?.length || 0})
              </CardTitle>
              <Button variant="default" onClick={handleCreateContractWithBrand}>
                <FaPlus className="w-4 h-4 mr-2" />
                Create Contract
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {contracts && contracts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Title</TableHead>
                      <TableHead className="font-semibold">Number</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Start Date</TableHead>
                      <TableHead className="font-semibold">End Date</TableHead>
                      <TableHead className="font-semibold text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract) => (
                      <TableRow key={contract.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{contract.title}</TableCell>
                        <TableCell>
                          <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                            {contract.contract_number}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(contract.type)}>
                            {contract.type.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(contract.status)} border`}>
                            {contract.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-gray-700">
                            {formatDate(contract.start_date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-gray-700">
                            {formatDate(contract.end_date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/manage/marketing/contracts/${contract.id}`)}
                              className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                            >
                              <FaEye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <FaFileLines className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg font-medium mb-2">No contracts available</p>
                <p className="text-gray-400 text-sm mb-4">
                  Get started by creating a new contract for this brand
                </p>
                <Button
                  variant="default"
                  onClick={handleCreateContractWithBrand} // Sử dụng function mới
                >
                  <FaPlus className="w-4 h-4 mr-2" />
                  Create First Contract
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default BrandDetailPage;
