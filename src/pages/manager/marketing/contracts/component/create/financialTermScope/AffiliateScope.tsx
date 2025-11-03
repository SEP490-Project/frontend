import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaChartLine, FaCalendarDay } from "react-icons/fa6";
import {
  SelectField,
  CommissionLevels,
  PaymentDateSelector,
  CurrencyInput,
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

  // Handle schedule generation from PaymentDateSelector - For PREVIEW ONLY
  const handleScheduleGenerated = React.useCallback(
    (newSchedule: any[]) => {
      console.log("Schedule generated for preview:", newSchedule);
      onUpdate({ schedule: newSchedule });
    },
    [onUpdate],
  );

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencyInput
            label="Base Per Click (VND)"
            value={financialTerms.base_per_click || 0}
            onChange={(value) => onUpdate({ base_per_click: value })}
            placeholder="1.000"
            error={errors.base_per_click}
          />

          <SelectField
            label="Payment Cycle"
            value={financialTerms.payment_cycle || ""}
            onChange={(value) =>
              onUpdate({
                payment_cycle: value,
                payment_date: null,
              })
            }
            options={PAYMENT_CYCLE_OPTIONS}
            placeholder="Select payment cycle"
            icon={FaCalendarDay}
            error={errors.payment_cycle}
          />
        </div>

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
              placeholder="10.000.000"
            />

            <div className="space-y-1">
              <Label className="text-sm font-medium flex items-center">Tax Rate (%)</Label>
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
      </CardContent>
    </Card>
  );
};

export default AffiliateScope;
