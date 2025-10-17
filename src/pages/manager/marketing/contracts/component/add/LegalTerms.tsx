import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LegalTermsProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const LegalTerms: React.FC<LegalTermsProps> = ({ formData, onInputChange }) => {
  // Generate the legal terms JSON structure based on current form data
  const generateLegalTermsJSON = () => {
    const compensationPercent = formData.legalTerms?.compensationPercent || 0;

    return {
      legal_terms: {
        breach_of_contract: {
          label: "Breach of Contract",
          items: [
            {
              title: "Party A (Brand) breaks the rules",
              details: ["Contract terminates immediately", "Party A forfeits the deposit"],
            },
            {
              title: "Party B (Service Provider) breaks the rules",
              details: [
                "Contract terminates immediately",
                "Party B must refund the deposit",
                `Party B pays additional ${compensationPercent}% compensation`,
              ],
              compensation_percent: Number(compensationPercent) || 0,
            },
            {
              title: "Mutual agreement to terminate",
              details: [
                "Contract stops with no penalties",
                "No compensation required from either party",
              ],
            },
          ],
        },
        standard_terms: {
          label: "Standard Terms",
          items: [
            {
              title: "Confidentiality",
              description:
                "Both parties must keep all contract information confidential and cannot disclose to third parties without written consent",
            },
            {
              title: "Dispute Resolution",
              description:
                "Disputes will be resolved through negotiation first, then legal proceedings if necessary",
            },
            {
              title: "Contract Effectiveness",
              description:
                "Contract is effective from signature date until all obligations are fulfilled",
            },
            {
              title: "Force Majeure",
              description:
                "Neither party is liable for failure to perform due to circumstances beyond their control, including natural disasters or government actions",
            },
          ],
        },
      },
    };
  };

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
            <Label className="text-sm font-semibold text-primary">
              Breaking the Agreement (Breach of Contract)
            </Label>
            <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
              <li>
                <span className="font-semibold text-gray-900">
                  Party A (The Brand) breaks the rules:
                </span>
                <ul className="list-disc pl-5 mt-1">
                  <li>The deal stops right away.</li>
                  <li>
                    <span className="font-medium text-rose-400">
                      Party A loses (forfeits) the money they paid (the deposit).
                    </span>
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-semibold text-gray-900">
                  Party B (the Service Provider) breaks the rules:
                </span>
                <ul className="list-disc pl-5 mt-1">
                  <li>The deal stops right away.</li>
                  <li className="flex items-center gap-2 flex-wrap">
                    <span>
                      <span className="font-medium text-rose-400">
                        Party B must give back (refund) the deposit money to Party A.
                      </span>{" "}
                      They also must pay an extra
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
                    <span>of that deposit to Party A.</span>
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-semibold text-gray-900">
                  Both Parties agree to stop the deal:
                </span>
                <ul className="list-disc pl-5 mt-1">
                  <li>
                    <span className="font-medium text-rose-400">
                      The deal stops. No one has to pay money or blame the other.
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Additional Standard Terms */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-primary">Standard Terms</Label>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded">
                <span className="font-semibold">Confidentiality (Keeping Secrets):</span> Both Party
                A and Party B promise to{" "}
                <span className="font-medium text-rose-400">
                  keep all information about this contract a secret.
                </span>{" "}
                They cannot tell anyone else unless the other party says{" "}
                <span className="font-medium text-rose-400">"Yes"</span> in writing first.
              </div>
              <div className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded">
                <span className="font-semibold">Dispute Resolution (Solving Problems):</span> If
                there is a problem with this contract, the parties will first try to{" "}
                <span className="font-medium text-rose-400">talk and agree (negotiate)</span> in a
                friendly way. If they cannot agree, they will ask a{" "}
                <span className="font-medium text-rose-400">proper court</span> to decide, as the
                law says.
              </div>
              <div className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded">
                <span className="font-semibold">
                  Contract Effectiveness (When the Deal Starts and Stops):
                </span>{" "}
                This deal{" "}
                <span className="font-medium text-rose-400">starts on the day you sign it</span>. It
                will{" "}
                <span className="font-medium text-rose-400">
                  stop when both parties have finished
                </span>{" "}
                everything they promised to do.
              </div>
              <div className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded">
                <span className="font-semibold">
                  Force Majeure (Big Problems No One Can Control):
                </span>{" "}
                Neither party is responsible if they cannot do their job because of{" "}
                <span className="font-medium text-rose-400">big problems they cannot control</span>.
                This includes things like natural disasters (earthquakes, floods) or actions by the
                government
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* JSON Preview */}
      <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
            📋 Legal Terms JSON Preview
          </CardTitle>
          <p className="text-sm text-blue-600">
            This is how the legal terms will be structured in the final contract
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            <pre>{JSON.stringify(generateLegalTermsJSON(), null, 2)}</pre>
          </div>

          {/* Key Information */}
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Key Information:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • <strong>Compensation Percentage:</strong>{" "}
                {formData.legalTerms?.compensationPercent || 0}% (adjustable above)
              </li>
              <li>
                • <strong>Breach Scenarios:</strong> 3 predefined scenarios
              </li>
              <li>
                • <strong>Standard Terms:</strong> 4 standard clauses
              </li>
              <li>
                • <strong>Structure:</strong> Follows the required JSON format
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalTerms;
