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
                        enforceRange
                        value={
                          formData.legal_terms?.compensation_percent === null ||
                          formData.legal_terms?.compensation_percent === undefined
                            ? ""
                            : formData.legal_terms?.compensation_percent
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          onInputChange("legal_terms", {
                            ...formData.legal_terms,
                            compensation_percent: val === "" ? "" : Number(val),
                          });
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
    </div>
  );
};

export default LegalTerms;
