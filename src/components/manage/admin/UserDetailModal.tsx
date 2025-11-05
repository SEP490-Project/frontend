import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { manageUser } from "@/libs/services/manageUser";
import type { ShippingAddress, UserData } from "@/libs/types/user";
import { useEffect, useState } from "react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaIdCard,
} from "react-icons/fa";
import { Loader2 } from "lucide-react";

const formatDate = (iso?: string | null) => {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "Customer",
  BRAND_PARTNER: "Brand Partner",
  SALES_STAFF: "Sales Staff",
  MARKETING_STAFF: "Marketing Staff",
  CONTENT_STAFF: "Content Staff",
  ADMIN: "Admin",
};

const ROLE_COLORS: Record<string, string> = {
  CUSTOMER: "bg-blue-100 text-blue-800 border-blue-200",
  BRAND_PARTNER: "bg-purple-100 text-purple-800 border-purple-200",
  SALES_STAFF: "bg-green-100 text-green-800 border-green-200",
  MARKETING_STAFF: "bg-orange-100 text-orange-800 border-orange-200",
  CONTENT_STAFF: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ADMIN: "bg-red-100 text-red-800 border-red-200",
};

const renderAddress = (addr: ShippingAddress) => (
  <div
    key={addr.id}
    className="rounded-lg border border-gray-200 p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
  >
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        <FaMapMarkerAlt className="text-gray-500 h-4 w-4" />
        <div className="font-medium text-gray-900">{addr.full_name}</div>
      </div>
      {addr.is_default && <Badge className="bg-green-100 text-green-800 text-xs">Default</Badge>}
    </div>
    {addr.company && <div className="text-sm text-gray-700 mb-1">{addr.company}</div>}
    <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
      <FaPhone className="h-3 w-3" />
      {addr.phone_number}
    </div>
    <div className="text-sm text-gray-600 leading-relaxed">
      {addr.street}
      {addr.address_line_2 && <span>, {addr.address_line_2}</span>}
      <br />
      {addr.city}
      {addr.state && <span>, {addr.state}</span>} {addr.postal_code}
      <br />
      {addr.country}
    </div>
  </div>
);

const UserDetailModal = ({ userId }: { userId: string | null }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) {
      setUserData(null);
      return;
    }
    let mounted = true;
    const fetchUserDetail = async (id: string) => {
      setLoading(true);
      try {
        const response = await manageUser.getUserDetailByAdmin(id);
        if (mounted) setUserData(response.data.data ?? null);
      } catch {
        if (mounted) setUserData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchUserDetail(userId);
    return () => {
      mounted = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">User Details</DialogTitle>
          <DialogDescription>Loading user information...</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Loading user details...</span>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
          <FaUser className="h-5 w-5 text-primary" />
          User Details
        </DialogTitle>
        <DialogDescription>
          Detailed information about {userData?.username || "the selected user"}
        </DialogDescription>
      </DialogHeader>

      {userData ? (
        <div className="space-y-6 mt-4">
          {/* Basic Information */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <FaIdCard className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">User ID</p>
                <p className="font-mono text-sm bg-white px-2 py-1 rounded border">{userId}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Username
                </p>
                <p className="text-sm font-medium text-gray-900">{userData.username}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Full Name
                </p>
                <p className="text-sm text-gray-900">{userData.full_name || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Role</p>
                <Badge
                  className={`mt-1 text-xs font-medium px-2 py-1 ${ROLE_COLORS[userData.role] || "bg-gray-100 text-gray-800 border-gray-200"}`}
                >
                  {ROLE_LABELS[userData.role] || userData.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <FaEnvelope className="h-4 w-4 text-green-600" />
              <h3 className="font-semibold text-green-900">Contact Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                <p className="text-sm text-gray-900">{userData.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</p>
                <p className="text-sm text-gray-900">{userData.phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Date of Birth
                </p>
                <p className="text-sm text-gray-900">{formatDate(userData.date_of_birth)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</p>
                <Badge
                  className={`mt-1 text-xs font-medium px-2 py-1 ${
                    userData.is_active
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}
                >
                  {userData.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Activity Information */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <FaCalendarAlt className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Activity Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Created At
                </p>
                <p className="text-sm text-gray-900">{formatDate(userData.created_at)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Updated At
                </p>
                <p className="text-sm text-gray-900">{formatDate(userData.updated_at)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Last Login
                </p>
                <p className="text-sm text-gray-900">{formatDate(userData.last_login)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Total Sessions
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {userData.number_of_sessions || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Addresses */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <FaMapMarkerAlt className="h-4 w-4 text-orange-600" />
              <h3 className="font-semibold text-orange-900">Shipping Addresses</h3>
            </div>
            <div className="space-y-3">
              {userData.shipping_address && userData.shipping_address.length > 0 ? (
                userData.shipping_address.map((addr) => renderAddress(addr))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <FaMapMarkerAlt className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No shipping addresses found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <FaUser className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">User information not available</p>
        </div>
      )}

      <DialogFooter className="flex justify-end mt-6 pt-4 border-t border-gray-200">
        <DialogClose asChild>
          <Button variant="outline" className="px-6">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default UserDetailModal;
