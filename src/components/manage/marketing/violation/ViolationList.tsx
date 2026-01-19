import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, AlertTriangle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { manageViolation } from "@/libs/services/manageViolation";
import type {
  ViolationListItem,
  ViolationType,
  ViolationProofStatus,
} from "@/libs/types/violation";
import {
  VIOLATION_PROOF_STATUS_LABELS,
  VIOLATION_TYPE_STYLE,
  PROOF_STATUS_STYLE,
} from "@/libs/types/violation";
import { useDebounce } from "@/libs/hooks/useDebounce";

interface ViolationListProps {
  onSelectViolation?: (violation: ViolationListItem) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

export default function ViolationList({ onSelectViolation }: ViolationListProps) {
  const [violations, setViolations] = useState<ViolationListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });

  // Filters
  const [contractId, setContractId] = useState("");
  const [violationType, setViolationType] = useState<ViolationType | "ALL">("ALL");
  const [reviewStatus, setReviewStatus] = useState<ViolationProofStatus | "ALL">("ALL");

  const debouncedContractId = useDebounce(contractId, 500);

  const fetchViolations = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params: any = {
          page,
          limit: pagination.limit,
          sort_by: "created_at",
          sort_order: "desc",
        };

        if (debouncedContractId) params.contract_id = debouncedContractId;
        if (violationType !== "ALL") params.violation_type = violationType;
        if (reviewStatus !== "ALL") params.review_status = reviewStatus;

        const response = await manageViolation.list(params);
        setViolations(response.data.data);
        setPagination(response.data.pagination);
      } catch (error: any) {
        toast.error("Failed to load violations");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [debouncedContractId, violationType, reviewStatus, pagination.limit],
  );

  useEffect(() => {
    fetchViolations(pagination.page);
  }, [pagination.page, debouncedContractId, violationType, reviewStatus, fetchViolations]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const calculateTotalDue = (violation: ViolationListItem) => {
    return violation.type === "BRAND"
      ? violation.penalty_amount
      : violation.refund_amount + violation.penalty_amount;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
        <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Filter by Contract ID..."
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchViolations(1)}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select
            value={violationType}
            onValueChange={(val: ViolationType | "ALL") => setViolationType(val)}
          >
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="BRAND">Brand</SelectItem>
              <SelectItem value="KOL">KOL</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={reviewStatus}
            onValueChange={(val: ViolationProofStatus | "ALL") => setReviewStatus(val)}
          >
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="Proof Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SUBMITTED">Submitted</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Proof Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center flex-col items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                    <p className="text-gray-500 mt-2">Loading violations...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : violations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="text-gray-500 mt-2">No violations found</p>
                </TableCell>
              </TableRow>
            ) : (
              violations.map((violation) => (
                <TableRow
                  key={violation.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onSelectViolation?.(violation)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">
                        {violation.contract_number || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {violation.brand_name || "Unknown Brand"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={VIOLATION_TYPE_STYLE(violation.type)}>{violation.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700">System</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-red-600">
                      {formatCurrency(calculateTotalDue(violation))}
                    </span>
                  </TableCell>
                  <TableCell>
                    {violation.proof_status ? (
                      <Badge className={PROOF_STATUS_STYLE(violation.proof_status)}>
                        {VIOLATION_PROOF_STATUS_LABELS[violation.proof_status]}
                      </Badge>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {formatDate(violation.created_at)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectViolation?.(violation);
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{" "}
            violations
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.has_prev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Page {pagination.page} of {pagination.total_pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.has_next}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
