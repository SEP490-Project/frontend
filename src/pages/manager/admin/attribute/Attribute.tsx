import React, { useEffect, useState } from "react";
import { PaginationTable } from "@/components/global";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import CreateAttributeDialog from "./CreateAttributeDialog";
import { Trash } from "lucide-react";
import { DeleteModal } from "@/components/modal/DeleteModal";
import { useAppDispatch } from "@/libs/stores";
import { getAllVariantAttributesThunk } from "@/libs/stores/attributeManager/thunk";
import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

const Attribute: React.FC = () => {
  const dispatch = useAppDispatch();
  const attributes = useSelector((state: RootState) => state?.manageAttribute?.attributes?.data);
  const pagination = useSelector(
    (state: RootState) => state?.manageAttribute?.attributes?.pagination,
  );
  const loading = useSelector((state: RootState) => state?.manageAttribute?.loading);
  const error = useSelector((state: RootState) => state?.manageAttribute?.error);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllVariantAttributesThunk({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  const handleCreated = async () => {
    // Refresh list after create using Redux thunk
    await dispatch(getAllVariantAttributesThunk({ page: 1, limit, search: "" }));
    setSearch("");
    setPage(1);
  };

  const handleDeleted = async () => {
    console.log("Deleted");
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Attributes</h1>
      </div>

      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by ingredient or description"
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="ml-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button size={"sm"}>+ Create</Button>
              </DialogTrigger>
              <CreateAttributeDialog onCreated={handleCreated} />
            </Dialog>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="px-4">
              <TableRow className="border-b bg-gray-50">
                <TableHead>#</TableHead>
                <TableHead>Ingredient</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                (attributes || []).map((it, idx) => (
                  <TableRow key={it.id}>
                    <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                    <TableCell>{it.ingredient}</TableCell>
                    <TableCell>{it.description || "-"}</TableCell>
                    <TableCell>
                      {it.created_at ? new Date(it.created_at).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className=" hover:bg-red-100"
                            title="Delete"
                          >
                            <Trash className="text-red-600" />
                          </Button>
                        </DialogTrigger>
                        <DeleteModal name={it.ingredient} onDelete={handleDeleted} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <PaginationTable
            page={pagination?.page || 1}
            totalItems={pagination?.total || 0}
            pageSize={pagination?.limit || 10}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {error && <div className="text-sm text-red-600 mt-3">{error}</div>}
    </div>
  );
};

export default Attribute;
