import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, Percent, Target, CheckCircle, XCircle } from "lucide-react";

interface FinancialTermsProps {
  type: string;
  data: any;
  deposit?: {
    amount?: number;
    percent?: number;
    isPaid?: boolean;
  };
}

const FinancialTerms: React.FC<FinancialTermsProps> = ({ type, data, deposit }) => {
  if (!data) return null;

  const formatCurrency = (amount: number) => new Intl.NumberFormat("vi-VN").format(amount) + " VND";

  return (
    <div className="space-y-8">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-3xl font-bold text-gray-900">Financial Terms</h2>
        {data.payment_method && (
          <Badge variant="secondary" className="text-base font-medium capitalize">
            {data.payment_method.replace(/_/g, " ")}
          </Badge>
        )}
      </div>

      {/* ===== Overview Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tổng giá trị hợp đồng */}
        {data.total_cost && (
          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-5 flex flex-col justify-center space-y-2">
              <p className="text-sm text-gray-500">Total Contract Value</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(data.total_cost)}</p>
            </CardContent>
          </Card>
        )}

        {/* Tiền đặt cọc */}
        {deposit?.amount && (
          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-5 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Deposit</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(deposit.amount)}
                </p>

                {deposit.percent && (
                  <p className="text-xs text-gray-500 mt-1">{deposit.percent}% of total</p>
                )}

                {typeof deposit.isPaid === "boolean" && (
                  <div className="flex items-center gap-1 mt-2">
                    {deposit.isPaid ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Paid</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-red-600 font-medium">Unpaid</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <Percent className="h-8 w-8 text-purple-500" />
            </CardContent>
          </Card>
        )}

        {/* Hoa hồng */}
        {(data.commission_rate_percent || data.base_per_click) && (
          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-5 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Commission</p>
                {data.commission_rate_percent && (
                  <p className="text-2xl font-bold text-orange-600">
                    {data.commission_rate_percent}%
                  </p>
                )}
                {data.base_per_click && (
                  <p className="text-lg font-semibold text-orange-600">
                    {formatCurrency(data.base_per_click)}/click
                  </p>
                )}
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </CardContent>
          </Card>
        )}
      </div>

      {/* ===== Cost Breakdown ===== */}
      {data.cost_breakdown && Object.keys(data.cost_breakdown).length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.cost_breakdown).map(([key, value]: [string, any]) => {
                const percentage = data.total_cost ? (value / data.total_cost) * 100 : 0;
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 capitalize">{key}</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===== Payment Schedule (for Advertising / Ambassador) ===== */}
      {(type === "ADVERTISING" || type === "BRAND_AMBASSADOR") && Array.isArray(data.schedule) && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Calendar className="w-5 h-5" /> Payment Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.schedule.map((s: any, i: number) => (
                <div
                  key={i}
                  className="border rounded-xl p-4 flex justify-between items-center hover:bg-blue-50 transition"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{s.milestone}</h4>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(s.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-blue-600">{formatCurrency(s.amount)}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {s.percent}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===== Profit Sharing (CO_PRODUCING) ===== */}
      {type === "CO_PRODUCING" && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <TrendingUp className="w-5 h-5" /> Profit Sharing Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border p-4 bg-indigo-50 text-center">
                  <p className="text-sm text-gray-600">Company Share</p>
                  <p className="text-3xl font-bold text-indigo-700">
                    {data.profit_split_company_percent}%
                  </p>
                </div>
                <div className="rounded-xl border p-4 bg-purple-50 text-center">
                  <p className="text-sm text-gray-600">KOL Share</p>
                  <p className="text-3xl font-bold text-purple-700">
                    {data.profit_split_kol_percent}%
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Distribution Cycle</p>
                <p className="font-semibold">{data.profit_distribution_cycle}</p>
              </div>

              {/* Distribution Schedule */}
              {data.profit_distribution_cycle && data.profit_distribution_date && (
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-3">Distribution Schedule</p>
                  {data.profit_distribution_cycle === "QUARTERLY" &&
                  Array.isArray(data.profit_distribution_date) ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {data.profit_distribution_date.map((item: any, index: number) => (
                        <div
                          key={item.id || index}
                          className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg"
                        >
                          <span className="font-medium">
                            {index === data.profit_distribution_date.length - 1
                              ? "Final Payment"
                              : `Quarter ${index + 1}`}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date(item.year, item.month - 1, item.day).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : data.profit_distribution_cycle === "MONTHLY" ? (
                    <p className="font-semibold">
                      Day {data.profit_distribution_date} of each month
                    </p>
                  ) : data.profit_distribution_cycle === "ANNUALLY" ? (
                    <p className="font-semibold">
                      Day {new Date(data.profit_distribution_date).getDate()} of Month{" "}
                      {new Date(data.profit_distribution_date).getMonth() + 1} annually
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">No schedule available</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===== Affiliate Model ===== */}
      {type === "AFFILIATE" && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <TrendingUp className="w-5 h-5" /> Affiliate Commission Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Commission Levels */}
            {data.levels?.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Commission Levels</h4>
                {data.levels.map((level: any, i: number) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 hover:bg-pink-50 flex justify-between items-center transition"
                  >
                    <div>
                      <Badge variant="outline" className="text-pink-700 border-pink-300 mb-1">
                        Level {level.level}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        Up to {level.max_clicks.toLocaleString()} clicks
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-pink-600">{level.multiplier}x</p>
                      <p className="text-sm text-gray-500">multiplier</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tax Withholding */}
            {data.tax_withholding && (
              <div className="border rounded-lg p-4 bg-red-50">
                <h4 className="font-semibold text-gray-900 mb-2">Tax Withholding</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Rate</p>
                    <p className="text-xl font-bold text-red-600">
                      {data.tax_withholding.rate_percent}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Threshold</p>
                    <p className="font-semibold">
                      {formatCurrency(data.tax_withholding.threshold)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Cycle */}
            {data.payment_cycle && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Payment Schedule</h4>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">{data.payment_cycle}</span>
                  </p>

                  {data.payment_date && (
                    <div className="mt-3">
                      {data.payment_cycle === "QUARTERLY" && Array.isArray(data.payment_date) ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {data.payment_date.map((item: any, index: number) => (
                            <div
                              key={item.id || index}
                              className="flex justify-between items-center p-2 bg-pink-50 rounded"
                            >
                              <span className="text-sm font-medium">
                                {index === data.payment_date.length - 1
                                  ? "Final Payment"
                                  : `Quarter ${index + 1}`}
                              </span>
                              <span className="text-xs text-gray-600">
                                {new Date(item.year, item.month - 1, item.day).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : data.payment_cycle === "MONTHLY" ? (
                        <p className="text-sm text-gray-600">
                          Day {data.payment_date} of each month
                        </p>
                      ) : data.payment_cycle === "ANNUALLY" ? (
                        <p className="text-sm text-gray-600">
                          Day {new Date(data.payment_date).getDate()} of Month{" "}
                          {new Date(data.payment_date).getMonth() + 1} annually
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No schedule available</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinancialTerms;
