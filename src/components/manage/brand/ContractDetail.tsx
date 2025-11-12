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
import { useContractDetail } from "@/libs/hooks/useContractDetail";
import { toast } from "sonner";

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
      toast.success("Contract approved successfully!");
    } catch {
      toast.error("Failed to approve contract. Please try again.");
    }
  };

  const confirmReject = async () => {
    if (!contractDetail) return;

    setShowRejectDialog(false);

    try {
      await rejectContractAction(contractDetail.id);
      toast.success("Contract rejected successfully!");
    } catch {
      toast.error("Failed to reject contract. Please try again.");
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
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
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
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Contract Title</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{contractDetail.title}</p>
                </div>
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

                {/* Parent Contract Information */}
                {contractDetail.parent_contract_id && (
                  <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Parent Contract</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Parent Contract ID
                        </label>
                        <p className="text-sm text-gray-900 mt-1">
                          {contractDetail.parent_contract_id}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* File Downloads */}
                {(contractDetail.contract_file_url || contractDetail.proposal_file_url) && (
                  <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Documents</h3>
                    <div className="flex flex-wrap gap-3">
                      {contractDetail.contract_file_url && (
                        <a
                          href={contractDetail.contract_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Contract File
                        </a>
                      )}
                      {contractDetail.proposal_file_url && (
                        <a
                          href={contractDetail.proposal_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Proposal File
                        </a>
                      )}
                    </div>
                  </div>
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
                  <label className="text-sm font-medium text-gray-500">Tax Number</label>
                  <p className="text-sm text-gray-900 mt-1">{contractDetail.brand.tax_number}</p>
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

                {/* Brand Banking Information */}
                <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Banking Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bank Name</label>
                      <p className="text-sm text-gray-900 mt-1">{contractDetail.brand.bank_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Number</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {contractDetail.brand.bank_account_number}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Holder</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {contractDetail.brand.bank_account_holder}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Brand Representative */}
                <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Brand Representative</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {contractDetail.brand.representative_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Role</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {contractDetail.brand.representative_role}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {contractDetail.brand.representative_phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {contractDetail.brand.representative_email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Citizen ID</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {contractDetail.brand.representative_citizen_id}
                      </p>
                    </div>
                  </div>
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
                  <label className="text-sm font-medium text-gray-500">Deposit Amount</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {formatCurrency(contractDetail.deposit_amount, contractDetail.currency)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Deposit Status</label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        contractDetail.is_deposit_paid
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {contractDetail.is_deposit_paid ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Currency</label>
                  <p className="text-sm text-gray-900 mt-1">{contractDetail.currency}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Revenue Model</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {contractDetail.financial_terms?.model || "Not specified"}
                  </p>
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

        {/* Enhanced Contract Details */}
        <div className="space-y-6 mt-6">
          {/* Financial Information */}
          <div className="bg-green-50 rounded-lg border border-green-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-5 w-5 text-green-400" />
              <h2 className="text-lg font-semibold text-green-900">
                Enhanced Financial Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-green-700">Deposit Amount</label>
                <p className="text-sm text-green-900 mt-1 font-semibold">
                  {contractDetail.deposit_amount?.toLocaleString()} {contractDetail.currency}
                </p>
                <p className="text-xs text-green-600">
                  {contractDetail.is_deposit_paid ? "✓ Paid" : "⏳ Unpaid"}
                </p>
              </div>
              {contractDetail.financial_terms &&
                typeof contractDetail.financial_terms === "object" && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-green-700">Revenue Model</label>
                      <p className="text-sm text-green-900 mt-1">
                        {contractDetail.financial_terms.model || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-green-700">Profit Split</label>
                      <p className="text-sm text-green-900 mt-1">
                        Company: {contractDetail.financial_terms.profit_split_company_percent || 0}%
                        | KOL: {contractDetail.financial_terms.profit_split_kol_percent || 0}%
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-green-700">Distribution</label>
                      <p className="text-sm text-green-900 mt-1">
                        {contractDetail.financial_terms.profit_distribution_cycle || "N/A"} - Day{" "}
                        {contractDetail.financial_terms.profit_distribution_date || "N/A"}
                      </p>
                    </div>
                  </>
                )}
            </div>
          </div>

          {/* Scope of Work */}
          {contractDetail.scope_of_work && typeof contractDetail.scope_of_work === "object" && (
            <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="h-5 w-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-purple-900">Scope of Work</h2>
              </div>

              {/* General Requirements */}
              {contractDetail.scope_of_work.general_requirements && (
                <div className="mb-4">
                  <h3 className="text-md font-semibold text-purple-800 mb-2">
                    General Requirements
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {contractDetail.scope_of_work.general_requirements.map(
                      (req: string, index: number) => (
                        <li key={index} className="text-sm text-purple-900">
                          {req}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

              {/* Products */}
              {contractDetail.scope_of_work.deliverables?.products && (
                <div className="mb-4">
                  <h3 className="text-md font-semibold text-purple-800 mb-2">
                    Products ({contractDetail.scope_of_work.deliverables.products.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {contractDetail.scope_of_work.deliverables.products.map(
                      (product: any, index: number) => (
                        <div key={index} className="bg-white rounded p-3 border">
                          <h4 className="font-medium text-purple-900">{product.name}</h4>
                          <p className="text-sm text-purple-700">{product.description}</p>
                          {product.kpis && product.kpis.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-purple-600">KPIs:</span>
                              {product.kpis.map((kpi: any, kpiIndex: number) => (
                                <span key={kpiIndex} className="text-xs text-purple-600 ml-1">
                                  {kpi.metric}: {kpi.target || "TBD"}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Concepts */}
              {contractDetail.scope_of_work.deliverables?.concepts && (
                <div>
                  <h3 className="text-md font-semibold text-purple-800 mb-2">
                    Content Concepts ({contractDetail.scope_of_work.deliverables.concepts.length})
                  </h3>
                  <div className="space-y-3">
                    {contractDetail.scope_of_work.deliverables.concepts.map(
                      (concept: any, index: number) => (
                        <div key={index} className="bg-white rounded p-3 border">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-purple-900">{concept.name}</h4>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {concept.platform}
                            </span>
                          </div>
                          <p className="text-sm text-purple-700 mb-2">{concept.description}</p>
                          {concept.tagline && (
                            <p className="text-sm text-purple-600">
                              <span className="font-medium">Tagline:</span> {concept.tagline}
                            </p>
                          )}
                          {concept.hash_tag && concept.hash_tag.length > 0 && (
                            <p className="text-sm text-purple-600">
                              <span className="font-medium">Hashtags:</span>{" "}
                              {concept.hash_tag.join(", ")}
                            </p>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Legal Terms */}
          {contractDetail.legal_terms && typeof contractDetail.legal_terms === "object" && (
            <div className="bg-red-50 rounded-lg border border-red-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="h-5 w-5 text-red-400" />
                <h2 className="text-lg font-semibold text-red-900">Legal Terms</h2>
              </div>

              {/* Standard Terms */}
              {contractDetail.legal_terms.standard_terms && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-red-800 mb-3">
                    {contractDetail.legal_terms.standard_terms.label}
                  </h3>
                  <div className="space-y-3">
                    {contractDetail.legal_terms.standard_terms.items.map(
                      (item: any, index: number) => (
                        <div key={index} className="bg-white rounded p-3 border">
                          <h4 className="font-medium text-red-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-red-700">{item.description}</p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Breach of Contract */}
              {contractDetail.legal_terms.breach_of_contract && (
                <div>
                  <h3 className="text-md font-semibold text-red-800 mb-3">
                    {contractDetail.legal_terms.breach_of_contract.label}
                  </h3>
                  <div className="space-y-3">
                    {contractDetail.legal_terms.breach_of_contract.items.map(
                      (item: any, index: number) => (
                        <div key={index} className="bg-white rounded p-3 border">
                          <h4 className="font-medium text-red-900 mb-2">{item.title}</h4>
                          {item.compensation_percent && (
                            <p className="text-sm text-red-600 mb-2">
                              <span className="font-medium">Compensation:</span>{" "}
                              {item.compensation_percent}%
                            </p>
                          )}
                          <ul className="list-disc list-inside space-y-1">
                            {item.details.map((detail: string, detailIndex: number) => (
                              <li key={detailIndex} className="text-sm text-red-700">
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fallback for string-based scope_of_work and legal_terms */}
          {(typeof contractDetail.scope_of_work === "string" ||
            typeof contractDetail.legal_terms === "string") && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Scale className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Scope of Work & Legal Terms</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {typeof contractDetail.scope_of_work === "string" && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Scope of Work</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {contractDetail.scope_of_work || "No scope of work specified"}
                      </p>
                    </div>
                  </div>
                )}

                {typeof contractDetail.legal_terms === "string" && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Legal Terms</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {contractDetail.legal_terms || "No legal terms specified"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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
              This action will change the status to Approved.
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
