export interface Product {
  id: string;
  brand: string;
  category: string;
  image: string;
  name: string;
  description: string;
  price: number;
  current_stock: number;
  type: string;
  isActive?: boolean;
}

export const mockProducts: Product[] = [
  {
    id: "c35cba9e-0d8f-4452-8875-15d48fcb77a6",
    brand: "Chanel",
    category: "Perfumes",
    image:
      "https://cdn.shopify.com/s/files/1/0069/4471/8937/products/Chanel-Coco-Mademoiselle-Intense-EDP-W-50ml-2_de2881cf-4ddb-4a2d-a65a-12b75ff4ec7f_1200x1200.jpg?v=1573190789",
    name: "Chanel Coco Mademoiselle Intense Eau De Perfume For Women - 50ml",
    description: "Description for product 0",
    price: 75.24,
    current_stock: 191,
    type: "STANDARD",
    isActive: false,
  },
  {
    id: "5146cfcc-2c3e-4136-ab18-8d02d93c7164",
    brand: "Dior",
    category: "Perfumes",
    image:
      "https://cdn.shopify.com/s/files/1/0069/4471/8937/products/Chanel-Coco-Mademoiselle-Intense-EDP-W-50ml-2_de2881cf-4ddb-4a2d-a65a-12b75ff4ec7f_1200x1200.jpg?v=1573190789",
    name: "Product 1",
    description: "Description for product 1",
    price: 352.68,
    current_stock: 95,
    type: "STANDARD",
    isActive: true,
  },
  {
    id: "54ea5e3f-e920-458c-9d78-406d52060cd3",
    brand: "Dior",
    category: "Perfumes",
    image:
      "https://cdn.shopify.com/s/files/1/0069/4471/8937/products/Chanel-Coco-Mademoiselle-Intense-EDP-W-50ml-2_de2881cf-4ddb-4a2d-a65a-12b75ff4ec7f_1200x1200.jpg?v=1573190789",
    name: "Product 2",
    description: "Description for product 2",
    price: 212.64,
    current_stock: 34,
    type: "STANDARD",
    isActive: true,
  },
  {
    id: "e90bc501-a48d-4b35-9ec4-7073acff7115",
    brand: "Annessa",
    category: "Perfumes",
    image:
      "https://cdn.shopify.com/s/files/1/0069/4471/8937/products/Chanel-Coco-Mademoiselle-Intense-EDP-W-50ml-2_de2881cf-4ddb-4a2d-a65a-12b75ff4ec7f_1200x1200.jpg?v=1573190789",
    name: "Product 3",
    description: "Description for product 3",
    price: 268.09,
    current_stock: 44,
    type: "LIMITED",
    isActive: false,
  },
  {
    id: "b652b159-2980-451d-b643-b5b601d011e4",
    brand: "Annessa",
    category: "Perfumes",
    image:
      "https://cdn.shopify.com/s/files/1/0069/4471/8937/products/Chanel-Coco-Mademoiselle-Intense-EDP-W-50ml-2_de2881cf-4ddb-4a2d-a65a-12b75ff4ec7f_1200x1200.jpg?v=1573190789",
    name: "Product 4",
    description: "Description for product 4",
    price: 489.38,
    current_stock: 54,
    type: "STANDARD",
    isActive: true,
  },
  {
    id: "b652b159-2980-451d-b643-b5b601d011e5",
    brand: "Annessa",
    category: "Perfumes",
    image:
      "https://cdn.shopify.com/s/files/1/0069/4471/8937/products/Chanel-Coco-Mademoiselle-Intense-EDP-W-50ml-2_de2881cf-4ddb-4a2d-a65a-12b75ff4ec7f_1200x1200.jpg?v=1573190789",
    name: "Product 5",
    description: "Description for product 4",
    price: 489.38,
    current_stock: 54,
    type: "STANDARD",
    isActive: true,
  },
];

export interface Task {
  id: string;
  milestone_id: string;
  name: string;
  description: {
    details: string;
    proposal: string;
  };
  deadline: string;
  type: "INTERNAL" | "BRAND";
  status: "TODO" | "IN_PROGRESS" | "SUBMITTED" | "REVISION_REQUESTED" | "APPROVED";
  assigned_to: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export const mockTasks: Task[] = [
  {
    id: "3b1f8a62-72ce-4db0-8c74-2aaf37d0a91f",
    milestone_id: "9c47f6c2-48a2-4e25-97b0-1a23a7b2d5a6",
    name: "Add Product 1",
    description: {
      details: "Research customer needs, competitors, and trends for the new product.",
      proposal: "This must be a attached file",
    },
    deadline: "2025-10-2",
    type: "INTERNAL",
    status: "IN_PROGRESS",
    assigned_to: "b12e2a1f-223c-48d4-99cd-8f1b2b3f7a90",
    created_at: "2025-09-25T09:30:00Z",
    updated_at: "2025-09-28T11:20:00Z",
    deleted_at: null,
  },
  {
    id: "e5c8f2a1-4427-4b21-902f-3f42a2a61d33",
    milestone_id: "9c47f6c2-48a2-4e25-97b0-1a23a7b2d5a6",
    name: "Branding Strategy",
    description: {
      details: "Define brand positioning, messaging, and key visuals for the product.",
      proposal: "This must be a attached file",
    },
    deadline: "2025-10-20",
    type: "BRAND",
    status: "TODO",
    assigned_to: "c72d9b41-1a2e-4d33-88cd-9f3b2b8a1902",
    created_at: "2025-09-26T14:00:00Z",
    updated_at: "2025-09-26T14:00:00Z",
    deleted_at: null,
  },
  {
    id: "f7e23c11-b3a8-47f1-9f33-bf83c0e3e18a",
    milestone_id: "d82e4a10-9c2e-4634-91f1-ff7c25e109d9",
    name: "Add Product 2",
    description: {
      details: "Prepare initial product design sketches and prototypes.",
      proposal: "This must be a attached file",
    },
    deadline: "2025-10-4",
    type: "INTERNAL",
    status: "SUBMITTED",
    assigned_to: "d81c13e2-4b8d-4a3b-8c10-3d8f9fce78de",
    created_at: "2025-09-27T08:45:00Z",
    updated_at: "2025-09-29T10:15:00Z",
    deleted_at: null,
  },
  {
    id: "2f0d9c3b-62f7-4c90-8d1f-2f8b9d7f4c11",
    milestone_id: "d82e4a10-9c2e-4634-91f1-ff7c25e109d9",
    name: "Packaging Design",
    description: {
      details: "Create packaging concepts aligned with brand guidelines.",
      proposal: "This must be a attached file",
    },
    deadline: "2025-10-5",
    type: "BRAND",
    status: "REVISION_REQUESTED",
    assigned_to: "b12e2a1f-223c-48d4-99cd-8f1b2b3f7a90",
    created_at: "2025-09-28T16:10:00Z",
    updated_at: "2025-09-29T09:00:00Z",
    deleted_at: null,
  },
  {
    id: "af3c8d1e-11a9-4d41-9c8c-3fbc1d9f1a22",
    milestone_id: "f02e3c8f-1237-4b6b-bc2e-1d923c5c3f92",
    name: "Final Approval",
    description: {
      details: "Obtain management approval for product launch.",
      proposal: "This must be a attached file",
    },
    deadline: "2025-10-01",
    type: "INTERNAL",
    status: "APPROVED",
    assigned_to: "c72d9b41-1a2e-4d33-88cd-9f3b2b8a1902",
    created_at: "2025-09-20T10:00:00Z",
    updated_at: "2025-09-25T15:30:00Z",
    deleted_at: null,
  },
];
