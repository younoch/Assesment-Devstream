import { Product } from "@/stores/types";

// types/api.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
  };
}

export interface ProductsResponse {
  products: Product[];
}