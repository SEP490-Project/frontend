import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CurrencyInput } from "./shared/FinancialSharedComponent";
import {
  FaMoneyBillWave,
  FaCalculator,
  FaFileInvoiceDollar,
  FaPlus,
  FaTrash,
} from "react-icons/fa6";
import {
  AdvertisingScope,
  AffiliateScope,
  BrandAmbassadorScope,
  CoProducingScope,
} from "./financialTermScope";
import ContractUploader from "@/components/global/ContractUploader";
import { useAuth } from "@/libs/hooks/useAuth";

interface FinancialTermsProps {
  formData: any;
  onUpdateFinancialTerms: (updates: any) => void;
  onInputChange: (field: string, value: any) => void;
  errors?: any;
}

const CostBreakdown: React.FC<{
  breakdown?: { id: string; label: string; value: number }[];
  onChange: (b: { id: string; label: string; value: number }[]) => void;
  total: number;
}> = ({ breakdown = [], onChange, total }) => {
  const addItem = () => {
    const id = `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newBreakdown = [...breakdown, { id, label: "", value: 0 }];
    onChange(newBreakdown);
  };

  const updateItem = (id: string, key: "label" | "value", val: any) => {
    const updatedBreakdown = breakdown.map((i) => (i.id === id ? { ...i, [key]: val } : i));
    onChange(updatedBreakdown);
  };

  const removeItem = (id: string) => onChange(breakdown.filter((i) => i.id !== id));

  const format = (n = 0) => new Intl.NumberFormat("vi-VN").format(n);
  const subtotal = breakdown.reduce((s, i) => s + (Number(i.value) || 0), 0);

  // Disable add if subtotal >= total (like add milestone logic)
  const canAddItem = subtotal < total;

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold text-gray-800">Cost Breakdown</Label>

      <div className="space-y-3">
        {breakdown.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] items-end gap-4 border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
          >
            <div>
              <Label className="text-xs font-semibold text-gray-600">Breakdown item</Label>
              <Input
                placeholder="Enter item"
                value={item.label}
                onChange={(e) => updateItem(item.id, "label", e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-600">Cost (VND)</Label>
              <CurrencyInput
                value={item.value || 0}
                onChange={(val) => updateItem(item.id, "value", val)}
                placeholder="0"
              />
            </div>

            <div className="flex justify-end pb-1 md:pb-0">
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50"
                onClick={() => removeItem(item.id)}
              >
                <FaTrash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item button below the list, aligned with summary bar */}
      <div className="mt-2">
        <Button
          onClick={addItem}
          variant="outline"
          size="lg"
          className="w-full border-dashed border-2"
          disabled={!canAddItem}
        >
          <FaPlus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex justify-between text-sm mt-3">
        <span className="font-medium text-indigo-800">Subtotal:</span>
        <span className="font-bold text-indigo-900">{format(subtotal)} VND</span>
      </div>

      {total > 0 && (
        <div
          className={`mt-2 text-sm ${
            subtotal === total ? "text-green-600 font-medium" : "text-red-600 font-medium"
          }`}
        >
          {subtotal === total
            ? "Cost breakdown matches total contract cost."
            : `Cost breakdown (${format(subtotal)} VND) does not match total contract cost (${format(total)} VND).`}
        </div>
      )}
    </div>
  );
};

const FinancialOverview: React.FC<{
  formData: any;
  financial_terms: any;
  onUpdate: (updates: any) => void;
  errors?: any;
}> = ({ formData, financial_terms, onUpdate, errors = {} }) => {
  const total = financial_terms.total_cost ?? 0;
  const percent = formData.deposit_percent ?? 0;
  const paid = formData.is_deposit_paid ?? false;
  const { user } = useAuth();

  const deposit = (total * percent) / 100;
  const remaining = total - deposit;
  const fmt = (n = 0) => new Intl.NumberFormat("vi-VN").format(n);

  const getCostBreakdownArray = () => {
    if (
      financial_terms.cost_breakdown_array &&
      Array.isArray(financial_terms.cost_breakdown_array)
    ) {
      return financial_terms.cost_breakdown_array;
    }

    if (
      financial_terms.cost_breakdown &&
      typeof financial_terms.cost_breakdown === "object" &&
      !Array.isArray(financial_terms.cost_breakdown)
    ) {
      return Object.entries(financial_terms.cost_breakdown).map(([label, value], index) => ({
        id: `item-${index}-${Date.now()}`,
        label,
        value: Number(value) || 0,
      }));
    }

    return [];
  };

  const depositProofUrls = formData.deposit_proof_url || "";

  return (
    <Card className="border border-gray-200 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center gap-3">
          <FaFileInvoiceDollar className="w-6 h-6 text-indigo-600" />
          <div>
            <CardTitle className="text-indigo-800">Financial Overview</CardTitle>
            <CardDescription>Contract total, deposit, and payment summary</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <CurrencyInput
          label="Total Contract Cost (VND)"
          value={total}
          onChange={(v) => onUpdate({ total_cost: v })}
          placeholder="10.000.000"
          error={errors.total_cost}
        />

        <CostBreakdown
          breakdown={getCostBreakdownArray()}
          onChange={(b) => onUpdate({ cost_breakdown: b })}
          total={total}
        />

        <Separator className="my-4" />

        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="w-5 h-5 text-amber-600" />
            <Label className="font-semibold text-base">Deposit Setup</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LEFT */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">Deposit Percentage (% - Max 50%)</Label>

              <Input
                type="number"
                min={0}
                max={50}
                step={1}
                value={percent || ""}
                enforceRange
                placeholder="10"
                onChange={(e) => {
                  let newPercent = Number(e.target.value) || 0;
                  if (newPercent > 50) newPercent = 50;

                  const newDepositAmount = Math.round((total * newPercent) / 100);

                  onUpdate({
                    deposit_percent: newPercent,
                    deposit_amount: newDepositAmount,
                  });
                }}
              />

              {errors.deposit_percent && (
                <p className="text-xs text-red-500">{errors.deposit_percent}</p>
              )}
              {percent > 50 && (
                <p className="text-xs text-orange-500">Maximum deposit is 50% of total cost</p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="is-paid"
                checked={paid}
                onCheckedChange={(checked) => {
                  onUpdate({ is_deposit_paid: checked });
                }}
              />
              <Label htmlFor="is-paid" className="cursor-pointer text-sm">
                Deposit already paid
              </Label>
            </div>
          </div>

          {paid && (
            <div className="space-y-3">
              <ContractUploader
                userId={user?.id || "unknown"}
                accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
                multiple={false}
                maxFiles={1}
                maxSize={100}
                allowedTypes={[
                  "jpg",
                  "jpeg",
                  "png",
                  "webp",
                  "mp4",
                  "mov",
                  "avi",
                  "doc",
                  "docx",
                  "pdf",
                  "ppt",
                  "pptx",
                ]}
                title="Upload deposit proof"
                context="deposit-proof"
                initialUrls={depositProofUrls ? [depositProofUrls] : []}
                onUploadComplete={(urls) => {
                  const newUrl = urls.length > 0 ? urls[0] : "";
                  onUpdate({ deposit_proof_url: newUrl });
                }}
                onFilesRemove={(removedUrls) => {
                  // If the current deposit_proof_url is among the removed files, clear it
                  if (removedUrls.includes(depositProofUrls)) {
                    onUpdate({ deposit_proof_url: "" });
                  }
                }}
              />

              {paid && (!depositProofUrls || depositProofUrls.trim() === "") && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">
                    Deposit proof is required when deposit is marked as paid.
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <Label className="text-sm font-medium">Deposit Amount (VND)</Label>
            <CurrencyInput value={deposit} placeholder="0" disabled />
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-3">
            <Card
              className={`transition border ${
                deposit > 0
                  ? paid
                    ? "bg-green-50 border-green-200"
                    : "bg-amber-50 border-amber-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Deposit Amount</p>
                    <p
                      className={`text-lg font-bold ${paid ? "text-green-700" : "text-amber-700"}`}
                    >
                      {fmt(deposit)} VND
                    </p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${paid ? "bg-green-500" : "bg-amber-500"}`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Remaining Amount</p>
                    <p className="text-lg font-bold text-blue-700">{fmt(remaining)} VND</p>
                  </div>
                  <FaCalculator className="w-4 h-4 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-indigo-50 border-indigo-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Total Contract</p>
                    <p className="text-lg font-bold text-indigo-700">{fmt(total)} VND</p>
                  </div>
                  <FaFileInvoiceDollar className="w-4 h-4 text-indigo-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FinancialTerms: React.FC<FinancialTermsProps> = ({
  formData,
  onUpdateFinancialTerms,
  onInputChange,
  errors = {},
}) => {
  const contractType = formData?.type;
  const financial_terms = formData?.financial_terms || {};

  const handleUpdate = (updates: any) => {
    if (updates.deposit_percent !== undefined) {
      onInputChange("deposit_percent", updates.deposit_percent);
    }

    if (updates.deposit_amount !== undefined) {
      onInputChange("deposit_amount", updates.deposit_amount);
    }

    if (updates.is_deposit_paid !== undefined) {
      onInputChange("is_deposit_paid", updates.is_deposit_paid);
    }

    if (updates.deposit_proof_url !== undefined) {
      onInputChange("deposit_proof_url", updates.deposit_proof_url);
    }

    const financialUpdates = Object.keys(updates).reduce((acc: any, key) => {
      if (
        key !== "deposit_percent" &&
        key !== "deposit_amount" &&
        key !== "is_deposit_paid" &&
        key !== "deposit_proof_url"
      ) {
        if (key === "cost_breakdown" && Array.isArray(updates[key])) {
          acc[`${key}_array`] = updates[key];

          const breakdownObject: Record<string, number> = {};
          updates[key].forEach((item: { label: string; value: number }) => {
            if (item.label && item.label.trim()) {
              breakdownObject[item.label.trim()] = Number(item.value) || 0;
            }
          });
          acc[key] = breakdownObject;
        } else {
          acc[key] = updates[key];
        }
      }
      return acc;
    }, {});

    if (Object.keys(financialUpdates).length > 0) {
      onUpdateFinancialTerms(financialUpdates);
    }
  };

  if (!contractType)
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Financial Terms</CardTitle>
        </CardHeader>
        <CardContent className="py-10 text-center text-gray-500">
          <FaFileInvoiceDollar className="w-14 h-14 mx-auto mb-3 opacity-50" />
          Please select a contract type first
        </CardContent>
      </Card>
    );

  const renderScope = () => {
    const common = { formData, onUpdate: handleUpdate, errors };
    switch (contractType) {
      case "ADVERTISING":
        return <AdvertisingScope {...common} />;
      case "BRAND_AMBASSADOR":
        return <BrandAmbassadorScope {...common} />;
      case "AFFILIATE":
        return <AffiliateScope {...common} />;
      case "CO_PRODUCING":
        return <CoProducingScope {...common} />;
      default:
        return (
          <Card className="shadow-sm">
            <CardContent className="py-10 text-center text-gray-500">
              Unsupported contract type: {contractType}
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-8">
      <FinancialOverview
        formData={formData}
        financial_terms={financial_terms}
        onUpdate={handleUpdate}
        errors={errors}
      />
      {renderScope()}
    </div>
  );
};

export default FinancialTerms;
