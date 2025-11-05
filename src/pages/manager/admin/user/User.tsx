import { PaginationTable } from "@/components/global";
import UserDetailModal from "@/components/manage/admin/UserDetailModal";
import { StatusModal } from "@/components/modal/StatusModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppDispatch } from "@/libs/stores";
import {
  activateBrandThunk,
  getAllUsersThunk,
  updateUserStatusThunk,
} from "@/libs/stores/userManager/thunk";
import type { UserParams } from "@/libs/types/user";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { formatDate } from "@/libs/helper/helper";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { motion } from "framer-motion";

const PAGE_SIZE = 10;

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

const UserPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useSelector((state: any) => state?.manageUser?.users?.data);
  const pagination = useSelector((state: any) => state?.manageUser?.users?.pagination);
  const loading = useSelector((state: any) => state?.manageUser?.loading);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [params, setParams] = useState<UserParams>({
    page: 1,
    limit: PAGE_SIZE,
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

  const handleResetFilters = () => {
    setSearchTerm("");
    setParams({ page: 1, limit: PAGE_SIZE });
  };

  useEffect(() => {
    const searchParams = {
      ...params,
      ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    };
    dispatch(getAllUsersThunk(searchParams));
  }, [dispatch, params, debouncedSearchTerm]);

  useEffect(() => {
    setParams({ ...params, page: 1 });
  }, [debouncedSearchTerm]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const filterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-6"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <motion.h1 className="text-xl sm:text-2xl font-semibold" variants={itemVariants}>
            Users Management
          </motion.h1>
          <motion.p className="text-gray-600 mt-1" variants={itemVariants}>
            Manage and monitor user accounts and permissions
          </motion.p>
        </div>
        {/* <motion.div className="flex items-center gap-2" variants={itemVariants}>
          <FaUsers className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            {pagination ? `${pagination.total} users` : ''}
          </span>
        </motion.div> */}
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-white rounded-lg shadow mb-4 p-4"
        variants={filterVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-2 items-end">
          <motion.div className="sm:col-span-2" variants={itemVariants}>
            <Input
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              autoComplete="off"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Select
              value={params.role || "ALL"}
              onValueChange={(value) => {
                setParams({ ...params, role: value === "ALL" ? undefined : value, page: 1 });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="BRAND_PARTNER">Brand Partner</SelectItem>
                <SelectItem value="SALES_STAFF">Sales Staff</SelectItem>
                <SelectItem value="MARKETING_STAFF">Marketing Staff</SelectItem>
                <SelectItem value="CONTENT_STAFF">Content Staff</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div className="flex gap-1" variants={itemVariants}>
            <Select
              value={params.is_active === undefined ? "ALL" : String(params.is_active)}
              onValueChange={(value) => {
                setParams({
                  ...params,
                  is_active: value === "ALL" ? undefined : value === "true",
                  page: 1,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="secondary"
              className="border-gray-300 px-3"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="bg-white rounded-lg overflow-hidden shadow">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading users...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-gray-50">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Created Date</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users &&
                    users.map((user: any, index: number) => (
                      <motion.tr
                        key={user.id}
                        layout="position"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-gray-50"
                      >
                        <TableCell className="py-4">
                          <div>
                            <div className="font-semibold text-gray-900">{user.username}</div>
                            {user.full_name && (
                              <div className="text-sm text-gray-500">{user.full_name}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="text-sm">{user.email}</div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            className={`border text-xs font-medium px-2 py-1 ${ROLE_COLORS[user.role] || ""}`}
                          >
                            {ROLE_LABELS[user.role] || user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <Dialog>
                            <DialogTrigger>
                              <div className="flex items-center gap-2">
                                <Switch checked={user.is_active} disabled={user.role === "ADMIN"} />
                                <span className="text-sm text-gray-600">
                                  {user.is_active ? "Active" : "Inactive"}
                                </span>
                              </div>
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
                        <TableCell className="py-4 text-sm">
                          {formatDate(user.created_at)}
                        </TableCell>
                        <TableCell className="py-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                                onClick={() => {
                                  setIsUserDetailModalOpen(true);
                                  setSelectedUserId(user.id);
                                }}
                              >
                                <FaEye className="text-blue-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View user details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </motion.tr>
                    ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card List */}
            <div className="lg:hidden divide-y">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.05 },
                  },
                }}
              >
                {users &&
                  users.map((user: any) => (
                    <motion.div
                      key={user.id}
                      className="p-4 flex flex-col gap-3 bg-white"
                      variants={itemVariants}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{user.username}</div>
                          {user.full_name && (
                            <div className="text-sm text-gray-500">{user.full_name}</div>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Badge
                              className={`border text-xs font-medium px-2 py-1 ${ROLE_COLORS[user.role] || ""}`}
                            >
                              {ROLE_LABELS[user.role] || user.role}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Joined</div>
                          <div className="text-sm font-medium">{formatDate(user.created_at)}</div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">{user.email}</div>

                      <div className="flex items-center justify-between pt-2">
                        <Dialog>
                          <DialogTrigger>
                            <div className="flex items-center gap-2">
                              <Switch checked={user.is_active} disabled={user.role === "ADMIN"} />
                              <span className="text-sm text-gray-600">
                                {user.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
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

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50"
                              onClick={() => {
                                setIsUserDetailModalOpen(true);
                                setSelectedUserId(user.id);
                              }}
                            >
                              <FaEye className="text-blue-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View user details</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </div>

            {/* No results message */}
            {(!users || users.length === 0) && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FaListCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || params.role || params.is_active !== undefined
                    ? "No users match your current filters."
                    : "No users have been created yet."}
                </p>
              </motion.div>
            )}

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: users?.length * 0.05 + 0.2 }}
              >
                <PaginationTable
                  page={pagination.page}
                  totalItems={pagination.total}
                  pageSize={PAGE_SIZE}
                  onPageChange={(page) => setParams({ ...params, page })}
                />
              </motion.div>
            )}
          </>
        )}

        <Dialog open={isUserDetailModalOpen} onOpenChange={setIsUserDetailModalOpen}>
          <UserDetailModal userId={selectedUserId} />
        </Dialog>
      </div>
    </div>
  );
};

export default UserPage;
