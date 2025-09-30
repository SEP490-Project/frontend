import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Plus, Trash2 } from "lucide-react";

interface FinancialTermsProps {
  formData: any;
  contractTypeOptions: { value: string; label: string }[];
  onContractTypeChange: (type: string) => void;
  onUpdateFinancialTerms: (updates: any) => void;
  errors?: any;
}

const FinancialTerms: React.FC<FinancialTermsProps> = ({
  formData,
  contractTypeOptions,
  onContractTypeChange,
  onUpdateFinancialTerms,
  errors = {},
}) => {
  // Add payment schedule item
  const addScheduleItem = () => {
    const schedule = formData.financialTerms.schedule || [];
    const newItem = {
      milestone: "",
      percent: 0,
      amount: 0,
      dueDate: "",
      requiredDocs: [],
    };
    onUpdateFinancialTerms({ schedule: [...schedule, newItem] });
  };

  // Update payment schedule item
  const updateScheduleItem = (index: number, field: string, value: any) => {
    const schedule = [...(formData.financialTerms.schedule || [])];
    schedule[index] = { ...schedule[index], [field]: value };
    onUpdateFinancialTerms({ schedule });
  };

  // Remove payment schedule item
  const removeScheduleItem = (index: number) => {
    const schedule = (formData.financialTerms.schedule || []).filter(
      (_: any, i: number) => i !== index,
    );
    onUpdateFinancialTerms({ schedule });
  };

  // Add affiliate level
  const addAffiliateLevel = () => {
    const levels = formData.financialTerms.levels || [];
    const newLevel = {
      level: levels.length + 1,
      minClicks: 0,
      multiplier: 0.1,
    };
    onUpdateFinancialTerms({ levels: [...levels, newLevel] });
  };

  // Update affiliate level
  const updateAffiliateLevel = (index: number, field: string, value: any) => {
    const levels = [...(formData.financialTerms.levels || [])];
    levels[index] = { ...levels[index], [field]: value };
    onUpdateFinancialTerms({ levels });
  };

  // Remove affiliate level
  const removeAffiliateLevel = (index: number) => {
    const levels = (formData.financialTerms.levels || []).filter(
      (_: any, i: number) => i !== index,
    );
    onUpdateFinancialTerms({ levels });
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <CardTitle className="text-xl">Financial Terms</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contract Type Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Contract Type *</Label>
          <Select value={formData.type} onValueChange={onContractTypeChange}>
            <SelectTrigger className={`h-11 ${errors.type ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Select contract type" />
            </SelectTrigger>
            <SelectContent>
              {contractTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
        </div>

        {/* Fixed Payment Model (ADVERTISING, BRAND_AMBASSADOR) */}
        {(formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR") && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Payment Method *</Label>
                <Input
                  value={formData.financialTerms.paymentMethod || ""}
                  onChange={(e) => onUpdateFinancialTerms({ paymentMethod: e.target.value })}
                  placeholder="e.g., Chuyển khoản"
                  className={`h-11 ${errors.financialTerms?.paymentMethod ? "border-red-500" : ""}`}
                />
                {errors.financialTerms?.paymentMethod && (
                  <p className="text-sm text-red-500">{errors.financialTerms.paymentMethod}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Total Cost ({formData.currency}) *</Label>
                <Input
                  type="number"
                  value={formData.financialTerms.totalCost || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({ totalCost: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0"
                  className={`h-11 ${errors.financialTerms?.totalCost ? "border-red-500" : ""}`}
                />
                {errors.financialTerms?.totalCost && (
                  <p className="text-sm text-red-500">{errors.financialTerms.totalCost}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Service Fee ({formData.currency})</Label>
                <Input
                  type="number"
                  value={formData.financialTerms.costBreakdown?.serviceFee || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({
                      costBreakdown: {
                        ...formData.financialTerms.costBreakdown,
                        serviceFee: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="0"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Other Fees ({formData.currency})</Label>
                <Input
                  type="number"
                  value={formData.financialTerms.costBreakdown?.otherFees || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({
                      costBreakdown: {
                        ...formData.financialTerms.costBreakdown,
                        otherFees: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="0"
                  className="h-11"
                />
              </div>
            </div>

            {/* Payment Schedule */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium">Payment Schedule</Label>
                <Button type="button" onClick={addScheduleItem} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Schedule
                </Button>
              </div>

              <div className="space-y-3">
                {(formData.financialTerms.schedule || []).map((item: any, index: number) => (
                  <Card key={index} className="p-4 bg-slate-50 border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600">Milestone</Label>
                        <Input
                          value={item.milestone}
                          onChange={(e) => updateScheduleItem(index, "milestone", e.target.value)}
                          placeholder="Upon Signing"
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600">Percent (%)</Label>
                        <Input
                          type="number"
                          value={item.percent}
                          onChange={(e) =>
                            updateScheduleItem(index, "percent", parseFloat(e.target.value) || 0)
                          }
                          placeholder="50"
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600">
                          Amount ({formData.currency})
                        </Label>
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(e) =>
                            updateScheduleItem(index, "amount", parseFloat(e.target.value) || 0)
                          }
                          placeholder="0"
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600">Due Date</Label>
                        <Input
                          type="date"
                          value={item.dueDate}
                          onChange={(e) => updateScheduleItem(index, "dueDate", e.target.value)}
                          className="h-10"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeScheduleItem(index)}
                          className="h-10 w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Affiliate Model */}
        {formData.type === "AFFILIATE" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Base Per Click ({formData.currency}) *
                </Label>
                <Input
                  type="number"
                  value={formData.financialTerms.basePerClick || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({ basePerClick: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="5000"
                  className={`h-11 ${errors.financialTerms?.basePerClick ? "border-red-500" : ""}`}
                />
                {errors.financialTerms?.basePerClick && (
                  <p className="text-sm text-red-500">{errors.financialTerms.basePerClick}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Payment Cycle *</Label>
                <Input
                  value={formData.financialTerms.paymentCycle || ""}
                  onChange={(e) => onUpdateFinancialTerms({ paymentCycle: e.target.value })}
                  placeholder="MONTHLY"
                  className={`h-11 ${errors.financialTerms?.paymentCycle ? "border-red-500" : ""}`}
                />
                {errors.financialTerms?.paymentCycle && (
                  <p className="text-sm text-red-500">{errors.financialTerms.paymentCycle}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Payment Date</Label>
                <Input
                  value={formData.financialTerms.paymentDate || ""}
                  onChange={(e) => onUpdateFinancialTerms({ paymentDate: e.target.value })}
                  placeholder="5th-10th"
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Tax Withholding Threshold ({formData.currency})
                </Label>
                <Input
                  type="number"
                  value={formData.financialTerms.taxWithholding?.threshold || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({
                      taxWithholding: {
                        ...formData.financialTerms.taxWithholding,
                        threshold: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="2000000"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tax Withholding Rate (%)</Label>
                <Input
                  type="number"
                  value={formData.financialTerms.taxWithholding?.ratePercent || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({
                      taxWithholding: {
                        ...formData.financialTerms.taxWithholding,
                        ratePercent: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="10"
                  className="h-11"
                />
              </div>
            </div>

            {/* Affiliate Levels */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium">Commission Levels</Label>
                <Button type="button" onClick={addAffiliateLevel} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Level
                </Button>
              </div>

              <div className="space-y-3">
                {(formData.financialTerms.levels || []).map((level: any, index: number) => (
                  <Card key={index} className="p-4 bg-slate-50 border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600">Level</Label>
                        <Input
                          type="number"
                          value={level.level}
                          onChange={(e) =>
                            updateAffiliateLevel(index, "level", parseInt(e.target.value) || 0)
                          }
                          placeholder="1"
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600">Min Clicks</Label>
                        <Input
                          type="number"
                          value={level.minClicks}
                          onChange={(e) =>
                            updateAffiliateLevel(index, "minClicks", parseInt(e.target.value) || 0)
                          }
                          placeholder="0"
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600">Multiplier</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={level.multiplier}
                          onChange={(e) =>
                            updateAffiliateLevel(
                              index,
                              "multiplier",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="0.1"
                          className="h-10"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeAffiliateLevel(index)}
                          className="h-10 w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Co-Production Model */}
        {formData.type === "CO_PRODUCING" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-lg font-medium">Company Capital Contribution</Label>
                <div className="space-y-2">
                  <Input
                    value={formData.financialTerms.capitalContribution?.company?.description || ""}
                    onChange={(e) =>
                      onUpdateFinancialTerms({
                        capitalContribution: {
                          ...formData.financialTerms.capitalContribution,
                          company: {
                            ...formData.financialTerms.capitalContribution?.company,
                            description: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="Description"
                    className="h-11"
                  />
                  <Input
                    type="number"
                    value={formData.financialTerms.capitalContribution?.company?.value || ""}
                    onChange={(e) =>
                      onUpdateFinancialTerms({
                        capitalContribution: {
                          ...formData.financialTerms.capitalContribution,
                          company: {
                            ...formData.financialTerms.capitalContribution?.company,
                            value: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    placeholder={`Value (${formData.currency})`}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium">KOL Capital Contribution</Label>
                <div className="space-y-2">
                  <Input
                    value={formData.financialTerms.capitalContribution?.kol?.description || ""}
                    onChange={(e) =>
                      onUpdateFinancialTerms({
                        capitalContribution: {
                          ...formData.financialTerms.capitalContribution,
                          kol: {
                            ...formData.financialTerms.capitalContribution?.kol,
                            description: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="Description"
                    className="h-11"
                  />
                  <Input
                    type="number"
                    value={formData.financialTerms.capitalContribution?.kol?.value || ""}
                    onChange={(e) =>
                      onUpdateFinancialTerms({
                        capitalContribution: {
                          ...formData.financialTerms.capitalContribution,
                          kol: {
                            ...formData.financialTerms.capitalContribution?.kol,
                            value: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    placeholder={`Value (${formData.currency})`}
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Company Profit Share (%) *</Label>
                <Input
                  type="number"
                  value={formData.financialTerms.profitSplitCompanyPercent || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({
                      profitSplitCompanyPercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="70"
                  className={`h-11 ${errors.financialTerms?.profitSplitCompanyPercent ? "border-red-500" : ""}`}
                />
                {errors.financialTerms?.profitSplitCompanyPercent && (
                  <p className="text-sm text-red-500">
                    {errors.financialTerms.profitSplitCompanyPercent}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">KOL Profit Share (%) *</Label>
                <Input
                  type="number"
                  value={formData.financialTerms.profitSplitKolPercent || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({
                      profitSplitKolPercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="30"
                  className={`h-11 ${errors.financialTerms?.profitSplitKolPercent ? "border-red-500" : ""}`}
                />
                {errors.financialTerms?.profitSplitKolPercent && (
                  <p className="text-sm text-red-500">
                    {errors.financialTerms.profitSplitKolPercent}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Profit Distribution Cycle</Label>
                <Input
                  value={formData.financialTerms.profitDistributionCycle || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({ profitDistributionCycle: e.target.value })
                  }
                  placeholder="ANNUALLY"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Profit Distribution Date</Label>
                <Input
                  value={formData.financialTerms.profitDistributionDate || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({ profitDistributionDate: e.target.value })
                  }
                  placeholder="December 31st"
                  className="h-11"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialTerms;
