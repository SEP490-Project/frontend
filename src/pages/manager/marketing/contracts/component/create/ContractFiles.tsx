import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ContractUploader } from "@/components/global";

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
            <ContractUploader
              userId={formData?.userId || "b758136a-f78c-4a36-985a-974c39d5cd0d"}
              accept=".pdf,.doc,.docx"
              multiple={false}
              maxSize={10}
              maxFiles={1}
              allowedTypes={["pdf", "doc", "docx"]}
              onFilesChange={onContractFilesChange}
              onUploadComplete={handleContractUploadComplete}
              onFilesRemove={handleContractFilesRemove}
              title="Contract File"
              className="w-full"
              initialFiles={formData?.contractFiles || []}
              context="contract"
            />
            <p className="text-xs text-slate-500">
              Upload the main contract document (PDF, DOC, DOCX only, max 1 file, up to 10MB)
            </p>
          </div>

          <Separator />

          {/* Proposal Files */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Proposal Document <span className="text-red-500">*</span>
            </Label>
            <ContractUploader
              userId={formData?.userId || "b758136a-f78c-4a36-985a-974c39d5cd0d"}
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              multiple={false}
              maxSize={10}
              maxFiles={1}
              allowedTypes={["pdf", "doc", "docx", "ppt", "pptx"]}
              onFilesChange={onProposalFilesChange}
              onUploadComplete={handleProposalUploadComplete}
              onFilesRemove={handleProposalFilesRemove}
              title="Proposal File"
              className="w-full"
              initialFiles={formData?.proposalFiles || []}
              context="proposal"
            />
            <p className="text-xs text-slate-500">
              Upload the proposal document (PDF, DOC, DOCX, PPT, PPTX only, max 1 file, up to 10MB)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractFiles;
