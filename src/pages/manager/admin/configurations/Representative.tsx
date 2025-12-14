import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { getRepresentativeConfig } from "@/libs/stores/configManager/thunk";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FaUser,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaFileContract,
  FaRotate,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";

const Representative = () => {
  const dispatch = useAppDispatch();

  const { loading, representativeConfig } = useSelector((state: RootState) => state.manageConfig);

  useEffect(() => {
    dispatch(getRepresentativeConfig());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(getRepresentativeConfig());
  };

  const ConfigItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | null | undefined;
  }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-pink-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base font-semibold text-gray-900 truncate">
          {value || "Not configured"}
        </p>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-fit p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
            Representative Information
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Company representative details for contracts and legal documents
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <FaRotate className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
              <FaUser className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Representative Details</CardTitle>
              <CardDescription>Personal, contact, and banking information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <LoadingSkeleton />
          ) : representativeConfig ? (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Personal Information
                  </Badge>
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <ConfigItem
                    icon={FaUser}
                    label="Full Name"
                    value={representativeConfig.representative_name}
                  />
                  <ConfigItem
                    icon={FaBuilding}
                    label="Role / Position"
                    value={representativeConfig.representative_role}
                  />
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Contact Information
                  </Badge>
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <ConfigItem
                    icon={FaEnvelope}
                    label="Email Address"
                    value={representativeConfig.representative_email}
                  />
                  <ConfigItem
                    icon={FaPhone}
                    label="Phone Number"
                    value={representativeConfig.representative_phone}
                  />
                </div>
              </div>

              <Separator />

              {/* Banking Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    Banking Information
                  </Badge>
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <ConfigItem
                    icon={FaCreditCard}
                    label="Bank Name"
                    value={representativeConfig.representative_bank_name}
                  />
                  <ConfigItem
                    icon={FaCreditCard}
                    label="Account Number"
                    value={representativeConfig.representative_bank_account_number}
                  />
                  <ConfigItem
                    icon={FaUser}
                    label="Account Holder"
                    value={representativeConfig.representative_bank_account_holder}
                  />
                  <ConfigItem
                    icon={FaFileContract}
                    label="Tax Number"
                    value={representativeConfig.representative_tax_number}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FaUser className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No configuration found</p>
              <p className="text-sm">Representative information has not been configured yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Representative;
