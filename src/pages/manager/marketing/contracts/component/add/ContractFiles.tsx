import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileUploader } from "@/components/global";

interface ContractFilesProps {
  formData: any;
  onContractFilesChange: (files: File[]) => void;
  onProposalFilesChange: (files: File[]) => void;
  onSubmit?: (e: React.FormEvent) => void;
}

const ContractFiles: React.FC<ContractFilesProps> = ({
  formData,
  onContractFilesChange,
  onProposalFilesChange,
}) => {
  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Contract Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contract Files */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Contract Documents</Label>
            <FileUploader
              userId={formData?.userId || "b758136a-f78c-4a36-985a-974c39d5cd0d"}
              accept=".pdf,.doc,.docx"
              multiple
              maxSize={10}
              maxFiles={1}
              allowedTypes={["pdf", "doc", "docx"]}
              onFilesChange={onContractFilesChange}
              showPreview={false}
              title="Contract Files"
              showSummary
              className="w-full"
              initialFiles={formData?.contractFiles || []}
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
              userId={formData?.userId || "b758136a-f78c-4a36-985a-974c39d5cd0d"}
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              multiple
              maxSize={10}
              maxFiles={1}
              allowedTypes={["pdf", "doc", "docx", "ppt", "pptx"]}
              onFilesChange={onProposalFilesChange}
              showPreview={false}
              title="Proposal Files"
              showSummary
              className="w-full"
              initialFiles={formData?.proposalFiles || []}
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

export default ContractFiles;
