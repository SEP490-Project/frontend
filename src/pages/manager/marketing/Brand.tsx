import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaEye, FaPenToSquare, FaGlobe, FaPlus, FaHandshake } from "react-icons/fa6";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { StatusModal } from "@/components/modal/StatusModal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PaginationTable from "@/components/global/PaginationTable";
import { useBrand } from "@/libs/hooks/useBrand";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { useAppDispatch } from "@/libs/stores";
import { brand } from "@/libs/stores/brandManager/thunk";
import type { Brands } from "@/libs/types/brand";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

interface Partner extends Brands {
  isActive: boolean;
}

const PAGE_SIZE = 10;

const isEmpty = (value: string | null | undefined): boolean => {
  return !value || value.trim() === "";
};

const BrandPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { brands, loading, pagination } = useBrand();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const params: Record<string, any> = {
      page,
      limit: PAGE_SIZE,
      ...(debouncedSearchTerm && { keywords: debouncedSearchTerm }),
      ...(statusFilter !== "ALL" && { status: statusFilter }),
      sort_by: sortBy,
      sort_order: sortOrder,
    };

    dispatch(brand(params as any));
  }, [dispatch, page, debouncedSearchTerm, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, statusFilter, sortBy, sortOrder]);

  const partners: Partner[] = useMemo(() => {
    return brands.map((brandItem) => ({
      ...brandItem,
      isActive: brandItem.status === "ACTIVE",
    }));
  }, [brands]);

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.total_pages) {
      setPage(newPage);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setSortBy("created_at");
    setSortOrder("desc");
  };

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
            Brands
          </motion.h1>
          <motion.p className="text-gray-600 mt-1" variants={itemVariants}>
            Manage all your brand assets, identity guidelines, and usage documentation
          </motion.p>
        </div>
        <motion.div variants={itemVariants}>
          <Button
            className="bg-primary hover:bg-[#f794a8] text-white flex items-center gap-2"
            onClick={() => navigate("/manage/marketing/brands/create")}
          >
            <FaPlus className="h-4 w-4" />
            Create Brand
          </Button>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-white rounded-lg shadow mb-4 p-4"
        variants={filterVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col sm:flex-row sm:items-end gap-2">
          <motion.div className="flex-1" variants={itemVariants}>
            <Input
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </motion.div>

          <motion.div className="sm:w-36" variants={itemVariants}>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div className="sm:w-36" variants={itemVariants}>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Created At</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="number_of_contracts">Total Contracts</SelectItem>
                <SelectItem value="number_of_active_contracts">Active Contracts</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div className="sm:w-36" variants={itemVariants}>
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "asc" | "desc")}>
              <SelectTrigger>
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div className="sm:w-24" variants={itemVariants}>
            <Button
              variant="secondary"
              className="border-gray-300 w-full"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden shadow">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading brands...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-gray-50">
                    <TableHead
                      className="font-semibold cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Brand
                    </TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                    <TableHead className="font-semibold">Website</TableHead>
                    <TableHead
                      className="font-semibold cursor-pointer"
                      onClick={() => handleSort("number_of_contracts")}
                    >
                      Total Contracts
                    </TableHead>
                    <TableHead
                      className="font-semibold cursor-pointer"
                      onClick={() => handleSort("number_of_active_contracts")}
                    >
                      Active Contracts
                    </TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner, index) => (
                    <motion.tr
                      key={partner.id}
                      layout="position"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell className="py-4 max-w-xs">
                        <div className="flex items-center">
                          <img
                            src={
                              !isEmpty(partner.logo_url)
                                ? partner.logo_url!
                                : "https://placehold.co/400"
                            }
                            alt={partner.name}
                            className="w-12 h-12 rounded border-2 border-gray-200 object-cover mr-4"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://placehold.co/400";
                            }}
                          />
                          <span className="font-medium text-gray-900 block text-nowrap overflow-hidden text-ellipsis">
                            {partner.name}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 text-sm text-gray-600 max-w-xs truncate">
                        {!isEmpty(partner.contact_email) ? (
                          partner.contact_email
                        ) : (
                          <span className="text-gray-400 italic">No email</span>
                        )}
                      </TableCell>

                      <TableCell className="py-4 text-sm text-gray-600">
                        {!isEmpty(partner.contact_phone) ? (
                          partner.contact_phone
                        ) : (
                          <span className="text-gray-400 italic">No phone</span>
                        )}
                      </TableCell>

                      <TableCell className="py-4">
                        {!isEmpty(partner.website) ? (
                          <div className="flex items-center gap-2">
                            <FaGlobe className="text-blue-500" />
                            <a
                              href={
                                partner.website!.startsWith("http")
                                  ? partner.website!
                                  : `https://${partner.website}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Visit
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No website</span>
                        )}
                      </TableCell>

                      <TableCell className="py-4">
                        <span className="font-semibold text-lg text-gray-900">
                          {partner.number_of_contracts || 0}
                        </span>
                      </TableCell>

                      <TableCell className="py-4">
                        <span className="font-semibold text-lg text-green-600">
                          {partner.number_of_active_contracts || 0}
                        </span>
                      </TableCell>

                      <TableCell className="py-4">
                        <Dialog>
                          <DialogTrigger>
                            <Switch checked={partner.isActive} />
                          </DialogTrigger>
                          <StatusModal
                            name={partner.name}
                            status={partner.isActive ? "Inactive" : "Active"}
                            onConfirm={() => {
                              console.log("Status changed");
                            }}
                          />
                        </Dialog>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="flex gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                                onClick={() => navigate(`/manage/marketing/brands/${partner.id}`)}
                              >
                                <FaEye className="text-blue-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View brand</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-yellow-50"
                                onClick={() =>
                                  navigate(`/manage/marketing/brands/${partner.id}/edit`)
                                }
                              >
                                <FaPenToSquare className="text-yellow-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit brand</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.05 },
                  },
                }}
              >
                {partners.map((partner) => (
                  <motion.div
                    key={partner.id}
                    className="p-4 flex flex-col gap-3 bg-white"
                    variants={itemVariants}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          !isEmpty(partner.logo_url)
                            ? partner.logo_url!
                            : "https://placehold.co/400"
                        }
                        alt={partner.name}
                        className="w-12 h-12 rounded border-2 border-gray-200 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://placehold.co/400";
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{partner.name}</div>
                        <Badge
                          className={
                            partner.status === "ACTIVE"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {partner.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total Contracts</div>
                        <div className="font-semibold text-lg">
                          {partner.number_of_contracts || 0}
                        </div>
                        <div className="text-sm text-gray-500">Active</div>
                        <div className="font-semibold text-green-600">
                          {partner.number_of_active_contracts || 0}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Email:</span>
                        <span>
                          {!isEmpty(partner.contact_email) ? (
                            partner.contact_email
                          ) : (
                            <span className="text-gray-400 italic">No email</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Phone:</span>
                        <span>
                          {!isEmpty(partner.contact_phone) ? (
                            partner.contact_phone
                          ) : (
                            <span className="text-gray-400 italic">No phone</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Website:</span>
                        {!isEmpty(partner.website) ? (
                          <div className="flex items-center gap-1">
                            <FaGlobe className="text-blue-500" />
                            <a
                              href={
                                partner.website!.startsWith("http")
                                  ? partner.website!
                                  : `https://${partner.website}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Website
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No website</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1 pt-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                          >
                            <FaEye className="text-blue-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View brand</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-yellow-50"
                            onClick={() => navigate(`/manage/marketing/brands/edit/${partner.id}`)}
                          >
                            <FaPenToSquare className="text-yellow-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit brand</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* No results */}
            {partners.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FaHandshake className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No brands found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "ALL"
                    ? "No brands match your current filters."
                    : "Get started by creating your first brand."}
                </p>
              </motion.div>
            )}

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: partners.length * 0.05 + 0.2 }}
              >
                <PaginationTable
                  page={pagination.page}
                  totalItems={pagination.total}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrandPage;
