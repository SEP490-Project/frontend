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
import { FaEye, FaPenToSquare, FaGlobe, FaFilter } from "react-icons/fa6";
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

// Chuyển interface Partner thành type từ API
interface Partner extends Brands {
  isActive: boolean;
}

const PAGE_SIZE = 10;

// Helper function to check if a value is empty (null, undefined, or empty string)
const isEmpty = (value: string | null | undefined): boolean => {
  return !value || value.trim() === "";
};

const BrandPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const navigate = useNavigate();

  // Use debounce hook instead of manual implementation
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const dispatch = useAppDispatch();
  const { brands, loading, pagination } = useBrand();

  // Fetch data when filters change
  useEffect(() => {
    const params = {
      page,
      limit: PAGE_SIZE,
      ...(debouncedSearchTerm && { keywords: debouncedSearchTerm }),
      ...(statusFilter !== "ALL" && { status: statusFilter }),
    };

    dispatch(brand(params));
  }, [dispatch, page, debouncedSearchTerm, statusFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  // Convert API brands to partners format
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

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Brands</h1>
          <p className="text-gray-600 mt-1">
            Manage all your brand assets, identity guidelines, and usage documentation
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-[#f794a8] text-white"
          onClick={() => navigate("/manage/marketing/brands/add")}
        >
          Add Brand
        </Button>
      </div>

      {/* Filters - Always visible */}
      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="min-w-[150px]">
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
          </div>
        </div>
      </div>

      {/* Table container with loading state */}
      <div className="bg-white rounded-lg overflow-hidden shadow">
        {loading ? (
          // Loading state for table only
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
                    <TableHead className="font-semibold">Brand</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                    <TableHead className="font-semibold">Website</TableHead>
                    <TableHead className="font-semibold">Total Contracts</TableHead>
                    <TableHead className="font-semibold">Active Contracts</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner, index) => (
                    <TableRow
                      key={partner.id}
                      className={`border-b hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      {/* Partner Name + Logo */}
                      <TableCell className="py-4 max-w-xs">
                        <div className="flex items-center">
                          <img
                            src={
                              !isEmpty(partner.logo_url)
                                ? partner.logo_url!
                                : `https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=${partner.name.charAt(0)}`
                            }
                            alt={partner.name}
                            className="w-12 h-12 rounded border-2 border-gray-200 object-cover mr-4"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=${partner.name.charAt(0)}`;
                            }}
                          />
                          <span className="font-medium text-gray-900 block text-nowrap overflow-hidden text-ellipsis">
                            {partner.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {!isEmpty(partner.contact_email) ? (
                            partner.contact_email
                          ) : (
                            <span className="text-gray-400 italic">No email</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Phone */}
                      <TableCell className="py-4">
                        <div className="text-sm text-gray-600">
                          {!isEmpty(partner.contact_phone) ? (
                            partner.contact_phone
                          ) : (
                            <span className="text-gray-400 italic">No phone</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Website */}
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

                      {/* Total Contracts */}
                      <TableCell className="py-4">
                        <span className="font-semibold text-lg text-gray-900">
                          {partner.number_of_contracts || 0}
                        </span>
                      </TableCell>

                      {/* Active Contracts */}
                      <TableCell className="py-4">
                        <span className="font-semibold text-lg text-green-600">
                          {partner.number_of_active_contracts || 0}
                        </span>
                      </TableCell>

                      {/* Status Switch */}
                      <TableCell className="py-4">
                        <Dialog>
                          <DialogTrigger>
                            <Switch checked={partner.isActive} />
                          </DialogTrigger>
                          <StatusModal
                            name={partner.name}
                            status={partner.isActive ? "Inactive" : "Active"}
                            onConfirm={() => {
                              // TODO: Implement status change logic here
                              // Example: dispatch an action to update status
                              // dispatch(updateBrandStatus(partner.id, partner.isActive ? "INACTIVE" : "ACTIVE"));
                            }}
                          />
                        </Dialog>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-4">
                        <div className="flex gap-1">
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
                                onClick={() =>
                                  navigate(`/manage/marketing/brands/edit/${partner.id}`)
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y">
              {partners.map((partner) => (
                <div key={partner.id} className="p-4 flex flex-col gap-3 bg-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        !isEmpty(partner.logo_url)
                          ? partner.logo_url!
                          : `https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=${partner.name.charAt(0)}`
                      }
                      alt={partner.name}
                      className="w-12 h-12 rounded border-2 border-gray-200 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=${partner.name.charAt(0)}`;
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
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50">
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
                </div>
              ))}
            </div>

            {/* No results message */}
            {partners.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No brands found matching your criteria.
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <PaginationTable
                page={pagination.page}
                totalItems={pagination.total}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrandPage;
