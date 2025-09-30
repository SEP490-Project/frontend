import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileUploader } from "@/components/global";
import { Paperclip, Send, Save } from "lucide-react";

interface ContractActionsProps {
  formData: any;
  onContractFilesChange: (files: File[]) => void;
  onProposalFilesChange: (files: File[]) => void;
  onContractUpload: (files: File[]) => Promise<void>;
  onProposalUpload: (files: File[]) => Promise<void>;
  onSubmit: (e: React.FormEvent) => void;
}

const ContractActions: React.FC<ContractActionsProps> = ({
  onContractFilesChange,
  onProposalFilesChange,
  onContractUpload,
  onProposalUpload,
  onSubmit,
}) => {
  return (
    <div className="space-y-8">
      {/* Attachments */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Paperclip className="h-5 w-5 text-purple-600" />
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
              maxFiles={5}
              allowedTypes={["pdf", "doc", "docx"]}
              onFilesChange={onContractFilesChange}
              onUpload={onContractUpload}
              showPreview={false}
              title="Contract Files"
              showSummary={true}
              className="w-full"
            />
            <p className="text-xs text-slate-500">
              Upload contract documents (PDF, DOC, DOCX only, max 5 files)
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
              maxFiles={5}
              allowedTypes={["pdf", "doc", "docx", "ppt", "pptx"]}
              onFilesChange={onProposalFilesChange}
              onUpload={onProposalUpload}
              showPreview={false}
              title="Proposal Files"
              showSummary={true}
            />
            <p className="text-xs text-slate-500">
              Upload proposal documents and presentations (max 5 files)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              onClick={onSubmit}
            >
              <Send className="mr-2 h-4 w-4" />
              Request Contract Approval
            </Button>
            <Button type="button" variant="outline" className="w-full h-11">
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractActions;
