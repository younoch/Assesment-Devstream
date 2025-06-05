// src/stores/product.ts
import { defineStore } from 'pinia';
import { ref, computed, type Ref } from 'vue';
import apiClient from '../../api/client';
import { Pagination, Product, ProductFilters } from './types';
import { generateRandomSKU } from '@/utils/skuGenerator';

export const useProductStore = defineStore('product', () => {
  // State
  const products: Ref<Product[]> = ref([]);
  const selectedProduct: Ref<Product | null> = ref(null);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);
  const pagination: Ref<Pagination> = ref({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: 10
  });
  const filters: Ref<ProductFilters> = ref({
    search: '',
    page: 1,
    per_page: 10
  });

  // Getters
  const visibleProducts = computed(() => products.value);

  const searchQuery = computed({
    get: () => filters.value.search || '',
    set: (value: string) => {
      filters.value.search = value;
      filters.value.page = 1;
      debouncedLoadProducts();
    }
  });

  const pageSize = computed({
    get: () => filters.value.per_page || 10,
    set: (value: number) => {
      filters.value.per_page = value;
      loadProducts();
    }
  });

  let debounceTimeout: number;
  const debouncedLoadProducts = () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => loadProducts(), 300);
  };

  // Actions
  const loadProducts = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    
    try {
      const params = {
        page: filters.value.page,
        page_size: filters.value.per_page,
        search: filters.value.search,
      };

      const response = await apiClient.get<{
        data: {
          active_page: number;
          page_size: number;
          total_pages: number;
          total_items: number;
          results: Product[] 
}
        meta: { pagination: Pagination };
      }>('/product/', { params });
      console.log(response.data);
      
      products.value = response.data.data.results;
      pagination.value.current_page = response.data.data.active_page
      pagination.value.per_page = response.data.data.page_size
      pagination.value.total_pages = response.data.data.total_pages
      pagination.value.total_items = response.data.data.total_items

    } catch (err) {
      error.value = handleApiError(err);
      console.error('Failed to load products:', error.value);
    } finally {
      loading.value = false;
    }
  };

  const loadProductBySlug = async (slug: string): Promise<void> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiClient.get<{ data: Product }>(`/product/${slug}/`);
      selectedProduct.value = response.data.data;
    } catch (err) {
      error.value = handleApiError(err);
      console.error(`Failed to load product ${slug}:`, error.value);
    } finally {
      loading.value = false;
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'slug'> & { sku?: string }): Promise<Product> => {
    loading.value = true;
    error.value = null;

    const dataToSend = {
      ...productData,
      sku: productData.sku || generateRandomSKU(),
    };
    
    try {
      const response = await apiClient.post<{ data: Product }>('/product/', dataToSend);
      await loadProducts();
      return response.data.data;
    } catch (err) {
      error.value = handleApiError(err);
      console.error('Failed to create product:', error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateProduct = async (slug: string, productData: Omit<Partial<Product>, 'created_at' | 'sku'>): Promise<Product> => {
    loading.value = true;
    error.value = null;

    const dataToSend = productData.updated_at 
    ? productData 
    : { ...productData, updated_at: new Date().toISOString() };
    
    try {
      const response = await apiClient.patch<{ data: Product }>(`/product/${slug}/`, dataToSend);
      
      const index = products.value.findIndex(p => p.slug === slug);
      if (index !== -1) {
        products.value[index] = response.data.data;
      }
      
      if (selectedProduct.value?.slug === slug) {
        selectedProduct.value = response.data.data;
      }
      
      return response.data.data;
    } catch (err) {
      error.value = handleApiError(err);
      console.error(`Failed to update product ${slug}:`, error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteProduct = async (slug: string): Promise<void> => {
    loading.value = true;
    error.value = null;
    
    try {
      await apiClient.delete(`/product/${slug}/`);
      
      products.value = products.value.filter(p => p.slug !== slug);
      
      if (selectedProduct.value?.slug === slug) {
        selectedProduct.value = null;
      }
    } catch (err) {
      error.value = handleApiError(err);
      console.error(`Failed to delete product ${slug}:`, error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const changePage = (page: number): void => {
    filters.value.page = page;
    loadProducts();
  };

  const resetFilters = (): void => {
    filters.value = {
      search: '',
      page: 1,
      per_page: 10
    };
    loadProducts();
  };

  const handleApiError = (error: unknown): string => {
    if (typeof error === 'object' && error !== null) {
      const err = error as { response?: { data?: { detail?: string; errors?: Record<string, string[]> } } };
      if (err.response?.data?.detail) return err.response.data.detail;
      if (err.response?.data?.errors) {
        return Object.entries(err.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join(' | ');
      }
    }
    return 'An unknown error occurred';
  };

  return {
    // State
    products,
    selectedProduct,
    loading,
    error,
    pagination,
    filters,
    
    // Getters
    visibleProducts,
    searchQuery,
    pageSize,
    
    // Actions
    loadProducts,
    loadProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    changePage,
    resetFilters
  };
});