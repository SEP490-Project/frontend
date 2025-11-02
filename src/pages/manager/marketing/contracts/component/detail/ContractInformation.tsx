import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Building2, Phone, Mail, CreditCard } from "lucide-react";

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
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Contract Overview</h2>
        <div className="flex gap-2">
          <Badge className={`${getStatusColor(data.status)} border`}>{data.status}</Badge>
          <Badge className={`${getTypeColor(data.type)} border`}>
            {data.type?.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Details */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Contract Details
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Title</span>
              <p className="font-medium text-gray-900">{data.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Contract Number</span>
                <p className="font-medium text-gray-900">{data.contract_number}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Currency</span>
                <p className="font-medium text-gray-900">{data.currency}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Information */}
        <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            Brand Information
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Brand Name</span>
              <p className="font-medium text-gray-900">{data.brand?.name ?? "—"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Contact
                </span>
                <p className="font-medium text-gray-900 text-sm">
                  {data.brand?.contact_phone ?? "—"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </span>
                <p className="font-medium text-gray-900 text-sm">
                  {data.brand?.contact_email ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border border-green-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Timeline
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Signed Date</span>
                <p className="font-medium text-gray-900">
                  {data.signed_date ? new Date(data.signed_date).toLocaleDateString() : "—"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Effective Date</span>
                <p className="font-medium text-gray-900">
                  {data.start_date ? new Date(data.start_date).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">End Date</span>
                <p className="font-medium text-gray-900">
                  {data.end_date ? new Date(data.end_date).toLocaleDateString() : "—"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Created At</span>
                <p className="font-medium text-gray-900">
                  {data.created_at ? new Date(data.created_at).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-green-200">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Signed Location
              </span>
              <p className="font-medium text-gray-900 text-sm">{data.signed_location ?? "—"}</p>
            </div>
          </div>
        </div>

        {/* Representative */}
        <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg border border-orange-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-600" />
            Representative (KOL)
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Name</span>
              <p className="font-medium text-gray-900">{data.representative_name ?? "—"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Position</span>
              <p className="font-medium text-gray-900">{data.representative_role ?? "—"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone
                </span>
                <p className="font-medium text-gray-900 text-sm">
                  {data.representative_phone ?? "—"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </span>
                <p className="font-medium text-gray-900 text-sm break-all">
                  {data.representative_email ?? "—"}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-orange-200">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> Bank Account
              </span>
              <p className="font-medium text-gray-900 text-sm">
                {data.representative_bank_account_number ?? "—"}
              </p>
              <p className="text-xs text-gray-600">{data.representative_bank_name ?? "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContractInformation;
