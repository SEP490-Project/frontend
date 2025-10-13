import React, { useEffect, useState } from "react";
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
import { FaEye, FaPenToSquare, FaFilter } from "react-icons/fa6";
import { Trash, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PaginationTable from "@/components/global/PaginationTable";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DeleteModal } from "@/components/modal/DeleteModal";
import { useNavigate } from "react-router";
import { useContract } from "@/libs/hooks/useContract";
import { useAppDispatch } from "@/libs/stores";
import { contract } from "@/libs/stores/contractManager/thunk";
import type { ContractBase } from "@/libs/types/contract";
import { useDebounce } from "@/libs/hooks/useDebounce";

const PAGE_SIZE = 10;

const CONTRACT_TYPE_LABELS: Record<string, string> = {
  ADVERTISING: "Advertising",
  AFFILIATE: "Affiliate",
  BRAND_AMBASSADOR: "Brand Ambassador",
  CO_PRODUCING: "Co-Producing",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
  TERMINATED: "bg-red-100 text-red-800 border-red-200",
};

const CONTRACT_TYPE_COLORS: Record<string, string> = {
  ADVERTISING: "bg-orange-100 text-orange-800 border-orange-200",
  AFFILIATE: "bg-blue-100 text-blue-800 border-blue-200",
  BRAND_AMBASSADOR: "bg-emerald-100 text-emerald-800 border-emerald-200",
  CO_PRODUCING: "bg-violet-100 text-violet-800 border-violet-200",
};

const ContractPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy] = useState("created_at");
  const [order] = useState<"asc" | "desc">("desc");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { contracts, loading, pagination } = useContract();

  // Fetch contracts when filters change
  useEffect(() => {
    const params: any = {
      page,
      limit: PAGE_SIZE,
      sort_by: sortBy,
      order,
    };
    if (typeFilter !== "ALL") params.type = typeFilter;
    if (statusFilter !== "ALL") params.status = statusFilter;
    if (debouncedSearchTerm) params.keyword = debouncedSearchTerm;
    dispatch(contract(params));
  }, [dispatch, page, typeFilter, statusFilter, debouncedSearchTerm, sortBy, order]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter, debouncedSearchTerm]);

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.startsWith("0001")) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
  };

  // Table data
  const paginatedContracts = contracts;

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Contracts</h1>
          <p className="text-gray-600 mt-1">
            Manage, track the status, and store all your contracts and agreements
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-[#f794a8] text-white"
          onClick={() => navigate("/manage/marketing/contracts/add")}
        >
          Add Contract
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by contract title or contract number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="min-w-[150px]">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="ADVERTISING">Advertising</SelectItem>
                <SelectItem value="AFFILIATE">Affiliate</SelectItem>
                <SelectItem value="BRAND_AMBASSADOR">Brand Ambassador</SelectItem>
                <SelectItem value="CO_PRODUCING">Co-Producing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[150px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="TERMINATED">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading contracts...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-gray-50">
                    <TableHead className="font-semibold">Contract #</TableHead>
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Signed Date</TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                    <TableHead className="font-semibold">Start - End</TableHead>
                    <TableHead className="font-semibold">Brand</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedContracts.map((contract: ContractBase) => (
                    <TableRow key={contract.id} className="border-b hover:bg-gray-50">
                      <TableCell className="py-4 font-semibold">
                        {contract.contract_number}
                      </TableCell>
                      <TableCell className="py-4">{contract.title}</TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={`border text-xs font-medium px-2 py-1 ${CONTRACT_TYPE_COLORS[contract.type] || ""}`}
                        >
                          {CONTRACT_TYPE_LABELS[contract.type] || contract.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={`border ${STATUS_COLORS[contract.status] || ""} text-xs font-medium px-2 py-1`}
                        >
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">{formatDate(contract.signed_date)}</TableCell>
                      <TableCell className="py-4">{formatDate(contract.created_at)}</TableCell>
                      <TableCell className="py-4">
                        <div>
                          <span>{formatDate(contract.start_date)}</span>
                          <span className="mx-1">-</span>
                          <span>{formatDate(contract.end_date)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">{contract.brand_name}</TableCell>
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
                              <p>View contract</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-yellow-50"
                              >
                                <FaPenToSquare className="text-yellow-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit contract</p>
                            </TooltipContent>
                          </Tooltip>
                          <Dialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-red-50"
                                  >
                                    <Trash className="text-red-600" />
                                  </Button>
                                </DialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete contract</p>
                              </TooltipContent>
                            </Tooltip>
                            <DeleteModal name={contract.contract_number} />
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y">
              {paginatedContracts.map((contract: ContractBase) => (
                <div key={contract.id} className="p-4 flex flex-col gap-3 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{contract.contract_number}</div>
                      <Badge className="border text-xs font-medium px-2 py-1">
                        {CONTRACT_TYPE_LABELS[contract.type] || contract.type}
                      </Badge>
                      <Badge
                        className={`ml-2 border ${STATUS_COLORS[contract.status] || ""} text-xs font-medium px-2 py-1`}
                      >
                        {contract.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Signed</div>
                      <div className="font-semibold text-lg">
                        {formatDate(contract.signed_date)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Created</div>
                      <div className="text-sm font-medium">{formatDate(contract.created_at)}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Brand:</span> {contract.brand_name}
                    </div>
                    <div>
                      <span className="font-medium">Title:</span> {contract.title}
                    </div>
                    <div>
                      <span className="font-medium">Start-End:</span>{" "}
                      {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
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
                        <p>View contract</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-yellow-50"
                        >
                          <FaPenToSquare className="text-yellow-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit contract</p>
                      </TooltipContent>
                    </Tooltip>
                    <Dialog>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-50"
                            >
                              <Trash className="text-red-600" />
                            </Button>
                          </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete contract</p>
                        </TooltipContent>
                      </Tooltip>
                      <DeleteModal name={contract.contract_number} />
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>

            {/* No results message */}
            {(!paginatedContracts || paginatedContracts.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No contracts found matching your criteria.
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <PaginationTable
                page={pagination.page}
                totalItems={pagination.total}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContractPage;
