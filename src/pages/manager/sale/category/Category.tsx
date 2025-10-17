import { AddCategoryForm } from "@/components/manage/sale/category/AddCategoryForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { FaFilter } from "react-icons/fa6";

const mockCategories = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Electronics",
    description: "Devices and gadgets like phones, laptops, and accessories",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Home & Kitchen",
    description: "Appliances and furniture for household use",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Clothing",
    description: "Apparel for men, women, and kids",
  },

  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "Phones",
    description: "Smartphones and mobile accessories",
    parent_category: {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Electronics",
      description: "Devices and gadgets like phones, laptops, and accessories",
    },
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    name: "Laptops",
    description: "Personal and gaming laptops",
    parent_category: {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Electronics",
      description: "Devices and gadgets like phones, laptops, and accessories",
    },
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    name: "Accessories",
    description: "Chargers, cables, and earphones",
    parent_category: {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Electronics",
      description: "Devices and gadgets like phones, laptops, and accessories",
    },
  },

  {
    id: "77777777-7777-7777-7777-777777777777",
    name: "Furniture",
    description: "Home and office furniture",
    parent_category: {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Home & Kitchen",
      description: "Appliances and furniture for household use",
    },
  },
  {
    id: "88888888-8888-8888-8888-888888888888",
    name: "Appliances",
    description: "Kitchen and home appliances",
    parent_category: {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Home & Kitchen",
      description: "Appliances and furniture for household use",
    },
  },
  {
    id: "99999999-9999-9999-9999-999999999999",
    name: "Decor",
    description: "Home decor and decorative lighting",
    parent_category: {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Home & Kitchen",
      description: "Appliances and furniture for household use",
    },
  },

  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    name: "Men",
    description: "Men’s clothing and accessories",
    parent_category: {
      id: "33333333-3333-3333-3333-333333333333",
      name: "Clothing",
      description: "Apparel for men, women, and kids",
    },
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    name: "Women",
    description: "Women’s fashion and accessories",
    parent_category: {
      id: "33333333-3333-3333-3333-333333333333",
      name: "Clothing",
      description: "Apparel for men, women, and kids",
    },
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    name: "Kids",
    description: "Clothing for children and babies",
    parent_category: {
      id: "33333333-3333-3333-3333-333333333333",
      name: "Clothing",
      description: "Apparel for men, women, and kids",
    },
  },
];

const Category = () => {
  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Category</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-[#f794a8] text-white">Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>Fill in the form below to add a new category.</DialogDescription>
            </DialogHeader>
            <AddCategoryForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by name or description..."
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="min-w-[150px]">
            <Select
              value={""}
              // onValueChange={() => {
              //   setParams({ ...params, offset: 0 });
              // }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Category</SelectItem>
                <SelectItem value="Perfumes">Perfumes</SelectItem>
                <SelectItem value="Skincare">Skincare</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="px-4">
              <TableRow className="border-b bg-gray-50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Parent Category</TableHead>
                <TableHead className="font-semibold">Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCategories.map((category) => (
                <TableRow key={category.id} className="hover:bg-gray-100">
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {category.description}{" "}
                      <Button size={"icon"} variant={"ghost"}>
                        <Eye className="w-4 h-4 text-gray-500 " />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{category.parent_category?.name || "N/A"}</TableCell>
                  <TableCell>2023-10-01</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Category;
