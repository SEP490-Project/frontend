import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, Percent, Target } from "lucide-react";
import {} from "react-icons/fa6";

const FinancialTerms: React.FC<{ type: string; data: any }> = ({ type, data }) => {
  if (!data) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 flex items-center">Financial Terms</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.total_cost && (
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(data.total_cost)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {data.payment_method && (
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                  <Badge variant="secondary" className="font-medium">
                    {data.payment_method.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {data.deposit_amount && (
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Deposit</p>
                  <p className="text-xl font-bold text-purple-600">
                    {formatCurrency(data.deposit_amount)}
                  </p>
                  {data.deposit_percent && (
                    <p className="text-xs text-gray-500">{data.deposit_percent}% of total</p>
                  )}
                </div>
                <Percent className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        )}

        {(data.commission_rate_percent || data.base_per_click) && (
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Commission</p>
                  {data.commission_rate_percent && (
                    <p className="text-xl font-bold text-orange-600">
                      {data.commission_rate_percent}%
                    </p>
                  )}
                  {data.base_per_click && (
                    <p className="text-lg font-bold text-orange-600">
                      {formatCurrency(data.base_per_click)}/click
                    </p>
                  )}
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {data.cost_breakdown && Object.keys(data.cost_breakdown).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.cost_breakdown).map(([key, value]: [string, any]) => {
                const percentage = data.total_cost ? (value / data.total_cost) * 100 : 0;
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{key}</span>
                      <span className="font-bold text-gray-900">{formatCurrency(value)}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {(type === "ADVERTISING" || type === "BRAND_AMBASSADOR") && data.schedule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Payment Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.schedule.map((s: any, i: number) => (
                <div key={i} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-900">{s.milestone}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due: {new Date(s.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(s.amount)}</p>
                      <Badge variant="outline" className="text-xs">
                        {s.percent}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {type === "CO_PRODUCING" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Profit Sharing Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-indigo-50">
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-gray-600">Company Share</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {data.profit_split_company_percent}%
                    </p>
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-purple-50">
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-gray-600">KOL Share</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {data.profit_split_kol_percent}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">Distribution Cycle</p>
                  <p className="font-semibold text-gray-900">{data.profit_distribution_cycle}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">Payment Date</p>
                  <p className="font-semibold text-gray-900">
                    Day {data.profit_distribution_date} of month
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {type === "AFFILIATE" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-600" />
              Affiliate Commission Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Commission Levels */}
            {data.levels && data.levels.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Commission Levels</h4>
                {data.levels.map((level: any, i: number) => (
                  <div key={i} className="border rounded-lg p-4 hover:bg-pink-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-pink-700 border-pink-300">
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
                  </div>
                ))}
              </div>
            )}

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
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(data.tax_withholding.threshold)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {data.payment_cycle && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Payment Schedule</h4>
                <p className="text-gray-700">
                  <span className="font-medium">{data.payment_cycle}</span> - Day{" "}
                  {data.payment_date}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinancialTerms;
