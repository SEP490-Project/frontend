import { PaginationTable } from "@/components/global";
import UserDetailModal from "@/components/manage/admin/UserDetailModal";
import { StatusModal } from "@/components/modal/StatusModal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch } from "@/libs/stores";
import {
  activateBrandThunk,
  getAllUsersThunk,
  updateUserStatusThunk,
} from "@/libs/stores/userManager/thunk";
import type { UserParams } from "@/libs/types/user";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

import { FaFilter } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const UserPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useSelector((state: any) => state?.manageUser?.users?.data);
  const pagination = useSelector((state: any) => state?.manageUser?.users?.pagination);
  const loading = useSelector((state: any) => state?.manageUser?.loading);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState<boolean>(false);

  const [params, setParams] = useState<UserParams>({
    page: 1,
    limit: 7,
  });

  const onUpdateUserStatus = async (
    is_active: boolean,
    userId: string,
    userRole: string,
    is_brand_account: boolean,
  ) => {
    if (userRole === "BRAND_PARTNER" && is_brand_account === true && is_active === false) {
      const activateResult = await dispatch(activateBrandThunk(userId));
      if (activateBrandThunk.fulfilled.match(activateResult)) {
        dispatch(getAllUsersThunk(params));
        toast.success("Brand activated successfully");
      } else {
        toast.error("Failed to activate brand");
      }
    } else {
      const result = await dispatch(updateUserStatusThunk({ is_active: !is_active, userId }));
      if (updateUserStatusThunk.fulfilled.match(result)) {
        dispatch(getAllUsersThunk(params));
        toast.success("User status updated successfully");
      } else {
        toast.error("Failed to update user status");
      }
    }
  };

  useEffect(() => {
    dispatch(getAllUsersThunk(params));
  }, [dispatch, params]);

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Users</h1>
      </div>

      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by username or email"
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="min-w-[150px]">
            <Select
              value={params.role || ""}
              onValueChange={(value) => {
                setParams({ ...params, role: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="BRAND_PARTNER">Brand</SelectItem>
                <SelectItem value="SALES_STAFF">Sale staff</SelectItem>
                <SelectItem value="MARKETING_STAFF">Marketing staff</SelectItem>
                <SelectItem value="CONTENT_STAFF">Content staff</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[150px]">
            <Select
              value={params.is_active == null ? undefined : String(params.is_active)}
              onValueChange={(value) => {
                setParams({ ...params, is_active: value === "true" });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="px-4">
              <TableRow className="border-b bg-gray-50">
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users &&
                users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role.toLowerCase()}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger>
                          <Switch checked={user.is_active} disabled={user.role === "ADMIN"} />
                        </DialogTrigger>
                        <StatusModal
                          name={user.username}
                          status={user.is_active ? "Inactive" : "Active"}
                          onConfirm={() => {
                            onUpdateUserStatus(
                              user.is_active,
                              user.id,
                              user.role,
                              user.is_brand_account,
                            );
                          }}
                        />
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        onClick={() => {
                          setIsUserDetailModalOpen(true);
                          setSelectedUserId(user.id);
                        }}
                      >
                        <FaEye className="text-primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {pagination && (
            <PaginationTable
              page={pagination.page}
              totalItems={pagination.total}
              pageSize={pagination.limit}
              onPageChange={(page) => setParams({ ...params, page })}
            />
          )}
        </div>
        <Dialog open={isUserDetailModalOpen} onOpenChange={setIsUserDetailModalOpen}>
          <UserDetailModal userId={selectedUserId} />
        </Dialog>
      </div>
    </div>
  );
};

export default UserPage;
