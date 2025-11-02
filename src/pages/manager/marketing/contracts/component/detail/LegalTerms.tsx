import React from "react";
import { Shield, AlertTriangle, FileText } from "lucide-react";

export const LegalTerms: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null;
  const { breach_of_contract, standard_terms } = data;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Shield className="w-6 h-6 text-red-600" />
        Legal Terms
      </h2>

      {breach_of_contract && (
        <div className="bg-white rounded-lg border border-red-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {breach_of_contract.label}
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {breach_of_contract.items.map((item: any, i: number) => (
              <div key={i} className="border-l-4 border-red-500 pl-4 py-2">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  {item.title}
                  {item.compensation_percent && (
                    <span className="ml-auto px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                      +{item.compensation_percent}% Penalty
                    </span>
                  )}
                </h4>
                <ul className="space-y-1">
                  {item.details.map((d: string, j: number) => (
                    <li key={j} className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-600 mt-1">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {standard_terms && (
        <div className="bg-white rounded-lg border border-blue-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {standard_terms.label}
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {standard_terms.items.map((t: any, i: number) => (
              <div
                key={i}
                className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100"
              >
                <h4 className="font-bold text-gray-900 mb-2">{t.title}</h4>
                <p className="text-sm text-gray-700">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default LegalTerms;
