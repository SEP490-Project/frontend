import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaChartLine, FaCalendarDay, FaPercent } from "react-icons/fa6";
import {
  CurrencyInput,
  SelectField,
  CommissionLevels,
  PaymentDateSelector,
} from "../shared/FinancialSharedComponent";

const PAYMENT_CYCLE_OPTIONS = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "ANNUALLY", label: "Annually" },
];

interface AffiliateScopeProps {
  formData: any;
  onUpdate: (updates: any) => void;
  errors?: any;
}

const AffiliateScope: React.FC<AffiliateScopeProps> = ({ formData, onUpdate, errors = {} }) => {
  const financialTerms = formData?.financialTerms || {};
  const startDate = formData?.startDate;
  const endDate = formData?.endDate;

  // Handle schedule generation from PaymentDateSelector - NO automatic amount calculation
  const handleScheduleGenerated = React.useCallback(
    (newSchedule: any[]) => {
      console.log("Schedule generated:", newSchedule); // Debug log

      // Just store the schedule as-is, without calculating amounts
      onUpdate({ schedule: newSchedule });
    },
    [onUpdate],
  );

  const estimatedTotalEarnings =
    (financialTerms.base_per_click || 0) * (financialTerms.target_clicks || 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
        <CardTitle className="flex items-center gap-3">
          <FaChartLine className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold">Performance-Based Terms</h2>
            <p className="text-sm text-gray-600 font-normal">
              Configure commission and payment terms for affiliate marketing
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

        {/* Base Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CurrencyInput
            label="Base Per Click (VND)"
            value={financialTerms.base_per_click || 0}
            onChange={(value) => onUpdate({ base_per_click: value })}
            placeholder="1,000"
            error={errors.base_per_click}
          />

          <CurrencyInput
            label="Target Clicks"
            value={financialTerms.target_clicks || 0}
            onChange={(value) => onUpdate({ target_clicks: value })}
            placeholder="10,000"
            error={errors.target_clicks}
          />

          <SelectField
            label="Payment Cycle"
            value={financialTerms.payment_cycle || ""}
            onChange={(value) =>
              onUpdate({
                payment_cycle: value,
                payment_date: null,
                schedule: [], // Clear existing schedule when cycle changes
              })
            }
            options={PAYMENT_CYCLE_OPTIONS}
            placeholder="Select payment cycle"
            icon={FaCalendarDay}
            error={errors.payment_cycle}
          />
        </div>

        {/* Estimated Total Earnings Display */}
        {estimatedTotalEarnings > 0 && (
          <Card className="p-4 bg-purple-50 border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Estimated Total Earnings</h4>
            <div className="text-2xl font-bold text-purple-600">
              {estimatedTotalEarnings.toLocaleString("vi-VN")} VND
            </div>
            <p className="text-sm text-purple-700 mt-1">
              Based on {(financialTerms.target_clicks || 0).toLocaleString()} clicks ×{" "}
              {(financialTerms.base_per_click || 0).toLocaleString()} VND per click
            </p>
            <p className="text-xs text-purple-600 mt-2">
              Use this as a reference when setting up your payment schedule below.
            </p>
          </Card>
        )}

        {/* Payment Date Selector - Only show when cycle is selected */}
        {financialTerms.payment_cycle && (
          <PaymentDateSelector
            cycle={financialTerms.payment_cycle}
            value={financialTerms.payment_date}
            onChange={(val) => onUpdate({ payment_date: val })}
            onScheduleGenerated={handleScheduleGenerated}
            startDate={startDate}
            endDate={endDate}
          />
        )}

        {/* Tax Withholding */}
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <h4 className="font-medium text-yellow-900 mb-3">Tax Withholding</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrencyInput
              label="Threshold (VND)"
              value={financialTerms.tax_withholding?.threshold || 0}
              onChange={(value) =>
                onUpdate({
                  tax_withholding: { ...financialTerms.tax_withholding, threshold: value },
                })
              }
              placeholder="10,000,000"
            />

            <div className="space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <FaPercent className="w-3 h-3" />
                Tax Rate (%)
              </Label>
              <Input
                type="number"
                value={financialTerms.tax_withholding?.rate_percent || ""}
                onChange={(e) =>
                  onUpdate({
                    tax_withholding: {
                      ...financialTerms.tax_withholding,
                      rate_percent: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                placeholder="10"
                className="h-11"
                min="0"
                max="100"
              />
            </div>
          </div>
        </Card>

        {/* Commission Levels */}
        <CommissionLevels
          levels={financialTerms.levels || []}
          onUpdate={(levels) => onUpdate({ levels })}
        />

        {/* Generated Payment Schedule Display - Simple version without amounts */}
        {financialTerms.schedule && financialTerms.schedule.length > 0 && (
          <Card className="p-4 bg-green-50 border-green-200">
            <h4 className="font-medium text-green-900 mb-3">
              Generated Payment Dates ({financialTerms.schedule.length} payments)
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {financialTerms.schedule.map((item: any, index: number) => (
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
              <strong>Note:</strong> Payment dates are generated based on your selected cycle. Set
              specific amounts and percentages in the detailed Payment Schedule section below.
            </div>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default AffiliateScope;
