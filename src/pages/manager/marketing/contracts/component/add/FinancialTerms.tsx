import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FaCode, FaEye, FaEyeSlash, FaMoneyBillWave } from "react-icons/fa6";
import { CurrencyInput } from "./shared/FinancialSharedComponent";
import {
  AdvertisingScope,
  AffiliateScope,
  BrandAmbassadorScope,
  CoProducingScope,
} from "./financialTermScope";

interface FinancialTermsProps {
  formData: any;
  onUpdateFinancialTerms: (updates: any) => void;
  errors?: any;
}

// Deposit Payment Component - SIMPLIFIED
const DepositPayment: React.FC<{
  financialTerms: any;
  onUpdate: (updates: any) => void;
  errors?: any;
}> = ({ financialTerms, onUpdate, errors = {} }) => {
  const depositPaid = financialTerms.deposit_paid || false;
  const depositAmount = financialTerms.deposit_amount || 0;

  const handleDepositPaidToggle = (checked: boolean) => {
    onUpdate({
      deposit_paid: checked,
      // If deposit is marked as paid, clear the amount field since it's not needed
      deposit_amount: checked ? 0 : depositAmount,
    });
  };

  const handleDepositAmountChange = (amount: number) => {
    onUpdate({
      deposit_amount: amount,
    });
  };

  return (
    <Card className="p-4 bg-amber-50 border-amber-200">
      <div className="flex items-center gap-3 mb-4">
        <FaMoneyBillWave className="w-5 h-5 text-amber-600" />
        <h4 className="font-medium text-amber-900">Deposit Payment</h4>
      </div>

      <div className="space-y-4">
        {/* Single Checkbox for Deposit Paid */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="deposit-paid"
            checked={depositPaid}
            onCheckedChange={handleDepositPaidToggle}
          />
          <Label htmlFor="deposit-paid" className="text-sm font-medium">
            Deposit has already been paid
          </Label>
        </div>

        {/* Deposit Amount Input - Only show if deposit hasn't been paid */}
        {!depositPaid && (
          <div className="ml-6 space-y-3 border-l-2 border-amber-200 pl-4">
            <div className="max-w-xs">
              <CurrencyInput
                label="Deposit Amount (VND)"
                value={depositAmount}
                onChange={handleDepositAmountChange}
                placeholder="5,000,000"
                error={errors.deposit_amount}
              />
              <p className="text-xs text-gray-600 mt-1">
                Leave empty if no deposit is required for this contract
              </p>
            </div>

            {/* Deposit Required Status */}
            {depositAmount > 0 && (
              <div className="p-3 bg-amber-100 border border-amber-200 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium text-amber-800">
                    Deposit Payment Required
                  </span>
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  Amount: {depositAmount.toLocaleString()} VND
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Client must pay deposit before contract execution
                </p>
              </div>
            )}

            {/* No Deposit Status */}
            {depositAmount === 0 && (
              <div className="p-3 bg-gray-100 border border-gray-200 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">No Deposit Required</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Full payment will be made according to the payment schedule
                </p>
              </div>
            )}
          </div>
        )}

        {/* Deposit Already Paid Status */}
        {depositPaid && (
          <div className="ml-6 p-3 bg-green-100 border border-green-200 rounded-md border-l-2 border-l-amber-200 pl-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Deposit Already Paid</span>
            </div>
            <p className="text-xs text-green-600 mt-1">No additional deposit payment required</p>
          </div>
        )}
      </div>
    </Card>
  );
};

// JSON Preview Component
const JsonPreview: React.FC<{ data: any }> = ({ data }) => {
  return (
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
};

// Main Component
const FinancialTerms: React.FC<FinancialTermsProps> = ({
  formData,
  onUpdateFinancialTerms,
  errors = {},
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const contractType = formData?.type;
  const financialTerms = formData?.financialTerms || {};

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

  const renderContractTypeScope = () => {
    const commonProps = {
      formData,
      onUpdate: onUpdateFinancialTerms,
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
      {/* Toggle Preview Button */}
      <div className="flex justify-end">
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

      {/* Main Content Layout */}
      <div className={`grid gap-6 ${showPreview ? "lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* Financial Terms Form */}
        <div className="space-y-6">
          {/* Deposit Payment Section */}
          <DepositPayment
            financialTerms={financialTerms}
            onUpdate={onUpdateFinancialTerms}
            errors={errors}
          />

          {/* Contract Type Specific Terms */}
          {renderContractTypeScope()}
        </div>

        {/* JSON Preview */}
        {showPreview && (
          <div>
            <JsonPreview data={formData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialTerms;
