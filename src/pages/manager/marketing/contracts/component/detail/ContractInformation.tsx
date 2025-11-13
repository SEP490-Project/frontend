import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FaLocationDot,
  FaUser,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaHashtag,
  FaCalendarDay,
} from "react-icons/fa6";
import { formatDate } from "@/libs/helper/helper";

const ContractInformation: React.FC<{ data: any }> = ({ data }) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-800 border-gray-300",
      ACTIVE: "bg-green-100 text-green-800 border-green-300",
      EXPIRED: "bg-red-100 text-red-800 border-red-300",
      TERMINATED: "bg-orange-100 text-orange-800 border-orange-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      BRAND_AMBASSADOR: "bg-purple-100 text-purple-800 border-purple-300",
      ADVERTISING: "bg-blue-100 text-blue-800 border-blue-300",
      CO_PRODUCING: "bg-indigo-100 text-indigo-800 border-indigo-300",
      AFFILIATE: "bg-pink-100 text-pink-800 border-pink-300",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Contract Overview</h2>
        <div className="flex gap-3">
          <Badge variant="outline" className={`${getStatusColor(data.status)} px-3 py-1`}>
            {data.status}
          </Badge>
          <Badge variant="outline" className={`${getTypeColor(data.type)} px-3 py-1`}>
            {data.type?.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Details Card */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <FaBuilding className="w-5 h-5" />
              Contract Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Title</p>
              <p className="text-base font-semibold text-gray-900">{data.title}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <FaHashtag className="w-3 h-3" />
                  Contract Number
                </div>
                <p className="text-sm font-semibold text-gray-900">{data.contract_number}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Currency</p>
                <Badge variant="secondary">{data.currency}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Information Card */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <FaBuilding className="w-5 h-5" />
              Brand Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold text-gray-900">{data.brand?.name ?? "—"}</p>
                <p className="text-sm text-gray-500">{data.brand?.representative_name ?? "—"}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <FaPhone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{data.brand?.contact_phone ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaEnvelope className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 break-all">{data.brand?.contact_email ?? "—"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Card */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <FaCalendarDay className="w-5 h-5" />
              Timeline & Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Signed Date</p>
                <p className="text-sm font-semibold text-green-700">
                  {data.signed_date ? formatDate(data.signed_date) : "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">End Date</p>
                <p className="text-sm font-semibold text-red-600">
                  {data.end_date ? formatDate(data.end_date) : "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p className="text-sm font-semibold text-gray-900">
                  {data.created_at ? formatDate(data.created_at) : "—"}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <FaLocationDot className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Signed Location</p>
                <p className="text-sm font-semibold text-gray-900">{data.signed_location ?? "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Representative Card */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <FaUser className="w-5 h-5" />
              Representative (KOL)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-gray-900">{data.representative_name ?? "—"}</p>
                <p className="text-sm text-gray-500">{data.representative_role ?? "—"}</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <FaPhone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{data.representative_phone ?? "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaEnvelope className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 break-all">
                    {data.representative_email ?? "—"}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <FaCreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-gray-900 text-xs">
                      {data.representative_bank_account_number ?? "—"}
                    </p>
                    <p className="text-gray-500 text-xs">{data.representative_bank_name ?? "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractInformation;
