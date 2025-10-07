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
  Loader2,
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
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useContractDetail } from "@/libs/hooks/useContractDetail";

interface ContractDetailProps {
  contractId: string;
  onBack?: () => void;
}

export default function ContractDetail({ contractId, onBack }: ContractDetailProps) {
  const {
    detailLoading,
    contractDetail,
    actionLoading,
    fetchContractDetail,
    approveContractAction,
    rejectContractAction,
    clearContractDetail,
  } = useContractDetail();

  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    if (contractId) {
      fetchContractDetail(contractId);
    }
    return () => {
      clearContractDetail();
    };
  }, [contractId, fetchContractDetail, clearContractDetail]);

  const handleApprove = () => {
    setShowApproveDialog(true);
  };

  const handleReject = () => {
    setShowRejectDialog(true);
  };

  const confirmApprove = async () => {
    if (!contractDetail) return;

    setShowApproveDialog(false);

    try {
      await approveContractAction(contractDetail.id);
      toast.success("Contract approved successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch {
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
    if (!contractDetail) return;

    setShowRejectDialog(false);

    try {
      await rejectContractAction(contractDetail.id);
      toast.success("Contract rejected successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch {
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

  // Show loading state
  if (detailLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-gray-600">Loading contract details...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if no contract data
  if (!contractDetail) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Contracts
            </Button>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Contract Not Found</h3>
              <p className="text-gray-600">
                The contract you're looking for doesn't exist or you don't have permission to view
                it.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <p className="text-sm text-gray-500">Contract #{contractDetail.contract_number}</p>
            </div>
          </div>

          {contractDetail.status === "DRAFT" && (
            <div className="flex gap-3">
              <Button
                onClick={handleReject}
                disabled={actionLoading}
                variant="outline"
                className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
                {actionLoading ? "Processing..." : "Reject"}
              </Button>
              <Button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
                {actionLoading ? "Processing..." : "Approve"}
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
                    {contractDetail.type.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(contractDetail.status)}`}
                    >
                      {contractDetail.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Date</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(contractDetail.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">End Date</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(contractDetail.end_date).toLocaleDateString()}
                  </p>
                </div>
                {contractDetail.signed_date && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Signed Date</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(contractDetail.signed_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Signed Location</label>
                      <p className="text-sm text-gray-900 mt-1">{contractDetail.signed_location}</p>
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
                  <p className="text-sm text-gray-900 mt-1">{contractDetail.brand.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Email</label>
                  <p className="text-sm text-gray-900 mt-1">{contractDetail.brand.contact_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Phone</label>
                  <p className="text-sm text-gray-900 mt-1">{contractDetail.brand.contact_phone}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-sm text-gray-900 mt-1">{contractDetail.brand.address}</p>
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
                  <p className="text-sm text-gray-900 mt-1">{contractDetail.representative_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="text-sm text-gray-900 mt-1">{contractDetail.representative_role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {contractDetail.representative_phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {contractDetail.representative_email}
                  </p>
                </div>
                {contractDetail.representative_tax_number && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tax Number</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {contractDetail.representative_tax_number}
                    </p>
                  </div>
                )}
                {contractDetail.representative_bank_name && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bank Name</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {contractDetail.representative_bank_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Number</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {contractDetail.representative_bank_account_number}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Holder</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {contractDetail.representative_bank_account_holder}
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
                    {formatCurrency(
                      contractDetail.financial_terms.total_value,
                      contractDetail.currency,
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Schedule</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {contractDetail.financial_terms.payment_schedule}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Method</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {contractDetail.financial_terms.payment_method}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Currency</label>
                  <p className="text-sm text-gray-900 mt-1">{contractDetail.currency}</p>
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
                    {new Date(contractDetail.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(contractDetail.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Contract Duration</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {Math.ceil(
                      (new Date(contractDetail.end_date).getTime() -
                        new Date(contractDetail.start_date).getTime()) /
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
                {contractDetail.scope_of_work.deliverables.map((item, index) => (
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
                {contractDetail.scope_of_work.requirements.map((item, index) => (
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
                {contractDetail.scope_of_work.responsibilities.map((item, index) => (
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
                  {contractDetail.legal_terms.penalties.map((penalty, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {penalty}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Warranty</h4>
                <p className="text-sm text-gray-600">{contractDetail.legal_terms.warranty}</p>

                <h4 className="text-sm font-medium text-gray-700 mb-2 mt-4">Dispute Resolution</h4>
                <p className="text-sm text-gray-600">
                  {contractDetail.legal_terms.dispute_resolution}
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
                {contractDetail.brand.name} - {contractDetail.type.replace("_", " ")} Contract
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
              disabled={actionLoading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {actionLoading ? "Processing..." : "Yes"}
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
                {contractDetail.brand.name} - {contractDetail.type.replace("_", " ")} Contract
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
              disabled={actionLoading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {actionLoading ? "Processing..." : "Yes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
