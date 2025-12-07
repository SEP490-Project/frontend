import type { OrderData } from "@/libs/types/order";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CircleDollarSign, Upload, CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { convertNumberToCurrency } from "@/libs/helper/helper";

interface CompensateRequestOrderProps {
  order: OrderData;
  onHandle: (payload: { file: File; isApproved: boolean; reason?: string }) => void;
}

const CompensateRequestOrder = ({ order, onHandle }: CompensateRequestOrderProps) => {
  const [action, setAction] = useState<"APPROVE" | "REJECT" | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!action) return;

    if (action === "APPROVE" && !selectedFile) {
      alert("Please upload compensation proof");
      return;
    }

    if (action === "REJECT" && !reason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    // Create a dummy file for rejection case
    const file = selectedFile || new File([], "dummy.txt", { type: "text/plain" });

    setIsSubmitting(true);
    try {
      await onHandle({
        file,
        isApproved: action === "APPROVE",
        reason: reason.trim(),
      });
      setAction(null);
      setReason("");
      handleRemoveFile();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setAction(null);
    setReason("");
    handleRemoveFile();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5" />
            Handle Compensation Request
          </CardTitle>
          <CardDescription>Review and approve or reject the compensation request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {order.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">{order.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Compensation Amount</p>
              <p className="font-medium text-lg text-orange-600">
                {convertNumberToCurrency(String(order.total_amount))}
              </p>
            </div>
          </div>

          {order.user_bank_account && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Customer Bank Details</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Bank:</span>
                  <span className="ml-2 font-medium">{order.user_bank_name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Account:</span>
                  <span className="ml-2 font-medium">{order.user_bank_account}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Account Holder:</span>
                  <span className="ml-2 font-medium">{order.user_bank_account_holder}</span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {!action ? (
            <div className="space-y-3">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-900">Compensation Request</p>
                    <p className="text-sm text-purple-700 mt-1">
                      Customer has requested compensation. Please review and take appropriate
                      action.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setAction("APPROVE")}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => setAction("REJECT")}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          ) : action === "APPROVE" ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Approve Compensation</p>
                    <p className="text-sm text-green-700 mt-1">
                      Process the compensation and upload proof of transaction.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="compensationProof">Compensation Proof *</Label>
                {!selectedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <input
                      id="compensationProof"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="compensationProof" className="cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative border rounded-lg p-4">
                    <button
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded"
                      />
                    )}
                    <p className="text-sm text-gray-600 mt-2 truncate">{selectedFile.name}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="approveNote">Note (Optional)</Label>
                <Textarea
                  id="approveNote"
                  placeholder="Add any additional notes..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selectedFile}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Processing..." : "Submit Approval"}
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  Back
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Reject Compensation</p>
                    <p className="text-sm text-red-700 mt-1">
                      Please provide a clear reason for rejecting this compensation request.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejectReason">Rejection Reason *</Label>
                <Textarea
                  id="rejectReason"
                  placeholder="Enter the reason for rejection..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !reason.trim()}
                  variant="destructive"
                  className="flex-1"
                >
                  {isSubmitting ? "Processing..." : "Submit Rejection"}
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  Back
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompensateRequestOrder;
