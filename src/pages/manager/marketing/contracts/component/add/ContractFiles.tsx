import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileUploader } from "@/components/global";

interface ContractFilesProps {
  formData: any;
  onContractFilesChange: (files: File[]) => void;
  onProposalFilesChange: (files: File[]) => void;
  onContractUrlsChange: (urls: string[]) => void; // URL handler cho contract files
  onProposalUrlsChange: (urls: string[]) => void; // URL handler cho proposal files
  onSubmit?: (e: React.FormEvent) => void;
}

const ContractFiles: React.FC<ContractFilesProps> = ({
  formData,
  onContractFilesChange,
  onProposalFilesChange,
  onContractUrlsChange,
  onProposalUrlsChange,
}) => {
  const handleContractUploadComplete = (urls: string[]) => {
    console.log("Contract file URLs received:", urls);
    // Set contract_file_url với URL đầu tiên (vì chỉ cho phép 1 file)
    onContractUrlsChange(urls);
  };

  const handleProposalUploadComplete = (urls: string[]) => {
    console.log("Proposal file URLs received:", urls);
    // Set proposal_file_url với URL đầu tiên (vì chỉ cho phép 1 file)
    onProposalUrlsChange(urls);
  };

  const handleContractFilesRemove = (removedUrls: string[]) => {
    console.log("Contract files removed:", removedUrls);
    // Xóa URLs khỏi contract_file_url
    const currentUrls = Array.isArray(formData?.contract_file_url)
      ? formData.contract_file_url
      : formData?.contract_file_url
        ? [formData.contract_file_url]
        : [];
    const updatedUrls = currentUrls.filter((url: string) => !removedUrls.includes(url));
    onContractUrlsChange(updatedUrls);
  };

  const handleProposalFilesRemove = (removedUrls: string[]) => {
    console.log("Proposal files removed:", removedUrls);
    // Xóa URLs khỏi proposal_file_url
    const currentUrls = Array.isArray(formData?.proposal_file_url)
      ? formData.proposal_file_url
      : formData?.proposal_file_url
        ? [formData.proposal_file_url]
        : [];
    const updatedUrls = currentUrls.filter((url: string) => !removedUrls.includes(url));
    onProposalUrlsChange(updatedUrls);
  };

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Contract Documents</CardTitle>
          <p className="text-sm text-gray-600">Upload required contract and proposal documents</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contract Files */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Contract Document <span className="text-red-500">*</span>
            </Label>
            <FileUploader
              userId={formData?.userId || "b758136a-f78c-4a36-985a-974c39d5cd0d"}
              accept=".pdf,.doc,.docx"
              multiple={false} // Chỉ cho phép 1 file
              maxSize={10}
              maxFiles={1}
              allowedTypes={["pdf", "doc", "docx"]}
              onFilesChange={onContractFilesChange}
              onUploadComplete={handleContractUploadComplete}
              onFilesRemove={handleContractFilesRemove}
              showPreview={false}
              title="Contract File"
              showSummary={true}
              className="w-full"
              initialFiles={formData?.contractFiles || []}
            />
            <p className="text-xs text-slate-500">
              Upload the main contract document (PDF, DOC, DOCX only, max 1 file, up to 10MB)
            </p>
            {/* Hiển thị URL hiện tại nếu có */}
            {formData?.contract_file_url && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                <strong>Current URL:</strong> {formData.contract_file_url}
              </div>
            )}
          </div>

          <Separator />

          {/* Proposal Files */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Proposal Document <span className="text-red-500">*</span>
            </Label>
            <FileUploader
              userId={formData?.userId || "b758136a-f78c-4a36-985a-974c39d5cd0d"}
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              multiple={false} // Chỉ cho phép 1 file
              maxSize={10}
              maxFiles={1}
              allowedTypes={["pdf", "doc", "docx", "ppt", "pptx"]}
              onFilesChange={onProposalFilesChange}
              onUploadComplete={handleProposalUploadComplete}
              onFilesRemove={handleProposalFilesRemove}
              showPreview={false}
              title="Proposal File"
              showSummary={true}
              className="w-full"
              initialFiles={formData?.proposalFiles || []}
            />
            <p className="text-xs text-slate-500">
              Upload the proposal document (PDF, DOC, DOCX, PPT, PPTX only, max 1 file, up to 10MB)
            </p>
            {/* Hiển thị URL hiện tại nếu có */}
            {formData?.proposal_file_url && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                <strong>Current URL:</strong> {formData.proposal_file_url}
              </div>
            )}
          </div>

          {/* Debug Information */}
          {(formData?.contract_file_url || formData?.proposal_file_url) && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">File URLs Status</h4>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="font-medium">Contract URL:</span>{" "}
                    <span className="text-green-600">
                      {formData?.contract_file_url ? "✓ Set" : "✗ Not set"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Proposal URL:</span>{" "}
                    <span className="text-green-600">
                      {formData?.proposal_file_url ? "✓ Set" : "✗ Not set"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractFiles;
