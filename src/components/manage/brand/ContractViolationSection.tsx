import { useState, useRef } from "react";
import {
  AlertTriangle,
  Calendar,
  CreditCard,
  FileText,
  Image,
  User,
  Info,
  DollarSign,
  ExternalLink,
  Upload,
  X,
  Loader2,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ContractViolation } from "@/libs/types/violation";
import {
  PROOF_STATUS_STYLE,
  VIOLATION_PROOF_STATUS_LABELS,
  VIOLATION_TYPE_STYLE,
} from "@/libs/types/violation";
import { useAppDispatch } from "@/libs/stores";
import { uploadFilesThunk } from "@/libs/stores/fileManager/thunk";
import { manageViolation } from "@/libs/services/manageViolation";
import { toast } from "sonner";
import { useAuth } from "@/libs/hooks/useAuth";

interface ContractViolationSectionProps {
  violation: ContractViolation;
  contractStatus: string;
  userRole: "brand" | "marketing";
  onPayPenalty?: () => void;
  onReviewProof?: () => void;
  onSubmitProof?: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-UK", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const maxFileSizeInMB = 10;

export default function ContractViolationSection({
  violation,
  contractStatus,
  userRole,
  onPayPenalty,
  onReviewProof,
  onSubmitProof,
}: ContractViolationSectionProps) {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [proofMessage, setProofMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeImageSrc, setActiveImageSrc] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBrandViolation = violation.type === "BRAND";
  const isKOLViolation = violation.type === "KOL";

  // Determine which actions are available based on status and role
  const showPayPenaltyButton =
    userRole === "brand" &&
    isBrandViolation &&
    contractStatus === "BRAND_PENALTY_PENDING" &&
    !violation.payment_data;

  const showPaymentLink =
    userRole === "brand" &&
    isBrandViolation &&
    contractStatus === "BRAND_PENALTY_PENDING" &&
    violation.payment_data;

  const showSubmitProofButton = false; // Logic moved inline to Proof Section

  const showReviewProofButton =
    userRole === "brand" && isKOLViolation && contractStatus === "KOL_PROOF_SUBMITTED";

  const stripColorClass = isBrandViolation ? "bg-orange-500" : "bg-purple-500";
  const headerBgClass = isBrandViolation ? "bg-orange-50/50" : "bg-purple-50/50";

  const handleViewImage = (url: string | undefined | null) => {
    if (url) {
      setActiveImageSrc(url);
      setIsImageDialogOpen(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > maxFileSizeInMB * 1024 * 1024) {
        toast.error(`File size must be less than ${maxFileSizeInMB}MB`);
        return;
      }
      setProofFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setProofFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitProof = async () => {
    if (!proofFile) {
      toast.error("Please upload a proof image");
      return;
    }
    if (!user || !user.id) {
      toast.error("User session invalid");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload file
      const result = await dispatch(
        uploadFilesThunk({ userId: user.id, files: [proofFile] }),
      ).unwrap();

      const uploadedUrl = Array.isArray(result) ? result[0] : (result as any).url || result;

      // 2. Submit proof
      await manageViolation.submitProof(violation.contract_id, {
        proof_url: uploadedUrl as string,
        message: proofMessage,
      });

      toast.success("Refund proof submitted successfully");

      // Cleanup
      handleRemoveFile();
      setProofMessage("");
      onSubmitProof?.();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to submit proof");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmitProof =
    userRole === "marketing" &&
    isKOLViolation &&
    (contractStatus === "KOL_REFUND_PENDING" || contractStatus === "KOL_PROOF_REJECTED");

  return (
    <Card className="border-red-200 shadow-md overflow-hidden animate-in fade-in duration-500">
      <div className={`h-1.5 w-full ${stripColorClass}`} />

      <CardHeader className={`${headerBgClass} pb-6`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${isBrandViolation ? "bg-orange-100" : "bg-purple-100"}`}
            >
              <AlertTriangle
                className={`h-6 w-6 ${isBrandViolation ? "text-orange-600" : "text-purple-600"}`}
              />
            </div>
            <div>
              <CardTitle
                className={`text-xl font-bold ${isBrandViolation ? "text-orange-950" : "text-purple-950"}`}
              >
                {isBrandViolation ? "Brand Violation Detected" : "KOL Violation Detected"}
              </CardTitle>
              <CardDescription
                className={`${isBrandViolation ? "text-orange-800" : "text-purple-800"} mt-1 max-w-xl`}
              >
                {isBrandViolation
                  ? "This contract is flagged due to a violation by the Brand. Immediate action is required to resolve the penalty."
                  : "This contract is flagged due to a violation by the KOL. A refund process has been initiated."}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className={VIOLATION_TYPE_STYLE(violation.type)}>
              {violation.type === "BRAND" ? "Brand Violation" : "KOL Violation"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {/* Violation Reason */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
              <Info className="h-5 w-5 text-gray-500" />
              <h3>Violation Details</h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Reason
              </h4>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {violation.reason}
              </p>

              <Separator className="my-4" />

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>
                    Reported by: <span className="font-medium text-gray-900">System</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Reported on:{" "}
                    <span className="font-medium text-gray-900">
                      {formatDate(violation.created_at)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm p-5 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <DollarSign className="h-32 w-32" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                Financial Summary
              </h3>

              <div className="space-y-3 relative z-10">
                {isBrandViolation && violation.total_paid_by_brand && (
                  <>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      Forfeited Amount
                    </h4>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        {isBrandViolation ? "Paid (Forfeited)" : "Total Paid"}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(violation.total_paid_by_brand || 0)}
                      </span>
                    </div>

                    <Separator className="my-2" />

                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      Pending Amount
                    </h4>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-red-500">Penalty / Additional Fee</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(violation.penalty_amount || 0)}
                      </span>
                    </div>

                    <div className="flex justify-between items-end">
                      <span className="text-sm font-semibold text-gray-700">Total Due</span>
                      <span className="text-2xl font-bold text-red-600 tracking-tight">
                        {formatCurrency(violation.penalty_amount)}
                      </span>
                    </div>
                  </>
                )}

                {isKOLViolation && (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-red-500">Paid by brand</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(violation.total_paid_by_brand || 0)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-red-500">Penalty Amount</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(violation.penalty_amount || 0)}
                      </span>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex justify-between items-end">
                      <span className="text-sm font-semibold text-gray-700">Total Due</span>
                      <span className="text-2xl font-bold text-red-600 tracking-tight">
                        {formatCurrency(violation.refund_amount)}
                      </span>
                    </div>
                  </>
                )}

                {contractStatus === "BRAND_PENALTY_PAID" && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 mt-2 w-full justify-center">
                    Paid Successfully
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Proof Section (Refactored) */}
        {isKOLViolation && (
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="bg-gray-50/80 backdrop-blur-sm px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Refund Verification</h3>
              </div>
              {violation.proof_status && (
                <Badge variant="outline" className={PROOF_STATUS_STYLE(violation.proof_status)}>
                  {VIOLATION_PROOF_STATUS_LABELS[violation.proof_status] || violation.proof_status}
                </Badge>
              )}
            </div>

            <div className="p-6">
              {violation.proof_url && (
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  <div className="flex-shrink-0 group relative">
                    <div
                      onClick={() => handleViewImage(violation.proof_url)}
                      className="w-full md:w-64 aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer bg-gray-100"
                    >
                      <img
                        src={violation.proof_url}
                        alt="Refund proof"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                          <ZoomIn className="w-3.5 h-3.5" /> View Fullscreen
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                          Submitted Date
                        </label>
                        <p className="font-medium text-gray-900">
                          {violation.proof_submitted_at
                            ? formatDate(violation.proof_submitted_at)
                            : "N/A"}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                          Current Status
                        </label>
                        <p className="font-medium text-gray-900">
                          {VIOLATION_PROOF_STATUS_LABELS[violation.proof_status || "PENDING"]}
                        </p>
                      </div>
                    </div>

                    {violation.proof_status === "PENDING" && violation.proof_review_note && (
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100 animate-in fade-in slide-in-from-top-1">
                        <div className="flex gap-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                              Note from Submitter
                            </h4>
                            <p className="text-sm text-yellow-700 leading-relaxed">
                              {violation.proof_review_note}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {violation.proof_status === "REJECTED" && violation.proof_review_note && (
                      <div className="bg-red-50 rounded-lg p-4 border border-red-100 animate-in fade-in slide-in-from-top-1">
                        <div className="flex gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-semibold text-red-900 mb-1">
                              Rejection Reason
                            </h4>
                            <p className="text-sm text-red-700 leading-relaxed">
                              {violation.proof_review_note}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!violation.proof_url && !canSubmitProof && (
                <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="bg-gray-100 p-3 rounded-full mb-3">
                    <Image className="h-6 w-6 text-gray-400" />
                  </div>
                  <h4 className="text-gray-900 font-medium">No Proof Document</h4>
                  <p className="text-sm text-gray-500 mt-1 text-center max-w-sm">
                    {userRole === "marketing"
                      ? "Waiting for proof submission from Finance team."
                      : "No proof uploaded yet. You will be notified once available."}
                  </p>
                </div>
              )}

              {canSubmitProof && (
                <div className={violation.proof_url ? "pt-6 border-t border-gray-100" : ""}>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      {violation.proof_url ? (
                        <Upload className="h-4 w-4" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {violation.proof_url ? "Resubmit Proof" : "Upload Proof Document"}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Please upload the transaction receipt or refund confirmation image.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upload Zone */}
                    <div
                      onClick={() => !proofFile && fileInputRef.current?.click()}
                      className={`group relative border-2 border-dashed rounded-xl transition-all duration-200 overflow-hidden flex flex-col items-center justify-center p-0 cursor-pointer
                            ${
                              proofFile
                                ? "border-blue-400 bg-white"
                                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50 bg-white p-6"
                            }
                            ${!proofFile ? "min-h-[220px]" : "h-auto"}
                         `}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />

                      {proofFile ? (
                        <div className="w-full relative group/preview">
                          {/* Image Preview */}
                          <div
                            className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewImage(previewUrl);
                            }}
                          >
                            {previewUrl && (
                              <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity">
                              <span className="text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                                <ZoomIn className="w-3 h-3" /> Zoom
                              </span>
                            </div>
                          </div>

                          {/* File Info Bar */}
                          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-3">
                            <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {proofFile.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(proofFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fileInputRef.current?.click();
                                }}
                                title="Change file"
                              >
                                <Upload className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFile();
                                }}
                                title="Remove file"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="h-12 w-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-100 group-hover:text-blue-500 transition-all duration-300">
                            <Upload className="h-6 w-6" />
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            Click or drag image to upload
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Supports PNG, JPG (Max 10MB)</p>
                        </>
                      )}
                    </div>

                    {/* Note & Action */}
                    <div className="flex flex-col gap-4">
                      <div className="flex-1">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                          Optional Note
                        </Label>
                        <Textarea
                          placeholder="Add any transaction details, reference numbers..."
                          value={proofMessage}
                          onChange={(e) => setProofMessage(e.target.value)}
                          className="h-[120px] resize-none bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                      </div>
                      <Button
                        onClick={handleSubmitProof}
                        disabled={!proofFile || isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-11"
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Submit Verification
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {(showPayPenaltyButton ||
        showPaymentLink ||
        showSubmitProofButton ||
        showReviewProofButton) && (
        <CardFooter className="bg-gray-50 p-4 flex justify-end gap-3 border-t border-gray-100">
          {showPayPenaltyButton && onPayPenalty && (
            <Button
              onClick={onPayPenalty}
              className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Penalty Now
            </Button>
          )}

          {showPaymentLink && violation.payment_data && (
            <div className="flex gap-3">
              {onPayPenalty && (
                <Button
                  onClick={onPayPenalty}
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  View QR & Details
                </Button>
              )}
              <a
                href={violation.payment_data.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-all active:scale-95"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Proceed to PayOS
              </a>
            </div>
          )}

          {showReviewProofButton && onReviewProof && (
            <Button
              size="lg"
              onClick={onReviewProof}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-md animate-pulse"
            >
              <FileText className="h-5 w-5 mr-2" />
              Review & Approve Proof
            </Button>
          )}
        </CardFooter>
      )}

      {/* Image Zoom Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-fit w-auto p-0 overflow-hidden bg-transparent border-none shadow-none text-white [&>button]:hidden">
          {activeImageSrc && (
            <img
              src={activeImageSrc}
              alt="Proof full size"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
