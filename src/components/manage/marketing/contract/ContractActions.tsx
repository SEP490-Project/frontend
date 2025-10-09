import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileUploader } from "@/components/global";

interface ContractActionsProps {
  formData: any;
  onContractFilesChange: (files: File[]) => void;
  onProposalFilesChange: (files: File[]) => void;
  onContractUpload: (files: File[]) => Promise<void>;
  onProposalUpload: (files: File[]) => Promise<void>;
  onSubmit: (e: React.FormEvent) => void;
}

const ContractActions: React.FC<ContractActionsProps> = ({
  formData, // Add formData to destructuring
  onContractFilesChange,
  onProposalFilesChange,
  onContractUpload,
  onProposalUpload,
}) => {
  return (
    <div className="space-y-8">
      {/* Attachments */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">Contract Documents</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contract Files */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Contract Documents</Label>
            <FileUploader
              accept=".pdf,.doc,.docx"
              multiple={true}
              maxSize={10}
              maxFiles={1}
              allowedTypes={["pdf", "doc", "docx"]}
              onFilesChange={onContractFilesChange}
              onUpload={onContractUpload}
              showPreview={false}
              title="Contract Files"
              showSummary={true}
              className="w-full"
              // Add initial files from formData
              initialFiles={formData.contractFiles}
            />
            <p className="text-xs text-slate-500">
              Upload contract documents (PDF, DOC, DOCX only, max 1 file)
            </p>
          </div>

          <Separator />

          {/* Proposal Files */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Proposal Documents</Label>
            <FileUploader
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              multiple={true}
              maxSize={10}
              maxFiles={1}
              allowedTypes={["pdf", "doc", "docx", "ppt", "pptx"]}
              onFilesChange={onProposalFilesChange}
              onUpload={onProposalUpload}
              showPreview={false}
              title="Proposal Files"
              showSummary={true}
              // Add initial files from formData
              initialFiles={formData.proposalFiles}
            />
            <p className="text-xs text-slate-500">
              Upload proposal documents and presentations (max 1 file)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractActions;
