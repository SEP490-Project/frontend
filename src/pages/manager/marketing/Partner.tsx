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
import { FaEye, FaPenToSquare, FaGlobe, FaFilter } from "react-icons/fa6";
import { Switch } from "@/components/ui/switch";
import { Trash } from "lucide-react";
import { DeleteModal } from "@/components/modal/DeleteModal";
import { StatusModal } from "@/components/modal/StatusModal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PaginationTable from "@/components/global/PaginationTable";

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
  isActive: boolean; // Thêm field này để tương thích với Switch
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
    isActive: true,
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
    isActive: false,
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
    isActive: true,
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
    isActive: true,
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
    status: "INACTIVE",
    isActive: false,
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Partners</h1>
        <Button className="bg-primary hover:bg-[#f794a8] text-white">Add Partner</Button>
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

      <div className="bg-white rounded-lg overflow-hidden shadow">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-gray-50">
                <TableHead className="font-semibold">Partner</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Website</TableHead>
                <TableHead className="font-semibold">Contracts</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
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
                  {/* Partner Name + Logo */}
                  <TableCell className="py-4 max-w-xs">
                    <div className="flex items-center">
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        className="w-12 h-12 rounded border-2 border-gray-200 object-cover mr-4"
                      />
                      <span className="font-medium text-gray-900 block text-nowrap overflow-hidden text-ellipsis">
                        {partner.name}
                      </span>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {partner.contact_email}
                    </div>
                  </TableCell>

                  {/* Phone */}
                  <TableCell className="py-4">
                    <div className="text-sm text-gray-600">{partner.contact_phone}</div>
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

                  {/* Contracts */}
                  <TableCell className="py-4">
                    <span className="font-semibold text-lg text-gray-900">
                      {partner.total_contracts}
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
                          <p>View partner</p>
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
                          <p>Edit partner</p>
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
                            <p>Delete partner</p>
                          </TooltipContent>
                        </Tooltip>
                        <DeleteModal name={partner.name} />
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
                  <span className="font-medium">Email:</span>
                  <span>{partner.contact_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Phone:</span>
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50">
                      <FaEye className="text-blue-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View partner</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-yellow-50">
                      <FaPenToSquare className="text-yellow-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit partner</p>
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
                      <p>Delete partner</p>
                    </TooltipContent>
                  </Tooltip>
                  <DeleteModal name={partner.name} />
                </Dialog>
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
          <PaginationTable
            page={page}
            totalItems={filteredPartners.length}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
            entityName="partners"
          />
        )}
      </div>
    </div>
  );
};

export default PartnerPage;
