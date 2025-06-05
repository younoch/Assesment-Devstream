<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between my-6">
      <h2 class=" text-2xl font-semibold text-gray-700 dark:text-gray-200">
      Product List
    </h2>
    <div>
      <button 
        @click="logOut"
        class="px-2 py-1 md:px-3 md:py-2 bg-purple-500 text-xs md:text-sm text-white rounded hover:bg-purple-600 transition-colors"
      >
        Log Out
      </button>
    </div>
    </div>
    
    
    <div class="flex justify-between items-center mb-4 gap-x-2 md:gap-x-4">
      <SearchInput
        :key="searchInputKey"
        v-model="searchQuery"
        @update:modelValue="handleSearch"
      />
      <button 
        @click="resetFilters"
        class=" text-xs md:text-sm px-2 py-1 md:px-3 md:py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
      >
      Reset Filters
      </button>
      <button 
        @click="openCreateModal"
        class=" text-xs md:text-sm px-2 py-1 md:px-3 md:py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
      >
        Add Product
      </button>
    </div>
    
    <div class="bg-white rounded-lg shadow overflow-hidden mb-4">
      <Table 
        :products="products" 
        :pagination="pagination"
        @edit="openEditModal"
        @delete="openDeleteModal"
        @page-change="goToPage"
      />
    </div>
    
    <Pagination 
      :pagination="pagination"
      @page-change="goToPage"
      @per-page-change="onPerPageChange"
    />

    <ProductFormModal
      :isOpen="isFormModalOpen"
      :product="selectedItem"
      :isEditMode="isEditMode"
      @close="closeFormModal"
      @submit="handleFormSubmit"
    />

    <DeleteModal
      :isOpen="isDeleteModalOpen"
      :product="selectedItem"
      @close="closeDeleteModal"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product';
import { useAuthStore } from '@/stores/auth';
import type { Product } from '@/stores/types';

// Components
import Table from '@/components/common/Table.vue';
import Pagination from '@/components/common/Pagination.vue';
import DeleteModal from '@/components/common/DeleteModal.vue';
import SearchInput from '@/components/common/SearchInput.vue';
import ProductFormModal from '@/components/product/ProductFormModal.vue';

// Store initialization
const productStore = useProductStore();
const authStore = useAuthStore();
const router = useRouter();
productStore.loadProducts();

// Reactive state from store
const { 
  visibleProducts: products,
  loading: isLoading,
  error,
  searchQuery,
  filters,
  pagination
} = storeToRefs(productStore);

// UI state
const modalState = ref({
  delete: false,
  form: false,
  isEditMode: false
});

const selectedItem = ref<Partial<Product>>(createEmptyProduct());
const searchInputKey = ref(0);

// Computed
const pageSize = computed({
  get: () => filters.value.per_page,
  set: (value: number) => {
    filters.value.per_page = value;
    productStore.loadProducts();
  }
});

// Helper functions
function createEmptyProduct(): Partial<Product> {
  return { 
    product_name: '',
    product_description: '',
    product_price: 0,
  };
}

// Modal handlers
const openDeleteModal = (product: Product) => {
  selectedItem.value = product;
  modalState.value.delete = true;
};

const closeDeleteModal = () => {
  modalState.value.delete = false;
};

const openCreateModal = () => {
  modalState.value.isEditMode = false;
  selectedItem.value = createEmptyProduct();
  modalState.value.form = true;
};

const openEditModal = (product: Product) => {
  modalState.value.isEditMode = true;
  selectedItem.value = { ...product };
  modalState.value.form = true;
};

const closeFormModal = () => {
  modalState.value.form = false;
};

// Action handlers
const handleDeleteConfirm = async (product: Product) => {
  try {
    await productStore.deleteProduct(product.slug);
    await productStore.loadProducts();
    closeDeleteModal();
  } catch (err) {
    console.error('Delete failed:', err);
  }
};

const handleFormSubmit = async (productData: Product) => {
  try {
    if (modalState.value.isEditMode) {
      await productStore.updateProduct(selectedItem.value.slug!, productData);
    } else {
      await productStore.createProduct(productData);
    }
    // await productStore.loadProducts();
    closeFormModal();
  } catch (err) {
    console.error('Operation failed:', err);
  }
};

const handleSearch = (value: string) => {
  searchQuery.value = value;
};

const goToPage = (page: number) => {
  productStore.changePage(page); 
};

const onPerPageChange = (perPage: number) => {
  filters.value.per_page = perPage;
  productStore.changePage(1);
};
const resetFilters = () => {
  productStore.resetFilters();
  searchInputKey.value++; 
};

const logOut = async () => {
  authStore.clearAuth()
  await router.push('/login');
}

const isDeleteModalOpen = computed(() => modalState.value.delete);
const isFormModalOpen = computed(() => modalState.value.form);
const isEditMode = computed(() => modalState.value.isEditMode);
</script>