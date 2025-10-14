import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FaDollarSign } from "react-icons/fa6";
import { CurrencyInput, SelectField, PaymentSchedule } from "../shared/FinancialSharedComponent";

const PAYMENT_METHOD_OPTIONS = [
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CREDIT_CARD", label: "Credit Card" },
];

interface BrandAmbassadorScopeProps {
  formData: any;
  onUpdate: (updates: any) => void;
  errors?: any;
}

const BrandAmbassadorScope: React.FC<BrandAmbassadorScopeProps> = ({
  formData,
  onUpdate,
  errors = {},
}) => {
  const financialTerms = formData?.financialTerms || {};
  const startDate = formData?.startDate;
  const endDate = formData?.endDate;

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
        <CardTitle className="flex items-center gap-3">
          <FaDollarSign className="w-6 h-6 text-emerald-600" />
          <div>
            <h2 className="text-xl font-bold">Brand Ambassador Payment</h2>
            <p className="text-sm text-gray-600 font-normal">
              Configure financial terms for brand ambassador contract
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Contract Date Info */}
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

        {/* Payment Method & Total Cost */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Payment Method"
            value={financialTerms.payment_method || "BANK_TRANSFER"}
            onChange={(value) => onUpdate({ payment_method: value })}
            options={PAYMENT_METHOD_OPTIONS}
            placeholder="Select payment method"
            error={errors.payment_method}
          />

          <CurrencyInput
            label="Total Contract Cost (VND)"
            value={financialTerms.total_cost || 0}
            onChange={(value) => onUpdate({ total_cost: value })}
            placeholder="15,000,000"
            error={errors.total_cost}
          />
        </div>

        {/* Monthly Retainer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencyInput
            label="Monthly Retainer (VND)"
            value={financialTerms.monthly_retainer || 0}
            onChange={(value) => onUpdate({ monthly_retainer: value })}
            placeholder="2,000,000"
          />

          <CurrencyInput
            label="Performance Bonus (VND)"
            value={financialTerms.performance_bonus || 0}
            onChange={(value) => onUpdate({ performance_bonus: value })}
            placeholder="1,000,000"
          />
        </div>

        {/* Cost Breakdown */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Cost Breakdown (Optional)</Label>
          <Textarea
            placeholder="e.g., Monthly retainer: 24,000,000 VND, Performance bonuses: 6,000,000 VND, Event appearances: 3,000,000 VND"
            value={financialTerms.cost_breakdown_text || ""}
            onChange={(e) => onUpdate({ cost_breakdown_text: e.target.value })}
            className="min-h-[80px]"
          />
        </div>

        {/* Payment Schedule */}
        <PaymentSchedule
          schedules={financialTerms.schedule || []}
          totalCost={financialTerms.total_cost || 0}
          onUpdate={(schedule) => onUpdate({ schedule })}
          startDate={startDate}
          endDate={endDate}
        />
      </CardContent>
    </Card>
  );
};

export default BrandAmbassadorScope;
