export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parent_category?: ParentCategory;
}

interface ParentCategory {
  id: string;
  name: string;
  description?: string;
}
