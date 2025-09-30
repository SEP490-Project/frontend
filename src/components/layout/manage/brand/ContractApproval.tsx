"use client";

import { Eye, ChevronLeft, ChevronRight, ChevronDown, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function ContractApproval() {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const contractData = [
    {
      title: "Innisfree Cherry Blossom Collection Partnership",
      type: "Influencer Contract",
      startDate: "15.01.2024",
      endDate: "15.07.2024",
      status: "Active",
    },
    {
      title: "The Ordinary Skincare Product Showcase",
      type: "Brand Ambassador",
      startDate: "01.03.2024",
      endDate: "31.12.2024",
      status: "Pending",
    },
    {
      title: "Glow Recipe Vitamin C Serum Campaign",
      type: "Content Creation",
      startDate: "20.02.2024",
      endDate: "20.05.2024",
      status: "Expired",
    },
    {
      title: "Fenty Beauty Makeup Tutorial Series",
      type: "Video Content",
      startDate: "10.04.2024",
      endDate: "10.10.2024",
      status: "Active",
    },
    {
      title: "CeraVe Moisturizer Review Contract",
      type: "Product Review",
      startDate: "05.05.2024",
      endDate: "05.08.2024",
      status: "Pending",
    },
  ];

  // Get unique statuses for dropdown
  const uniqueStatuses = [...new Set(contractData.map((item) => item.status))];

  // Filter the data based on search and filters
  const filteredData = contractData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "" || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsStatusDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%]">
                    Contract
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Partner
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Start Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    End Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 w-[35%]">
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
                          title={item.title}
                        >
                          {item.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 w-[15%] text-sm text-gray-500 truncate">
                      Partner Name
                    </td>
                    <td
                      className="px-4 py-3 w-[15%] text-sm text-gray-500 truncate"
                      title={item.type}
                    >
                      {item.type}
                    </td>
                    <td className="px-4 py-3 w-[10%] text-sm text-gray-500 truncate">
                      {item.startDate}
                    </td>
                    <td className="px-4 py-3 w-[10%] text-sm text-gray-500 truncate">
                      {item.endDate}
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
                    <td className="px-4 py-3 w-[5%] text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
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
                  <span className="font-medium">{filteredData.length}</span> results
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
