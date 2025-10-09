import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LegalTermsProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const LegalTerms: React.FC<LegalTermsProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Legal Terms & Conditions</CardTitle>
          <p className="text-sm text-slate-600">
            Standard contract terms and breach of contract penalties
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Breach of Contract */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-primary">Breach of Contract</Label>
            <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
              <li>
                <span className="font-semibold text-gray-900">
                  If Party A (the Brand) breaches the contract:
                </span>
                <ul className="list-disc pl-5 mt-1">
                  <li>The contract shall be terminated immediately.</li>
                  <li>Party A forfeits the entire deposit paid.</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold text-gray-900">
                  If Party B (the Service Provider) breaches the contract:
                </span>
                <ul className="list-disc pl-5 mt-1">
                  <li>The contract shall be terminated immediately.</li>
                  <li className="flex items-center gap-2 flex-wrap">
                    <span>
                      Party B must refund the entire deposit to Party A and compensate an additional
                    </span>
                    <div className="relative flex items-center">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={formData.legalTerms?.compensationPercent ?? ""}
                        onChange={(e) =>
                          onInputChange("legalTerms", {
                            ...formData.legalTerms,
                            compensationPercent: e.target.value,
                          })
                        }
                        className="w-20 h-8 pr-7"
                        placeholder="0"
                      />
                      <span className="absolute right-2 text-gray-500 text-sm">%</span>
                    </div>
                    <span>of the deposit amount to Party A.</span>
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-semibold text-gray-900">
                  If both parties mutually agree to terminate the contract:
                </span>
                <ul className="list-disc pl-5 mt-1">
                  <li>Neither party shall bear any liability or compensation obligations.</li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Additional Standard Terms */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-primary">Standard Terms</Label>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded">
                <span className="font-semibold">Confidentiality:</span> Both parties agree to keep
                all information related to this contract strictly confidential and not disclose it
                to any third party without prior written consent from the other party.
              </div>
              <div className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded">
                <span className="font-semibold">Dispute Resolution:</span> Any disputes arising from
                or relating to this contract shall be resolved amicably through negotiation. If no
                agreement is reached, the dispute shall be settled at a competent court as
                prescribed by law.
              </div>
              <div className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded">
                <span className="font-semibold">Contract Effectiveness:</span> This contract becomes
                effective from the date of signing and shall terminate upon full completion of
                obligations by both parties.
              </div>
              <div className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded">
                <span className="font-semibold">Force Majeure:</span> Neither party shall be liable
                for any failure or delay in performance due to circumstances beyond their reasonable
                control, including but not limited to natural disasters, government actions, or
                other force majeure events.
              </div>
            </div>
          </div>

          {/* Custom Terms (Optional) */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Additional Terms (Optional)</Label>
            <textarea
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Add any additional terms or conditions specific to this contract..."
              value={formData.legalTerms?.additionalTerms || ""}
              onChange={(e) =>
                onInputChange("legalTerms", {
                  ...formData.legalTerms,
                  additionalTerms: e.target.value,
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalTerms;
