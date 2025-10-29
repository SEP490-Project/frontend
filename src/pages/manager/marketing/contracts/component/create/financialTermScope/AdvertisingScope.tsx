import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FaDollarSign } from "react-icons/fa6";
import { PaymentSchedule } from "../shared/FinancialSharedComponent";

interface AdvertisingScopeProps {
  formData: any;
  onUpdate: (updates: any) => void;
  errors?: any;
}

const AdvertisingScope: React.FC<AdvertisingScopeProps> = ({ formData, onUpdate }) => {
  const financialTerms = formData?.financialTerms || {};
  const startDate = formData?.startDate;
  const endDate = formData?.endDate;

  React.useEffect(() => {
    const updates: any = {};
    if (financialTerms.payment_method !== "BANK_TRANSFER") {
      updates.payment_method = "BANK_TRANSFER";
    }
    if (financialTerms.model !== "FIXED") {
      updates.model = "FIXED";
    }
    if (Object.keys(updates).length > 0) {
      onUpdate(updates);
    }
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
        <CardTitle className="flex items-center gap-3">
          <FaDollarSign className="w-6 h-6 text-orange-600" />
          <div>
            <h2 className="text-xl font-bold">Fixed Payment Terms</h2>
            <p className="text-sm text-gray-600 font-normal">
              Configure financial terms for advertising contract
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
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

        <div>
          <Label className="text-sm font-medium mb-2 block">Payment Method</Label>
          <div className="p-2.5 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700">
            Bank Transfer (Default)
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Payment method is fixed as Bank Transfer for this contract type.
          </p>
        </div>

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

export default AdvertisingScope;
