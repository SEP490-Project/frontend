import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FaCode, FaEye, FaEyeSlash, FaMoneyBillWave, FaRotateLeft } from "react-icons/fa6";
import { CurrencyInput } from "./shared/FinancialSharedComponent";
import {
  AdvertisingScope,
  AffiliateScope,
  BrandAmbassadorScope,
  CoProducingScope,
} from "./financialTermScope";

// Add this import for the warning dialog
import { WarningDialog } from "@/components/global/";

interface FinancialTermsProps {
  formData: any;
  onUpdateFinancialTerms: (updates: any) => void;
  errors?: any;
}

// ========================
// DepositPayment Component
// ========================
const DepositPayment: React.FC<{
  financialTerms: any;
  onUpdate: (updates: any) => void;
  errors?: any;
  contractType?: string;
}> = ({ financialTerms, onUpdate, errors = {}, contractType }) => {
  const [depositPaid, setDepositPaid] = useState(false);
  const depositAmount = financialTerms.deposit_amount || 0;
  const depositPercent = financialTerms.deposit_percent || 0;

  const getTotalContractCost = () => {
    switch (contractType) {
      case "ADVERTISING":
      case "BRAND_AMBASSADOR":
        return financialTerms.total_cost || 0;
      case "AFFILIATE": {
        const levels = financialTerms.levels || [];
        const base = financialTerms.base_per_click || 0;
        return levels.reduce(
          (sum: number, level: any) =>
            sum + (level.max_clicks || 0) * base * (level.multiplier || 1),
          0,
        );
      }
      case "CO_PRODUCING":
        return 0;
      default:
        return 0;
    }
  };

  const totalContractCost = getTotalContractCost();
  const usePercentage = contractType === "ADVERTISING" || contractType === "BRAND_AMBASSADOR";
  const calculatedDepositAmount = usePercentage
    ? (totalContractCost * depositPercent) / 100
    : depositAmount;
  const finalDepositAmount = depositPaid ? 0 : calculatedDepositAmount;

  const handleDepositPaidToggle = (checked: boolean) => {
    setDepositPaid(checked);
    if (checked) {
      onUpdate({
        deposit_amount: undefined,
        deposit_percent: undefined,
      });
    }
  };

  const handleDepositPercentChange = (percent: number) => {
    onUpdate({ deposit_percent: percent });
  };

  const handleDepositAmountChange = (amount: number) => {
    onUpdate({ deposit_amount: amount });
  };

  if (contractType === "CO_PRODUCING") {
    return (
      <Card className="p-4 bg-gray-50 border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <FaMoneyBillWave className="w-5 h-5 text-gray-600" />
          <h4 className="font-semibold text-lg text-gray-800">Deposit Payment</h4>
        </div>
        <div className="p-3 bg-gray-100 border border-gray-300 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">No Deposit Required</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Co-producing contracts share profits; no upfront payment is required.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-amber-50 border-amber-200">
      <div className="flex items-center gap-3 mb-4">
        <FaMoneyBillWave className="w-5 h-5 text-amber-600" />
        <h4 className="font-semibold text-lg text-amber-900">Deposit Payment</h4>
      </div>

      <div className="space-y-4">
        {/* Checkbox đã trả */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="deposit-paid"
            checked={depositPaid}
            onCheckedChange={handleDepositPaidToggle}
          />
          <Label htmlFor="deposit-paid" className="text-sm font-medium cursor-pointer">
            Deposit has already been paid
          </Label>
        </div>

        {/* Form nhập liệu */}
        {!depositPaid && (
          <div className="ml-6 space-y-4 border-l-2 border-amber-300 pl-4 py-2">
            {usePercentage ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Deposit Percentage (%)</Label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={depositPercent === 0 ? "" : depositPercent}
                      onChange={(e) => handleDepositPercentChange(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-amber-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="10"
                    />
                    <span className="absolute right-8 top-2 text-gray-500 font-semibold">%</span>
                  </div>
                  {errors.deposit_percent && (
                    <p className="text-red-500 text-xs mt-1">{errors.deposit_percent}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Total Contract Value (VND)
                  </Label>
                  <div className="p-2 bg-amber-100 border border-amber-300 rounded-md">
                    <span className="text-sm font-bold text-amber-800">
                      {totalContractCost > 0
                        ? totalContractCost.toLocaleString() + " VND"
                        : "0 VND"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-xs">
                <CurrencyInput
                  label="Deposit Amount (VND)"
                  value={depositAmount}
                  onChange={handleDepositAmountChange}
                  placeholder="5,000,000"
                  error={errors.deposit_amount}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Optional upfront payment before performance-based rewards.
                </p>
              </div>
            )}

            {/* Deposit status */}
            {finalDepositAmount > 0 ? (
              <div className="p-3 bg-red-100 border border-red-300 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-bold text-red-800">Deposit Payment Required</span>
                </div>
                <p className="text-lg font-extrabold text-red-900 mt-1">
                  {finalDepositAmount.toLocaleString()} VND
                </p>
                <p className="text-xs text-red-700 mt-1">
                  Client must pay this deposit before contract execution.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-gray-100 border border-gray-300 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">No Deposit Required</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Full payment will follow the contract’s payment schedule.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Đã thanh toán */}
        {depositPaid && (
          <div className="ml-6 p-3 bg-green-100 border border-green-300 rounded-md border-l-2 border-l-green-500 pl-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-bold text-green-800">Deposit Already Paid</span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              No additional deposit payment required at this stage.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

// Add this helper function to get default financial terms
const getDefaultFinancialTerms = (type: string) => {
  const baseTerms = {
    payment_method: "BANK_TRANSFER",
  };

  switch (type) {
    case "ADVERTISING":
      return {
        ...baseTerms,
        model: "FIXED",
        total_cost: 0,
        cost_breakdown: {},
        schedule: [],
      };

    case "BRAND_AMBASSADOR":
      return {
        ...baseTerms,
        model: "FIXED",
        total_cost: 0,
        cost_breakdown: [],
        schedule: [],
      };

    case "AFFILIATE":
      return {
        ...baseTerms,
        model: "LEVELS",
        base_per_click: 0,
        levels: [],
        payment_cycle: "",
        payment_date: "",
        tax_withholding: { threshold: 0, rate_percent: 0 },
      };

    case "CO_PRODUCING":
      return {
        ...baseTerms,
        model: "SHARE",
        profit_split_company_percent: 0,
        profit_split_kol_percent: 0,
        profit_distribution_cycle: "",
        profit_distribution_date: [],
      };

    default:
      return baseTerms;
  }
};

// ========================
// JSON Preview
// ========================
const JsonPreview: React.FC<{ data: any }> = ({ data }) => (
  <Card className="h-full">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <FaCode className="w-5 h-5" />
        Financial Terms JSON Preview
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm max-h-[600px] overflow-y-auto">
        {data.financialTerms && Object.keys(data.financialTerms).length > 0 ? (
          <pre className="text-xs">{JSON.stringify(data.financialTerms, null, 2)}</pre>
        ) : (
          <div className="text-gray-400 text-center py-8">No financial terms data available</div>
        )}
      </div>
    </CardContent>
  </Card>
);

// ========================
// Main Component
// ========================
const FinancialTerms: React.FC<FinancialTermsProps> = ({
  formData,
  onUpdateFinancialTerms,
  errors = {},
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const contractType = formData?.type;
  const financialTerms = formData?.financialTerms || {};

  // Reset function for financial terms only
  const handleResetFinancialTerms = () => {
    setShowResetModal(true);
  };

  const confirmResetFinancialTerms = () => {
    const defaultTerms = getDefaultFinancialTerms(contractType);
    onUpdateFinancialTerms(defaultTerms);
    setShowResetModal(false);
  };

  const cancelResetFinancialTerms = () => {
    setShowResetModal(false);
  };

  // Check if there's any financial data to reset
  const hasFinancialData = () => {
    if (!financialTerms || Object.keys(financialTerms).length === 0) return false;

    // Check if there's meaningful data beyond defaults
    const defaultTerms = getDefaultFinancialTerms(contractType);
    return JSON.stringify(financialTerms) !== JSON.stringify(defaultTerms);
  };

  if (!contractType) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Financial Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-12">Please select a contract type first</p>
        </CardContent>
      </Card>
    );
  }

  // Loại bỏ deposit_paid khi gửi update
  const handleUpdateFinancialTerms = (updates: any) => {
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([key]) => key !== "deposit_paid"),
    );
    onUpdateFinancialTerms(filtered);
  };

  const renderContractTypeScope = () => {
    const commonProps = {
      formData,
      onUpdate: handleUpdateFinancialTerms,
      errors,
    };

    switch (contractType) {
      case "ADVERTISING":
        return <AdvertisingScope {...commonProps} />;
      case "BRAND_AMBASSADOR":
        return <BrandAmbassadorScope {...commonProps} />;
      case "AFFILIATE":
        return <AffiliateScope {...commonProps} />;
      case "CO_PRODUCING":
        return <CoProducingScope {...commonProps} />;
      default:
        return (
          <Card className="shadow-sm">
            <CardContent className="py-12">
              <p className="text-center text-gray-500">Unsupported contract type: {contractType}</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {hasFinancialData() && (
            <Button
              type="button"
              variant="outline"
              onClick={handleResetFinancialTerms}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <FaRotateLeft className="w-4 h-4" />
              Reset Financial Terms
            </Button>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2"
        >
          {showPreview ? (
            <>
              <FaEyeSlash className="w-4 h-4" />
              Hide JSON Preview
            </>
          ) : (
            <>
              <FaEye className="w-4 h-4" />
              Show JSON Preview
            </>
          )}
        </Button>
      </div>

      {/* Layout */}
      <div className={`grid gap-6 ${showPreview ? "lg:grid-cols-2" : "grid-cols-1"}`}>
        <div className="space-y-6">
          <DepositPayment
            financialTerms={financialTerms}
            onUpdate={handleUpdateFinancialTerms}
            errors={errors}
            contractType={contractType}
          />
          {renderContractTypeScope()}
        </div>

        {showPreview && <JsonPreview data={formData} />}
      </div>

      {/* Reset Financial Terms Modal */}
      <WarningDialog
        isOpen={showResetModal}
        onOpenChange={setShowResetModal}
        title="Reset Financial Terms"
        description={`Are you sure you want to reset all financial terms for this ${contractType.toLowerCase().replace("_", " ")} contract?`}
        warningMessage="Warning: The following financial data will be permanently deleted:"
        warningItems={[
          "Payment schedules and milestones",
          "Cost breakdowns and amounts",
          "Commission levels and rates",
          "Profit sharing configurations",
          "Deposit information",
          "All other financial settings",
        ]}
        additionalInfo="This action will reset the financial terms to default values. Other contract information will remain unchanged."
        onConfirm={confirmResetFinancialTerms}
        onCancel={cancelResetFinancialTerms}
        confirmText="Reset Financial Terms"
        cancelText="Cancel"
      />
    </div>
  );
};

export default FinancialTerms;
