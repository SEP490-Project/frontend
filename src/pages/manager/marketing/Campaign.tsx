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
import { FaEye, FaPenToSquare, FaFilter, FaPlus } from "react-icons/fa6";
import { Loader2, Target } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PaginationTable from "@/components/global/PaginationTable";
import { useNavigate } from "react-router";
import { useCampaign } from "@/libs/hooks/useCampaign";
import { useAppDispatch } from "@/libs/stores";
import { campaign } from "@/libs/stores/campaignManager/thunk";
import type { CampaignData } from "@/libs/types/campaign";
import { useDebounce } from "@/libs/hooks/useDebounce";

const PAGE_SIZE = 10;

const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  ADVERTISING: "Advertising",
  AFFILIATE: "Affiliate",
  BRAND_AMBASSADOR: "Brand Ambassador",
  CO_PRODUCING: "Co-Producing",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  INACTIVE: "bg-red-100 text-red-800 border-red-200",
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
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { campaigns, loading, pagination } = useCampaign();

  // Fetch campaigns when filters change
  useEffect(() => {
    const params = {
      page,
      limit: PAGE_SIZE,
      ...(debouncedSearchTerm && { keywords: debouncedSearchTerm }),
      ...(statusFilter !== "ALL" && { status: statusFilter }),
      ...(typeFilter !== "ALL" && { type: typeFilter }),
    };
    dispatch(campaign(params));
  }, [dispatch, page, typeFilter, statusFilter, debouncedSearchTerm]);

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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage and track your marketing campaigns</p>
        </div>
        <Button
          className="bg-primary hover:bg-[#f794a8] text-white flex items-center gap-2"
          onClick={() => navigate("/manage/marketing/campaigns/create")}
        >
          <FaPlus className="h-4 w-4" />
          Create Campaign
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
              placeholder="Search by campaign name, description, or contract number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="min-w-[150px]">
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
                    <TableHead className="font-semibold">Budget</TableHead>
                    <TableHead className="font-semibold">Contract</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign: CampaignData) => (
                    <TableRow key={campaign.id} className="border-b hover:bg-gray-50">
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
                        <div className="text-sm font-medium">
                          {formatCurrency(campaign.budget_projected)}
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
                                onClick={() =>
                                  navigate(`/manage/marketing/campaigns/${campaign.id}`)
                                }
                              >
                                <FaEye className="text-blue-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View campaign</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-yellow-50"
                                onClick={() =>
                                  navigate(`/manage/marketing/campaigns/${campaign.id}/edit`)
                                }
                              >
                                <FaPenToSquare className="text-yellow-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit campaign</p>
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
            <div className="lg:hidden divide-y">
              {campaigns.map((campaign: CampaignData) => (
                <div key={campaign.id} className="p-4 flex flex-col gap-3 bg-white">
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
                      <span className="font-medium">Budget:</span>{" "}
                      {formatCurrency(campaign.budget_projected)}
                    </div>
                    <div>
                      <span className="font-medium">Contract:</span> {campaign.contract_number}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{campaign.contract_title}</div>
                  </div>

                  <div className="flex gap-1 pt-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                          onClick={() => navigate(`/manage/marketing/campaigns/${campaign.id}`)}
                        >
                          <FaEye className="text-blue-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View campaign</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-yellow-50"
                          onClick={() =>
                            navigate(`/manage/marketing/campaigns/${campaign.id}/edit`)
                          }
                        >
                          <FaPenToSquare className="text-yellow-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit campaign</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>

            {/* No results message */}
            {(!campaigns || campaigns.length === 0) && (
              <div className="text-center py-16">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || typeFilter !== "ALL" || statusFilter !== "ALL"
                    ? "No campaigns match your current filters."
                    : "Get started by creating your first marketing campaign."}
                </p>
                <Button
                  className="bg-primary hover:bg-[#f794a8] text-white"
                  onClick={() => navigate("/manage/marketing/campaigns/create")}
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
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

export default CampaignPage;
