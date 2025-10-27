import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaDollarSign, FaPlus, FaTrash } from "react-icons/fa6";
import { CurrencyInput, PaymentSchedule } from "../shared/FinancialSharedComponent"; // Đã bỏ SelectField

// Khai báo lại type để tránh lỗi
interface AdvertisingScopeProps {
  formData: any;
  onUpdate: (updates: any) => void;
  errors?: any;
}

// Cost Breakdown Component - ĐÃ CHỈNH FONT CHỮ
const CostBreakdown: React.FC<{
  costBreakdown: any;
  onUpdate: (breakdown: any) => void;
  totalCost: number;
}> = ({ costBreakdown = {}, onUpdate, totalCost }) => {
  const breakdown = costBreakdown || {};
  const entries = Object.entries(breakdown);

  const addNewEntry = () => {
    const newBreakdown = { ...breakdown, "": 0 };
    onUpdate(newBreakdown);
  };

  const updateEntry = (oldKey: string, newKey: string, value: number) => {
    const newBreakdown = { ...breakdown };

    // Remove old key if it's different from new key
    if (oldKey !== newKey && oldKey in newBreakdown) {
      delete newBreakdown[oldKey];
    }

    // Add new key with value (only if key is not empty)
    if (newKey.trim()) {
      newBreakdown[newKey.trim()] = value;
    }

    onUpdate(newBreakdown);
  };

  const removeEntry = (key: string) => {
    const newBreakdown = { ...breakdown };
    delete newBreakdown[key];
    onUpdate(newBreakdown);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const parseCurrency = (value: string) => {
    return parseInt(value.replace(/[^\d]/g, "")) || 0;
  };

  // Calculate totals
  const breakdownTotal = Object.values(breakdown).reduce(
    (sum: number, value: any) => sum + (Number(value) || 0),
    0,
  );
  const remaining = totalCost - breakdownTotal;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">Cost Breakdown (Optional)</Label>
        <Button type="button" variant="outline" size="sm" onClick={addNewEntry} className="text-xs">
          <FaPlus className="w-3 h-3 mr-1" />
          Add Item
        </Button>
      </div>

      {/* Breakdown Entries */}
      <div className="space-y-3">
        {entries.map(([key, value], index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-end">
            {/* Category Name Input */}
            <div className="col-span-6">
              <Input
                placeholder="e.g., Production, Editing, Publishing"
                value={key}
                onChange={(e) => updateEntry(key, e.target.value, Number(value) || 0)}
                className="text-sm"
              />
            </div>

            {/* Amount Input */}
            <div className="col-span-5">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="1,000,000"
                  value={formatCurrency(Number(value) || 0)}
                  onChange={(e) => {
                    const numericValue = parseCurrency(e.target.value);
                    updateEntry(key, key, numericValue);
                  }}
                  className="text-sm pr-12"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  VND
                </span>
              </div>
            </div>

            {/* Remove Button */}
            <div className="col-span-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeEntry(key)}
                className="text-red-500 hover:bg-red-50 p-2"
              >
                <FaTrash className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}

        {/* Show message when no entries */}
        {entries.length === 0 && (
          <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
            <p className="text-sm">No cost breakdown items added</p>
            <p className="text-xs">Click "Add Item" to start breaking down costs</p>
          </div>
        )}
      </div>

      {/* Summary - Đã chỉnh font chữ */}
      {entries.length > 0 && (
        <Card className="p-3 bg-gray-50 border-gray-200">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Breakdown Total:</span>
              <span className="font-semibold">{formatCurrency(breakdownTotal)} VND</span>{" "}
              {/* Đã sửa */}
            </div>

            {totalCost > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="font-medium">Contract Total:</span>
                  <span className="font-semibold">{formatCurrency(totalCost)} VND</span>{" "}
                  {/* Đã sửa */}
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">
                    {remaining === 0 ? "Balance:" : remaining > 0 ? "Remaining:" : "Over budget:"}
                  </span>
                  <span
                    className={`font-bold ${
                      // Đã sửa
                      remaining === 0
                        ? "text-green-600"
                        : remaining > 0
                          ? "text-blue-600"
                          : "text-red-600"
                    }`}
                  >
                    {formatCurrency(Math.abs(remaining))} VND
                  </span>
                </div>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

const AdvertisingScope: React.FC<AdvertisingScopeProps> = ({ formData, onUpdate, errors = {} }) => {
  const financialTerms = formData?.financialTerms || {};
  const startDate = formData?.startDate;
  const endDate = formData?.endDate;

  // Cập nhật giá trị mặc định khi component render lần đầu
  React.useEffect(() => {
    const updates: any = {};
    // Mặc định Payment Method là BANK_TRANSFER
    if (financialTerms.payment_method !== "BANK_TRANSFER") {
      updates.payment_method = "BANK_TRANSFER";
    }
    // Mặc định Model là FIXED
    if (financialTerms.model !== "FIXED") {
      updates.model = "FIXED";
    }
    // Chỉ gọi onUpdate nếu có sự khác biệt
    if (Object.keys(updates).length > 0) {
      onUpdate(updates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCostBreakdownUpdate = (breakdown: any) => {
    onUpdate({ cost_breakdown: breakdown });
  };

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

        {/* Payment Method (Read-only) & Total Cost */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Read-only Payment Method (Thay thế SelectField) */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Payment Method</Label>
            <div className="p-2.5 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700">
              Bank Transfer (Default)
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Payment method is fixed as Bank Transfer for this contract type.
            </p>
          </div>

          <CurrencyInput
            label="Total Contract Cost (VND)"
            value={financialTerms.total_cost || 0}
            onChange={(value) => onUpdate({ total_cost: value })}
            placeholder="10,000,000"
            error={errors.total_cost}
          />
        </div>

        {/* Cost Breakdown */}
        <CostBreakdown
          costBreakdown={financialTerms.cost_breakdown}
          onUpdate={handleCostBreakdownUpdate}
          totalCost={financialTerms.total_cost || 0}
        />

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

export default AdvertisingScope;
