import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LegalTermsProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  onUpdateLegalTerms?: (updates: any) => void;
}

const LegalTerms: React.FC<LegalTermsProps> = ({ formData, onInputChange, onUpdateLegalTerms }) => {
  const compensationPercent =
    formData.compensation_percent !== undefined
      ? formData.compensation_percent
      : formData.legal_terms?.compensation_percent;

  const handleCompensationPercentChange = (value: any) => {
    const numericValue = value === "" ? "" : Number(value);

    if (onUpdateLegalTerms) {
      // Edit mode - use onUpdateLegalTerms
      onUpdateLegalTerms({ compensation_percent: numericValue });
    } else {
      // Create mode or Edit mode without onUpdateLegalTerms
      // Update both locations for compatibility
      onInputChange("compensation_percent", numericValue);
      onInputChange("legal_terms", {
        ...formData.legal_terms,
        compensation_percent: numericValue,
      });
    }
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
                  <li>
                    <span className="font-medium text-rose-400">
                      Party A must pay the current milestone.
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
                        enforceRange
                        value={
                          compensationPercent === null || compensationPercent === undefined
                            ? ""
                            : compensationPercent
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          handleCompensationPercentChange(val);
                        }}
                        className="w-20 h-8 pr-7"
                        placeholder="0"
                      />
                      <span className="absolute right-2 text-gray-500 text-sm">%</span>
                    </div>
                    <span>of that deposit to Party A.</span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Rules and Violations */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-primary">Rules and Violations</Label>
            <div className="space-y-4">
              {/* Brand Rules */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-3">For Brand (Party A)</h4>
                <div className="space-y-2 text-sm">
                  <div className="border-l-4 border-orange-300 pl-3">
                    <span className="font-medium text-orange-700">Payment Default:</span>
                    <p className="text-orange-600">
                      Failure to settle payments by the agreed due date.
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-300 pl-3">
                    <span className="font-medium text-orange-700">Support Failure:</span>
                    <p className="text-orange-600">
                      Failure to provide samples or guidelines on time, causing delays.
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-300 pl-3">
                    <span className="font-medium text-orange-700">Copyright Infringement:</span>
                    <p className="text-orange-600">
                      Using KOL's content outside the agreed scope/platforms.
                    </p>
                  </div>
                </div>
              </div>

              {/* KOL Rules */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">For KOL (Party B)</h4>
                <div className="space-y-2 text-sm">
                  <div className="border-l-4 border-blue-300 pl-3">
                    <span className="font-medium text-blue-700">Late Submission:</span>
                    <p className="text-blue-600">
                      Failure to submit drafts or post content on the scheduled date.
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-300 pl-3">
                    <span className="font-medium text-blue-700">Exclusivity Breach:</span>
                    <p className="text-blue-600">
                      Promoting direct competitors during the contract term.
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-300 pl-3">
                    <span className="font-medium text-blue-700">Content Removal:</span>
                    <p className="text-blue-600">
                      Deleting or hiding posts before the agreed expiry date.
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-300 pl-3">
                    <span className="font-medium text-blue-700">Reputation Damage:</span>
                    <p className="text-blue-600">
                      Involved in scandals that negatively affect the Brand.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  );
};

export default LegalTerms;
