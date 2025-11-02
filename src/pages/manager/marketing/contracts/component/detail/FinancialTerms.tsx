import React from "react";
import { DollarSign, TrendingUp, Calendar, Percent } from "lucide-react";

const FinancialTerms: React.FC<{ type: string; data: any }> = ({ type, data }) => {
  if (!data) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-green-600" />
        Financial Terms
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Cost Card */}
        {data.total_cost && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Contract Value</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(data.total_cost)}</p>
          </div>
        )}

        {/* Payment Method */}
        {data.payment_method && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Payment Method</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xl font-bold text-blue-700">
              {data.payment_method.replace(/_/g, " ")}
            </p>
            {data.model && <p className="text-sm text-gray-600 mt-1">Model: {data.model}</p>}
          </div>
        )}

        {/* Deposit Info */}
        {data.deposit_amount && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Deposit</span>
              <Percent className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xl font-bold text-purple-700">
              {formatCurrency(data.deposit_amount)}
            </p>
            {data.deposit_percent && (
              <p className="text-sm text-gray-600 mt-1">{data.deposit_percent}% of total</p>
            )}
          </div>
        )}
      </div>

      {/* Cost Breakdown */}
      {data.cost_breakdown && Object.keys(data.cost_breakdown).length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(data.cost_breakdown).map(([key, value]: [string, any]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-700 font-medium">{key}</span>
                <span className="text-gray-900 font-semibold">{formatCurrency(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Schedule (ADVERTISING) */}
      {type === "ADVERTISING" && data.schedule && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Payment Schedule
          </h3>
          <div className="space-y-3">
            {data.schedule.map((s: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{s.milestone}</p>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(s.due_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-700">{formatCurrency(s.amount)}</p>
                  <p className="text-sm text-gray-600">{s.percent}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profit Sharing (CO_PRODUCING) */}
      {type === "CO_PRODUCING" && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Profit Sharing Model
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-white rounded-lg border border-indigo-200">
              <span className="text-sm text-gray-600">Company Share</span>
              <p className="text-2xl font-bold text-indigo-700">
                {data.profit_split_company_percent}%
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
              <span className="text-sm text-gray-600">KOL Share</span>
              <p className="text-2xl font-bold text-purple-700">{data.profit_split_kol_percent}%</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Distribution Cycle</span>
              <p className="font-semibold text-gray-900">{data.profit_distribution_cycle}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Payment Date</span>
              <p className="font-semibold text-gray-900">
                Day {data.profit_distribution_date} of month
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Affiliate Model */}
      {type === "AFFILIATE" && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pink-600" />
            Affiliate Commission Structure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {data.base_per_click && (
              <div className="p-4 bg-gradient-to-br from-pink-50 to-white rounded-lg border border-pink-200">
                <span className="text-sm text-gray-600">Base Per Click</span>
                <p className="text-xl font-bold text-pink-700">
                  {formatCurrency(data.base_per_click)}
                </p>
              </div>
            )}
            {data.commission_rate_percent && (
              <div className="p-4 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-200">
                <span className="text-sm text-gray-600">Commission Rate</span>
                <p className="text-xl font-bold text-orange-700">{data.commission_rate_percent}%</p>
              </div>
            )}
            {data.tax_withholding && (
              <div className="p-4 bg-gradient-to-br from-red-50 to-white rounded-lg border border-red-200">
                <span className="text-sm text-gray-600">Tax Withholding</span>
                <p className="text-xl font-bold text-red-700">
                  {data.tax_withholding.rate_percent}%
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Threshold: {formatCurrency(data.tax_withholding.threshold)}
                </p>
              </div>
            )}
          </div>

          {/* Levels */}
          {data.levels && data.levels.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Commission Levels</h4>
              <div className="space-y-2">
                {data.levels.map((level: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-white rounded border border-pink-100"
                  >
                    <span className="font-medium text-gray-900">Level {level.level}</span>
                    <div className="text-right">
                      <span className="text-gray-600">
                        Up to {level.max_clicks.toLocaleString()} clicks
                      </span>
                      <span className="ml-4 font-semibold text-pink-700">
                        {level.multiplier}x multiplier
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.payment_cycle && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Payment Schedule</span>
              <p className="font-semibold text-gray-900">
                {data.payment_cycle} - Day {data.payment_date}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default FinancialTerms;
