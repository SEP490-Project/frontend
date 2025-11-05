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
import { FaEye, FaPlus, FaListCheck } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PaginationTable from "@/components/global/PaginationTable";
import { useNavigate } from "react-router";
import { useCampaign } from "@/libs/hooks/useCampaign";
import { useAppDispatch } from "@/libs/stores";
import { getCampaignsByBrand } from "@/libs/stores/campaignManager/thunk";
import type { CampaignData } from "@/libs/types/campaign";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { DatePicker } from "@/components/date-picker";
import { formatDate } from "@/libs/helper/helper";
import { motion } from "framer-motion";

const PAGE_SIZE = 10;

const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  RUNNING: "Running",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
  DRAFT: "Draft",
  PAUSED: "Paused",
};

const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  ADVERTISING: "Advertising",
  AFFILIATE: "Affiliate",
  BRAND_AMBASSADOR: "Brand Ambassador",
  CO_PRODUCING: "Co-Producing",
};

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  CANCELED: "bg-red-100 text-red-800 border-red-200",
  RUNNING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
  PAUSED: "bg-orange-100 text-orange-800 border-orange-200",
};

const CAMPAIGN_TYPE_COLORS: Record<string, string> = {
  ADVERTISING: "bg-orange-100 text-orange-800 border-orange-200",
  AFFILIATE: "bg-blue-100 text-blue-800 border-blue-200",
  BRAND_AMBASSADOR: "bg-emerald-100 text-emerald-800 border-emerald-200",
  CO_PRODUCING: "bg-violet-100 text-violet-800 border-violet-200",
};

const CampaignPage: React.FC = () => {
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
  const { campaigns, loading, pagination } = useCampaign();

  // Fetch campaigns when filters change
  useEffect(() => {
    const params: Record<string, any> = {
      page,
      limit: PAGE_SIZE,
      ...(debouncedSearchTerm && { keyword: debouncedSearchTerm }),
      ...(statusFilter !== "ALL" && { status: statusFilter }),
      ...(typeFilter !== "ALL" && { type: typeFilter }),
      ...(startDate && { start_date: toISOStringDate(startDate) }),
      ...(endDate && { end_date: toISOStringDate(endDate) }),
      sort_by: sortBy,
      sort_order: sortOrder,
    };

    dispatch(getCampaignsByBrand(params as any));
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

  const toISOStringDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return "";
    return `${dateStr}T00:00:00Z`;
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
            Campaigns
          </motion.h1>
          <motion.p className="text-gray-600 mt-1" variants={itemVariants}>
            Manage and track your marketing campaigns
          </motion.p>
        </div>
        <motion.div variants={itemVariants}>
          <Button
            className="bg-primary hover:bg-[#f794a8] text-white flex items-center gap-2"
            onClick={() => navigate("/manage/brand/campaigns/create")}
          >
            <FaPlus className="h-4 w-4" />
            Create Campaign
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
              placeholder="Search by campaign name or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              autoComplete="off"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Campaign Type" />
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
                <SelectItem value="RUNNING">Running</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELED">Canceled</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PAUSED">Paused</SelectItem>
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
                <SelectItem value="start_date">Start Date</SelectItem>
                <SelectItem value="end_date">End Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
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
            <span className="ml-2">Loading campaigns...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-gray-50">
                    <TableHead className="font-semibold">Campaign</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Duration</TableHead>
                    <TableHead className="font-semibold">Contract</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign: CampaignData, index) => (
                    <motion.tr
                      key={campaign.id}
                      layout="position"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <TableCell className="py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{campaign.name}</div>
                          {campaign.description && (
                            <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                              {campaign.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={`border text-xs font-medium px-2 py-1 ${CAMPAIGN_TYPE_COLORS[campaign.type] || ""}`}
                        >
                          {CAMPAIGN_TYPE_LABELS[campaign.type] || campaign.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={`border ${STATUS_COLORS[campaign.status] || ""} text-xs font-medium px-2 py-1`}
                        >
                          {CAMPAIGN_STATUS_LABELS[campaign.status] || campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm">
                          <div>{formatDate(campaign.start_date)}</div>
                          <div className="text-gray-500">to {formatDate(campaign.end_date)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm">
                          <div className="font-medium">{campaign.contract_number}</div>
                          <div className="text-gray-500 max-w-xs truncate">
                            {campaign.contract_title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-sm">
                        {formatDate(campaign.created_at)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                                onClick={() => navigate(`/manage/brand/campaigns/${campaign.id}`)}
                              >
                                <FaEye className="text-blue-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View campaign</p>
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
                {campaigns.map((campaign: CampaignData) => (
                  <motion.div
                    key={campaign.id}
                    className="p-4 flex flex-col gap-3 bg-white"
                    variants={itemVariants}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{campaign.name}</div>
                        <div className="flex gap-2 mt-2">
                          <Badge
                            className={`border text-xs font-medium px-2 py-1 ${CAMPAIGN_TYPE_COLORS[campaign.type] || ""}`}
                          >
                            {CAMPAIGN_TYPE_LABELS[campaign.type] || campaign.type}
                          </Badge>
                          <Badge
                            className={`border ${STATUS_COLORS[campaign.status] || ""} text-xs font-medium px-2 py-1`}
                          >
                            {CAMPAIGN_STATUS_LABELS[campaign.status] || campaign.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Created</div>
                        <div className="text-sm font-medium">{formatDate(campaign.created_at)}</div>
                      </div>
                    </div>

                    {campaign.description && (
                      <div className="text-sm text-gray-600">{campaign.description}</div>
                    )}

                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Duration:</span>{" "}
                        {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                      </div>
                      <div>
                        <span className="font-medium">Contract:</span> {campaign.contract_number}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {campaign.contract_title}
                      </div>
                    </div>

                    <div className="flex gap-1 pt-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                            onClick={() => navigate(`/manage/brand/campaigns/${campaign.id}`)}
                          >
                            <FaEye className="text-blue-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View campaign</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* No results message */}
            {(!campaigns || campaigns.length === 0) && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FaListCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || typeFilter !== "ALL" || statusFilter !== "ALL"
                    ? "No campaigns match your current filters."
                    : "Get started by creating your first marketing campaign."}
                </p>
              </motion.div>
            )}

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: campaigns.length * 0.05 + 0.2 }}
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

export default CampaignPage;
