import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { FaFileLines, FaTriangleExclamation } from "react-icons/fa6";

export const LegalTerms: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null;
  const { breach_of_contract, standard_terms } = data;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 flex items-center">
        Legal Terms & Conditions
      </h2>

      {breach_of_contract && (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <FaTriangleExclamation className="w-5 h-5" />
              {breach_of_contract.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {breach_of_contract.items.map((item: any, i: number) => (
                <div key={i}>
                  <Alert
                    className={`border-l-4 ${
                      item.compensation_percent
                        ? "border-l-red-500 bg-red-50"
                        : item.title.includes("Mutual")
                          ? "border-l-green-500 bg-green-50"
                          : "border-l-orange-500 bg-orange-50"
                    }`}
                  >
                    <FaTriangleExclamation className="h-4 w-4" />
                    <div className="flex items-center justify-between w-full">
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      {item.compensation_percent && (
                        <Badge variant="destructive" className="ml-2 text-white">
                          +{item.compensation_percent}% Penalty
                        </Badge>
                      )}
                    </div>
                    <AlertDescription className="mt-2">
                      <ul className="space-y-2 mt-2">
                        {item.details.map((d: string, j: number) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-red-600 mt-1 text-sm">•</span>
                            <span className="text-sm text-gray-700">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                  {i < breach_of_contract.items.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {standard_terms && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <FaFileLines className="w-5 h-5" />
              {standard_terms.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {standard_terms.items.map((t: any, i: number) => (
                <Card key={i} className="border border-blue-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-700">{i + 1}</span>
                      </div>
                      {t.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed">{t.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LegalTerms;
