"use client";

import { Eye, ChevronLeft, ChevronRight, ChevronDown, Menu, X } from "lucide-react";
import ContractDetail from "./ContractDetail";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useContract } from "@/libs/hooks/useContract";
import { getContractsByBrand } from "@/libs/stores/contractManager/thunk";
import type { AppDispatch } from "@/libs/stores";
import type { ContractBase } from "@/libs/types/contract";
import { getBrandIdFromToken } from "@/libs/helper/helper";

interface ContractApprovalProps {
  brandId?: string;
}

export default function ContractApproval({ brandId: propBrandId }: ContractApprovalProps = {}) {
  const { brandId: paramBrandId } = useParams<{ brandId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, contracts, pagination } = useContract();

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  // Get brand ID from URL param, prop, or JWT token
  const brandId = paramBrandId || propBrandId || getBrandIdFromToken();

  // Fetch contracts when component mounts or brand changes
  useEffect(() => {
    if (brandId) {
      dispatch(
        getContractsByBrand({
          brand_id: brandId,
          page: 1,
          limit: 10,
          status: selectedStatus || undefined,
        }),
      );
    }
  }, [dispatch, brandId, selectedStatus]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsStatusDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Show error if no brand ID is available
  if (!brandId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Brand ID Required</h2>
          <p className="text-gray-600">Please log in to view contracts.</p>
        </div>
      </div>
    );
  }

  // Get unique statuses for dropdown
  const uniqueStatuses = [...new Set((contracts || []).map((item) => item.status))];

  // Filter the data based on search and filters
  const filteredData = (contracts || []).filter((item) => {
    const matchesSearch =
      item.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "" || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Handle contract view
  const handleViewContract = (contract: ContractBase) => {
    setSelectedContractId(contract.id);
    setShowDetailView(true);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "TERMINATED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Conditional rendering for detail view
  if (showDetailView && selectedContractId) {
    return (
      <ContractDetail
        contractId={selectedContractId}
        onBack={() => {
          setShowDetailView(false);
          setSelectedContractId(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen md:p-2">
      <div className="mx-auto  md:px-2">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Contract Management</h1>
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
                  placeholder="Find contract"
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
                  placeholder="Search by name or email..."
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
            <table className="w-full min-w-[700px] table-fixed">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                    Contract Number
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Brand
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Start Date
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
                        <span className="ml-2 text-gray-500">Loading contracts...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No contracts found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 w-[20%]">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex-shrink-0 mr-2">
                            <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                              <svg
                                className="h-4 w-4 text-gray-400"
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
                            </div>
                          </div>
                          <div
                            className="text-sm font-medium text-gray-900 truncate"
                            title={item.contract_number}
                          >
                            {item.contract_number}
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-4 py-3 w-[25%] text-sm text-gray-900 truncate font-medium"
                        title={item.title}
                      >
                        {item.title}
                      </td>
                      <td
                        className="px-4 py-3 w-[15%] text-sm text-gray-500 truncate"
                        title={item.brand_name}
                      >
                        {item.brand_name}
                      </td>
                      <td
                        className="px-4 py-3 w-[10%] text-sm text-gray-500 truncate"
                        title={item.type.replace("_", " ")}
                      >
                        {item.type.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3 w-[10%] text-sm text-gray-500 truncate">
                        {new Date(item.start_date).toLocaleDateString()}
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
                          onClick={() => handleViewContract(item)}
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
      </div>
    </div>
  );
}
