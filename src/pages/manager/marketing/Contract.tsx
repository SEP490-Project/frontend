import React, { useState, useMemo } from "react";
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
import { Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PaginationTable from "@/components/global/PaginationTable";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DeleteModal } from "@/components/modal/DeleteModal";
import { useNavigate } from "react-router";

interface Contract {
  id: string;
  contract_number: string;
  type: "ADVERTISING" | "AFFILIATE" | "BRAND_AMBASSADOR" | "CO_PRODUCING";
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "TERMINATED";
  signed_date: string;
  signed_location: string;
  start_date: string;
  end_date: string;
  brand_id: string;
  representative_name: string;
  representative_role: string;
  representative_phone: string;
  representative_email: string;
  representative_tax_number?: string;
  representative_bank_name?: string;
  representative_bank_account_number?: string;
  representative_bank_account_holder?: string;
  currency: string;
  created_at: string;
}

const mockContracts: Contract[] = [
  {
    id: "c1",
    contract_number: "HD-2025-001",
    type: "ADVERTISING",
    status: "ACTIVE",
    signed_date: "2025-01-10",
    signed_location: "Hà Nội",
    start_date: "2025-01-15",
    end_date: "2025-06-15",
    brand_id: "uuid-1",
    representative_name: "Nguyễn Văn A",
    representative_role: "Giám đốc",
    representative_phone: "0901234567",
    representative_email: "a@brand.com",
    currency: "VND",
    created_at: "2025-01-10T09:00:00Z",
  },
  {
    id: "c2",
    contract_number: "HD-2025-002",
    type: "AFFILIATE",
    status: "DRAFT",
    signed_date: "2025-02-01",
    signed_location: "TP.HCM",
    start_date: "2025-02-10",
    end_date: "2025-08-10",
    brand_id: "uuid-2",
    representative_name: "Trần Thị B",
    representative_role: "Trưởng phòng",
    representative_phone: "0912345678",
    representative_email: "b@brand.com",
    currency: "VND",
    created_at: "2025-02-01T10:00:00Z",
  },
  {
    id: "c3",
    contract_number: "HD-2025-003",
    type: "BRAND_AMBASSADOR",
    status: "COMPLETED",
    signed_date: "2025-03-05",
    signed_location: "Đà Nẵng",
    start_date: "2025-03-10",
    end_date: "2025-09-10",
    brand_id: "uuid-3",
    representative_name: "Lê Văn C",
    representative_role: "CEO",
    representative_phone: "0923456789",
    representative_email: "c@brand.com",
    currency: "VND",
    created_at: "2025-03-05T11:00:00Z",
  },
  {
    id: "c4",
    contract_number: "HD-2025-004",
    type: "CO_PRODUCING",
    status: "TERMINATED",
    signed_date: "2025-04-12",
    signed_location: "Hải Phòng",
    start_date: "2025-04-15",
    end_date: "2025-10-15",
    brand_id: "uuid-4",
    representative_name: "Phạm Thị D",
    representative_role: "Manager",
    representative_phone: "0934567890",
    representative_email: "d@brand.com",
    currency: "VND",
    created_at: "2025-04-12T12:00:00Z",
  },
];

const PAGE_SIZE = 5;

const CONTRACT_TYPE_LABELS: Record<Contract["type"], string> = {
  ADVERTISING: "Advertising",
  AFFILIATE: "Affiliate",
  BRAND_AMBASSADOR: "Brand Ambassador",
  CO_PRODUCING: "Co-Producing",
};

const STATUS_COLORS: Record<Contract["status"], string> = {
  DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
  TERMINATED: "bg-red-100 text-red-800 border-red-200",
};

const CONTRACT_TYPE_COLORS: Record<Contract["type"], string> = {
  ADVERTISING: "bg-orange-100 text-orange-800 border-orange-200",
  AFFILIATE: "bg-blue-100 text-blue-800 border-blue-200",
  BRAND_AMBASSADOR: "bg-emerald-100 text-emerald-800 border-emerald-200",
  CO_PRODUCING: "bg-violet-100 text-violet-800 border-violet-200",
};

const ContractPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const navigate = useNavigate();

  const filteredContracts = useMemo(() => {
    return mockContracts.filter((contract) => {
      const matchesSearch =
        contract.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.representative_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "ALL" || contract.type === typeFilter;
      const matchesStatus = statusFilter === "ALL" || contract.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredContracts.length / PAGE_SIZE);
  const paginatedContracts = filteredContracts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, typeFilter, statusFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Contracts</h1>
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
              placeholder="Search by contract number or representative..."
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
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-gray-50">
                <TableHead className="font-semibold">Contract #</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Signed Date</TableHead>
                <TableHead className="font-semibold">Start - End</TableHead>
                <TableHead className="font-semibold">Representative</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedContracts.map((contract) => (
                <TableRow key={contract.id} className="border-b hover:bg-gray-50">
                  <TableCell className="py-4 font-semibold">{contract.contract_number}</TableCell>
                  <TableCell className="py-4">
                    <Badge
                      className={`border text-xs font-medium px-2 py-1 ${CONTRACT_TYPE_COLORS[contract.type]}`}
                    >
                      {CONTRACT_TYPE_LABELS[contract.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      className={`border ${STATUS_COLORS[contract.status]} text-xs font-medium px-2 py-1`}
                    >
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">{contract.signed_date}</TableCell>
                  <TableCell className="py-4">
                    <div>
                      <span>{contract.start_date}</span>
                      <span className="mx-1">-</span>
                      <span>{contract.end_date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div>
                      <div className="font-medium">{contract.representative_name}</div>
                      <div className="text-xs text-gray-500">{contract.representative_role}</div>
                    </div>
                  </TableCell>
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
          {paginatedContracts.map((contract) => (
            <div key={contract.id} className="p-4 flex flex-col gap-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{contract.contract_number}</div>
                  <Badge className="border text-xs font-medium px-2 py-1">
                    {CONTRACT_TYPE_LABELS[contract.type]}
                  </Badge>
                  <Badge
                    className={`ml-2 border ${STATUS_COLORS[contract.status]} text-xs font-medium px-2 py-1`}
                  >
                    {contract.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Signed</div>
                  <div className="font-semibold text-lg">{contract.signed_date}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Representative:</span>{" "}
                  {contract.representative_name} ({contract.representative_role})
                </div>
                <div>
                  <span className="font-medium">Start-End:</span> {contract.start_date} -{" "}
                  {contract.end_date}
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
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-yellow-50">
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
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
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
        {filteredContracts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No contracts found matching your criteria.
          </div>
        )}

        {/* Pagination */}
        {filteredContracts.length > 0 && (
          <PaginationTable
            page={page}
            totalItems={filteredContracts.length}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default ContractPage;
