"use client";

import {
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Target,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useCampaign } from "@/libs/hooks/useCampaign";
import { getCampaignsByBrand } from "@/libs/stores/campaignManager/thunk";
import type { AppDispatch } from "@/libs/stores";
import type { Campaign } from "@/libs/types/campaign";
import { getBrandIdFromToken } from "@/libs/helper";

interface CampaignManagementProps {
  brandId?: string;
}

export default function CampaignManagement({ brandId: propBrandId }: CampaignManagementProps = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, campaigns, pagination } = useCampaign();

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Get brand ID from JWT token or use prop
  const brandId = propBrandId || getBrandIdFromToken();

  // Fetch campaigns when component mounts or brand changes
  useEffect(() => {
    if (brandId) {
      dispatch(
        getCampaignsByBrand({
          brand_id: brandId,
          page: 1,
          limit: 10,
          status: selectedStatus || undefined,
        }),
      );
    }
  }, [dispatch, brandId, selectedStatus]);

  // Get unique statuses for dropdown
  const uniqueStatuses = [...new Set(campaigns.map((item) => item.status))];

  // Filter the data based on search and filters
  const filteredData = campaigns.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contract_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contract_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "" || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Handle campaign view
  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "TERMINATED":
        return "bg-red-100 text-red-800";
      case "PAUSED":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsStatusDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen md:p-2">
      <div className="mx-auto md:px-2">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
        </div>

        {/* Content Queue Section */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                  />
                </svg>
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <button
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 md:hidden"
              >
                {isFilterMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>

              <div className="hidden items-center gap-3 md:flex flex-1">
                <Input
                  type="text"
                  placeholder="Find campaign"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 w-[300px] border-gray-300 bg-white text-sm rounded-md"
                />

                <div className="relative ml-auto">
                  <button
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="flex h-9 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    {selectedStatus || "All Status"}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {isStatusDropdownOpen && (
                    <div className="absolute top-10 right-0 z-10 w-32 rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setSelectedStatus("");
                            setIsStatusDropdownOpen(false);
                          }}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                        >
                          All Status
                        </button>
                        {uniqueStatuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setSelectedStatus(status);
                              setIsStatusDropdownOpen(false);
                            }}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isFilterMenuOpen && (
              <div className="mt-4 flex flex-col gap-3 md:hidden border-t border-gray-200 pt-4">
                <Input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 border-gray-300 bg-white text-sm rounded-md"
                />

                <div className="relative">
                  <button
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600"
                  >
                    {selectedStatus || "All Status"}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {isStatusDropdownOpen && (
                    <div className="absolute top-10 left-0 z-10 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setSelectedStatus("");
                            setIsStatusDropdownOpen(false);
                          }}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                        >
                          All Status
                        </button>
                        {uniqueStatuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setSelectedStatus(status);
                              setIsStatusDropdownOpen(false);
                            }}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] table-fixed">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                    Campaign Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                    Contract
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Budget (Projected)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Budget (Actual)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-500">Loading campaigns...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No campaigns found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 w-[20%]">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex-shrink-0 mr-2">
                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Target className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div
                            className="text-sm font-medium text-gray-900 truncate"
                            title={item.name}
                          >
                            {item.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 w-[20%]">
                        <div>
                          <div
                            className="text-sm font-medium text-gray-900 truncate"
                            title={item.contract_title}
                          >
                            {item.contract_title}
                          </div>
                          <div
                            className="text-xs text-gray-500 truncate"
                            title={item.contract_number}
                          >
                            {item.contract_number}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 w-[15%] text-sm text-gray-900">
                        {formatBudget(item.budget_projected)}
                      </td>
                      <td className="px-4 py-3 w-[15%] text-sm text-gray-900">
                        {formatBudget(item.budget_actual)}
                      </td>
                      <td
                        className="px-4 py-3 w-[10%] text-sm text-gray-500 truncate"
                        title={item.type.replace("_", " ")}
                      >
                        {item.type.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3 w-[10%]">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(
                            item.status,
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 w-[10%] text-sm font-medium">
                        <button
                          onClick={() => handleViewCampaign(item)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredData.length}</span> of{" "}
                  <span className="font-medium">{pagination?.total || 0}</span> results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-6xl w-[95vw] h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Campaign Details</DialogTitle>
              <DialogDescription>Campaign: {selectedCampaign?.name}</DialogDescription>
            </DialogHeader>

            {selectedCampaign && (
              <div className="space-y-6">
                {/* Campaign Overview */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Campaign Overview</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Campaign Name</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCampaign.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCampaign.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Campaign Type</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedCampaign.type.replace("_", " ")}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(selectedCampaign.status)}`}
                        >
                          {selectedCampaign.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Projected Budget</label>
                      <p className="text-sm text-gray-900 mt-1 font-medium">
                        {formatBudget(selectedCampaign.budget_projected)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Actual Budget</label>
                      <p className="text-sm text-gray-900 mt-1 font-medium">
                        {formatBudget(selectedCampaign.budget_actual)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contract Information */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h2 className="text-lg font-semibold text-gray-900">Contract Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contract Title</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedCampaign.contract_title}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contract Number</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedCampaign.contract_number}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contract ID</label>
                      <p className="text-xs text-gray-900 mt-1 font-mono">
                        {selectedCampaign.contract_id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Timeline</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Start Date</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(selectedCampaign.start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">End Date</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(selectedCampaign.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Duration</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {Math.ceil(
                          (new Date(selectedCampaign.end_date).getTime() -
                            new Date(selectedCampaign.start_date).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(selectedCampaign.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(selectedCampaign.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
