import React, { useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaHandshake, FaPercent, FaCalendarDay } from "react-icons/fa6";
import { SelectField, PaymentDateSelector } from "../shared/FinancialSharedComponent";

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

const CoProducingScope: React.FC<CoProducingScopeProps> = ({ formData, onUpdate, errors = {} }) => {
  const financial_terms = formData?.financial_terms || {};
  const start_date = formData?.start_date;
  const end_date = formData?.end_date;

  const handleScheduleGenerated = useCallback(
    (newSchedule: any[]) => {
      console.log("Schedule generated:", newSchedule); // Debug log
      // Just store the schedule as-is, without calculating amounts
      onUpdate({ schedule: newSchedule });
    },
    [onUpdate],
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
        <CardTitle className="flex items-center gap-3">
          <FaHandshake className="w-6 h-6 text-purple-600" />
          <div>
            <h2 className="text-xl font-bold">Profit Sharing Terms</h2>
            <p className="text-sm text-gray-600 font-normal">
              Configure financial terms for co-production contract
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Contract Period */}
        {start_date && end_date && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Contract Period</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Start Date:</span>{" "}
                {new Date(start_date).toLocaleDateString("vi-VN")}
              </div>
              <div>
                <span className="font-medium">End Date:</span>{" "}
                {new Date(end_date).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </Card>
        )}

        {/* Profit Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <FaPercent className="w-3 h-3" />
              Company Profit Share (%)
            </Label>
            <Input
              type="number"
              value={financial_terms.profit_split_company_percent || ""}
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
              value={financial_terms.profit_split_kol_percent || ""}
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

        {/* Profit Distribution Cycle */}
        <SelectField
          label="Profit Distribution Cycle"
          value={financial_terms.profit_distribution_cycle || ""}
          onChange={(value) =>
            onUpdate({
              profit_distribution_cycle: value,
              profit_distribution_date: null,
              schedule: [], // Clear existing schedule when cycle changes
            })
          }
          options={PAYMENT_CYCLE_OPTIONS}
          placeholder="Select distribution cycle"
          icon={FaCalendarDay}
          error={errors.profit_distribution_cycle}
        />

        {/* Payment Date Selector - Only show when cycle is selected */}
        {financial_terms.profit_distribution_cycle && (
          <PaymentDateSelector
            cycle={financial_terms.profit_distribution_cycle}
            value={financial_terms.profit_distribution_date}
            onChange={(val) => onUpdate({ profit_distribution_date: val })}
            onScheduleGenerated={handleScheduleGenerated}
            startDate={start_date}
            endDate={end_date}
          />
        )}

        {/* Generated Distribution Schedule Display */}
        {financial_terms.schedule && financial_terms.schedule.length > 0 && (
          <Card className="p-4 bg-green-50 border-green-200">
            <h4 className="font-medium text-green-900 mb-3">
              Generated Distribution Dates ({financial_terms.schedule.length} distributions)
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {financial_terms.schedule.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm bg-white p-3 rounded"
                >
                  <span className="font-medium">{item.milestone}</span>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">
                      {new Date(item.due_date).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-800">
              <strong>Note:</strong> Distribution dates are generated based on your selected cycle.
              Profit amounts will be calculated based on actual revenue and agreed profit split
              percentages.
            </div>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default CoProducingScope;
