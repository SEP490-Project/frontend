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
import { motion } from "framer-motion";

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
        setViolations(response.data.data || []);
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

  const handleResetFilters = () => {
    setContractId("");
    setViolationType("ALL");
    setReviewStatus("ALL");
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
            Violations
          </motion.h1>
          <motion.p className="text-gray-600 mt-1" variants={itemVariants}>
            Monitor and manage contract violations and review penalty processes
          </motion.p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-white rounded-lg shadow mb-4 p-4"
        variants={filterVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2 items-end">
          <motion.div className="sm:col-span-2 relative" variants={itemVariants}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by Contract ID..."
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              className="pl-9 bg-white"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Select
              value={violationType}
              onValueChange={(val: ViolationType | "ALL") => setViolationType(val)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="BRAND">Brand</SelectItem>
                <SelectItem value="KOL">KOL</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div className="flex gap-1" variants={itemVariants}>
            <Select
              value={reviewStatus}
              onValueChange={(val: ViolationProofStatus | "ALL") => setReviewStatus(val)}
            >
              <SelectTrigger className="bg-white">
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
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchViolations(1)}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
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
            <span className="ml-2">Loading violations...</span>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-gray-50">
                  <TableHead className="font-semibold">Contract</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Reported By</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Proof Status</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(violations || []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No violations found
                        </h3>
                        <p className="text-gray-500">
                          {contractId || violationType !== "ALL" || reviewStatus !== "ALL"
                            ? "No violations match your current filters."
                            : "No violations have been reported yet."}
                        </p>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                ) : (
                  (violations || []).map((violation, index) => (
                    <motion.tr
                      key={violation.id}
                      layout="position"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => onSelectViolation?.(violation)}
                    >
                      <TableCell className="py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {violation.contract_number || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {violation.brand_name || "Unknown Brand"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={VIOLATION_TYPE_STYLE(violation.type)}>
                          {violation.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm text-gray-700">System</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-medium text-red-600">
                          {formatCurrency(calculateTotalDue(violation))}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        {violation.proof_status ? (
                          <Badge className={PROOF_STATUS_STYLE(violation.proof_status)}>
                            {VIOLATION_PROOF_STATUS_LABELS[violation.proof_status]}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm text-gray-500">
                          {formatDate(violation.created_at)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectViolation?.(violation);
                          }}
                          className="hover:bg-blue-50 text-blue-600"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <motion.div
                className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (violations || []).length * 0.05 + 0.2 }}
              >
                <p className="text-sm text-gray-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} violations
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.has_prev}
                    className="bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm font-medium px-3">
                    Page {pagination.page} of {pagination.total_pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.has_next}
                    className="bg-white"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
