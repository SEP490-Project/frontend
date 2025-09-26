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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FaEye, FaPenToSquare, FaBan, FaCheck, FaGlobe, FaFilter } from "react-icons/fa6";

interface Partner {
  id: string;
  name: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  logo_url: string;
  status: "ACTIVE" | "INACTIVE";
  total_contracts: number;
  created_at: string;
}

const mockPartners: Partner[] = [
  {
    id: "uuid-1",
    name: "Công ty ABC",
    contact_email: "abc@mail.com",
    contact_phone: "0123 456 789",
    website: "https://abc.com",
    logo_url: "https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=A",
    status: "ACTIVE",
    total_contracts: 12,
    created_at: "2025-01-15T12:00:00Z",
  },
  {
    id: "uuid-2",
    name: "Công ty XYZ",
    contact_email: "contact@xyz.com",
    contact_phone: "0987 654 321",
    website: "",
    logo_url: "https://via.placeholder.com/40x40/EF4444/FFFFFF?text=X",
    status: "INACTIVE",
    total_contracts: 3,
    created_at: "2025-02-10T12:00:00Z",
  },
  {
    id: "uuid-3",
    name: "Brand 123",
    contact_email: "hello@123.vn",
    contact_phone: "0909 123 456",
    website: "https://brand123.vn",
    logo_url: "https://via.placeholder.com/40x40/10B981/FFFFFF?text=B",
    status: "ACTIVE",
    total_contracts: 7,
    created_at: "2025-03-05T12:00:00Z",
  },
  {
    id: "uuid-4",
    name: "L'OREAL",
    contact_email: "contact@loreal.com",
    contact_phone: "0123456789",
    website: "https://loreal.com",
    logo_url: "https://via.placeholder.com/40x40/FF6B6B/FFFFFF?text=L",
    status: "ACTIVE",
    total_contracts: 15,
    created_at: "2025-01-15T12:00:00Z",
  },
  {
    id: "uuid-5",
    name: "Chanel",
    contact_email: "contact@chanel.com",
    contact_phone: "0123456788",
    website: "https://chanel.com",
    logo_url: "https://via.placeholder.com/40x40/000000/FFFFFF?text=C",
    status: "ACTIVE",
    total_contracts: 8,
    created_at: "2025-02-10T12:00:00Z",
  },
];

const PAGE_SIZE = 5;

const PartnerPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Filter partners based on search term and status
  const filteredPartners = useMemo(() => {
    return mockPartners.filter((partner) => {
      const matchesSearch =
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.contact_email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || partner.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredPartners.length / PAGE_SIZE);
  const paginatedPartners = filteredPartners.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const startIndex = (page - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(page * PAGE_SIZE, filteredPartners.length);
  const totalItems = filteredPartners.length;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter]);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>,
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => handlePageChange(i)} isActive={page === i}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Partners</h1>
        <Button className="bg-primary hover:bg-pink-500 text-white">Add Partner</Button>
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
              placeholder="Search by name or email..."
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

      <div className="bg-white rounded-lg shadow">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-gray-50">
                <TableHead className="font-semibold">Logo</TableHead>
                <TableHead className="font-semibold">Partner</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Phone Number</TableHead>
                <TableHead className="font-semibold">Website</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-center">Contract</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPartners.map((partner, index) => (
                <TableRow
                  key={partner.id}
                  className={`border-b hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                  }`}
                >
                  {/* Logo */}
                  <TableCell className="py-4">
                    <div className="flex justify-center">
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        className="w-10 h-10 rounded border-2 border-gray-200 object-cover"
                      />
                    </div>
                  </TableCell>

                  {/* Partner Name */}
                  <TableCell className="py-4">
                    <span className="font-medium text-gray-900">{partner.name}</span>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{partner.contact_email}</span>
                    </div>
                  </TableCell>

                  {/* Phone */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{partner.contact_phone}</span>
                    </div>
                  </TableCell>

                  {/* Website */}
                  <TableCell className="py-4">
                    {partner.website ? (
                      <div className="flex items-center gap-2">
                        <FaGlobe className="text-blue-500" />
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Visit
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-4">
                    <Badge
                      className={
                        partner.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                          : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
                      }
                    >
                      {partner.status}
                    </Badge>
                  </TableCell>

                  {/* Contracts */}
                  <TableCell className="py-4 text-center">
                    <span className="font-semibold text-lg text-gray-900">
                      {partner.total_contracts}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-4">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                        title="View"
                      >
                        <FaEye className="text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-yellow-50"
                        title="Edit"
                      >
                        <FaPenToSquare className="text-yellow-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 transition-colors ${
                          partner.status === "ACTIVE" ? "hover:bg-red-50" : "hover:bg-green-50"
                        }`}
                        title={partner.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      >
                        {partner.status === "ACTIVE" ? (
                          <FaBan className="text-red-600" />
                        ) : (
                          <FaCheck className="text-green-600" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden divide-y">
          {paginatedPartners.map((partner) => (
            <div key={partner.id} className="p-4 flex flex-col gap-3 bg-white">
              <div className="flex items-center gap-3">
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="w-12 h-12 rounded border-2 border-gray-200 object-cover"
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
                  <div className="text-sm text-gray-500">Contracts</div>
                  <div className="font-semibold text-lg">{partner.total_contracts}</div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>{partner.contact_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{partner.contact_phone}</span>
                </div>
                {partner.website && (
                  <div className="flex items-center gap-2">
                    <FaGlobe className="text-blue-500" />
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-1 pt-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <FaEye className="text-blue-600" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <FaPenToSquare className="text-yellow-600" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {partner.status === "ACTIVE" ? (
                    <FaBan className="text-red-600" />
                  ) : (
                    <FaCheck className="text-green-600" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredPartners.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No partners found matching your criteria.
          </div>
        )}

        {/* Pagination */}
        {filteredPartners.length > 0 && (
          <div className="flex justify-between items-center p-4 border-t bg-gray-50">
            <div className="text-sm text-gray-500">
              Showing {startIndex}-{endIndex} of {totalItems} partners
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(page + 1)}
                    className={
                      page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerPage;
