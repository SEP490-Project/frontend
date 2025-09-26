import React, { useState } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Partner {
  id: string;
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  logo_url: string;
  status: "ACTIVE" | "INACTIVE";
  total_contracts: number;
  active_contracts: number;
  created_at: string;
}

const mockPartners: Partner[] = [
  {
    id: "uuid-1",
    name: "L'OREAL",
    description: "Global beauty and cosmetics brand",
    contact_email: "contact@loreal.com",
    contact_phone: "0123456789",
    website: "https://loreal.com",
    logo_url: "https://via.placeholder.com/40x40/FF6B6B/FFFFFF?text=L",
    status: "ACTIVE",
    total_contracts: 3,
    active_contracts: 2,
    created_at: "2025-01-15T12:00:00Z",
  },
  {
    id: "uuid-2",
    name: "Chanel",
    description: "Luxury fashion and beauty brand",
    contact_email: "contact@chanel.com",
    contact_phone: "0123456788",
    website: "https://chanel.com",
    logo_url: "https://via.placeholder.com/40x40/000000/FFFFFF?text=C",
    status: "ACTIVE",
    total_contracts: 5,
    active_contracts: 1,
    created_at: "2025-02-10T12:00:00Z",
  },
  {
    id: "uuid-3",
    name: "Dove",
    description: "Personal care and beauty brand",
    contact_email: "contact@dove.com",
    contact_phone: "0123456787",
    website: "https://dove.com",
    logo_url: "https://via.placeholder.com/40x40/4ECDC4/FFFFFF?text=D",
    status: "INACTIVE",
    total_contracts: 1,
    active_contracts: 0,
    created_at: "2025-03-05T12:00:00Z",
  },
  {
    id: "uuid-4",
    name: "Nike",
    description: "Global sports brand",
    contact_email: "contact@nike.com",
    contact_phone: "0123456786",
    website: "https://nike.com",
    logo_url: "https://via.placeholder.com/40x40/FF8C00/FFFFFF?text=N",
    status: "ACTIVE",
    total_contracts: 7,
    active_contracts: 3,
    created_at: "2025-04-01T12:00:00Z",
  },
  {
    id: "uuid-5",
    name: "Adidas",
    description: "Sports and lifestyle brand",
    contact_email: "contact@adidas.com",
    contact_phone: "0123456785",
    website: "https://adidas.com",
    logo_url: "https://via.placeholder.com/40x40/0066CC/FFFFFF?text=A",
    status: "ACTIVE",
    total_contracts: 4,
    active_contracts: 2,
    created_at: "2025-04-15T12:00:00Z",
  },
  {
    id: "uuid-6",
    name: "Puma",
    description: "Sports brand",
    contact_email: "contact@puma.com",
    contact_phone: "0123456784",
    website: "https://puma.com",
    logo_url: "https://via.placeholder.com/40x40/333333/FFFFFF?text=P",
    status: "INACTIVE",
    total_contracts: 2,
    active_contracts: 0,
    created_at: "2025-05-01T12:00:00Z",
  },
];

const PAGE_SIZE = 5;

const PartnerPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(mockPartners.length / PAGE_SIZE);
  const paginatedPartners = mockPartners.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const startIndex = (page - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(page * PAGE_SIZE, mockPartners.length);
  const totalItems = mockPartners.length;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

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
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Partners</h1>
        <Button className="bg-pink-500 hover:bg-pink-600 text-white">Add Partner</Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="font-semibold">Partner</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Total Contracts</TableHead>
              <TableHead className="font-semibold">Active Contracts</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPartners.map((partner, index) => (
              <TableRow key={partner.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <div className="font-medium">{partner.name}</div>
                      <div className="text-sm text-gray-500">{partner.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={partner.status === "ACTIVE" ? "default" : "secondary"}
                    className={
                      partner.status === "ACTIVE"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {partner.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-medium">{partner.total_contracts}</TableCell>
                <TableCell className="text-center font-medium">
                  {partner.active_contracts}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-pink-500 hover:text-pink-600 hover:bg-pink-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center p-4 border-t">
          <div className="text-sm text-gray-500">
            Showing {startIndex.toString().padStart(2, "0")}-{endIndex.toString().padStart(2, "0")}{" "}
            of {totalItems}
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
      </div>
    </div>
  );
};

export default PartnerPage;
