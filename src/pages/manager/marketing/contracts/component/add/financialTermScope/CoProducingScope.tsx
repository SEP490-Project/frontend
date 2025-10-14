import React, { useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaHandshake, FaPercent, FaCalendarDay } from "react-icons/fa6";
import {
  CurrencyInput,
  SelectField,
  PaymentDateSelector,
} from "../shared/FinancialSharedComponent";

const PAYMENT_CYCLE_OPTIONS = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "ANNUALLY", label: "Annually" },
];

interface CoProducingScopeProps {
  formData: any;
  onUpdate: (updates: any) => void;
  errors?: any;
}

const CoProducingScope: React.FC<CoProducingScopeProps> = ({ formData, onUpdate }) => {
  const financialTerms = formData?.financialTerms || {};
  const startDate = formData?.startDate;
  const endDate = formData?.endDate;

  // Callback khi schedule được tạo
  const handleScheduleGenerated = useCallback(
    (newSchedule: any[]) => {
      const currentSchedule = financialTerms.schedule || [];
      const scheduleChanged = JSON.stringify(currentSchedule) !== JSON.stringify(newSchedule);

      if (scheduleChanged) {
        onUpdate({ schedule: newSchedule });
      }
    },
    [onUpdate, financialTerms.schedule],
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
        <CardTitle className="flex items-center gap-3">
          <FaHandshake className="w-6 h-6 text-purple-600" />
          <div>
            <h2 className="text-xl font-bold">Profit Sharing</h2>
            <p className="text-sm text-gray-600 font-normal">
              Configure financial terms for co-production contract
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Contract Period Info */}
        {startDate && endDate && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Contract Period</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Start Date:</span>{" "}
                {new Date(startDate).toLocaleDateString("vi-VN")}
              </div>
              <div>
                <span className="font-medium">End Date:</span>{" "}
                {new Date(endDate).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </Card>
        )}

        {/* Capital Contributions */}
        <Card className="p-4 bg-purple-50 border-purple-200">
          <h4 className="font-medium text-purple-900 mb-4 flex items-center gap-2">
            <FaHandshake className="w-4 h-4" />
            Capital Contributions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company */}
            <div className="space-y-4">
              <h5 className="font-medium">Company Contribution</h5>
              <Textarea
                placeholder="Equipment, studio, marketing budget..."
                value={financialTerms.capital_contribution?.company?.description || ""}
                onChange={(e) =>
                  onUpdate({
                    capital_contribution: {
                      ...financialTerms.capital_contribution,
                      company: {
                        ...financialTerms.capital_contribution?.company,
                        description: e.target.value,
                      },
                    },
                  })
                }
                className="min-h-[80px]"
              />
              <CurrencyInput
                label="Value (VND)"
                value={financialTerms.capital_contribution?.company?.value || 0}
                onChange={(value) =>
                  onUpdate({
                    capital_contribution: {
                      ...financialTerms.capital_contribution,
                      company: {
                        ...financialTerms.capital_contribution?.company,
                        value,
                      },
                    },
                  })
                }
                placeholder="50,000,000"
              />
            </div>

            {/* KOL */}
            <div className="space-y-4">
              <h5 className="font-medium">KOL Contribution</h5>
              <Textarea
                placeholder="Content creation, social media presence, audience..."
                value={financialTerms.capital_contribution?.kol?.description || ""}
                onChange={(e) =>
                  onUpdate({
                    capital_contribution: {
                      ...financialTerms.capital_contribution,
                      kol: {
                        ...financialTerms.capital_contribution?.kol,
                        description: e.target.value,
                      },
                    },
                  })
                }
                className="min-h-[80px]"
              />
              <CurrencyInput
                label="Value (VND)"
                value={financialTerms.capital_contribution?.kol?.value || 0}
                onChange={(value) =>
                  onUpdate({
                    capital_contribution: {
                      ...financialTerms.capital_contribution,
                      kol: {
                        ...financialTerms.capital_contribution?.kol,
                        value,
                      },
                    },
                  })
                }
                placeholder="30,000,000"
              />
            </div>
          </div>
        </Card>

        {/* Profit Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <FaPercent className="w-3 h-3" />
              Company Profit Share (%)
            </Label>
            <Input
              type="number"
              value={financialTerms.profit_split_company_percent || ""}
              onChange={(e) =>
                onUpdate({
                  profit_split_company_percent: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="60"
              className="h-11"
              min="0"
              max="100"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <FaPercent className="w-3 h-3" />
              KOL Profit Share (%)
            </Label>
            <Input
              type="number"
              value={financialTerms.profit_split_kol_percent || ""}
              onChange={(e) =>
                onUpdate({
                  profit_split_kol_percent: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="40"
              className="h-11"
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Profit Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Profit Distribution Cycle"
            value={financialTerms.profit_distribution_cycle || ""}
            onChange={(value) => {
              onUpdate({
                profit_distribution_cycle: value,
                profit_distribution_date: null,
                schedule: [],
              });
            }}
            options={PAYMENT_CYCLE_OPTIONS}
            placeholder="Select cycle"
            icon={FaCalendarDay}
          />

          {financialTerms.profit_distribution_cycle && (
            <PaymentDateSelector
              cycle={financialTerms.profit_distribution_cycle}
              value={financialTerms.profit_distribution_date}
              onChange={(value) => onUpdate({ profit_distribution_date: value })}
              onScheduleGenerated={handleScheduleGenerated}
              startDate={startDate}
              endDate={endDate}
            />
          )}
        </div>

        {/* Schedule Preview */}
        {financialTerms.schedule && financialTerms.schedule.length > 0 && (
          <Card className="p-4 bg-green-50 border-green-200">
            <h4 className="font-medium text-green-900 mb-3">
              Generated Profit Distribution Schedule ({financialTerms.schedule.length}{" "}
              distributions)
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {financialTerms.schedule.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm bg-white p-2 rounded"
                >
                  <span className="font-medium text-gray-800">{item.milestone}</span>
                  <span className="text-gray-600">
                    {new Date(item.due_date).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default CoProducingScope;
