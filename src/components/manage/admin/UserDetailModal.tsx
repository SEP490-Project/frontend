import { Button } from "@/components/ui/button";
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

const formatDate = (iso?: string | null) => {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  } catch {
    return iso;
  }
};

const renderAddress = (addr: ShippingAddress) => (
  <div key={addr.id} className="rounded-md border p-3 bg-white shadow-sm">
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium">{addr.full_name}</div>
      <div className="text-xs text-gray-500">{addr.is_default ? "Default" : ""}</div>
    </div>
    <div className="text-sm text-gray-700 mt-1">{addr.company || ""}</div>
    <div className="text-sm text-gray-700 mt-1">{addr.phone_number}</div>
    <div className="text-sm text-gray-600 mt-2">
      {addr.street}
      {addr.address_line_2 ? ", " + addr.address_line_2 : ""}
    </div>
    <div className="text-sm text-gray-600">
      {addr.city}
      {addr.state ? ", " + addr.state : ""} {addr.postal_code}
    </div>
    <div className="text-sm text-gray-600">{addr.country}</div>
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
        setLoading(false);
      }
    };
    fetchUserDetail(userId);
    return () => {
      mounted = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">User Details</DialogTitle>
          <DialogDescription>View information about the selected user.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">User Details</DialogTitle>
        <DialogDescription>View information about the selected user.</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 mt-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">User ID</p>
            <p className="font-mono text-sm">{userId || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Username</p>
            <p className="text-sm">{userData?.username ?? "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Full name</p>
            <p className="text-sm">{userData?.full_name ?? "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="text-sm">{userData?.role ?? "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-sm">{userData?.email ?? "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="text-sm">{userData?.phone ?? "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Date of birth</p>
            <p className="text-sm">{formatDate(userData?.date_of_birth ?? null)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-sm">
              {userData ? (userData.is_active ? "Active" : "Inactive") : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Created at</p>
            <p className="text-sm">{formatDate(userData?.created_at ?? null)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Updated at</p>
            <p className="text-sm">{formatDate(userData?.updated_at ?? null)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Last login</p>
            <p className="text-sm">{formatDate(userData?.last_login ?? null)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sessions</p>
            <p className="text-sm">{userData?.number_of_sessions ?? 0}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Shipping addresses</p>
          <div className="space-y-2">
            {userData?.shipping_address && userData.shipping_address.length > 0 ? (
              userData.shipping_address.map((addr) => renderAddress(addr))
            ) : (
              <p className="text-sm text-gray-500">No shipping addresses</p>
            )}
          </div>
        </div>
      </div>

      <DialogFooter className="flex justify-end mt-4">
        <DialogClose asChild>
          <Button variant={"outline"}>Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default UserDetailModal;
