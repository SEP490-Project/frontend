interface Tag {
  id: string;
  name: string;
  description: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export const mockTags: Tag[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Best Seller",
    description: "Products that are best selling items",
    usage_count: 145,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-09-20T14:25:00Z",
    deleted_at: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "New Arrival",
    description: "Recently added products to our catalog",
    usage_count: 89,
    created_at: "2024-02-10T09:15:00Z",
    updated_at: "2024-09-18T11:45:00Z",
    deleted_at: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Limited Edition",
    description: "Exclusive products with limited availability",
    usage_count: 34,
    created_at: "2024-03-05T16:20:00Z",
    updated_at: "2024-09-15T08:30:00Z",
    deleted_at: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Organic",
    description: "Products made with organic ingredients",
    usage_count: 67,
    created_at: "2024-01-20T12:00:00Z",
    updated_at: "2024-08-30T15:10:00Z",
    deleted_at: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Cruelty Free",
    description: "Products not tested on animals",
    usage_count: 123,
    created_at: "2024-01-25T14:45:00Z",
    updated_at: "2024-09-22T10:20:00Z",
    deleted_at: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "Seasonal",
    description: "Products for specific seasons",
    usage_count: 45,
    created_at: "2024-04-12T11:30:00Z",
    updated_at: "2024-09-10T13:15:00Z",
    deleted_at: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    name: "Anti-Aging",
    description: "Products focused on anti-aging benefits",
    usage_count: 78,
    created_at: "2024-02-28T08:45:00Z",
    updated_at: "2024-09-05T16:40:00Z",
    deleted_at: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    name: "Sensitive Skin",
    description: "Products suitable for sensitive skin types",
    usage_count: 92,
    created_at: "2024-03-15T13:20:00Z",
    updated_at: "2024-09-25T09:55:00Z",
    deleted_at: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    name: "Vegan",
    description: "Products that contain no animal-derived ingredients",
    usage_count: 156,
    created_at: "2024-01-30T15:10:00Z",
    updated_at: "2024-09-28T12:30:00Z",
    deleted_at: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    name: "Moisturizing",
    description: "Products that provide deep hydration to the skin",
    usage_count: 203,
    created_at: "2024-02-15T10:25:00Z",
    updated_at: "2024-09-30T14:15:00Z",
    deleted_at: null,
  },
];
