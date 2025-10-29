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
import { getCampaignsByBrand, getCampaignById } from "@/libs/stores/campaignManager/thunk";
import type { AppDispatch } from "@/libs/stores";
import type { CampaignData } from "@/libs/types/campaign";

export default function CampaignManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, campaigns, pagination, error, detailLoading, campaignDetail } = useCampaign();

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch campaigns when component mounts, page or status changes
  useEffect(() => {
    dispatch(
      getCampaignsByBrand({
        page: currentPage,
        limit: 10,
        status: selectedStatus || undefined,
      }),
    );
  }, [dispatch, currentPage, selectedStatus]);

  // Reset to page 1 when status filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedStatus, currentPage]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && pagination && page <= pagination.total_pages) {
      setCurrentPage(page);
    }
  };

  // Get unique statuses for dropdown
  const uniqueStatuses = [...new Set(campaigns.map((item) => item.status))];

  // Filter the data based on search and filters
  const filteredData = campaigns.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contract_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contract_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "" || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Handle campaign view
  const handleViewCampaign = async (campaign: CampaignData) => {
    console.log("handleViewCampaign called with:", campaign.id);
    setIsModalOpen(true);

    try {
      // Fetch detailed campaign data from API
      console.log("Dispatching getCampaignById for ID:", campaign.id);
      const result = await dispatch(getCampaignById(campaign.id));
      console.log("getCampaignById result:", result);
      // The campaign detail will be available in the Redux store via useCampaign hook
    } catch (error) {
      console.error("Failed to fetch campaign details:", error);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case "RUNNING":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "PAUSED":
        return "bg-orange-100 text-orange-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
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

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="border-b border-gray-200">
                <tr>
                  <th
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: "300px", minWidth: "250px" }}
                  >
                    Campaign Name
                  </th>
                  <th
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: "250px", minWidth: "200px" }}
                  >
                    Contract
                  </th>
                  <th
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: "200px", minWidth: "150px" }}
                  >
                    Duration
                  </th>
                  <th
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: "120px", minWidth: "100px" }}
                  >
                    Type
                  </th>
                  <th
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: "100px", minWidth: "80px" }}
                  >
                    Status
                  </th>
                  <th
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: "80px", minWidth: "60px" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-500">Loading campaigns...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-red-500">
                        <svg
                          className="w-12 h-12 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <span className="font-medium">Error loading campaigns</span>
                        <span className="text-sm text-gray-500 mt-1">{error}</span>
                        <button
                          onClick={() =>
                            dispatch(
                              getCampaignsByBrand({
                                page: currentPage,
                                limit: 10,
                                status: selectedStatus || undefined,
                              }),
                            )
                          }
                          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                          Try Again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No campaigns found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3" style={{ width: "300px", minWidth: "250px" }}>
                        <div className="flex items-start space-x-3">
                          <div className="h-8 w-8 flex-shrink-0">
                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Target className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className="text-sm font-medium text-gray-900 break-words"
                              title={item.name}
                            >
                              {item.name}
                            </div>
                            {item.description && (
                              <div
                                className="text-xs text-gray-500 mt-1 break-words line-clamp-2"
                                title={item.description}
                              >
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ width: "250px", minWidth: "200px" }}>
                        <div className="space-y-1">
                          <div
                            className="text-sm font-medium text-gray-900 break-words"
                            title={item.contract_title}
                          >
                            {item.contract_title}
                          </div>
                          <div
                            className="text-xs text-gray-500 break-words"
                            title={item.contract_number}
                          >
                            {item.contract_number}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ width: "200px", minWidth: "150px" }}>
                        <div className="text-sm text-gray-900 space-y-1">
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="break-words">
                              Start: {formatDate(item.start_date)}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="break-words">End: {formatDate(item.end_date)}</span>
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-gray-500 break-words"
                        style={{ width: "120px", minWidth: "100px" }}
                        title={item.type}
                      >
                        {item.type}
                      </td>
                      <td className="px-4 py-3" style={{ width: "100px", minWidth: "80px" }}>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(
                            item.status,
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 text-sm font-medium"
                        style={{ width: "80px", minWidth: "60px" }}
                      >
                        <button
                          onClick={() => handleViewCampaign(item)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 flex items-center justify-center"
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

          {/* Mobile Card Layout */}
          <div className="lg:hidden space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-500">Loading campaigns...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center text-red-500 py-12">
                <svg
                  className="w-12 h-12 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span className="font-medium">Error loading campaigns</span>
                <span className="text-sm text-gray-500 mt-1">{error}</span>
                <button
                  onClick={() =>
                    dispatch(
                      getCampaignsByBrand({
                        page: currentPage,
                        limit: 10,
                        status: selectedStatus || undefined,
                      }),
                    )
                  }
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No campaigns found</div>
            ) : (
              filteredData.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  {/* Header with Campaign Name and Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Target className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 break-words">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1 break-words">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(item.status)}`}
                      >
                        {item.status}
                      </span>
                      <button
                        onClick={() => handleViewCampaign(item)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contract Information */}
                  <div className="border-t border-gray-100 pt-3 mb-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contract
                        </label>
                        <div className="mt-1">
                          <p className="text-sm font-medium text-gray-900 break-words">
                            {item.contract_title}
                          </p>
                          <p className="text-xs text-gray-500 break-words">
                            {item.contract_number}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </label>
                        <p className="text-sm text-gray-900 mt-1">{item.type}</p>
                      </div>
                    </div>
                  </div>

                  {/* Duration Information */}
                  <div className="border-t border-gray-100 pt-3">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </label>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-3 w-3 text-gray-400 mr-2 flex-shrink-0" />
                        <span>Start: {formatDate(item.start_date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-3 w-3 text-gray-400 mr-2 flex-shrink-0" />
                        <span>End: {formatDate(item.end_date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.total > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.has_prev}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.has_next}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.has_prev}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                      {pagination.page}
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.has_next}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Campaign Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-6xl w-[95vw] h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Campaign Details</DialogTitle>
              <DialogDescription>
                {detailLoading
                  ? "Loading campaign details..."
                  : `Campaign: ${campaignDetail?.name || "Unknown"}`}
              </DialogDescription>
            </DialogHeader>

            {detailLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-500">Loading campaign details...</span>
              </div>
            ) : campaignDetail ? (
              <div className="space-y-6">
                {/* Campaign Overview */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Campaign Overview</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Campaign Name</label>
                      <p className="text-sm text-gray-900 mt-1">{campaignDetail.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Campaign Type</label>
                      <p className="text-sm text-gray-900 mt-1">{campaignDetail.type}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {campaignDetail.description || "No description provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(campaignDetail.status)}`}
                        >
                          {campaignDetail.status}
                        </span>
                      </div>
                    </div>
                    {campaignDetail.number_of_tasks && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Total Tasks</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {campaignDetail.number_of_tasks} tasks
                        </p>
                      </div>
                    )}
                    {campaignDetail.percentage_completed !== undefined && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Progress</label>
                        <div className="mt-1">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${campaignDetail.percentage_completed}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {campaignDetail.percentage_completed.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
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
                      <p className="text-sm text-gray-900 mt-1">{campaignDetail.contract_title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contract Number</label>
                      <p className="text-sm text-gray-900 mt-1">{campaignDetail.contract_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contract ID</label>
                      <p className="text-xs text-gray-900 mt-1 font-mono">
                        {campaignDetail.contract_id}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Start Date</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {formatDate(campaignDetail.start_date)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">End Date</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {formatDate(campaignDetail.end_date)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Duration</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {Math.ceil(
                          (new Date(campaignDetail.end_date).getTime() -
                            new Date(campaignDetail.start_date).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {formatDate(campaignDetail.created_at)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {formatDate(campaignDetail.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                {campaignDetail.milestones && campaignDetail.milestones.length > 0 && (
                  <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <svg
                        className="h-5 w-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h2 className="text-lg font-semibold text-gray-900">Milestones</h2>
                    </div>

                    <div className="space-y-4">
                      {campaignDetail.milestones.map((milestone, index) => (
                        <div
                          key={milestone.id}
                          className="bg-white rounded-lg border border-purple-100 p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 break-words">
                                Milestone {index + 1}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 break-words">
                                {milestone.description}
                              </p>
                            </div>
                            <div className="ml-4 flex items-center space-x-2">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  milestone.status === "COMPLETED"
                                    ? "bg-green-100 text-green-800"
                                    : milestone.status === "IN_PROGRESS"
                                      ? "bg-blue-100 text-blue-800"
                                      : milestone.status === "NOT_STARTED"
                                        ? "bg-gray-100 text-gray-800"
                                        : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {milestone.status.replace("_", " ")}
                              </span>
                              {milestone.behind_schedule && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                  Behind Schedule
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                              <label className="text-xs font-medium text-gray-500">Due Date</label>
                              <p className="text-sm text-gray-900 mt-1">
                                {formatDate(milestone.due_date)}
                              </p>
                            </div>
                            {milestone.completed_at && (
                              <div>
                                <label className="text-xs font-medium text-gray-500">
                                  Completed
                                </label>
                                <p className="text-sm text-gray-900 mt-1">
                                  {formatDate(milestone.completed_at)}
                                </p>
                              </div>
                            )}
                            <div>
                              <label className="text-xs font-medium text-gray-500">Tasks</label>
                              <p className="text-sm text-gray-900 mt-1">
                                {milestone.number_of_tasks} tasks
                              </p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Progress</label>
                              <div className="mt-1">
                                <div className="flex items-center">
                                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
                                    <div
                                      className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                                      style={{ width: `${milestone.completion_percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-medium text-gray-900">
                                    {milestone.completion_percentage.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto text-red-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <p className="text-red-600 font-medium">Error loading campaign details</p>
                  <p className="text-sm text-gray-500 mt-1">{error}</p>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400 mb-4"
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
                  <p className="text-gray-500">No campaign details available</p>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
