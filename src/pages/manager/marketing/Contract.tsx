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
import { FaEye, FaPenToSquare, FaPlus, FaFileContract } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PaginationTable from "@/components/global/PaginationTable";
import { useNavigate } from "react-router";
import { useContract } from "@/libs/hooks/useContract";
import { useAppDispatch } from "@/libs/stores";
import { contract } from "@/libs/stores/contractManager/thunk";
import type { ContractBase } from "@/libs/types/contract";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { DatePicker } from "@/components/date-picker";
import { formatDate } from "@/libs/helper/helper";
import { motion } from "framer-motion";

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
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { contracts, loading, pagination } = useContract();

  const toISOStringDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return "";
    return `${dateStr}T00:00:00Z`;
  };

  useEffect(() => {
    const params: any = {
      page,
      limit: PAGE_SIZE,
      sort_by: sortBy,
      sort_order: sortOrder,
      ...(debouncedSearchTerm && { keyword: debouncedSearchTerm }),
      ...(typeFilter !== "ALL" && { type: typeFilter }),
      ...(statusFilter !== "ALL" && { status: statusFilter }),
      ...(startDate && { start_date: toISOStringDate(startDate) }),
      ...(endDate && { end_date: toISOStringDate(endDate) }),
    };
    dispatch(contract(params));
  }, [
    dispatch,
    page,
    typeFilter,
    statusFilter,
    debouncedSearchTerm,
    startDate,
    endDate,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter, debouncedSearchTerm, startDate, endDate]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setStartDate("");
    setEndDate("");
    setSortBy("created_at");
    setSortOrder("desc");
  };

  const paginatedContracts = contracts;

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
            Contracts
          </motion.h1>
          <motion.p className="text-gray-600 mt-1" variants={itemVariants}>
            Manage, track the status, and store all your contracts and agreements
          </motion.p>
        </div>
        <motion.div variants={itemVariants}>
          <Button
            className="bg-primary hover:bg-[#f794a8] text-white flex items-center gap-2"
            onClick={() => navigate("/manage/marketing/contracts/create")}
          >
            <FaPlus className="h-4 w-4" />
            Create Contract
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
        <div
          className="
          grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-2 mb-1
          items-end
        "
        >
          <motion.div className="sm:col-span-2" variants={itemVariants}>
            <Input
              placeholder="Search by contract title or contract number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              autoComplete="off"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
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
          </motion.div>
          <motion.div className="flex gap-1" variants={itemVariants}>
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
            <Button
              variant="secondary"
              className="border-gray-300 px-3"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          </motion.div>
        </div>
        <div
          className="
          grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2
          items-end
        "
        >
          <motion.div variants={itemVariants}>
            <DatePicker
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
                if (endDate && date && endDate < date) setEndDate("");
              }}
              placeholder="Start Date"
              dateFormat="dd/MM/yyyy"
              className="w-full"
              maxDate={endDate || undefined}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              placeholder="End Date"
              dateFormat="dd/MM/yyyy"
              className="w-full"
              minDate={startDate || undefined}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Created At</SelectItem>
                <SelectItem value="signed_date">Signed Date</SelectItem>
                <SelectItem value="start_date">Start Date</SelectItem>
                <SelectItem value="end_date">End Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>
      </motion.div>

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
                  {paginatedContracts.map((contract: ContractBase, index) => (
                    <motion.tr
                      key={contract.id}
                      layout="position"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50"
                    >
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
                                onClick={() =>
                                  navigate(`/manage/marketing/contracts/${contract.id}`)
                                }
                              >
                                <FaEye className="text-blue-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View contract</p>
                            </TooltipContent>
                          </Tooltip>

                          {contract.status === "DRAFT" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-yellow-50"
                                  onClick={() =>
                                    navigate(`/manage/marketing/contracts/edit/${contract.id}`)
                                  }
                                >
                                  <FaPenToSquare className="text-yellow-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit contract</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
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
                {paginatedContracts.map((contract: ContractBase) => (
                  <motion.div
                    key={contract.id}
                    className="p-4 flex flex-col gap-3 bg-white"
                    variants={itemVariants}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{contract.contract_number}</div>
                        <Badge
                          className={`border text-xs font-medium px-2 py-1 ${CONTRACT_TYPE_COLORS[contract.type] || ""}`}
                        >
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                            onClick={() => navigate(`/manage/marketing/contracts/${contract.id}`)}
                          >
                            <FaEye className="text-blue-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View contract</p>
                        </TooltipContent>
                      </Tooltip>

                      {contract.status === "DRAFT" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-yellow-50"
                              onClick={() =>
                                navigate(`/manage/marketing/contracts/edit/${contract.id}`)
                              }
                            >
                              <FaPenToSquare className="text-yellow-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit contract</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* No results message */}
            {(!paginatedContracts || paginatedContracts.length === 0) && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FaFileContract className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || typeFilter !== "ALL" || statusFilter !== "ALL"
                    ? "No contracts match your current filters."
                    : "Get started by creating your first contract."}
                </p>
              </motion.div>
            )}

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: paginatedContracts.length * 0.05 + 0.2 }}
              >
                <PaginationTable
                  page={pagination.page}
                  totalItems={pagination.total}
                  pageSize={PAGE_SIZE}
                  onPageChange={setPage}
                />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContractPage;
