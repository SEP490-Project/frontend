interface Product {
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
    name: "Chanel Coco Mademoiselle Intense Eau De Perfume For Women klkasdjlaksdjlkasjdlskaj",
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
