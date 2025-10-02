"use client";

import {
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Check,
  Calendar,
  User,
  Building,
  FileText,
  CreditCard,
  Scale,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface ContractData {
  id: string;
  contract_number: string;
  type: "ADVERTISING" | "AFFILIATE" | "BRAND_AMBASSADOR" | "CO_PRODUCING";
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "TERMINATED";
  signed_date?: string;
  signed_location?: string;
  start_date: string;
  end_date: string;
  brand: {
    id: string;
    name: string;
    contact_email: string;
    contact_phone: string;
    address: string;
  };
  representative_name: string;
  representative_role: string;
  representative_phone: string;
  representative_email: string;
  representative_tax_number?: string;
  representative_bank_name?: string;
  representative_bank_account_number?: string;
  representative_bank_account_holder?: string;
  currency: string;
  financial_terms: {
    total_value: number;
    payment_schedule: string;
    payment_method: string;
  };
  scope_of_work: {
    deliverables: string[];
    requirements: string[];
    responsibilities: string[];
  };
  legal_terms: {
    penalties: string[];
    warranty: string;
    dispute_resolution: string;
  };
  created_at: string;
  updated_at: string;
}

export default function ContractApproval() {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  const [contractStatus, setContractStatus] = useState<
    "DRAFT" | "ACTIVE" | "COMPLETED" | "TERMINATED"
  >("DRAFT");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const contractData: ContractData[] = [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      contract_number: "CTR-2024-001",
      type: "BRAND_AMBASSADOR",
      status: "ACTIVE",
      signed_date: "2024-01-15",
      signed_location: "Ho Chi Minh City, Vietnam",
      start_date: "2024-02-01",
      end_date: "2024-12-31",
      brand: {
        id: "brand-001",
        name: "Innisfree Vietnam",
        contact_email: "contact@innisfree.vn",
        contact_phone: "+84 28 1234 5678",
        address: "123 Nguyen Hue Street, District 1, Ho Chi Minh City",
      },
      representative_name: "Nguyen Thi Minh Anh",
      representative_role: "Brand Ambassador Manager",
      representative_phone: "+84 901 234 567",
      representative_email: "minh.anh@innisfree.vn",
      representative_tax_number: "0123456789",
      representative_bank_name: "Vietcombank",
      representative_bank_account_number: "1234567890",
      representative_bank_account_holder: "Nguyen Thi Minh Anh",
      currency: "VND",
      financial_terms: {
        total_value: 50000000,
        payment_schedule: "Monthly payments of 5,000,000 VND",
        payment_method: "Bank Transfer",
      },
      scope_of_work: {
        deliverables: [
          "4 Instagram posts per month featuring Innisfree products",
          "2 Instagram stories per week showcasing product usage",
          "1 monthly blog post about skincare routine",
          "Attendance at 2 brand events per quarter",
        ],
        requirements: [
          "Minimum 100K followers on Instagram",
          "Engagement rate above 3%",
          "Content must align with brand aesthetic",
          "All posts require brand approval before publishing",
        ],
        responsibilities: [
          "Create authentic and engaging content",
          "Respond to comments and engage with audience",
          "Provide monthly performance reports",
          "Maintain professional brand image",
        ],
      },
      legal_terms: {
        penalties: [
          "Late delivery penalty: 100,000 VND per day",
          "Contract breach penalty: 20% of total contract value",
          "Unauthorized content penalty: 500,000 VND per violation",
        ],
        warranty:
          "Representative warrants that all content is original and does not infringe on third-party rights",
        dispute_resolution:
          "Any disputes shall be resolved through arbitration in Ho Chi Minh City under Vietnamese law",
      },
      created_at: "2024-01-10T09:00:00Z",
      updated_at: "2024-01-15T14:30:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      contract_number: "CTR-2024-002",
      type: "ADVERTISING",
      status: "DRAFT",
      start_date: "2024-03-01",
      end_date: "2024-12-31",
      brand: {
        id: "brand-002",
        name: "The Ordinary",
        contact_email: "partnerships@theordinary.com",
        contact_phone: "+84 28 9876 5432",
        address: "456 Le Loi Street, District 3, Ho Chi Minh City",
      },
      representative_name: "Tran Van Duc",
      representative_role: "Content Creator",
      representative_phone: "+84 912 345 678",
      representative_email: "duc.tran@email.com",
      currency: "USD",
      financial_terms: {
        total_value: 2500,
        payment_schedule: "50% upfront, 50% upon completion",
        payment_method: "PayPal",
      },
      scope_of_work: {
        deliverables: [
          "3 YouTube videos showcasing skincare routine",
          "5 Instagram posts with product reviews",
          "1 detailed blog post about ingredient benefits",
        ],
        requirements: [
          "Minimum 50K YouTube subscribers",
          "Focus on skincare and beauty content",
          "Must disclose sponsored content",
        ],
        responsibilities: [
          "Create educational content about skincare",
          "Engage with audience questions",
          "Provide usage analytics",
        ],
      },
      legal_terms: {
        penalties: ["Late delivery penalty: $50 per day", "Content quality issues: $200 penalty"],
        warranty: "Content must be original and comply with advertising standards",
        dispute_resolution: "Disputes resolved under Singapore arbitration",
      },
      created_at: "2024-02-20T10:30:00Z",
      updated_at: "2024-02-25T16:45:00Z",
    },
  ];

  // Get unique statuses for dropdown
  const uniqueStatuses = [...new Set(contractData.map((item) => item.status))];

  // Filter the data based on search and filters
  const filteredData = contractData.filter((item) => {
    const matchesSearch =
      item.brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contract_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "" || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Handle contract view
  const handleViewContract = (contract: ContractData) => {
    setSelectedContract(contract);
    setContractStatus(contract.status);
    setIsModalOpen(true);
  };

  const handleApprove = () => {
    setShowApproveDialog(true);
  };

  const handleReject = () => {
    setShowRejectDialog(true);
  };

  const confirmApprove = async () => {
    if (!selectedContract) return;
    setIsProcessing(true);
    setShowApproveDialog(false);

    try {
      // Simulate API call
      setTimeout(() => {
        setContractStatus("ACTIVE");
        setIsProcessing(false);
        // In real app, this would update the backend and refresh the data
        toast.success("Contract approved successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }, 1500);
    } catch {
      setIsProcessing(false);
      toast.error("Failed to approve contract. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const confirmReject = async () => {
    if (!selectedContract) return;
    setIsProcessing(true);
    setShowRejectDialog(false);

    try {
      // Simulate API call
      setTimeout(() => {
        setContractStatus("TERMINATED");
        setIsProcessing(false);
        toast.success("Contract rejected successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }, 1500);
    } catch {
      setIsProcessing(false);
      toast.error("Failed to reject contract. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                    Contract Number
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                    Brand
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 w-[25%]">
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
                      className="px-4 py-3 w-[20%] text-sm text-gray-500 truncate"
                      title={item.brand.name}
                    >
                      {item.brand.name}
                    </td>
                    <td
                      className="px-4 py-3 w-[15%] text-sm text-gray-500 truncate"
                      title={item.type.replace("_", " ")}
                    >
                      {item.type.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3 w-[10%] text-sm text-gray-500 truncate">
                      {new Date(item.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 w-[10%] text-sm text-gray-500 truncate">
                      {new Date(item.end_date).toLocaleDateString()}
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

        {/* Contract Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-7xl w-[95vw] h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Contract Details</DialogTitle>
              <DialogDescription>Contract #{selectedContract?.contract_number}</DialogDescription>
            </DialogHeader>

            {selectedContract && (
              <div className="space-y-6">
                {/* Action Buttons */}
                {selectedContract.status === "DRAFT" && (
                  <div className="flex gap-3 justify-end border-b pb-4">
                    <Button
                      onClick={handleReject}
                      disabled={isProcessing}
                      variant="outline"
                      className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                      {isProcessing ? "Processing..." : "Reject"}
                    </Button>
                    <Button
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                      {isProcessing ? "Processing..." : "Approve"}
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Contract Overview */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-900">Contract Overview</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Contract Type</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {selectedContract.type.replace("_", " ")}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <div className="mt-1">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(contractStatus)}`}
                            >
                              {contractStatus}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Start Date</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {new Date(selectedContract.start_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">End Date</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {new Date(selectedContract.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        {selectedContract.signed_date && (
                          <>
                            <div>
                              <label className="text-sm font-medium text-gray-500">
                                Signed Date
                              </label>
                              <p className="text-sm text-gray-900 mt-1">
                                {new Date(selectedContract.signed_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">
                                Signed Location
                              </label>
                              <p className="text-sm text-gray-900 mt-1">
                                {selectedContract.signed_location}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Brand Information */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Building className="h-5 w-5 text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-900">Brand Information</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Brand Name</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {selectedContract.brand.name}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Contact Email</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {selectedContract.brand.contact_email}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Contact Phone</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {selectedContract.brand.contact_phone}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-500">Address</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {selectedContract.brand.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Representative Information */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <User className="h-5 w-5 text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-900">
                          Representative Information
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Name</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {selectedContract.representative_name}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Role</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {selectedContract.representative_role}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {selectedContract.representative_phone}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {selectedContract.representative_email}
                          </p>
                        </div>
                        {selectedContract.representative_tax_number && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Tax Number</label>
                            <p className="text-sm text-gray-900 mt-1">
                              {selectedContract.representative_tax_number}
                            </p>
                          </div>
                        )}
                        {selectedContract.representative_bank_name && (
                          <>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Bank Name</label>
                              <p className="text-sm text-gray-900 mt-1">
                                {selectedContract.representative_bank_name}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">
                                Account Number
                              </label>
                              <p className="text-sm text-gray-900 mt-1">
                                {selectedContract.representative_bank_account_number}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">
                                Account Holder
                              </label>
                              <p className="text-sm text-gray-900 mt-1">
                                {selectedContract.representative_bank_account_holder}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Financial Terms */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-900">Financial Terms</h2>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Total Value</label>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {formatCurrency(
                              selectedContract.financial_terms.total_value,
                              selectedContract.currency,
                            )}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Payment Schedule
                          </label>
                          <p className="text-sm text-gray-900 mt-1">
                            {selectedContract.financial_terms.payment_schedule}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Payment Method
                          </label>
                          <p className="text-sm text-gray-900 mt-1">
                            {selectedContract.financial_terms.payment_method}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Currency</label>
                          <p className="text-sm text-gray-900 mt-1">{selectedContract.currency}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contract Dates */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-900">Important Dates</h2>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Created</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {new Date(selectedContract.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Last Updated</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {new Date(selectedContract.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Contract Duration
                          </label>
                          <p className="text-sm text-gray-900 mt-1">
                            {Math.ceil(
                              (new Date(selectedContract.end_date).getTime() -
                                new Date(selectedContract.start_date).getTime()) /
                                (1000 * 60 * 60 * 24),
                            )}{" "}
                            days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scope of Work */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Scale className="h-5 w-5 text-gray-400" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Scope of Work & Legal Terms
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Deliverables</h3>
                      <ul className="space-y-2">
                        {selectedContract.scope_of_work.deliverables.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Requirements</h3>
                      <ul className="space-y-2">
                        {selectedContract.scope_of_work.requirements.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Responsibilities</h3>
                      <ul className="space-y-2">
                        {selectedContract.scope_of_work.responsibilities.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      Legal Terms & Penalties
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Penalties</h4>
                        <ul className="space-y-1">
                          {selectedContract.legal_terms.penalties.map((penalty, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              • {penalty}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Warranty</h4>
                        <p className="text-sm text-gray-600">
                          {selectedContract.legal_terms.warranty}
                        </p>

                        <h4 className="text-sm font-medium text-gray-700 mb-2 mt-4">
                          Dispute Resolution
                        </h4>
                        <p className="text-sm text-gray-600">
                          {selectedContract.legal_terms.dispute_resolution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Approve Confirmation Dialog */}
        <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <DialogTitle className="text-left">Confirm Status Change</DialogTitle>
                </div>
              </div>
            </DialogHeader>
            <div className="py-4">
              <DialogDescription className="text-gray-600">
                This action will change the status to Active.
              </DialogDescription>
              <DialogDescription className="mt-2 text-gray-600">
                Are you sure you want to change the status of this{" "}
                <span className="font-medium text-gray-900">
                  {selectedContract?.brand.name} - {selectedContract?.type.replace("_", " ")}{" "}
                  Contract
                </span>
                ?
              </DialogDescription>
            </div>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowApproveDialog(false)}
                className="text-gray-600"
              >
                No
              </Button>
              <Button
                onClick={confirmApprove}
                disabled={isProcessing}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {isProcessing ? "Processing..." : "Yes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Confirmation Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <DialogTitle className="text-left">Confirm Status Change</DialogTitle>
                </div>
              </div>
            </DialogHeader>
            <div className="py-4">
              <DialogDescription className="text-gray-600">
                This action will change the status to Terminated.
              </DialogDescription>
              <DialogDescription className="mt-2 text-gray-600">
                Are you sure you want to reject this{" "}
                <span className="font-medium text-gray-900">
                  {selectedContract?.brand.name} - {selectedContract?.type.replace("_", " ")}{" "}
                  Contract
                </span>
                ?
              </DialogDescription>
            </div>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
                className="text-gray-600"
              >
                No
              </Button>
              <Button
                onClick={confirmReject}
                disabled={isProcessing}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {isProcessing ? "Processing..." : "Yes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
