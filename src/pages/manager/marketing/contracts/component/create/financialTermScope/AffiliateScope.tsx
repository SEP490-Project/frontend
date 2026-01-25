import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  const financial_terms = formData?.financial_terms || {};
  const start_date = formData?.start_date;
  const end_date = formData?.end_date;

  const previousScheduleRef = React.useRef<string>("");

  const handleScheduleGenerated = React.useCallback(
    (newSchedule: any[]) => {
      if (financial_terms.payment_cycle === "QUARTERLY") {
        const scheduleString = JSON.stringify(newSchedule);

        if (previousScheduleRef.current !== scheduleString) {
          previousScheduleRef.current = scheduleString;
          onUpdate({ payment_date: newSchedule });
        }
      }
    },
    [onUpdate, financial_terms.payment_cycle],
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencyInput
            label="Base Per Click (VND)"
            value={financial_terms.base_per_click || 0}
            onChange={(value) => onUpdate({ base_per_click: value })}
            placeholder="1.000"
            error={errors.base_per_click}
          />

          <SelectField
            label="Payment Cycle"
            value={financial_terms.payment_cycle || ""}
            onChange={(value) =>
              onUpdate({
                payment_cycle: value,
                payment_date: value === "QUARTERLY" ? [] : "",
                payment_date_selector: null,
              })
            }
            options={PAYMENT_CYCLE_OPTIONS}
            placeholder="Select payment cycle"
            icon={FaCalendarDay}
            error={errors.payment_cycle}
          />
        </div>

        {financial_terms.payment_cycle && (
          <PaymentDateSelector
            cycle={financial_terms.payment_cycle}
            value={
              financial_terms.payment_cycle === "QUARTERLY"
                ? financial_terms.payment_date_selector
                : financial_terms.payment_date
            }
            onChange={(val) => {
              if (financial_terms.payment_cycle === "QUARTERLY") {
                onUpdate({ payment_date_selector: val });
              } else {
                onUpdate({ payment_date: val });
              }
            }}
            onScheduleGenerated={handleScheduleGenerated}
            startDate={start_date}
            endDate={end_date}
          />
        )}

        {/* Tax Withholding hidden, but always set default = 0 */}
        {useEffect(
          () => {
            if (
              !financial_terms.tax_withholding ||
              financial_terms.tax_withholding.threshold !== 0 ||
              financial_terms.tax_withholding.rate_percent !== 0
            ) {
              onUpdate({
                tax_withholding: { threshold: 0, rate_percent: 0 },
              });
            }
          },
          [] /* only run once on mount */,
        )}

        <CommissionLevels
          levels={financial_terms.levels || []}
          onUpdate={(levels) => onUpdate({ levels })}
        />
      </CardContent>
    </Card>
  );
};

export default AffiliateScope;
