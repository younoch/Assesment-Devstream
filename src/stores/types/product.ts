// stores/types/product.ts
export interface Product {
  id?: number;
  product_name: string;
  product_description: string;
  product_price: number;
  product_quantity: number;
  product_category: string;
  product_brand: string;
  rating: number;
  in_stock: boolean;
  sku: string;
  discount_percentage: number;
  is_featured: boolean;
  shipping_weight: number;
  slug: string;
  created_at?: string;
  updated_at?: string;
}
export interface Pagination {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
}

export interface ProductFilters {
  search?: string;
  page?: number;
  per_page?: number;
}
