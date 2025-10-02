"use client";

import {
  ArrowLeft,
  Check,
  X,
  Calendar,
  User,
  Building,
  FileText,
  CreditCard,
  Scale,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
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

interface ContractDetailProps {
  onBack?: () => void;
}

export default function ContractDetail({ onBack }: ContractDetailProps) {
  const [contractStatus, setContractStatus] = useState<
    "DRAFT" | "ACTIVE" | "COMPLETED" | "TERMINATED"
  >("DRAFT");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Mock contract data based on the SQL entity structure
  const contractData: ContractData = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    contract_number: "CTR-2024-001",
    type: "BRAND_AMBASSADOR",
    status: contractStatus,
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
  };

  const handleApprove = () => {
    setShowApproveDialog(true);
  };

  const handleReject = () => {
    setShowRejectDialog(true);
  };

  const confirmApprove = async () => {
    setIsProcessing(true);
    setShowApproveDialog(false);

    try {
      // Simulate API call
      setTimeout(() => {
        setContractStatus("ACTIVE");
        setIsProcessing(false);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: contractData.currency,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Contracts
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contract Details</h1>
              <p className="text-sm text-gray-500">Contract #{contractData.contract_number}</p>
            </div>
          </div>

          {contractData.status === "DRAFT" && (
            <div className="flex gap-3">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contract Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Contract Overview</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Contract Type</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {contractData.type.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(contractData.status)}`}
                    >
                      {contractData.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Date</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(contractData.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">End Date</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(contractData.end_date).toLocaleDateString()}
                  </p>
                </div>
                {contractData.signed_date && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Signed Date</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(contractData.signed_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Signed Location</label>
                      <p className="text-sm text-gray-900 mt-1">{contractData.signed_location}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Brand Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Brand Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Brand Name</label>
                  <p className="text-sm text-gray-900 mt-1">{contractData.brand.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Email</label>
                  <p className="text-sm text-gray-900 mt-1">{contractData.brand.contact_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Phone</label>
                  <p className="text-sm text-gray-900 mt-1">{contractData.brand.contact_phone}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-sm text-gray-900 mt-1">{contractData.brand.address}</p>
                </div>
              </div>
            </div>

            {/* Representative Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Representative Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-sm text-gray-900 mt-1">{contractData.representative_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="text-sm text-gray-900 mt-1">{contractData.representative_role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm text-gray-900 mt-1">{contractData.representative_phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900 mt-1">{contractData.representative_email}</p>
                </div>
                {contractData.representative_tax_number && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tax Number</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {contractData.representative_tax_number}
                    </p>
                  </div>
                )}
                {contractData.representative_bank_name && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bank Name</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {contractData.representative_bank_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Number</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {contractData.representative_bank_account_number}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Holder</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {contractData.representative_bank_account_holder}
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Financial Terms</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Value</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {formatCurrency(contractData.financial_terms.total_value)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Schedule</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {contractData.financial_terms.payment_schedule}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Method</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {contractData.financial_terms.payment_method}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Currency</label>
                  <p className="text-sm text-gray-900 mt-1">{contractData.currency}</p>
                </div>
              </div>
            </div>

            {/* Contract Dates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Important Dates</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(contractData.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(contractData.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Contract Duration</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {Math.ceil(
                      (new Date(contractData.end_date).getTime() -
                        new Date(contractData.start_date).getTime()) /
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
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Scope of Work & Legal Terms</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Deliverables</h3>
              <ul className="space-y-2">
                {contractData.scope_of_work.deliverables.map((item, index) => (
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
                {contractData.scope_of_work.requirements.map((item, index) => (
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
                {contractData.scope_of_work.responsibilities.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal Terms & Penalties</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Penalties</h4>
                <ul className="space-y-1">
                  {contractData.legal_terms.penalties.map((penalty, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {penalty}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Warranty</h4>
                <p className="text-sm text-gray-600">{contractData.legal_terms.warranty}</p>

                <h4 className="text-sm font-medium text-gray-700 mb-2 mt-4">Dispute Resolution</h4>
                <p className="text-sm text-gray-600">
                  {contractData.legal_terms.dispute_resolution}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                {contractData.brand.name} - {contractData.type.replace("_", " ")} Contract
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
                {contractData.brand.name} - {contractData.type.replace("_", " ")} Contract
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
  );
}
