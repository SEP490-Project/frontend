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
  const financial_terms = formData?.financial_terms || {};
  const start_date = formData?.start_date;
  const end_date = formData?.end_date;

  React.useEffect(() => {
    const updates: any = {};
    if (financial_terms.payment_method !== "BANK_TRANSFER") {
      updates.payment_method = "BANK_TRANSFER";
    }
    if (financial_terms.model !== "FIXED") {
      updates.model = "FIXED";
    }
    if (Object.keys(updates).length > 0) {
      onUpdate(updates);
    }
  }, []);

  return (
    <Card className="shadow-sm overflow-hidden">
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
          schedules={financial_terms.schedule || []}
          totalCost={financial_terms.total_cost || 0}
          onUpdate={(schedule) => {
            console.log("AdvertisingScope PaymentSchedule onUpdate:", schedule);
            onUpdate({ schedule });
          }}
          startDate={start_date}
          endDate={end_date}
          depositPercent={formData.deposit_percent || 0}
        />
      </CardContent>
    </Card>
  );
};

export default AdvertisingScope;
